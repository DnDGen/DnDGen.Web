'use strict'

describe('Treasure Formatter Service', function () {
    var treasureFormatterService;
    var treasure;
    var item;

    beforeEach(module('app.treasure'));

    beforeEach(function () {
        treasure = {
            Coin: { Quantity: 0, Currency: '' },
            Goods: [],
            Items: []
        };

        item = createItem('item name');
    });

    function createItem(itemName) {
        return {
            Name: itemName,
            Quantity: 1,
            Contents: [],
            Traits: [],
            Attributes: [],
            Magic: {
                Bonus: 0,
                SpecialAbilities: [],
                Charges: 0,
                Curse: '',
                Intelligence: {
                    Ego: 0,
                    IntelligenceStat: 0,
                    WisdomStat: 0,
                    CharismaStat: 0,
                    Alignment: '',
                    Communication: [],
                    Languages: [],
                    Senses: '',
                    Powers: [],
                    SpecialPurpose: '',
                    DedicatedPower: '',
                    Personality: ''
                }
            }
        };
    }

    beforeEach(inject(function (_treasureFormatterService_) {
        treasureFormatterService = _treasureFormatterService_;
    }));

    it('formats empty treaure', function () {
        var formattedTreasure = treasureFormatterService.formatTreasure(treasure);
        var lines = formattedTreasure.split('\n');

        expect(lines[0]).toBe('');
        expect(lines.length).toBe(1);
    });

    it('formats coin', function () {
        treasure.Coin.Quantity = 9266;
        treasure.Coin.Currency = 'munny';

        var formattedTreasure = treasureFormatterService.formatTreasure(treasure);
        var lines = formattedTreasure.split('\n');

        expect(lines[0]).toBe('9,266 munny');
        expect(lines[1]).toBe('');
        expect(lines.length).toBe(2);
    });

    it('formats goods', function () {
        treasure.Goods.push({ Description: 'description 1', ValueInGold: 90210 });
        treasure.Goods.push({ Description: 'description 2', ValueInGold: 42 });

        var formattedTreasure = treasureFormatterService.formatTreasure(treasure);
        var lines = formattedTreasure.split('\n');

        expect(lines[0]).toBe('Goods:');
        expect(lines[1]).toBe('\tdescription 1 (90,210gp)');
        expect(lines[2]).toBe('\tdescription 2 (42gp)');
        expect(lines[3]).toBe('');
        expect(lines.length).toBe(4);
    });

    it('formats items', function () {
        item.Quantity = 2;
        item.Contents.push('first contents');
        item.Contents.push('second contents');
        item.Traits.push('first trait');
        item.Traits.push('second trait');
        item.Attributes.push('first attribute');
        item.Attributes.push('Charged');
        item.Attributes.push('second attribute');
        item.Magic.Bonus = 3;
        item.Magic.SpecialAbilities.push({ Name: 'special ability 1' });
        item.Magic.SpecialAbilities.push({ Name: 'special ability 2' });
        item.Magic.Charges = 4;
        item.Magic.Curse = 'curse';
        item.Magic.Intelligence.Ego = 5;
        item.Magic.Intelligence.IntelligenceStat = 6;
        item.Magic.Intelligence.WisdomStat = 7;
        item.Magic.Intelligence.CharismaStat = 8;
        item.Magic.Intelligence.Alignment = 'alignment';
        item.Magic.Intelligence.Communication.push('empathy');
        item.Magic.Intelligence.Communication.push('telepathy');
        item.Magic.Intelligence.Languages.push('English');
        item.Magic.Intelligence.Languages.push('German');
        item.Magic.Intelligence.Senses = 'senses';
        item.Magic.Intelligence.Powers.push('first power');
        item.Magic.Intelligence.Powers.push('second power');
        item.Magic.Intelligence.SpecialPurpose = 'special purpose';
        item.Magic.Intelligence.DedicatedPower = 'dedicated power';
        item.Magic.Intelligence.Personality = 'personality';

        treasure.Items.push(item);
        treasure.Items.push(createItem('other item name'));

        var formattedTreasure = treasureFormatterService.formatTreasure(treasure);
        var lines = formattedTreasure.split('\n');

        expect(lines[0]).toBe('Items:');
        expect(lines[1]).toBe('\titem name (x2)');
        expect(lines[2]).toBe('\t\tContents:');
        expect(lines[3]).toBe('\t\t\tfirst contents');
        expect(lines[4]).toBe('\t\t\tsecond contents');
        expect(lines[5]).toBe('\t\tTraits:');
        expect(lines[6]).toBe('\t\t\tfirst trait');
        expect(lines[7]).toBe('\t\t\tsecond trait');
        expect(lines[8]).toBe('\t\tBonus: +3');
        expect(lines[9]).toBe('\t\tSpecial Abilities:');
        expect(lines[10]).toBe('\t\t\tspecial ability 1');
        expect(lines[11]).toBe('\t\t\tspecial ability 2');
        expect(lines[12]).toBe('\t\tCharges: 4');
        expect(lines[13]).toBe('\t\tCurse: curse');
        expect(lines[14]).toBe('\t\tIntelligent:');
        expect(lines[15]).toBe('\t\t\tEgo: 5');
        expect(lines[16]).toBe('\t\t\tIntelligence: 6');
        expect(lines[17]).toBe('\t\t\tWisdom: 7');
        expect(lines[18]).toBe('\t\t\tCharisma: 8');
        expect(lines[19]).toBe('\t\t\tAlignment: alignment');
        expect(lines[20]).toBe('\t\t\tCommunication:');
        expect(lines[21]).toBe('\t\t\t\tempathy');
        expect(lines[22]).toBe('\t\t\t\ttelepathy');
        expect(lines[23]).toBe('\t\t\t\tLanguages:');
        expect(lines[24]).toBe('\t\t\t\t\tEnglish');
        expect(lines[25]).toBe('\t\t\t\t\tGerman');
        expect(lines[26]).toBe('\t\t\tSenses: senses');
        expect(lines[27]).toBe('\t\t\tPowers:');
        expect(lines[28]).toBe('\t\t\t\tfirst power');
        expect(lines[29]).toBe('\t\t\t\tsecond power');
        expect(lines[30]).toBe('\t\t\tSpecial Purpose: special purpose');
        expect(lines[31]).toBe('\t\t\tDedicated Power: dedicated power');
        expect(lines[32]).toBe('\t\t\tPersonality: personality');
        expect(lines[33]).toBe('\tother item name');
        expect(lines[34]).toBe('');
        expect(lines.length).toBe(35);
    });

    it('formats all treasure', function () {
        item.Quantity = 2;
        item.Contents.push('first contents');
        item.Contents.push('second contents');
        item.Traits.push('first trait');
        item.Traits.push('second trait');
        item.Attributes.push('first attribute');
        item.Attributes.push('Charged');
        item.Attributes.push('second attribute');
        item.Magic.Bonus = 3;
        item.Magic.SpecialAbilities.push({ Name: 'special ability 1' });
        item.Magic.SpecialAbilities.push({ Name: 'special ability 2' });
        item.Magic.Charges = 4;
        item.Magic.Curse = 'curse';
        item.Magic.Intelligence.Ego = 5;
        item.Magic.Intelligence.IntelligenceStat = 6;
        item.Magic.Intelligence.WisdomStat = 7;
        item.Magic.Intelligence.CharismaStat = 8;
        item.Magic.Intelligence.Alignment = 'alignment';
        item.Magic.Intelligence.Communication.push('empathy');
        item.Magic.Intelligence.Communication.push('telepathy');
        item.Magic.Intelligence.Languages.push('English');
        item.Magic.Intelligence.Languages.push('German');
        item.Magic.Intelligence.Senses = 'senses';
        item.Magic.Intelligence.Powers.push('first power');
        item.Magic.Intelligence.Powers.push('second power');
        item.Magic.Intelligence.SpecialPurpose = 'special purpose';
        item.Magic.Intelligence.DedicatedPower = 'dedicated power';
        item.Magic.Intelligence.Personality = 'personality';

        treasure.Coin.Quantity = 9266;
        treasure.Coin.Currency = 'munny';
        treasure.Goods.push({ Description: 'description 1', ValueInGold: 90210 });
        treasure.Goods.push({ Description: 'description 2', ValueInGold: 42 });
        treasure.Items.push(item);
        treasure.Items.push(createItem('other item name'));

        var formattedTreasure = treasureFormatterService.formatTreasure(treasure);
        var lines = formattedTreasure.split('\n');

        expect(lines[0]).toBe('9,266 munny');
        expect(lines[1]).toBe('Goods:');
        expect(lines[2]).toBe('\tdescription 1 (90,210gp)');
        expect(lines[3]).toBe('\tdescription 2 (42gp)');
        expect(lines[4]).toBe('Items:');
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

    it('formats all treasure with prefix', function () {
        item.Quantity = 2;
        item.Contents.push('first contents');
        item.Contents.push('second contents');
        item.Traits.push('first trait');
        item.Traits.push('second trait');
        item.Attributes.push('first attribute');
        item.Attributes.push('Charged');
        item.Attributes.push('second attribute');
        item.Magic.Bonus = 3;
        item.Magic.SpecialAbilities.push({ Name: 'special ability 1' });
        item.Magic.SpecialAbilities.push({ Name: 'special ability 2' });
        item.Magic.Charges = 4;
        item.Magic.Curse = 'curse';
        item.Magic.Intelligence.Ego = 5;
        item.Magic.Intelligence.IntelligenceStat = 6;
        item.Magic.Intelligence.WisdomStat = 7;
        item.Magic.Intelligence.CharismaStat = 8;
        item.Magic.Intelligence.Alignment = 'alignment';
        item.Magic.Intelligence.Communication.push('empathy');
        item.Magic.Intelligence.Communication.push('telepathy');
        item.Magic.Intelligence.Languages.push('English');
        item.Magic.Intelligence.Languages.push('German');
        item.Magic.Intelligence.Senses = 'senses';
        item.Magic.Intelligence.Powers.push('first power');
        item.Magic.Intelligence.Powers.push('second power');
        item.Magic.Intelligence.SpecialPurpose = 'special purpose';
        item.Magic.Intelligence.DedicatedPower = 'dedicated power';
        item.Magic.Intelligence.Personality = 'personality';

        treasure.Coin.Quantity = 9266;
        treasure.Coin.Currency = 'munny';
        treasure.Goods.push({ Description: 'description 1', ValueInGold: 90210 });
        treasure.Goods.push({ Description: 'description 2', ValueInGold: 42 });
        treasure.Items.push(item);
        treasure.Items.push(createItem('other item name'));

        var formattedTreasure = treasureFormatterService.formatTreasure(treasure, '\t');
        var lines = formattedTreasure.split('\n');

        expect(lines[0]).toBe('\t9,266 munny');
        expect(lines[1]).toBe('\tGoods:');
        expect(lines[2]).toBe('\t\tdescription 1 (90,210gp)');
        expect(lines[3]).toBe('\t\tdescription 2 (42gp)');
        expect(lines[4]).toBe('\tItems:');
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

    it('formats item', function () {
        var formattedItem = treasureFormatterService.formatItem(item);
        var lines = formattedItem.split('\n');

        expect(lines[0]).toBe('item name');
        expect(lines[1]).toBe('');
        expect(lines.length).toBe(2);
    });

    it('formats item with quantity greater than 1', function () {
        item.Quantity = 2;

        var formattedItem = treasureFormatterService.formatItem(item);
        var lines = formattedItem.split('\n');

        expect(lines[0]).toBe('item name (x2)');
        expect(lines[1]).toBe('');
        expect(lines.length).toBe(2);
    });

    it('formats item contents', function () {
        item.Contents.push('first contents');
        item.Contents.push('second contents');

        var formattedItem = treasureFormatterService.formatItem(item);
        var lines = formattedItem.split('\n');

        expect(lines[0]).toBe('item name');
        expect(lines[1]).toBe('\tContents:');
        expect(lines[2]).toBe('\t\tfirst contents');
        expect(lines[3]).toBe('\t\tsecond contents');
        expect(lines[4]).toBe('');
        expect(lines.length).toBe(5);
    });

    it('formats item traits', function () {
        item.Traits.push('first trait');
        item.Traits.push('second trait');

        var formattedItem = treasureFormatterService.formatItem(item);
        var lines = formattedItem.split('\n');

        expect(lines[0]).toBe('item name');
        expect(lines[1]).toBe('\tTraits:');
        expect(lines[2]).toBe('\t\tfirst trait');
        expect(lines[3]).toBe('\t\tsecond trait');
        expect(lines[4]).toBe('');
        expect(lines.length).toBe(5);
    });

    it('formats item magic bonus', function () {
        item.Magic.Bonus = 3;

        var formattedItem = treasureFormatterService.formatItem(item);
        var lines = formattedItem.split('\n');

        expect(lines[0]).toBe('item name');
        expect(lines[1]).toBe('\tBonus: +3');
        expect(lines[2]).toBe('');
        expect(lines.length).toBe(3);
    });

    it('formats item magic special abilities', function () {
        item.Magic.Bonus = 3;
        item.Magic.SpecialAbilities.push({ Name: 'special ability 1' });
        item.Magic.SpecialAbilities.push({ Name: 'special ability 2' });

        var formattedItem = treasureFormatterService.formatItem(item);
        var lines = formattedItem.split('\n');

        expect(lines[0]).toBe('item name');
        expect(lines[1]).toBe('\tBonus: +3');
        expect(lines[2]).toBe('\tSpecial Abilities:');
        expect(lines[3]).toBe('\t\tspecial ability 1');
        expect(lines[4]).toBe('\t\tspecial ability 2');
        expect(lines[5]).toBe('');
        expect(lines.length).toBe(6);
    });

    it('formats item charges', function () {
        item.Magic.Charges = 4;
        item.Attributes.push('Charged');

        var formattedItem = treasureFormatterService.formatItem(item);
        var lines = formattedItem.split('\n');

        expect(lines[0]).toBe('item name');
        expect(lines[1]).toBe('\tCharges: 4');
        expect(lines[2]).toBe('');
        expect(lines.length).toBe(3);
    });

    it('formats item charges of 0', function () {
        item.Attributes.push('Charged');

        var formattedItem = treasureFormatterService.formatItem(item);
        var lines = formattedItem.split('\n');

        expect(lines[0]).toBe('item name');
        expect(lines[1]).toBe('\tCharges: 0');
        expect(lines[2]).toBe('');
        expect(lines.length).toBe(3);
    });

    it('formats item curse', function () {
        item.Magic.Curse = 'curse';

        var formattedItem = treasureFormatterService.formatItem(item);
        var lines = formattedItem.split('\n');

        expect(lines[0]).toBe('item name');
        expect(lines[1]).toBe('\tCurse: curse');
        expect(lines[2]).toBe('');
        expect(lines.length).toBe(3);
    });

    it('formats item intelligence', function () {
        item.Magic.Intelligence.Ego = 5;
        item.Magic.Intelligence.IntelligenceStat = 6;
        item.Magic.Intelligence.WisdomStat = 7;
        item.Magic.Intelligence.CharismaStat = 8;
        item.Magic.Intelligence.Alignment = 'alignment';
        item.Magic.Intelligence.Communication.push('empathy');
        item.Magic.Intelligence.Communication.push('telepathy');
        item.Magic.Intelligence.Senses = 'senses';
        item.Magic.Intelligence.Powers.push('first power');
        item.Magic.Intelligence.Powers.push('second power');

        var formattedItem = treasureFormatterService.formatItem(item);
        var lines = formattedItem.split('\n');

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

    it('formats item intelligence languages', function () {
        item.Magic.Intelligence.Ego = 5;
        item.Magic.Intelligence.IntelligenceStat = 6;
        item.Magic.Intelligence.WisdomStat = 7;
        item.Magic.Intelligence.CharismaStat = 8;
        item.Magic.Intelligence.Alignment = 'alignment';
        item.Magic.Intelligence.Communication.push('empathy');
        item.Magic.Intelligence.Communication.push('telepathy');
        item.Magic.Intelligence.Languages.push('English');
        item.Magic.Intelligence.Languages.push('German');
        item.Magic.Intelligence.Senses = 'senses';
        item.Magic.Intelligence.Powers.push('first power');
        item.Magic.Intelligence.Powers.push('second power');

        var formattedItem = treasureFormatterService.formatItem(item);
        var lines = formattedItem.split('\n');

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

    it('formats item intelligence special purpose', function () {
        item.Magic.Intelligence.Ego = 5;
        item.Magic.Intelligence.IntelligenceStat = 6;
        item.Magic.Intelligence.WisdomStat = 7;
        item.Magic.Intelligence.CharismaStat = 8;
        item.Magic.Intelligence.Alignment = 'alignment';
        item.Magic.Intelligence.Communication.push('empathy');
        item.Magic.Intelligence.Communication.push('telepathy');
        item.Magic.Intelligence.Senses = 'senses';
        item.Magic.Intelligence.Powers.push('first power');
        item.Magic.Intelligence.Powers.push('second power');
        item.Magic.Intelligence.SpecialPurpose = 'special purpose';
        item.Magic.Intelligence.DedicatedPower = 'dedicated power';

        var formattedItem = treasureFormatterService.formatItem(item);
        var lines = formattedItem.split('\n');

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

    it('formats intelligence personality', function () {
        item.Magic.Intelligence.Ego = 5;
        item.Magic.Intelligence.IntelligenceStat = 6;
        item.Magic.Intelligence.WisdomStat = 7;
        item.Magic.Intelligence.CharismaStat = 8;
        item.Magic.Intelligence.Alignment = 'alignment';
        item.Magic.Intelligence.Communication.push('empathy');
        item.Magic.Intelligence.Communication.push('telepathy');
        item.Magic.Intelligence.Senses = 'senses';
        item.Magic.Intelligence.Powers.push('first power');
        item.Magic.Intelligence.Powers.push('second power');
        item.Magic.Intelligence.Personality = 'personality';

        var formattedItem = treasureFormatterService.formatItem(item);
        var lines = formattedItem.split('\n');

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

    it('formats full item', function () {
        item.Quantity = 2;
        item.Contents.push('first contents');
        item.Contents.push('second contents');
        item.Traits.push('first trait');
        item.Traits.push('second trait');
        item.Attributes.push('first attribute');
        item.Attributes.push('Charged');
        item.Attributes.push('second attribute');
        item.Magic.Bonus = 3;
        item.Magic.SpecialAbilities.push({ Name: 'special ability 1' });
        item.Magic.SpecialAbilities.push({ Name: 'special ability 2' });
        item.Magic.Charges = 4;
        item.Magic.Curse = 'curse';
        item.Magic.Intelligence.Ego = 5;
        item.Magic.Intelligence.IntelligenceStat = 6;
        item.Magic.Intelligence.WisdomStat = 7;
        item.Magic.Intelligence.CharismaStat = 8;
        item.Magic.Intelligence.Alignment = 'alignment';
        item.Magic.Intelligence.Communication.push('empathy');
        item.Magic.Intelligence.Communication.push('telepathy');
        item.Magic.Intelligence.Languages.push('English');
        item.Magic.Intelligence.Languages.push('German');
        item.Magic.Intelligence.Senses = 'senses';
        item.Magic.Intelligence.Powers.push('first power');
        item.Magic.Intelligence.Powers.push('second power');
        item.Magic.Intelligence.SpecialPurpose = 'special purpose';
        item.Magic.Intelligence.DedicatedPower = 'dedicated power';
        item.Magic.Intelligence.Personality = 'personality';

        var formattedItem = treasureFormatterService.formatItem(item);
        var lines = formattedItem.split('\n');

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

    it('formats full item with prefix', function () {
        item.Quantity = 2;
        item.Contents.push('first contents');
        item.Contents.push('second contents');
        item.Traits.push('first trait');
        item.Traits.push('second trait');
        item.Attributes.push('first attribute');
        item.Attributes.push('Charged');
        item.Attributes.push('second attribute');
        item.Magic.Bonus = 3;
        item.Magic.SpecialAbilities.push({ Name: 'special ability 1' });
        item.Magic.SpecialAbilities.push({ Name: 'special ability 2' });
        item.Magic.Charges = 4;
        item.Magic.Curse = 'curse';
        item.Magic.Intelligence.Ego = 5;
        item.Magic.Intelligence.IntelligenceStat = 6;
        item.Magic.Intelligence.WisdomStat = 7;
        item.Magic.Intelligence.CharismaStat = 8;
        item.Magic.Intelligence.Alignment = 'alignment';
        item.Magic.Intelligence.Communication.push('empathy');
        item.Magic.Intelligence.Communication.push('telepathy');
        item.Magic.Intelligence.Languages.push('English');
        item.Magic.Intelligence.Languages.push('German');
        item.Magic.Intelligence.Senses = 'senses';
        item.Magic.Intelligence.Powers.push('first power');
        item.Magic.Intelligence.Powers.push('second power');
        item.Magic.Intelligence.SpecialPurpose = 'special purpose';
        item.Magic.Intelligence.DedicatedPower = 'dedicated power';
        item.Magic.Intelligence.Personality = 'personality';

        var formattedItem = treasureFormatterService.formatItem(item, '\t');
        var lines = formattedItem.split('\n');

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