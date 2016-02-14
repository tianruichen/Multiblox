/*
Block class
*/

var Block = function(row, col, fill) {
	this.landed = 0;
	this.row = row;
	this.col = col;
	this.fill = fill;
	this.tempRow = 0;
	this.tempCol = 0;
}

Block.getNewPos = function(grid, action, centerRow, centerCol) {
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
	else if (action == "cw") {
		if (r == this.row)  {
			c = this.col;
			r += (this.col - centerCol);
		}
		else if (c == this.col) {
			r = this.row;
			c += (centerRow - this.row);
		}
		else {
			r += ( -(centerRow - this.row) + (centerCol - this.col));
			c += ( -(centerRow - this.row) - (centerCol - this.col));
		}
	}
	else if (action == "ccw") {
		if (r == this.row) {
			c = this.col;
			r -= (this.col - centerCol);
		}
		else if (c == this.col) {
			r = this.row
			c -= (centerRow - this.row);
		}
		else {
			r += ( -(centerRow - this.row) - (centerCol - this.col));
			c += (  (centerRow - this.row) - (centerCol - this.col));
		}
	}
	this.tempRow = r;
	this.tempCol = c;
}

Block.checkEmpty = function(grid, action, centerRow, centerCol) {
	this.getNewPos(grid, action, centerRow, centerCol);
	if (grid[this.tempRow][this.tempCol] == 0) {
		return -1;
	}
	return grid[this.tempRow][this.tempCol].landed;
}

Block.move = function() {
	this.row = this.tempRow;
	this.col = this.tempCol;
}

Block.getBottom = function(grid) {
	var r = this.row;
	var c = this.col;
	while (r < grid.length && grid[r][c] == 0 || grid[r][c].landed == 0) {
		r += 1;
	}
	return r - 1;
}

Block.hardDrop = function(grid, num) {
	this.row += num;
	this.landed = 1;
}