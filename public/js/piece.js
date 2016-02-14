/*
Piece class
*/

//How many frames the block can be suspended before moving down
var defaultDelay = 20;

//Colors for the different kinds of blocks
var colors = ["#FFFFFF",
			  "#DDDDDD",
			  "#BBBBBB",
			  "#999999",
			  "#777777",
			  "#555555",
			  "#333333"];

var Piece = function(grid, blockType, row, col) {
	this.row = row;
	this.col = col;
	this.fallDelay = 20;
	fill = colors[blockType];
	//An array of 4 blocks
	this.blocks = [Block(row, col, fill)]
	// I Block
	if (blockType == 0) {
		this.blocks.push(Block(row + 1, col, fill));
		this.blocks.push(Block(row + 2, col, fill));
		this.blocks.push(Block(row - 1, col, fill));   
	}
	// J block
	else if (blockType == 1) {
		this.blocks.push(Block(row, col - 1, fill));
		this.blocks.push(Block(row, col + 1, fill));
		this.blocks.push(Block(row + 1, col + 1, fill));
	}
	// L block
	else if (blockType == 2) {
		this.blocks.push(Block(row, col + 1, fill));
		this.blocks.push(Block(row, col - 1, fill));
		this.blocks.push(Block(row + 1, col - 1, fill));
	}
	//O block
	else if (blockType == 3) {
		this.blocks.push(Block(row - 1, col, fill));
		this.blocks.push(Block(row - 1, col + 1, fill));
		this.blocks.push(Block(row, col + 1, fill));
	}
	//S block
	else if (blockType == 4) {
		this.blocks.push(Block(row, col - 1, fill));
		this.blocks.push(Block(row - 1, col, fill));
		this.blocks.push(Block(row - 1, col + 1, fill));
	}
	//T block
	else if (blockType == 5) {
		this.blocks.push(Block(row, col - 1, fill));
		this.blocks.push(Block(row - 1, col, fill));
		this.blocks.push(Block(row, col + 1, fill));
	}
	//Z block
	else if (blockType == 6) {
		this.blocks.push(Block(row, col + 1, fill));
		this.blocks.push(Block(row - 1, col, fill));
		this.blocks.push(Block(row - 1, col - 1, fill));
	}

	//Places the piece in the grid
	for (var i = 0; i < 4; i++) {
		grid[this.blocks[i].row][this.blocks[i].col] = this.blocks[i];
	}
}

Piece.update = function(grid, action) {

	//Returns true if the block has landed on the "ground"
	//Returns false if the block is still in play

	//Removes the piece from the grid
	//Gets placed back in the grid before the update function returns
	for (var i = 0; i < 4; i++) {
		grid[this.blocks[i].row][this.blocks[i].col] = 0;
	}

	var result = true;

	//Special case for hard drops
	if (action == "hard drop") {
		var min = 999;
		//Gets the number of rows until the first piece hits the "ground"
		for (var i = 0; i < 4; i++) {
			var temp = this.blocks[i].getBottom(grid);
			if (this.blocks[i].getBottom(grid) < min) {
				min = temp;
			}
		}
		//Checks if all the grid spaces are empty if all blocks move down /min/ rows
		var drop = true;
		for (var i = 0; i < 4; i++) {
			if (grid[this.blocks[i].row + min][this.col] != 0) {
				drop = false;
				break;
			}
		}

		//Drops all the pieces
		if (drop) {
			for (var i = 0; i < 4; i++) {
				this.blocks[i].hardDrop(min);
			}
			this.putPiecesInGrid();
			return true;
		}
	}

	//Every other user-input action
	else if (action != "") {
		for (var i = 1; i < 4; i++) {
			if (this.blocks[i].checkEmpty(grid, action, this.row, this.col) != -1) {
				result = false;
				break;
			}
			if (result) {
				for (var i = 1; i < 4; i++) {
					this.blocks[i].move();
				}
				if (action == "down") {
					this.fallDelay = defaultDelay;
				}
			}
		}
	}

	//Checks if the piece needs to move down
	if (this.fallDelay < 0) {
		result = -1;
		//Checks what kind of pieces are one row below the piece
		for (var i = 1; i < 4; i++) {
			var temp = this.blocks[i].checkEmpty(grid, "down", this.row, this.col);
			if (temp > result) {
				result = temp;
			}
		}
		//Moves all pieces down one if all the spaces below are empty
		if (result == -1) {
			for (var i = 1; i < 4; i++) {
				this.blocks[i].move();
			}
		}
		else if (result == 1) {
			for (var i = 0; i < 4; i++) {
				this.blocks[i].landed = 1;
			}
			this.putPiecesInGrid();
			return true;
		}
	}

	this.fallDelay -= 1;

	this.putPiecesInGrid();
	return false;
}

Piece.putPiecesInGrid = function(grid) {
	for (var i = 0; i < 4; i++) {
		grid[this.blocks[i].row][this.blocks[i].col] = this.blocks[i];
	}
}