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
		console.log(conveyer);
		newPlayer.newPiece(game.grid, conveyer.getPiece());
		players.push(newPlayer);

		console.log('Client connected: ' + client.id);
		client.on('disconnect', onClientDisconnect);
		client.on('keypress', onKeyPress)
	});
}

function setGameVariables() {
	game = new gamegrid();
	//console.log(game);

	conveyer = new queue(5);
	holdslot = new hold();
}

function onClientDisconnect() {
	console.log("Client has disconnected: " + this.id);
};

function onKeyPress(data) {
	var currentplayer;
	players.forEach(function(p) {
		if (p.id == data.id) {
			currentplayer = p;
		}	
	});
	if (data.key == 'shift') {
		currentplayer.update(game, 'hold', conveyer)
	}
	else if (data.key == 'left') {
		currentplayer.update(game, 'left', conveyer)
	}
	else if (data.key == 'up') {
		currentplayer.update(game, 'cw', conveyer)
	}

	else if (data.key == 'right') {
		currentplayer.update(game, 'right', conveyer)
	}

	else if (data.key == 'down') {
		currentplayer.update(game, 'down', conveyer)
	}

	else if (data.key == 'z') {
		currentplayer.update(game, 'ccw', conveyer)
	}
	else if (data.key == 'x') {
		currentplayer.update(game, 'cw', conveyer)
	}
}

function update() {
	players.forEach(function(p) {
		p.update(game.grid, '', conveyer, holdslot)
	});
	io.emit("getgame", {grid: game, hold: holdslot, conveyer: conveyer});
}

init();