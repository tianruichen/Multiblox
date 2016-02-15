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
	this.nextInput = "";
	this.newPiece = function(grid, num) {
		this.piece = new Piece(grid, num, this.spawnRow, this.spawnCol);
	} 
}

Player.prototype.update = function(grid, conveyor, hold) {
	if (this.nextInput == "hold") {
		if (this.canHold) {
			this.canHold = false;
			var oldBlock = this.piece.blockType;
			this.removePiece(grid);
			this.newPiece(grid, hold.getPiece(oldBlock));
			if (!this.piece) {
				this.piece = new Piece(grid, conveyor.getPiece);
			}
		}
	}
	else {
		var result;
		result = this.piece.update(grid, this.nextInput);
		if (result) {
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

			this.nextInput = "";
			return [min, max];
		}
	}
	this.nextInput = "";
	return false;
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