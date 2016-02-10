let Rect = function (origin, size) {
    Object.defineProperty(this, 'origin', { get: function () { return origin; } });
    Object.defineProperty(this, 'size', { get: function () { return size; } });
};

module.exports = Rect;
