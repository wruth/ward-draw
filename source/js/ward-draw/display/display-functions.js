'use strict';

const graphicsFunctions = require('../../ward-lib/graphics/models/graphics-functions.js');

function getUnionBounds(shapes) {
    let unionBounds,
        allBounds = [];

    for (let shape of shapes) {
        allBounds.push(shape.bounds);
    }

    unionBounds = graphicsFunctions.getUnionRect.apply(null, allBounds);

    return unionBounds;
}

const displayFunctions = {
    getUnionBounds: getUnionBounds
};

module.exports = displayFunctions;
