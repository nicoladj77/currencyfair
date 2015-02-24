module.exports = function(io) {
	var kue = require('kue');
	var jobs = kue.createQueue();
	var rek = require('rekuire');
	var Trending = rek('models/trending');
	setInterval( function() {
		console.log('add job to get trending data');

		var job = jobs.create('calculate_trending', { field:'currencyFrom' }).save();
		job.on('complete', function(result) {
			Trending.findOne( { field: 'currencyFrom' }, function( err, res ) {
				io.sockets.emit('currencyFrom:updated', res);
			} );
			
		}).on('failed', function() {
			console.log('Job failed');
		});
		var job_to = jobs.create('calculate_trending', { field:'currencyTo' }).save();
		job_to.on('complete', function(result) {
			Trending.findOne( { field: 'currencyTo' }, function( err, res ) {
				io.sockets.emit('currencyTo:updated', res);
			} );
			
		}).on('failed', function() {
			console.log('Job failed');
		});

	}, 10000 );
};
