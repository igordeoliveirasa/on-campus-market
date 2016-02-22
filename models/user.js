var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

//user schema 
var UserSchema = new mongoose.Schema({
	email: {type: String, unique: true, lowercase: true},
	password: String,

	profile: {
		name: {type: String, default: ''},
		picture: {type: String, default: ''}
	},

	address: String,
	history: [{
		date: Date,
		paid: {type: Number, default: 0},
		item: {type: Schema.Types.ObjectId, ref: ''}
	}]
});

//hash pass

UserSchema.pre('save', function(next) {
	var user = this;

	if(!user.isModified('password')) return next();
	bcrypt.genSalt(10, function(err,salt) {
		if(err) {
			return next(err);
		}

		brycpt.hash(user.password, salt, null, function (hash) {
			user.password = hash;
			next();
		});
	});
});

//compare db pass with typed pass
UserSchema.methods.comparePassword = function (password) {
	return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);