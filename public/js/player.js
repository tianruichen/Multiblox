/*
Game Player Class
*/

var iNeedTheHeldPiece = 73;
var iNeedTheQueuePiece = 20;

var Player = function(username, id, spawnRow, spawnCol) {
	this.username = username;
	this.id = id;
	this.piece = null;
	this.canHold = true;
	this.spawnRow = spawnRow;
	this.spawnCol = spawnCol;
}

Player.update = function(grid, action, conveyor, hold) {
	if (action == "hold") {
		if (this.canHold) {
			this.canHold = false;
			this.piece = new Piece(grid, hold.getPiece(this.piece.blockType), this.spawnRow, this.spawnCol);
		}
	}
	else {
		var result;
		this.canHold = true;
		result = this.piece.update(grid, action);
		if (result) {
			this.piece = new Piece(grid, conveyor.getPiece(), this.spawnRow, this.spawnCol);
		}
	}
}

Player.receivePiece = function(grid, piece) {
	this.piece = new Piece(grid, piece, this.spawnRow, this.spawnCol);
}

Player.getSquares = function() {
	return this.piece.getSquares();
}

Player.setSpawn = function(newRow, newCol) {
	this.spawnRow = newRow;
	this.spawnCol = newCol;
}

if (typeof module !== "undefined") module.exports = Player;