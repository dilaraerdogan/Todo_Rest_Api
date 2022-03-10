const CustomError = require("../../helpers/error/CustomError");
const asyncErrorWrapper = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const {
  isTokenIncluded,
  getAccessTokenFromHeader,
} = require("../../helpers/authorization/tokenHelpers");
const ToDo = require("../../models/ToDo");
//Belli route'ları kısıtlamak için login işleminin gerçekleşme durumunu kontrol eden yapı
const getAccessToRoute = (req, res, next) => {
  //JWT_SECRET_KEY-> access tokenı encode haline çevirip user profilini bulma işlemini gerçekleştiren yapı
  const { JWT_SECRET_KEY } = process.env;

  //Token gelmemişse durumu || token doğru olmama durumu
  if (!isTokenIncluded(req)) {
    return next(new CustomError("Bu rotaya erişim yetkiniz yok", 401));
  }
  //Access_token'ı ayırarak alma işlemi
  const accessToken = getAccessTokenFromHeader(req);

  jwt.verify(accessToken, JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      //Token süresinin geçmiş olma durumu
      console.log(err.name);
      return next(new CustomError("Bu rotaya erişim yetkiniz yok", 401));
    }
    req.user = {
      id: decoded.id,
      name: decoded.name,
    };

    //aldıgımız decodudun ıcerıgı
    // {
    //     id: '6214387b4333be147668c95a',
    //     name: 'DilosLArda',
    //     iat: 1645492347,
    //     exp: 1645492367
    //   }
    next();
  }); //verify dogrulama yapmak için
};

//admin Rol bulma
const getAdminAccess = asyncErrorWrapper(async (req, res, next) => {
  const { id } = req.user;

  const user = await User.findById(id);

  if (user.role !== "admin") {
    return next(
      new CustomError("Bu rotaya yalnızca yöneticiler erişebilir", 403)
    );
  }
  next();
});

//toDo sahibi erişimi
const getToDoOwnerAccess = asyncErrorWrapper(async (req, res, next) => {
  const userId = req.user.id;
  const toDoId = req.params.id;

  const toDo = await ToDo.findById(toDoId);

  if (toDo.user != userId) {
    return next(
      new CustomError("Bu işlemi yalnızca sahibi gerçekleştirebilir", 403)
    );
  }
  next();
});

module.exports = {
  getAccessToRoute,
  getAdminAccess,
  getToDoOwnerAccess,
};
