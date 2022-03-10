const express = require("express");
const {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
} = require("../controllers/auth");
const { getAccessToRoute } = require("../middlewares/authorization/auth");

//api/auth
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", getAccessToRoute, logout);
router.post("/forgotpassword", forgotPassword);
router.post("/resetpassword", resetPassword);

module.exports = router;
