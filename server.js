var express = require('express');
var morgan = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var engine = require('ejs-mate');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var flash = require('express-flash');
var MongoStore = require('connect-mongo/es5')(session);//stores the session server side
var passport = require('passport');

var config = require('./config/config.js');
var User = require('./models/user');
var Category = require('./models/category');

var app = express();

app.use(bodyParser());
app.use(bodyParser.urlencoded({
	extended: true
}));

mongoose.connect(config.database, function(err) {
	if (err) {
		console.log(err);
	} else {
		console.log("Connected to the database");
	}
});

// middleware
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));


app.use(session ({
	resave: true,
	saveUninitialized: true,
	secret: "Safet@1212121",
	store: new MongoStore({url: config.database, autoReconnect:true})
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session()); 
app.use(function (req,res,next) {
	res.locals.user = req.user;
	next();
});

app.use(function(req,res,next) {
	Category.find({}, function(err,categories) {
		if(err) return next(err);
		res.locals.categories = categories;
		next();
	});
});

app.engine('ejs', engine);
app.set('view engine', 'ejs');

var mainRoutes = require('./routes/main');
var userRoutes = require('./routes/user');
var adminRoutes = require('./routes/admin');
var apiRoutes = require('./api/api');

app.use(mainRoutes);
app.use(userRoutes);
app.use(adminRoutes);
app.use('/api', apiRoutes);


app.listen(config.port, function(err) {
	if (err) {
		throw err;
	}
	console.log('Server is Running on port 3000');
});