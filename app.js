// Running on the Development branch.

// Module dependencies.
var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var fs = require('fs');
var lineReader = require('line-reader');

// Variables
var shouldSend = true;
var port = 3000;

// Path files
var fifoPath = '/Users/jesusfromthesky/pianobar/ctl'; // Remove hard coded path. 
var dataFile = '/Users/jesusfromthesky/Desktop/TabardRadio/out'; // Remove hard coded path.

// 
var app = express();
var io = require('socket.io').listen(app.listen(port));

// all environments
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    console.log("Running in dev");
    app.use(express.errorHandler());
}

// Functions 
function readAndEmit (file, callback){
    var metadata = [];
    lineReader.eachLine(file, function(line, last) {
        metadata.push(line);
        if (last) {
            io.sockets.emit('message', {message: metadata});
            return false;
        }
    });
}

// Routes
app.get('/', routes.index);

// Start Watching the dataFile
fs.watchFile(dataFile, function (curr, prev) {
    readAndEmit(dataFile);
});

io.set('log level', 1);


// On connection
io.sockets.on('connection', function(socket) {
    readAndEmit(dataFile); // Read the dataFile for song info.
    socket.on('commandQueue', function(command) {
        fs.appendFile(fifoPath, command.value, function(err) {
            if (err) {
                console.log('There was an error: ' + err);
            }
        });
    });
});

http.createServer(app).listen(app.get('port'), function(){
    console.log('PiRadio server listening on port ' + port);
});
