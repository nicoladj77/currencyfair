var http = require('http');

var cc = require('currency-codes');
var codes = cc.codes();

function random(low, high) {
	return Math.random() * (high - low) + low;
}

function randomInt(low, high) {
	return Math.floor(Math.random() * (high - low) + low);
}
var sendRequest = function() {
	var currencyFrom = randomInt( 0, codes.length );
	var currencyTo = randomInt( 0, codes.length );
	var amountSell = randomInt( 200, 1200 );
	var rate = random( 0.4, 0.95 ).toFixed(4);
	var body = JSON.stringify({
		"userId" : "134256",
		"currencyFrom" : codes[currencyFrom],
		"currencyTo" : codes[currencyTo],
		"amountSell" : amountSell,
		"amountBuy" : amountSell * rate,
		"rate" : rate,
		"timePlaced" : "14-JAN-15 10:27:44",
		"originatingCountry" : "FR"
	});

	var request = new http.ClientRequest({
		hostname : "localhost",
		port : 8080,
		path : "/api/transactions",
		method : "POST",
		headers : {
			"Content-Type" : "application/json",
			"Content-Length" : Buffer.byteLength(body)
		}
	});

	request.end(body);
};

setInterval(sendRequest, 20000);


