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
    });

    const minusNumbers = [-1, -2, -10, -100];

    minusNumbers.forEach(test => {
        it(`should return -${test}`, () => {
            var bonus = pipe.transform(test);
            expect(bonus).toEqual(`-${test}`);
        });
    });
  });
});
