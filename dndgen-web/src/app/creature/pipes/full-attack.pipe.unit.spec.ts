import { describe, it, expect, beforeEach } from 'vitest';
import { FullAttackPipe } from './full-attack.pipe';
import { AttackPipe } from './attack.pipe';
import { BonusesPipe } from '../../shared/pipes/bonuses.pipe';
import { BonusPipe } from '../../shared/pipes/bonus.pipe';
import { Attack } from '../models/attack.model';

describe('FullAttackPipe', () => {
  describe('unit', () => {
    let pipe: FullAttackPipe;

    beforeEach(() => {
      pipe = new FullAttackPipe(new AttackPipe(new BonusesPipe(new BonusPipe())));
    });

    function createAttack(name: string, fullAttackBonuses: number[], damage: string): Attack {
      const attack = new Attack(name, 'melee');
      attack.totalAttackBonus = fullAttackBonuses[0];
      attack.fullAttackBonuses = fullAttackBonuses;
      attack.damageSummary = damage;

      return attack;
    }

    const longsword = createAttack('Longsword', [24, 19, 14, 9], '2d6+9 Slashing');
    const offHandLongsword = createAttack('Longsword', [19], '2d6+4 Slashing');
    const slam = createAttack('Slam', [24], '1d8+9 Bludgeoning');
    const tailSlap = createAttack('Tail Slap', [19], '4d6+4 Bludgeoning');

    it('formats 1 attack with its full attack bonuses', () => {
      expect(pipe.transform([longsword])).toEqual('Longsword +24/+19/+14/+9 melee (2d6+9 Slashing)');
    });

    it('formats different attacks joined with "and"', () => {
      expect(pipe.transform([longsword, slam, tailSlap]))
        .toEqual('Longsword +24/+19/+14/+9 melee (2d6+9 Slashing) and Slam +24 melee (1d8+9 Bludgeoning) and Tail Slap +19 melee (4d6+4 Bludgeoning)');
    });

    it('groups 2 identical attacks with their count', () => {
      expect(pipe.transform([offHandLongsword, offHandLongsword])).toEqual('2 × Longsword +19 melee (2d6+4 Slashing)');
    });

    it('groups many identical attacks with their count', () => {
      const attacks = [longsword, offHandLongsword, offHandLongsword, offHandLongsword, offHandLongsword, offHandLongsword];

      expect(pipe.transform(attacks)).toEqual('Longsword +24/+19/+14/+9 melee (2d6+9 Slashing) and 5 × Longsword +19 melee (2d6+4 Slashing)');
    });

    it('groups identical attacks that are not next to each other, where the first appears', () => {
      const attacks = [offHandLongsword, slam, offHandLongsword, tailSlap, offHandLongsword];

      expect(pipe.transform(attacks))
        .toEqual('3 × Longsword +19 melee (2d6+4 Slashing) and Slam +24 melee (1d8+9 Bludgeoning) and Tail Slap +19 melee (4d6+4 Bludgeoning)');
    });

    it('does not group attacks with the same name but different bonuses', () => {
      expect(pipe.transform([longsword, offHandLongsword]))
        .toEqual('Longsword +24/+19/+14/+9 melee (2d6+9 Slashing) and Longsword +19 melee (2d6+4 Slashing)');
    });
  });
});
