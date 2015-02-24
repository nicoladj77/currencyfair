/**
 * New node file
 */
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var TransactionSchema   = new Schema({
	userId             : Number,
	currencyFrom       : String,
	currencyTo         : String,
	amountSell         : Number,
	amountBuy          : Number, 
	rate               : Number,
	timePlaced         : Date,
	originatingCountry : String,
	timestamp          : Number
});

module.exports = mongoose.model('Transaction', TransactionSchema);