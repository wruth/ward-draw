const //Modernizr = require('Modernizr'),
    WardDraw = require('./ward-draw/ward-draw.js'),
    canvas = document.getElementById('canvas');

//if (Modernizr.canvas) {
    new WardDraw(canvas, {width: 500, height: 500});
//}
