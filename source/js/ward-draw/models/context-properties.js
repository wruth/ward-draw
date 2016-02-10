const internal = require('../../ward-lib/create-internal.js').createInternal(),

    validProperties = new Set([
        'fillStyle',
        'font',
        'globalAlpha',
        'globalCompositeOperation',
        'lineCap',
        'lineDashOffset',
        'lineJoin',
        'lineWidth',
        'miterLimit',
        'shadowBlur',
        'shadowColor',
        'shadowOffsetX',
        'shadowOffsetY',
        'strokeStyle',
        'textAlign',
        'textBaseline']);

//----------------------------------------------------------------------------------------------------------------------
//
// functions
//
//----------------------------------------------------------------------------------------------------------------------

function filterProperties(properties) {

    if (properties) {

        for (let i = properties.length - 1; i >= 0; i--) {

            if (!validProperties.has(properties[i][0])) {
                properties.splice(i, 1);
            }
        }
    }

    return properties;
}

/**
 * ContextProperties
 *
 * @constructor
 * @param {iterable} iterable a collection of key/value pairs
 */
const ContextProperties = function (iterable) {
    const properties = internal(this);

    properties.map = new Map(filterProperties(iterable));
};


//----------------------------------------------------------------------------------------------------------------------
//
// public methods
//
//----------------------------------------------------------------------------------------------------------------------

ContextProperties.prototype.set = function (key, value) {

    if (validProperties.has(key)) {
        internal(this).map.set(key, value);
    }
};

ContextProperties.prototype.applyToContext = function (ctx) {
    const map = internal(this).map;

    map.forEach(function (value, key) {
        ctx[key] = value;
    });
};

ContextProperties.prototype.clone = function () {
    const map = internal(this).map;

    return new ContextProperties(map.entries());
};

module.exports = ContextProperties;
