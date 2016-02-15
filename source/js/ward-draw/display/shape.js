'use strict';

const internal = require('../../ward-lib/create-internal.js').createInternal(),
    AbstractShape = require('./abstract-shape.js'),
    renderContext = require('../../ward-lib/graphics/renderers/context-renderer.js');

class Shape extends AbstractShape {

    constructor(bounds, pathEncoding, contextProperties) {
        let propoertiesWrapper = {};
        super(propoertiesWrapper);
        const properties = internal(this, propoertiesWrapper.properties);
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

}

module.exports = Shape;
