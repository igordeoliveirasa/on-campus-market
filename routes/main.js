var router = require('express').Router();
var User = ('../models/users');
var Product = require('../models/product');


function paginate(req,res,next) {
	var perPage = 9;
		var page = req.params.page;

		Product
		.find()
		.skip(perPage * page)
		.limit(perPage)
		.populate('category')
		.exec(function(err,products) {
			Product.count().exec(function(err,count) {
				if(err) return(err);
				res.render('main/product-main', {
					products: products,
					pages: count/perPage
				});
			});
		});

}

//maps elastic search replica set with the product schema
Product.createMapping(function(err, mapping) {
	if (err) {
		console.log("Error creating mapping");
		console.log("err");
	} else {
		console.log("Mapping created");
		console.log(mapping);
	}
});

var stream = Product.synchronize();
var count = 0;

stream.on('data', function() {
	count++;
});

//counts all the documents once the stream is closed
stream.on('close', function() {
	console.log("Indexed " + count + " documents");
});

stream.on('error', function(err) {
	console.log(err);
});

router.post('/search', function(req, res, next) {
	res.redirect('/search?/q=' + req.body.q);
});

router.post('/search', function(req, res, next) {
	if (req.query.q) {
		Product.search({
			query_string: {
				query: req.query.q
			}
		}, function(err, results) {
			if (err) return next(err);
			var data = results.hits.hits.map(function(hit) {
				return hit;
			});

			res.render('main/search-result', {
				query: req.query.q,
				data:data
			});

		});
	}
});

router.get('/page/:page', function (req,res,next) {
	paginate(req,res,next);
});

router.get('/', function(req, res, next) {

	if(req.user) {
		paginate(req,res,next);		
	} else {
		res.render('main/home');
	}
	


});

router.get('/about', function(req, res) {
	res.render('main/about');
});

router.get('/products/:id', function(req, res, next) {
	Product
		.find({
			category: req.params.id
		})
		.populate('category')
		.exec(function(err, products) {
			if (err) return next(err);
			res.render('main/category', {
				products: products
			});
		});
});


router.get('/product/:id', function(req, res, next) {
	Product.findById({
		_id: req.params.id
	}, function(err, product) {
		if (err) return next(err);
		res.render('main/product', {
			product: product
		});
	});
});
module.exports = router;