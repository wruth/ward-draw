'use strict';

class Point {

    constructor(x, y) {
        Object.defineProperty(this, 'x', { get: function () { return x; } });
        Object.defineProperty(this, 'y', { get: function () { return y; } });
    }

    toString() {
        return `{x: ${this.x}, y: ${this.y}}`;
    }

}

module.exports = Point;
