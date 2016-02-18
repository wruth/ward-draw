'use strict';

const internal = require('../../create-internal.js').createInternal(),
    constants = require('./render-encoding-constants');

/**
 * If the top operation on the encoding stack matches the passed in operation, remove it and the corresponding (next)
 * arguments array from the stack and return the arguments. This is in support of an optimization to concatenate two
 * like operations, like combining two transforms in a row into one transform.
 *
 * @param {Array} encoding an encoding stack
 * @param {String} operation an operation constant
 * @return {Array} returns array of argument(s) for the just previous operation if there's a match, or `null` if there
 *      is no match
 */
function removeTopMatchingOperation(encoding, operation) {
    const lastOperation = encoding.pop();
    let args = null;

    if (operation === lastOperation) {
        args = encoding.pop();
    }
    else {
        encoding.push(lastOperation);
    }

    return args;
}

/**
 * `RenerEncoding`
 * @class
 */
class RenderEncoding {

    constructor() {
        internal(this, []);
    }

    //
    // path encodings
    //

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

    //
    // transform encodings
    //

    rotate(angle) {
        const encoding = internal(this),
            previousArgs = removeTopMatchingOperation(encoding, constants.ROTATE);

        let args;

        if (previousArgs) {
            args = [previousArgs[0] + angle];
        }
        else {
            args = [angle];
        }

        encoding.push(args);
        encoding.push(constants.ROTATE);
        return this;
    }

    scale(x, y) {
        const encoding = internal(this),
            previousArgs = removeTopMatchingOperation(encoding, constants.SCALE);

        let args;

        if (previousArgs) {
            args = [previousArgs[0] * x, previousArgs[1] * y];
        }
        else {
            args = [x, y];
        }

        encoding.push(args);
        encoding.push(constants.SCALE);
        return this;
    }

    translate(x, y) {
        const encoding = internal(this),
            previousArgs = removeTopMatchingOperation(encoding, constants.TRANSLATE);

        let args;

        if (previousArgs) {
            args = [previousArgs[0] + x, previousArgs[1] + y];
        }
        else {
            args = [x, y];
        }

        encoding.push(args);
        encoding.push(constants.TRANSLATE);
        return this;
    }

    clear() {
        internal(this).splice(0);
    }

    getIterator() {
        return internal(this)[Symbol.iterator]();
    }
}

module.exports = RenderEncoding;
