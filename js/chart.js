function newChart(filename) {
    document.getElementById('filename').value = filename;
    let chart = document.getElementById('chart');
    if (chart !== null) {
        chart.remove();
    }
    createChart();
}

function createChart() {
    let chart = document.createElement('table');
    chart.id = 'chart';
    chart.drawing = false;
    chart.data = {
        cells: [],
        cols: parseInt(document.getElementById('cols').value),
        rows: parseInt(document.getElementById('rows').value),

        init: function () {
            this.cells = [];
            for (let c = 0; c < this.cols; c++) {
                this.cells[c] = [];
                for (let r = 0; r < this.rows; r++) {
                    this.cells[c][r] = 0;
                }
            }
        },

        resize: function (newCols, newRows) {
            if (newCols === this.cols && newRows === this.rows) {
                return
            }

            // resize cols
            if (newCols > this.cols) {
                this.addCols(this.cols, newCols - this.cols);
            }
            if (newCols < this.cols) {
                this.removeCols(newCols, this.cols - newCols);
            }
            this.cols = newCols;

            // resize rows
            if (newRows > this.rows) {
                this.addRows(this.rows, newRows - this.rows);
            }
            if (newRows < this.rows) {
                this.removeRows(newRows, this.rows - newRows);
            }
            this.rows = newRows;
        },

        addCols: function (start, number) {
            let col = [];
            for (let r = 0; r < this.rows; r++) {
                col[r] = 0;
            }
            for (let c = 0; c < number; c++) {
                this.cells.splice(start, 0, col)
            }
            this.cols++;
        },

        removeCols: function (start, number) {
            this.cells.splice(start, number);
            this.cols--;
        },

        addRows: function (start, number) {
            for (let c = 0; c < this.cols; c++) {
                for (let r = 0; r < number; r++) {
                    this.cells[c].splice(start, 0, 0)
                }
            }
            this.rows++;
        },

        removeRows: function (start, number) {
            for (let c = 0; c < this.cols; c++) {
                this.cells[c].splice(start, number);
            }
            this.rows--;
        },

        checkNeighborX: function (x, y, dx) {
            let neighbor = x + dx;
            if (neighbor === -1 || neighbor === this.cols) {
                return this.cells[x][y] === 1;
            }
            return this.cells[x][y] !== this.cells[neighbor][y];
        },

        checkNeighborY: function (x, y, dy) {
            let neighbor = y + dy;
            if (neighbor === -1 || neighbor === this.rows) {
                return this.cells[x][y] === 1;
            }
            return this.cells[x][y] !== this.cells[x][neighbor];
        },

        toggleCell: function (x, y) {
            this.cells[x][y] = 1 - this.cells[x][y];
        }
    };

    chart.display = function () {
        this.innerHTML = this.createHtml(this.data.cols, this.data.rows);
        if (this.getCell(0, 0) !== null) {
            for (let c = 0; c < this.data.cols; c++) {
                for (let r = 0; r < this.data.rows; r++) {
                    let cell = this.getCell(c,r);
                    cell.onmousedown = function () {
                        chart.toggleCell(c, r);
                        chart.drawing = true;
                    }
                    cell.onmouseenter = function () {
                        if (chart.drawing) {
                            chart.toggleCell(c, r);
                        }
                    }
                    cell.onmouseup = function () {
                        chart.drawing = false;
                    }
                }
            }
            this.redraw();
        }
    }

    chart.createHtml = function (cols, rows) {
        if (isNaN(cols) || cols < 1) {
            return '\t<tr><td style="white-space:nowrap;">Please set the number of cards to at least 1 using the <span class="fa fa-crop menu_name"> Sizes</span> menu.</td></tr>\n';
        }
        if (isNaN(rows) || rows < 1) {
            return '\t<tr><td style="white-space:nowrap;">Please set the number of rows to at least 1 using the <span class="fa fa-crop menu_name"> Sizes</span> menu.</td></tr>\n';
        }

        let s = '';
        for (let r = 0; r < rows; r++) {
            s += '<tr>';
            for (let c = 0; c < cols; c++) {
                s += '<td id="cell[' + c + ',' + r + ']"';
                // middle mark
                if (c === cols / 2 - 1) {
                    s += ' class="middle_right"';
                }
                if (c === cols / 2) {
                    s += ' class="middle_left"';
                }
                s += '></td>';
            }
            s += '</tr>';
        }

        return s;
    }

    chart.redraw = function () {
        for (let r = 0; r < this.data.rows; r++) {
            for (let c = 0; c < this.data.cols; c++) {
                if (this.data.cells[c][r] === 1) {
                    this.displayCell(c, r);
                }
            }
        }
    }

    chart.resize = function () {
        this.data.resize(
            parseInt(document.getElementById('cols').value),
            parseInt(document.getElementById('rows').value)
        );
        this.display();
    }

    chart.addOrRemoveCol = function (x, delta) {
        if (delta > 0) {
            this.data.addCols(x, delta);
        } else {
            this.data.removeCols(x, -delta);
        }
        document.getElementById('cols').value = this.data.cols;
        this.display();
    }

    chart.addOrRemoveRow = function (y, delta) {
        if (delta > 0) {
            this.data.addRows(y, delta);
        } else {
            this.data.removeRows(y, -delta);
        }
        document.getElementById('rows').value = this.data.rows;
        this.display();
    }

    chart.toggleCell = function (x, y) {
        this.data.toggleCell(x, y);
        this.displayCell(x, y);
    }

    chart.displayCell = function (x, y) {
        // background
        if (this.data.cells[x][y]) {
            this.getCell(x, y).classList.add("toggled");
        } else {
            this.getCell(x, y).classList.remove("toggled");
        }
        // borders
        if (this.data.checkNeighborX(x, y, -1)) {
            this.getCell(x, y).classList.add("border_left");
            this.getCell(x - 1, y).classList.add("border_right");
        } else {
            this.getCell(x, y).classList.remove("border_left");
            this.getCell(x - 1, y).classList.remove("border_right");
        }
        if (this.data.checkNeighborX(x, y, 1)) {
            this.getCell(x, y).classList.add("border_right");
            this.getCell(x + 1, y).classList.add("border_left");
        } else {
            this.getCell(x, y).classList.remove("border_right");
            this.getCell(x + 1, y).classList.remove("border_left");
        }
        if (this.data.checkNeighborY(x, y, -1)) {
            this.getCell(x, y).classList.add("border_top");
            this.getCell(x, y - 1).classList.add("border_bottom");
        } else {
            this.getCell(x, y).classList.remove("border_top");
            this.getCell(x, y - 1).classList.remove("border_bottom");
        }
        if (this.data.checkNeighborY(x, y, 1)) {
            this.getCell(x, y).classList.add("border_bottom");
            this.getCell(x, y + 1).classList.add("border_top");
        } else {
            this.getCell(x, y).classList.remove("border_bottom");
            this.getCell(x, y + 1).classList.remove("border_top");
        }
    }

    chart.getCell = function (x, y) {
        if (x < 0 || x >= this.data.cols || y < 0 || y >= this.data.rows) {
            return this;
        }
        return document.getElementById('cell[' + x + ',' + y + ']');
    }

    document.body.appendChild(chart);
    chart.data.init();
    chart.display();
}

