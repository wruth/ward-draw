'use strict';

const internal = require('../create-internal.js').createInternal(),
    EventManager = require('./event-manager.js'),
    constants = require('./mouse-event-constants.js'),
    Point = require('../graphics/models/point.js');


//----------------------------------------------------------------------------------------------------------------------
//
// private methods
//
//----------------------------------------------------------------------------------------------------------------------

function _getMousePosition(evt) {
    const canvas = internal(this).canvas,
        rect = canvas.getBoundingClientRect();

    return new Point(evt.clientX - rect.left, evt.clientY - rect.top);
}

function _createEvent(evt) {
    const event = {
        type: evt.type,
        altKey: evt.altKey,
        ctrlKey: evt.ctrlKey,
        metaKey: evt.metaKey,
        shiftKey: evt.shiftKey,
        location: _getMousePosition.call(this, evt)
    };

    return event;
}

function _updateCanvasListeners() {
    const properties = internal(this),
        canvas = properties.canvas;

    if (!canvas) {
        return;
    }

    _checkCanvasListener.call(this, canvas, constants.MOUSEDOWN, properties.handleMouseDown, properties);
    _checkCanvasListener.call(this, canvas, constants.MOUSEMOVE, properties.handleMouseMove, properties);
    _checkCanvasListener.call(this, canvas, constants.MOUSEUP, properties.handleMouseUp, properties);
}

function _checkCanvasListener(canvas, type, handler, properties) {

    // if there are listeners for a type and the manager is not currently listening, start manager listening
    if (this.numListenersForType(type) && !properties[type]) {
        canvas.addEventListener(type, handler, false);
        properties[type] = true;
    }

    // if there are not listeners for a type and the manager is currently listening, stop manager listening
    if (!this.numListenersForType(type) && properties[type]) {
        canvas.removeEventListener(type, handler, false);
        properties[type] = false;
    }
}

function _handleMouseDown(evt) {
    this.trigger(constants.MOUSEDOWN, _createEvent.call(this, evt));
}

function _handleMouseMove(evt) {
    this.trigger(constants.MOUSEMOVE, _createEvent.call(this, evt));
}

function _handleMouseUp(evt) {
    this.trigger(constants.MOUSEUP, _createEvent.call(this, evt));
}


/**
 * `CanvasMouseEventManager`
 * @class
 */
class CanvasMouseEventManager extends EventManager {

    constructor() {
        super();
        const properties = internal(this);

        // initialize listening flags
        properties[constants.MOUSEDOWN] = false;
        properties[constants.MOUSEMOVE] = false;
        properties[constants.MOUSEUP] = false;

        properties.handleMouseDown = _handleMouseDown.bind(this);
        properties.handleMouseMove = _handleMouseMove.bind(this);
        properties.handleMouseUp = _handleMouseUp.bind(this);
    }

    setCanvas(canvas) {
        const properties = internal(this);

        if (!properties.canvas) {
            properties.canvas = canvas;

            // add event listeners
            _updateCanvasListeners.call(this);
        }

    }

    on(name, callback, scope) {
        super.on(name, callback, scope);
        _updateCanvasListeners.call(this);
    }

    off(name, callback) {
        super.off(name, callback);
        _updateCanvasListeners.call(this);
    }
}


// singleton instance
let instance;

/**
 * Factory method. Ensures only one instance of `CanvasMouseEventManager` is created.
 *
 * @return {CanvasMouseEventManager} a singleton instance
 */
function getInstance() {

    if (instance) {
        return instance;
    }

    instance = new CanvasMouseEventManager(canvas);

    return instance;
}

module.exports = getInstance;
