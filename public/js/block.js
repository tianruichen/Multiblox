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

Block.prototype.getNewPos = function(grid, action, centerRow, centerCol) {
	var r = this.row;
	var c = this.col;
	if (action == "down") {
		r += 1;
	}
	else if (action == "right") {
		c += 1
	}
	else if (action == "left") {
		c -= 1
	}
	else if (r != centerRow || c != centerCol) {
		if (action == "cw") {
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
		else if (action == "ccw") {
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
	}
	this.tempRow = r;
	this.tempCol = c;
}

Block.prototype.checkEmpty = function(grid, action, centerRow, centerCol) {
	this.getNewPos(grid, action, centerRow, centerCol);
	if (this.tempRow >= grid.length && action == "down") {
		return 1;
	}
	if (this.tempRow >= grid.length || this.tempCol < 0 || this.tempCol >= grid[0].length) {
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
	while (r < grid.length && grid[r][c] == this.empty || grid[r][c].landed == 0) {
		dist += 1;
	}
	return dist;
}

Block.prototype.hardDrop = function(grid, num) {
	this.row += num;
	this.landed = 1;
}

if (typeof module !== "undefined") module.exports = Block;