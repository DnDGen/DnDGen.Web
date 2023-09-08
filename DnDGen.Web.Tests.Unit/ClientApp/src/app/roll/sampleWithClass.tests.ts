/// <reference path="../../../../wwwroot/lib/jasmine/jasmine.js"/>
/// <reference path="./sample.calc.ts"/>

//describe('SAMPLE WITH CLASS', () => {
//    let myCalc: MyCalc;

//    beforeEach(() => {
//        myCalc = new MyCalc();
//    });

//    it('gets number', () => {
//        var newNumber = myCalc.getNumber(9266);
//        expect(newNumber).toBe(9266);
//    });

//    it('gets added number', () => {
//        var newNumber = myCalc.getNumber(9266, 90210);
//        expect(newNumber).toBe(9266 + 90210);
//    });

//    it('gets added number from spy', () => {
//        spyOn(myCalc, "getNumber").and.returnValue(42);

//        var newNumber = myCalc.getNumber(90210);
//        expect(newNumber).toBe(42);
//    });
//});