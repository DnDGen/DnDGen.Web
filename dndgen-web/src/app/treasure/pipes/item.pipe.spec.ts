import { TestHelper } from "../../testHelper.spec";
import { Armor } from "../models/armor.model";
import { Item } from "../models/item.model";
import { SpecialAbility } from "../models/specialAbility.model";
import { Weapon } from "../models/weapon.model";
import { ItemPipe } from "./item.pipe";

describe('Item Pipe', () => {
    describe('unit', () => {
        let pipe: ItemPipe;
        let item: Item;
    
        beforeEach(() => {
            item = createItem('item name');
            pipe = new ItemPipe();
        });
    
        function createItem(itemName: string): Item {
            var item = new Item(itemName, 'MyItemType', `${itemName} summary`);
    
            return item;
        }
    
        it('formats item', () => {
            var formattedItem = pipe.transform(item);
            var lines = formattedItem.split('\r\n');
    
            expect(lines[0]).toBe('item name summary');
            expect(lines[1]).toBe('');
            expect(lines.length).toBe(2);
        });
    
        it('formats item with quantity greater than 1', () => {
            item.quantity = 2;
    
            var formattedItem = pipe.transform(item);
            var lines = formattedItem.split('\r\n');
    
            expect(lines[0]).toBe('item name summary (x2)');
            expect(lines[1]).toBe('');
            expect(lines.length).toBe(2);
        });
    
        it('formats item contents', () => {
            item.contents.push('first contents');
            item.contents.push('second contents');
    
            var formattedItem = pipe.transform(item);
            var lines = formattedItem.split('\r\n');
    
            expect(lines[0]).toBe('item name summary');
            expect(lines[1]).toBe('\tContents:');
            expect(lines[2]).toBe('\t\tfirst contents');
            expect(lines[3]).toBe('\t\tsecond contents');
            expect(lines[4]).toBe('');
            expect(lines.length).toBe(5);
        });
    
        it('formats item traits', () => {
            item.traits.push('first trait');
            item.traits.push('second trait');
    
            var formattedItem = pipe.transform(item);
            var lines = formattedItem.split('\r\n');
    
            expect(lines[0]).toBe('item name summary');
            expect(lines[1]).toBe('\tTraits:');
            expect(lines[2]).toBe('\t\tfirst trait');
            expect(lines[3]).toBe('\t\tsecond trait');
            expect(lines[4]).toBe('');
            expect(lines.length).toBe(5);
        });
    
        it('formats item magic bonus', () => {
            item.magic.bonus = 3;
    
            var formattedItem = pipe.transform(item);
            var lines = formattedItem.split('\r\n');
    
            expect(lines[0]).toBe('item name summary');
            expect(lines[1]).toBe('\tBonus: +3');
            expect(lines[2]).toBe('');
            expect(lines.length).toBe(3);
        });
    
        it('formats item magic special abilities', () => {
            item.magic.bonus = 3;
            item.magic.specialAbilities.push(new SpecialAbility('special ability 1'));
            item.magic.specialAbilities.push(new SpecialAbility('special ability 2'));
    
            var formattedItem = pipe.transform(item);
            var lines = formattedItem.split('\r\n');
    
            expect(lines[0]).toBe('item name summary');
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
    
            var formattedItem = pipe.transform(item);
            var lines = formattedItem.split('\r\n');
    
            expect(lines[0]).toBe('item name summary');
            expect(lines[1]).toBe('\tCharges: 4');
            expect(lines[2]).toBe('');
            expect(lines.length).toBe(3);
        });
    
        it('formats item charges of 0', () => {
            item.attributes.push('Charged');
    
            var formattedItem = pipe.transform(item);
            var lines = formattedItem.split('\r\n');
    
            expect(lines[0]).toBe('item name summary');
            expect(lines[1]).toBe('\tCharges: 0');
            expect(lines[2]).toBe('');
            expect(lines.length).toBe(3);
        });
    
        it('formats item curse', () => {
            item.magic.curse = 'curse';
    
            var formattedItem = pipe.transform(item);
            var lines = formattedItem.split('\r\n');
    
            expect(lines[0]).toBe('item name summary');
            expect(lines[1]).toBe('\tCurse: curse');
            expect(lines[2]).toBe('');
            expect(lines.length).toBe(3);
        });
    
        it('formats armor', () => {
            var armor = new Armor('armor name', 'Armor', 'my armor summary');
            armor.totalArmorBonus = 9266;
            armor.totalArmorCheckPenalty = -90210;
            armor.totalMaxDexterityBonus = 42;
            armor.size = "armor size";
    
            var formattedItem = pipe.transform(armor);
            var lines = formattedItem.split('\r\n');
    
            var expected = [
                'my armor summary',
                '\t' + 'Armor:',
                '\t\t' + 'Size: armor size',
                '\t\t' + 'Armor Bonus: 9266',
                '\t\t' + 'Armor Check Penalty: -90210',
                '\t\t' + 'Max Dexterity Bonus: 42',
                '',
            ];
            TestHelper.expectLines(lines, expected);
        });
    
        it('formats armor with no max dexterity limitation', () => {
            var armor = new Armor('armor name', 'Armor', 'my armor summary');
            armor.totalArmorBonus = 9266;
            armor.totalArmorCheckPenalty = -90210;
            armor.totalMaxDexterityBonus = 9000;
            armor.size = "armor size";
    
            var formattedItem = pipe.transform(armor);
            var lines = formattedItem.split('\r\n');
    
            var expected = [
                'my armor summary',
                '\t' + 'Armor:',
                '\t\t' + 'Size: armor size',
                '\t\t' + 'Armor Bonus: 9266',
                '\t\t' + 'Armor Check Penalty: -90210',
                '',
            ];
            TestHelper.expectLines(lines, expected);
        });
    
        it('formats weapon v1', () => {
            var weapon = new Weapon('weapon name', 'Weapon', 'my weapon summary');
            weapon.size = "weapon size";
            weapon.combatTypes = ["melee", "ranged"];
            weapon.damageDescription = "damage description";
            weapon.threatRangeDescription = "threat range description";
            weapon.criticalDamageDescription = "over 9000";
    
            var formattedItem = pipe.transform(weapon);
            var lines = formattedItem.split('\r\n');
    
            var expected = [
                'my weapon summary',
                '\t' + 'Weapon:',
                '\t\t' + 'Size: weapon size',
                '\t\t' + 'Combat Types: melee, ranged',
                '\t\t' + 'Damage: damage description',
                '\t\t' + 'Threat Range: threat range description',
                '\t\t' + 'Critical Damage: over 9000',
                '',
            ];
            TestHelper.expectLines(lines, expected);
        });
    
        it('formats weapon v2', () => {
            var weapon = new Weapon('weapon name', 'Weapon', 'my weapon summary');
            weapon.size = "weapon size";
            weapon.combatTypes = ["melee", "ranged"];
            weapon.damageSummary = "damage summary";
            weapon.threatRangeSummary = "threat range summary";
            weapon.criticalDamageSummary = "over 9000 summary";
    
            var formattedItem = pipe.transform(weapon);
            var lines = formattedItem.split('\r\n');
    
            var expected = [
                'my weapon summary',
                '\t' + 'Weapon:',
                '\t\t' + 'Size: weapon size',
                '\t\t' + 'Combat Types: melee, ranged',
                '\t\t' + 'Damage: damage summary',
                '\t\t' + 'Threat Range: threat range summary',
                '\t\t' + 'Critical Damage: over 9000 summary',
                '',
            ];
            TestHelper.expectLines(lines, expected);
        });
    
        it('formats double weapon v1', () => {
            var weapon = new Weapon('weapon name', 'Weapon', 'my weapon summary');
            weapon.size = "weapon size";
            weapon.combatTypes = ["melee", "ranged"];
            weapon.damageDescription = "damage description";
            weapon.threatRangeDescription = "threat range description";
            weapon.criticalDamageDescription = "over 9000";
            weapon.isDoubleWeapon = true;
            weapon.secondaryDamageDescription = 'secondary damage description';
            weapon.secondaryCriticalDamageDescription = 'finish him';
    
            var formattedItem = pipe.transform(weapon);
            var lines = formattedItem.split('\r\n');
    
            var expected = [
                'my weapon summary',
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
            TestHelper.expectLines(lines, expected);
        });
    
        it('formats double weapon v2', () => {
            var weapon = new Weapon('weapon name', 'Weapon', 'my weapon summary');
            weapon.size = "weapon size";
            weapon.combatTypes = ["melee", "ranged"];
            weapon.damageSummary = "damage summary";
            weapon.threatRangeSummary = "threat range summary";
            weapon.criticalDamageSummary = "over 9000 summary";
            weapon.isDoubleWeapon = true;
            weapon.secondaryDamageSummary = 'secondary damage summary';
            weapon.secondaryCriticalDamageSummary = 'finish him summary';
    
            var formattedItem = pipe.transform(weapon);
            var lines = formattedItem.split('\r\n');
    
            var expected = [
                'my weapon summary',
                '\t' + 'Weapon:',
                '\t\t' + 'Size: weapon size',
                '\t\t' + 'Combat Types: melee, ranged',
                '\t\t' + 'Damage: damage summary',
                '\t\t' + 'Secondary Damage: secondary damage summary',
                '\t\t' + 'Threat Range: threat range summary',
                '\t\t' + 'Critical Damage: over 9000 summary',
                '\t\t' + 'Secondary Critical Damage: finish him summary',
                '',
            ];
            TestHelper.expectLines(lines, expected);
        });
    
        it('formats weapon requiring ammunition', () => {
            var weapon = new Weapon('weapon name', 'Weapon', 'my weapon summary');
            weapon.size = "weapon size";
            weapon.combatTypes = ["ranged"];
            weapon.damageDescription = "damage description";
            weapon.threatRangeDescription = "threat range description";
            weapon.criticalDamageDescription = "over 9000";
            weapon.ammunition = "needed ammo";
    
            var formattedItem = pipe.transform(weapon);
            var lines = formattedItem.split('\r\n');
    
            var expected = [
                'my weapon summary',
                '\t' + 'Weapon:',
                '\t\t' + 'Size: weapon size',
                '\t\t' + 'Combat Types: ranged',
                '\t\t' + 'Damage: damage description',
                '\t\t' + 'Threat Range: threat range description',
                '\t\t' + 'Critical Damage: over 9000',
                '\t\t' + 'Ammunition Used: needed ammo',
                '',
            ];
            TestHelper.expectLines(lines, expected);
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
    
            var formattedItem = pipe.transform(item);
            var lines = formattedItem.split('\r\n');
    
            expect(lines[0]).toBe('item name summary');
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
    
            var formattedItem = pipe.transform(item);
            var lines = formattedItem.split('\r\n');
    
            expect(lines[0]).toBe('item name summary');
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
    
            var formattedItem = pipe.transform(item);
            var lines = formattedItem.split('\r\n');
    
            expect(lines[0]).toBe('item name summary');
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
    
            var formattedItem = pipe.transform(item);
            var lines = formattedItem.split('\r\n');
    
            expect(lines[0]).toBe('item name summary');
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
    
            var formattedItem = pipe.transform(item);
            var lines = formattedItem.split('\r\n');
    
            expect(lines[0]).toBe('item name summary (x2)');
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
    
            var formattedItem = pipe.transform(item, '\t');
            var lines = formattedItem.split('\r\n');
    
            expect(lines[0]).toBe('\titem name summary (x2)');
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