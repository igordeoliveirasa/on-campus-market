var router = require('express').Router();
var User = require('../models/user');


router.post('signup', function() {
	var user = new User();

	user.profile.name = req.body.name;
	user.email = req.body.email;
	user.password = req.body.password;

	user.findOne({email: req.body.email}, function (err, exisitingUser) {
		if(exisitingUser) {
			console.log(req.body.email + " aleady exists!");
			return res.redirect('/signup');
		} else {
			user.save(function (err, user) {
				if(err) return next(err);
				res.json("New user has been created");
			});
		}
	});
});