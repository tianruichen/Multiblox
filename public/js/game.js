var canvas,
	ctx,
	player,
	ratio = 1,
	height = 30,
	width = 30,
	gameWidth = 900,
	gameHeight = 900,
	imgArray,
	gameGrid,
	hold,
	conveyor,
	gridStart = false,
	playerId,
	playerName,
	players, 
	linesArray,
	scoreArray,
	timesLost,
	keysPressed = [],
	gameBackground,
	title,
	holdText,
	nextText,
	theTrump = false,
	theBern = false,
	cubs = false,
	trumpArray,
	outlineColors = ["", "#FF3030", "#0066FF", "#FFFF00", 
					"#00F100", "#FF8C00", "#00FFFF", "#F050F0"],
	left,
	right, 
	center;

var cubsColors = [
[2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
[2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
[2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
[2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
[2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
[2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
[2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
[2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 0, 0, 0, 0, 0, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
[2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2],
[2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2],
[2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2],
[2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 1, 1, 2, 2, 2, 2, 2, 1, 1, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2],
[2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2],
[2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 2, 2, 2, 2, 2, 2],
[2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
[2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
[2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
[2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
[2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
[2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
[2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
[2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 2, 2, 2, 2, 2, 2],
[2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2],
[2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 1, 1, 2, 2, 2, 2, 2, 1, 1, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2],
[2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2],
[2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2],
[2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2],
[2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 0, 0, 0, 0, 0, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
[2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
[2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]
]


function init(name) {
	canvas = document.getElementById("gameCanvas");
	ctx = canvas.getContext("2d");
	canvas.width = 900;
	canvas.height = 900;
	//left = document.getElementById("left");
	//right = document.getElementById("right");
	//center = document.getElementById("center");
	//onResize();
	playerName = name;
	if (name.toLowerCase() === "trump" || name.toLowerCase() === "drumpf") {
		theTrump = true;
		setTrump();
	}
	else if (name.toLowerCase() === "bernie") {
		theTrump = true;
		theBern = true;
		setTrump();
	} else if (name.toLowerCase() === "cubs") {
		theTrump = true;
		cubs = true;
		setTrump();
	}

	else {
		setImg();
	}
	createArray();
	socket = io.connect('{{url}}');
	//socket = io.connect('http://localhost:8000/');
	setEventHandlers();
}

function setTrump() {
	var blue = new Image();
	var red = new Image();
	var white = new Image();
	var black = new Image();
	var grey = new Image();
	blue.src = '../img/darkblue.png';
	red.src = '../img/red.png';
	white.src = '../img/white.png'
	black.src = '../img/black.png';
	grey.src = '../img/grey.png';
	trumpArray = [red, white, blue, black, grey];

	gameBackground = new Image();
	gameBackground.src = '../img/gameBackground.png';
	title = new Image();
	if (theBern) {
		title.src = '../img/bernie.png';
	} else if (cubs) {
		title.src = '../img/cubs2.png';
	} else {
		title.src = '../img/trump.png';
	}
	holdText = new Image();
	holdText.src = '../img/hold.png';
	nextText = new Image();
	nextText.src = '../img/next.png';
}

function setImg() {
	imgArray = new Array(9);
	var blue = new Image();
	var lightBlue = new Image();
	var red = new Image();
	var orange = new Image();
	var yellow = new Image();
	var green = new Image();
	var purple = new Image();
	var black = new Image();
	var grey = new Image();
	blue.src = '../img/darkblue.png';
	lightBlue.src = '../img/lightblue.png';
	red.src = '../img/red.png';
	orange.src = '../img/orange.png';
	yellow.src = '../img/yellow.png';
	green.src = '../img/green.png';
	purple.src = '../img/purple.png';
	black.src = '../img/black.png';
	grey.src = '../img/grey.png';
	imgArray[0] = lightBlue;
	imgArray[1] = blue;
	imgArray[2] = orange;
	imgArray[3] = yellow;
	imgArray[4] = green;
	imgArray[5] = purple;
	imgArray[6] = red;
	imgArray[7] = black;
	imgArray[8] = grey;
	gameBackground = new Image();
	gameBackground.src = '../img/gameBackground.png';
	title = new Image();
	title.src = '../img/title.png';
	holdText = new Image();
	holdText.src = '../img/hold.png';
	nextText = new Image();
	nextText.src = '../img/next.png';
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
	window.addEventListener("keyup", onKeyup, false);
	//window.addEventListener("resize", onResize, false);
	socket.on("connect", onSocketConnected);
	socket.on("disconnect", onSocketDisconnect);
	socket.on('getgame', updateGameState);
	socket.on('getInfo', setInfo);
	socket.on('roomisfull', returnToHome);
	socket.on('afk', kickToHome);
};

function onKeydown(e) {
	if (!keysPressed[e.keyCode]) {
		keysPressed[e.keyCode] = true;
		socket.emit('keydown', {id: playerId, key: e.keyCode});
	}
	if (e.which == 77) {
		if (document.getElementById('music').muted) {
			document.getElementById('music').muted = false;
		}
		else {
			document.getElementById('music').muted = true;
		}
	}
}

function onKeyup(e) {
	keysPressed[e.keyCode] = false;
	socket.emit('keyup', {id: playerId, key: e.keyCode});
}

/*function onResize() {
	console.log("helpplz");
	if (window.innerWidth > window.innerHeight) {
		canvas.setAttribute("style","height:" + window.innerHeight + "px");
		canvas.setAttribute("style","width:" + window.innerHeight + "px");
		center.setAttribute("style","width:" + (window.innerHeight + 100) + "px");
		center.setAttribute("style","height:" + (window.innerHeight + 100) + "px");
	}
	else {
		canvas.setAttribute("style","height:" + window.innerWidth + "px");
		canvas.setAttribute("style","width:" + window.innerWidth + "px");
		center.setAttribute("style","width:" + (window.innerWidth + 100) + "px");
		center.setAttribute("style","width:" + (window.innerHeight + 100) + "px");
	}
};*/

function setInfo(data) {
	playerId = data.id;
	setName();
}

function setName() {
	socket.emit('setname', {id: playerId, name: playerName});
}

function onSocketConnected() {
	console.log("Connected to socket server");
}

function onSocketDisconnect() {
	console.log("Disconnected from socket server");
}

function returnToHome() {
	document.getElementById("screen").style.display = "block";
	document.getElementById("gameCanvas").style.display = "none";
	document.getElementById("music").pause();
	document.getElementById("music").currentTime = 0;
	document.getElementById("message").innerHTML = "Room is currently full. Try again later";
}

function kickToHome() {
	document.getElementById("screen").style.display = "block";
	document.getElementById("gameCanvas").style.display = "none";
	document.getElementById("music").pause();
	document.getElementById("music").currentTime = 0;
	document.getElementById("message").innerHTML = "You AFKed for too long.";
}

function updateGameState(data) {
	if (!gridStart) {
		gridStart = true;
	}
	gameGrid = data.grid;
	hold = data.hold;
	conveyor = data.conveyor;
	players = data.players
	linesArray = data.clears;
	scoreArray = data.score;
	timesLost = data.lost;
	changePlayerText();
}

function changePlayerText() {
	var playerString = '';
	players.forEach(function(p) {
		playerString = playerString + p.username + '</br>';
	});
	//document.getElementById("players").innerHTML = playerString;
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
	//ctx.resize();
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	var curpiece = getPiece();
	drawUI();
	if (cubs) {
		drawGridCubs();
	} else if (theTrump) {
		drawGridTrump();
	} else {
		drawGrid();
	}
	if (curpiece) {
		drawGhost(curpiece);
	}
	drawPlayerOutlines();
	drawHold();	
	drawConveyor();
	drawText();
}

function clearArea() {
	ctx.clearRect(150, 100, 600, 600);
	//ctx.clearRect()
}

function drawUI() {
	ctx.fillStyle = '#000000';
	ctx.drawImage(gameBackground, 100, 50);
	ctx.fillRect(10, 160, 105, 105);
	ctx.fillRect(10, 320, 105, 300);
	ctx.fillRect(785, 100, 105, 600);
	ctx.strokeStyle = "#012b3e"
	ctx.lineWidth = 10;
	drawRoundedRect(145, 95, 610, 610, 10);
	drawRoundedRect(5, 155, 115, 115, 10);
	drawRoundedRect(5, 315, 115, 310, 10);
	drawRoundedRect(780, 95, 115, 610, 10);
}

function drawText() {
	if (linesArray && scoreArray) {
	ctx.drawImage(holdText, 25, 125);
	ctx.drawImage(nextText, 800, 65);
	
	ctx.font = "13px Verdana";
	ctx.fillStyle = "white";
	ctx.textAlign = "center";
	var yPos = 350;
	var diff = 15;
	var multi = 1;
	if (theTrump) {
		multi = 1000000
	}
	if (theBern) {
		multi = 0.01
		ctx.fillText("Total Tax %:", 62, yPos); yPos += diff;
		ctx.fillText((linesArray[0] * multi).toFixed(2) + "%", 62, yPos); yPos += diff;
		ctx.fillText("Best Tax %:", 62, yPos); yPos += diff;
		ctx.fillText((linesArray[1] * multi).toFixed(2) + "%", 62, yPos); yPos += diff;
		ctx.fillText("Current Tax %:", 62, yPos); yPos += diff;
		ctx.fillText((linesArray[2] * multi).toFixed(2) + "%", 62, yPos); yPos += diff;
		ctx.fillText("Total Taxed:", 62, yPos); yPos += diff;
		ctx.fillText("$" + (scoreArray[0] * multi).toFixed(2), 62, yPos); yPos += diff;
		ctx.fillText("Best Taxed:", 62, yPos); yPos += diff;
		ctx.fillText("$" + (scoreArray[1] * multi).toFixed(2), 62, yPos); yPos += diff;
		ctx.fillText("Current Taxed:", 62, yPos); yPos += diff;
		ctx.fillText("$" + (scoreArray[2] * multi).toFixed(2), 62, yPos); yPos += diff;
		ctx.fillText("Taxes Lost:", 62, yPos); yPos += diff;
		ctx.fillText("$" + (timesLost * multi).toFixed(2), 62, yPos);
	} else if (cubs) {
		ctx.fillText("Total Wins:", 62, yPos); yPos += diff;
		ctx.fillText(linesArray[0], 62, yPos); yPos += diff;
		ctx.fillText("Most Wins:", 62, yPos); yPos += diff;
		ctx.fillText(linesArray[1], 62, yPos); yPos += diff;
		ctx.fillText("Season Wins:", 62, yPos); yPos += diff;
		ctx.fillText(linesArray[2], 62, yPos); yPos += diff;
		ctx.fillText("Total Runs:", 62, yPos); yPos += diff;
		ctx.fillText(scoreArray[0], 62, yPos); yPos += diff;
		ctx.fillText("Most Runs:", 62, yPos); yPos += diff;
		ctx.fillText(scoreArray[1], 62, yPos); yPos += diff;
		ctx.fillText("Season Runs:", 62, yPos); yPos += diff;
		ctx.fillText(scoreArray[2], 62, yPos); yPos += diff;
		ctx.fillText("Season:", 62, yPos); yPos += diff;
		ctx.fillText(timesLost + 1, 62, yPos);
	}
	else if (theTrump) {
		ctx.fillText("Total Profit:", 62, yPos); yPos += diff;
		ctx.fillText("$" + linesArray[0] * multi, 62, yPos); yPos += diff;
		ctx.fillText("Best Profit:", 62, yPos); yPos += diff;
		ctx.fillText("$" + linesArray[1] * multi, 62, yPos); yPos += diff;
		ctx.fillText("Current Profit:", 62, yPos); yPos += diff;
		ctx.fillText("$" + linesArray[2] * multi, 62, yPos); yPos += diff;
		ctx.fillText("Total Balance:", 62, yPos); yPos += diff;
		ctx.fillText("$" + scoreArray[0] * multi, 62, yPos); yPos += diff;
		ctx.fillText("Best Balance:", 62, yPos); yPos += diff;
		ctx.fillText("$" + scoreArray[1] * multi, 62, yPos); yPos += diff;
		ctx.fillText("Current Balance:", 62, yPos); yPos += diff;
		ctx.fillText("$" + scoreArray[2] * multi, 62, yPos); yPos += diff;
		ctx.fillText("Money Lost:", 62, yPos); yPos += diff;
		ctx.fillText("$" + timesLost * multi, 62, yPos);
	}
	else {
		ctx.fillText("Total Lines:", 62, yPos); yPos += diff;
		ctx.fillText(linesArray[0], 62, yPos); yPos += diff;
		ctx.fillText("Best Lines:", 62, yPos); yPos += diff;
		ctx.fillText(linesArray[1], 62, yPos); yPos += diff;
		ctx.fillText("Current Lines:", 62, yPos); yPos += diff;
		ctx.fillText(linesArray[2], 62, yPos); yPos += diff;
		ctx.fillText("Total Score:", 62, yPos); yPos += diff;
		ctx.fillText(scoreArray[0], 62, yPos); yPos += diff;
		ctx.fillText("Best Score:", 62, yPos); yPos += diff;
		ctx.fillText(scoreArray[1], 62, yPos); yPos += diff;
		ctx.fillText("Current Score:", 62, yPos); yPos += diff;
		ctx.fillText(scoreArray[2], 62, yPos); yPos += diff;
		ctx.fillText("Times Lost:", 62, yPos); yPos += diff;
		ctx.fillText(timesLost, 62, yPos);
	}
	if (players != undefined) {
		var yPos = 115;
		ctx.font = "12px Verdana";
		players.forEach(function(p) {
			ctx.fillStyle = outlineColors[p.playerNumber];
			ctx.fillText(p.username, 160 + 20 * p.spawnCol, yPos + (((p.spawnCol - 2) / 4) % 2) * 20);
		});
	}
	ctx.drawImage(title, 150, 10);
	}
}

function drawGhost(piece) {
	ctx.strokeStyle = "grey";
	ctx.lineWidth = 2;
	var q = piece.distanceToBottom;
	for (i = 0; i < 4; i++) {
		drawRoundedOutline(piece.blocks[i].col, piece.blocks[i].row + q, 160, 110);
	}
}

/*function drawHighlight(piece) {
	ctx.strokeStyle = "yellow";
	ctx.lineWidth = 2;
	var temp = piece.blockType;
	for (i = 0; i < 4; i++) {
		drawImage(piece.blocks[i].col, piece.blocks[i].row, 160, 110, imgArray[temp]);
		drawOutline(piece.blocks[i].col, piece.blocks[i].row, 160, 110);
	}
}

function drawHighlightTrump(piece) {
	ctx.strokeStyle = "yellow";
	ctx.lineWidth = 2;
	var temp = piece.blockType;
	for (i = 0; i < 4; i++) {
		var r = piece.blocks[i].row;
		var c = piece.blocks[i].col;
		drawImage(c, r, 160, 110, trumpArray[getTrumpColor(r, c)]);
		drawOutline(c, r, 160, 110);
	}
}*/

function getPiece() {
	var piece;
	
	if (players != undefined) {
		players.forEach(function(p) {
			if (p.playerId == playerId) {
				if (p.piece != undefined) {
					piece = p.piece;
				}
			}
		});
	}
	return piece;
}

function drawPlayerOutlines() {
	ctx.lineWidth = 2;
	for (i = 0; i < width; i++) {
		for (j = 0; j < height; j++) {
			var temp = gameGrid[i][j];
			if (temp >= 100) {
				ctx.strokeStyle = outlineColors[Math.floor(temp / 100)];
				drawOutline(j, i, 160, 110);
			}
		}
	}
}

function drawGrid() {
	ctx.lineWidth = 2;
	for (i = 0; i < width; i++) {
		for (j = 0; j < height; j++) {
			var temp = gameGrid[i][j];
			if (temp !== false && temp != -1) {
				drawImage(j, i, 160, 110, imgArray[temp % 100]);
			}
			else {
				if (i < 4) {
					drawImage(j, i, 160, 110, imgArray[8]);
				}
				else {
					drawImage(j, i, 160, 110, imgArray[7]);
				}
			}
		}
	}
}

function drawGridCubs() {
	ctx.lineWidth = 2;
	for (i = 0; i < width; i++) {
		for ( j = 0; j < height; j++) {
			var temp = gameGrid[i][j];
			if (temp !== false && temp != -1) {
				drawImage(j, i, 160, 110, trumpArray[getCubsColor(i, j)]);
			}
			else {
				if (i < 4) {
					drawImage(j, i, 160, 110, trumpArray[4]);
				}
				else {
					drawImage(j, i, 160, 110, trumpArray[3]);
				}
			}
		}
	}
}

function drawGridTrump() {
	ctx.lineWidth = 2;
	for (i = 0; i < width; i++) {
		for ( j = 0; j < height; j++) {
			var temp = gameGrid[i][j];
			if (temp !== false && temp != -1) {
				drawImage(j, i, 160, 110, trumpArray[getTrumpColor(i, j)]);
			}
			else {
				if (i < 4) {
					drawImage(j, i, 160, 110, trumpArray[4]);
				}
				else {
					drawImage(j, i, 160, 110, trumpArray[3]);
				}
			}
		}
	}
}

function getTrumpColor(row, col) {
	if (row <= 3) {
		return 1;
	}
	else if (row <= 17 && col <= 12) {
		if (7 <= row && row <= 15 && 1 <= col && col <= 11 && (row + col) % 2 == 0) {
			return 1;
		}
		return 2;
	}
	return Math.floor(row/2) % 2
}

function getCubsColor(row, col) {
	return cubsColors[row][col];
}

function drawHold() {
	if (hold != undefined) {
		var piece = hold.piece;
		if (piece || piece === 0) {
			if (theTrump) {
				drawPiece(piece, trumpArray[1], 2, 3, 10, 160);
			}
			else {
				drawPiece(piece, imgArray[piece], 2, 3, 10, 160);
			}
		}
	}
}

function drawConveyor() {
	if (conveyor != undefined) {
		var array = conveyor.pieces;
		for (i = 0; i < 5; i++) {
			if (theTrump) {
				drawPiece(array[i], trumpArray[1], 2, 5 + i * 6, 785, 60);
			}
			else {
				drawPiece(array[i], imgArray[array[i]], 2, 5 + i * 6, 785, 60);
			}
		}
	}
}

function drawPiece(blockType, image, x, y, marginX, marginY) {
	if (blockType == 0) {
		drawImage(x, y, marginX, marginY, image);
		drawImage(x + 1, y, marginX, marginY, image);
		drawImage(x + 2, y, marginX, marginY, image);
		drawImage(x - 1, y, marginX, marginY, image);
	}
	else if (blockType == 1) {
		drawImage(x + 1.5, y, marginX, marginY, image);
		drawImage(x - 0.5, y, marginX, marginY, image);
		drawImage(x + 0.5, y, marginX, marginY, image);
		drawImage(x - 0.5, y - 1, marginX, marginY, image);
	}
	else if (blockType == 2) {
		drawImage(x + 1.5, y, marginX, marginY, image);
		drawImage(x - 0.5, y, marginX, marginY, image);
		drawImage(x + 0.5, y, marginX, marginY, image);
		drawImage(x + 1.5, y - 1, marginX, marginY, image);
	}
	else if (blockType == 3) {
		drawImage(x, y, marginX, marginY, image);
		drawImage(x + 1, y, marginX, marginY, image);
		drawImage(x + 1, y - 1, marginX, marginY, image);
		drawImage(x, y - 1, marginX, marginY, image);
	}
	else if (blockType == 4) {
		drawImage(x + 0.5, y + 0.5, marginX, marginY, image);
		drawImage(x + 0.5, y - 0.5 , marginX, marginY, image);
		drawImage(x + 1.5, y - 0.5, marginX, marginY, image);
		drawImage(x - 0.5, y + 0.5, marginX, marginY, image);
	}
	else if (blockType == 5) {
		drawImage(x + 0.5, y, marginX, marginY, image);
		drawImage(x - 0.5, y, marginX, marginY, image);
		drawImage(x + 0.5, y - 1, marginX, marginY, image);
		drawImage(x + 1.5, y, marginX, marginY, image);
	}
	else if (blockType == 6) {
		drawImage(x + 0.5, y + 0.5, marginX, marginY, image);
		drawImage(x + 0.5, y - 0.5 , marginX, marginY, image);
		drawImage(x + 1.5, y + 0.5, marginX, marginY, image);
		drawImage(x - 0.5, y - 0.5, marginX, marginY, image);
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

function drawRoundedRect(x, y, w, h, r) {
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