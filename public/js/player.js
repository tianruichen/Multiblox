/*
Game Player Class
*/

var iNeedTheHeldPiece = 73;
var iNeedTheQueuePiece = 20;
var Piece = require("./piece")

var Player = function(username, id, spawnRow, spawnCol) {
	this.username = username;
	this.playerId = id;
	this.piece = null;
	this.canHold = true;
	this.spawnRow = spawnRow;
	this.spawnCol = spawnCol;
	this.newPiece = function(grid, num) {
		this.piece = new Piece(grid, num, this.spawnRow, this.spawnCol);
	} 
}

Player.prototype.update = function(grid, action, conveyor, hold) {
	if (action == "hold") {
		if (this.canHold) {
			this.canHold = false;
			var oldBlock = this.piece.blockType;
			this.removePiece(grid);
			this.newPiece(grid, hold.getPiece(oldBlock));
		}
	}
	else {
		var result;
		this.canHold = true;
		result = this.piece.update(grid, action);
		if (result) {
			this.newPiece(grid, conveyor.getPiece());
		}
	}
}

Player.prototype.receivePiece = function(grid, piece) {
	this.piece = new Piece(grid, piece, this.spawnRow, this.spawnCol);
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

if (typeof module !== "undefined") module.exports = Player;