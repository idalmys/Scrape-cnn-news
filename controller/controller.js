var router = require("express").Router();

var axios=require("axios");
var cheerio= require("cheerio")

var db = require("../models");


//Find Articles into the DB and send it to articles page

router.get("/",async(req,res)=>{
    const articles= await db.Article.find({saved : false},(err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log(" Articles found");
      }
    }).lean();
        
    res.render("articles", {articles: articles})
    })


// Delete all articles

router.get("/clearAll", function(req, res) {
    db.Article.deleteMany({}, function(err, doc) {
        if (err) {
          console.log(err);
        } else {
          console.log("Articles Removed");
        }
    });
      res.redirect("/");     
});   


//Scrape articles and save it into the Mongo DB

router.get("/scrape", function(req, res) {
   
    axios.get("https://www.cnn.com/articles").then(function(response) {
  
      var $ = cheerio.load(response.data);
  
      $(".cd__headline",".cd__content").each(function(i, element) {
        var result = {};
        result.link = $(element).children("a").attr("href");
        result.title =$(element).children("a").text().trim();
  
        // Create a new Article using the `result` object built from scraping
        db.Article.create(result)
          .then(function(dbArticle) {
            // View the added result in the console
            console.log(dbArticle);
          })
          .catch(function(err) {
            // If an error occurred, log it
            console.log(err);
          });
      });
  
      // Send a message to the client
      res.send("Scrape Complete");
    });
    
});

//Get all Articles with saved status true and render note page

router.get("/saved",async(req,res)=>{
    const articles= await db.Article.find({saved : true}, err =>  {
      if (err) {
        console.log(err);
      } else {
        console.log(" Articles Saved");
      }}).lean();
    console.log(articles);
    
    res.render("note", {articles: articles})
});


// Find an Article and set saved status true
router.get("/saved/:id", async(req,res) => {   
    await db.Article.findByIdAndUpdate({_id: req.params.id},{saved:true})
    .then(result => {
       
        res.json(result);
        
    })
    .catch(err=> {
    res.json(err);
        
    });
    location.reload();
})

// Return to false saved status
router.get("/returnArticle/:id", async(req,res) => {
 
  await db.Article.findByIdAndUpdate({_id: req.params.id},{saved: false})
  .then(result => {
      
      res.json(result);
      
  })
  .catch(err=> {
      res.json(err);
      
  });
  
});


//Delete an article

router.get("/delete/:id", async(req,res)=>{
  const {id }= req.params;
  await db.Article.remove({_id : id});
  res.redirect("/saved")
})

//Delete a note
router.get("/deletenote/:id", async(req,res)=>{
  const {id }= req.params;
  await db.Note.deleteOne({_id : id});
  //res.redirect("/saved")
})

// Get an article with his note

router.get("/articles/:id", async(req, res) => {
 
  await db.Article.findById({ _id: req.params.id })
   
    .populate("notes")
    .then(function(dbArticle) {
     
      console.log(dbArticle)
      res.json(dbArticle);
  })
    .catch(function(err) {
     
      res.json(err);
    });
});

// Route for saving/updating an Article's associated Note
router.post("/articles/:id", function(req, res) {
  
    db.Note.create(req.body)
    .then(function(dbNote) {
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Article.findOneAndUpdate({ _id: req.params.id }, {  $push: { notes: dbNote._id } }, { new: true });
    })
    .then(function(dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
  // Create a new note and pass the req.body to the entry
  
});









module.exports=router;


