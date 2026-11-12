import { describe, it, expect, beforeEach } from 'vitest';
import { HitDicePipe } from './hit-dice.pipe';
import { HitPoints } from '../models/hit-points.model';

describe('HitDicePipe', () => {
  describe('unit', () => {
    let pipe: HitDicePipe;

    beforeEach(() => {
      pipe = new HitDicePipe();
    });

    const hitDice = [
      { roll: '1d8', total: 6, expected: '1d8 (6 hp)' },
      { roll: '16d8+144', total: 226, expected: '16d8+144 (226 hp)' },
      { roll: '48d12+528', total: 1337, expected: '48d12+528 (1337 hp)' },
    ];

    hitDice.forEach(test => {
      it(`formats the roll with its rolled hit points - ${test.roll}`, () => {
        const hitPoints = new HitPoints(test.total);
        hitPoints.defaultRoll = test.roll;

        const formattedHitDice = pipe.transform(hitPoints);
        expect(formattedHitDice).toEqual(test.expected);
      });
    });
  });
});
