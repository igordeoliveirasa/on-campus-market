var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy();


//serialize and deseralize
passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	User.findById(id, function(err, user) {
		done(err, user);
	});
});



//middleware

passport.use('local-login', new LocalStrategy({
			usernameField: 'Email',
			passswordField: 'password',
			passReqToCallback: true,
		}, function(req, email, password, done) {
			User.findOne({
					email: email
				}, function(err, user) {
					if (err) return done(err);

					if (!user) {
						return done(null, flase, req.flash('loginMessage', ' No user has been found'));
					}

					if (!user.comparePassword(password)) {
						return done(null, false, req.flash('loginMessage', ' Oops! Wrong password!'));
					}

					return done(null, user);
				});

			}));

exports.isAuthenticated = function (req,res, next) {
	if(req.isAuthenticated()) {
		return next();
	}

	res.redirect('/login');
};