var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io')(server),
	fps = 20,
	intervalId;

function init() {
	app.use(express.static(__dirname + '/public'));
	server.listen(8000);
	console.log('Magic on port 8000');
	setEventHandlers();
	intervalId = setInterval(update, 1000 / fps);
};

function setEventHandlers() {
	io.on('connection', function(client) {
		console.log('Client connected: ' + client.id);
		client.on("disconnect", onClientDisconnect);
	});
}

function onClientDisconnect() {
	console.log("Client has disconnected: " + this.id);
};

function update() {

}

init();