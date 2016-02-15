'use strict';

function render(ctx, pathEncoding) {
    const encodingIterator = pathEncoding.getIterator();
    let args = null;

    for (let item = encodingIterator.next(); !item.done; item = encodingIterator.next()) {

        // check for method first, since it might not need any args ('closePath')
        if (typeof item.value === 'string') {
            ctx[item.value].apply(ctx, args);
            args = null;
        } else if (item.value instanceof Array) {
            args = item.value;
        }
    }
}

module.exports = render;
