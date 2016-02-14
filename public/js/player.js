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

Player.update = function(action) {
	if (action == "hold") {
		if (this.canHold) {
			return iNeedTheHeldPiece
		}
	}
	var result;

	else {
		result = this.piece.update(grid, action);
		if (result) {
			return iNeedTheQueuePiece;
		}
	}
}