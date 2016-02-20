'use strict';

const internal = require('../../ward-lib/create-internal.js').createInternal(),
    mouseEventConstants = require('../../ward-lib/events/mouse-event-constants.js'),
    getCanvasEventManager = require('../../ward-lib/events/get-canvas-event-manager.js'),
    graphicsFunctions = require('../../ward-lib/graphics/models/graphics-functions.js'),
    RenderEncoding = require('../../ward-lib/graphics/models/render-encoding.js'),
    Size = require('../../ward-lib/graphics/models/size.js'),
    Point = require('../../ward-lib/graphics/models/point.js'),
    Rect = require('../../ward-lib/graphics/models/rect.js'),
    renderContext = require('../../ward-lib/graphics/renderers/context-renderer.js'),
    displayFunctions = require('./display-functions.js'),
    AbstractShape = require('./abstract-shape.js'),
    TransformHandle = require('./transform-handle.js'),
    ContextProperties = require('../models/context-properties.js');

//----------------------------------------------------------------------------------------------------------------------
//
// private methods
//
//----------------------------------------------------------------------------------------------------------------------

function _getTxRects() {
    const properties = internal(this),
        bounds = properties.bounds,
        boundsOrigin = bounds.origin,
        boundsSize = bounds.size,
        handleWH = 5,
        halfHandleWH = handleWH / 2,
        handleSize = new Size(handleWH, handleWH),
        tlPoint = new Point(boundsOrigin.x - halfHandleWH, boundsOrigin.y - halfHandleWH),
        tPoint = new Point(boundsOrigin.x + boundsSize.width / 2 - halfHandleWH, boundsOrigin.y - halfHandleWH),
        trPoint = new Point(boundsOrigin.x + boundsSize.width - halfHandleWH, boundsOrigin.y - halfHandleWH),
        rPoint = new Point(boundsOrigin.x + boundsSize.width - halfHandleWH, boundsOrigin.y + boundsSize.height / 2 - halfHandleWH),
        brPoint = new Point(boundsOrigin.x + boundsSize.width - halfHandleWH, boundsOrigin.y + boundsSize.height - halfHandleWH),
        bPoint = new Point(boundsOrigin.x + boundsSize.width / 2 - halfHandleWH, boundsOrigin.y + boundsSize.height - halfHandleWH),
        blPoint = new Point(boundsOrigin.x - halfHandleWH, boundsOrigin.y + boundsSize.height - halfHandleWH),
        lPoint = new Point(boundsOrigin.x - halfHandleWH, boundsOrigin.y + boundsSize.height / 2 - halfHandleWH),
        txRects = new Map([
            ['tl', new Rect(tlPoint, handleSize)],
            ['t', new Rect(tPoint, handleSize)],
            ['tr', new Rect(trPoint, handleSize)],
            ['r', new Rect(rPoint, handleSize)],
            ['br', new Rect(brPoint, handleSize)],
            ['b', new Rect(bPoint, handleSize)],
            ['bl', new Rect(blPoint, handleSize)],
            ['l', new Rect(lPoint, handleSize)]
        ]);

    return txRects;
}

function _createTxHandles() {
    const properties = internal(this),
        txRects = _getTxRects.call(this),
        contextProperties = new ContextProperties([
            ['strokeStyle', 'blue'],
            ['lineWidth', 1],
            ['fillStyle', 'white']]),
        txHandels = new Map([
            ['tl', new TransformHandle(txRects.get('tl'), contextProperties, 'tl')],
            ['t', new TransformHandle(txRects.get('t'), contextProperties, 't')],
            ['tr', new TransformHandle(txRects.get('tr'), contextProperties, 'tr')],
            ['r', new TransformHandle(txRects.get('r'), contextProperties, 'r')],
            ['br', new TransformHandle(txRects.get('br'), contextProperties, 'br')],
            ['b', new TransformHandle(txRects.get('b'), contextProperties, 'b')],
            ['bl', new TransformHandle(txRects.get('bl'), contextProperties, 'bl')],
            ['l', new TransformHandle(txRects.get('l'), contextProperties, 'l')]
        ]);

    _destroyTxHandles.call(this);
    properties.txHandels = txHandels;
}

function _destroyTxHandles() {
    const properties = internal(this),
        txHandels = properties.txHandels;

    if (txHandels) {

        for (let entry of txHandels) {
            entry[1].destroy();
        }
    }

    delete properties.txHandels;
}

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
    const properties = internal(this),
        eventManager = getCanvasEventManager();

    properties.isMouseUp = false;
    eventManager.on(mouseEventConstants.MOUSEMOVE, _handleMouseMove, this);
    eventManager.on(mouseEventConstants.MOUSEUP, _handleMouseUp, this);
}

function _removeMouseDownListener() {
    getCanvasEventManager().off(mouseEventConstants.MOUSEDOWN, _handleMouseDown);
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
        eventManager = getCanvasEventManager();

    eventManager.off(mouseEventConstants.MOUSEMOVE, _handleMouseMove);
    eventManager.off(mouseEventConstants.MOUSEUP, _handleMouseUp);
    eventManager.on(mouseEventConstants.MOUSEDOWN, _handleMouseDown, this);

    for (let shape of shapes) {
        shape.applyTransformEncoding(transformEncoding);
    }

    transformEncoding.clear();
    properties.bounds = displayFunctions.getUnionBounds(shapes);
    properties.isMouseUp = true;
    _createTxHandles.call(this);
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
        properties.isMouseUp = false;
        _createTxHandles.call(this);
        _setupMouseHandlers.call(this);
    }

    addShape(shape) {
        const properties = internal(this),
            shapes = properties.shapes;

        shapes.add(shape);
        properties.bounds = displayFunctions.getUnionBounds(shapes);
        _createTxHandles.call(this);
        _setupMouseHandlers.call(this);
    }

    removeShape(shape) {
        const properties = internal(this),
            shapes = properties.shapes;
        shapes.delete(shape);
        properties.bounds = displayFunctions.getUnionBounds(shapes);
        _createTxHandles.call(this);

        if (this.isEmpty()) {
            _removeMouseDownListener();
        }
    }

    removeAllShapes() {
        const properties = internal(this);
        properties.shapes.clear();
        properties.transformEncoding.clear();
        properties.bounds = graphicsFunctions.zeroRect;

        _destroyTxHandles.call(this);
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

        if (properties.isMouseUp && properties.txHandels) {

            for (let handle of properties.txHandels) {
                handle[1].draw(ctx);
            }
        }

        ctx.restore();
    }
}

module.exports = ShapeEditor;
