const internal = require('../../ward-lib/create-internal.js').createInternal();

const Shape = function (bounds, path, contextProperties) {
    const properties = internal(this);
    properties.bounds = bounds;
    properties.path = path;
    properties.contextProperties = contextProperties;

    // start with identity matrix
    properties.transform = [1, 0, 0, 1, 0, 0];
};

Shape.prototype.draw = function (ctx) {
    const properties = internal(this);
    ctx.save();
    ctx.setTransform.apply(ctx, properties.transform);
    properties.contextProperties.applyToContext(ctx);
    ctx.fill(properties.path);
    ctx.stroke(properties.path);
    ctx.restore();
};

module.exports = Shape;
