'use strict';

const internal = require('../../ward-lib/create-internal.js').createInternal();

class Shape {

    constructor(bounds, path, contextProperties) {
        const properties = internal(this);
        properties.bounds = bounds;
        properties.path = path;
        properties.contextProperties = contextProperties;

        // start with identity matrix
        properties.transform = [1, 0, 0, 1, 0, 0];
    }

    draw(ctx) {
        const properties = internal(this);
        ctx.save();
        ctx.setTransform.apply(ctx, properties.transform);
        properties.contextProperties.applyToContext(ctx);
        ctx.fill(properties.path);
        ctx.stroke(properties.path);
        ctx.restore();
    }

    getBounds() {
        return internal(this).bounds;
    }

}

module.exports = Shape;
