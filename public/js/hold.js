var Hold = function() {
	this.piece = false;
}

Hold.getPiece = function(newPiece) {
	var rv = this.piece;
	this.piece = newPiece;
	return rv;
}

if (typeof module !== "undefined") module.exports = Hold;