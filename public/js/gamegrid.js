/*
Game Grid Class
*/

var numRows = 30;
var numCols = 30;

var Game = function() {

	//Initializes a grid with numRows rows and numCols columns
	//Sets all of the elements to 0
	this.grid = new Array(numRows);
	this.empty = -1;

	for (var i = 0; i < numRows; i++) {
		this.grid[i] = new Array(numCols);
	}

	for (var i = 0; i < this.grid.length; i++) {
		for (var j = 0; j < this.grid[0].length; j++) {
			this.grid[i][j] = this.empty;
		}
	}
}

Game.prototype.checkClear = function(start, stop) {
	var filledRows = [];
	var clear;
	for (var i = start; i <= stop; i++) {
		clear = true;
		for (var j = 0; j <= numCols; j++) {
			if (this.grid[i][j] == this.empty) {
				clear = false;
				break;
			}
		}
		if (clear) {
			filledRows.unshift(i);
		}
	}

	if (filledRows.length > 0) {
		var curFall = 0;
		var curRow = stop;
		while (curRow >= 5) {
			if (filledRows.indexOf(curRow) != -1) {
				for (var i = 0; i < numCols; i++) {
					this.grid[r][i] = this.empty;
				}
				curFall += 1;
			}
			else {
				if (curFall > 0) {
					for (var i = 0; i < numCols; i++) {
						this.grid[curRow + curFall][i] = this.grid[curRow][i];
						this.grid[curRow][i] = this.empty;
					}
				}
			}
			curRow -= 1;
		}
	}
}

if (typeof module !== "undefined") module.exports = Game;