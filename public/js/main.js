
var socket = io(data.host);
socket.on('transaction:added', function(data) {
	var $tr = $('<tr>');
	var country = $('<td>', {text: data.originatingCountry});
	var timePlaced = $('<td>', {text: data.timePlaced});
	var rate = $('<td>', {text: data.rate});
	var amountBuy = $('<td>', {text: data.amountBuy});
	var amountSell = $('<td>', {text: data.amountSell});
	var currencyTo = $('<td>', {text: data.currencyTo});
	var currencyFrom = $('<td>', {text: data.currencyFrom});
	var userId = $('<td>', {text: data.userId});
	$tr
		.append(country)
		.append(timePlaced)
		.append(rate)
		.append(amountBuy)
		.append(amountSell)
		.append(currencyTo)
		.append(currencyFrom)
		.append(userId);
	$('#transactions tbody').append($tr);
});
socket.on('currencyFrom:updated', function(data) {
	$('#trendingFrom tbody').empty();
	$.each( data.data, function( i, el ) {
		var $tr = $('<tr>');
		var currency = $('<td>', {text: this._id});
		var count = $('<td>', {text: this.count});
		$tr
			.append(currency)
			.append(count)
		$('#trendingFrom tbody').append($tr);
	} );

});
socket.on('currencyTo:updated', function(data) {
	$('#trendingTo tbody').empty();
	$.each( data.data, function( i, el ) {
		var $tr = $('<tr>');
		var currency = $('<td>', {text: this._id});
		var count = $('<td>', {text: this.count});
		$tr
			.append(currency)
			.append(count)
		$('#trendingTo tbody').append($tr);
	} );

});