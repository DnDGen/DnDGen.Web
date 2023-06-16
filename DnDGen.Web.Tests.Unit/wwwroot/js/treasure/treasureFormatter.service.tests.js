'use strict'

describe('Treasure Formatter Service', function () {
    var treasureFormatterService;
    var treasure;
    var item;

    beforeEach(module('app.treasure'));

    beforeEach(function () {
        treasure = getMock('treasure');
        item = createItem('item name');
    });

    function createGood(description, value) {
        var good = getMock('good');
        good.description = description;
        good.valueInGold = value;

        return good;
    }

    function createItem(itemName) {
        var item = getMock('item');
        item.Name = itemName;

        return item;
    }

    beforeEach(inject(function (_treasureFormatterService_) {
        treasureFormatterService = _treasureFormatterService_;
    }));

    it('formats empty treaure', function () {
        treasure.isAny = false;
        treasure.coin.quantity = 9266;
        treasure.coin.currency = 'munny';

        var formattedTreasure = treasureFormatterService.formatTreasure(treasure);
        var lines = formattedTreasure.split('\r\n');

        expect(lines[0]).toBe('');
        expect(lines.length).toBe(1);
    });

    it('formats coin', function () {
        treasure.isAny = true;
        treasure.coin.quantity = 9266;
        treasure.coin.currency = 'munny';

        var formattedTreasure = treasureFormatterService.formatTreasure(treasure);
        var lines = formattedTreasure.split('\r\n');

        expect(lines[0]).toBe('9,266 munny');
        expect(lines[1]).toBe('');
        expect(lines.length).toBe(2);
    });

    it('formats goods', function () {
        treasure.isAny = true;
        treasure.goods.push(createGood('description 1', 90210));
        treasure.goods.push(createGood('description 2', 42));

        var formattedTreasure = treasureFormatterService.formatTreasure(treasure);
        var lines = formattedTreasure.split('\r\n');

        expect(lines[0]).toBe('Goods:');
        expect(lines[1]).toBe('\tdescription 1 (90,210gp)');
        expect(lines[2]).toBe('\tdescription 2 (42gp)');
        expect(lines[3]).toBe('');
        expect(lines.length).toBe(4);
    });

    it('formats items', function () {
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
        item.magic.specialAbilities.push({ Name: 'special ability 1' });
        item.magic.specialAbilities.push({ Name: 'special ability 2' });
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
        item.magic.specialAbilities.push({ Name: 'special ability 1' });
        item.magic.specialAbilities.push({ Name: 'special ability 2' });
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
        item.magic.specialAbilities.push({ Name: 'special ability 1' });
        item.magic.specialAbilities.push({ Name: 'special ability 2' });
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
        var lines = formattedItem.split('\r\n');

        expect(lines[0]).toBe('item name');
        expect(lines[1]).toBe('');
        expect(lines.length).toBe(2);
    });

    it('formats item with quantity greater than 1', function () {
        item.quantity = 2;

        var formattedItem = treasureFormatterService.formatItem(item);
        var lines = formattedItem.split('\r\n');

        expect(lines[0]).toBe('item name (x2)');
        expect(lines[1]).toBe('');
        expect(lines.length).toBe(2);
    });

    it('formats item contents', function () {
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

    it('formats item traits', function () {
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

    it('formats item magic bonus', function () {
        item.magic.bonus = 3;

        var formattedItem = treasureFormatterService.formatItem(item);
        var lines = formattedItem.split('\r\n');

        expect(lines[0]).toBe('item name');
        expect(lines[1]).toBe('\tBonus: +3');
        expect(lines[2]).toBe('');
        expect(lines.length).toBe(3);
    });

    it('formats item magic special abilities', function () {
        item.magic.bonus = 3;
        item.magic.specialAbilities.push({ Name: 'special ability 1' });
        item.magic.specialAbilities.push({ Name: 'special ability 2' });

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

    it('formats item charges', function () {
        item.magic.charges = 4;
        item.attributes.push('Charged');

        var formattedItem = treasureFormatterService.formatItem(item);
        var lines = formattedItem.split('\r\n');

        expect(lines[0]).toBe('item name');
        expect(lines[1]).toBe('\tCharges: 4');
        expect(lines[2]).toBe('');
        expect(lines.length).toBe(3);
    });

    it('formats item charges of 0', function () {
        item.attributes.push('Charged');

        var formattedItem = treasureFormatterService.formatItem(item);
        var lines = formattedItem.split('\r\n');

        expect(lines[0]).toBe('item name');
        expect(lines[1]).toBe('\tCharges: 0');
        expect(lines[2]).toBe('');
        expect(lines.length).toBe(3);
    });

    it('formats item curse', function () {
        item.magic.curse = 'curse';

        var formattedItem = treasureFormatterService.formatItem(item);
        var lines = formattedItem.split('\r\n');

        expect(lines[0]).toBe('item name');
        expect(lines[1]).toBe('\tCurse: curse');
        expect(lines[2]).toBe('');
        expect(lines.length).toBe(3);
    });

    it('formats armor', function () {
        var armor = getMock('armor');
        armor.name = "armor name";
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

    it('formats armor with no max dexterity limitation', function () {
        var armor = getMock('armor');
        armor.name = "armor name";
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

    it('formats weapon', function () {
        var weapon = getMock('weapon');
        weapon.name = "weapon name";
        weapon.size = "weapon size";
        weapon.combatTypes = ["melee", "ranged"];
        weapon.damage = "weapon damage";
        weapon.damageType = "damage type";
        weapon.threatRange = "threat range";
        weapon.criticalMultiplier = "over 9000";

        var formattedItem = treasureFormatterService.formatItem(weapon);
        var lines = formattedItem.split('\r\n');

        var expected = [
            'weapon name',
            '\t' + 'Weapon:',
            '\t\t' + 'Size: weapon size',
            '\t\t' + 'Combat Types: melee, ranged',
            '\t\t' + 'Damage: weapon damage',
            '\t\t' + 'Damage Type: damage type',
            '\t\t' + 'Threat Range: threat range',
            '\t\t' + 'Critical Multiplier: over 9000',
            '',
        ];

        for (var i = 0; i < lines.length; i++) {
            expect(lines[i]).toBe(expected[i]);
        }

        expect(lines.length).toBe(expected.length);
    });

    it('formats weapon requiring ammunition', function () {
        var weapon = getMock('weapon');
        weapon.name = "weapon name";
        weapon.size = "weapon size";
        weapon.combatTypes = ["ranged"];
        weapon.damage = "weapon damage";
        weapon.damageType = "damage type";
        weapon.threatRange = "threat range";
        weapon.criticalMultiplier = "over 9000";
        weapon.ammunition = "needed ammo";

        var formattedItem = treasureFormatterService.formatItem(weapon);
        var lines = formattedItem.split('\r\n');

        var expected = [
            'weapon name',
            '\t' + 'Weapon:',
            '\t\t' + 'Size: weapon size',
            '\t\t' + 'Combat Types: ranged',
            '\t\t' + 'Damage: weapon damage',
            '\t\t' + 'Damage Type: damage type',
            '\t\t' + 'Threat Range: threat range',
            '\t\t' + 'Critical Multiplier: over 9000',
            '\t\t' + 'Ammunition Used: needed ammo',
            '',
        ];

        for (var i = 0; i < lines.length; i++) {
            expect(lines[i]).toBe(expected[i]);
        }

        expect(lines.length).toBe(expected.length);
    });

    it('formats item intelligence', function () {
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

    it('formats item intelligence languages', function () {
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

    it('formats item intelligence special purpose', function () {
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

    it('formats intelligence personality', function () {
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

    it('formats full item', function () {
        item.quantity = 2;
        item.contents.push('first contents');
        item.contents.push('second contents');
        item.traits.push('first trait');
        item.traits.push('second trait');
        item.attributes.push('first attribute');
        item.attributes.push('Charged');
        item.attributes.push('second attribute');
        item.magic.bonus = 3;
        item.magic.specialAbilities.push({ Name: 'special ability 1' });
        item.magic.specialAbilities.push({ Name: 'special ability 2' });
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

    it('formats full item with prefix', function () {
        item.quantity = 2;
        item.contents.push('first contents');
        item.contents.push('second contents');
        item.traits.push('first trait');
        item.traits.push('second trait');
        item.attributes.push('first attribute');
        item.attributes.push('Charged');
        item.attributes.push('second attribute');
        item.magic.bonus = 3;
        item.magic.specialAbilities.push({ Name: 'special ability 1' });
        item.magic.specialAbilities.push({ Name: 'special ability 2' });
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