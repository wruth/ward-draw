'use strict';

const internal = require('../../ward-lib/create-internal.js').createInternal();

/**
 * DisplayList
 */
class DisplayList {

    constructor() {
        const properties = internal(this);
        properties.list = [];
    }

    addShape(shape) {
        internal(this).list.push(shape);
        return this;
    }

    removeAll() {
        internal(this).list = [];
    }

    getIterator() {
        return internal(this).list[Symbol.iterator]();
    }

}

module.exports = DisplayList;
