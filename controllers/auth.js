const User = require("../models/User");
const CustomError = require("../helpers/error/CustomError");
const asyncErrorWrapper = require("express-async-handler");
const { sendJwtToClient } = require("../helpers/authorization/tokenHelpers");
const {
  validateUserInput,
  comparePassword,
} = require("../helpers/authorization/inputHelpers");
const sendEmail = require("../helpers/libraries/sendEmail");

const register = asyncErrorWrapper(async (req, res, next) => {
  const { name, email, password, role } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    role,
  });
  sendJwtToClient(user, res);
}); // async await

//LOGIN
const login = asyncErrorWrapper(async (req, res, next) => {
  const { email, password } = req.body;
  //validateUserInput->email || password inputlarının girilmiş olması kontrolü
  if (!validateUserInput(email, password)) {
    return next(new CustomError("Lütfen girişlerinizi kontrol edin", 400));
  }
  const user = await User.findOne({ email }).select("+password");

  //comparePassword-> hashlenme işlemi görmüş passwordu tekrar açma işlemi
  if (!comparePassword(password, user.password)) {
    //eğer ikisi birbirine eşit değilse
    return next(
      new CustomError("Lütfen kimlik bilgilerinizi kontrol edin", 400)
    );
  }
  sendJwtToClient(user, res);
});

//LOGOUT
const logout = asyncErrorWrapper(async (req, res, next) => {
  const { NODE_ENV } = process.env;
  return res
    .status(200)
    .cookie({
      httpOnly: true,
      expires: new Date(Date.now()),
      secure: NODE_ENV === "development" ? false : true,
    })
    .json({
      success: true,
      message: "Çıkış Başarılı",
    });
});

//FORGOT PASSWORD
const forgotPassword = asyncErrorWrapper(async (req, res, next) => {
  const resetEmail = req.body.email;

  const user = await User.findOne({ email: resetEmail });
  if (!user) {
    return next(new CustomError("Bu e-postaya sahip bir kullanıcı yok", 400));
  }
  const resetPasswordToken = user.getResetPasswordTokenFromUser();

  await user.save();

  const resetPasswordUrl = `http://localhost:5000/api/auth/resetpassword?resetPasswordToken=${resetPasswordToken}`;

  const resetHtml = `
    <div style="width: 75%;margin-left: auto; margin-right: auto;"> 
      <h1 style="font-weight: bold;color: black;">Reset Password</h1>
      <p style="color:gray;font-size:18px">
      You have requested a password reset for your email account. Please complete the password reset process by entering the new password you have determined in the required field.

      </p>
      <div >
          <form action="${resetPasswordUrl}" method="post">
              <div class="mb-3">
                  <input type="hidden" id="resetPasswordToken" name="resetPasswordToken" value="${resetPasswordToken}">
                  <label for="resetPassword" style="color:rgb(80, 80, 80);font-size:20px" >New Password :</label>
                  <input type="password" placeholder="*****" id="resetPassword" name="resetPassword" style="
                  width: 100%;
                  padding: 12px 20px;
                  margin: 8px 0;
                  box-sizing: border-box;
                  background-color: #F1F7F7;
                  color: black;
                  border: none;
                  border-bottom: 5px solid #006385;">
              </div>
              <button type="submit" style="
              background-color: #84D5D5;
              font-weight: bold;
              border: none;
              color: white;
              padding: 15px 32px;
              text-align: center;
              display: inline-block;
              font-size: 16px;
              margin: 4px 2px;">Reset Password</button>
          </form>
      </div>
      <p style="color:#f44336;font-size:14">
          *** 
          If the password reset request for your account has not been made by you, please do not click on the link. ***
      </p>
      
    </div>
    `;

  try {
    await sendEmail({
      from: process.env.SMTP_USER,
      to: resetEmail,
      subject: "Reset Your Password",
      html: resetHtml,
    });

    return res.status(200).json({
      success: true,
      message: "E-postanıza Gönderilen Token",
    });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return next(new CustomError("E-posta Gönderilemedi", 500));
  }
});

//RESET PASSWORD
const resetPassword = asyncErrorWrapper(async (req, res, next) => {
  const { resetPasswordToken } = req.query;

  const { resetPassword } = req.body;

  if (!resetPasswordToken) {
    return next(new CustomError("Lütfen geçerli bir token sağlayın", 400));
  }
  let user = await User.findOne({
    resetPasswordToken: resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
    //$gt : Date.now => ?(resetPasswordExpire > Date.now()dan)
  });

  //Token bulunamama durumu
  if (!user) {
    return next(
      new CustomError("Geçersiz Token veya Oturum Süresi Doldu", 400)
    );
  }

  user.password = resetPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();
  return res.status(200).send(`
    <div style="width: 75%;margin-left: auto; margin-right: auto;"> 
        <h1 style="font-weight: bold;color: gray;">${user.name}</h1>
        <p style="color:gray;font-size:18px">
            Your account password has been successfully updated.
        </p>
        <a href="http://localhost:3000/">Login Page</a>
    </div>
    `);
});

module.exports = {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
};
