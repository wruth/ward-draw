/**
 * `CompositeShape` can be used to create groupings of shapes, and manipulate them as a unit.
 */

'use strict';

const internal = require('../../ward-lib/create-internal.js').createInternal(),
    rectFunctions = require('../../ward-lib/graphics/models/rect-functions.js');

function getAggregateBounds(shapes) {
    let aggregateBounds;

    for (let shape of shapes) {

        if (!aggregateBounds) {
            aggregateBounds = shape.getBounds();
        } else {
            aggregateBounds = rectFunctions.getUnionRect(aggregateBounds, shape.getBounds());
        }

    }

    return aggregateBounds;
}


class CompositeShape {

    constructor(shapes) {
        const properties = internal(this);

        properties.shapes = shapes;
        properties.bounds = getAggregateBounds(shapes);

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

    getBounds() {
        return internal(this).bounds;
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
