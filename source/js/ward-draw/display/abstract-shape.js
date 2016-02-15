'use strict';

const internal = require('../../ward-lib/create-internal.js').createInternal();

class AbstractShape {

    constructor(propertiesWrapper) {
        const properties = internal(this);
        propertiesWrapper.properties = properties;
    }

    getBounds() {
        return internal(this).bounds;
    }

}

module.exports = AbstractShape;
