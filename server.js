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
	conveyor,
	players = [],
	holdslot,
	linesCleared,
	timesLost,
	command = '';

	var convertedGrid = new Array(30);
	for (var i = 0; i < convertedGrid.length; i++) {
		convertedGrid[i] = new Array(30);
	}

	timeTestThatShouldBeRemoved = 30;

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
		var newPlayer = new player("Player " + (players.length + 1) , client.id, 2, getRandomInt(0, 7) * 4 + 1);
		newPlayer.id = this.id;
		newPlayer.newPiece(game.grid, conveyor.getPiece());
		client.emit('getInfo', {id: client.id, name: newPlayer.username});
		players.push(newPlayer);

		console.log('Client connected: ' + client.id);
		client.on('disconnect', onClientDisconnect);
		client.on('keydown', onKeyDown);
		client.on('keyup', onKeyUp);
		client.on('namechange', onNameChange);
	});
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function setGameVariables() {
	game = new gamegrid();
	conveyor = new queue(5);
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

function onNameChange(data) {
	var currentplayer;
	players.forEach(function(p) {
		if (p.playerId == data.id) {
			currentplayer = p;
		}	
	});
	currentplayer.username = data.name;
}

function onKeyDown(data) {
	var currentplayer;

	players.forEach(function(p) {
		if (p.playerId == data.id) {
			currentplayer = p;
		}	
	});
	if (currentplayer) {
	//SHIFT
	if (data.key == 16) {
		currentplayer.holdPiece(game.grid, conveyor, holdslot);
	}
	//SPACE
	if (data.key == 32) {
		var checkClear = currentplayer.hardDrop(game.grid, conveyor);
		if (checkClear) {
			linesCleared += game.checkClear(checkClear[0], checkClear[1], players);
			if (game.checkLose()) {
				game.clearGrid();
				timesLost += 1;
			}
		}
	}
	//UP or X
	if (data.key == 38 || data.key == 88) {
		currentplayer.rotate(game.grid, 'cw');
	}
	//Z
	if (data.key == 90) {
		currentplayer.rotate(game.grid, 'ccw')
	}
	
	//HELD DOWN KEYS
	//LEFT
	if (data.key == 37) {
		currentplayer.heldKeys[0] = true;
	}
	//RIGHT
	if (data.key == 39) {
		currentplayer.heldKeys[1] = true;
	}
	//DOWN
	if (data.key == 40) {
		currentplayer.heldKeys[2] = true;
	}
	}
}

function onKeyUp(data) {
	var currentplayer;
	players.forEach(function(p) {
		if (p.playerId == data.id) {
			currentplayer = p;
		}	
	});

	//LEFT
	if (data.key == 37) {
		currentplayer.heldKeys[0] = false;
	}
	//RIGHT
	if (data.key == 39) {
		currentplayer.heldKeys[1] = false;
	}
	//DOWN
	if (data.key == 40) {
		currentplayer.heldKeys[2] = false;
	}
}

function getPlayer(data) {
	var currentplayer;
	players.forEach(function(p) {
	if (p.playerId = data.id) {
			return p;
		}
	});
}

function update() {

	if (players.length > 0) {
		players.forEach(function(p) {
			var checkClear = p.update(game.grid, conveyor, holdslot, '')
			if (checkClear) {
				linesCleared += game.checkClear(checkClear[0], checkClear[1], players);
				if (game.checkLose()) {
					game.clearGrid();
					timesLost += 1;
				}
			}
		});

		convertGrid();
		
		io.emit("getgame", {grid: convertedGrid, hold: holdslot, conveyor: conveyor,
			players: players, clears: linesCleared, lost: timesLost});
	}
}

function convertGrid() {
	for (var i = 0; i < convertedGrid.length; i++) {
		for (var j = 0; j < convertedGrid[0].length; j++) {
			var temp = game.grid[i][j];
			if (temp == -1) {
				convertedGrid[i][j] = false;
			}
			else {
				convertedGrid[i][j] = temp.blockType;
			}
		}
	}
}

init();