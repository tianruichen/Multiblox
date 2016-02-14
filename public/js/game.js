function init() {
	socket = io.connect('http://localhost:8000/');
	setEventHandlers();
}

function setEventHandlers() {
	//socket.on("connect", onSocketConnected);
	socket.on("disconnect", onSocketDisconnect);
};

function onSocketConnected() {
	console.log("Connected to socket server");
};

function onSocketDisconnect() {
	console.log("Disconnected from socket server");
};