import { describe, it, expect, beforeEach, vi } from 'vitest';
import { FullAttackPipe } from './full-attack.pipe';
import { AttackPipe } from './attack.pipe';
import { Attack } from '../models/attack.model';

describe('FullAttackPipe', () => {
  describe('unit', () => {
    let pipe: FullAttackPipe;
    let attackPipeSpy: { transform: ReturnType<typeof vi.fn> };

    beforeEach(() => {
      attackPipeSpy = { transform: vi.fn() };
      pipe = new FullAttackPipe(attackPipeSpy as unknown as AttackPipe);

      attackPipeSpy.transform.mockImplementation((attack: Attack, full: boolean = false) => {
        const bonuses = full ? attack.fullAttackBonuses.join('/') : `${attack.totalAttackBonus}`;
        return `${attack.name} ${bonuses} formatted`;
      });
    });

    function createAttack(name: string, fullAttackBonuses: number[]): Attack {
      const attack = new Attack(name, 'melee');
      attack.totalAttackBonus = fullAttackBonuses[0];
      attack.fullAttackBonuses = fullAttackBonuses;

      return attack;
    }

    const longsword = createAttack('Longsword', [24, 19, 14, 9]);
    const offHandLongsword = createAttack('Longsword', [19]);
    const slam = createAttack('Slam', [24]);
    const tailSlap = createAttack('Tail Slap', [19]);

    it('formats 1 attack as part of a full attack', () => {
      const formattedAttack = pipe.transform([longsword]);
      expect(formattedAttack).toEqual('Longsword 24/19/14/9 formatted');

      expect(attackPipeSpy.transform).toHaveBeenCalledWith(longsword, true);
      expect(attackPipeSpy.transform).toHaveBeenCalledTimes(1);
    });

    it('formats different attacks joined with "and"', () => {
      const formattedAttack = pipe.transform([longsword, slam, tailSlap]);
      expect(formattedAttack).toEqual('Longsword 24/19/14/9 formatted and Slam 24 formatted and Tail Slap 19 formatted');
    });

    it('groups 2 identical attacks with their count', () => {
      const formattedAttack = pipe.transform([offHandLongsword, offHandLongsword]);
      expect(formattedAttack).toEqual('2 Longsword 19 formatted');
    });

    it('groups many identical attacks with their count', () => {
      const attacks = [longsword, offHandLongsword, offHandLongsword, offHandLongsword, offHandLongsword, offHandLongsword];

      const formattedAttack = pipe.transform(attacks);
      expect(formattedAttack).toEqual('Longsword 24/19/14/9 formatted and 5 Longsword 19 formatted');
    });

    it('groups identical attacks that are not next to each other, where the first appears', () => {
      const attacks = [offHandLongsword, slam, offHandLongsword, tailSlap, offHandLongsword];

      const formattedAttack = pipe.transform(attacks);
      expect(formattedAttack).toEqual('3 Longsword 19 formatted and Slam 24 formatted and Tail Slap 19 formatted');
    });

    it('does not group attacks with the same name but different formatting', () => {
      const formattedAttack = pipe.transform([longsword, offHandLongsword]);
      expect(formattedAttack).toEqual('Longsword 24/19/14/9 formatted and Longsword 19 formatted');
    });
  });
});
