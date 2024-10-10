import { BonusPipe } from './bonus.pipe';

describe('BonusPipe', () => {
  describe('unit', () => {
    let pipe: BonusPipe;

    beforeEach(() => {
      pipe = new BonusPipe();
    });

    const plusNumbers = [0, 1, 2, 10, 100];

    plusNumbers.forEach(test => {
      it(`should return +${test}`, () => {
          var bonus = pipe.transform(test);
          expect(bonus).toEqual(`+${test}`);
      });
      
      it(`should return +${test} with condition`, () => {
        var bonus = pipe.transform(test, true);
        expect(bonus).toEqual(`+${test} *`);
      });
      
      it(`should return +${test} with condition and plus`, () => {
        var bonus = pipe.transform(test, true, true);
        expect(bonus).toEqual(`+${test} *`);
      });
      
      it(`should return +${test} with condition but without plus`, () => {
        var bonus = pipe.transform(test, true, false);
        expect(bonus).toEqual(`${test} *`);
      });
      
      it(`should return +${test} without condition`, () => {
        var bonus = pipe.transform(test, false);
        expect(bonus).toEqual(`+${test}`);
      });
      
      it(`should return +${test} without condition or plus`, () => {
        var bonus = pipe.transform(test, false, false);
        expect(bonus).toEqual(`${test}`);
      });
      
      it(`should return +${test} without condition but with plus`, () => {
        var bonus = pipe.transform(test, false, true);
        expect(bonus).toEqual(`+${test}`);
      });
    });

    const minusNumbers = [-1, -2, -10, -100];

    minusNumbers.forEach(test => {
      it(`should return ${test}`, () => {
          var bonus = pipe.transform(test);
          expect(bonus).toEqual(`-${Math.abs(test)}`);
      });
      
      it(`should return ${test} with condition`, () => {
        var bonus = pipe.transform(test, true);
        expect(bonus).toEqual(`-${Math.abs(test)} *`);
      });
      
      it(`should return ${test} with condition and plus`, () => {
        var bonus = pipe.transform(test, true, true);
        expect(bonus).toEqual(`-${Math.abs(test)} *`);
      });
      
      it(`should return ${test} with condition but without plus`, () => {
        var bonus = pipe.transform(test, true, false);
        expect(bonus).toEqual(`-${Math.abs(test)} *`);
      });
      
      it(`should return ${test} without condition`, () => {
        var bonus = pipe.transform(test, false);
        expect(bonus).toEqual(`-${Math.abs(test)}`);
      });
      
      it(`should return ${test} without condition or plus`, () => {
        var bonus = pipe.transform(test, false, false);
        expect(bonus).toEqual(`-${Math.abs(test)}`);
      });
      
      it(`should return ${test} without condition but with plus`, () => {
        var bonus = pipe.transform(test, false, true);
        expect(bonus).toEqual(`-${Math.abs(test)}`);
      });
    });
  });
});
