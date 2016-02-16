/*
Block class
*/

/*Order for wall kicks:
Orientation 0, Clockwise
Orientation 0, Counterclockwise
Orientation 1, Clockwise
Orientation 1, Counterclockwise
etc.*/
wallKickMany = [[[0, 0], [0, -1], [-1, -1], [-2, 0], [2, -1]],
				[[0, 0], [0, 1], [-1, 1], [2, 0], [2, 1]],
				[[0, 0], [0, 1], [1, 1], [-2, 0], [-2, 1]],
				[[0, 0], [0, 1], [1, 1], [-2, 0], [-2, 1]],
				[[0, 0], [0, 1], [-1, 1], [2, 0], [2, 1]],
				[[0, 0], [0, -1], [-1, -1], [2, 0], [2, -1]],
				[[0, 0], [0, -1], [1, -1], [-2, 0], [-2, -1]],
				[[0, 0], [0, -1], [1, -1], [-2, 0], [-2, -1]]];
wallKickI =	   [[[0, 0], [0, -2], [0, 1], [1, -2], [-2, 1]],
				[[0, 0], [0, -1], [0, 2], [-2, -1], [1, 2]],
				[[0, 0], [0, -1], [0, 2], [-2, -1], [1, 2]],
				[[0, 0], [0, 2], [0, -1], [-1, 2], [2, -1]],
				[[0, 0], [0, 2], [0, -1], [-1, 2], [2, -1]],
				[[0, 0], [0, 1], [0, -2], [2, 1], [-1, -2]],
				[[0, 0], [0, 1], [0, -2], [2, 1], [-1, -2]],
				[[0, 0], [0, -2], [0, 1], [1, -2], [-2, 1]]];



var Block = function(row, col, blockType) {
	this.landed = 0;
	this.row = row;
	this.col = col;
	this.blockType = blockType
	this.tempRow = 0;
	this.tempCol = 0;
}

Block.prototype.checkRotation = function(grid, direction, centerRow, centerCol, orientation) {
	var k = 0;
	if (direction == "cw") {
		this.posClock(grid, centerRow, centerCol, orientation);
	}
	else {
		this.posCounter(grid, centerRow, centerCol, orientation);
		k = 1;
	}

	var wallKickResults = [];
	var wallKickData;
	if (this.blockType == 0) {
		wallKickData = wallKickI;
	}
	else {
		wallKickData = wallKickMany;
	}
	var num = orientation*2 + k
	var tr, tc;
	for (var i = 0; i < 5; i++) {
		tr = wallKickData[num][i][0];
		tc = wallKickData[num][i][1];
		wallKickResults[i] = getGridResult(grid, this.tempRow + tr, this.tempCol + tc);
	}

	return wallKickResults;
}

function getGridResult(grid, tr, tc) {
	if (tr >= grid.length || tr < 0 || tc < 0 || tc >= grid[0].length) {
		return 0;
	}
	if (grid[tr][tc] == -1) {
		return -1;
	}
	return 0;
}

Block.prototype.posClock = function(grid, centerRow, centerCol, orientation) {
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
	if (this.blockType == 0) {
		if (orientation == 0) {
			c += 1;
		}
		else if (orientation == 1) {
			r += 1;
		}
		else if (orientation == 2) {
			c -= 1;
		}
		else if (orientation == 3) {
			r -= 1;
		}
	}

	this.tempRow = r;
	this.tempCol = c;
}

Block.prototype.posCounter = function(grid, centerRow, centerCol, orientation) {
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
	if (this.blockType == 0) {
		if (orientation == 0) {
			r += 1;
		}
		else if (orientation == 1) {
			c -= 1;
		}
		else if (orientation == 2) {
			r -= 1;
		}
		else if (orientation == 3) {
			c += 1;
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
	this.row = this.tempRow
	this.col = this.tempCol
}

Block.prototype.wallKickMove = function(num, attempt) {
	var wallKickData;
	if (this.blockType == 0)
		wallKickData = wallKickI;
	else {
		wallKickData = wallKickMany;
	}
	this.row = this.tempRow + wallKickData[num][attempt][0];
	this.col = this.tempCol + wallKickData[num][attempt][1];
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