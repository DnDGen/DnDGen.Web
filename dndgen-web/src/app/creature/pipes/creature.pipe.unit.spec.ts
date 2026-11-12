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
import { AgePipe } from './age.pipe';
import { MaximumAgePipe } from './maximum-age.pipe';
import { AttackSavePipe } from './attack-save.pipe';
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
    let bonusPipeSpy: { transform: ReturnType<typeof vi.fn> };
    let measurementPipeSpy: { transform: ReturnType<typeof vi.fn> };
    let frequencyPipeSpy: { transform: ReturnType<typeof vi.fn> };
    let spellQuantityPipeSpy: { transform: ReturnType<typeof vi.fn> };
    let itemPipeSpy: { transform: ReturnType<typeof vi.fn> };
    let spellGroupServiceSpy: { sortIntoGroups: ReturnType<typeof vi.fn> };
    let creatureTypePipeSpy: { transform: ReturnType<typeof vi.fn> };
    let hitDicePipeSpy: { transform: ReturnType<typeof vi.fn> };
    let speedPipeSpy: { transform: ReturnType<typeof vi.fn> };
    let armorClassPipeSpy: { transform: ReturnType<typeof vi.fn> };
    let optionalBonusPipeSpy: { transform: ReturnType<typeof vi.fn> };
    let attackPipeSpy: { transform: ReturnType<typeof vi.fn> };
    let attackTypePipeSpy: { transform: ReturnType<typeof vi.fn> };
    let fullAttackPipeSpy: { transform: ReturnType<typeof vi.fn> };
    let savesPipeSpy: { transform: ReturnType<typeof vi.fn> };
    let abilitiesPipeSpy: { transform: ReturnType<typeof vi.fn> };
    let skillPipeSpy: { transform: ReturnType<typeof vi.fn> };
    let conditionalBonusPipeSpy: { transform: ReturnType<typeof vi.fn> };
    let agePipeSpy: { transform: ReturnType<typeof vi.fn> };
    let maximumAgePipeSpy: { transform: ReturnType<typeof vi.fn> };
    let attackSavePipeSpy: { transform: ReturnType<typeof vi.fn> };
    let creature: Creature;

    const everyRound = new Frequency(1, 'Round');

    beforeEach(() => {
      bonusPipeSpy = { transform: vi.fn() };
      measurementPipeSpy = { transform: vi.fn() };
      frequencyPipeSpy = { transform: vi.fn() };
      spellQuantityPipeSpy = { transform: vi.fn() };
      itemPipeSpy = { transform: vi.fn() };
      spellGroupServiceSpy = { sortIntoGroups: vi.fn() };
      creatureTypePipeSpy = { transform: vi.fn() };
      hitDicePipeSpy = { transform: vi.fn() };
      speedPipeSpy = { transform: vi.fn() };
      armorClassPipeSpy = { transform: vi.fn() };
      optionalBonusPipeSpy = { transform: vi.fn() };
      attackPipeSpy = { transform: vi.fn() };
      attackTypePipeSpy = { transform: vi.fn() };
      fullAttackPipeSpy = { transform: vi.fn() };
      savesPipeSpy = { transform: vi.fn() };
      abilitiesPipeSpy = { transform: vi.fn() };
      skillPipeSpy = { transform: vi.fn() };
      conditionalBonusPipeSpy = { transform: vi.fn() };
      agePipeSpy = { transform: vi.fn() };
      maximumAgePipeSpy = { transform: vi.fn() };
      attackSavePipeSpy = { transform: vi.fn() };

      pipe = new CreaturePipe(
        bonusPipeSpy as unknown as BonusPipe,
        measurementPipeSpy as unknown as MeasurementPipe,
        frequencyPipeSpy as unknown as FrequencyPipe,
        spellQuantityPipeSpy as unknown as SpellQuantityPipe,
        itemPipeSpy as unknown as ItemPipe,
        spellGroupServiceSpy as unknown as SpellGroupService,
        creatureTypePipeSpy as unknown as CreatureTypePipe,
        hitDicePipeSpy as unknown as HitDicePipe,
        speedPipeSpy as unknown as SpeedPipe,
        armorClassPipeSpy as unknown as ArmorClassPipe,
        optionalBonusPipeSpy as unknown as OptionalBonusPipe,
        attackPipeSpy as unknown as AttackPipe,
        attackTypePipeSpy as unknown as AttackTypePipe,
        fullAttackPipeSpy as unknown as FullAttackPipe,
        savesPipeSpy as unknown as SavesPipe,
        abilitiesPipeSpy as unknown as AbilitiesPipe,
        skillPipeSpy as unknown as SkillPipe,
        conditionalBonusPipeSpy as unknown as ConditionalBonusPipe,
        agePipeSpy as unknown as AgePipe,
        maximumAgePipeSpy as unknown as MaximumAgePipe,
        attackSavePipeSpy as unknown as AttackSavePipe,
      );

      bonusPipeSpy.transform.mockImplementation((value: number, conditional: boolean = false) => {
        return `${value}${conditional ? ' conditional' : ''} formatted`;
      });
      measurementPipeSpy.transform.mockImplementation((measurement: Measurement) => {
        return `${measurement.value} ${measurement.unit} formatted`;
      });
      frequencyPipeSpy.transform.mockImplementation((frequency: Frequency) => {
        return `${frequency.quantity}/${frequency.timePeriod} formatted`;
      });
      spellQuantityPipeSpy.transform.mockImplementation((quantity: SpellQuantity) => {
        return `${quantity.source} ${quantity.level}: ${quantity.quantity}${quantity.hasDomainSpell ? ' + domain' : ''} formatted`;
      });
      itemPipeSpy.transform.mockImplementation((item: Item, prefix: string) => {
        return `${prefix}${item.name} formatted\r\n`;
      });
      creatureTypePipeSpy.transform.mockImplementation((type: CreatureType) => {
        return `${type.name} formatted type`;
      });
      hitDicePipeSpy.transform.mockImplementation((hitPoints: HitPoints) => {
        return `${hitPoints.defaultRoll} formatted hit dice`;
      });
      speedPipeSpy.transform.mockImplementation((speeds: { [movement: string]: CreatureMeasurement }) => {
        const movements = Object.keys(speeds).map(movement => `${movement} ${speeds[movement].value}`);
        return `${movements.join(', ')} formatted speed`;
      });
      armorClassPipeSpy.transform.mockImplementation((armorClass: CreatureArmorClass) => {
        return `${armorClass.totalBonus} formatted armor class`;
      });
      optionalBonusPipeSpy.transform.mockImplementation((value?: number | null) => {
        return `${value} formatted optional bonus`;
      });
      attackPipeSpy.transform.mockImplementation((attack: Attack, full: boolean = false) => {
        return `${attack.name}${full ? ' full' : ''} formatted attack`;
      });
      attackTypePipeSpy.transform.mockImplementation((attack: Attack) => {
        return `${attack.attackType} formatted attack type`;
      });
      fullAttackPipeSpy.transform.mockImplementation((attacks: Attack[]) => {
        const names = attacks.map(attack => attack.name);
        return `${names.join(' & ')} formatted full attack`;
      });
      savesPipeSpy.transform.mockImplementation((saves: { [name: string]: Save }) => {
        return `${saves['Fortitude'].totalBonus}/${saves['Reflex'].totalBonus}/${saves['Will'].totalBonus} formatted saves`;
      });
      abilitiesPipeSpy.transform.mockImplementation((abilities: { [name: string]: CreatureAbility }) => {
        const scores = ['Strength', 'Dexterity', 'Constitution', 'Intelligence', 'Wisdom', 'Charisma'].map(name => abilities[name].fullScore);
        return `${scores.join('/')} formatted abilities`;
      });
      skillPipeSpy.transform.mockImplementation((skill: CreatureSkill) => {
        const name = skill.focus ? `${skill.name} (${skill.focus})` : skill.name;
        return `${name} formatted skill`;
      });
      conditionalBonusPipeSpy.transform.mockImplementation((bonus: Bonus) => {
        return `${bonus.value} ${bonus.condition} formatted conditional bonus`;
      });

      agePipeSpy.transform.mockImplementation((age: CreatureMeasurement) => {
        return `${age.value} ${age.unit} formatted age`;
      });

      maximumAgePipeSpy.transform.mockImplementation((demographics: Demographics) => {
        return `${demographics.maximumAge.value} ${demographics.maximumAge.unit} formatted maximum age`;
      });

      attackSavePipeSpy.transform.mockImplementation((save: AttackSave) => {
        return `${save.save} DC ${save.dc} formatted save`;
      });

      creature = createCreature();
    });

    function expectFormatted(expected: string[]) {
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
      const expected = createCreatureLines();

      expectFormatted(expected);
    });

    it('formats no level adjustment', () => {
      creature.levelAdjustment = undefined;
      const expected = replaceLines(createCreatureLines(), '\tLevel Adjustment: 9266 formatted optional bonus', ['\tLevel Adjustment: undefined formatted optional bonus']);

      expectFormatted(expected);
    });

    it('formats no grapple', () => {
      creature.grappleBonus = null;
      const expected = replaceLines(createCreatureLines(), '\tBase Attack/Grapple: 21 formatted/22 formatted optional bonus', ['\tBase Attack/Grapple: 21 formatted/null formatted optional bonus']);

      expectFormatted(expected);
    });

    it('formats the conditional hit point bonuses under the hit dice', () => {
      creature.hitPoints.conditionalBonuses = [new Bonus(1), new Bonus(2, 'when raging', true), new Bonus(3, 'at night', true)];
      const expected = replaceLines(createCreatureLines(), '\tHit Dice: hit dice roll formatted hit dice', [
        '\tHit Dice: hit dice roll formatted hit dice',
        '\t\t2 when raging formatted conditional bonus',
        '\t\t3 at night formatted conditional bonus',
      ]);

      expectFormatted(expected);
    });

    it('formats the conditional armor class bonuses after touch and flat-footed', () => {
      creature.armorClass.bonuses = [new Bonus(9), new Bonus(2, 'against evil', true)];
      const expected = replaceLines(createCreatureLines(), '\t\tFlat-Footed: 12', [
        '\t\tFlat-Footed: 12',
        '\t\t2 against evil formatted conditional bonus',
      ]);

      expectFormatted(expected);
    });

    it('formats every speed', () => {
      creature.speeds = {
        Land: new CreatureMeasurement(40, 'feet per round'),
        Fly: new CreatureMeasurement(30, 'feet per round', 'Perfect Maneuverability'),
      };
      const expected = replaceLines(createCreatureLines(), '\tSpeed: Land 30 formatted speed', ['\tSpeed: Land 40, Fly 30 formatted speed']);

      expectFormatted(expected);
    });

    it('formats 1 attack option', () => {
      creature.attacks = [createAttack('Greatclub', 'melee')];
      const expected = replaceLines(createCreatureLines(), '\tAttack (0):', [
        '\tAttack (1):',
        '\t\tGreatclub formatted attack',
        '\t\t\tType: melee formatted attack type',
        '\t\t\tFrequency: 1/Round formatted',
      ]);

      expectFormatted(expected);
    });

    it('formats an attack option without a frequency', () => {
      const greatclub = createAttack('Greatclub', 'melee');
      greatclub.frequency = new Frequency();
      creature.attacks = [greatclub];
      const expected = replaceLines(createCreatureLines(), '\tAttack (0):', [
        '\tAttack (1):',
        '\t\tGreatclub formatted attack',
        '\t\t\tType: melee formatted attack type',
      ]);

      expectFormatted(expected);
    });

    it('formats many attack options, identical attacks once, without special attacks', () => {
      const offHand = [1, 2, 3].map(() => createAttack('Club', 'melee'));
      creature.attacks = [
        createAttack('Greatclub', 'melee'),
        ...offHand,
        createAttack('Constrict', 'extraordinary ability', true),
        createAttack('Rock', 'ranged'),
      ];
      const expected = replaceLines(createCreatureLines(), '\tAttack (0):', [
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

      expectFormatted(expected);
    });

    it('formats the full melee attack as 1 option, with its full attacks', () => {
      creature.fullMeleeAttack = [createAttack('Greatclub', 'melee'), createAttack('Club', 'melee')];
      const expected = replaceLines(createCreatureLines(), '\tFull Attack (0):', [
        '\tFull Attack (1):',
        '\t\tGreatclub & Club formatted full attack',
        '\t\t\tGreatclub full formatted attack',
        '\t\t\t\tType: melee formatted attack type',
        '\t\t\t\tFrequency: 1/Round formatted',
        '\t\t\tClub full formatted attack',
        '\t\t\t\tType: melee formatted attack type',
        '\t\t\t\tFrequency: 1/Round formatted',
      ]);

      expectFormatted(expected);
    });

    it('formats the full ranged attack as 1 option', () => {
      creature.fullRangedAttack = [createAttack('Rock', 'ranged')];
      const expected = replaceLines(createCreatureLines(), '\tFull Attack (0):', [
        '\tFull Attack (1):',
        '\t\tRock formatted full attack',
        '\t\t\tRock full formatted attack',
        '\t\t\t\tType: ranged formatted attack type',
        '\t\t\t\tFrequency: 1/Round formatted',
      ]);

      expectFormatted(expected);
    });

    it('formats the full melee attack, then the full ranged attack, as 2 options', () => {
      creature.fullMeleeAttack = [createAttack('Greatclub', 'melee')];
      creature.fullRangedAttack = [createAttack('Rock', 'ranged')];
      const expected = replaceLines(createCreatureLines(), '\tFull Attack (0):', [
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

      expectFormatted(expected);
    });

    it('formats special attacks, with a save', () => {
      const moan = createAttack('Frightful Moan', 'supernatural ability', true);
      moan.save = new AttackSave('Will', 17, 10, new CreatureAbility('Charisma', 13, 1));
      creature.specialAttacks = [createAttack('Constrict', 'extraordinary ability', true), moan];
      const expected = replaceLines(createCreatureLines(), '\tSpecial Attacks (0):', [
        '\tSpecial Attacks (2):',
        '\t\tConstrict formatted attack',
        '\t\t\tType: extraordinary ability formatted attack type',
        '\t\t\tFrequency: 1/Round formatted',
        '\t\tFrightful Moan formatted attack',
        '\t\t\tType: supernatural ability formatted attack type',
        '\t\t\tFrequency: 1/Round formatted',
        '\t\t\tSave: Will DC 17 formatted save',
      ]);

      expectFormatted(expected);
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
      const expected = replaceLines(createCreatureLines(), '\tSpecial Attacks (0):', [
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

      expectFormatted(expected);

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
      const expected = replaceLines(createCreatureLines(), '\tSpecial Attacks (0):', [
        '\tSpecial Attacks (1):',
        '\t\tSpells formatted attack',
        '\t\t\tType: spell-like ability formatted attack type',
        '\t\t\tFrequency: 1/Round formatted',
        '\t\t\tCaster: Sorcerer',
        '\t\t\tCaster Level: 7',
      ]);

      expectFormatted(expected);
    });

    it('formats no magic without a Spells special attack', () => {
      creature.specialAttacks = [createAttack('Improved Grab', 'extraordinary ability', true)];
      creature.magic = new CreatureMagic('Sorcerer', 7);
      const expected = replaceLines(createCreatureLines(), '\tSpecial Attacks (0):', [
        '\tSpecial Attacks (1):',
        '\t\tImproved Grab formatted attack',
        '\t\t\tType: extraordinary ability formatted attack type',
        '\t\t\tFrequency: 1/Round formatted',
      ]);

      expectFormatted(expected);
    });

    it('formats the spell-like abilities under the Spell-Like Ability special attack', () => {
      creature.specialAttacks = [createAttack('Spell-Like Ability', 'spell-like ability', true)];
      creature.specialQualities = [
        new Feat('Spell-Like Ability', ['Charm monster'], 0, new Frequency(3, 'Day')),
        new Feat('Darkvision', [], 60),
        new Feat('Spell-Like Ability', ['Disguise self'], 0, new Frequency(0, 'At Will')),
      ];
      let expected = replaceLines(createCreatureLines(), '\tSpecial Attacks (0):', [
        '\tSpecial Attacks (1):',
        '\t\tSpell-Like Ability formatted attack',
        '\t\t\tType: spell-like ability formatted attack type',
        '\t\t\tFrequency: 1/Round formatted',
        '\t\t\tCharm monster (3/Day formatted)',
        '\t\t\tDisguise self (0/At Will formatted)',
      ]);
      expected = replaceLines(expected, '\tSpecial Qualities (0):', [
        '\tSpecial Qualities (3):',
        '\t\tSpell-Like Ability',
        '\t\t\tFoci:',
        '\t\t\t\tCharm monster',
        '\t\t\tFrequency: 3/Day formatted',
        '\t\tDarkvision',
        '\t\t\tPower: 60',
        '\t\tSpell-Like Ability',
        '\t\t\tFoci:',
        '\t\t\t\tDisguise self',
        '\t\t\tFrequency: 0/At Will formatted',
      ]);

      expectFormatted(expected);
    });

    it('formats a spell-like ability with many foci on 1 line', () => {
      creature.specialAttacks = [createAttack('Spell-Like Ability', 'spell-like ability', true)];
      creature.specialQualities = [new Feat('Spell-Like Ability', ['Charm person', 'Suggestion'], 0, new Frequency(3, 'Day'))];
      let expected = replaceLines(createCreatureLines(), '\tSpecial Attacks (0):', [
        '\tSpecial Attacks (1):',
        '\t\tSpell-Like Ability formatted attack',
        '\t\t\tType: spell-like ability formatted attack type',
        '\t\t\tFrequency: 1/Round formatted',
        '\t\t\tCharm person, Suggestion (3/Day formatted)',
      ]);
      expected = replaceLines(expected, '\tSpecial Qualities (0):', [
        '\tSpecial Qualities (1):',
        '\t\tSpell-Like Ability',
        '\t\t\tFoci:',
        '\t\t\t\tCharm person',
        '\t\t\t\tSuggestion',
        '\t\t\tFrequency: 3/Day formatted',
      ]);

      expectFormatted(expected);
    });

    it('formats no spell-like abilities without a Spell-Like Ability special attack', () => {
      creature.specialQualities = [new Feat('Spell-Like Ability', ['Detect thoughts'], 0, new Frequency(0, 'Constant'))];
      const expected = replaceLines(createCreatureLines(), '\tSpecial Qualities (0):', [
        '\tSpecial Qualities (1):',
        '\t\tSpell-Like Ability',
        '\t\t\tFoci:',
        '\t\t\t\tDetect thoughts',
        '\t\t\tFrequency: 0/Constant formatted',
      ]);

      expectFormatted(expected);
    });

    it('formats special qualities, with their foci, power, and frequency', () => {
      creature.specialQualities = [
        new Feat('Darkvision', [], 60),
        new Feat('Spell-Like Ability', ['Ethereal jaunt', 'Blink'], 0, new Frequency(0, 'At Will')),
      ];
      const expected = replaceLines(createCreatureLines(), '\tSpecial Qualities (0):', [
        '\tSpecial Qualities (2):',
        '\t\tDarkvision',
        '\t\t\tPower: 60',
        '\t\tSpell-Like Ability',
        '\t\t\tFoci:',
        '\t\t\t\tEthereal jaunt',
        '\t\t\t\tBlink',
        '\t\t\tFrequency: 0/At Will formatted',
      ]);

      expectFormatted(expected);
    });

    it('formats the conditional save bonuses, in save order', () => {
      creature.saves['Will'].bonuses = [new Bonus(4, 'against fear', true), new Bonus(1)];
      creature.saves['Fortitude'].bonuses = [new Bonus(2, 'against poison', true)];
      const expected = replaceLines(createCreatureLines(), '\tSaves: 56/78/67 formatted saves', [
        '\tSaves: 56/78/67 formatted saves',
        '\t\tFortitude: 2 against poison formatted conditional bonus',
        '\t\tWill: 4 against fear formatted conditional bonus',
      ]);

      expectFormatted(expected);
    });

    it('formats skills sorted by name', () => {
      creature.skills = [
        new CreatureSkill('Spot', '', 6, 3, 3, false, false, 0, false, new CreatureAbility('Wisdom', 10, 0)),
        new CreatureSkill('Knowledge', 'Religion', -2, 0, 0, false, false, 0, false, new CreatureAbility('Intelligence', 6, -2)),
        new CreatureSkill('Climb', '', 9, 2, 2, true, true, -3, true, new CreatureAbility('Strength', 25, 7)),
      ];
      const expected = replaceLines(createCreatureLines(), '\tSkills (0):', [
        '\tSkills (3):',
        '\t\tClimb formatted skill',
        '\t\tKnowledge (Religion) formatted skill',
        '\t\tSpot formatted skill',
      ]);

      expectFormatted(expected);
    });

    it('formats 1 feat', () => {
      creature.feats = [new Feat('Cleave')];
      const expected = replaceLines(createCreatureLines(), '\tFeats (0):', ['\tFeats (1):', '\t\tCleave']);

      expectFormatted(expected);
    });

    it('formats many feats, with their foci, power, and frequency', () => {
      creature.feats = [
        new Feat('Cleave'),
        new Feat('Weapon Focus', ['Greatclub']),
        new Feat('Combat Casting', [], 4),
        new Feat('Smite', [], 0, new Frequency(1, 'Day')),
      ];
      const expected = replaceLines(createCreatureLines(), '\tFeats (0):', [
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

      expectFormatted(expected);
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
      let expected = replaceLines(createCreatureLines(), '\t\tGender: gender', ['\t\tGender: Male']);
      expected = replaceLines(expected, '\t\tAge: 18 years formatted age', ['\t\tAge: 45 years formatted age']);
      expected = replaceLines(expected, '\t\tMaximum Age: 1800 years formatted maximum age', [
        '\t\tMaximum Age: 400 years formatted maximum age',
        '\t\tHeight: 126 inches formatted',
        '\t\tLength: 30 inches formatted',
        '\t\tWeight: 1100 pounds formatted',
        '\t\tWingspan: 120 inches formatted',
        '\t\tSkin: Deep ruddy-brown skin',
        '\t\tHair: Black hair',
        '\t\tEyes: Red eyes',
        '\t\tOther: Translucent',
      ]);

      expectFormatted(expected);
    });

    it('formats some demographics', () => {
      creature.demographics.weight = new CreatureMeasurement(1100, 'pounds', 'Heavy');
      creature.demographics.hair = 'Black hair';
      const expected = replaceLines(createCreatureLines(), '\t\tMaximum Age: 1800 years formatted maximum age', [
        '\t\tMaximum Age: 1800 years formatted maximum age',
        '\t\tWeight: 1100 pounds formatted',
        '\t\tHair: Black hair',
      ]);

      expectFormatted(expected);
    });

    it('formats 1 language', () => {
      creature.languages = ['Common'];
      const expected = replaceLines(createCreatureLines(), '\tLanguages (0):', ['\tLanguages (1):', '\t\tCommon']);

      expectFormatted(expected);
    });

    it('formats many languages', () => {
      creature.languages = ['Giant', 'Common', 'Draconic'];
      const expected = replaceLines(createCreatureLines(), '\tLanguages (0):', ['\tLanguages (3):', '\t\tGiant', '\t\tCommon', '\t\tDraconic']);

      expectFormatted(expected);
    });

    it('formats 1 weapon', () => {
      creature.equipment.weapons = [new Weapon('Greatclub', 'Weapon')];
      const expected = replaceLines(createCreatureLines(), '\t\tWeapons (0):', ['\t\tWeapons (1):', '\t\t\tGreatclub formatted']);

      expectFormatted(expected);
    });

    it('formats many weapons', () => {
      creature.equipment.weapons = [new Weapon('Greatclub', 'Weapon'), new Weapon('Rock', 'Weapon')];
      const expected = replaceLines(createCreatureLines(), '\t\tWeapons (0):', ['\t\tWeapons (2):', '\t\t\tGreatclub formatted', '\t\t\tRock formatted']);

      expectFormatted(expected);
    });

    it('formats armor', () => {
      creature.equipment.armor = new Armor('Hide armor', 'Armor');
      const expected = replaceLines(createCreatureLines(), '\t\tArmor: None', ['\t\tArmor:', '\t\t\tHide armor formatted']);

      expectFormatted(expected);
    });

    it('formats a shield', () => {
      creature.equipment.shield = new Armor('Heavy wooden shield', 'Armor');
      const expected = replaceLines(createCreatureLines(), '\t\tShield: None', ['\t\tShield:', '\t\t\tHeavy wooden shield formatted']);

      expectFormatted(expected);
    });

    it('formats 1 item', () => {
      creature.equipment.items = [new Item('Rope', 'Tool')];
      const expected = replaceLines(createCreatureLines(), '\t\tItems (0):', ['\t\tItems (1):', '\t\t\tRope formatted']);

      expectFormatted(expected);
    });

    it('formats many items', () => {
      creature.equipment.items = [new Item('Potion of cure light wounds', 'Potion'), new Item('Rope', 'Tool')];
      const expected = replaceLines(createCreatureLines(), '\t\tItems (0):', ['\t\tItems (2):', '\t\t\tPotion of cure light wounds formatted', '\t\t\tRope formatted']);

      expectFormatted(expected);
    });
  });
});
