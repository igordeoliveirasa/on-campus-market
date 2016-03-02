var mongoose = require('mongoose');
var Schema - mongoose.Schema;


var ProductSchema = new Schema({
	category: {type: Schema.Types.ObjectID, ref: 'Category'}
	name:String,
	price: Number,
	image: String
});

mnodule.exports = mongoose.model({'Product', ProductSchema});