/**
 * `CompositeShape` can be used to create groupings of shapes, and manipulate them as a unit.
 */

'use strict';

const internal = require('../../ward-lib/create-internal.js').createInternal(),
    AbstractShape = require('./abstract-shape.js'),
    graphicsFunctions = require('../../ward-lib/graphics/models/graphics-functions.js');

function getUnionBounds(shapes) {
    let unionBounds,
        allBounds = [];

    for (let shape of shapes) {
        allBounds.push(shape.bounds);
    }

    unionBounds = graphicsFunctions.getUnionRect.apply(null, allBounds);

    return unionBounds;
}


class CompositeShape extends AbstractShape {

    constructor(shapes) {
        let propoertiesWrapper = {};
        super(propoertiesWrapper);
        const properties = internal(this, propoertiesWrapper.properties);

        properties.shapes = shapes;
        properties.bounds = getUnionBounds(shapes);

        // start with identity matrix
        properties.transform = [1, 0, 0, 1, 0, 0];
    }

    draw(ctx) {
        const properties = internal(this);
        ctx.save();
        ctx.setTransform.apply(ctx, properties.transform);

        for (let shape of properties.shapes) {
            shape.draw(ctx);
        }

        ctx.restore();
    }

    /**
     * Called when "breaking" the group of shapes. Returns an array of the composed shapes so that they can be handled
     * individually.
     *
     * @return {Array} an array of any composed Shapes
     */
    removeAll() {
        const properties = internal(this),
            shapes = properties.shapes;
        delete properties.shapes;


        return shapes;
    }

}

module.exports = CompositeShape;
