/**
 * Module dependencies.
 */
var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var fs = require('fs');
var lineReader = require('line-reader');
/**
 * Variables
 */
var shouldSend = true;
var port = 3000;
var fifoPath = '/home/pi/.config/pianobar/ctl';

var app = express();
var io = require('socket.io').listen(app.listen(port));

// all environments
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
fs.watchFile('/home/pi/.config/pianobar/out', function (curr, prev) {
	shouldSend = true;
});
io.set('log level', 1);
io.sockets.on('connection', function(socket) {
	var metadata = [];
	lineReader.eachLine('/home/pi/.config/pianobar/out', function(line, last) {
		metadata.push(line);
		if (last) {
			nowplaying = metadata;
			socket.emit('message', {message: nowplaying});
			return false;
		}
	});

	var playingUpdate = setInterval(function () {
		if (shouldSend == true) {
			var metadata = [];
			lineReader.eachLine('/home/pi/.config/pianobar/out', function(line, last) {
				metadata.push(line);
				if (last) {
					nowplaying = metadata;
					socket.emit('message', {message: nowplaying});
					return false;
				}
			});
			shouldSend = false;
		}
	}, 1000);

	socket.on('commandQueue', function(command) {
		fs.appendFile(fifoPath, command.value, function(err) {
			if (err) {
				console.log('There was an error: ' + err);
			}
		});
	});
});


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + port);
});
