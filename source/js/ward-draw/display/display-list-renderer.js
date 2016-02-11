const internal = require('../../ward-lib/create-internal.js').createInternal();

const DisplayListRenderer = function (ctx) {
    const properties = internal(this);
    properties.ctx = ctx;
};

DisplayListRenderer.prototype.renderList = function (displayList) {
    const ctx = internal(this).ctx,
        listIterator = displayList.getIterator();

    for (let element = listIterator.next(); !element.done; element = listIterator.next()) {
        ctx.save();
        element.value.draw(ctx);
        ctx.restore();
    }
};

module.exports = DisplayListRenderer;
