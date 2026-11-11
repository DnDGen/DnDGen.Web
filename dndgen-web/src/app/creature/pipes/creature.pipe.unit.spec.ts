import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CreaturePipe } from './creature.pipe';
import { CreatureFormatService } from '../services/creature-format.service';
import { BonusPipe } from '../../shared/pipes/bonus.pipe';
import { BonusesPipe } from '../../shared/pipes/bonuses.pipe';
import { MeasurementPipe } from '../../character/pipes/measurement.pipe';
import { FrequencyPipe } from '../../character/pipes/frequency.pipe';
import { SpellQuantityPipe } from '../../character/pipes/spell-quantity.pipe';
import { ItemPipe } from '../../treasure/pipes/item.pipe';
import { TestHelper } from '../../test-helper';
import { Creature } from '../models/creature.model';
import { CreatureType } from '../models/creature-type.model';
import { CreatureAbility } from '../models/creature-ability.model';
import { Save } from '../models/save.model';
import { Bonus } from '../models/bonus.model';
import { CreatureSkill } from '../models/creature-skill.model';
import { CreatureMeasurement } from '../models/creature-measurement.model';
import { Attack } from '../models/attack.model';
import { CreatureSpellQuantity } from '../models/creature-spell-quantity.model';
import { CreatureSpell } from '../models/creature-spell.model';
import { Demographics } from '../models/demographics.model';
import { SpellQuantity } from '../../character/models/spell-quantity.model';
import { SpellGroup } from '../../character/models/spell-group.model';
import { Spell } from '../../character/models/spell.model';
import { Measurement } from '../../character/models/measurement.model';
import { Frequency } from '../../character/models/frequency.model';
import { Feat } from '../../character/models/feat.model';
import { Item } from '../../treasure/models/item.model';
import { Weapon } from '../../treasure/models/weapon.model';
import { Armor } from '../../treasure/models/armor.model';
import { CreatureMagic } from '../models/creature-magic.model';
import { createCreature, createCreatureLines, replaceLines } from './creature.pipe.test-helper';

