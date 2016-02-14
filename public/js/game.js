var canvas,
	ctx;

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
	switch (e.keyCode) {
		case 37: console.log('left'); break;
		case 38: console.log('up'); break;
		case 39: console.log('right'); break;
		case 40: console.log('down'); break;
	}
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