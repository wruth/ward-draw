let Size = function (width, height) {
    Object.defineProperty(this, 'width', { get: function () { return width; } });
    Object.defineProperty(this, 'height', { get: function () { return height; } });
};

module.exports = Size;
