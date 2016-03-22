/*
Piece class
*/
var Block = require("./block");

//How many frames the block can be suspended before moving down
var defaultDelay = 20;
var softDropDelay = 0;
var juggleDelay = 20;

var Piece = function(grid, blockType, row, col) {
	this.blockType = blockType
	this.row = row;
	this.col = col;
	this.orientation = 0;
	this.fallDelay = defaultDelay;
	this.groundActions = 20 - Math.floor(defaultDelay / 4);
	this.distanceToBottom = 0;
	this.tSpin = false;
	//An array of 4 blocks
	this.blocks = [new Block(row, col, blockType)]
	// I Block
	if (blockType == 0) {
		this.blocks.push(new Block(row, col - 1, blockType));
		this.blocks.push(new Block(row, col + 1, blockType));
		this.blocks.push(new Block(row, col + 2, blockType));
	}
	// J block
	else if (blockType == 1) {
		this.blocks.push(new Block(row, col + 1, blockType));
		this.blocks.push(new Block(row, col - 1, blockType));
		this.blocks.push(new Block(row - 1, col - 1, blockType));
	}
	// L block
	else if (blockType == 2) {
		this.blocks.push(new Block(row, col - 1, blockType));
		this.blocks.push(new Block(row, col + 1, blockType));
		this.blocks.push(new Block(row - 1, col + 1, blockType));
	}
	//O block
	else if (blockType == 3) {
		this.blocks.push(new Block(row - 1, col, blockType));
		this.blocks.push(new Block(row - 1, col + 1, blockType));
		this.blocks.push(new Block(row, col + 1, blockType));
	}
	//S block
	else if (blockType == 4) {
		this.blocks.push(new Block(row, col - 1, blockType));
		this.blocks.push(new Block(row - 1, col, blockType));
		this.blocks.push(new Block(row - 1, col + 1, blockType));
	}
	//T block
	else if (blockType == 5) {
		this.blocks.push(new Block(row, col - 1, blockType));
		this.blocks.push(new Block(row - 1, col, blockType));
		this.blocks.push(new Block(row, col + 1, blockType));
	}
	//Z block
	else if (blockType == 6) {
		this.blocks.push(new Block(row, col + 1, blockType));
		this.blocks.push(new Block(row - 1, col, blockType));
		this.blocks.push(new Block(row - 1, col - 1, blockType));
	}

	//Places the piece in the grid
	for (var i = 0; i < 4; i++) {
		grid[this.blocks[i].row][this.blocks[i].col] = this.blocks[i];
	}
}

Piece.prototype.update = function(grid) {
	//Returns true if the block has landed on the "ground"
	//Returns false if the block is still in play

	//Removes the piece from the grid
	//Gets placed back in the grid before the update function returns
	this.removeFromGrid(grid);

	var result;

	//Checks if the piece needs to move down
	if (this.fallDelay <= 0) {
		result = -1;
		//Checks what kind of pieces are one row below the piece
		for (var i = 0; i < 4; i++) {
			var temp = this.blocks[i].checkTranslation(grid, "down");
			if (temp > result) {
				result = temp;
			}
		}
		//Moves all pieces down one if all the spaces below are empty
		if (result == -1) {
			this.fallDelay = defaultDelay;
			for (var i = 0; i < 4; i++) {
				this.blocks[i].move();
			}
			this.groundTimer(grid);
			this.row = this.blocks[0].row;
			this.col = this.blocks[0].col;
			this.putInGrid(grid);
			this.distanceToBottom = this.distToBot(grid);
			this.tSpin = false;
			return [false, 1, false];
		}
		//The piece should have landed and be out of play
		else if (result == 1) {
			for (var i = 0; i < 4; i++) {
				this.blocks[i].landed = 1;
			}
			this.putInGrid(grid);

			return [true, 0, this.tSpin];
		}
	}

	this.row = this.blocks[0].row;
	this.col = this.blocks[0].col;

	this.fallDelay -= 1
	this.putInGrid(grid);
	this.distanceToBottom = this.distToBot(grid);

	return [false, 0, false];
}

Piece.prototype.hardDrop = function(grid) {
	var minDist = this.distToBot(grid);
	this.removeFromGrid(grid);

	//Checks if all the grid spaces are empty if all blocks move down /min/ rows
	var drop = true;
	for (var i = 0; i < 4; i++) {
		if (grid[this.blocks[i].row + minDist][this.blocks[i].col] != -1) {
			drop = false;
			break;
		}
	}

	//Drops all the blocks
	if (drop) {
		for (var i = 0; i < 4; i++) {
			this.blocks[i].hardDrop(grid, minDist);
		}
		this.putInGrid(grid);

		return [true, minDist*2, this.tSpin];
	}
	this.putInGrid(grid);
	return [false, 0, false];
}

