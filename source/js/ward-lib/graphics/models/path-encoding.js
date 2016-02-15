'use strict';

const internal = require('../../create-internal.js').createInternal(),
    constants = require('./path-encoding-constants');

class PathEncoding {

    constructor() {
        internal(this, []);
    }

    beginPath() {
        internal(this).push(constants.BEGIN_PATH);
        return this;
    }

    closePath() {
        internal(this).push(constants.CLOSE_PATH);
        return this;
    }

    moveTo(x, y) {
        const encoding = internal(this);
        encoding.push([x, y]);
        encoding.push(constants.MOVE_TO);
        return this;
    }

    lineTo(x, y) {
        const encoding = internal(this);
        encoding.push([x, y]);
        encoding.push(constants.LINE_TO);
        return this;
    }

    bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y) {
        const encoding = internal(this);
        encoding.push([cp1x, cp1y, cp2x, cp2y, x, y]);
        encoding.push(constants.BEZIER_CURVE_TO);
        return this;
    }

    quadraticCurveTo(cpx, cpy, x, y) {
        const encoding = internal(this);
        encoding.push([cpx, cpy, x, y]);
        encoding.push(constants.QUADRATIC_CURVE_TO);
        return this;
    }

    arc(x, y, radius, startAngle, endAngle, anticlockwise) {
        const encoding = internal(this),
            args = [x, y, radius, startAngle, endAngle];

        if (anticlockwise === true) {
            args.push(anticlockwise);
        }

        encoding.push(args);
        encoding.push(constants.ARC);
        return this;
    }

    arcTo(x1, y1, x2, y2, radius) {
        const encoding = internal(this);
        encoding.push([x1, y1, x2, y2, radius]);
        encoding.push(constants.ARC_TO);
        return this;
    }

    ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise) {
        const encoding = internal(this),
            args = [x, y, radiusX, radiusY, rotation, startAngle, endAngle];

        if (anticlockwise === true) {
            args.push(anticlockwise);
        }

        encoding.push(args);
        encoding.push(constants.ELLIPSE);
        return this;
    }

    rect(x, y, width, height) {
        const encoding = internal(this);
        encoding.push([x, y, width, height]);
        encoding.push(constants.RECT);
        return this;
    }

    getIterator() {
        return internal(this)[Symbol.iterator]();
    }
}

module.exports = PathEncoding;
