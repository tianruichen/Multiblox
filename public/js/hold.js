var Hold = function() {
	this.piece = null;
}

Hold.getPiece = function(newPiece) {
	var rv = this.piece;
	this.piece = newPiece;
	return rv;
}