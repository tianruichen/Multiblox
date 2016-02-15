var canvas,
	ctx,
	player,
	ratio = 1,
	height = 30,
	width = 30,
	gameWidth = 900,
	gameHeight = 900,
	colorArray,
	outlineArray,
	gameGrid,
	hold,
	conveyer,
	gridStart = false,
	playerId,
	players, 
	linesCleared,
	timesLost;

function init() {
	canvas = document.getElementById("gameCanvas");
	ctx = canvas.getContext("2d");
	canvas.width = 900;
	canvas.height = 900;
	setColors();
	setOutlineColors();
	createArray();
	socket = io.connect('http://localhost:8000/');
	setEventHandlers();
}

function setColors() {
	colorArray = new Array(7);
	colorArray[0] = "#00FFFF";
	colorArray[5] = "#993399";
	colorArray[6] = "#FF0000";
	colorArray[4] = "#99FF33";
	colorArray[3] = "#FFCC00";
	colorArray[2] = "#FF6600";
	colorArray[1] = "#0033CC";
}

function setOutlineColors() {
	outlineArray = new Array(7);
	outlineArray[0] = "#33CCCC";
	outlineArray[5] = "#660066";
	outlineArray[6] = "#CC0000";
	outlineArray[4] = "#669900";
	outlineArray[3] = "#FF9900";
	outlineArray[2] = "#FF3300";
	outlineArray[1] = "#000099";
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
	linesCleared = data.clears;
	timesLost = data.lost;
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
	ctx.fillRect(150, 180, 600, 520);
	ctx.fillRect(775, 50, 125, 700);
	ctx.fillStyle = '#484848';
	ctx.fillRect(150, 100, 600, 80);
	drawGrid();
	drawHold();	
	drawConveyer();
	drawBorder();
	drawText();
	

}

function drawText() {
	ctx.font = "30px Comic Sans MS";
	ctx.fillStyle = "red";
	ctx.textAlign = "center";
	ctx.fillText("hold", 62, 140); 
	ctx.fillStyle = "blue";
	ctx.fillText("next", 838, 40); 
	
	ctx.font = "16px Comic Sans MS";
	ctx.fillStyle = "orange";
	ctx.fillText("lines cleared: " + linesCleared, 62, 350);
	ctx.fillStyle = "pink";
	ctx.fillText("times lost: " + timesLost, 62, 370);

	ctx.fillStyle = "green";
	ctx.font = "50px Comic Sans MS";
	ctx.textAlign = "left";
	ctx.fillText("multiblox", 150, 90); 

}

function drawGrid() {
	for (i = 0; i < width; i++) {
		for (j = 0; j < height; j++) {
			ctx.strokeStyle = "#000000";
			ctx.lineWidth = 2;
			drawRoundedOutline(j, i, 160, 110);
		}
	}
	for (i = 0; i < width; i++) {
		for (j = 0; j < height; j++) {
			var temp = gameGrid[i][j]
			if (temp != -1) {
				ctx.fillStyle = colorArray[temp.blockType];
				drawRoundedBlock(j, i, 160, 110);
				ctx.strokeStyle = outlineArray[temp.blockType];
				ctx.lineWidth = 2;
				drawRoundedOutline(j, i, 160, 110)
			}
		}
	}
}

