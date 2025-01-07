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
import { MeasurementPipe } from "./measurement.pipe";
import { Measurement } from "../models/measurement.model";
import { Frequency } from "../models/frequency.model";
import { FrequencyPipe } from "./frequency.pipe";
import { SpellQuantityPipe } from "./spellQuantity.pipe";
import { TestHelper } from "../../testHelper.spec";

describe('Character Pipe', () => {
    describe('unit', () => {
        let pipe: CharacterPipe;
        let itemPipeSpy: jasmine.SpyObj<ItemPipe>;
        let treasurePipeSpy: jasmine.SpyObj<TreasurePipe>;
        let bonusPipeSpy: jasmine.SpyObj<BonusPipe>;
        let bonusesPipeSpy: jasmine.SpyObj<BonusesPipe>;
        let measurementPipeSpy: jasmine.SpyObj<MeasurementPipe>;
        let frequencyPipeSpy: jasmine.SpyObj<FrequencyPipe>;
        let spellQuantityPipeSpy: jasmine.SpyObj<SpellQuantityPipe>;
        let spellGroupServiceSpy: jasmine.SpyObj<SpellGroupService>;

        let character: Character;
    
        beforeEach(() => {
            itemPipeSpy = jasmine.createSpyObj('ItemPipe', ['transform']);
            treasurePipeSpy = jasmine.createSpyObj('TreasurePipe', ['transform']);
            bonusPipeSpy = jasmine.createSpyObj('BonusPipe', ['transform']);
            bonusesPipeSpy = jasmine.createSpyObj('BonusesPipe', ['transform']);
            measurementPipeSpy = jasmine.createSpyObj('MeasurementPipe', ['transform']);
            frequencyPipeSpy = jasmine.createSpyObj('FrequencyPipe', ['transform']);
            spellQuantityPipeSpy = jasmine.createSpyObj('SpellQuantityPipe', ['transform']);
            spellGroupServiceSpy = jasmine.createSpyObj('SpellGroupService', ['sortIntoGroups', 'getSpellGroupName']);
            character = createCharacter();

            pipe = new CharacterPipe(
                itemPipeSpy, 
                treasurePipeSpy, 
                bonusPipeSpy, 
                bonusesPipeSpy, 
                measurementPipeSpy,
                frequencyPipeSpy,
                spellQuantityPipeSpy, 
                spellGroupServiceSpy);

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
            frequencyPipeSpy.transform.and.callFake((input: Frequency) => {
                return `${input.quantity} per ${input.timePeriod} formatted`;
            });
            spellQuantityPipeSpy.transform.and.callFake((input: SpellQuantity) => {
                return `${spellGroupServiceSpy.getSpellGroupName(input.level, input.source)}: ${input.quantity} formatted`;
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

            var formattedItem = prefix + item.summary + '\r\n';
            formattedItem += prefix + '\tformatted\r\n';

            return formattedItem;
        }

        function createCharacter(): Character {
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
            item.summary = `${name} summary`;
            return item;
        }
    
        function createWeapon(name: string): Weapon {
            const weapon = new Weapon(name, 'Weapon');
            weapon.summary = `${name} summary`;
            weapon.damageDescription = '9d2 damage';
    
            return weapon;
        }
    
        function createArmor(name: string): Armor {
            const armor = new Armor(name, 'Armor');
            armor.summary = `${name} summary`;
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
                'character summary:',
                '\tCombat:',
                '\t\tAdjusted Dexterity Bonus: 3 formatted',
                '\t\tArmor Class: 7 formatted',
                '\t\t\tFlat-Footed: 12',
                '\t\t\tTouch: 34',
                '\t\tBase Attack:',
                '\t\t\tMelee: 21 formatted x5',
                '\t\t\tRanged: 22 formatted x5',
                '\t\tHit Points: 3456',
                '\t\tInitiative Bonus: 4567 formatted',
                '\t\tSaving Throws:',
                '\t\t\tFortitude: 56 formatted',
                '\t\t\tReflex: 78 formatted',
                '\t\t\tWill: 67 formatted',
                '\tChallenge Rating: 89',
                '\tAlignment: alignment',
                '\tclass summary',
                '\trace summary',
                '\t\tLand Speed: 30 feet per round formatted',
                '\t\tSize: size',
                '\t\tAge: 18 Years formatted',
                '\t\tMaximum Age: 1800 Years formatted',
                '\t\tHeight: 48 inches formatted',
                '\t\tWeight: 100 Pounds formatted',
                '\tAbilities:',
                '\t\tStrength: 2 (-4 formatted)',
                '\t\tConstitution: 26 (13 formatted)',
                '\t\tDexterity: 6 (-2 formatted)',
                '\t\tIntelligence: 90 (45 formatted)',
                '\t\tWisdom: 10 (0 formatted)',
                '\t\tCharisma: 9 (-1 formatted)',
                '\tLanguages:',
                '\t\tEnglish',
                '\t\tGerman',
                '\tSkills:',
                '\t\tskill 1',
                '\t\t\tTotal Bonus: 135 formatted',
                '\t\t\tRanks: 4',
                '\t\t\tAbility Bonus: 13',
                '\t\t\tOther Bonus: 0',
                '\t\t\tArmor Check Penalty: -6',
                '\t\t\tClass Skill',
                '\t\tskill 2 (focus)',
                '\t\t\tTotal Bonus: 246 formatted',
                '\t\t\tRanks: 1.5',
                '\t\t\tAbility Bonus: -2',
                '\t\t\tOther Bonus: 3',
                '\t\t\tArmor Check Penalty: 0',
                '\tFeats:',
                '\t\tRacial:',
                '\t\t\tracial feat 1',
                '\t\t\tracial feat 2',
                '\t\tClass:',
                '\t\t\tclass feat 1',
                '\t\t\tclass feat 2',
                '\t\tAdditional:',
                '\t\t\tadditional feat 1',
                '\t\t\tadditional feat 2',
                '\tInteresting Trait: None',
                '\tEquipment:',
                '\t\tPrimary Hand: None',
                '\t\tOff Hand: None',
                '\t\tArmor: None',
                '\t\tTreasure: None',
                '',
            ];
    
            TestHelper.expectLines(lines, expected);
        });
    
        it('formats class specialization', () => {
            character.class.specialistFields = ["specialist field 1", "specialist field 2"];
    
            var formattedCharacter = pipe.transform(character);
            var lines = formattedCharacter.split('\r\n');
    
            var expected = [
                'character summary:',
                '\tCombat:',
                '\t\tAdjusted Dexterity Bonus: 3 formatted',
                '\t\tArmor Class: 7 formatted',
                '\t\t\tFlat-Footed: 12',
                '\t\t\tTouch: 34',
                '\t\tBase Attack:',
                '\t\t\tMelee: 21 formatted x5',
                '\t\t\tRanged: 22 formatted x5',
                '\t\tHit Points: 3456',
                '\t\tInitiative Bonus: 4567 formatted',
                '\t\tSaving Throws:',
                '\t\t\tFortitude: 56 formatted',
                '\t\t\tReflex: 78 formatted',
                '\t\t\tWill: 67 formatted',
                '\tChallenge Rating: 89',
                '\tAlignment: alignment',
                '\tclass summary',
                '\t\tSpecialist:',
                '\t\t\tspecialist field 1',
                '\t\t\tspecialist field 2',
                '\trace summary',
                '\t\tLand Speed: 30 feet per round formatted',
                '\t\tSize: size',
                '\t\tAge: 18 Years formatted',
                '\t\tMaximum Age: 1800 Years formatted',
                '\t\tHeight: 48 inches formatted',
                '\t\tWeight: 100 Pounds formatted',
                '\tAbilities:',
                '\t\tStrength: 2 (-4 formatted)',
                '\t\tConstitution: 26 (13 formatted)',
                '\t\tDexterity: 6 (-2 formatted)',
                '\t\tIntelligence: 90 (45 formatted)',
                '\t\tWisdom: 10 (0 formatted)',
                '\t\tCharisma: 9 (-1 formatted)',
                '\tLanguages:',
                '\t\tEnglish',
                '\t\tGerman',
                '\tSkills:',
                '\t\tskill 1',
                '\t\t\tTotal Bonus: 135 formatted',
                '\t\t\tRanks: 4',
                '\t\t\tAbility Bonus: 13',
                '\t\t\tOther Bonus: 0',
                '\t\t\tArmor Check Penalty: -6',
                '\t\t\tClass Skill',
                '\t\tskill 2 (focus)',
                '\t\t\t' + 'Total Bonus: 246 formatted',
                '\t\t\t' + 'Ranks: 1.5',
                '\t\t\t' + 'Ability Bonus: -2',
                '\t\t\t' + 'Other Bonus: 3',
                '\t\t\t' + 'Armor Check Penalty: 0',
                '\tFeats:',
                '\t\tRacial:',
                '\t\t\tracial feat 1',
                '\t\t\tracial feat 2',
                '\t\tClass:',
                '\t\t\tclass feat 1',
                '\t\t\tclass feat 2',
                '\t\tAdditional:',
                '\t\t\tadditional feat 1',
                '\t\t\tadditional feat 2',
                '\tInteresting Trait: None',
                '\tEquipment:',
                '\t\tPrimary Hand: None',
                '\t\tOff Hand: None',
                '\t\tArmor: None',
                '\t\tTreasure: None',
                '',
            ];
    
            TestHelper.expectLines(lines, expected);
        });
    
        it('formats prohibited fields', () => {
            character.class.specialistFields = ["specialist field 1", "specialist field 2"];
            character.class.prohibitedFields = ["prohibited field 1", "prohibited field 2"];
    
            var formattedCharacter = pipe.transform(character);
            var lines = formattedCharacter.split('\r\n');
    
            var expected = [
                'character summary:',
                '\tCombat:',
                '\t\tAdjusted Dexterity Bonus: 3 formatted',
                '\t\tArmor Class: 7 formatted',
                '\t\t\tFlat-Footed: 12',
                '\t\t\tTouch: 34',
                '\t\tBase Attack:',
                '\t\t\tMelee: 21 formatted x5',
                '\t\t\tRanged: 22 formatted x5',
                '\t\tHit Points: 3456',
                '\t\tInitiative Bonus: 4567 formatted',
                '\t\tSaving Throws:',
                '\t\t\tFortitude: 56 formatted',
                '\t\t\tReflex: 78 formatted',
                '\t\t\tWill: 67 formatted',
                '\tChallenge Rating: 89',
                '\tAlignment: alignment',
                '\tclass summary',
                '\t\tSpecialist:',
                '\t\t\tspecialist field 1',
                '\t\t\tspecialist field 2',
                '\t\tProhibited:',
                '\t\t\tprohibited field 1',
                '\t\t\tprohibited field 2',
                '\trace summary',
                '\t\tLand Speed: 30 feet per round formatted',
                '\t\tSize: size',
                '\t\tAge: 18 Years formatted',
                '\t\tMaximum Age: 1800 Years formatted',
                '\t\tHeight: 48 inches formatted',
                '\t\tWeight: 100 Pounds formatted',
                '\tAbilities:',
                '\t\tStrength: 2 (-4 formatted)',
                '\t\tConstitution: 26 (13 formatted)',
                '\t\tDexterity: 6 (-2 formatted)',
                '\t\tIntelligence: 90 (45 formatted)',
                '\t\tWisdom: 10 (0 formatted)',
                '\t\tCharisma: 9 (-1 formatted)',
                '\tLanguages:',
                '\t\tEnglish',
                '\t\tGerman',
                '\tSkills:',
                '\t\tskill 1',
                '\t\t\tTotal Bonus: 135 formatted',
                '\t\t\tRanks: 4',
                '\t\t\tAbility Bonus: 13',
                '\t\t\tOther Bonus: 0',
                '\t\t\tArmor Check Penalty: -6',
                '\t\t\tClass Skill',
                '\t\tskill 2 (focus)',
                '\t\t\t' + 'Total Bonus: 246 formatted',
                '\t\t\t' + 'Ranks: 1.5',
                '\t\t\t' + 'Ability Bonus: -2',
                '\t\t\t' + 'Other Bonus: 3',
                '\t\t\t' + 'Armor Check Penalty: 0',
                '\tFeats:',
                '\t\tRacial:',
                '\t\t\tracial feat 1',
                '\t\t\tracial feat 2',
                '\t\tClass:',
                '\t\t\tclass feat 1',
                '\t\t\tclass feat 2',
                '\t\tAdditional:',
                '\t\t\tadditional feat 1',
                '\t\t\tadditional feat 2',
                '\tInteresting Trait: None',
                '\tEquipment:',
                '\t\tPrimary Hand: None',
                '\t\tOff Hand: None',
                '\t\tArmor: None',
                '\t\tTreasure: None',
                '',
            ];
    
            TestHelper.expectLines(lines, expected);
        });
    
        it('formats metarace species', () => {
            character.race.metaraceSpecies = 'metarace species';
    
            var formattedCharacter = pipe.transform(character);
            var lines = formattedCharacter.split('\r\n');
    
            var expected = [
                'character summary:',
                '\tCombat:',
                '\t\tAdjusted Dexterity Bonus: 3 formatted',
                '\t\tArmor Class: 7 formatted',
                '\t\t\tFlat-Footed: 12',
                '\t\t\tTouch: 34',
                '\t\tBase Attack:',
                '\t\t\tMelee: 21 formatted x5',
                '\t\t\tRanged: 22 formatted x5',
                '\t\tHit Points: 3456',
                '\t\tInitiative Bonus: 4567 formatted',
                '\t\tSaving Throws:',
                '\t\t\tFortitude: 56 formatted',
                '\t\t\tReflex: 78 formatted',
                '\t\t\tWill: 67 formatted',
                '\tChallenge Rating: 89',
                '\tAlignment: alignment',
                '\tclass summary',
                '\trace summary',
                '\t\tMetarace Species: metarace species',
                '\t\tLand Speed: 30 feet per round formatted',
                '\t\tSize: size',
                '\t\tAge: 18 Years formatted',
                '\t\tMaximum Age: 1800 Years formatted',
                '\t\tHeight: 48 inches formatted',
                '\t\tWeight: 100 Pounds formatted',
                '\tAbilities:',
                '\t\tStrength: 2 (-4 formatted)',
                '\t\tConstitution: 26 (13 formatted)',
                '\t\tDexterity: 6 (-2 formatted)',
                '\t\tIntelligence: 90 (45 formatted)',
                '\t\tWisdom: 10 (0 formatted)',
                '\t\tCharisma: 9 (-1 formatted)',
                '\tLanguages:',
                '\t\tEnglish',
                '\t\tGerman',
                '\tSkills:',
                '\t\tskill 1',
                '\t\t\tTotal Bonus: 135 formatted',
                '\t\t\tRanks: 4',
                '\t\t\tAbility Bonus: 13',
                '\t\t\tOther Bonus: 0',
                '\t\t\tArmor Check Penalty: -6',
                '\t\t\tClass Skill',
                '\t\tskill 2 (focus)',
                '\t\t\t' + 'Total Bonus: 246 formatted',
                '\t\t\t' + 'Ranks: 1.5',
                '\t\t\t' + 'Ability Bonus: -2',
                '\t\t\t' + 'Other Bonus: 3',
                '\t\t\t' + 'Armor Check Penalty: 0',
                '\tFeats:',
                '\t\tRacial:',
                '\t\t\tracial feat 1',
                '\t\t\tracial feat 2',
                '\t\tClass:',
                '\t\t\tclass feat 1',
                '\t\t\tclass feat 2',
                '\t\tAdditional:',
                '\t\t\tadditional feat 1',
                '\t\t\tadditional feat 2',
                '\tInteresting Trait: None',
                '\tEquipment:',
                '\t\tPrimary Hand: None',
                '\t\tOff Hand: None',
                '\t\tArmor: None',
                '\t\tTreasure: None',
                '',
            ];
    
            TestHelper.expectLines(lines, expected);
        });
    
        it('formats wings', () => {
            character.race.hasWings = true;
    
            var formattedCharacter = pipe.transform(character);
            var lines = formattedCharacter.split('\r\n');
    
            var expected = [
                'character summary:',
                '\tCombat:',
                '\t\tAdjusted Dexterity Bonus: 3 formatted',
                '\t\tArmor Class: 7 formatted',
                '\t\t\tFlat-Footed: 12',
                '\t\t\tTouch: 34',
                '\t\tBase Attack:',
                '\t\t\tMelee: 21 formatted x5',
                '\t\t\tRanged: 22 formatted x5',
                '\t\tHit Points: 3456',
                '\t\tInitiative Bonus: 4567 formatted',
                '\t\tSaving Throws:',
                '\t\t\tFortitude: 56 formatted',
                '\t\t\tReflex: 78 formatted',
                '\t\t\tWill: 67 formatted',
                '\tChallenge Rating: 89',
                '\tAlignment: alignment',
                '\tclass summary',
                '\trace summary',
                '\t\tLand Speed: 30 feet per round formatted',
                '\t\tSize: size',
                '\t\tAge: 18 Years formatted',
                '\t\tMaximum Age: 1800 Years formatted',
                '\t\tHeight: 48 inches formatted',
                '\t\tWeight: 100 Pounds formatted',
                '\t\tHas Wings',
                '\tAbilities:',
                '\t\tStrength: 2 (-4 formatted)',
                '\t\tConstitution: 26 (13 formatted)',
                '\t\tDexterity: 6 (-2 formatted)',
                '\t\tIntelligence: 90 (45 formatted)',
                '\t\tWisdom: 10 (0 formatted)',
                '\t\tCharisma: 9 (-1 formatted)',
                '\tLanguages:',
                '\t\tEnglish',
                '\t\tGerman',
                '\tSkills:',
                '\t\tskill 1',
                '\t\t\tTotal Bonus: 135 formatted',
                '\t\t\tRanks: 4',
                '\t\t\tAbility Bonus: 13',
                '\t\t\tOther Bonus: 0',
                '\t\t\tArmor Check Penalty: -6',
                '\t\t\tClass Skill',
                '\t\tskill 2 (focus)',
                '\t\t\t' + 'Total Bonus: 246 formatted',
                '\t\t\t' + 'Ranks: 1.5',
                '\t\t\t' + 'Ability Bonus: -2',
                '\t\t\t' + 'Other Bonus: 3',
                '\t\t\t' + 'Armor Check Penalty: 0',
                '\tFeats:',
                '\t\tRacial:',
                '\t\t\tracial feat 1',
                '\t\t\tracial feat 2',
                '\t\tClass:',
                '\t\t\tclass feat 1',
                '\t\t\tclass feat 2',
                '\t\tAdditional:',
                '\t\t\tadditional feat 1',
                '\t\t\tadditional feat 2',
                '\tInteresting Trait: None',
                '\tEquipment:',
                '\t\tPrimary Hand: None',
                '\t\tOff Hand: None',
                '\t\tArmor: None',
                '\t\tTreasure: None',
                '',
            ];
    
            TestHelper.expectLines(lines, expected);
        });
    
        it('formats aerial speed', () => {
            character.race.aerialSpeed.value = 9876;
            character.race.aerialSpeed.unit = 'feet per round';
            character.race.aerialSpeed.description = "swift";
    
            var formattedCharacter = pipe.transform(character);
            var lines = formattedCharacter.split('\r\n');
    
            var expected = [
                'character summary:',
                '\tCombat:',
                '\t\tAdjusted Dexterity Bonus: 3 formatted',
                '\t\tArmor Class: 7 formatted',
                '\t\t\tFlat-Footed: 12',
                '\t\t\tTouch: 34',
                '\t\tBase Attack:',
                '\t\t\tMelee: 21 formatted x5',
                '\t\t\tRanged: 22 formatted x5',
                '\t\tHit Points: 3456',
                '\t\tInitiative Bonus: 4567 formatted',
                '\t\tSaving Throws:',
                '\t\t\tFortitude: 56 formatted',
                '\t\t\tReflex: 78 formatted',
                '\t\t\tWill: 67 formatted',
                '\tChallenge Rating: 89',
                '\tAlignment: alignment',
                '\tclass summary',
                '\trace summary',
                '\t\tLand Speed: 30 feet per round formatted',
                '\t\tAerial Speed: 9876 feet per round formatted',
                '\t\tSize: size',
                '\t\tAge: 18 Years formatted',
                '\t\tMaximum Age: 1800 Years formatted',
                '\t\tHeight: 48 inches formatted',
                '\t\tWeight: 100 Pounds formatted',
                '\tAbilities:',
                '\t\tStrength: 2 (-4 formatted)',
                '\t\tConstitution: 26 (13 formatted)',
                '\t\tDexterity: 6 (-2 formatted)',
                '\t\tIntelligence: 90 (45 formatted)',
                '\t\tWisdom: 10 (0 formatted)',
                '\t\tCharisma: 9 (-1 formatted)',
                '\tLanguages:',
                '\t\tEnglish',
                '\t\tGerman',
                '\t' + 'Skills:',
                '\t\t' + 'skill 1',
                '\t\t\t' + 'Total Bonus: 135 formatted',
                '\t\t\t' + 'Ranks: 4',
                '\t\t\t' + 'Ability Bonus: 13',
                '\t\t\t' + 'Other Bonus: 0',
                '\t\t\t' + 'Armor Check Penalty: -6',
                '\t\t\t' + 'Class Skill',
                '\t\t' + 'skill 2 (focus)',
                '\t\t\t' + 'Total Bonus: 246 formatted',
                '\t\t\t' + 'Ranks: 1.5',
                '\t\t\t' + 'Ability Bonus: -2',
                '\t\t\t' + 'Other Bonus: 3',
                '\t\t\t' + 'Armor Check Penalty: 0',
                '\tFeats:',
                '\t\tRacial:',
                '\t\t\tracial feat 1',
                '\t\t\tracial feat 2',
                '\t\tClass:',
                '\t\t\tclass feat 1',
                '\t\t\tclass feat 2',
                '\t\tAdditional:',
                '\t\t\tadditional feat 1',
                '\t\t\tadditional feat 2',
                '\tInteresting Trait: None',
                '\tEquipment:',
                '\t\tPrimary Hand: None',
                '\t\tOff Hand: None',
                '\t\tArmor: None',
                '\t\tTreasure: None',
                '',
            ];
    
            TestHelper.expectLines(lines, expected);
        });
    
        it('formats swim speed', () => {
            character.race.swimSpeed.value = 9876;
            character.race.swimSpeed.unit = 'feet per round';
            character.race.swimSpeed.description = "alacrid";
    
            var formattedCharacter = pipe.transform(character);
            var lines = formattedCharacter.split('\r\n');
    
            var expected = [
                'character summary:',
                '\tCombat:',
                '\t\tAdjusted Dexterity Bonus: 3 formatted',
                '\t\tArmor Class: 7 formatted',
                '\t\t\tFlat-Footed: 12',
                '\t\t\tTouch: 34',
                '\t\tBase Attack:',
                '\t\t\tMelee: 21 formatted x5',
                '\t\t\tRanged: 22 formatted x5',
                '\t\tHit Points: 3456',
                '\t\tInitiative Bonus: 4567 formatted',
                '\t\tSaving Throws:',
                '\t\t\tFortitude: 56 formatted',
                '\t\t\tReflex: 78 formatted',
                '\t\t\tWill: 67 formatted',
                '\tChallenge Rating: 89',
                '\tAlignment: alignment',
                '\tclass summary',
                '\trace summary',
                '\t\tLand Speed: 30 feet per round formatted',
                '\t\tSwim Speed: 9876 feet per round formatted',
                '\t\tSize: size',
                '\t\tAge: 18 Years formatted',
                '\t\tMaximum Age: 1800 Years formatted',
                '\t\tHeight: 48 inches formatted',
                '\t\tWeight: 100 Pounds formatted',
                '\tAbilities:',
                '\t\tStrength: 2 (-4 formatted)',
                '\t\tConstitution: 26 (13 formatted)',
                '\t\tDexterity: 6 (-2 formatted)',
                '\t\tIntelligence: 90 (45 formatted)',
                '\t\tWisdom: 10 (0 formatted)',
                '\t\tCharisma: 9 (-1 formatted)',
                '\tLanguages:',
                '\t\tEnglish',
                '\t\tGerman',
                '\tSkills:',
                '\t\tskill 1',
                '\t\t\tTotal Bonus: 135 formatted',
                '\t\t\tRanks: 4',
                '\t\t\tAbility Bonus: 13',
                '\t\t\tOther Bonus: 0',
                '\t\t\tArmor Check Penalty: -6',
                '\t\t\tClass Skill',
                '\t\tskill 2 (focus)',
                '\t\t\t' + 'Total Bonus: 246 formatted',
                '\t\t\t' + 'Ranks: 1.5',
                '\t\t\t' + 'Ability Bonus: -2',
                '\t\t\t' + 'Other Bonus: 3',
                '\t\t\t' + 'Armor Check Penalty: 0',
                '\tFeats:',
                '\t\tRacial:',
                '\t\t\tracial feat 1',
                '\t\t\tracial feat 2',
                '\t\tClass:',
                '\t\t\tclass feat 1',
                '\t\t\tclass feat 2',
                '\t\tAdditional:',
                '\t\t\tadditional feat 1',
                '\t\t\tadditional feat 2',
                '\tInteresting Trait: None',
                '\tEquipment:',
                '\t\tPrimary Hand: None',
                '\t\tOff Hand: None',
                '\t\tArmor: None',
                '\t\tTreasure: None',
                '',
            ];
    
            TestHelper.expectLines(lines, expected);
    
        });
    
        it('formats no racial feats', () => {
            character.feats.racial = [];
    
            var formattedCharacter = pipe.transform(character);
            var lines = formattedCharacter.split('\r\n');
    
            var expected = [
                'character summary:',
                '\tCombat:',
                '\t\tAdjusted Dexterity Bonus: 3 formatted',
                '\t\tArmor Class: 7 formatted',
                '\t\t\tFlat-Footed: 12',
                '\t\t\tTouch: 34',
                '\t\tBase Attack:',
                '\t\t\tMelee: 21 formatted x5',
                '\t\t\tRanged: 22 formatted x5',
                '\t\tHit Points: 3456',
                '\t\tInitiative Bonus: 4567 formatted',
                '\t\tSaving Throws:',
                '\t\t\tFortitude: 56 formatted',
                '\t\t\tReflex: 78 formatted',
                '\t\t\tWill: 67 formatted',
                '\tChallenge Rating: 89',
                '\tAlignment: alignment',
                '\tclass summary',
                '\trace summary',
                '\t\tLand Speed: 30 feet per round formatted',
                '\t\tSize: size',
                '\t\tAge: 18 Years formatted',
                '\t\tMaximum Age: 1800 Years formatted',
                '\t\tHeight: 48 inches formatted',
                '\t\tWeight: 100 Pounds formatted',
                '\tAbilities:',
                '\t\tStrength: 2 (-4 formatted)',
                '\t\tConstitution: 26 (13 formatted)',
                '\t\tDexterity: 6 (-2 formatted)',
                '\t\tIntelligence: 90 (45 formatted)',
                '\t\tWisdom: 10 (0 formatted)',
                '\t\tCharisma: 9 (-1 formatted)',
                '\tLanguages:',
                '\t\tEnglish',
                '\t\tGerman',
                '\tSkills:',
                '\t\tskill 1',
                '\t\t\tTotal Bonus: 135 formatted',
                '\t\t\tRanks: 4',
                '\t\t\tAbility Bonus: 13',
                '\t\t\tOther Bonus: 0',
                '\t\t\tArmor Check Penalty: -6',
                '\t\t\tClass Skill',
                '\t\tskill 2 (focus)',
                '\t\t\t' + 'Total Bonus: 246 formatted',
                '\t\t\t' + 'Ranks: 1.5',
                '\t\t\t' + 'Ability Bonus: -2',
                '\t\t\t' + 'Other Bonus: 3',
                '\t\t\t' + 'Armor Check Penalty: 0',
                '\tFeats:',
                '\t\tClass:',
                '\t\t\tclass feat 1',
                '\t\t\tclass feat 2',
                '\t\tAdditional:',
                '\t\t\tadditional feat 1',
                '\t\t\tadditional feat 2',
                '\tInteresting Trait: None',
                '\tEquipment:',
                '\t\tPrimary Hand: None',
                '\t\tOff Hand: None',
                '\t\tArmor: None',
                '\t\tTreasure: None',
                '',
            ];
    
            TestHelper.expectLines(lines, expected);
        });
    
        it('formats no class feats', () => {
            character.feats.class = [];
    
            var formattedCharacter = pipe.transform(character);
            var lines = formattedCharacter.split('\r\n');
    
            var expected = [
                'character summary:',
                '\tCombat:',
                '\t\tAdjusted Dexterity Bonus: 3 formatted',
                '\t\tArmor Class: 7 formatted',
                '\t\t\tFlat-Footed: 12',
                '\t\t\tTouch: 34',
                '\t\tBase Attack:',
                '\t\t\tMelee: 21 formatted x5',
                '\t\t\tRanged: 22 formatted x5',
                '\t\tHit Points: 3456',
                '\t\tInitiative Bonus: 4567 formatted',
                '\t\tSaving Throws:',
                '\t\t\tFortitude: 56 formatted',
                '\t\t\tReflex: 78 formatted',
                '\t\t\tWill: 67 formatted',
                '\tChallenge Rating: 89',
                '\tAlignment: alignment',
                '\tclass summary',
                '\trace summary',
                '\t\tLand Speed: 30 feet per round formatted',
                '\t\tSize: size',
                '\t\tAge: 18 Years formatted',
                '\t\tMaximum Age: 1800 Years formatted',
                '\t\tHeight: 48 inches formatted',
                '\t\tWeight: 100 Pounds formatted',
                '\tAbilities:',
                '\t\tStrength: 2 (-4 formatted)',
                '\t\tConstitution: 26 (13 formatted)',
                '\t\tDexterity: 6 (-2 formatted)',
                '\t\tIntelligence: 90 (45 formatted)',
                '\t\tWisdom: 10 (0 formatted)',
                '\t\tCharisma: 9 (-1 formatted)',
                '\tLanguages:',
                '\t\tEnglish',
                '\t\tGerman',
                '\tSkills:',
                '\t\tskill 1',
                '\t\t\tTotal Bonus: 135 formatted',
                '\t\t\tRanks: 4',
                '\t\t\tAbility Bonus: 13',
                '\t\t\tOther Bonus: 0',
                '\t\t\tArmor Check Penalty: -6',
                '\t\t\tClass Skill',
                '\t\tskill 2 (focus)',
                '\t\t\t' + 'Total Bonus: 246 formatted',
                '\t\t\t' + 'Ranks: 1.5',
                '\t\t\t' + 'Ability Bonus: -2',
                '\t\t\t' + 'Other Bonus: 3',
                '\t\t\t' + 'Armor Check Penalty: 0',
                '\t' + 'Feats:',
                '\t\t' + 'Racial:',
                '\t\t\t' + 'racial feat 1',
                '\t\t\t' + 'racial feat 2',
                '\t\t' + 'Additional:',
                '\t\t\t' + 'additional feat 1',
                '\t\t\t' + 'additional feat 2',
                '\tInteresting Trait: None',
                '\tEquipment:',
                '\t\tPrimary Hand: None',
                '\t\tOff Hand: None',
                '\t\tArmor: None',
                '\t\tTreasure: None',
                '',
            ];
    
            TestHelper.expectLines(lines, expected);
        });
    
        it('formats feat foci', () => {
            character.feats.racial[0].foci = ['focus 1', 'focus 2'];
            character.feats.class[0].foci = ['focus 3', 'focus 4'];
            character.feats.additional[0].foci = ['focus 5', 'focus 6'];
    
            var formattedCharacter = pipe.transform(character);
            var lines = formattedCharacter.split('\r\n');
    
            var expected = [
                'character summary:',
                '\tCombat:',
                '\t\tAdjusted Dexterity Bonus: 3 formatted',
                '\t\tArmor Class: 7 formatted',
                '\t\t\tFlat-Footed: 12',
                '\t\t\tTouch: 34',
                '\t\tBase Attack:',
                '\t\t\tMelee: 21 formatted x5',
                '\t\t\tRanged: 22 formatted x5',
                '\t\tHit Points: 3456',
                '\t\tInitiative Bonus: 4567 formatted',
                '\t\tSaving Throws:',
                '\t\t\tFortitude: 56 formatted',
                '\t\t\tReflex: 78 formatted',
                '\t\t\tWill: 67 formatted',
                '\tChallenge Rating: 89',
                '\tAlignment: alignment',
                '\tclass summary',
                '\trace summary',
                '\t\tLand Speed: 30 feet per round formatted',
                '\t\tSize: size',
                '\t\tAge: 18 Years formatted',
                '\t\tMaximum Age: 1800 Years formatted',
                '\t\tHeight: 48 inches formatted',
                '\t\tWeight: 100 Pounds formatted',
                '\tAbilities:',
                '\t\tStrength: 2 (-4 formatted)',
                '\t\tConstitution: 26 (13 formatted)',
                '\t\tDexterity: 6 (-2 formatted)',
                '\t\tIntelligence: 90 (45 formatted)',
                '\t\tWisdom: 10 (0 formatted)',
                '\t\tCharisma: 9 (-1 formatted)',
                '\tLanguages:',
                '\t\tEnglish',
                '\t\tGerman',
                '\tSkills:',
                '\t\tskill 1',
                '\t\t\tTotal Bonus: 135 formatted',
                '\t\t\tRanks: 4',
                '\t\t\tAbility Bonus: 13',
                '\t\t\tOther Bonus: 0',
                '\t\t\tArmor Check Penalty: -6',
                '\t\t\tClass Skill',
                '\t\tskill 2 (focus)',
                '\t\t\t' + 'Total Bonus: 246 formatted',
                '\t\t\t' + 'Ranks: 1.5',
                '\t\t\t' + 'Ability Bonus: -2',
                '\t\t\t' + 'Other Bonus: 3',
                '\t\t\t' + 'Armor Check Penalty: 0',
                '\tFeats:',
                '\t\tRacial:',
                '\t\t\tracial feat 1',
                '\t\t\t\tFoci:',
                '\t\t\t\t\tfocus 1',
                '\t\t\t\t\tfocus 2',
                '\t\t\tracial feat 2',
                '\t\tClass:',
                '\t\t\tclass feat 1',
                '\t\t\t\tFoci:',
                '\t\t\t\t\tfocus 3',
                '\t\t\t\t\tfocus 4',
                '\t\t\tclass feat 2',
                '\t\tAdditional:',
                '\t\t\tadditional feat 1',
                '\t\t\t\tFoci:',
                '\t\t\t\t\tfocus 5',
                '\t\t\t\t\tfocus 6',
                '\t\t\tadditional feat 2',
                '\tInteresting Trait: None',
                '\tEquipment:',
                '\t\tPrimary Hand: None',
                '\t\tOff Hand: None',
                '\t\tArmor: None',
                '\t\tTreasure: None',
                '',
            ];
    
            TestHelper.expectLines(lines, expected);
        });
    
        it('formats feat power', () => {
            character.feats.racial[0].power = 9876;
            character.feats.class[0].power = 8765;
            character.feats.additional[0].power = 7654;
    
            var formattedCharacter = pipe.transform(character);
            var lines = formattedCharacter.split('\r\n');
    
            var expected = [
                'character summary:',
                '\tCombat:',
                '\t\tAdjusted Dexterity Bonus: 3 formatted',
                '\t\tArmor Class: 7 formatted',
                '\t\t\tFlat-Footed: 12',
                '\t\t\tTouch: 34',
                '\t\tBase Attack:',
                '\t\t\tMelee: 21 formatted x5',
                '\t\t\tRanged: 22 formatted x5',
                '\t\tHit Points: 3456',
                '\t\tInitiative Bonus: 4567 formatted',
                '\t\tSaving Throws:',
                '\t\t\tFortitude: 56 formatted',
                '\t\t\tReflex: 78 formatted',
                '\t\t\tWill: 67 formatted',
                '\tChallenge Rating: 89',
                '\tAlignment: alignment',
                '\tclass summary',
                '\trace summary',
                '\t\tLand Speed: 30 feet per round formatted',
                '\t\tSize: size',
                '\t\tAge: 18 Years formatted',
                '\t\tMaximum Age: 1800 Years formatted',
                '\t\tHeight: 48 inches formatted',
                '\t\tWeight: 100 Pounds formatted',
                '\tAbilities:',
                '\t\tStrength: 2 (-4 formatted)',
                '\t\tConstitution: 26 (13 formatted)',
                '\t\tDexterity: 6 (-2 formatted)',
                '\t\tIntelligence: 90 (45 formatted)',
                '\t\tWisdom: 10 (0 formatted)',
                '\t\tCharisma: 9 (-1 formatted)',
                '\tLanguages:',
                '\t\tEnglish',
                '\t\tGerman',
                '\tSkills:',
                '\t\tskill 1',
                '\t\t\tTotal Bonus: 135 formatted',
                '\t\t\tRanks: 4',
                '\t\t\tAbility Bonus: 13',
                '\t\t\tOther Bonus: 0',
                '\t\t\tArmor Check Penalty: -6',
                '\t\t\tClass Skill',
                '\t\tskill 2 (focus)',
                '\t\t\t' + 'Total Bonus: 246 formatted',
                '\t\t\t' + 'Ranks: 1.5',
                '\t\t\t' + 'Ability Bonus: -2',
                '\t\t\t' + 'Other Bonus: 3',
                '\t\t\t' + 'Armor Check Penalty: 0',
                '\tFeats:',
                '\t\tRacial:',
                '\t\t\tracial feat 1',
                '\t\t\t\tPower: 9876',
                '\t\t\tracial feat 2',
                '\t\tClass:',
                '\t\t\tclass feat 1',
                '\t\t\t\tPower: 8765',
                '\t\t\tclass feat 2',
                '\t\tAdditional:',
                '\t\t\tadditional feat 1',
                '\t\t\t\tPower: 7654',
                '\t\t\tadditional feat 2',
                '\tInteresting Trait: None',
                '\tEquipment:',
                '\t\tPrimary Hand: None',
                '\t\tOff Hand: None',
                '\t\tArmor: None',
                '\t\tTreasure: None',
                '',
            ];
    
            TestHelper.expectLines(lines, expected);
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
                'character summary:',
                '\tCombat:',
                '\t\tAdjusted Dexterity Bonus: 3 formatted',
                '\t\tArmor Class: 7 formatted',
                '\t\t\tFlat-Footed: 12',
                '\t\t\tTouch: 34',
                '\t\tBase Attack:',
                '\t\t\tMelee: 21 formatted x5',
                '\t\t\tRanged: 22 formatted x5',
                '\t\tHit Points: 3456',
                '\t\tInitiative Bonus: 4567 formatted',
                '\t\tSaving Throws:',
                '\t\t\tFortitude: 56 formatted',
                '\t\t\tReflex: 78 formatted',
                '\t\t\tWill: 67 formatted',
                '\tChallenge Rating: 89',
                '\tAlignment: alignment',
                '\tclass summary',
                '\trace summary',
                '\t\tLand Speed: 30 feet per round formatted',
                '\t\tSize: size',
                '\t\tAge: 18 Years formatted',
                '\t\tMaximum Age: 1800 Years formatted',
                '\t\tHeight: 48 inches formatted',
                '\t\tWeight: 100 Pounds formatted',
                '\tAbilities:',
                '\t\tStrength: 2 (-4 formatted)',
                '\t\tConstitution: 26 (13 formatted)',
                '\t\tDexterity: 6 (-2 formatted)',
                '\t\tIntelligence: 90 (45 formatted)',
                '\t\tWisdom: 10 (0 formatted)',
                '\t\tCharisma: 9 (-1 formatted)',
                '\tLanguages:',
                '\t\tEnglish',
                '\t\tGerman',
                '\tSkills:',
                '\t\tskill 1',
                '\t\t\tTotal Bonus: 135 formatted',
                '\t\t\tRanks: 4',
                '\t\t\tAbility Bonus: 13',
                '\t\t\tOther Bonus: 0',
                '\t\t\tArmor Check Penalty: -6',
                '\t\t\tClass Skill',
                '\t\tskill 2 (focus)',
                '\t\t\t' + 'Total Bonus: 246 formatted',
                '\t\t\t' + 'Ranks: 1.5',
                '\t\t\t' + 'Ability Bonus: -2',
                '\t\t\t' + 'Other Bonus: 3',
                '\t\t\t' + 'Armor Check Penalty: 0',
                '\tFeats:',
                '\t\tRacial:',
                '\t\t\tracial feat 1',
                '\t\t\t\tFrequency: 9876 per fortnight formatted',
                '\t\t\tracial feat 2',
                '\t\tClass:',
                '\t\t\tclass feat 1',
                '\t\t\t\tFrequency: 8765 per moon cycle formatted',
                '\t\t\tclass feat 2',
                '\t\tAdditional:',
                '\t\t\tadditional feat 1',
                '\t\t\t\tFrequency: 7654 per turn of the wheel formatted',
                '\t\t\tadditional feat 2',
                '\tInteresting Trait: None',
                '\tEquipment:',
                '\t\tPrimary Hand: None',
                '\t\tOff Hand: None',
                '\t\tArmor: None',
                '\t\tTreasure: None',
                '',
            ];
    
            TestHelper.expectLines(lines, expected);
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
                'character summary:',
                '\tCombat:',
                '\t\tAdjusted Dexterity Bonus: 3 formatted',
                '\t\tArmor Class: 7 formatted',
                '\t\t\tFlat-Footed: 12',
                '\t\t\tTouch: 34',
                '\t\tBase Attack:',
                '\t\t\tMelee: 21 formatted x5',
                '\t\t\tRanged: 22 formatted x5',
                '\t\tHit Points: 3456',
                '\t\tInitiative Bonus: 4567 formatted',
                '\t\tSaving Throws:',
                '\t\t\tFortitude: 56 formatted',
                '\t\t\tReflex: 78 formatted',
                '\t\t\tWill: 67 formatted',
                '\tChallenge Rating: 89',
                '\tAlignment: alignment',
                '\tclass summary',
                '\trace summary',
                '\t\tLand Speed: 30 feet per round formatted',
                '\t\tSize: size',
                '\t\tAge: 18 Years formatted',
                '\t\tMaximum Age: 1800 Years formatted',
                '\t\tHeight: 48 inches formatted',
                '\t\tWeight: 100 Pounds formatted',
                '\tAbilities:',
                '\t\tStrength: 2 (-4 formatted)',
                '\t\tConstitution: 26 (13 formatted)',
                '\t\tDexterity: 6 (-2 formatted)',
                '\t\tIntelligence: 90 (45 formatted)',
                '\t\tWisdom: 10 (0 formatted)',
                '\t\tCharisma: 9 (-1 formatted)',
                '\tLanguages:',
                '\t\tEnglish',
                '\t\tGerman',
                '\tSkills:',
                '\t\tskill 1',
                '\t\t\tTotal Bonus: 135 formatted',
                '\t\t\tRanks: 4',
                '\t\t\tAbility Bonus: 13',
                '\t\t\tOther Bonus: 0',
                '\t\t\tArmor Check Penalty: -6',
                '\t\t\tClass Skill',
                '\t\tskill 2 (focus)',
                '\t\t\t' + 'Total Bonus: 246 formatted',
                '\t\t\t' + 'Ranks: 1.5',
                '\t\t\t' + 'Ability Bonus: -2',
                '\t\t\t' + 'Other Bonus: 3',
                '\t\t\t' + 'Armor Check Penalty: 0',
                '\tFeats:',
                '\t\tRacial:',
                '\t\t\tracial feat 1',
                '\t\t\t\tFrequency: 0 per all day erry day formatted',
                '\t\t\tracial feat 2',
                '\t\tClass:',
                '\t\t\tclass feat 1',
                '\t\t\t\tFrequency: 0 per whenever I want formatted',
                '\t\t\tclass feat 2',
                '\t\tAdditional:',
                '\t\t\tadditional feat 1',
                '\t\t\t\tFrequency: 0 per when pigs fly formatted',
                '\t\t\tadditional feat 2',
                '\tInteresting Trait: None',
                '\tEquipment:',
                '\t\tPrimary Hand: None',
                '\t\tOff Hand: None',
                '\t\tArmor: None',
                '\t\tTreasure: None',
                '',
            ];
    
            TestHelper.expectLines(lines, expected);
        });
    
        it('formats interesting trait', () => {
            character.interestingTrait = 'is interesting';
    
            var formattedCharacter = pipe.transform(character);
            var lines = formattedCharacter.split('\r\n');
    
            var expected = [
                'character summary:',
                '\tCombat:',
                '\t\tAdjusted Dexterity Bonus: 3 formatted',
                '\t\tArmor Class: 7 formatted',
                '\t\t\tFlat-Footed: 12',
                '\t\t\tTouch: 34',
                '\t\tBase Attack:',
                '\t\t\tMelee: 21 formatted x5',
                '\t\t\tRanged: 22 formatted x5',
                '\t\tHit Points: 3456',
                '\t\tInitiative Bonus: 4567 formatted',
                '\t\tSaving Throws:',
                '\t\t\tFortitude: 56 formatted',
                '\t\t\tReflex: 78 formatted',
                '\t\t\tWill: 67 formatted',
                '\tChallenge Rating: 89',
                '\tAlignment: alignment',
                '\tclass summary',
                '\trace summary',
                '\t\tLand Speed: 30 feet per round formatted',
                '\t\tSize: size',
                '\t\tAge: 18 Years formatted',
                '\t\tMaximum Age: 1800 Years formatted',
                '\t\tHeight: 48 inches formatted',
                '\t\tWeight: 100 Pounds formatted',
                '\tAbilities:',
                '\t\tStrength: 2 (-4 formatted)',
                '\t\tConstitution: 26 (13 formatted)',
                '\t\tDexterity: 6 (-2 formatted)',
                '\t\tIntelligence: 90 (45 formatted)',
                '\t\tWisdom: 10 (0 formatted)',
                '\t\tCharisma: 9 (-1 formatted)',
                '\tLanguages:',
                '\t\tEnglish',
                '\t\tGerman',
                '\tSkills:',
                '\t\tskill 1',
                '\t\t\tTotal Bonus: 135 formatted',
                '\t\t\tRanks: 4',
                '\t\t\tAbility Bonus: 13',
                '\t\t\tOther Bonus: 0',
                '\t\t\tArmor Check Penalty: -6',
                '\t\t\tClass Skill',
                '\t\tskill 2 (focus)',
                '\t\t\t' + 'Total Bonus: 246 formatted',
                '\t\t\t' + 'Ranks: 1.5',
                '\t\t\t' + 'Ability Bonus: -2',
                '\t\t\t' + 'Other Bonus: 3',
                '\t\t\t' + 'Armor Check Penalty: 0',
                '\tFeats:',
                '\t\tRacial:',
                '\t\t\tracial feat 1',
                '\t\t\tracial feat 2',
                '\t\tClass:',
                '\t\t\tclass feat 1',
                '\t\t\tclass feat 2',
                '\t\tAdditional:',
                '\t\t\tadditional feat 1',
                '\t\t\tadditional feat 2',
                '\tInteresting Trait: is interesting',
                '\tEquipment:',
                '\t\tPrimary Hand: None',
                '\t\tOff Hand: None',
                '\t\tArmor: None',
                '\t\tTreasure: None',
                '',
            ];
    
            TestHelper.expectLines(lines, expected);
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
                'character summary:',
                '\tCombat:',
                '\t\tAdjusted Dexterity Bonus: 3 formatted',
                '\t\tArmor Class: 7 formatted',
                '\t\t\tFlat-Footed: 12',
                '\t\t\tTouch: 34',
                '\t\tBase Attack:',
                '\t\t\tMelee: 21 formatted x5',
                '\t\t\tRanged: 22 formatted x5',
                '\t\tHit Points: 3456',
                '\t\tInitiative Bonus: 4567 formatted',
                '\t\tSaving Throws:',
                '\t\t\tFortitude: 56 formatted',
                '\t\t\tReflex: 78 formatted',
                '\t\t\tWill: 67 formatted',
                '\tChallenge Rating: 89',
                '\tAlignment: alignment',
                '\tclass summary',
                '\trace summary',
                '\t\tLand Speed: 30 feet per round formatted',
                '\t\tSize: size',
                '\t\tAge: 18 Years formatted',
                '\t\tMaximum Age: 1800 Years formatted',
                '\t\tHeight: 48 inches formatted',
                '\t\tWeight: 100 Pounds formatted',
                '\tAbilities:',
                '\t\tStrength: 2 (-4 formatted)',
                '\t\tConstitution: 26 (13 formatted)',
                '\t\tDexterity: 6 (-2 formatted)',
                '\t\tIntelligence: 90 (45 formatted)',
                '\t\tWisdom: 10 (0 formatted)',
                '\t\tCharisma: 9 (-1 formatted)',
                '\tLanguages:',
                '\t\tEnglish',
                '\t\tGerman',
                '\tSkills:',
                '\t\tskill 1',
                '\t\t\tTotal Bonus: 135 formatted',
                '\t\t\tRanks: 4',
                '\t\t\tAbility Bonus: 13',
                '\t\t\tOther Bonus: 0',
                '\t\t\tArmor Check Penalty: -6',
                '\t\t\tClass Skill',
                '\t\tskill 2 (focus)',
                '\t\t\t' + 'Total Bonus: 246 formatted',
                '\t\t\t' + 'Ranks: 1.5',
                '\t\t\t' + 'Ability Bonus: -2',
                '\t\t\t' + 'Other Bonus: 3',
                '\t\t\t' + 'Armor Check Penalty: 0',
                '\tFeats:',
                '\t\tRacial:',
                '\t\t\tracial feat 1',
                '\t\t\tracial feat 2',
                '\t\tClass:',
                '\t\t\tclass feat 1',
                '\t\t\tclass feat 2',
                '\t\tAdditional:',
                '\t\t\tadditional feat 1',
                '\t\t\tadditional feat 2',
                '\tInteresting Trait: None',
                '\t' + 'Spells Per Day:',
                '\t\t' + 'my source lvl 0: 9 formatted',
                '\t\t' + 'my source lvl 1: 8 formatted',
                '\t\t' + 'my other source lvl 1: 7 formatted',
                '\t\t' + 'my other source lvl 2: 6 formatted',
                '\tEquipment:',
                '\t\tPrimary Hand: None',
                '\t\tOff Hand: None',
                '\t\tArmor: None',
                '\t\tTreasure: None',
                '',
            ];
    
            TestHelper.expectLines(lines, expected);
        });
    
        it('formats known spells', () => {
            character.magic.spellsPerDay = [
                new SpellQuantity('my source', 0, 9, false),
                new SpellQuantity('my source', 1, 8, true),
                new SpellQuantity('my other source', 1, 7, false),
                new SpellQuantity('my other source', 2, 6, true),
            ];
    
            character.magic.knownSpells = [
                new Spell({'my source': 0}, 'spell 0.1', []),
                new Spell({'my source': 0}, 'spell 0.2', []),
                new Spell({'my source': 1}, 'spell 1.1', []),
                new Spell({'my source': 1}, 'spell 1.2', []),
                new Spell({'my other source': 1}, 'spell 2.1', []),
                new Spell({'my other source': 1}, 'spell 2.2', []),
                new Spell({'my other source': 2}, 'spell 3.1', []),
                new Spell({'my other source': 2}, 'spell 3.2', []),
            ];
    
            var formattedCharacter = pipe.transform(character);
            var lines = formattedCharacter.split('\r\n');
    
            var expected = [
                'character summary:',
                '\tCombat:',
                '\t\tAdjusted Dexterity Bonus: 3 formatted',
                '\t\tArmor Class: 7 formatted',
                '\t\t\tFlat-Footed: 12',
                '\t\t\tTouch: 34',
                '\t\tBase Attack:',
                '\t\t\tMelee: 21 formatted x5',
                '\t\t\tRanged: 22 formatted x5',
                '\t\tHit Points: 3456',
                '\t\tInitiative Bonus: 4567 formatted',
                '\t\tSaving Throws:',
                '\t\t\tFortitude: 56 formatted',
                '\t\t\tReflex: 78 formatted',
                '\t\t\tWill: 67 formatted',
                '\tChallenge Rating: 89',
                '\tAlignment: alignment',
                '\tclass summary',
                '\trace summary',
                '\t\tLand Speed: 30 feet per round formatted',
                '\t\tSize: size',
                '\t\tAge: 18 Years formatted',
                '\t\tMaximum Age: 1800 Years formatted',
                '\t\tHeight: 48 inches formatted',
                '\t\tWeight: 100 Pounds formatted',
                '\tAbilities:',
                '\t\tStrength: 2 (-4 formatted)',
                '\t\tConstitution: 26 (13 formatted)',
                '\t\tDexterity: 6 (-2 formatted)',
                '\t\tIntelligence: 90 (45 formatted)',
                '\t\tWisdom: 10 (0 formatted)',
                '\t\tCharisma: 9 (-1 formatted)',
                '\tLanguages:',
                '\t\tEnglish',
                '\t\tGerman',
                '\tSkills:',
                '\t\tskill 1',
                '\t\t\tTotal Bonus: 135 formatted',
                '\t\t\tRanks: 4',
                '\t\t\tAbility Bonus: 13',
                '\t\t\tOther Bonus: 0',
                '\t\t\tArmor Check Penalty: -6',
                '\t\t\tClass Skill',
                '\t\tskill 2 (focus)',
                '\t\t\t' + 'Total Bonus: 246 formatted',
                '\t\t\t' + 'Ranks: 1.5',
                '\t\t\t' + 'Ability Bonus: -2',
                '\t\t\t' + 'Other Bonus: 3',
                '\t\t\t' + 'Armor Check Penalty: 0',
                '\tFeats:',
                '\t\tRacial:',
                '\t\t\tracial feat 1',
                '\t\t\tracial feat 2',
                '\t\tClass:',
                '\t\t\tclass feat 1',
                '\t\t\tclass feat 2',
                '\t\tAdditional:',
                '\t\t\tadditional feat 1',
                '\t\t\tadditional feat 2',
                '\t' + 'Interesting Trait: None',
                '\t' + 'Spells Per Day:',
                '\t\t' + 'my source lvl 0: 9 formatted',
                '\t\t' + 'my source lvl 1: 8 formatted',
                '\t\t' + 'my other source lvl 1: 7 formatted',
                '\t\t' + 'my other source lvl 2: 6 formatted',
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
                '',
            ];
    
            TestHelper.expectLines(lines, expected);
        });
    
        it('formats prepared spells', () => {
            character.magic.spellsPerDay = [
                new SpellQuantity('my source', 0, 9, false),
                new SpellQuantity('my source', 1, 8, true),
                new SpellQuantity('my other source', 1, 7, false),
                new SpellQuantity('my other source', 2, 6, true),
            ];
    
            character.magic.knownSpells = [
                new Spell({'my source': 0}, 'spell 0.1', []),
                new Spell({'my source': 0}, 'spell 0.2', []),
                new Spell({'my source': 1}, 'spell 1.1', []),
                new Spell({'my source': 1}, 'spell 1.2', []),
                new Spell({'my other source': 1}, 'spell 2.1', []),
                new Spell({'my other source': 1}, 'spell 2.2', []),
                new Spell({'my other source': 2}, 'spell 3.1', []),
                new Spell({'my other source': 2}, 'spell 3.2', []),
            ];
    
            character.magic.preparedSpells = [
                new Spell({'my source': 0}, 'prepared spell 0.1', []),
                new Spell({'my source': 0}, 'prepared spell 0.1', []),
                new Spell({'my source': 0}, 'prepared spell 0.2', []),
                new Spell({'my source': 1}, 'prepared spell 1.1', []),
                new Spell({'my source': 1}, 'prepared spell 1.2', []),
                new Spell({'my source': 1}, 'prepared spell 1.2', []),
                new Spell({'my other source': 1}, 'prepared spell 2.1', []),
                new Spell({'my other source': 1}, 'prepared spell 2.2', []),
                new Spell({'my other source': 1}, 'prepared spell 2.2', []),
                new Spell({'my other source': 2}, 'prepared spell 3.1', []),
                new Spell({'my other source': 2}, 'prepared spell 3.1', []),
                new Spell({'my other source': 2}, 'prepared spell 3.2', []),
            ];
    
            var formattedCharacter = pipe.transform(character);
            var lines = formattedCharacter.split('\r\n');
    
            var expected = [
                'character summary:',
                '\tCombat:',
                '\t\tAdjusted Dexterity Bonus: 3 formatted',
                '\t\tArmor Class: 7 formatted',
                '\t\t\tFlat-Footed: 12',
                '\t\t\tTouch: 34',
                '\t\tBase Attack:',
                '\t\t\tMelee: 21 formatted x5',
                '\t\t\tRanged: 22 formatted x5',
                '\t\tHit Points: 3456',
                '\t\tInitiative Bonus: 4567 formatted',
                '\t\tSaving Throws:',
                '\t\t\tFortitude: 56 formatted',
                '\t\t\tReflex: 78 formatted',
                '\t\t\tWill: 67 formatted',
                '\tChallenge Rating: 89',
                '\tAlignment: alignment',
                '\tclass summary',
                '\trace summary',
                '\t\tLand Speed: 30 feet per round formatted',
                '\t\tSize: size',
                '\t\tAge: 18 Years formatted',
                '\t\tMaximum Age: 1800 Years formatted',
                '\t\tHeight: 48 inches formatted',
                '\t\tWeight: 100 Pounds formatted',
                '\tAbilities:',
                '\t\tStrength: 2 (-4 formatted)',
                '\t\tConstitution: 26 (13 formatted)',
                '\t\tDexterity: 6 (-2 formatted)',
                '\t\tIntelligence: 90 (45 formatted)',
                '\t\tWisdom: 10 (0 formatted)',
                '\t\tCharisma: 9 (-1 formatted)',
                '\tLanguages:',
                '\t\tEnglish',
                '\t\tGerman',
                '\tSkills:',
                '\t\tskill 1',
                '\t\t\tTotal Bonus: 135 formatted',
                '\t\t\tRanks: 4',
                '\t\t\tAbility Bonus: 13',
                '\t\t\tOther Bonus: 0',
                '\t\t\tArmor Check Penalty: -6',
                '\t\t\tClass Skill',
                '\t\tskill 2 (focus)',
                '\t\t\t' + 'Total Bonus: 246 formatted',
                '\t\t\t' + 'Ranks: 1.5',
                '\t\t\t' + 'Ability Bonus: -2',
                '\t\t\t' + 'Other Bonus: 3',
                '\t\t\t' + 'Armor Check Penalty: 0',
                '\tFeats:',
                '\t\tRacial:',
                '\t\t\tracial feat 1',
                '\t\t\tracial feat 2',
                '\t\tClass:',
                '\t\t\tclass feat 1',
                '\t\t\tclass feat 2',
                '\t\tAdditional:',
                '\t\t\tadditional feat 1',
                '\t\t\tadditional feat 2',
                '\tInteresting Trait: None',
                '\t' + 'Spells Per Day:',
                '\t\t' + 'my source lvl 0: 9 formatted',
                '\t\t' + 'my source lvl 1: 8 formatted',
                '\t\t' + 'my other source lvl 1: 7 formatted',
                '\t\t' + 'my other source lvl 2: 6 formatted',
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
                '',
            ];
    
            TestHelper.expectLines(lines, expected);
        });
    
        it('formats arcane spell failure', () => {
            character.magic.arcaneSpellFailure = 98;
    
            var formattedCharacter = pipe.transform(character);
            var lines = formattedCharacter.split('\r\n');
    
            var expected = [
                'character summary:',
                '\tCombat:',
                '\t\tAdjusted Dexterity Bonus: 3 formatted',
                '\t\tArmor Class: 7 formatted',
                '\t\t\tFlat-Footed: 12',
                '\t\t\tTouch: 34',
                '\t\tBase Attack:',
                '\t\t\tMelee: 21 formatted x5',
                '\t\t\tRanged: 22 formatted x5',
                '\t\tHit Points: 3456',
                '\t\tInitiative Bonus: 4567 formatted',
                '\t\tSaving Throws:',
                '\t\t\tFortitude: 56 formatted',
                '\t\t\tReflex: 78 formatted',
                '\t\t\tWill: 67 formatted',
                '\tChallenge Rating: 89',
                '\tAlignment: alignment',
                '\tclass summary',
                '\trace summary',
                '\t\tLand Speed: 30 feet per round formatted',
                '\t\tSize: size',
                '\t\tAge: 18 Years formatted',
                '\t\tMaximum Age: 1800 Years formatted',
                '\t\tHeight: 48 inches formatted',
                '\t\tWeight: 100 Pounds formatted',
                '\tAbilities:',
                '\t\tStrength: 2 (-4 formatted)',
                '\t\tConstitution: 26 (13 formatted)',
                '\t\tDexterity: 6 (-2 formatted)',
                '\t\tIntelligence: 90 (45 formatted)',
                '\t\tWisdom: 10 (0 formatted)',
                '\t\tCharisma: 9 (-1 formatted)',
                '\tLanguages:',
                '\t\tEnglish',
                '\t\tGerman',
                '\tSkills:',
                '\t\tskill 1',
                '\t\t\tTotal Bonus: 135 formatted',
                '\t\t\tRanks: 4',
                '\t\t\tAbility Bonus: 13',
                '\t\t\tOther Bonus: 0',
                '\t\t\tArmor Check Penalty: -6',
                '\t\t\tClass Skill',
                '\t\tskill 2 (focus)',
                '\t\t\t' + 'Total Bonus: 246 formatted',
                '\t\t\t' + 'Ranks: 1.5',
                '\t\t\t' + 'Ability Bonus: -2',
                '\t\t\t' + 'Other Bonus: 3',
                '\t\t\t' + 'Armor Check Penalty: 0',
                '\tFeats:',
                '\t\tRacial:',
                '\t\t\tracial feat 1',
                '\t\t\tracial feat 2',
                '\t\tClass:',
                '\t\t\tclass feat 1',
                '\t\t\tclass feat 2',
                '\t\tAdditional:',
                '\t\t\tadditional feat 1',
                '\t\t\tadditional feat 2',
                '\tInteresting Trait: None',
                '\t' + 'Arcane Spell Failure: 98%',
                '\tEquipment:',
                '\t\tPrimary Hand: None',
                '\t\tOff Hand: None',
                '\t\tArmor: None',
                '\t\tTreasure: None',
                '',
            ];
    
            TestHelper.expectLines(lines, expected);
        });
    
        it('formats animal', () => {
            character.magic.animal = 'familiar';
    
            var formattedCharacter = pipe.transform(character);
            var lines = formattedCharacter.split('\r\n');
    
            var expected = [
                'character summary:',
                '\tCombat:',
                '\t\tAdjusted Dexterity Bonus: 3 formatted',
                '\t\tArmor Class: 7 formatted',
                '\t\t\tFlat-Footed: 12',
                '\t\t\tTouch: 34',
                '\t\tBase Attack:',
                '\t\t\tMelee: 21 formatted x5',
                '\t\t\tRanged: 22 formatted x5',
                '\t\tHit Points: 3456',
                '\t\tInitiative Bonus: 4567 formatted',
                '\t\tSaving Throws:',
                '\t\t\tFortitude: 56 formatted',
                '\t\t\tReflex: 78 formatted',
                '\t\t\tWill: 67 formatted',
                '\t' + 'Challenge Rating: 89',
                '\t' + 'Alignment: alignment',
                '\t' + 'class summary',
                '\t' + 'race summary',
                '\t\t' + 'Land Speed: 30 feet per round formatted',
                '\t\t' + 'Size: size',
                '\t\t' + 'Age: 18 Years formatted',
                '\t\t' + 'Maximum Age: 1800 Years formatted',
                '\t\t' + 'Height: 48 inches formatted',
                '\t\t' + 'Weight: 100 Pounds formatted',
                '\t' + 'Abilities:',
                '\t\t' + 'Strength: 2 (-4 formatted)',
                '\t\t' + 'Constitution: 26 (13 formatted)',
                '\t\t' + 'Dexterity: 6 (-2 formatted)',
                '\t\t' + 'Intelligence: 90 (45 formatted)',
                '\t\t' + 'Wisdom: 10 (0 formatted)',
                '\t\t' + 'Charisma: 9 (-1 formatted)',
                '\t' + 'Languages:',
                '\t\t' + 'English',
                '\t\t' + 'German',
                '\t' + 'Skills:',
                '\t\t' + 'skill 1',
                '\t\t\t' + 'Total Bonus: 135 formatted',
                '\t\t\t' + 'Ranks: 4',
                '\t\t\t' + 'Ability Bonus: 13',
                '\t\t\t' + 'Other Bonus: 0',
                '\t\t\t' + 'Armor Check Penalty: -6',
                '\t\t\t' + 'Class Skill',
                '\t\t' + 'skill 2 (focus)',
                '\t\t\t' + 'Total Bonus: 246 formatted',
                '\t\t\t' + 'Ranks: 1.5',
                '\t\t\t' + 'Ability Bonus: -2',
                '\t\t\t' + 'Other Bonus: 3',
                '\t\t\t' + 'Armor Check Penalty: 0',
                '\t' + 'Feats:',
                '\t\t' + 'Racial:',
                '\t\t\t' + 'racial feat 1',
                '\t\t\t' + 'racial feat 2',
                '\t\t' + 'Class:',
                '\t\t\t' + 'class feat 1',
                '\t\t\t' + 'class feat 2',
                '\t\t' + 'Additional:',
                '\t\t\t' + 'additional feat 1',
                '\t\t\t' + 'additional feat 2',
                '\t' + 'Interesting Trait: None',
                '\t' + 'Animal: familiar',
                '\tEquipment:',
                '\t\tPrimary Hand: None',
                '\t\tOff Hand: None',
                '\t\tArmor: None',
                '\t\tTreasure: None',
                '',
            ];
    
            TestHelper.expectLines(lines, expected);
        });
    
        it('formats primary hand', () => {
            character.equipment.primaryHand = createWeapon('primary weapon');
    
            var formattedCharacter = pipe.transform(character);
            var lines = formattedCharacter.split('\r\n');
    
            var expected = [
                'character summary:',
                '\tCombat:',
                '\t\tAdjusted Dexterity Bonus: 3 formatted',
                '\t\tArmor Class: 7 formatted',
                '\t\t\tFlat-Footed: 12',
                '\t\t\tTouch: 34',
                '\t\tBase Attack:',
                '\t\t\tMelee: 21 formatted x5',
                '\t\t\tRanged: 22 formatted x5',
                '\t\tHit Points: 3456',
                '\t\tInitiative Bonus: 4567 formatted',
                '\t\tSaving Throws:',
                '\t\t\tFortitude: 56 formatted',
                '\t\t\tReflex: 78 formatted',
                '\t\t\tWill: 67 formatted',
                '\tChallenge Rating: 89',
                '\tAlignment: alignment',
                '\tclass summary',
                '\trace summary',
                '\t\tLand Speed: 30 feet per round formatted',
                '\t\tSize: size',
                '\t\tAge: 18 Years formatted',
                '\t\tMaximum Age: 1800 Years formatted',
                '\t\tHeight: 48 inches formatted',
                '\t\tWeight: 100 Pounds formatted',
                '\tAbilities:',
                '\t\tStrength: 2 (-4 formatted)',
                '\t\tConstitution: 26 (13 formatted)',
                '\t\tDexterity: 6 (-2 formatted)',
                '\t\tIntelligence: 90 (45 formatted)',
                '\t\tWisdom: 10 (0 formatted)',
                '\t\tCharisma: 9 (-1 formatted)',
                '\tLanguages:',
                '\t\tEnglish',
                '\t\tGerman',
                '\tSkills:',
                '\t\tskill 1',
                '\t\t\tTotal Bonus: 135 formatted',
                '\t\t\tRanks: 4',
                '\t\t\tAbility Bonus: 13',
                '\t\t\tOther Bonus: 0',
                '\t\t\tArmor Check Penalty: -6',
                '\t\t\tClass Skill',
                '\t\tskill 2 (focus)',
                '\t\t\t' + 'Total Bonus: 246 formatted',
                '\t\t\t' + 'Ranks: 1.5',
                '\t\t\t' + 'Ability Bonus: -2',
                '\t\t\t' + 'Other Bonus: 3',
                '\t\t\t' + 'Armor Check Penalty: 0',
                '\tFeats:',
                '\t\tRacial:',
                '\t\t\tracial feat 1',
                '\t\t\tracial feat 2',
                '\t\tClass:',
                '\t\t\tclass feat 1',
                '\t\t\tclass feat 2',
                '\t\tAdditional:',
                '\t\t\tadditional feat 1',
                '\t\t\tadditional feat 2',
                '\tInteresting Trait: None',
                '\t' + 'Equipment:',
                '\t\t' + 'Primary Hand:',
                '\t\t\t' + 'primary weapon summary',
                '\t\t\t\t' + 'formatted',
                '\t\t' + 'Off Hand: None',
                '\t\t' + 'Armor: None',
                '\t\t' + 'Treasure: None',
                '',
            ];
    
            TestHelper.expectLines(lines, expected);
        });
    
        it('formats two-handed weapon', () => {
            character.equipment.primaryHand = createWeapon('primary weapon');
            character.equipment.primaryHand.attributes.push('Two-Handed');
    
            var formattedCharacter = pipe.transform(character);
            var lines = formattedCharacter.split('\r\n');
    
            var expected = [
                'character summary:',
                '\tCombat:',
                '\t\tAdjusted Dexterity Bonus: 3 formatted',
                '\t\tArmor Class: 7 formatted',
                '\t\t\tFlat-Footed: 12',
                '\t\t\tTouch: 34',
                '\t\tBase Attack:',
                '\t\t\tMelee: 21 formatted x5',
                '\t\t\tRanged: 22 formatted x5',
                '\t\tHit Points: 3456',
                '\t\tInitiative Bonus: 4567 formatted',
                '\t\tSaving Throws:',
                '\t\t\tFortitude: 56 formatted',
                '\t\t\tReflex: 78 formatted',
                '\t\t\tWill: 67 formatted',
                '\tChallenge Rating: 89',
                '\tAlignment: alignment',
                '\tclass summary',
                '\trace summary',
                '\t\tLand Speed: 30 feet per round formatted',
                '\t\tSize: size',
                '\t\tAge: 18 Years formatted',
                '\t\tMaximum Age: 1800 Years formatted',
                '\t\tHeight: 48 inches formatted',
                '\t\tWeight: 100 Pounds formatted',
                '\tAbilities:',
                '\t\tStrength: 2 (-4 formatted)',
                '\t\tConstitution: 26 (13 formatted)',
                '\t\tDexterity: 6 (-2 formatted)',
                '\t\tIntelligence: 90 (45 formatted)',
                '\t\tWisdom: 10 (0 formatted)',
                '\t\tCharisma: 9 (-1 formatted)',
                '\tLanguages:',
                '\t\tEnglish',
                '\t\tGerman',
                '\tSkills:',
                '\t\tskill 1',
                '\t\t\tTotal Bonus: 135 formatted',
                '\t\t\tRanks: 4',
                '\t\t\tAbility Bonus: 13',
                '\t\t\tOther Bonus: 0',
                '\t\t\tArmor Check Penalty: -6',
                '\t\t\tClass Skill',
                '\t\tskill 2 (focus)',
                '\t\t\t' + 'Total Bonus: 246 formatted',
                '\t\t\t' + 'Ranks: 1.5',
                '\t\t\t' + 'Ability Bonus: -2',
                '\t\t\t' + 'Other Bonus: 3',
                '\t\t\t' + 'Armor Check Penalty: 0',
                '\tFeats:',
                '\t\tRacial:',
                '\t\t\tracial feat 1',
                '\t\t\tracial feat 2',
                '\t\tClass:',
                '\t\t\tclass feat 1',
                '\t\t\tclass feat 2',
                '\t\tAdditional:',
                '\t\t\tadditional feat 1',
                '\t\t\tadditional feat 2',
                '\tInteresting Trait: None',
                '\tEquipment:',
                '\t\t' + 'Primary Hand:',
                '\t\t\t' + 'primary weapon summary',
                '\t\t\t\t' + 'formatted',
                '\t\tOff Hand: (Two-Handed)',
                '\t\tArmor: None',
                '\t\tTreasure: None',
                '',
            ];
    
            TestHelper.expectLines(lines, expected);
        });
    
        it('formats off-hand item', () => {
            character.equipment.primaryHand = createWeapon('primary weapon');
            character.equipment.offHand = createItem('off-hand item');
    
            var formattedCharacter = pipe.transform(character);
            var lines = formattedCharacter.split('\r\n');
    
            var expected = [
                'character summary:',
                '\tCombat:',
                '\t\tAdjusted Dexterity Bonus: 3 formatted',
                '\t\tArmor Class: 7 formatted',
                '\t\t\tFlat-Footed: 12',
                '\t\t\tTouch: 34',
                '\t\tBase Attack:',
                '\t\t\tMelee: 21 formatted x5',
                '\t\t\tRanged: 22 formatted x5',
                '\t\tHit Points: 3456',
                '\t\tInitiative Bonus: 4567 formatted',
                '\t\tSaving Throws:',
                '\t\t\tFortitude: 56 formatted',
                '\t\t\tReflex: 78 formatted',
                '\t\t\tWill: 67 formatted',
                '\tChallenge Rating: 89',
                '\tAlignment: alignment',
                '\tclass summary',
                '\trace summary',
                '\t\tLand Speed: 30 feet per round formatted',
                '\t\tSize: size',
                '\t\tAge: 18 Years formatted',
                '\t\tMaximum Age: 1800 Years formatted',
                '\t\tHeight: 48 inches formatted',
                '\t\tWeight: 100 Pounds formatted',
                '\tAbilities:',
                '\t\tStrength: 2 (-4 formatted)',
                '\t\tConstitution: 26 (13 formatted)',
                '\t\tDexterity: 6 (-2 formatted)',
                '\t\tIntelligence: 90 (45 formatted)',
                '\t\tWisdom: 10 (0 formatted)',
                '\t\tCharisma: 9 (-1 formatted)',
                '\tLanguages:',
                '\t\tEnglish',
                '\t\tGerman',
                '\tSkills:',
                '\t\tskill 1',
                '\t\t\tTotal Bonus: 135 formatted',
                '\t\t\tRanks: 4',
                '\t\t\tAbility Bonus: 13',
                '\t\t\tOther Bonus: 0',
                '\t\t\tArmor Check Penalty: -6',
                '\t\t\tClass Skill',
                '\t\tskill 2 (focus)',
                '\t\t\t' + 'Total Bonus: 246 formatted',
                '\t\t\t' + 'Ranks: 1.5',
                '\t\t\t' + 'Ability Bonus: -2',
                '\t\t\t' + 'Other Bonus: 3',
                '\t\t\t' + 'Armor Check Penalty: 0',
                '\tFeats:',
                '\t\tRacial:',
                '\t\t\tracial feat 1',
                '\t\t\tracial feat 2',
                '\t\tClass:',
                '\t\t\tclass feat 1',
                '\t\t\tclass feat 2',
                '\t\tAdditional:',
                '\t\t\tadditional feat 1',
                '\t\t\tadditional feat 2',
                '\t' + 'Interesting Trait: None',
                '\t' + 'Equipment:',
                '\t\t' + 'Primary Hand:',
                '\t\t\t' + 'primary weapon summary',
                '\t\t\t\t' + 'formatted',
                '\t\t' + 'Off Hand:',
                '\t\t\t' + 'off-hand item summary',
                '\t\t\t\t' + 'formatted',
                '\t\t' + 'Armor: None',
                '\t\t' + 'Treasure: None',
                '',
            ];
    
            TestHelper.expectLines(lines, expected);
        });
    
        it('formats armor', () => {
            character.equipment.armor = createArmor('armor');
    
            var formattedCharacter = pipe.transform(character);
            var lines = formattedCharacter.split('\r\n');
    
            var expected = [
                'character summary:',
                '\tCombat:',
                '\t\tAdjusted Dexterity Bonus: 3 formatted',
                '\t\tArmor Class: 7 formatted',
                '\t\t\tFlat-Footed: 12',
                '\t\t\tTouch: 34',
                '\t\tBase Attack:',
                '\t\t\tMelee: 21 formatted x5',
                '\t\t\tRanged: 22 formatted x5',
                '\t\tHit Points: 3456',
                '\t\tInitiative Bonus: 4567 formatted',
                '\t\tSaving Throws:',
                '\t\t\tFortitude: 56 formatted',
                '\t\t\tReflex: 78 formatted',
                '\t\t\tWill: 67 formatted',
                '\tChallenge Rating: 89',
                '\tAlignment: alignment',
                '\tclass summary',
                '\trace summary',
                '\t\tLand Speed: 30 feet per round formatted',
                '\t\tSize: size',
                '\t\tAge: 18 Years formatted',
                '\t\tMaximum Age: 1800 Years formatted',
                '\t\tHeight: 48 inches formatted',
                '\t\tWeight: 100 Pounds formatted',
                '\tAbilities:',
                '\t\tStrength: 2 (-4 formatted)',
                '\t\tConstitution: 26 (13 formatted)',
                '\t\tDexterity: 6 (-2 formatted)',
                '\t\tIntelligence: 90 (45 formatted)',
                '\t\tWisdom: 10 (0 formatted)',
                '\t\tCharisma: 9 (-1 formatted)',
                '\tLanguages:',
                '\t\tEnglish',
                '\t\tGerman',
                '\tSkills:',
                '\t\tskill 1',
                '\t\t\tTotal Bonus: 135 formatted',
                '\t\t\tRanks: 4',
                '\t\t\tAbility Bonus: 13',
                '\t\t\tOther Bonus: 0',
                '\t\t\tArmor Check Penalty: -6',
                '\t\t\tClass Skill',
                '\t\tskill 2 (focus)',
                '\t\t\t' + 'Total Bonus: 246 formatted',
                '\t\t\t' + 'Ranks: 1.5',
                '\t\t\t' + 'Ability Bonus: -2',
                '\t\t\t' + 'Other Bonus: 3',
                '\t\t\t' + 'Armor Check Penalty: 0',
                '\tFeats:',
                '\t\tRacial:',
                '\t\t\tracial feat 1',
                '\t\t\tracial feat 2',
                '\t\tClass:',
                '\t\t\tclass feat 1',
                '\t\t\tclass feat 2',
                '\t\tAdditional:',
                '\t\t\tadditional feat 1',
                '\t\t\tadditional feat 2',
                '\tInteresting Trait: None',
                '\tEquipment:',
                '\t\tPrimary Hand: None',
                '\t\tOff Hand: None',
                '\t\tArmor:',
                '\t\t\tarmor summary',
                '\t\t\t\tformatted',
                '\t\tTreasure: None',
                '',
            ];
    
            TestHelper.expectLines(lines, expected);
        });
    
        it('formats treasure if there is any', () => {
            character.equipment.treasure.isAny = true;
            character.equipment.treasure.coin.quantity = 9;
            character.equipment.treasure.goods = [new Good('good 1', 1), new Good('good 2', 2)];
            character.equipment.treasure.items = [new Item('item 1', 'item type 1'), new Item('item 2', 'item type 2'), new Item('item 3', 'item type 3')];
    
            var formattedCharacter = pipe.transform(character);
            var lines = formattedCharacter.split('\r\n');
    
            var expected = [
                'character summary:',
                '\t' + 'Combat:',
                '\t\t' + 'Adjusted Dexterity Bonus: 3 formatted',
                '\t\t' + 'Armor Class: 7 formatted',
                '\t\t\t' + 'Flat-Footed: 12',
                '\t\t\t' + 'Touch: 34',
                '\t\t' + 'Base Attack:',
                '\t\t\t' + 'Melee: 21 formatted x5',
                '\t\t\t' + 'Ranged: 22 formatted x5',
                '\t\t' + 'Hit Points: 3456',
                '\t\t' + 'Initiative Bonus: 4567 formatted',
                '\t\t' + 'Saving Throws:',
                '\t\t\t' + 'Fortitude: 56 formatted',
                '\t\t\t' + 'Reflex: 78 formatted',
                '\t\t\t' + 'Will: 67 formatted',
                '\t' + 'Challenge Rating: 89',
                '\t' + 'Alignment: alignment',
                '\t' + 'class summary',
                '\t' + 'race summary',
                '\t\t' + 'Land Speed: 30 feet per round formatted',
                '\t\t' + 'Size: size',
                '\t\t' + 'Age: 18 Years formatted',
                '\t\t' + 'Maximum Age: 1800 Years formatted',
                '\t\t' + 'Height: 48 inches formatted',
                '\t\t' + 'Weight: 100 Pounds formatted',
                '\t' + 'Abilities:',
                '\t\t' + 'Strength: 2 (-4 formatted)',
                '\t\t' + 'Constitution: 26 (13 formatted)',
                '\t\t' + 'Dexterity: 6 (-2 formatted)',
                '\t\t' + 'Intelligence: 90 (45 formatted)',
                '\t\t' + 'Wisdom: 10 (0 formatted)',
                '\t\t' + 'Charisma: 9 (-1 formatted)',
                '\t' + 'Languages:',
                '\t\t' + 'English',
                '\t\t' + 'German',
                '\t' + 'Skills:',
                '\t\t' + 'skill 1',
                '\t\t\t' + 'Total Bonus: 135 formatted',
                '\t\t\t' + 'Ranks: 4',
                '\t\t\t' + 'Ability Bonus: 13',
                '\t\t\t' + 'Other Bonus: 0',
                '\t\t\t' + 'Armor Check Penalty: -6',
                '\t\t\t' + 'Class Skill',
                '\t\t' + 'skill 2 (focus)',
                '\t\t\t' + 'Total Bonus: 246 formatted',
                '\t\t\t' + 'Ranks: 1.5',
                '\t\t\t' + 'Ability Bonus: -2',
                '\t\t\t' + 'Other Bonus: 3',
                '\t\t\t' + 'Armor Check Penalty: 0',
                '\t' + 'Feats:',
                '\t\t' + 'Racial:',
                '\t\t\t' + 'racial feat 1',
                '\t\t\t' + 'racial feat 2',
                '\t\t' + 'Class:',
                '\t\t\t' + 'class feat 1',
                '\t\t\t' + 'class feat 2',
                '\t\t' + 'Additional:',
                '\t\t\t' + 'additional feat 1',
                '\t\t\t' + 'additional feat 2',
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
                '',
            ];
    
            TestHelper.expectLines(lines, expected);
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
                new Spell({'my source': 0}, 'spell 0.1', []),
                new Spell({'my source': 0}, 'spell 0.2', []),
                new Spell({'my source': 1}, 'spell 1.1', []),
                new Spell({'my source': 1}, 'spell 1.2', []),
                new Spell({'my other source': 1}, 'spell 2.1', []),
                new Spell({'my other source': 1}, 'spell 2.2', []),
                new Spell({'my other source': 2}, 'spell 3.1', []),
                new Spell({'my other source': 2}, 'spell 3.2', []),
            ];
    
            character.magic.preparedSpells = [
                new Spell({'my source': 0}, 'prepared spell 0.1', []),
                new Spell({'my source': 0}, 'prepared spell 0.1', []),
                new Spell({'my source': 0}, 'prepared spell 0.2', []),
                new Spell({'my source': 1}, 'prepared spell 1.1', []),
                new Spell({'my source': 1}, 'prepared spell 1.2', []),
                new Spell({'my source': 1}, 'prepared spell 1.2', []),
                new Spell({'my other source': 1}, 'prepared spell 2.1', []),
                new Spell({'my other source': 1}, 'prepared spell 2.2', []),
                new Spell({'my other source': 1}, 'prepared spell 2.2', []),
                new Spell({'my other source': 2}, 'prepared spell 3.1', []),
                new Spell({'my other source': 2}, 'prepared spell 3.1', []),
                new Spell({'my other source': 2}, 'prepared spell 3.2', []),
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
                'character summary:',
                '\t' + 'Combat:',
                '\t\t' + 'Adjusted Dexterity Bonus: 3 formatted',
                '\t\t' + 'Armor Class: 7 formatted',
                '\t\t\t' + 'Flat-Footed: 12',
                '\t\t\t' + 'Touch: 34',
                '\t\t' + 'Base Attack:',
                '\t\t\t' + 'Melee: 21 formatted x5',
                '\t\t\t' + 'Ranged: 22 formatted x5',
                '\t\t' + 'Hit Points: 3456',
                '\t\t' + 'Initiative Bonus: 4567 formatted',
                '\t\t' + 'Saving Throws:',
                '\t\t\t' + 'Fortitude: 56 formatted',
                '\t\t\t' + 'Reflex: 78 formatted',
                '\t\t\t' + 'Will: 67 formatted',
                '\t\t\t' + 'Circumstantial Bonus',
                '\tChallenge Rating: 89',
                '\tAlignment: alignment',
                '\tclass summary',
                '\t\tSpecialist:',
                '\t\t\tspecialist field 1',
                '\t\t\tspecialist field 2',
                '\t\tProhibited:',
                '\t\t\tprohibited field 1',
                '\t\t\tprohibited field 2',
                '\t' + 'race summary',
                '\t\t' + 'Metarace Species: metarace species',
                '\t\t' + 'Land Speed: 30 feet per round formatted',
                '\t\t' + 'Aerial Speed: 12345 feet per round formatted',
                '\t\t' + 'Swim Speed: 579 feet per round formatted',
                '\t\t' + 'Size: size',
                '\t\t' + 'Age: 18 Years formatted',
                '\t\t' + 'Maximum Age: 1800 Years formatted',
                '\t\t' + 'Height: 48 inches formatted',
                '\t\t' + 'Weight: 100 Pounds formatted',
                '\t\t' + 'Has Wings',
                '\tAbilities:',
                '\t\tStrength: 2 (-4 formatted)',
                '\t\tConstitution: 26 (13 formatted)',
                '\t\tDexterity: 6 (-2 formatted)',
                '\t\tIntelligence: 90 (45 formatted)',
                '\t\tWisdom: 10 (0 formatted)',
                '\t\tCharisma: 9 (-1 formatted)',
                '\tLanguages:',
                '\t\tEnglish',
                '\t\tGerman',
                '\tSkills:',
                '\t\tskill 1',
                '\t\t\tTotal Bonus: 135 formatted',
                '\t\t\tRanks: 4',
                '\t\t\tAbility Bonus: 13',
                '\t\t\tOther Bonus: 0',
                '\t\t\tArmor Check Penalty: -6',
                '\t\t\tClass Skill',
                '\t\tskill 2 (focus)',
                '\t\t\t' + 'Total Bonus: 246 formatted',
                '\t\t\t' + 'Ranks: 1.5',
                '\t\t\t' + 'Ability Bonus: -2',
                '\t\t\t' + 'Other Bonus: 3',
                '\t\t\t' + 'Armor Check Penalty: 0',
                '\t' + 'Feats:',
                '\t\t' + 'Racial:',
                '\t\t\t' + 'racial feat 1',
                '\t\t\t\t' + 'Foci:',
                '\t\t\t\t\t' + 'focus 1',
                '\t\t\t\t\t' + 'focus 2',
                '\t\t\t\t' + 'Frequency: 34567 per sometimes formatted',
                '\t\t\t\t' + 'Power: 23456',
                '\t\t\t' + 'racial feat 2',
                '\t\t' + 'Class:',
                '\t\t\t' + 'class feat 1',
                '\t\t\t\t' + 'Foci:',
                '\t\t\t\t\t' + 'focus 3',
                '\t\t\t\t\t' + 'focus 4',
                '\t\t\t\t' + 'Frequency: 135 per all the time formatted',
                '\t\t\t\t' + 'Power: 246',
                '\t\t\t' + 'class feat 2',
                '\t\t' + 'Additional:',
                '\t\t\t' + 'additional feat 1',
                '\t\t\t\t' + 'Foci:',
                '\t\t\t\t\t' + 'focus 5',
                '\t\t\t\t\t' + 'focus 6',
                '\t\t\t\t' + 'Frequency: 357 per when the sun rises formatted',
                '\t\t\t\t' + 'Power: 468',
                '\t\t\t' + 'additional feat 2',
                '\t' + 'Interesting Trait: interesting trait',
                '\t' + 'Spells Per Day:',
                '\t\t' + 'my source lvl 0: 9 formatted',
                '\t\t' + 'my source lvl 1: 8 formatted',
                '\t\t' + 'my other source lvl 1: 7 formatted',
                '\t\t' + 'my other source lvl 2: 6 formatted',
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
                '\t\t\t' + 'primary weapon summary',
                '\t\t\t\t' + 'formatted',
                '\t\t' + 'Off Hand:',
                '\t\t\t' + 'off-hand item summary',
                '\t\t\t\t' + 'formatted',
                '\t\t' + 'Armor:',
                '\t\t\t' + 'armor summary',
                '\t\t\t\t' + 'formatted',
                '\t\t' + 'Treasure:',
                '\t\t\t' + 'formatted treasure:',
                '\t\t\t\t' + 'coins: 9',
                '\t\t\t\t' + 'goods: 2',
                '\t\t\t\t' + 'items: 3',
                '',
            ];
    
            TestHelper.expectLines(lines, expected);
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
                new Spell({'my source': 0}, 'spell 0.1', []),
                new Spell({'my source': 0}, 'spell 0.2', []),
                new Spell({'my source': 1}, 'spell 1.1', []),
                new Spell({'my source': 1}, 'spell 1.2', []),
                new Spell({'my other source': 1}, 'spell 2.1', []),
                new Spell({'my other source': 1}, 'spell 2.2', []),
                new Spell({'my other source': 2}, 'spell 3.1', []),
                new Spell({'my other source': 2}, 'spell 3.2', []),
            ];
    
            character.magic.preparedSpells = [
                new Spell({'my source': 0}, 'prepared spell 0.1', []),
                new Spell({'my source': 0}, 'prepared spell 0.1', []),
                new Spell({'my source': 0}, 'prepared spell 0.2', []),
                new Spell({'my source': 1}, 'prepared spell 1.1', []),
                new Spell({'my source': 1}, 'prepared spell 1.2', []),
                new Spell({'my source': 1}, 'prepared spell 1.2', []),
                new Spell({'my other source': 1}, 'prepared spell 2.1', []),
                new Spell({'my other source': 1}, 'prepared spell 2.2', []),
                new Spell({'my other source': 1}, 'prepared spell 2.2', []),
                new Spell({'my other source': 2}, 'prepared spell 3.1', []),
                new Spell({'my other source': 2}, 'prepared spell 3.1', []),
                new Spell({'my other source': 2}, 'prepared spell 3.2', []),
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
                '\t' + 'character summary:',
                '\t\t' + 'Combat:',
                '\t\t\t' + 'Adjusted Dexterity Bonus: 3 formatted',
                '\t\t\t' + 'Armor Class: 7 formatted',
                '\t\t\t\t' + 'Flat-Footed: 12',
                '\t\t\t\t' + 'Touch: 34',
                '\t\t\t' + 'Base Attack:',
                '\t\t\t\t' + 'Melee: 21 formatted x5',
                '\t\t\t\t' + 'Ranged: 22 formatted x5',
                '\t\t\t' + 'Hit Points: 3456',
                '\t\t\t' + 'Initiative Bonus: 4567 formatted',
                '\t\t\t' + 'Saving Throws:',
                '\t\t\t\t' + 'Fortitude: 56 formatted',
                '\t\t\t\t' + 'Reflex: 78 formatted',
                '\t\t\t\t' + 'Will: 67 formatted',
                '\t\t\t\t' + 'Circumstantial Bonus',
                '\t\t' + 'Challenge Rating: 89',
                '\t\t' + 'Alignment: alignment',
                '\t\t' + 'class summary',
                '\t\t\t' + 'Specialist:',
                '\t\t\t\t' + 'specialist field 1',
                '\t\t\t\t' + 'specialist field 2',
                '\t\t\t' + 'Prohibited:',
                '\t\t\t\t' + 'prohibited field 1',
                '\t\t\t\t' + 'prohibited field 2',
                '\t\t' + 'race summary',
                '\t\t\t' + 'Metarace Species: metarace species',
                '\t\t\t' + 'Land Speed: 30 feet per round formatted',
                '\t\t\t' + 'Aerial Speed: 12345 feet per round formatted',
                '\t\t\t' + 'Swim Speed: 579 feet per round formatted',
                '\t\t\t' + 'Size: size',
                '\t\t\t' + 'Age: 18 Years formatted',
                '\t\t\t' + 'Maximum Age: 1800 Years formatted',
                '\t\t\t' + 'Height: 48 inches formatted',
                '\t\t\t' + 'Weight: 100 Pounds formatted',
                '\t\t\t' + 'Has Wings',
                '\t\t' + 'Abilities:',
                '\t\t\t' + 'Strength: 2 (-4 formatted)',
                '\t\t\t' + 'Constitution: 26 (13 formatted)',
                '\t\t\t' + 'Dexterity: 6 (-2 formatted)',
                '\t\t\t' + 'Intelligence: 90 (45 formatted)',
                '\t\t\t' + 'Wisdom: 10 (0 formatted)',
                '\t\t\t' + 'Charisma: 9 (-1 formatted)',
                '\t\t' + 'Languages:',
                '\t\t\t' + 'English',
                '\t\t\t' + 'German',
                '\t\tSkills:',
                '\t\t\tskill 1',
                '\t\t\t\tTotal Bonus: 135 formatted',
                '\t\t\t\tRanks: 4',
                '\t\t\t\tAbility Bonus: 13',
                '\t\t\t\tOther Bonus: 0',
                '\t\t\t\tArmor Check Penalty: -6',
                '\t\t\t\tClass Skill',
                '\t\t\tskill 2 (focus)',
                '\t\t\t\t' + 'Total Bonus: 246 formatted',
                '\t\t\t\t' + 'Ranks: 1.5',
                '\t\t\t\t' + 'Ability Bonus: -2',
                '\t\t\t\t' + 'Other Bonus: 3',
                '\t\t\t\t' + 'Armor Check Penalty: 0',
                '\t\t' + 'Feats:',
                '\t\t\t' + 'Racial:',
                '\t\t\t\t' + 'racial feat 1',
                '\t\t\t\t\t' + 'Foci:',
                '\t\t\t\t\t\t' + 'focus 1',
                '\t\t\t\t\t\t' + 'focus 2',
                '\t\t\t\t\t' + 'Frequency: 34567 per sometimes formatted',
                '\t\t\t\t\t' + 'Power: 23456',
                '\t\t\t\t' + 'racial feat 2',
                '\t\t\t' + 'Class:',
                '\t\t\t\t' + 'class feat 1',
                '\t\t\t\t\t' + 'Foci:',
                '\t\t\t\t\t\t' + 'focus 3',
                '\t\t\t\t\t\t' + 'focus 4',
                '\t\t\t\t\t' + 'Frequency: 135 per all the time formatted',
                '\t\t\t\t\t' + 'Power: 246',
                '\t\t\t\t' + 'class feat 2',
                '\t\t\t' + 'Additional:',
                '\t\t\t\t' + 'additional feat 1',
                '\t\t\t\t\t' + 'Foci:',
                '\t\t\t\t\t\t' + 'focus 5',
                '\t\t\t\t\t\t' + 'focus 6',
                '\t\t\t\t\t' + 'Frequency: 357 per when the sun rises formatted',
                '\t\t\t\t\t' + 'Power: 468',
                '\t\t\t\t' + 'additional feat 2',
                '\t\t' + 'Interesting Trait: interesting trait',
                '\t\t' + 'Spells Per Day:',
                '\t\t\t' + 'my source lvl 0: 9 formatted',
                '\t\t\t' + 'my source lvl 1: 8 formatted',
                '\t\t\t' + 'my other source lvl 1: 7 formatted',
                '\t\t\t' + 'my other source lvl 2: 6 formatted',
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
                '\t\t\t\t' + 'primary weapon summary',
                '\t\t\t\t\t' + 'formatted',
                '\t\t\t' + 'Off Hand:',
                '\t\t\t\t' + 'off-hand item summary',
                '\t\t\t\t\t' + 'formatted',
                '\t\t\t' + 'Armor:',
                '\t\t\t\t' + 'armor summary',
                '\t\t\t\t\t' + 'formatted',
                '\t\t\t' + 'Treasure:',
                '\t\t\t\t' + 'formatted treasure:',
                '\t\t\t\t\t' + 'coins: 9',
                '\t\t\t\t\t' + 'goods: 2',
                '\t\t\t\t\t' + 'items: 3',
                '',
            ];
    
            TestHelper.expectLines(lines, expected);
        });
    
        it('formats undead character', () => {
            character.race.metarace = "undead";
            character.abilities.Constitution = null;
            character.combat.savingThrows.hasFortitudeSave = false;
    
            var formattedCharacter = pipe.transform(character);
            var lines = formattedCharacter.split('\r\n');
    
            var expected = [
                'character summary:',
                '\tCombat:',
                '\t\tAdjusted Dexterity Bonus: 3 formatted',
                '\t\tArmor Class: 7 formatted',
                '\t\t\tFlat-Footed: 12',
                '\t\t\tTouch: 34',
                '\t\tBase Attack:',
                '\t\t\tMelee: 21 formatted x5',
                '\t\t\tRanged: 22 formatted x5',
                '\t\tHit Points: 3456',
                '\t\tInitiative Bonus: 4567 formatted',
                '\t\tSaving Throws:',
                '\t\t\tReflex: 78 formatted',
                '\t\t\tWill: 67 formatted',
                '\t' + 'Challenge Rating: 89',
                '\t' + 'Alignment: alignment',
                '\t' + 'class summary',
                '\t' + 'race summary',
                '\t\t' + 'Land Speed: 30 feet per round formatted',
                '\t\t' + 'Size: size',
                '\t\t' + 'Age: 18 Years formatted',
                '\t\t' + 'Maximum Age: 1800 Years formatted',
                '\t\t' + 'Height: 48 inches formatted',
                '\t\t' + 'Weight: 100 Pounds formatted',
                '\t' + 'Abilities:',
                '\t\t' + 'Strength: 2 (-4 formatted)',
                '\t\t' + 'Dexterity: 6 (-2 formatted)',
                '\t\t' + 'Intelligence: 90 (45 formatted)',
                '\t\t' + 'Wisdom: 10 (0 formatted)',
                '\t\t' + 'Charisma: 9 (-1 formatted)',
                '\t' + 'Languages:',
                '\t\t' + 'English',
                '\t\t' + 'German',
                '\t' + 'Skills:',
                '\t\t' + 'skill 1',
                '\t\t\t' + 'Total Bonus: 135 formatted',
                '\t\t\t' + 'Ranks: 4',
                '\t\t\t' + 'Ability Bonus: 13',
                '\t\t\t' + 'Other Bonus: 0',
                '\t\t\t' + 'Armor Check Penalty: -6',
                '\t\t\t' + 'Class Skill',
                '\t\t' + 'skill 2 (focus)',
                '\t\t\t' + 'Total Bonus: 246 formatted',
                '\t\t\t' + 'Ranks: 1.5',
                '\t\t\t' + 'Ability Bonus: -2',
                '\t\t\t' + 'Other Bonus: 3',
                '\t\t\t' + 'Armor Check Penalty: 0',
                '\t' + 'Feats:',
                '\t\t' + 'Racial:',
                '\t\t\t' + 'racial feat 1',
                '\t\t\t' + 'racial feat 2',
                '\t\t' + 'Class:',
                '\t\t\t' + 'class feat 1',
                '\t\t\t' + 'class feat 2',
                '\t\t' + 'Additional:',
                '\t\t\t' + 'additional feat 1',
                '\t\t\t' + 'additional feat 2',
                '\t' + 'Interesting Trait: None',
                '\t' + 'Equipment:',
                '\t\tPrimary Hand: None',
                '\t\tOff Hand: None',
                '\t\tArmor: None',
                '\t\tTreasure: None',
                '',
            ];
    
            TestHelper.expectLines(lines, expected);
        });
    });
});