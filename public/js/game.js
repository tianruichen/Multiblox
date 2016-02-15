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
	gridStart = false,
	playerId;

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
		console.log(hratio);
	}
	else {
		var wratio = window.innerWidth / gameWidth;
		ctx.scale(wratio, wratio);
		console.log(wratio);
	}
	//console.log(canvas.width);
	//console.log(canvas.height);
};

function onSocketConnected() {
	console.log("Connected to socket server: " + playerId);
}

function onSocketDisconnect() {
	console.log("Disconnected from socket server");
}

function updateGameState(data) {
	console.log("update");
	if (!gridStart) {
		gridStart = true;
		animate();
	}
	gameGrid = data.grid;
	//console.log(gameGrid)
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
	console.log("animate");
	draw();
	window.requestAnimFrame(animate);
}

function draw() {
	//console.log("testing")
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = '#000000';
	ctx.fillRect(0, 150, 125, 125);
	ctx.fillRect(150, 100, 600, 600);
	ctx.fillRect(800, 50, 100, 700);
	drawGrid();	
}

function drawGrid() {
	for (i = 0; i < width; i++) {
		for (j = 0; j < height; j++) {
			var temp = gameGrid[i][j]
			if (temp != -1) {
				ctx.fillStyle = colorArray[temp.blockType];
				drawBlock(j, i, 160, 110);
			}
		}
	}
}

function drawBlock(x, y, marginX, marginY) {
	ctx.fillRect(x * 10 - 9 + marginX, y * 10 - 9 + marginY, 18, 18);
}