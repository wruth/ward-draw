'use strict';

class Rect {

    constructor(origin, size) {
        Object.defineProperty(this, 'origin', { get: function () { return origin; } });
        Object.defineProperty(this, 'size', { get: function () { return size; } });
    }

    toString() {
        return `{${this.origin}, ${this.size}}`;
    }

}

module.exports = Rect;