describe('Creature Pipe', () => {
  describe('unit', () => {
    let pipe: CreaturePipe;
    let formatSpy: {
      abilityNames: string[],
      saveNames: string[],
      type: ReturnType<typeof vi.fn>,
      templates: ReturnType<typeof vi.fn>,
      optionalBonus: ReturnType<typeof vi.fn>,
      ability: ReturnType<typeof vi.fn>,
      save: ReturnType<typeof vi.fn>,
      conditionalBonuses: ReturnType<typeof vi.fn>,
      skillName: ReturnType<typeof vi.fn>,
      sortedSkills: ReturnType<typeof vi.fn>,
      speeds: ReturnType<typeof vi.fn>,
      standardAttacks: ReturnType<typeof vi.fn>,
      attackType: ReturnType<typeof vi.fn>,
      isConditional: ReturnType<typeof vi.fn>,
      spellQuantity: ReturnType<typeof vi.fn>,
      spellGroups: ReturnType<typeof vi.fn>,
      demographicMeasurements: ReturnType<typeof vi.fn>,
      demographicDescriptions: ReturnType<typeof vi.fn>,
    };
    let bonusPipeSpy: { transform: ReturnType<typeof vi.fn> };
    let bonusesPipeSpy: { transform: ReturnType<typeof vi.fn> };
    let measurementPipeSpy: { transform: ReturnType<typeof vi.fn> };
    let frequencyPipeSpy: { transform: ReturnType<typeof vi.fn> };
    let spellQuantityPipeSpy: { transform: ReturnType<typeof vi.fn> };
    let itemPipeSpy: { transform: ReturnType<typeof vi.fn> };

    let creature: Creature;
    let expected: string[];

    beforeEach(() => {
      formatSpy = {
        abilityNames: ['Strength', 'Constitution', 'Dexterity', 'Intelligence', 'Wisdom', 'Charisma'],
        saveNames: ['Fortitude', 'Reflex', 'Will'],
        type: vi.fn((type: CreatureType) => `${type.name} formatted type`),
        templates: vi.fn((templates: string[]) => `${templates.join(' & ')} formatted templates`),
        optionalBonus: vi.fn((value?: number | null) => `${value} formatted optional bonus`),
        ability: vi.fn((name: string, ability: CreatureAbility) => `${name} ${ability.fullScore} formatted ability`),
        save: vi.fn((name: string, save: Save) => `${name} ${save.totalBonus} formatted save`),
        conditionalBonuses: vi.fn((bonuses: Bonus[]) => bonuses.map(bonus => `${bonus.value} ${bonus.condition} formatted conditional bonus`)),
        skillName: vi.fn((skill: CreatureSkill) => `${skill.name} formatted skill name`),
        sortedSkills: vi.fn((skills: CreatureSkill[]) => [...skills].reverse()),
        speeds: vi.fn((speeds: { [movement: string]: CreatureMeasurement }) => Object.keys(speeds).map(label => ({ label: label, measurement: speeds[label] }))),
        standardAttacks: vi.fn((attacks: Attack[]) => attacks.filter(attack => !attack.isSpecial)),
        attackType: vi.fn((attack: Attack) => `${attack.attackType} formatted attack type`),
        isConditional: vi.fn((bonuses: Bonus[]) => bonuses.length > 0),
        spellQuantity: vi.fn((quantity: CreatureSpellQuantity) => new SpellQuantity(quantity.source, quantity.level, quantity.quantity)),
        spellGroups: vi.fn((spells: CreatureSpell[]) => spells.length == 0 ? [] : [
          new SpellGroup('first spell group', spells.map(spell => new Spell({ [spell.source]: spell.level }, spell.name))),
        ]),
        demographicMeasurements: vi.fn((demographics: Demographics) => [
          { label: 'Age', measurement: demographics.age },
          { label: 'Maximum Age', measurement: demographics.maximumAge },
        ]),
        demographicDescriptions: vi.fn((demographics: Demographics) => demographics.skin ? [{ label: 'Skin', text: demographics.skin }] : []),
      };
      bonusPipeSpy = { transform: vi.fn((value: number, conditional: boolean = false) => `${value}${conditional ? ' conditional' : ''} formatted`) };
      bonusesPipeSpy = { transform: vi.fn((values: number[], conditional: boolean = false) => `${values.join('/')}${conditional ? ' conditional' : ''} formatted`) };
      measurementPipeSpy = { transform: vi.fn((measurement: Measurement) => `${measurement.value} ${measurement.unit} formatted`) };
      frequencyPipeSpy = { transform: vi.fn((frequency: Frequency) => `${frequency.quantity}/${frequency.timePeriod} formatted`) };
      spellQuantityPipeSpy = { transform: vi.fn((quantity: SpellQuantity) => `${quantity.source} ${quantity.level}: ${quantity.quantity} formatted`) };
      itemPipeSpy = { transform: vi.fn((item: Item, prefix: string) => `${prefix}${item.name} formatted\r\n`) };

      pipe = new CreaturePipe(
        formatSpy as unknown as CreatureFormatService,
        bonusPipeSpy as unknown as BonusPipe,
        bonusesPipeSpy as unknown as BonusesPipe,
        measurementPipeSpy as unknown as MeasurementPipe,
        frequencyPipeSpy as unknown as FrequencyPipe,
        spellQuantityPipeSpy as unknown as SpellQuantityPipe,
        itemPipeSpy as unknown as ItemPipe,
      );

      creature = createCreature();
      expected = createCreatureLines();
    });

    function expectFormatted() {
      const lines = pipe.transform(creature).split('\r\n');
      TestHelper.expectLines(lines, expected);
    }

    it('formats creature basics', () => {
      expectFormatted();
    });

    it('formats many templates', () => {
      creature.templates = ['template 1', 'template 2'];
      expected = replaceLines(expected, '\tTemplates: template 1 formatted templates', ['\tTemplates: template 1 & template 2 formatted templates']);

      expectFormatted();
    });

    it('formats no level adjustment', () => {
      creature.levelAdjustment = undefined;
      expected = replaceLines(expected, '\tLevel Adjustment: 9266 formatted optional bonus', ['\tLevel Adjustment: undefined formatted optional bonus']);

      expectFormatted();
    });

    it('formats conditional hit points', () => {
      creature.hitPoints.conditionalBonuses = [new Bonus(2, 'when raging', true)];
      expected = replaceLines(expected, '\t\tHit Dice: hit dice roll', ['\t\tHit Dice: hit dice roll', '\t\t2 when raging formatted conditional bonus']);

      expectFormatted();
    });

    it('formats conditional armor class', () => {
      creature.armorClass.isConditional = true;
      creature.armorClass.bonuses = [new Bonus(2, 'against evil', true), new Bonus(1, 'against goblins', true)];
      expected = replaceLines(expected, '\t\tArmor Class: 7 formatted', ['\t\tArmor Class: 7 conditional formatted']);
      expected = replaceLines(expected, '\t\t\tTouch: 34', [
        '\t\t\tTouch: 34',
        '\t\t\t2 against evil formatted conditional bonus',
        '\t\t\t1 against goblins formatted conditional bonus',
      ]);

      expectFormatted();
    });

    it('formats no grapple', () => {
      creature.grappleBonus = null;
      expected = replaceLines(expected, '\t\tGrapple: 22 formatted optional bonus', ['\t\tGrapple: null formatted optional bonus']);

      expectFormatted();
    });

    it('formats many speeds', () => {
      creature.speeds['Fly'] = new CreatureMeasurement(60, 'feet per round');
      creature.speeds['Swim'] = new CreatureMeasurement(20, 'feet per round');
      expected = replaceLines(expected, '\t\t\tLand: 30 feet per round formatted', [
        '\t\t\tLand: 30 feet per round formatted',
        '\t\t\tFly: 60 feet per round formatted',
        '\t\t\tSwim: 20 feet per round formatted',
      ]);

      expectFormatted();
    });

    it('formats conditional saves', () => {
      creature.saves['Will'].bonuses = [new Bonus(4, 'against fear', true)];
      expected = replaceLines(expected, '\t\t\tWill 67 formatted save', ['\t\t\tWill 67 formatted save', '\t\t\t4 against fear formatted conditional bonus']);

      expectFormatted();
    });

    it('formats a standard attack', () => {
      creature.attacks = [new Attack('Greatclub', 'melee', true, false, true, false, 16, [16], [], '2d8+10 Bludgeoning', 'Trip', new Frequency(1, 'Round'))];
      expected = replaceLines(expected, '\t\tAttacks: None', [
        '\t\tAttacks:',
        '\t\t\tGreatclub',
        '\t\t\t\tType: melee formatted attack type',
        '\t\t\t\tAttack Bonus: 16 formatted',
        '\t\t\t\tDamage: 2d8+10 Bludgeoning',
        '\t\t\t\tEffect: Trip',
        '\t\t\t\tFrequency: 1/Round formatted',
      ]);

      expectFormatted();
    });

    it('formats an attack with iterative attack bonuses', () => {
      creature.attacks = [new Attack('Longsword', 'melee', true, false, true, false, 11, [11, 6, 1], [], '1d8+3 Slashing')];
      expected = replaceLines(expected, '\t\tAttacks: None', [
        '\t\tAttacks:',
        '\t\t\tLongsword',
        '\t\t\t\tType: melee formatted attack type',
        '\t\t\t\tAttack Bonus: 11 formatted',
        '\t\t\t\tFull Attack Bonuses: 11/6/1 formatted',
        '\t\t\t\tDamage: 1d8+3 Slashing',
      ]);

      expectFormatted();
    });

    it('formats an attack with conditional attack bonuses', () => {
      creature.attacks = [new Attack('Claw', 'melee', true, true, false, false, -2, [-2, -7], [new Bonus(2, 'when charging', true)])];
      expected = replaceLines(expected, '\t\tAttacks: None', [
        '\t\tAttacks:',
        '\t\t\tClaw',
        '\t\t\t\tType: melee formatted attack type',
        '\t\t\t\tAttack Bonus: -2 conditional formatted',
        '\t\t\t\tFull Attack Bonuses: -2/-7 conditional formatted',
      ]);

      expectFormatted();
    });

    it('formats many standard attacks, but not special attacks', () => {
      creature.attacks = [
        new Attack('Greatclub', 'melee', true, false, true, false, 16, [16]),
        new Attack('Rock Throwing', 'extraordinary ability', true, true, true, true, 8, [8]),
        new Attack('Rock', 'ranged', false, true, true, false, 8, [8]),
      ];
      expected = replaceLines(expected, '\t\tAttacks: None', [
        '\t\tAttacks:',
        '\t\t\tGreatclub',
        '\t\t\t\tType: melee formatted attack type',
        '\t\t\t\tAttack Bonus: 16 formatted',
        '\t\t\tRock',
        '\t\t\t\tType: ranged formatted attack type',
        '\t\t\t\tAttack Bonus: 8 formatted',
      ]);

      expectFormatted();
    });

    it('formats a full melee attack', () => {
      creature.fullMeleeAttack = [
        new Attack('Greatclub', 'melee', true, false, true, false, 16, [16, 11], [], '2d8+10 Bludgeoning'),
        new Attack('Slam', 'melee', true, true, false, false, 11, [11], [], '1d4+5 Bludgeoning'),
      ];
      expected = replaceLines(expected, '\t\tFull Melee Attack: None', [
        '\t\tFull Melee Attack:',
        '\t\t\tGreatclub',
        '\t\t\t\tType: melee formatted attack type',
        '\t\t\t\tAttack Bonus: 16 formatted',
        '\t\t\t\tFull Attack Bonuses: 16/11 formatted',
        '\t\t\t\tDamage: 2d8+10 Bludgeoning',
        '\t\t\tSlam',
        '\t\t\t\tType: melee formatted attack type',
        '\t\t\t\tAttack Bonus: 11 formatted',
        '\t\t\t\tDamage: 1d4+5 Bludgeoning',
      ]);

      expectFormatted();
    });

    it('formats a full ranged attack', () => {
      creature.fullRangedAttack = [new Attack('Rock', 'ranged', false, true, true, false, 8, [8], [], '2d6+7 Bludgeoning')];
      expected = replaceLines(expected, '\t\tFull Ranged Attack: None', [
        '\t\tFull Ranged Attack:',
        '\t\t\tRock',
        '\t\t\t\tType: ranged formatted attack type',
        '\t\t\t\tAttack Bonus: 8 formatted',
        '\t\t\t\tDamage: 2d6+7 Bludgeoning',
      ]);

      expectFormatted();
    });

    it('formats special attacks without attack bonuses', () => {
      creature.specialAttacks = [
        new Attack('Poison', 'extraordinary ability', true, true, true, true, 29, [29], [], '2d4 Strength', '', new Frequency(1, 'Hit')),
        new Attack('Improved Grab', 'extraordinary ability', true, true, true, true, 29, [29]),
      ];
      expected = replaceLines(expected, '\t\tSpecial Attacks: None', [
        '\t\tSpecial Attacks:',
        '\t\t\tPoison',
        '\t\t\t\tType: extraordinary ability formatted attack type',
        '\t\t\t\tDamage: 2d4 Strength',
        '\t\t\t\tFrequency: 1/Hit formatted',
        '\t\t\tImproved Grab',
        '\t\t\t\tType: extraordinary ability formatted attack type',
      ]);

      expectFormatted();
    });

    it('formats skills in sorted order', () => {
      creature.skills = [
        new CreatureSkill('Climb', '', 9, 2, 2, true, true, -3, true, new CreatureAbility('Strength', 25, 7)),
        new CreatureSkill('Spot', '', 6, 3, 3, false, false, 0, false, new CreatureAbility('Wisdom', 10, 0)),
      ];
      expected = replaceLines(expected, '\tSkills: None', [
        '\tSkills:',
        '\t\tSpot formatted skill name',
        '\t\t\tTotal Bonus: 6 formatted',
        '\t\t\tRanks: 3',
        '\t\t\tAbility Bonus: 0',
        '\t\t\tArmor Check Penalty: 0',
        '\t\tClimb formatted skill name',
        '\t\t\tTotal Bonus: 9 conditional formatted',
        '\t\t\tRanks: 2',
        '\t\t\tAbility Bonus: 7',
        '\t\t\tArmor Check Penalty: -3',
        '\t\t\tClass Skill',
      ]);

      expectFormatted();
    });

    it('formats feats', () => {
      creature.feats = [new Feat('Cleave'), new Feat('Power Attack')];
      expected = replaceLines(expected, '\tFeats: None', ['\tFeats:', '\t\tCleave', '\t\tPower Attack']);

      expectFormatted();
    });

    it('formats feat foci', () => {
      creature.feats = [new Feat('Weapon Focus', ['Greatclub', 'Rock'])];
      expected = replaceLines(expected, '\tFeats: None', ['\tFeats:', '\t\tWeapon Focus', '\t\t\tFoci:', '\t\t\t\tGreatclub', '\t\t\t\tRock']);

      expectFormatted();
    });

    it('formats feat frequency', () => {
      creature.feats = [new Feat('Stunning Fist', [], 0, new Frequency(3, 'Day'))];
      expected = replaceLines(expected, '\tFeats: None', ['\tFeats:', '\t\tStunning Fist', '\t\t\tFrequency: 3/Day formatted']);

      expectFormatted();
    });

    it('formats feat power', () => {
      creature.feats = [new Feat('Damage Reduction', [], 5)];
      expected = replaceLines(expected, '\tFeats: None', ['\tFeats:', '\t\tDamage Reduction', '\t\t\tPower: 5']);

      expectFormatted();
    });

    it('formats special qualities', () => {
      creature.specialQualities = [
        new Feat('Darkvision', [], 60),
        new Feat('Spell-Like Ability', ['Ethereal jaunt'], 0, new Frequency(0, 'At Will')),
      ];
      expected = replaceLines(expected, '\tSpecial Qualities: None', [
        '\tSpecial Qualities:',
        '\t\tDarkvision',
        '\t\t\tPower: 60',
        '\t\tSpell-Like Ability',
        '\t\t\tFoci:',
        '\t\t\t\tEthereal jaunt',
        '\t\t\tFrequency: 0/At Will formatted',
      ]);

      expectFormatted();
    });

    it('formats languages', () => {
      creature.languages = ['Giant', 'Common'];
      expected = replaceLines(expected, '\tLanguages: None', ['\tLanguages:', '\t\tGiant', '\t\tCommon']);

      expectFormatted();
    });

    it('formats a caster', () => {
      creature.magic = new CreatureMagic('Sorcerer', 9);
      expected = replaceLines(expected, '\tMagic: None', ['\tMagic:', '\t\tCaster: Sorcerer', '\t\tCaster Level: 9']);

      expectFormatted();
    });

    it('formats domains', () => {
      creature.magic = new CreatureMagic('Cleric', 9, 0, ['Air', 'Good']);
      expected = replaceLines(expected, '\tMagic: None', ['\tMagic:', '\t\tCaster: Cleric', '\t\tCaster Level: 9', '\t\tDomains: Air, Good']);

      expectFormatted();
    });

    it('formats arcane spell failure', () => {
      creature.magic = new CreatureMagic('Sorcerer', 9, 15);
      expected = replaceLines(expected, '\tMagic: None', ['\tMagic:', '\t\tCaster: Sorcerer', '\t\tCaster Level: 9', '\t\tArcane Spell Failure: 15%']);

      expectFormatted();
    });

    it('formats spells per day', () => {
      creature.magic = new CreatureMagic('Sorcerer', 9, 0, [], [
        new CreatureSpellQuantity('Sorcerer', 0, 6),
        new CreatureSpellQuantity('Sorcerer', 1, 5, 1, true),
      ]);
      expected = replaceLines(expected, '\tMagic: None', [
        '\tMagic:',
        '\t\tCaster: Sorcerer',
        '\t\tCaster Level: 9',
        '\t\tSpells Per Day:',
        '\t\t\tSorcerer 0: 6 formatted',
        '\t\t\tSorcerer 1: 5 formatted',
      ]);

      expectFormatted();
    });

    it('formats known spells', () => {
      creature.magic = new CreatureMagic('Sorcerer', 9, 0, [], [], [
        new CreatureSpell('Sorcerer', 1, 'Magic Missile'),
        new CreatureSpell('Sorcerer', 0, 'Light'),
      ]);
      expected = replaceLines(expected, '\tMagic: None', [
        '\tMagic:',
        '\t\tCaster: Sorcerer',
        '\t\tCaster Level: 9',
        '\t\tKnown Spells:',
        '\t\t\tfirst spell group:',
        '\t\t\t\tMagic Missile',
        '\t\t\t\tLight',
      ]);

      expectFormatted();
    });

    it('formats prepared spells', () => {
      creature.magic = new CreatureMagic('Wizard', 9, 0, [], [], [], [
        new CreatureSpell('Wizard', 1, 'Shield'),
      ]);
      expected = replaceLines(expected, '\tMagic: None', [
        '\tMagic:',
        '\t\tCaster: Wizard',
        '\t\tCaster Level: 9',
        '\t\tPrepared Spells:',
        '\t\t\tfirst spell group:',
        '\t\t\t\tShield',
      ]);

      expectFormatted();
    });

    it('formats a weapon', () => {
      creature.equipment.weapons = [new Weapon('Greatclub', 'Weapon')];
      expected = replaceLines(expected, '\t\tWeapons: None', ['\t\tWeapons:', '\t\t\tGreatclub formatted']);

      expectFormatted();
    });

    it('formats many weapons', () => {
      creature.equipment.weapons = [new Weapon('Greatclub', 'Weapon'), new Weapon('Rock', 'Weapon'), new Weapon('Dagger', 'Weapon')];
      expected = replaceLines(expected, '\t\tWeapons: None', ['\t\tWeapons:', '\t\t\tGreatclub formatted', '\t\t\tRock formatted', '\t\t\tDagger formatted']);

      expectFormatted();
    });

    it('formats armor', () => {
      creature.equipment.armor = new Armor('Hide armor', 'Armor');
      expected = replaceLines(expected, '\t\tArmor: None', ['\t\tArmor:', '\t\t\tHide armor formatted']);

      expectFormatted();
    });

    it('formats a shield', () => {
      creature.equipment.shield = new Armor('Heavy wooden shield', 'Armor');
      expected = replaceLines(expected, '\t\tShield: None', ['\t\tShield:', '\t\t\tHeavy wooden shield formatted']);

      expectFormatted();
    });

    it('formats an item', () => {
      creature.equipment.items = [new Item('Potion of cure light wounds', 'Potion')];
      expected = replaceLines(expected, '\t\tItems: None', ['\t\tItems:', '\t\t\tPotion of cure light wounds formatted']);

      expectFormatted();
    });

    it('formats many items', () => {
      creature.equipment.items = [new Item('Potion of cure light wounds', 'Potion'), new Item('Rope', 'Tool')];
      expected = replaceLines(expected, '\t\tItems: None', ['\t\tItems:', '\t\t\tPotion of cure light wounds formatted', '\t\t\tRope formatted']);

      expectFormatted();
    });

    it('formats demographic descriptions', () => {
      creature.demographics.skin = 'Deep ruddy-brown skin';
      expected = replaceLines(expected, '\t\tMaximum Age: 1800 years formatted', ['\t\tMaximum Age: 1800 years formatted', '\t\tSkin: Deep ruddy-brown skin']);

      expectFormatted();
    });
  });
});
