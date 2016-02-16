'use strict';

var expect = require('chai').expect,
    Point = require('../../../../source/js/ward-lib/graphics/models/point.js');

describe('Point', function () {
    var pointa,
        pointb,
        pointc;

    before(function () {
        pointa = new Point(1, 2);
        pointb = new Point(1, 2);
        pointc = new Point(3, 4);
    });

    it('should be a function', function () {
        expect(Point).to.be.a('function');
    });

    it('should have expected x,y', function () {
        expect(pointa.x).to.equal(1);
        expect(pointa.y).to.equal(2);
    });

    it('should equal itself', function () {
        expect(pointa.equals(pointa)).to.be.true;
    });

    it('should equal another with same x,y', function () {
        expect(pointa.equals(pointb)).to.be.true;
    });

    it('should not equal another with different x,y', function () {
        expect(pointa.equals(pointc)).not.to.be.true;
    });
});
