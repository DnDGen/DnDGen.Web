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

    const abilities = {
      Strength: new CreatureAbility('Strength', 24, 7),
      Dexterity: new CreatureAbility('Dexterity', 8, -1),
      Constitution: new CreatureAbility('Constitution', 0, 0, false),
      Intelligence: new CreatureAbility('Intelligence', 10, 0),
    };

    const abilityCases = [
      { name: 'Strength', expected: 'Strength: 24 (+7)' },
      { name: 'Dexterity', expected: 'Dexterity: 8 (-1)' },
      { name: 'Intelligence', expected: 'Intelligence: 10 (+0)' },
      { name: 'Constitution', expected: 'Constitution: —' },
      { name: 'Wisdom', expected: null },
    ];

    abilityCases.forEach(test => {
      it(`formats the ${test.name} ability`, () => {
        expect(service.ability(test.name, abilities)).toEqual(test.expected);
      });
    });

    it('lists abilities and saves in rules order', () => {
      expect(service.abilityNames).toEqual(['Strength', 'Constitution', 'Dexterity', 'Intelligence', 'Wisdom', 'Charisma']);
      expect(service.saveNames).toEqual(['Fortitude', 'Reflex', 'Will']);
    });

    const saves = {
      Fortitude: new Save(5),
      Reflex: new Save(-1, true),
      Will: new Save(0, false, false),
    };

    const saveCases = [
      { name: 'Fortitude', expected: 'Fortitude: +5' },
      { name: 'Reflex', expected: 'Reflex: -1 *' },
      { name: 'Will', expected: 'Will: —' },
      { name: 'Missing', expected: null },
    ];

    saveCases.forEach(test => {
      it(`formats the ${test.name} save`, () => {
        expect(service.save(test.name, saves)).toEqual(test.expected);
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

    it('names a skill without a focus', () => {
      expect(service.skillName(new CreatureSkill('Climb'))).toEqual('Climb');
    });

    it('names a skill with a focus', () => {
      expect(service.skillName(new CreatureSkill('Knowledge', 'Arcana'))).toEqual('Knowledge (Arcana)');
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

    it('lists no skills', () => {
      expect(service.sortedSkills([])).toEqual([]);
    });

    it('lists speeds in the order given', () => {
      const land = new CreatureMeasurement(20, 'feet per round');
      const fly = new CreatureMeasurement(60, 'feet per round', 'Good Maneuverability (Wings)');

      expect(service.speeds({ Land: land, Fly: fly })).toEqual([
        { label: 'Land', measurement: land },
        { label: 'Fly', measurement: fly },
      ]);
    });

    it('lists no speeds', () => {
      expect(service.speeds({})).toEqual([]);
    });

    it('lists only the standard attacks', () => {
      const greatclub = new Attack('Greatclub', 'melee');
      const rock = new Attack('Rock', 'ranged');
      const rockThrowing = new Attack('Rock Throwing', 'extraordinary ability', true, true, true, true);

      expect(service.standardAttacks([greatclub, rockThrowing, rock])).toEqual([greatclub, rock]);
      expect(service.standardAttacks([rockThrowing])).toEqual([]);
      expect(service.standardAttacks([])).toEqual([]);
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
