'use strict';

const constants = {
    // path operations
    BEGIN_PATH: 'beginPath',
    CLOSE_PATH: 'closePath',
    MOVE_TO: 'moveTo',
    LINE_TO: 'lineTo',
    BEZIER_CURVE_TO: 'bezierCurveTo',
    QUADRATIC_CURVE_TO: 'quadracticCurveTo',
    ARC: 'arc',
    ARC_TO: 'arcTo',
    ELLIPSE: 'ellipse',
    RECT: 'rect',

    // transform operations
    ROTATE: 'rotate',
    SCALE: 'scale',
    TRANSLATE: 'translate'
};

Object.freeze(constants);

module.exports = constants;
