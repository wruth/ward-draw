'use strict';

const internal = require('../../ward-lib/create-internal.js').createInternal(),
    renderContext = require('../../ward-lib/graphics/renderers/context-renderer.js');

class Shape {

    constructor(bounds, pathEncoding, contextProperties) {
        const properties = internal(this);
        properties.bounds = bounds;
        properties.pathEncoding = pathEncoding;
        properties.contextProperties = contextProperties;

        // start with identity matrix
        properties.transform = [1, 0, 0, 1, 0, 0];
    }

    draw(ctx) {
        const properties = internal(this);

        ctx.save();
        ctx.setTransform.apply(ctx, properties.transform);
        properties.contextProperties.applyToContext(ctx);
        renderContext(ctx, properties.pathEncoding);

        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }

    getBounds() {
        return internal(this).bounds;
    }

}

module.exports = Shape;
