'use strict';

/**
 * Factory method that effectively wraps a `WeakMap` instance, returning a function that is guaranteed to return a
 * property object for a given object key, creating the property object on the fly if necessary.
 *
 * @return {function} an accessor function which given a unique object will return a consistent property object for
 *  that object
 */
function createInternal() {
    const map = new WeakMap();

    return function (obj, properties) {

        if (!map.has(obj)) {
            map.set(obj, properties || {});
        }

        return map.get(obj);
    };
}

exports.createInternal = createInternal;
