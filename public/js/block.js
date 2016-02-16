/*
Block class
*/

var Block = function(row, col, blockType) {
	this.landed = 0;
	this.row = row;
	this.col = col;
	this.blockType = blockType
	this.tempRow = 0;
	this.tempCol = 0;
}

Block.prototype.checkRotation = function(grid, action, centerRow, centerCol) {
	if (action == "cw") {
		this.posClock(grid, centerRow, centerCol);
	}
	else {
		this.posCounter(grid, centerRow, centerCol);
	}

	if (this.tempRow >= grid.length || this.tempCol < 0 || this.tempCol >= grid[0].length) {
		return 0;
	}
	if (grid[this.tempRow][this.tempCol] == -1) {
		return -1;
	}
	return grid[this.tempRow][this.tempCol].landed;
}

Block.prototype.posClock = function(grid, centerRow, centerCol) {
	var r = this.row;
	var c = this.col;
	if (r != centerRow || c != centerCol) {
		if (r == centerRow)  {
			c = centerCol;
			r += (this.col - centerCol);
		}
		else if (c == centerCol) {
			r = centerRow;
			c += (centerRow - this.row);
		}
		else {
			r += ( (centerRow - this.row) - (centerCol - this.col));
			c += ( (centerRow - this.row) + (centerCol - this.col));
		}
	}
	this.tempRow = r;
	this.tempCol = c;
}

Block.prototype.posCounter = function(grid, centerRow, centerCol) {
	var r = this.row;
	var c = this.col;
	if (r != centerRow || c != centerCol) {
		if (r == centerRow) {
			c = centerCol;
			r -= (this.col - centerCol);
		}
		else if (c == centerCol) {
			r = centerRow;
			c -= (centerRow - this.row);
		}
		else {
			r += (  (centerRow - this.row) + (centerCol - this.col));
			c += ( -(centerRow - this.row) + (centerCol - this.col));
		}
	}
	this.tempRow = r;
	this.tempCol = c;
}

Block.prototype.checkTranslation = function(grid, direction) {
	var r = this.row;
	var c = this.col;
	if (direction == "down") {
		r += 1;
	}
	else if (direction == "right") {
		c += 1;
	}
	else if (direction == "left") {
		c -= 1
	}
	this.tempRow = r;
	this.tempCol = c;

	if (this.tempRow >= grid.length) {
		return 1;
	}
	if (this.tempCol < 0 || this.tempCol >= grid[0].length) {
		return 0;
	}
	if (grid[this.tempRow][this.tempCol] == -1) {
		return -1;
	}
	return grid[this.tempRow][this.tempCol].landed;
}

Block.prototype.move = function() {
	this.row = this.tempRow;
	this.col = this.tempCol;
}

Block.prototype.distToBot = function(grid) {
	var dist = 0;
	var r = this.row + 1;
	var c = this.col;
	while (r < grid.length && (grid[r][c] == -1 || grid[r][c].landed == 0)) {
		dist += 1;
		r += 1
	}
	return dist;
}

Block.prototype.hardDrop = function(grid, num) {
	this.row += num;
	this.landed = 1;
}

if (typeof module !== "undefined") module.exports = Block;