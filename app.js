"use strict";

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
//Serve static content compressed and cached.
var compression = require('compression')
app.use(compression());
var oneDay = 86400000;
app.use(express.static(__dirname + '/assets', { maxAge: oneDay }));

//Register message types for chat
//On client connection we add callbacks for some events
io.on('connect', function(client){ 
	console.log('Client connected');
	
	client.on('join', function(name){
		client.nickname = name;
		console.log(name + ' joined.');
		client.broadcast.emit('join', name);
	});

	client.on('message', function(message){
		console.log(client.nickname + " says: " + message.toString());
		//Send client message to all clients including the sender
		client.broadcast.emit('message', client.nickname + ": " + message);
		client.emit('message', client.nickname + ": " + message);			
	});	
});

io.on('disconnect', function(client){
	console.log(client.nickname + ' disconnected');
	client.broadcast.emit('disconnect', client.nickname);
});


//Routing
app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

//Start server
server.listen(8080);