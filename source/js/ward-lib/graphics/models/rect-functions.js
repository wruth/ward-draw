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

/**
 * Given two rectangles, return a new rectangle which is exactly big enough to contain each supplied rectangle.
 *
 * @param {Rect} recta a rectangle to combine
 * @param {Rect} rectb a rectangle to combine
 * @return {Rect} a new rectangle exactly containing the supplied rectangles
 */
function getUnionRect(pRecta, pRectb) {
    const recta = getOrientedRect(pRecta),
        rectb = getOrientedRect(pRectb),
        minX = Math.min(recta.origin.x, rectb.origin.x),
        minY = Math.min(recta.origin.y, rectb.origin.y),
        maxX = Math.max(recta.origin.x + recta.size.width, rectb.origin.x + rectb.size.width),
        maxY = Math.max(recta.origin.y + recta.size.height, rectb.origin.y + rectb.size.height),
        origin = new Point(minX, minY),
        size = new Size(maxX - minX, maxY - minY),
        rect = new Rect(origin, size);

    return rect;
}

const rectFunctions = {
    getOrientedRect: getOrientedRect,
    getUnionRect: getUnionRect
};

module.exports = rectFunctions;
