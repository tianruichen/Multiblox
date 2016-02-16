/*
Queue Class
*/
//0125

var Queue = function(num) {
	this.currentBag = [0, 1, 2, 5, 3, 4, 6];
	this.pieces = new Array(num);
	this.pieces[0] = this.currentBag.splice(getRandomInt(0, 4), 1)[0];
	for (var i = 1; i < num; i++) {
		this.pieces[i] = this.getPieceFromBag();
	}
}

Queue.prototype.getPiece = function() {
	this.pieces.push(this.getPieceFromBag());
	return this.pieces.shift();
}

Queue.prototype.getPieceFromBag = function() {
	var n = this.currentBag.splice(getRandomInt(0, this.currentBag.length), 1)[0];
	if (this.currentBag.length === 0) {
		this.currentBag = [0, 1, 2, 3, 4, 5, 6];
	}
	return n;
}

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min) + min);
}

if (typeof module !== "undefined") module.exports = Queue;