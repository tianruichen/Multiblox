var canvas,
	ctx,
	player;

function init() {
	canvas = document.getElementById("gameCanvas");
	ctx = canvas.getContext("2d");
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	socket = io.connect('http://localhost:8000/');
	setEventHandlers();
}

function setEventHandlers() {
	window.addEventListener("keydown", onKeydown, false);
	window.addEventListener("resize", onResize, false);
	socket.on("connect", onSocketConnected);
	socket.on("disconnect", onSocketDisconnect);
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
	if (d) socket.emit("keypress", {key: d});
}

function onResize(e) {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
};

function onSocketConnected() {
	console.log("Connected to socket server");
}

function onSocketDisconnect() {
	console.log("Disconnected from socket server");
}


function animate() {
	draw();
}

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}