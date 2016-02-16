/*
Game Player Class
*/

var Piece = require("./piece");
var longDelay = 5;
var shortDelay = 1;

var Player = function(username, id, spawnRow, spawnCol) {
	this.username = username;
	this.playerId = id;
	this.piece = null;
	this.canHold = true;
	this.spawnRow = spawnRow;
	this.spawnCol = spawnCol;
	this.leftDelay = 0;
	this.rightDelay = 0;
	this.longLeft = true;
	this.longRight = true;
	this.heldKeys = [false, false, false];
}

Player.prototype.update = function(grid, conveyor, hold, action) {
	if (this.heldKeys[0]) {
		this.rightDelay = 0;
		this.longRight = true;
		if (this.leftDelay <= 0) {
			this.piece.translate(grid, "left");
			if (this.longLeft) {
				this.leftDelay = longDelay;
				this.longLeft = false;
			}
			else {
				this.leftDelay = shortDelay;
			}
		}
		else {
			this.leftDelay -= 1;
		}
	}
	else if (this.heldKeys[1]) {
		this.leftDelay = 0
		this.longLeft = true;
		if (this.rightDelay <= 0) {
			this.piece.translate(grid, "right");
			if (this.longRight) {
				this.rightDelay = longDelay;
				this.longRight = false;
			}
			else {
				this.rightDelay = shortDelay;
			}
		}
		else {
			this.rightDelay -= 1;
		}
	}
	else {
		this.leftDelay = 0;
		this.rightDelay = 0;
		this.longLeft = true;
		this.longRight = true;
	}
	if (this.heldKeys[2]) {
		this.piece.softDrop(grid);
	}

	var result;
	result = this.piece.update(grid);
	if (result) {
		return this.lockIn(grid, conveyor);
	}
	return false;
}

Player.prototype.rotate = function(grid, direction) {
	this.piece.rotate(grid, direction);
}

Player.prototype.holdPiece = function(grid, conveyor, hold) {
	if (this.canHold) {
		this.canHold = false;
		var oldPiece = this.piece.blockType;
		this.removePiece(grid);
		var next = hold.getPiece(oldPiece);
		if (next === false) {
			next = conveyor.getPiece();
		}
		this.newPiece(grid, next);
	}
}

Player.prototype.hardDrop = function(grid, conveyor) {
	var result = this.piece.hardDrop(grid);
	if (result) {
		return this.lockIn(grid, conveyor);
	}
}

Player.prototype.lockIn = function(grid, conveyor) {
	this.canHold = true;
	squares = this.getSquares();
	var min = squares[0][0];
	var max = min;
	for (var i = 1; i < 4; i++) {
		if (min > squares[i][0]) {
			min = squares[i][0];
		}
		else if (max < squares[i][0]) {
			max = squares[i][0];
		}
	}

	this.newPiece(grid, conveyor.getPiece());

	return [min, max];
}

Player.prototype.newPiece = function(grid, num) {
	this.piece = new Piece(grid, num, this.spawnRow, this.spawnCol);
}

Player.prototype.getSquares = function() {
	return this.piece.getSquares();
}

Player.prototype.removePiece = function(grid) {
	var squares = this.piece.getSquares();
	var r, c;
	for (var i = 0; i < 4; i++) {
		r = squares[i][0];
		c = squares[i][1];
		grid[r][c] = -1;
	}
	this.piece = null;
}

Player.prototype.setSpawn = function(newRow, newCol) {
	this.spawnRow = newRow;
	this.spawnCol = newCol;
}

Player.prototype.getGhost = function(grid) {
	return this.piece.getGhostSquares(grid);
}

if (typeof module !== "undefined") module.exports = Player;