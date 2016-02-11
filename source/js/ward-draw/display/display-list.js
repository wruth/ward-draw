const internal = require('../../ward-lib/create-internal.js').createInternal();

/**
 * DisplayList
 *
 * @constructor
 */
const DisplayList = function () {
    const properties = internal(this);
    properties.list = [];
};

DisplayList.prototype.addShape = function (shape) {
    internal(this).list.push(shape);
    return this;
};

DisplayList.prototype.removeAll = function () {
    internal(this).list = [];
};

DisplayList.prototype.getIterator = function () {
    return internal(this).list[Symbol.iterator]();
};

module.exports = DisplayList;