function drawHold() {
	if (hold != undefined) {
		var piece = hold.piece;
		if (piece || piece === 0) {
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
	ctx.lineWidth = 2;
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
					drawRoundedOutline(piece.blocks[i].col, piece.blocks[i].row, 160, 110);
					array.push(distToBot(gameGrid, piece.blocks[i].row, piece.blocks[i].col));
				}		
			}
		}
	}
	if (array.length == 4) {
		var min = minDist(array);
		for (i = 0; i < 4; i++) {
			 drawRoundedOutline(piece.blocks[i].col, piece.blocks[i].row + min, 160, 110);
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
	ctx.strokeStyle = outlineArray[blockType];
	ctx.lineWidth = 2;
	if (blockType == 0) {
		drawRoundedBlock(x, y, marginX, marginY);
		drawRoundedBlock(x + 1, y, marginX, marginY);
		drawRoundedBlock(x + 2, y, marginX, marginY);
		drawRoundedBlock(x - 1, y, marginX, marginY);
		drawRoundedOutline(x, y, marginX, marginY);
		drawRoundedOutline(x + 1, y, marginX, marginY);
		drawRoundedOutline(x + 2, y, marginX, marginY);
		drawRoundedOutline(x - 1, y, marginX, marginY);
	}
	else if (blockType == 1) {
		drawRoundedBlock(x, y + 1, marginX, marginY);
		drawRoundedBlock(x + 1, y - 1, marginX, marginY);
		drawRoundedBlock(x + 1, y + 1, marginX, marginY);
		drawRoundedBlock(x + 1, y, marginX, marginY);
		drawRoundedOutline(x, y + 1, marginX, marginY);
		drawRoundedOutline(x + 1, y - 1, marginX, marginY);
		drawRoundedOutline(x + 1, y + 1, marginX, marginY);
		drawRoundedOutline(x + 1, y, marginX, marginY);
	}
	else if (blockType == 2) {
		drawRoundedBlock(x + 1, y, marginX, marginY);
		drawRoundedBlock(x + 1, y + 1, marginX, marginY);
		drawRoundedBlock(x + 1, y - 1, marginX, marginY);
		drawRoundedBlock(x, y - 1, marginX, marginY);
		drawRoundedOutline(x + 1, y, marginX, marginY);
		drawRoundedOutline(x + 1, y + 1, marginX, marginY);
		drawRoundedOutline(x + 1, y - 1, marginX, marginY);
		drawRoundedOutline(x, y - 1, marginX, marginY);
	}
	else if (blockType == 3) {
		drawRoundedBlock(x, y, marginX, marginY);
		drawRoundedBlock(x + 1, y, marginX, marginY);
		drawRoundedBlock(x + 1, y - 1, marginX, marginY);
		drawRoundedBlock(x, y - 1, marginX, marginY);
		drawRoundedOutline(x, y, marginX, marginY);
		drawRoundedOutline(x + 1, y, marginX, marginY);
		drawRoundedOutline(x + 1, y - 1, marginX, marginY);
		drawRoundedOutline(x, y - 1, marginX, marginY);
	}
	else if (blockType == 4) {
		drawRoundedBlock(x, y, marginX, marginY);
		drawRoundedBlock(x, y - 1 , marginX, marginY);
		drawRoundedBlock(x + 1, y, marginX, marginY);
		drawRoundedBlock(x + 1, y + 1, marginX, marginY);
		drawRoundedOutline(x, y, marginX, marginY);
		drawRoundedOutline(x, y - 1 , marginX, marginY);
		drawRoundedOutline(x + 1, y, marginX, marginY);
		drawRoundedOutline(x + 1, y + 1, marginX, marginY);
	}
	else if (blockType == 5) {
		drawRoundedBlock(x, y, marginX, marginY);
		drawRoundedBlock(x, y - 1, marginX, marginY);
		drawRoundedBlock(x + 1, y, marginX, marginY);
		drawRoundedBlock(x, y + 1, marginX, marginY);
		drawRoundedOutline(x, y, marginX, marginY);
		drawRoundedOutline(x, y - 1, marginX, marginY);
		drawRoundedOutline(x + 1, y, marginX, marginY);
		drawRoundedOutline(x, y + 1, marginX, marginY);

	}
	else if (blockType == 6) {
		drawRoundedBlock(x, y, marginX, marginY);
		drawRoundedBlock(x, y + 1, marginX, marginY);
		drawRoundedBlock(x + 1, y, marginX, marginY);
		drawRoundedBlock(x + 1, y - 1, marginX, marginY);
		drawRoundedOutline(x, y, marginX, marginY);
		drawRoundedOutline(x, y + 1, marginX, marginY);
		drawRoundedOutline(x + 1, y, marginX, marginY);
		drawRoundedOutline(x + 1, y - 1, marginX, marginY);

	}
}

function drawBlock(x, y, marginX, marginY) {
	ctx.fillRect(x * 20 - 10 + marginX, y * 20 - 10 + marginY, 20, 20);
}
function drawOutline(x, y, marginX, marginY) {
	ctx.strokeRect(x * 20 - 10 + marginX, y * 20 - 10 + marginY, 20, 20);
}

function drawRoundedBlock(x, y, marginX, marginY){
	var r = 3;
	var x = x * 20 - 10 + marginX;
	var y = y * 20 - 10 + marginY;
	var w = 20;
	var h = 20;
    ctx.beginPath();
    ctx.moveTo(x+r, y);
    ctx.lineTo(x+w-r, y);
    ctx.quadraticCurveTo(x+w, y, x+w, y+r);
    ctx.lineTo(x+w, y+h-r);
    ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
    ctx.lineTo(x+r, y+h);
    ctx.quadraticCurveTo(x, y+h, x, y+h-r);
    ctx.lineTo(x, y+r);
    ctx.quadraticCurveTo(x, y, x+r, y);
    ctx.fill();        
}

function drawRoundedOutline(x, y, marginX, marginY){
	var r = 3;
	var x = x * 20 - 10 + marginX + 1;
	var y = y * 20 - 10 + marginY + 1;
	var w = 18;
	var h = 18;
    ctx.beginPath();
    ctx.moveTo(x+r, y);
    ctx.lineTo(x+w-r, y);
    ctx.quadraticCurveTo(x+w, y, x+w, y+r);
    ctx.lineTo(x+w, y+h-r);
    ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
    ctx.lineTo(x+r, y+h);
    ctx.quadraticCurveTo(x, y+h, x, y+h-r);
    ctx.lineTo(x, y+r);
    ctx.quadraticCurveTo(x, y, x+r, y);
    ctx.stroke();        
}