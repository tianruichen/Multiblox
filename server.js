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

		var newPlayer = new player("YOLO", client.id, 2, 15);
		newPlayer.id = this.id;
		newPlayer.newPiece(game.grid, conveyer.getPiece());
		client.emit('getId', {id: client.id});
		players.push(newPlayer);

		console.log('Client connected: ' + client.id);
		client.on('disconnect', onClientDisconnect);
		client.on('keypress', onKeyPress)
	});
}

function setGameVariables() {
	game = new gamegrid();
	conveyer = new queue(5);
	holdslot = new hold();
}

function onClientDisconnect() {
	console.log("Client has disconnected: " + this.id);
	for (i = 0; i < players.length; i++) {
		if (players[i].playerId == this.id) {
			players[i].removePiece(game.grid);
			players.splice(i, 1);
			break;
		}
	}
};

function onKeyPress(data) {
	var currentplayer;
	players.forEach(function(p) {
		if (p.playerId == data.id) {
			currentplayer = p;
		}	
	});
	if (data.key == 'shift') {
		currentplayer.update(game.grid, 'hold', conveyer, holdslot)
	}
	if (data.key == 'space') {
		currentplayer.update(game.grid, 'hard drop', conveyer, holdslot)
	}
	else if (data.key == 'left') {
		currentplayer.update(game.grid, 'left', conveyer, holdslot)
	}
	else if (data.key == 'up') {
		currentplayer.update(game.grid, 'cw', conveyer, holdslot)
	}
	else if (data.key == 'right') {
		currentplayer.update(game.grid, 'right', conveyer, holdslot)
	}
	else if (data.key == 'down') {
		//currentplayer.update(game, 'down', conveyer)
	}
	else if (data.key == 'z') {
		currentplayer.update(game.grid, 'ccw', conveyer, holdslot)
	}
	else if (data.key == 'x') {
		currentplayer.update(game.grid, 'cw', conveyer, holdslot)
	}
}

function update() {
	players.forEach(function(p) {
		p.update(game.grid, '', conveyer, holdslot)
	});
	io.emit("getgame", {grid: game.grid, hold: holdslot, conveyer: conveyer});
}

init();