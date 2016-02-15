var canvas,
	ctx,
	player,
	ratio = 1,
	height = 30,
	width = 30,
	gameWidth = 900,
	gameHeight = 900,
	colorArray,
	gameGrid;

function init() {
	canvas = document.getElementById("gameCanvas");
	ctx = canvas.getContext("2d");
	canvas.width = 900;
	canvas.height = 900;
	setColors();
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

function setEventHandlers() {
	window.addEventListener("keydown", onKeydown, false);
	//window.addEventListener("resize", onResize, false);
	socket.on("connect", onSocketConnected);
	socket.on("disconnect", onSocketDisconnect);
	socket.on('getgame', updateGameState)
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
	if (d) socket.emit("keypress", {id: socket.io.engine.id, key: d});
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
	console.log(canvas.width);
	console.log(canvas.height);
};

function onSocketConnected() {
	console.log("Connected to socket server");
}

function onSocketDisconnect() {
	console.log("Disconnected from socket server");
}

function updateGameState(data){
	gameGrid = data.grid;
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
	//console.log("testing")
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = '#FF0000';
	ctx.fillRect(0, 150, 125, 125);
	ctx.fillRect(150, 100, 600, 600);
	ctx.fillRect(800, 50, 100, 700);
	drawGrid(gameGrid);	
}

function drawGrid(grid) {
	for (i = 0; i < width; i++) {
		for (j = 0; j < height; j++) {
			var temp = grid[i][j]
			if (temp != -1) {
				ctx.fillStyle = colorArray[temp.blockType];
				drawBlock(i, j, 160, 110);
			}
		}
	}
}

function drawBlock(x, y, marginX, marginY) {
	ctx.fillRect(x * 10 - 9 + marginX, y * 10 - 9 + marginY, x * 10 + 9 + marginX, y * 10 + 9 + marginY);
}