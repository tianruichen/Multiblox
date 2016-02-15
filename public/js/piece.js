/*
Piece class
*/
var Block = require("./block");

//How many frames the block can be suspended before moving down
var defaultDelay = 20;

var Piece = function(grid, blockType, row, col) {
	this.blockType = blockType
	this.row = row;
	this.col = col;
	this.fallDelay = 20;
	//An array of 4 blocks
	this.blocks = [new Block(row, col, blockType)]
	// I Block
	if (blockType == 0) {
		this.blocks.push(new Block(row + 1, col, blockType));
		this.blocks.push(new Block(row + 2, col, blockType));
		this.blocks.push(new Block(row - 1, col, blockType));   
	}
	// J block
	else if (blockType == 1) {
		this.blocks.push(new Block(row, col - 1, blockType));
		this.blocks.push(new Block(row, col + 1, blockType));
		this.blocks.push(new Block(row + 1, col + 1, blockType));
	}
	// L block
	else if (blockType == 2) {
		this.blocks.push(new Block(row, col + 1, blockType));
		this.blocks.push(new Block(row, col - 1, blockType));
		this.blocks.push(new Block(row + 1, col - 1, blockType));
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
	for (var i = 0; i < 4; i++) {
		grid[this.blocks[i].row][this.blocks[i].col] = -1;
	}

	var result = true;

	//Special case for hard drops
	if (action == "hard drop") {
		var minDist = 999;
		//Gets the number of rows until the first piece hits the "ground"
		for (var i = 0; i < 4; i++) {
			var temp = this.blocks[i].distToBot(grid);
			if (this.blocks[i].distToBot(grid) < min) {
				minDist = temp;
			}
		}
		//Checks if all the grid spaces are empty if all blocks move down /min/ rows
		var drop = true;
		for (var i = 0; i < 4; i++) {
			if (grid[this.blocks[i].row + min][this.col] != -1) {
				drop = false;
				break;
			}
		}

		//Drops all the pieces
		if (drop) {
			for (var i = 0; i < 4; i++) {
				this.blocks[i].hardDrop(min);
			}
			this.putPiecesInGrid(grid);
			return true;
		}
	}

	//Handles soft drop (not implemented yet)
	/*else if (action == "down") {
		this.fallDelay = -1;
	}*/

	//Every other user-input action
	else if (action != "") {
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
			this.putPiecesInGrid(grid);
			return true;
		}
	}

	this.row = this.blocks[0].row;
	this.col = this.blocks[0].col;

	this.fallDelay -= 1;

	this.putPiecesInGrid(grid);
	return false;
}

Piece.prototype.putPiecesInGrid = function(grid) {

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

if (typeof module !== "undefined") module.exports = Piece;