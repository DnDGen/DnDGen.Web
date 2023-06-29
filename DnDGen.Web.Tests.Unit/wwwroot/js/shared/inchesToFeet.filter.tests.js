'use strict'

describe('Inches to Feet Filter', function () {
    var filter;

    beforeEach(module('app.shared'));

    beforeEach(inject(function (inchesToFeetFilter) {
        filter = inchesToFeetFilter;
    }));

    it('converts a height of 0', function () {
        var height = filter(0);
        expect(height).toBe('0"');
    });

    it('converts a height of less than 1 foot', function () {
        var height = filter(11);
        expect(height).toBe('11"');
    });

    it('converts a height of 1 foot', function () {
        var height = filter(12);
        expect(height).toBe("1'");
    });

    it('converts a height of 1 foot 8 inches', function () {
        var height = filter(20);
        expect(height).toBe("1' 8\"");
    });

    it('converts a height of 5 feet', function () {
        var height = filter(60);
        expect(height).toBe("5'");
    });

    it('converts a height of 5 feet 10.5 inches', function () {
        var height = filter(70.5);
        expect(height).toBe("5' 10.5\"");
    });
});