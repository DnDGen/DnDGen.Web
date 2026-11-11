import { describe, it, expect, beforeEach } from 'vitest';
import { SkillPipe } from './skill.pipe';
import { BonusPipe } from '../../shared/pipes/bonus.pipe';
import { CreatureSkill } from '../models/creature-skill.model';
import { Bonus } from '../models/bonus.model';

describe('SkillPipe', () => {
  describe('unit', () => {
    let pipe: SkillPipe;
    let skill: CreatureSkill;

    beforeEach(() => {
      pipe = new SkillPipe(new BonusPipe());
      skill = new CreatureSkill('Disguise');
      skill.totalBonus = 7;
    });

    it('formats a skill with its total bonus', () => {
      expect(pipe.transform(skill)).toEqual('Disguise +7');
    });

    it('formats a skill with its focus', () => {
      skill.name = 'Craft';
      skill.focus = 'Brewing';

      expect(pipe.transform(skill)).toEqual('Craft (Brewing) +7');
    });

    const totals = [
      { value: 0, expected: '+0' },
      { value: -5, expected: '-5' },
      { value: 31, expected: '+31' },
    ];

    totals.forEach(test => {
      it(`formats a total bonus of ${test.value}`, () => {
        skill.totalBonus = test.value;

        expect(pipe.transform(skill)).toEqual(`Disguise ${test.expected}`);
      });
    });

    it('marks a circumstantial bonus that has no conditional bonuses to list', () => {
      skill.circumstantialBonus = true;

      expect(pipe.transform(skill)).toEqual('Disguise +7 *');
    });

    it('lists the total with 1 conditional bonus', () => {
      skill.circumstantialBonus = true;
      skill.bonuses = [new Bonus(2, 'acting', true)];

      expect(pipe.transform(skill)).toEqual('Disguise +7 (+9 acting)');
    });

    it('lists the totals with many conditional bonuses, in their order', () => {
      skill.circumstantialBonus = true;
      skill.bonuses = [
        new Bonus(4, 'when reading an opponent\'s mind', true),
        new Bonus(2, 'acting', true),
        new Bonus(10, 'when using Change Shape', true),
      ];

      expect(pipe.transform(skill)).toEqual('Disguise +7 (+11 when reading an opponent\'s mind, +9 acting, +17 when using Change Shape)');
    });

    it('lists a negative conditional total', () => {
      skill.totalBonus = 1;
      skill.circumstantialBonus = true;
      skill.bonuses = [new Bonus(-4, 'in heavy armor', true)];

      expect(pipe.transform(skill)).toEqual('Disguise +1 (-3 in heavy armor)');
    });

    it('lists an identical conditional bonus once', () => {
      skill.name = 'Climb';
      skill.totalBonus = 9;
      skill.circumstantialBonus = true;
      skill.bonuses = [new Bonus(2, 'with rope', true), new Bonus(2, 'with rope', true)];

      expect(pipe.transform(skill)).toEqual('Climb +9 (+11 with rope)');
    });

    it('leaves out bonuses that are not conditional, as they are already in the total', () => {
      skill.circumstantialBonus = true;
      skill.bonuses = [new Bonus(4), new Bonus(2, 'acting', true), new Bonus(2)];

      expect(pipe.transform(skill)).toEqual('Disguise +7 (+9 acting)');
    });
  });
});
