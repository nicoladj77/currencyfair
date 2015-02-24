var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');

var mongoose   = require('mongoose');
mongoose.connection.on('open', function(ref) {
	console.log('Connected to mongo server.');
});
mongoose.connection.on('error', function(err) {
	console.log('Could not connect to mongo server!');
	console.log(err);
});

mongoose.connect('mongodb://localhost/transactions');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);
io.set('origins', 'http://localhost:8080');
require('./services/sockets')(io);
require('./services/trending')(io);
// Routes
var api = require('./routes/api');
var throttle = require('./services/throttle');
var frontend = require('./routes/frontend');
// port
var port = process.env.PORT || 8080;


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var rek = require('rekuire');
var Transaction = rek('models/transaction');

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', throttle.limit, api.transaction(io));
app.use('/frontend', frontend);



server.listen(port);
console.log('Magic happens on port ' + port);
module.exports = app;
