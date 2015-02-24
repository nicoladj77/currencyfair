var kue = require('kue');
var jobs = kue.createQueue();
var rek = require('rekuire');
var Transaction = rek('models/transaction');
var Trending = rek('models/trending');
var mongoose   = require('mongoose');
mongoose.connection.on('open', function(ref) {
	console.log('Connected to mongo server.');
});
mongoose.connection.on('error', function(err) {
	console.log('Could not connect to mongo server!');
	console.log(err);
});

mongoose.connect('mongodb://localhost/transactions');

jobs.process('create_transaction', function(job, done) {
	console.log('job started' + job.id);
	var transaction = new Transaction();
	transaction.userId             = job.data.userId;
	transaction.currencyFrom       = job.data.currencyFrom;
	transaction.currencyTo         = job.data.currencyTo;
	transaction.amountSell         = job.data.amountSell;
	transaction.amountBuy          = job.data.amountBuy;
	transaction.rate               = job.data.rate;
	transaction.timePlaced         = job.data.timePlaced;
	transaction.originatingCountry = job.data.originatingCountry;
	transaction.timestamp          = job.data.timestamp;

	transaction.save(function(err) {
		if (err) {
			return done(new Error(err));
		}
		done(null, transaction);
	});

});

jobs.process('calculate_trending', function(job, done) {
	var time_upper_bound = new Date().getTime();
	var time_lower_bound = time_upper_bound - ( 60 * 60 * 1000 );
	var field = job.data.field;
	Transaction.aggregate().match({
		timestamp : {
			$gt : time_lower_bound,
			$lt : time_upper_bound
		}
	}).group({
		_id : '$' + field,
		count : {
			$sum : 1
		}
	}).sort({
		count : -1
	}).limit(5).exec(function(err, res) {
		if ( err ) {
			return done(new Error(err));
		}
		console.log(err);
		console.log(res);


		Trending.update( 
			{ field: job.data.field }, 
			{ $set: { data: res } }, 
			{ upsert: true}, 
			function( err, res ){
				console.log( res );
				done();
			} );
	});

});
