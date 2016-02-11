const WardDraw = require('./ward-draw/ward-draw.js'),
    constants = require('./ward-draw/ward-draw-constants.js');

let wardDraw,
    colorRadios,
    shapeRadios;


function handleColorChange() {

    for (let i = 0; i < colorRadios.length; i++) {

        if (colorRadios[i].checked) {
            wardDraw.setContextProperty('fillStyle', colorRadios[i].value);
            break;
        }
    }
}

function handleShapeChange() {

    for (let i = 0; i < shapeRadios.length; i++) {

        if (shapeRadios[i].checked) {
            wardDraw.setMode(shapeRadios[i].value);
            break;
        }
    }
}

function addHandlers() {
    const removeAllButton = document.getElementById('remove-all');

    removeAllButton.addEventListener('click', function () {
        wardDraw.removeAll();
    });

    for (let i = 0; i < colorRadios.length; i++) {
        colorRadios[i].addEventListener('change', handleColorChange);
    }

    for (let i = 0; i < shapeRadios.length; i++) {
        shapeRadios[i].addEventListener('change', handleShapeChange);
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
