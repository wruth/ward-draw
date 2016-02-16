/**
 * `ShapeSelection` collects one or more 'selected' Shapes.
 */

 'use strict';

 const internal = require('../../ward-lib/create-internal.js').createInternal();

 class ShapeSelection {

    constructor(shapes) {
        const properties = internal(this);
        properties.shapes = new Set(shapes);
    }

    addShape(shape) {
        internal(this).shapes.add(shape);
        return this;
    }

    removeShape(shape) {
        internal(this).shapes.delete(shape);
        return this;
    }

    removeAll() {
        internal(this).shapes.clear();
        return this;
    }

    getIterator() {
        return internal(this).shapes[Symbol.interator]();
    }
 }

 module.exports = ShapeSelection;
