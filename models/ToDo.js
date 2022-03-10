const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ToDoSchema = new Schema({
  title: {
    type: String,
    required: [true, "Lütfen bir başlık girin"],
  },
  content: {
    type: String,
    required: [true, "Lütfen bu alani doldurunuz"],
    maxlength: [
      30,
      "Lütfen maksimum 30 karakter uzunluğunda bir başlık sağlayın",
    ],
  },
  category: {
    type: String,
    required: [true, "Lütfen bir kategori belirtin"],
    enum: ["Spor", "Shop", "Work", "Family", "Other"],
  },
  status: {
    type: String,
    enum: ["To Do", "Done", "In Progress"],
    default: "To Do",
  },
  date: {
    type: String,
  },
  time: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },

  user: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: "User",
  },
});

ToDoSchema.pre("save", function (next) {
  //toDo düzenlemede felanda save etmeden önce bu bölüm çalışacagından
  //düzenlemeler yapılırken eger title degismezse slug da degismez bunun degismedigi durumu yazıyoruz
  if (!this.isModified("title")) {
    next();
  }
  // this.slug = this.makeSlug();
  next();
});

module.exports = mongoose.model("ToDo", ToDoSchema);
