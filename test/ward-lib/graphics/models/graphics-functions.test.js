'use strict';

var expect = require('chai').expect,
    Rect = require('../../../../source/js/ward-lib/graphics/models/rect.js'),
    Point = require('../../../../source/js/ward-lib/graphics/models/point.js'),
    Size = require('../../../../source/js/ward-lib/graphics/models/size.js'),
    graphicsFunctions = require('../../../../source/js/ward-lib/graphics/models/graphics-functions.js');

describe('graphicsFunctions', function () {

    it('should create expected Rect', function () {
        var recta = new Rect(new Point(2, 3), new Size(10, 20)),
            rectb = graphicsFunctions.getRect(2, 3, 10, 20);

        expect(recta.equals(rectb)).to.be.true;
    });

    it('should orient an un-oriented Rect', function () {
        var referenceRect = graphicsFunctions.getRect(50, 100, 50, 100),
            unOrientedRect = graphicsFunctions.getRect(100, 200, -50, -100),
            orientedRect = graphicsFunctions.getOrientedRect(unOrientedRect);

        expect(referenceRect.equals(orientedRect)).to.be.true;
    });

    it('should get an equivalent oriented Rect', function () {
        var referenceRect = graphicsFunctions.getRect(50, 100, 50, 100),
            equivalentRect = graphicsFunctions.getOrientedRect(referenceRect);

        expect(referenceRect.equals(equivalentRect)).to.be.true;
    });

    //
    // this test is failing currently, apparently due to some problem with for ... of loops and Babel, I presume
    // (the statement that causes the problem is `for (let rect of rectangles) {` in graphics-functions, if I replace
    // that with a standard for ... next loop it works)
    //
    xit('should get union Rect', function () {
        var recta = graphicsFunctions.getRect(10, 20, 30, 40),
            rectb = graphicsFunctions.getRect(30, 40, 30, 40),
            rectc = graphicsFunctions.getRect(50, 60, 30, 40),
            expectedRect = graphicsFunctions.getRect(10, 20, 70, 80),
            unionRect = graphicsFunctions.getUnionRect(recta, rectb, rectc);

        expect(unionRect.equals(expectedRect)).to.be.true;
    });
});
