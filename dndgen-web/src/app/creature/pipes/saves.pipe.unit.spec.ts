import { describe, it, expect, beforeEach } from 'vitest';
import { SavesPipe } from './saves.pipe';
import { BonusPipe } from '../../shared/pipes/bonus.pipe';
import { Save } from '../models/save.model';

describe('SavesPipe', () => {
  describe('unit', () => {
    let pipe: SavesPipe;
    let saves: { [name: string]: Save };

    beforeEach(() => {
      pipe = new SavesPipe(new BonusPipe());
      saves = {
        Fortitude: new Save(19),
        Reflex: new Save(14),
        Will: new Save(14),
      };
    });

    it('formats every save, abbreviated, in stat block order', () => {
      expect(pipe.transform(saves)).toEqual('Fort +19, Ref +14, Will +14');
    });

    it('formats the saves in stat block order whatever order they arrive in', () => {
      const reordered = { Will: saves['Will'], Fortitude: saves['Fortitude'], Reflex: saves['Reflex'] };

      expect(pipe.transform(reordered)).toEqual('Fort +19, Ref +14, Will +14');
    });

    const values = [
      { value: 0, expected: '+0' },
      { value: -1, expected: '-1' },
      { value: -5, expected: '-5' },
      { value: 30, expected: '+30' },
    ];

    values.forEach(test => {
      it(`formats a save of ${test.value}`, () => {
        saves['Will'].totalBonus = test.value;

        expect(pipe.transform(saves)).toEqual(`Fort +19, Ref +14, Will ${test.expected}`);
      });
    });

    it('marks a conditional save', () => {
      saves['Will'].isConditional = true;

      expect(pipe.transform(saves)).toEqual('Fort +19, Ref +14, Will +14 *');
    });

    it('shows a missing save as —', () => {
      saves['Reflex'].hasSave = false;

      expect(pipe.transform(saves)).toEqual('Fort +19, Ref —, Will +14');
    });
  });
});
