import { describe, it, expect, beforeEach } from 'vitest';
import { AttackPipe } from './attack.pipe';
import { BonusesPipe } from '../../shared/pipes/bonuses.pipe';
import { BonusPipe } from '../../shared/pipes/bonus.pipe';
import { Attack } from '../models/attack.model';

describe('AttackPipe', () => {
  describe('unit', () => {
    let pipe: AttackPipe;
    let attack: Attack;

    beforeEach(() => {
      pipe = new AttackPipe(new BonusesPipe(new BonusPipe()));

      attack = new Attack('Longsword', 'melee');
      attack.totalAttackBonus = 24;
      attack.fullAttackBonuses = [24, 19, 14, 9];
      attack.damageSummary = '2d6+9 Slashing';
    });

    it('formats an attack with its attack bonus and damage', () => {
      expect(pipe.transform(attack)).toEqual('Longsword +24 melee (2d6+9 Slashing)');
    });

    it('formats an attack with its full attack bonuses when full', () => {
      expect(pipe.transform(attack, true)).toEqual('Longsword +24/+19/+14/+9 melee (2d6+9 Slashing)');
    });

    it('formats a full attack with a single attack bonus', () => {
      attack.fullAttackBonuses = [24];

      expect(pipe.transform(attack, true)).toEqual('Longsword +24 melee (2d6+9 Slashing)');
    });

    const bonuses = [
      { value: 0, expected: '+0' },
      { value: 1, expected: '+1' },
      { value: -2, expected: '-2' },
    ];

    bonuses.forEach(test => {
      it(`formats an attack bonus of ${test.value}`, () => {
        attack.totalAttackBonus = test.value;

        expect(pipe.transform(attack)).toEqual(`Longsword ${test.expected} melee (2d6+9 Slashing)`);
      });
    });

    it('formats negative full attack bonuses', () => {
      attack.fullAttackBonuses = [3, -2];

      expect(pipe.transform(attack, true)).toEqual('Longsword +3/-2 melee (2d6+9 Slashing)');
    });

    it('formats a ranged attack', () => {
      attack.name = 'Rock';
      attack.attackType = 'ranged';
      attack.isMelee = false;
      attack.totalAttackBonus = 8;
      attack.damageSummary = '2d6+7 Bludgeoning';

      expect(pipe.transform(attack)).toEqual('Rock +8 ranged (2d6+7 Bludgeoning)');
    });

    it('formats an attack with no damage', () => {
      attack.name = 'Touch';
      attack.damageSummary = '';

      expect(pipe.transform(attack)).toEqual('Touch +24 melee');
    });

    it('formats a special attack with its damage and no attack bonus', () => {
      attack.name = 'Constrict';
      attack.attackType = 'extraordinary ability';
      attack.isSpecial = true;
      attack.damageSummary = '4d6+13 Bludgeoning plus Lose Consciousness';

      expect(pipe.transform(attack)).toEqual('Constrict (4d6+13 Bludgeoning plus Lose Consciousness)');
    });

    it('formats a special attack without damage as its name', () => {
      attack.name = 'Improved Grab';
      attack.attackType = 'extraordinary ability';
      attack.isSpecial = true;
      attack.damageSummary = '';

      expect(pipe.transform(attack)).toEqual('Improved Grab');
    });

    it('formats a special attack the same when full', () => {
      attack.name = 'Improved Grab';
      attack.attackType = 'extraordinary ability';
      attack.isSpecial = true;
      attack.damageSummary = '';

      expect(pipe.transform(attack, true)).toEqual('Improved Grab');
    });
  });
});
