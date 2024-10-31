import { Ability } from './ability.model';
import { Skill } from './skill.model';

describe('SkillModel', () => {
  describe('unit', () => {
    let skill: Skill;

    beforeEach(() => {
      skill = new Skill('my skill', '', 0, false, 0, new Ability(), 0, 0);
    });

    const booleanValues = [
      {ac: true, circ: true, cls: true, max: true, syn: true},
      {ac: true, circ: true, cls: true, max: true, syn: false},
      {ac: true, circ: true, cls: true, max: false, syn: true},
      {ac: true, circ: true, cls: true, max: false, syn: false},
      {ac: true, circ: true, cls: false, max: true, syn: true},
      {ac: true, circ: true, cls: false, max: true, syn: false},
      {ac: true, circ: true, cls: false, max: false, syn: true},
      {ac: true, circ: true, cls: false, max: false, syn: false},
      {ac: true, circ: false, cls: true, max: true, syn: true},
      {ac: true, circ: false, cls: true, max: true, syn: false},
      {ac: true, circ: false, cls: true, max: false, syn: true},
      {ac: true, circ: false, cls: true, max: false, syn: false},
      {ac: true, circ: false, cls: false, max: true, syn: true},
      {ac: true, circ: false, cls: false, max: true, syn: false},
      {ac: true, circ: false, cls: false, max: false, syn: true},
      {ac: true, circ: false, cls: false, max: false, syn: false},
      {ac: false, circ: true, cls: true, max: true, syn: true},
      {ac: false, circ: true, cls: true, max: true, syn: false},
      {ac: false, circ: true, cls: true, max: false, syn: true},
      {ac: false, circ: true, cls: true, max: false, syn: false},
      {ac: false, circ: true, cls: false, max: true, syn: true},
      {ac: false, circ: true, cls: false, max: true, syn: false},
      {ac: false, circ: true, cls: false, max: false, syn: true},
      {ac: false, circ: true, cls: false, max: false, syn: false},
      {ac: false, circ: false, cls: true, max: true, syn: true},
      {ac: false, circ: false, cls: true, max: true, syn: false},
      {ac: false, circ: false, cls: true, max: false, syn: true},
      {ac: false, circ: false, cls: true, max: false, syn: false},
      {ac: false, circ: false, cls: false, max: true, syn: true},
      {ac: false, circ: false, cls: false, max: true, syn: false},
      {ac: false, circ: false, cls: false, max: false, syn: true},
      {ac: false, circ: false, cls: false, max: false, syn: false},
    ];

    booleanValues.forEach(test => {
      it(`initializes the skill model - conditional ${test.circ}, class skill ${test.cls}, maxed ${test.max}, synergy ${test.syn}, armor check ${test.ac}`, () => {
        const ability = new Ability('my ability', 42, 600);
        skill = new Skill(
          'my skill',
          'my focus',
          9266,
          test.circ,
          902.1,
          ability,
          1337,
          -1336,
          test.cls,
          96,
          test.ac,
          test.max,
          783,
          test.syn
        );

        expect(skill.name).toEqual('my skill');
        expect(skill.focus).toEqual('my focus');
        expect(skill.totalBonus).toEqual(9266);
        expect(skill.circumstantialBonus).toEqual(test.circ);
        expect(skill.effectiveRanks).toEqual(902.1);
        expect(skill.baseAbility).toEqual(ability);
        expect(skill.bonus).toEqual(1337);
        expect(skill.armorCheckPenalty).toEqual(-1336);
        expect(skill.classSkill).toEqual(test.cls);
        expect(skill.rankCap).toEqual(96);
        expect(skill.hasArmorCheckPenalty).toEqual(test.ac);
        expect(skill.ranksMaxedOut).toEqual(test.max);
        expect(skill.ranks).toEqual(783);
        expect(skill.qualifiesForSkillSynergy).toEqual(test.syn);
      });
    });
  });
});