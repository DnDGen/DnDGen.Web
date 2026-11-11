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
      { roll: '1d8', defaultTotal: 4, total: 6, expected: '1d8 (4 hp)' },
      { roll: '16d8+144', defaultTotal: 216, total: 226, expected: '16d8+144 (216 hp)' },
      { roll: '48d12+528', defaultTotal: 840, total: 1337, expected: '48d12+528 (840 hp)' },
    ];

    hitDice.forEach(test => {
      it(`formats the roll with its average hit points, not the rolled total - ${test.roll}`, () => {
        const hitPoints = new HitPoints(test.total, test.defaultTotal);
        hitPoints.defaultRoll = test.roll;

        expect(pipe.transform(hitPoints)).toEqual(test.expected);
      });
    });
  });
});
