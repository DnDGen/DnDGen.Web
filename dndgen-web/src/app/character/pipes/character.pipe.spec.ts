import { InchesToFeetPipe } from "../../shared/pipes/inchesToFeet.pipe";
import { ItemPipe } from "../../treasure/pipes/item.pipe";
import { TreasurePipe } from "../../treasure/pipes/treasure.pipe";
import { Ability } from "../models/ability.model";
import { Armor } from "../../treasure/models/armor.model";
import { Character } from "../models/character.model";
import { Feat } from "../models/feat.model";
import { Item } from "../../treasure/models/item.model";
import { Skill } from "../models/skill.model";
import { Spell } from "../models/spell.model";
import { SpellQuantity } from "../models/spellQuantity.model";
import { Weapon } from "../../treasure/models/weapon.model";
import { CharacterPipe } from "./character.pipe";
import { Good } from "../../treasure/models/good.model";
import { SpellGroupService } from "../services/spellGroup.service";
import { SpellGroup } from "../models/spellGroup.model";
import { Treasure } from "../../treasure/models/treasure.model";
import { BonusPipe } from "../../shared/pipes/bonus.pipe";
import { BonusesPipe } from "../../shared/pipes/bonuses.pipe";
import { MeasurementPipe } from "../../shared/pipes/measurement.pipe";
import { Measurement } from "../models/measurement.model";

