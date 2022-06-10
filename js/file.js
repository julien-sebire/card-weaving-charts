function saveChart() {
    let a = document.createElement('a');
    let bb = new Blob([JSON.stringify(chartToJson())],{type:'application/x-json'});
    a.href = window.URL.createObjectURL(bb);
    a.download = document.getElementById('filename').value + '.cwc';
    a.click();
}

function loadChart() {
    let fileInput = document.createElement("input");
    fileInput.type = 'file';
    fileInput.onchange = function (event) {
        let file = event.target.files[0];
        if (!file) {
            return;
        }
        let reader = new FileReader();
        reader.onload = function(event) {
            jsonToChart(event.target.result, file.name.replace('.cwc', ''));
        }
        reader.readAsText(file);
    };
    fileInput.click();
}

function chartToJson() {
    let data = document.getElementById('chart').data;
    return {
        "version": 0.1,
        "notation": "double-face",
        "size": {
            "cols": data.cols,
            "rows": data.rows
        },
        "cells": data.cells
    }
}

function jsonToChart(contents, filename) {
    let values = JSON.parse(contents);
    if (values.version > parseFloat(version)) {
        alert("The chart cannot be loaded with this version of CWC. Consider updating to version " + values.version + " or later.");
        return;
    }
    if (values.notation !== 'double-face') {
        alert("The chart you're trying to load contains notation for ''" + version.notation + "'' which is not supported by this version of CWC. Consider updating to latest version for full support.");
        return;
    }

    document.getElementById('cols').value = values.size.cols;
    document.getElementById('rows').value = values.size.rows;
    newChart(filename);
    document.getElementById('chart').data.cells = values.cells;
    document.getElementById('chart').redraw();
}
