/*
Piece class
*/
var Block = require("./block");

//How many frames the block can be suspended before moving down
var defaultDelay = 20;
var softDropDelay = 0;

var Piece = function(grid, blockType, row, col) {
	this.blockType = blockType
	this.row = row;
	this.col = col;
	this.orientation = 0;
	this.fallDelay = 20;
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

Piece.prototype.update = function(grid, action) {
	//Returns true if the block has landed on the "ground"
	//Returns false if the block is still in play

	//Removes the piece from the grid
	//Gets placed back in the grid before the update function returns
	this.removeFromGrid(grid);

	var result = true;

	//Special case for hard drops
	if (action == "hard drop") {
		var minDist = this.distToBot(grid);
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
			return true;
		}
	}

	//Special case for soft drops
	else if (action == "soft drop") {
		if (this.fallDelay > softDropDelay) {
			this.fallDelay = softDropDelay;
		}
	}

	//Makes sure action isn't nothing
	else if (action != "") {
		//O Blocks can't rotate
		if (this.blockType != 3 || (action != "cw" && action != "ccw")) {
			for (var i = 0; i < 4; i++) {
				if (this.blocks[i].checkEmpty(grid, action, this.row, this.col) != -1) {
					result = false;
					break;
				}
			}
			if (result) {
				for (var i = 0; i < 4; i++) {
					this.blocks[i].move();
				}
			}
		}
	}

	//Checks if the piece needs to move down
	if (this.fallDelay < 0) {
		result = -1;
		//Checks what kind of pieces are one row below the piece
		for (var i = 0; i < 4; i++) {
			var temp = this.blocks[i].checkEmpty(grid, "down", this.row, this.col);
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
		}
		//The piece should have landed and be out of play
		else if (result == 1) {
			for (var i = 0; i < 4; i++) {
				this.blocks[i].landed = 1;
			}
			this.putInGrid(grid);
			return true;
		}
	}

	this.row = this.blocks[0].row;
	this.col = this.blocks[0].col;

	//Only decrements the fallDelay if the action passed in was nothing
	if (action == "") {
		this.fallDelay -= 1;
	}

	this.putInGrid(grid);
	return false;
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