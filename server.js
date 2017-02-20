var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io')(server),
	fs = require("fs"),
	fps = 40,
	afk = 30,
    port = 80,
	//rooms = new Array(5),
	intervalId,
	gamegrid = require("./public/js/gamegrid"),
	hold = require("./public/js/hold"),
	piece = require("./public/js/piece"),
	player = require("./public/js/player"),
	queue = require("./public/js/queue"),
	game,
	conveyor,
	players = [],
	spawns = [false, false, false, false, false, false, false],
	checkOrder = [2, 4, 3, 1, 5, 6, 0],
	holdslot,
	linesCleared,
	currLines,
	mostLines,
	totalScore,
	bestScore,
	currScore,
	level,
	diffMult,
	tMiniMult,
	timesLost,
	numPlayers = 0,
	trumpMode;

	var convertedGrid = new Array(30);
	for (var i = 0; i < convertedGrid.length; i++) {
		convertedGrid[i] = new Array(30);
	}

function init() {
	app.get("/js/game.js", function (req, res) {
		res.set("Content-Type", "text/javascript");
		res.send(fs.readFileSync(__dirname + "/public" + req.path, {encoding: "utf8"})
			.replace(/{{\s*url\s*}}/, req.protocol + "://" +  req.get("host")));
	});
	app.use(express.static(__dirname + '/public'));
	server.listen(port);
	console.log('Magic on port 3000');
	setEventHandlers();
	setGameVariables();
	intervalId = setInterval(update, 1000 / fps);
};

function setEventHandlers() {
	io.on('connection', function(client) {
		if (numPlayers < 7) {
			numPlayers ++;
			var num = getSpawnLocation();
			var newPlayer = new player("Player " + (players.length + 1) , client.id, num);
			newPlayer.id = this.id;
			newPlayer.newPiece(game.grid, conveyor.getPiece());
			client.emit('getInfo', {id: client.id});
			players.push(newPlayer);

			console.log('Client connected: ' + client.id);
			client.on('disconnect', onClientDisconnect);
			client.on('keydown', onKeyDown);
			client.on('keyup', onKeyUp);
			client.on('setname', setName);
		}
		else {
			client.emit("roomisfull");
		}
	});
}

function getSpawnLocation() {
	for (var i = 0; i < 7; i++) {
		if (spawns[i] == false) {
			spawns[i] = true;
			return checkOrder[i];
		}
	}
	console.log('The server is already full');
	return false;
}

/*function setRooms() {
	for (var i = 0; i < rooms.length; i++) {
		rooms[i] = ['room ' + (i + 1), 0];
	}
}

function getAvailableRoom() {
	var i = 0;
	while (i < rooms.length) {
		if (rooms[i][1] >= 7) {
			i += 1;
		}
		else {
			return rooms[i][0];
		}
	}
	return false;
}*/

function setGameVariables() {
	game = new gamegrid();
	conveyor = new queue(5);
	holdslot = new hold();
	linesCleared = 0;
	currLines = 0;
	mostLines = 0;
	timesLost = 0;
	totalScore = 0;
	bestScore = 0;
	currScore = 0;
	level = 1;
	diffMult = 1;
	tMiniMult = 1;
}

function onClientDisconnect() {
	numPlayers --;
	console.log("Client has disconnected: " + this.id);
	for (i = 0; i < players.length; i++) {
		if (players[i].playerId == this.id) {
			players[i].removePiece(game.grid);
			var index = checkOrder.indexOf((players[i].spawnCol - 2) / 4);
			spawns[index] = false;
			players.splice(i, 1);
			break;
		}
	}
};

