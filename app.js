//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true});
const articleSchema = {
	title: String, 
	content: String
};

//Model
const Article = mongoose.model("Article", articleSchema);

app.route("/articles")
//GET route that fetches all articles
	.get(function(req, res){
		Article.find(function(err, results){
			if (!err){
				res.send(results);
			}
			else{
				res.send(err);
			}
		})
	})
	//POST route to create a new article
	.post(function(req, res){
		const newArticle = new Article ({
			title: req.body.title,
			content: req.body.content
		});
		
		newArticle.save(function(err){
			if (!err){
				res.send("Successfully added a new article.");
			}
			else{
				res.send(err);
			}
		});
	})
	//DELETE all articles
	.delete(function(req, res){
		Article.deleteMany(function(err){
			if(!err){
				res.send("Successfully deleted all articles");
			}
			else{
				res.send(err);
			}
		});
	})
;

app.route("/articles/:articleTitle")
	//get a specific article
	.get(function(req, res){
		Article.findOne({title:
		req.params.articleTitle}, function(err, result){
			if (!err){
				res.send(result);
			}
			else{
				res.send("No articles matching that title was found");
			}
		});
	})
	.put(function(req, res){

		const articleTitle = req.params.articleTitle;

		Article.update(
		{title: articleTitle},
		{title: req.body.title, content: req.body.content},
		{overwrite: true},
		function(err){
		  if (!err){
			res.send("Successfully updated the content of the selected article.");
		  } else {
			res.send(err);
		  }
		});
	})
	.patch(function(req, res){
		const articleTitle = req.params.articleTitle;
		Article.update(
		{title: articleTitle},
		{$set: req.body},
		function(err){
		  if (!err){
			res.send("Successfully updated selected article.");
		  } else {
			res.send(err);
		  }
		});
	})
	.delete(function(req, res){
		const articleTitle = req.params.articleTitle;
		Article.findOneAndDelete({title: articleTitle}, function(err){
		if (!err){
			res.send("Successfully deleted selected article.");
		} else {
			res.send(err);
		}
		});
	})
;

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
