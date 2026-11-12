import { describe, it, expect, beforeEach } from 'vitest';
import { AttackSavePipe } from './attack-save.pipe';
import { AttackSave } from '../models/attack-save.model';
import { CreatureAbility } from '../models/creature-ability.model';

describe('AttackSavePipe', () => {
  describe('unit', () => {
    let pipe: AttackSavePipe;

    beforeEach(() => {
      pipe = new AttackSavePipe();
    });

    const saves = ['Fortitude', 'Reflex', 'Will'];

    saves.forEach(test => {
      it(`formats a ${test} save with its DC and ability`, () => {
        const save = new AttackSave(test, 27, 18, new CreatureAbility('Strength', 28, 9));

        const formattedSave = pipe.transform(save);
        expect(formattedSave).toEqual(`${test} DC 27 (Strength)`);
      });
    });

    it('formats a save without an ability', () => {
      const save = new AttackSave('Will', 12, 12);

      const formattedSave = pipe.transform(save);
      expect(formattedSave).toEqual('Will DC 12');
    });

    it('formats a save without a save type', () => {
      const save = new AttackSave('', 24, 16, new CreatureAbility('Constitution', 22, 6));

      const formattedSave = pipe.transform(save);
      expect(formattedSave).toEqual('DC 24 (Constitution)');
    });

    it('formats a save without a save type or an ability', () => {
      const save = new AttackSave('', 10, 10);

      const formattedSave = pipe.transform(save);
      expect(formattedSave).toEqual('DC 10');
    });
  });
});
