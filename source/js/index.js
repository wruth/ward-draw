'use strict';

const WardDraw = require('./ward-draw/ward-draw.js'),
    es6Polyfills = require('./ward-lib/es6-polyfills.js');

let wardDraw,
    colorRadios,
    shapeRadios;


function handleColorChange() {

    for (let radio of colorRadios) {

        if (radio.checked) {
            wardDraw.setContextProperty('fillStyle', radio.value);
            break;
        }
    }
}

function handleShapeChange() {

    for (let radio of shapeRadios) {

        if (radio.checked) {
            wardDraw.setMode(radio.value);
            break;
        }
    }
}

function addHandlers() {
    const removeAllButton = document.getElementById('remove-all');

    removeAllButton.addEventListener('click', function () {
        wardDraw.removeAll();
    });

    for (let radio of colorRadios) {
        radio.addEventListener('change', handleColorChange);
    }

    for (let radio of shapeRadios) {
        radio.addEventListener('change', handleShapeChange);
    }

}

function init() {
    const canvas = document.getElementById('canvas');
    wardDraw = new WardDraw(canvas, {width: 500, height: 500});
    colorRadios = document.getElementsByName('color');
    shapeRadios = document.getElementsByName('shape');
    addHandlers();

    colorRadios[0].checked = true;
    shapeRadios[0].checked = true;
    handleColorChange();
    handleShapeChange();
}

init();
