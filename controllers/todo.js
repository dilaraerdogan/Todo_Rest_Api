const ToDo = require("../models/ToDo");
const CustomError = require("../helpers/error/CustomError");
const asyncErrorWrapper = require("express-async-handler");
const mongoose = require("mongoose");
const { status } = require("express/lib/response");

const addNewToDo = asyncErrorWrapper(async (req, res, next) => {
  const information = req.body;
  const todo = await ToDo.create({
    ...information,
    user: req.user.id,
  });

  res.status(200).json({
    success: true,
    data: todo,
  });
});

//Active Status ToDo Tab
const statusActiveToDo = asyncErrorWrapper(async (req, res, next) => {
  const toDos = await ToDo.find({
    $or: [{ status: "To Do" }, { status: "In Progress" }],
    $and: [{ user: req.user.id }],
  });

  return res.status(200).json({
    success: true,
    data: toDos,
  });
});

//Completed Status ToDos Tab
const statusCompletedToDo = asyncErrorWrapper(async (req, res, next) => {
  const toDos = await ToDo.find({
    $and: [{ user: req.user.id }, { status: "Done" }],
  });

  return res.status(200).json({
    success: true,
    data: toDos,
  });
});

//Today ToDos Tab
const getTodayTodos = asyncErrorWrapper(async (req, res, next) => {
  var currentDate = new Date();
  const year = currentDate.getFullYear();
  let month = currentDate.getMonth() + 1; // Months start at 0!
  let day = currentDate.getDate();
  if (day < 10) day = "0" + day;
  if (month < 10) month = "0" + month;

  const today = day + "." + month + "." + year;

  const toDos = await ToDo.find({
    $and: [{ user: req.user.id }, { date: today }],
  });

  return res.status(200).json({
    success: true,
    data: toDos,
  });
});

//All ToDos
const getAllToDos = asyncErrorWrapper(async (req, res, next) => {
  const toDos = await ToDo.find({ user: req.user.id });

  return res.status(200).json({
    success: true,
    data: toDos,
  });
});

//Get Single ToDo
const getSingleToDo = asyncErrorWrapper(async (req, res, next) => {
  const toDos = req.toDo;

  return res.status(200).json({
    success: true,
    data: toDos,
  });
});

//Edit ToDo
const editToDo = asyncErrorWrapper(async (req, res, next) => {
  const { id } = req.params;
  const { title, content, category, date, time, status } = req.body;

  const updateTodo = {
    title: title,
    content: content,
    category: category,
    date: date,
    time: time,
    status: status,
  };
  const newToDo = await ToDo.findByIdAndUpdate(id, updateTodo, {
    new: true,
    runValidators: true,
  });

  return res.status(200).json({
    success: true,
    data: newToDo,
  });
});

//Delete ToDo
const deleteToDo = asyncErrorWrapper(async (req, res, next) => {
  const { id } = req.params;

  await ToDo.findByIdAndDelete(id);

  return res.status(200).json({
    success: true,
    message: "Silme islemi basarili",
  });
});

module.exports = {
  addNewToDo,
  getAllToDos,
  getSingleToDo,
  editToDo,
  deleteToDo,
  statusActiveToDo,
  statusCompletedToDo,
  getTodayTodos,
};
