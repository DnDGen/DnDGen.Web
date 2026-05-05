import { Ability } from "../models/ability.model";
import { Armor } from "../../treasure/models/armor.model";
import { Character } from "../models/character.model";
import { Feat } from "../models/feat.model";
import { Good } from "../../treasure/models/good.model";
import { Item } from "../../treasure/models/item.model";
import { Skill } from "../models/skill.model";
import { Treasure } from "../../treasure/models/treasure.model";
import { Weapon } from "../../treasure/models/weapon.model";

export function createCharacter(): Character {
    var newCharacter = new Character(`character summary`);
    newCharacter.alignment.full = 'alignment';
    newCharacter.class.name = 'class name';
    newCharacter.class.level = 9266;
    newCharacter.class.summary = "class summary";
    newCharacter.race.baseRace = 'base race';
    newCharacter.race.landSpeed.value = 30;
    newCharacter.race.landSpeed.description = 'fast';
    newCharacter.race.landSpeed.unit = 'feet per round';
    newCharacter.race.size = 'size';
    newCharacter.race.age.value = 18;
    newCharacter.race.age.unit = 'Years';
    newCharacter.race.age.description = 'adult';
    newCharacter.race.maximumAge.value = 1800;
    newCharacter.race.maximumAge.unit = 'Years';
    newCharacter.race.maximumAge.description = 'natural causes';
    newCharacter.race.height.value = 48;
    newCharacter.race.height.unit = 'inches';
    newCharacter.race.height.description = 'tall';
    newCharacter.race.weight.value = 100;
    newCharacter.race.weight.unit = 'Pounds';
    newCharacter.race.weight.description = 'heavy';
    newCharacter.race.gender = 'my gender';
    newCharacter.race.summary = 'race summary';
    newCharacter.abilities.Charisma = createAbility("Strength", 9, -1);
    newCharacter.abilities.Constitution = createAbility("Constitution", 26, 13);
    newCharacter.abilities.Dexterity = createAbility("Dexterity", 6, -2);
    newCharacter.abilities.Intelligence = createAbility("Intelligence", 90, 45);
    newCharacter.abilities.Strength = createAbility("Wisdom", 2, -4);
    newCharacter.abilities.Wisdom = createAbility("Charisma", 10, 0);

    newCharacter.languages.push('English');
    newCharacter.languages.push('German');
    newCharacter.skills.push(createSkill('skill ' + (1), "", 4, newCharacter.abilities.Constitution, 0, -6, true, false, 135));
    newCharacter.skills.push(createSkill('skill ' + (2), "focus", 1.5, newCharacter.abilities.Dexterity, 3, 0, false, true, 246));
    newCharacter.feats.racial.push(createFeat('racial feat ' + (1)));
    newCharacter.feats.racial.push(createFeat('racial feat ' + (2)));
    newCharacter.feats.class.push(createFeat('class feat ' + (1)));
    newCharacter.feats.class.push(createFeat('class feat ' + (2)));
    newCharacter.feats.additional.push(createFeat('additional feat ' + (1)));
    newCharacter.feats.additional.push(createFeat('additional feat ' + (2)));
    newCharacter.combat.adjustedDexterityBonus = 3;
    newCharacter.combat.armorClass.full = 7;
    newCharacter.combat.armorClass.touch = 34;
    newCharacter.combat.armorClass.flatFooted = 12;

    newCharacter.combat.baseAttack.allMeleeBonuses = [21, 16, 11, 6, 1];
    newCharacter.combat.baseAttack.allRangedBonuses = [22, 17, 12, 7, 2];

    newCharacter.combat.hitPoints = 3456;
    newCharacter.combat.initiativeBonus = 4567;
    newCharacter.combat.savingThrows.fortitude = 56;
    newCharacter.combat.savingThrows.reflex = 78;
    newCharacter.combat.savingThrows.will = 67;
    newCharacter.combat.savingThrows.hasFortitudeSave = true;

    newCharacter.challengeRating = 89;

    return newCharacter;
}

export function createAbility(name: string, value: number, bonus: number): Ability {
    return new Ability(name, value, bonus);
}

export function createSkill(
    name: string,
    focus: string,
    effectiveRanks: number,
    baseAbility: Ability,
    bonus: number,
    acPenalty: number,
    classSkill: boolean,
    circumstantialBonus: boolean,
    totalBonus: number): Skill {
    return new Skill(name, focus, totalBonus, circumstantialBonus, effectiveRanks, baseAbility, bonus, acPenalty, classSkill);
}

export function createFeat(name: string): Feat {
    return new Feat(name);
}

export function createItem(name: string): Item {
    const item = new Item(name, 'MyItemType');
    item.summary = `${name} summary`;
    return item;
}

export function createWeapon(name: string): Weapon {
    const weapon = new Weapon(name, 'Weapon');
    weapon.summary = `${name} summary`;
    weapon.damageDescription = '9d2 damage';
    return weapon;
}

export function createArmor(name: string): Armor {
    const armor = new Armor(name, 'Armor');
    armor.summary = `${name} summary`;
    armor.totalArmorBonus = 92;
    return armor;
}

export function createTreasure(): Treasure {
    const treasure = new Treasure();
    treasure.isAny = true;
    treasure.coin.currency = 'my currency';
    treasure.coin.quantity = 9;
    treasure.goods = [
        new Good('good 1', 22), new Good('good 2', 2022)
    ];
    treasure.items = [
        new Item('item 1', 'item type 1'), new Item('item 2', 'item type 2'), new Item('item 3', 'item type 3')
    ];
    return treasure;
}

export function formatItem(item: Item, prefix: string): string {
    if (!prefix)
        prefix = '';

    var formattedItem = prefix + item.summary + '\r\n';
    formattedItem += prefix + '\tformatted\r\n';

    return formattedItem;
}
