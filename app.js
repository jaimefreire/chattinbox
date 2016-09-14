var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

//Register message types for chat
io.on('connection', function(client){ 
	console.log('Client connected');
	client.on('join', function(name){
		client.nickname = name;
	});
	client.on('messages', function(data){
		var nickname = client.nickname;
		//Send client message to all clients including the sender
		app.broadcast.emit('message', nickname + ": " + message);
	});
});


//Routing
app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

//Start server
server.listen(8080);