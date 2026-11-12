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
        Will: new Save(42),
      };
    });

    it('formats every save, abbreviated, in stat block order', () => {
      const formattedSaves = pipe.transform(saves);
      expect(formattedSaves).toEqual('Fort +19, Ref +14, Will +42');
    });

    it('formats the saves in stat block order whatever order they arrive in', () => {
      const reordered = { Will: saves['Will'], Fortitude: saves['Fortitude'], Reflex: saves['Reflex'] };

      const formattedSaves = pipe.transform(reordered);
      expect(formattedSaves).toEqual('Fort +19, Ref +14, Will +42');
    });

    const values = [
      { value: -10, expected: '-10' },
      { value: -2, expected: '-2' },
      { value: -1, expected: '-1' },
      { value: 0, expected: '+0' },
      { value: 1, expected: '+1' },
      { value: 2, expected: '+2' },
      { value: 10, expected: '+10' },
      { value: 100, expected: '+100' },
    ];

    values.forEach(test => {
      it(`formats a Fortitude save of ${test.value}`, () => {
        saves['Fortitude'].totalBonus = test.value;

        const formattedSaves = pipe.transform(saves);
        expect(formattedSaves).toEqual(`Fort ${test.expected}, Ref +14, Will +42`);
      });
      
      it(`formats a Reflex save of ${test.value}`, () => {
        saves['Reflex'].totalBonus = test.value;

        const formattedSaves = pipe.transform(saves);
        expect(formattedSaves).toEqual(`Fort +19, Ref ${test.expected}, Will +42`);
      });
      
      it(`formats a Will save of ${test.value}`, () => {
        saves['Will'].totalBonus = test.value;

        const formattedSaves = pipe.transform(saves);
        expect(formattedSaves).toEqual(`Fort +19, Ref +14, Will ${test.expected}`);
      });
    });

    it('marks a conditional Fortitude save', () => {
      saves['Fortitude'].isConditional = true;

      const formattedSaves = pipe.transform(saves);
      expect(formattedSaves).toEqual('Fort +19 *, Ref +14, Will +42');
    });

    it('marks a conditional Reflex save', () => {
      saves['Reflex'].isConditional = true;

      const formattedSaves = pipe.transform(saves);
      expect(formattedSaves).toEqual('Fort +19, Ref +14 *, Will +42');
    });

    it('marks a conditional Will save', () => {
      saves['Will'].isConditional = true;

      const formattedSaves = pipe.transform(saves);
      expect(formattedSaves).toEqual('Fort +19, Ref +14, Will +42 *');
    });

    it('shows a missing Fortitude save as —', () => {
      saves['Fortitude'].hasSave = false;

      const formattedSaves = pipe.transform(saves);
      expect(formattedSaves).toEqual('Fort —, Ref +14, Will +42');
    });

    it('shows a missing Reflex save as —', () => {
      saves['Reflex'].hasSave = false;

      const formattedSaves = pipe.transform(saves);
      expect(formattedSaves).toEqual('Fort +19, Ref —, Will +42');
    });

    it('shows a missing Will save as —', () => {
      saves['Will'].hasSave = false;

      const formattedSaves = pipe.transform(saves);
      expect(formattedSaves).toEqual('Fort +19, Ref +14, Will —');
    });
  });
});
