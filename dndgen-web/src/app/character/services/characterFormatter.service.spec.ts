﻿import { InchesToFeetPipe } from "../../shared/inchesToFeet.pipe";
import { TreasureFormatterService } from "../../treasure/services/treasureFormatter.service";
import { Ability } from "../models/ability.model";
import { Armor } from "../models/armor.model";
import { Character } from "../models/character.model";
import { Coin } from "../models/coin.model";
import { Feat } from "../models/feat.model";
import { Frequency } from "../models/frequency.model";
import { Good } from "../models/good.model";
import { Item } from "../models/item.model";
import { Leadership } from "../models/leadership.model";
import { Skill } from "../models/skill.model";
import { SpecialAbility } from "../models/specialAbility.model";
import { Treasure } from "../models/treasure.model";
import { Weapon } from "../models/weapon.model";
import { CharacterFormatterService } from "./characterFormatter.service";

describe('Character Formatter Service', () => {
    describe('unit', () => {
        let characterFormatterService: CharacterFormatterService;
        let treasureFormatterServiceSpy: jasmine.SpyObj<TreasureFormatterService>;
        let inchesToFeetPipeSpy: jasmine.SpyObj<InchesToFeetPipe>;

        let character: Character;
        let leadership: Leadership | null;
        let cohort: Character | null;
        let followers: Character[];
        let treasure: Treasure;
        let item: Item;
        let characterCount: number;
    
        beforeEach(() => {
            treasureFormatterServiceSpy = jasmine.createSpyObj('TreasureFormatterService', ['formatTreasure', 'formatItem']);
            inchesToFeetPipeSpy = jasmine.createSpyObj('InchesToFeetPipe', ['transform']);

            character = createCharacter();
            leadership = null;
            cohort = null;
            followers = [];

            treasure = new Treasure();
            item = createItem('item name');
            characterCount = 0;

            characterFormatterService = new CharacterFormatterService(treasureFormatterServiceSpy, inchesToFeetPipeSpy);

            treasureFormatterServiceSpy.formatItem.and.callFake(formatItem);
            treasureFormatterServiceSpy.formatTreasure.and.callFake((treasure, prefix) => {
                if (!prefix)
                    prefix = '';

                var formattedTreasure = prefix + 'formatted treasure\r\n';

                return formattedTreasure;
            });
            inchesToFeetPipeSpy.transform.and.callFake((input: number) => {
                let feet = input / 12;
                return feet.toFixed(2) + ' feet filtered';
            });
        });
    
        function formatItem(item: Item, prefix: string) {
            if (!prefix)
                prefix = '';

            var formattedItem = prefix + item.name + '\r\n';
            formattedItem += prefix + '\tformatted\r\n';

            return formattedItem;
        }

        function createGood(description: string, value: number): Good {
            return new Good(description, value);
        }

        function createCharacter(): Character {
            characterCount++;
    
            var newCharacter = new Character(`character summary ${characterCount}`);
            newCharacter.alignment.full = 'alignment ' + characterCount;
            newCharacter.class.name = 'class name ' + characterCount;
            newCharacter.class.level = 9266 + characterCount;
            newCharacter.class.summary = "class summary " + characterCount;
            newCharacter.race.baseRace = 'base race ' + characterCount;
            newCharacter.race.landSpeed.value = 30 + characterCount,
            newCharacter.race.landSpeed.description = 'fast ' + characterCount,
            newCharacter.race.size = 'size ' + characterCount;
            newCharacter.race.age.value = 18 + characterCount;
            newCharacter.race.age.description = 'adult ' + characterCount;
            newCharacter.race.maximumAge.value = 1800 + characterCount;
            newCharacter.race.maximumAge.description = 'natural causes ' + characterCount;
            newCharacter.race.height.value = 48 + characterCount;
            newCharacter.race.height.description = 'tall ' + characterCount;
            newCharacter.race.weight.value = 100 + characterCount;
            newCharacter.race.weight.description = 'heavy ' + characterCount;
            newCharacter.race.gender = characterCount % 2 === 0 ? "Male" : "Female";
            newCharacter.race.summary = 'race summary ' + characterCount;
            newCharacter.abilities.Charisma = createAbility("Strength", 9 + characterCount, -1 + characterCount);
            newCharacter.abilities.Constitution = createAbility("Constitution", 26 + characterCount, 13 + characterCount);
            newCharacter.abilities.Dexterity = createAbility("Dexterity", 6 + characterCount, -2 + characterCount);
            newCharacter.abilities.Intelligence = createAbility("Intelligence", 90 + characterCount, 45 + characterCount);
            newCharacter.abilities.Strength = createAbility("Wisdom", 2 + characterCount, -4 + characterCount);
            newCharacter.abilities.Wisdom = createAbility("Charisma", 10 + characterCount, 0 + characterCount);
    
            expect(newCharacter.abilities.Charisma).not.toBeNull();
            expect(newCharacter.abilities.Constitution).not.toBeNull();
            expect(newCharacter.abilities.Dexterity).not.toBeNull();
            expect(newCharacter.abilities.Intelligence).not.toBeNull();
            expect(newCharacter.abilities.Strength).not.toBeNull();
            expect(newCharacter.abilities.Wisdom).not.toBeNull();
    
            newCharacter.languages.push('English ' + characterCount);
            newCharacter.languages.push('German ' + characterCount);
            newCharacter.skills.push(createSkill('skill ' + (1 + characterCount), "", 4 + characterCount, newCharacter.abilities.Constitution, 0, -6 - characterCount, true, false, 135 + characterCount));
            newCharacter.skills.push(createSkill('skill ' + (2 + characterCount), "focus", 1.5 + characterCount, newCharacter.abilities.Dexterity, 3 + characterCount, 0, false, true, 246 + characterCount));
            newCharacter.feats.racial.push(createFeat('racial feat ' + (1 + characterCount)));
            newCharacter.feats.racial.push(createFeat('racial feat ' + (2 + characterCount)));
            newCharacter.feats.class.push(createFeat('class feat ' + (1 + characterCount)));
            newCharacter.feats.class.push(createFeat('class feat ' + (2 + characterCount)));
            newCharacter.feats.additional.push(createFeat('additional feat ' + (1 + characterCount)));
            newCharacter.feats.additional.push(createFeat('additional feat ' + (2 + characterCount)));
            newCharacter.combat.adjustedDexterityBonus = 3 + characterCount;
            newCharacter.combat.armorClass.full = 7 + characterCount;
            newCharacter.combat.armorClass.touch = 34 + characterCount;
            newCharacter.combat.armorClass.flatFooted = 12 + characterCount;
    
            newCharacter.combat.baseAttack.allMeleeBonuses.length = 0;
            newCharacter.combat.baseAttack.allMeleeBonuses.push(21 + characterCount);
            newCharacter.combat.baseAttack.allMeleeBonuses.push(16 + characterCount);
            newCharacter.combat.baseAttack.allMeleeBonuses.push(11 + characterCount);
            newCharacter.combat.baseAttack.allMeleeBonuses.push(6 + characterCount);
            newCharacter.combat.baseAttack.allMeleeBonuses.push(1 + characterCount);
    
            newCharacter.combat.baseAttack.allRangedBonuses.length = 0;
            newCharacter.combat.baseAttack.allRangedBonuses.push(22 + characterCount);
            newCharacter.combat.baseAttack.allRangedBonuses.push(17 + characterCount);
            newCharacter.combat.baseAttack.allRangedBonuses.push(12 + characterCount);
            newCharacter.combat.baseAttack.allRangedBonuses.push(7 + characterCount);
            newCharacter.combat.baseAttack.allRangedBonuses.push(2 + characterCount);
    
            newCharacter.combat.hitPoints = 3456 + characterCount;
            newCharacter.combat.initiativeBonus = 4567 + characterCount;
            newCharacter.combat.savingThrows.fortitude = 56 + characterCount;
            newCharacter.combat.savingThrows.reflex = 78 + characterCount;
            newCharacter.combat.savingThrows.will = 67 + characterCount;
            newCharacter.combat.savingThrows.hasFortitudeSave = true;
    
            newCharacter.challengeRating = 89 + characterCount;
    
            return newCharacter;
        }
    
        function createAbility(name: string, value: number, bonus: number) {
            return new Ability(name, value, bonus);
        }
    
        function createSkill(name: string, focus: string, effectiveRanks: number, baseAbility: Ability, bonus: number, acPenalty: number, classSkill: boolean, circumstantialBonus: boolean, totalBonus: number): Skill {
            return new Skill(name, baseAbility, focus, bonus, classSkill, acPenalty, circumstantialBonus, 0, false, effectiveRanks, false, 0, false, totalBonus);
        }
    
        function createFeat(name: string) {
            return new Feat(name);
        }
    
        function createItem(itemName: string): Item {
            var item = new Item(itemName, 'MyItemType');
    
            return item;
        }
    
        it('formats empty treaure', () => {    
            var formattedTreasure = treasureFormatterService.formatTreasure(treasure);
            var lines = formattedTreasure.split('\r\n');
    
            expect(lines[0]).toBe('No coins');
            expect(lines[1]).toBe('Goods (x0)');
            expect(lines[2]).toBe('Items (x0)');
            expect(lines[3]).toBe('');
            expect(lines.length).toBe(4);
        });
    
        it('formats coin', () => {
            treasure.isAny = true;
            treasure.coin.quantity = 9266;
            treasure.coin.currency = 'munny';
    
            var formattedTreasure = treasureFormatterService.formatTreasure(treasure);
            var lines = formattedTreasure.split('\r\n');
    
            expect(lines[0]).toBe('9,266 munny');
            expect(lines[1]).toBe('Goods (x0)');
            expect(lines[2]).toBe('Items (x0)');
            expect(lines[3]).toBe('');
            expect(lines.length).toBe(4);
        });
    
        it('formats goods', () => {
            treasure.isAny = true;
            treasure.goods.push(createGood('description 1', 90210));
            treasure.goods.push(createGood('description 2', 42));
    
            var formattedTreasure = treasureFormatterService.formatTreasure(treasure);
            var lines = formattedTreasure.split('\r\n');
    
            expect(lines[0]).toBe('No coins');
            expect(lines[1]).toBe('Goods (x2):');
            expect(lines[2]).toBe('\tdescription 1 (90,210gp)');
            expect(lines[3]).toBe('\tdescription 2 (42gp)');
            expect(lines[4]).toBe('Items (x0)');
            expect(lines[5]).toBe('');
            expect(lines.length).toBe(6);
        });
    
        it('formats items', () => {
            treasure.isAny = true;
    
            item.quantity = 2;
            item.contents.push('first contents');
            item.contents.push('second contents');
            item.traits.push('first trait');
            item.traits.push('second trait');
            item.attributes.push('first attribute');
            item.attributes.push('Charged');
            item.attributes.push('second attribute');
            item.magic.bonus = 3;
            item.magic.specialAbilities.push(new SpecialAbility('special ability 1'));
            item.magic.specialAbilities.push(new SpecialAbility('special ability 2'));
            item.magic.charges = 4;
            item.magic.curse = 'curse';
            item.magic.intelligence.ego = 5;
            item.magic.intelligence.intelligenceStat = 6;
            item.magic.intelligence.wisdomStat = 7;
            item.magic.intelligence.charismaStat = 8;
            item.magic.intelligence.alignment = 'alignment';
            item.magic.intelligence.communication.push('empathy');
            item.magic.intelligence.communication.push('telepathy');
            item.magic.intelligence.languages.push('English');
            item.magic.intelligence.languages.push('German');
            item.magic.intelligence.senses = 'senses';
            item.magic.intelligence.powers.push('first power');
            item.magic.intelligence.powers.push('second power');
            item.magic.intelligence.specialPurpose = 'special purpose';
            item.magic.intelligence.dedicatedPower = 'dedicated power';
            item.magic.intelligence.personality = 'personality';
    
            treasure.items.push(item);
            treasure.items.push(createItem('other item name'));
    
            var formattedTreasure = treasureFormatterService.formatTreasure(treasure);
            var lines = formattedTreasure.split('\r\n');
    
            expect(lines[0]).toBe('No coins');
            expect(lines[1]).toBe('Goods (x0)');
            expect(lines[2]).toBe('Items (x2):');
            expect(lines[3]).toBe('\titem name (x2)');
            expect(lines[4]).toBe('\t\tContents:');
            expect(lines[5]).toBe('\t\t\tfirst contents');
            expect(lines[6]).toBe('\t\t\tsecond contents');
            expect(lines[7]).toBe('\t\tTraits:');
            expect(lines[8]).toBe('\t\t\tfirst trait');
            expect(lines[9]).toBe('\t\t\tsecond trait');
            expect(lines[10]).toBe('\t\tBonus: +3');
            expect(lines[11]).toBe('\t\tSpecial Abilities:');
            expect(lines[12]).toBe('\t\t\tspecial ability 1');
            expect(lines[13]).toBe('\t\t\tspecial ability 2');
            expect(lines[14]).toBe('\t\tCharges: 4');
            expect(lines[15]).toBe('\t\tCurse: curse');
            expect(lines[16]).toBe('\t\tIntelligent:');
            expect(lines[17]).toBe('\t\t\tEgo: 5');
            expect(lines[18]).toBe('\t\t\tIntelligence: 6');
            expect(lines[19]).toBe('\t\t\tWisdom: 7');
            expect(lines[20]).toBe('\t\t\tCharisma: 8');
            expect(lines[21]).toBe('\t\t\tAlignment: alignment');
            expect(lines[22]).toBe('\t\t\tCommunication:');
            expect(lines[23]).toBe('\t\t\t\tempathy');
            expect(lines[24]).toBe('\t\t\t\ttelepathy');
            expect(lines[25]).toBe('\t\t\t\tLanguages:');
            expect(lines[26]).toBe('\t\t\t\t\tEnglish');
            expect(lines[27]).toBe('\t\t\t\t\tGerman');
            expect(lines[28]).toBe('\t\t\tSenses: senses');
            expect(lines[29]).toBe('\t\t\tPowers:');
            expect(lines[30]).toBe('\t\t\t\tfirst power');
            expect(lines[31]).toBe('\t\t\t\tsecond power');
            expect(lines[32]).toBe('\t\t\tSpecial Purpose: special purpose');
            expect(lines[33]).toBe('\t\t\tDedicated Power: dedicated power');
            expect(lines[34]).toBe('\t\t\tPersonality: personality');
            expect(lines[35]).toBe('\tother item name');
            expect(lines[36]).toBe('');
            expect(lines.length).toBe(37);
        });
    
        it('formats all treasure', () => {
            treasure.isAny = true;
    
            item.quantity = 2;
            item.contents.push('first contents');
            item.contents.push('second contents');
            item.traits.push('first trait');
            item.traits.push('second trait');
            item.attributes.push('first attribute');
            item.attributes.push('Charged');
            item.attributes.push('second attribute');
            item.magic.bonus = 3;
            item.magic.specialAbilities.push(new SpecialAbility('special ability 1'));
            item.magic.specialAbilities.push(new SpecialAbility('special ability 2'));
            item.magic.charges = 4;
            item.magic.curse = 'curse';
            item.magic.intelligence.ego = 5;
            item.magic.intelligence.intelligenceStat = 6;
            item.magic.intelligence.wisdomStat = 7;
            item.magic.intelligence.charismaStat = 8;
            item.magic.intelligence.alignment = 'alignment';
            item.magic.intelligence.communication.push('empathy');
            item.magic.intelligence.communication.push('telepathy');
            item.magic.intelligence.languages.push('English');
            item.magic.intelligence.languages.push('German');
            item.magic.intelligence.senses = 'senses';
            item.magic.intelligence.powers.push('first power');
            item.magic.intelligence.powers.push('second power');
            item.magic.intelligence.specialPurpose = 'special purpose';
            item.magic.intelligence.dedicatedPower = 'dedicated power';
            item.magic.intelligence.personality = 'personality';
    
            treasure.coin.quantity = 9266;
            treasure.coin.currency = 'munny';
            treasure.goods.push(createGood('description 1', 90210));
            treasure.goods.push(createGood('description 2', 42));
            treasure.items.push(item);
            treasure.items.push(createItem('other item name'));
    
            var formattedTreasure = treasureFormatterService.formatTreasure(treasure);
            var lines = formattedTreasure.split('\r\n');
    
            expect(lines[0]).toBe('9,266 munny');
            expect(lines[1]).toBe('Goods (x2):');
            expect(lines[2]).toBe('\tdescription 1 (90,210gp)');
            expect(lines[3]).toBe('\tdescription 2 (42gp)');
            expect(lines[4]).toBe('Items (x2):');
            expect(lines[5]).toBe('\titem name (x2)');
            expect(lines[6]).toBe('\t\tContents:');
            expect(lines[7]).toBe('\t\t\tfirst contents');
            expect(lines[8]).toBe('\t\t\tsecond contents');
            expect(lines[9]).toBe('\t\tTraits:');
            expect(lines[10]).toBe('\t\t\tfirst trait');
            expect(lines[11]).toBe('\t\t\tsecond trait');
            expect(lines[12]).toBe('\t\tBonus: +3');
            expect(lines[13]).toBe('\t\tSpecial Abilities:');
            expect(lines[14]).toBe('\t\t\tspecial ability 1');
            expect(lines[15]).toBe('\t\t\tspecial ability 2');
            expect(lines[16]).toBe('\t\tCharges: 4');
            expect(lines[17]).toBe('\t\tCurse: curse');
            expect(lines[18]).toBe('\t\tIntelligent:');
            expect(lines[19]).toBe('\t\t\tEgo: 5');
            expect(lines[20]).toBe('\t\t\tIntelligence: 6');
            expect(lines[21]).toBe('\t\t\tWisdom: 7');
            expect(lines[22]).toBe('\t\t\tCharisma: 8');
            expect(lines[23]).toBe('\t\t\tAlignment: alignment');
            expect(lines[24]).toBe('\t\t\tCommunication:');
            expect(lines[25]).toBe('\t\t\t\tempathy');
            expect(lines[26]).toBe('\t\t\t\ttelepathy');
            expect(lines[27]).toBe('\t\t\t\tLanguages:');
            expect(lines[28]).toBe('\t\t\t\t\tEnglish');
            expect(lines[29]).toBe('\t\t\t\t\tGerman');
            expect(lines[30]).toBe('\t\t\tSenses: senses');
            expect(lines[31]).toBe('\t\t\tPowers:');
            expect(lines[32]).toBe('\t\t\t\tfirst power');
            expect(lines[33]).toBe('\t\t\t\tsecond power');
            expect(lines[34]).toBe('\t\t\tSpecial Purpose: special purpose');
            expect(lines[35]).toBe('\t\t\tDedicated Power: dedicated power');
            expect(lines[36]).toBe('\t\t\tPersonality: personality');
            expect(lines[37]).toBe('\tother item name');
            expect(lines[38]).toBe('');
            expect(lines.length).toBe(39);
        });
    
        it('formats all treasure with prefix', () => {
            treasure.isAny = true;
    
            item.quantity = 2;
            item.contents.push('first contents');
            item.contents.push('second contents');
            item.traits.push('first trait');
            item.traits.push('second trait');
            item.attributes.push('first attribute');
            item.attributes.push('Charged');
            item.attributes.push('second attribute');
            item.magic.bonus = 3;
            item.magic.specialAbilities.push(new SpecialAbility('special ability 1'));
            item.magic.specialAbilities.push(new SpecialAbility('special ability 2'));
            item.magic.charges = 4;
            item.magic.curse = 'curse';
            item.magic.intelligence.ego = 5;
            item.magic.intelligence.intelligenceStat = 6;
            item.magic.intelligence.wisdomStat = 7;
            item.magic.intelligence.charismaStat = 8;
            item.magic.intelligence.alignment = 'alignment';
            item.magic.intelligence.communication.push('empathy');
            item.magic.intelligence.communication.push('telepathy');
            item.magic.intelligence.languages.push('English');
            item.magic.intelligence.languages.push('German');
            item.magic.intelligence.senses = 'senses';
            item.magic.intelligence.powers.push('first power');
            item.magic.intelligence.powers.push('second power');
            item.magic.intelligence.specialPurpose = 'special purpose';
            item.magic.intelligence.dedicatedPower = 'dedicated power';
            item.magic.intelligence.personality = 'personality';
    
            treasure.coin.quantity = 9266;
            treasure.coin.currency = 'munny';
            treasure.goods.push(createGood('description 1', 90210));
            treasure.goods.push(createGood('description 2', 42));
            treasure.items.push(item);
            treasure.items.push(createItem('other item name'));
    
            var formattedTreasure = treasureFormatterService.formatTreasure(treasure, '\t');
            var lines = formattedTreasure.split('\r\n');
    
            expect(lines[0]).toBe('\t9,266 munny');
            expect(lines[1]).toBe('\tGoods (x2):');
            expect(lines[2]).toBe('\t\tdescription 1 (90,210gp)');
            expect(lines[3]).toBe('\t\tdescription 2 (42gp)');
            expect(lines[4]).toBe('\tItems (x2):');
            expect(lines[5]).toBe('\t\titem name (x2)');
            expect(lines[6]).toBe('\t\t\tContents:');
            expect(lines[7]).toBe('\t\t\t\tfirst contents');
            expect(lines[8]).toBe('\t\t\t\tsecond contents');
            expect(lines[9]).toBe('\t\t\tTraits:');
            expect(lines[10]).toBe('\t\t\t\tfirst trait');
            expect(lines[11]).toBe('\t\t\t\tsecond trait');
            expect(lines[12]).toBe('\t\t\tBonus: +3');
            expect(lines[13]).toBe('\t\t\tSpecial Abilities:');
            expect(lines[14]).toBe('\t\t\t\tspecial ability 1');
            expect(lines[15]).toBe('\t\t\t\tspecial ability 2');
            expect(lines[16]).toBe('\t\t\tCharges: 4');
            expect(lines[17]).toBe('\t\t\tCurse: curse');
            expect(lines[18]).toBe('\t\t\tIntelligent:');
            expect(lines[19]).toBe('\t\t\t\tEgo: 5');
            expect(lines[20]).toBe('\t\t\t\tIntelligence: 6');
            expect(lines[21]).toBe('\t\t\t\tWisdom: 7');
            expect(lines[22]).toBe('\t\t\t\tCharisma: 8');
            expect(lines[23]).toBe('\t\t\t\tAlignment: alignment');
            expect(lines[24]).toBe('\t\t\t\tCommunication:');
            expect(lines[25]).toBe('\t\t\t\t\tempathy');
            expect(lines[26]).toBe('\t\t\t\t\ttelepathy');
            expect(lines[27]).toBe('\t\t\t\t\tLanguages:');
            expect(lines[28]).toBe('\t\t\t\t\t\tEnglish');
            expect(lines[29]).toBe('\t\t\t\t\t\tGerman');
            expect(lines[30]).toBe('\t\t\t\tSenses: senses');
            expect(lines[31]).toBe('\t\t\t\tPowers:');
            expect(lines[32]).toBe('\t\t\t\t\tfirst power');
            expect(lines[33]).toBe('\t\t\t\t\tsecond power');
            expect(lines[34]).toBe('\t\t\t\tSpecial Purpose: special purpose');
            expect(lines[35]).toBe('\t\t\t\tDedicated Power: dedicated power');
            expect(lines[36]).toBe('\t\t\t\tPersonality: personality');
            expect(lines[37]).toBe('\t\tother item name');
            expect(lines[38]).toBe('');
            expect(lines.length).toBe(39);
        });
    
        it('formats item', () => {
            var formattedItem = treasureFormatterService.formatItem(item);
            var lines = formattedItem.split('\r\n');
    
            expect(lines[0]).toBe('item name');
            expect(lines[1]).toBe('');
            expect(lines.length).toBe(2);
        });
    
        it('formats item with quantity greater than 1', () => {
            item.quantity = 2;
    
            var formattedItem = treasureFormatterService.formatItem(item);
            var lines = formattedItem.split('\r\n');
    
            expect(lines[0]).toBe('item name (x2)');
            expect(lines[1]).toBe('');
            expect(lines.length).toBe(2);
        });
    
        it('formats item contents', () => {
            item.contents.push('first contents');
            item.contents.push('second contents');
    
            var formattedItem = treasureFormatterService.formatItem(item);
            var lines = formattedItem.split('\r\n');
    
            expect(lines[0]).toBe('item name');
            expect(lines[1]).toBe('\tContents:');
            expect(lines[2]).toBe('\t\tfirst contents');
            expect(lines[3]).toBe('\t\tsecond contents');
            expect(lines[4]).toBe('');
            expect(lines.length).toBe(5);
        });
    
        it('formats item traits', () => {
            item.traits.push('first trait');
            item.traits.push('second trait');
    
            var formattedItem = treasureFormatterService.formatItem(item);
            var lines = formattedItem.split('\r\n');
    
            expect(lines[0]).toBe('item name');
            expect(lines[1]).toBe('\tTraits:');
            expect(lines[2]).toBe('\t\tfirst trait');
            expect(lines[3]).toBe('\t\tsecond trait');
            expect(lines[4]).toBe('');
            expect(lines.length).toBe(5);
        });
    
        it('formats item magic bonus', () => {
            item.magic.bonus = 3;
    
            var formattedItem = treasureFormatterService.formatItem(item);
            var lines = formattedItem.split('\r\n');
    
            expect(lines[0]).toBe('item name');
            expect(lines[1]).toBe('\tBonus: +3');
            expect(lines[2]).toBe('');
            expect(lines.length).toBe(3);
        });
    
        it('formats item magic special abilities', () => {
            item.magic.bonus = 3;
            item.magic.specialAbilities.push(new SpecialAbility('special ability 1'));
            item.magic.specialAbilities.push(new SpecialAbility('special ability 2'));
    
            var formattedItem = treasureFormatterService.formatItem(item);
            var lines = formattedItem.split('\r\n');
    
            expect(lines[0]).toBe('item name');
            expect(lines[1]).toBe('\tBonus: +3');
            expect(lines[2]).toBe('\tSpecial Abilities:');
            expect(lines[3]).toBe('\t\tspecial ability 1');
            expect(lines[4]).toBe('\t\tspecial ability 2');
            expect(lines[5]).toBe('');
            expect(lines.length).toBe(6);
        });
    
        it('formats item charges', () => {
            item.magic.charges = 4;
            item.attributes.push('Charged');
    
            var formattedItem = treasureFormatterService.formatItem(item);
            var lines = formattedItem.split('\r\n');
    
            expect(lines[0]).toBe('item name');
            expect(lines[1]).toBe('\tCharges: 4');
            expect(lines[2]).toBe('');
            expect(lines.length).toBe(3);
        });
    
        it('formats item charges of 0', () => {
            item.attributes.push('Charged');
    
            var formattedItem = treasureFormatterService.formatItem(item);
            var lines = formattedItem.split('\r\n');
    
            expect(lines[0]).toBe('item name');
            expect(lines[1]).toBe('\tCharges: 0');
            expect(lines[2]).toBe('');
            expect(lines.length).toBe(3);
        });
    
        it('formats item curse', () => {
            item.magic.curse = 'curse';
    
            var formattedItem = treasureFormatterService.formatItem(item);
            var lines = formattedItem.split('\r\n');
    
            expect(lines[0]).toBe('item name');
            expect(lines[1]).toBe('\tCurse: curse');
            expect(lines[2]).toBe('');
            expect(lines.length).toBe(3);
        });
    
        it('formats armor', () => {
            var armor = new Armor('armor name', 'Armor');
            armor.totalArmorBonus = 9266;
            armor.totalArmorCheckPenalty = -90210;
            armor.totalMaxDexterityBonus = 42;
            armor.size = "armor size";
    
            var formattedItem = treasureFormatterService.formatItem(armor);
            var lines = formattedItem.split('\r\n');
    
            var expected = [
                'armor name',
                '\t' + 'Armor:',
                '\t\t' + 'Size: armor size',
                '\t\t' + 'Armor Bonus: 9266',
                '\t\t' + 'Armor Check Penalty: -90210',
                '\t\t' + 'Max Dexterity Bonus: 42',
                '',
            ];
    
            for (var i = 0; i < lines.length; i++) {
                expect(lines[i]).toBe(expected[i]);
            }
    
            expect(lines.length).toBe(expected.length);
        });
    
        it('formats armor with no max dexterity limitation', () => {
            var armor = new Armor('armor name', 'Armor');
            armor.totalArmorBonus = 9266;
            armor.totalArmorCheckPenalty = -90210;
            armor.totalMaxDexterityBonus = 9000;
            armor.size = "armor size";
    
            var formattedItem = treasureFormatterService.formatItem(armor);
            var lines = formattedItem.split('\r\n');
    
            var expected = [
                'armor name',
                '\t' + 'Armor:',
                '\t\t' + 'Size: armor size',
                '\t\t' + 'Armor Bonus: 9266',
                '\t\t' + 'Armor Check Penalty: -90210',
                '',
            ];
    
            for (var i = 0; i < lines.length; i++) {
                expect(lines[i]).toBe(expected[i]);
            }
    
            expect(lines.length).toBe(expected.length);
        });
    
        it('formats weapon', () => {
            var weapon = new Weapon('weapon name', 'Weapon');
            weapon.size = "weapon size";
            weapon.combatTypes = ["melee", "ranged"];
            weapon.damageDescription = "damage description";
            weapon.threatRangeDescription = "threat range description";
            weapon.criticalDamageDescription = "over 9000";
    
            var formattedItem = treasureFormatterService.formatItem(weapon);
            var lines = formattedItem.split('\r\n');
    
            var expected = [
                'weapon name',
                '\t' + 'Weapon:',
                '\t\t' + 'Size: weapon size',
                '\t\t' + 'Combat Types: melee, ranged',
                '\t\t' + 'Damage: damage description',
                '\t\t' + 'Threat Range: threat range description',
                '\t\t' + 'Critical Damage: over 9000',
                '',
            ];
    
            for (var i = 0; i < lines.length; i++) {
                expect(lines[i]).toBe(expected[i]);
            }
    
            expect(lines.length).toBe(expected.length);
        });
    
        it('formats double weapon', () => {
            var weapon = new Weapon('weapon name', 'Weapon');
            weapon.size = "weapon size";
            weapon.combatTypes = ["melee", "ranged"];
            weapon.damageDescription = "damage description";
            weapon.threatRangeDescription = "threat range description";
            weapon.criticalDamageDescription = "over 9000";
            weapon.isDoubleWeapon = true;
            weapon.secondaryDamageDescription = 'secondary damage description';
            weapon.secondaryCriticalDamageDescription = 'finish him';
    
            var formattedItem = treasureFormatterService.formatItem(weapon);
            var lines = formattedItem.split('\r\n');
    
            var expected = [
                'weapon name',
                '\t' + 'Weapon:',
                '\t\t' + 'Size: weapon size',
                '\t\t' + 'Combat Types: melee, ranged',
                '\t\t' + 'Damage: damage description',
                '\t\t' + 'Secondary Damage: secondary damage description',
                '\t\t' + 'Threat Range: threat range description',
                '\t\t' + 'Critical Damage: over 9000',
                '\t\t' + 'Secondary Critical Damage: finish him',
                '',
            ];
    
            for (var i = 0; i < lines.length; i++) {
                expect(lines[i]).toBe(expected[i]);
            }
    
            expect(lines.length).toBe(expected.length);
        });
    
        it('formats weapon requiring ammunition', () => {
            var weapon = new Weapon('weapon name', 'Weapon');
            weapon.size = "weapon size";
            weapon.combatTypes = ["ranged"];
            weapon.damageDescription = "damage description";
            weapon.threatRangeDescription = "threat range description";
            weapon.criticalDamageDescription = "over 9000";
            weapon.ammunition = "needed ammo";
    
            var formattedItem = treasureFormatterService.formatItem(weapon);
            var lines = formattedItem.split('\r\n');
    
            var expected = [
                'weapon name',
                '\t' + 'Weapon:',
                '\t\t' + 'Size: weapon size',
                '\t\t' + 'Combat Types: ranged',
                '\t\t' + 'Damage: damage description',
                '\t\t' + 'Threat Range: threat range description',
                '\t\t' + 'Critical Damage: over 9000',
                '\t\t' + 'Ammunition Used: needed ammo',
                '',
            ];
    
            for (var i = 0; i < lines.length; i++) {
                expect(lines[i]).toBe(expected[i]);
            }
    
            expect(lines.length).toBe(expected.length);
        });
    
        it('formats item intelligence', () => {
            item.magic.intelligence.ego = 5;
            item.magic.intelligence.intelligenceStat = 6;
            item.magic.intelligence.wisdomStat = 7;
            item.magic.intelligence.charismaStat = 8;
            item.magic.intelligence.alignment = 'alignment';
            item.magic.intelligence.communication.push('empathy');
            item.magic.intelligence.communication.push('telepathy');
            item.magic.intelligence.senses = 'senses';
            item.magic.intelligence.powers.push('first power');
            item.magic.intelligence.powers.push('second power');
    
            var formattedItem = treasureFormatterService.formatItem(item);
            var lines = formattedItem.split('\r\n');
    
            expect(lines[0]).toBe('item name');
            expect(lines[1]).toBe('\tIntelligent:');
            expect(lines[2]).toBe('\t\tEgo: 5');
            expect(lines[3]).toBe('\t\tIntelligence: 6');
            expect(lines[4]).toBe('\t\tWisdom: 7');
            expect(lines[5]).toBe('\t\tCharisma: 8');
            expect(lines[6]).toBe('\t\tAlignment: alignment');
            expect(lines[7]).toBe('\t\tCommunication:');
            expect(lines[8]).toBe('\t\t\tempathy');
            expect(lines[9]).toBe('\t\t\ttelepathy');
            expect(lines[10]).toBe('\t\tSenses: senses');
            expect(lines[11]).toBe('\t\tPowers:');
            expect(lines[12]).toBe('\t\t\tfirst power');
            expect(lines[13]).toBe('\t\t\tsecond power');
            expect(lines[14]).toBe('\t\tPersonality: None');
            expect(lines[15]).toBe('');
            expect(lines.length).toBe(16);
        });
    
        it('formats item intelligence languages', () => {
            item.magic.intelligence.ego = 5;
            item.magic.intelligence.intelligenceStat = 6;
            item.magic.intelligence.wisdomStat = 7;
            item.magic.intelligence.charismaStat = 8;
            item.magic.intelligence.alignment = 'alignment';
            item.magic.intelligence.communication.push('empathy');
            item.magic.intelligence.communication.push('telepathy');
            item.magic.intelligence.languages.push('English');
            item.magic.intelligence.languages.push('German');
            item.magic.intelligence.senses = 'senses';
            item.magic.intelligence.powers.push('first power');
            item.magic.intelligence.powers.push('second power');
    
            var formattedItem = treasureFormatterService.formatItem(item);
            var lines = formattedItem.split('\r\n');
    
            expect(lines[0]).toBe('item name');
            expect(lines[1]).toBe('\tIntelligent:');
            expect(lines[2]).toBe('\t\tEgo: 5');
            expect(lines[3]).toBe('\t\tIntelligence: 6');
            expect(lines[4]).toBe('\t\tWisdom: 7');
            expect(lines[5]).toBe('\t\tCharisma: 8');
            expect(lines[6]).toBe('\t\tAlignment: alignment');
            expect(lines[7]).toBe('\t\tCommunication:');
            expect(lines[8]).toBe('\t\t\tempathy');
            expect(lines[9]).toBe('\t\t\ttelepathy');
            expect(lines[10]).toBe('\t\t\tLanguages:');
            expect(lines[11]).toBe('\t\t\t\tEnglish');
            expect(lines[12]).toBe('\t\t\t\tGerman');
            expect(lines[13]).toBe('\t\tSenses: senses');
            expect(lines[14]).toBe('\t\tPowers:');
            expect(lines[15]).toBe('\t\t\tfirst power');
            expect(lines[16]).toBe('\t\t\tsecond power');
            expect(lines[17]).toBe('\t\tPersonality: None');
            expect(lines[18]).toBe('');
            expect(lines.length).toBe(19);
        });
    
        it('formats item intelligence special purpose', () => {
            item.magic.intelligence.ego = 5;
            item.magic.intelligence.intelligenceStat = 6;
            item.magic.intelligence.wisdomStat = 7;
            item.magic.intelligence.charismaStat = 8;
            item.magic.intelligence.alignment = 'alignment';
            item.magic.intelligence.communication.push('empathy');
            item.magic.intelligence.communication.push('telepathy');
            item.magic.intelligence.senses = 'senses';
            item.magic.intelligence.powers.push('first power');
            item.magic.intelligence.powers.push('second power');
            item.magic.intelligence.specialPurpose = 'special purpose';
            item.magic.intelligence.dedicatedPower = 'dedicated power';
    
            var formattedItem = treasureFormatterService.formatItem(item);
            var lines = formattedItem.split('\r\n');
    
            expect(lines[0]).toBe('item name');
            expect(lines[1]).toBe('\tIntelligent:');
            expect(lines[2]).toBe('\t\tEgo: 5');
            expect(lines[3]).toBe('\t\tIntelligence: 6');
            expect(lines[4]).toBe('\t\tWisdom: 7');
            expect(lines[5]).toBe('\t\tCharisma: 8');
            expect(lines[6]).toBe('\t\tAlignment: alignment');
            expect(lines[7]).toBe('\t\tCommunication:');
            expect(lines[8]).toBe('\t\t\tempathy');
            expect(lines[9]).toBe('\t\t\ttelepathy');
            expect(lines[10]).toBe('\t\tSenses: senses');
            expect(lines[11]).toBe('\t\tPowers:');
            expect(lines[12]).toBe('\t\t\tfirst power');
            expect(lines[13]).toBe('\t\t\tsecond power');
            expect(lines[14]).toBe('\t\tSpecial Purpose: special purpose');
            expect(lines[15]).toBe('\t\tDedicated Power: dedicated power');
            expect(lines[16]).toBe('\t\tPersonality: None');
            expect(lines[17]).toBe('');
            expect(lines.length).toBe(18);
        });
    
        it('formats intelligence personality', () => {
            item.magic.intelligence.ego = 5;
            item.magic.intelligence.intelligenceStat = 6;
            item.magic.intelligence.wisdomStat = 7;
            item.magic.intelligence.charismaStat = 8;
            item.magic.intelligence.alignment = 'alignment';
            item.magic.intelligence.communication.push('empathy');
            item.magic.intelligence.communication.push('telepathy');
            item.magic.intelligence.senses = 'senses';
            item.magic.intelligence.powers.push('first power');
            item.magic.intelligence.powers.push('second power');
            item.magic.intelligence.personality = 'personality';
    
            var formattedItem = treasureFormatterService.formatItem(item);
            var lines = formattedItem.split('\r\n');
    
            expect(lines[0]).toBe('item name');
            expect(lines[1]).toBe('\tIntelligent:');
            expect(lines[2]).toBe('\t\tEgo: 5');
            expect(lines[3]).toBe('\t\tIntelligence: 6');
            expect(lines[4]).toBe('\t\tWisdom: 7');
            expect(lines[5]).toBe('\t\tCharisma: 8');
            expect(lines[6]).toBe('\t\tAlignment: alignment');
            expect(lines[7]).toBe('\t\tCommunication:');
            expect(lines[8]).toBe('\t\t\tempathy');
            expect(lines[9]).toBe('\t\t\ttelepathy');
            expect(lines[10]).toBe('\t\tSenses: senses');
            expect(lines[11]).toBe('\t\tPowers:');
            expect(lines[12]).toBe('\t\t\tfirst power');
            expect(lines[13]).toBe('\t\t\tsecond power');
            expect(lines[14]).toBe('\t\tPersonality: personality');
            expect(lines[15]).toBe('');
            expect(lines.length).toBe(16);
        });
    
        it('formats full item', () => {
            item.quantity = 2;
            item.contents.push('first contents');
            item.contents.push('second contents');
            item.traits.push('first trait');
            item.traits.push('second trait');
            item.attributes.push('first attribute');
            item.attributes.push('Charged');
            item.attributes.push('second attribute');
            item.magic.bonus = 3;
            item.magic.specialAbilities.push(new SpecialAbility('special ability 1'));
            item.magic.specialAbilities.push(new SpecialAbility('special ability 2'));
            item.magic.charges = 4;
            item.magic.curse = 'curse';
            item.magic.intelligence.ego = 5;
            item.magic.intelligence.intelligenceStat = 6;
            item.magic.intelligence.wisdomStat = 7;
            item.magic.intelligence.charismaStat = 8;
            item.magic.intelligence.alignment = 'alignment';
            item.magic.intelligence.communication.push('empathy');
            item.magic.intelligence.communication.push('telepathy');
            item.magic.intelligence.languages.push('English');
            item.magic.intelligence.languages.push('German');
            item.magic.intelligence.senses = 'senses';
            item.magic.intelligence.powers.push('first power');
            item.magic.intelligence.powers.push('second power');
            item.magic.intelligence.specialPurpose = 'special purpose';
            item.magic.intelligence.dedicatedPower = 'dedicated power';
            item.magic.intelligence.personality = 'personality';
    
            var formattedItem = treasureFormatterService.formatItem(item);
            var lines = formattedItem.split('\r\n');
    
            expect(lines[0]).toBe('item name (x2)');
            expect(lines[1]).toBe('\tContents:');
            expect(lines[2]).toBe('\t\tfirst contents');
            expect(lines[3]).toBe('\t\tsecond contents');
            expect(lines[4]).toBe('\tTraits:');
            expect(lines[5]).toBe('\t\tfirst trait');
            expect(lines[6]).toBe('\t\tsecond trait');
            expect(lines[7]).toBe('\tBonus: +3');
            expect(lines[8]).toBe('\tSpecial Abilities:');
            expect(lines[9]).toBe('\t\tspecial ability 1');
            expect(lines[10]).toBe('\t\tspecial ability 2');
            expect(lines[11]).toBe('\tCharges: 4');
            expect(lines[12]).toBe('\tCurse: curse');
            expect(lines[13]).toBe('\tIntelligent:');
            expect(lines[14]).toBe('\t\tEgo: 5');
            expect(lines[15]).toBe('\t\tIntelligence: 6');
            expect(lines[16]).toBe('\t\tWisdom: 7');
            expect(lines[17]).toBe('\t\tCharisma: 8');
            expect(lines[18]).toBe('\t\tAlignment: alignment');
            expect(lines[19]).toBe('\t\tCommunication:');
            expect(lines[20]).toBe('\t\t\tempathy');
            expect(lines[21]).toBe('\t\t\ttelepathy');
            expect(lines[22]).toBe('\t\t\tLanguages:');
            expect(lines[23]).toBe('\t\t\t\tEnglish');
            expect(lines[24]).toBe('\t\t\t\tGerman');
            expect(lines[25]).toBe('\t\tSenses: senses');
            expect(lines[26]).toBe('\t\tPowers:');
            expect(lines[27]).toBe('\t\t\tfirst power');
            expect(lines[28]).toBe('\t\t\tsecond power');
            expect(lines[29]).toBe('\t\tSpecial Purpose: special purpose');
            expect(lines[30]).toBe('\t\tDedicated Power: dedicated power');
            expect(lines[31]).toBe('\t\tPersonality: personality');
            expect(lines[32]).toBe('');
            expect(lines.length).toBe(33);
        });
    
        it('formats full item with prefix', () => {
            item.quantity = 2;
            item.contents.push('first contents');
            item.contents.push('second contents');
            item.traits.push('first trait');
            item.traits.push('second trait');
            item.attributes.push('first attribute');
            item.attributes.push('Charged');
            item.attributes.push('second attribute');
            item.magic.bonus = 3;
            item.magic.specialAbilities.push(new SpecialAbility('special ability 1'));
            item.magic.specialAbilities.push(new SpecialAbility('special ability 2'));
            item.magic.charges = 4;
            item.magic.curse = 'curse';
            item.magic.intelligence.ego = 5;
            item.magic.intelligence.intelligenceStat = 6;
            item.magic.intelligence.wisdomStat = 7;
            item.magic.intelligence.charismaStat = 8;
            item.magic.intelligence.alignment = 'alignment';
            item.magic.intelligence.communication.push('empathy');
            item.magic.intelligence.communication.push('telepathy');
            item.magic.intelligence.languages.push('English');
            item.magic.intelligence.languages.push('German');
            item.magic.intelligence.senses = 'senses';
            item.magic.intelligence.powers.push('first power');
            item.magic.intelligence.powers.push('second power');
            item.magic.intelligence.specialPurpose = 'special purpose';
            item.magic.intelligence.dedicatedPower = 'dedicated power';
            item.magic.intelligence.personality = 'personality';
    
            var formattedItem = treasureFormatterService.formatItem(item, '\t');
            var lines = formattedItem.split('\r\n');
    
            expect(lines[0]).toBe('\titem name (x2)');
            expect(lines[1]).toBe('\t\tContents:');
            expect(lines[2]).toBe('\t\t\tfirst contents');
            expect(lines[3]).toBe('\t\t\tsecond contents');
            expect(lines[4]).toBe('\t\tTraits:');
            expect(lines[5]).toBe('\t\t\tfirst trait');
            expect(lines[6]).toBe('\t\t\tsecond trait');
            expect(lines[7]).toBe('\t\tBonus: +3');
            expect(lines[8]).toBe('\t\tSpecial Abilities:');
            expect(lines[9]).toBe('\t\t\tspecial ability 1');
            expect(lines[10]).toBe('\t\t\tspecial ability 2');
            expect(lines[11]).toBe('\t\tCharges: 4');
            expect(lines[12]).toBe('\t\tCurse: curse');
            expect(lines[13]).toBe('\t\tIntelligent:');
            expect(lines[14]).toBe('\t\t\tEgo: 5');
            expect(lines[15]).toBe('\t\t\tIntelligence: 6');
            expect(lines[16]).toBe('\t\t\tWisdom: 7');
            expect(lines[17]).toBe('\t\t\tCharisma: 8');
            expect(lines[18]).toBe('\t\t\tAlignment: alignment');
            expect(lines[19]).toBe('\t\t\tCommunication:');
            expect(lines[20]).toBe('\t\t\t\tempathy');
            expect(lines[21]).toBe('\t\t\t\ttelepathy');
            expect(lines[22]).toBe('\t\t\t\tLanguages:');
            expect(lines[23]).toBe('\t\t\t\t\tEnglish');
            expect(lines[24]).toBe('\t\t\t\t\tGerman');
            expect(lines[25]).toBe('\t\t\tSenses: senses');
            expect(lines[26]).toBe('\t\t\tPowers:');
            expect(lines[27]).toBe('\t\t\t\tfirst power');
            expect(lines[28]).toBe('\t\t\t\tsecond power');
            expect(lines[29]).toBe('\t\t\tSpecial Purpose: special purpose');
            expect(lines[30]).toBe('\t\t\tDedicated Power: dedicated power');
            expect(lines[31]).toBe('\t\t\tPersonality: personality');
            expect(lines[32]).toBe('');
            expect(lines.length).toBe(33);
        });
    });
});