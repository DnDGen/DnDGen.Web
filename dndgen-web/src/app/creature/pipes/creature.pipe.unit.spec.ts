import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CreaturePipe } from './creature.pipe';
import { BonusPipe } from '../../shared/pipes/bonus.pipe';
import { MeasurementPipe } from '../../character/pipes/measurement.pipe';
import { FrequencyPipe } from '../../character/pipes/frequency.pipe';
import { SpellQuantityPipe } from '../../character/pipes/spell-quantity.pipe';
import { ItemPipe } from '../../treasure/pipes/item.pipe';
import { SpellGroupService } from '../../character/services/spell-group.service';
import { CreatureTypePipe } from './creature-type.pipe';
import { HitDicePipe } from './hit-dice.pipe';
import { SpeedPipe } from './speed.pipe';
import { ArmorClassPipe } from './armor-class.pipe';
import { OptionalBonusPipe } from './optional-bonus.pipe';
import { AttackPipe } from './attack.pipe';
import { AttackTypePipe } from './attack-type.pipe';
import { FullAttackPipe } from './full-attack.pipe';
import { SavesPipe } from './saves.pipe';
import { AbilitiesPipe } from './abilities.pipe';
import { SkillPipe } from './skill.pipe';
import { ConditionalBonusPipe } from './conditional-bonus.pipe';
import { TestHelper } from '../../test-helper';
import { Creature } from '../models/creature.model';
import { CreatureType } from '../models/creature-type.model';
import { CreatureAbility } from '../models/creature-ability.model';
import { Save } from '../models/save.model';
import { Bonus } from '../models/bonus.model';
import { CreatureSkill } from '../models/creature-skill.model';
import { CreatureMeasurement } from '../models/creature-measurement.model';
import { HitPoints } from '../models/hit-points.model';
import { CreatureArmorClass } from '../models/creature-armor-class.model';
import { Attack } from '../models/attack.model';
import { AttackSave } from '../models/attack-save.model';
import { CreatureSpellQuantity } from '../models/creature-spell-quantity.model';
import { CreatureSpell } from '../models/creature-spell.model';
import { CreatureMagic } from '../models/creature-magic.model';
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
import { createCreature, createCreatureLines, replaceLines } from './creature.pipe.test-helper';

