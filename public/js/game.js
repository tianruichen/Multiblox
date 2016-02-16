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
	imgArray,
	gameGrid,
	hold,
	conveyor,
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
	setImg();
	createArray();
	socket = io.connect('http://localhost:8000/');
	setEventHandlers();
}

function setImg() {
	imgArray = new Array(8);
	var blue = new Image();
	var lightBlue = new Image();
	var red = new Image();
	var orange = new Image();
	var yellow = new Image();
	var green = new Image();
	var purple = new Image();
	var black = new Image();
	blue.src = '../img/darkblue.png';
	lightBlue.src = '../img/lightblue.png';
	red.src = '../img/red.png';
	orange.src = '../img/orange.png';
	yellow.src = '../img/yellow.png';
	green.src = '../img/green.png';
	purple.src = '../img/purple.png';
	black.src = '../img/black.png';
	imgArray[0] = lightBlue;
	imgArray[1] = blue;
	imgArray[2] = orange;
	imgArray[3] = yellow;
	imgArray[4] = green;
	imgArray[5] = purple;
	imgArray[6] = red;
	imgArray[7] = black;
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
	window.addEventListener("keyup", onKeyUp, false);
	//window.addEventListener("resize", onResize, false);
	socket.on("connect", onSocketConnected);
	socket.on("disconnect", onSocketDisconnect);
	socket.on('getgame', updateGameState);
	socket.on('getId', setId);
};



function onKeydown(e) {
	console.log("Keydown: ", e.keyCode);
	socket.emit('keydown', {id: playerId, key: e.keyCode});
}

function onKeyUp(e) {
	console.log("Keyup: ", e.keyCode);
	socket.emit('keyup', {id: playerId, key: e.keyCode});
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
	conveyor = data.conveyor;
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
	drawConveyor();
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
	console.log(imgArray);
	for (i = 0; i < width; i++) {
		for (j = 0; j < height; j++) {
			var temp = gameGrid[i][j]
			if (temp != -1) {
				drawImage(j, i, 160, 110, imgArray[temp.blockType])
			}
			else {
				drawImage(j, i, 160, 110, imgArray[7]);
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

function drawConveyor(){
	if (conveyor != undefined) {
		var array = conveyor.pieces;
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
					drawOutline(piece.blocks[i].col, piece.blocks[i].row, 160, 110);
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
	var image = imgArray[blockType];
	if (blockType == 0) {
		drawImage(x, y, marginX, marginY, image);
		drawImage(x + 1, y, marginX, marginY, image);
		drawImage(x + 2, y, marginX, marginY, image);
		drawImage(x - 1, y, marginX, marginY, image);
	}
	else if (blockType == 1) {
		drawImage(x, y + 1, marginX, marginY, image);
		drawImage(x + 1, y - 1, marginX, marginY, image);
		drawImage(x + 1, y + 1, marginX, marginY, image);
		drawImage(x + 1, y, marginX, marginY, image);
	}
	else if (blockType == 2) {
		drawImage(x + 1, y, marginX, marginY, image);
		drawImage(x + 1, y + 1, marginX, marginY, image);
		drawImage(x + 1, y - 1, marginX, marginY, image);
		drawImage(x, y - 1, marginX, marginY, image);
	}
	else if (blockType == 3) {
		drawImage(x, y, marginX, marginY, image);
		drawImage(x + 1, y, marginX, marginY, image);
		drawImage(x + 1, y - 1, marginX, marginY, image);
		drawImage(x, y - 1, marginX, marginY, image);
	}
	else if (blockType == 4) {
		drawImage(x, y, marginX, marginY, image);
		drawImage(x, y - 1 , marginX, marginY, image);
		drawImage(x + 1, y, marginX, marginY, image);
		drawImage(x + 1, y + 1, marginX, marginY, image);
	}
	else if (blockType == 5) {
		drawImage(x, y, marginX, marginY, image);
		drawImage(x, y - 1, marginX, marginY, image);
		drawImage(x + 1, y, marginX, marginY, image);
		drawImage(x, y + 1, marginX, marginY, image);
	}
	else if (blockType == 6) {
		drawImage(x, y, marginX, marginY, image);
		drawImage(x, y + 1, marginX, marginY, image);
		drawImage(x + 1, y, marginX, marginY, image);
		drawImage(x + 1, y - 1, marginX, marginY, image);
	}
}

function drawImage(x, y, marginX, marginY, image) {
	ctx.drawImage(image, x * 20 - 10 + marginX, y * 20 - 10 + marginY);
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