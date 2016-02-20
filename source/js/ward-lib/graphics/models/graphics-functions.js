'use strict';

const Rect = require('./rect.js'),
    Size = require('./size.js'),
    Point = require('./point.js');

const zeroRect = getRect(0, 0, 0, 0);

/**
 * Convenience factory function for a `Rect`.
 *
 * @param {Number} x x coordinate of corner of rect
 * @param {Number} y y coordintate of corner of rect
 * @param {Number} width width of the rect
 * @param {Number} height height of the rect
 * @return {Rect} a fresh Rect
 */
function getRect(x, y, width, height) {
    return new Rect(new Point(x, y), new Size(width, height));
}

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
 * Given a list of rectangles, return a new rectangle which is exactly big enough to contain all of the supplied
 * rectangles. It is assumed the rectangles are all oriented (have non-negative widths and heights).
 *
 * @param {Rect} recta a rectangle to combine
 * @param {Rect} rectb a rectangle to combine
 * @return {Rect} a new rectangle exactly containing the supplied rectangles
 */
function getUnionRect(...rectangles) {
    let minX = Number.MAX_VALUE,
        minY = Number.MAX_VALUE,
        maxX = Number.MIN_VALUE,
        maxY = Number.MIN_VALUE,
        unionRect,
        origin,
        size;

    // return a zero rect if there's no rectangles
    if (!rectangles || rectangles.length === 0) {
        return zeroRect;
    }

    for (let rect of rectangles) {
 //   for (let i = 0, rect = rectangles[i]; i < rectangles.length; i++, rect = rectangles[i]) {
        minX = Math.min(minX, rect.origin.x);
        minY = Math.min(minY, rect.origin.y);
        maxX = Math.max(maxX, rect.origin.x + rect.size.width);
        maxY = Math.max(maxY, rect.origin.y + rect.size.height);
    }

    origin = new Point(minX, minY);
    size = new Size(maxX - minX, maxY - minY);
    unionRect = new Rect(origin, size);

    return unionRect;
}

/**
 * Gets the distance between two points, expressed as a rectangular offset (not the
 * length of a line connecting the two points)
 *
 * @param {Point} pointa a reference point
 * @param {Point} pointb a point to measure an offset to
 * @return {Size} a measured offset between the two points. For instance, if the second
 *  point is to the right and below the first point, the width and height values will be
 *  positive
 */
function getOffsetSize(pointa, pointb) {
    return new Size(pointb.x - pointa.x, pointb.y - pointa.y);
}

/**
 * Given a point, determine if it lies within the boundaries of a rectangle or not.
 *
 * @param {Point} a point to evaluate
 * @param {Rect} a rectangle to evaluate the point against
 * @return {Boolean} `true` if the point lies within the rect, `false` otherwise
 */
function isPointInRect(point, rect) {
    return (point.x >= rect.origin.x && point.x <= rect.origin.x + rect.size.width
        && point.y >= rect.origin.y && point.y <= rect.origin.y + rect.size.height);
}

const graphicsFunctions = {
    zeroRect: zeroRect,
    getRect: getRect,
    getOrientedRect: getOrientedRect,
    getUnionRect: getUnionRect,
    getOffsetSize: getOffsetSize,
    isPointInRect: isPointInRect
};

module.exports = graphicsFunctions;
