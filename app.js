const express = require("express");
//ortam değişkenlerine erişmek için kurulan modül
const dotenv = require("dotenv");
const connectDatabase = require("./helpers/database/connectDatabase");
const routers = require("./routers/index");
const customErrorHandler = require("./middlewares/customErrorHandler");
const cors = require("cors");
//Environment Variables
dotenv.config({
  path: "./config/env/config.env",
});

//MongoDb Connection
connectDatabase();

const app = express();

//Express - Body Middleware
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT;

//Routers middleware
app.use(cors());

app.use("/api", routers);

//Error Types
app.use(customErrorHandler);

app.listen(PORT, () => {
  console.log(`App Started on ${PORT} : ${process.env.NODE_ENV}`);
});
