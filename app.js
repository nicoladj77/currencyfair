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
var expose = require('express-expose');
app = expose(app);
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

require('./services/trending')(io);
require('./services/sockets')(io);
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
app.use(function(req, res, next) {
	res.locals.expose = {};
	next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', throttle.limit, api.transaction(io));
app.use('/frontend', frontend);



server.listen(port);
console.log('Magic happens on port ' + port);
module.exports = app;
