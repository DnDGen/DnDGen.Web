import { describe, it, expect, beforeEach } from 'vitest';
import { CreatureFormatService } from './creature-format.service';
import { BonusPipe } from '../../shared/pipes/bonus.pipe';
import { SpellGroupService } from '../../character/services/spell-group.service';
import { CreatureType } from '../models/creature-type.model';
import { CreatureAbility } from '../models/creature-ability.model';
import { Save } from '../models/save.model';
import { Bonus } from '../models/bonus.model';
import { CreatureSkill } from '../models/creature-skill.model';
import { CreatureMeasurement } from '../models/creature-measurement.model';
import { Attack } from '../models/attack.model';
import { CreatureSpellQuantity } from '../models/creature-spell-quantity.model';
import { SpellQuantity } from '../../character/models/spell-quantity.model';
import { CreatureSpell } from '../models/creature-spell.model';
import { SpellGroup } from '../../character/models/spell-group.model';
import { Spell } from '../../character/models/spell.model';
import { Demographics } from '../models/demographics.model';

describe('Creature Format Service', () => {
  describe('unit', () => {
    let service: CreatureFormatService;

    beforeEach(() => {
      service = new CreatureFormatService(new BonusPipe(), new SpellGroupService());
    });

    const types = [
      { name: 'no subtypes', type: new CreatureType('Dragon', []), expected: 'Dragon' },
      { name: '1 subtype', type: new CreatureType('Humanoid', ['Human']), expected: 'Humanoid (Human)' },
      { name: 'many subtypes', type: new CreatureType('Undead', ['Incorporeal', 'Augmented']), expected: 'Undead (Incorporeal, Augmented)' },
    ];

    types.forEach(test => {
      it(`formats a type with ${test.name}`, () => {
        expect(service.type(test.type)).toEqual(test.expected);
      });
    });

    const templates = [
      { templates: [], expected: 'None' },
      { templates: ['Ghost'], expected: 'Ghost' },
      { templates: ['Ghost', 'Lich'], expected: 'Ghost, Lich' },
      { templates: ['Lich', 'Ghost'], expected: 'Lich, Ghost' },
      { templates: ['Half-Dragon (Red)', 'Zombie', 'None'], expected: 'Half-Dragon (Red), Zombie, None' },
    ];

    templates.forEach(test => {
      it(`formats templates [${test.templates}] in order`, () => {
        expect(service.templates(test.templates)).toEqual(test.expected);
      });
    });

    const optionalBonuses = [
      { value: null, expected: '—' },
      { value: undefined, expected: '—' },
      { value: -2, expected: '-2' },
      { value: -1, expected: '-1' },
      { value: 0, expected: '+0' },
      { value: 1, expected: '+1' },
      { value: 10, expected: '+10' },
    ];

    optionalBonuses.forEach(test => {
      it(`formats an optional bonus of ${test.value}`, () => {
        expect(service.optionalBonus(test.value)).toEqual(test.expected);
      });
    });

    const abilityCases = [
      { name: 'Strength', ability: new CreatureAbility('Strength', 24, 7), expected: 'Strength: 24 (+7)' },
      { name: 'Dexterity', ability: new CreatureAbility('Dexterity', 8, -1), expected: 'Dexterity: 8 (-1)' },
      { name: 'Intelligence', ability: new CreatureAbility('Intelligence', 10, 0), expected: 'Intelligence: 10 (+0)' },
      { name: 'Constitution', ability: new CreatureAbility('Constitution', 0, 0, false), expected: 'Constitution: —' },
    ];

    abilityCases.forEach(test => {
      it(`formats ${test.expected}`, () => {
        expect(service.ability(test.name, test.ability)).toEqual(test.expected);
      });
    });

    it('lists abilities in rules order', () => {
      expect(service.abilityNames).toEqual(['Strength', 'Constitution', 'Dexterity', 'Intelligence', 'Wisdom', 'Charisma']);
    });

    it('lists saves in rules order', () => {
      expect(service.saveNames).toEqual(['Fortitude', 'Reflex', 'Will']);
    });

    const saveCases = [
      { name: 'Fortitude', save: new Save(5), expected: 'Fortitude: +5' },
      { name: 'Reflex', save: new Save(-1, true), expected: 'Reflex: -1 *' },
      { name: 'Will', save: new Save(0, false, false), expected: 'Will: —' },
    ];

    saveCases.forEach(test => {
      it(`formats ${test.expected}`, () => {
        expect(service.save(test.name, test.save)).toEqual(test.expected);
      });
    });

    const conditionalBonuses = [
      { name: 'no bonuses', bonuses: [], expected: [] },
      { name: 'only unconditional bonuses', bonuses: [new Bonus(2), new Bonus(1)], expected: [] },
      { name: '1 conditional bonus', bonuses: [new Bonus(4, 'against poison', true)], expected: ['+4 against poison'] },
      {
        name: 'a mix of bonuses',
        bonuses: [new Bonus(2), new Bonus(4, 'against poison', true), new Bonus(-2, 'in bright light', true)],
        expected: ['+4 against poison', '-2 in bright light']
      },
    ];

    conditionalBonuses.forEach(test => {
      it(`lists conditional bonuses from ${test.name}`, () => {
        expect(service.conditionalBonuses(test.bonuses)).toEqual(test.expected);
      });
    });

    const skillNames = [
      { skill: new CreatureSkill('Climb'), expected: 'Climb' },
      { skill: new CreatureSkill('Knowledge', 'Arcana'), expected: 'Knowledge (Arcana)' },
    ];

    skillNames.forEach(test => {
      it(`names the skill ${test.expected}`, () => {
        expect(service.skillName(test.skill)).toEqual(test.expected);
      });
    });

    it('sorts skills by display name without changing the original list', () => {
      const skills = [
        new CreatureSkill('Spot'),
        new CreatureSkill('Knowledge', 'religion'),
        new CreatureSkill('climb'),
        new CreatureSkill('Knowledge', 'Arcana'),
        new CreatureSkill('Hide'),
      ];
      const original = [...skills];

      const sorted = service.sortedSkills(skills);

      expect(sorted).toEqual([skills[2], skills[4], skills[3], skills[1], skills[0]]);
      expect(skills).toEqual(original);
    });

    it('keeps skills with the same display name in their original order', () => {
      const first = new CreatureSkill('Craft', 'Weaponsmithing', 4);
      const second = new CreatureSkill('Craft', 'Weaponsmithing', 6);

      expect(service.sortedSkills([first, second])).toEqual([first, second]);
      expect(service.sortedSkills([second, first])).toEqual([second, first]);
    });

    it('lists no skills', () => {
      expect(service.sortedSkills([])).toEqual([]);
    });

    const land = new CreatureMeasurement(20, 'feet per round');
    const fly = new CreatureMeasurement(60, 'feet per round', 'Good Maneuverability (Wings)');
    const swim = new CreatureMeasurement(30, 'feet per round');

    const speeds: { name: string, speeds: { [movement: string]: CreatureMeasurement }, expected: { label: string, measurement: CreatureMeasurement }[] }[] = [
      { name: 'no speeds', speeds: {}, expected: [] },
      { name: '1 speed', speeds: { Land: land }, expected: [{ label: 'Land', measurement: land }] },
      {
        name: 'many speeds',
        speeds: { Land: land, Fly: fly, Swim: swim },
        expected: [{ label: 'Land', measurement: land }, { label: 'Fly', measurement: fly }, { label: 'Swim', measurement: swim }]
      },
    ];

    speeds.forEach(test => {
      it(`lists ${test.name} in the order given`, () => {
        expect(service.speeds(test.speeds)).toEqual(test.expected);
      });
    });

    const greatclub = new Attack('Greatclub', 'melee');
    const rock = new Attack('Rock', 'ranged');
    const rockThrowing = new Attack('Rock Throwing', 'extraordinary ability', true, true, true, true);

    const standardAttacks = [
      { name: 'no attacks', attacks: [], expected: [] },
      { name: 'only a special attack', attacks: [rockThrowing], expected: [] },
      { name: '1 standard attack', attacks: [greatclub], expected: [greatclub] },
      { name: 'standard and special attacks', attacks: [greatclub, rockThrowing, rock], expected: [greatclub, rock] },
    ];

    standardAttacks.forEach(test => {
      it(`lists only the standard attacks from ${test.name}`, () => {
        expect(service.standardAttacks(test.attacks)).toEqual(test.expected);
      });
    });

    const attackTypes = [
      { attack: new Attack('Greatclub', 'melee', true, false, true), expected: 'Manufactured melee (Primary)' },
      { attack: new Attack('Greatclub', 'melee', true, false, false), expected: 'Manufactured melee (Secondary)' },
      { attack: new Attack('Claw', 'melee', true, true, true), expected: 'Natural melee (Primary)' },
      { attack: new Attack('Bite', 'melee', true, true, false), expected: 'Natural melee (Secondary)' },
      { attack: new Attack('Longbow', 'ranged', false, false, true), expected: 'Manufactured ranged (Primary)' },
      { attack: new Attack('Poison', 'extraordinary ability', true, true, false, true), expected: 'extraordinary ability' },
    ];

    attackTypes.forEach(test => {
      it(`describes the attack type as ${test.expected}`, () => {
        expect(service.attackType(test.attack)).toEqual(test.expected);
      });
    });

    const conditions = [
      { name: 'no bonuses', bonuses: [], expected: false },
      { name: '1 unconditional bonus', bonuses: [new Bonus(2)], expected: false },
      { name: '1 conditional bonus', bonuses: [new Bonus(2, 'when charging', true)], expected: true },
      { name: 'a mix of bonuses', bonuses: [new Bonus(2), new Bonus(1, 'when charging', true), new Bonus(3)], expected: true },
    ];

    conditions.forEach(test => {
      it(`is conditional ${test.expected} with ${test.name}`, () => {
        expect(service.isConditional(test.bonuses)).toBe(test.expected);
      });
    });

    const quantities = [
      { name: 'no bonus spells', quantity: new CreatureSpellQuantity('Sorcerer', 0, 6), expected: new SpellQuantity('Sorcerer', 0, 6, false) },
      { name: 'bonus spells', quantity: new CreatureSpellQuantity('Sorcerer', 1, 6, 1), expected: new SpellQuantity('Sorcerer', 1, 7, false) },
      { name: 'a domain spell', quantity: new CreatureSpellQuantity('Cleric', 2, 4, 0, true), expected: new SpellQuantity('Cleric', 2, 4, true) },
      { name: 'bonus and domain spells', quantity: new CreatureSpellQuantity('Cleric', 3, 3, 2, true, 6), expected: new SpellQuantity('Cleric', 3, 5, true) },
    ];

    quantities.forEach(test => {
      it(`counts spells per day with ${test.name}`, () => {
        expect(service.spellQuantity(test.quantity)).toEqual(test.expected);
      });
    });

    it('groups spells by source and level, sorted by name', () => {
      const groups = service.spellGroups([
        new CreatureSpell('Sorcerer', 1, 'Magic Missile'),
        new CreatureSpell('Sorcerer', 0, 'Light'),
        new CreatureSpell('Sorcerer', 1, 'Mage Armor', ['Extended']),
        new CreatureSpell('Cleric', 1, 'Bless'),
      ]);

      expect(groups).toEqual([
        new SpellGroup('Cleric Level 1', [new Spell({ Cleric: 1 }, 'Bless')]),
        new SpellGroup('Sorcerer Level 0', [new Spell({ Sorcerer: 0 }, 'Light')]),
        new SpellGroup('Sorcerer Level 1', [
          new Spell({ Sorcerer: 1 }, 'Mage Armor', ['Extended']),
          new Spell({ Sorcerer: 1 }, 'Magic Missile'),
        ]),
      ]);
    });

    it('groups no spells', () => {
      expect(service.spellGroups([])).toEqual([]);
    });

    it('lists every demographic measurement that has a value', () => {
      const demographics = new Demographics(
        'Male',
        new CreatureMeasurement(45, 'years', 'Adulthood'),
        new CreatureMeasurement(175, 'years', 'Will die of natural causes'),
        new CreatureMeasurement(193, 'inches', 'Very Short'),
        new CreatureMeasurement(30, 'inches', 'Average'),
        new CreatureMeasurement(4075, 'pounds', 'Average'),
        new CreatureMeasurement(120, 'inches', 'Average'),
      );

      expect(service.demographicMeasurements(demographics)).toEqual([
        { label: 'Age', measurement: demographics.age },
        { label: 'Maximum Age', measurement: demographics.maximumAge },
        { label: 'Height', measurement: demographics.height },
        { label: 'Length', measurement: demographics.length },
        { label: 'Weight', measurement: demographics.weight },
        { label: 'Wingspan', measurement: demographics.wingspan },
      ]);
    });

    it('always lists age and maximum age, but skips other measurements without a value', () => {
      const demographics = new Demographics(
        'Agender',
        new CreatureMeasurement(0, 'years', 'Ageless'),
        new CreatureMeasurement(0, 'years', 'Immortal'),
        new CreatureMeasurement(0, 'inches', 'Average'),
        new CreatureMeasurement(0, 'inches', 'Average'),
        new CreatureMeasurement(0, 'pounds', 'Average'),
        new CreatureMeasurement(0, 'inches', 'Average'),
      );

      expect(service.demographicMeasurements(demographics)).toEqual([
        { label: 'Age', measurement: demographics.age },
        { label: 'Maximum Age', measurement: demographics.maximumAge },
      ]);
    });

    it('lists no demographic descriptions when none have text', () => {
      expect(service.demographicDescriptions(new Demographics())).toEqual([]);
    });

    it('lists every demographic description that has text', () => {
      const demographics = new Demographics();
      demographics.skin = 'Deep ruddy-brown skin';
      demographics.hair = 'Black hair';
      demographics.eyes = 'Black, red-rimmed eyes';
      demographics.other = 'Long arms';

      expect(service.demographicDescriptions(demographics)).toEqual([
        { label: 'Skin', text: 'Deep ruddy-brown skin' },
        { label: 'Hair', text: 'Black hair' },
        { label: 'Eyes', text: 'Black, red-rimmed eyes' },
        { label: 'Other', text: 'Long arms' },
      ]);
    });

    it('skips demographic descriptions without text', () => {
      const demographics = new Demographics();
      demographics.eyes = 'Glowing eyes';

      expect(service.demographicDescriptions(demographics)).toEqual([
        { label: 'Eyes', text: 'Glowing eyes' },
      ]);
    });
  });
});
