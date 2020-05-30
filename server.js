var express = require("express");
var exphbs = require("express-handlebars");
var logger=require("morgan");
var mongoose= require("mongoose");


var Article=require("./models/Article")
var Note=require("./models/Note")

//run express
const app = express();
var PORT = process.env.PORT || 8080;

// Use morgan logger for logging requests
app.use(logger("dev"));

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Public
app.use(express.static("public"));



// Handlebars
app.engine(
    "handlebars",
    exphbs({
      defaultLayout: "main"
    })
  );
  app.set("view engine", "handlebars");

// Routes
app.use(require("./controllers/controller"));



// Connect to the Mongo DB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongo-news";
mongoose.connect(MONGODB_URI);


// Starting the server, syncing our models ------------------------------------/
app.listen(PORT,()=>{
    console.log("Server started on "+ PORT);
})
    
module.exports = app;