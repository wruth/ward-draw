'use strict';

const internal = require('../../ward-lib/create-internal.js').createInternal();

/**
 * DisplayList
 */
class DisplayList {

    constructor() {
        internal(this, []);
    }

    addShape(shape) {
        internal(this).push(shape);
        return this;
    }

    removeAll() {
        internal(this).splice(0);
        return this;
    }

    getIterator() {
        return internal(this)[Symbol.iterator]();
    }

}

module.exports = DisplayList;
