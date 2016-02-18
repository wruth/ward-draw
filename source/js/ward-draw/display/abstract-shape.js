'use strict';

const internal = require('../../ward-lib/create-internal.js').createInternal(),
    RenderEncoding = require('../../ward-lib/graphics/models/render-encoding.js'),
    RectTrasformContext = require('../../ward-lib/graphics/models/rect-transform-context.js'),
    renderContext = require('../../ward-lib/graphics/renderers/context-renderer.js');

class AbstractShape {

    constructor(propertiesWrapper) {
        const properties = internal(this);
        properties.locked = false;
        properties.transformEncoding = new RenderEncoding();
        propertiesWrapper.properties = properties;
    }

    applyTransformEncoding(transformEncoding) {
        const properties = internal(this),
            rectContext = new RectTrasformContext(properties.bounds);
        renderContext(properties.transformEncoding, transformEncoding);
        renderContext(rectContext, transformEncoding);
        properties.bounds = rectContext.rect;
    }

    get bounds() {
        return internal(this).bounds;
    }

    get locked() {
        return internal(this).locked;
    }

    set locked(isLocked) {
        internal(this).locked = isLocked;
    }

}

module.exports = AbstractShape;
