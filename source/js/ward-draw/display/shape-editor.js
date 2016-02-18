'use strict';

const internal = require('../../ward-lib/create-internal.js').createInternal(),
    graphicsFunctions = require('../../ward-lib/graphics/models/graphics-functions.js'),
    displayFunctions = require('./display-functions.js'),
    AbstractShape = require('./abstract-shape.js'),
    ContextProperties = require('../models/context-properties.js');

class ShapeEditor extends AbstractShape {

    constructor(shapes) {
        let propertiesWrapper = {};
        super(propertiesWrapper);
        const properties = internal(this, propertiesWrapper.properties);
        properties.locked = true;
        properties.shapes = new Set(shapes);
        properties.contextProperties = new ContextProperties([['strokeStyle', 'blue'], ['lineWidth', 1]]);
        properties.bounds = displayFunctions.getUnionBounds(shapes);
    }

    addShape(shape) {
        const properties = internal(this),
            shapes = properties.shapes;
        shapes.add(shape);
        properties.bounds = displayFunctions.getUnionBounds(shapes);
    }

    removeShape(shape) {
        const properties = internal(this),
            shapes = properties.shapes;
        shapes.delete(shape);
        properties.bounds = displayFunctions.getUnionBounds(shapes);
    }

    removeAllShapes() {
        const properties = internal(this),
            shapes = properties.shapes;
        shapes.clear();
        properties.bounds = graphicsFunctions.zeroRect;
    }

    hasShape(shape) {
        return internal(this).shapes.has(shape);
    }

    isEmpty() {
        return internal(this).shapes.size === 0;
    }

    draw(ctx) {
        const properties = internal(this),
            bounds = properties.bounds,
            shapes = properties.shapes,
            contextProperties = properties.contextProperties;

        // nothing to render if there's no shapes
        if (!shapes.size) {
            return;
        }

        ctx.save();
        contextProperties.applyToContext(ctx);

        // draw bounds
        ctx.strokeRect(bounds.origin.x, bounds.origin.y, bounds.size.width, bounds.size.height);

        for (let shape of shapes) {
            shape.draw(ctx, contextProperties);
        }

        ctx.restore();
    }
}

module.exports = ShapeEditor;
