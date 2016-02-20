'use strict';

const internal = require('../../ward-lib/create-internal.js').createInternal(),
    AbstractShape = require('./abstract-shape.js'),
    graphicsFunctions = require('../../ward-lib/graphics/models/graphics-functions.js'),
    wardDrawConstants = require('../ward-draw-constants.js'),
    mouseEventConstants = require('../../ward-lib/events/mouse-event-constants.js'),
    getCanvasEventManager = require('../../ward-lib/events/get-canvas-event-manager.js');

function _isPointInBounds(point) {
    return graphicsFunctions.isPointInRect(point, this.bounds);
}

function _handleMouseMove(evt) {
    const properties = internal(this);

    // check for mouse leaving the handle
    if (properties.isMouseOver) {

        if (!_isPointInBounds.call(this, evt.location)) {
            properties.isMouseOver = false;
            getCanvasEventManager().trigger(
                wardDrawConstants.EVENT_MOUSELEAVE_HANDLE,
                {
                    type: wardDrawConstants.EVENT_MOUSELEAVE_HANDLE,
                    handleId: properties.id
                });
        }
    }
    // check for mouse entering the handle
    else {

        if (_isPointInBounds.call(this, evt.location)) {
            properties.isMouseOver = true;
            getCanvasEventManager().trigger(
                wardDrawConstants.EVENT_MOUSEENTER_HANDLE,
                {
                    type: wardDrawConstants.EVENT_MOUSEENTER_HANDLE,
                    handleId: properties.id
                });
        }
    }
}

class TransformHandle extends AbstractShape {

    constructor(bounds, contextProperties, id) {
        let propertiesWrapper = {};
        super(propertiesWrapper);
        const properties = internal(this, propertiesWrapper.properties);
        properties.bounds = bounds;
        properties.contextProperties = contextProperties;
        properties.id = id;
        properties.isMouseOver = false;
        properties.handleMouseMove = _handleMouseMove.bind(this);
        getCanvasEventManager().on(mouseEventConstants.MOUSEMOVE, properties.handleMouseMove);
    }

    get bounds() {
        return internal(this).bounds;
    }

    set bounds(bounds) {
        internal(this).bounds = bounds;
    }

    get id() {
        return internal(this).id;
    }

    draw(ctx) {
        const properties = internal(this),
            contextProperties = properties.contextProperties,
            bounds = this.bounds;

        ctx.save();
        contextProperties.applyToContext(ctx);
        ctx.fillRect(bounds.origin.x, bounds.origin.y, bounds.size.width, bounds.size.height);
        ctx.strokeRect(bounds.origin.x, bounds.origin.y, bounds.size.width, bounds.size.height);
        ctx.restore();
    }

    destroy() {
        getCanvasEventManager().off(mouseEventConstants.MOUSEMOVE, internal(this).handleMouseMove);
    }

}

module.exports = TransformHandle;
