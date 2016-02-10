const Size = function (width, height) {
    Object.defineProperty(this, 'width', { get: function () { return width; } });
    Object.defineProperty(this, 'height', { get: function () { return height; } });
};

Size.prototype.toString = function () {
    return `{width: ${this.width}, height: ${this.height}}`;
};

module.exports = Size;
