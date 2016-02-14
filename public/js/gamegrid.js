/*
Game Grid Class
*/

var numRows = 30;
var numCols = 30;

var Game = function() {
	this.players = [];

	//Initializes a grid with numRows rows and numCols columns
	//Sets all of the elements to 0
	this.grid = new Array(numRows);
	for (var i = 0; i < numRows; i++) {
		this.grid[i] = new Array(numCols);
	}

	for (var i = 0; i < this.grid.length; i++) {
		for (var j = 0; i < this.grid[0].length; j++) {
			this.grid[i][j] = 0;
		}
	}
}