// add/remove cols/rows
function createChartButton() {
    let chart_button = document.createElement('div');
    chart_button.id = 'chart_button';
    chart_button.onmouseover = function () {
        this.on_button = 1;
    }
    chart_button.onmouseout = function () {
        this.on_button = 0;
    }
    chart_button.on_button = 0;
    chart_button.surrounding = function (event) {
        let chart = document.getElementById('chart');
        let x0 = chart.getBoundingClientRect().left - document.body.getBoundingClientRect().left;
        let y0 = chart.getBoundingClientRect().top - document.body.getBoundingClientRect().top;
        let x = event.offsetX - x0;
        let y = event.offsetY - y0;
        let margin = 20;
        let button = document.getElementById('chart_button');
        let cell00 = chart.getCell(0, 0);

        let cellWidth = cell00.getBoundingClientRect().width / 2;
        let cellHeight = cell00.getBoundingClientRect().height / 2;

        if (x > -cellWidth / 2
            && x < chart.getBoundingClientRect().width
            && y > -margin
            && y < 0
        ) {
            let col = Math.round(x / cellWidth);
            if (col % 2) {
                button.innerHTML = "x";
                button.onclick = function () {
                    chart.addOrRemoveCol((col - 1) / 2, -1);
                };
            } else {
                button.innerHTML = "+";
                button.onclick = function () {
                    chart.addOrRemoveCol(col / 2, 1);
                };
            }
            x = col * cellWidth - 8;
            if (y < 0) y = 2 - margin;
            if (x > chart.getBoundingClientRect().width) x = chart.getBoundingClientRect().width;
            if (y > chart.getBoundingClientRect().height) y = chart.getBoundingClientRect().height;
            button.style.left = (x + x0) + 'px';
            button.style.top = (y + y0) + 'px';
            button.style.display = "block";
        } else if (x > -margin
            && x < 0
            && y > -cellHeight / 2
            && y < chart.getBoundingClientRect().height
        ) {
            let row = Math.round(y / cellHeight);
            if (row % 2) {
                button.innerHTML = "x";
                button.onclick = function () {
                    chart.addOrRemoveRow((row - 1) / 2, -1);
                };
            } else {
                button.innerHTML = "+";
                button.onclick = function () {
                    chart.addOrRemoveRow(row / 2, 1);
                };
            }
            if (x < 0) x = 2 - margin;
            y = row * cellHeight - 8;
            if (x > chart.getBoundingClientRect().width) x = chart.getBoundingClientRect().width;
            if (y > chart.getBoundingClientRect().height) y = chart.getBoundingClientRect().height;
            button.style.left = (x + x0) + 'px';
            button.style.top = (y + y0) + 'px';
            button.style.display = "block";
        } else if (button.on_button === 0) {
            button.style.display = "none";
        }
    };
    document.body.appendChild(chart_button);
    document.onmousemove = chart_button.surrounding;
}