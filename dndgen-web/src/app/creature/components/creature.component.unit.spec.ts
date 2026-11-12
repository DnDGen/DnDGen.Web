import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CreatureComponent } from './creature.component';
import { SpellGroupService } from '../../character/services/spell-group.service';
import { Creature } from '../models/creature.model';
import { Attack } from '../models/attack.model';
import { Feat } from '../../character/models/feat.model';
import { Frequency } from '../../character/models/frequency.model';
import { CreatureSkill } from '../models/creature-skill.model';
import { Bonus } from '../models/bonus.model';
import { Save } from '../models/save.model';
import { CreatureSpellQuantity } from '../models/creature-spell-quantity.model';
import { SpellQuantity } from '../../character/models/spell-quantity.model';
import { CreatureSpell } from '../models/creature-spell.model';
import { Spell } from '../../character/models/spell.model';
import { SpellGroup } from '../../character/models/spell-group.model';

describe('Creature Component', () => {
  describe('unit', () => {
    let component: CreatureComponent;
    let spellGroupServiceSpy: { sortIntoGroups: ReturnType<typeof vi.fn> };

    beforeEach(() => {
      spellGroupServiceSpy = { sortIntoGroups: vi.fn() };
      component = new CreatureComponent(spellGroupServiceSpy as unknown as SpellGroupService);

      component.creature = new Creature('Marilith');
      component.creature.saves = {
        Fortitude: new Save(19),
        Reflex: new Save(14),
        Will: new Save(14),
      };
    });

    function createAttack(name: string, totalAttackBonus: number, damage: string, isSpecial: boolean = false): Attack {
      const attack = new Attack(name, isSpecial ? 'extraordinary ability' : 'melee');
      attack.isSpecial = isSpecial;
      attack.totalAttackBonus = totalAttackBonus;
      attack.damageSummary = damage;

      return attack;
    }

    describe('attack options', () => {
      it('should have no options when there are no attacks', () => {
        component.creature.attacks = [];

        expect(component.attackOptions).toEqual([]);
      });

      it('should have 1 option for 1 attack', () => {
        const longsword = createAttack('Longsword', 24, '2d6+9 Slashing');
        component.creature.attacks = [longsword];

        expect(component.attackOptions).toEqual([longsword]);
      });

      it('should have every different attack as an option, in order', () => {
        const longsword = createAttack('Longsword', 24, '2d6+9 Slashing');
        const tailSlap = createAttack('Tail Slap', 19, '4d6+4 Bludgeoning');
        const slam = createAttack('Slam', 24, '1d8+9 Bludgeoning');
        component.creature.attacks = [longsword, tailSlap, slam];

        expect(component.attackOptions).toEqual([longsword, tailSlap, slam]);
      });

      it('should leave special attacks out of the options', () => {
        const longsword = createAttack('Longsword', 24, '2d6+9 Slashing');
        const constrict = createAttack('Constrict', 24, '4d6+13 Bludgeoning', true);
        const improvedGrab = createAttack('Improved Grab', 24, '', true);
        component.creature.attacks = [constrict, longsword, improvedGrab];

        expect(component.attackOptions).toEqual([longsword]);
      });

      it('should show identical attacks as 1 option', () => {
        const longsword = createAttack('Longsword', 24, '2d6+9 Slashing');
        const offHand = [1, 2, 3, 4, 5].map(() => createAttack('Longsword', 19, '2d6+4 Slashing'));
        component.creature.attacks = [longsword, ...offHand];

        expect(component.attackOptions).toEqual([longsword, offHand[0]]);
      });

      const differences = [
        { name: 'name', change: (a: Attack) => a.name = 'Shortsword' },
        { name: 'attack type', change: (a: Attack) => a.attackType = 'ranged' },
        { name: 'attack bonus', change: (a: Attack) => a.totalAttackBonus = 19 },
        { name: 'damage', change: (a: Attack) => a.damageSummary = '2d6+4 Slashing' },
      ];

      differences.forEach(test => {
        it(`should keep attacks with a different ${test.name} as separate options`, () => {
          const longsword = createAttack('Longsword', 24, '2d6+9 Slashing');
          const other = createAttack('Longsword', 24, '2d6+9 Slashing');
          test.change(other);
          component.creature.attacks = [longsword, other];

          expect(component.attackOptions).toEqual([longsword, other]);
        });
      });
    });

    describe('full attack options', () => {
      const melee = [createAttack('Claw', 8, '1d4+1 Slashing'), createAttack('Bite', 3, '1d6 Piercing')];
      const ranged = [createAttack('Rock', 8, '2d6+7 Bludgeoning')];

      it('should have no options when there are no full attacks', () => {
        expect(component.fullAttackOptions).toEqual([]);
      });

      it('should have the full melee attack as the only option', () => {
        component.creature.fullMeleeAttack = melee;

        expect(component.fullAttackOptions).toEqual([melee]);
      });

      it('should have the full ranged attack as the only option', () => {
        component.creature.fullRangedAttack = ranged;

        expect(component.fullAttackOptions).toEqual([ranged]);
      });

      it('should have the full melee attack, then the full ranged attack, as options', () => {
        component.creature.fullMeleeAttack = melee;
        component.creature.fullRangedAttack = ranged;

        expect(component.fullAttackOptions).toEqual([melee, ranged]);
      });
    });

    describe('sorted skills', () => {
      it('should have no skills when there are none', () => {
        expect(component.sortedSkills).toEqual([]);
      });

      it('should sort skills by name, including focus, ignoring case', () => {
        const spot = new CreatureSkill('Spot');
        const knowledgeReligion = new CreatureSkill('Knowledge', 'religion');
        const knowledgeArcana = new CreatureSkill('Knowledge', 'Arcana');
        const appraise = new CreatureSkill('appraise');
        const climb = new CreatureSkill('Climb');
        component.creature.skills = [spot, knowledgeReligion, climb, knowledgeArcana, appraise];

        expect(component.sortedSkills).toEqual([appraise, climb, knowledgeArcana, knowledgeReligion, spot]);
      });
    });

    describe('conditional bonuses', () => {
      it('should have no conditional bonuses when there are no bonuses', () => {
        expect(component.getConditionalBonuses([])).toEqual([]);
      });

      it('should have only the conditional bonuses, in order', () => {
        const againstEvil = new Bonus(2, 'against evil', true);
        const whenRaging = new Bonus(4, 'when raging', true);

        const conditional = component.getConditionalBonuses([new Bonus(16), againstEvil, new Bonus(1), whenRaging]);

        expect(conditional).toEqual([againstEvil, whenRaging]);
      });

      it('should have no conditional saves when no save has a conditional bonus', () => {
        component.creature.saves['Will'].bonuses = [new Bonus(2)];

        expect(component.hasConditionalSaves).toBe(false);
      });

      ['Fortitude', 'Reflex', 'Will'].forEach(test => {
        it(`should have conditional saves when ${test} has a conditional bonus`, () => {
          component.creature.saves[test].bonuses = [new Bonus(4, 'against fear', true)];

          expect(component.hasConditionalSaves).toBe(true);
        });
      });
    });

    describe('spell-like abilities', () => {
      it('should have no spell-like abilities when there are no special qualities', () => {
        expect(component.spellLikeAbilities).toEqual([]);
      });

      it('should have only the spell-like abilities from the special qualities, in order', () => {
        const charmMonster = new Feat('Spell-Like Ability', ['Charm monster'], 0, new Frequency(3, 'Day'));
        const disguiseSelf = new Feat('Spell-Like Ability', ['Disguise self'], 0, new Frequency(0, 'At Will'));
        component.creature.specialQualities = [new Feat('Darkvision', [], 60), charmMonster, new Feat('Spell Resistance', [], 25), disguiseSelf];

        expect(component.spellLikeAbilities).toEqual([charmMonster, disguiseSelf]);
      });
    });

    describe('magic', () => {
      it('should count bonus spells in the spells per day', () => {
        const quantity = new CreatureSpellQuantity('Sorcerer', 1, 6, 1, false, 7);

        expect(component.getSpellQuantity(quantity)).toEqual(new SpellQuantity('Sorcerer', 1, 7, false));
      });

      it('should keep the domain spell in the spells per day', () => {
        const quantity = new CreatureSpellQuantity('Cleric', 3, 2, 1, true, 3);

        expect(component.getSpellQuantity(quantity)).toEqual(new SpellQuantity('Cleric', 3, 3, true));
      });

      it('should group the spells by their source and level', () => {
        const groups = [new SpellGroup('Sorcerer Level 1', [new Spell({ Sorcerer: 1 }, 'Magic Missile')])];
        spellGroupServiceSpy.sortIntoGroups.mockReturnValue(groups);

        const spells = [
          new CreatureSpell('Sorcerer', 1, 'Magic Missile'),
          new CreatureSpell('Sorcerer', 0, 'Light'),
          new CreatureSpell('Cleric', 1, 'Bless', ['Extended']),
        ];

        expect(component.getSpellGroups(spells)).toBe(groups);
        expect(spellGroupServiceSpy.sortIntoGroups).toHaveBeenCalledWith([
          new Spell({ Sorcerer: 1 }, 'Magic Missile'),
          new Spell({ Sorcerer: 0 }, 'Light'),
          new Spell({ Cleric: 1 }, 'Bless', ['Extended']),
        ]);
        expect(spellGroupServiceSpy.sortIntoGroups).toHaveBeenCalledTimes(1);
      });
    });
  });
});
