var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io')(server),
	fps = 20,
	intervalId,
	gamegrid = require("./public/js/gamegrid"),
	hold = require("./public/js/hold"),
	piece = require("./public/js/piece"),
	player = require("./public/js/player"),
	queue = require("./public/js/queue"),
	game,
	conveyer,
	players = [],
	holdslot,
	stats;

function init() {
	app.use(express.static(__dirname + '/public'));
	server.listen(8000);
	console.log('Magic on port 8000');
	setEventHandlers();
	setGameVariables();
	intervalId = setInterval(update, 1000 / fps);
};

function setEventHandlers() {
	io.on('connection', function(client) {
		console.log('Client connected: ' + client.id);
		client.on('disconnect', onClientDisconnect);
		client.on('keypress', onKeyPress)
	});
}

function setGameVariables() {
	game = gamegrid();
	conveyer = queue(5);
	holdslot = hold();
}

function onClientDisconnect() {
	console.log("Client has disconnected: " + this.id);
};

function onKeyPress(data) {
	console.log(data.key);
}

function onNewPlayer(data) {
	var newPlayer = new Player(data.x, data.y);
	newPlayer.id = this.id;
	players.push(newPlayer);
};

function update() {
	io.emit("getgame", {});
}

init();