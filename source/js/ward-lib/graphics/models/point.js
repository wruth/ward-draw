'use strict';

const Point = function (x, y) {
    Object.defineProperty(this, 'x', { get: function () { return x; } });
    Object.defineProperty(this, 'y', { get: function () { return y; } });
};

Point.prototype.toString = function () {
    return `{x: ${this.x}, y: ${this.y}}`;
};

module.exports = Point;
