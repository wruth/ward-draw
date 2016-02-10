const internal = require('../ward-lib/create-internal.js').createInternal(),
    Point = require('../ward-lib/graphics/point.js'),
    Size = require('../ward-lib/graphics/size.js'),
    Rect = require('../ward-lib/graphics/rect.js');


//----------------------------------------------------------------------------------------------------------------------
//
// functions
//
//----------------------------------------------------------------------------------------------------------------------

function drawRedSquare(ctx, rect) {
    ctx.save();
    ctx.fillStyle = 'red';
    ctx.fillRect(rect.origin.x, rect.origin.y, rect.size.width, rect.size.height);
    ctx.restore();
}

function drawBackground(ctx, size) {
    const halfSize = { width: size.width / 2, height: size.height / 2 };

    ctx.save();

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, size.width, size.height);
    ctx.translate(halfSize.width, halfSize.height);

    // draw cross-hairs
    ctx.strokeStyle = 'grey';
    ctx.lineWidth = 2;
    ctx.moveTo(0, -halfSize.height);
    ctx.lineTo(0, halfSize.height);
    ctx.moveTo(-halfSize.width, 0);
    ctx.lineTo(halfSize.width, 0);
    ctx.stroke();

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
        size = properties.size;

    ctx.clearRect(0, 0, size.width, size.height);

    drawBackground(ctx, size);

    if (properties.dragRect) {
        drawRedSquare(ctx, properties.dragRect);
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
    delete properties.mouseDownPoint;
    delete properties.dragRect;
}


//----------------------------------------------------------------------------------------------------------------------
//
// constructor
//
//----------------------------------------------------------------------------------------------------------------------

const WardDraw = function (canvas, size) {
    const properties = internal(this);
    canvas.width = size.width;
    canvas.height = size.height;

    properties.canvas = canvas;
    properties.size = size;
    properties.ctx = canvas.getContext('2d');

    _setupHandlers.call(this);
    _redraw.call(this);
};

module.exports = WardDraw;
