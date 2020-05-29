var express = require("express");
var exphbs = require("express-handlebars");
var logger=require("morgan");
var axios=require("axios");
var cheerio= require("cheerio")
var mongoose= require("mongoose");

var db = require("./models");

var app = express();
var PORT = process.env.PORT || 3000;

// Use morgan logger for logging requests
app.use(logger("dev"));

// Connect to the Mongo DB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongo-news";

mongoose.connect(MONGODB_URI);
// Middleware

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Public
app.use(express.static("public"));

// Handlebars
app.engine("handlebars",exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");

// Routes
app.use(require("./controller/controller"));

// Starting the server, syncing our models ------------------------------------/
app.listen(PORT,() => {
    console.log("Port on" + PORT)
})
    
module.exports = app;