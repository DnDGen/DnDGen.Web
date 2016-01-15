'use strict'

describe('Character Formatter Service', function () {
    var characterFormatterService;
    var character;
    var leadership;
    var cohort;
    var followers;
    var characterCount;
    var treasureFormatterServiceMock;

    beforeEach(module('app.shared', function ($provide) {
        treasureFormatterServiceMock = {
            formatTreasure: function (treasure, prefix) {
                if (!prefix)
                    prefix = '';

                var formattedTreasure = prefix + 'formatted treasure\n';

                if (treasure.Coin.Quantity > 0)
                    formattedTreasure += prefix + '\t' + treasure.Coin.Currency + '\n';

                if (treasure.Goods.length > 0)
                    formattedTreasure += prefix + '\tGood: ' + treasure.Goods[0].Description + '\n';

                if (treasure.Items.length > 0)
                    formattedTreasure += prefix + '\tItem: ' + formatItem(treasure.Items[0]);

                return formattedTreasure;
            },
            formatItem: formatItem
        }

        function formatItem(item, prefix) {
            if (!prefix)
                prefix = '';

            var formattedItem = prefix + item.Name + '\n';
            formattedItem += prefix + '\tformatted\n';

            return formattedItem;
        }

        $provide.value('treasureFormatterService', treasureFormatterServiceMock);
    }));

    beforeEach(function () {
        characterCount = 0;

        character = createCharacter();
        followers = [];
    });

    beforeEach(inject(function (_characterFormatterService_) {
        characterFormatterService = _characterFormatterService_;
    }));

    function createCharacter() {
        characterCount++;

        return {
            Alignment: { Full: 'alignment ' + characterCount },
            Class: {
                ClassName: 'class name ' + characterCount,
                Level: 9266 + characterCount,
                SpecialistFields: [],
                ProhibitedFields: []
            },
            Race: {
                BaseRace: 'base race ' + characterCount,
                Metarace: '',
                Male: false,
                MetaraceSpecies: '',
                LandSpeed: 30 + characterCount,
                Size: 'size ' + characterCount,
                HasWings: false,
                AerialSpeed: 0
            },
            Ability: {
                Stats: {
                    Charisma: { Value: 9 + characterCount, Bonus: -1 + characterCount },
                    Constitution: { Value: 26 + characterCount, Bonus: 13 + characterCount },
                    Dexterity: { Value: 6 + characterCount, Bonus: -2 + characterCount },
                    Intelligence: { Value: 90 + characterCount, Bonus: 45 + characterCount },
                    Strength: { Value: 2 + characterCount, Bonus: -4 + characterCount },
                    Wisdom: { Value: 10 + characterCount, Bonus: 0 + characterCount }
                },
                Languages: ['English ' + characterCount, 'German ' + characterCount],
                Skills: {
                    'skill 1': {
                        EffectiveRanks: 4 + characterCount,
                        BaseStat: { Bonus: 13 + characterCount },
                        Bonus: 0,
                        ArmorCheckPenalty: -6 - characterCount,
                        ClassSkill: true,
                        CircumstantialBonus: false
                    },
                    'skill 2': {
                        EffectiveRanks: 1.5 + characterCount,
                        BaseStat: { Bonus: -2 + characterCount },
                        Bonus: 3 + characterCount,
                        ArmorCheckPenalty: 0,
                        ClassSkill: false,
                        CircumstantialBonus: true
                    },
                },
                Feats: [
                    { Name: 'feat ' + (1 + characterCount), Foci: [], Power: 0, Frequency: { TimePeriod: '', Quantity: 0 } },
                    { Name: 'feat ' + (2 + characterCount), Foci: [], Power: 0, Frequency: { TimePeriod: '', Quantity: 0 } }
                ]
            },
            InterestingTrait: '',
            Magic: {
                SpellsPerDay: [],
                ArcaneSpellFailure: 0,
                Animal: ''
            },
            Equipment: {
                PrimaryHand: null,
                OffHand: null,
                Armor: null,
                Treasure: { Coin: { Currency: '', Quantity: 0 }, Goods: [], Items: [] }
            },
            Combat: {
                AdjustedDexterityBonus: 3 + characterCount,
                ArmorClass: { Full: 7 + characterCount, FlatFooted: 12 + characterCount, Touch: 34 + characterCount, CircumstantialBonus: false },
                BaseAttack: {
                    AllBonuses: [21 + characterCount, 16 + characterCount, 11 + characterCount, 6 + characterCount, 1 + characterCount],
                    CircumstantialBonus: false
                },
                HitPoints: 3456 + characterCount,
                InitiativeBonus: 4567 + characterCount,
                SavingThrows: { Fortitude: 56 + characterCount, Reflex: 78 + characterCount, Will: 67 + characterCount, CircumstantialBonus: false }
            }
        };
    }

    function createItem(itemName) {
        return {
            Name: itemName,
            Attributes: ['item attribute']
        };
    }

    it('formats character basics', function () {
        var formattedCharacter = characterFormatterService.formatCharacter(character, leadership, cohort, followers);
        var lines = formattedCharacter.split('\n');

        expect(lines[0]).toBe('Alignment: alignment 1');
        expect(lines[1]).toBe('Level 9267 class name 1');
        expect(lines[2]).toBe('base race 1');
        expect(lines[3]).toBe('\tFemale');
        expect(lines[4]).toBe('\tLand Speed: 31');
        expect(lines[5]).toBe('\tSize: size 1');
        expect(lines[6]).toBe('Stats:');
        expect(lines[7]).toBe('\tStrength: 3 (-3)');
        expect(lines[8]).toBe('\tConstitution: 27 (14)');
        expect(lines[9]).toBe('\tDexterity: 7 (-1)');
        expect(lines[10]).toBe('\tIntelligence: 91 (46)');
        expect(lines[11]).toBe('\tWisdom: 11 (1)');
        expect(lines[12]).toBe('\tCharisma: 10 (0)');
        expect(lines[13]).toBe('Languages:');
        expect(lines[14]).toBe('\tEnglish 1');
        expect(lines[15]).toBe('\tGerman 1');
        expect(lines[16]).toBe('Skills:');
        expect(lines[17]).toBe('\tskill 1');
        expect(lines[18]).toBe('\t\tRanks: 5');
        expect(lines[19]).toBe('\t\tStat Bonus: 14');
        expect(lines[20]).toBe('\t\tOther Bonus: 0');
        expect(lines[21]).toBe('\t\tArmor Check Penalty: -7');
        expect(lines[22]).toBe('\t\tClass Skill');
        expect(lines[23]).toBe('\tskill 2');
        expect(lines[24]).toBe('\t\tRanks: 2.5');
        expect(lines[25]).toBe('\t\tStat Bonus: -1');
        expect(lines[26]).toBe('\t\tOther Bonus: 4');
        expect(lines[27]).toBe('\t\tArmor Check Penalty: 0');
        expect(lines[28]).toBe('\t\tCircumstantial Bonus');
        expect(lines[29]).toBe('Feats:');
        expect(lines[30]).toBe('\tfeat 2');
        expect(lines[31]).toBe('\tfeat 3');
        expect(lines[32]).toBe('Interesting Trait: None');
        expect(lines[33]).toBe("Equipment:");
        expect(lines[34]).toBe("\tPrimary Hand: None");
        expect(lines[35]).toBe("\tOff Hand: None");
        expect(lines[36]).toBe("\tArmor: None");
        expect(lines[37]).toBe("\tTreasure: None");
        expect(lines[38]).toBe("Combat:");
        expect(lines[39]).toBe("\tAdjusted Dexterity Bonus: 4");
        expect(lines[40]).toBe("\tArmor Class: 8");
        expect(lines[41]).toBe("\t\tFlat-Footed: 13");
        expect(lines[42]).toBe("\t\tTouch: 35");
        expect(lines[43]).toBe("\tBase Attack: +22/+17/+12/+7/+2");
        expect(lines[44]).toBe("\tHit Points: 3457");
        expect(lines[45]).toBe("\tInitiative Bonus: 4568");
        expect(lines[46]).toBe("\tSaving Throws:");
        expect(lines[47]).toBe("\t\tFortitude: 57");
        expect(lines[48]).toBe("\t\tReflex: 79");
        expect(lines[49]).toBe("\t\tWill: 68");
        expect(lines[50]).toBe('');
        expect(lines.length).toBe(51);
    });

    it('formats class specialization', function () {
        character.Class.SpecialistFields = ["specialist field 1", "specialist field 2"];

        var formattedCharacter = characterFormatterService.formatCharacter(character, leadership, cohort, followers);
        var lines = formattedCharacter.split('\n');

        expect(lines[0]).toBe('Alignment: alignment 1');
        expect(lines[1]).toBe('Level 9267 class name 1');
        expect(lines[2]).toBe("\tSpecialist:");
        expect(lines[3]).toBe("\t\tspecialist field 1");
        expect(lines[4]).toBe("\t\tspecialist field 2");
        expect(lines[5]).toBe('base race 1');
        expect(lines[6]).toBe('\tFemale');
        expect(lines[7]).toBe('\tLand Speed: 31');
        expect(lines[8]).toBe('\tSize: size 1');
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
        expect(lines[46]).toBe("\tBase Attack: +22/+17/+12/+7/+2");
        expect(lines[47]).toBe("\tHit Points: 3457");
        expect(lines[48]).toBe("\tInitiative Bonus: 4568");
        expect(lines[49]).toBe("\tSaving Throws:");
        expect(lines[50]).toBe("\t\tFortitude: 57");
        expect(lines[51]).toBe("\t\tReflex: 79");
        expect(lines[52]).toBe("\t\tWill: 68");
        expect(lines[53]).toBe('');
        expect(lines.length).toBe(54);
    });

    it('formats prohibited fields', function () {
        character.Class.SpecialistFields = ["specialist field 1", "specialist field 2"];
        character.Class.ProhibitedFields = ["prohibited field 1", "prohibited field 2"];

        var formattedCharacter = characterFormatterService.formatCharacter(character, leadership, cohort, followers);
        var lines = formattedCharacter.split('\n');

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
        expect(lines[49]).toBe("\tBase Attack: +22/+17/+12/+7/+2");
        expect(lines[50]).toBe("\tHit Points: 3457");
        expect(lines[51]).toBe("\tInitiative Bonus: 4568");
        expect(lines[52]).toBe("\tSaving Throws:");
        expect(lines[53]).toBe("\t\tFortitude: 57");
        expect(lines[54]).toBe("\t\tReflex: 79");
        expect(lines[55]).toBe("\t\tWill: 68");
        expect(lines[56]).toBe('');
        expect(lines.length).toBe(57);
    });

    it('formats metarace', function () {
        character.Race.Metarace = 'metarace';

        var formattedCharacter = characterFormatterService.formatCharacter(character, leadership, cohort, followers);
        var lines = formattedCharacter.split('\n');

        expect(lines[0]).toBe('Alignment: alignment 1');
        expect(lines[1]).toBe('Level 9267 class name 1');
        expect(lines[2]).toBe('metarace base race 1');
        expect(lines[3]).toBe('\tFemale');
        expect(lines[4]).toBe('\tLand Speed: 31');
        expect(lines[5]).toBe('\tSize: size 1');
        expect(lines[6]).toBe('Stats:');
        expect(lines[7]).toBe('\tStrength: 3 (-3)');
        expect(lines[8]).toBe('\tConstitution: 27 (14)');
        expect(lines[9]).toBe('\tDexterity: 7 (-1)');
        expect(lines[10]).toBe('\tIntelligence: 91 (46)');
        expect(lines[11]).toBe('\tWisdom: 11 (1)');
        expect(lines[12]).toBe('\tCharisma: 10 (0)');
        expect(lines[13]).toBe('Languages:');
        expect(lines[14]).toBe('\tEnglish 1');
        expect(lines[15]).toBe('\tGerman 1');
        expect(lines[16]).toBe('Skills:');
        expect(lines[17]).toBe('\tskill 1');
        expect(lines[18]).toBe('\t\tRanks: 5');
        expect(lines[19]).toBe('\t\tStat Bonus: 14');
        expect(lines[20]).toBe('\t\tOther Bonus: 0');
        expect(lines[21]).toBe('\t\tArmor Check Penalty: -7');
        expect(lines[22]).toBe('\t\tClass Skill');
        expect(lines[23]).toBe('\tskill 2');
        expect(lines[24]).toBe('\t\tRanks: 2.5');
        expect(lines[25]).toBe('\t\tStat Bonus: -1');
        expect(lines[26]).toBe('\t\tOther Bonus: 4');
        expect(lines[27]).toBe('\t\tArmor Check Penalty: 0');
        expect(lines[28]).toBe('\t\tCircumstantial Bonus');
        expect(lines[29]).toBe('Feats:');
        expect(lines[30]).toBe('\tfeat 2');
        expect(lines[31]).toBe('\tfeat 3');
        expect(lines[32]).toBe('Interesting Trait: None');
        expect(lines[33]).toBe("Equipment:");
        expect(lines[34]).toBe("\tPrimary Hand: None");
        expect(lines[35]).toBe("\tOff Hand: None");
        expect(lines[36]).toBe("\tArmor: None");
        expect(lines[37]).toBe("\tTreasure: None");
        expect(lines[38]).toBe("Combat:");
        expect(lines[39]).toBe("\tAdjusted Dexterity Bonus: 4");
        expect(lines[40]).toBe("\tArmor Class: 8");
        expect(lines[41]).toBe("\t\tFlat-Footed: 13");
        expect(lines[42]).toBe("\t\tTouch: 35");
        expect(lines[43]).toBe("\tBase Attack: +22/+17/+12/+7/+2");
        expect(lines[44]).toBe("\tHit Points: 3457");
        expect(lines[45]).toBe("\tInitiative Bonus: 4568");
        expect(lines[46]).toBe("\tSaving Throws:");
        expect(lines[47]).toBe("\t\tFortitude: 57");
        expect(lines[48]).toBe("\t\tReflex: 79");
        expect(lines[49]).toBe("\t\tWill: 68");
        expect(lines[50]).toBe('');
        expect(lines.length).toBe(51);
    });

    it('formats male', function () {
        character.Race.Male = true;

        var formattedCharacter = characterFormatterService.formatCharacter(character, leadership, cohort, followers);
        var lines = formattedCharacter.split('\n');

        expect(lines[0]).toBe('Alignment: alignment 1');
        expect(lines[1]).toBe('Level 9267 class name 1');
        expect(lines[2]).toBe('base race 1');
        expect(lines[3]).toBe('\tMale');
        expect(lines[4]).toBe('\tLand Speed: 31');
        expect(lines[5]).toBe('\tSize: size 1');
        expect(lines[6]).toBe('Stats:');
        expect(lines[7]).toBe('\tStrength: 3 (-3)');
        expect(lines[8]).toBe('\tConstitution: 27 (14)');
        expect(lines[9]).toBe('\tDexterity: 7 (-1)');
        expect(lines[10]).toBe('\tIntelligence: 91 (46)');
        expect(lines[11]).toBe('\tWisdom: 11 (1)');
        expect(lines[12]).toBe('\tCharisma: 10 (0)');
        expect(lines[13]).toBe('Languages:');
        expect(lines[14]).toBe('\tEnglish 1');
        expect(lines[15]).toBe('\tGerman 1');
        expect(lines[16]).toBe('Skills:');
        expect(lines[17]).toBe('\tskill 1');
        expect(lines[18]).toBe('\t\tRanks: 5');
        expect(lines[19]).toBe('\t\tStat Bonus: 14');
        expect(lines[20]).toBe('\t\tOther Bonus: 0');
        expect(lines[21]).toBe('\t\tArmor Check Penalty: -7');
        expect(lines[22]).toBe('\t\tClass Skill');
        expect(lines[23]).toBe('\tskill 2');
        expect(lines[24]).toBe('\t\tRanks: 2.5');
        expect(lines[25]).toBe('\t\tStat Bonus: -1');
        expect(lines[26]).toBe('\t\tOther Bonus: 4');
        expect(lines[27]).toBe('\t\tArmor Check Penalty: 0');
        expect(lines[28]).toBe('\t\tCircumstantial Bonus');
        expect(lines[29]).toBe('Feats:');
        expect(lines[30]).toBe('\tfeat 2');
        expect(lines[31]).toBe('\tfeat 3');
        expect(lines[32]).toBe('Interesting Trait: None');
        expect(lines[33]).toBe("Equipment:");
        expect(lines[34]).toBe("\tPrimary Hand: None");
        expect(lines[35]).toBe("\tOff Hand: None");
        expect(lines[36]).toBe("\tArmor: None");
        expect(lines[37]).toBe("\tTreasure: None");
        expect(lines[38]).toBe("Combat:");
        expect(lines[39]).toBe("\tAdjusted Dexterity Bonus: 4");
        expect(lines[40]).toBe("\tArmor Class: 8");
        expect(lines[41]).toBe("\t\tFlat-Footed: 13");
        expect(lines[42]).toBe("\t\tTouch: 35");
        expect(lines[43]).toBe("\tBase Attack: +22/+17/+12/+7/+2");
        expect(lines[44]).toBe("\tHit Points: 3457");
        expect(lines[45]).toBe("\tInitiative Bonus: 4568");
        expect(lines[46]).toBe("\tSaving Throws:");
        expect(lines[47]).toBe("\t\tFortitude: 57");
        expect(lines[48]).toBe("\t\tReflex: 79");
        expect(lines[49]).toBe("\t\tWill: 68");
        expect(lines[50]).toBe('');
        expect(lines.length).toBe(51);
    });

    it('formats metarace species', function () {
        character.Race.Metarace = 'metarace';
        character.Race.MetaraceSpecies = 'metarace species';

        var formattedCharacter = characterFormatterService.formatCharacter(character, leadership, cohort, followers);
        var lines = formattedCharacter.split('\n');

        expect(lines[0]).toBe('Alignment: alignment 1');
        expect(lines[1]).toBe('Level 9267 class name 1');
        expect(lines[2]).toBe('metarace base race 1');
        expect(lines[3]).toBe('\tFemale');
        expect(lines[4]).toBe('\tMetarace Species: metarace species');
        expect(lines[5]).toBe('\tLand Speed: 31');
        expect(lines[6]).toBe('\tSize: size 1');
        expect(lines[7]).toBe('Stats:');
        expect(lines[8]).toBe('\tStrength: 3 (-3)');
        expect(lines[9]).toBe('\tConstitution: 27 (14)');
        expect(lines[10]).toBe('\tDexterity: 7 (-1)');
        expect(lines[11]).toBe('\tIntelligence: 91 (46)');
        expect(lines[12]).toBe('\tWisdom: 11 (1)');
        expect(lines[13]).toBe('\tCharisma: 10 (0)');
        expect(lines[14]).toBe('Languages:');
        expect(lines[15]).toBe('\tEnglish 1');
        expect(lines[16]).toBe('\tGerman 1');
        expect(lines[17]).toBe('Skills:');
        expect(lines[18]).toBe('\tskill 1');
        expect(lines[19]).toBe('\t\tRanks: 5');
        expect(lines[20]).toBe('\t\tStat Bonus: 14');
        expect(lines[21]).toBe('\t\tOther Bonus: 0');
        expect(lines[22]).toBe('\t\tArmor Check Penalty: -7');
        expect(lines[23]).toBe('\t\tClass Skill');
        expect(lines[24]).toBe('\tskill 2');
        expect(lines[25]).toBe('\t\tRanks: 2.5');
        expect(lines[26]).toBe('\t\tStat Bonus: -1');
        expect(lines[27]).toBe('\t\tOther Bonus: 4');
        expect(lines[28]).toBe('\t\tArmor Check Penalty: 0');
        expect(lines[29]).toBe('\t\tCircumstantial Bonus');
        expect(lines[30]).toBe('Feats:');
        expect(lines[31]).toBe('\tfeat 2');
        expect(lines[32]).toBe('\tfeat 3');
        expect(lines[33]).toBe('Interesting Trait: None');
        expect(lines[34]).toBe("Equipment:");
        expect(lines[35]).toBe("\tPrimary Hand: None");
        expect(lines[36]).toBe("\tOff Hand: None");
        expect(lines[37]).toBe("\tArmor: None");
        expect(lines[38]).toBe("\tTreasure: None");
        expect(lines[39]).toBe("Combat:");
        expect(lines[40]).toBe("\tAdjusted Dexterity Bonus: 4");
        expect(lines[41]).toBe("\tArmor Class: 8");
        expect(lines[42]).toBe("\t\tFlat-Footed: 13");
        expect(lines[43]).toBe("\t\tTouch: 35");
        expect(lines[44]).toBe("\tBase Attack: +22/+17/+12/+7/+2");
        expect(lines[45]).toBe("\tHit Points: 3457");
        expect(lines[46]).toBe("\tInitiative Bonus: 4568");
        expect(lines[47]).toBe("\tSaving Throws:");
        expect(lines[48]).toBe("\t\tFortitude: 57");
        expect(lines[49]).toBe("\t\tReflex: 79");
        expect(lines[50]).toBe("\t\tWill: 68");
        expect(lines[51]).toBe('');
        expect(lines.length).toBe(52);
    });

    it('formats wings', function () {
        character.Race.Metarace = 'metarace';
        character.Race.HasWings = true;

        var formattedCharacter = characterFormatterService.formatCharacter(character, leadership, cohort, followers);
        var lines = formattedCharacter.split('\n');

        expect(lines[0]).toBe('Alignment: alignment 1');
        expect(lines[1]).toBe('Level 9267 class name 1');
        expect(lines[2]).toBe('metarace base race 1');
        expect(lines[3]).toBe('\tFemale');
        expect(lines[4]).toBe('\tLand Speed: 31');
        expect(lines[5]).toBe('\tSize: size 1');
        expect(lines[6]).toBe('\tHas Wings');
        expect(lines[7]).toBe('Stats:');
        expect(lines[8]).toBe('\tStrength: 3 (-3)');
        expect(lines[9]).toBe('\tConstitution: 27 (14)');
        expect(lines[10]).toBe('\tDexterity: 7 (-1)');
        expect(lines[11]).toBe('\tIntelligence: 91 (46)');
        expect(lines[12]).toBe('\tWisdom: 11 (1)');
        expect(lines[13]).toBe('\tCharisma: 10 (0)');
        expect(lines[14]).toBe('Languages:');
        expect(lines[15]).toBe('\tEnglish 1');
        expect(lines[16]).toBe('\tGerman 1');
        expect(lines[17]).toBe('Skills:');
        expect(lines[18]).toBe('\tskill 1');
        expect(lines[19]).toBe('\t\tRanks: 5');
        expect(lines[20]).toBe('\t\tStat Bonus: 14');
        expect(lines[21]).toBe('\t\tOther Bonus: 0');
        expect(lines[22]).toBe('\t\tArmor Check Penalty: -7');
        expect(lines[23]).toBe('\t\tClass Skill');
        expect(lines[24]).toBe('\tskill 2');
        expect(lines[25]).toBe('\t\tRanks: 2.5');
        expect(lines[26]).toBe('\t\tStat Bonus: -1');
        expect(lines[27]).toBe('\t\tOther Bonus: 4');
        expect(lines[28]).toBe('\t\tArmor Check Penalty: 0');
        expect(lines[29]).toBe('\t\tCircumstantial Bonus');
        expect(lines[30]).toBe('Feats:');
        expect(lines[31]).toBe('\tfeat 2');
        expect(lines[32]).toBe('\tfeat 3');
        expect(lines[33]).toBe('Interesting Trait: None');
        expect(lines[34]).toBe("Equipment:");
        expect(lines[35]).toBe("\tPrimary Hand: None");
        expect(lines[36]).toBe("\tOff Hand: None");
        expect(lines[37]).toBe("\tArmor: None");
        expect(lines[38]).toBe("\tTreasure: None");
        expect(lines[39]).toBe("Combat:");
        expect(lines[40]).toBe("\tAdjusted Dexterity Bonus: 4");
        expect(lines[41]).toBe("\tArmor Class: 8");
        expect(lines[42]).toBe("\t\tFlat-Footed: 13");
        expect(lines[43]).toBe("\t\tTouch: 35");
        expect(lines[44]).toBe("\tBase Attack: +22/+17/+12/+7/+2");
        expect(lines[45]).toBe("\tHit Points: 3457");
        expect(lines[46]).toBe("\tInitiative Bonus: 4568");
        expect(lines[47]).toBe("\tSaving Throws:");
        expect(lines[48]).toBe("\t\tFortitude: 57");
        expect(lines[49]).toBe("\t\tReflex: 79");
        expect(lines[50]).toBe("\t\tWill: 68");
        expect(lines[51]).toBe('');
        expect(lines.length).toBe(52);
    });

    it('formats aerial speed', function () {
        character.Race.Metarace = 'metarace';
        character.Race.AerialSpeed = 9876;

        var formattedCharacter = characterFormatterService.formatCharacter(character, leadership, cohort, followers);
        var lines = formattedCharacter.split('\n');

        expect(lines[0]).toBe('Alignment: alignment 1');
        expect(lines[1]).toBe('Level 9267 class name 1');
        expect(lines[2]).toBe('metarace base race 1');
        expect(lines[3]).toBe('\tFemale');
        expect(lines[4]).toBe('\tLand Speed: 31');
        expect(lines[5]).toBe('\tSize: size 1');
        expect(lines[6]).toBe('\tAerial Speed: 9876');
        expect(lines[7]).toBe('Stats:');
        expect(lines[8]).toBe('\tStrength: 3 (-3)');
        expect(lines[9]).toBe('\tConstitution: 27 (14)');
        expect(lines[10]).toBe('\tDexterity: 7 (-1)');
        expect(lines[11]).toBe('\tIntelligence: 91 (46)');
        expect(lines[12]).toBe('\tWisdom: 11 (1)');
        expect(lines[13]).toBe('\tCharisma: 10 (0)');
        expect(lines[14]).toBe('Languages:');
        expect(lines[15]).toBe('\tEnglish 1');
        expect(lines[16]).toBe('\tGerman 1');
        expect(lines[17]).toBe('Skills:');
        expect(lines[18]).toBe('\tskill 1');
        expect(lines[19]).toBe('\t\tRanks: 5');
        expect(lines[20]).toBe('\t\tStat Bonus: 14');
        expect(lines[21]).toBe('\t\tOther Bonus: 0');
        expect(lines[22]).toBe('\t\tArmor Check Penalty: -7');
        expect(lines[23]).toBe('\t\tClass Skill');
        expect(lines[24]).toBe('\tskill 2');
        expect(lines[25]).toBe('\t\tRanks: 2.5');
        expect(lines[26]).toBe('\t\tStat Bonus: -1');
        expect(lines[27]).toBe('\t\tOther Bonus: 4');
        expect(lines[28]).toBe('\t\tArmor Check Penalty: 0');
        expect(lines[29]).toBe('\t\tCircumstantial Bonus');
        expect(lines[30]).toBe('Feats:');
        expect(lines[31]).toBe('\tfeat 2');
        expect(lines[32]).toBe('\tfeat 3');
        expect(lines[33]).toBe('Interesting Trait: None');
        expect(lines[34]).toBe("Equipment:");
        expect(lines[35]).toBe("\tPrimary Hand: None");
        expect(lines[36]).toBe("\tOff Hand: None");
        expect(lines[37]).toBe("\tArmor: None");
        expect(lines[38]).toBe("\tTreasure: None");
        expect(lines[39]).toBe("Combat:");
        expect(lines[40]).toBe("\tAdjusted Dexterity Bonus: 4");
        expect(lines[41]).toBe("\tArmor Class: 8");
        expect(lines[42]).toBe("\t\tFlat-Footed: 13");
        expect(lines[43]).toBe("\t\tTouch: 35");
        expect(lines[44]).toBe("\tBase Attack: +22/+17/+12/+7/+2");
        expect(lines[45]).toBe("\tHit Points: 3457");
        expect(lines[46]).toBe("\tInitiative Bonus: 4568");
        expect(lines[47]).toBe("\tSaving Throws:");
        expect(lines[48]).toBe("\t\tFortitude: 57");
        expect(lines[49]).toBe("\t\tReflex: 79");
        expect(lines[50]).toBe("\t\tWill: 68");
        expect(lines[51]).toBe('');
        expect(lines.length).toBe(52);
    });

    it('formats feat foci', function () {
        character.Ability.Feats[0].Foci = ['focus 1', 'focus 2'];

        var formattedCharacter = characterFormatterService.formatCharacter(character, leadership, cohort, followers);
        var lines = formattedCharacter.split('\n');

        expect(lines[0]).toBe('Alignment: alignment 1');
        expect(lines[1]).toBe('Level 9267 class name 1');
        expect(lines[2]).toBe('base race 1');
        expect(lines[3]).toBe('\tFemale');
        expect(lines[4]).toBe('\tLand Speed: 31');
        expect(lines[5]).toBe('\tSize: size 1');
        expect(lines[6]).toBe('Stats:');
        expect(lines[7]).toBe('\tStrength: 3 (-3)');
        expect(lines[8]).toBe('\tConstitution: 27 (14)');
        expect(lines[9]).toBe('\tDexterity: 7 (-1)');
        expect(lines[10]).toBe('\tIntelligence: 91 (46)');
        expect(lines[11]).toBe('\tWisdom: 11 (1)');
        expect(lines[12]).toBe('\tCharisma: 10 (0)');
        expect(lines[13]).toBe('Languages:');
        expect(lines[14]).toBe('\tEnglish 1');
        expect(lines[15]).toBe('\tGerman 1');
        expect(lines[16]).toBe('Skills:');
        expect(lines[17]).toBe('\tskill 1');
        expect(lines[18]).toBe('\t\tRanks: 5');
        expect(lines[19]).toBe('\t\tStat Bonus: 14');
        expect(lines[20]).toBe('\t\tOther Bonus: 0');
        expect(lines[21]).toBe('\t\tArmor Check Penalty: -7');
        expect(lines[22]).toBe('\t\tClass Skill');
        expect(lines[23]).toBe('\tskill 2');
        expect(lines[24]).toBe('\t\tRanks: 2.5');
        expect(lines[25]).toBe('\t\tStat Bonus: -1');
        expect(lines[26]).toBe('\t\tOther Bonus: 4');
        expect(lines[27]).toBe('\t\tArmor Check Penalty: 0');
        expect(lines[28]).toBe('\t\tCircumstantial Bonus');
        expect(lines[29]).toBe('Feats:');
        expect(lines[30]).toBe('\tfeat 2');
        expect(lines[31]).toBe('\t\tFoci:');
        expect(lines[32]).toBe('\t\t\tfocus 1');
        expect(lines[33]).toBe('\t\t\tfocus 2');
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
        expect(lines[46]).toBe("\tBase Attack: +22/+17/+12/+7/+2");
        expect(lines[47]).toBe("\tHit Points: 3457");
        expect(lines[48]).toBe("\tInitiative Bonus: 4568");
        expect(lines[49]).toBe("\tSaving Throws:");
        expect(lines[50]).toBe("\t\tFortitude: 57");
        expect(lines[51]).toBe("\t\tReflex: 79");
        expect(lines[52]).toBe("\t\tWill: 68");
        expect(lines[53]).toBe('');
        expect(lines.length).toBe(54);
    });

    it('formats feat power', function () {
        character.Ability.Feats[0].Power = 9876;

        var formattedCharacter = characterFormatterService.formatCharacter(character, leadership, cohort, followers);
        var lines = formattedCharacter.split('\n');

        expect(lines[0]).toBe('Alignment: alignment 1');
        expect(lines[1]).toBe('Level 9267 class name 1');
        expect(lines[2]).toBe('base race 1');
        expect(lines[3]).toBe('\tFemale');
        expect(lines[4]).toBe('\tLand Speed: 31');
        expect(lines[5]).toBe('\tSize: size 1');
        expect(lines[6]).toBe('Stats:');
        expect(lines[7]).toBe('\tStrength: 3 (-3)');
        expect(lines[8]).toBe('\tConstitution: 27 (14)');
        expect(lines[9]).toBe('\tDexterity: 7 (-1)');
        expect(lines[10]).toBe('\tIntelligence: 91 (46)');
        expect(lines[11]).toBe('\tWisdom: 11 (1)');
        expect(lines[12]).toBe('\tCharisma: 10 (0)');
        expect(lines[13]).toBe('Languages:');
        expect(lines[14]).toBe('\tEnglish 1');
        expect(lines[15]).toBe('\tGerman 1');
        expect(lines[16]).toBe('Skills:');
        expect(lines[17]).toBe('\tskill 1');
        expect(lines[18]).toBe('\t\tRanks: 5');
        expect(lines[19]).toBe('\t\tStat Bonus: 14');
        expect(lines[20]).toBe('\t\tOther Bonus: 0');
        expect(lines[21]).toBe('\t\tArmor Check Penalty: -7');
        expect(lines[22]).toBe('\t\tClass Skill');
        expect(lines[23]).toBe('\tskill 2');
        expect(lines[24]).toBe('\t\tRanks: 2.5');
        expect(lines[25]).toBe('\t\tStat Bonus: -1');
        expect(lines[26]).toBe('\t\tOther Bonus: 4');
        expect(lines[27]).toBe('\t\tArmor Check Penalty: 0');
        expect(lines[28]).toBe('\t\tCircumstantial Bonus');
        expect(lines[29]).toBe('Feats:');
        expect(lines[30]).toBe('\tfeat 2');
        expect(lines[31]).toBe('\t\tPower: 9876');
        expect(lines[32]).toBe('\tfeat 3');
        expect(lines[33]).toBe('Interesting Trait: None');
        expect(lines[34]).toBe("Equipment:");
        expect(lines[35]).toBe("\tPrimary Hand: None");
        expect(lines[36]).toBe("\tOff Hand: None");
        expect(lines[37]).toBe("\tArmor: None");
        expect(lines[38]).toBe("\tTreasure: None");
        expect(lines[39]).toBe("Combat:");
        expect(lines[40]).toBe("\tAdjusted Dexterity Bonus: 4");
        expect(lines[41]).toBe("\tArmor Class: 8");
        expect(lines[42]).toBe("\t\tFlat-Footed: 13");
        expect(lines[43]).toBe("\t\tTouch: 35");
        expect(lines[44]).toBe("\tBase Attack: +22/+17/+12/+7/+2");
        expect(lines[45]).toBe("\tHit Points: 3457");
        expect(lines[46]).toBe("\tInitiative Bonus: 4568");
        expect(lines[47]).toBe("\tSaving Throws:");
        expect(lines[48]).toBe("\t\tFortitude: 57");
        expect(lines[49]).toBe("\t\tReflex: 79");
        expect(lines[50]).toBe("\t\tWill: 68");
        expect(lines[51]).toBe('');
        expect(lines.length).toBe(52);
    });

    it('formats feat frequency', function () {
        character.Ability.Feats[0].Frequency.Quantity = 9876;
        character.Ability.Feats[0].Frequency.TimePeriod = 'fortnight';

        var formattedCharacter = characterFormatterService.formatCharacter(character, leadership, cohort, followers);
        var lines = formattedCharacter.split('\n');

        expect(lines[0]).toBe('Alignment: alignment 1');
        expect(lines[1]).toBe('Level 9267 class name 1');
        expect(lines[2]).toBe('base race 1');
        expect(lines[3]).toBe('\tFemale');
        expect(lines[4]).toBe('\tLand Speed: 31');
        expect(lines[5]).toBe('\tSize: size 1');
        expect(lines[6]).toBe('Stats:');
        expect(lines[7]).toBe('\tStrength: 3 (-3)');
        expect(lines[8]).toBe('\tConstitution: 27 (14)');
        expect(lines[9]).toBe('\tDexterity: 7 (-1)');
        expect(lines[10]).toBe('\tIntelligence: 91 (46)');
        expect(lines[11]).toBe('\tWisdom: 11 (1)');
        expect(lines[12]).toBe('\tCharisma: 10 (0)');
        expect(lines[13]).toBe('Languages:');
        expect(lines[14]).toBe('\tEnglish 1');
        expect(lines[15]).toBe('\tGerman 1');
        expect(lines[16]).toBe('Skills:');
        expect(lines[17]).toBe('\tskill 1');
        expect(lines[18]).toBe('\t\tRanks: 5');
        expect(lines[19]).toBe('\t\tStat Bonus: 14');
        expect(lines[20]).toBe('\t\tOther Bonus: 0');
        expect(lines[21]).toBe('\t\tArmor Check Penalty: -7');
        expect(lines[22]).toBe('\t\tClass Skill');
        expect(lines[23]).toBe('\tskill 2');
        expect(lines[24]).toBe('\t\tRanks: 2.5');
        expect(lines[25]).toBe('\t\tStat Bonus: -1');
        expect(lines[26]).toBe('\t\tOther Bonus: 4');
        expect(lines[27]).toBe('\t\tArmor Check Penalty: 0');
        expect(lines[28]).toBe('\t\tCircumstantial Bonus');
        expect(lines[29]).toBe('Feats:');
        expect(lines[30]).toBe('\tfeat 2');
        expect(lines[31]).toBe('\t\tFrequency: 9876/fortnight');
        expect(lines[32]).toBe('\tfeat 3');
        expect(lines[33]).toBe('Interesting Trait: None');
        expect(lines[34]).toBe("Equipment:");
        expect(lines[35]).toBe("\tPrimary Hand: None");
        expect(lines[36]).toBe("\tOff Hand: None");
        expect(lines[37]).toBe("\tArmor: None");
        expect(lines[38]).toBe("\tTreasure: None");
        expect(lines[39]).toBe("Combat:");
        expect(lines[40]).toBe("\tAdjusted Dexterity Bonus: 4");
        expect(lines[41]).toBe("\tArmor Class: 8");
        expect(lines[42]).toBe("\t\tFlat-Footed: 13");
        expect(lines[43]).toBe("\t\tTouch: 35");
        expect(lines[44]).toBe("\tBase Attack: +22/+17/+12/+7/+2");
        expect(lines[45]).toBe("\tHit Points: 3457");
        expect(lines[46]).toBe("\tInitiative Bonus: 4568");
        expect(lines[47]).toBe("\tSaving Throws:");
        expect(lines[48]).toBe("\t\tFortitude: 57");
        expect(lines[49]).toBe("\t\tReflex: 79");
        expect(lines[50]).toBe("\t\tWill: 68");
        expect(lines[51]).toBe('');
        expect(lines.length).toBe(52);
    });

    it('formats feat frequency without quantity', function () {
        character.Ability.Feats[0].Frequency.Quantity = 0;
        character.Ability.Feats[0].Frequency.TimePeriod = 'all day erry day';

        var formattedCharacter = characterFormatterService.formatCharacter(character, leadership, cohort, followers);
        var lines = formattedCharacter.split('\n');

        expect(lines[0]).toBe('Alignment: alignment 1');
        expect(lines[1]).toBe('Level 9267 class name 1');
        expect(lines[2]).toBe('base race 1');
        expect(lines[3]).toBe('\tFemale');
        expect(lines[4]).toBe('\tLand Speed: 31');
        expect(lines[5]).toBe('\tSize: size 1');
        expect(lines[6]).toBe('Stats:');
        expect(lines[7]).toBe('\tStrength: 3 (-3)');
        expect(lines[8]).toBe('\tConstitution: 27 (14)');
        expect(lines[9]).toBe('\tDexterity: 7 (-1)');
        expect(lines[10]).toBe('\tIntelligence: 91 (46)');
        expect(lines[11]).toBe('\tWisdom: 11 (1)');
        expect(lines[12]).toBe('\tCharisma: 10 (0)');
        expect(lines[13]).toBe('Languages:');
        expect(lines[14]).toBe('\tEnglish 1');
        expect(lines[15]).toBe('\tGerman 1');
        expect(lines[16]).toBe('Skills:');
        expect(lines[17]).toBe('\tskill 1');
        expect(lines[18]).toBe('\t\tRanks: 5');
        expect(lines[19]).toBe('\t\tStat Bonus: 14');
        expect(lines[20]).toBe('\t\tOther Bonus: 0');
        expect(lines[21]).toBe('\t\tArmor Check Penalty: -7');
        expect(lines[22]).toBe('\t\tClass Skill');
        expect(lines[23]).toBe('\tskill 2');
        expect(lines[24]).toBe('\t\tRanks: 2.5');
        expect(lines[25]).toBe('\t\tStat Bonus: -1');
        expect(lines[26]).toBe('\t\tOther Bonus: 4');
        expect(lines[27]).toBe('\t\tArmor Check Penalty: 0');
        expect(lines[28]).toBe('\t\tCircumstantial Bonus');
        expect(lines[29]).toBe('Feats:');
        expect(lines[30]).toBe('\tfeat 2');
        expect(lines[31]).toBe('\t\tFrequency: all day erry day');
        expect(lines[32]).toBe('\tfeat 3');
        expect(lines[33]).toBe('Interesting Trait: None');
        expect(lines[34]).toBe("Equipment:");
        expect(lines[35]).toBe("\tPrimary Hand: None");
        expect(lines[36]).toBe("\tOff Hand: None");
        expect(lines[37]).toBe("\tArmor: None");
        expect(lines[38]).toBe("\tTreasure: None");
        expect(lines[39]).toBe("Combat:");
        expect(lines[40]).toBe("\tAdjusted Dexterity Bonus: 4");
        expect(lines[41]).toBe("\tArmor Class: 8");
        expect(lines[42]).toBe("\t\tFlat-Footed: 13");
        expect(lines[43]).toBe("\t\tTouch: 35");
        expect(lines[44]).toBe("\tBase Attack: +22/+17/+12/+7/+2");
        expect(lines[45]).toBe("\tHit Points: 3457");
        expect(lines[46]).toBe("\tInitiative Bonus: 4568");
        expect(lines[47]).toBe("\tSaving Throws:");
        expect(lines[48]).toBe("\t\tFortitude: 57");
        expect(lines[49]).toBe("\t\tReflex: 79");
        expect(lines[50]).toBe("\t\tWill: 68");
        expect(lines[51]).toBe('');
        expect(lines.length).toBe(52);
    });

    it('formats interesting trait', function () {
        character.InterestingTrait = 'is interesting';

        var formattedCharacter = characterFormatterService.formatCharacter(character, leadership, cohort, followers);
        var lines = formattedCharacter.split('\n');

        expect(lines[0]).toBe('Alignment: alignment 1');
        expect(lines[1]).toBe('Level 9267 class name 1');
        expect(lines[2]).toBe('base race 1');
        expect(lines[3]).toBe('\tFemale');
        expect(lines[4]).toBe('\tLand Speed: 31');
        expect(lines[5]).toBe('\tSize: size 1');
        expect(lines[6]).toBe('Stats:');
        expect(lines[7]).toBe('\tStrength: 3 (-3)');
        expect(lines[8]).toBe('\tConstitution: 27 (14)');
        expect(lines[9]).toBe('\tDexterity: 7 (-1)');
        expect(lines[10]).toBe('\tIntelligence: 91 (46)');
        expect(lines[11]).toBe('\tWisdom: 11 (1)');
        expect(lines[12]).toBe('\tCharisma: 10 (0)');
        expect(lines[13]).toBe('Languages:');
        expect(lines[14]).toBe('\tEnglish 1');
        expect(lines[15]).toBe('\tGerman 1');
        expect(lines[16]).toBe('Skills:');
        expect(lines[17]).toBe('\tskill 1');
        expect(lines[18]).toBe('\t\tRanks: 5');
        expect(lines[19]).toBe('\t\tStat Bonus: 14');
        expect(lines[20]).toBe('\t\tOther Bonus: 0');
        expect(lines[21]).toBe('\t\tArmor Check Penalty: -7');
        expect(lines[22]).toBe('\t\tClass Skill');
        expect(lines[23]).toBe('\tskill 2');
        expect(lines[24]).toBe('\t\tRanks: 2.5');
        expect(lines[25]).toBe('\t\tStat Bonus: -1');
        expect(lines[26]).toBe('\t\tOther Bonus: 4');
        expect(lines[27]).toBe('\t\tArmor Check Penalty: 0');
        expect(lines[28]).toBe('\t\tCircumstantial Bonus');
        expect(lines[29]).toBe('Feats:');
        expect(lines[30]).toBe('\tfeat 2');
        expect(lines[31]).toBe('\tfeat 3');
        expect(lines[32]).toBe('Interesting Trait: is interesting');
        expect(lines[33]).toBe("Equipment:");
        expect(lines[34]).toBe("\tPrimary Hand: None");
        expect(lines[35]).toBe("\tOff Hand: None");
        expect(lines[36]).toBe("\tArmor: None");
        expect(lines[37]).toBe("\tTreasure: None");
        expect(lines[38]).toBe("Combat:");
        expect(lines[39]).toBe("\tAdjusted Dexterity Bonus: 4");
        expect(lines[40]).toBe("\tArmor Class: 8");
        expect(lines[41]).toBe("\t\tFlat-Footed: 13");
        expect(lines[42]).toBe("\t\tTouch: 35");
        expect(lines[43]).toBe("\tBase Attack: +22/+17/+12/+7/+2");
        expect(lines[44]).toBe("\tHit Points: 3457");
        expect(lines[45]).toBe("\tInitiative Bonus: 4568");
        expect(lines[46]).toBe("\tSaving Throws:");
        expect(lines[47]).toBe("\t\tFortitude: 57");
        expect(lines[48]).toBe("\t\tReflex: 79");
        expect(lines[49]).toBe("\t\tWill: 68");
        expect(lines[50]).toBe('');
        expect(lines.length).toBe(51);
    });

    it('formats spells per day', function () {
        character.Magic.SpellsPerDay = [
            { Level: 0, Quantity: 9, HasDomainSpell: false },
            { Level: 1, Quantity: 8, HasDomainSpell: true }
        ];

        var formattedCharacter = characterFormatterService.formatCharacter(character, leadership, cohort, followers);
        var lines = formattedCharacter.split('\n');

        expect(lines[0]).toBe('Alignment: alignment 1');
        expect(lines[1]).toBe('Level 9267 class name 1');
        expect(lines[2]).toBe('base race 1');
        expect(lines[3]).toBe('\tFemale');
        expect(lines[4]).toBe('\tLand Speed: 31');
        expect(lines[5]).toBe('\tSize: size 1');
        expect(lines[6]).toBe('Stats:');
        expect(lines[7]).toBe('\tStrength: 3 (-3)');
        expect(lines[8]).toBe('\tConstitution: 27 (14)');
        expect(lines[9]).toBe('\tDexterity: 7 (-1)');
        expect(lines[10]).toBe('\tIntelligence: 91 (46)');
        expect(lines[11]).toBe('\tWisdom: 11 (1)');
        expect(lines[12]).toBe('\tCharisma: 10 (0)');
        expect(lines[13]).toBe('Languages:');
        expect(lines[14]).toBe('\tEnglish 1');
        expect(lines[15]).toBe('\tGerman 1');
        expect(lines[16]).toBe('Skills:');
        expect(lines[17]).toBe('\tskill 1');
        expect(lines[18]).toBe('\t\tRanks: 5');
        expect(lines[19]).toBe('\t\tStat Bonus: 14');
        expect(lines[20]).toBe('\t\tOther Bonus: 0');
        expect(lines[21]).toBe('\t\tArmor Check Penalty: -7');
        expect(lines[22]).toBe('\t\tClass Skill');
        expect(lines[23]).toBe('\tskill 2');
        expect(lines[24]).toBe('\t\tRanks: 2.5');
        expect(lines[25]).toBe('\t\tStat Bonus: -1');
        expect(lines[26]).toBe('\t\tOther Bonus: 4');
        expect(lines[27]).toBe('\t\tArmor Check Penalty: 0');
        expect(lines[28]).toBe('\t\tCircumstantial Bonus');
        expect(lines[29]).toBe('Feats:');
        expect(lines[30]).toBe('\tfeat 2');
        expect(lines[31]).toBe('\tfeat 3');
        expect(lines[32]).toBe('Interesting Trait: None');
        expect(lines[33]).toBe('Spells Per Day:');
        expect(lines[34]).toBe('\tLevel 0: 9');
        expect(lines[35]).toBe('\tLevel 1: 8 + 1');
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
        expect(lines[46]).toBe("\tBase Attack: +22/+17/+12/+7/+2");
        expect(lines[47]).toBe("\tHit Points: 3457");
        expect(lines[48]).toBe("\tInitiative Bonus: 4568");
        expect(lines[49]).toBe("\tSaving Throws:");
        expect(lines[50]).toBe("\t\tFortitude: 57");
        expect(lines[51]).toBe("\t\tReflex: 79");
        expect(lines[52]).toBe("\t\tWill: 68");
        expect(lines[53]).toBe('');
        expect(lines.length).toBe(54);
    });

    it('formats arcane spell failure', function () {
        character.Magic.ArcaneSpellFailure = 98;

        var formattedCharacter = characterFormatterService.formatCharacter(character, leadership, cohort, followers);
        var lines = formattedCharacter.split('\n');

        expect(lines[0]).toBe('Alignment: alignment 1');
        expect(lines[1]).toBe('Level 9267 class name 1');
        expect(lines[2]).toBe('base race 1');
        expect(lines[3]).toBe('\tFemale');
        expect(lines[4]).toBe('\tLand Speed: 31');
        expect(lines[5]).toBe('\tSize: size 1');
        expect(lines[6]).toBe('Stats:');
        expect(lines[7]).toBe('\tStrength: 3 (-3)');
        expect(lines[8]).toBe('\tConstitution: 27 (14)');
        expect(lines[9]).toBe('\tDexterity: 7 (-1)');
        expect(lines[10]).toBe('\tIntelligence: 91 (46)');
        expect(lines[11]).toBe('\tWisdom: 11 (1)');
        expect(lines[12]).toBe('\tCharisma: 10 (0)');
        expect(lines[13]).toBe('Languages:');
        expect(lines[14]).toBe('\tEnglish 1');
        expect(lines[15]).toBe('\tGerman 1');
        expect(lines[16]).toBe('Skills:');
        expect(lines[17]).toBe('\tskill 1');
        expect(lines[18]).toBe('\t\tRanks: 5');
        expect(lines[19]).toBe('\t\tStat Bonus: 14');
        expect(lines[20]).toBe('\t\tOther Bonus: 0');
        expect(lines[21]).toBe('\t\tArmor Check Penalty: -7');
        expect(lines[22]).toBe('\t\tClass Skill');
        expect(lines[23]).toBe('\tskill 2');
        expect(lines[24]).toBe('\t\tRanks: 2.5');
        expect(lines[25]).toBe('\t\tStat Bonus: -1');
        expect(lines[26]).toBe('\t\tOther Bonus: 4');
        expect(lines[27]).toBe('\t\tArmor Check Penalty: 0');
        expect(lines[28]).toBe('\t\tCircumstantial Bonus');
        expect(lines[29]).toBe('Feats:');
        expect(lines[30]).toBe('\tfeat 2');
        expect(lines[31]).toBe('\tfeat 3');
        expect(lines[32]).toBe('Interesting Trait: None');
        expect(lines[33]).toBe('Arcane Spell Failure: 98%');
        expect(lines[34]).toBe("Equipment:");
        expect(lines[35]).toBe("\tPrimary Hand: None");
        expect(lines[36]).toBe("\tOff Hand: None");
        expect(lines[37]).toBe("\tArmor: None");
        expect(lines[38]).toBe("\tTreasure: None");
        expect(lines[39]).toBe("Combat:");
        expect(lines[40]).toBe("\tAdjusted Dexterity Bonus: 4");
        expect(lines[41]).toBe("\tArmor Class: 8");
        expect(lines[42]).toBe("\t\tFlat-Footed: 13");
        expect(lines[43]).toBe("\t\tTouch: 35");
        expect(lines[44]).toBe("\tBase Attack: +22/+17/+12/+7/+2");
        expect(lines[45]).toBe("\tHit Points: 3457");
        expect(lines[46]).toBe("\tInitiative Bonus: 4568");
        expect(lines[47]).toBe("\tSaving Throws:");
        expect(lines[48]).toBe("\t\tFortitude: 57");
        expect(lines[49]).toBe("\t\tReflex: 79");
        expect(lines[50]).toBe("\t\tWill: 68");
        expect(lines[51]).toBe('');
        expect(lines.length).toBe(52);
    });

    it('formats animal', function () {
        character.Magic.Animal = 'familiar';

        var formattedCharacter = characterFormatterService.formatCharacter(character, leadership, cohort, followers);
        var lines = formattedCharacter.split('\n');

        expect(lines[0]).toBe('Alignment: alignment 1');
        expect(lines[1]).toBe('Level 9267 class name 1');
        expect(lines[2]).toBe('base race 1');
        expect(lines[3]).toBe('\tFemale');
        expect(lines[4]).toBe('\tLand Speed: 31');
        expect(lines[5]).toBe('\tSize: size 1');
        expect(lines[6]).toBe('Stats:');
        expect(lines[7]).toBe('\tStrength: 3 (-3)');
        expect(lines[8]).toBe('\tConstitution: 27 (14)');
        expect(lines[9]).toBe('\tDexterity: 7 (-1)');
        expect(lines[10]).toBe('\tIntelligence: 91 (46)');
        expect(lines[11]).toBe('\tWisdom: 11 (1)');
        expect(lines[12]).toBe('\tCharisma: 10 (0)');
        expect(lines[13]).toBe('Languages:');
        expect(lines[14]).toBe('\tEnglish 1');
        expect(lines[15]).toBe('\tGerman 1');
        expect(lines[16]).toBe('Skills:');
        expect(lines[17]).toBe('\tskill 1');
        expect(lines[18]).toBe('\t\tRanks: 5');
        expect(lines[19]).toBe('\t\tStat Bonus: 14');
        expect(lines[20]).toBe('\t\tOther Bonus: 0');
        expect(lines[21]).toBe('\t\tArmor Check Penalty: -7');
        expect(lines[22]).toBe('\t\tClass Skill');
        expect(lines[23]).toBe('\tskill 2');
        expect(lines[24]).toBe('\t\tRanks: 2.5');
        expect(lines[25]).toBe('\t\tStat Bonus: -1');
        expect(lines[26]).toBe('\t\tOther Bonus: 4');
        expect(lines[27]).toBe('\t\tArmor Check Penalty: 0');
        expect(lines[28]).toBe('\t\tCircumstantial Bonus');
        expect(lines[29]).toBe('Feats:');
        expect(lines[30]).toBe('\tfeat 2');
        expect(lines[31]).toBe('\tfeat 3');
        expect(lines[32]).toBe('Interesting Trait: None');
        expect(lines[33]).toBe('Animal: familiar');
        expect(lines[34]).toBe("Equipment:");
        expect(lines[35]).toBe("\tPrimary Hand: None");
        expect(lines[36]).toBe("\tOff Hand: None");
        expect(lines[37]).toBe("\tArmor: None");
        expect(lines[38]).toBe("\tTreasure: None");
        expect(lines[39]).toBe("Combat:");
        expect(lines[40]).toBe("\tAdjusted Dexterity Bonus: 4");
        expect(lines[41]).toBe("\tArmor Class: 8");
        expect(lines[42]).toBe("\t\tFlat-Footed: 13");
        expect(lines[43]).toBe("\t\tTouch: 35");
        expect(lines[44]).toBe("\tBase Attack: +22/+17/+12/+7/+2");
        expect(lines[45]).toBe("\tHit Points: 3457");
        expect(lines[46]).toBe("\tInitiative Bonus: 4568");
        expect(lines[47]).toBe("\tSaving Throws:");
        expect(lines[48]).toBe("\t\tFortitude: 57");
        expect(lines[49]).toBe("\t\tReflex: 79");
        expect(lines[50]).toBe("\t\tWill: 68");
        expect(lines[51]).toBe('');
        expect(lines.length).toBe(52);
    });

    it('formats primary hand', function () {
        character.Equipment.PrimaryHand = createItem('primary weapon');

        var formattedCharacter = characterFormatterService.formatCharacter(character, leadership, cohort, followers);
        var lines = formattedCharacter.split('\n');

        expect(lines[0]).toBe('Alignment: alignment 1');
        expect(lines[1]).toBe('Level 9267 class name 1');
        expect(lines[2]).toBe('base race 1');
        expect(lines[3]).toBe('\tFemale');
        expect(lines[4]).toBe('\tLand Speed: 31');
        expect(lines[5]).toBe('\tSize: size 1');
        expect(lines[6]).toBe('Stats:');
        expect(lines[7]).toBe('\tStrength: 3 (-3)');
        expect(lines[8]).toBe('\tConstitution: 27 (14)');
        expect(lines[9]).toBe('\tDexterity: 7 (-1)');
        expect(lines[10]).toBe('\tIntelligence: 91 (46)');
        expect(lines[11]).toBe('\tWisdom: 11 (1)');
        expect(lines[12]).toBe('\tCharisma: 10 (0)');
        expect(lines[13]).toBe('Languages:');
        expect(lines[14]).toBe('\tEnglish 1');
        expect(lines[15]).toBe('\tGerman 1');
        expect(lines[16]).toBe('Skills:');
        expect(lines[17]).toBe('\tskill 1');
        expect(lines[18]).toBe('\t\tRanks: 5');
        expect(lines[19]).toBe('\t\tStat Bonus: 14');
        expect(lines[20]).toBe('\t\tOther Bonus: 0');
        expect(lines[21]).toBe('\t\tArmor Check Penalty: -7');
        expect(lines[22]).toBe('\t\tClass Skill');
        expect(lines[23]).toBe('\tskill 2');
        expect(lines[24]).toBe('\t\tRanks: 2.5');
        expect(lines[25]).toBe('\t\tStat Bonus: -1');
        expect(lines[26]).toBe('\t\tOther Bonus: 4');
        expect(lines[27]).toBe('\t\tArmor Check Penalty: 0');
        expect(lines[28]).toBe('\t\tCircumstantial Bonus');
        expect(lines[29]).toBe('Feats:');
        expect(lines[30]).toBe('\tfeat 2');
        expect(lines[31]).toBe('\tfeat 3');
        expect(lines[32]).toBe('Interesting Trait: None');
        expect(lines[33]).toBe("Equipment:");
        expect(lines[34]).toBe("\tPrimary Hand:");
        expect(lines[35]).toBe('\t\tprimary weapon');
        expect(lines[36]).toBe('\t\t\tformatted');
        expect(lines[37]).toBe("\tOff Hand: None");
        expect(lines[38]).toBe("\tArmor: None");
        expect(lines[39]).toBe("\tTreasure: None");
        expect(lines[40]).toBe("Combat:");
        expect(lines[41]).toBe("\tAdjusted Dexterity Bonus: 4");
        expect(lines[42]).toBe("\tArmor Class: 8");
        expect(lines[43]).toBe("\t\tFlat-Footed: 13");
        expect(lines[44]).toBe("\t\tTouch: 35");
        expect(lines[45]).toBe("\tBase Attack: +22/+17/+12/+7/+2");
        expect(lines[46]).toBe("\tHit Points: 3457");
        expect(lines[47]).toBe("\tInitiative Bonus: 4568");
        expect(lines[48]).toBe("\tSaving Throws:");
        expect(lines[49]).toBe("\t\tFortitude: 57");
        expect(lines[50]).toBe("\t\tReflex: 79");
        expect(lines[51]).toBe("\t\tWill: 68");
        expect(lines[52]).toBe('');
        expect(lines.length).toBe(53);
    });

    it('formats two-handed weapon', function () {
        character.Equipment.PrimaryHand = createItem('primary weapon');
        character.Equipment.PrimaryHand.Attributes.push('Two-Handed');

        var formattedCharacter = characterFormatterService.formatCharacter(character, leadership, cohort, followers);
        var lines = formattedCharacter.split('\n');

        expect(lines[0]).toBe('Alignment: alignment 1');
        expect(lines[1]).toBe('Level 9267 class name 1');
        expect(lines[2]).toBe('base race 1');
        expect(lines[3]).toBe('\tFemale');
        expect(lines[4]).toBe('\tLand Speed: 31');
        expect(lines[5]).toBe('\tSize: size 1');
        expect(lines[6]).toBe('Stats:');
        expect(lines[7]).toBe('\tStrength: 3 (-3)');
        expect(lines[8]).toBe('\tConstitution: 27 (14)');
        expect(lines[9]).toBe('\tDexterity: 7 (-1)');
        expect(lines[10]).toBe('\tIntelligence: 91 (46)');
        expect(lines[11]).toBe('\tWisdom: 11 (1)');
        expect(lines[12]).toBe('\tCharisma: 10 (0)');
        expect(lines[13]).toBe('Languages:');
        expect(lines[14]).toBe('\tEnglish 1');
        expect(lines[15]).toBe('\tGerman 1');
        expect(lines[16]).toBe('Skills:');
        expect(lines[17]).toBe('\tskill 1');
        expect(lines[18]).toBe('\t\tRanks: 5');
        expect(lines[19]).toBe('\t\tStat Bonus: 14');
        expect(lines[20]).toBe('\t\tOther Bonus: 0');
        expect(lines[21]).toBe('\t\tArmor Check Penalty: -7');
        expect(lines[22]).toBe('\t\tClass Skill');
        expect(lines[23]).toBe('\tskill 2');
        expect(lines[24]).toBe('\t\tRanks: 2.5');
        expect(lines[25]).toBe('\t\tStat Bonus: -1');
        expect(lines[26]).toBe('\t\tOther Bonus: 4');
        expect(lines[27]).toBe('\t\tArmor Check Penalty: 0');
        expect(lines[28]).toBe('\t\tCircumstantial Bonus');
        expect(lines[29]).toBe('Feats:');
        expect(lines[30]).toBe('\tfeat 2');
        expect(lines[31]).toBe('\tfeat 3');
        expect(lines[32]).toBe('Interesting Trait: None');
        expect(lines[33]).toBe("Equipment:");
        expect(lines[34]).toBe("\tPrimary Hand:");
        expect(lines[35]).toBe('\t\tprimary weapon');
        expect(lines[36]).toBe('\t\t\tformatted');
        expect(lines[37]).toBe("\tOff Hand: (Two-Handed)");
        expect(lines[38]).toBe("\tArmor: None");
        expect(lines[39]).toBe("\tTreasure: None");
        expect(lines[40]).toBe("Combat:");
        expect(lines[41]).toBe("\tAdjusted Dexterity Bonus: 4");
        expect(lines[42]).toBe("\tArmor Class: 8");
        expect(lines[43]).toBe("\t\tFlat-Footed: 13");
        expect(lines[44]).toBe("\t\tTouch: 35");
        expect(lines[45]).toBe("\tBase Attack: +22/+17/+12/+7/+2");
        expect(lines[46]).toBe("\tHit Points: 3457");
        expect(lines[47]).toBe("\tInitiative Bonus: 4568");
        expect(lines[48]).toBe("\tSaving Throws:");
        expect(lines[49]).toBe("\t\tFortitude: 57");
        expect(lines[50]).toBe("\t\tReflex: 79");
        expect(lines[51]).toBe("\t\tWill: 68");
        expect(lines[52]).toBe('');
        expect(lines.length).toBe(53);
    });

    it('formats off-hand item', function () {
        character.Equipment.PrimaryHand = createItem('primary weapon');
        character.Equipment.OffHand = createItem('off-hand item');

        var formattedCharacter = characterFormatterService.formatCharacter(character, leadership, cohort, followers);
        var lines = formattedCharacter.split('\n');

        expect(lines[0]).toBe('Alignment: alignment 1');
        expect(lines[1]).toBe('Level 9267 class name 1');
        expect(lines[2]).toBe('base race 1');
        expect(lines[3]).toBe('\tFemale');
        expect(lines[4]).toBe('\tLand Speed: 31');
        expect(lines[5]).toBe('\tSize: size 1');
        expect(lines[6]).toBe('Stats:');
        expect(lines[7]).toBe('\tStrength: 3 (-3)');
        expect(lines[8]).toBe('\tConstitution: 27 (14)');
        expect(lines[9]).toBe('\tDexterity: 7 (-1)');
        expect(lines[10]).toBe('\tIntelligence: 91 (46)');
        expect(lines[11]).toBe('\tWisdom: 11 (1)');
        expect(lines[12]).toBe('\tCharisma: 10 (0)');
        expect(lines[13]).toBe('Languages:');
        expect(lines[14]).toBe('\tEnglish 1');
        expect(lines[15]).toBe('\tGerman 1');
        expect(lines[16]).toBe('Skills:');
        expect(lines[17]).toBe('\tskill 1');
        expect(lines[18]).toBe('\t\tRanks: 5');
        expect(lines[19]).toBe('\t\tStat Bonus: 14');
        expect(lines[20]).toBe('\t\tOther Bonus: 0');
        expect(lines[21]).toBe('\t\tArmor Check Penalty: -7');
        expect(lines[22]).toBe('\t\tClass Skill');
        expect(lines[23]).toBe('\tskill 2');
        expect(lines[24]).toBe('\t\tRanks: 2.5');
        expect(lines[25]).toBe('\t\tStat Bonus: -1');
        expect(lines[26]).toBe('\t\tOther Bonus: 4');
        expect(lines[27]).toBe('\t\tArmor Check Penalty: 0');
        expect(lines[28]).toBe('\t\tCircumstantial Bonus');
        expect(lines[29]).toBe('Feats:');
        expect(lines[30]).toBe('\tfeat 2');
        expect(lines[31]).toBe('\tfeat 3');
        expect(lines[32]).toBe('Interesting Trait: None');
        expect(lines[33]).toBe("Equipment:");
        expect(lines[34]).toBe("\tPrimary Hand:");
        expect(lines[35]).toBe('\t\tprimary weapon');
        expect(lines[36]).toBe('\t\t\tformatted');
        expect(lines[37]).toBe("\tOff Hand:");
        expect(lines[38]).toBe('\t\toff-hand item');
        expect(lines[39]).toBe('\t\t\tformatted');
        expect(lines[40]).toBe("\tArmor: None");
        expect(lines[41]).toBe("\tTreasure: None");
        expect(lines[42]).toBe("Combat:");
        expect(lines[43]).toBe("\tAdjusted Dexterity Bonus: 4");
        expect(lines[44]).toBe("\tArmor Class: 8");
        expect(lines[45]).toBe("\t\tFlat-Footed: 13");
        expect(lines[46]).toBe("\t\tTouch: 35");
        expect(lines[47]).toBe("\tBase Attack: +22/+17/+12/+7/+2");
        expect(lines[48]).toBe("\tHit Points: 3457");
        expect(lines[49]).toBe("\tInitiative Bonus: 4568");
        expect(lines[50]).toBe("\tSaving Throws:");
        expect(lines[51]).toBe("\t\tFortitude: 57");
        expect(lines[52]).toBe("\t\tReflex: 79");
        expect(lines[53]).toBe("\t\tWill: 68");
        expect(lines[54]).toBe('');
        expect(lines.length).toBe(55);
    });

    it('formats armor', function () {
        character.Equipment.Armor = createItem('armor');

        var formattedCharacter = characterFormatterService.formatCharacter(character, leadership, cohort, followers);
        var lines = formattedCharacter.split('\n');

        expect(lines[0]).toBe('Alignment: alignment 1');
        expect(lines[1]).toBe('Level 9267 class name 1');
        expect(lines[2]).toBe('base race 1');
        expect(lines[3]).toBe('\tFemale');
        expect(lines[4]).toBe('\tLand Speed: 31');
        expect(lines[5]).toBe('\tSize: size 1');
        expect(lines[6]).toBe('Stats:');
        expect(lines[7]).toBe('\tStrength: 3 (-3)');
        expect(lines[8]).toBe('\tConstitution: 27 (14)');
        expect(lines[9]).toBe('\tDexterity: 7 (-1)');
        expect(lines[10]).toBe('\tIntelligence: 91 (46)');
        expect(lines[11]).toBe('\tWisdom: 11 (1)');
        expect(lines[12]).toBe('\tCharisma: 10 (0)');
        expect(lines[13]).toBe('Languages:');
        expect(lines[14]).toBe('\tEnglish 1');
        expect(lines[15]).toBe('\tGerman 1');
        expect(lines[16]).toBe('Skills:');
        expect(lines[17]).toBe('\tskill 1');
        expect(lines[18]).toBe('\t\tRanks: 5');
        expect(lines[19]).toBe('\t\tStat Bonus: 14');
        expect(lines[20]).toBe('\t\tOther Bonus: 0');
        expect(lines[21]).toBe('\t\tArmor Check Penalty: -7');
        expect(lines[22]).toBe('\t\tClass Skill');
        expect(lines[23]).toBe('\tskill 2');
        expect(lines[24]).toBe('\t\tRanks: 2.5');
        expect(lines[25]).toBe('\t\tStat Bonus: -1');
        expect(lines[26]).toBe('\t\tOther Bonus: 4');
        expect(lines[27]).toBe('\t\tArmor Check Penalty: 0');
        expect(lines[28]).toBe('\t\tCircumstantial Bonus');
        expect(lines[29]).toBe('Feats:');
        expect(lines[30]).toBe('\tfeat 2');
        expect(lines[31]).toBe('\tfeat 3');
        expect(lines[32]).toBe('Interesting Trait: None');
        expect(lines[33]).toBe("Equipment:");
        expect(lines[34]).toBe("\tPrimary Hand: None");
        expect(lines[35]).toBe("\tOff Hand: None");
        expect(lines[36]).toBe("\tArmor:");
        expect(lines[37]).toBe('\t\tarmor');
        expect(lines[38]).toBe('\t\t\tformatted');
        expect(lines[39]).toBe("\tTreasure: None");
        expect(lines[40]).toBe("Combat:");
        expect(lines[41]).toBe("\tAdjusted Dexterity Bonus: 4");
        expect(lines[42]).toBe("\tArmor Class: 8");
        expect(lines[43]).toBe("\t\tFlat-Footed: 13");
        expect(lines[44]).toBe("\t\tTouch: 35");
        expect(lines[45]).toBe("\tBase Attack: +22/+17/+12/+7/+2");
        expect(lines[46]).toBe("\tHit Points: 3457");
        expect(lines[47]).toBe("\tInitiative Bonus: 4568");
        expect(lines[48]).toBe("\tSaving Throws:");
        expect(lines[49]).toBe("\t\tFortitude: 57");
        expect(lines[50]).toBe("\t\tReflex: 79");
        expect(lines[51]).toBe("\t\tWill: 68");
        expect(lines[52]).toBe('');
        expect(lines.length).toBe(53);
    });

    it('formats treasure if there is coin', function () {
        character.Equipment.Treasure.Coin.Quantity = 9266;
        character.Equipment.Treasure.Coin.Currency = "munny";

        var formattedCharacter = characterFormatterService.formatCharacter(character, leadership, cohort, followers);
        var lines = formattedCharacter.split('\n');

        expect(lines[0]).toBe('Alignment: alignment 1');
        expect(lines[1]).toBe('Level 9267 class name 1');
        expect(lines[2]).toBe('base race 1');
        expect(lines[3]).toBe('\tFemale');
        expect(lines[4]).toBe('\tLand Speed: 31');
        expect(lines[5]).toBe('\tSize: size 1');
        expect(lines[6]).toBe('Stats:');
        expect(lines[7]).toBe('\tStrength: 3 (-3)');
        expect(lines[8]).toBe('\tConstitution: 27 (14)');
        expect(lines[9]).toBe('\tDexterity: 7 (-1)');
        expect(lines[10]).toBe('\tIntelligence: 91 (46)');
        expect(lines[11]).toBe('\tWisdom: 11 (1)');
        expect(lines[12]).toBe('\tCharisma: 10 (0)');
        expect(lines[13]).toBe('Languages:');
        expect(lines[14]).toBe('\tEnglish 1');
        expect(lines[15]).toBe('\tGerman 1');
        expect(lines[16]).toBe('Skills:');
        expect(lines[17]).toBe('\tskill 1');
        expect(lines[18]).toBe('\t\tRanks: 5');
        expect(lines[19]).toBe('\t\tStat Bonus: 14');
        expect(lines[20]).toBe('\t\tOther Bonus: 0');
        expect(lines[21]).toBe('\t\tArmor Check Penalty: -7');
        expect(lines[22]).toBe('\t\tClass Skill');
        expect(lines[23]).toBe('\tskill 2');
        expect(lines[24]).toBe('\t\tRanks: 2.5');
        expect(lines[25]).toBe('\t\tStat Bonus: -1');
        expect(lines[26]).toBe('\t\tOther Bonus: 4');
        expect(lines[27]).toBe('\t\tArmor Check Penalty: 0');
        expect(lines[28]).toBe('\t\tCircumstantial Bonus');
        expect(lines[29]).toBe('Feats:');
        expect(lines[30]).toBe('\tfeat 2');
        expect(lines[31]).toBe('\tfeat 3');
        expect(lines[32]).toBe('Interesting Trait: None');
        expect(lines[33]).toBe("Equipment:");
        expect(lines[34]).toBe("\tPrimary Hand: None");
        expect(lines[35]).toBe("\tOff Hand: None");
        expect(lines[36]).toBe("\tArmor: None");
        expect(lines[37]).toBe("\tTreasure:");
        expect(lines[38]).toBe("\t\tformatted treasure");
        expect(lines[39]).toBe("\t\t\tmunny");
        expect(lines[40]).toBe("Combat:");
        expect(lines[41]).toBe("\tAdjusted Dexterity Bonus: 4");
        expect(lines[42]).toBe("\tArmor Class: 8");
        expect(lines[43]).toBe("\t\tFlat-Footed: 13");
        expect(lines[44]).toBe("\t\tTouch: 35");
        expect(lines[45]).toBe("\tBase Attack: +22/+17/+12/+7/+2");
        expect(lines[46]).toBe("\tHit Points: 3457");
        expect(lines[47]).toBe("\tInitiative Bonus: 4568");
        expect(lines[48]).toBe("\tSaving Throws:");
        expect(lines[49]).toBe("\t\tFortitude: 57");
        expect(lines[50]).toBe("\t\tReflex: 79");
        expect(lines[51]).toBe("\t\tWill: 68");
        expect(lines[52]).toBe('');
        expect(lines.length).toBe(53);
    });

    it('formats treasure if there are goods', function () {
        character.Equipment.Treasure.Goods.push({ Description: 'description', ValueInGold: 9266 });

        var formattedCharacter = characterFormatterService.formatCharacter(character, leadership, cohort, followers);
        var lines = formattedCharacter.split('\n');

        expect(lines[0]).toBe('Alignment: alignment 1');
        expect(lines[1]).toBe('Level 9267 class name 1');
        expect(lines[2]).toBe('base race 1');
        expect(lines[3]).toBe('\tFemale');
        expect(lines[4]).toBe('\tLand Speed: 31');
        expect(lines[5]).toBe('\tSize: size 1');
        expect(lines[6]).toBe('Stats:');
        expect(lines[7]).toBe('\tStrength: 3 (-3)');
        expect(lines[8]).toBe('\tConstitution: 27 (14)');
        expect(lines[9]).toBe('\tDexterity: 7 (-1)');
        expect(lines[10]).toBe('\tIntelligence: 91 (46)');
        expect(lines[11]).toBe('\tWisdom: 11 (1)');
        expect(lines[12]).toBe('\tCharisma: 10 (0)');
        expect(lines[13]).toBe('Languages:');
        expect(lines[14]).toBe('\tEnglish 1');
        expect(lines[15]).toBe('\tGerman 1');
        expect(lines[16]).toBe('Skills:');
        expect(lines[17]).toBe('\tskill 1');
        expect(lines[18]).toBe('\t\tRanks: 5');
        expect(lines[19]).toBe('\t\tStat Bonus: 14');
        expect(lines[20]).toBe('\t\tOther Bonus: 0');
        expect(lines[21]).toBe('\t\tArmor Check Penalty: -7');
        expect(lines[22]).toBe('\t\tClass Skill');
        expect(lines[23]).toBe('\tskill 2');
        expect(lines[24]).toBe('\t\tRanks: 2.5');
        expect(lines[25]).toBe('\t\tStat Bonus: -1');
        expect(lines[26]).toBe('\t\tOther Bonus: 4');
        expect(lines[27]).toBe('\t\tArmor Check Penalty: 0');
        expect(lines[28]).toBe('\t\tCircumstantial Bonus');
        expect(lines[29]).toBe('Feats:');
        expect(lines[30]).toBe('\tfeat 2');
        expect(lines[31]).toBe('\tfeat 3');
        expect(lines[32]).toBe('Interesting Trait: None');
        expect(lines[33]).toBe("Equipment:");
        expect(lines[34]).toBe("\tPrimary Hand: None");
        expect(lines[35]).toBe("\tOff Hand: None");
        expect(lines[36]).toBe("\tArmor: None");
        expect(lines[37]).toBe("\tTreasure:");
        expect(lines[38]).toBe("\t\tformatted treasure");
        expect(lines[39]).toBe("\t\t\tGood: description");
        expect(lines[40]).toBe("Combat:");
        expect(lines[41]).toBe("\tAdjusted Dexterity Bonus: 4");
        expect(lines[42]).toBe("\tArmor Class: 8");
        expect(lines[43]).toBe("\t\tFlat-Footed: 13");
        expect(lines[44]).toBe("\t\tTouch: 35");
        expect(lines[45]).toBe("\tBase Attack: +22/+17/+12/+7/+2");
        expect(lines[46]).toBe("\tHit Points: 3457");
        expect(lines[47]).toBe("\tInitiative Bonus: 4568");
        expect(lines[48]).toBe("\tSaving Throws:");
        expect(lines[49]).toBe("\t\tFortitude: 57");
        expect(lines[50]).toBe("\t\tReflex: 79");
        expect(lines[51]).toBe("\t\tWill: 68");
        expect(lines[52]).toBe('');
        expect(lines.length).toBe(53);
    });

    it('formats treasure if there are items', function () {
        character.Equipment.Treasure.Items.push(createItem('item'));

        var formattedCharacter = characterFormatterService.formatCharacter(character, leadership, cohort, followers);
        var lines = formattedCharacter.split('\n');

        expect(lines[0]).toBe('Alignment: alignment 1');
        expect(lines[1]).toBe('Level 9267 class name 1');
        expect(lines[2]).toBe('base race 1');
        expect(lines[3]).toBe('\tFemale');
        expect(lines[4]).toBe('\tLand Speed: 31');
        expect(lines[5]).toBe('\tSize: size 1');
        expect(lines[6]).toBe('Stats:');
        expect(lines[7]).toBe('\tStrength: 3 (-3)');
        expect(lines[8]).toBe('\tConstitution: 27 (14)');
        expect(lines[9]).toBe('\tDexterity: 7 (-1)');
        expect(lines[10]).toBe('\tIntelligence: 91 (46)');
        expect(lines[11]).toBe('\tWisdom: 11 (1)');
        expect(lines[12]).toBe('\tCharisma: 10 (0)');
        expect(lines[13]).toBe('Languages:');
        expect(lines[14]).toBe('\tEnglish 1');
        expect(lines[15]).toBe('\tGerman 1');
        expect(lines[16]).toBe('Skills:');
        expect(lines[17]).toBe('\tskill 1');
        expect(lines[18]).toBe('\t\tRanks: 5');
        expect(lines[19]).toBe('\t\tStat Bonus: 14');
        expect(lines[20]).toBe('\t\tOther Bonus: 0');
        expect(lines[21]).toBe('\t\tArmor Check Penalty: -7');
        expect(lines[22]).toBe('\t\tClass Skill');
        expect(lines[23]).toBe('\tskill 2');
        expect(lines[24]).toBe('\t\tRanks: 2.5');
        expect(lines[25]).toBe('\t\tStat Bonus: -1');
        expect(lines[26]).toBe('\t\tOther Bonus: 4');
        expect(lines[27]).toBe('\t\tArmor Check Penalty: 0');
        expect(lines[28]).toBe('\t\tCircumstantial Bonus');
        expect(lines[29]).toBe('Feats:');
        expect(lines[30]).toBe('\tfeat 2');
        expect(lines[31]).toBe('\tfeat 3');
        expect(lines[32]).toBe('Interesting Trait: None');
        expect(lines[33]).toBe("Equipment:");
        expect(lines[34]).toBe("\tPrimary Hand: None");
        expect(lines[35]).toBe("\tOff Hand: None");
        expect(lines[36]).toBe("\tArmor: None");
        expect(lines[37]).toBe("\tTreasure:");
        expect(lines[38]).toBe("\t\tformatted treasure");
        expect(lines[39]).toBe('\t\t\tItem: item');
        expect(lines[40]).toBe('\tformatted');
        expect(lines[41]).toBe("Combat:");
        expect(lines[42]).toBe("\tAdjusted Dexterity Bonus: 4");
        expect(lines[43]).toBe("\tArmor Class: 8");
        expect(lines[44]).toBe("\t\tFlat-Footed: 13");
        expect(lines[45]).toBe("\t\tTouch: 35");
        expect(lines[46]).toBe("\tBase Attack: +22/+17/+12/+7/+2");
        expect(lines[47]).toBe("\tHit Points: 3457");
        expect(lines[48]).toBe("\tInitiative Bonus: 4568");
        expect(lines[49]).toBe("\tSaving Throws:");
        expect(lines[50]).toBe("\t\tFortitude: 57");
        expect(lines[51]).toBe("\t\tReflex: 79");
        expect(lines[52]).toBe("\t\tWill: 68");
        expect(lines[53]).toBe('');
        expect(lines.length).toBe(54);
    });

    it('formats circumstantial armor bonus', function () {
        character.Combat.ArmorClass.CircumstantialBonus = true;

        var formattedCharacter = characterFormatterService.formatCharacter(character, leadership, cohort, followers);
        var lines = formattedCharacter.split('\n');

        expect(lines[0]).toBe('Alignment: alignment 1');
        expect(lines[1]).toBe('Level 9267 class name 1');
        expect(lines[2]).toBe('base race 1');
        expect(lines[3]).toBe('\tFemale');
        expect(lines[4]).toBe('\tLand Speed: 31');
        expect(lines[5]).toBe('\tSize: size 1');
        expect(lines[6]).toBe('Stats:');
        expect(lines[7]).toBe('\tStrength: 3 (-3)');
        expect(lines[8]).toBe('\tConstitution: 27 (14)');
        expect(lines[9]).toBe('\tDexterity: 7 (-1)');
        expect(lines[10]).toBe('\tIntelligence: 91 (46)');
        expect(lines[11]).toBe('\tWisdom: 11 (1)');
        expect(lines[12]).toBe('\tCharisma: 10 (0)');
        expect(lines[13]).toBe('Languages:');
        expect(lines[14]).toBe('\tEnglish 1');
        expect(lines[15]).toBe('\tGerman 1');
        expect(lines[16]).toBe('Skills:');
        expect(lines[17]).toBe('\tskill 1');
        expect(lines[18]).toBe('\t\tRanks: 5');
        expect(lines[19]).toBe('\t\tStat Bonus: 14');
        expect(lines[20]).toBe('\t\tOther Bonus: 0');
        expect(lines[21]).toBe('\t\tArmor Check Penalty: -7');
        expect(lines[22]).toBe('\t\tClass Skill');
        expect(lines[23]).toBe('\tskill 2');
        expect(lines[24]).toBe('\t\tRanks: 2.5');
        expect(lines[25]).toBe('\t\tStat Bonus: -1');
        expect(lines[26]).toBe('\t\tOther Bonus: 4');
        expect(lines[27]).toBe('\t\tArmor Check Penalty: 0');
        expect(lines[28]).toBe('\t\tCircumstantial Bonus');
        expect(lines[29]).toBe('Feats:');
        expect(lines[30]).toBe('\tfeat 2');
        expect(lines[31]).toBe('\tfeat 3');
        expect(lines[32]).toBe('Interesting Trait: None');
        expect(lines[33]).toBe("Equipment:");
        expect(lines[34]).toBe("\tPrimary Hand: None");
        expect(lines[35]).toBe("\tOff Hand: None");
        expect(lines[36]).toBe("\tArmor: None");
        expect(lines[37]).toBe("\tTreasure: None");
        expect(lines[38]).toBe("Combat:");
        expect(lines[39]).toBe("\tAdjusted Dexterity Bonus: 4");
        expect(lines[40]).toBe("\tArmor Class: 8 *");
        expect(lines[41]).toBe("\t\tFlat-Footed: 13");
        expect(lines[42]).toBe("\t\tTouch: 35");
        expect(lines[43]).toBe("\tBase Attack: +22/+17/+12/+7/+2");
        expect(lines[44]).toBe("\tHit Points: 3457");
        expect(lines[45]).toBe("\tInitiative Bonus: 4568");
        expect(lines[46]).toBe("\tSaving Throws:");
        expect(lines[47]).toBe("\t\tFortitude: 57");
        expect(lines[48]).toBe("\t\tReflex: 79");
        expect(lines[49]).toBe("\t\tWill: 68");
        expect(lines[50]).toBe('');
        expect(lines.length).toBe(51);
    });

    it('formats circumstantial base attack bonus', function () {
        character.Combat.BaseAttack.CircumstantialBonus = true;

        var formattedCharacter = characterFormatterService.formatCharacter(character, leadership, cohort, followers);
        var lines = formattedCharacter.split('\n');

        expect(lines[0]).toBe('Alignment: alignment 1');
        expect(lines[1]).toBe('Level 9267 class name 1');
        expect(lines[2]).toBe('base race 1');
        expect(lines[3]).toBe('\tFemale');
        expect(lines[4]).toBe('\tLand Speed: 31');
        expect(lines[5]).toBe('\tSize: size 1');
        expect(lines[6]).toBe('Stats:');
        expect(lines[7]).toBe('\tStrength: 3 (-3)');
        expect(lines[8]).toBe('\tConstitution: 27 (14)');
        expect(lines[9]).toBe('\tDexterity: 7 (-1)');
        expect(lines[10]).toBe('\tIntelligence: 91 (46)');
        expect(lines[11]).toBe('\tWisdom: 11 (1)');
        expect(lines[12]).toBe('\tCharisma: 10 (0)');
        expect(lines[13]).toBe('Languages:');
        expect(lines[14]).toBe('\tEnglish 1');
        expect(lines[15]).toBe('\tGerman 1');
        expect(lines[16]).toBe('Skills:');
        expect(lines[17]).toBe('\tskill 1');
        expect(lines[18]).toBe('\t\tRanks: 5');
        expect(lines[19]).toBe('\t\tStat Bonus: 14');
        expect(lines[20]).toBe('\t\tOther Bonus: 0');
        expect(lines[21]).toBe('\t\tArmor Check Penalty: -7');
        expect(lines[22]).toBe('\t\tClass Skill');
        expect(lines[23]).toBe('\tskill 2');
        expect(lines[24]).toBe('\t\tRanks: 2.5');
        expect(lines[25]).toBe('\t\tStat Bonus: -1');
        expect(lines[26]).toBe('\t\tOther Bonus: 4');
        expect(lines[27]).toBe('\t\tArmor Check Penalty: 0');
        expect(lines[28]).toBe('\t\tCircumstantial Bonus');
        expect(lines[29]).toBe('Feats:');
        expect(lines[30]).toBe('\tfeat 2');
        expect(lines[31]).toBe('\tfeat 3');
        expect(lines[32]).toBe('Interesting Trait: None');
        expect(lines[33]).toBe("Equipment:");
        expect(lines[34]).toBe("\tPrimary Hand: None");
        expect(lines[35]).toBe("\tOff Hand: None");
        expect(lines[36]).toBe("\tArmor: None");
        expect(lines[37]).toBe("\tTreasure: None");
        expect(lines[38]).toBe("Combat:");
        expect(lines[39]).toBe("\tAdjusted Dexterity Bonus: 4");
        expect(lines[40]).toBe("\tArmor Class: 8");
        expect(lines[41]).toBe("\t\tFlat-Footed: 13");
        expect(lines[42]).toBe("\t\tTouch: 35");
        expect(lines[43]).toBe("\tBase Attack: +22/+17/+12/+7/+2 *");
        expect(lines[44]).toBe("\tHit Points: 3457");
        expect(lines[45]).toBe("\tInitiative Bonus: 4568");
        expect(lines[46]).toBe("\tSaving Throws:");
        expect(lines[47]).toBe("\t\tFortitude: 57");
        expect(lines[48]).toBe("\t\tReflex: 79");
        expect(lines[49]).toBe("\t\tWill: 68");
        expect(lines[50]).toBe('');
        expect(lines.length).toBe(51);
    });

    it('formats circumstantial save bonus', function () {
        character.Combat.SavingThrows.CircumstantialBonus = true;

        var formattedCharacter = characterFormatterService.formatCharacter(character, leadership, cohort, followers);
        var lines = formattedCharacter.split('\n');

        expect(lines[0]).toBe('Alignment: alignment 1');
        expect(lines[1]).toBe('Level 9267 class name 1');
        expect(lines[2]).toBe('base race 1');
        expect(lines[3]).toBe('\tFemale');
        expect(lines[4]).toBe('\tLand Speed: 31');
        expect(lines[5]).toBe('\tSize: size 1');
        expect(lines[6]).toBe('Stats:');
        expect(lines[7]).toBe('\tStrength: 3 (-3)');
        expect(lines[8]).toBe('\tConstitution: 27 (14)');
        expect(lines[9]).toBe('\tDexterity: 7 (-1)');
        expect(lines[10]).toBe('\tIntelligence: 91 (46)');
        expect(lines[11]).toBe('\tWisdom: 11 (1)');
        expect(lines[12]).toBe('\tCharisma: 10 (0)');
        expect(lines[13]).toBe('Languages:');
        expect(lines[14]).toBe('\tEnglish 1');
        expect(lines[15]).toBe('\tGerman 1');
        expect(lines[16]).toBe('Skills:');
        expect(lines[17]).toBe('\tskill 1');
        expect(lines[18]).toBe('\t\tRanks: 5');
        expect(lines[19]).toBe('\t\tStat Bonus: 14');
        expect(lines[20]).toBe('\t\tOther Bonus: 0');
        expect(lines[21]).toBe('\t\tArmor Check Penalty: -7');
        expect(lines[22]).toBe('\t\tClass Skill');
        expect(lines[23]).toBe('\tskill 2');
        expect(lines[24]).toBe('\t\tRanks: 2.5');
        expect(lines[25]).toBe('\t\tStat Bonus: -1');
        expect(lines[26]).toBe('\t\tOther Bonus: 4');
        expect(lines[27]).toBe('\t\tArmor Check Penalty: 0');
        expect(lines[28]).toBe('\t\tCircumstantial Bonus');
        expect(lines[29]).toBe('Feats:');
        expect(lines[30]).toBe('\tfeat 2');
        expect(lines[31]).toBe('\tfeat 3');
        expect(lines[32]).toBe('Interesting Trait: None');
        expect(lines[33]).toBe("Equipment:");
        expect(lines[34]).toBe("\tPrimary Hand: None");
        expect(lines[35]).toBe("\tOff Hand: None");
        expect(lines[36]).toBe("\tArmor: None");
        expect(lines[37]).toBe("\tTreasure: None");
        expect(lines[38]).toBe("Combat:");
        expect(lines[39]).toBe("\tAdjusted Dexterity Bonus: 4");
        expect(lines[40]).toBe("\tArmor Class: 8");
        expect(lines[41]).toBe("\t\tFlat-Footed: 13");
        expect(lines[42]).toBe("\t\tTouch: 35");
        expect(lines[43]).toBe("\tBase Attack: +22/+17/+12/+7/+2");
        expect(lines[44]).toBe("\tHit Points: 3457");
        expect(lines[45]).toBe("\tInitiative Bonus: 4568");
        expect(lines[46]).toBe("\tSaving Throws:");
        expect(lines[47]).toBe("\t\tFortitude: 57");
        expect(lines[48]).toBe("\t\tReflex: 79");
        expect(lines[49]).toBe("\t\tWill: 68");
        expect(lines[50]).toBe("\t\tCircumstantial Bonus");
        expect(lines[51]).toBe('');
        expect(lines.length).toBe(52);
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
        character.Equipment.Treasure.Coin.Quantity = 8765;
        character.Equipment.Treasure.Coin.Currency = 'munny';
        character.Equipment.Treasure.Goods.push({ Description: 'description', ValueInGold: 7654 });
        character.Equipment.Treasure.Items.push(createItem('item'));
        character.Combat.ArmorClass.CircumstantialBonus = true;
        character.Combat.BaseAttack.CircumstantialBonus = true;
        character.Combat.SavingThrows.CircumstantialBonus = true;
        character.Combat.ArmorClass.CircumstantialBonus = true;
        character.Combat.BaseAttack.CircumstantialBonus = true;
        character.Combat.SavingThrows.CircumstantialBonus = true;

        var formattedCharacter = characterFormatterService.formatCharacter(character, leadership, cohort, followers);
        var lines = formattedCharacter.split('\n');

        expect(lines[0]).toBe('Alignment: alignment 1');
        expect(lines[1]).toBe('Level 9267 class name 1');
        expect(lines[2]).toBe("\tSpecialist:");
        expect(lines[3]).toBe("\t\tspecialist field 1");
        expect(lines[4]).toBe("\t\tspecialist field 2");
        expect(lines[5]).toBe("\tProhibited:");
        expect(lines[6]).toBe("\t\tprohibited field 1");
        expect(lines[7]).toBe("\t\tprohibited field 2");
        expect(lines[8]).toBe('metarace base race 1');
        expect(lines[9]).toBe('\tFemale');
        expect(lines[10]).toBe('\tMetarace Species: metarace species');
        expect(lines[11]).toBe('\tLand Speed: 31');
        expect(lines[12]).toBe('\tSize: size 1');
        expect(lines[13]).toBe('\tHas Wings');
        expect(lines[14]).toBe('\tAerial Speed: 12345');
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
        expect(lines[40]).toBe('\t\tFoci:');
        expect(lines[41]).toBe('\t\t\tfocus 1');
        expect(lines[42]).toBe('\t\t\tfocus 2');
        expect(lines[43]).toBe('\t\tFrequency: 34567/time period');
        expect(lines[44]).toBe('\t\tPower: 23456');
        expect(lines[45]).toBe('\tfeat 3');
        expect(lines[46]).toBe('Interesting Trait: interesting trait');
        expect(lines[47]).toBe('Spells Per Day:');
        expect(lines[48]).toBe('\tLevel 0: 45678');
        expect(lines[49]).toBe('\tLevel 1: 56789 + 1');
        expect(lines[50]).toBe('Arcane Spell Failure: 12%');
        expect(lines[51]).toBe('Animal: animal');
        expect(lines[52]).toBe("Equipment:");
        expect(lines[53]).toBe("\tPrimary Hand:");
        expect(lines[54]).toBe('\t\tprimary weapon');
        expect(lines[55]).toBe('\t\t\tformatted');
        expect(lines[56]).toBe("\tOff Hand:");
        expect(lines[57]).toBe('\t\toff-hand item');
        expect(lines[58]).toBe('\t\t\tformatted');
        expect(lines[59]).toBe('\tArmor:');
        expect(lines[60]).toBe('\t\tarmor');
        expect(lines[61]).toBe('\t\t\tformatted');
        expect(lines[62]).toBe('\tTreasure:');
        expect(lines[63]).toBe('\t\tformatted treasure');
        expect(lines[64]).toBe('\t\t\tmunny');
        expect(lines[65]).toBe('\t\t\tGood: description');
        expect(lines[66]).toBe("\t\t\tItem: item");
        expect(lines[67]).toBe('\tformatted');
        expect(lines[68]).toBe("Combat:");
        expect(lines[69]).toBe("\tAdjusted Dexterity Bonus: 4");
        expect(lines[70]).toBe("\tArmor Class: 8 *");
        expect(lines[71]).toBe("\t\tFlat-Footed: 13");
        expect(lines[72]).toBe("\t\tTouch: 35");
        expect(lines[73]).toBe("\tBase Attack: +22/+17/+12/+7/+2 *");
        expect(lines[74]).toBe("\tHit Points: 3457");
        expect(lines[75]).toBe("\tInitiative Bonus: 4568");
        expect(lines[76]).toBe("\tSaving Throws:");
        expect(lines[77]).toBe("\t\tFortitude: 57");
        expect(lines[78]).toBe("\t\tReflex: 79");
        expect(lines[79]).toBe("\t\tWill: 68");
        expect(lines[80]).toBe("\t\tCircumstantial Bonus");
        expect(lines[81]).toBe('');
        expect(lines.length).toBe(82);
    });

    it('formats character summary', function () {
        var summary = characterFormatterService.formatSummary(character);
        expect(summary).toBe('alignment 1 Level 9267 base race 1 class name 1');
    });

    it('formats character summary with metarace', function () {
        character.Race.Metarace = "metarace";
        var summary = characterFormatterService.formatSummary(character);
        expect(summary).toBe('alignment 1 Level 9267 metarace base race 1 class name 1');
    });

    it('formats character with full leadership', function () {
        leadership = {
            Score: 9876,
            LeadershipModifiers: ['killed a man', 'with this thumb']
        };

        cohort = createCharacter();
        followers = [createCharacter(), createCharacter()];

        var formattedCharacter = characterFormatterService.formatCharacter(character, leadership, cohort, followers);
        var lines = formattedCharacter.split('\n');

        expect(lines[0]).toBe('Alignment: alignment 1');
        expect(lines[1]).toBe('Level 9267 class name 1');
        expect(lines[2]).toBe('base race 1');
        expect(lines[3]).toBe('\tFemale');
        expect(lines[4]).toBe('\tLand Speed: 31');
        expect(lines[5]).toBe('\tSize: size 1');
        expect(lines[6]).toBe('Stats:');
        expect(lines[7]).toBe('\tStrength: 3 (-3)');
        expect(lines[8]).toBe('\tConstitution: 27 (14)');
        expect(lines[9]).toBe('\tDexterity: 7 (-1)');
        expect(lines[10]).toBe('\tIntelligence: 91 (46)');
        expect(lines[11]).toBe('\tWisdom: 11 (1)');
        expect(lines[12]).toBe('\tCharisma: 10 (0)');
        expect(lines[13]).toBe('Languages:');
        expect(lines[14]).toBe('\tEnglish 1');
        expect(lines[15]).toBe('\tGerman 1');
        expect(lines[16]).toBe('Skills:');
        expect(lines[17]).toBe('\tskill 1');
        expect(lines[18]).toBe('\t\tRanks: 5');
        expect(lines[19]).toBe('\t\tStat Bonus: 14');
        expect(lines[20]).toBe('\t\tOther Bonus: 0');
        expect(lines[21]).toBe('\t\tArmor Check Penalty: -7');
        expect(lines[22]).toBe('\t\tClass Skill');
        expect(lines[23]).toBe('\tskill 2');
        expect(lines[24]).toBe('\t\tRanks: 2.5');
        expect(lines[25]).toBe('\t\tStat Bonus: -1');
        expect(lines[26]).toBe('\t\tOther Bonus: 4');
        expect(lines[27]).toBe('\t\tArmor Check Penalty: 0');
        expect(lines[28]).toBe('\t\tCircumstantial Bonus');
        expect(lines[29]).toBe('Feats:');
        expect(lines[30]).toBe('\tfeat 2');
        expect(lines[31]).toBe('\tfeat 3');
        expect(lines[32]).toBe('Interesting Trait: None');
        expect(lines[33]).toBe("Equipment:");
        expect(lines[34]).toBe("\tPrimary Hand: None");
        expect(lines[35]).toBe("\tOff Hand: None");
        expect(lines[36]).toBe("\tArmor: None");
        expect(lines[37]).toBe("\tTreasure: None");
        expect(lines[38]).toBe("Combat:");
        expect(lines[39]).toBe("\tAdjusted Dexterity Bonus: 4");
        expect(lines[40]).toBe("\tArmor Class: 8");
        expect(lines[41]).toBe("\t\tFlat-Footed: 13");
        expect(lines[42]).toBe("\t\tTouch: 35");
        expect(lines[43]).toBe("\tBase Attack: +22/+17/+12/+7/+2");
        expect(lines[44]).toBe("\tHit Points: 3457");
        expect(lines[45]).toBe("\tInitiative Bonus: 4568");
        expect(lines[46]).toBe("\tSaving Throws:");
        expect(lines[47]).toBe("\t\tFortitude: 57");
        expect(lines[48]).toBe("\t\tReflex: 79");
        expect(lines[49]).toBe("\t\tWill: 68");
        expect(lines[50]).toBe('');
        expect(lines[51]).toBe('Leadership:');
        expect(lines[52]).toBe('\tScore: 9876');
        expect(lines[53]).toBe('\tLeadership Modifiers:');
        expect(lines[54]).toBe('\t\tkilled a man');
        expect(lines[55]).toBe('\t\twith this thumb');
        expect(lines[56]).toBe('');
        expect(lines[57]).toBe('Cohort:');
        expect(lines[58]).toBe('\tAlignment: alignment 2');
        expect(lines[59]).toBe('\tLevel 9268 class name 2');
        expect(lines[60]).toBe('\tbase race 2');
        expect(lines[61]).toBe('\t\tFemale');
        expect(lines[62]).toBe('\t\tLand Speed: 32');
        expect(lines[63]).toBe('\t\tSize: size 2');
        expect(lines[64]).toBe('\tStats:');
        expect(lines[65]).toBe('\t\tStrength: 4 (-2)');
        expect(lines[66]).toBe('\t\tConstitution: 28 (15)');
        expect(lines[67]).toBe('\t\tDexterity: 8 (0)');
        expect(lines[68]).toBe('\t\tIntelligence: 92 (47)');
        expect(lines[69]).toBe('\t\tWisdom: 12 (2)');
        expect(lines[70]).toBe('\t\tCharisma: 11 (1)');
        expect(lines[71]).toBe('\tLanguages:');
        expect(lines[72]).toBe('\t\tEnglish 2');
        expect(lines[73]).toBe('\t\tGerman 2');
        expect(lines[74]).toBe('\tSkills:');
        expect(lines[75]).toBe('\t\tskill 1');
        expect(lines[76]).toBe('\t\t\tRanks: 6');
        expect(lines[77]).toBe('\t\t\tStat Bonus: 15');
        expect(lines[78]).toBe('\t\t\tOther Bonus: 0');
        expect(lines[79]).toBe('\t\t\tArmor Check Penalty: -8');
        expect(lines[80]).toBe('\t\t\tClass Skill');
        expect(lines[81]).toBe('\t\tskill 2');
        expect(lines[82]).toBe('\t\t\tRanks: 3.5');
        expect(lines[83]).toBe('\t\t\tStat Bonus: 0');
        expect(lines[84]).toBe('\t\t\tOther Bonus: 5');
        expect(lines[85]).toBe('\t\t\tArmor Check Penalty: 0');
        expect(lines[86]).toBe('\t\t\tCircumstantial Bonus');
        expect(lines[87]).toBe('\tFeats:');
        expect(lines[88]).toBe('\t\tfeat 3');
        expect(lines[89]).toBe('\t\tfeat 4');
        expect(lines[90]).toBe('\tInteresting Trait: None');
        expect(lines[91]).toBe("\tEquipment:");
        expect(lines[92]).toBe("\t\tPrimary Hand: None");
        expect(lines[93]).toBe("\t\tOff Hand: None");
        expect(lines[94]).toBe("\t\tArmor: None");
        expect(lines[95]).toBe("\t\tTreasure: None");
        expect(lines[96]).toBe("\tCombat:");
        expect(lines[97]).toBe("\t\tAdjusted Dexterity Bonus: 5");
        expect(lines[98]).toBe("\t\tArmor Class: 9");
        expect(lines[99]).toBe("\t\t\tFlat-Footed: 14");
        expect(lines[100]).toBe("\t\t\tTouch: 36");
        expect(lines[101]).toBe("\t\tBase Attack: +23/+18/+13/+8/+3");
        expect(lines[102]).toBe("\t\tHit Points: 3458");
        expect(lines[103]).toBe("\t\tInitiative Bonus: 4569");
        expect(lines[104]).toBe("\t\tSaving Throws:");
        expect(lines[105]).toBe("\t\t\tFortitude: 58");
        expect(lines[106]).toBe("\t\t\tReflex: 80");
        expect(lines[107]).toBe("\t\t\tWill: 69");
        expect(lines[108]).toBe('');
        expect(lines[109]).toBe('Followers:');
        expect(lines[110]).toBe('');
        expect(lines[111]).toBe('\tAlignment: alignment 3');
        expect(lines[112]).toBe('\tLevel 9269 class name 3');
        expect(lines[113]).toBe('\tbase race 3');
        expect(lines[114]).toBe('\t\tFemale');
        expect(lines[115]).toBe('\t\tLand Speed: 33');
        expect(lines[116]).toBe('\t\tSize: size 3');
        expect(lines[117]).toBe('\tStats:');
        expect(lines[118]).toBe('\t\tStrength: 5 (-1)');
        expect(lines[119]).toBe('\t\tConstitution: 29 (16)');
        expect(lines[120]).toBe('\t\tDexterity: 9 (1)');
        expect(lines[121]).toBe('\t\tIntelligence: 93 (48)');
        expect(lines[122]).toBe('\t\tWisdom: 13 (3)');
        expect(lines[123]).toBe('\t\tCharisma: 12 (2)');
        expect(lines[124]).toBe('\tLanguages:');
        expect(lines[125]).toBe('\t\tEnglish 3');
        expect(lines[126]).toBe('\t\tGerman 3');
        expect(lines[127]).toBe('\tSkills:');
        expect(lines[128]).toBe('\t\tskill 1');
        expect(lines[129]).toBe('\t\t\tRanks: 7');
        expect(lines[130]).toBe('\t\t\tStat Bonus: 16');
        expect(lines[131]).toBe('\t\t\tOther Bonus: 0');
        expect(lines[132]).toBe('\t\t\tArmor Check Penalty: -9');
        expect(lines[133]).toBe('\t\t\tClass Skill');
        expect(lines[134]).toBe('\t\tskill 2');
        expect(lines[135]).toBe('\t\t\tRanks: 4.5');
        expect(lines[136]).toBe('\t\t\tStat Bonus: 1');
        expect(lines[137]).toBe('\t\t\tOther Bonus: 6');
        expect(lines[138]).toBe('\t\t\tArmor Check Penalty: 0');
        expect(lines[139]).toBe('\t\t\tCircumstantial Bonus');
        expect(lines[140]).toBe('\tFeats:');
        expect(lines[141]).toBe('\t\tfeat 4');
        expect(lines[142]).toBe('\t\tfeat 5');
        expect(lines[143]).toBe('\tInteresting Trait: None');
        expect(lines[144]).toBe("\tEquipment:");
        expect(lines[145]).toBe("\t\tPrimary Hand: None");
        expect(lines[146]).toBe("\t\tOff Hand: None");
        expect(lines[147]).toBe("\t\tArmor: None");
        expect(lines[148]).toBe("\t\tTreasure: None");
        expect(lines[149]).toBe("\tCombat:");
        expect(lines[150]).toBe("\t\tAdjusted Dexterity Bonus: 6");
        expect(lines[151]).toBe("\t\tArmor Class: 10");
        expect(lines[152]).toBe("\t\t\tFlat-Footed: 15");
        expect(lines[153]).toBe("\t\t\tTouch: 37");
        expect(lines[154]).toBe("\t\tBase Attack: +24/+19/+14/+9/+4");
        expect(lines[155]).toBe("\t\tHit Points: 3459");
        expect(lines[156]).toBe("\t\tInitiative Bonus: 4570");
        expect(lines[157]).toBe("\t\tSaving Throws:");
        expect(lines[158]).toBe("\t\t\tFortitude: 59");
        expect(lines[159]).toBe("\t\t\tReflex: 81");
        expect(lines[160]).toBe("\t\t\tWill: 70");
        expect(lines[161]).toBe('');
        expect(lines[162]).toBe('\tAlignment: alignment 4');
        expect(lines[163]).toBe('\tLevel 9270 class name 4');
        expect(lines[164]).toBe('\tbase race 4');
        expect(lines[165]).toBe('\t\tFemale');
        expect(lines[166]).toBe('\t\tLand Speed: 34');
        expect(lines[167]).toBe('\t\tSize: size 4');
        expect(lines[168]).toBe('\tStats:');
        expect(lines[169]).toBe('\t\tStrength: 6 (0)');
        expect(lines[170]).toBe('\t\tConstitution: 30 (17)');
        expect(lines[171]).toBe('\t\tDexterity: 10 (2)');
        expect(lines[172]).toBe('\t\tIntelligence: 94 (49)');
        expect(lines[173]).toBe('\t\tWisdom: 14 (4)');
        expect(lines[174]).toBe('\t\tCharisma: 13 (3)');
        expect(lines[175]).toBe('\tLanguages:');
        expect(lines[176]).toBe('\t\tEnglish 4');
        expect(lines[177]).toBe('\t\tGerman 4');
        expect(lines[178]).toBe('\tSkills:');
        expect(lines[179]).toBe('\t\tskill 1');
        expect(lines[180]).toBe('\t\t\tRanks: 8');
        expect(lines[181]).toBe('\t\t\tStat Bonus: 17');
        expect(lines[182]).toBe('\t\t\tOther Bonus: 0');
        expect(lines[183]).toBe('\t\t\tArmor Check Penalty: -10');
        expect(lines[184]).toBe('\t\t\tClass Skill');
        expect(lines[185]).toBe('\t\tskill 2');
        expect(lines[186]).toBe('\t\t\tRanks: 5.5');
        expect(lines[187]).toBe('\t\t\tStat Bonus: 2');
        expect(lines[188]).toBe('\t\t\tOther Bonus: 7');
        expect(lines[189]).toBe('\t\t\tArmor Check Penalty: 0');
        expect(lines[190]).toBe('\t\t\tCircumstantial Bonus');
        expect(lines[191]).toBe('\tFeats:');
        expect(lines[192]).toBe('\t\tfeat 5');
        expect(lines[193]).toBe('\t\tfeat 6');
        expect(lines[194]).toBe('\tInteresting Trait: None');
        expect(lines[195]).toBe("\tEquipment:");
        expect(lines[196]).toBe("\t\tPrimary Hand: None");
        expect(lines[197]).toBe("\t\tOff Hand: None");
        expect(lines[198]).toBe("\t\tArmor: None");
        expect(lines[199]).toBe("\t\tTreasure: None");
        expect(lines[200]).toBe("\tCombat:");
        expect(lines[201]).toBe("\t\tAdjusted Dexterity Bonus: 7");
        expect(lines[202]).toBe("\t\tArmor Class: 11");
        expect(lines[203]).toBe("\t\t\tFlat-Footed: 16");
        expect(lines[204]).toBe("\t\t\tTouch: 38");
        expect(lines[205]).toBe("\t\tBase Attack: +25/+20/+15/+10/+5");
        expect(lines[206]).toBe("\t\tHit Points: 3460");
        expect(lines[207]).toBe("\t\tInitiative Bonus: 4571");
        expect(lines[208]).toBe("\t\tSaving Throws:");
        expect(lines[209]).toBe("\t\t\tFortitude: 60");
        expect(lines[210]).toBe("\t\t\tReflex: 82");
        expect(lines[211]).toBe("\t\t\tWill: 71");
        expect(lines[212]).toBe('');
        expect(lines.length).toBe(213);
    });
});