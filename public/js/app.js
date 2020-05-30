console.log("APP JS file")

//Handle the scrape button
$("#scrape-articles").on("click",() =>{
    $.ajax({
        method: "GET",
        url: "/scrape"
      })
      .then(function (data) {
        console.log(data);
        location.href = ('/');
      })
})

//Handle de Clear button
$("#clearAll-articles").on("click",() =>{
  $.ajax({
      method: "GET",
      url: "/clearAll"
    })
    .then(function (data) {
      console.log(data);
      location.reload()
    })
})

$("body").on("click","#close-modal",() => {
  $("#modal-note").hide();
  location.reload()
})


$("body").on("click", "#save-article", function (event) {
    var dataID= $(this).attr("data-id")
    $.ajax({
        method: "GET",
        url: "/saved/" + dataID
      })
      .then(function (data) {
        console.log(data);
        location.href = ("/");
      })
})

$("body").on("click", "#return-article", function (event) {
  var dataID= $(this).attr("data-id")
  $.ajax({
      method: "GET",
      url: "/returnArticle/" + dataID
    })
    .then(function (data) {
      console.log(data);
      location.href = ("/saved");
    })
})


$("body").on("click", "#make-note", function() {
  
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function (data) {

      //Saved Note Button
      var saveBtn=$("<button>");
      saveBtn.attr("data-id",thisId)
      saveBtn.addClass("btn")
      saveBtn.addClass("btn-secondary")
      saveBtn.attr("id","save-note")
      saveBtn.text("Save Note")

      $(".modal-footer").append(saveBtn);
      $("#modal-note").show();
      console.log(data);
          
      if (data.notes) {
        for(var i=0 ; i< data.notes.length; i++){
          var div=$("<div>")
          var p=$("<p>");
          var deletBtn=$("<a>")
         
          deletBtn.addClass("btn");
          deletBtn.addClass("btn-primary")
          deletBtn.attr("id","deleteNote")
          deletBtn.attr("href","/deletenote/" + data.notes[i]._id);
          deletBtn.text("Delete");

          p.text(data.notes[i].body )

          div.append(p);
          div.append(deletBtn)
          $("#Addnote").append(div);
          
        }
              
      }
    }).catch(function (err) {
      console.log( err);
    });

});




$("body").on("click", "#save-note", function(event) {
    
var thisId = $(this).attr("data-id");

  if($("#note").val().trim().length < 1){
   alert("Must enter a note")
  }
  else{
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
       
        body:$("#note").val().trim()
      }
  
    })
    .then(function (data) {
       
        console.log(data);
        $("#note").val("");
        location.reload()
    })
      .catch(function (err) {
        console.log( err);
    });
    $("#modal-note").hide();
  }
 
  $("#modal-note").show();
    event.preventDefault();
    
});