describe('Creature Pipe', () => {
  describe('unit', () => {
    let pipe: CreaturePipe;
    let spellGroupServiceSpy: { sortIntoGroups: ReturnType<typeof vi.fn> };
    let creature: Creature;
    let expected: string[];

    const everyRound = new Frequency(1, 'Round');

    beforeEach(() => {
      spellGroupServiceSpy = { sortIntoGroups: vi.fn() };

      const spy = (implementation: (...args: any[]) => string) => ({ transform: vi.fn(implementation) });

      pipe = new CreaturePipe(
        spy((value: number, conditional: boolean = false) => `${value}${conditional ? ' conditional' : ''} formatted`) as unknown as BonusPipe,
        spy((measurement: Measurement) => `${measurement.value} ${measurement.unit} formatted`) as unknown as MeasurementPipe,
        spy((frequency: Frequency) => `${frequency.quantity}/${frequency.timePeriod} formatted`) as unknown as FrequencyPipe,
        spy((quantity: SpellQuantity) => `${quantity.source} ${quantity.level}: ${quantity.quantity}${quantity.hasDomainSpell ? ' + domain' : ''} formatted`) as unknown as SpellQuantityPipe,
        spy((item: Item, prefix: string) => `${prefix}${item.name} formatted\r\n`) as unknown as ItemPipe,
        spellGroupServiceSpy as unknown as SpellGroupService,
        spy((type: CreatureType) => `${type.name} formatted type`) as unknown as CreatureTypePipe,
        spy((hitPoints: HitPoints) => `${hitPoints.defaultRoll} formatted hit dice`) as unknown as HitDicePipe,
        spy((speeds: { [movement: string]: CreatureMeasurement }) => `${Object.keys(speeds).map(m => `${m} ${speeds[m].value}`).join(', ')} formatted speed`) as unknown as SpeedPipe,
        spy((armorClass: CreatureArmorClass) => `${armorClass.totalBonus} formatted armor class`) as unknown as ArmorClassPipe,
        spy((value?: number | null) => `${value} formatted optional bonus`) as unknown as OptionalBonusPipe,
        spy((attack: Attack, full: boolean = false) => `${attack.name}${full ? ' full' : ''} formatted attack`) as unknown as AttackPipe,
        spy((attack: Attack) => `${attack.attackType} formatted attack type`) as unknown as AttackTypePipe,
        spy((attacks: Attack[]) => `${attacks.map(a => a.name).join(' & ')} formatted full attack`) as unknown as FullAttackPipe,
        spy((saves: { [name: string]: Save }) => `${saves['Fortitude'].totalBonus}/${saves['Reflex'].totalBonus}/${saves['Will'].totalBonus} formatted saves`) as unknown as SavesPipe,
        spy((abilities: { [name: string]: CreatureAbility }) =>
          `${['Strength', 'Dexterity', 'Constitution', 'Intelligence', 'Wisdom', 'Charisma'].map(a => abilities[a].fullScore).join('/')} formatted abilities`) as unknown as AbilitiesPipe,
        spy((skill: CreatureSkill) => `${skill.name}${skill.focus ? ` (${skill.focus})` : ''} formatted skill`) as unknown as SkillPipe,
        spy((bonus: Bonus) => `${bonus.value} ${bonus.condition} formatted conditional bonus`) as unknown as ConditionalBonusPipe,
      );

      creature = createCreature();
      expected = createCreatureLines();
    });

    function expectFormatted() {
      const lines = pipe.transform(creature).split('\r\n');
      TestHelper.expectLines(lines, expected);
    }

    function createAttack(name: string, attackType: string, isSpecial: boolean = false): Attack {
      const attack = new Attack(name, attackType);
      attack.isSpecial = isSpecial;
      attack.totalAttackBonus = 16;
      attack.fullAttackBonuses = [16, 11];
      attack.damageSummary = `${name} damage`;
      attack.frequency = everyRound;

      return attack;
    }

    function createSpells(): Attack {
      return createAttack('Spells', 'spell-like ability', true);
    }

    it('formats the creature basics in stat block order', () => {
      expectFormatted();
    });

    it('formats no level adjustment', () => {
      creature.levelAdjustment = undefined;
      expected = replaceLines(expected, '\tLevel Adjustment: 9266 formatted optional bonus', ['\tLevel Adjustment: undefined formatted optional bonus']);

      expectFormatted();
    });

    it('formats no grapple', () => {
      creature.grappleBonus = null;
      expected = replaceLines(expected, '\tBase Attack/Grapple: 21 formatted/22 formatted optional bonus', ['\tBase Attack/Grapple: 21 formatted/null formatted optional bonus']);

      expectFormatted();
    });

    it('formats the conditional hit point bonuses under the rolled hit points', () => {
      creature.hitPoints.conditionalBonuses = [new Bonus(1), new Bonus(2, 'when raging', true), new Bonus(3, 'at night', true)];
      expected = replaceLines(expected, '\t\tHit Points: 3456', [
        '\t\tHit Points: 3456',
        '\t\t2 when raging formatted conditional bonus',
        '\t\t3 at night formatted conditional bonus',
      ]);

      expectFormatted();
    });

    it('formats the conditional armor class bonuses after touch and flat-footed', () => {
      creature.armorClass.bonuses = [new Bonus(9), new Bonus(2, 'against evil', true)];
      expected = replaceLines(expected, '\t\tFlat-Footed: 12', [
        '\t\tFlat-Footed: 12',
        '\t\t2 against evil formatted conditional bonus',
      ]);

      expectFormatted();
    });

    it('formats every speed', () => {
      creature.speeds = {
        Land: new CreatureMeasurement(40, 'feet per round'),
        Fly: new CreatureMeasurement(30, 'feet per round', 'Perfect Maneuverability'),
      };
      expected = replaceLines(expected, '\tSpeed: Land 30 formatted speed', ['\tSpeed: Land 40, Fly 30 formatted speed']);

      expectFormatted();
    });

    it('formats 1 attack option', () => {
      creature.attacks = [createAttack('Greatclub', 'melee')];
      expected = replaceLines(expected, '\tAttack (0):', [
        '\tAttack (1):',
        '\t\tGreatclub formatted attack',
        '\t\t\tType: melee formatted attack type',
        '\t\t\tFrequency: 1/Round formatted',
      ]);

      expectFormatted();
    });

    it('formats an attack option without a frequency', () => {
      const greatclub = createAttack('Greatclub', 'melee');
      greatclub.frequency = new Frequency();
      creature.attacks = [greatclub];
      expected = replaceLines(expected, '\tAttack (0):', [
        '\tAttack (1):',
        '\t\tGreatclub formatted attack',
        '\t\t\tType: melee formatted attack type',
      ]);

      expectFormatted();
    });

    it('formats many attack options, identical attacks once, without special attacks', () => {
      const offHand = [1, 2, 3].map(() => createAttack('Club', 'melee'));
      creature.attacks = [
        createAttack('Greatclub', 'melee'),
        ...offHand,
        createAttack('Constrict', 'extraordinary ability', true),
        createAttack('Rock', 'ranged'),
      ];
      expected = replaceLines(expected, '\tAttack (0):', [
        '\tAttack (3):',
        '\t\tGreatclub formatted attack',
        '\t\t\tType: melee formatted attack type',
        '\t\t\tFrequency: 1/Round formatted',
        '\t\tClub formatted attack',
        '\t\t\tType: melee formatted attack type',
        '\t\t\tFrequency: 1/Round formatted',
        '\t\tRock formatted attack',
        '\t\t\tType: ranged formatted attack type',
        '\t\t\tFrequency: 1/Round formatted',
      ]);

      expectFormatted();
    });

    it('formats the full melee attack as 1 option, with its full attacks', () => {
      creature.fullMeleeAttack = [createAttack('Greatclub', 'melee'), createAttack('Club', 'melee')];
      expected = replaceLines(expected, '\tFull Attack (0):', [
        '\tFull Attack (1):',
        '\t\tGreatclub & Club formatted full attack',
        '\t\t\tGreatclub full formatted attack',
        '\t\t\t\tType: melee formatted attack type',
        '\t\t\t\tFrequency: 1/Round formatted',
        '\t\t\tClub full formatted attack',
        '\t\t\t\tType: melee formatted attack type',
        '\t\t\t\tFrequency: 1/Round formatted',
      ]);

      expectFormatted();
    });

    it('formats the full ranged attack as 1 option', () => {
      creature.fullRangedAttack = [createAttack('Rock', 'ranged')];
      expected = replaceLines(expected, '\tFull Attack (0):', [
        '\tFull Attack (1):',
        '\t\tRock formatted full attack',
        '\t\t\tRock full formatted attack',
        '\t\t\t\tType: ranged formatted attack type',
        '\t\t\t\tFrequency: 1/Round formatted',
      ]);

      expectFormatted();
    });

    it('formats the full melee attack, then the full ranged attack, as 2 options', () => {
      creature.fullMeleeAttack = [createAttack('Greatclub', 'melee')];
      creature.fullRangedAttack = [createAttack('Rock', 'ranged')];
      expected = replaceLines(expected, '\tFull Attack (0):', [
        '\tFull Attack (2):',
        '\t\tGreatclub formatted full attack',
        '\t\t\tGreatclub full formatted attack',
        '\t\t\t\tType: melee formatted attack type',
        '\t\t\t\tFrequency: 1/Round formatted',
        '\t\tRock formatted full attack',
        '\t\t\tRock full formatted attack',
        '\t\t\t\tType: ranged formatted attack type',
        '\t\t\t\tFrequency: 1/Round formatted',
      ]);

      expectFormatted();
    });

    it('formats special attacks, with a save', () => {
      const moan = createAttack('Frightful Moan', 'supernatural ability', true);
      moan.save = new AttackSave('Will', 17, 10, new CreatureAbility('Charisma', 13, 1));
      creature.specialAttacks = [createAttack('Constrict', 'extraordinary ability', true), moan];
      expected = replaceLines(expected, '\tSpecial Attacks (0):', [
        '\tSpecial Attacks (2):',
        '\t\tConstrict formatted attack',
        '\t\t\tType: extraordinary ability formatted attack type',
        '\t\t\tFrequency: 1/Round formatted',
        '\t\tFrightful Moan formatted attack',
        '\t\t\tType: supernatural ability formatted attack type',
        '\t\t\tFrequency: 1/Round formatted',
        '\t\t\tSave: Will DC 17 (Charisma)',
      ]);

      expectFormatted();
    });

    it('formats the magic under the Spells special attack', () => {
      const groups = [
        new SpellGroup('Sorcerer Level 0', [new Spell({ Sorcerer: 0 }, 'Light')]),
        new SpellGroup('Sorcerer Level 1', [new Spell({ Sorcerer: 1 }, 'Mage Armor'), new Spell({ Sorcerer: 1 }, 'Magic Missile')]),
      ];
      const preparedGroups = [new SpellGroup('Cleric Level 1', [new Spell({ Cleric: 1 }, 'Bless')])];
      spellGroupServiceSpy.sortIntoGroups.mockReturnValueOnce(groups).mockReturnValueOnce(preparedGroups);

      creature.specialAttacks = [createSpells(), createAttack('Improved Grab', 'extraordinary ability', true)];
      creature.magic = new CreatureMagic(
        'Sorcerer',
        7,
        15,
        ['Air', 'Good'],
        [new CreatureSpellQuantity('Sorcerer', 0, 6, 0, false, 6), new CreatureSpellQuantity('Sorcerer', 1, 6, 1, true, 7)],
        [new CreatureSpell('Sorcerer', 1, 'Magic Missile'), new CreatureSpell('Sorcerer', 0, 'Light'), new CreatureSpell('Sorcerer', 1, 'Mage Armor', ['Extended'])],
        [new CreatureSpell('Cleric', 1, 'Bless')],
      );
      expected = replaceLines(expected, '\tSpecial Attacks (0):', [
        '\tSpecial Attacks (2):',
        '\t\tSpells formatted attack',
        '\t\t\tType: spell-like ability formatted attack type',
        '\t\t\tFrequency: 1/Round formatted',
        '\t\t\tCaster: Sorcerer',
        '\t\t\tCaster Level: 7',
        '\t\t\tDomains: Air, Good',
        '\t\t\tArcane Spell Failure: 15%',
        '\t\t\tSpells Per Day:',
        '\t\t\t\tSorcerer 0: 6 formatted',
        '\t\t\t\tSorcerer 1: 7 + domain formatted',
        '\t\t\tKnown Spells:',
        '\t\t\t\tSorcerer Level 0:',
        '\t\t\t\t\tLight',
        '\t\t\t\tSorcerer Level 1:',
        '\t\t\t\t\tMage Armor',
        '\t\t\t\t\tMagic Missile',
        '\t\t\tPrepared Spells:',
        '\t\t\t\tCleric Level 1:',
        '\t\t\t\t\tBless',
        '\t\tImproved Grab formatted attack',
        '\t\t\tType: extraordinary ability formatted attack type',
        '\t\t\tFrequency: 1/Round formatted',
      ]);

      expectFormatted();

      expect(spellGroupServiceSpy.sortIntoGroups).toHaveBeenCalledWith([
        new Spell({ Sorcerer: 1 }, 'Magic Missile'),
        new Spell({ Sorcerer: 0 }, 'Light'),
        new Spell({ Sorcerer: 1 }, 'Mage Armor', ['Extended']),
      ]);
      expect(spellGroupServiceSpy.sortIntoGroups).toHaveBeenCalledWith([new Spell({ Cleric: 1 }, 'Bless')]);
      expect(spellGroupServiceSpy.sortIntoGroups).toHaveBeenCalledTimes(2);
    });

    it('formats a caster with no domains, spell failure, or spells under the Spells special attack', () => {
      creature.specialAttacks = [createSpells()];
      creature.magic = new CreatureMagic('Sorcerer', 7);
      expected = replaceLines(expected, '\tSpecial Attacks (0):', [
        '\tSpecial Attacks (1):',
        '\t\tSpells formatted attack',
        '\t\t\tType: spell-like ability formatted attack type',
        '\t\t\tFrequency: 1/Round formatted',
        '\t\t\tCaster: Sorcerer',
        '\t\t\tCaster Level: 7',
      ]);

      expectFormatted();
    });

    it('formats no magic without a Spells special attack', () => {
      creature.specialAttacks = [createAttack('Improved Grab', 'extraordinary ability', true)];
      creature.magic = new CreatureMagic('Sorcerer', 7);
      expected = replaceLines(expected, '\tSpecial Attacks (0):', [
        '\tSpecial Attacks (1):',
        '\t\tImproved Grab formatted attack',
        '\t\t\tType: extraordinary ability formatted attack type',
        '\t\t\tFrequency: 1/Round formatted',
      ]);

      expectFormatted();
    });

    it('formats special qualities, with their foci, power, and frequency', () => {
      creature.specialQualities = [
        new Feat('Darkvision', [], 60),
        new Feat('Spell-Like Ability', ['Ethereal jaunt', 'Blink'], 0, new Frequency(0, 'At Will')),
      ];
      expected = replaceLines(expected, '\tSpecial Qualities (0):', [
        '\tSpecial Qualities (2):',
        '\t\tDarkvision',
        '\t\t\tPower: 60',
        '\t\tSpell-Like Ability',
        '\t\t\tFoci:',
        '\t\t\t\tEthereal jaunt',
        '\t\t\t\tBlink',
        '\t\t\tFrequency: 0/At Will formatted',
      ]);

      expectFormatted();
    });

    it('formats the conditional save bonuses, in save order', () => {
      creature.saves['Will'].bonuses = [new Bonus(4, 'against fear', true), new Bonus(1)];
      creature.saves['Fortitude'].bonuses = [new Bonus(2, 'against poison', true)];
      expected = replaceLines(expected, '\tSaves: 56/78/67 formatted saves', [
        '\tSaves: 56/78/67 formatted saves',
        '\t\tFortitude: 2 against poison formatted conditional bonus',
        '\t\tWill: 4 against fear formatted conditional bonus',
      ]);

      expectFormatted();
    });

    it('formats skills sorted by name, with their details', () => {
      creature.skills = [
        new CreatureSkill('Spot', '', 6, 3, 3, false, false, 0, false, new CreatureAbility('Wisdom', 10, 0)),
        new CreatureSkill('Knowledge', 'Religion', -2, 0, 0, false, false, 0, false, new CreatureAbility('Intelligence', 6, -2)),
        new CreatureSkill('Climb', '', 9, 2, 2, true, true, -3, true, new CreatureAbility('Strength', 25, 7)),
      ];
      expected = replaceLines(expected, '\tSkills (0):', [
        '\tSkills (3):',
        '\t\tClimb formatted skill',
        '\t\t\tRanks: 2',
        '\t\t\tAbility: Strength (7 formatted)',
        '\t\t\tArmor Check Penalty: -3',
        '\t\t\tClass Skill',
        '\t\tKnowledge (Religion) formatted skill',
        '\t\t\tRanks: 0',
        '\t\t\tAbility: Intelligence (-2 formatted)',
        '\t\tSpot formatted skill',
        '\t\t\tRanks: 3',
        '\t\t\tAbility: Wisdom (0 formatted)',
      ]);

      expectFormatted();
    });

    it('formats 1 feat', () => {
      creature.feats = [new Feat('Cleave')];
      expected = replaceLines(expected, '\tFeats (0):', ['\tFeats (1):', '\t\tCleave']);

      expectFormatted();
    });

    it('formats many feats, with their foci, power, and frequency', () => {
      creature.feats = [
        new Feat('Cleave'),
        new Feat('Weapon Focus', ['Greatclub']),
        new Feat('Combat Casting', [], 4),
        new Feat('Smite', [], 0, new Frequency(1, 'Day')),
      ];
      expected = replaceLines(expected, '\tFeats (0):', [
        '\tFeats (4):',
        '\t\tCleave',
        '\t\tWeapon Focus',
        '\t\t\tFoci:',
        '\t\t\t\tGreatclub',
        '\t\tCombat Casting',
        '\t\t\tPower: 4',
        '\t\tSmite',
        '\t\t\tFrequency: 1/Day formatted',
      ]);

      expectFormatted();
    });

    it('formats every demographic', () => {
      creature.demographics = new Demographics(
        'Male',
        new CreatureMeasurement(45, 'years', 'Adulthood'),
        new CreatureMeasurement(400, 'years', 'Natural causes'),
        new CreatureMeasurement(126, 'inches', 'Average'),
        new CreatureMeasurement(30, 'inches', 'Average'),
        new CreatureMeasurement(1100, 'pounds', 'Heavy'),
        new CreatureMeasurement(120, 'inches', 'Average'),
        'Deep ruddy-brown skin',
        'Black hair',
        'Red eyes',
        'Translucent',
      );
      expected = replaceLines(expected, '\t\tGender: gender', ['\t\tGender: Male']);
      expected = replaceLines(expected, '\t\tAge: 18 years formatted', ['\t\tAge: 45 years formatted']);
      expected = replaceLines(expected, '\t\tMaximum Age: 1800 years formatted', [
        '\t\tMaximum Age: 400 years formatted',
        '\t\tHeight: 126 inches formatted',
        '\t\tLength: 30 inches formatted',
        '\t\tWeight: 1100 pounds formatted',
        '\t\tWingspan: 120 inches formatted',
        '\t\tSkin: Deep ruddy-brown skin',
        '\t\tHair: Black hair',
        '\t\tEyes: Red eyes',
        '\t\tOther: Translucent',
      ]);

      expectFormatted();
    });

    it('formats some demographics', () => {
      creature.demographics.weight = new CreatureMeasurement(1100, 'pounds', 'Heavy');
      creature.demographics.hair = 'Black hair';
      expected = replaceLines(expected, '\t\tMaximum Age: 1800 years formatted', [
        '\t\tMaximum Age: 1800 years formatted',
        '\t\tWeight: 1100 pounds formatted',
        '\t\tHair: Black hair',
      ]);

      expectFormatted();
    });

    it('formats 1 language', () => {
      creature.languages = ['Common'];
      expected = replaceLines(expected, '\tLanguages (0):', ['\tLanguages (1):', '\t\tCommon']);

      expectFormatted();
    });

    it('formats many languages', () => {
      creature.languages = ['Giant', 'Common', 'Draconic'];
      expected = replaceLines(expected, '\tLanguages (0):', ['\tLanguages (3):', '\t\tGiant', '\t\tCommon', '\t\tDraconic']);

      expectFormatted();
    });

    it('formats 1 weapon', () => {
      creature.equipment.weapons = [new Weapon('Greatclub', 'Weapon')];
      expected = replaceLines(expected, '\t\tWeapons (0):', ['\t\tWeapons (1):', '\t\t\tGreatclub formatted']);

      expectFormatted();
    });

    it('formats many weapons', () => {
      creature.equipment.weapons = [new Weapon('Greatclub', 'Weapon'), new Weapon('Rock', 'Weapon')];
      expected = replaceLines(expected, '\t\tWeapons (0):', ['\t\tWeapons (2):', '\t\t\tGreatclub formatted', '\t\t\tRock formatted']);

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

    it('formats 1 item', () => {
      creature.equipment.items = [new Item('Rope', 'Tool')];
      expected = replaceLines(expected, '\t\tItems (0):', ['\t\tItems (1):', '\t\t\tRope formatted']);

      expectFormatted();
    });

    it('formats many items', () => {
      creature.equipment.items = [new Item('Potion of cure light wounds', 'Potion'), new Item('Rope', 'Tool')];
      expected = replaceLines(expected, '\t\tItems (0):', ['\t\tItems (2):', '\t\t\tPotion of cure light wounds formatted', '\t\t\tRope formatted']);

      expectFormatted();
    });
  });
});
