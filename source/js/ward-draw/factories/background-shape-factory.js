'use strict';

const Shape = require('../display/shape.js'),
    CompositeShape = require('../display/composite-shape.js'),
    ContextProperties = require('../models/context-properties.js'),
    Rect = require('../../ward-lib/graphics/models/rect.js'),
    Size = require('../../ward-lib/graphics/models/size.js'),
    Point = require('../../ward-lib/graphics/models/point.js'),
    RenderEncoding = require('../../ward-lib/graphics/models/render-encoding.js'),
    createShape = require('./shape-factory.js'),
    shapeFactoryConstants = require('./shape-factory-constants.js');

function createBackgroundShape(size) {
    const halfSize = new Size(size.width / 2, size.height / 2),
        bounds = new Rect(new Point(0, 0), size),
        contextPropertiesFill = new ContextProperties([['fillStyle', 'black']]),
        contextPropertiesGrid = new ContextProperties([['strokeStyle', 'grey'], ['lineWidth', 2]]),
        gridPath = new RenderEncoding(),
        fillShape = createShape(shapeFactoryConstants.TYPE_RECTANGLE, bounds, contextPropertiesFill);

    let gridShape,
        backgroundShape;

    // draw crosshair grid

    // first vertical line
    gridPath
        .moveTo(halfSize.width, 0)
        .lineTo(halfSize.width, size.height)

    // then horizontal line
        .moveTo(0, halfSize.height)
        .lineTo(size.width, halfSize.height);

    gridShape = new Shape(bounds, gridPath, contextPropertiesGrid);
    backgroundShape = new CompositeShape([fillShape, gridShape]);
    backgroundShape.locked = true;

    return backgroundShape;
}

module.exports = createBackgroundShape;
