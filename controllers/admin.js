const User = require("../models/User");
const asyncErrorWrapper = require("express-async-handler");

//admin tarafindan bir kullanıcının silinmesi
const deleteUser = asyncErrorWrapper(async (req, res, next) => {
    const { id } = req.params;
    const user = await User.findById(id);

    await user.remove();

    return res.status(200)
        .json({
            success: true,
            message: "Kullanici silme islemi basarili sekilde gerçekleşti"
        });
});

module.exports = { deleteUser };