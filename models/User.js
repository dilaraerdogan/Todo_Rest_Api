const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const ToDo = require("./ToDo");
const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, "Lütfen bir ad girin"],
  },
  email: {
    type: String,
    required: [true, "Lütfen bir e-posta hesabı girin"], //zorunlu alan
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Lütfen geçerli bir e-posta girin",
    ], //match-> eşleme işlemi
    //email validation
  },
  role: {
    type: String,
    default: "user",
    enum: ["user", "admin"],
  },
  password: {
    type: String,
    minlength: [6, "Lütfen minimum uzunluğu 6 olan bir şifre girin"],
    required: [true, "Lütfen bir şifre girin"],
    select: false, //Güvenlik açısından parolaları gizlemek
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpire: {
    type: Date,
  },
});
//UserSchema Methods
UserSchema.methods.generateJwtFromUser = function () {
  const { JWT_SECRET_KEY, JWT_EXPIRE } = process.env;
  const payload = {
    id: this.id,
    name: this.name,
  };
  const token = jwt.sign(payload, JWT_SECRET_KEY, {
    expiresIn: JWT_EXPIRE,
  });
  return token;
};
UserSchema.methods.getResetPasswordTokenFromUser = function () {
  //random bir hexadecimal string olusturma işlemi
  const randomHexString = crypto.randomBytes(15).toString("hex");
  const { RESET_PASSWORD_EXPIRE } = process.env;
  const resetPasswordToken = crypto
    .createHash("SHA256")
    .update(randomHexString)
    .digest("hex");
  this.resetPasswordToken = resetPasswordToken;
  this.resetPasswordExpire = Date.now() + parseInt(RESET_PASSWORD_EXPIRE);

  return resetPasswordToken;
};

//pre-> önce
UserSchema.pre("save", function (next) {
  //Parola değişmemiş olma durumu
  if (!this.isModified("password")) {
    next();
  }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) next(err);
    bcrypt.hash(this.password, salt, (err, hash) => {
      //passwordun hashlenme işlemi
      if (err) next(err);
      this.password = hash;
      next();
    });
  });
});

UserSchema.post("remove", async function () {
  await ToDo.deleteMany({
    user: this._id,
  });
});

module.exports = mongoose.model("User", UserSchema);
//USER'I HEM MONGOOSA KAYDETTİK HEMDE KULLANMAK İÇİN DIŞARI AKTARDIK
