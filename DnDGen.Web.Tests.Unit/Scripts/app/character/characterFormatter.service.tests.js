'use strict'

describe('Character Formatter Service', function () {
    var characterFormatterService;
    var character;
    var leadership;
    var cohort;
    var followers;
    var characterCount;
    var treasureFormatterServiceMock;
    var inchesToFeetFilterMock;

    beforeEach(module('app.character', function ($provide) {
        treasureFormatterServiceMock = {
            formatTreasure: function (treasure, prefix) {
                if (!prefix)
                    prefix = '';

                var formattedTreasure = prefix + 'formatted treasure\r\n';

                return formattedTreasure;
            },
            formatItem: formatItem
        }

        function formatItem(item, prefix) {
            if (!prefix)
                prefix = '';

            var formattedItem = prefix + item.Name + '\r\n';
            formattedItem += prefix + '\tformatted\r\n';

            return formattedItem;
        }

        inchesToFeetFilterMock = function (input) {
            var feet = input / 12;
            feet = feet.toFixed(2);

            return feet + ' feet filtered';
        };

        $provide.value('treasureFormatterService', treasureFormatterServiceMock);
        $provide.value('inchesToFeetFilter', inchesToFeetFilterMock);
    }));

    beforeEach(function () {
        characterCount = 0;

        character = createCharacter();
        leadership = undefined;
        cohort = undefined;
        followers = [];
    });

    beforeEach(inject(function (_characterFormatterService_) {
        characterFormatterService = _characterFormatterService_;
    }));

    function createCharacter() {
        characterCount++;

        var newCharacter = getMock('character');
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
        newCharacter.abilities.charisma = createAbility("Strength", 9 + characterCount, -1 + characterCount);
        newCharacter.abilities.constitution = createAbility("Constitution", 26 + characterCount, 13 + characterCount);
        newCharacter.abilities.dexterity = createAbility("Dexterity", 6 + characterCount, -2 + characterCount);
        newCharacter.abilities.intelligence = createAbility("Intelligence", 90 + characterCount, 45 + characterCount);
        newCharacter.abilities.strength = createAbility("Wisdom", 2 + characterCount, -4 + characterCount);
        newCharacter.abilities.wisdom = createAbility("Charisma", 10 + characterCount, 0 + characterCount);

        expect(newCharacter.abilities.charisma).not.toBeNull();
        expect(newCharacter.abilities.constitution).not.toBeNull();
        expect(newCharacter.abilities.dexterity).not.toBeNull();
        expect(newCharacter.abilities.intelligence).not.toBeNull();
        expect(newCharacter.abilities.strength).not.toBeNull();
        expect(newCharacter.abilities.wisdom).not.toBeNull();

        newCharacter.languages.push('English ' + characterCount);
        newCharacter.languages.push('German ' + characterCount);
        newCharacter.skills.push(createSkill('skill ' + (1 + characterCount), "", 4 + characterCount, newCharacter.abilities.constitution, 0, -6 - characterCount, true, false, 135 + characterCount));
        newCharacter.skills.push(createSkill('skill ' + (2 + characterCount), "focus", 1.5 + characterCount, newCharacter.abilities.dexterity, 3 + characterCount, 0, false, true, 246 + characterCount));
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

        newCharacter.summary = "character summary " + characterCount;
        newCharacter.challengeRating = 89 + characterCount;

        return newCharacter;
    }

    function createAbility(name, value, bonus) {
        var ability = getMock('ability');

        ability.name = name;
        ability.value = value;
        ability.bonus = bonus;

        return ability;
    }

    function createSkill(name, focus, effectiveRanks, baseAbility, bonus, acPenalty, classSkill, circumstantialBonus, totalBonus) {
        var skill = getMock('skill');

        skill.name = name;
        skill.focus = focus;
        skill.effectiveRanks = effectiveRanks;
        skill.baseAbility = baseAbility;
        skill.bonus = bonus;
        skill.armorCheckPenalty = acPenalty;
        skill.classSkill = classSkill;
        skill.circumstantialBonus = circumstantialBonus;
        skill.totalBonus = totalBonus;

        return skill;
    }

    function createFeat(name) {
        var feat = getMock('feat');

        feat.Name = name;

        return feat;
    }

    function createItem(itemName) {
        return {
            Name: itemName,
            Attributes: ['item attribute']
        };
    }

    it('formats character basics', function () {
        var formattedCharacter = characterFormatterService.formatCharacter(character, leadership, cohort, followers);
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

        for (var i = 0; i < lines.length; i++) {
            expect(lines[i]).toBe(expected[i]);
        }

        expect(lines.length).toBe(expected.length);
    });

    it('formats measurement with no description', function () {
        character.race.age.description = '';
        character.race.maximumAge.description = '';
        character.race.landSpeed.description = '';
        character.race.height.description = '';
        character.race.weight.description = '';

        var formattedCharacter = characterFormatterService.formatCharacter(character, leadership, cohort, followers);
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

        for (var i = 0; i < lines.length; i++) {
            expect(lines[i]).toBe(expected[i]);
        }

        expect(lines.length).toBe(expected.length);
    });

    it('formats class specialization', function () {
        character.class.specialistFields = ["specialist field 1", "specialist field 2"];

        var formattedCharacter = characterFormatterService.formatCharacter(character, leadership, cohort, followers);
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

        for (var i = 0; i < lines.length; i++) {
            expect(lines[i]).toBe(expected[i]);
        }

        expect(lines.length).toBe(expected.length);
    });

    it('formats prohibited fields', function () {
        character.class.specialistFields = ["specialist field 1", "specialist field 2"];
        character.class.prohibitedFields = ["prohibited field 1", "prohibited field 2"];

        var formattedCharacter = characterFormatterService.formatCharacter(character, leadership, cohort, followers);
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

        for (var i = 0; i < lines.length; i++) {
            expect(lines[i]).toBe(expected[i]);
        }

        expect(lines.length).toBe(expected.length);
    });

    it('formats metarace species', function () {
        character.race.metaraceSpecies = 'metarace species';

        var formattedCharacter = characterFormatterService.formatCharacter(character, leadership, cohort, followers);
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

        for (var i = 0; i < lines.length; i++) {
            expect(lines[i]).toBe(expected[i]);
        }

        expect(lines.length).toBe(expected.length);
    });

    it('formats wings', function () {
        character.race.hasWings = true;

        var formattedCharacter = characterFormatterService.formatCharacter(character, leadership, cohort, followers);
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

        for (var i = 0; i < lines.length; i++) {
            expect(lines[i]).toBe(expected[i]);
        }

        expect(lines.length).toBe(expected.length);
    });

    it('formats aerial speed', function () {
        character.race.aerialSpeed.value = 9876;
        character.race.aerialSpeed.description = "swift";

        var formattedCharacter = characterFormatterService.formatCharacter(character, leadership, cohort, followers);
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

        for (var i = 0; i < lines.length; i++) {
            expect(lines[i]).toBe(expected[i]);
        }

        expect(lines.length).toBe(expected.length);
    });

    it('formats swim speed', function () {
        character.race.swimSpeed.value = 9876;
        character.race.swimSpeed.description = "alacrid";

        var formattedCharacter = characterFormatterService.formatCharacter(character, leadership, cohort, followers);
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

        for (var i = 0; i < lines.length; i++) {
            expect(lines[i]).toBe(expected[i]);
        }

        expect(lines.length).toBe(expected.length);

    });

    it('formats no racial feats', function () {
        character.feats.racial = [];

        var formattedCharacter = characterFormatterService.formatCharacter(character, leadership, cohort, followers);
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

        for (var i = 0; i < lines.length; i++) {
            expect(lines[i]).toBe(expected[i]);
        }

        expect(lines.length).toBe(expected.length);
    });

    it('formats no class feats', function () {
        character.feats.class = [];

        var formattedCharacter = characterFormatterService.formatCharacter(character, leadership, cohort, followers);
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

        for (var i = 0; i < lines.length; i++) {
            expect(lines[i]).toBe(expected[i]);
        }

        expect(lines.length).toBe(expected.length);
    });

    it('formats feat foci', function () {
        character.feats.racial[0].foci = ['focus 1', 'focus 2'];
        character.feats.class[0].foci = ['focus 3', 'focus 4'];
        character.feats.additional[0].foci = ['focus 5', 'focus 6'];

        var formattedCharacter = characterFormatterService.formatCharacter(character, leadership, cohort, followers);
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

        for (var i = 0; i < lines.length; i++) {
            expect(lines[i]).toBe(expected[i]);
        }

        expect(lines.length).toBe(expected.length);
    });

    it('formats feat power', function () {
        character.feats.racial[0].power = 9876;
        character.feats.class[0].power = 8765;
        character.feats.additional[0].power = 7654;

        var formattedCharacter = characterFormatterService.formatCharacter(character, leadership, cohort, followers);
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

        for (var i = 0; i < lines.length; i++) {
            expect(lines[i]).toBe(expected[i]);
        }

        expect(lines.length).toBe(expected.length);
    });

    it('formats feat frequency', function () {
        character.feats.racial[0].frequency.quantity = 9876;
        character.feats.racial[0].frequency.timePeriod = 'fortnight';
        character.feats.class[0].frequency.quantity = 8765;
        character.feats.class[0].frequency.timePeriod = 'moon cycle';
        character.feats.additional[0].frequency.quantity = 7654;
        character.feats.additional[0].frequency.timePeriod = 'turn of the wheel';

        var formattedCharacter = characterFormatterService.formatCharacter(character, leadership, cohort, followers);
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

        for (var i = 0; i < lines.length; i++) {
            expect(lines[i]).toBe(expected[i]);
        }

        expect(lines.length).toBe(expected.length);
    });

    it('formats feat frequency without quantity', function () {
        character.feats.racial[0].frequency.quantity = 0;
        character.feats.racial[0].frequency.timePeriod = 'all day erry day';
        character.feats.class[0].frequency.quantity = 0;
        character.feats.class[0].frequency.timePeriod = 'whenever I want';
        character.feats.additional[0].frequency.quantity = 0;
        character.feats.additional[0].frequency.timePeriod = 'when pigs fly';

        var formattedCharacter = characterFormatterService.formatCharacter(character, leadership, cohort, followers);
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

        for (var i = 0; i < lines.length; i++) {
            expect(lines[i]).toBe(expected[i]);
        }

        expect(lines.length).toBe(expected.length);
    });

    it('formats interesting trait', function () {
        character.interestingTrait = 'is interesting';

        var formattedCharacter = characterFormatterService.formatCharacter(character, leadership, cohort, followers);
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

        for (var i = 0; i < lines.length; i++) {
            expect(lines[i]).toBe(expected[i]);
        }

        expect(lines.length).toBe(expected.length);
    });

    it('formats spells per day', function () {
        character.magic.spellsPerDay = [
            { level: 0, quantity: 9, hasDomainSpell: false },
            { level: 1, quantity: 8, hasDomainSpell: true }
        ];

        var formattedCharacter = characterFormatterService.formatCharacter(character, leadership, cohort, followers);
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
            '\t\t' + 'Level 0: 9',
            '\t\t' + 'Level 1: 8 + 1',
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

        for (var i = 0; i < lines.length; i++) {
            expect(lines[i]).toBe(expected[i]);
        }

        expect(lines.length).toBe(expected.length);
    });

    it('formats known spells', function () {
        character.magic.spellsPerDay = [
            { level: 0, quantity: 9, hasDomainSpell: false },
            { level: 1, quantity: 8, hasDomainSpell: true }
        ];

        character.magic.knownSpells = [
            { name: 'first spell', level: 0 },
            { name: 'second spell', level: 1 }
        ];

        var formattedCharacter = characterFormatterService.formatCharacter(character, leadership, cohort, followers);
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
            '\t\t' + 'Level 0: 9',
            '\t\t' + 'Level 1: 8 + 1',
            '\t' + 'Known Spells:',
            '\t\t' + 'first spell (0)',
            '\t\t' + 'second spell (1)',
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

        for (var i = 0; i < lines.length; i++) {
            expect(lines[i]).toBe(expected[i]);
        }

        expect(lines.length).toBe(expected.length);
    });

    it('formats prepared spells', function () {
        character.magic.spellsPerDay = [
            { level: 0, quantity: 9, hasDomainSpell: false },
            { level: 1, quantity: 8, hasDomainSpell: true }
        ];

        character.magic.KnownSpells = [
            { name: 'first spell', level: 0 },
            { name: 'second spell', level: 1 }
        ];

        character.magic.preparedSpells = [
            { name: 'first prepared spell', level: 0 },
            { name: 'first prepared spell', level: 0 },
            { name: 'second prepared spell', level: 1 }
        ];

        var formattedCharacter = characterFormatterService.formatCharacter(character, leadership, cohort, followers);
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
            '\t\t' + 'Level 0: 9',
            '\t\t' + 'Level 1: 8 + 1',
            '\t' + 'Known Spells:',
            '\t\t' + 'first spell (0)',
            '\t\t' + 'second spell (1)',
            '\t' + 'Prepared Spells:',
            '\t\t' + 'first prepared spell (0)',
            '\t\t' + 'first prepared spell (0)',
            '\t\t' + 'second prepared spell (1)',
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

        for (var i = 0; i < lines.length; i++) {
            expect(lines[i]).toBe(expected[i]);
        }

        expect(lines.length).toBe(expected.length);
    });

    it('formats arcane spell failure', function () {
        character.magic.arcaneSpellFailure = 98;

        var formattedCharacter = characterFormatterService.formatCharacter(character, leadership, cohort, followers);
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

        for (var i = 0; i < lines.length; i++) {
            expect(lines[i]).toBe(expected[i]);
        }

        expect(lines.length).toBe(expected.length);
    });

    it('formats animal', function () {
        character.magic.animal = 'familiar';

        var formattedCharacter = characterFormatterService.formatCharacter(character, leadership, cohort, followers);
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

        for (var i = 0; i < lines.length; i++) {
            expect(lines[i]).toBe(expected[i]);
        }

        expect(lines.length).toBe(expected.length);
    });

    it('formats primary hand', function () {
        character.equipment.primaryHand = createItem('primary weapon');

        var formattedCharacter = characterFormatterService.formatCharacter(character, leadership, cohort, followers);
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
            '\t\t\t' + 'primary weapon',
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

        for (var i = 0; i < lines.length; i++) {
            expect(lines[i]).toBe(expected[i]);
        }

        expect(lines.length).toBe(expected.length);
    });

    it('formats two-handed weapon', function () {
        character.qquipment.primaryHand = createItem('primary weapon');
        character.qquipment.primaryHand.attributes.push('Two-Handed');

        var formattedCharacter = characterFormatterService.formatCharacter(character, leadership, cohort, followers);
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
            '\t\t\t' + 'primary weapon',
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

        for (var i = 0; i < lines.length; i++) {
            expect(lines[i]).toBe(expected[i]);
        }

        expect(lines.length).toBe(expected.length);
    });

    it('formats off-hand item', function () {
        character.equipment.primaryHand = createItem('primary weapon');
        character.equipment.offHand = createItem('off-hand item');

        var formattedCharacter = characterFormatterService.formatCharacter(character, leadership, cohort, followers);
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
            '\t\t\t' + 'primary weapon',
            '\t\t\t\t' + 'formatted',
            '\t\t' + 'Off Hand:',
            '\t\t\t' + 'off-hand item',
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

        for (var i = 0; i < lines.length; i++) {
            expect(lines[i]).toBe(expected[i]);
        }

        expect(lines.length).toBe(expected.length);
    });

    it('formats armor', function () {
        character.equipment.armor = createItem('armor');

        var formattedCharacter = characterFormatterService.formatCharacter(character, leadership, cohort, followers);
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
            '\t\t\tarmor',
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

        for (var i = 0; i < lines.length; i++) {
            expect(lines[i]).toBe(expected[i]);
        }

        expect(lines.length).toBe(expected.length);
    });

    it('formats treasure if there is any', function () {
        character.equipment.treasure.isAny = true;

        var formattedCharacter = characterFormatterService.formatCharacter(character, leadership, cohort, followers);
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
            '\t\t\t' + 'formatted treasure',
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

        for (var i = 0; i < lines.length; i++) {
            expect(lines[i]).toBe(expected[i]);
        }
    });

    it('formats circumstantial armor bonus', function () {
        character.combat.armorClass.circumstantialBonus = true;

        var formattedCharacter = characterFormatterService.formatCharacter(character, leadership, cohort, followers);
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

        for (var i = 0; i < lines.length; i++) {
            expect(lines[i]).toBe(expected[i]);
        }

        expect(lines.length).toBe(expected.length);
    });

    it('formats circumstantial base attack bonus', function () {
        character.combat.baseAttack.circumstantialBonus = true;

        var formattedCharacter = characterFormatterService.formatCharacter(character, leadership, cohort, followers);
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

        for (var i = 0; i < lines.length; i++) {
            expect(lines[i]).toBe(expected[i]);
        }

        expect(lines.length).toBe(expected.length);
    });

    it('formats negative base attack bonus', function () {
        character.combat.baseAttack.allMeleeBonuses = [-2]
        character.combat.baseAttack.allRangedBonuses = [-1];

        var formattedCharacter = characterFormatterService.formatCharacter(character, leadership, cohort, followers);
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

        for (var i = 0; i < lines.length; i++) {
            expect(lines[i]).toBe(expected[i]);
        }

        expect(lines.length).toBe(expected.length);
    });

    it('formats circumstantial save bonus', function () {
        character.combat.savingThrows.circumstantialBonus = true;

        var formattedCharacter = characterFormatterService.formatCharacter(character, leadership, cohort, followers);
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

        for (var i = 0; i < lines.length; i++) {
            expect(lines[i]).toBe(expected[i]);
        }

        expect(lines.length).toBe(expected.length);
    });

    it('formats full character', function () {
        character.class.specialistFields = ["specialist field 1", "specialist field 2" ];
        character.class.prohibitedFields = ["prohibited field 1", "prohibited field 2" ];
        character.race.metarace = "metarace";
        character.race.metaraceSpecies = "metarace species";
        character.race.hasWings = true;
        character.race.aerialSpeed.value = 12345;
        character.race.aerialSpeed.description = 'supafly';
        character.race.swimSpeed.value = 579;
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
            { level: 0, quantity: 45678 },
            { level: 1, quantity: 56789  , hasDomainSpell: true }
        ];

        character.magic.knownSpells = [
            { name: 'first spell', level: 0 },
            { name: 'second spell', level: 1 }
        ];

        character.magic.preparedSpells = [
            { name: 'first prepared spell', level: 0 },
            { name: 'first prepared spell', level: 0 },
            { name: 'second prepared spell', level: 1 }
        ];

        character.magic.arcaneSpellFailure = 12;
        character.magic.animal = "animal";
        character.equipment.primaryHand = createItem('primary weapon');
        character.equipment.offHand = createItem('off-hand item');
        character.equipment.armor = createItem('armor');
        character.equipment.treasure.isAny = true;
        character.combat.armorClass.circumstantialBonus = true;
        character.combat.baseAttack.circumstantialBonus = true;
        character.combat.savingThrows.circumstantialBonus = true;

        var formattedCharacter = characterFormatterService.formatCharacter(character, leadership, cohort, followers);
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
            '\t\t' + 'Level 0: 45678',
            '\t\t' + 'Level 1: 56789 + 1',
            '\t' + 'Known Spells:',
            '\t\t' + 'first spell (0)',
            '\t\t' + 'second spell (1)',
            '\t' + 'Prepared Spells:',
            '\t\t' + 'first prepared spell (0)',
            '\t\t' + 'first prepared spell (0)',
            '\t\t' + 'second prepared spell (1)',
            '\t' + 'Arcane Spell Failure: 12%',
            '\t' + 'Animal: animal',
            '\tEquipment:',
            '\t\t' + 'Primary Hand:',
            '\t\t\t' + 'primary weapon',
            '\t\t\t\t' + 'formatted',
            '\t\t' + 'Off Hand:',
            '\t\t\t' + 'off-hand item',
            '\t\t\t\t' + 'formatted',
            '\t\t' + 'Armor:',
            '\t\t\t' + 'armor',
            '\t\t\t\t' + 'formatted',
            '\t\t' + 'Treasure:',
            '\t\t\t' + 'formatted treasure',
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

        for (var i = 0; i < lines.length; i++) {
            expect(lines[i]).toBe(expected[i]);
        }

        expect(lines.length).toBe(expected.length);
    });

    it('formats full character with prefix', function () {
        character.class.specialistFields = ["specialist field 1", "specialist field 2"];
        character.class.prohibitedFields = ["prohibited field 1", "prohibited field 2"];
        character.race.metarace = "metarace";
        character.race.metaraceSpecies = "metarace species";
        character.race.hasWings = true;
        character.race.aerialSpeed.value = 12345;
        character.race.aerialSpeed.description = 'supafly';
        character.race.swimSpeed.value = 579;
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
            { level: 0, quantity: 45678 },
            { level: 1, quantity: 56789, hasDomainSpell: true }
        ];

        character.magic.knownSpells = [
            { name: 'first spell', level: 0 },
            { name: 'second spell', level: 1 }
        ];

        character.magic.preparedSpells = [
            { name: 'first prepared spell', level: 0 },
            { name: 'first prepared spell', level: 0 },
            { name: 'second prepared spell', level: 1 }
        ];

        character.magic.arcaneSpellFailure = 12;
        character.magic.animal = "animal";
        character.equipment.primaryHand = createItem('primary weapon');
        character.equipment.offHand = createItem('off-hand item');
        character.equipment.armor = createItem('armor');
        character.equipment.treasure.isAny = true;
        character.combat.armorClass.circumstantialBonus = true;
        character.combat.baseAttack.circumstantialBonus = true;
        character.combat.savingThrows.circumstantialBonus = true;

        var formattedCharacter = characterFormatterService.formatCharacter(character, null, null, null, '\t');
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
            '\t\t\t' + 'Level 0: 45678',
            '\t\t\t' + 'Level 1: 56789 + 1',
            '\t\t' + 'Known Spells:',
            '\t\t\t' + 'first spell (0)',
            '\t\t\t' + 'second spell (1)',
            '\t\t' + 'Prepared Spells:',
            '\t\t\t' + 'first prepared spell (0)',
            '\t\t\t' + 'first prepared spell (0)',
            '\t\t\t' + 'second prepared spell (1)',
            '\t\t' + 'Arcane Spell Failure: 12%',
            '\t\t' + 'Animal: animal',
            '\t\t' + 'Equipment:',
            '\t\t\t' + 'Primary Hand:',
            '\t\t\t\t' + 'primary weapon',
            '\t\t\t\t\t' + 'formatted',
            '\t\t\t' + 'Off Hand:',
            '\t\t\t\t' + 'off-hand item',
            '\t\t\t\t\t' + 'formatted',
            '\t\t\t' + 'Armor:',
            '\t\t\t\t' + 'armor',
            '\t\t\t\t\t' + 'formatted',
            '\t\t\t' + 'Treasure:',
            '\t\t\t\t' + 'formatted treasure',
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

        for (var i = 0; i < lines.length; i++) {
            expect(lines[i]).toBe(expected[i]);
        }

        expect(lines.length).toBe(expected.length);
    });

    it('formats character with full leadership', function () {
        leadership = {
            score: 9876,
            leadershipModifiers: ['killed a man', 'with this thumb']
        };

        cohort = createCharacter();
        followers = [createCharacter(), createCharacter()];

        var formattedCharacter = characterFormatterService.formatCharacter(character, leadership, cohort, followers);
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
            'Followers:',
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

        for (var i = 0; i < lines.length; i++) {
            expect(lines[i]).toBe(expected[i]);
        }

        expect(lines.length).toBe(expected.length);
    });

    it('formats character with full leadership and prefix', function () {
        leadership = {
            score: 9876,
            leadershipModifiers: ['killed a man', 'with this thumb']
        };

        cohort = createCharacter();
        followers = [createCharacter(), createCharacter()];

        var formattedCharacter = characterFormatterService.formatCharacter(character, leadership, cohort, followers, '\t');
        var lines = formattedCharacter.split('\r\n');

        var expected = [
            '\tcharacter summary 1:',
            '\t\tChallenge Rating: 90',
            '\t\tAlignment: alignment 1',
            '\t\tclass summary 1',
            '\t\trace summary 1',
            '\t\t\tLand Speed: 31 feet per round (fast 1)',
            '\t\t\tSize: size 1',
            '\t\t\tAge: 19 Years (adult 1)',
            '\t\t\tMaximum Age: 1801 Years (natural causes 1)',
            '\t\t\tHeight: 4.08 feet filtered (tall 1)',
            '\t\t\tWeight: 101 Pounds (heavy 1)',
            '\t\tAbilities:',
            '\t\t\tStrength: 3 (-3)',
            '\t\t\tConstitution: 27 (14)',
            '\t\t\tDexterity: 7 (-1)',
            '\t\t\tIntelligence: 91 (46)',
            '\t\t\tWisdom: 11 (1)',
            '\t\t\tCharisma: 10 (0)',
            '\t\tLanguages:',
            '\t\t\tEnglish 1',
            '\t\t\tGerman 1',
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
            '\t\tFeats:',
            '\t\t\tRacial:',
            '\t\t\t\tracial feat 2',
            '\t\t\t\tracial feat 3',
            '\t\t\tClass:',
            '\t\t\t\tclass feat 2',
            '\t\t\t\tclass feat 3',
            '\t\t\tAdditional:',
            '\t\t\t\tadditional feat 2',
            '\t\t\t\tadditional feat 3',
            '\t\tInteresting Trait: None',
            '\t\tEquipment:',
            '\t\t\tPrimary Hand: None',
            '\t\t\tOff Hand: None',
            '\t\t\tArmor: None',
            '\t\t\tTreasure: None',
            '\t\tCombat:',
            '\t\t\tAdjusted Dexterity Bonus: 4',
            '\t\t\tArmor Class: 8',
            '\t\t\t\tFlat-Footed: 13',
            '\t\t\t\tTouch: 35',
            '\t\t\tBase Attack:',
            '\t\t\t\tMelee: +22/+17/+12/+7/+2',
            '\t\t\t\tRanged: +23/+18/+13/+8/+3',
            '\t\t\tHit Points: 3457',
            '\t\t\tInitiative Bonus: 4568',
            '\t\t\tSaving Throws:',
            '\t\t\t\tFortitude: 57',
            '\t\t\t\tReflex: 79',
            '\t\t\t\tWill: 68',
            '',
            '\tLeadership:',
            '\t\tScore: 9876',
            '\t\tLeadership Modifiers:',
            '\t\t\tkilled a man',
            '\t\t\twith this thumb',
            '',
            '\tCohort:',
            '\t\tcharacter summary 2:',
            '\t\t\t' + 'Challenge Rating: 91',
            '\t\t\tAlignment: alignment 2',
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
            '\tFollowers:',
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
            '\t\t\tLanguages:',
            '\t\t\t\tEnglish 3',
            '\t\t\t\tGerman 3',
            '\t\t\tSkills:',
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
            '\t\t\t' + 'Languages:',
            '\t\t\t\t' + 'English 4',
            '\t\t\t\t' + 'German 4',
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
            '\t\t\t' + 'Feats:',
            '\t\t\t\t' + 'Racial:',
            '\t\t\t\t\t' + 'racial feat 5',
            '\t\t\t\t\t' + 'racial feat 6',
            '\t\t\t\t' + 'Class:',
            '\t\t\t\t\t' + 'class feat 5',
            '\t\t\t\t\t' + 'class feat 6',
            '\t\t\t\t' + 'Additional:',
            '\t\t\t\t\t' + 'additional feat 5',
            '\t\t\t\t\t' + 'additional feat 6',
            '\t\t\t' + 'Interesting Trait: None',
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

        for (var i = 0; i < lines.length; i++) {
            expect(lines[i]).toBe(expected[i]);
        }

        expect(lines.length).toBe(expected.length);
    });

    it('formats undead', function () {
        character.race.metarace = "undead";
        character.abilities.constitution = undefined;
        character.combat.savingThrows.hasFortitudeSave = false;

        var formattedCharacter = characterFormatterService.formatCharacter(character, leadership, cohort, followers);
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

        for (var i = 0; i < lines.length; i++) {
            expect(lines[i]).toBe(expected[i]);
        }

        expect(lines.length).toBe(expected.length);
    });

    it('formats undead as part of full leadership', function () {
        leadership = {
            score: 9876,
            leadershipModifiers: ['killed a man', 'with this thumb']
        };

        cohort = createCharacter();
        followers = [createCharacter(), createCharacter()];

        character.race.metarace = "undead";
        character.abilities.constitution = undefined;
        character.combat.savingThrows.hasFortitudeSave = false;
        cohort.race.metarace = "undead";
        cohort.abilities.constitution = undefined;
        cohort.combat.savingThrows.hasFortitudeSave = false;
        followers[0].race.metarace = "undead";
        followers[0].abilities.constitution = undefined;
        followers[0].combat.savingThrows.hasFortitudeSave = false;
        followers[1].race.metarace = "undead";
        followers[1].abilities.constitution = undefined;
        followers[1].combat.savingThrows.hasFortitudeSave = false;

        var formattedCharacter = characterFormatterService.formatCharacter(character, leadership, cohort, followers);
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
            '\tSkills:',
            '\t\tskill 2',
            '\t\t\t' + 'Total Bonus: 136',
            '\t\t\t' + 'Ranks: 5',
            '\t\t\t' + 'Ability Bonus: 14',
            '\t\t\t' + 'Other Bonus: 0',
            '\t\t\t' + 'Armor Check Penalty: -7',
            '\t\t\t' + 'Class Skill',
            '\t\tskill 3 (focus)',
            '\t\t\t' + 'Total Bonus: 247 *',
            '\t\t\t' + 'Ranks: 2.5',
            '\t\t\t' + 'Ability Bonus: -1',
            '\t\t\t' + 'Other Bonus: 4',
            '\t\t\t' + 'Armor Check Penalty: 0',
            '\tFeats:',
            '\t\t' + 'Racial:',
            '\t\t\t' + 'racial feat 2',
            '\t\t\t' + 'racial feat 3',
            '\t\t' + 'Class:',
            '\t\t\t' + 'class feat 2',
            '\t\t\t' + 'class feat 3',
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
            '\t\t\tReflex: 79',
            '\t\t\tWill: 68',
            '',
            'Leadership:',
            '\tScore: 9876',
            '\tLeadership Modifiers:',
            '\t\tkilled a man',
            '\t\twith this thumb',
            '',
            'Cohort:',
            '\t' + 'character summary 2:',
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
            '\t\t\t' + 'Dexterity: 8 (0)',
            '\t\t\t' + 'Intelligence: 92 (47)',
            '\t\t\t' + 'Wisdom: 12 (2)',
            '\t\t\t' + 'Charisma: 11 (1)',
            '\t\t' + 'Languages:',
            '\t\t\t' + 'English 2',
            '\t\t\t' + 'German 2',
            '\t\tSkills:',
            '\t\t\tskill 3',
            '\t\t\t\t' + 'Total Bonus: 137',
            '\t\t\t\t' + 'Ranks: 6',
            '\t\t\t\t' + 'Ability Bonus: 15',
            '\t\t\t\t' + 'Other Bonus: 0',
            '\t\t\t\t' + 'Armor Check Penalty: -8',
            '\t\t\t\t' + 'Class Skill',
            '\t\t\tskill 4 (focus)',
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
            '\t\t\t\tReflex: 80',
            '\t\t\t\tWill: 69',
            '',
            'Followers:',
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
            '\t\t\t' + 'Dexterity: 9 (1)',
            '\t\t\t' + 'Intelligence: 93 (48)',
            '\t\t\t' + 'Wisdom: 13 (3)',
            '\t\t\t' + 'Charisma: 12 (2)',
            '\t\t' + 'Languages:',
            '\t\t\t' + 'English 3',
            '\t\t\t' + 'German 3',
            '\t\tSkills:',
            '\t\t\tskill 4',
            '\t\t\t\t' + 'Total Bonus: 138',
            '\t\t\t\t' + 'Ranks: 7',
            '\t\t\t\t' + 'Ability Bonus: 16',
            '\t\t\t\t' + 'Other Bonus: 0',
            '\t\t\t\t' + 'Armor Check Penalty: -9',
            '\t\t\t\t' + 'Class Skill',
            '\t\t\tskill 5 (focus)',
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
            '\t\t\t\tReflex: 81',
            '\t\t\t\tWill: 70',
            '',
            '\t' + 'character summary 4:',
            '\t\t' + 'Challenge Rating: 93',
            '\t\t' + 'Alignment: alignment 4',
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
            '\t\t\t' + 'Dexterity: 10 (2)',
            '\t\t\t' + 'Intelligence: 94 (49)',
            '\t\t\t' + 'Wisdom: 14 (4)',
            '\t\t\t' + 'Charisma: 13 (3)',
            '\t\t' + 'Languages:',
            '\t\t\t' + 'English 4',
            '\t\t\t' + 'German 4',
            '\t\tSkills:',
            '\t\t\tskill 5',
            '\t\t\t\t' + 'Total Bonus: 139',
            '\t\t\t\t' + 'Ranks: 8',
            '\t\t\t\t' + 'Ability Bonus: 17',
            '\t\t\t\t' + 'Other Bonus: 0',
            '\t\t\t\t' + 'Armor Check Penalty: -10',
            '\t\t\t\t' + 'Class Skill',
            '\t\t\tskill 6 (focus)',
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
            '\t\t\t\tReflex: 82',
            '\t\t\t\tWill: 71',
            '',
        ];

        for (var i = 0; i < lines.length; i++) {
            expect(lines[i]).toBe(expected[i]);
        }

        expect(lines.length).toBe(expected.length);
    });
});