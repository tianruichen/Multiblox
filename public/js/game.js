var canvas,
	ctx,
	player,
	ratio = 1,
	height = 30,
	width = 30,
	gameWidth = 900,
	gameHeight = 900,
	colorArray,
	gameGrid,
	hold,
	conveyer,
	gridStart = false,
	playerId,
	players;

function init() {
	canvas = document.getElementById("gameCanvas");
	ctx = canvas.getContext("2d");
	canvas.width = 900;
	canvas.height = 900;
	setColors();
	createArray();
	socket = io.connect('http://localhost:8000/');
	setEventHandlers();
}

function setColors() {
	colorArray = new Array(7);
	colorArray[0] = "aqua";
	colorArray[1] = "blueviolet";
	colorArray[2] = "coral";
	colorArray[3] = "darkgreen";
	colorArray[4] = "goldenrod";
	colorArray[5] = "magenta";
	colorArray[6] = "saddlebrown";
}

function createArray (){
	gameGrid = new Array(width);
	for (var i = 0; i < width; i++) {
		gameGrid[i] = new Array(height);
	}

	for (var i = 0; i < width; i++) {
		for (var j = 0; j < height; j++) {
			gameGrid[i][j] = -1;
		}
	}
}

function setEventHandlers() {
	window.addEventListener("keydown", onKeydown, false);
	//window.addEventListener("resize", onResize, false);
	socket.on("connect", onSocketConnected);
	socket.on("disconnect", onSocketDisconnect);
	socket.on('getgame', updateGameState);
	socket.on('getId', setId);
};

function onKeydown(e) {
	var d = false;
	switch (e.keyCode) {
		case 16: d = 'shift'; break;
		case 32: d = 'space'; break;
		case 37: d = 'left'; break;
		case 38: d = 'up'; break;
		case 39: d = 'right'; break;
		case 40: d = 'down'; break;
		case 88: d = 'x'; break;
		case 90: d = 'z'; break;
	}
	if (d) socket.emit("keypress", {id: playerId, key: d});
}

function onResize() {
	if (window.innerWidth / gameWidth * gameHeight > window.innerHeight) {
		var hratio = window.innerHeight / gameHeight;
		ctx.scale(hratio, hratio);
	}
	else {
		var wratio = window.innerWidth / gameWidth;
		ctx.scale(wratio, wratio);
	}
};

function onSocketConnected() {
	console.log("Connected to socket server");
}

function onSocketDisconnect() {
	console.log("Disconnected from socket server");
}

function updateGameState(data) {
	if (!gridStart) {
		gridStart = true;
	}
	gameGrid = data.grid;
	hold = data.hold;
	conveyer = data.conveyer;
	players = data.players
}

function setId(data) {
	playerId = data.id;
}

window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       || 
          window.webkitRequestAnimationFrame || 
          window.mozRequestAnimationFrame    || 
          window.oRequestAnimationFrame      || 
          window.msRequestAnimationFrame     || 
          function(/* function */ callback, /* DOMElement */ element){
            window.setTimeout(callback, 1000 / 60);
          };
})();

function animate() {
	draw();
	window.requestAnimFrame(animate);
}

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = '#181818';
	ctx.fillRect(0, 150, 125, 125);
	ctx.fillRect(150, 100, 600, 600);
	ctx.fillRect(775, 50, 125, 700);
	drawGrid();
	drawHold();	
	drawConveyer();
	drawBorder();
}

function drawGrid() {
	for (i = 0; i < width; i++) {
		for (j = 0; j < height; j++) {
			var temp = gameGrid[i][j]
			if (temp != -1) {
				ctx.fillStyle = colorArray[temp.blockType];
				drawBlock(j, i, 160, 110);
			}
			ctx.strokeStyle = "#000000";
			ctx.lineWidth = 2;
			drawOutline(j, i, 160, 110)
		}
	}
}

