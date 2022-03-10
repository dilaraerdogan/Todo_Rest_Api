const mongoose = require("mongoose");

const connectDatabase = () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("\nMongoDb Connection Succesfull");
    })
    .catch((err) => {
      console.error(err);
      console.log("HATA");
    });
};

module.exports = connectDatabase;
