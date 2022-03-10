const express = require("express");
const {
  addNewToDo,
  getAllToDos,
  getSingleToDo,
  editToDo,
  deleteToDo,
  statusActiveToDo,
  statusCompletedToDo,
  getTodayTodos,
} = require("../controllers/todo");
const {
  checkToDoExist,
} = require("../middlewares/databases/databaseErrorHelpers");
const { getAccessToRoute } = require("../middlewares/authorization/auth");

//api/todo
const router = express.Router();

router.get("/", getAccessToRoute, getAllToDos);

router.post("/todoAdd", getAccessToRoute, addNewToDo);

//status durumları
router.get("/active", getAccessToRoute, statusActiveToDo);

router.get("/completed", getAccessToRoute, statusCompletedToDo);

router.get("/today", getAccessToRoute, getTodayTodos);

router.get("/:id", getAccessToRoute, checkToDoExist, getSingleToDo);

router.put("/:id/edit", getAccessToRoute, checkToDoExist, editToDo);

router.delete("/:id/delete", getAccessToRoute, deleteToDo);

module.exports = router;
