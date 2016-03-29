/*
Game Grid Class
*/

var numRows = 30;
var numCols = 30;

var Game = function() {

	//Initializes a grid with numRows rows and numCols columns
	//Sets all of the elements to 0
	this.score = [0];
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

	//start, stop:
	//the highest and lowest row that needs to be checked,
	//since a piece only occupies a certain number of rows when placed

	var filledRows = []; //Stores rows that need to be cleared
	var clear;

	//Checks the necessary rows
	for (var i = start; i <= stop; i++) {
		clear = true;
		for (var j = 0; j < numCols; j++) {
			if (this.grid[i][j] == this.empty || this.grid[i][j].landed == 0) {
				clear = false;
				break;
			}
		}
		if (clear) {
			filledRows.unshift(i);
		}
	}

	//At least one row was cleared
	if (filledRows.length > 0) {

		var pieces = []; //Stores all the pieces currently in play
		for (var i = 0; i < players.length; i++) {
			if (players[i].piece) {
				pieces.push(players[i].piece);
			}
		}

		//Temporarily remove every piece in play from the grid
		for (var i = 0; i < pieces.length; i++) {
			pieces[i].removeFromGrid(this.grid);
		}

		//Counter to keep track of how many rows have been cleared
		//Each row that hasn't been cleared needs to move down curFall rows
		var curFall = 0;
		var curRow = stop;
		var block;

		//Goes through every single non-game-over row
		while (curRow >= 0) {
			//If a row is filled, deletes all blocks in the row
			if (filledRows.indexOf(curRow) != -1) {
				for (var i = 0; i < numCols; i++) {
					this.grid[curRow][i] = -1;
				}
				curFall += 1;
			}
			else {
				//Otherwise, move the entire row down
				//the necessary number of rows
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
		/*Every iteration:
		1) 	Check which (if any) players' pieces overlap with any already
			placed blocks now that some rows have been cleared
		2) 	If a block now overlaps with a placed block,
			look at where the center of the piece is to determine
			how many rows it needs to move down by comparing the center
			with the lines that were cleared
		3)	Move all the overlapped block down however many rows
			and place it back in the grid
		4)	Keep repeating this process until there are no blocks that
			got overlapped in the previous iteration
		5)	Place all the remaining pieces back in the grid*/

		while (cont) { // 4
			cont = false;
			badpieces = [];
			var i = 0;
			while (i < pieces.length) {
				squares = pieces[i].getSquares();
				//1 start
				for (var j = 0; j < 4; j++) {
					if (this.grid[squares[j][0]][squares[j][1]] != -1) {
						badpieces.push(pieces.splice(i, 1)[0]);
						cont = true;
						j = 4;
					}
				}

				i += 1;
				//1 end
			}
			var jump = 0;
			//2 start
			for (var i = 0; i < badpieces.length; i++) {
				
				while (filledRows[jump] < badpieces[i].row) {
					jump += 1;
				}
				jump = filledRows.length - jump;
			//2 end

			//3 start
				badpieces[i].jumpDown(this.grid, jump);
				badpieces[i].putInGrid(this.grid);
			//3 end
			}
		}

		//5 start
		for (var i = 0; i < pieces.length; i++) {
			pieces[i].putInGrid(this.grid);
		}
		//5 end
		return filledRows.length;
	}
	return 0;
}

Game.prototype.checkLose = function() {
	var lose = 0;
	var line = this.grid[3];
	line.forEach(function(b) {
		if (b != -1) {
			if (b.landed == 1) {
				lose = 1;
			}
		}
	});
	return lose;
}

Game.prototype.clearGrid = function() {
	for (i = 0; i < numRows; i++) {
		for (j = 0; j < numCols; j++) {
			if (this.grid[i][j] != -1) {
				if (this.grid[i][j].landed == 1) {
					this.grid[i][j] = -1
				}
			}
		}
	}
}

if (typeof module !== "undefined") module.exports = Game;