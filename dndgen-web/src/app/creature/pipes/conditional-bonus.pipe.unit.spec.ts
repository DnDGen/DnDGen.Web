import { describe, it, expect, beforeEach } from 'vitest';
import { ConditionalBonusPipe } from './conditional-bonus.pipe';
import { BonusPipe } from '../../shared/pipes/bonus.pipe';
import { Bonus } from '../models/bonus.model';

describe('ConditionalBonusPipe', () => {
  describe('unit', () => {
    let pipe: ConditionalBonusPipe;

    beforeEach(() => {
      pipe = new ConditionalBonusPipe(new BonusPipe());
    });

    const bonuses = [
      { value: 2, condition: 'against evil', expected: '+2 against evil' },
      { value: 0, condition: 'when raging', expected: '+0 when raging' },
      { value: -4, condition: 'in sunlight', expected: '-4 in sunlight' },
      { value: 10, condition: 'when using Change Shape', expected: '+10 when using Change Shape' },
    ];

    bonuses.forEach(test => {
      it(`formats a conditional bonus - ${test.expected}`, () => {
        const bonus = new Bonus(test.value, test.condition, true);

        const formattedBonus = pipe.transform(bonus);
        expect(formattedBonus).toEqual(test.expected);
      });
    });
  });
});
