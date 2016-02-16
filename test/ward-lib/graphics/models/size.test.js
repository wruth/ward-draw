'use strict';

var expect = require('chai').expect,
    Size = require('../../../../source/js/ward-lib/graphics/models/size.js');

describe('Size', function () {
    var sizea,
        sizeb,
        sizec;

    before(function () {
        sizea = new Size(1, 2);
        sizeb = new Size(1, 2);
        sizec = new Size(3, 4);
    });

    it('should be a function', function () {
        expect(Size).to.be.a('function');
    });

    it('should have expected width,height', function () {
        expect(sizea.width).to.equal(1);
        expect(sizea.height).to.equal(2);
    });

    it('should equal itself', function () {
        expect(sizea.equals(sizea)).to.be.true;
    });

    it('should equal another with same width,height', function () {
        expect(sizea.equals(sizeb)).to.be.true;
    });

    it('should not equal another with different width,height', function () {
        expect(sizea.equals(sizec)).not.to.be.true;
    });
});
