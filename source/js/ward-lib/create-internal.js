/**
 * Factory method that effectively wraps a `WeakMap` instance, returning a function that is guaranteed to return a
 * property object for a given object key, creating the property object on the fly if necessary.
 *
 * @return {function} an accessor function which given a unique object will return a consistent property object for
 *  that object
 */
let createInternal = function () {
    let map = new WeakMap();

    return function (obj) {

        if (!map.has(obj)) {
            map.set(obj, {});
        }

        return map.get(obj);
    };
};

exports.createInternal = createInternal;
