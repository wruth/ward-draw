'use strict';

const internal = require('../../ward-lib/create-internal.js').createInternal(),
    AbstractShape = require('./abstract-shape.js'),
    renderContext = require('../../ward-lib/graphics/renderers/context-renderer.js'),
    RenderEncoding = require('../../ward-lib/graphics/models/render-encoding.js');

class Shape extends AbstractShape {

    constructor(bounds, pathEncoding, contextProperties) {
        let propertiesWrapper = {};
        super(propertiesWrapper);
        const properties = internal(this, propertiesWrapper.properties);
        properties.bounds = bounds;
        properties.txBounds = bounds;
        properties.pathEncoding = pathEncoding;
        properties.transformEncoding = new RenderEncoding();
        properties.contextProperties = contextProperties;
    }

    isPointInShape(ctx, point) {
        const properties = internal(this);
        let isInPath,
            path = properties.path;

        // if there's no path, the shape has never been drawn, so can't evaluate
        if (!path) {
            return false;
        }

        ctx.save();
        renderContext(ctx, properties.transformEncoding);
        isInPath = ctx.isPointInPath(path, point.x, point.y);
        ctx.restore();
        return isInPath;
    }

    draw(ctx, pContextProperties) {
        const properties = internal(this),
            contextProperties = pContextProperties || properties.contextProperties,
            path = new Path2D();

        ctx.save();
        renderContext(ctx, properties.transformEncoding);
        properties.contextProperties.applyToContext(ctx);
        renderContext(path, properties.pathEncoding);
        properties.path = path;

        if (contextProperties.has('fillStyle')) {
            ctx.fill(path);
        }

        if (contextProperties.has('strokeStyle')) {
            ctx.stroke(path);
        }

        ctx.restore();
    }

}

module.exports = Shape;
