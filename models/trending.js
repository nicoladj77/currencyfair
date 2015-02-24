var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var TrendingSchema   = new Schema({
	field : String,
	data  : Array
});

module.exports = mongoose.model('Trending', TrendingSchema);