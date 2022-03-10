const express = require("express");
const todo = require("./todo");
const auth = require("./auth");
const admin = require("./admin");
//api
const router = express.Router();

router.use("/todos", todo);
router.use("/auth", auth);
router.use("/admin", admin);

module.exports = router;
