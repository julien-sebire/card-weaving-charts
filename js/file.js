function saveChart() {
    let a = document.createElement('a');
    let bb = new Blob([JSON.stringify(chartToJson())],{type:'application/x-json'});
    a.href = window.URL.createObjectURL(bb);
    a.download = 'untitled.cwc';
    a.click();
}

function chartToJson() {
    return {
        "version": 0.1,
        "size": {
            "cols": cols,
            "rows": rows
        },
        "cells": cells
    }
}