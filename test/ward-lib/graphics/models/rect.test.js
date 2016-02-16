'use strict';

var expect = require('chai').expect,
    Rect = require('../../../../source/js/ward-lib/graphics/models/rect.js'),
    graphicsFunctions = require('../../../../source/js/ward-lib/graphics/models/graphics-functions.js');

describe('Rect', function () {
    var recta;

    before(function () {
        recta = graphicsFunctions.getRect(2, 3, 20, 10);
    });

    it('should be a function', function () {
        expect(Rect).to.be.a('function');
    });

    it('should have expected origin', function () {
        var origin = recta.origin;
        expect(origin.x).to.equal(2);
        expect(origin.y).to.equal(3);
    });

    it('should have expected size', function () {
        var size =  recta.size;
        expect(size.width).to.equal(20);
        expect(size.height).to.equal(10);
    });

    it('should equal another with same geometry', function () {
        var rectb = graphicsFunctions.getRect(2, 3, 20, 10);
        expect(recta.equals(rectb)).to.be.true;
    });

    it('should not equal another with different size', function () {
        var rectc = graphicsFunctions.getRect(2, 3, 10, 20);
        expect(recta.equals(rectc)).not.to.be.true;
    });

    it('should not equal another with different origin', function () {
        var rectd = graphicsFunctions.getRect(3, 2, 20, 10);
        expect(recta.equals(rectd)).not.to.be.true;
    });
});
