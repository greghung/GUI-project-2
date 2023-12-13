/*
 * Project 2
 * app JavaScript code
 *
 * Author: Craig Huang
 * Version: 2.0
 */

// Import modules
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

// Import routes
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

// Create express app
var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Enable cors
const cors = require("cors");
app.use(cors());

app.get(
  "/",
  (req, res) => res.send("<h1>Homework 6: chuang25</h1>") // Home web page
);

// Import schema
const CS3744Schema = require("./model");
const router = express.Router();
app.use("/db", router);

// Get request to database
router.route("/find").get(async (req, res) => {
  const response = await CS3744Schema.find();
  return res.status(200).json(response);
});

// Added support for post requests. A document is found based on its id. The id is the value of _id property of the document.
router.route("/update/:id").post(async (req, res) => {
  const response = await CS3744Schema.findByIdAndUpdate(
    req.params.id,
    req.body
  );
  return res.status(200).json(response);
});

// Added support for creating a new dataset
router.route("/create").post(async (req, res) => {
  try {
    // Create dataset using the schema
    const newDataset = new CS3744Schema(req.body);
    // Save the dataset
    const savedDataset = await newDataset.save();
    // Return the dataset created with its _id
    res.status(201).json(savedDataset);
  } catch (error) {
    // Handle any errors
    res.status(500).json({ error: error.message });
  }
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

// Connect to MongoDB database
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
// Put my own database link here
mongoose.connect(
  "mongodb+srv://student:cs3744@cs3744.jwcoyqc.mongodb.net/CS3744?retryWrites=true&w=majority"
);
// Successful connection confirmation
mongoose.connection.once("open", function () {
  console.log("Connection with MongoDB was successful");
});

module.exports = app;