function setName(data) {
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
	if (currentplayer && (!currentplayer.pause || data.key == 80)) {
	//SHIFT OR C
	if (data.key == 16 || data.key == 67) {
		currentplayer.holdPiece(game.grid, conveyor, holdslot);
		//currentplayer.afk = 0;
	}
	//SPACE
	if (data.key == 32) {
		var checkClear = currentplayer.hardDrop(game.grid, conveyor);

		totalScore += checkClear[2];
		currScore += checkClear[2];
		if (currScore > bestScore) {
			bestScore = currScore;
		}

		if (checkClear[0]) {
			clearLines(checkClear);
			if (game.checkLose()) {
				game.clearGrid();
				timesLost += 1;
				currLines = 0;
				currScore = 0;
				holdslot.piece = false;
			}
		}
		//currentplayer.afk = 0;
	}
	//UP or X
	if (data.key == 38 || data.key == 88) {
		currentplayer.rotate(game.grid, 'cw');
		//currentplayer.afk = 0;
	}
	//Z
	if (data.key == 90) {
		currentplayer.rotate(game.grid, 'ccw');
		//currentplayer.afk = 0;
	}
	
	//HELD DOWN KEYS
	//LEFT
	if (data.key == 37) {
		currentplayer.heldKeys[0] = true;
		//currentplayer.afk = 0;
	}
	//RIGHT
	if (data.key == 39) {
		currentplayer.heldKeys[1] = true;
		//currentplayer.afk = 0;
	}
	//DOWN
	if (data.key == 40) {
		currentplayer.heldKeys[2] = true;
		//currentplayer.afk = 0;
	}
	//PAUSE
	if (data.key == 80) {
		if (currentplayer.pause) {
			currentplayer.unpausePlz(game.grid, conveyor);
		}
		else {
			currentplayer.pausePlz();
		}
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
			var checkClear = p.update(game.grid, conveyor, holdslot)

			totalScore += checkClear[2];
			currScore += checkClear[2];
			if (currScore > bestScore) {
				bestScore = currScore;
			}

			if (checkClear[0]) {
				clearLines(checkClear);
				if (game.checkLose()) {
					game.clearGrid();
					timesLost += 1;
					currLines = 0;
					currScore = 0;
					holdslot.piece = false;
				}
			}
			if (p.timeSinceLastAction >= afk * fps) {
				io.sockets.connected[p.playerId].emit('afk');
    			io.sockets.connected[p.playerId].disconnect();	
			}
		});

		convertGrid();

		clearArray = [linesCleared, mostLines, currLines];
		scoreArray = [totalScore, bestScore, currScore]

		io.emit("getgame", {grid: convertedGrid, hold: holdslot, conveyor: conveyor,
			players: players, clears: clearArray, lost: timesLost, score: scoreArray});
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

	players.forEach(function(p) {
		var squares = p.getSquares();
		if (squares) {
			squares.forEach(function(s) {
				convertedGrid[s[0]][s[1]] += 100 * p.playerNumber;
			});
		}
	});
}

function clearLines(checkClear) {
	var L = game.checkClear(checkClear[0], checkClear[1], players);
	linesCleared += L;
	currLines += L;
	if (currLines > mostLines) {
		mostLines = currLines;
	}
	var tempScore = 0;
	if (L == 0) {
		tMiniMult = 1;
		if (checkClear[3] == 2) {
			tempScore = 400 * level;
		}
		else if (checkClear[3] == 1) {
			tempScore = 100 * level;
		}
	}
	else if (L == 1) {
		if (checkClear[3] == 2) {
			tempScore = 800 * level * diffMult;
			diffMult = 1.5;
			tMiniMult = 1;
		}
		else if (checkClear[3] == 1) {
			tempScore = 200 * level * tMiniMult;
			diffMult = 1;
			tMiniMult = 1.5;
		}
		else {
			tempScore = 100 * level;
			diffMult = 1;
			tMiniMult = 1;
		}
	}
	else if (L == 2) {
		tMiniMult = 1;
		if (checkClear[3]) {
			tempScore = 1200 * level * diffMult;
			diffMult = 1.5;
		}
		else {
			tempScore = 300 * level;
			diffMult = 1;
		}
	}
	else if (L == 3) {
		tMiniMult = 1;
		if (checkClear[3]) {
			tempScore = 1600 * level * diffMult;
			diffMult = 1.5;
		}
		else {
			tempScore = 500 * level;
			diffMult = 1;
		}
	}
	else if (L == 4) {
		tempScore = 800 * level * diffMult;
		diffMult = 1.5;
	}
	totalScore += tempScore;
	currScore += tempScore;
	if (currScore > bestScore) {
		bestScore = currScore;
	}
}

init();
