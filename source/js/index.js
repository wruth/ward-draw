'use strict';

const WardDraw = require('./ward-draw/ward-draw.js'),
    es6Polyfills = require('./ward-lib/es6-polyfills.js');

let wardDraw,
    colorRadios,
    modeRadios;


function handleColorChange() {

    for (let radio of colorRadios) {

        if (radio.checked) {
            wardDraw.setContextProperty('fillStyle', radio.value);
            break;
        }
    }
}

function handleModeChange() {

    for (let radio of modeRadios) {

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

    for (let radio of modeRadios) {
        radio.addEventListener('change', handleModeChange);
    }

}

function init() {
    const canvas = document.getElementById('canvas');
    wardDraw = new WardDraw(canvas, {width: 500, height: 500});
    colorRadios = document.getElementsByName('color');
    modeRadios = document.getElementsByName('mode');
    addHandlers();

    colorRadios[0].checked = true;
    modeRadios[1].checked = true;
    handleColorChange();
    handleModeChange();
}

init();