function drawHold() {
	if (hold != undefined) {
		var piece = hold.piece;
		if (piece) {
			drawPiece(piece, 2, 3, 10, 160);
		}
	}
}

function drawConveyer(){
	if (conveyer != undefined) {
		var array = conveyer.pieces;
		for (i = 0; i < 5; i++) {
			drawPiece(array[i], 2, 3 + i * 7, 785, 60);
		}
	}
}

function drawBorder() {
	var piece;
	var array = [];
	ctx.strokeStyle = "yellow";
	ctx.lineWidth = 3;
	if (players != undefined) {
		players.forEach(function(p) {
			if (p.playerId == playerId) {
				if (p.piece != undefined) {
					piece = p.piece;
				}
			}
		});
	}
	if (piece != undefined) {
		if (piece.blocks != undefined) {
			for (i = 0; i < 4; i++) {
				if (piece.blocks[i].row != undefined && piece.blocks[i].col != undefined) {
					drawOutline(piece.blocks[i].col, piece.blocks[i].row, 160, 110);
					array.push(distToBot(gameGrid, piece.blocks[i].row, piece.blocks[i].col));
				}		
			}
		}
	}
	if (array.length == 4) {
		var min = minDist(array);
		for (i = 0; i < 4; i++) {
			 drawOutline(piece.blocks[i].col, piece.blocks[i].row + min, 160, 110);
		}
	}
}

function distToBot(grid, row, col) {
	var dist = 0;
	var r = row + 1;
	var c = col;
	while (r < grid.length && (grid[r][c] == -1 || grid[r][c].landed == 0)) {
		dist += 1;
		r += 1
	}
	return dist;
}

function minDist(array) {
	var minDist = 999;
	//Gets the number of rows until the first piece hits the "ground"
	for (var i = 0; i < 4; i++) {
		var temp = array[i];
		if (temp < minDist) {
			minDist = temp;
		}
	}
	return minDist;
}

function drawPiece(blockType, x, y, marginX, marginY) {
	ctx.fillStyle = colorArray[blockType];
	drawBlock(x, y, marginX, marginY);
	if (blockType == 0) {
		drawBlock(x + 1, y, marginX, marginY);
		drawBlock(x + 2, y, marginX, marginY);
		drawBlock(x - 1, y, marginX, marginY);
	}
	else if (blockType == 1) {
		drawBlock(x, y - 1, marginX, marginY);
		drawBlock(x, y + 1, marginX, marginY);
		drawBlock(x + 1, y + 1, marginX, marginY);
	}
	else if (blockType == 2) {
		drawBlock(x, y + 1, marginX, marginY);
		drawBlock(x, y - 1, marginX, marginY);
		drawBlock(x + 1, y - 1, marginX, marginY);
	}
	else if (blockType == 3) {
		drawBlock(x + 1, y, marginX, marginY);
		drawBlock(x + 1, y - 1, marginX, marginY);
		drawBlock(x, y - 1, marginX, marginY);
	}
	else if (blockType == 4) {
		drawBlock(x, y - 1 , marginX, marginY);
		drawBlock(x + 1, y, marginX, marginY);
		drawBlock(x + 1, y + 1, marginX, marginY);
	}
	else if (blockType == 5) {
		drawBlock(x, y - 1, marginX, marginY);
		drawBlock(x + 1, y, marginX, marginY);
		drawBlock(x, y + 1, marginX, marginY);
	}
	else if (blockType == 6) {
		drawBlock(x, y + 1, marginX, marginY);
		drawBlock(x + 1, y, marginX, marginY);
		drawBlock(x + 1, y - 1, marginX, marginY);
	}
}

function drawBlock(x, y, marginX, marginY) {
	ctx.fillRect(x * 20 - 10 + marginX, y * 20 - 10 + marginY, 20, 20);
}
function drawOutline(x, y, marginX, marginY) {
	ctx.strokeRect(x * 20 - 10 + marginX, y * 20 - 10 + marginY, 20, 20);
}