describe('Character Pipe', () => {
    describe('unit', () => {
        let pipe: CharacterPipe;
        let itemPipeSpy: jasmine.SpyObj<ItemPipe>;
        let treasurePipeSpy: jasmine.SpyObj<TreasurePipe>;
        let bonusPipeSpy: jasmine.SpyObj<BonusPipe>;
        let bonusesPipeSpy: jasmine.SpyObj<BonusesPipe>;
        let measurementPipeSpy: jasmine.SpyObj<MeasurementPipe>;
        let spellGroupServiceSpy: jasmine.SpyObj<SpellGroupService>;

        let character: Character;
    
        beforeEach(() => {
            itemPipeSpy = jasmine.createSpyObj('ItemPipe', ['transform']);
            treasurePipeSpy = jasmine.createSpyObj('TreasurePipe', ['transform']);
            bonusPipeSpy = jasmine.createSpyObj('BonusPipe', ['transform']);
            bonusesPipeSpy = jasmine.createSpyObj('BonusesPipe', ['transform']);
            measurementPipeSpy = jasmine.createSpyObj('MeasurementPipe', ['transform']);
            spellGroupServiceSpy = jasmine.createSpyObj('SpellGroupService', ['sortIntoGroups', 'getSpellGroupName']);
            character = createCharacter();

            pipe = new CharacterPipe(itemPipeSpy, treasurePipeSpy, bonusPipeSpy, bonusesPipeSpy, measurementPipeSpy, spellGroupServiceSpy);

            itemPipeSpy.transform.and.callFake(formatItem);
            treasurePipeSpy.transform.and.callFake((treasure, prefix) => {
                if (!prefix)
                    prefix = '';

                var formattedTreasure = prefix + 'formatted treasure:\r\n';
                formattedTreasure += prefix + `\tcoins: ${treasure.coin.quantity}\r\n`;
                formattedTreasure += prefix + `\tgoods: ${treasure.goods.length}\r\n`;
                formattedTreasure += prefix + `\titems: ${treasure.items.length}\r\n`;

                return formattedTreasure;
            });
            bonusPipeSpy.transform.and.callFake((input: number) => {
                return `${input} formatted`;
            });
            bonusesPipeSpy.transform.and.callFake((input: number[]) => {
                return `${input[0]} formatted x${input.length}`;
            });
            measurementPipeSpy.transform.and.callFake((input: Measurement) => {
                return `${input.value} ${input.unit} formatted`;
            });
            spellGroupServiceSpy.getSpellGroupName.and.callFake((level, source) => {
                return `${source} lvl ${level}`;
            });
            spellGroupServiceSpy.sortIntoGroups.and.callFake((spells) => {
                if (!spells || spells.length == 0)
                    return [];

                if (spells.length == 1) {
                    return [
                        new SpellGroup('first spell group', spells),
                    ];
                }

                return [
                    new SpellGroup('first spell group', spells.slice(0, 1)),
                    new SpellGroup('other spell group', spells.slice(1)),
                ];
            });
        });
    
        function formatItem(item: Item, prefix: string): string {
            if (!prefix)
                prefix = '';

            var formattedItem = prefix + item.description + '\r\n';
            formattedItem += prefix + '\tformatted\r\n';

            return formattedItem;
        }

        function createCharacter(): Character {
            var newCharacter = new Character(`character summary`);
            newCharacter.alignment.full = 'alignment';
            newCharacter.class.name = 'class name';
            newCharacter.class.level = 9266;
            newCharacter.class.summary = "class summary ";
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
    
            expect(newCharacter.abilities.Charisma).not.toBeNull();
            expect(newCharacter.abilities.Constitution).not.toBeNull();
            expect(newCharacter.abilities.Dexterity).not.toBeNull();
            expect(newCharacter.abilities.Intelligence).not.toBeNull();
            expect(newCharacter.abilities.Strength).not.toBeNull();
            expect(newCharacter.abilities.Wisdom).not.toBeNull();
    
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
    
            newCharacter.combat.baseAttack.allMeleeBonuses.length = 0;
            newCharacter.combat.baseAttack.allMeleeBonuses.push(21);
            newCharacter.combat.baseAttack.allMeleeBonuses.push(16);
            newCharacter.combat.baseAttack.allMeleeBonuses.push(11);
            newCharacter.combat.baseAttack.allMeleeBonuses.push(6);
            newCharacter.combat.baseAttack.allMeleeBonuses.push(1);
    
            newCharacter.combat.baseAttack.allRangedBonuses.length = 0;
            newCharacter.combat.baseAttack.allRangedBonuses.push(22);
            newCharacter.combat.baseAttack.allRangedBonuses.push(17);
            newCharacter.combat.baseAttack.allRangedBonuses.push(12);
            newCharacter.combat.baseAttack.allRangedBonuses.push(7);
            newCharacter.combat.baseAttack.allRangedBonuses.push(2);
    
            newCharacter.combat.hitPoints = 3456;
            newCharacter.combat.initiativeBonus = 4567;
            newCharacter.combat.savingThrows.fortitude = 56;
            newCharacter.combat.savingThrows.reflex = 78;
            newCharacter.combat.savingThrows.will = 67;
            newCharacter.combat.savingThrows.hasFortitudeSave = true;
    
            newCharacter.challengeRating = 89;
    
            return newCharacter;
        }
    
        function createAbility(name: string, value: number, bonus: number) {
            return new Ability(name, value, bonus);
        }
    
        function createSkill(
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

        it('formats character basics', () => {
            var formattedCharacter = pipe.transform(character);
            var lines = formattedCharacter.split('\r\n');
    
            var expected = [
                'character summary 1:',
                '\tChallenge Rating: 90',
                '\tAlignment: alignment 1',
                '\tclass summary 1',
                '\trace summary 1',
                '\t\tLand Speed: 31 feet per round (fast 1)',
                '\t\tSize: size 1',
                '\t\tAge: 19 Years (adult 1)',
                '\t\tMaximum Age: 1801 Years (natural causes 1)',
                '\t\tHeight: 4.08 feet filtered (tall 1)',
                '\t\tWeight: 101 Pounds (heavy 1)',
                '\tAbilities:',
                '\t\tStrength: 3 (-3)',
                '\t\tConstitution: 27 (14)',
                '\t\tDexterity: 7 (-1)',
                '\t\tIntelligence: 91 (46)',
                '\t\tWisdom: 11 (1)',
                '\t\tCharisma: 10 (0)',
                '\tLanguages:',
                '\t\tEnglish 1',
                '\t\tGerman 1',
                '\tSkills:',
                '\t\tskill 2',
                '\t\t\tTotal Bonus: 136',
                '\t\t\tRanks: 5',
                '\t\t\tAbility Bonus: 14',
                '\t\t\tOther Bonus: 0',
                '\t\t\tArmor Check Penalty: -7',
                '\t\t\tClass Skill',
                '\t\tskill 3 (focus)',
                '\t\t\t' + 'Total Bonus: 247 *',
                '\t\t\t' + 'Ranks: 2.5',
                '\t\t\t' + 'Ability Bonus: -1',
                '\t\t\t' + 'Other Bonus: 4',
                '\t\t\t' + 'Armor Check Penalty: 0',
                '\tFeats:',
                '\t\tRacial:',
                '\t\t\tracial feat 2',
                '\t\t\tracial feat 3',
                '\t\tClass:',
                '\t\t\tclass feat 2',
                '\t\t\tclass feat 3',
                '\t\tAdditional:',
                '\t\t\tadditional feat 2',
                '\t\t\tadditional feat 3',
                '\tInteresting Trait: None',
                '\tEquipment:',
                '\t\tPrimary Hand: None',
                '\t\tOff Hand: None',
                '\t\tArmor: None',
                '\t\tTreasure: None',
                '\tCombat:',
                '\t\tAdjusted Dexterity Bonus: 4',
                '\t\tArmor Class: 8',
                '\t\t\tFlat-Footed: 13',
                '\t\t\tTouch: 35',
                '\t\tBase Attack:',
                '\t\t\tMelee: +22/+17/+12/+7/+2',
                '\t\t\tRanged: +23/+18/+13/+8/+3',
                '\t\tHit Points: 3457',
                '\t\tInitiative Bonus: 4568',
                '\t\tSaving Throws:',
                '\t\t\tFortitude: 57',
                '\t\t\tReflex: 79',
                '\t\t\tWill: 68',
                '',
            ];
    
            expectLines(lines, expected);
        });
        
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
    
        it('formats measurement with no description', () => {
            character.race.age.description = '';
            character.race.maximumAge.description = '';
            character.race.landSpeed.description = '';
            character.race.height.description = '';
            character.race.weight.description = '';
    
            var formattedCharacter = pipe.transform(character);
            var lines = formattedCharacter.split('\r\n');
    
            var expected = [
                'character summary 1:',
                '\tChallenge Rating: 90',
                '\tAlignment: alignment 1',
                '\tclass summary 1',
                '\trace summary 1',
                '\t\tLand Speed: 31 feet per round',
                '\t\tSize: size 1',
                '\t\tAge: 19 Years',
                '\t\tMaximum Age: 1801 Years',
                '\t\tHeight: 4.08 feet filtered',
                '\t\tWeight: 101 Pounds',
                '\tAbilities:',
                '\t\tStrength: 3 (-3)',
                '\t\tConstitution: 27 (14)',
                '\t\tDexterity: 7 (-1)',
                '\t\tIntelligence: 91 (46)',
                '\t\tWisdom: 11 (1)',
                '\t\tCharisma: 10 (0)',
                '\tLanguages:',
                '\t\tEnglish 1',
                '\t\tGerman 1',
                '\tSkills:',
                '\t\tskill 2',
                '\t\t\tTotal Bonus: 136',
                '\t\t\tRanks: 5',
                '\t\t\tAbility Bonus: 14',
                '\t\t\tOther Bonus: 0',
                '\t\t\tArmor Check Penalty: -7',
                '\t\t\tClass Skill',
                '\t\tskill 3 (focus)',
                '\t\t\t' + 'Total Bonus: 247 *',
                '\t\t\t' + 'Ranks: 2.5',
                '\t\t\t' + 'Ability Bonus: -1',
                '\t\t\t' + 'Other Bonus: 4',
                '\t\t\t' + 'Armor Check Penalty: 0',
                '\tFeats:',
                '\t\tRacial:',
                '\t\t\tracial feat 2',
                '\t\t\tracial feat 3',
                '\t\tClass:',
                '\t\t\tclass feat 2',
                '\t\t\tclass feat 3',
                '\t\tAdditional:',
                '\t\t\tadditional feat 2',
                '\t\t\tadditional feat 3',
                '\tInteresting Trait: None',
                '\tEquipment:',
                '\t\tPrimary Hand: None',
                '\t\tOff Hand: None',
                '\t\tArmor: None',
                '\t\tTreasure: None',
                '\tCombat:',
                '\t\tAdjusted Dexterity Bonus: 4',
                '\t\tArmor Class: 8',
                '\t\t\tFlat-Footed: 13',
                '\t\t\tTouch: 35',
                '\t\tBase Attack:',
                '\t\t\tMelee: +22/+17/+12/+7/+2',
                '\t\t\tRanged: +23/+18/+13/+8/+3',
                '\t\tHit Points: 3457',
                '\t\tInitiative Bonus: 4568',
                '\t\tSaving Throws:',
                '\t\t\tFortitude: 57',
                '\t\t\tReflex: 79',
                '\t\t\tWill: 68',
                '',
            ];
    
            expectLines(lines, expected);
        });
    
        it('formats class specialization', () => {
            character.class.specialistFields = ["specialist field 1", "specialist field 2"];
    
            var formattedCharacter = pipe.transform(character);
            var lines = formattedCharacter.split('\r\n');
    
            var expected = [
                'character summary 1:',
                '\tChallenge Rating: 90',
                '\tAlignment: alignment 1',
                '\tclass summary 1',
                '\t\tSpecialist:',
                '\t\t\tspecialist field 1',
                '\t\t\tspecialist field 2',
                '\trace summary 1',
                '\t\tLand Speed: 31 feet per round (fast 1)',
                '\t\tSize: size 1',
                '\t\tAge: 19 Years (adult 1)',
                '\t\tMaximum Age: 1801 Years (natural causes 1)',
                '\t\tHeight: 4.08 feet filtered (tall 1)',
                '\t\tWeight: 101 Pounds (heavy 1)',
                '\tAbilities:',
                '\t\tStrength: 3 (-3)',
                '\t\tConstitution: 27 (14)',
                '\t\tDexterity: 7 (-1)',
                '\t\tIntelligence: 91 (46)',
                '\t\tWisdom: 11 (1)',
                '\t\tCharisma: 10 (0)',
                '\tLanguages:',
                '\t\tEnglish 1',
                '\t\tGerman 1',
                '\tSkills:',
                '\t\tskill 2',
                '\t\t\tTotal Bonus: 136',
                '\t\t\tRanks: 5',
                '\t\t\tAbility Bonus: 14',
                '\t\t\tOther Bonus: 0',
                '\t\t\tArmor Check Penalty: -7',
                '\t\t\tClass Skill',
                '\t\tskill 3 (focus)',
                '\t\t\t' + 'Total Bonus: 247 *',
                '\t\t\t' + 'Ranks: 2.5',
                '\t\t\t' + 'Ability Bonus: -1',
                '\t\t\t' + 'Other Bonus: 4',
                '\t\t\t' + 'Armor Check Penalty: 0',
                '\tFeats:',
                '\t\tRacial:',
                '\t\t\tracial feat 2',
                '\t\t\tracial feat 3',
                '\t\tClass:',
                '\t\t\tclass feat 2',
                '\t\t\tclass feat 3',
                '\t\tAdditional:',
                '\t\t\tadditional feat 2',
                '\t\t\tadditional feat 3',
                '\tInteresting Trait: None',
                '\tEquipment:',
                '\t\tPrimary Hand: None',
                '\t\tOff Hand: None',
                '\t\tArmor: None',
                '\t\tTreasure: None',
                '\tCombat:',
                '\t\tAdjusted Dexterity Bonus: 4',
                '\t\tArmor Class: 8',
                '\t\t\tFlat-Footed: 13',
                '\t\t\tTouch: 35',
                '\t\tBase Attack:',
                '\t\t\tMelee: +22/+17/+12/+7/+2',
                '\t\t\tRanged: +23/+18/+13/+8/+3',
                '\t\tHit Points: 3457',
                '\t\tInitiative Bonus: 4568',
                '\t\tSaving Throws:',
                '\t\t\tFortitude: 57',
                '\t\t\tReflex: 79',
                '\t\t\tWill: 68',
                '',
            ];
    
            expectLines(lines, expected);
        });
    
        it('formats prohibited fields', () => {
            character.class.specialistFields = ["specialist field 1", "specialist field 2"];
            character.class.prohibitedFields = ["prohibited field 1", "prohibited field 2"];
    
            var formattedCharacter = pipe.transform(character);
            var lines = formattedCharacter.split('\r\n');
    
            var expected = [
                'character summary 1:',
                '\tChallenge Rating: 90',
                '\tAlignment: alignment 1',
                '\tclass summary 1',
                '\t\tSpecialist:',
                '\t\t\tspecialist field 1',
                '\t\t\tspecialist field 2',
                '\t\tProhibited:',
                '\t\t\tprohibited field 1',
                '\t\t\tprohibited field 2',
                '\trace summary 1',
                '\t\tLand Speed: 31 feet per round (fast 1)',
                '\t\tSize: size 1',
                '\t\tAge: 19 Years (adult 1)',
                '\t\tMaximum Age: 1801 Years (natural causes 1)',
                '\t\tHeight: 4.08 feet filtered (tall 1)',
                '\t\tWeight: 101 Pounds (heavy 1)',
                '\tAbilities:',
                '\t\tStrength: 3 (-3)',
                '\t\tConstitution: 27 (14)',
                '\t\tDexterity: 7 (-1)',
                '\t\tIntelligence: 91 (46)',
                '\t\tWisdom: 11 (1)',
                '\t\tCharisma: 10 (0)',
                '\tLanguages:',
                '\t\tEnglish 1',
                '\t\tGerman 1',
                '\tSkills:',
                '\t\tskill 2',
                '\t\t\tTotal Bonus: 136',
                '\t\t\tRanks: 5',
                '\t\t\tAbility Bonus: 14',
                '\t\t\tOther Bonus: 0',
                '\t\t\tArmor Check Penalty: -7',
                '\t\t\tClass Skill',
                '\t\tskill 3 (focus)',
                '\t\t\t' + 'Total Bonus: 247 *',
                '\t\t\t' + 'Ranks: 2.5',
                '\t\t\t' + 'Ability Bonus: -1',
                '\t\t\t' + 'Other Bonus: 4',
                '\t\t\t' + 'Armor Check Penalty: 0',
                '\tFeats:',
                '\t\tRacial:',
                '\t\t\tracial feat 2',
                '\t\t\tracial feat 3',
                '\t\tClass:',
                '\t\t\tclass feat 2',
                '\t\t\tclass feat 3',
                '\t\tAdditional:',
                '\t\t\tadditional feat 2',
                '\t\t\tadditional feat 3',
                '\tInteresting Trait: None',
                '\tEquipment:',
                '\t\tPrimary Hand: None',
                '\t\tOff Hand: None',
                '\t\tArmor: None',
                '\t\tTreasure: None',
                '\tCombat:',
                '\t\tAdjusted Dexterity Bonus: 4',
                '\t\tArmor Class: 8',
                '\t\t\tFlat-Footed: 13',
                '\t\t\tTouch: 35',
                '\t\tBase Attack:',
                '\t\t\tMelee: +22/+17/+12/+7/+2',
                '\t\t\tRanged: +23/+18/+13/+8/+3',
                '\t\tHit Points: 3457',
                '\t\tInitiative Bonus: 4568',
                '\t\tSaving Throws:',
                '\t\t\tFortitude: 57',
                '\t\t\tReflex: 79',
                '\t\t\tWill: 68',
                '',
            ];
    
            expectLines(lines, expected);
        });
    
        it('formats metarace species', () => {
            character.race.metaraceSpecies = 'metarace species';
    
            var formattedCharacter = pipe.transform(character);
            var lines = formattedCharacter.split('\r\n');
    
            var expected = [
                'character summary 1:',
                '\tChallenge Rating: 90',
                '\tAlignment: alignment 1',
                '\tclass summary 1',
                '\trace summary 1',
                '\t\tMetarace Species: metarace species',
                '\t\tLand Speed: 31 feet per round (fast 1)',
                '\t\tSize: size 1',
                '\t\tAge: 19 Years (adult 1)',
                '\t\tMaximum Age: 1801 Years (natural causes 1)',
                '\t\tHeight: 4.08 feet filtered (tall 1)',
                '\t\tWeight: 101 Pounds (heavy 1)',
                '\tAbilities:',
                '\t\tStrength: 3 (-3)',
                '\t\tConstitution: 27 (14)',
                '\t\tDexterity: 7 (-1)',
                '\t\tIntelligence: 91 (46)',
                '\t\tWisdom: 11 (1)',
                '\t\tCharisma: 10 (0)',
                '\tLanguages:',
                '\t\tEnglish 1',
                '\t\tGerman 1',
                '\tSkills:',
                '\t\tskill 2',
                '\t\t\tTotal Bonus: 136',
                '\t\t\tRanks: 5',
                '\t\t\tAbility Bonus: 14',
                '\t\t\tOther Bonus: 0',
                '\t\t\tArmor Check Penalty: -7',
                '\t\t\tClass Skill',
                '\t\tskill 3 (focus)',
                '\t\t\t' + 'Total Bonus: 247 *',
                '\t\t\t' + 'Ranks: 2.5',
                '\t\t\t' + 'Ability Bonus: -1',
                '\t\t\t' + 'Other Bonus: 4',
                '\t\t\t' + 'Armor Check Penalty: 0',
                '\tFeats:',
                '\t\tRacial:',
                '\t\t\tracial feat 2',
                '\t\t\tracial feat 3',
                '\t\tClass:',
                '\t\t\tclass feat 2',
                '\t\t\tclass feat 3',
                '\t\tAdditional:',
                '\t\t\tadditional feat 2',
                '\t\t\tadditional feat 3',
                '\tInteresting Trait: None',
                '\tEquipment:',
                '\t\tPrimary Hand: None',
                '\t\tOff Hand: None',
                '\t\tArmor: None',
                '\t\tTreasure: None',
                '\tCombat:',
                '\t\tAdjusted Dexterity Bonus: 4',
                '\t\tArmor Class: 8',
                '\t\t\tFlat-Footed: 13',
                '\t\t\tTouch: 35',
                '\t\tBase Attack:',
                '\t\t\tMelee: +22/+17/+12/+7/+2',
                '\t\t\tRanged: +23/+18/+13/+8/+3',
                '\t\tHit Points: 3457',
                '\t\tInitiative Bonus: 4568',
                '\t\tSaving Throws:',
                '\t\t\tFortitude: 57',
                '\t\t\tReflex: 79',
                '\t\t\tWill: 68',
                '',
            ];
    
            expectLines(lines, expected);
        });
    
        it('formats wings', () => {
            character.race.hasWings = true;
    
            var formattedCharacter = pipe.transform(character);
            var lines = formattedCharacter.split('\r\n');
    
            var expected = [
                'character summary 1:',
                '\tChallenge Rating: 90',
                '\tAlignment: alignment 1',
                '\tclass summary 1',
                '\trace summary 1',
                '\t\tLand Speed: 31 feet per round (fast 1)',
                '\t\tSize: size 1',
                '\t\tAge: 19 Years (adult 1)',
                '\t\tMaximum Age: 1801 Years (natural causes 1)',
                '\t\tHeight: 4.08 feet filtered (tall 1)',
                '\t\tWeight: 101 Pounds (heavy 1)',
                '\t\tHas Wings',
                '\tAbilities:',
                '\t\tStrength: 3 (-3)',
                '\t\tConstitution: 27 (14)',
                '\t\tDexterity: 7 (-1)',
                '\t\tIntelligence: 91 (46)',
                '\t\tWisdom: 11 (1)',
                '\t\tCharisma: 10 (0)',
                '\tLanguages:',
                '\t\tEnglish 1',
                '\t\tGerman 1',
                '\tSkills:',
                '\t\tskill 2',
                '\t\t\tTotal Bonus: 136',
                '\t\t\tRanks: 5',
                '\t\t\tAbility Bonus: 14',
                '\t\t\tOther Bonus: 0',
                '\t\t\tArmor Check Penalty: -7',
                '\t\t\tClass Skill',
                '\t\tskill 3 (focus)',
                '\t\t\t' + 'Total Bonus: 247 *',
                '\t\t\t' + 'Ranks: 2.5',
                '\t\t\t' + 'Ability Bonus: -1',
                '\t\t\t' + 'Other Bonus: 4',
                '\t\t\t' + 'Armor Check Penalty: 0',
                '\tFeats:',
                '\t\tRacial:',
                '\t\t\tracial feat 2',
                '\t\t\tracial feat 3',
                '\t\tClass:',
                '\t\t\tclass feat 2',
                '\t\t\tclass feat 3',
                '\t\tAdditional:',
                '\t\t\tadditional feat 2',
                '\t\t\tadditional feat 3',
                '\tInteresting Trait: None',
                '\tEquipment:',
                '\t\tPrimary Hand: None',
                '\t\tOff Hand: None',
                '\t\tArmor: None',
                '\t\tTreasure: None',
                '\tCombat:',
                '\t\tAdjusted Dexterity Bonus: 4',
                '\t\tArmor Class: 8',
                '\t\t\tFlat-Footed: 13',
                '\t\t\tTouch: 35',
                '\t\tBase Attack:',
                '\t\t\tMelee: +22/+17/+12/+7/+2',
                '\t\t\tRanged: +23/+18/+13/+8/+3',
                '\t\tHit Points: 3457',
                '\t\tInitiative Bonus: 4568',
                '\t\tSaving Throws:',
                '\t\t\tFortitude: 57',
                '\t\t\tReflex: 79',
                '\t\t\tWill: 68',
                '',
            ];
    
            expectLines(lines, expected);
        });
    
        it('formats aerial speed', () => {
            character.race.aerialSpeed.value = 9876;
            character.race.aerialSpeed.unit = 'feet per round';
            character.race.aerialSpeed.description = "swift";
    
            var formattedCharacter = pipe.transform(character);
            var lines = formattedCharacter.split('\r\n');
    
            var expected = [
                'character summary 1:',
                '\tChallenge Rating: 90',
                '\tAlignment: alignment 1',
                '\tclass summary 1',
                '\trace summary 1',
                '\t\tLand Speed: 31 feet per round (fast 1)',
                '\t\tAerial Speed: 9876 feet per round (swift)',
                '\t\tSize: size 1',
                '\t\tAge: 19 Years (adult 1)',
                '\t\tMaximum Age: 1801 Years (natural causes 1)',
                '\t\tHeight: 4.08 feet filtered (tall 1)',
                '\t\tWeight: 101 Pounds (heavy 1)',
                '\tAbilities:',
                '\t\tStrength: 3 (-3)',
                '\t\tConstitution: 27 (14)',
                '\t\tDexterity: 7 (-1)',
                '\t\tIntelligence: 91 (46)',
                '\t\tWisdom: 11 (1)',
                '\t\tCharisma: 10 (0)',
                '\tLanguages:',
                '\t\tEnglish 1',
                '\t\tGerman 1',
                '\t' + 'Skills:',
                '\t\t' + 'skill 2',
                '\t\t\t' + 'Total Bonus: 136',
                '\t\t\t' + 'Ranks: 5',
                '\t\t\t' + 'Ability Bonus: 14',
                '\t\t\t' + 'Other Bonus: 0',
                '\t\t\t' + 'Armor Check Penalty: -7',
                '\t\t\t' + 'Class Skill',
                '\t\t' + 'skill 3 (focus)',
                '\t\t\t' + 'Total Bonus: 247 *',
                '\t\t\t' + 'Ranks: 2.5',
                '\t\t\t' + 'Ability Bonus: -1',
                '\t\t\t' + 'Other Bonus: 4',
                '\t\t\t' + 'Armor Check Penalty: 0',
                '\tFeats:',
                '\t\tRacial:',
                '\t\t\tracial feat 2',
                '\t\t\tracial feat 3',
                '\t\tClass:',
                '\t\t\tclass feat 2',
                '\t\t\tclass feat 3',
                '\t\tAdditional:',
                '\t\t\tadditional feat 2',
                '\t\t\tadditional feat 3',
                '\tInteresting Trait: None',
                '\tEquipment:',
                '\t\tPrimary Hand: None',
                '\t\tOff Hand: None',
                '\t\tArmor: None',
                '\t\tTreasure: None',
                '\tCombat:',
                '\t\tAdjusted Dexterity Bonus: 4',
                '\t\tArmor Class: 8',
                '\t\t\tFlat-Footed: 13',
                '\t\t\tTouch: 35',
                '\t\tBase Attack:',
                '\t\t\tMelee: +22/+17/+12/+7/+2',
                '\t\t\tRanged: +23/+18/+13/+8/+3',
                '\t\tHit Points: 3457',
                '\t\tInitiative Bonus: 4568',
                '\t\tSaving Throws:',
                '\t\t\tFortitude: 57',
                '\t\t\tReflex: 79',
                '\t\t\tWill: 68',
                '',
            ];
    
            expectLines(lines, expected);
        });
    
        it('formats swim speed', () => {
            character.race.swimSpeed.value = 9876;
            character.race.swimSpeed.unit = 'feet per round';
            character.race.swimSpeed.description = "alacrid";
    
            var formattedCharacter = pipe.transform(character);
            var lines = formattedCharacter.split('\r\n');
    
            var expected = [
                'character summary 1:',
                '\tChallenge Rating: 90',
                '\tAlignment: alignment 1',
                '\tclass summary 1',
                '\trace summary 1',
                '\t\tLand Speed: 31 feet per round (fast 1)',
                '\t\tSwim Speed: 9876 feet per round (alacrid)',
                '\t\tSize: size 1',
                '\t\tAge: 19 Years (adult 1)',
                '\t\tMaximum Age: 1801 Years (natural causes 1)',
                '\t\tHeight: 4.08 feet filtered (tall 1)',
                '\t\tWeight: 101 Pounds (heavy 1)',
                '\tAbilities:',
                '\t\tStrength: 3 (-3)',
                '\t\tConstitution: 27 (14)',
                '\t\tDexterity: 7 (-1)',
                '\t\tIntelligence: 91 (46)',
                '\t\tWisdom: 11 (1)',
                '\t\tCharisma: 10 (0)',
                '\tLanguages:',
                '\t\tEnglish 1',
                '\t\tGerman 1',
                '\tSkills:',
                '\t\tskill 2',
                '\t\t\tTotal Bonus: 136',
                '\t\t\tRanks: 5',
                '\t\t\tAbility Bonus: 14',
                '\t\t\tOther Bonus: 0',
                '\t\t\tArmor Check Penalty: -7',
                '\t\t\tClass Skill',
                '\t\tskill 3 (focus)',
                '\t\t\t' + 'Total Bonus: 247 *',
                '\t\t\t' + 'Ranks: 2.5',
                '\t\t\t' + 'Ability Bonus: -1',
                '\t\t\t' + 'Other Bonus: 4',
                '\t\t\t' + 'Armor Check Penalty: 0',
                '\tFeats:',
                '\t\tRacial:',
                '\t\t\tracial feat 2',
                '\t\t\tracial feat 3',
                '\t\tClass:',
                '\t\t\tclass feat 2',
                '\t\t\tclass feat 3',
                '\t\tAdditional:',
                '\t\t\tadditional feat 2',
                '\t\t\tadditional feat 3',
                '\tInteresting Trait: None',
                '\tEquipment:',
                '\t\tPrimary Hand: None',
                '\t\tOff Hand: None',
                '\t\tArmor: None',
                '\t\tTreasure: None',
                '\tCombat:',
                '\t\tAdjusted Dexterity Bonus: 4',
                '\t\tArmor Class: 8',
                '\t\t\tFlat-Footed: 13',
                '\t\t\tTouch: 35',
                '\t\tBase Attack:',
                '\t\t\tMelee: +22/+17/+12/+7/+2',
                '\t\t\tRanged: +23/+18/+13/+8/+3',
                '\t\tHit Points: 3457',
                '\t\tInitiative Bonus: 4568',
                '\t\tSaving Throws:',
                '\t\t\tFortitude: 57',
                '\t\t\tReflex: 79',
                '\t\t\tWill: 68',
                '',
            ];
    
            expectLines(lines, expected);
    
        });
    
        it('formats no racial feats', () => {
            character.feats.racial = [];
    
            var formattedCharacter = pipe.transform(character);
            var lines = formattedCharacter.split('\r\n');
    
            var expected = [
                'character summary 1:',
                '\tChallenge Rating: 90',
                '\tAlignment: alignment 1',
                '\tclass summary 1',
                '\trace summary 1',
                '\t\tLand Speed: 31 feet per round (fast 1)',
                '\t\tSize: size 1',
                '\t\tAge: 19 Years (adult 1)',
                '\t\tMaximum Age: 1801 Years (natural causes 1)',
                '\t\tHeight: 4.08 feet filtered (tall 1)',
                '\t\tWeight: 101 Pounds (heavy 1)',
                '\tAbilities:',
                '\t\tStrength: 3 (-3)',
                '\t\tConstitution: 27 (14)',
                '\t\tDexterity: 7 (-1)',
                '\t\tIntelligence: 91 (46)',
                '\t\tWisdom: 11 (1)',
                '\t\tCharisma: 10 (0)',
                '\tLanguages:',
                '\t\tEnglish 1',
                '\t\tGerman 1',
                '\tSkills:',
                '\t\tskill 2',
                '\t\t\tTotal Bonus: 136',
                '\t\t\tRanks: 5',
                '\t\t\tAbility Bonus: 14',
                '\t\t\tOther Bonus: 0',
                '\t\t\tArmor Check Penalty: -7',
                '\t\t\tClass Skill',
                '\t\tskill 3 (focus)',
                '\t\t\t' + 'Total Bonus: 247 *',
                '\t\t\t' + 'Ranks: 2.5',
                '\t\t\t' + 'Ability Bonus: -1',
                '\t\t\t' + 'Other Bonus: 4',
                '\t\t\t' + 'Armor Check Penalty: 0',
                '\tFeats:',
                '\t\tClass:',
                '\t\t\tclass feat 2',
                '\t\t\tclass feat 3',
                '\t\tAdditional:',
                '\t\t\tadditional feat 2',
                '\t\t\tadditional feat 3',
                '\tInteresting Trait: None',
                '\tEquipment:',
                '\t\tPrimary Hand: None',
                '\t\tOff Hand: None',
                '\t\tArmor: None',
                '\t\tTreasure: None',
                '\tCombat:',
                '\t\tAdjusted Dexterity Bonus: 4',
                '\t\tArmor Class: 8',
                '\t\t\tFlat-Footed: 13',
                '\t\t\tTouch: 35',
                '\t\tBase Attack:',
                '\t\t\tMelee: +22/+17/+12/+7/+2',
                '\t\t\tRanged: +23/+18/+13/+8/+3',
                '\t\tHit Points: 3457',
                '\t\tInitiative Bonus: 4568',
                '\t\tSaving Throws:',
                '\t\t\tFortitude: 57',
                '\t\t\tReflex: 79',
                '\t\t\tWill: 68',
                '',
            ];
    
            expectLines(lines, expected);
        });
    
        it('formats no class feats', () => {
            character.feats.class = [];
    
            var formattedCharacter = pipe.transform(character);
            var lines = formattedCharacter.split('\r\n');
    
            var expected = [
                'character summary 1:',
                '\tChallenge Rating: 90',
                '\tAlignment: alignment 1',
                '\tclass summary 1',
                '\trace summary 1',
                '\t\tLand Speed: 31 feet per round (fast 1)',
                '\t\tSize: size 1',
                '\t\tAge: 19 Years (adult 1)',
                '\t\tMaximum Age: 1801 Years (natural causes 1)',
                '\t\tHeight: 4.08 feet filtered (tall 1)',
                '\t\tWeight: 101 Pounds (heavy 1)',
                '\tAbilities:',
                '\t\tStrength: 3 (-3)',
                '\t\tConstitution: 27 (14)',
                '\t\tDexterity: 7 (-1)',
                '\t\tIntelligence: 91 (46)',
                '\t\tWisdom: 11 (1)',
                '\t\tCharisma: 10 (0)',
                '\tLanguages:',
                '\t\tEnglish 1',
                '\t\tGerman 1',
                '\tSkills:',
                '\t\tskill 2',
                '\t\t\tTotal Bonus: 136',
                '\t\t\tRanks: 5',
                '\t\t\tAbility Bonus: 14',
                '\t\t\tOther Bonus: 0',
                '\t\t\tArmor Check Penalty: -7',
                '\t\t\tClass Skill',
                '\t\tskill 3 (focus)',
                '\t\t\t' + 'Total Bonus: 247 *',
                '\t\t\t' + 'Ranks: 2.5',
                '\t\t\t' + 'Ability Bonus: -1',
                '\t\t\t' + 'Other Bonus: 4',
                '\t\t\t' + 'Armor Check Penalty: 0',
                '\t' + 'Feats:',
                '\t\t' + 'Racial:',
                '\t\t\t' + 'racial feat 2',
                '\t\t\t' + 'racial feat 3',
                '\t\t' + 'Additional:',
                '\t\t\t' + 'additional feat 2',
                '\t\t\t' + 'additional feat 3',
                '\tInteresting Trait: None',
                '\tEquipment:',
                '\t\tPrimary Hand: None',
                '\t\tOff Hand: None',
                '\t\tArmor: None',
                '\t\tTreasure: None',
                '\tCombat:',
                '\t\tAdjusted Dexterity Bonus: 4',
                '\t\tArmor Class: 8',
                '\t\t\tFlat-Footed: 13',
                '\t\t\tTouch: 35',
                '\t\tBase Attack:',
                '\t\t\tMelee: +22/+17/+12/+7/+2',
                '\t\t\tRanged: +23/+18/+13/+8/+3',
                '\t\tHit Points: 3457',
                '\t\tInitiative Bonus: 4568',
                '\t\tSaving Throws:',
                '\t\t\tFortitude: 57',
                '\t\t\tReflex: 79',
                '\t\t\tWill: 68',
                '',
            ];
    
            expectLines(lines, expected);
        });
    
        it('formats feat foci', () => {
            character.feats.racial[0].foci = ['focus 1', 'focus 2'];
            character.feats.class[0].foci = ['focus 3', 'focus 4'];
            character.feats.additional[0].foci = ['focus 5', 'focus 6'];
    
            var formattedCharacter = pipe.transform(character);
            var lines = formattedCharacter.split('\r\n');
    
            var expected = [
                'character summary 1:',
                '\tChallenge Rating: 90',
                '\tAlignment: alignment 1',
                '\tclass summary 1',
                '\trace summary 1',
                '\t\tLand Speed: 31 feet per round (fast 1)',
                '\t\tSize: size 1',
                '\t\tAge: 19 Years (adult 1)',
                '\t\tMaximum Age: 1801 Years (natural causes 1)',
                '\t\tHeight: 4.08 feet filtered (tall 1)',
                '\t\tWeight: 101 Pounds (heavy 1)',
                '\tAbilities:',
                '\t\tStrength: 3 (-3)',
                '\t\tConstitution: 27 (14)',
                '\t\tDexterity: 7 (-1)',
                '\t\tIntelligence: 91 (46)',
                '\t\tWisdom: 11 (1)',
                '\t\tCharisma: 10 (0)',
                '\tLanguages:',
                '\t\tEnglish 1',
                '\t\tGerman 1',
                '\tSkills:',
                '\t\tskill 2',
                '\t\t\tTotal Bonus: 136',
                '\t\t\tRanks: 5',
                '\t\t\tAbility Bonus: 14',
                '\t\t\tOther Bonus: 0',
                '\t\t\tArmor Check Penalty: -7',
                '\t\t\tClass Skill',
                '\t\tskill 3 (focus)',
                '\t\t\t' + 'Total Bonus: 247 *',
                '\t\t\t' + 'Ranks: 2.5',
                '\t\t\t' + 'Ability Bonus: -1',
                '\t\t\t' + 'Other Bonus: 4',
                '\t\t\t' + 'Armor Check Penalty: 0',
                '\tFeats:',
                '\t\tRacial:',
                '\t\t\tracial feat 2',
                '\t\t\t\tFoci:',
                '\t\t\t\t\tfocus 1',
                '\t\t\t\t\tfocus 2',
                '\t\t\tracial feat 3',
                '\t\tClass:',
                '\t\t\tclass feat 2',
                '\t\t\t\tFoci:',
                '\t\t\t\t\tfocus 3',
                '\t\t\t\t\tfocus 4',
                '\t\t\tclass feat 3',
                '\t\tAdditional:',
                '\t\t\tadditional feat 2',
                '\t\t\t\tFoci:',
                '\t\t\t\t\tfocus 5',
                '\t\t\t\t\tfocus 6',
                '\t\t\tadditional feat 3',
                '\tInteresting Trait: None',
                '\tEquipment:',
                '\t\tPrimary Hand: None',
                '\t\tOff Hand: None',
                '\t\tArmor: None',
                '\t\tTreasure: None',
                '\tCombat:',
                '\t\tAdjusted Dexterity Bonus: 4',
                '\t\tArmor Class: 8',
                '\t\t\tFlat-Footed: 13',
                '\t\t\tTouch: 35',
                '\t\tBase Attack:',
                '\t\t\tMelee: +22/+17/+12/+7/+2',
                '\t\t\tRanged: +23/+18/+13/+8/+3',
                '\t\tHit Points: 3457',
                '\t\tInitiative Bonus: 4568',
                '\t\tSaving Throws:',
                '\t\t\tFortitude: 57',
                '\t\t\tReflex: 79',
                '\t\t\tWill: 68',
                '',
            ];
    
            expectLines(lines, expected);
        });
    
        it('formats feat power', () => {
            character.feats.racial[0].power = 9876;
            character.feats.class[0].power = 8765;
            character.feats.additional[0].power = 7654;
    
            var formattedCharacter = pipe.transform(character);
            var lines = formattedCharacter.split('\r\n');
    
            var expected = [
                'character summary 1:',
                '\tChallenge Rating: 90',
                '\tAlignment: alignment 1',
                '\tclass summary 1',
                '\trace summary 1',
                '\t\tLand Speed: 31 feet per round (fast 1)',
                '\t\tSize: size 1',
                '\t\tAge: 19 Years (adult 1)',
                '\t\tMaximum Age: 1801 Years (natural causes 1)',
                '\t\tHeight: 4.08 feet filtered (tall 1)',
                '\t\tWeight: 101 Pounds (heavy 1)',
                '\tAbilities:',
                '\t\tStrength: 3 (-3)',
                '\t\tConstitution: 27 (14)',
                '\t\tDexterity: 7 (-1)',
                '\t\tIntelligence: 91 (46)',
                '\t\tWisdom: 11 (1)',
                '\t\tCharisma: 10 (0)',
                '\tLanguages:',
                '\t\tEnglish 1',
                '\t\tGerman 1',
                '\tSkills:',
                '\t\tskill 2',
                '\t\t\tTotal Bonus: 136',
                '\t\t\tRanks: 5',
                '\t\t\tAbility Bonus: 14',
                '\t\t\tOther Bonus: 0',
                '\t\t\tArmor Check Penalty: -7',
                '\t\t\tClass Skill',
                '\t\tskill 3 (focus)',
                '\t\t\t' + 'Total Bonus: 247 *',
                '\t\t\t' + 'Ranks: 2.5',
                '\t\t\t' + 'Ability Bonus: -1',
                '\t\t\t' + 'Other Bonus: 4',
                '\t\t\t' + 'Armor Check Penalty: 0',
                '\tFeats:',
                '\t\tRacial:',
                '\t\t\tracial feat 2',
                '\t\t\t\tPower: 9876',
                '\t\t\tracial feat 3',
                '\t\tClass:',
                '\t\t\tclass feat 2',
                '\t\t\t\tPower: 8765',
                '\t\t\tclass feat 3',
                '\t\tAdditional:',
                '\t\t\tadditional feat 2',
                '\t\t\t\tPower: 7654',
                '\t\t\tadditional feat 3',
                '\tInteresting Trait: None',
                '\tEquipment:',
                '\t\tPrimary Hand: None',
                '\t\tOff Hand: None',
                '\t\tArmor: None',
                '\t\tTreasure: None',
                '\tCombat:',
                '\t\tAdjusted Dexterity Bonus: 4',
                '\t\tArmor Class: 8',
                '\t\t\tFlat-Footed: 13',
                '\t\t\tTouch: 35',
                '\t\tBase Attack:',
                '\t\t\tMelee: +22/+17/+12/+7/+2',
                '\t\t\tRanged: +23/+18/+13/+8/+3',
                '\t\tHit Points: 3457',
                '\t\tInitiative Bonus: 4568',
                '\t\tSaving Throws:',
                '\t\t\tFortitude: 57',
                '\t\t\tReflex: 79',
                '\t\t\tWill: 68',
                '',
            ];
    
            expectLines(lines, expected);
        });
    
        it('formats feat frequency', () => {
            character.feats.racial[0].frequency.quantity = 9876;
            character.feats.racial[0].frequency.timePeriod = 'fortnight';
            character.feats.class[0].frequency.quantity = 8765;
            character.feats.class[0].frequency.timePeriod = 'moon cycle';
            character.feats.additional[0].frequency.quantity = 7654;
            character.feats.additional[0].frequency.timePeriod = 'turn of the wheel';
    
            var formattedCharacter = pipe.transform(character);
            var lines = formattedCharacter.split('\r\n');
    
            var expected = [
                'character summary 1:',
                '\tChallenge Rating: 90',
                '\tAlignment: alignment 1',
                '\tclass summary 1',
                '\trace summary 1',
                '\t\tLand Speed: 31 feet per round (fast 1)',
                '\t\tSize: size 1',
                '\t\tAge: 19 Years (adult 1)',
                '\t\tMaximum Age: 1801 Years (natural causes 1)',
                '\t\tHeight: 4.08 feet filtered (tall 1)',
                '\t\tWeight: 101 Pounds (heavy 1)',
                '\tAbilities:',
                '\t\tStrength: 3 (-3)',
                '\t\tConstitution: 27 (14)',
                '\t\tDexterity: 7 (-1)',
                '\t\tIntelligence: 91 (46)',
                '\t\tWisdom: 11 (1)',
                '\t\tCharisma: 10 (0)',
                '\tLanguages:',
                '\t\tEnglish 1',
                '\t\tGerman 1',
                '\tSkills:',
                '\t\tskill 2',
                '\t\t\tTotal Bonus: 136',
                '\t\t\tRanks: 5',
                '\t\t\tAbility Bonus: 14',
                '\t\t\tOther Bonus: 0',
                '\t\t\tArmor Check Penalty: -7',
                '\t\t\tClass Skill',
                '\t\tskill 3 (focus)',
                '\t\t\t' + 'Total Bonus: 247 *',
                '\t\t\t' + 'Ranks: 2.5',
                '\t\t\t' + 'Ability Bonus: -1',
                '\t\t\t' + 'Other Bonus: 4',
                '\t\t\t' + 'Armor Check Penalty: 0',
                '\tFeats:',
                '\t\tRacial:',
                '\t\t\tracial feat 2',
                '\t\t\t\tFrequency: 9876/fortnight',
                '\t\t\tracial feat 3',
                '\t\tClass:',
                '\t\t\tclass feat 2',
                '\t\t\t\tFrequency: 8765/moon cycle',
                '\t\t\tclass feat 3',
                '\t\tAdditional:',
                '\t\t\tadditional feat 2',
                '\t\t\t\tFrequency: 7654/turn of the wheel',
                '\t\t\tadditional feat 3',
                '\tInteresting Trait: None',
                '\tEquipment:',
                '\t\tPrimary Hand: None',
                '\t\tOff Hand: None',
                '\t\tArmor: None',
                '\t\tTreasure: None',
                '\tCombat:',
                '\t\tAdjusted Dexterity Bonus: 4',
                '\t\tArmor Class: 8',
                '\t\t\tFlat-Footed: 13',
                '\t\t\tTouch: 35',
                '\t\tBase Attack:',
                '\t\t\tMelee: +22/+17/+12/+7/+2',
                '\t\t\tRanged: +23/+18/+13/+8/+3',
                '\t\tHit Points: 3457',
                '\t\tInitiative Bonus: 4568',
                '\t\tSaving Throws:',
                '\t\t\tFortitude: 57',
                '\t\t\tReflex: 79',
                '\t\t\tWill: 68',
                '',
            ];
    
            expectLines(lines, expected);
        });
    
        it('formats feat frequency without quantity', () => {
            character.feats.racial[0].frequency.quantity = 0;
            character.feats.racial[0].frequency.timePeriod = 'all day erry day';
            character.feats.class[0].frequency.quantity = 0;
            character.feats.class[0].frequency.timePeriod = 'whenever I want';
            character.feats.additional[0].frequency.quantity = 0;
            character.feats.additional[0].frequency.timePeriod = 'when pigs fly';
    
            var formattedCharacter = pipe.transform(character);
            var lines = formattedCharacter.split('\r\n');
    
            var expected = [
                'character summary 1:',
                '\tChallenge Rating: 90',
                '\tAlignment: alignment 1',
                '\tclass summary 1',
                '\trace summary 1',
                '\t\tLand Speed: 31 feet per round (fast 1)',
                '\t\tSize: size 1',
                '\t\tAge: 19 Years (adult 1)',
                '\t\tMaximum Age: 1801 Years (natural causes 1)',
                '\t\tHeight: 4.08 feet filtered (tall 1)',
                '\t\tWeight: 101 Pounds (heavy 1)',
                '\tAbilities:',
                '\t\tStrength: 3 (-3)',
                '\t\tConstitution: 27 (14)',
                '\t\tDexterity: 7 (-1)',
                '\t\tIntelligence: 91 (46)',
                '\t\tWisdom: 11 (1)',
                '\t\tCharisma: 10 (0)',
                '\tLanguages:',
                '\t\tEnglish 1',
                '\t\tGerman 1',
                '\tSkills:',
                '\t\tskill 2',
                '\t\t\tTotal Bonus: 136',
                '\t\t\tRanks: 5',
                '\t\t\tAbility Bonus: 14',
                '\t\t\tOther Bonus: 0',
                '\t\t\tArmor Check Penalty: -7',
                '\t\t\tClass Skill',
                '\t\tskill 3 (focus)',
                '\t\t\t' + 'Total Bonus: 247 *',
                '\t\t\t' + 'Ranks: 2.5',
                '\t\t\t' + 'Ability Bonus: -1',
                '\t\t\t' + 'Other Bonus: 4',
                '\t\t\t' + 'Armor Check Penalty: 0',
                '\tFeats:',
                '\t\tRacial:',
                '\t\t\tracial feat 2',
                '\t\t\t\tFrequency: all day erry day',
                '\t\t\tracial feat 3',
                '\t\tClass:',
                '\t\t\tclass feat 2',
                '\t\t\t\tFrequency: whenever I want',
                '\t\t\tclass feat 3',
                '\t\tAdditional:',
                '\t\t\tadditional feat 2',
                '\t\t\t\tFrequency: when pigs fly',
                '\t\t\tadditional feat 3',
                '\tInteresting Trait: None',
                '\tEquipment:',
                '\t\tPrimary Hand: None',
                '\t\tOff Hand: None',
                '\t\tArmor: None',
                '\t\tTreasure: None',
                '\tCombat:',
                '\t\tAdjusted Dexterity Bonus: 4',
                '\t\tArmor Class: 8',
                '\t\t\tFlat-Footed: 13',
                '\t\t\tTouch: 35',
                '\t\tBase Attack:',
                '\t\t\tMelee: +22/+17/+12/+7/+2',
                '\t\t\tRanged: +23/+18/+13/+8/+3',
                '\t\tHit Points: 3457',
                '\t\tInitiative Bonus: 4568',
                '\t\tSaving Throws:',
                '\t\t\tFortitude: 57',
                '\t\t\tReflex: 79',
                '\t\t\tWill: 68',
                '',
            ];
    
            expectLines(lines, expected);
        });
    
        it('formats interesting trait', () => {
            character.interestingTrait = 'is interesting';
    
            var formattedCharacter = pipe.transform(character);
            var lines = formattedCharacter.split('\r\n');
    
            var expected = [
                'character summary 1:',
                '\tChallenge Rating: 90',
                '\tAlignment: alignment 1',
                '\tclass summary 1',
                '\trace summary 1',
                '\t\tLand Speed: 31 feet per round (fast 1)',
                '\t\tSize: size 1',
                '\t\tAge: 19 Years (adult 1)',
                '\t\tMaximum Age: 1801 Years (natural causes 1)',
                '\t\tHeight: 4.08 feet filtered (tall 1)',
                '\t\tWeight: 101 Pounds (heavy 1)',
                '\tAbilities:',
                '\t\tStrength: 3 (-3)',
                '\t\tConstitution: 27 (14)',
                '\t\tDexterity: 7 (-1)',
                '\t\tIntelligence: 91 (46)',
                '\t\tWisdom: 11 (1)',
                '\t\tCharisma: 10 (0)',
                '\tLanguages:',
                '\t\tEnglish 1',
                '\t\tGerman 1',
                '\tSkills:',
                '\t\tskill 2',
                '\t\t\tTotal Bonus: 136',
                '\t\t\tRanks: 5',
                '\t\t\tAbility Bonus: 14',
                '\t\t\tOther Bonus: 0',
                '\t\t\tArmor Check Penalty: -7',
                '\t\t\tClass Skill',
                '\t\tskill 3 (focus)',
                '\t\t\t' + 'Total Bonus: 247 *',
                '\t\t\t' + 'Ranks: 2.5',
                '\t\t\t' + 'Ability Bonus: -1',
                '\t\t\t' + 'Other Bonus: 4',
                '\t\t\t' + 'Armor Check Penalty: 0',
                '\tFeats:',
                '\t\tRacial:',
                '\t\t\tracial feat 2',
                '\t\t\tracial feat 3',
                '\t\tClass:',
                '\t\t\tclass feat 2',
                '\t\t\tclass feat 3',
                '\t\tAdditional:',
                '\t\t\tadditional feat 2',
                '\t\t\tadditional feat 3',
                '\tInteresting Trait: is interesting',
                '\tEquipment:',
                '\t\tPrimary Hand: None',
                '\t\tOff Hand: None',
                '\t\tArmor: None',
                '\t\tTreasure: None',
                '\tCombat:',
                '\t\tAdjusted Dexterity Bonus: 4',
                '\t\tArmor Class: 8',
                '\t\t\tFlat-Footed: 13',
                '\t\t\tTouch: 35',
                '\t\tBase Attack:',
                '\t\t\tMelee: +22/+17/+12/+7/+2',
                '\t\t\tRanged: +23/+18/+13/+8/+3',
                '\t\tHit Points: 3457',
                '\t\tInitiative Bonus: 4568',
                '\t\tSaving Throws:',
                '\t\t\tFortitude: 57',
                '\t\t\tReflex: 79',
                '\t\t\tWill: 68',
                '',
            ];
    
            expectLines(lines, expected);
        });
    
        it('formats spells per day', () => {
            character.magic.spellsPerDay = [
                new SpellQuantity('my source', 0, 9, false),
                new SpellQuantity('my source', 1, 8, true),
                new SpellQuantity('my other source', 1, 7, false),
                new SpellQuantity('my other source', 2, 6, true),
            ];
    
            var formattedCharacter = pipe.transform(character);
            var lines = formattedCharacter.split('\r\n');
    
            var expected = [
                'character summary 1:',
                '\tChallenge Rating: 90',
                '\tAlignment: alignment 1',
                '\tclass summary 1',
                '\trace summary 1',
                '\t\tLand Speed: 31 feet per round (fast 1)',
                '\t\tSize: size 1',
                '\t\tAge: 19 Years (adult 1)',
                '\t\tMaximum Age: 1801 Years (natural causes 1)',
                '\t\tHeight: 4.08 feet filtered (tall 1)',
                '\t\tWeight: 101 Pounds (heavy 1)',
                '\tAbilities:',
                '\t\tStrength: 3 (-3)',
                '\t\tConstitution: 27 (14)',
                '\t\tDexterity: 7 (-1)',
                '\t\tIntelligence: 91 (46)',
                '\t\tWisdom: 11 (1)',
                '\t\tCharisma: 10 (0)',
                '\tLanguages:',
                '\t\tEnglish 1',
                '\t\tGerman 1',
                '\tSkills:',
                '\t\tskill 2',
                '\t\t\tTotal Bonus: 136',
                '\t\t\tRanks: 5',
                '\t\t\tAbility Bonus: 14',
                '\t\t\tOther Bonus: 0',
                '\t\t\tArmor Check Penalty: -7',
                '\t\t\tClass Skill',
                '\t\tskill 3 (focus)',
                '\t\t\t' + 'Total Bonus: 247 *',
                '\t\t\t' + 'Ranks: 2.5',
                '\t\t\t' + 'Ability Bonus: -1',
                '\t\t\t' + 'Other Bonus: 4',
                '\t\t\t' + 'Armor Check Penalty: 0',
                '\tFeats:',
                '\t\tRacial:',
                '\t\t\tracial feat 2',
                '\t\t\tracial feat 3',
                '\t\tClass:',
                '\t\t\tclass feat 2',
                '\t\t\tclass feat 3',
                '\t\tAdditional:',
                '\t\t\tadditional feat 2',
                '\t\t\tadditional feat 3',
                '\tInteresting Trait: None',
                '\t' + 'Spells Per Day:',
                '\t\t' + 'my source lvl 0: 9',
                '\t\t' + 'my source lvl 1: 8 + 1',
                '\t\t' + 'my other source lvl 1: 7',
                '\t\t' + 'my other source lvl 2: 6 + 1',
                '\tEquipment:',
                '\t\tPrimary Hand: None',
                '\t\tOff Hand: None',
                '\t\tArmor: None',
                '\t\tTreasure: None',
                '\tCombat:',
                '\t\tAdjusted Dexterity Bonus: 4',
                '\t\tArmor Class: 8',
                '\t\t\tFlat-Footed: 13',
                '\t\t\tTouch: 35',
                '\t\tBase Attack:',
                '\t\t\tMelee: +22/+17/+12/+7/+2',
                '\t\t\tRanged: +23/+18/+13/+8/+3',
                '\t\tHit Points: 3457',
                '\t\tInitiative Bonus: 4568',
                '\t\tSaving Throws:',
                '\t\t\tFortitude: 57',
                '\t\t\tReflex: 79',
                '\t\t\tWill: 68',
                '',
            ];
    
            expectLines(lines, expected);
        });
    
        it('formats known spells', () => {
            character.magic.spellsPerDay = [
                new SpellQuantity('my source', 0, 9, false),
                new SpellQuantity('my source', 1, 8, true),
                new SpellQuantity('my other source', 1, 7, false),
                new SpellQuantity('my other source', 2, 6, true),
            ];
    
            character.magic.knownSpells = [
                new Spell('my source', 0, 'spell 0.1', []),
                new Spell('my source', 0, 'spell 0.2', []),
                new Spell('my source', 1, 'spell 1.1', []),
                new Spell('my source', 1, 'spell 1.2', []),
                new Spell('my other source', 1, 'spell 2.1', []),
                new Spell('my other source', 1, 'spell 2.2', []),
                new Spell('my other source', 2, 'spell 3.1', []),
                new Spell('my other source', 2, 'spell 3.2', []),
            ];
    
            var formattedCharacter = pipe.transform(character);
            var lines = formattedCharacter.split('\r\n');
    
            var expected = [
                'character summary 1:',
                '\tChallenge Rating: 90',
                '\tAlignment: alignment 1',
                '\tclass summary 1',
                '\trace summary 1',
                '\t\tLand Speed: 31 feet per round (fast 1)',
                '\t\tSize: size 1',
                '\t\tAge: 19 Years (adult 1)',
                '\t\tMaximum Age: 1801 Years (natural causes 1)',
                '\t\tHeight: 4.08 feet filtered (tall 1)',
                '\t\tWeight: 101 Pounds (heavy 1)',
                '\tAbilities:',
                '\t\tStrength: 3 (-3)',
                '\t\tConstitution: 27 (14)',
                '\t\tDexterity: 7 (-1)',
                '\t\tIntelligence: 91 (46)',
                '\t\tWisdom: 11 (1)',
                '\t\tCharisma: 10 (0)',
                '\tLanguages:',
                '\t\tEnglish 1',
                '\t\tGerman 1',
                '\tSkills:',
                '\t\tskill 2',
                '\t\t\tTotal Bonus: 136',
                '\t\t\tRanks: 5',
                '\t\t\tAbility Bonus: 14',
                '\t\t\tOther Bonus: 0',
                '\t\t\tArmor Check Penalty: -7',
                '\t\t\tClass Skill',
                '\t\tskill 3 (focus)',
                '\t\t\t' + 'Total Bonus: 247 *',
                '\t\t\t' + 'Ranks: 2.5',
                '\t\t\t' + 'Ability Bonus: -1',
                '\t\t\t' + 'Other Bonus: 4',
                '\t\t\t' + 'Armor Check Penalty: 0',
                '\tFeats:',
                '\t\tRacial:',
                '\t\t\tracial feat 2',
                '\t\t\tracial feat 3',
                '\t\tClass:',
                '\t\t\tclass feat 2',
                '\t\t\tclass feat 3',
                '\t\tAdditional:',
                '\t\t\tadditional feat 2',
                '\t\t\tadditional feat 3',
                '\t' + 'Interesting Trait: None',
                '\t' + 'Spells Per Day:',
                '\t\t' + 'my source lvl 0: 9',
                '\t\t' + 'my source lvl 1: 8 + 1',
                '\t\t' + 'my other source lvl 1: 7',
                '\t\t' + 'my other source lvl 2: 6 + 1',
                '\t' + 'Known Spells:',
                '\t\t' + 'first spell group:',
                '\t\t\t' + 'spell 0.1',
                '\t\t' + 'other spell group:',
                '\t\t\t' + 'spell 0.2',
                '\t\t\t' + 'spell 1.1',
                '\t\t\t' + 'spell 1.2',
                '\t\t\t' + 'spell 2.1',
                '\t\t\t' + 'spell 2.2',
                '\t\t\t' + 'spell 3.1',
                '\t\t\t' + 'spell 3.2',
                '\tEquipment:',
                '\t\tPrimary Hand: None',
                '\t\tOff Hand: None',
                '\t\tArmor: None',
                '\t\tTreasure: None',
                '\tCombat:',
                '\t\tAdjusted Dexterity Bonus: 4',
                '\t\tArmor Class: 8',
                '\t\t\tFlat-Footed: 13',
                '\t\t\tTouch: 35',
                '\t\tBase Attack:',
                '\t\t\tMelee: +22/+17/+12/+7/+2',
                '\t\t\tRanged: +23/+18/+13/+8/+3',
                '\t\tHit Points: 3457',
                '\t\tInitiative Bonus: 4568',
                '\t\tSaving Throws:',
                '\t\t\tFortitude: 57',
                '\t\t\tReflex: 79',
                '\t\t\tWill: 68',
                '',
            ];
    
            expectLines(lines, expected);
        });
    
        it('formats prepared spells', () => {
            character.magic.spellsPerDay = [
                new SpellQuantity('my source', 0, 9, false),
                new SpellQuantity('my source', 1, 8, true),
                new SpellQuantity('my other source', 1, 7, false),
                new SpellQuantity('my other source', 2, 6, true),
            ];
    
            character.magic.knownSpells = [
                new Spell('my source', 0, 'spell 0.1', []),
                new Spell('my source', 0, 'spell 0.2', []),
                new Spell('my source', 1, 'spell 1.1', []),
                new Spell('my source', 1, 'spell 1.2', []),
                new Spell('my other source', 1, 'spell 2.1', []),
                new Spell('my other source', 1, 'spell 2.2', []),
                new Spell('my other source', 2, 'spell 3.1', []),
                new Spell('my other source', 2, 'spell 3.2', []),
            ];
    
            character.magic.preparedSpells = [
                new Spell('my source', 0, 'prepared spell 0.1', []),
                new Spell('my source', 0, 'prepared spell 0.1', []),
                new Spell('my source', 0, 'prepared spell 0.2', []),
                new Spell('my source', 1, 'prepared spell 1.1', []),
                new Spell('my source', 1, 'prepared spell 1.2', []),
                new Spell('my source', 1, 'prepared spell 1.2', []),
                new Spell('my other source', 1, 'prepared spell 2.1', []),
                new Spell('my other source', 1, 'prepared spell 2.2', []),
                new Spell('my other source', 1, 'prepared spell 2.2', []),
                new Spell('my other source', 2, 'prepared spell 3.1', []),
                new Spell('my other source', 2, 'prepared spell 3.1', []),
                new Spell('my other source', 2, 'prepared spell 3.2', []),
            ];
    
            var formattedCharacter = pipe.transform(character);
            var lines = formattedCharacter.split('\r\n');
    
            var expected = [
                'character summary 1:',
                '\tChallenge Rating: 90',
                '\tAlignment: alignment 1',
                '\tclass summary 1',
                '\trace summary 1',
                '\t\tLand Speed: 31 feet per round (fast 1)',
                '\t\tSize: size 1',
                '\t\tAge: 19 Years (adult 1)',
                '\t\tMaximum Age: 1801 Years (natural causes 1)',
                '\t\tHeight: 4.08 feet filtered (tall 1)',
                '\t\tWeight: 101 Pounds (heavy 1)',
                '\tAbilities:',
                '\t\tStrength: 3 (-3)',
                '\t\tConstitution: 27 (14)',
                '\t\tDexterity: 7 (-1)',
                '\t\tIntelligence: 91 (46)',
                '\t\tWisdom: 11 (1)',
                '\t\tCharisma: 10 (0)',
                '\tLanguages:',
                '\t\tEnglish 1',
                '\t\tGerman 1',
                '\tSkills:',
                '\t\tskill 2',
                '\t\t\tTotal Bonus: 136',
                '\t\t\tRanks: 5',
                '\t\t\tAbility Bonus: 14',
                '\t\t\tOther Bonus: 0',
                '\t\t\tArmor Check Penalty: -7',
                '\t\t\tClass Skill',
                '\t\tskill 3 (focus)',
                '\t\t\t' + 'Total Bonus: 247 *',
                '\t\t\t' + 'Ranks: 2.5',
                '\t\t\t' + 'Ability Bonus: -1',
                '\t\t\t' + 'Other Bonus: 4',
                '\t\t\t' + 'Armor Check Penalty: 0',
                '\tFeats:',
                '\t\tRacial:',
                '\t\t\tracial feat 2',
                '\t\t\tracial feat 3',
                '\t\tClass:',
                '\t\t\tclass feat 2',
                '\t\t\tclass feat 3',
                '\t\tAdditional:',
                '\t\t\tadditional feat 2',
                '\t\t\tadditional feat 3',
                '\tInteresting Trait: None',
                '\t' + 'Spells Per Day:',
                '\t\t' + 'my source lvl 0: 9',
                '\t\t' + 'my source lvl 1: 8 + 1',
                '\t\t' + 'my other source lvl 1: 7',
                '\t\t' + 'my other source lvl 2: 6 + 1',
                '\t' + 'Known Spells:',
                '\t\t' + 'first spell group:',
                '\t\t\t' + 'spell 0.1',
                '\t\t' + 'other spell group:',
                '\t\t\t' + 'spell 0.2',
                '\t\t\t' + 'spell 1.1',
                '\t\t\t' + 'spell 1.2',
                '\t\t\t' + 'spell 2.1',
                '\t\t\t' + 'spell 2.2',
                '\t\t\t' + 'spell 3.1',
                '\t\t\t' + 'spell 3.2',
                '\t' + 'Prepared Spells:',
                '\t\t' + 'first spell group:',
                '\t\t\t' + 'prepared spell 0.1',
                '\t\t' + 'other spell group:',
                '\t\t\t' + 'prepared spell 0.1',
                '\t\t\t' + 'prepared spell 0.2',
                '\t\t\t' + 'prepared spell 1.1',
                '\t\t\t' + 'prepared spell 1.2',
                '\t\t\t' + 'prepared spell 1.2',
                '\t\t\t' + 'prepared spell 2.1',
                '\t\t\t' + 'prepared spell 2.2',
                '\t\t\t' + 'prepared spell 2.2',
                '\t\t\t' + 'prepared spell 3.1',
                '\t\t\t' + 'prepared spell 3.1',
                '\t\t\t' + 'prepared spell 3.2',
                '\tEquipment:',
                '\t\tPrimary Hand: None',
                '\t\tOff Hand: None',
                '\t\tArmor: None',
                '\t\tTreasure: None',
                '\tCombat:',
                '\t\tAdjusted Dexterity Bonus: 4',
                '\t\tArmor Class: 8',
                '\t\t\tFlat-Footed: 13',
                '\t\t\tTouch: 35',
                '\t\tBase Attack:',
                '\t\t\tMelee: +22/+17/+12/+7/+2',
                '\t\t\tRanged: +23/+18/+13/+8/+3',
                '\t\tHit Points: 3457',
                '\t\tInitiative Bonus: 4568',
                '\t\tSaving Throws:',
                '\t\t\tFortitude: 57',
                '\t\t\tReflex: 79',
                '\t\t\tWill: 68',
                '',
            ];
    
            expectLines(lines, expected);
        });
    
        it('formats arcane spell failure', () => {
            character.magic.arcaneSpellFailure = 98;
    
            var formattedCharacter = pipe.transform(character);
            var lines = formattedCharacter.split('\r\n');
    
            var expected = [
                'character summary 1:',
                '\tChallenge Rating: 90',
                '\tAlignment: alignment 1',
                '\tclass summary 1',
                '\trace summary 1',
                '\t\tLand Speed: 31 feet per round (fast 1)',
                '\t\tSize: size 1',
                '\t\tAge: 19 Years (adult 1)',
                '\t\tMaximum Age: 1801 Years (natural causes 1)',
                '\t\tHeight: 4.08 feet filtered (tall 1)',
                '\t\tWeight: 101 Pounds (heavy 1)',
                '\tAbilities:',
                '\t\tStrength: 3 (-3)',
                '\t\tConstitution: 27 (14)',
                '\t\tDexterity: 7 (-1)',
                '\t\tIntelligence: 91 (46)',
                '\t\tWisdom: 11 (1)',
                '\t\tCharisma: 10 (0)',
                '\tLanguages:',
                '\t\tEnglish 1',
                '\t\tGerman 1',
                '\tSkills:',
                '\t\tskill 2',
                '\t\t\tTotal Bonus: 136',
                '\t\t\tRanks: 5',
                '\t\t\tAbility Bonus: 14',
                '\t\t\tOther Bonus: 0',
                '\t\t\tArmor Check Penalty: -7',
                '\t\t\tClass Skill',
                '\t\tskill 3 (focus)',
                '\t\t\t' + 'Total Bonus: 247 *',
                '\t\t\t' + 'Ranks: 2.5',
                '\t\t\t' + 'Ability Bonus: -1',
                '\t\t\t' + 'Other Bonus: 4',
                '\t\t\t' + 'Armor Check Penalty: 0',
                '\tFeats:',
                '\t\tRacial:',
                '\t\t\tracial feat 2',
                '\t\t\tracial feat 3',
                '\t\tClass:',
                '\t\t\tclass feat 2',
                '\t\t\tclass feat 3',
                '\t\tAdditional:',
                '\t\t\tadditional feat 2',
                '\t\t\tadditional feat 3',
                '\tInteresting Trait: None',
                '\t' + 'Arcane Spell Failure: 98%',
                '\tEquipment:',
                '\t\tPrimary Hand: None',
                '\t\tOff Hand: None',
                '\t\tArmor: None',
                '\t\tTreasure: None',
                '\tCombat:',
                '\t\tAdjusted Dexterity Bonus: 4',
                '\t\tArmor Class: 8',
                '\t\t\tFlat-Footed: 13',
                '\t\t\tTouch: 35',
                '\t\tBase Attack:',
                '\t\t\tMelee: +22/+17/+12/+7/+2',
                '\t\t\tRanged: +23/+18/+13/+8/+3',
                '\t\tHit Points: 3457',
                '\t\tInitiative Bonus: 4568',
                '\t\tSaving Throws:',
                '\t\t\tFortitude: 57',
                '\t\t\tReflex: 79',
                '\t\t\tWill: 68',
                '',
            ];
    
            expectLines(lines, expected);
        });
    
        it('formats animal', () => {
            character.magic.animal = 'familiar';
    
            var formattedCharacter = pipe.transform(character);
            var lines = formattedCharacter.split('\r\n');
    
            var expected = [
                'character summary:',
                '\t' + 'Challenge Rating: 89',
                '\t' + 'Alignment: alignment',
                '\t' + 'class summary',
                '\t' + 'race summary',
                '\t\t' + 'Land Speed: 30 feet per round (fast)',
                '\t\t' + 'Size: size 0',
                '\t\t' + 'Age: 19 Years (adult 1)',
                '\t\t' + 'Maximum Age: 1801 Years (natural causes 1)',
                '\t\t' + 'Height: 4.08 feet filtered (tall 1)',
                '\t\t' + 'Weight: 101 Pounds (heavy 1)',
                '\t' + 'Abilities:',
                '\t\t' + 'Strength: 3 (-3)',
                '\t\t' + 'Constitution: 27 (14)',
                '\t\t' + 'Dexterity: 7 (-1)',
                '\t\t' + 'Intelligence: 91 (46)',
                '\t\t' + 'Wisdom: 11 (1)',
                '\t\t' + 'Charisma: 10 (0)',
                '\t' + 'Languages:',
                '\t\t' + 'English 1',
                '\t\t' + 'German 1',
                '\t' + 'Skills:',
                '\t\t' + 'skill 2',
                '\t\t\t' + 'Total Bonus: 136',
                '\t\t\t' + 'Ranks: 5',
                '\t\t\t' + 'Ability Bonus: 14',
                '\t\t\t' + 'Other Bonus: 0',
                '\t\t\t' + 'Armor Check Penalty: -7',
                '\t\t\t' + 'Class Skill',
                '\t\t' + 'skill 3 (focus)',
                '\t\t\t' + 'Total Bonus: 247 *',
                '\t\t\t' + 'Ranks: 2.5',
                '\t\t\t' + 'Ability Bonus: -1',
                '\t\t\t' + 'Other Bonus: 4',
                '\t\t\t' + 'Armor Check Penalty: 0',
                '\t' + 'Feats:',
                '\t\t' + 'Racial:',
                '\t\t\t' + 'racial feat 2',
                '\t\t\t' + 'racial feat 3',
                '\t\t' + 'Class:',
                '\t\t\t' + 'class feat 2',
                '\t\t\t' + 'class feat 3',
                '\t\t' + 'Additional:',
                '\t\t\t' + 'additional feat 2',
                '\t\t\t' + 'additional feat 3',
                '\t' + 'Interesting Trait: None',
                '\t' + 'Animal: familiar',
                '\tEquipment:',
                '\t\tPrimary Hand: None',
                '\t\tOff Hand: None',
                '\t\tArmor: None',
                '\t\tTreasure: None',
                '\tCombat:',
                '\t\tAdjusted Dexterity Bonus: 4',
                '\t\tArmor Class: 8',
                '\t\t\tFlat-Footed: 13',
                '\t\t\tTouch: 35',
                '\t\tBase Attack:',
                '\t\t\tMelee: +22/+17/+12/+7/+2',
                '\t\t\tRanged: +23/+18/+13/+8/+3',
                '\t\tHit Points: 3457',
                '\t\tInitiative Bonus: 4568',
                '\t\tSaving Throws:',
                '\t\t\tFortitude: 57',
                '\t\t\tReflex: 79',
                '\t\t\tWill: 68',
                '',
            ];
    
            expectLines(lines, expected);
        });
    
        it('formats primary hand', () => {
            character.equipment.primaryHand = createWeapon('primary weapon');
    
            var formattedCharacter = pipe.transform(character);
            var lines = formattedCharacter.split('\r\n');
    
            var expected = [
                'character summary 1:',
                '\tChallenge Rating: 90',
                '\tAlignment: alignment 1',
                '\tclass summary 1',
                '\trace summary 1',
                '\t\tLand Speed: 31 feet per round (fast 1)',
                '\t\tSize: size 1',
                '\t\tAge: 19 Years (adult 1)',
                '\t\tMaximum Age: 1801 Years (natural causes 1)',
                '\t\tHeight: 4.08 feet filtered (tall 1)',
                '\t\tWeight: 101 Pounds (heavy 1)',
                '\tAbilities:',
                '\t\tStrength: 3 (-3)',
                '\t\tConstitution: 27 (14)',
                '\t\tDexterity: 7 (-1)',
                '\t\tIntelligence: 91 (46)',
                '\t\tWisdom: 11 (1)',
                '\t\tCharisma: 10 (0)',
                '\tLanguages:',
                '\t\tEnglish 1',
                '\t\tGerman 1',
                '\tSkills:',
                '\t\tskill 2',
                '\t\t\tTotal Bonus: 136',
                '\t\t\tRanks: 5',
                '\t\t\tAbility Bonus: 14',
                '\t\t\tOther Bonus: 0',
                '\t\t\tArmor Check Penalty: -7',
                '\t\t\tClass Skill',
                '\t\tskill 3 (focus)',
                '\t\t\t' + 'Total Bonus: 247 *',
                '\t\t\t' + 'Ranks: 2.5',
                '\t\t\t' + 'Ability Bonus: -1',
                '\t\t\t' + 'Other Bonus: 4',
                '\t\t\t' + 'Armor Check Penalty: 0',
                '\tFeats:',
                '\t\tRacial:',
                '\t\t\tracial feat 2',
                '\t\t\tracial feat 3',
                '\t\tClass:',
                '\t\t\tclass feat 2',
                '\t\t\tclass feat 3',
                '\t\tAdditional:',
                '\t\t\tadditional feat 2',
                '\t\t\tadditional feat 3',
                '\tInteresting Trait: None',
                '\t' + 'Equipment:',
                '\t\t' + 'Primary Hand:',
                '\t\t\t' + 'primary weapon description',
                '\t\t\t\t' + 'formatted',
                '\t\t' + 'Off Hand: None',
                '\t\t' + 'Armor: None',
                '\t\t' + 'Treasure: None',
                '\tCombat:',
                '\t\tAdjusted Dexterity Bonus: 4',
                '\t\tArmor Class: 8',
                '\t\t\tFlat-Footed: 13',
                '\t\t\tTouch: 35',
                '\t\tBase Attack:',
                '\t\t\tMelee: +22/+17/+12/+7/+2',
                '\t\t\tRanged: +23/+18/+13/+8/+3',
                '\t\tHit Points: 3457',
                '\t\tInitiative Bonus: 4568',
                '\t\tSaving Throws:',
                '\t\t\tFortitude: 57',
                '\t\t\tReflex: 79',
                '\t\t\tWill: 68',
                '',
            ];
    
            expectLines(lines, expected);
        });
    
        it('formats two-handed weapon', () => {
            character.equipment.primaryHand = createWeapon('primary weapon');
            character.equipment.primaryHand.attributes.push('Two-Handed');
    
            var formattedCharacter = pipe.transform(character);
            var lines = formattedCharacter.split('\r\n');
    
            var expected = [
                'character summary 1:',
                '\tChallenge Rating: 90',
                '\tAlignment: alignment 1',
                '\tclass summary 1',
                '\trace summary 1',
                '\t\tLand Speed: 31 feet per round (fast 1)',
                '\t\tSize: size 1',
                '\t\tAge: 19 Years (adult 1)',
                '\t\tMaximum Age: 1801 Years (natural causes 1)',
                '\t\tHeight: 4.08 feet filtered (tall 1)',
                '\t\tWeight: 101 Pounds (heavy 1)',
                '\tAbilities:',
                '\t\tStrength: 3 (-3)',
                '\t\tConstitution: 27 (14)',
                '\t\tDexterity: 7 (-1)',
                '\t\tIntelligence: 91 (46)',
                '\t\tWisdom: 11 (1)',
                '\t\tCharisma: 10 (0)',
                '\tLanguages:',
                '\t\tEnglish 1',
                '\t\tGerman 1',
                '\tSkills:',
                '\t\tskill 2',
                '\t\t\tTotal Bonus: 136',
                '\t\t\tRanks: 5',
                '\t\t\tAbility Bonus: 14',
                '\t\t\tOther Bonus: 0',
                '\t\t\tArmor Check Penalty: -7',
                '\t\t\tClass Skill',
                '\t\tskill 3 (focus)',
                '\t\t\t' + 'Total Bonus: 247 *',
                '\t\t\t' + 'Ranks: 2.5',
                '\t\t\t' + 'Ability Bonus: -1',
                '\t\t\t' + 'Other Bonus: 4',
                '\t\t\t' + 'Armor Check Penalty: 0',
                '\tFeats:',
                '\t\tRacial:',
                '\t\t\tracial feat 2',
                '\t\t\tracial feat 3',
                '\t\tClass:',
                '\t\t\tclass feat 2',
                '\t\t\tclass feat 3',
                '\t\tAdditional:',
                '\t\t\tadditional feat 2',
                '\t\t\tadditional feat 3',
                '\tInteresting Trait: None',
                '\tEquipment:',
                '\t\t' + 'Primary Hand:',
                '\t\t\t' + 'primary weapon description',
                '\t\t\t\t' + 'formatted',
                '\t\tOff Hand: (Two-Handed)',
                '\t\tArmor: None',
                '\t\tTreasure: None',
                '\tCombat:',
                '\t\tAdjusted Dexterity Bonus: 4',
                '\t\tArmor Class: 8',
                '\t\t\tFlat-Footed: 13',
                '\t\t\tTouch: 35',
                '\t\tBase Attack:',
                '\t\t\tMelee: +22/+17/+12/+7/+2',
                '\t\t\tRanged: +23/+18/+13/+8/+3',
                '\t\tHit Points: 3457',
                '\t\tInitiative Bonus: 4568',
                '\t\tSaving Throws:',
                '\t\t\tFortitude: 57',
                '\t\t\tReflex: 79',
                '\t\t\tWill: 68',
                '',
            ];
    
            expectLines(lines, expected);
        });
    
        it('formats off-hand item', () => {
            character.equipment.primaryHand = createWeapon('primary weapon');
            character.equipment.offHand = createItem('off-hand item');
    
            var formattedCharacter = pipe.transform(character);
            var lines = formattedCharacter.split('\r\n');
    
            var expected = [
                'character summary 1:',
                '\tChallenge Rating: 90',
                '\tAlignment: alignment 1',
                '\tclass summary 1',
                '\trace summary 1',
                '\t\tLand Speed: 31 feet per round (fast 1)',
                '\t\tSize: size 1',
                '\t\tAge: 19 Years (adult 1)',
                '\t\tMaximum Age: 1801 Years (natural causes 1)',
                '\t\tHeight: 4.08 feet filtered (tall 1)',
                '\t\tWeight: 101 Pounds (heavy 1)',
                '\tAbilities:',
                '\t\tStrength: 3 (-3)',
                '\t\tConstitution: 27 (14)',
                '\t\tDexterity: 7 (-1)',
                '\t\tIntelligence: 91 (46)',
                '\t\tWisdom: 11 (1)',
                '\t\tCharisma: 10 (0)',
                '\tLanguages:',
                '\t\tEnglish 1',
                '\t\tGerman 1',
                '\tSkills:',
                '\t\tskill 2',
                '\t\t\tTotal Bonus: 136',
                '\t\t\tRanks: 5',
                '\t\t\tAbility Bonus: 14',
                '\t\t\tOther Bonus: 0',
                '\t\t\tArmor Check Penalty: -7',
                '\t\t\tClass Skill',
                '\t\tskill 3 (focus)',
                '\t\t\t' + 'Total Bonus: 247 *',
                '\t\t\t' + 'Ranks: 2.5',
                '\t\t\t' + 'Ability Bonus: -1',
                '\t\t\t' + 'Other Bonus: 4',
                '\t\t\t' + 'Armor Check Penalty: 0',
                '\tFeats:',
                '\t\tRacial:',
                '\t\t\tracial feat 2',
                '\t\t\tracial feat 3',
                '\t\tClass:',
                '\t\t\tclass feat 2',
                '\t\t\tclass feat 3',
                '\t\tAdditional:',
                '\t\t\tadditional feat 2',
                '\t\t\tadditional feat 3',
                '\t' + 'Interesting Trait: None',
                '\t' + 'Equipment:',
                '\t\t' + 'Primary Hand:',
                '\t\t\t' + 'primary weapon description',
                '\t\t\t\t' + 'formatted',
                '\t\t' + 'Off Hand:',
                '\t\t\t' + 'off-hand item description',
                '\t\t\t\t' + 'formatted',
                '\t\t' + 'Armor: None',
                '\t\t' + 'Treasure: None',
                '\tCombat:',
                '\t\tAdjusted Dexterity Bonus: 4',
                '\t\tArmor Class: 8',
                '\t\t\tFlat-Footed: 13',
                '\t\t\tTouch: 35',
                '\t\tBase Attack:',
                '\t\t\tMelee: +22/+17/+12/+7/+2',
                '\t\t\tRanged: +23/+18/+13/+8/+3',
                '\t\tHit Points: 3457',
                '\t\tInitiative Bonus: 4568',
                '\t\tSaving Throws:',
                '\t\t\tFortitude: 57',
                '\t\t\tReflex: 79',
                '\t\t\tWill: 68',
                '',
            ];
    
            expectLines(lines, expected);
        });
    
        it('formats armor', () => {
            character.equipment.armor = createArmor('armor');
    
            var formattedCharacter = pipe.transform(character);
            var lines = formattedCharacter.split('\r\n');
    
            var expected = [
                'character summary 1:',
                '\tChallenge Rating: 90',
                '\tAlignment: alignment 1',
                '\tclass summary 1',
                '\trace summary 1',
                '\t\tLand Speed: 31 feet per round (fast 1)',
                '\t\tSize: size 1',
                '\t\tAge: 19 Years (adult 1)',
                '\t\tMaximum Age: 1801 Years (natural causes 1)',
                '\t\tHeight: 4.08 feet filtered (tall 1)',
                '\t\tWeight: 101 Pounds (heavy 1)',
                '\tAbilities:',
                '\t\tStrength: 3 (-3)',
                '\t\tConstitution: 27 (14)',
                '\t\tDexterity: 7 (-1)',
                '\t\tIntelligence: 91 (46)',
                '\t\tWisdom: 11 (1)',
                '\t\tCharisma: 10 (0)',
                '\tLanguages:',
                '\t\tEnglish 1',
                '\t\tGerman 1',
                '\tSkills:',
                '\t\tskill 2',
                '\t\t\tTotal Bonus: 136',
                '\t\t\tRanks: 5',
                '\t\t\tAbility Bonus: 14',
                '\t\t\tOther Bonus: 0',
                '\t\t\tArmor Check Penalty: -7',
                '\t\t\tClass Skill',
                '\t\tskill 3 (focus)',
                '\t\t\t' + 'Total Bonus: 247 *',
                '\t\t\t' + 'Ranks: 2.5',
                '\t\t\t' + 'Ability Bonus: -1',
                '\t\t\t' + 'Other Bonus: 4',
                '\t\t\t' + 'Armor Check Penalty: 0',
                '\tFeats:',
                '\t\tRacial:',
                '\t\t\tracial feat 2',
                '\t\t\tracial feat 3',
                '\t\tClass:',
                '\t\t\tclass feat 2',
                '\t\t\tclass feat 3',
                '\t\tAdditional:',
                '\t\t\tadditional feat 2',
                '\t\t\tadditional feat 3',
                '\tInteresting Trait: None',
                '\tEquipment:',
                '\t\tPrimary Hand: None',
                '\t\tOff Hand: None',
                '\t\tArmor:',
                '\t\t\tarmor description',
                '\t\t\t\tformatted',
                '\t\tTreasure: None',
                '\tCombat:',
                '\t\tAdjusted Dexterity Bonus: 4',
                '\t\tArmor Class: 8',
                '\t\t\tFlat-Footed: 13',
                '\t\t\tTouch: 35',
                '\t\tBase Attack:',
                '\t\t\tMelee: +22/+17/+12/+7/+2',
                '\t\t\tRanged: +23/+18/+13/+8/+3',
                '\t\tHit Points: 3457',
                '\t\tInitiative Bonus: 4568',
                '\t\tSaving Throws:',
                '\t\t\tFortitude: 57',
                '\t\t\tReflex: 79',
                '\t\t\tWill: 68',
                '',
            ];
    
            expectLines(lines, expected);
        });
    
        it('formats treasure if there is any', () => {
            character.equipment.treasure.isAny = true;
            character.equipment.treasure.coin.quantity = 9;
            character.equipment.treasure.goods = [new Good('good 1', 1), new Good('good 2', 2)];
            character.equipment.treasure.items = [new Item('item 1', 'item type 1'), new Item('item 2', 'item type 2'), new Item('item 3', 'item type 3')];
    
            var formattedCharacter = pipe.transform(character);
            var lines = formattedCharacter.split('\r\n');
    
            var expected = [
                'character summary 1:',
                '\t' + 'Challenge Rating: 90',
                '\t' + 'Alignment: alignment 1',
                '\t' + 'class summary 1',
                '\t' + 'race summary 1',
                '\t\t' + 'Land Speed: 31 feet per round (fast 1)',
                '\t\t' + 'Size: size 1',
                '\t\t' + 'Age: 19 Years (adult 1)',
                '\t\t' + 'Maximum Age: 1801 Years (natural causes 1)',
                '\t\t' + 'Height: 4.08 feet filtered (tall 1)',
                '\t\t' + 'Weight: 101 Pounds (heavy 1)',
                '\t' + 'Abilities:',
                '\t\t' + 'Strength: 3 (-3)',
                '\t\t' + 'Constitution: 27 (14)',
                '\t\t' + 'Dexterity: 7 (-1)',
                '\t\t' + 'Intelligence: 91 (46)',
                '\t\t' + 'Wisdom: 11 (1)',
                '\t\t' + 'Charisma: 10 (0)',
                '\t' + 'Languages:',
                '\t\t' + 'English 1',
                '\t\t' + 'German 1',
                '\t' + 'Skills:',
                '\t\t' + 'skill 2',
                '\t\t\t' + 'Total Bonus: 136',
                '\t\t\t' + 'Ranks: 5',
                '\t\t\t' + 'Ability Bonus: 14',
                '\t\t\t' + 'Other Bonus: 0',
                '\t\t\t' + 'Armor Check Penalty: -7',
                '\t\t\t' + 'Class Skill',
                '\t\t' + 'skill 3 (focus)',
                '\t\t\t' + 'Total Bonus: 247 *',
                '\t\t\t' + 'Ranks: 2.5',
                '\t\t\t' + 'Ability Bonus: -1',
                '\t\t\t' + 'Other Bonus: 4',
                '\t\t\t' + 'Armor Check Penalty: 0',
                '\t' + 'Feats:',
                '\t\t' + 'Racial:',
                '\t\t\t' + 'racial feat 2',
                '\t\t\t' + 'racial feat 3',
                '\t\t' + 'Class:',
                '\t\t\t' + 'class feat 2',
                '\t\t\t' + 'class feat 3',
                '\t\t' + 'Additional:',
                '\t\t\t' + 'additional feat 2',
                '\t\t\t' + 'additional feat 3',
                '\t' + 'Interesting Trait: None',
                '\t' + 'Equipment:',
                '\t\t' + 'Primary Hand: None',
                '\t\t' + 'Off Hand: None',
                '\t\t' + 'Armor: None',
                '\t\t' + 'Treasure:',
                '\t\t\t' + 'formatted treasure:',
                '\t\t\t\t' + 'coins: 9',
                '\t\t\t\t' + 'goods: 2',
                '\t\t\t\t' + 'items: 3',
                '\t' + 'Combat:',
                '\t\t' + 'Adjusted Dexterity Bonus: 4',
                '\t\t' + 'Armor Class: 8',
                '\t\t\t' + 'Flat-Footed: 13',
                '\t\t\t' + 'Touch: 35',
                '\t\t' + 'Base Attack:',
                '\t\t\t' + 'Melee: +22/+17/+12/+7/+2',
                '\t\t\t' + 'Ranged: +23/+18/+13/+8/+3',
                '\t\t' + 'Hit Points: 3457',
                '\t\t' + 'Initiative Bonus: 4568',
                '\t\t' + 'Saving Throws:',
                '\t\t\t' + 'Fortitude: 57',
                '\t\t\t' + 'Reflex: 79',
                '\t\t\t' + 'Will: 68',
                '',
            ];
    
            expectLines(lines, expected);
        });
    
        it('formats circumstantial armor bonus', () => {
            character.combat.armorClass.circumstantialBonus = true;
    
            var formattedCharacter = pipe.transform(character);
            var lines = formattedCharacter.split('\r\n');
    
            var expected = [
                'character summary 1:',
                '\tChallenge Rating: 90',
                '\tAlignment: alignment 1',
                '\tclass summary 1',
                '\trace summary 1',
                '\t\tLand Speed: 31 feet per round (fast 1)',
                '\t\tSize: size 1',
                '\t\tAge: 19 Years (adult 1)',
                '\t\tMaximum Age: 1801 Years (natural causes 1)',
                '\t\tHeight: 4.08 feet filtered (tall 1)',
                '\t\tWeight: 101 Pounds (heavy 1)',
                '\tAbilities:',
                '\t\tStrength: 3 (-3)',
                '\t\tConstitution: 27 (14)',
                '\t\tDexterity: 7 (-1)',
                '\t\tIntelligence: 91 (46)',
                '\t\tWisdom: 11 (1)',
                '\t\tCharisma: 10 (0)',
                '\tLanguages:',
                '\t\tEnglish 1',
                '\t\tGerman 1',
                '\tSkills:',
                '\t\tskill 2',
                '\t\t\tTotal Bonus: 136',
                '\t\t\tRanks: 5',
                '\t\t\tAbility Bonus: 14',
                '\t\t\tOther Bonus: 0',
                '\t\t\tArmor Check Penalty: -7',
                '\t\t\tClass Skill',
                '\t\tskill 3 (focus)',
                '\t\t\tTotal Bonus: 247 *',
                '\t\t\tRanks: 2.5',
                '\t\t\tAbility Bonus: -1',
                '\t\t\tOther Bonus: 4',
                '\t\t\tArmor Check Penalty: 0',
                '\tFeats:',
                '\t\tRacial:',
                '\t\t\tracial feat 2',
                '\t\t\tracial feat 3',
                '\t\tClass:',
                '\t\t\tclass feat 2',
                '\t\t\tclass feat 3',
                '\t\tAdditional:',
                '\t\t\tadditional feat 2',
                '\t\t\tadditional feat 3',
                '\tInteresting Trait: None',
                '\tEquipment:',
                '\t\tPrimary Hand: None',
                '\t\tOff Hand: None',
                '\t\tArmor: None',
                '\t\tTreasure: None',
                '\t' + 'Combat:',
                '\t\t' + 'Adjusted Dexterity Bonus: 4',
                '\t\t' + 'Armor Class: 8 *',
                '\t\t\t' + 'Flat-Footed: 13',
                '\t\t\t' + 'Touch: 35',
                '\t\t' + 'Base Attack:',
                '\t\t\t' + 'Melee: +22/+17/+12/+7/+2',
                '\t\t\t' + 'Ranged: +23/+18/+13/+8/+3',
                '\t\t' + 'Hit Points: 3457',
                '\t\t' + 'Initiative Bonus: 4568',
                '\t\t' + 'Saving Throws:',
                '\t\t\t' + 'Fortitude: 57',
                '\t\t\t' + 'Reflex: 79',
                '\t\t\t' + 'Will: 68',
                '',
            ];
    
            expectLines(lines, expected);
        });
    
        it('formats circumstantial base attack bonus', () => {
            character.combat.baseAttack.circumstantialBonus = true;
    
            var formattedCharacter = pipe.transform(character);
            var lines = formattedCharacter.split('\r\n');
    
            var expected = [
                'character summary 1:',
                '\tChallenge Rating: 90',
                '\tAlignment: alignment 1',
                '\tclass summary 1',
                '\trace summary 1',
                '\t\tLand Speed: 31 feet per round (fast 1)',
                '\t\tSize: size 1',
                '\t\tAge: 19 Years (adult 1)',
                '\t\tMaximum Age: 1801 Years (natural causes 1)',
                '\t\tHeight: 4.08 feet filtered (tall 1)',
                '\t\tWeight: 101 Pounds (heavy 1)',
                '\tAbilities:',
                '\t\tStrength: 3 (-3)',
                '\t\tConstitution: 27 (14)',
                '\t\tDexterity: 7 (-1)',
                '\t\tIntelligence: 91 (46)',
                '\t\tWisdom: 11 (1)',
                '\t\tCharisma: 10 (0)',
                '\tLanguages:',
                '\t\tEnglish 1',
                '\t\tGerman 1',
                '\tSkills:',
                '\t\tskill 2',
                '\t\t\tTotal Bonus: 136',
                '\t\t\tRanks: 5',
                '\t\t\tAbility Bonus: 14',
                '\t\t\tOther Bonus: 0',
                '\t\t\tArmor Check Penalty: -7',
                '\t\t\tClass Skill',
                '\t\tskill 3 (focus)',
                '\t\t\t' + 'Total Bonus: 247 *',
                '\t\t\t' + 'Ranks: 2.5',
                '\t\t\t' + 'Ability Bonus: -1',
                '\t\t\t' + 'Other Bonus: 4',
                '\t\t\t' + 'Armor Check Penalty: 0',
                '\tFeats:',
                '\t\tRacial:',
                '\t\t\tracial feat 2',
                '\t\t\tracial feat 3',
                '\t\tClass:',
                '\t\t\tclass feat 2',
                '\t\t\tclass feat 3',
                '\t\tAdditional:',
                '\t\t\tadditional feat 2',
                '\t\t\tadditional feat 3',
                '\tInteresting Trait: None',
                '\tEquipment:',
                '\t\tPrimary Hand: None',
                '\t\tOff Hand: None',
                '\t\tArmor: None',
                '\t\tTreasure: None',
                '\tCombat:',
                '\t\tAdjusted Dexterity Bonus: 4',
                '\t\tArmor Class: 8',
                '\t\t\tFlat-Footed: 13',
                '\t\t\tTouch: 35',
                '\t\tBase Attack:',
                '\t\t\tMelee: +22/+17/+12/+7/+2 *',
                '\t\t\tRanged: +23/+18/+13/+8/+3 *',
                '\t\tHit Points: 3457',
                '\t\tInitiative Bonus: 4568',
                '\t\tSaving Throws:',
                '\t\t\tFortitude: 57',
                '\t\t\tReflex: 79',
                '\t\t\tWill: 68',
                '',
            ];
    
            expectLines(lines, expected);
        });
    
        it('formats negative base attack bonus', () => {
            character.combat.baseAttack.allMeleeBonuses = [-2]
            character.combat.baseAttack.allRangedBonuses = [-1];
    
            var formattedCharacter = pipe.transform(character);
            var lines = formattedCharacter.split('\r\n');
    
            var expected = [
                'character summary 1:',
                '\tChallenge Rating: 90',
                '\tAlignment: alignment 1',
                '\tclass summary 1',
                '\trace summary 1',
                '\t\tLand Speed: 31 feet per round (fast 1)',
                '\t\tSize: size 1',
                '\t\tAge: 19 Years (adult 1)',
                '\t\tMaximum Age: 1801 Years (natural causes 1)',
                '\t\tHeight: 4.08 feet filtered (tall 1)',
                '\t\tWeight: 101 Pounds (heavy 1)',
                '\tAbilities:',
                '\t\tStrength: 3 (-3)',
                '\t\tConstitution: 27 (14)',
                '\t\tDexterity: 7 (-1)',
                '\t\tIntelligence: 91 (46)',
                '\t\tWisdom: 11 (1)',
                '\t\tCharisma: 10 (0)',
                '\tLanguages:',
                '\t\tEnglish 1',
                '\t\tGerman 1',
                '\tSkills:',
                '\t\tskill 2',
                '\t\t\tTotal Bonus: 136',
                '\t\t\tRanks: 5',
                '\t\t\tAbility Bonus: 14',
                '\t\t\tOther Bonus: 0',
                '\t\t\tArmor Check Penalty: -7',
                '\t\t\tClass Skill',
                '\t\tskill 3 (focus)',
                '\t\t\t' + 'Total Bonus: 247 *',
                '\t\t\t' + 'Ranks: 2.5',
                '\t\t\t' + 'Ability Bonus: -1',
                '\t\t\t' + 'Other Bonus: 4',
                '\t\t\t' + 'Armor Check Penalty: 0',
                '\tFeats:',
                '\t\tRacial:',
                '\t\t\tracial feat 2',
                '\t\t\tracial feat 3',
                '\t\tClass:',
                '\t\t\tclass feat 2',
                '\t\t\tclass feat 3',
                '\t\tAdditional:',
                '\t\t\tadditional feat 2',
                '\t\t\tadditional feat 3',
                '\tInteresting Trait: None',
                '\tEquipment:',
                '\t\tPrimary Hand: None',
                '\t\tOff Hand: None',
                '\t\tArmor: None',
                '\t\tTreasure: None',
                '\tCombat:',
                '\t\tAdjusted Dexterity Bonus: 4',
                '\t\tArmor Class: 8',
                '\t\t\tFlat-Footed: 13',
                '\t\t\tTouch: 35',
                '\t\tBase Attack:',
                '\t\t\tMelee: -2',
                '\t\t\tRanged: -1',
                '\t\tHit Points: 3457',
                '\t\tInitiative Bonus: 4568',
                '\t\tSaving Throws:',
                '\t\t\tFortitude: 57',
                '\t\t\tReflex: 79',
                '\t\t\tWill: 68',
                '',
            ];
    
            expectLines(lines, expected);
        });
    
        it('formats circumstantial save bonus', () => {
            character.combat.savingThrows.circumstantialBonus = true;
    
            var formattedCharacter = pipe.transform(character);
            var lines = formattedCharacter.split('\r\n');
    
            var expected = [
                'character summary 1:',
                '\tChallenge Rating: 90',
                '\tAlignment: alignment 1',
                '\tclass summary 1',
                '\trace summary 1',
                '\t\tLand Speed: 31 feet per round (fast 1)',
                '\t\tSize: size 1',
                '\t\tAge: 19 Years (adult 1)',
                '\t\tMaximum Age: 1801 Years (natural causes 1)',
                '\t\tHeight: 4.08 feet filtered (tall 1)',
                '\t\tWeight: 101 Pounds (heavy 1)',
                '\tAbilities:',
                '\t\tStrength: 3 (-3)',
                '\t\tConstitution: 27 (14)',
                '\t\tDexterity: 7 (-1)',
                '\t\tIntelligence: 91 (46)',
                '\t\tWisdom: 11 (1)',
                '\t\tCharisma: 10 (0)',
                '\tLanguages:',
                '\t\tEnglish 1',
                '\t\tGerman 1',
                '\tSkills:',
                '\t\tskill 2',
                '\t\t\tTotal Bonus: 136',
                '\t\t\tRanks: 5',
                '\t\t\tAbility Bonus: 14',
                '\t\t\tOther Bonus: 0',
                '\t\t\tArmor Check Penalty: -7',
                '\t\t\tClass Skill',
                '\t\tskill 3 (focus)',
                '\t\t\t' + 'Total Bonus: 247 *',
                '\t\t\t' + 'Ranks: 2.5',
                '\t\t\t' + 'Ability Bonus: -1',
                '\t\t\t' + 'Other Bonus: 4',
                '\t\t\t' + 'Armor Check Penalty: 0',
                '\tFeats:',
                '\t\tRacial:',
                '\t\t\tracial feat 2',
                '\t\t\tracial feat 3',
                '\t\tClass:',
                '\t\t\tclass feat 2',
                '\t\t\tclass feat 3',
                '\t\tAdditional:',
                '\t\t\tadditional feat 2',
                '\t\t\tadditional feat 3',
                '\tInteresting Trait: None',
                '\tEquipment:',
                '\t\tPrimary Hand: None',
                '\t\tOff Hand: None',
                '\t\tArmor: None',
                '\t\tTreasure: None',
                '\t' + 'Combat:',
                '\t\t' + 'Adjusted Dexterity Bonus: 4',
                '\t\t' + 'Armor Class: 8',
                '\t\t\t' + 'Flat-Footed: 13',
                '\t\t\t' + 'Touch: 35',
                '\t\t' + 'Base Attack:',
                '\t\t\t' + 'Melee: +22/+17/+12/+7/+2',
                '\t\t\t' + 'Ranged: +23/+18/+13/+8/+3',
                '\t\t' + 'Hit Points: 3457',
                '\t\t' + 'Initiative Bonus: 4568',
                '\t\t' + 'Saving Throws:',
                '\t\t\t' + 'Fortitude: 57',
                '\t\t\t' + 'Reflex: 79',
                '\t\t\t' + 'Will: 68',
                '\t\t\t' + 'Circumstantial Bonus',
                '',
            ];
    
            expectLines(lines, expected);
        });
    
        it('formats full character', () => {
            character.class.specialistFields = ["specialist field 1", "specialist field 2" ];
            character.class.prohibitedFields = ["prohibited field 1", "prohibited field 2" ];
            character.race.metarace = "metarace";
            character.race.metaraceSpecies = "metarace species";
            character.race.hasWings = true;
            character.race.aerialSpeed.value = 12345;
            character.race.aerialSpeed.unit = 'feet per round';
            character.race.aerialSpeed.description = 'supafly';
            character.race.swimSpeed.value = 579;
            character.race.swimSpeed.unit = 'feet per round';
            character.race.swimSpeed.description = 'watery';
    
            character.feats.racial[0].foci = [ "focus 1", "focus 2" ];
            character.feats.racial[0].frequency.quantity = 34567;
            character.feats.racial[0].frequency.timePeriod = "sometimes";
            character.feats.racial[0].power = 23456;
            character.feats.class[0].foci = ["focus 3", "focus 4"];
            character.feats.class[0].frequency.quantity = 135;
            character.feats.class[0].frequency.timePeriod = "all the time";
            character.feats.class[0].power = 246;
            character.feats.additional[0].foci = ["focus 5", "focus 6"];
            character.feats.additional[0].frequency.quantity = 357;
            character.feats.additional[0].frequency.timePeriod = "when the sun rises";
            character.feats.additional[0].power = 468;
    
            character.interestingTrait = "interesting trait";
    
            character.magic.spellsPerDay = [
                new SpellQuantity('my source', 0, 9, false),
                new SpellQuantity('my source', 1, 8, true),
                new SpellQuantity('my other source', 1, 7, false),
                new SpellQuantity('my other source', 2, 6, true),
            ];
    
            character.magic.knownSpells = [
                new Spell('my source', 0, 'spell 0.1', []),
                new Spell('my source', 0, 'spell 0.2', []),
                new Spell('my source', 1, 'spell 1.1', []),
                new Spell('my source', 1, 'spell 1.2', []),
                new Spell('my other source', 1, 'spell 2.1', []),
                new Spell('my other source', 1, 'spell 2.2', []),
                new Spell('my other source', 2, 'spell 3.1', []),
                new Spell('my other source', 2, 'spell 3.2', []),
            ];
    
            character.magic.preparedSpells = [
                new Spell('my source', 0, 'prepared spell 0.1', []),
                new Spell('my source', 0, 'prepared spell 0.1', []),
                new Spell('my source', 0, 'prepared spell 0.2', []),
                new Spell('my source', 1, 'prepared spell 1.1', []),
                new Spell('my source', 1, 'prepared spell 1.2', []),
                new Spell('my source', 1, 'prepared spell 1.2', []),
                new Spell('my other source', 1, 'prepared spell 2.1', []),
                new Spell('my other source', 1, 'prepared spell 2.2', []),
                new Spell('my other source', 1, 'prepared spell 2.2', []),
                new Spell('my other source', 2, 'prepared spell 3.1', []),
                new Spell('my other source', 2, 'prepared spell 3.1', []),
                new Spell('my other source', 2, 'prepared spell 3.2', []),
            ];
    
            character.magic.arcaneSpellFailure = 12;
            character.magic.animal = "animal";
            character.equipment.primaryHand = createWeapon('primary weapon');
            character.equipment.offHand = createItem('off-hand item');
            character.equipment.armor = createArmor('armor');
            character.equipment.treasure = createTreasure();
            character.combat.armorClass.circumstantialBonus = true;
            character.combat.baseAttack.circumstantialBonus = true;
            character.combat.savingThrows.circumstantialBonus = true;
    
            var formattedCharacter = pipe.transform(character);
            var lines = formattedCharacter.split('\r\n');
    
            var expected = [
                'character summary 1:',
                '\tChallenge Rating: 90',
                '\tAlignment: alignment 1',
                '\tclass summary 1',
                '\t\tSpecialist:',
                '\t\t\tspecialist field 1',
                '\t\t\tspecialist field 2',
                '\t\tProhibited:',
                '\t\t\tprohibited field 1',
                '\t\t\tprohibited field 2',
                '\t' + 'race summary 1',
                '\t\t' + 'Metarace Species: metarace species',
                '\t\t' + 'Land Speed: 31 feet per round (fast 1)',
                '\t\t' + 'Aerial Speed: 12345 feet per round (supafly)',
                '\t\t' + 'Swim Speed: 579 feet per round (watery)',
                '\t\t' + 'Size: size 1',
                '\t\t' + 'Age: 19 Years (adult 1)',
                '\t\t' + 'Maximum Age: 1801 Years (natural causes 1)',
                '\t\t' + 'Height: 4.08 feet filtered (tall 1)',
                '\t\t' + 'Weight: 101 Pounds (heavy 1)',
                '\t\t' + 'Has Wings',
                '\tAbilities:',
                '\t\tStrength: 3 (-3)',
                '\t\tConstitution: 27 (14)',
                '\t\tDexterity: 7 (-1)',
                '\t\tIntelligence: 91 (46)',
                '\t\tWisdom: 11 (1)',
                '\t\tCharisma: 10 (0)',
                '\tLanguages:',
                '\t\tEnglish 1',
                '\t\tGerman 1',
                '\tSkills:',
                '\t\tskill 2',
                '\t\t\tTotal Bonus: 136',
                '\t\t\tRanks: 5',
                '\t\t\tAbility Bonus: 14',
                '\t\t\tOther Bonus: 0',
                '\t\t\tArmor Check Penalty: -7',
                '\t\t\tClass Skill',
                '\t\tskill 3 (focus)',
                '\t\t\t' + 'Total Bonus: 247 *',
                '\t\t\t' + 'Ranks: 2.5',
                '\t\t\t' + 'Ability Bonus: -1',
                '\t\t\t' + 'Other Bonus: 4',
                '\t\t\t' + 'Armor Check Penalty: 0',
                '\t' + 'Feats:',
                '\t\t' + 'Racial:',
                '\t\t\t' + 'racial feat 2',
                '\t\t\t\t' + 'Foci:',
                '\t\t\t\t\t' + 'focus 1',
                '\t\t\t\t\t' + 'focus 2',
                '\t\t\t\t' + 'Frequency: 34567/sometimes',
                '\t\t\t\t' + 'Power: 23456',
                '\t\t\t' + 'racial feat 3',
                '\t\t' + 'Class:',
                '\t\t\t' + 'class feat 2',
                '\t\t\t\t' + 'Foci:',
                '\t\t\t\t\t' + 'focus 3',
                '\t\t\t\t\t' + 'focus 4',
                '\t\t\t\t' + 'Frequency: 135/all the time',
                '\t\t\t\t' + 'Power: 246',
                '\t\t\t' + 'class feat 3',
                '\t\t' + 'Additional:',
                '\t\t\t' + 'additional feat 2',
                '\t\t\t\t' + 'Foci:',
                '\t\t\t\t\t' + 'focus 5',
                '\t\t\t\t\t' + 'focus 6',
                '\t\t\t\t' + 'Frequency: 357/when the sun rises',
                '\t\t\t\t' + 'Power: 468',
                '\t\t\t' + 'additional feat 3',
                '\t' + 'Interesting Trait: interesting trait',
                '\t' + 'Spells Per Day:',
                '\t\t' + 'my source lvl 0: 9',
                '\t\t' + 'my source lvl 1: 8 + 1',
                '\t\t' + 'my other source lvl 1: 7',
                '\t\t' + 'my other source lvl 2: 6 + 1',
                '\t' + 'Known Spells:',
                '\t\t' + 'first spell group:',
                '\t\t\t' + 'spell 0.1',
                '\t\t' + 'other spell group:',
                '\t\t\t' + 'spell 0.2',
                '\t\t\t' + 'spell 1.1',
                '\t\t\t' + 'spell 1.2',
                '\t\t\t' + 'spell 2.1',
                '\t\t\t' + 'spell 2.2',
                '\t\t\t' + 'spell 3.1',
                '\t\t\t' + 'spell 3.2',
                '\t' + 'Prepared Spells:',
                '\t\t' + 'first spell group:',
                '\t\t\t' + 'prepared spell 0.1',
                '\t\t' + 'other spell group:',
                '\t\t\t' + 'prepared spell 0.1',
                '\t\t\t' + 'prepared spell 0.2',
                '\t\t\t' + 'prepared spell 1.1',
                '\t\t\t' + 'prepared spell 1.2',
                '\t\t\t' + 'prepared spell 1.2',
                '\t\t\t' + 'prepared spell 2.1',
                '\t\t\t' + 'prepared spell 2.2',
                '\t\t\t' + 'prepared spell 2.2',
                '\t\t\t' + 'prepared spell 3.1',
                '\t\t\t' + 'prepared spell 3.1',
                '\t\t\t' + 'prepared spell 3.2',
                '\t' + 'Arcane Spell Failure: 12%',
                '\t' + 'Animal: animal',
                '\tEquipment:',
                '\t\t' + 'Primary Hand:',
                '\t\t\t' + 'primary weapon description',
                '\t\t\t\t' + 'formatted',
                '\t\t' + 'Off Hand:',
                '\t\t\t' + 'off-hand item description',
                '\t\t\t\t' + 'formatted',
                '\t\t' + 'Armor:',
                '\t\t\t' + 'armor description',
                '\t\t\t\t' + 'formatted',
                '\t\t' + 'Treasure:',
                '\t\t\t' + 'formatted treasure:',
                '\t\t\t\t' + 'coins: 9',
                '\t\t\t\t' + 'goods: 2',
                '\t\t\t\t' + 'items: 3',
                '\t' + 'Combat:',
                '\t\t' + 'Adjusted Dexterity Bonus: 4',
                '\t\t' + 'Armor Class: 8 *',
                '\t\t\t' + 'Flat-Footed: 13',
                '\t\t\t' + 'Touch: 35',
                '\t\t' + 'Base Attack:',
                '\t\t\t' + 'Melee: +22/+17/+12/+7/+2 *',
                '\t\t\t' + 'Ranged: +23/+18/+13/+8/+3 *',
                '\t\t' + 'Hit Points: 3457',
                '\t\t' + 'Initiative Bonus: 4568',
                '\t\t' + 'Saving Throws:',
                '\t\t\t' + 'Fortitude: 57',
                '\t\t\t' + 'Reflex: 79',
                '\t\t\t' + 'Will: 68',
                '\t\t\t' + 'Circumstantial Bonus',
                '',
            ];
    
            expectLines(lines, expected);
        });
    
        it('formats full character with prefix', () => {
            character.class.specialistFields = ["specialist field 1", "specialist field 2"];
            character.class.prohibitedFields = ["prohibited field 1", "prohibited field 2"];
            character.race.metarace = "metarace";
            character.race.metaraceSpecies = "metarace species";
            character.race.hasWings = true;
            character.race.aerialSpeed.value = 12345;
            character.race.aerialSpeed.unit = 'feet per round';
            character.race.aerialSpeed.description = 'supafly';
            character.race.swimSpeed.value = 579;
            character.race.swimSpeed.unit = 'feet per round';
            character.race.swimSpeed.description = 'watery';
    
            character.feats.racial[0].foci = ["focus 1", "focus 2"];
            character.feats.racial[0].frequency.quantity = 34567;
            character.feats.racial[0].frequency.timePeriod = "sometimes";
            character.feats.racial[0].power = 23456;
            character.feats.class[0].foci = ["focus 3", "focus 4"];
            character.feats.class[0].frequency.quantity = 135;
            character.feats.class[0].frequency.timePeriod = "all the time";
            character.feats.class[0].power = 246;
            character.feats.additional[0].foci = ["focus 5", "focus 6"];
            character.feats.additional[0].frequency.quantity = 357;
            character.feats.additional[0].frequency.timePeriod = "when the sun rises";
            character.feats.additional[0].power = 468;
    
            character.interestingTrait = "interesting trait";
    
            character.magic.spellsPerDay = [
                new SpellQuantity('my source', 0, 9, false),
                new SpellQuantity('my source', 1, 8, true),
                new SpellQuantity('my other source', 1, 7, false),
                new SpellQuantity('my other source', 2, 6, true),
            ];
    
            character.magic.knownSpells = [
                new Spell('my source', 0, 'spell 0.1', []),
                new Spell('my source', 0, 'spell 0.2', []),
                new Spell('my source', 1, 'spell 1.1', []),
                new Spell('my source', 1, 'spell 1.2', []),
                new Spell('my other source', 1, 'spell 2.1', []),
                new Spell('my other source', 1, 'spell 2.2', []),
                new Spell('my other source', 2, 'spell 3.1', []),
                new Spell('my other source', 2, 'spell 3.2', []),
            ];
    
            character.magic.preparedSpells = [
                new Spell('my source', 0, 'prepared spell 0.1', []),
                new Spell('my source', 0, 'prepared spell 0.1', []),
                new Spell('my source', 0, 'prepared spell 0.2', []),
                new Spell('my source', 1, 'prepared spell 1.1', []),
                new Spell('my source', 1, 'prepared spell 1.2', []),
                new Spell('my source', 1, 'prepared spell 1.2', []),
                new Spell('my other source', 1, 'prepared spell 2.1', []),
                new Spell('my other source', 1, 'prepared spell 2.2', []),
                new Spell('my other source', 1, 'prepared spell 2.2', []),
                new Spell('my other source', 2, 'prepared spell 3.1', []),
                new Spell('my other source', 2, 'prepared spell 3.1', []),
                new Spell('my other source', 2, 'prepared spell 3.2', []),
            ];
    
            character.magic.arcaneSpellFailure = 12;
            character.magic.animal = "animal";
            character.equipment.primaryHand = createWeapon('primary weapon');
            character.equipment.offHand = createItem('off-hand item');
            character.equipment.armor = createArmor('armor');
            character.equipment.treasure = createTreasure();
            character.combat.armorClass.circumstantialBonus = true;
            character.combat.baseAttack.circumstantialBonus = true;
            character.combat.savingThrows.circumstantialBonus = true;
    
            var formattedCharacter = pipe.transform(character, '\t');
            var lines = formattedCharacter.split('\r\n');
    
            var expected = [
                '\t' + 'character summary 1:',
                '\t\t' + 'Challenge Rating: 90',
                '\t\t' + 'Alignment: alignment 1',
                '\t\t' + 'class summary 1',
                '\t\t\t' + 'Specialist:',
                '\t\t\t\t' + 'specialist field 1',
                '\t\t\t\t' + 'specialist field 2',
                '\t\t\t' + 'Prohibited:',
                '\t\t\t\t' + 'prohibited field 1',
                '\t\t\t\t' + 'prohibited field 2',
                '\t\t' + 'race summary 1',
                '\t\t\t' + 'Metarace Species: metarace species',
                '\t\t\t' + 'Land Speed: 31 feet per round (fast 1)',
                '\t\t\t' + 'Aerial Speed: 12345 feet per round (supafly)',
                '\t\t\t' + 'Swim Speed: 579 feet per round (watery)',
                '\t\t\t' + 'Size: size 1',
                '\t\t\t' + 'Age: 19 Years (adult 1)',
                '\t\t\t' + 'Maximum Age: 1801 Years (natural causes 1)',
                '\t\t\t' + 'Height: 4.08 feet filtered (tall 1)',
                '\t\t\t' + 'Weight: 101 Pounds (heavy 1)',
                '\t\t\t' + 'Has Wings',
                '\t\t' + 'Abilities:',
                '\t\t\t' + 'Strength: 3 (-3)',
                '\t\t\t' + 'Constitution: 27 (14)',
                '\t\t\t' + 'Dexterity: 7 (-1)',
                '\t\t\t' + 'Intelligence: 91 (46)',
                '\t\t\t' + 'Wisdom: 11 (1)',
                '\t\t\t' + 'Charisma: 10 (0)',
                '\t\t' + 'Languages:',
                '\t\t\t' + 'English 1',
                '\t\t\t' + 'German 1',
                '\t\tSkills:',
                '\t\t\tskill 2',
                '\t\t\t\tTotal Bonus: 136',
                '\t\t\t\tRanks: 5',
                '\t\t\t\tAbility Bonus: 14',
                '\t\t\t\tOther Bonus: 0',
                '\t\t\t\tArmor Check Penalty: -7',
                '\t\t\t\tClass Skill',
                '\t\t\tskill 3 (focus)',
                '\t\t\t\t' + 'Total Bonus: 247 *',
                '\t\t\t\t' + 'Ranks: 2.5',
                '\t\t\t\t' + 'Ability Bonus: -1',
                '\t\t\t\t' + 'Other Bonus: 4',
                '\t\t\t\t' + 'Armor Check Penalty: 0',
                '\t\t' + 'Feats:',
                '\t\t\t' + 'Racial:',
                '\t\t\t\t' + 'racial feat 2',
                '\t\t\t\t\t' + 'Foci:',
                '\t\t\t\t\t\t' + 'focus 1',
                '\t\t\t\t\t\t' + 'focus 2',
                '\t\t\t\t\t' + 'Frequency: 34567/sometimes',
                '\t\t\t\t\t' + 'Power: 23456',
                '\t\t\t\t' + 'racial feat 3',
                '\t\t\t' + 'Class:',
                '\t\t\t\t' + 'class feat 2',
                '\t\t\t\t\t' + 'Foci:',
                '\t\t\t\t\t\t' + 'focus 3',
                '\t\t\t\t\t\t' + 'focus 4',
                '\t\t\t\t\t' + 'Frequency: 135/all the time',
                '\t\t\t\t\t' + 'Power: 246',
                '\t\t\t\t' + 'class feat 3',
                '\t\t\t' + 'Additional:',
                '\t\t\t\t' + 'additional feat 2',
                '\t\t\t\t\t' + 'Foci:',
                '\t\t\t\t\t\t' + 'focus 5',
                '\t\t\t\t\t\t' + 'focus 6',
                '\t\t\t\t\t' + 'Frequency: 357/when the sun rises',
                '\t\t\t\t\t' + 'Power: 468',
                '\t\t\t\t' + 'additional feat 3',
                '\t\t' + 'Interesting Trait: interesting trait',
                '\t\t' + 'Spells Per Day:',
                '\t\t\t' + 'my source lvl 0: 9',
                '\t\t\t' + 'my source lvl 1: 8 + 1',
                '\t\t\t' + 'my other source lvl 1: 7',
                '\t\t\t' + 'my other source lvl 2: 6 + 1',
                '\t\t' + 'Known Spells:',
                '\t\t\t' + 'first spell group:',
                '\t\t\t\t' + 'spell 0.1',
                '\t\t\t' + 'other spell group:',
                '\t\t\t\t' + 'spell 0.2',
                '\t\t\t\t' + 'spell 1.1',
                '\t\t\t\t' + 'spell 1.2',
                '\t\t\t\t' + 'spell 2.1',
                '\t\t\t\t' + 'spell 2.2',
                '\t\t\t\t' + 'spell 3.1',
                '\t\t\t\t' + 'spell 3.2',
                '\t\t' + 'Prepared Spells:',
                '\t\t\t' + 'first spell group:',
                '\t\t\t\t' + 'prepared spell 0.1',
                '\t\t\t' + 'other spell group:',
                '\t\t\t\t' + 'prepared spell 0.1',
                '\t\t\t\t' + 'prepared spell 0.2',
                '\t\t\t\t' + 'prepared spell 1.1',
                '\t\t\t\t' + 'prepared spell 1.2',
                '\t\t\t\t' + 'prepared spell 1.2',
                '\t\t\t\t' + 'prepared spell 2.1',
                '\t\t\t\t' + 'prepared spell 2.2',
                '\t\t\t\t' + 'prepared spell 2.2',
                '\t\t\t\t' + 'prepared spell 3.1',
                '\t\t\t\t' + 'prepared spell 3.1',
                '\t\t\t\t' + 'prepared spell 3.2',
                '\t\t' + 'Arcane Spell Failure: 12%',
                '\t\t' + 'Animal: animal',
                '\t\t' + 'Equipment:',
                '\t\t\t' + 'Primary Hand:',
                '\t\t\t\t' + 'primary weapon description',
                '\t\t\t\t\t' + 'formatted',
                '\t\t\t' + 'Off Hand:',
                '\t\t\t\t' + 'off-hand item description',
                '\t\t\t\t\t' + 'formatted',
                '\t\t\t' + 'Armor:',
                '\t\t\t\t' + 'armor description',
                '\t\t\t\t\t' + 'formatted',
                '\t\t\t' + 'Treasure:',
                '\t\t\t\t' + 'formatted treasure:',
                '\t\t\t\t\t' + 'coins: 9',
                '\t\t\t\t\t' + 'goods: 2',
                '\t\t\t\t\t' + 'items: 3',
                '\t\t' + 'Combat:',
                '\t\t\t' + 'Adjusted Dexterity Bonus: 4',
                '\t\t\t' + 'Armor Class: 8 *',
                '\t\t\t\t' + 'Flat-Footed: 13',
                '\t\t\t\t' + 'Touch: 35',
                '\t\t\t' + 'Base Attack:',
                '\t\t\t\t' + 'Melee: +22/+17/+12/+7/+2 *',
                '\t\t\t\t' + 'Ranged: +23/+18/+13/+8/+3 *',
                '\t\t\t' + 'Hit Points: 3457',
                '\t\t\t' + 'Initiative Bonus: 4568',
                '\t\t\t' + 'Saving Throws:',
                '\t\t\t\t' + 'Fortitude: 57',
                '\t\t\t\t' + 'Reflex: 79',
                '\t\t\t\t' + 'Will: 68',
                '\t\t\t\t' + 'Circumstantial Bonus',
                '',
            ];
    
            expectLines(lines, expected);
        });
    
        it('formats undead character', () => {
            character.race.metarace = "undead";
            character.abilities.Constitution = null;
            character.combat.savingThrows.hasFortitudeSave = false;
    
            var formattedCharacter = pipe.transform(character);
            var lines = formattedCharacter.split('\r\n');
    
            var expected = [
                'character summary 1:',
                '\t' + 'Challenge Rating: 90',
                '\t' + 'Alignment: alignment 1',
                '\t' + 'class summary 1',
                '\t' + 'race summary 1',
                '\t\t' + 'Land Speed: 31 feet per round (fast 1)',
                '\t\t' + 'Size: size 1',
                '\t\t' + 'Age: 19 Years (adult 1)',
                '\t\t' + 'Maximum Age: 1801 Years (natural causes 1)',
                '\t\t' + 'Height: 4.08 feet filtered (tall 1)',
                '\t\t' + 'Weight: 101 Pounds (heavy 1)',
                '\t' + 'Abilities:',
                '\t\t' + 'Strength: 3 (-3)',
                '\t\t' + 'Dexterity: 7 (-1)',
                '\t\t' + 'Intelligence: 91 (46)',
                '\t\t' + 'Wisdom: 11 (1)',
                '\t\t' + 'Charisma: 10 (0)',
                '\t' + 'Languages:',
                '\t\t' + 'English 1',
                '\t\t' + 'German 1',
                '\t' + 'Skills:',
                '\t\t' + 'skill 2',
                '\t\t\t' + 'Total Bonus: 136',
                '\t\t\t' + 'Ranks: 5',
                '\t\t\t' + 'Ability Bonus: 14',
                '\t\t\t' + 'Other Bonus: 0',
                '\t\t\t' + 'Armor Check Penalty: -7',
                '\t\t\t' + 'Class Skill',
                '\t\t' + 'skill 3 (focus)',
                '\t\t\t' + 'Total Bonus: 247 *',
                '\t\t\t' + 'Ranks: 2.5',
                '\t\t\t' + 'Ability Bonus: -1',
                '\t\t\t' + 'Other Bonus: 4',
                '\t\t\t' + 'Armor Check Penalty: 0',
                '\t' + 'Feats:',
                '\t\t' + 'Racial:',
                '\t\t\t' + 'racial feat 2',
                '\t\t\t' + 'racial feat 3',
                '\t\t' + 'Class:',
                '\t\t\t' + 'class feat 2',
                '\t\t\t' + 'class feat 3',
                '\t\t' + 'Additional:',
                '\t\t\t' + 'additional feat 2',
                '\t\t\t' + 'additional feat 3',
                '\t' + 'Interesting Trait: None',
                '\t' + 'Equipment:',
                '\t\tPrimary Hand: None',
                '\t\tOff Hand: None',
                '\t\tArmor: None',
                '\t\tTreasure: None',
                '\tCombat:',
                '\t\tAdjusted Dexterity Bonus: 4',
                '\t\tArmor Class: 8',
                '\t\t\tFlat-Footed: 13',
                '\t\t\tTouch: 35',
                '\t\tBase Attack:',
                '\t\t\tMelee: +22/+17/+12/+7/+2',
                '\t\t\tRanged: +23/+18/+13/+8/+3',
                '\t\tHit Points: 3457',
                '\t\tInitiative Bonus: 4568',
                '\t\tSaving Throws:',
                '\t\t\tReflex: 79',
                '\t\t\tWill: 68',
                '',
            ];
    
            expectLines(lines, expected);
        });
    });
});