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
    creature.speeds = { Land: new CreatureMeasurement(30, 'feet per round', 'fast') };
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
        '\tSize: size',
        '\tType: creature type formatted type',
        '\tChallenge Rating: challenge rating',
        '\tAlignment: alignment',
        '\tLevel Adjustment: 9266 formatted optional bonus',
        '\tTemplates: template 1 formatted templates',
        '\tHit Points: 3456',
        '\t\tHit Dice: hit dice roll',
        '\tCombat:',
        '\t\tArmor Class: 7 formatted',
        '\t\t\tFlat-Footed: 12',
        '\t\t\tTouch: 34',
        '\t\tInitiative Bonus: 4567 formatted',
        '\t\tBase Attack: 21 formatted',
        '\t\tGrapple: 22 formatted optional bonus',
        '\t\tSpace: 5 feet formatted',
        '\t\tReach: 10 feet formatted',
        '\t\tSpeeds:',
        '\t\t\tLand: 30 feet per round formatted',
        '\t\tSaving Throws:',
        '\t\t\tFortitude 56 formatted save',
        '\t\t\tReflex 78 formatted save',
        '\t\t\tWill 67 formatted save',
        '\tAttacks:',
        '\t\tAttacks: None',
        '\t\tFull Melee Attack: None',
        '\t\tFull Ranged Attack: None',
        '\t\tSpecial Attacks: None',
        '\tAbilities:',
        '\t\tStrength 10 formatted ability',
        '\t\tConstitution 11 formatted ability',
        '\t\tDexterity 12 formatted ability',
        '\t\tIntelligence 13 formatted ability',
        '\t\tWisdom 14 formatted ability',
        '\t\tCharisma 15 formatted ability',
        '\tSkills: None',
        '\tFeats: None',
        '\tSpecial Qualities: None',
        '\tLanguages: None',
        '\tMagic: None',
        '\tEquipment:',
        '\t\tWeapons: None',
        '\t\tArmor: None',
        '\t\tShield: None',
        '\t\tItems: None',
        '\tDemographics:',
        '\t\tGender: gender',
        '\t\tAge: 18 years formatted',
        '\t\tMaximum Age: 1800 years formatted',
        '',
    ];
}

export function replaceLines(lines: string[], existing: string, replacements: string[]): string[] {
    const index = lines.indexOf(existing);
    if (index < 0)
        throw new Error(`Line not found: ${existing}`);

    return [...lines.slice(0, index), ...replacements, ...lines.slice(index + 1)];
}
