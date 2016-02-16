var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io')(server),
	fps = 30,
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
	linesCleared,
	timesLost,
	command = '';

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
		var newPlayer = new player("Donald Trump", client.id, 2, getRandomInt(0, 7) * 4 + 1);
		newPlayer.id = this.id;
		newPlayer.newPiece(game.grid, conveyer.getPiece());
		client.emit('getId', {id: client.id});
		players.push(newPlayer);

		console.log('Client connected: ' + client.id);
		client.on('disconnect', onClientDisconnect);
		client.on('keypress', onKeyPress)
	});
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function setGameVariables() {
	game = new gamegrid();
	conveyer = new queue(5);
	holdslot = new hold();
	linesCleared = 0;
	timesLost = 0;
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
		currentplayer.nextInput = 'hold';
	}
	if (data.key == 'space') {
		currentplayer.nextInput = 'hard drop';
	}
	else if (data.key == 'left') {
		currentplayer.nextInput = 'left';
	}
	else if (data.key == 'up') {
		currentplayer.nextInput = 'cw';
	}
	else if (data.key == 'right') {
		currentplayer.nextInput = 'right';
	}
	else if (data.key == 'down') {
		currentplayer.nextInput = 'down';
	}
	else if (data.key == 'z') {
		currentplayer.nextInput = 'ccw';
	}
	else if (data.key == 'x') {
		currentplayer.nextInput = 'cw';
	}
}

function update() {
	players.forEach(function(p) {
		var checkClear = p.update(game.grid, conveyer, holdslot)
		if (checkClear) {
			game.checkClear(checkClear[0], checkClear[1], players);
			if (game.checkLose()) {
				game.clearGrid();
				timesLost += 1;
			}
		}
	});
	
	io.emit("getgame", {grid: game.grid, hold: holdslot, conveyer: conveyer, players: players, clears: linesCleared, lost: timesLost});
}

init();