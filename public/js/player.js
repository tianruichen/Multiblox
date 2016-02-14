/*
Game Player Class
*/

var iNeedTheHeldPiece = 73;
var iNeedTheQueuePiece = 20;

var Player = function(username, id) {
	this.username = username;
	this.id = id;
	this.piece = null;
	this.canHold = true;
}

Player.update = function(grid, action, conveyor) {
	if (action == "hold") {
		if (this.canHold) {
			this.canHold = false;
			return iNeedTheHeldPiece
		}
	}
	else {
		var result;
		this.canHold = true;
		result = this.piece.update(grid, action);
		if (result) {
			this.piece = conveyor.getPiece();
		}
	}
}

Player.getSquares = function() {
	return this.piece.getSquares();
}

if (typeof module !== "undefined") module.exports = Player;