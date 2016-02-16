'use strict';

const internal = require('../../ward-lib/create-internal.js').createInternal();

class AbstractShape {

    constructor(propertiesWrapper) {
        const properties = internal(this);
        properties.locked = false;
        propertiesWrapper.properties = properties;
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
