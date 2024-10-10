import { BonusPipe } from './bonus.pipe';
import { BonusesPipe } from './bonuses.pipe';

describe('BonusesPipe', () => {
  describe('unit', () => {
    let pipe: BonusesPipe;

    beforeEach(() => {
      const bonusPipe = new BonusPipe();
      pipe = new BonusesPipe(bonusPipe);
    });

    const plusNumbers = [0, 1, 2, 10, 100];

    plusNumbers.forEach(test => {
      it(`should return +${test}`, () => {
          var bonus = pipe.transform([test]);
          expect(bonus).toEqual(`+${test}`);
      });
      
      it(`should return +${test} with condition`, () => {
        var bonus = pipe.transform([test], true);
        expect(bonus).toEqual(`+${test} *`);
      });
      
      it(`should return +${test} with condition and plus`, () => {
        var bonus = pipe.transform([test], true, true);
        expect(bonus).toEqual(`+${test} *`);
      });
      
      it(`should return +${test} with condition but without plus`, () => {
        var bonus = pipe.transform([test], true, false);
        expect(bonus).toEqual(`${test} *`);
      });
      
      it(`should return +${test} without condition`, () => {
        var bonus = pipe.transform([test], false);
        expect(bonus).toEqual(`+${test}`);
      });
      
      it(`should return +${test} without condition or plus`, () => {
        var bonus = pipe.transform([test], false, false);
        expect(bonus).toEqual(`${test}`);
      });
      
      it(`should return +${test} without condition but with plus`, () => {
        var bonus = pipe.transform([test], false, true);
        expect(bonus).toEqual(`+${test}`);
      });
    });

    const minusNumbers = [-1, -2, -10, -100];

    minusNumbers.forEach(test => {
      it(`should return ${test}`, () => {
        var bonus = pipe.transform([test]);
        expect(bonus).toEqual(`-${Math.abs(test)}`);
      });
      
      it(`should return ${test} with condition`, () => {
        var bonus = pipe.transform([test], true);
        expect(bonus).toEqual(`-${Math.abs(test)} *`);
      });
      
      it(`should return ${test} with condition and plus`, () => {
        var bonus = pipe.transform([test], true, true);
        expect(bonus).toEqual(`-${Math.abs(test)} *`);
      });
      
      it(`should return ${test} with condition but without plus`, () => {
        var bonus = pipe.transform([test], true, false);
        expect(bonus).toEqual(`-${Math.abs(test)} *`);
      });
      
      it(`should return ${test} without condition`, () => {
        var bonus = pipe.transform([test], false);
        expect(bonus).toEqual(`-${Math.abs(test)}`);
      });
      
      it(`should return ${test} without condition or plus`, () => {
        var bonus = pipe.transform([test], false, false);
        expect(bonus).toEqual(`-${Math.abs(test)}`);
      });
      
      it(`should return ${test} without condition but with plus`, () => {
        var bonus = pipe.transform([test], false, true);
        expect(bonus).toEqual(`-${Math.abs(test)}`);
      });
    });
    
    it(`should return +6/+1`, () => {
      var bonus = pipe.transform([6, 1]);
      expect(bonus).toEqual(`+6/+1`);
    });
    
    it(`should return +6/+1 with condition`, () => {
      var bonus = pipe.transform([6, 1], true);
      expect(bonus).toEqual(`+6/+1 *`);
    });
    
    it(`should return +4/-1`, () => {
      var bonus = pipe.transform([4, -1]);
      expect(bonus).toEqual(`+4/-1`);
    });
    
    it(`should return +4/-1 with condition`, () => {
      var bonus = pipe.transform([4, -1], true);
      expect(bonus).toEqual(`+4/-1 *`);
    });
    
    it(`should return +92/+66/+90/+21`, () => {
      var bonus = pipe.transform([92, 66, 90, 21]);
      expect(bonus).toEqual(`+92/+66/+90/+21`);
    });
    
    it(`should return +92/+66/+90/+21 with condition`, () => {
      var bonus = pipe.transform([92, 66, 90, 21], true);
      expect(bonus).toEqual(`+92/+66/+90/+21 *`);
    });
  });
});
