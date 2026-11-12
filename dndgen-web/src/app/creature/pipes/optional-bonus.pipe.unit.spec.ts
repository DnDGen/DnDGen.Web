import { describe, it, expect, beforeEach } from 'vitest';
import { OptionalBonusPipe } from './optional-bonus.pipe';
import { BonusPipe } from '../../shared/pipes/bonus.pipe';

describe('OptionalBonusPipe', () => {
  describe('unit', () => {
    let pipe: OptionalBonusPipe;

    beforeEach(() => {
      pipe = new OptionalBonusPipe(new BonusPipe());
    });

    const bonuses = [
      { value: null, expected: '—' },
      { value: undefined, expected: '—' },
      { value: -10, expected: '-10' },
      { value: -2, expected: '-2' },
      { value: -1, expected: '-1' },
      { value: 0, expected: '+0' },
      { value: 1, expected: '+1' },
      { value: 2, expected: '+2' },
      { value: 10, expected: '+10' },
      { value: 100, expected: '+100' },
    ];

    bonuses.forEach(test => {
      it(`formats ${test.value} as ${test.expected}`, () => {
        const formattedBonus = pipe.transform(test.value);
        expect(formattedBonus).toEqual(test.expected);
      });
    });
  });
});
