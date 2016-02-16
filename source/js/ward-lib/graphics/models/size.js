'use strict';

class Size {

    constructor(width, height) {
        Object.defineProperty(this, 'width', { get: function () { return width; } });
        Object.defineProperty(this, 'height', { get: function () { return height; } });
    }

    equals(size) {
        return (size.width === this.width && size.height === this.height);
    }

    toString() {
        return `{width: ${this.width}, height: ${this.height}}`;
    }

}

module.exports = Size;
