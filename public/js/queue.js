/*
Queue Class
*/

var Queue = function(num) {
	this.pieces = new Array(num);
	for (var i = 0; i < num; i++) {
		this.pieces[i] = getRandomInt(0, 7);
	}
}

Queue.getPiece = function() {
	this.pieces.push(getRandomInt(0, 7));
	return this.pieces.shift();
}

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min) + min);
}

if (typeof module !== "undefined") module.exports = Queue;