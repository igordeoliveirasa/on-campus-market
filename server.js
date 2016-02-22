var express = require('express');
var morgan = require('morgan');
var mongoose = require('mongoose');

var app = express();

mongoose.connect('mongodb://root:abc123@ds013908.mongolab.com:13908/oncampusmarket', function(err) {
	if(err) {
		console.log(err);
	}else {
		console.log("Coonnected to the database");
	}
});

// middleware
app.use(morgan('dev'));


app.get('/', function(req,res) {
	var name =  "Safetyyy";
	res.json("My name is " + name);
});

app.listen(3000, function(err) {
	if(err) {
		throw err;
		console.log("Server is Running on port 3000");
	}
});