var defaultDelay = 20;

var colors = ["#FFFFFF",
			  "#DDDDDD",
			  "#BBBBBB",
			  "9999999",
			  "7777777",
			  "5555555",
			  "3333333"];

var Piece = function(blockType, row, col) {
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
}

Piece.update = function(grid, action) {
	var result = true;

	if (action != "") {
		for (var i = 1; i < 4; i++ ) {
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

	if (this.fallDelay < 0) {
		result = -1;
		for (var i = 1; i < 4; i++) {
			var temp = this.blocks[i].checkEmpty(grid, "down", this.row, this.col);
			if (temp > result) {
				result = temp;
			}
		}
		if (result == -1) {
			for (var i = 1; i < 4; i++) {
				this.blocks[i].move();
			}
		}
		else if (result == 1) {
			for (var i = 0; i < 4; i++) {
				this.blocks[i].landed = 1;
			}
			return true;
		}
	}

	this.fallDelay -= 1;

	return false;
}