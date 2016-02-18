'use strict';

const internal = require('../../ward-lib/create-internal.js').createInternal(),
    mouseEventConstants = require('../../ward-lib/events/mouse-event-constants.js'),
    getCanvasMouseEventManager = require('../../ward-lib/events/get-canvas-mouse-event-manager.js'),
    graphicsFunctions = require('../../ward-lib/graphics/models/graphics-functions.js'),
    RenderEncoding = require('../../ward-lib/graphics/models/render-encoding.js'),
    renderContext = require('../../ward-lib/graphics/renderers/context-renderer.js'),
    displayFunctions = require('./display-functions.js'),
    AbstractShape = require('./abstract-shape.js'),
    ContextProperties = require('../models/context-properties.js');

//----------------------------------------------------------------------------------------------------------------------
//
// private methods
//
//----------------------------------------------------------------------------------------------------------------------

function _hasShapeForPoint(point) {
    const properties = internal(this),
        shapes = properties.shapes,
        ctx = properties.ctx;

    for (let shape of shapes) {

        if (shape.isPointInShape(ctx, point)) {
            return true;
        }
    }

    return false;
}

function _setupMouseHandlers() {
    const mouseEventManager = getCanvasMouseEventManager();

    mouseEventManager.on(mouseEventConstants.MOUSEMOVE, _handleMouseMove, this);
    mouseEventManager.on(mouseEventConstants.MOUSEUP, _handleMouseUp, this);
}

function _removeMouseDownListener() {
    getCanvasMouseEventManager().off(mouseEventConstants.MOUSEDOWN, _handleMouseDown);
}

function _handleMouseDown(evt) {

    if (_hasShapeForPoint.call(this, evt.location)) {
        _setupMouseHandlers.call(this);
    }

    if (this.isEmpty()) {
        _removeMouseDownListener();
    }
}

function _handleMouseMove(evt) {
    const properties = internal(this),
        transformEncoding = properties.transformEncoding,
        redrawCallback = properties.redrawCallback,
        moveOffset = graphicsFunctions.getOffsetSize(evt.previousLocation, evt.location);

    transformEncoding.translate(moveOffset.width, moveOffset.height);
    redrawCallback();
}

function _handleMouseUp() {
    const properties = internal(this),
        shapes = properties.shapes,
        transformEncoding = properties.transformEncoding,
        redrawCallback = properties.redrawCallback,
        mouseEventManager = getCanvasMouseEventManager();

    mouseEventManager.off(mouseEventConstants.MOUSEMOVE, _handleMouseMove);
    mouseEventManager.off(mouseEventConstants.MOUSEUP, _handleMouseUp);
    mouseEventManager.on(mouseEventConstants.MOUSEDOWN, _handleMouseDown, this);

    for (let shape of shapes) {
        shape.applyTransformEncoding(transformEncoding);
    }

    transformEncoding.clear();
    properties.bounds = displayFunctions.getUnionBounds(shapes);
    redrawCallback();
}

/**
 * ShapeEditor
 * Manages a collection of shapes (selected, effectively). Creates an outline rendering of the shapes when drawn,
 * and also manages applying affine transforms to the shapes.
 *
 * @class
 */
class ShapeEditor extends AbstractShape {

    constructor(shapes, redrawCallback, ctx) {
        let propertiesWrapper = {};
        super(propertiesWrapper);
        const properties = internal(this, propertiesWrapper.properties);
        properties.locked = true;
        properties.shapes = new Set(shapes);
        properties.contextProperties = new ContextProperties([['strokeStyle', 'blue'], ['lineWidth', 1]]);
        properties.bounds = displayFunctions.getUnionBounds(shapes);
        properties.redrawCallback = redrawCallback;
        properties.ctx = ctx;
        properties.transformEncoding = new RenderEncoding();
        _setupMouseHandlers.call(this);
    }

    addShape(shape) {
        const properties = internal(this),
            shapes = properties.shapes;

        shapes.add(shape);
        properties.bounds = displayFunctions.getUnionBounds(shapes);
        _setupMouseHandlers.call(this);
    }

    removeShape(shape) {
        const properties = internal(this),
            shapes = properties.shapes;
        shapes.delete(shape);
        properties.bounds = displayFunctions.getUnionBounds(shapes);

        if (this.isEmpty()) {
            _removeMouseDownListener();
        }
    }

    removeAllShapes() {
        const properties = internal(this),
            shapes = properties.shapes;
        shapes.clear();
        properties.bounds = graphicsFunctions.zeroRect;
        _removeMouseDownListener();
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
        renderContext(ctx, properties.transformEncoding);
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
