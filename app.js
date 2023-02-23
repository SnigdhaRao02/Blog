//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");  //lodash->js library
const mongoose = require('mongoose'); //1.require mongoose
require('dotenv').config();


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

let postArray = [];

//2. connect, schema, model, doc
mongoose.connect(process.env.MONGO_URI,{useNewUrlParser: true});
const blogSchema = new mongoose.Schema({
  title: String,
  content: String,
  shortContent: String
});
const Post = mongoose.model('Post',blogSchema);


//4. render home page with posts
app.get("/", function(req, res){

  Post.find(function(err,post){
    res.render("home", {
      posts : post
    } );
  })
  
})



app.get("/compose", function(req, res){
  res.render("compose");
})

//routing parameters
//5. handle read more
app.get("/posts/:postId", function(req, res){
  var postId = req.params.postId;
  // console.log(postName);
  
  Post.findOne({_id:postId}, function(err, post){
    res.render('post',{title: post.title, body: post.content});
  })

})

//3. store composed posts to DB
app.post("/compose", function(req, res){
  var postTitle = req.body.postTitle;
  var postBody = req.body.postBody;
  var postTruncatedBody = _.truncate(postBody,{'length':100});

  // const post = {
  //   title : req.body.postTitle,
  //   body : req.body.postBody,
  //   truncatedBody : _.truncate(req.body.postBody, {'length':100})
  // };
  // postArray.push(post);

  const newPost = new Post({
    title: postTitle,
    content: postBody,
    shortContent: postTruncatedBody
  });
  newPost.save(function(err){
    if(!err){
      res.redirect("/");

    }
  });
  
})





app.listen(3000, function() {
  console.log("Server started on port 3000");
});
