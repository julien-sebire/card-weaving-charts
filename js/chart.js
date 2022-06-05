cells = [];
cols = 0;
rows = 0;

function newChart() {
	document.getElementById('filename').value = '';
	initChart();
	document.getElementById('chart').innerHTML = createHtmlChart();
}

function resizeChart() {
	let [newCols, newRows] = readSizes();

	if (newCols === cols && newRows === rows) {
		return
	}

	// resize cols
	if (newCols > cols) {
		addCols(cols, newCols - cols);
	}
	if (newCols < cols) {
		removeCols(newCols, cols - newCols);
	}
	cols = newCols;

	// resize rows
	if (newRows > rows) {
		addRows(rows, newRows - rows);
	}
	if (newRows < rows) {
		removeRows(newRows, rows - newRows);
	}
	rows = newRows;

	document.getElementById('chart').innerHTML = createHtmlChart();
	redrawChart();
}

function addCols(start, number) {
	for (let c = start; c < start + number; c++) {
		cells[c] = [];
		for(let r = 0; r < rows; r++) {
			cells[c][r] = 0;
		}
	}
}
function removeCols(start, number) {
	cells.splice(start, number);
}

function addRows(start, number) {
	for(let c = 0; c < cols; c++) {
		for (let r = start; r < start + number; r++) {
			cells[c][r] = 0;
		}
	}
}
function removeRows(start, number) {
	for(let c = 0; c < cols; c++) {
		cells[c].splice(start, number);
	}
}

function createHtmlChart() {
	[cols, rows] = readSizes();

	if(isNaN(cols) || cols < 1) {
		return '\t<tr><td style="white-space:nowrap;">Please set the number of cards to at least 1 using the <span class="fa fa-crop menu_name"> Sizes</span> menu.</td></tr>\n';
	}
	if(isNaN(rows) || rows < 1) {
		return '\t<tr><td style="white-space:nowrap;">Please set the number of rows to at least 1 using the <span class="fa fa-crop menu_name"> Sizes</span> menu.</td></tr>\n';
	}

	let s = '';
	for(let r = 0; r < rows; r++) {
		s += '<tr>';
		for(let c = 0; c < cols; c++) {
			s += '<td id="cell[' + c + ',' + r + ']" onClick="toggleCell(' + c + ',' + r + ')"'
			// middle mark
			if(c === cols / 2 - 1) {
				s += ' class="middle_right"';
			}
			if(c === cols / 2) {
				s += ' class="middle_left"';
			}
			s += '></td>';
		}
		s += '</tr>';
	}

	return s;
}

function initChart() {
	[cols, rows] = readSizes();

	cells = [];
	for(let c = 0; c < cols; c++) {
		cells[c] = [];
		for(let r = 0; r < rows; r++) {
			cells[c][r] = 0;
		}
	}

}

function redrawChart() {
	for (let r = 0; r < rows; r++) {
		for (let c = 0; c < cols; c++) {
			if (cells[c][r] === 1) {
				displayCell(c,r);
			}
		}
	}
}

function readSizes() {
	return [
		parseInt(document.getElementById('cols').value),
		parseInt(document.getElementById('rows').value)
	];
}

function toggleCell(x, y) {
	cells[x][y] = 1 - cells[x][y];
	displayCell(x, y);
}

function displayCell(x, y) {
	// background
	if(cells[x][y]) {
		getCell(x, y).classList.add("toggled");
	} else {
		getCell(x, y).classList.remove("toggled");
	}
	// borders
	if(checkDx(x, y, -1)) {
		getCell(x, y).classList.add("border_left");
		getCell(x - 1, y).classList.add("border_right");
	} else {
		getCell(x, y).classList.remove("border_left");
		getCell(x - 1, y).classList.remove("border_right");
	}
	if(checkDx(x, y, 1)) {
		getCell(x, y).classList.add("border_right");
		getCell(x + 1, y).classList.add("border_left");
	} else {
		getCell(x, y).classList.remove("border_right");
		getCell(x + 1, y).classList.remove("border_left");
	}
	if(checkDy(x, y, -1)) {
		getCell(x, y).classList.add("border_top");
		getCell(x, y - 1).classList.add("border_bottom");
	} else {
		getCell(x, y).classList.remove("border_top");
		getCell(x, y - 1).classList.remove("border_bottom");
	}
	if(checkDy(x, y, 1)) {
		getCell(x, y).classList.add("border_bottom");
		getCell(x, y + 1).classList.add("border_top");
	} else {
		getCell(x, y).classList.remove("border_bottom");
		getCell(x, y + 1).classList.remove("border_top");
	}
}

function getCell(x, y) {
	if (x < 0 || x >= cols || y < 0 || y >= rows) {
		return document.getElementById('chart');
	}
	return document.getElementById('cell[' + x + ',' + y + ']');
}

function checkDx(x, y, dx) {
	let neighbor = x + dx;
	if (neighbor === -1 || neighbor === cols) {
		return cells[x][y] === 1;
	}
	return cells[x][y] !== cells[neighbor][y];
}

function checkDy(x, y, dy) {
	let neighbor = y + dy;
	if (neighbor === -1 || neighbor === rows) {
		return cells[x][y] === 1;
	}
	return cells[x][y] !== cells[x][neighbor];
}