Piece.prototype.checkTSpin = function(grid) {
	var r = this.blocks[0].row;
	var c = this.blocks[0].col;
	if (r < grid.length - 1) {
		numCorners = 0;
		for (var i = -1; i < 2; i += 2) {
			for (var j = -1; j < 2; j += 2) {
				temp = grid[r + i][c + j];
				if (temp === undefined || (temp != -1 && temp.landed == 1)) {
					numCorners += 1;
				}
			}
		}
		if (numCorners >= 3) {
			var d;
			if (this.orientation == 0) {
				d = [[-1, -1], [-1, 1]];
			}
			else if (this.orientation == 1) {
				d = [[-1, 1], [1, 1]];
			}
			else if (this.orientation == 2) {
				d = [[1, -1], [1, 1]];
			}
			else {
				d = [[-1, -1], [1, -1]];
			}
			if (grid[d[0][0] + r][d[0][1] + c] == -1 || grid[d[1][0] + r][d[1][1] + c] == -1) {
				return 1;
			}
			return 2;
		}
	}
	else {
		var q = 0;
		if (grid[r - 1][c - 1] == -1) {
			q += 1;
		}
		if (grid[r - 1][c + 1] == -1) {
			q += 1;
		}
		return q;
	}
	return false;
}

Piece.prototype.rotate = function(grid, direction) {
	this.removeFromGrid(grid);
	result = true;
	if (this.blockType != 3) {
		var WK = new Array(4);
		for (var i = 0; i < 4; i++) {
			WK[i] = this.blocks[i].checkRotation(grid, direction, this.row, 
												this.col, this.orientation);
		}
		for (var i = 0; i < 5; i++) {
			if (WK[0][i] == -1 && WK[1][i] == -1 &&
				WK[2][i] == -1 && WK[3][i] == -1) {
				var k = 1;
				if (direction == "cw") {
					k = 0;
				}
				for (var j = 0; j < 4; j++) {
					this.blocks[j].wallKickMove(this.orientation*2 + k, i);
				}
				this.orientation += (k*(-2) + 1);
				this.orientation = (this.orientation + 4) % 4;
				this.groundTimer(grid);
				if (this. blockType == 5) {
					this.tSpin = this.checkTSpin(grid);
				}
				break;
			}
		}
	}
	this.putInGrid(grid);
}

Piece.prototype.translate = function(grid, direction) {
	this.removeFromGrid(grid);
	var result = true;
	for (var i = 0; i < 4; i++) {
		if (this.blocks[i].checkTranslation(grid, direction) != -1) {
			result = false;
			break;
		}
	}
	if (result) {
		for (var i = 0; i < 4; i++) {
			this.blocks[i].move();
		}
		this.groundTimer(grid);
		this.tSpin = false;
	}
	this.putInGrid(grid);
}

Piece.prototype.groundTimer = function(grid) {
	if (this.distToBot(grid) == 0) {
		this.groundActions -= 1;
		if (this.groundActions > 0) {
			this.fallDelay = juggleDelay;
		}
	}
	else {
		if (this.fallDelay > defaultDelay) {
			this.fallDelay = defaultDelay;
		}
	}
}

Piece.prototype.softDrop = function(grid) {
	if (this.fallDelay > softDropDelay && this.distToBot(grid) > 0) {
		this.fallDelay = softDropDelay;
	}
}

Piece.prototype.removeFromGrid = function(grid) {
	for (var i = 0; i < 4; i++) {
		grid[this.blocks[i].row][this.blocks[i].col] = -1;
	}
}

Piece.prototype.putInGrid = function(grid) {

	for (var i = 0; i < 4; i++) {
		grid[this.blocks[i].row][this.blocks[i].col] = this.blocks[i];
	}
}

Piece.prototype.getSquares = function() {
	var squares = [];
	for (var i = 0; i < 4; i++) {
		squares.push([this.blocks[i].row, this.blocks[i].col]);
	}
	return squares;
}

Piece.prototype.getGhostSquares = function(grid) {
	var dist = this.distToBot(grid);
	var squares = [];
	for (var i = 0; i < 4; i++) {
		squares.push([this.blocks[i].row + dist, this.blocks[i].col]);
	}
	return squares;
}

Piece.prototype.distToBot = function(grid) {
	var minDist = 999;
	//Gets the number of rows until the first piece hits the "ground"
	for (var i = 0; i < 4; i++) {
		var temp = this.blocks[i].distToBot(grid);
		if (temp < minDist) {
			minDist = temp;
		}
	}
	return minDist;
}

//Special function to handle really really ugly stuff
//happening when lines get cleared since it's multiplayer
Piece.prototype.jumpDown = function(grid, num) {
	this.blocks.forEach(function(b) {
		b.row += num;
	});
	this.row += 1;
}

if (typeof module !== "undefined") module.exports = Piece;