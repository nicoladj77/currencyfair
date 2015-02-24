var express = require('express');
var router = express.Router();
var async = require('async');
router.route('/')
.get(function(req, res) {
	var rek = require('rekuire');
	var Transaction = rek('models/transaction');
	var Trending = rek('models/trending');
	async.parallel({
		transactions : function(cb) {
			Transaction.find({}).limit(20).sort({
				timestamp : -1
			}).exec(cb);
		},
		trendingTo : function(cb) {
			Trending.findOne({
				field : 'currencyTo'
			}).exec(cb);
		},
		trendingFrom : function(cb) {
			Trending.findOne({
				field : 'currencyFrom'
			}).exec(cb);
		}
	}, function(err, result) {
		console.log(req.headers.host);
		res.locals.expose.host = req.headers.host;
		res.render('index', {
			title : 'Transactions',
			results : result.transactions,
			trendingTo : result.trendingTo,
			trendingFrom : result.trendingFrom
		});
	});

});

module.exports = router;