import { describe, it, expect, beforeEach } from 'vitest';
import { AttackComponent } from './attack.component';
import { Attack } from '../models/attack.model';
import { Bonus } from '../models/bonus.model';

describe('Attack Component', () => {
  describe('unit', () => {
    let component: AttackComponent;

    beforeEach(() => {
      component = new AttackComponent();
      component.attack = new Attack('my attack', 'melee');
    });

    const types = [
      { natural: false, primary: true, expected: 'Manufactured melee (Primary)' },
      { natural: false, primary: false, expected: 'Manufactured melee (Secondary)' },
      { natural: true, primary: true, expected: 'Natural melee (Primary)' },
      { natural: true, primary: false, expected: 'Natural melee (Secondary)' },
    ];

    types.forEach(test => {
      it(`describes a ${test.expected} attack`, () => {
        component.attack.isNatural = test.natural;
        component.attack.isPrimary = test.primary;

        expect(component.attackType).toEqual(test.expected);
      });
    });

    it('describes a ranged attack', () => {
      component.attack.attackType = 'ranged';
      component.attack.isMelee = false;

      expect(component.attackType).toEqual('Manufactured ranged (Primary)');
    });

    it('describes a special attack by its ability type only', () => {
      component.attack.attackType = 'extraordinary ability';
      component.attack.isSpecial = true;
      component.attack.isNatural = true;
      component.attack.isPrimary = false;

      expect(component.attackType).toEqual('extraordinary ability');
    });

    const conditions = [
      { name: 'no bonuses', bonuses: [], expected: false },
      { name: '1 unconditional bonus', bonuses: [new Bonus(2)], expected: false },
      { name: '1 conditional bonus', bonuses: [new Bonus(2, 'when charging', true)], expected: true },
      { name: 'a mix of bonuses', bonuses: [new Bonus(2), new Bonus(1, 'when charging', true), new Bonus(3)], expected: true },
    ];

    conditions.forEach(test => {
      it(`is conditional ${test.expected} with ${test.name}`, () => {
        component.attack.attackBonuses = test.bonuses;

        expect(component.isConditional).toBe(test.expected);
      });
    });
  });
});
