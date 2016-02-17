'use strict';

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


class ContextProperties {

    /**
     * @constructor
     * @param {iterable} iterable a collection of key/value pairs
     */
    constructor(iterable) {
        const properties = internal(this);

        properties.map = new Map(filterProperties(iterable));
    }

    set(key, value) {
        if (validProperties.has(key)) {
            internal(this).map.set(key, value);
        }
    }

    has(key) {
        return internal(this).map.has(key);
    }

    applyToContext(ctx) {
        const map = internal(this).map;

        map.forEach(function (value, key) {
            ctx[key] = value;
        });
    }

    clone() {
        const map = internal(this).map;

        return new ContextProperties(map.entries());
    }

}

module.exports = ContextProperties;
