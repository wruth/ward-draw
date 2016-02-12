'use strict';

const Rect = require('./rect.js'),
    Size = require('./size.js'),
    Point = require('./point.js');

/**
 * Ensures a Rect's origin point represents the upper-left corner, with positive width and height.
 *
 * @param {Rect} rect a possibly dis-oriented Rect
 * @return {Rect} a new oriented Rect
 */
function getOrientedRect(rect) {
    let x = rect.origin.x,
        y = rect.origin.y,
        width = rect.size.width,
        height = rect.size.height,
        origin,
        size;

    if (width < 0) {
        x += width;
        width *= -1;
    }

    if (height < 0) {
        y += height;
        height *= -1;
    }

    origin = new Point(x, y);
    size = new Size(width, height);

    return new Rect(origin, size);
}

const rectFunctions = {
    getOrientedRect: getOrientedRect
};

module.exports = rectFunctions;
