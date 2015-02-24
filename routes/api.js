exports.transaction = function( io ) {
	var express = require('express');
	var router = express.Router();
	var kue = require('kue');
	var jobs = kue.createQueue();
	router.route('/transactions')

	.post(function(req, res) {
		console.log('post received');
		var transaction = {
				userId             : req.body.userId,
				currencyFrom       : req.body.currencyFrom,
				currencyTo         : req.body.currencyTo,
				amountSell         : req.body.amountSell,
				amountBuy          : req.body.amountBuy,
				rate               : req.body.rate,
				timePlaced         : req.body.timePlaced,
				originatingCountry : req.body.originatingCountry,
				timestamp          : new Date().getTime()
		};
		var job = jobs.create('create_transaction', transaction).save();
		job.on('complete', function(result) {
			console.log(job.id);
			io.sockets.emit('transaction:added', transaction);
		}).on('failed', function() {
			console.log('Job failed');
		});
		res.json({message: 'Transaction queued'});

	});
	return router;
};
