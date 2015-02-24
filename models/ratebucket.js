var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var rek = require('rekuire');
var config = rek('config');

var RateBuckets = new Schema(
	{
		createdAt : {
			type : Date,
			required : true,
			'default' : Date.now,
			expires : config.rateLimits.ttl
		},
		ip : {
			type : String,
			required : true,
			trim : true
		},
		hits : {
			type : Number,
			'default' : 1,
			required : true,
			max : config.rateLimits.maxHits,
			min : 0
		}
	});

module.exports = mongoose.model('RateBuckets', RateBuckets);