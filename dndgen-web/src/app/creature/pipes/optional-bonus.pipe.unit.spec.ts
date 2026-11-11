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
      { value: 0, expected: '+0' },
      { value: 1, expected: '+1' },
      { value: 29, expected: '+29' },
      { value: -1, expected: '-1' },
      { value: -16, expected: '-16' },
    ];

    bonuses.forEach(test => {
      it(`formats ${test.value} as ${test.expected}`, () => {
        expect(pipe.transform(test.value)).toEqual(test.expected);
      });
    });
  });
});
