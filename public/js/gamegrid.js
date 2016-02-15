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

Game.prototype.checkClear = function(start, stop, players) {

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

		var pieces = [];
		for (var i = 0; i < players.length; i++) {
			pieces.push(players[i].piece);
		}

		for (var i = 0; i < pieces.length; i++) {
			pieces[i].removeFromGrid(this.grid);
		}

		var curFall = 0;
		var curRow = stop;
		var block;
		while (curRow >= 5) {
			if (filledRows.indexOf(curRow) != -1) {
				for (var i = 0; i < numCols; i++) {
					this.grid[curRow][i] = -1;
				}
				curFall += 1;
			}
			else {
				if (curFall > 0) {
					for (var i = 0; i < numCols; i++) {
						block = this.grid[curRow][i];
						if (block != -1 && block.landed == 1) {
							this.grid[curRow + curFall][i] = this.grid[curRow][i];
							this.grid[curRow][i] = -1;
						}
					}
				}
			}
			curRow -= 1;
		}
		var badpieces;
		var cont = true;
		var squares;
		while (cont) {
			cont = false;
			badpieces = [];
			var i = 0;
			while (i < pieces.length) {
				squares = pieces[i].getSquares();
				for (var j = 0; j < 4; j++) {
					if (this.grid[squares[j][0]][squares[j][1]] != -1) {
						badpieces.push(pieces.splice(i, 1)[0]);
						cont = true;
						j = 4;
					}
					else {
						i += 1;
					}
				}
			}
			var jump = 0;

			console.log(badpieces);

			for (var i = 0; i < badpieces.length; i++) {
				
				while (filledRows[jump] < badpieces[i].row) {
					jump += 1;
				}
				jump = filledRows.length - jump;

				badpieces[i].jumpDown(this.grid, jump);
				badpieces[i].putInGrid(this.grid);
			}
		}

		for (var i = 0; i < pieces.length; i++) {
			pieces[i].putInGrid(this.grid);
		}
	}
}

if (typeof module !== "undefined") module.exports = Game;