'use strict';

const rectFunctions = require('../../ward-lib/graphics/models/rect-functions.js'),
    PathEncoding = require('../../ward-lib/graphics/models/path-encoding.js'),
    constants = require('./shape-factory-constants.js'),
    Shape = require('../display/shape.js');

function createRectPath(bounds) {
    const path = new PathEncoding();
    path.beginPath()
        .rect(bounds.origin.x, bounds.origin.y, bounds.size.width, bounds.size.height);
    return path;
}

function createEllipsePath(bounds) {
    const path = new PathEncoding(),
        radiusX = bounds.size.width / 2,
        radiusY = bounds.size.height / 2;

    path.beginPath()
        .ellipse(bounds.origin.x + radiusX, bounds.origin.y + radiusY, radiusX, radiusY, 0, 0, Math.PI * 2);
    return path;
}

function createShape(type, bounds, contextProperties) {
    const orientedBounds = rectFunctions.getOrientedRect(bounds);
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
