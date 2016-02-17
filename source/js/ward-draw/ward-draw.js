'use strict';

const internal = require('../ward-lib/create-internal.js').createInternal(),
    wardDrawConstants = require('./ward-draw-constants.js'),
    mouseEventConstants = require('../ward-lib/events/mouse-event-constants.js'),
    Point = require('../ward-lib/graphics/models/point.js'),
    Size = require('../ward-lib/graphics/models/size.js'),
    Rect = require('../ward-lib/graphics/models/rect.js'),
    getCanvasMouseEventManager = require('../ward-lib/events/get-canvas-mouse-event-manager.js'),
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

    // translate for a crisp one pixel stroke
    ctx.translate(0.5, 0.5);
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
    let selectedShape = null;

    for (let element = listIterator.next(); !element.done; element = listIterator.next()) {
        let shape = element.value;

        if (!shape.locked && shape.isPointInShape(ctx, point)) {
            selectedShape = shape;
            break;
        }
    }

    return selectedShape;
}

function _setupHandlers(canvas) {
    const mouseEventManager = getCanvasMouseEventManager();

    mouseEventManager.setCanvas(canvas);
    mouseEventManager.on(mouseEventConstants.MOUSEDOWN, _handleMouseDown, this);
}


//----------------------------------------------------------------------------------------------------------------------
//
// event handlers
//
//----------------------------------------------------------------------------------------------------------------------

function _handleMouseDown(evt) {
    const properties = internal(this),
        mouseEventManager = getCanvasMouseEventManager();

    // just supporting click selects at the moment
    if (properties.mode === wardDrawConstants.MODE_SELECT_SHAPES) {
        _getFirstSelectableShape.call(this, evt.location);
    } else {
        properties.mouseDownPoint = evt.location;
        mouseEventManager.on(mouseEventConstants.MOUSEMOVE, _handleMouseMove, this);
        mouseEventManager.on(mouseEventConstants.MOUSEUP, _handleMouseUp, this);
    }
}

function _handleMouseMove(evt) {
    const properties = internal(this),
        size = new Size(evt.location.x - properties.mouseDownPoint.x, evt.location.y - properties.mouseDownPoint.y),
        rect = new Rect(properties.mouseDownPoint, size);

    properties.dragRect = rect;
    _redraw.call(this);
}

function _handleMouseUp() {
    const properties = internal(this),
        mouseEventManager = getCanvasMouseEventManager();

    mouseEventManager.off(mouseEventConstants.MOUSEMOVE, _handleMouseMove);
    mouseEventManager.off(mouseEventConstants.MOUSEUP, _handleMouseUp);

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

        properties.size = size;
        properties.ctx = canvas.getContext('2d');
        properties.contextProperties = new ContextProperties();
        properties.displayList = new DisplayList();
        properties.displayListRenderer = new DisplayListRenderer(properties.ctx);
        properties.backgroundShape = createBackgroundShape(size);
        properties.mode = wardDrawConstants.MODE_CREATE_RECTANGLES;

        _setupHandlers.call(this, canvas);

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
