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

    getTopShape() {
        const list = internal(this);
        let top = null;

        if (list.length) {
            top = list[list.length - 1];
        }

        return top;
    }

    removeTopShape() {
        return internal(this).pop();
    }

    removeAllShapes() {
        internal(this).splice(0);
        return this;
    }

    /**
     * Rendering is from bottom to top
     */
    getRenderIterator() {
        return internal(this)[Symbol.iterator]();
    }

    /**
     * Selection is from top to bottom
     */
    getSelectionIterator() {
        const list = internal(this),
            // copy the internal array since reverse() operates in place
            reversed = list.slice(0).reverse();
        return reversed[Symbol.iterator]();
    }

}

module.exports = DisplayList;
