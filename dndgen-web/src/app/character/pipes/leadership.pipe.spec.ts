import { Ability } from "../models/ability.model";
import { Armor } from "../../treasure/models/armor.model";
import { Character } from "../models/character.model";
import { Feat } from "../models/feat.model";
import { Item } from "../../treasure/models/item.model";
import { Leadership } from "../models/leadership.model";
import { Skill } from "../models/skill.model";
import { Weapon } from "../../treasure/models/weapon.model";
import { CharacterPipe } from "./character.pipe";
import { Good } from "../../treasure/models/good.model";
import { Treasure } from "../../treasure/models/treasure.model";
import { LeadershipPipe } from "./leadership.pipe";

describe('Leadership Pipe', () => {
    describe('unit', () => {
        let pipe: LeadershipPipe;
        let characterPipeSpy: jasmine.SpyObj<CharacterPipe>;

        let leadership: Leadership | null;
        let cohort: Character | null;
        let followers: Character[];
        let characterCount: number;
    
        beforeEach(() => {
            characterPipeSpy = jasmine.createSpyObj('CharacterPipe', ['transform']);

            characterCount = 0;
            leadership = null;
            cohort = null;
            followers = [];

            pipe = new LeadershipPipe(characterPipeSpy);

            characterPipeSpy.transform.and.callFake((character, prefix) => {
                if (!prefix)
                    prefix = '';

                let formattedCharacter = prefix + 'formatted character:\r\n';
                formattedCharacter += prefix + `\tsummary: ${character.summary}\r\n`;

                return formattedCharacter;
            });
        });

        function createCharacter(): Character {
            characterCount++;
    
            var newCharacter = new Character(`character summary ${characterCount}`);
            newCharacter.alignment.full = 'alignment ' + characterCount;
            newCharacter.class.name = 'class name ' + characterCount;
            newCharacter.class.level = 9266 + characterCount;
            newCharacter.class.summary = "class summary " + characterCount;
            newCharacter.race.baseRace = 'base race ' + characterCount;
            newCharacter.race.landSpeed.value = 30 + characterCount;
            newCharacter.race.landSpeed.description = 'fast ' + characterCount;
            newCharacter.race.landSpeed.unit = 'feet per round';
            newCharacter.race.size = 'size ' + characterCount;
            newCharacter.race.age.value = 18 + characterCount;
            newCharacter.race.age.unit = 'Years';
            newCharacter.race.age.description = 'adult ' + characterCount;
            newCharacter.race.maximumAge.value = 1800 + characterCount;
            newCharacter.race.maximumAge.unit = 'Years';
            newCharacter.race.maximumAge.description = 'natural causes ' + characterCount;
            newCharacter.race.height.value = 48 + characterCount;
            newCharacter.race.height.unit = 'inches';
            newCharacter.race.height.description = 'tall ' + characterCount;
            newCharacter.race.weight.value = 100 + characterCount;
            newCharacter.race.weight.unit = 'Pounds';
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
            return new Skill(name, focus, totalBonus, circumstantialBonus, effectiveRanks, baseAbility, bonus, acPenalty, classSkill);
        }
    
        function createFeat(name: string) {
            return new Feat(name);
        }
    
        function createItem(name: string): Item {
            const item = new Item(name, 'MyItemType');
            item.description = `${name} description`;
            return item;
        }
    
        function createWeapon(name: string): Weapon {
            const weapon = new Weapon(name, 'Weapon');
            weapon.description = `${name} description`;
            weapon.damageDescription = '9d2 damage';
    
            return weapon;
        }
    
        function createArmor(name: string): Armor {
            const armor = new Armor(name, 'Armor');
            armor.description = `${name} description`;
            armor.totalArmorBonus = 92;
    
            return armor;
        }
    
        function createTreasure(): Treasure {
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
        
        function expectLines(actual: string[], expected: string[]) {
            let badIndex = -1;
            for (var i = 0; i < actual.length && i < expected.length; i++) {
                if (actual[i] != expected[i]) {
                    badIndex = i;
                    break;
                }
            }

            if (badIndex >= 0) {
                expect(actual[badIndex].trim()).toBe(expected[badIndex].trim());
                expect(actual[badIndex].match(/\\t/g) || []).toEqual(expected[badIndex].match(/\\t/g) || []);
            } else {
                expect(actual.length).toBe(expected.length);
            }
        }

        it('formats missing leadership', () => {
            var formattedLeadership = pipe.transform(null, null, []);
            var lines = formattedLeadership.split('\r\n');

            var expected = [
                '',
            ];
    
            expectLines(lines, expected);
        });

        it('formats leadership', () => {
            leadership = new Leadership(9876, ['killed a man', 'with this thumb']);
    
            var formattedLeadership = pipe.transform(leadership, cohort, followers);
            var lines = formattedLeadership.split('\r\n');

            var expected = [
                'Leadership:',
                '\tScore: 9876',
                '\tLeadership Modifiers:',
                '\t\tkilled a man',
                '\t\twith this thumb',
                '',
                'Cohort: None',
                '',
                'Followers (x0): None',
                ''
            ];
    
            expectLines(lines, expected);
        });

        it('formats leadership with cohort', () => {
            leadership = new Leadership(9876, ['killed a man', 'with this thumb']);
            cohort = createCharacter();
    
            var formattedLeadership = pipe.transform(leadership, cohort, followers);
            var lines = formattedLeadership.split('\r\n');

            var expected = [
                'Leadership:',
                '\tScore: 9876',
                '\tLeadership Modifiers:',
                '\t\tkilled a man',
                '\t\twith this thumb',
                '',
                'Cohort:',
                '\tcharacter summary 2:',
                '\t\t' + 'Challenge Rating: 91',
                '\t\t' + 'Alignment: alignment 2',
                '\t\t' + 'class summary 2',
                '\t\t' + 'race summary 2',
                '\t\t\t' + 'Land Speed: 32 feet per round (fast 2)',
                '\t\t\t' + 'Size: size 2',
                '\t\t\t' + 'Age: 20 Years (adult 2)',
                '\t\t\t' + 'Maximum Age: 1802 Years (natural causes 2)',
                '\t\t\t' + 'Height: 4.17 feet filtered (tall 2)',
                '\t\t\t' + 'Weight: 102 Pounds (heavy 2)',
                '\t\t' + 'Abilities:',
                '\t\t\t' + 'Strength: 4 (-2)',
                '\t\t\t' + 'Constitution: 28 (15)',
                '\t\t\t' + 'Dexterity: 8 (0)',
                '\t\t\t' + 'Intelligence: 92 (47)',
                '\t\t\t' + 'Wisdom: 12 (2)',
                '\t\t\t' + 'Charisma: 11 (1)',
                '\t\t' + 'Languages:',
                '\t\t\t' + 'English 2',
                '\t\t\t' + 'German 2',
                '\t\t' + 'Skills:',
                '\t\t\t' + 'skill 3',
                '\t\t\t\t' + 'Total Bonus: 137',
                '\t\t\t\t' + 'Ranks: 6',
                '\t\t\t\t' + 'Ability Bonus: 15',
                '\t\t\t\t' + 'Other Bonus: 0',
                '\t\t\t\t' + 'Armor Check Penalty: -8',
                '\t\t\t\t' + 'Class Skill',
                '\t\t\t' + 'skill 4 (focus)',
                '\t\t\t\t' + 'Total Bonus: 248 *',
                '\t\t\t\t' + 'Ranks: 3.5',
                '\t\t\t\t' + 'Ability Bonus: 0',
                '\t\t\t\t' + 'Other Bonus: 5',
                '\t\t\t\t' + 'Armor Check Penalty: 0',
                '\t\tFeats:',
                '\t\t\t' + 'Racial:',
                '\t\t\t\t' + 'racial feat 3',
                '\t\t\t\t' + 'racial feat 4',
                '\t\t\t' + 'Class:',
                '\t\t\t\t' + 'class feat 3',
                '\t\t\t\t' + 'class feat 4',
                '\t\t\t' + 'Additional:',
                '\t\t\t\t' + 'additional feat 3',
                '\t\t\t\t' + 'additional feat 4',
                '\t\tInteresting Trait: None',
                '\t\tEquipment:',
                '\t\t\tPrimary Hand: None',
                '\t\t\tOff Hand: None',
                '\t\t\tArmor: None',
                '\t\t\tTreasure: None',
                '\t\tCombat:',
                '\t\t\tAdjusted Dexterity Bonus: 5',
                '\t\t\tArmor Class: 9',
                '\t\t\t\tFlat-Footed: 14',
                '\t\t\t\tTouch: 36',
                '\t\t\tBase Attack:',
                '\t\t\t\tMelee: +23/+18/+13/+8/+3',
                '\t\t\t\tRanged: +24/+19/+14/+9/+4',
                '\t\t\tHit Points: 3458',
                '\t\t\tInitiative Bonus: 4569',
                '\t\t\tSaving Throws:',
                '\t\t\t\tFortitude: 58',
                '\t\t\t\tReflex: 80',
                '\t\t\t\tWill: 69',
                '',
                'Followers (x0): None',
                '',
            ];
    
            expectLines(lines, expected);
        });

        it('formats leadership with followers', () => {
            leadership = new Leadership(9876, ['killed a man', 'with this thumb']);
            followers = [createCharacter(), createCharacter()];
    
            var formattedLeadership = pipe.transform(leadership, cohort, followers);
            var lines = formattedLeadership.split('\r\n');

            var expected = [
                'Leadership:',
                '\tScore: 9876',
                '\tLeadership Modifiers:',
                '\t\tkilled a man',
                '\t\twith this thumb',
                '',
                'Cohort: None',
                '',
                'Followers (x2):',
                '',
                '\tcharacter summary 2:',
                '\t\t' + 'Challenge Rating: 91',
                '\t\t' + 'Alignment: alignment 2',
                '\t\t' + 'class summary 2',
                '\t\t' + 'race summary 2',
                '\t\t\t' + 'Land Speed: 32 feet per round (fast 2)',
                '\t\t\t' + 'Size: size 2',
                '\t\t\t' + 'Age: 20 Years (adult 2)',
                '\t\t\t' + 'Maximum Age: 1802 Years (natural causes 2)',
                '\t\t\t' + 'Height: 4.17 feet filtered (tall 2)',
                '\t\t\t' + 'Weight: 102 Pounds (heavy 2)',
                '\t\t' + 'Abilities:',
                '\t\t\t' + 'Strength: 4 (-2)',
                '\t\t\t' + 'Constitution: 28 (15)',
                '\t\t\t' + 'Dexterity: 8 (0)',
                '\t\t\t' + 'Intelligence: 92 (47)',
                '\t\t\t' + 'Wisdom: 12 (2)',
                '\t\t\t' + 'Charisma: 11 (1)',
                '\t\t' + 'Languages:',
                '\t\t\t' + 'English 2',
                '\t\t\t' + 'German 2',
                '\t\t' + 'Skills:',
                '\t\t\t' + 'skill 3',
                '\t\t\t\t' + 'Total Bonus: 137',
                '\t\t\t\t' + 'Ranks: 6',
                '\t\t\t\t' + 'Ability Bonus: 15',
                '\t\t\t\t' + 'Other Bonus: 0',
                '\t\t\t\t' + 'Armor Check Penalty: -8',
                '\t\t\t\t' + 'Class Skill',
                '\t\t\t' + 'skill 4 (focus)',
                '\t\t\t\t' + 'Total Bonus: 248 *',
                '\t\t\t\t' + 'Ranks: 3.5',
                '\t\t\t\t' + 'Ability Bonus: 0',
                '\t\t\t\t' + 'Other Bonus: 5',
                '\t\t\t\t' + 'Armor Check Penalty: 0',
                '\t\tFeats:',
                '\t\t\t' + 'Racial:',
                '\t\t\t\t' + 'racial feat 3',
                '\t\t\t\t' + 'racial feat 4',
                '\t\t\t' + 'Class:',
                '\t\t\t\t' + 'class feat 3',
                '\t\t\t\t' + 'class feat 4',
                '\t\t\t' + 'Additional:',
                '\t\t\t\t' + 'additional feat 3',
                '\t\t\t\t' + 'additional feat 4',
                '\t\tInteresting Trait: None',
                '\t\tEquipment:',
                '\t\t\tPrimary Hand: None',
                '\t\t\tOff Hand: None',
                '\t\t\tArmor: None',
                '\t\t\tTreasure: None',
                '\t\tCombat:',
                '\t\t\tAdjusted Dexterity Bonus: 5',
                '\t\t\tArmor Class: 9',
                '\t\t\t\tFlat-Footed: 14',
                '\t\t\t\tTouch: 36',
                '\t\t\tBase Attack:',
                '\t\t\t\tMelee: +23/+18/+13/+8/+3',
                '\t\t\t\tRanged: +24/+19/+14/+9/+4',
                '\t\t\tHit Points: 3458',
                '\t\t\tInitiative Bonus: 4569',
                '\t\t\tSaving Throws:',
                '\t\t\t\tFortitude: 58',
                '\t\t\t\tReflex: 80',
                '\t\t\t\tWill: 69',
                '',
                '\t' + 'character summary 3:',
                '\t\t' + 'Challenge Rating: 92',
                '\t\t' + 'Alignment: alignment 3',
                '\t\t' + 'class summary 3',
                '\t\t' + 'race summary 3',
                '\t\t\t' + 'Land Speed: 33 feet per round (fast 3)',
                '\t\t\t' + 'Size: size 3',
                '\t\t\t' + 'Age: 21 Years (adult 3)',
                '\t\t\t' + 'Maximum Age: 1803 Years (natural causes 3)',
                '\t\t\t' + 'Height: 4.25 feet filtered (tall 3)',
                '\t\t\t' + 'Weight: 103 Pounds (heavy 3)',
                '\t\t' + 'Abilities:',
                '\t\t\t' + 'Strength: 5 (-1)',
                '\t\t\t' + 'Constitution: 29 (16)',
                '\t\t\t' + 'Dexterity: 9 (1)',
                '\t\t\t' + 'Intelligence: 93 (48)',
                '\t\t\t' + 'Wisdom: 13 (3)',
                '\t\t\t' + 'Charisma: 12 (2)',
                '\t\t' + 'Languages:',
                '\t\t\t' + 'English 3',
                '\t\t\t' + 'German 3',
                '\t\t' + 'Skills:',
                '\t\t\t' + 'skill 4',
                '\t\t\t\t' + 'Total Bonus: 138',
                '\t\t\t\t' + 'Ranks: 7',
                '\t\t\t\t' + 'Ability Bonus: 16',
                '\t\t\t\t' + 'Other Bonus: 0',
                '\t\t\t\t' + 'Armor Check Penalty: -9',
                '\t\t\t\t' + 'Class Skill',
                '\t\t\t' + 'skill 5 (focus)',
                '\t\t\t\t' + 'Total Bonus: 249 *',
                '\t\t\t\t' + 'Ranks: 4.5',
                '\t\t\t\t' + 'Ability Bonus: 1',
                '\t\t\t\t' + 'Other Bonus: 6',
                '\t\t\t\t' + 'Armor Check Penalty: 0',
                '\t\tFeats:',
                '\t\t\t' + 'Racial:',
                '\t\t\t\t' + 'racial feat 4',
                '\t\t\t\t' + 'racial feat 5',
                '\t\t\t' + 'Class:',
                '\t\t\t\t' + 'class feat 4',
                '\t\t\t\t' + 'class feat 5',
                '\t\t\t' + 'Additional:',
                '\t\t\t\t' + 'additional feat 4',
                '\t\t\t\t' + 'additional feat 5',
                '\t\tInteresting Trait: None',
                '\t\tEquipment:',
                '\t\t\tPrimary Hand: None',
                '\t\t\tOff Hand: None',
                '\t\t\tArmor: None',
                '\t\t\tTreasure: None',
                '\t\tCombat:',
                '\t\t\tAdjusted Dexterity Bonus: 6',
                '\t\t\tArmor Class: 10',
                '\t\t\t\tFlat-Footed: 15',
                '\t\t\t\tTouch: 37',
                '\t\t\tBase Attack:',
                '\t\t\t\tMelee: +24/+19/+14/+9/+4',
                '\t\t\t\tRanged: +25/+20/+15/+10/+5',
                '\t\t\tHit Points: 3459',
                '\t\t\tInitiative Bonus: 4570',
                '\t\t\tSaving Throws:',
                '\t\t\t\tFortitude: 59',
                '\t\t\t\tReflex: 81',
                '\t\t\t\tWill: 70',
                '',
            ];
    
            expectLines(lines, expected);
        });

        it('formats full leadership', () => {
            leadership = new Leadership(9876, ['killed a man', 'with this thumb']);
            cohort = createCharacter();
            followers = [createCharacter(), createCharacter()];
    
            var formattedLeadership = pipe.transform(leadership, cohort, followers);
            var lines = formattedLeadership.split('\r\n');

            var expected = [
                'Leadership:',
                '\tScore: 9876',
                '\tLeadership Modifiers:',
                '\t\tkilled a man',
                '\t\twith this thumb',
                '',
                'Cohort:',
                '\tcharacter summary 2:',
                '\t\t' + 'Challenge Rating: 91',
                '\t\t' + 'Alignment: alignment 2',
                '\t\t' + 'class summary 2',
                '\t\t' + 'race summary 2',
                '\t\t\t' + 'Land Speed: 32 feet per round (fast 2)',
                '\t\t\t' + 'Size: size 2',
                '\t\t\t' + 'Age: 20 Years (adult 2)',
                '\t\t\t' + 'Maximum Age: 1802 Years (natural causes 2)',
                '\t\t\t' + 'Height: 4.17 feet filtered (tall 2)',
                '\t\t\t' + 'Weight: 102 Pounds (heavy 2)',
                '\t\t' + 'Abilities:',
                '\t\t\t' + 'Strength: 4 (-2)',
                '\t\t\t' + 'Constitution: 28 (15)',
                '\t\t\t' + 'Dexterity: 8 (0)',
                '\t\t\t' + 'Intelligence: 92 (47)',
                '\t\t\t' + 'Wisdom: 12 (2)',
                '\t\t\t' + 'Charisma: 11 (1)',
                '\t\t' + 'Languages:',
                '\t\t\t' + 'English 2',
                '\t\t\t' + 'German 2',
                '\t\t' + 'Skills:',
                '\t\t\t' + 'skill 3',
                '\t\t\t\t' + 'Total Bonus: 137',
                '\t\t\t\t' + 'Ranks: 6',
                '\t\t\t\t' + 'Ability Bonus: 15',
                '\t\t\t\t' + 'Other Bonus: 0',
                '\t\t\t\t' + 'Armor Check Penalty: -8',
                '\t\t\t\t' + 'Class Skill',
                '\t\t\t' + 'skill 4 (focus)',
                '\t\t\t\t' + 'Total Bonus: 248 *',
                '\t\t\t\t' + 'Ranks: 3.5',
                '\t\t\t\t' + 'Ability Bonus: 0',
                '\t\t\t\t' + 'Other Bonus: 5',
                '\t\t\t\t' + 'Armor Check Penalty: 0',
                '\t\tFeats:',
                '\t\t\t' + 'Racial:',
                '\t\t\t\t' + 'racial feat 3',
                '\t\t\t\t' + 'racial feat 4',
                '\t\t\t' + 'Class:',
                '\t\t\t\t' + 'class feat 3',
                '\t\t\t\t' + 'class feat 4',
                '\t\t\t' + 'Additional:',
                '\t\t\t\t' + 'additional feat 3',
                '\t\t\t\t' + 'additional feat 4',
                '\t\tInteresting Trait: None',
                '\t\tEquipment:',
                '\t\t\tPrimary Hand: None',
                '\t\t\tOff Hand: None',
                '\t\t\tArmor: None',
                '\t\t\tTreasure: None',
                '\t\tCombat:',
                '\t\t\tAdjusted Dexterity Bonus: 5',
                '\t\t\tArmor Class: 9',
                '\t\t\t\tFlat-Footed: 14',
                '\t\t\t\tTouch: 36',
                '\t\t\tBase Attack:',
                '\t\t\t\tMelee: +23/+18/+13/+8/+3',
                '\t\t\t\tRanged: +24/+19/+14/+9/+4',
                '\t\t\tHit Points: 3458',
                '\t\t\tInitiative Bonus: 4569',
                '\t\t\tSaving Throws:',
                '\t\t\t\tFortitude: 58',
                '\t\t\t\tReflex: 80',
                '\t\t\t\tWill: 69',
                '',
                'Followers (x2):',
                '',
                '\t' + 'character summary 3:',
                '\t\t' + 'Challenge Rating: 92',
                '\t\t' + 'Alignment: alignment 3',
                '\t\t' + 'class summary 3',
                '\t\t' + 'race summary 3',
                '\t\t\t' + 'Land Speed: 33 feet per round (fast 3)',
                '\t\t\t' + 'Size: size 3',
                '\t\t\t' + 'Age: 21 Years (adult 3)',
                '\t\t\t' + 'Maximum Age: 1803 Years (natural causes 3)',
                '\t\t\t' + 'Height: 4.25 feet filtered (tall 3)',
                '\t\t\t' + 'Weight: 103 Pounds (heavy 3)',
                '\t\t' + 'Abilities:',
                '\t\t\t' + 'Strength: 5 (-1)',
                '\t\t\t' + 'Constitution: 29 (16)',
                '\t\t\t' + 'Dexterity: 9 (1)',
                '\t\t\t' + 'Intelligence: 93 (48)',
                '\t\t\t' + 'Wisdom: 13 (3)',
                '\t\t\t' + 'Charisma: 12 (2)',
                '\t\t' + 'Languages:',
                '\t\t\t' + 'English 3',
                '\t\t\t' + 'German 3',
                '\t\t' + 'Skills:',
                '\t\t\t' + 'skill 4',
                '\t\t\t\t' + 'Total Bonus: 138',
                '\t\t\t\t' + 'Ranks: 7',
                '\t\t\t\t' + 'Ability Bonus: 16',
                '\t\t\t\t' + 'Other Bonus: 0',
                '\t\t\t\t' + 'Armor Check Penalty: -9',
                '\t\t\t\t' + 'Class Skill',
                '\t\t\t' + 'skill 5 (focus)',
                '\t\t\t\t' + 'Total Bonus: 249 *',
                '\t\t\t\t' + 'Ranks: 4.5',
                '\t\t\t\t' + 'Ability Bonus: 1',
                '\t\t\t\t' + 'Other Bonus: 6',
                '\t\t\t\t' + 'Armor Check Penalty: 0',
                '\t\tFeats:',
                '\t\t\t' + 'Racial:',
                '\t\t\t\t' + 'racial feat 4',
                '\t\t\t\t' + 'racial feat 5',
                '\t\t\t' + 'Class:',
                '\t\t\t\t' + 'class feat 4',
                '\t\t\t\t' + 'class feat 5',
                '\t\t\t' + 'Additional:',
                '\t\t\t\t' + 'additional feat 4',
                '\t\t\t\t' + 'additional feat 5',
                '\t\tInteresting Trait: None',
                '\t\tEquipment:',
                '\t\t\tPrimary Hand: None',
                '\t\t\tOff Hand: None',
                '\t\t\tArmor: None',
                '\t\t\tTreasure: None',
                '\t\tCombat:',
                '\t\t\tAdjusted Dexterity Bonus: 6',
                '\t\t\tArmor Class: 10',
                '\t\t\t\tFlat-Footed: 15',
                '\t\t\t\tTouch: 37',
                '\t\t\tBase Attack:',
                '\t\t\t\tMelee: +24/+19/+14/+9/+4',
                '\t\t\t\tRanged: +25/+20/+15/+10/+5',
                '\t\t\tHit Points: 3459',
                '\t\t\tInitiative Bonus: 4570',
                '\t\t\tSaving Throws:',
                '\t\t\t\tFortitude: 59',
                '\t\t\t\tReflex: 81',
                '\t\t\t\tWill: 70',
                '',
                '\t' + 'character summary 4:',
                '\t\t' + 'Challenge Rating: 93',
                '\t\tAlignment: alignment 4',
                '\t\t' + 'class summary 4',
                '\t\t' + 'race summary 4',
                '\t\t\t' + 'Land Speed: 34 feet per round (fast 4)',
                '\t\t\t' + 'Size: size 4',
                '\t\t\t' + 'Age: 22 Years (adult 4)',
                '\t\t\t' + 'Maximum Age: 1804 Years (natural causes 4)',
                '\t\t\t' + 'Height: 4.33 feet filtered (tall 4)',
                '\t\t\t' + 'Weight: 104 Pounds (heavy 4)',
                '\t\t' + 'Abilities:',
                '\t\t\t' + 'Strength: 6 (0)',
                '\t\t\t' + 'Constitution: 30 (17)',
                '\t\t\t' + 'Dexterity: 10 (2)',
                '\t\t\t' + 'Intelligence: 94 (49)',
                '\t\t\t' + 'Wisdom: 14 (4)',
                '\t\t\t' + 'Charisma: 13 (3)',
                '\t\tLanguages:',
                '\t\t\tEnglish 4',
                '\t\t\tGerman 4',
                '\t\t' + 'Skills:',
                '\t\t\t' + 'skill 5',
                '\t\t\t\t' + 'Total Bonus: 139',
                '\t\t\t\t' + 'Ranks: 8',
                '\t\t\t\t' + 'Ability Bonus: 17',
                '\t\t\t\t' + 'Other Bonus: 0',
                '\t\t\t\t' + 'Armor Check Penalty: -10',
                '\t\t\t\t' + 'Class Skill',
                '\t\t\t' + 'skill 6 (focus)',
                '\t\t\t\t' + 'Total Bonus: 250 *',
                '\t\t\t\t' + 'Ranks: 5.5',
                '\t\t\t\t' + 'Ability Bonus: 2',
                '\t\t\t\t' + 'Other Bonus: 7',
                '\t\t\t\t' + 'Armor Check Penalty: 0',
                '\t\tFeats:',
                '\t\t\t' + 'Racial:',
                '\t\t\t\t' + 'racial feat 5',
                '\t\t\t\t' + 'racial feat 6',
                '\t\t\t' + 'Class:',
                '\t\t\t\t' + 'class feat 5',
                '\t\t\t\t' + 'class feat 6',
                '\t\t\t' + 'Additional:',
                '\t\t\t\t' + 'additional feat 5',
                '\t\t\t\t' + 'additional feat 6',
                '\t\tInteresting Trait: None',
                '\t\tEquipment:',
                '\t\t\tPrimary Hand: None',
                '\t\t\tOff Hand: None',
                '\t\t\tArmor: None',
                '\t\t\tTreasure: None',
                '\t\tCombat:',
                '\t\t\tAdjusted Dexterity Bonus: 7',
                '\t\t\tArmor Class: 11',
                '\t\t\t\tFlat-Footed: 16',
                '\t\t\t\tTouch: 38',
                '\t\t\tBase Attack:',
                '\t\t\t\tMelee: +25/+20/+15/+10/+5',
                '\t\t\t\tRanged: +26/+21/+16/+11/+6',
                '\t\t\tHit Points: 3460',
                '\t\t\tInitiative Bonus: 4571',
                '\t\t\tSaving Throws:',
                '\t\t\t\tFortitude: 60',
                '\t\t\t\tReflex: 82',
                '\t\t\t\tWill: 71',
                '',
            ];
    
            expectLines(lines, expected);
        });

        it('formats full leadership with prefix', () => {
            leadership = new Leadership(9876, ['killed a man', 'with this thumb']);
            cohort = createCharacter();
            followers = [createCharacter(), createCharacter()];
    
            var formattedLeadership = pipe.transform(leadership, cohort, followers, '\t');
            var lines = formattedLeadership.split('\r\n');

            var expected = [
                '\tLeadership:',
                '\t\tScore: 9876',
                '\t\tLeadership Modifiers:',
                '\t\t\tkilled a man',
                '\t\t\twith this thumb',
                '',
                '\tCohort:',
                '\t\tcharacter summary 2:',
                '\t\t\t' + 'Challenge Rating: 91',
                '\t\t\t' + 'Alignment: alignment 2',
                '\t\t\t' + 'class summary 2',
                '\t\t\t' + 'race summary 2',
                '\t\t\t\t' + 'Land Speed: 32 feet per round (fast 2)',
                '\t\t\t\t' + 'Size: size 2',
                '\t\t\t\t' + 'Age: 20 Years (adult 2)',
                '\t\t\t\t' + 'Maximum Age: 1802 Years (natural causes 2)',
                '\t\t\t\t' + 'Height: 4.17 feet filtered (tall 2)',
                '\t\t\t\t' + 'Weight: 102 Pounds (heavy 2)',
                '\t\t\t' + 'Abilities:',
                '\t\t\t\t' + 'Strength: 4 (-2)',
                '\t\t\t\t' + 'Constitution: 28 (15)',
                '\t\t\t\t' + 'Dexterity: 8 (0)',
                '\t\t\t\t' + 'Intelligence: 92 (47)',
                '\t\t\t\t' + 'Wisdom: 12 (2)',
                '\t\t\t\t' + 'Charisma: 11 (1)',
                '\t\t\t' + 'Languages:',
                '\t\t\t\t' + 'English 2',
                '\t\t\t\t' + 'German 2',
                '\t\t\t' + 'Skills:',
                '\t\t\t\t' + 'skill 3',
                '\t\t\t\t\t' + 'Total Bonus: 137',
                '\t\t\t\t\t' + 'Ranks: 6',
                '\t\t\t\t\t' + 'Ability Bonus: 15',
                '\t\t\t\t\t' + 'Other Bonus: 0',
                '\t\t\t\t\t' + 'Armor Check Penalty: -8',
                '\t\t\t\t\t' + 'Class Skill',
                '\t\t\t\t' + 'skill 4 (focus)',
                '\t\t\t\t\t' + 'Total Bonus: 248 *',
                '\t\t\t\t\t' + 'Ranks: 3.5',
                '\t\t\t\t\t' + 'Ability Bonus: 0',
                '\t\t\t\t\t' + 'Other Bonus: 5',
                '\t\t\t\t\t' + 'Armor Check Penalty: 0',
                '\t\t\tFeats:',
                '\t\t\t\t' + 'Racial:',
                '\t\t\t\t\t' + 'racial feat 3',
                '\t\t\t\t\t' + 'racial feat 4',
                '\t\t\t\t' + 'Class:',
                '\t\t\t\t\t' + 'class feat 3',
                '\t\t\t\t\t' + 'class feat 4',
                '\t\t\t\t' + 'Additional:',
                '\t\t\t\t\t' + 'additional feat 3',
                '\t\t\t\t\t' + 'additional feat 4',
                '\t\t\tInteresting Trait: None',
                '\t\t\tEquipment:',
                '\t\t\t\tPrimary Hand: None',
                '\t\t\t\tOff Hand: None',
                '\t\t\t\tArmor: None',
                '\t\t\t\tTreasure: None',
                '\t\t\tCombat:',
                '\t\t\t\tAdjusted Dexterity Bonus: 5',
                '\t\t\t\tArmor Class: 9',
                '\t\t\t\t\tFlat-Footed: 14',
                '\t\t\t\t\tTouch: 36',
                '\t\t\t\tBase Attack:',
                '\t\t\t\t\tMelee: +23/+18/+13/+8/+3',
                '\t\t\t\t\tRanged: +24/+19/+14/+9/+4',
                '\t\t\t\tHit Points: 3458',
                '\t\t\t\tInitiative Bonus: 4569',
                '\t\t\t\tSaving Throws:',
                '\t\t\t\t\tFortitude: 58',
                '\t\t\t\t\tReflex: 80',
                '\t\t\t\t\tWill: 69',
                '',
                '\tFollowers (x2):',
                '',
                '\t\t' + 'character summary 3:',
                '\t\t\t' + 'Challenge Rating: 92',
                '\t\t\t' + 'Alignment: alignment 3',
                '\t\t\t' + 'class summary 3',
                '\t\t\t' + 'race summary 3',
                '\t\t\t\t' + 'Land Speed: 33 feet per round (fast 3)',
                '\t\t\t\t' + 'Size: size 3',
                '\t\t\t\t' + 'Age: 21 Years (adult 3)',
                '\t\t\t\t' + 'Maximum Age: 1803 Years (natural causes 3)',
                '\t\t\t\t' + 'Height: 4.25 feet filtered (tall 3)',
                '\t\t\t\t' + 'Weight: 103 Pounds (heavy 3)',
                '\t\t\t' + 'Abilities:',
                '\t\t\t\t' + 'Strength: 5 (-1)',
                '\t\t\t\t' + 'Constitution: 29 (16)',
                '\t\t\t\t' + 'Dexterity: 9 (1)',
                '\t\t\t\t' + 'Intelligence: 93 (48)',
                '\t\t\t\t' + 'Wisdom: 13 (3)',
                '\t\t\t\t' + 'Charisma: 12 (2)',
                '\t\t\t' + 'Languages:',
                '\t\t\t\t' + 'English 3',
                '\t\t\t\t' + 'German 3',
                '\t\t\t' + 'Skills:',
                '\t\t\t\t' + 'skill 4',
                '\t\t\t\t\t' + 'Total Bonus: 138',
                '\t\t\t\t\t' + 'Ranks: 7',
                '\t\t\t\t\t' + 'Ability Bonus: 16',
                '\t\t\t\t\t' + 'Other Bonus: 0',
                '\t\t\t\t\t' + 'Armor Check Penalty: -9',
                '\t\t\t\t\t' + 'Class Skill',
                '\t\t\t\t' + 'skill 5 (focus)',
                '\t\t\t\t\t' + 'Total Bonus: 249 *',
                '\t\t\t\t\t' + 'Ranks: 4.5',
                '\t\t\t\t\t' + 'Ability Bonus: 1',
                '\t\t\t\t\t' + 'Other Bonus: 6',
                '\t\t\t\t\t' + 'Armor Check Penalty: 0',
                '\t\t\tFeats:',
                '\t\t\t\t' + 'Racial:',
                '\t\t\t\t\t' + 'racial feat 4',
                '\t\t\t\t\t' + 'racial feat 5',
                '\t\t\t\t' + 'Class:',
                '\t\t\t\t\t' + 'class feat 4',
                '\t\t\t\t\t' + 'class feat 5',
                '\t\t\t\t' + 'Additional:',
                '\t\t\t\t\t' + 'additional feat 4',
                '\t\t\t\t\t' + 'additional feat 5',
                '\t\t\tInteresting Trait: None',
                '\t\t\tEquipment:',
                '\t\t\t\tPrimary Hand: None',
                '\t\t\t\tOff Hand: None',
                '\t\t\t\tArmor: None',
                '\t\t\t\tTreasure: None',
                '\t\t\tCombat:',
                '\t\t\t\tAdjusted Dexterity Bonus: 6',
                '\t\t\t\tArmor Class: 10',
                '\t\t\t\t\tFlat-Footed: 15',
                '\t\t\t\t\tTouch: 37',
                '\t\t\t\tBase Attack:',
                '\t\t\t\t\tMelee: +24/+19/+14/+9/+4',
                '\t\t\t\t\tRanged: +25/+20/+15/+10/+5',
                '\t\t\t\tHit Points: 3459',
                '\t\t\t\tInitiative Bonus: 4570',
                '\t\t\t\tSaving Throws:',
                '\t\t\t\t\tFortitude: 59',
                '\t\t\t\t\tReflex: 81',
                '\t\t\t\t\tWill: 70',
                '',
                '\t\t' + 'character summary 4:',
                '\t\t\t' + 'Challenge Rating: 93',
                '\t\t\tAlignment: alignment 4',
                '\t\t\t' + 'class summary 4',
                '\t\t\t' + 'race summary 4',
                '\t\t\t\t' + 'Land Speed: 34 feet per round (fast 4)',
                '\t\t\t\t' + 'Size: size 4',
                '\t\t\t\t' + 'Age: 22 Years (adult 4)',
                '\t\t\t\t' + 'Maximum Age: 1804 Years (natural causes 4)',
                '\t\t\t\t' + 'Height: 4.33 feet filtered (tall 4)',
                '\t\t\t\t' + 'Weight: 104 Pounds (heavy 4)',
                '\t\t\t' + 'Abilities:',
                '\t\t\t\t' + 'Strength: 6 (0)',
                '\t\t\t\t' + 'Constitution: 30 (17)',
                '\t\t\t\t' + 'Dexterity: 10 (2)',
                '\t\t\t\t' + 'Intelligence: 94 (49)',
                '\t\t\t\t' + 'Wisdom: 14 (4)',
                '\t\t\t\t' + 'Charisma: 13 (3)',
                '\t\t\tLanguages:',
                '\t\t\t\tEnglish 4',
                '\t\t\t\tGerman 4',
                '\t\t\t' + 'Skills:',
                '\t\t\t\t' + 'skill 5',
                '\t\t\t\t\t' + 'Total Bonus: 139',
                '\t\t\t\t\t' + 'Ranks: 8',
                '\t\t\t\t\t' + 'Ability Bonus: 17',
                '\t\t\t\t\t' + 'Other Bonus: 0',
                '\t\t\t\t\t' + 'Armor Check Penalty: -10',
                '\t\t\t\t\t' + 'Class Skill',
                '\t\t\t\t' + 'skill 6 (focus)',
                '\t\t\t\t\t' + 'Total Bonus: 250 *',
                '\t\t\t\t\t' + 'Ranks: 5.5',
                '\t\t\t\t\t' + 'Ability Bonus: 2',
                '\t\t\t\t\t' + 'Other Bonus: 7',
                '\t\t\t\t\t' + 'Armor Check Penalty: 0',
                '\t\t\tFeats:',
                '\t\t\t\t' + 'Racial:',
                '\t\t\t\t\t' + 'racial feat 5',
                '\t\t\t\t\t' + 'racial feat 6',
                '\t\t\t\t' + 'Class:',
                '\t\t\t\t\t' + 'class feat 5',
                '\t\t\t\t\t' + 'class feat 6',
                '\t\t\t\t' + 'Additional:',
                '\t\t\t\t\t' + 'additional feat 5',
                '\t\t\t\t\t' + 'additional feat 6',
                '\t\t\tInteresting Trait: None',
                '\t\t\tEquipment:',
                '\t\t\t\tPrimary Hand: None',
                '\t\t\t\tOff Hand: None',
                '\t\t\t\tArmor: None',
                '\t\t\t\tTreasure: None',
                '\t\t\tCombat:',
                '\t\t\t\tAdjusted Dexterity Bonus: 7',
                '\t\t\t\tArmor Class: 11',
                '\t\t\t\t\tFlat-Footed: 16',
                '\t\t\t\t\tTouch: 38',
                '\t\t\t\tBase Attack:',
                '\t\t\t\t\tMelee: +25/+20/+15/+10/+5',
                '\t\t\t\t\tRanged: +26/+21/+16/+11/+6',
                '\t\t\t\tHit Points: 3460',
                '\t\t\t\tInitiative Bonus: 4571',
                '\t\t\t\tSaving Throws:',
                '\t\t\t\t\tFortitude: 60',
                '\t\t\t\t\tReflex: 82',
                '\t\t\t\t\tWill: 71',
                '',
            ];
    
            expectLines(lines, expected);
        });
    });
});