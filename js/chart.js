cells = [];
cols = 0;
rows = 0;

resizeChart();

function resizeChart() {
	document.getElementById('chart').innerHTML = createHtmlChart();
}

function createHtmlChart() {
	cols = parseInt(document.getElementById('cols').value);
	rows = parseInt(document.getElementById('rows').value);

	if(cols === 0 || rows === 0) {
		return '\t<tr><td style="white-space:nowrap;">&lt;&ndash; Please set sizes to begin.</td></tr>\n';
	}

	initChart(cols, rows);

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
			cells[c][r] = 0;
		}
		s += '</tr>';
	}

	return s;
}

function initChart(cols, rows) {
	cells = [];
	
	for(let c = 0; c < cols; c++) {
		cells[c] = [];
		for(let r = 0; r < rows; r++) {
			cells[c][r] = 0;
		}
	}
	
}

function toggleCell(x, y) {
	cells[x][y] = 1 - cells[x][y];
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

