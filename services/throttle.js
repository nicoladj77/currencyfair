// Module dependencies
var mongoose = require('mongoose');
var rek = require('rekuire');
var config = rek('config');
// Load model
var RateBuckets = rek('models/ratebucket');

exports.limit = function(request, response, next) {
	'use strict';
	var ip = request.headers['x-forwarded-for'] || 
	request.connection.remoteAddress || request.socket.remoteAddress ||
	request.connection.socket.remoteAddress;

	RateBuckets.
	findOneAndUpdate(
			{ip : ip}, 
			{$inc : { hits : 1}}, 
			{upsert : false})
	.exec(
		function(error, rateBucket) {
			if (error) {
				response.statusCode = 500;
				return next(error);
			}
			if (!rateBucket) {
				rateBucket = new RateBuckets({
					createdAt : new Date(),
					ip : ip
				});
				rateBucket.save(function(error, rateBucket) {
					console.log(error);
					if (error) {
						response.statusCode = 500;
						return next(error);
					}
					if (!rateBucket) {
						response.statusCode = 500;
						return response.json({
							error : 'RateLimit',
							message : 'Cant\' create rate limit bucket'
						});
					}
					var timeUntilReset = config.rateLimits.ttl - (new Date().getTime() - rateBucket.createdAt.getTime());
					console.log(JSON.stringify(rateBucket, null, 4));
					// the rate limit ceiling for that given request
					response.set('X-Rate-Limit-Limit',config.rateLimits.maxHits);
					// the number of requests left for the time window
					response.set('X-Rate-Limit-Remaining',config.rateLimits.maxHits - 1);
					// the remaining window before the rate limit resets in miliseconds
					response.set('X-Rate-Limit-Reset', timeUntilReset);
					// Return bucket so other routes can use it
					request.rateBucket = rateBucket;
					return next();
				});
			} else {
				var timeUntilReset = config.rateLimits.ttl - 
					(new Date().getTime() - rateBucket.createdAt.getTime());
				var remaining = Math.max(0,(config.rateLimits.maxHits - rateBucket.hits));
				console.log(JSON.stringify(rateBucket, null, 4));
				// the rate limit ceiling for that given request
				response.set('X-Rate-Limit-Limit',
						config.rateLimits.maxHits);
				// the number of requests left for the time window
				response.set('X-Rate-Limit-Remaining', remaining);
				// the remaining window before the rate limit resets in miliseconds
				response.set('X-Rate-Limit-Reset', timeUntilReset);
				// Return bucket so other routes can use it
				request.rateBucket = rateBucket;
				// Reject or allow
				if (rateBucket.hits < config.rateLimits.maxHits) {
					return next();
				} else {
					console.log('rate limiter');
					response.statusCode = 429;
					return response.json({
						error : "RateLimit",
						message : 'Too Many Requests'
					});
				}
			}
		});

};