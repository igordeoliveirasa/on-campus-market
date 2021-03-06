var router = require('express').Router();
var async = require('async');
var faker = require('faker');
var Category = require('../models/category');
var Product = require('../models/product');

router.post('/search', function(req,res,next) {
	Product.search({
		query_string: {query: req.body.search_term}
	}, function(ewrr, results) {
		if (err) return next(err);
	});
});


router.get('/:name', function(req, res, next) {
	async.waterfall([

		function(callback) {
			Category.findOne({
				name: req.params.name
			}, function(err, category) {
				if (err) return next(err);
				callback(null, category);
			});
		},

		function(category, callback) {
			for (var i = 0; i < 30; i++) {
				var product = new Product();
				product.category = category._id;
				product.name = faker.commerce.productName(); //fake data for testing
				product.price = faker.commerce.price();

				product.image = faker.image.image();

				product.save();
			}
		}

	]);

	res.json({
		message: 'success'
	});
});


module.exports = router;