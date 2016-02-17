'use strict';

const internal = require('../ward-lib/create-internal.js').createInternal(),
    wardDrawConstants = require('./ward-draw-constants.js'),
    Point = require('../ward-lib/graphics/models/point.js'),
    Size = require('../ward-lib/graphics/models/size.js'),
    Rect = require('../ward-lib/graphics/models/rect.js'),
    ContextProperties = require('./models/context-properties.js'),
    DisplayList = require('./display/display-list.js'),
    DisplayListRenderer = require('./display/display-list-renderer.js'),
    createShape = require('./factories/shape-factory.js'),
    shapeFactoryConstants = require('./factories/shape-factory-constants.js'),
    createBackgroundShape = require('./factories/background-shape-factory.js'),
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

function _getFirstSelectableShape(point) {
    const properties = internal(this),
        ctx = properties.ctx,
        listIterator = properties.displayList.getIterator();

    for (let element = listIterator.next(); !element.done; element = listIterator.next()) {
        let shape = element.value;

        if (!shape.locked && shape.isPointInShape(ctx, point)) {
            console.log('point in shape!');
            break;
        }
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
        canvas = properties.canvas,
        mouseDownPoint = _getMousePosition.call(this, evt);

    // just supporting click selects at the moment
    if (properties.mode === wardDrawConstants.MODE_SELECT_SHAPES) {
        _getFirstSelectableShape.call(this, mouseDownPoint);
    } else {
        properties.mouseDownPoint = mouseDownPoint;
        canvas.addEventListener('mousemove', properties.handleMouseMove, false);
        canvas.addEventListener('mouseup', properties.handleMouseUp, false);
    }
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


class WardDraw {

    /**
     * @constructor
     * @param {Canvas} canvas a Canvas instance
     * @param {Size} size a Size instance
     */
    constructor(canvas, size) {
        const properties = internal(this);
        canvas.width = size.width;
        canvas.height = size.height;

        properties.canvas = canvas;
        properties.size = size;
        properties.ctx = canvas.getContext('2d');
        properties.contextProperties = new ContextProperties();
        properties.displayList = new DisplayList();
        properties.displayListRenderer = new DisplayListRenderer(properties.ctx);
        properties.backgroundShape = createBackgroundShape(size);
        properties.mode = wardDrawConstants.MODE_CREATE_RECTANGLES;

        _setupHandlers.call(this);

        // causes the backgroundShape to be added and a _redraw
        this.removeAll();
    }

    setContextProperty(key, value) {
        internal(this).contextProperties.set(key, value);
    }

    setMode(mode) {
        internal(this).mode = mode;
    }

    removeAll() {
        const properties = internal(this);
        properties.displayList.removeAll();
        properties.displayList.addShape(properties.backgroundShape);
        _redraw.call(this);
    }
}

module.exports = WardDraw;
