'use strict';

const graphicsFunctions = require('../../ward-lib/graphics/models/graphics-functions.js'),
    RenderEncoding = require('../../ward-lib/graphics/models/render-encoding.js'),
    constants = require('./shape-factory-constants.js'),
    Shape = require('../display/shape.js');

function createRectPath(bounds) {
    const path = new RenderEncoding();
    path.beginPath()
        .rect(bounds.origin.x, bounds.origin.y, bounds.size.width, bounds.size.height);
    return path;
}

function createEllipsePath(bounds) {
    const path = new RenderEncoding(),
        radiusX = bounds.size.width / 2,
        radiusY = bounds.size.height / 2;

    path.beginPath()
        .ellipse(bounds.origin.x + radiusX, bounds.origin.y + radiusY, radiusX, radiusY, 0, 0, Math.PI * 2);
    return path;
}

function createShape(type, bounds, contextProperties) {
    const orientedBounds = graphicsFunctions.getOrientedRect(bounds);
    let path;

    switch (type) {
    case constants.TYPE_RECTANGLE:
        path = createRectPath(orientedBounds);
        break;
    case constants.TYPE_ELLIPSE:
        path = createEllipsePath(orientedBounds);
        break;
    default:
        throw new Error(`Unknown shape type ${type}.`);
    }

    return new Shape(orientedBounds, path, contextProperties);
}


module.exports = createShape;
