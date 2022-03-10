const express = require("express");
const {
  getAccessToRoute,
  getAdminAccess,
} = require("../middlewares/authorization/auth");
const {
  checkUserExist,
} = require("../middlewares/databases/databaseErrorHelpers");
const { getSingleUser, getAllUsers } = require("../controllers/user");
const { deleteUser } = require("../controllers/admin");
const router = express.Router();
router.use(getAccessToRoute, getAdminAccess);

router.get("/users", getAllUsers);

router.get("/user/:id", checkUserExist, getSingleUser);

router.delete("/user/:id", checkUserExist, deleteUser);

module.exports = router;
