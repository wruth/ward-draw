'use strict';

const internal = require('../create-internal.js').createInternal();

/**
 * Stack
 * Based somewhat on this implementation:
 * https://github.com/loiane/javascript-datastructures-algorithms/blob/second-edition/chapter03/01-Stack3.js
 */
class Stack {

    constructor() {
        internal(this, []);
    }

    push(element) {
        internal(this).push(element);
    }

    pop() {
        return internal(this).pop();
    }

    peek() {
        const list = internal(this);
        let top = null;

        if (list.length) {
            top = list[list.length - 1];
        }

        return top;
    }

    isEmpty() {
        return internal(this).length === 0;
    }

    size() {
        return internal(this).length;
    }

    clear() {
        internal(this).splice(0);
        return this;
    }

    toString() {
        return internal(this).toString();
    }

    /**
     * Stack iterator should progress from the top to the bottom, emulating LIFO
     */
    getIterator() {
        const list = internal(this),
            // copy the internal array since reverse() operates in place
            reversed = list.slice(0).reverse();
        return reversed[Symbol.iterator]();
    }

}

module.exports = Stack;
