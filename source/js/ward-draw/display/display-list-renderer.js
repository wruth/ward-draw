'use strict';

const internal = require('../../ward-lib/create-internal.js').createInternal();

class DisplayListRenderer {

    constructor(ctx) {
        const properties = internal(this);
        properties.ctx = ctx;
    }

    renderList(displayList) {
        const ctx = internal(this).ctx,
            listIterator = displayList.getIterator();

        for (let element = listIterator.next(); !element.done; element = listIterator.next()) {
            ctx.save();
            element.value.draw(ctx);
            ctx.restore();
        }
    }

}

module.exports = DisplayListRenderer;
