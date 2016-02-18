'use strict';

const internal = require('../../create-internal.js').createInternal(),
    graphicsFunctions = require('./graphics-functions.js'),
    createSVGMatrix = require('../factories/svg-matrix-factory.js');

class RectTransformContext {

    constructor(rect) {
        const properties = internal(this);

        properties.rect = rect;
        properties.txRect = rect;
        properties.matrix = createSVGMatrix();
    }

    rotate(x, y) {
        const properties = internal(this),
            matrix = properties.matrix,
            rect = properties.rect;
        matrix.rotate(x, y);

        // TODO
    }

    scale(x, y) {
        const properties = internal(this),
            matrix = properties.matrix,
            rect = properties.rect;
        matrix.scaleNonUniform(x, y);

        // TODO
    }

    translate(x, y) {
        const properties = internal(this),
            matrix = properties.matrix,
            rect = properties.rect;
        matrix.translate(x, y);
        properties.txRect = graphicsFunctions.getRect(
            rect.origin.x + matrix.e, rect.origin.y + matrix.f, rect.size.with, rect.size.height);
    }

    get rect() {
        return internal(this).txRect;
    }
}

module.exports = RectTransformContext;
