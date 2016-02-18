'use strict';

function createMatrix() {
    return document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGMatrix();
}

module.exports = createMatrix;
