import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AttackPipe } from './attack.pipe';
import { BonusesPipe } from '../../shared/pipes/bonuses.pipe';
import { Attack } from '../models/attack.model';

describe('AttackPipe', () => {
  describe('unit', () => {
    let pipe: AttackPipe;
    let attack: Attack;
    let bonusesPipeSpy: { transform: ReturnType<typeof vi.fn> };

    beforeEach(() => {
      bonusesPipeSpy = { transform: vi.fn() };
      pipe = new AttackPipe(bonusesPipeSpy as unknown as BonusesPipe);

      bonusesPipeSpy.transform.mockImplementation((values: number[], conditional: boolean = false, includePlus: boolean = true) => {
        const bonuses = values.map(value => `${includePlus && value >= 0 ? '+' : ''}${value}`).join('/');
        return `${bonuses}${conditional ? ' *' : ''} formatted`;
      });

      attack = new Attack('Longsword', 'melee');
      attack.totalAttackBonus = 24;
      attack.fullAttackBonuses = [24, 19, 14, 9];
      attack.damageSummary = '2d6+9 Slashing';
    });

    it('formats an attack with its attack bonus and damage', () => {
      const formattedAttack = pipe.transform(attack);
      expect(formattedAttack).toEqual('Longsword +24 formatted melee (2d6+9 Slashing)');
    });

    it('formats an attack with its full attack bonuses when full', () => {
      const formattedAttack = pipe.transform(attack, true);
      expect(formattedAttack).toEqual('Longsword +24/+19/+14/+9 formatted melee (2d6+9 Slashing)');
    });

    it('formats a full attack with a single attack bonus', () => {
      attack.fullAttackBonuses = [24];

      const formattedAttack = pipe.transform(attack, true);
      expect(formattedAttack).toEqual('Longsword +24 formatted melee (2d6+9 Slashing)');
    });

    const bonuses = [
      { value: -10, expected: '-10 formatted' },
      { value: -2, expected: '-2 formatted' },
      { value: -1, expected: '-1 formatted' },
      { value: 0, expected: '+0 formatted' },
      { value: 1, expected: '+1 formatted' },
      { value: 2, expected: '+2 formatted' },
      { value: 10, expected: '+10 formatted' },
      { value: 100, expected: '+100 formatted' },
    ];

    bonuses.forEach(test => {
      it(`formats an attack bonus of ${test.value}`, () => {
        attack.totalAttackBonus = test.value;

        const formattedAttack = pipe.transform(attack);
        expect(formattedAttack).toEqual(`Longsword ${test.expected} melee (2d6+9 Slashing)`);
      });
    });

    it('formats negative full attack bonuses', () => {
      attack.fullAttackBonuses = [3, -2];

      const formattedAttack = pipe.transform(attack, true);
      expect(formattedAttack).toEqual('Longsword +3/-2 formatted melee (2d6+9 Slashing)');
    });

    it('formats a ranged attack', () => {
      attack.name = 'Rock';
      attack.attackType = 'ranged';
      attack.isMelee = false;
      attack.totalAttackBonus = 8;
      attack.damageSummary = '2d6+7 Bludgeoning';

      const formattedAttack = pipe.transform(attack);
      expect(formattedAttack).toEqual('Rock +8 formatted ranged (2d6+7 Bludgeoning)');
    });

    it('formats an attack with no damage', () => {
      attack.name = 'Touch';
      attack.damageSummary = '';

      const formattedAttack = pipe.transform(attack);
      expect(formattedAttack).toEqual('Touch +24 formatted melee');
    });

    it('formats a special attack with its damage and no attack bonus', () => {
      attack.name = 'Constrict';
      attack.attackType = 'extraordinary ability';
      attack.isSpecial = true;
      attack.damageSummary = '4d6+13 Bludgeoning plus Lose Consciousness';

      const formattedAttack = pipe.transform(attack);
      expect(formattedAttack).toEqual('Constrict (4d6+13 Bludgeoning plus Lose Consciousness)');
    });

    it('formats a special attack without damage as its name', () => {
      attack.name = 'Improved Grab';
      attack.attackType = 'extraordinary ability';
      attack.isSpecial = true;
      attack.damageSummary = '';

      const formattedAttack = pipe.transform(attack);
      expect(formattedAttack).toEqual('Improved Grab');
    });

    it('formats a special attack the same when full', () => {
      attack.name = 'Improved Grab';
      attack.attackType = 'extraordinary ability';
      attack.isSpecial = true;
      attack.damageSummary = '';

      const formattedAttack = pipe.transform(attack, true);
      expect(formattedAttack).toEqual('Improved Grab');
    });
  });
});
