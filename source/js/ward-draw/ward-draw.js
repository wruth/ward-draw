let internal = require('../ward-lib/create-internal.js').createInternal(),
    Point = require('../ward-lib/graphics/point.js'),
    Size = require('../ward-lib/graphics/size.js'),
    Rect = require('../ward-lib/graphics/rect.js');

function _redraw() {
    let properties = internal(this),
        ctx = properties.ctx,
        size = properties.size,
        halfSize = { width: size.width / 2, height: size.height / 2 };

    ctx.clearRect(0, 0, size.width, size.height);
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

    if (properties.dragRect) {
        _drawRedSquare(ctx, properties.dragRect);
    }
}

function _getMousePosition(evt) {
    let canvas = internal(this).canvas,
        rect = canvas.getBoundingClientRect();

    return new Point(evt.clientX - rect.left, evt.clientY - rect.top);
}

function _drawRedSquare(context, rect) {
    context.save();
    context.fillStyle = 'red';
    context.fillRect(rect.origin.x, rect.origin.y, rect.size.width, rect.size.height);
    context.restore();
}

function _setupHandlers() {
    let properties = internal(this),
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
    let properties = internal(this),
        canvas = properties.canvas;

    properties.mouseDownPoint = _getMousePosition.call(this, evt);
    canvas.addEventListener('mousemove', properties.handleMouseMove, false);
    canvas.addEventListener('mouseup', properties.handleMouseUp, false);
}

function _handleMouseMove(evt) {
    let properties = internal(this),
        mouseMovePoint = _getMousePosition.call(this, evt),
        size = new Size(mouseMovePoint.x - properties.mouseDownPoint.x, mouseMovePoint.y - properties.mouseDownPoint.y),
        rect = new Rect(properties.mouseDownPoint, size);

    properties.dragRect = rect;
    _redraw.call(this);
}

function _handleMouseUp(evt) {
    let properties = internal(this),
        canvas = properties.canvas;

    canvas.removeEventListener('mousemove', properties.handleMouseMove, false);
    canvas.removeEventListener('mouseup', properties.handleMouseUp, false);

    delete properties.mouseDownPoint;
    delete properties.dragRect;
}


let WardDraw = function (canvas, size) {
    let properties = internal(this);
    canvas.width = size.width;
    canvas.height = size.height;

    properties.canvas = canvas;
    properties.size = size;
    properties.ctx = canvas.getContext('2d');

    _setupHandlers.call(this);
    _redraw.call(this);
};

module.exports = WardDraw;
