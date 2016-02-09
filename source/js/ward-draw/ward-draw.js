let internal = require('../ward-lib/create-internal.js').createInternal(),

    _redraw = function _redraw() {
        let properties = internal(this),
            ctx = properties.ctx,
            size = properties.size,
            halfSize = { width: size.width / 2, height: size.height / 2 };

        ctx.clearRect(0, 0, size.width, size.height);
        ctx.save();

        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, size.width, size.height);
        ctx.translate(halfSize.width, halfSize.height);

        // draw cross-hairs
        ctx.strokeStyle = 'grey';
        ctx.lineWidth = 2;
        ctx.moveTo(0, -halfSize.height);
        ctx.lineTo(0, halfSize.height);
        ctx.moveTo(-halfSize.width, 0);
        ctx.lineTo(halfSize.width, 0);
        ctx.stroke();

        ctx.restore();
    },

    WardDraw = function (canvas, size) {
        let properties = internal(this);
        canvas.width = size.width;
        canvas.height = size.height;

        properties.canvas = canvas;
        properties.size = size;
        properties.ctx = canvas.getContext('2d');

        _redraw.call(this);
    };

module.exports = WardDraw;
