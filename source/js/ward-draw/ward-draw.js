'use strict';

const internal = require('../ward-lib/create-internal.js').createInternal(),
    wardDrawConstants = require('./ward-draw-constants.js'),
    Point = require('../ward-lib/graphics/models/point.js'),
    Size = require('../ward-lib/graphics/models/size.js'),
    Rect = require('../ward-lib/graphics/models/rect.js'),
    ContextProperties = require('./models/context-properties.js'),
    DisplayList = require('./display/display-list.js'),
    DisplayListRenderer = require('./display/display-list-renderer.js'),
    Shape = require('./display/shape.js'),
    CompositeShape = require('./display/composite-shape.js'),
    createShape = require('./factories/shape-factory.js'),
    shapeFactoryConstants = require('./factories/shape-factory-constants.js'),
    modeToShapeMap = new Map([
        [wardDrawConstants.MODE_CREATE_ELLIPSES, shapeFactoryConstants.TYPE_ELLIPSE],
        [wardDrawConstants.MODE_CREATE_RECTANGLES, shapeFactoryConstants.TYPE_RECTANGLE]
    ]);


//----------------------------------------------------------------------------------------------------------------------
//
// functions
//
//----------------------------------------------------------------------------------------------------------------------

function drawDragRect(ctx, rect) {
    ctx.save();
    ctx.strokeStyle = 'blue';
    ctx.strokeRect(rect.origin.x, rect.origin.y, rect.size.width, rect.size.height);
    ctx.restore();
}

function createBackground(size) {
    const halfSize = new Size(size.width / 2, size.height / 2),
        bounds = new Rect(new Point(0, 0), size),
        contextPropertiesFill = new ContextProperties([['fillStyle', 'black']]),
        contextPropertiesGrid = new ContextProperties([['strokeStyle', 'grey'], ['lineWidth', 2]]),
        gridPath = new Path2D(),
        fillShape = createShape(shapeFactoryConstants.TYPE_RECTANGLE, bounds, contextPropertiesFill);

    let gridShape,
        backgroundShape;

    // draw crosshair grid

    // first vertical line
    gridPath.moveTo(halfSize.width, 0);
    gridPath.lineTo(halfSize.width, size.height);

    // then horizontal line
    gridPath.moveTo(0, halfSize.height);
    gridPath.lineTo(size.width, halfSize.height);

    gridShape = new Shape(bounds, gridPath, contextPropertiesGrid);
    backgroundShape = new CompositeShape([fillShape, gridShape]);

    return backgroundShape;
}


//----------------------------------------------------------------------------------------------------------------------
//
// private methods
//
//----------------------------------------------------------------------------------------------------------------------

function _redraw() {
    const properties = internal(this),
        ctx = properties.ctx,
        size = properties.size,
        displayList = properties.displayList,
        displayListRenderer = properties.displayListRenderer;

    ctx.clearRect(0, 0, size.width, size.height);

    displayListRenderer.renderList(displayList);

    if (properties.dragRect) {
        drawDragRect(ctx, properties.dragRect);
    }
}

function _addShape(bounds) {
    const properties = internal(this);

    try {
        let shape = createShape(modeToShapeMap.get(properties.mode), bounds, properties.contextProperties.clone());
        properties.displayList.addShape(shape);
    } catch (err) {
        console.log(err.message);
    }

}

function _getMousePosition(evt) {
    const canvas = internal(this).canvas,
        rect = canvas.getBoundingClientRect();

    return new Point(evt.clientX - rect.left, evt.clientY - rect.top);
}

function _setupHandlers() {
    const properties = internal(this),
        canvas = properties.canvas;

    canvas.addEventListener('mousedown', _handleMouseDown.bind(this), false);
    properties.handleMouseMove = _handleMouseMove.bind(this);
    properties.handleMouseUp = _handleMouseUp.bind(this);
}


//----------------------------------------------------------------------------------------------------------------------
//
// event handlers
//
//----------------------------------------------------------------------------------------------------------------------

function _handleMouseDown(evt) {
    const properties = internal(this),
        canvas = properties.canvas;

    properties.mouseDownPoint = _getMousePosition.call(this, evt);
    canvas.addEventListener('mousemove', properties.handleMouseMove, false);
    canvas.addEventListener('mouseup', properties.handleMouseUp, false);
}

function _handleMouseMove(evt) {
    const properties = internal(this),
        mouseMovePoint = _getMousePosition.call(this, evt),
        size = new Size(mouseMovePoint.x - properties.mouseDownPoint.x, mouseMovePoint.y - properties.mouseDownPoint.y),
        rect = new Rect(properties.mouseDownPoint, size);

    properties.dragRect = rect;
    _redraw.call(this);
}

function _handleMouseUp(evt) {
    const properties = internal(this),
        canvas = properties.canvas;

    canvas.removeEventListener('mousemove', properties.handleMouseMove, false);
    canvas.removeEventListener('mouseup', properties.handleMouseUp, false);

    _addShape.call(this, properties.dragRect);

    delete properties.mouseDownPoint;
    delete properties.dragRect;
    _redraw.call(this);
}

/**
 * WardDraw
 *
 * @constructor
 * @param {Canvas} canvas a Canvas instance
 * @param {Size} size a Size instance
 */
const WardDraw = function (canvas, size) {
    const properties = internal(this);
    canvas.width = size.width;
    canvas.height = size.height;

    properties.canvas = canvas;
    properties.size = size;
    properties.ctx = canvas.getContext('2d');
    properties.contextProperties = new ContextProperties();
    properties.displayList = new DisplayList();
    properties.displayListRenderer = new DisplayListRenderer(properties.ctx);
    properties.backgroundShape = createBackground(size);
    properties.mode = wardDrawConstants.MODE_CREATE_RECTANGLES;

    _setupHandlers.call(this);
    //_redraw.call(this);

    // causes the backgroundShape to be added and a _redraw
    this.removeAll();
};


//----------------------------------------------------------------------------------------------------------------------
//
// public methods
//
//----------------------------------------------------------------------------------------------------------------------

WardDraw.prototype.setContextProperty = function (key, value) {
    internal(this).contextProperties.set(key, value);
};

WardDraw.prototype.setMode = function (mode) {
    internal(this).mode = mode;
};

WardDraw.prototype.removeAll = function () {
    const properties = internal(this);
    properties.displayList.removeAll();
    properties.displayList.addShape(properties.backgroundShape);
    _redraw.call(this);
};

module.exports = WardDraw;
