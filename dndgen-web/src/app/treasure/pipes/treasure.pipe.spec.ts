import { DecimalPipe } from "@angular/common";
import { Armor } from "../models/armor.model";
import { Good } from "../models/good.model";
import { Item } from "../models/item.model";
import { SpecialAbility } from "../models/specialAbility.model";
import { Treasure } from "../models/treasure.model";
import { Weapon } from "../models/weapon.model";
import { TreasurePipe } from "./treasure.pipe";
import { ItemPipe } from "./item.pipe";

describe('Treasure Pipe', () => {
    describe('unit', () => {
        let pipe: TreasurePipe;
        let treasure: Treasure;
        let itemPipeSpy: jasmine.SpyObj<ItemPipe>;
    
        beforeEach(() => {
            treasure = new Treasure();

            const numberPipe = new DecimalPipe('en-US');
            itemPipeSpy = jasmine.createSpyObj('ItemPipe', ['transform']);

            pipe = new TreasurePipe(itemPipeSpy, numberPipe);

            itemPipeSpy.transform.and.callFake(formatItem);
        });
    
        function formatItem(item: Item, prefix: string): string {
            if (!prefix)
                prefix = '';

            var formattedItem = prefix + item.description + '\r\n';
            formattedItem += prefix + '\tformatted\r\n';

            return formattedItem;
        }
    
        function createGood(description: string, value: number): Good {
            return new Good(description, value);
        }
    
        function createItem(description: string): Item {
            var item = new Item('my item name', 'MyItemType', description);
    
            return item;
        }
    
        it('formats empty treaure', () => {    
            var formattedTreasure = pipe.transform(treasure);
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
    
            var formattedTreasure = pipe.transform(treasure);
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
    
            var formattedTreasure = pipe.transform(treasure);
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
    
            treasure.items.push(createItem('item description'));
            treasure.items.push(createItem('other item description'));
    
            var formattedTreasure = pipe.transform(treasure);
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
    
            treasure.coin.quantity = 9266;
            treasure.coin.currency = 'munny';
            treasure.goods.push(createGood('description 1', 90210));
            treasure.goods.push(createGood('description 2', 42));
            treasure.items.push(createItem('item description'));
            treasure.items.push(createItem('other item description'));
    
            var formattedTreasure = pipe.transform(treasure);
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
    
            treasure.coin.quantity = 9266;
            treasure.coin.currency = 'munny';
            treasure.goods.push(createGood('description 1', 90210));
            treasure.goods.push(createGood('description 2', 42));
            treasure.items.push(createItem('item description'));
            treasure.items.push(createItem('other item description'));
    
            var formattedTreasure = pipe.transform(treasure, '\t');
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
    });
});