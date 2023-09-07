/// <reference path="../../../../wwwroot/lib/jasmine/jasmine.js"/>

describe('SAMPLE', () => {
    let myNumber: number;

    beforeEach(() => {
        myNumber = 9266;
    });

    it('gets number', () => {
        expect(myNumber).toBe(9266);
    });

    it('gets added number', () => {
        expect(myNumber + 90210).toBe(9266 + 90210);
    });

    it('resets number', () => {
        myNumber = 42;
        expect(myNumber).toBe(42);
    });
});