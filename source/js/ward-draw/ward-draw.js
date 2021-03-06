'use strict';

const internal = require('../ward-lib/create-internal.js').createInternal(),
    wardDrawConstants = require('./ward-draw-constants.js'),
    mouseEventConstants = require('../ward-lib/events/mouse-event-constants.js'),
    Size = require('../ward-lib/graphics/models/size.js'),
    Rect = require('../ward-lib/graphics/models/rect.js'),
    getCanvasEventManager = require('../ward-lib/events/get-canvas-event-manager.js'),
    ContextProperties = require('./models/context-properties.js'),
    DisplayList = require('./display/display-list.js'),
    DisplayListRenderer = require('./display/display-list-renderer.js'),
    ShapeEditor = require('./display/shape-editor.js'),
    createShape = require('./factories/shape-factory.js'),
    shapeFactoryConstants = require('./factories/shape-factory-constants.js'),
    createBackgroundShape = require('./factories/background-shape-factory.js'),
    modeToShapeMap = new Map([
        [wardDrawConstants.MODE_CREATE_ELLIPSES, shapeFactoryConstants.TYPE_ELLIPSE],
        [wardDrawConstants.MODE_CREATE_RECTANGLES, shapeFactoryConstants.TYPE_RECTANGLE]
    ]),
    cursorMap = {
        tl: 'nwse-resize',
        t: 'ns-resize',
        tr: 'nesw-resize',
        r: 'ew-resize',
        br: 'nwse-resize',
        b: 'ns-resize',
        bl: 'nesw-resize',
        l: 'ew-resize'
    };


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

function _addShapeToShapeEditor(shape) {
    const properties = internal(this);
    properties.displayList.addShape(new ShapeEditor([shape], _redraw.bind(this), properties.ctx));
}

function _destroyShapeEditor() {
    const properties = internal(this),
        displayList = properties.displayList;

    if (displayList.getTopShape() instanceof ShapeEditor) {
        let shapeEditor = displayList.removeTopShape();
        shapeEditor.removeAllShapes();
    }
}

function _addShape(bounds) {
    const properties = internal(this);

    _destroyShapeEditor.call(this);
//    try {
        let shape = createShape(modeToShapeMap.get(properties.mode), bounds, properties.contextProperties.clone());
        properties.displayList.addShape(shape);
        _addShapeToShapeEditor.call(this, shape);
//    }
//    catch (err) {
//        console.log(err.message);
//    }

}

function _getFirstSelectableShape(point) {
    const properties = internal(this),
        ctx = properties.ctx,
        listIterator = properties.displayList.getSelectionIterator();
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
    const eventManager = getCanvasEventManager(),
        self = this;

    eventManager.setCanvas(canvas);
    eventManager.on(mouseEventConstants.MOUSEDOWN, _handleMouseDown, this);

    eventManager.on(wardDrawConstants.EVENT_MOUSEENTER_HANDLE, function (evt) {
        canvas.style.cursor = cursorMap[evt.handleId];
    });

    eventManager.on(wardDrawConstants.EVENT_MOUSELEAVE_HANDLE, function () {
        _refreshModeCursor.call(self);
    });
}

function _doShapeSelection(evt) {
    const properties = internal(this),
        displayList = properties.displayList,

        // this might be null, no selected shape...
        selectedShape = _getFirstSelectableShape.call(this, evt.location),
        topShape = displayList.getTopShape();

    let isDisplayChanged = false;

    // there is an existing ShapeEditor
    if (topShape instanceof ShapeEditor) {
        const shapeEditor = topShape;

        // if there's no selected shape, remove all the shapes from the shapeEditor
        if (!selectedShape) {
            shapeEditor.removeAllShapes();
        }
        // if the shift key is down, going to either add or remove the selectedShape from the shapeEditor
        else if (evt.shiftKey) {

            // if the shapeEditor already has the shape, remove it from the editor
            if (shapeEditor.hasShape(selectedShape)) {
                shapeEditor.removeShape(selectedShape);
            }
            // if the shapeEditor does not have the shape, add it to the editor
            else {
                shapeEditor.addShape(selectedShape);
            }
            isDisplayChanged = true;
        }
        // shift key not down, so status quo if shape already in shapeEditor, otherwise replace all shapes
        else if (!shapeEditor.hasShape(selectedShape)) {
            shapeEditor.removeAllShapes();
            shapeEditor.addShape(selectedShape);
            isDisplayChanged = true;
        }

        // if the shapeEditor is empty need to remove it from the display list so it can be gc'd
        if (shapeEditor.isEmpty()) {
            displayList.removeTopShape();
            isDisplayChanged = true;
        }

    }
    // no ShapeEditor so create one
    else if (selectedShape) {
        _addShapeToShapeEditor.call(this, selectedShape);

        isDisplayChanged = true;
    }

    return isDisplayChanged;
}

function _refreshModeCursor() {
    const properties = internal(this);

    properties.canvas.style.cursor = (properties.mode === wardDrawConstants.MODE_SELECT_SHAPES)
        ? 'pointer' : 'crosshair';
}


//----------------------------------------------------------------------------------------------------------------------
//
// event handlers
//
//----------------------------------------------------------------------------------------------------------------------

function _handleMouseDown(evt) {
    const properties = internal(this),
        eventManager = getCanvasEventManager();

    // just supporting click selects at the moment
    if (properties.mode === wardDrawConstants.MODE_SELECT_SHAPES) {

        // if the shape selection resulted in some display change, redraw
        if (_doShapeSelection.call(this, evt)) {
            _redraw.call(this);
        }

    }
    else {
        properties.mouseDownPoint = evt.location;
        eventManager.on(mouseEventConstants.MOUSEMOVE, _handleMouseMove, this);
        eventManager.on(mouseEventConstants.MOUSEUP, _handleMouseUp, this);
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
        eventManager = getCanvasEventManager();

    eventManager.off(mouseEventConstants.MOUSEMOVE, _handleMouseMove);
    eventManager.off(mouseEventConstants.MOUSEUP, _handleMouseUp);

    if (properties.dragRect) {
        _addShape.call(this, properties.dragRect);
    }

    delete properties.mouseDownPoint;
    delete properties.dragRect;
    _redraw.call(this);
}

/**
 * `WardDraw`
 * @class
 */
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
        properties.canvas = canvas;
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
        _refreshModeCursor.call(this);
    }

    removeAll() {
        const properties = internal(this);
        properties.displayList.removeAllShapes();
        properties.displayList.addShape(properties.backgroundShape);
        _redraw.call(this);
    }
}

module.exports = WardDraw;
