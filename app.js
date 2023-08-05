//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const { stringify } = require("nodemon/lib/utils");

const app = express();

app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/wikiDB", { useNewUrlParser: true });

const articleSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Article = mongoose.model("Article", articleSchema);

app
  .route("/articles")
  .get((req, res) => {
    Article.find()
      .then(function (foundArticles) {
        res.send(foundArticles);
      })
      .catch(function (err) {
        res.send(err);
      });
  })
  .post(function (req, res) {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });
    newArticle.save().then(function (err) {
      if (!err) {
        console.log("Successfully added Article");
      } else {
        console.log(err);
      }
    });
  })
  .delete(function (req, res) {
    Article.deleteMany().then(function (err) {
      if (!err) {
        res.send("Successfully Deleted All Articles");
      } else {
        res.send(err);
      }
    });
  });

app
  .route("/articles/:articleTitle")
  .get((req, res) => {
    Article.findOne({ title: req.params.articleTitle })
      .then(function (foundArticle) {
        res.send(foundArticle);
      })
      .catch(function (err) {
        res.send(err);
      });
  })
  .put(function(req, res) {
    Article.replaceOne({ title: req.params.articleTitle}, {
      title: req.body.title,
      content: req.body.content,
    }, {overwrite: true}).then(function(err){
      if (!err) {
        console.log("Successfully Updated");
      } else {
        console.log(err);
      }
    });
  })
.patch(function(req, res){
  Article.updateOne(
    {title: req.params.articleTitle},
    {$set: req.body}).then(function(err){
      if (!err) {
        console.log("Successfully Updated");
      } else {
        console.log(err);
      }
    });
  })
  .delete(function (req, res) {
    Article.deleteOne({ title: req.params.articleTitle}, {
      title: req.body.title,
      content: req.body.content,
    }).then(function (err) {
      if (!err) {
        res.send("Successfully Deleted All Articles");
      } else {
        res.send(err);
      }
    });
  });


//TODO

app.listen(process.env.PORT || 3000, function () {
  console.log("Server Has Started Successfully");
});
