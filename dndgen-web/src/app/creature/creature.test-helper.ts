import { Alignment } from '../character/models/alignment.model';
import { Feat } from '../character/models/feat.model';
import { Frequency } from '../character/models/frequency.model';
import { Armor } from '../treasure/models/armor.model';
import { Item } from '../treasure/models/item.model';
import { Weapon } from '../treasure/models/weapon.model';
import { Attack } from './models/attack.model';
import { Bonus } from './models/bonus.model';
import { CreatureAbility } from './models/creature-ability.model';
import { CreatureArmorClass } from './models/creature-armor-class.model';
import { CreatureEquipment } from './models/creature-equipment.model';
import { CreatureMagic } from './models/creature-magic.model';
import { CreatureMeasurement } from './models/creature-measurement.model';
import { CreatureSkill } from './models/creature-skill.model';
import { CreatureSpellQuantity } from './models/creature-spell-quantity.model';
import { CreatureSpell } from './models/creature-spell.model';
import { CreatureType } from './models/creature-type.model';
import { Creature } from './models/creature.model';
import { Demographics } from './models/demographics.model';
import { HitDice } from './models/hit-dice.model';
import { HitPoints } from './models/hit-points.model';
import { Save } from './models/save.model';

export class CreatureTestHelper {
  public static createFullCreature(): Creature {
    return new Creature(
      'Ghost Hill Giant',
      'Hill Giant',
      new CreatureType('Undead', ['Incorporeal', 'Augmented']),
      'Large',
      '9',
      new Alignment('Chaotic Evil', 'Chaotic', 'Evil'),
      9,
      3,
      ['Ghost', 'None'],
      {
        Strength: new CreatureAbility('Strength', 25, 7),
        Constitution: new CreatureAbility('Constitution', 0, 0, false),
        Dexterity: new CreatureAbility('Dexterity', 8, -1),
        Intelligence: new CreatureAbility('Intelligence', 6, -2),
        Wisdom: new CreatureAbility('Wisdom', 10, 0),
        Charisma: new CreatureAbility('Charisma', 13, 1),
      },
      new HitPoints(102, 117, 12, 12, [new HitDice(12, 12, 12, '12d12')], '12d12', [new Bonus(2, 'when raging', true), new Bonus(1)]),
      {
        Land: new CreatureMeasurement(40, 'feet per round', 'Base'),
        Fly: new CreatureMeasurement(30, 'feet per round', 'Perfect Maneuverability'),
      },
      new CreatureArmorClass(20, 8, 21, true, -1, -1, 3, 0, 9, 1, 0, [new Bonus(3), new Bonus(9), new Bonus(2, 'against evil', true)]),
      -1,
      -1,
      9,
      20,
      new CreatureMeasurement(10, 'feet'),
      new CreatureMeasurement(10, 'feet'),
      {
        Fortitude: new Save(0, false, false),
        Reflex: new Save(3),
        Will: new Save(4, true, true, [new Bonus(4, 'against fear', true)]),
      },
      [
        new CreatureSkill('Spot', '', 6, 3, 3, true, false, 0, false, new CreatureAbility('Wisdom', 10, 0)),
        new CreatureSkill('Climb', '', 9, 2, 2, true, true, -3, true, new CreatureAbility('Strength', 25, 7)),
        new CreatureSkill('Knowledge', 'Religion', -2, 0, 0, false, false, 0, false, new CreatureAbility('Intelligence', 6, -2)),
      ],
      [
        new Feat('Cleave'),
        new Feat('Weapon Focus', ['Greatclub']),
      ],
      [
        new Feat('Rock Catching'),
        new Feat('Spell-Like Ability', ['Ethereal jaunt'], 0, new Frequency(0, 'At Will')),
      ],
      [
        new Attack('Greatclub', 'melee', true, false, true, false, 16, [16, 11], [], '2d8+10 Bludgeoning', '', new Frequency(1, 'Round (6 seconds)')),
        new Attack('Corrupting Touch', 'supernatural ability', true, true, true, true, 8, [8], [], '1d6', '', new Frequency(1, 'Round (6 seconds)')),
      ],
      [
        new Attack('Greatclub', 'melee', true, false, true, false, 16, [16, 11], [], '2d8+10 Bludgeoning', '', new Frequency(1, 'Round (6 seconds)')),
      ],
      [
        new Attack('Rock', 'ranged', false, true, true, false, 8, [8], [new Bonus(1, 'within 30 feet', true)], '2d6+7 Bludgeoning'),
      ],
      [
        new Attack('Corrupting Touch', 'supernatural ability', true, true, true, true, 8, [8], [], '1d6', '', new Frequency(1, 'Round (6 seconds)')),
      ],
      ['Giant', 'Common'],
      new CreatureMagic(
        'Sorcerer',
        3,
        15,
        ['Air', 'Good'],
        [new CreatureSpellQuantity('Sorcerer', 0, 6, 0, false, 6), new CreatureSpellQuantity('Sorcerer', 1, 5, 1, true, 7)],
        [new CreatureSpell('Sorcerer', 1, 'Magic Missile'), new CreatureSpell('Sorcerer', 0, 'Light')],
        [new CreatureSpell('Sorcerer', 1, 'Shield')],
      ),
      new CreatureEquipment(
        [new Weapon('Greatclub', 'Weapon'), new Weapon('Rock', 'Weapon')],
        new Armor('Hide armor', 'Armor'),
        new Armor('Heavy wooden shield', 'Armor'),
        [new Item('Potion of cure light wounds', 'Potion'), new Item('Rope', 'Tool')],
      ),
      new Demographics(
        'Male',
        new CreatureMeasurement(45, 'years', 'Adulthood'),
        new CreatureMeasurement(0, 'years', 'Immortal'),
        new CreatureMeasurement(126, 'inches', 'Average'),
        new CreatureMeasurement(0, 'inches', 'Average'),
        new CreatureMeasurement(1100, 'pounds', 'Heavy'),
        new CreatureMeasurement(0, 'inches', 'Average'),
        'Deep ruddy-brown skin',
        'Black hair',
        '',
        'Translucent',
      ),
    );
  }

  public static createMinimalCreature(): Creature {
    return new Creature(
      'Gelatinous Cube',
      'Gelatinous Cube',
      new CreatureType('Ooze'),
      'Huge',
      '3',
      new Alignment('True Neutral', 'Neutral', 'Neutral'),
      null,
      0,
      [],
      {
        Strength: new CreatureAbility('Strength', 10, 0),
        Constitution: new CreatureAbility('Constitution', 26, 8),
        Dexterity: new CreatureAbility('Dexterity', 1, -5),
        Intelligence: new CreatureAbility('Intelligence', 0, 0, false),
        Wisdom: new CreatureAbility('Wisdom', 1, -5),
        Charisma: new CreatureAbility('Charisma', 1, -5),
      },
      new HitPoints(84, 84, 4, 4, [new HitDice(10, 4, 4, '4d10')], '4d10+32'),
      { Land: new CreatureMeasurement(15, 'feet per round') },
      new CreatureArmorClass(3, 3, 3),
      -5,
      -5,
      3,
      null,
      new CreatureMeasurement(15, 'feet'),
      new CreatureMeasurement(10, 'feet'),
      {
        Fortitude: new Save(9),
        Reflex: new Save(-4),
        Will: new Save(-4),
      },
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      new CreatureMagic(),
      new CreatureEquipment(),
      new Demographics('Agender', new CreatureMeasurement(0, 'years', 'Ageless'), new CreatureMeasurement(0, 'years', 'Immortal')),
    );
  }
}
