'use strict';

const Rect = function (origin, size) {
    Object.defineProperty(this, 'origin', { get: function () { return origin; } });
    Object.defineProperty(this, 'size', { get: function () { return size; } });
};

Rect.prototype.toString = function () {
    return `{${this.origin}, ${this.size}}`;
};

module.exports = Rect;
