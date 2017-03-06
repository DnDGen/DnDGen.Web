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
        newCharacter.Alignment.Full = 'alignment ' + characterCount;
        newCharacter.Class.Name = 'class name ' + characterCount;
        newCharacter.Class.Level = 9266 + characterCount;
        newCharacter.Race.BaseRace = 'base race ' + characterCount;
        newCharacter.Race.LandSpeed = 30 + characterCount,
        newCharacter.Race.Size = 'size ' + characterCount;
        newCharacter.Race.Age.Years = 18 + characterCount;
        newCharacter.Race.Age.Stage = 'adult ' + characterCount;
        newCharacter.Race.HeightInInches = 48 + characterCount;
        newCharacter.Race.WeightInPounds = 100 + characterCount;
        newCharacter.Race.Gender = characterCount % 2 == 0 ? "Male" : "Female";
        newCharacter.Ability.Stats.Charisma = createStat(9 + characterCount, -1 + characterCount);
        newCharacter.Ability.Stats.Constitution = createStat(26 + characterCount, 13 + characterCount);
        newCharacter.Ability.Stats.Dexterity = createStat(6 + characterCount, -2 + characterCount);
        newCharacter.Ability.Stats.Intelligence = createStat(90 + characterCount, 45 + characterCount);
        newCharacter.Ability.Stats.Strength = createStat(2 + characterCount, -4 + characterCount);
        newCharacter.Ability.Stats.Wisdom = createStat(10 + characterCount, 0 + characterCount);
        newCharacter.Ability.Languages.push('English ' + characterCount);
        newCharacter.Ability.Languages.push('German ' + characterCount);
        newCharacter.Ability.Skills["skill 1"] = createSkill(4 + characterCount, newCharacter.Ability.Stats["Constitution"], 0, -6 - characterCount, true, false);
        newCharacter.Ability.Skills["skill 2"] = createSkill(1.5 + characterCount, newCharacter.Ability.Stats["Dexterity"], 3 + characterCount, 0, false, true);
        newCharacter.Ability.Feats.push(createFeat('feat ' + (1 + characterCount)));
        newCharacter.Ability.Feats.push(createFeat('feat ' + (2 + characterCount)));
        newCharacter.Combat.AdjustedDexterityBonus = 3 +characterCount;
        newCharacter.Combat.ArmorClass.Full = 7 + characterCount;
        newCharacter.Combat.ArmorClass.Touch = 34 + characterCount;
        newCharacter.Combat.ArmorClass.FlatFooted = 12 + characterCount;

        newCharacter.Combat.BaseAttack.AllMeleeBonuses.length = 0;
        newCharacter.Combat.BaseAttack.AllMeleeBonuses.push(21 + characterCount);
        newCharacter.Combat.BaseAttack.AllMeleeBonuses.push(16 + characterCount);
        newCharacter.Combat.BaseAttack.AllMeleeBonuses.push(11 + characterCount);
        newCharacter.Combat.BaseAttack.AllMeleeBonuses.push(6 + characterCount);
        newCharacter.Combat.BaseAttack.AllMeleeBonuses.push(1 + characterCount);

        newCharacter.Combat.BaseAttack.AllRangedBonuses.length = 0;
        newCharacter.Combat.BaseAttack.AllRangedBonuses.push(22 + characterCount);
        newCharacter.Combat.BaseAttack.AllRangedBonuses.push(17 + characterCount);
        newCharacter.Combat.BaseAttack.AllRangedBonuses.push(12 + characterCount);
        newCharacter.Combat.BaseAttack.AllRangedBonuses.push(7 + characterCount);
        newCharacter.Combat.BaseAttack.AllRangedBonuses.push(2 + characterCount);

        newCharacter.Combat.HitPoints = 3456 + characterCount;
        newCharacter.Combat.InitiativeBonus = 4567 + characterCount;
        newCharacter.Combat.SavingThrows.Fortitude = 56 + characterCount;
        newCharacter.Combat.SavingThrows.Reflex = 78 + characterCount;
        newCharacter.Combat.SavingThrows.Will = 67 + characterCount;
        newCharacter.Combat.SavingThrows.HasFortitudeSave = true;

        return newCharacter;
    }

    function createStat(value, bonus) {
        var stat = getMock('stat');

        stat.Value = value;
        stat.Bonus = bonus;

        return stat;
    }

    function createSkill(effectiveRanks, baseStat, bonus, acPenalty, classSkill, circumstantialBonus) {
        var skill = getMock('skill');

        skill.EffectiveRanks = effectiveRanks;
        skill.BaseStat = baseStat;
        skill.Bonus = bonus;
        skill.ArmorCheckPenalty = acPenalty;
        skill.ClassSkill = classSkill;
        skill.CircumstantialBonus = circumstantialBonus;

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
            'Alignment: alignment 1',
            'Level 9267 class name 1',
            'base race 1',
            '\tFemale',
            '\tLand Speed: 31',
            '\tSize: size 1',
            '\tAge: 19 (adult 1)',
            '\tHeight: 4.083333333333333 feet filtered',
            '\tWeight: 101 lbs.',
            'Stats:',
            '\tStrength: 3 (-3)',
            '\tConstitution: 27 (14)',
            '\tDexterity: 7 (-1)',
            '\tIntelligence: 91 (46)',
            '\tWisdom: 11 (1)',
            '\tCharisma: 10 (0)',
            'Languages:',
            '\tEnglish 1',
            '\tGerman 1',
            'Skills:',
            '\tskill 1',
            '\t\tRanks: 5',
            '\t\tStat Bonus: 14',
            '\t\tOther Bonus: 0',
            '\t\tArmor Check Penalty: -7',
            '\t\tClass Skill',
            '\tskill 2',
            '\t\tRanks: 2.5',
            '\t\tStat Bonus: -1',
            '\t\tOther Bonus: 4',
            '\t\tArmor Check Penalty: 0',
            '\t\tCircumstantial Bonus',
            'Feats:',
            '\tfeat 2',
            '\tfeat 3',
            'Interesting Trait: None',
            "Equipment:",
            "\tPrimary Hand: None",
            "\tOff Hand: None",
            "\tArmor: None",
            "\tTreasure: None",
            "Combat:",
            "\tAdjusted Dexterity Bonus: 4",
            "\tArmor Class: 8",
            "\t\tFlat-Footed: 13",
            "\t\tTouch: 35",
            "\tBase Attack:",
            "\t\tMelee: +22/+17/+12/+7/+2",
            "\t\tRanged: +23/+18/+13/+8/+3",
            "\tHit Points: 3457",
            "\tInitiative Bonus: 4568",
            "\tSaving Throws:",
            "\t\tFortitude: 57",
            "\t\tReflex: 79",
            "\t\tWill: 68",
            '',
        ];

        for (var i = 0; i < lines.length; i++) {
            expect(lines[i]).toBe(expected[i]);
        }

        expect(lines.length).toBe(expected.length);
    });

    it('formats class specialization', function () {
        character.Class.SpecialistFields = ["specialist field 1", "specialist field 2"];

        var formattedCharacter = characterFormatterService.formatCharacter(character, leadership, cohort, followers);
        var lines = formattedCharacter.split('\r\n');

        expect(lines[0]).toBe('Alignment: alignment 1');
        expect(lines[1]).toBe('Level 9267 class name 1');
        expect(lines[2]).toBe("\tSpecialist:");
        expect(lines[3]).toBe("\t\tspecialist field 1");
        expect(lines[4]).toBe("\t\tspecialist field 2");
        expect(lines[5]).toBe('base race 1');
        expect(lines[6]).toBe('\tFemale');
        expect(lines[7]).toBe('\tLand Speed: 31');
        expect(lines[8]).toBe('\tSize: size 1');
        expect(lines[9]).toBe('\tAge: 19 (adult 1)');
        expect(lines[10]).toBe('\tHeight: 4.083333333333333 feet filtered');
        expect(lines[11]).toBe('\tWeight: 101 lbs.');
        expect(lines[12]).toBe('Stats:');
        expect(lines[13]).toBe('\tStrength: 3 (-3)');
        expect(lines[14]).toBe('\tConstitution: 27 (14)');
        expect(lines[15]).toBe('\tDexterity: 7 (-1)');
        expect(lines[16]).toBe('\tIntelligence: 91 (46)');
        expect(lines[17]).toBe('\tWisdom: 11 (1)');
        expect(lines[18]).toBe('\tCharisma: 10 (0)');
        expect(lines[19]).toBe('Languages:');
        expect(lines[20]).toBe('\tEnglish 1');
        expect(lines[21]).toBe('\tGerman 1');
        expect(lines[22]).toBe('Skills:');
        expect(lines[23]).toBe('\tskill 1');
        expect(lines[24]).toBe('\t\tRanks: 5');
        expect(lines[25]).toBe('\t\tStat Bonus: 14');
        expect(lines[26]).toBe('\t\tOther Bonus: 0');
        expect(lines[27]).toBe('\t\tArmor Check Penalty: -7');
        expect(lines[28]).toBe('\t\tClass Skill');
        expect(lines[29]).toBe('\tskill 2');
        expect(lines[30]).toBe('\t\tRanks: 2.5');
        expect(lines[31]).toBe('\t\tStat Bonus: -1');
        expect(lines[32]).toBe('\t\tOther Bonus: 4');
        expect(lines[33]).toBe('\t\tArmor Check Penalty: 0');
        expect(lines[34]).toBe('\t\tCircumstantial Bonus');
        expect(lines[35]).toBe('Feats:');
        expect(lines[36]).toBe('\tfeat 2');
        expect(lines[37]).toBe('\tfeat 3');
        expect(lines[38]).toBe('Interesting Trait: None');
        expect(lines[39]).toBe("Equipment:");
        expect(lines[40]).toBe("\tPrimary Hand: None");
        expect(lines[41]).toBe("\tOff Hand: None");
        expect(lines[42]).toBe("\tArmor: None");
        expect(lines[43]).toBe("\tTreasure: None");
        expect(lines[44]).toBe("Combat:");
        expect(lines[45]).toBe("\tAdjusted Dexterity Bonus: 4");
        expect(lines[46]).toBe("\tArmor Class: 8");
        expect(lines[47]).toBe("\t\tFlat-Footed: 13");
        expect(lines[48]).toBe("\t\tTouch: 35");
        expect(lines[49]).toBe("\tBase Attack:");
        expect(lines[50]).toBe("\t\tMelee: +22/+17/+12/+7/+2");
        expect(lines[51]).toBe("\t\tRanged: +23/+18/+13/+8/+3");
        expect(lines[52]).toBe("\tHit Points: 3457");
        expect(lines[53]).toBe("\tInitiative Bonus: 4568");
        expect(lines[54]).toBe("\tSaving Throws:");
        expect(lines[55]).toBe("\t\tFortitude: 57");
        expect(lines[56]).toBe("\t\tReflex: 79");
        expect(lines[57]).toBe("\t\tWill: 68");
        expect(lines[58]).toBe('');
        expect(lines.length).toBe(59);
    });

    it('formats prohibited fields', function () {
        character.Class.SpecialistFields = ["specialist field 1", "specialist field 2"];
        character.Class.ProhibitedFields = ["prohibited field 1", "prohibited field 2"];

        var formattedCharacter = characterFormatterService.formatCharacter(character, leadership, cohort, followers);
        var lines = formattedCharacter.split('\r\n');

        expect(lines[0]).toBe('Alignment: alignment 1');
        expect(lines[1]).toBe('Level 9267 class name 1');
        expect(lines[2]).toBe("\tSpecialist:");
        expect(lines[3]).toBe("\t\tspecialist field 1");
        expect(lines[4]).toBe("\t\tspecialist field 2");
        expect(lines[5]).toBe("\tProhibited:");
        expect(lines[6]).toBe("\t\tprohibited field 1");
        expect(lines[7]).toBe("\t\tprohibited field 2");
        expect(lines[8]).toBe('base race 1');
        expect(lines[9]).toBe('\tFemale');
        expect(lines[10]).toBe('\tLand Speed: 31');
        expect(lines[11]).toBe('\tSize: size 1');
        expect(lines[12]).toBe('\tAge: 19 (adult 1)');
        expect(lines[13]).toBe('\tHeight: 4.083333333333333 feet filtered');
        expect(lines[14]).toBe('\tWeight: 101 lbs.');
        expect(lines[15]).toBe('Stats:');
        expect(lines[16]).toBe('\tStrength: 3 (-3)');
        expect(lines[17]).toBe('\tConstitution: 27 (14)');
        expect(lines[18]).toBe('\tDexterity: 7 (-1)');
        expect(lines[19]).toBe('\tIntelligence: 91 (46)');
        expect(lines[20]).toBe('\tWisdom: 11 (1)');
        expect(lines[21]).toBe('\tCharisma: 10 (0)');
        expect(lines[22]).toBe('Languages:');
        expect(lines[23]).toBe('\tEnglish 1');
        expect(lines[24]).toBe('\tGerman 1');
        expect(lines[25]).toBe('Skills:');
        expect(lines[26]).toBe('\tskill 1');
        expect(lines[27]).toBe('\t\tRanks: 5');
        expect(lines[28]).toBe('\t\tStat Bonus: 14');
        expect(lines[29]).toBe('\t\tOther Bonus: 0');
        expect(lines[30]).toBe('\t\tArmor Check Penalty: -7');
        expect(lines[31]).toBe('\t\tClass Skill');
        expect(lines[32]).toBe('\tskill 2');
        expect(lines[33]).toBe('\t\tRanks: 2.5');
        expect(lines[34]).toBe('\t\tStat Bonus: -1');
        expect(lines[35]).toBe('\t\tOther Bonus: 4');
        expect(lines[36]).toBe('\t\tArmor Check Penalty: 0');
        expect(lines[37]).toBe('\t\tCircumstantial Bonus');
        expect(lines[38]).toBe('Feats:');
        expect(lines[39]).toBe('\tfeat 2');
        expect(lines[40]).toBe('\tfeat 3');
        expect(lines[41]).toBe('Interesting Trait: None');
        expect(lines[42]).toBe("Equipment:");
        expect(lines[43]).toBe("\tPrimary Hand: None");
        expect(lines[44]).toBe("\tOff Hand: None");
        expect(lines[45]).toBe("\tArmor: None");
        expect(lines[46]).toBe("\tTreasure: None");
        expect(lines[47]).toBe("Combat:");
        expect(lines[48]).toBe("\tAdjusted Dexterity Bonus: 4");
        expect(lines[49]).toBe("\tArmor Class: 8");
        expect(lines[50]).toBe("\t\tFlat-Footed: 13");
        expect(lines[51]).toBe("\t\tTouch: 35");
        expect(lines[52]).toBe("\tBase Attack:");
        expect(lines[53]).toBe("\t\tMelee: +22/+17/+12/+7/+2");
        expect(lines[54]).toBe("\t\tRanged: +23/+18/+13/+8/+3");
        expect(lines[55]).toBe("\tHit Points: 3457");
        expect(lines[56]).toBe("\tInitiative Bonus: 4568");
        expect(lines[57]).toBe("\tSaving Throws:");
        expect(lines[58]).toBe("\t\tFortitude: 57");
        expect(lines[59]).toBe("\t\tReflex: 79");
        expect(lines[60]).toBe("\t\tWill: 68");
        expect(lines[61]).toBe('');
        expect(lines.length).toBe(62);
    });

    it('formats metarace', function () {
        character.Race.Metarace = 'metarace';

        var formattedCharacter = characterFormatterService.formatCharacter(character, leadership, cohort, followers);
        var lines = formattedCharacter.split('\r\n');

        expect(lines[0]).toBe('Alignment: alignment 1');
        expect(lines[1]).toBe('Level 9267 class name 1');
        expect(lines[2]).toBe('metarace base race 1');
        expect(lines[3]).toBe('\tFemale');
        expect(lines[4]).toBe('\tLand Speed: 31');
        expect(lines[5]).toBe('\tSize: size 1');
        expect(lines[6]).toBe('\tAge: 19 (adult 1)');
        expect(lines[7]).toBe('\tHeight: 4.083333333333333 feet filtered');
        expect(lines[8]).toBe('\tWeight: 101 lbs.');
        expect(lines[9]).toBe('Stats:');
        expect(lines[10]).toBe('\tStrength: 3 (-3)');
        expect(lines[11]).toBe('\tConstitution: 27 (14)');
        expect(lines[12]).toBe('\tDexterity: 7 (-1)');
        expect(lines[13]).toBe('\tIntelligence: 91 (46)');
        expect(lines[14]).toBe('\tWisdom: 11 (1)');
        expect(lines[15]).toBe('\tCharisma: 10 (0)');
        expect(lines[16]).toBe('Languages:');
        expect(lines[17]).toBe('\tEnglish 1');
        expect(lines[18]).toBe('\tGerman 1');
        expect(lines[19]).toBe('Skills:');
        expect(lines[20]).toBe('\tskill 1');
        expect(lines[21]).toBe('\t\tRanks: 5');
        expect(lines[22]).toBe('\t\tStat Bonus: 14');
        expect(lines[23]).toBe('\t\tOther Bonus: 0');
        expect(lines[24]).toBe('\t\tArmor Check Penalty: -7');
        expect(lines[25]).toBe('\t\tClass Skill');
        expect(lines[26]).toBe('\tskill 2');
        expect(lines[27]).toBe('\t\tRanks: 2.5');
        expect(lines[28]).toBe('\t\tStat Bonus: -1');
        expect(lines[29]).toBe('\t\tOther Bonus: 4');
        expect(lines[30]).toBe('\t\tArmor Check Penalty: 0');
        expect(lines[31]).toBe('\t\tCircumstantial Bonus');
        expect(lines[32]).toBe('Feats:');
        expect(lines[33]).toBe('\tfeat 2');
        expect(lines[34]).toBe('\tfeat 3');
        expect(lines[35]).toBe('Interesting Trait: None');
        expect(lines[36]).toBe("Equipment:");
        expect(lines[37]).toBe("\tPrimary Hand: None");
        expect(lines[38]).toBe("\tOff Hand: None");
        expect(lines[39]).toBe("\tArmor: None");
        expect(lines[40]).toBe("\tTreasure: None");
        expect(lines[41]).toBe("Combat:");
        expect(lines[42]).toBe("\tAdjusted Dexterity Bonus: 4");
        expect(lines[43]).toBe("\tArmor Class: 8");
        expect(lines[44]).toBe("\t\tFlat-Footed: 13");
        expect(lines[45]).toBe("\t\tTouch: 35");
        expect(lines[46]).toBe("\tBase Attack:");
        expect(lines[47]).toBe("\t\tMelee: +22/+17/+12/+7/+2");
        expect(lines[48]).toBe("\t\tRanged: +23/+18/+13/+8/+3");
        expect(lines[49]).toBe("\tHit Points: 3457");
        expect(lines[50]).toBe("\tInitiative Bonus: 4568");
        expect(lines[51]).toBe("\tSaving Throws:");
        expect(lines[52]).toBe("\t\tFortitude: 57");
        expect(lines[53]).toBe("\t\tReflex: 79");
        expect(lines[54]).toBe("\t\tWill: 68");
        expect(lines[55]).toBe('');
        expect(lines.length).toBe(56);
    });

    it('formats metarace species', function () {
        character.Race.Metarace = 'metarace';
        character.Race.MetaraceSpecies = 'metarace species';

        var formattedCharacter = characterFormatterService.formatCharacter(character, leadership, cohort, followers);
        var lines = formattedCharacter.split('\r\n');

        expect(lines[0]).toBe('Alignment: alignment 1');
        expect(lines[1]).toBe('Level 9267 class name 1');
        expect(lines[2]).toBe('metarace base race 1');
        expect(lines[3]).toBe('\tFemale');
        expect(lines[4]).toBe('\tMetarace Species: metarace species');
        expect(lines[5]).toBe('\tLand Speed: 31');
        expect(lines[6]).toBe('\tSize: size 1');
        expect(lines[7]).toBe('\tAge: 19 (adult 1)');
        expect(lines[8]).toBe('\tHeight: 4.083333333333333 feet filtered');
        expect(lines[9]).toBe('\tWeight: 101 lbs.');
        expect(lines[10]).toBe('Stats:');
        expect(lines[11]).toBe('\tStrength: 3 (-3)');
        expect(lines[12]).toBe('\tConstitution: 27 (14)');
        expect(lines[13]).toBe('\tDexterity: 7 (-1)');
        expect(lines[14]).toBe('\tIntelligence: 91 (46)');
        expect(lines[15]).toBe('\tWisdom: 11 (1)');
        expect(lines[16]).toBe('\tCharisma: 10 (0)');
        expect(lines[17]).toBe('Languages:');
        expect(lines[18]).toBe('\tEnglish 1');
        expect(lines[19]).toBe('\tGerman 1');
        expect(lines[20]).toBe('Skills:');
        expect(lines[21]).toBe('\tskill 1');
        expect(lines[22]).toBe('\t\tRanks: 5');
        expect(lines[23]).toBe('\t\tStat Bonus: 14');
        expect(lines[24]).toBe('\t\tOther Bonus: 0');
        expect(lines[25]).toBe('\t\tArmor Check Penalty: -7');
        expect(lines[26]).toBe('\t\tClass Skill');
        expect(lines[27]).toBe('\tskill 2');
        expect(lines[28]).toBe('\t\tRanks: 2.5');
        expect(lines[29]).toBe('\t\tStat Bonus: -1');
        expect(lines[30]).toBe('\t\tOther Bonus: 4');
        expect(lines[31]).toBe('\t\tArmor Check Penalty: 0');
        expect(lines[32]).toBe('\t\tCircumstantial Bonus');
        expect(lines[33]).toBe('Feats:');
        expect(lines[34]).toBe('\tfeat 2');
        expect(lines[35]).toBe('\tfeat 3');
        expect(lines[36]).toBe('Interesting Trait: None');
        expect(lines[37]).toBe("Equipment:");
        expect(lines[38]).toBe("\tPrimary Hand: None");
        expect(lines[39]).toBe("\tOff Hand: None");
        expect(lines[40]).toBe("\tArmor: None");
        expect(lines[41]).toBe("\tTreasure: None");
        expect(lines[42]).toBe("Combat:");
        expect(lines[43]).toBe("\tAdjusted Dexterity Bonus: 4");
        expect(lines[44]).toBe("\tArmor Class: 8");
        expect(lines[45]).toBe("\t\tFlat-Footed: 13");
        expect(lines[46]).toBe("\t\tTouch: 35");
        expect(lines[47]).toBe("\tBase Attack:");
        expect(lines[48]).toBe("\t\tMelee: +22/+17/+12/+7/+2");
        expect(lines[49]).toBe("\t\tRanged: +23/+18/+13/+8/+3");
        expect(lines[50]).toBe("\tHit Points: 3457");
        expect(lines[51]).toBe("\tInitiative Bonus: 4568");
        expect(lines[52]).toBe("\tSaving Throws:");
        expect(lines[53]).toBe("\t\tFortitude: 57");
        expect(lines[54]).toBe("\t\tReflex: 79");
        expect(lines[55]).toBe("\t\tWill: 68");
        expect(lines[56]).toBe('');
        expect(lines.length).toBe(57);
    });

    it('formats wings', function () {
        character.Race.Metarace = 'metarace';
        character.Race.HasWings = true;

        var formattedCharacter = characterFormatterService.formatCharacter(character, leadership, cohort, followers);
        var lines = formattedCharacter.split('\r\n');

        expect(lines[0]).toBe('Alignment: alignment 1');
        expect(lines[1]).toBe('Level 9267 class name 1');
        expect(lines[2]).toBe('metarace base race 1');
        expect(lines[3]).toBe('\tFemale');
        expect(lines[4]).toBe('\tLand Speed: 31');
        expect(lines[5]).toBe('\tSize: size 1');
        expect(lines[6]).toBe('\tAge: 19 (adult 1)');
        expect(lines[7]).toBe('\tHeight: 4.083333333333333 feet filtered');
        expect(lines[8]).toBe('\tWeight: 101 lbs.');
        expect(lines[9]).toBe('\tHas Wings');
        expect(lines[10]).toBe('Stats:');
        expect(lines[11]).toBe('\tStrength: 3 (-3)');
        expect(lines[12]).toBe('\tConstitution: 27 (14)');
        expect(lines[13]).toBe('\tDexterity: 7 (-1)');
        expect(lines[14]).toBe('\tIntelligence: 91 (46)');
        expect(lines[15]).toBe('\tWisdom: 11 (1)');
        expect(lines[16]).toBe('\tCharisma: 10 (0)');
        expect(lines[17]).toBe('Languages:');
        expect(lines[18]).toBe('\tEnglish 1');
        expect(lines[19]).toBe('\tGerman 1');
        expect(lines[20]).toBe('Skills:');
        expect(lines[21]).toBe('\tskill 1');
        expect(lines[22]).toBe('\t\tRanks: 5');
        expect(lines[23]).toBe('\t\tStat Bonus: 14');
        expect(lines[24]).toBe('\t\tOther Bonus: 0');
        expect(lines[25]).toBe('\t\tArmor Check Penalty: -7');
        expect(lines[26]).toBe('\t\tClass Skill');
        expect(lines[27]).toBe('\tskill 2');
        expect(lines[28]).toBe('\t\tRanks: 2.5');
        expect(lines[29]).toBe('\t\tStat Bonus: -1');
        expect(lines[30]).toBe('\t\tOther Bonus: 4');
        expect(lines[31]).toBe('\t\tArmor Check Penalty: 0');
        expect(lines[32]).toBe('\t\tCircumstantial Bonus');
        expect(lines[33]).toBe('Feats:');
        expect(lines[34]).toBe('\tfeat 2');
        expect(lines[35]).toBe('\tfeat 3');
        expect(lines[36]).toBe('Interesting Trait: None');
        expect(lines[37]).toBe("Equipment:");
        expect(lines[38]).toBe("\tPrimary Hand: None");
        expect(lines[39]).toBe("\tOff Hand: None");
        expect(lines[40]).toBe("\tArmor: None");
        expect(lines[41]).toBe("\tTreasure: None");
        expect(lines[42]).toBe("Combat:");
        expect(lines[43]).toBe("\tAdjusted Dexterity Bonus: 4");
        expect(lines[44]).toBe("\tArmor Class: 8");
        expect(lines[45]).toBe("\t\tFlat-Footed: 13");
        expect(lines[46]).toBe("\t\tTouch: 35");
        expect(lines[47]).toBe("\tBase Attack:");
        expect(lines[48]).toBe("\t\tMelee: +22/+17/+12/+7/+2");
        expect(lines[49]).toBe("\t\tRanged: +23/+18/+13/+8/+3");
        expect(lines[50]).toBe("\tHit Points: 3457");
        expect(lines[51]).toBe("\tInitiative Bonus: 4568");
        expect(lines[52]).toBe("\tSaving Throws:");
        expect(lines[53]).toBe("\t\tFortitude: 57");
        expect(lines[54]).toBe("\t\tReflex: 79");
        expect(lines[55]).toBe("\t\tWill: 68");
        expect(lines[56]).toBe('');
        expect(lines.length).toBe(57);
    });

    it('formats aerial speed', function () {
        character.Race.Metarace = 'metarace';
        character.Race.AerialSpeed = 9876;

        var formattedCharacter = characterFormatterService.formatCharacter(character, leadership, cohort, followers);
        var lines = formattedCharacter.split('\r\n');

        var expected = [
            'Alignment: alignment 1',
            'Level 9267 class name 1',
            'metarace base race 1',
            '\tFemale',
            '\tLand Speed: 31',
            '\tSize: size 1',
            '\tAge: 19 (adult 1)',
            '\tHeight: 4.083333333333333 feet filtered',
            '\tWeight: 101 lbs.',
            '\tAerial Speed: 9876',
            'Stats:',
            '\tStrength: 3 (-3)',
            '\tConstitution: 27 (14)',
            '\tDexterity: 7 (-1)',
            '\tIntelligence: 91 (46)',
            '\tWisdom: 11 (1)',
            '\tCharisma: 10 (0)',
            'Languages:',
            '\tEnglish 1',
            '\tGerman 1',
            'Skills:',
            '\tskill 1',
            '\t\tRanks: 5',
            '\t\tStat Bonus: 14',
            '\t\tOther Bonus: 0',
            '\t\tArmor Check Penalty: -7',
            '\t\tClass Skill',
            '\tskill 2',
            '\t\tRanks: 2.5',
            '\t\tStat Bonus: -1',
            '\t\tOther Bonus: 4',
            '\t\tArmor Check Penalty: 0',
            '\t\tCircumstantial Bonus',
            'Feats:',
            '\tfeat 2',
            '\tfeat 3',
            'Interesting Trait: None',
            "Equipment:",
            "\tPrimary Hand: None",
            "\tOff Hand: None",
            "\tArmor: None",
            "\tTreasure: None",
            "Combat:",
            "\tAdjusted Dexterity Bonus: 4",
            "\tArmor Class: 8",
            "\t\tFlat-Footed: 13",
            "\t\tTouch: 35",
            "\tBase Attack:",
            "\t\tMelee: +22/+17/+12/+7/+2",
            "\t\tRanged: +23/+18/+13/+8/+3",
            "\tHit Points: 3457",
            "\tInitiative Bonus: 4568",
            "\tSaving Throws:",
            "\t\tFortitude: 57",
            "\t\tReflex: 79",
            "\t\tWill: 68",
            '',
        ];

        for (var i = 0; i < lines.length; i++) {
            expect(lines[i]).toBe(expected[i]);
        }

        expect(lines.length).toBe(57);

    });

    it('formats feat foci', function () {
        character.Ability.Feats[0].Foci = ['focus 1', 'focus 2'];

        var formattedCharacter = characterFormatterService.formatCharacter(character, leadership, cohort, followers);
        var lines = formattedCharacter.split('\r\n');

        expect(lines[0]).toBe('Alignment: alignment 1');
        expect(lines[1]).toBe('Level 9267 class name 1');
        expect(lines[2]).toBe('base race 1');
        expect(lines[3]).toBe('\tFemale');
        expect(lines[4]).toBe('\tLand Speed: 31');
        expect(lines[5]).toBe('\tSize: size 1');
        expect(lines[6]).toBe('\tAge: 19 (adult 1)');
        expect(lines[7]).toBe('\tHeight: 4.083333333333333 feet filtered');
        expect(lines[8]).toBe('\tWeight: 101 lbs.');
        expect(lines[9]).toBe('Stats:');
        expect(lines[10]).toBe('\tStrength: 3 (-3)');
        expect(lines[11]).toBe('\tConstitution: 27 (14)');
        expect(lines[12]).toBe('\tDexterity: 7 (-1)');
        expect(lines[13]).toBe('\tIntelligence: 91 (46)');
        expect(lines[14]).toBe('\tWisdom: 11 (1)');
        expect(lines[15]).toBe('\tCharisma: 10 (0)');
        expect(lines[16]).toBe('Languages:');
        expect(lines[17]).toBe('\tEnglish 1');
        expect(lines[18]).toBe('\tGerman 1');
        expect(lines[19]).toBe('Skills:');
        expect(lines[20]).toBe('\tskill 1');
        expect(lines[21]).toBe('\t\tRanks: 5');
        expect(lines[22]).toBe('\t\tStat Bonus: 14');
        expect(lines[23]).toBe('\t\tOther Bonus: 0');
        expect(lines[24]).toBe('\t\tArmor Check Penalty: -7');
        expect(lines[25]).toBe('\t\tClass Skill');
        expect(lines[26]).toBe('\tskill 2');
        expect(lines[27]).toBe('\t\tRanks: 2.5');
        expect(lines[28]).toBe('\t\tStat Bonus: -1');
        expect(lines[29]).toBe('\t\tOther Bonus: 4');
        expect(lines[30]).toBe('\t\tArmor Check Penalty: 0');
        expect(lines[31]).toBe('\t\tCircumstantial Bonus');
        expect(lines[32]).toBe('Feats:');
        expect(lines[33]).toBe('\tfeat 2');
        expect(lines[34]).toBe('\t\tFoci:');
        expect(lines[35]).toBe('\t\t\tfocus 1');
        expect(lines[36]).toBe('\t\t\tfocus 2');
        expect(lines[37]).toBe('\tfeat 3');
        expect(lines[38]).toBe('Interesting Trait: None');
        expect(lines[39]).toBe("Equipment:");
        expect(lines[40]).toBe("\tPrimary Hand: None");
        expect(lines[41]).toBe("\tOff Hand: None");
        expect(lines[42]).toBe("\tArmor: None");
        expect(lines[43]).toBe("\tTreasure: None");
        expect(lines[44]).toBe("Combat:");
        expect(lines[45]).toBe("\tAdjusted Dexterity Bonus: 4");
        expect(lines[46]).toBe("\tArmor Class: 8");
        expect(lines[47]).toBe("\t\tFlat-Footed: 13");
        expect(lines[48]).toBe("\t\tTouch: 35");
        expect(lines[49]).toBe("\tBase Attack:");
        expect(lines[50]).toBe("\t\tMelee: +22/+17/+12/+7/+2");
        expect(lines[51]).toBe("\t\tRanged: +23/+18/+13/+8/+3");
        expect(lines[52]).toBe("\tHit Points: 3457");
        expect(lines[53]).toBe("\tInitiative Bonus: 4568");
        expect(lines[54]).toBe("\tSaving Throws:");
        expect(lines[55]).toBe("\t\tFortitude: 57");
        expect(lines[56]).toBe("\t\tReflex: 79");
        expect(lines[57]).toBe("\t\tWill: 68");
        expect(lines[58]).toBe('');
        expect(lines.length).toBe(59);
    });

    it('formats feat power', function () {
        character.Ability.Feats[0].Power = 9876;

        var formattedCharacter = characterFormatterService.formatCharacter(character, leadership, cohort, followers);
        var lines = formattedCharacter.split('\r\n');

        expect(lines[0]).toBe('Alignment: alignment 1');
        expect(lines[1]).toBe('Level 9267 class name 1');
        expect(lines[2]).toBe('base race 1');
        expect(lines[3]).toBe('\tFemale');
        expect(lines[4]).toBe('\tLand Speed: 31');
        expect(lines[5]).toBe('\tSize: size 1');
        expect(lines[6]).toBe('\tAge: 19 (adult 1)');
        expect(lines[7]).toBe('\tHeight: 4.083333333333333 feet filtered');
        expect(lines[8]).toBe('\tWeight: 101 lbs.');
        expect(lines[9]).toBe('Stats:');
        expect(lines[10]).toBe('\tStrength: 3 (-3)');
        expect(lines[11]).toBe('\tConstitution: 27 (14)');
        expect(lines[12]).toBe('\tDexterity: 7 (-1)');
        expect(lines[13]).toBe('\tIntelligence: 91 (46)');
        expect(lines[14]).toBe('\tWisdom: 11 (1)');
        expect(lines[15]).toBe('\tCharisma: 10 (0)');
        expect(lines[16]).toBe('Languages:');
        expect(lines[17]).toBe('\tEnglish 1');
        expect(lines[18]).toBe('\tGerman 1');
        expect(lines[19]).toBe('Skills:');
        expect(lines[20]).toBe('\tskill 1');
        expect(lines[21]).toBe('\t\tRanks: 5');
        expect(lines[22]).toBe('\t\tStat Bonus: 14');
        expect(lines[23]).toBe('\t\tOther Bonus: 0');
        expect(lines[24]).toBe('\t\tArmor Check Penalty: -7');
        expect(lines[25]).toBe('\t\tClass Skill');
        expect(lines[26]).toBe('\tskill 2');
        expect(lines[27]).toBe('\t\tRanks: 2.5');
        expect(lines[28]).toBe('\t\tStat Bonus: -1');
        expect(lines[29]).toBe('\t\tOther Bonus: 4');
        expect(lines[30]).toBe('\t\tArmor Check Penalty: 0');
        expect(lines[31]).toBe('\t\tCircumstantial Bonus');
        expect(lines[32]).toBe('Feats:');
        expect(lines[33]).toBe('\tfeat 2');
        expect(lines[34]).toBe('\t\tPower: 9876');
        expect(lines[35]).toBe('\tfeat 3');
        expect(lines[36]).toBe('Interesting Trait: None');
        expect(lines[37]).toBe("Equipment:");
        expect(lines[38]).toBe("\tPrimary Hand: None");
        expect(lines[39]).toBe("\tOff Hand: None");
        expect(lines[40]).toBe("\tArmor: None");
        expect(lines[41]).toBe("\tTreasure: None");
        expect(lines[42]).toBe("Combat:");
        expect(lines[43]).toBe("\tAdjusted Dexterity Bonus: 4");
        expect(lines[44]).toBe("\tArmor Class: 8");
        expect(lines[45]).toBe("\t\tFlat-Footed: 13");
        expect(lines[46]).toBe("\t\tTouch: 35");
        expect(lines[47]).toBe("\tBase Attack:");
        expect(lines[48]).toBe("\t\tMelee: +22/+17/+12/+7/+2");
        expect(lines[49]).toBe("\t\tRanged: +23/+18/+13/+8/+3");
        expect(lines[50]).toBe("\tHit Points: 3457");
        expect(lines[51]).toBe("\tInitiative Bonus: 4568");
        expect(lines[52]).toBe("\tSaving Throws:");
        expect(lines[53]).toBe("\t\tFortitude: 57");
        expect(lines[54]).toBe("\t\tReflex: 79");
        expect(lines[55]).toBe("\t\tWill: 68");
        expect(lines[56]).toBe('');
        expect(lines.length).toBe(57);
    });

    it('formats feat frequency', function () {
        character.Ability.Feats[0].Frequency.Quantity = 9876;
        character.Ability.Feats[0].Frequency.TimePeriod = 'fortnight';

        var formattedCharacter = characterFormatterService.formatCharacter(character, leadership, cohort, followers);
        var lines = formattedCharacter.split('\r\n');

        expect(lines[0]).toBe('Alignment: alignment 1');
        expect(lines[1]).toBe('Level 9267 class name 1');
        expect(lines[2]).toBe('base race 1');
        expect(lines[3]).toBe('\tFemale');
        expect(lines[4]).toBe('\tLand Speed: 31');
        expect(lines[5]).toBe('\tSize: size 1');
        expect(lines[6]).toBe('\tAge: 19 (adult 1)');
        expect(lines[7]).toBe('\tHeight: 4.083333333333333 feet filtered');
        expect(lines[8]).toBe('\tWeight: 101 lbs.');
        expect(lines[9]).toBe('Stats:');
        expect(lines[10]).toBe('\tStrength: 3 (-3)');
        expect(lines[11]).toBe('\tConstitution: 27 (14)');
        expect(lines[12]).toBe('\tDexterity: 7 (-1)');
        expect(lines[13]).toBe('\tIntelligence: 91 (46)');
        expect(lines[14]).toBe('\tWisdom: 11 (1)');
        expect(lines[15]).toBe('\tCharisma: 10 (0)');
        expect(lines[16]).toBe('Languages:');
        expect(lines[17]).toBe('\tEnglish 1');
        expect(lines[18]).toBe('\tGerman 1');
        expect(lines[19]).toBe('Skills:');
        expect(lines[20]).toBe('\tskill 1');
        expect(lines[21]).toBe('\t\tRanks: 5');
        expect(lines[22]).toBe('\t\tStat Bonus: 14');
        expect(lines[23]).toBe('\t\tOther Bonus: 0');
        expect(lines[24]).toBe('\t\tArmor Check Penalty: -7');
        expect(lines[25]).toBe('\t\tClass Skill');
        expect(lines[26]).toBe('\tskill 2');
        expect(lines[27]).toBe('\t\tRanks: 2.5');
        expect(lines[28]).toBe('\t\tStat Bonus: -1');
        expect(lines[29]).toBe('\t\tOther Bonus: 4');
        expect(lines[30]).toBe('\t\tArmor Check Penalty: 0');
        expect(lines[31]).toBe('\t\tCircumstantial Bonus');
        expect(lines[32]).toBe('Feats:');
        expect(lines[33]).toBe('\tfeat 2');
        expect(lines[34]).toBe('\t\tFrequency: 9876/fortnight');
        expect(lines[35]).toBe('\tfeat 3');
        expect(lines[36]).toBe('Interesting Trait: None');
        expect(lines[37]).toBe("Equipment:");
        expect(lines[38]).toBe("\tPrimary Hand: None");
        expect(lines[39]).toBe("\tOff Hand: None");
        expect(lines[40]).toBe("\tArmor: None");
        expect(lines[41]).toBe("\tTreasure: None");
        expect(lines[42]).toBe("Combat:");
        expect(lines[43]).toBe("\tAdjusted Dexterity Bonus: 4");
        expect(lines[44]).toBe("\tArmor Class: 8");
        expect(lines[45]).toBe("\t\tFlat-Footed: 13");
        expect(lines[46]).toBe("\t\tTouch: 35");
        expect(lines[47]).toBe("\tBase Attack:");
        expect(lines[48]).toBe("\t\tMelee: +22/+17/+12/+7/+2");
        expect(lines[49]).toBe("\t\tRanged: +23/+18/+13/+8/+3");
        expect(lines[50]).toBe("\tHit Points: 3457");
        expect(lines[51]).toBe("\tInitiative Bonus: 4568");
        expect(lines[52]).toBe("\tSaving Throws:");
        expect(lines[53]).toBe("\t\tFortitude: 57");
        expect(lines[54]).toBe("\t\tReflex: 79");
        expect(lines[55]).toBe("\t\tWill: 68");
        expect(lines[56]).toBe('');
        expect(lines.length).toBe(57);
    });

    it('formats feat frequency without quantity', function () {
        character.Ability.Feats[0].Frequency.Quantity = 0;
        character.Ability.Feats[0].Frequency.TimePeriod = 'all day erry day';

        var formattedCharacter = characterFormatterService.formatCharacter(character, leadership, cohort, followers);
        var lines = formattedCharacter.split('\r\n');

        expect(lines[0]).toBe('Alignment: alignment 1');
        expect(lines[1]).toBe('Level 9267 class name 1');
        expect(lines[2]).toBe('base race 1');
        expect(lines[3]).toBe('\tFemale');
        expect(lines[4]).toBe('\tLand Speed: 31');
        expect(lines[5]).toBe('\tSize: size 1');
        expect(lines[6]).toBe('\tAge: 19 (adult 1)');
        expect(lines[7]).toBe('\tHeight: 4.083333333333333 feet filtered');
        expect(lines[8]).toBe('\tWeight: 101 lbs.');
        expect(lines[9]).toBe('Stats:');
        expect(lines[10]).toBe('\tStrength: 3 (-3)');
        expect(lines[11]).toBe('\tConstitution: 27 (14)');
        expect(lines[12]).toBe('\tDexterity: 7 (-1)');
        expect(lines[13]).toBe('\tIntelligence: 91 (46)');
        expect(lines[14]).toBe('\tWisdom: 11 (1)');
        expect(lines[15]).toBe('\tCharisma: 10 (0)');
        expect(lines[16]).toBe('Languages:');
        expect(lines[17]).toBe('\tEnglish 1');
        expect(lines[18]).toBe('\tGerman 1');
        expect(lines[19]).toBe('Skills:');
        expect(lines[20]).toBe('\tskill 1');
        expect(lines[21]).toBe('\t\tRanks: 5');
        expect(lines[22]).toBe('\t\tStat Bonus: 14');
        expect(lines[23]).toBe('\t\tOther Bonus: 0');
        expect(lines[24]).toBe('\t\tArmor Check Penalty: -7');
        expect(lines[25]).toBe('\t\tClass Skill');
        expect(lines[26]).toBe('\tskill 2');
        expect(lines[27]).toBe('\t\tRanks: 2.5');
        expect(lines[28]).toBe('\t\tStat Bonus: -1');
        expect(lines[29]).toBe('\t\tOther Bonus: 4');
        expect(lines[30]).toBe('\t\tArmor Check Penalty: 0');
        expect(lines[31]).toBe('\t\tCircumstantial Bonus');
        expect(lines[32]).toBe('Feats:');
        expect(lines[33]).toBe('\tfeat 2');
        expect(lines[34]).toBe('\t\tFrequency: all day erry day');
        expect(lines[35]).toBe('\tfeat 3');
        expect(lines[36]).toBe('Interesting Trait: None');
        expect(lines[37]).toBe("Equipment:");
        expect(lines[38]).toBe("\tPrimary Hand: None");
        expect(lines[39]).toBe("\tOff Hand: None");
        expect(lines[40]).toBe("\tArmor: None");
        expect(lines[41]).toBe("\tTreasure: None");
        expect(lines[42]).toBe("Combat:");
        expect(lines[43]).toBe("\tAdjusted Dexterity Bonus: 4");
        expect(lines[44]).toBe("\tArmor Class: 8");
        expect(lines[45]).toBe("\t\tFlat-Footed: 13");
        expect(lines[46]).toBe("\t\tTouch: 35");
        expect(lines[47]).toBe("\tBase Attack:");
        expect(lines[48]).toBe("\t\tMelee: +22/+17/+12/+7/+2");
        expect(lines[49]).toBe("\t\tRanged: +23/+18/+13/+8/+3");
        expect(lines[50]).toBe("\tHit Points: 3457");
        expect(lines[51]).toBe("\tInitiative Bonus: 4568");
        expect(lines[52]).toBe("\tSaving Throws:");
        expect(lines[53]).toBe("\t\tFortitude: 57");
        expect(lines[54]).toBe("\t\tReflex: 79");
        expect(lines[55]).toBe("\t\tWill: 68");
        expect(lines[56]).toBe('');
        expect(lines.length).toBe(57);
    });

    it('formats interesting trait', function () {
        character.InterestingTrait = 'is interesting';

        var formattedCharacter = characterFormatterService.formatCharacter(character, leadership, cohort, followers);
        var lines = formattedCharacter.split('\r\n');

        expect(lines[0]).toBe('Alignment: alignment 1');
        expect(lines[1]).toBe('Level 9267 class name 1');
        expect(lines[2]).toBe('base race 1');
        expect(lines[3]).toBe('\tFemale');
        expect(lines[4]).toBe('\tLand Speed: 31');
        expect(lines[5]).toBe('\tSize: size 1');
        expect(lines[6]).toBe('\tAge: 19 (adult 1)');
        expect(lines[7]).toBe('\tHeight: 4.083333333333333 feet filtered');
        expect(lines[8]).toBe('\tWeight: 101 lbs.');
        expect(lines[9]).toBe('Stats:');
        expect(lines[10]).toBe('\tStrength: 3 (-3)');
        expect(lines[11]).toBe('\tConstitution: 27 (14)');
        expect(lines[12]).toBe('\tDexterity: 7 (-1)');
        expect(lines[13]).toBe('\tIntelligence: 91 (46)');
        expect(lines[14]).toBe('\tWisdom: 11 (1)');
        expect(lines[15]).toBe('\tCharisma: 10 (0)');
        expect(lines[16]).toBe('Languages:');
        expect(lines[17]).toBe('\tEnglish 1');
        expect(lines[18]).toBe('\tGerman 1');
        expect(lines[19]).toBe('Skills:');
        expect(lines[20]).toBe('\tskill 1');
        expect(lines[21]).toBe('\t\tRanks: 5');
        expect(lines[22]).toBe('\t\tStat Bonus: 14');
        expect(lines[23]).toBe('\t\tOther Bonus: 0');
        expect(lines[24]).toBe('\t\tArmor Check Penalty: -7');
        expect(lines[25]).toBe('\t\tClass Skill');
        expect(lines[26]).toBe('\tskill 2');
        expect(lines[27]).toBe('\t\tRanks: 2.5');
        expect(lines[28]).toBe('\t\tStat Bonus: -1');
        expect(lines[29]).toBe('\t\tOther Bonus: 4');
        expect(lines[30]).toBe('\t\tArmor Check Penalty: 0');
        expect(lines[31]).toBe('\t\tCircumstantial Bonus');
        expect(lines[32]).toBe('Feats:');
        expect(lines[33]).toBe('\tfeat 2');
        expect(lines[34]).toBe('\tfeat 3');
        expect(lines[35]).toBe('Interesting Trait: is interesting');
        expect(lines[36]).toBe("Equipment:");
        expect(lines[37]).toBe("\tPrimary Hand: None");
        expect(lines[38]).toBe("\tOff Hand: None");
        expect(lines[39]).toBe("\tArmor: None");
        expect(lines[40]).toBe("\tTreasure: None");
        expect(lines[41]).toBe("Combat:");
        expect(lines[42]).toBe("\tAdjusted Dexterity Bonus: 4");
        expect(lines[43]).toBe("\tArmor Class: 8");
        expect(lines[44]).toBe("\t\tFlat-Footed: 13");
        expect(lines[45]).toBe("\t\tTouch: 35");
        expect(lines[46]).toBe("\tBase Attack:");
        expect(lines[47]).toBe("\t\tMelee: +22/+17/+12/+7/+2");
        expect(lines[48]).toBe("\t\tRanged: +23/+18/+13/+8/+3");
        expect(lines[49]).toBe("\tHit Points: 3457");
        expect(lines[50]).toBe("\tInitiative Bonus: 4568");
        expect(lines[51]).toBe("\tSaving Throws:");
        expect(lines[52]).toBe("\t\tFortitude: 57");
        expect(lines[53]).toBe("\t\tReflex: 79");
        expect(lines[54]).toBe("\t\tWill: 68");
        expect(lines[55]).toBe('');
        expect(lines.length).toBe(56);
    });

    it('formats spells per day', function () {
        character.Magic.SpellsPerDay = [
            { Level: 0, Quantity: 9, HasDomainSpell: false },
            { Level: 1, Quantity: 8, HasDomainSpell: true }
        ];

        var formattedCharacter = characterFormatterService.formatCharacter(character, leadership, cohort, followers);
        var lines = formattedCharacter.split('\r\n');

        var expected = [
            'Alignment: alignment 1',
            'Level 9267 class name 1',
            'base race 1',
            '\tFemale',
            '\tLand Speed: 31',
            '\tSize: size 1',
            '\tAge: 19 (adult 1)',
            '\tHeight: 4.083333333333333 feet filtered',
            '\tWeight: 101 lbs.',
            'Stats:',
            '\tStrength: 3 (-3)',
            '\tConstitution: 27 (14)',
            '\tDexterity: 7 (-1)',
            '\tIntelligence: 91 (46)',
            '\tWisdom: 11 (1)',
            '\tCharisma: 10 (0)',
            'Languages:',
            '\tEnglish 1',
            '\tGerman 1',
            'Skills:',
            '\tskill 1',
            '\t\tRanks: 5',
            '\t\tStat Bonus: 14',
            '\t\tOther Bonus: 0',
            '\t\tArmor Check Penalty: -7',
            '\t\tClass Skill',
            '\tskill 2',
            '\t\tRanks: 2.5',
            '\t\tStat Bonus: -1',
            '\t\tOther Bonus: 4',
            '\t\tArmor Check Penalty: 0',
            '\t\tCircumstantial Bonus',
            'Feats:',
            '\tfeat 2',
            '\tfeat 3',
            'Interesting Trait: None',
            'Spells Per Day:',
            '\tLevel 0: 9',
            '\tLevel 1: 8 + 1',
            "Equipment:",
            "\tPrimary Hand: None",
            "\tOff Hand: None",
            "\tArmor: None",
            "\tTreasure: None",
            "Combat:",
            "\tAdjusted Dexterity Bonus: 4",
            "\tArmor Class: 8",
            "\t\tFlat-Footed: 13",
            "\t\tTouch: 35",
            "\tBase Attack:",
            "\t\tMelee: +22/+17/+12/+7/+2",
            "\t\tRanged: +23/+18/+13/+8/+3",
            "\tHit Points: 3457",
            "\tInitiative Bonus: 4568",
            "\tSaving Throws:",
            "\t\tFortitude: 57",
            "\t\tReflex: 79",
            "\t\tWill: 68",
            ''
        ];

        for (var i = 0; i < lines.length; i++) {
            expect(lines[i]).toBe(expected[i]);
        }

        expect(lines.length).toBe(expected.length);
    });

    it('formats known spells', function () {
        character.Magic.SpellsPerDay = [
            { Level: 0, Quantity: 9, HasDomainSpell: false },
            { Level: 1, Quantity: 8, HasDomainSpell: true }
        ];

        character.Magic.KnownSpells = [
            { Name: 'first spell', Level: 0 },
            { Name: 'second spell', Level: 1 }
        ];

        var formattedCharacter = characterFormatterService.formatCharacter(character, leadership, cohort, followers);
        var lines = formattedCharacter.split('\r\n');

        var expected = [
            'Alignment: alignment 1',
            'Level 9267 class name 1',
            'base race 1',
            '\tFemale',
            '\tLand Speed: 31',
            '\tSize: size 1',
            '\tAge: 19 (adult 1)',
            '\tHeight: 4.083333333333333 feet filtered',
            '\tWeight: 101 lbs.',
            'Stats:',
            '\tStrength: 3 (-3)',
            '\tConstitution: 27 (14)',
            '\tDexterity: 7 (-1)',
            '\tIntelligence: 91 (46)',
            '\tWisdom: 11 (1)',
            '\tCharisma: 10 (0)',
            'Languages:',
            '\tEnglish 1',
            '\tGerman 1',
            'Skills:',
            '\tskill 1',
            '\t\tRanks: 5',
            '\t\tStat Bonus: 14',
            '\t\tOther Bonus: 0',
            '\t\tArmor Check Penalty: -7',
            '\t\tClass Skill',
            '\tskill 2',
            '\t\tRanks: 2.5',
            '\t\tStat Bonus: -1',
            '\t\tOther Bonus: 4',
            '\t\tArmor Check Penalty: 0',
            '\t\tCircumstantial Bonus',
            'Feats:',
            '\tfeat 2',
            '\tfeat 3',
            'Interesting Trait: None',
            'Spells Per Day:',
            '\tLevel 0: 9',
            '\tLevel 1: 8 + 1',
            'Known Spells:',
            '\tfirst spell (0)',
            '\tsecond spell (1)',
            "Equipment:",
            "\tPrimary Hand: None",
            "\tOff Hand: None",
            "\tArmor: None",
            "\tTreasure: None",
            "Combat:",
            "\tAdjusted Dexterity Bonus: 4",
            "\tArmor Class: 8",
            "\t\tFlat-Footed: 13",
            "\t\tTouch: 35",
            "\tBase Attack:",
            "\t\tMelee: +22/+17/+12/+7/+2",
            "\t\tRanged: +23/+18/+13/+8/+3",
            "\tHit Points: 3457",
            "\tInitiative Bonus: 4568",
            "\tSaving Throws:",
            "\t\tFortitude: 57",
            "\t\tReflex: 79",
            "\t\tWill: 68",
            ''
        ];

        for (var i = 0; i < lines.length; i++) {
            expect(lines[i]).toBe(expected[i]);
        }

        expect(lines.length).toBe(expected.length);
    });

    it('formats prepared spells', function () {
        character.Magic.SpellsPerDay = [
            { Level: 0, Quantity: 9, HasDomainSpell: false },
            { Level: 1, Quantity: 8, HasDomainSpell: true }
        ];

        character.Magic.KnownSpells = [
            { Name: 'first spell', Level: 0 },
            { Name: 'second spell', Level: 1 }
        ];

        character.Magic.PreparedSpells = [
            { Name: 'first prepared spell', Level: 0 },
            { Name: 'first prepared spell', Level: 0 },
            { Name: 'second prepared spell', Level: 1 }
        ];

        var formattedCharacter = characterFormatterService.formatCharacter(character, leadership, cohort, followers);
        var lines = formattedCharacter.split('\r\n');

        var expected = [
            'Alignment: alignment 1',
            'Level 9267 class name 1',
            'base race 1',
            '\tFemale',
            '\tLand Speed: 31',
            '\tSize: size 1',
            '\tAge: 19 (adult 1)',
            '\tHeight: 4.083333333333333 feet filtered',
            '\tWeight: 101 lbs.',
            'Stats:',
            '\tStrength: 3 (-3)',
            '\tConstitution: 27 (14)',
            '\tDexterity: 7 (-1)',
            '\tIntelligence: 91 (46)',
            '\tWisdom: 11 (1)',
            '\tCharisma: 10 (0)',
            'Languages:',
            '\tEnglish 1',
            '\tGerman 1',
            'Skills:',
            '\tskill 1',
            '\t\tRanks: 5',
            '\t\tStat Bonus: 14',
            '\t\tOther Bonus: 0',
            '\t\tArmor Check Penalty: -7',
            '\t\tClass Skill',
            '\tskill 2',
            '\t\tRanks: 2.5',
            '\t\tStat Bonus: -1',
            '\t\tOther Bonus: 4',
            '\t\tArmor Check Penalty: 0',
            '\t\tCircumstantial Bonus',
            'Feats:',
            '\tfeat 2',
            '\tfeat 3',
            'Interesting Trait: None',
            'Spells Per Day:',
            '\tLevel 0: 9',
            '\tLevel 1: 8 + 1',
            'Known Spells:',
            '\tfirst spell (0)',
            '\tsecond spell (1)',
            'Prepared Spells:',
            '\tfirst prepared spell (0)',
            '\tfirst prepared spell (0)',
            '\tsecond prepared spell (1)',
            "Equipment:",
            "\tPrimary Hand: None",
            "\tOff Hand: None",
            "\tArmor: None",
            "\tTreasure: None",
            "Combat:",
            "\tAdjusted Dexterity Bonus: 4",
            "\tArmor Class: 8",
            "\t\tFlat-Footed: 13",
            "\t\tTouch: 35",
            "\tBase Attack:",
            "\t\tMelee: +22/+17/+12/+7/+2",
            "\t\tRanged: +23/+18/+13/+8/+3",
            "\tHit Points: 3457",
            "\tInitiative Bonus: 4568",
            "\tSaving Throws:",
            "\t\tFortitude: 57",
            "\t\tReflex: 79",
            "\t\tWill: 68",
            ''
        ];

        for (var i = 0; i < lines.length; i++) {
            expect(lines[i]).toBe(expected[i]);
        }

        expect(lines.length).toBe(expected.length);
    });

    it('formats arcane spell failure', function () {
        character.Magic.ArcaneSpellFailure = 98;

        var formattedCharacter = characterFormatterService.formatCharacter(character, leadership, cohort, followers);
        var lines = formattedCharacter.split('\r\n');

        var expected = [
            'Alignment: alignment 1',
            'Level 9267 class name 1',
            'base race 1',
            '\tFemale',
            '\tLand Speed: 31',
            '\tSize: size 1',
            '\tAge: 19 (adult 1)',
            '\tHeight: 4.083333333333333 feet filtered',
            '\tWeight: 101 lbs.',
            'Stats:',
            '\tStrength: 3 (-3)',
            '\tConstitution: 27 (14)',
            '\tDexterity: 7 (-1)',
            '\tIntelligence: 91 (46)',
            '\tWisdom: 11 (1)',
            '\tCharisma: 10 (0)',
            'Languages:',
            '\tEnglish 1',
            '\tGerman 1',
            'Skills:',
            '\tskill 1',
            '\t\tRanks: 5',
            '\t\tStat Bonus: 14',
            '\t\tOther Bonus: 0',
            '\t\tArmor Check Penalty: -7',
            '\t\tClass Skill',
            '\tskill 2',
            '\t\tRanks: 2.5',
            '\t\tStat Bonus: -1',
            '\t\tOther Bonus: 4',
            '\t\tArmor Check Penalty: 0',
            '\t\tCircumstantial Bonus',
            'Feats:',
            '\tfeat 2',
            '\tfeat 3',
            'Interesting Trait: None',
            'Arcane Spell Failure: 98%',
            "Equipment:",
            "\tPrimary Hand: None",
            "\tOff Hand: None",
            "\tArmor: None",
            "\tTreasure: None",
            "Combat:",
            "\tAdjusted Dexterity Bonus: 4",
            "\tArmor Class: 8",
            "\t\tFlat-Footed: 13",
            "\t\tTouch: 35",
            "\tBase Attack:",
            "\t\tMelee: +22/+17/+12/+7/+2",
            "\t\tRanged: +23/+18/+13/+8/+3",
            "\tHit Points: 3457",
            "\tInitiative Bonus: 4568",
            "\tSaving Throws:",
            "\t\tFortitude: 57",
            "\t\tReflex: 79",
            "\t\tWill: 68",
            '',
        ];

        for (var i = 0; i < lines.length; i++) {
            expect(lines[i]).toBe(expected[i]);
        }

        expect(lines.length).toBe(expected.length);
    });

    it('formats animal', function () {
        character.Magic.Animal = 'familiar';

        var formattedCharacter = characterFormatterService.formatCharacter(character, leadership, cohort, followers);
        var lines = formattedCharacter.split('\r\n');

        var expected = [
            'Alignment: alignment 1',
            'Level 9267 class name 1',
            'base race 1',
            '\tFemale',
            '\tLand Speed: 31',
            '\tSize: size 1',
            '\tAge: 19 (adult 1)',
            '\tHeight: 4.083333333333333 feet filtered',
            '\tWeight: 101 lbs.',
            'Stats:',
            '\tStrength: 3 (-3)',
            '\tConstitution: 27 (14)',
            '\tDexterity: 7 (-1)',
            '\tIntelligence: 91 (46)',
            '\tWisdom: 11 (1)',
            '\tCharisma: 10 (0)',
            'Languages:',
            '\tEnglish 1',
            '\tGerman 1',
            'Skills:',
            '\tskill 1',
            '\t\tRanks: 5',
            '\t\tStat Bonus: 14',
            '\t\tOther Bonus: 0',
            '\t\tArmor Check Penalty: -7',
            '\t\tClass Skill',
            '\tskill 2',
            '\t\tRanks: 2.5',
            '\t\tStat Bonus: -1',
            '\t\tOther Bonus: 4',
            '\t\tArmor Check Penalty: 0',
            '\t\tCircumstantial Bonus',
            'Feats:',
            '\tfeat 2',
            '\tfeat 3',
            'Interesting Trait: None',
            'Animal: familiar',
            "Equipment:",
            "\tPrimary Hand: None",
            "\tOff Hand: None",
            "\tArmor: None",
            "\tTreasure: None",
            "Combat:",
            "\tAdjusted Dexterity Bonus: 4",
            "\tArmor Class: 8",
            "\t\tFlat-Footed: 13",
            "\t\tTouch: 35",
            "\tBase Attack:",
            "\t\tMelee: +22/+17/+12/+7/+2",
            "\t\tRanged: +23/+18/+13/+8/+3",
            "\tHit Points: 3457",
            "\tInitiative Bonus: 4568",
            "\tSaving Throws:",
            "\t\tFortitude: 57",
            "\t\tReflex: 79",
            "\t\tWill: 68",
            '',
        ];

        for (var i = 0; i < lines.length; i++) {
            expect(lines[i]).toBe(expected[i]);
        }

        expect(lines.length).toBe(expected.length);
    });

    it('formats primary hand', function () {
        character.Equipment.PrimaryHand = createItem('primary weapon');

        var formattedCharacter = characterFormatterService.formatCharacter(character, leadership, cohort, followers);
        var lines = formattedCharacter.split('\r\n');

        var expected = [
            'Alignment: alignment 1',
            'Level 9267 class name 1',
            'base race 1',
            '\tFemale',
            '\tLand Speed: 31',
            '\tSize: size 1',
            '\tAge: 19 (adult 1)',
            '\tHeight: 4.083333333333333 feet filtered',
            '\tWeight: 101 lbs.',
            'Stats:',
            '\tStrength: 3 (-3)',
            '\tConstitution: 27 (14)',
            '\tDexterity: 7 (-1)',
            '\tIntelligence: 91 (46)',
            '\tWisdom: 11 (1)',
            '\tCharisma: 10 (0)',
            'Languages:',
            '\tEnglish 1',
            '\tGerman 1',
            'Skills:',
            '\tskill 1',
            '\t\tRanks: 5',
            '\t\tStat Bonus: 14',
            '\t\tOther Bonus: 0',
            '\t\tArmor Check Penalty: -7',
            '\t\tClass Skill',
            '\tskill 2',
            '\t\tRanks: 2.5',
            '\t\tStat Bonus: -1',
            '\t\tOther Bonus: 4',
            '\t\tArmor Check Penalty: 0',
            '\t\tCircumstantial Bonus',
            'Feats:',
            '\tfeat 2',
            '\tfeat 3',
            'Interesting Trait: None',
            "Equipment:",
            "\tPrimary Hand:",
            '\t\tprimary weapon',
            '\t\t\tformatted',
            "\tOff Hand: None",
            "\tArmor: None",
            "\tTreasure: None",
            "Combat:",
            "\tAdjusted Dexterity Bonus: 4",
            "\tArmor Class: 8",
            "\t\tFlat-Footed: 13",
            "\t\tTouch: 35",
            "\tBase Attack:",
            "\t\tMelee: +22/+17/+12/+7/+2",
            "\t\tRanged: +23/+18/+13/+8/+3",
            "\tHit Points: 3457",
            "\tInitiative Bonus: 4568",
            "\tSaving Throws:",
            "\t\tFortitude: 57",
            "\t\tReflex: 79",
            "\t\tWill: 68",
            '',
        ];

        for (var i = 0; i < lines.length; i++) {
            expect(lines[i]).toBe(expected[i]);
        }

        expect(lines.length).toBe(expected.length);
    });

    it('formats two-handed weapon', function () {
        character.Equipment.PrimaryHand = createItem('primary weapon');
        character.Equipment.PrimaryHand.Attributes.push('Two-Handed');

        var formattedCharacter = characterFormatterService.formatCharacter(character, leadership, cohort, followers);
        var lines = formattedCharacter.split('\r\n');

        var expected = [
            'Alignment: alignment 1',
            'Level 9267 class name 1',
            'base race 1',
            '\tFemale',
            '\tLand Speed: 31',
            '\tSize: size 1',
            '\tAge: 19 (adult 1)',
            '\tHeight: 4.083333333333333 feet filtered',
            '\tWeight: 101 lbs.',
            'Stats:',
            '\tStrength: 3 (-3)',
            '\tConstitution: 27 (14)',
            '\tDexterity: 7 (-1)',
            '\tIntelligence: 91 (46)',
            '\tWisdom: 11 (1)',
            '\tCharisma: 10 (0)',
            'Languages:',
            '\tEnglish 1',
            '\tGerman 1',
            'Skills:',
            '\tskill 1',
            '\t\tRanks: 5',
            '\t\tStat Bonus: 14',
            '\t\tOther Bonus: 0',
            '\t\tArmor Check Penalty: -7',
            '\t\tClass Skill',
            '\tskill 2',
            '\t\tRanks: 2.5',
            '\t\tStat Bonus: -1',
            '\t\tOther Bonus: 4',
            '\t\tArmor Check Penalty: 0',
            '\t\tCircumstantial Bonus',
            'Feats:',
            '\tfeat 2',
            '\tfeat 3',
            'Interesting Trait: None',
            "Equipment:",
            "\tPrimary Hand:",
            '\t\tprimary weapon',
            '\t\t\tformatted',
            "\tOff Hand: (Two-Handed)",
            "\tArmor: None",
            "\tTreasure: None",
            "Combat:",
            "\tAdjusted Dexterity Bonus: 4",
            "\tArmor Class: 8",
            "\t\tFlat-Footed: 13",
            "\t\tTouch: 35",
            "\tBase Attack:",
            "\t\tMelee: +22/+17/+12/+7/+2",
            "\t\tRanged: +23/+18/+13/+8/+3",
            "\tHit Points: 3457",
            "\tInitiative Bonus: 4568",
            "\tSaving Throws:",
            "\t\tFortitude: 57",
            "\t\tReflex: 79",
            "\t\tWill: 68",
            '',
        ];

        for (var i = 0; i < lines.length; i++) {
            expect(lines[i]).toBe(expected[i]);
        }

        expect(lines.length).toBe(expected.length);
    });

    it('formats off-hand item', function () {
        character.Equipment.PrimaryHand = createItem('primary weapon');
        character.Equipment.OffHand = createItem('off-hand item');

        var formattedCharacter = characterFormatterService.formatCharacter(character, leadership, cohort, followers);
        var lines = formattedCharacter.split('\r\n');

        var expected = [
            'Alignment: alignment 1',
            'Level 9267 class name 1',
            'base race 1',
            '\tFemale',
            '\tLand Speed: 31',
            '\tSize: size 1',
            '\tAge: 19 (adult 1)',
            '\tHeight: 4.083333333333333 feet filtered',
            '\tWeight: 101 lbs.',
            'Stats:',
            '\tStrength: 3 (-3)',
            '\tConstitution: 27 (14)',
            '\tDexterity: 7 (-1)',
            '\tIntelligence: 91 (46)',
            '\tWisdom: 11 (1)',
            '\tCharisma: 10 (0)',
            'Languages:',
            '\tEnglish 1',
            '\tGerman 1',
            'Skills:',
            '\tskill 1',
            '\t\tRanks: 5',
            '\t\tStat Bonus: 14',
            '\t\tOther Bonus: 0',
            '\t\tArmor Check Penalty: -7',
            '\t\tClass Skill',
            '\tskill 2',
            '\t\tRanks: 2.5',
            '\t\tStat Bonus: -1',
            '\t\tOther Bonus: 4',
            '\t\tArmor Check Penalty: 0',
            '\t\tCircumstantial Bonus',
            'Feats:',
            '\tfeat 2',
            '\tfeat 3',
            'Interesting Trait: None',
            "Equipment:",
            "\tPrimary Hand:",
            '\t\tprimary weapon',
            '\t\t\tformatted',
            "\tOff Hand:",
            '\t\toff-hand item',
            '\t\t\tformatted',
            "\tArmor: None",
            "\tTreasure: None",
            "Combat:",
            "\tAdjusted Dexterity Bonus: 4",
            "\tArmor Class: 8",
            "\t\tFlat-Footed: 13",
            "\t\tTouch: 35",
            "\tBase Attack:",
            "\t\tMelee: +22/+17/+12/+7/+2",
            "\t\tRanged: +23/+18/+13/+8/+3",
            "\tHit Points: 3457",
            "\tInitiative Bonus: 4568",
            "\tSaving Throws:",
            "\t\tFortitude: 57",
            "\t\tReflex: 79",
            "\t\tWill: 68",
            '',
        ];

        for (var i = 0; i < lines.length; i++) {
            expect(lines[i]).toBe(expected[i]);
        }

        expect(lines.length).toBe(expected.length);
    });

    it('formats armor', function () {
        character.Equipment.Armor = createItem('armor');

        var formattedCharacter = characterFormatterService.formatCharacter(character, leadership, cohort, followers);
        var lines = formattedCharacter.split('\r\n');

        var expected = [
            'Alignment: alignment 1',
            'Level 9267 class name 1',
            'base race 1',
            '\tFemale',
            '\tLand Speed: 31',
            '\tSize: size 1',
            '\tAge: 19 (adult 1)',
            '\tHeight: 4.083333333333333 feet filtered',
            '\tWeight: 101 lbs.',
            'Stats:',
            '\tStrength: 3 (-3)',
            '\tConstitution: 27 (14)',
            '\tDexterity: 7 (-1)',
            '\tIntelligence: 91 (46)',
            '\tWisdom: 11 (1)',
            '\tCharisma: 10 (0)',
            'Languages:',
            '\tEnglish 1',
            '\tGerman 1',
            'Skills:',
            '\tskill 1',
            '\t\tRanks: 5',
            '\t\tStat Bonus: 14',
            '\t\tOther Bonus: 0',
            '\t\tArmor Check Penalty: -7',
            '\t\tClass Skill',
            '\tskill 2',
            '\t\tRanks: 2.5',
            '\t\tStat Bonus: -1',
            '\t\tOther Bonus: 4',
            '\t\tArmor Check Penalty: 0',
            '\t\tCircumstantial Bonus',
            'Feats:',
            '\tfeat 2',
            '\tfeat 3',
            'Interesting Trait: None',
            "Equipment:",
            "\tPrimary Hand: None",
            "\tOff Hand: None",
            "\tArmor:",
            '\t\tarmor',
            '\t\t\tformatted',
            "\tTreasure: None",
            "Combat:",
            "\tAdjusted Dexterity Bonus: 4",
            "\tArmor Class: 8",
            "\t\tFlat-Footed: 13",
            "\t\tTouch: 35",
            "\tBase Attack:",
            "\t\tMelee: +22/+17/+12/+7/+2",
            "\t\tRanged: +23/+18/+13/+8/+3",
            "\tHit Points: 3457",
            "\tInitiative Bonus: 4568",
            "\tSaving Throws:",
            "\t\tFortitude: 57",
            "\t\tReflex: 79",
            "\t\tWill: 68",
            '',
        ];

        for (var i = 0; i < lines.length; i++) {
            expect(lines[i]).toBe(expected[i]);
        }

        expect(lines.length).toBe(expected.length);
    });

    it('formats treasure if there is any', function () {
        character.Equipment.Treasure.IsAny = true;

        var formattedCharacter = characterFormatterService.formatCharacter(character, leadership, cohort, followers);
        var lines = formattedCharacter.split('\r\n');

        var expected = [
            'Alignment: alignment 1',
            'Level 9267 class name 1',
            'base race 1',
            '\tFemale',
            '\tLand Speed: 31',
            '\tSize: size 1',
            '\tAge: 19 (adult 1)',
            '\tHeight: 4.083333333333333 feet filtered',
            '\tWeight: 101 lbs.',
            'Stats:',
            '\tStrength: 3 (-3)',
            '\tConstitution: 27 (14)',
            '\tDexterity: 7 (-1)',
            '\tIntelligence: 91 (46)',
            '\tWisdom: 11 (1)',
            '\tCharisma: 10 (0)',
            'Languages:',
            '\tEnglish 1',
            '\tGerman 1',
            'Skills:',
            '\tskill 1',
            '\t\tRanks: 5',
            '\t\tStat Bonus: 14',
            '\t\tOther Bonus: 0',
            '\t\tArmor Check Penalty: -7',
            '\t\tClass Skill',
            '\tskill 2',
            '\t\tRanks: 2.5',
            '\t\tStat Bonus: -1',
            '\t\tOther Bonus: 4',
            '\t\tArmor Check Penalty: 0',
            '\t\tCircumstantial Bonus',
            'Feats:',
            '\tfeat 2',
            '\tfeat 3',
            'Interesting Trait: None',
            "Equipment:",
            "\tPrimary Hand: None",
            "\tOff Hand: None",
            "\tArmor: None",
            "\tTreasure:",
            "\t\tformatted treasure",
            "Combat:",
            "\tAdjusted Dexterity Bonus: 4",
            "\tArmor Class: 8",
            "\t\tFlat-Footed: 13",
            "\t\tTouch: 35",
            "\tBase Attack:",
            "\t\tMelee: +22/+17/+12/+7/+2",
            "\t\tRanged: +23/+18/+13/+8/+3",
            "\tHit Points: 3457",
            "\tInitiative Bonus: 4568",
            "\tSaving Throws:",
            "\t\tFortitude: 57",
            "\t\tReflex: 79",
            "\t\tWill: 68",
            '',
        ];

        for (var i = 0; i < lines.length; i++) {
            expect(lines[i]).toBe(expected[i]);
        }

        expect(lines.length).toBe(expected.length);
    });

    it('formats circumstantial armor bonus', function () {
        character.Combat.ArmorClass.CircumstantialBonus = true;

        var formattedCharacter = characterFormatterService.formatCharacter(character, leadership, cohort, followers);
        var lines = formattedCharacter.split('\r\n');

        var expected = [
            'Alignment: alignment 1',
            'Level 9267 class name 1',
            'base race 1',
            '\tFemale',
            '\tLand Speed: 31',
            '\tSize: size 1',
            '\tAge: 19 (adult 1)',
            '\tHeight: 4.083333333333333 feet filtered',
            '\tWeight: 101 lbs.',
            'Stats:',
            '\tStrength: 3 (-3)',
            '\tConstitution: 27 (14)',
            '\tDexterity: 7 (-1)',
            '\tIntelligence: 91 (46)',
            '\tWisdom: 11 (1)',
            '\tCharisma: 10 (0)',
            'Languages:',
            '\tEnglish 1',
            '\tGerman 1',
            'Skills:',
            '\tskill 1',
            '\t\tRanks: 5',
            '\t\tStat Bonus: 14',
            '\t\tOther Bonus: 0',
            '\t\tArmor Check Penalty: -7',
            '\t\tClass Skill',
            '\tskill 2',
            '\t\tRanks: 2.5',
            '\t\tStat Bonus: -1',
            '\t\tOther Bonus: 4',
            '\t\tArmor Check Penalty: 0',
            '\t\tCircumstantial Bonus',
            'Feats:',
            '\tfeat 2',
            '\tfeat 3',
            'Interesting Trait: None',
            "Equipment:",
            "\tPrimary Hand: None",
            "\tOff Hand: None",
            "\tArmor: None",
            "\tTreasure: None",
            "Combat:",
            "\tAdjusted Dexterity Bonus: 4",
            "\tArmor Class: 8 *",
            "\t\tFlat-Footed: 13",
            "\t\tTouch: 35",
            "\tBase Attack:",
            "\t\tMelee: +22/+17/+12/+7/+2",
            "\t\tRanged: +23/+18/+13/+8/+3",
            "\tHit Points: 3457",
            "\tInitiative Bonus: 4568",
            "\tSaving Throws:",
            "\t\tFortitude: 57",
            "\t\tReflex: 79",
            "\t\tWill: 68",
            '',
        ];

        for (var i = 0; i < lines.length; i++) {
            expect(lines[i]).toBe(expected[i]);
        }

        expect(lines.length).toBe(expected.length);
    });

    it('formats circumstantial base attack bonus', function () {
        character.Combat.BaseAttack.CircumstantialBonus = true;

        var formattedCharacter = characterFormatterService.formatCharacter(character, leadership, cohort, followers);
        var lines = formattedCharacter.split('\r\n');

        var expected = [
            'Alignment: alignment 1',
            'Level 9267 class name 1',
            'base race 1',
            '\tFemale',
            '\tLand Speed: 31',
            '\tSize: size 1',
            '\tAge: 19 (adult 1)',
            '\tHeight: 4.083333333333333 feet filtered',
            '\tWeight: 101 lbs.',
            'Stats:',
            '\tStrength: 3 (-3)',
            '\tConstitution: 27 (14)',
            '\tDexterity: 7 (-1)',
            '\tIntelligence: 91 (46)',
            '\tWisdom: 11 (1)',
            '\tCharisma: 10 (0)',
            'Languages:',
            '\tEnglish 1',
            '\tGerman 1',
            'Skills:',
            '\tskill 1',
            '\t\tRanks: 5',
            '\t\tStat Bonus: 14',
            '\t\tOther Bonus: 0',
            '\t\tArmor Check Penalty: -7',
            '\t\tClass Skill',
            '\tskill 2',
            '\t\tRanks: 2.5',
            '\t\tStat Bonus: -1',
            '\t\tOther Bonus: 4',
            '\t\tArmor Check Penalty: 0',
            '\t\tCircumstantial Bonus',
            'Feats:',
            '\tfeat 2',
            '\tfeat 3',
            'Interesting Trait: None',
            "Equipment:",
            "\tPrimary Hand: None",
            "\tOff Hand: None",
            "\tArmor: None",
            "\tTreasure: None",
            "Combat:",
            "\tAdjusted Dexterity Bonus: 4",
            "\tArmor Class: 8",
            "\t\tFlat-Footed: 13",
            "\t\tTouch: 35",
            "\tBase Attack:",
            "\t\tMelee: +22/+17/+12/+7/+2 *",
            "\t\tRanged: +23/+18/+13/+8/+3 *",
            "\tHit Points: 3457",
            "\tInitiative Bonus: 4568",
            "\tSaving Throws:",
            "\t\tFortitude: 57",
            "\t\tReflex: 79",
            "\t\tWill: 68",
            '',
        ];

        for (var i = 0; i < lines.length; i++) {
            expect(lines[i]).toBe(expected[i]);
        }

        expect(lines.length).toBe(expected.length);
    });

    it('formats negative base attack bonus', function () {
        character.Combat.BaseAttack.AllMeleeBonuses = [-2]
        character.Combat.BaseAttack.AllRangedBonuses = [-1];

        var formattedCharacter = characterFormatterService.formatCharacter(character, leadership, cohort, followers);
        var lines = formattedCharacter.split('\r\n');

        var expected = [
            'Alignment: alignment 1',
            'Level 9267 class name 1',
            'base race 1',
            '\tFemale',
            '\tLand Speed: 31',
            '\tSize: size 1',
            '\tAge: 19 (adult 1)',
            '\tHeight: 4.083333333333333 feet filtered',
            '\tWeight: 101 lbs.',
            'Stats:',
            '\tStrength: 3 (-3)',
            '\tConstitution: 27 (14)',
            '\tDexterity: 7 (-1)',
            '\tIntelligence: 91 (46)',
            '\tWisdom: 11 (1)',
            '\tCharisma: 10 (0)',
            'Languages:',
            '\tEnglish 1',
            '\tGerman 1',
            'Skills:',
            '\tskill 1',
            '\t\tRanks: 5',
            '\t\tStat Bonus: 14',
            '\t\tOther Bonus: 0',
            '\t\tArmor Check Penalty: -7',
            '\t\tClass Skill',
            '\tskill 2',
            '\t\tRanks: 2.5',
            '\t\tStat Bonus: -1',
            '\t\tOther Bonus: 4',
            '\t\tArmor Check Penalty: 0',
            '\t\tCircumstantial Bonus',
            'Feats:',
            '\tfeat 2',
            '\tfeat 3',
            'Interesting Trait: None',
            "Equipment:",
            "\tPrimary Hand: None",
            "\tOff Hand: None",
            "\tArmor: None",
            "\tTreasure: None",
            "Combat:",
            "\tAdjusted Dexterity Bonus: 4",
            "\tArmor Class: 8",
            "\t\tFlat-Footed: 13",
            "\t\tTouch: 35",
            "\tBase Attack:",
            "\t\tMelee: -2",
            "\t\tRanged: -1",
            "\tHit Points: 3457",
            "\tInitiative Bonus: 4568",
            "\tSaving Throws:",
            "\t\tFortitude: 57",
            "\t\tReflex: 79",
            "\t\tWill: 68",
            '',
        ];

        for (var i = 0; i < lines.length; i++) {
            expect(lines[i]).toBe(expected[i]);
        }

        expect(lines.length).toBe(expected.length);
    });

    it('formats circumstantial save bonus', function () {
        character.Combat.SavingThrows.CircumstantialBonus = true;

        var formattedCharacter = characterFormatterService.formatCharacter(character, leadership, cohort, followers);
        var lines = formattedCharacter.split('\r\n');

        var expected = [
            'Alignment: alignment 1',
            'Level 9267 class name 1',
            'base race 1',
            '\tFemale',
            '\tLand Speed: 31',
            '\tSize: size 1',
            '\tAge: 19 (adult 1)',
            '\tHeight: 4.083333333333333 feet filtered',
            '\tWeight: 101 lbs.',
            'Stats:',
            '\tStrength: 3 (-3)',
            '\tConstitution: 27 (14)',
            '\tDexterity: 7 (-1)',
            '\tIntelligence: 91 (46)',
            '\tWisdom: 11 (1)',
            '\tCharisma: 10 (0)',
            'Languages:',
            '\tEnglish 1',
            '\tGerman 1',
            'Skills:',
            '\tskill 1',
            '\t\tRanks: 5',
            '\t\tStat Bonus: 14',
            '\t\tOther Bonus: 0',
            '\t\tArmor Check Penalty: -7',
            '\t\tClass Skill',
            '\tskill 2',
            '\t\tRanks: 2.5',
            '\t\tStat Bonus: -1',
            '\t\tOther Bonus: 4',
            '\t\tArmor Check Penalty: 0',
            '\t\tCircumstantial Bonus',
            'Feats:',
            '\tfeat 2',
            '\tfeat 3',
            'Interesting Trait: None',
            "Equipment:",
            "\tPrimary Hand: None",
            "\tOff Hand: None",
            "\tArmor: None",
            "\tTreasure: None",
            "Combat:",
            "\tAdjusted Dexterity Bonus: 4",
            "\tArmor Class: 8",
            "\t\tFlat-Footed: 13",
            "\t\tTouch: 35",
            "\tBase Attack:",
            "\t\tMelee: +22/+17/+12/+7/+2",
            "\t\tRanged: +23/+18/+13/+8/+3",
            "\tHit Points: 3457",
            "\tInitiative Bonus: 4568",
            "\tSaving Throws:",
            "\t\tFortitude: 57",
            "\t\tReflex: 79",
            "\t\tWill: 68",
            "\t\tCircumstantial Bonus",
            '',
        ];

        for (var i = 0; i < lines.length; i++) {
            expect(lines[i]).toBe(expected[i]);
        }

        expect(lines.length).toBe(expected.length);
    });

    it('formats full character', function () {
        character.Class.SpecialistFields = ["specialist field 1", "specialist field 2" ];
        character.Class.ProhibitedFields = ["prohibited field 1", "prohibited field 2" ];
        character.Race.Metarace = "metarace";
        character.Race.MetaraceSpecies = "metarace species";
        character.Race.HasWings = true;
        character.Race.AerialSpeed = 12345;

        character.Ability.Feats[0].Foci = [ "focus 1", "focus 2" ];
        character.Ability.Feats[0].Frequency.Quantity = 34567;
        character.Ability.Feats[0].Frequency.TimePeriod = "time period";
        character.Ability.Feats[0].Power = 23456;

        character.InterestingTrait = "interesting trait";

        character.Magic.SpellsPerDay = [
            { Level: 0, Quantity: 45678 },
            { Level: 1, Quantity: 56789  , HasDomainSpell: true }
        ];

        character.Magic.ArcaneSpellFailure = 12;
        character.Magic.Animal = "animal";
        character.Equipment.PrimaryHand = createItem('primary weapon');
        character.Equipment.OffHand = createItem('off-hand item');
        character.Equipment.Armor = createItem('armor');
        character.Equipment.Treasure.IsAny = true;
        character.Combat.ArmorClass.CircumstantialBonus = true;
        character.Combat.BaseAttack.CircumstantialBonus = true;
        character.Combat.SavingThrows.CircumstantialBonus = true;
        character.Combat.ArmorClass.CircumstantialBonus = true;
        character.Combat.BaseAttack.CircumstantialBonus = true;
        character.Combat.SavingThrows.CircumstantialBonus = true;

        var formattedCharacter = characterFormatterService.formatCharacter(character, leadership, cohort, followers);
        var lines = formattedCharacter.split('\r\n');

        var expected = [
            'Alignment: alignment 1',
            'Level 9267 class name 1',
            "\tSpecialist:",
            "\t\tspecialist field 1",
            "\t\tspecialist field 2",
            "\tProhibited:",
            "\t\tprohibited field 1",
            "\t\tprohibited field 2",
            'metarace base race 1',
            '\tFemale',
            '\tMetarace Species: metarace species',
            '\tLand Speed: 31',
            '\tSize: size 1',
            '\tAge: 19 (adult 1)',
            '\tHeight: 4.083333333333333 feet filtered',
            '\tWeight: 101 lbs.',
            '\tHas Wings',
            '\tAerial Speed: 12345',
            'Stats:',
            '\tStrength: 3 (-3)',
            '\tConstitution: 27 (14)',
            '\tDexterity: 7 (-1)',
            '\tIntelligence: 91 (46)',
            '\tWisdom: 11 (1)',
            '\tCharisma: 10 (0)',
            'Languages:',
            '\tEnglish 1',
            '\tGerman 1',
            'Skills:',
            '\tskill 1',
            '\t\tRanks: 5',
            '\t\tStat Bonus: 14',
            '\t\tOther Bonus: 0',
            '\t\tArmor Check Penalty: -7',
            '\t\tClass Skill',
            '\tskill 2',
            '\t\tRanks: 2.5',
            '\t\tStat Bonus: -1',
            '\t\tOther Bonus: 4',
            '\t\tArmor Check Penalty: 0',
            '\t\tCircumstantial Bonus',
            'Feats:',
            '\tfeat 2',
            '\t\tFoci:',
            '\t\t\tfocus 1',
            '\t\t\tfocus 2',
            '\t\tFrequency: 34567/time period',
            '\t\tPower: 23456',
            '\tfeat 3',
            'Interesting Trait: interesting trait',
            'Spells Per Day:',
            '\tLevel 0: 45678',
            '\tLevel 1: 56789 + 1',
            'Arcane Spell Failure: 12%',
            'Animal: animal',
            "Equipment:",
            "\tPrimary Hand:",
            '\t\tprimary weapon',
            '\t\t\tformatted',
            "\tOff Hand:",
            '\t\toff-hand item',
            '\t\t\tformatted',
            '\tArmor:',
            '\t\tarmor',
            '\t\t\tformatted',
            '\tTreasure:',
            '\t\tformatted treasure',
            "Combat:",
            "\tAdjusted Dexterity Bonus: 4",
            "\tArmor Class: 8 *",
            "\t\tFlat-Footed: 13",
            "\t\tTouch: 35",
            "\tBase Attack:",
            "\t\tMelee: +22/+17/+12/+7/+2 *",
            "\t\tRanged: +23/+18/+13/+8/+3 *",
            "\tHit Points: 3457",
            "\tInitiative Bonus: 4568",
            "\tSaving Throws:",
            "\t\tFortitude: 57",
            "\t\tReflex: 79",
            "\t\tWill: 68",
            "\t\tCircumstantial Bonus",
            '',
        ];

        for (var i = 0; i < lines.length; i++) {
            expect(lines[i]).toBe(expected[i]);
        }

        expect(lines.length).toBe(expected.length);
    });

    it('formats full character with prefix', function () {
        character.Class.SpecialistFields = ["specialist field 1", "specialist field 2"];
        character.Class.ProhibitedFields = ["prohibited field 1", "prohibited field 2"];
        character.Race.Metarace = "metarace";
        character.Race.MetaraceSpecies = "metarace species";
        character.Race.HasWings = true;
        character.Race.AerialSpeed = 12345;

        character.Ability.Feats[0].Foci = ["focus 1", "focus 2"];
        character.Ability.Feats[0].Frequency.Quantity = 34567;
        character.Ability.Feats[0].Frequency.TimePeriod = "time period";
        character.Ability.Feats[0].Power = 23456;

        character.InterestingTrait = "interesting trait";

        character.Magic.SpellsPerDay = [
            { Level: 0, Quantity: 45678 },
            { Level: 1, Quantity: 56789, HasDomainSpell: true }
        ];

        character.Magic.ArcaneSpellFailure = 12;
        character.Magic.Animal = "animal";
        character.Equipment.PrimaryHand = createItem('primary weapon');
        character.Equipment.OffHand = createItem('off-hand item');
        character.Equipment.Armor = createItem('armor');
        character.Equipment.Treasure.IsAny = true;
        character.Combat.ArmorClass.CircumstantialBonus = true;
        character.Combat.BaseAttack.CircumstantialBonus = true;
        character.Combat.SavingThrows.CircumstantialBonus = true;
        character.Combat.ArmorClass.CircumstantialBonus = true;
        character.Combat.BaseAttack.CircumstantialBonus = true;
        character.Combat.SavingThrows.CircumstantialBonus = true;

        var formattedCharacter = characterFormatterService.formatCharacter(character, null, null, null, '\t');
        var lines = formattedCharacter.split('\r\n');

        var expected = [
            '\tAlignment: alignment 1',
            '\tLevel 9267 class name 1',
            "\t\tSpecialist:",
            "\t\t\tspecialist field 1",
            "\t\t\tspecialist field 2",
            "\t\tProhibited:",
            "\t\t\tprohibited field 1",
            "\t\t\tprohibited field 2",
            '\tmetarace base race 1',
            '\t\tFemale',
            '\t\tMetarace Species: metarace species',
            '\t\tLand Speed: 31',
            '\t\tSize: size 1',
            '\t\tAge: 19 (adult 1)',
            '\t\tHeight: 4.083333333333333 feet filtered',
            '\t\tWeight: 101 lbs.',
            '\t\tHas Wings',
            '\t\tAerial Speed: 12345',
            '\tStats:',
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
            '\t\tskill 1',
            '\t\t\tRanks: 5',
            '\t\t\tStat Bonus: 14',
            '\t\t\tOther Bonus: 0',
            '\t\t\tArmor Check Penalty: -7',
            '\t\t\tClass Skill',
            '\t\tskill 2',
            '\t\t\tRanks: 2.5',
            '\t\t\tStat Bonus: -1',
            '\t\t\tOther Bonus: 4',
            '\t\t\tArmor Check Penalty: 0',
            '\t\t\tCircumstantial Bonus',
            '\tFeats:',
            '\t\tfeat 2',
            '\t\t\tFoci:',
            '\t\t\t\tfocus 1',
            '\t\t\t\tfocus 2',
            '\t\t\tFrequency: 34567/time period',
            '\t\t\tPower: 23456',
            '\t\tfeat 3',
            '\tInteresting Trait: interesting trait',
            '\tSpells Per Day:',
            '\t\tLevel 0: 45678',
            '\t\tLevel 1: 56789 + 1',
            '\tArcane Spell Failure: 12%',
            '\tAnimal: animal',
            "\tEquipment:",
            "\t\tPrimary Hand:",
            '\t\t\tprimary weapon',
            '\t\t\t\tformatted',
            "\t\tOff Hand:",
            '\t\t\toff-hand item',
            '\t\t\t\tformatted',
            '\t\tArmor:',
            '\t\t\tarmor',
            '\t\t\t\tformatted',
            '\t\tTreasure:',
            '\t\t\tformatted treasure',
            "\tCombat:",
            "\t\tAdjusted Dexterity Bonus: 4",
            "\t\tArmor Class: 8 *",
            "\t\t\tFlat-Footed: 13",
            "\t\t\tTouch: 35",
            "\t\tBase Attack:",
            "\t\t\tMelee: +22/+17/+12/+7/+2 *",
            "\t\t\tRanged: +23/+18/+13/+8/+3 *",
            "\t\tHit Points: 3457",
            "\t\tInitiative Bonus: 4568",
            "\t\tSaving Throws:",
            "\t\t\tFortitude: 57",
            "\t\t\tReflex: 79",
            "\t\t\tWill: 68",
            "\t\t\tCircumstantial Bonus",
            '',
        ];

        for (var i = 0; i < lines.length; i++) {
            expect(lines[i]).toBe(expected[i]);
        }

        expect(lines.length).toBe(expected.length);
    });

    it('formats character with full leadership', function () {
        leadership = {
            Score: 9876,
            LeadershipModifiers: ['killed a man', 'with this thumb']
        };

        cohort = createCharacter();
        followers = [createCharacter(), createCharacter()];

        var formattedCharacter = characterFormatterService.formatCharacter(character, leadership, cohort, followers);
        var lines = formattedCharacter.split('\r\n');

        var expected = [
            'Alignment: alignment 1',
            'Level 9267 class name 1',
            'base race 1',
            '\tFemale',
            '\tLand Speed: 31',
            '\tSize: size 1',
            '\tAge: 19 (adult 1)',
            '\tHeight: 4.083333333333333 feet filtered',
            '\tWeight: 101 lbs.',
            'Stats:',
            '\tStrength: 3 (-3)',
            '\tConstitution: 27 (14)',
            '\tDexterity: 7 (-1)',
            '\tIntelligence: 91 (46)',
            '\tWisdom: 11 (1)',
            '\tCharisma: 10 (0)',
            'Languages:',
            '\tEnglish 1',
            '\tGerman 1',
            'Skills:',
            '\tskill 1',
            '\t\tRanks: 5',
            '\t\tStat Bonus: 14',
            '\t\tOther Bonus: 0',
            '\t\tArmor Check Penalty: -7',
            '\t\tClass Skill',
            '\tskill 2',
            '\t\tRanks: 2.5',
            '\t\tStat Bonus: -1',
            '\t\tOther Bonus: 4',
            '\t\tArmor Check Penalty: 0',
            '\t\tCircumstantial Bonus',
            'Feats:',
            '\tfeat 2',
            '\tfeat 3',
            'Interesting Trait: None',
            "Equipment:",
            "\tPrimary Hand: None",
            "\tOff Hand: None",
            "\tArmor: None",
            "\tTreasure: None",
            "Combat:",
            "\tAdjusted Dexterity Bonus: 4",
            "\tArmor Class: 8",
            "\t\tFlat-Footed: 13",
            "\t\tTouch: 35",
            "\tBase Attack:",
            "\t\tMelee: +22/+17/+12/+7/+2",
            "\t\tRanged: +23/+18/+13/+8/+3",
            "\tHit Points: 3457",
            "\tInitiative Bonus: 4568",
            "\tSaving Throws:",
            "\t\tFortitude: 57",
            "\t\tReflex: 79",
            "\t\tWill: 68",
            '',
            'Leadership:',
            '\tScore: 9876',
            '\tLeadership Modifiers:',
            '\t\tkilled a man',
            '\t\twith this thumb',
            '',
            'Cohort:',
            '\tAlignment: alignment 2',
            '\tLevel 9268 class name 2',
            '\tbase race 2',
            '\t\tMale',
            '\t\tLand Speed: 32',
            '\t\tSize: size 2',
            '\t\tAge: 20 (adult 2)',
            '\t\tHeight: 4.166666666666667 feet filtered',
            '\t\tWeight: 102 lbs.',
            '\tStats:',
            '\t\tStrength: 4 (-2)',
            '\t\tConstitution: 28 (15)',
            '\t\tDexterity: 8 (0)',
            '\t\tIntelligence: 92 (47)',
            '\t\tWisdom: 12 (2)',
            '\t\tCharisma: 11 (1)',
            '\tLanguages:',
            '\t\tEnglish 2',
            '\t\tGerman 2',
            '\tSkills:',
            '\t\tskill 1',
            '\t\t\tRanks: 6',
            '\t\t\tStat Bonus: 15',
            '\t\t\tOther Bonus: 0',
            '\t\t\tArmor Check Penalty: -8',
            '\t\t\tClass Skill',
            '\t\tskill 2',
            '\t\t\tRanks: 3.5',
            '\t\t\tStat Bonus: 0',
            '\t\t\tOther Bonus: 5',
            '\t\t\tArmor Check Penalty: 0',
            '\t\t\tCircumstantial Bonus',
            '\tFeats:',
            '\t\tfeat 3',
            '\t\tfeat 4',
            '\tInteresting Trait: None',
            "\tEquipment:",
            "\t\tPrimary Hand: None",
            "\t\tOff Hand: None",
            "\t\tArmor: None",
            "\t\tTreasure: None",
            "\tCombat:",
            "\t\tAdjusted Dexterity Bonus: 5",
            "\t\tArmor Class: 9",
            "\t\t\tFlat-Footed: 14",
            "\t\t\tTouch: 36",
            "\t\tBase Attack:",
            "\t\t\tMelee: +23/+18/+13/+8/+3",
            "\t\t\tRanged: +24/+19/+14/+9/+4",
            "\t\tHit Points: 3458",
            "\t\tInitiative Bonus: 4569",
            "\t\tSaving Throws:",
            "\t\t\tFortitude: 58",
            "\t\t\tReflex: 80",
            "\t\t\tWill: 69",
            '',
            'Followers:',
            '',
            '\tAlignment: alignment 3',
            '\tLevel 9269 class name 3',
            '\tbase race 3',
            '\t\tFemale',
            '\t\tLand Speed: 33',
            '\t\tSize: size 3',
            '\t\tAge: 21 (adult 3)',
            '\t\tHeight: 4.25 feet filtered',
            '\t\tWeight: 103 lbs.',
            '\tStats:',
            '\t\tStrength: 5 (-1)',
            '\t\tConstitution: 29 (16)',
            '\t\tDexterity: 9 (1)',
            '\t\tIntelligence: 93 (48)',
            '\t\tWisdom: 13 (3)',
            '\t\tCharisma: 12 (2)',
            '\tLanguages:',
            '\t\tEnglish 3',
            '\t\tGerman 3',
            '\tSkills:',
            '\t\tskill 1',
            '\t\t\tRanks: 7',
            '\t\t\tStat Bonus: 16',
            '\t\t\tOther Bonus: 0',
            '\t\t\tArmor Check Penalty: -9',
            '\t\t\tClass Skill',
            '\t\tskill 2',
            '\t\t\tRanks: 4.5',
            '\t\t\tStat Bonus: 1',
            '\t\t\tOther Bonus: 6',
            '\t\t\tArmor Check Penalty: 0',
            '\t\t\tCircumstantial Bonus',
            '\tFeats:',
            '\t\tfeat 4',
            '\t\tfeat 5',
            '\tInteresting Trait: None',
            "\tEquipment:",
            "\t\tPrimary Hand: None",
            "\t\tOff Hand: None",
            "\t\tArmor: None",
            "\t\tTreasure: None",
            "\tCombat:",
            "\t\tAdjusted Dexterity Bonus: 6",
            "\t\tArmor Class: 10",
            "\t\t\tFlat-Footed: 15",
            "\t\t\tTouch: 37",
            "\t\tBase Attack:",
            "\t\t\tMelee: +24/+19/+14/+9/+4",
            "\t\t\tRanged: +25/+20/+15/+10/+5",
            "\t\tHit Points: 3459",
            "\t\tInitiative Bonus: 4570",
            "\t\tSaving Throws:",
            "\t\t\tFortitude: 59",
            "\t\t\tReflex: 81",
            "\t\t\tWill: 70",
            '',
            '\tAlignment: alignment 4',
            '\tLevel 9270 class name 4',
            '\tbase race 4',
            '\t\tMale',
            '\t\tLand Speed: 34',
            '\t\tSize: size 4',
            '\t\tAge: 22 (adult 4)',
            '\t\tHeight: 4.333333333333333 feet filtered',
            '\t\tWeight: 104 lbs.',
            '\tStats:',
            '\t\tStrength: 6 (0)',
            '\t\tConstitution: 30 (17)',
            '\t\tDexterity: 10 (2)',
            '\t\tIntelligence: 94 (49)',
            '\t\tWisdom: 14 (4)',
            '\t\tCharisma: 13 (3)',
            '\tLanguages:',
            '\t\tEnglish 4',
            '\t\tGerman 4',
            '\tSkills:',
            '\t\tskill 1',
            '\t\t\tRanks: 8',
            '\t\t\tStat Bonus: 17',
            '\t\t\tOther Bonus: 0',
            '\t\t\tArmor Check Penalty: -10',
            '\t\t\tClass Skill',
            '\t\tskill 2',
            '\t\t\tRanks: 5.5',
            '\t\t\tStat Bonus: 2',
            '\t\t\tOther Bonus: 7',
            '\t\t\tArmor Check Penalty: 0',
            '\t\t\tCircumstantial Bonus',
            '\tFeats:',
            '\t\tfeat 5',
            '\t\tfeat 6',
            '\tInteresting Trait: None',
            "\tEquipment:",
            "\t\tPrimary Hand: None",
            "\t\tOff Hand: None",
            "\t\tArmor: None",
            "\t\tTreasure: None",
            "\tCombat:",
            "\t\tAdjusted Dexterity Bonus: 7",
            "\t\tArmor Class: 11",
            "\t\t\tFlat-Footed: 16",
            "\t\t\tTouch: 38",
            "\t\tBase Attack:",
            "\t\t\tMelee: +25/+20/+15/+10/+5",
            "\t\t\tRanged: +26/+21/+16/+11/+6",
            "\t\tHit Points: 3460",
            "\t\tInitiative Bonus: 4571",
            "\t\tSaving Throws:",
            "\t\t\tFortitude: 60",
            "\t\t\tReflex: 82",
            "\t\t\tWill: 71",
            '',
        ];

        for (var i = 0; i < lines.length; i++) {
            expect(lines[i]).toBe(expected[i]);
        }

        expect(lines.length).toBe(expected.length);
    });

    it('formats character with full leadership and prefix', function () {
        leadership = {
            Score: 9876,
            LeadershipModifiers: ['killed a man', 'with this thumb']
        };

        cohort = createCharacter();
        followers = [createCharacter(), createCharacter()];

        var formattedCharacter = characterFormatterService.formatCharacter(character, leadership, cohort, followers, '\t');
        var lines = formattedCharacter.split('\r\n');

        var expected = [
            '\tAlignment: alignment 1',
            '\tLevel 9267 class name 1',
            '\tbase race 1',
            '\t\tFemale',
            '\t\tLand Speed: 31',
            '\t\tSize: size 1',
            '\t\tAge: 19 (adult 1)',
            '\t\tHeight: 4.083333333333333 feet filtered',
            '\t\tWeight: 101 lbs.',
            '\tStats:',
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
            '\t\tskill 1',
            '\t\t\tRanks: 5',
            '\t\t\tStat Bonus: 14',
            '\t\t\tOther Bonus: 0',
            '\t\t\tArmor Check Penalty: -7',
            '\t\t\tClass Skill',
            '\t\tskill 2',
            '\t\t\tRanks: 2.5',
            '\t\t\tStat Bonus: -1',
            '\t\t\tOther Bonus: 4',
            '\t\t\tArmor Check Penalty: 0',
            '\t\t\tCircumstantial Bonus',
            '\tFeats:',
            '\t\tfeat 2',
            '\t\tfeat 3',
            '\tInteresting Trait: None',
            "\tEquipment:",
            "\t\tPrimary Hand: None",
            "\t\tOff Hand: None",
            "\t\tArmor: None",
            "\t\tTreasure: None",
            "\tCombat:",
            "\t\tAdjusted Dexterity Bonus: 4",
            "\t\tArmor Class: 8",
            "\t\t\tFlat-Footed: 13",
            "\t\t\tTouch: 35",
            "\t\tBase Attack:",
            "\t\t\tMelee: +22/+17/+12/+7/+2",
            "\t\t\tRanged: +23/+18/+13/+8/+3",
            "\t\tHit Points: 3457",
            "\t\tInitiative Bonus: 4568",
            "\t\tSaving Throws:",
            "\t\t\tFortitude: 57",
            "\t\t\tReflex: 79",
            "\t\t\tWill: 68",
            '',
            '\tLeadership:',
            '\t\tScore: 9876',
            '\t\tLeadership Modifiers:',
            '\t\t\tkilled a man',
            '\t\t\twith this thumb',
            '',
            '\tCohort:',
            '\t\tAlignment: alignment 2',
            '\t\tLevel 9268 class name 2',
            '\t\tbase race 2',
            '\t\t\tMale',
            '\t\t\tLand Speed: 32',
            '\t\t\tSize: size 2',
            '\t\t\tAge: 20 (adult 2)',
            '\t\t\tHeight: 4.166666666666667 feet filtered',
            '\t\t\tWeight: 102 lbs.',
            '\t\tStats:',
            '\t\t\tStrength: 4 (-2)',
            '\t\t\tConstitution: 28 (15)',
            '\t\t\tDexterity: 8 (0)',
            '\t\t\tIntelligence: 92 (47)',
            '\t\t\tWisdom: 12 (2)',
            '\t\t\tCharisma: 11 (1)',
            '\t\tLanguages:',
            '\t\t\tEnglish 2',
            '\t\t\tGerman 2',
            '\t\tSkills:',
            '\t\t\tskill 1',
            '\t\t\t\tRanks: 6',
            '\t\t\t\tStat Bonus: 15',
            '\t\t\t\tOther Bonus: 0',
            '\t\t\t\tArmor Check Penalty: -8',
            '\t\t\t\tClass Skill',
            '\t\t\tskill 2',
            '\t\t\t\tRanks: 3.5',
            '\t\t\t\tStat Bonus: 0',
            '\t\t\t\tOther Bonus: 5',
            '\t\t\t\tArmor Check Penalty: 0',
            '\t\t\t\tCircumstantial Bonus',
            '\t\tFeats:',
            '\t\t\tfeat 3',
            '\t\t\tfeat 4',
            '\t\tInteresting Trait: None',
            "\t\tEquipment:",
            "\t\t\tPrimary Hand: None",
            "\t\t\tOff Hand: None",
            "\t\t\tArmor: None",
            "\t\t\tTreasure: None",
            "\t\tCombat:",
            "\t\t\tAdjusted Dexterity Bonus: 5",
            "\t\t\tArmor Class: 9",
            "\t\t\t\tFlat-Footed: 14",
            "\t\t\t\tTouch: 36",
            "\t\t\tBase Attack:",
            "\t\t\t\tMelee: +23/+18/+13/+8/+3",
            "\t\t\t\tRanged: +24/+19/+14/+9/+4",
            "\t\t\tHit Points: 3458",
            "\t\t\tInitiative Bonus: 4569",
            "\t\t\tSaving Throws:",
            "\t\t\t\tFortitude: 58",
            "\t\t\t\tReflex: 80",
            "\t\t\t\tWill: 69",
            '',
            '\tFollowers:',
            '',
            '\t\tAlignment: alignment 3',
            '\t\tLevel 9269 class name 3',
            '\t\tbase race 3',
            '\t\t\tFemale',
            '\t\t\tLand Speed: 33',
            '\t\t\tSize: size 3',
            '\t\t\tAge: 21 (adult 3)',
            '\t\t\tHeight: 4.25 feet filtered',
            '\t\t\tWeight: 103 lbs.',
            '\t\tStats:',
            '\t\t\tStrength: 5 (-1)',
            '\t\t\tConstitution: 29 (16)',
            '\t\t\tDexterity: 9 (1)',
            '\t\t\tIntelligence: 93 (48)',
            '\t\t\tWisdom: 13 (3)',
            '\t\t\tCharisma: 12 (2)',
            '\t\tLanguages:',
            '\t\t\tEnglish 3',
            '\t\t\tGerman 3',
            '\t\tSkills:',
            '\t\t\tskill 1',
            '\t\t\t\tRanks: 7',
            '\t\t\t\tStat Bonus: 16',
            '\t\t\t\tOther Bonus: 0',
            '\t\t\t\tArmor Check Penalty: -9',
            '\t\t\t\tClass Skill',
            '\t\t\tskill 2',
            '\t\t\t\tRanks: 4.5',
            '\t\t\t\tStat Bonus: 1',
            '\t\t\t\tOther Bonus: 6',
            '\t\t\t\tArmor Check Penalty: 0',
            '\t\t\t\tCircumstantial Bonus',
            '\t\tFeats:',
            '\t\t\tfeat 4',
            '\t\t\tfeat 5',
            '\t\tInteresting Trait: None',
            "\t\tEquipment:",
            "\t\t\tPrimary Hand: None",
            "\t\t\tOff Hand: None",
            "\t\t\tArmor: None",
            "\t\t\tTreasure: None",
            "\t\tCombat:",
            "\t\t\tAdjusted Dexterity Bonus: 6",
            "\t\t\tArmor Class: 10",
            "\t\t\t\tFlat-Footed: 15",
            "\t\t\t\tTouch: 37",
            "\t\t\tBase Attack:",
            "\t\t\t\tMelee: +24/+19/+14/+9/+4",
            "\t\t\t\tRanged: +25/+20/+15/+10/+5",
            "\t\t\tHit Points: 3459",
            "\t\t\tInitiative Bonus: 4570",
            "\t\t\tSaving Throws:",
            "\t\t\t\tFortitude: 59",
            "\t\t\t\tReflex: 81",
            "\t\t\t\tWill: 70",
            '',
            '\t\tAlignment: alignment 4',
            '\t\tLevel 9270 class name 4',
            '\t\tbase race 4',
            '\t\t\tMale',
            '\t\t\tLand Speed: 34',
            '\t\t\tSize: size 4',
            '\t\t\tAge: 22 (adult 4)',
            '\t\t\tHeight: 4.333333333333333 feet filtered',
            '\t\t\tWeight: 104 lbs.',
            '\t\tStats:',
            '\t\t\tStrength: 6 (0)',
            '\t\t\tConstitution: 30 (17)',
            '\t\t\tDexterity: 10 (2)',
            '\t\t\tIntelligence: 94 (49)',
            '\t\t\tWisdom: 14 (4)',
            '\t\t\tCharisma: 13 (3)',
            '\t\tLanguages:',
            '\t\t\tEnglish 4',
            '\t\t\tGerman 4',
            '\t\tSkills:',
            '\t\t\tskill 1',
            '\t\t\t\tRanks: 8',
            '\t\t\t\tStat Bonus: 17',
            '\t\t\t\tOther Bonus: 0',
            '\t\t\t\tArmor Check Penalty: -10',
            '\t\t\t\tClass Skill',
            '\t\t\tskill 2',
            '\t\t\t\tRanks: 5.5',
            '\t\t\t\tStat Bonus: 2',
            '\t\t\t\tOther Bonus: 7',
            '\t\t\t\tArmor Check Penalty: 0',
            '\t\t\t\tCircumstantial Bonus',
            '\t\tFeats:',
            '\t\t\tfeat 5',
            '\t\t\tfeat 6',
            '\t\tInteresting Trait: None',
            "\t\tEquipment:",
            "\t\t\tPrimary Hand: None",
            "\t\t\tOff Hand: None",
            "\t\t\tArmor: None",
            "\t\t\tTreasure: None",
            "\t\tCombat:",
            "\t\t\tAdjusted Dexterity Bonus: 7",
            "\t\t\tArmor Class: 11",
            "\t\t\t\tFlat-Footed: 16",
            "\t\t\t\tTouch: 38",
            "\t\t\tBase Attack:",
            "\t\t\t\tMelee: +25/+20/+15/+10/+5",
            "\t\t\t\tRanged: +26/+21/+16/+11/+6",
            "\t\t\tHit Points: 3460",
            "\t\t\tInitiative Bonus: 4571",
            "\t\t\tSaving Throws:",
            "\t\t\t\tFortitude: 60",
            "\t\t\t\tReflex: 82",
            "\t\t\t\tWill: 71",
            '',
        ];

        for (var i = 0; i < lines.length; i++) {
            expect(lines[i]).toBe(expected[i]);
        }

        expect(lines.length).toBe(expected.length);
    });

    it('formats undead', function () {
        character.Race.Metarace = "undead";
        character.Ability.Stats.Constitution = undefined;
        character.Combat.SavingThrows.HasFortitudeSave = false;

        var formattedCharacter = characterFormatterService.formatCharacter(character, leadership, cohort, followers);
        var lines = formattedCharacter.split('\r\n');

        var expected = [
            'Alignment: alignment 1',
            'Level 9267 class name 1',
            'undead base race 1',
            '\tFemale',
            '\tLand Speed: 31',
            '\tSize: size 1',
            '\tAge: 19 (adult 1)',
            '\tHeight: 4.083333333333333 feet filtered',
            '\tWeight: 101 lbs.',
            'Stats:',
            '\tStrength: 3 (-3)',
            '\tDexterity: 7 (-1)',
            '\tIntelligence: 91 (46)',
            '\tWisdom: 11 (1)',
            '\tCharisma: 10 (0)',
            'Languages:',
            '\tEnglish 1',
            '\tGerman 1',
            'Skills:',
            '\tskill 1',
            '\t\tRanks: 5',
            '\t\tStat Bonus: 14',
            '\t\tOther Bonus: 0',
            '\t\tArmor Check Penalty: -7',
            '\t\tClass Skill',
            '\tskill 2',
            '\t\tRanks: 2.5',
            '\t\tStat Bonus: -1',
            '\t\tOther Bonus: 4',
            '\t\tArmor Check Penalty: 0',
            '\t\tCircumstantial Bonus',
            'Feats:',
            '\tfeat 2',
            '\tfeat 3',
            'Interesting Trait: None',
            "Equipment:",
            "\tPrimary Hand: None",
            "\tOff Hand: None",
            "\tArmor: None",
            "\tTreasure: None",
            "Combat:",
            "\tAdjusted Dexterity Bonus: 4",
            "\tArmor Class: 8",
            "\t\tFlat-Footed: 13",
            "\t\tTouch: 35",
            "\tBase Attack:",
            "\t\tMelee: +22/+17/+12/+7/+2",
            "\t\tRanged: +23/+18/+13/+8/+3",
            "\tHit Points: 3457",
            "\tInitiative Bonus: 4568",
            "\tSaving Throws:",
            "\t\tReflex: 79",
            "\t\tWill: 68",
            '',
        ];

        for (var i = 0; i < lines.length; i++) {
            expect(lines[i]).toBe(expected[i]);
        }

        expect(lines.length).toBe(expected.length);
    });

    it('formats undead as part of full leadership', function () {
        leadership = {
            Score: 9876,
            LeadershipModifiers: ['killed a man', 'with this thumb']
        };

        cohort = createCharacter();
        followers = [createCharacter(), createCharacter()];

        character.Race.Metarace = "undead";
        character.Ability.Stats.Constitution = undefined;
        character.Combat.SavingThrows.HasFortitudeSave = false;
        cohort.Race.Metarace = "undead";
        cohort.Ability.Stats.Constitution = undefined;
        cohort.Combat.SavingThrows.HasFortitudeSave = false;
        followers[0].Race.Metarace = "undead";
        followers[0].Ability.Stats.Constitution = undefined;
        followers[0].Combat.SavingThrows.HasFortitudeSave = false;
        followers[1].Race.Metarace = "undead";
        followers[1].Ability.Stats.Constitution = undefined;
        followers[1].Combat.SavingThrows.HasFortitudeSave = false;

        var formattedCharacter = characterFormatterService.formatCharacter(character, leadership, cohort, followers);
        var lines = formattedCharacter.split('\r\n');

        var expected = [
            'Alignment: alignment 1',
            'Level 9267 class name 1',
            'undead base race 1',
            '\tFemale',
            '\tLand Speed: 31',
            '\tSize: size 1',
            '\tAge: 19 (adult 1)',
            '\tHeight: 4.083333333333333 feet filtered',
            '\tWeight: 101 lbs.',
            'Stats:',
            '\tStrength: 3 (-3)',
            '\tDexterity: 7 (-1)',
            '\tIntelligence: 91 (46)',
            '\tWisdom: 11 (1)',
            '\tCharisma: 10 (0)',
            'Languages:',
            '\tEnglish 1',
            '\tGerman 1',
            'Skills:',
            '\tskill 1',
            '\t\tRanks: 5',
            '\t\tStat Bonus: 14',
            '\t\tOther Bonus: 0',
            '\t\tArmor Check Penalty: -7',
            '\t\tClass Skill',
            '\tskill 2',
            '\t\tRanks: 2.5',
            '\t\tStat Bonus: -1',
            '\t\tOther Bonus: 4',
            '\t\tArmor Check Penalty: 0',
            '\t\tCircumstantial Bonus',
            'Feats:',
            '\tfeat 2',
            '\tfeat 3',
            'Interesting Trait: None',
            "Equipment:",
            "\tPrimary Hand: None",
            "\tOff Hand: None",
            "\tArmor: None",
            "\tTreasure: None",
            "Combat:",
            "\tAdjusted Dexterity Bonus: 4",
            "\tArmor Class: 8",
            "\t\tFlat-Footed: 13",
            "\t\tTouch: 35",
            "\tBase Attack:",
            "\t\tMelee: +22/+17/+12/+7/+2",
            "\t\tRanged: +23/+18/+13/+8/+3",
            "\tHit Points: 3457",
            "\tInitiative Bonus: 4568",
            "\tSaving Throws:",
            "\t\tReflex: 79",
            "\t\tWill: 68",
            '',
            'Leadership:',
            '\tScore: 9876',
            '\tLeadership Modifiers:',
            '\t\tkilled a man',
            '\t\twith this thumb',
            '',
            'Cohort:',
            '\tAlignment: alignment 2',
            '\tLevel 9268 class name 2',
            '\tundead base race 2',
            '\t\tMale',
            '\t\tLand Speed: 32',
            '\t\tSize: size 2',
            '\t\tAge: 20 (adult 2)',
            '\t\tHeight: 4.166666666666667 feet filtered',
            '\t\tWeight: 102 lbs.',
            '\tStats:',
            '\t\tStrength: 4 (-2)',
            '\t\tDexterity: 8 (0)',
            '\t\tIntelligence: 92 (47)',
            '\t\tWisdom: 12 (2)',
            '\t\tCharisma: 11 (1)',
            '\tLanguages:',
            '\t\tEnglish 2',
            '\t\tGerman 2',
            '\tSkills:',
            '\t\tskill 1',
            '\t\t\tRanks: 6',
            '\t\t\tStat Bonus: 15',
            '\t\t\tOther Bonus: 0',
            '\t\t\tArmor Check Penalty: -8',
            '\t\t\tClass Skill',
            '\t\tskill 2',
            '\t\t\tRanks: 3.5',
            '\t\t\tStat Bonus: 0',
            '\t\t\tOther Bonus: 5',
            '\t\t\tArmor Check Penalty: 0',
            '\t\t\tCircumstantial Bonus',
            '\tFeats:',
            '\t\tfeat 3',
            '\t\tfeat 4',
            '\tInteresting Trait: None',
            "\tEquipment:",
            "\t\tPrimary Hand: None",
            "\t\tOff Hand: None",
            "\t\tArmor: None",
            "\t\tTreasure: None",
            "\tCombat:",
            "\t\tAdjusted Dexterity Bonus: 5",
            "\t\tArmor Class: 9",
            "\t\t\tFlat-Footed: 14",
            "\t\t\tTouch: 36",
            "\t\tBase Attack:",
            "\t\t\tMelee: +23/+18/+13/+8/+3",
            "\t\t\tRanged: +24/+19/+14/+9/+4",
            "\t\tHit Points: 3458",
            "\t\tInitiative Bonus: 4569",
            "\t\tSaving Throws:",
            "\t\t\tReflex: 80",
            "\t\t\tWill: 69",
            '',
            'Followers:',
            '',
            '\tAlignment: alignment 3',
            '\tLevel 9269 class name 3',
            '\tundead base race 3',
            '\t\tFemale',
            '\t\tLand Speed: 33',
            '\t\tSize: size 3',
            '\t\tAge: 21 (adult 3)',
            '\t\tHeight: 4.25 feet filtered',
            '\t\tWeight: 103 lbs.',
            '\tStats:',
            '\t\tStrength: 5 (-1)',
            '\t\tDexterity: 9 (1)',
            '\t\tIntelligence: 93 (48)',
            '\t\tWisdom: 13 (3)',
            '\t\tCharisma: 12 (2)',
            '\tLanguages:',
            '\t\tEnglish 3',
            '\t\tGerman 3',
            '\tSkills:',
            '\t\tskill 1',
            '\t\t\tRanks: 7',
            '\t\t\tStat Bonus: 16',
            '\t\t\tOther Bonus: 0',
            '\t\t\tArmor Check Penalty: -9',
            '\t\t\tClass Skill',
            '\t\tskill 2',
            '\t\t\tRanks: 4.5',
            '\t\t\tStat Bonus: 1',
            '\t\t\tOther Bonus: 6',
            '\t\t\tArmor Check Penalty: 0',
            '\t\t\tCircumstantial Bonus',
            '\tFeats:',
            '\t\tfeat 4',
            '\t\tfeat 5',
            '\tInteresting Trait: None',
            "\tEquipment:",
            "\t\tPrimary Hand: None",
            "\t\tOff Hand: None",
            "\t\tArmor: None",
            "\t\tTreasure: None",
            "\tCombat:",
            "\t\tAdjusted Dexterity Bonus: 6",
            "\t\tArmor Class: 10",
            "\t\t\tFlat-Footed: 15",
            "\t\t\tTouch: 37",
            "\t\tBase Attack:",
            "\t\t\tMelee: +24/+19/+14/+9/+4",
            "\t\t\tRanged: +25/+20/+15/+10/+5",
            "\t\tHit Points: 3459",
            "\t\tInitiative Bonus: 4570",
            "\t\tSaving Throws:",
            "\t\t\tReflex: 81",
            "\t\t\tWill: 70",
            '',
            '\tAlignment: alignment 4',
            '\tLevel 9270 class name 4',
            '\tundead base race 4',
            '\t\tMale',
            '\t\tLand Speed: 34',
            '\t\tSize: size 4',
            '\t\tAge: 22 (adult 4)',
            '\t\tHeight: 4.333333333333333 feet filtered',
            '\t\tWeight: 104 lbs.',
            '\tStats:',
            '\t\tStrength: 6 (0)',
            '\t\tDexterity: 10 (2)',
            '\t\tIntelligence: 94 (49)',
            '\t\tWisdom: 14 (4)',
            '\t\tCharisma: 13 (3)',
            '\tLanguages:',
            '\t\tEnglish 4',
            '\t\tGerman 4',
            '\tSkills:',
            '\t\tskill 1',
            '\t\t\tRanks: 8',
            '\t\t\tStat Bonus: 17',
            '\t\t\tOther Bonus: 0',
            '\t\t\tArmor Check Penalty: -10',
            '\t\t\tClass Skill',
            '\t\tskill 2',
            '\t\t\tRanks: 5.5',
            '\t\t\tStat Bonus: 2',
            '\t\t\tOther Bonus: 7',
            '\t\t\tArmor Check Penalty: 0',
            '\t\t\tCircumstantial Bonus',
            '\tFeats:',
            '\t\tfeat 5',
            '\t\tfeat 6',
            '\tInteresting Trait: None',
            "\tEquipment:",
            "\t\tPrimary Hand: None",
            "\t\tOff Hand: None",
            "\t\tArmor: None",
            "\t\tTreasure: None",
            "\tCombat:",
            "\t\tAdjusted Dexterity Bonus: 7",
            "\t\tArmor Class: 11",
            "\t\t\tFlat-Footed: 16",
            "\t\t\tTouch: 38",
            "\t\tBase Attack:",
            "\t\t\tMelee: +25/+20/+15/+10/+5",
            "\t\t\tRanged: +26/+21/+16/+11/+6",
            "\t\tHit Points: 3460",
            "\t\tInitiative Bonus: 4571",
            "\t\tSaving Throws:",
            "\t\t\tReflex: 82",
            "\t\t\tWill: 71",
            '',
        ];

        for (var i = 0; i < lines.length; i++) {
            expect(lines[i]).toBe(expected[i]);
        }

        expect(lines.length).toBe(expected.length);
    });
});