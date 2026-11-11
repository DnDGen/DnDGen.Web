import { Alignment } from "../../character/models/alignment.model";
import { CreatureAbility } from "../models/creature-ability.model";
import { CreatureArmorClass } from "../models/creature-armor-class.model";
import { CreatureMeasurement } from "../models/creature-measurement.model";
import { CreatureType } from "../models/creature-type.model";
import { Creature } from "../models/creature.model";
import { Demographics } from "../models/demographics.model";
import { HitPoints } from "../models/hit-points.model";
import { Save } from "../models/save.model";

export function createCreature(): Creature {
    const creature = new Creature('creature summary');
    creature.name = 'creature name';
    creature.type = new CreatureType('creature type', ['subtype']);
    creature.size = 'size';
    creature.challengeRating = 'challenge rating';
    creature.alignment = new Alignment('alignment');
    creature.levelAdjustment = 9266;
    creature.templates = ['template 1'];
    creature.abilities = {
        Strength: new CreatureAbility('Strength', 10, 0),
        Constitution: new CreatureAbility('Constitution', 11, 0),
        Dexterity: new CreatureAbility('Dexterity', 12, 1),
        Intelligence: new CreatureAbility('Intelligence', 13, 1),
        Wisdom: new CreatureAbility('Wisdom', 14, 2),
        Charisma: new CreatureAbility('Charisma', 15, 2),
    };
    creature.hitPoints = new HitPoints(3456, 3500, 42, 42, [], 'hit dice roll');
    creature.speeds = { Land: new CreatureMeasurement(30, 'feet per round') };
    creature.armorClass = new CreatureArmorClass(7, 34, 12);
    creature.totalInitiativeBonus = 4567;
    creature.baseAttackBonus = 21;
    creature.grappleBonus = 22;
    creature.space = new CreatureMeasurement(5, 'feet');
    creature.reach = new CreatureMeasurement(10, 'feet');
    creature.saves = {
        Fortitude: new Save(56),
        Reflex: new Save(78),
        Will: new Save(67),
    };
    creature.demographics = new Demographics(
        'gender',
        new CreatureMeasurement(18, 'years', 'adult'),
        new CreatureMeasurement(1800, 'years', 'natural causes'),
    );

    return creature;
}

export function createCreatureLines(): string[] {
    return [
        'creature summary:',
        '\tSize/Type: size creature type formatted type',
        '\tHit Dice: hit dice roll formatted hit dice',
        '\t\tHit Points: 3456',
        '\tInitiative: 4567 formatted',
        '\tSpeed: Land 30 formatted speed',
        '\tArmor Class: 7 formatted armor class',
        '\t\tTouch: 34',
        '\t\tFlat-Footed: 12',
        '\tBase Attack/Grapple: 21 formatted/22 formatted optional bonus',
        '\tAttack (0):',
        '\tFull Attack (0):',
        '\tSpace/Reach: 5 ft./10 ft.',
        '\tSpecial Attacks (0):',
        '\tSpecial Qualities (0):',
        '\tSaves: 56/78/67 formatted saves',
        '\tAbilities: 10/12/11/13/14/15 formatted abilities',
        '\tSkills (0):',
        '\tFeats (0):',
        '\tChallenge Rating: challenge rating',
        '\tAlignment: alignment',
        '\tLevel Adjustment: 9266 formatted optional bonus',
        '\tDemographics:',
        '\t\tGender: gender',
        '\t\tAge: 18 years formatted',
        '\t\tMaximum Age: 1800 years formatted',
        '\tLanguages (0):',
        '\tEquipment:',
        '\t\tWeapons (0):',
        '\t\tArmor: None',
        '\t\tShield: None',
        '\t\tItems (0):',
        '',
    ];
}

export function replaceLines(lines: string[], existing: string, replacements: string[]): string[] {
    const index = lines.indexOf(existing);
    if (index < 0)
        throw new Error(`Line not found: ${existing}`);

    return [...lines.slice(0, index), ...replacements, ...lines.slice(index + 1)];
}
