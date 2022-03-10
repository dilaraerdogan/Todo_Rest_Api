const User = require("../../models/User");
const ToDo = require("../../models/ToDo");
const CustomError = require("../../helpers/error/CustomError");
const asyncErrorWrapper = require("express-async-handler");

const checkUserExist = asyncErrorWrapper(async (req, res, next) => {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
        return next(new CustomError("Bu kimliğe sahip böyle bir kullanıcı yok", 400));

    }
    //hata yoksa next ile diğer controller'a geçmesini sağlar
    next();

});

const checkToDoExist = asyncErrorWrapper(async (req, res, next) => {
    // todo id
    const { id } = req.params;
    // user id
    const userId = req.user.id
    const toDo = await ToDo.find({
        $and: [
            { user: userId }, { _id: id }
        ]
    })
    if (toDo.length == 0) {
        return next(new CustomError("Kimlik dogrulama hatasi veya bu id degerine esit todo bulunamadi", 400));
    }
    req.toDo = toDo[0]
    next()
})
module.exports = {
    checkUserExist,
    checkToDoExist
}

