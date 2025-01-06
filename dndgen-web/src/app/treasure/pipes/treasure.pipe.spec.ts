import { DecimalPipe } from "@angular/common";
import { Good } from "../models/good.model";
import { Item } from "../models/item.model";
import { Treasure } from "../models/treasure.model";
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

            var formattedItem = prefix + item.summary + ':\r\n';
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
            expect(lines[3]).toBe('\titem description:');
            expect(lines[4]).toBe('\t\tformatted');
            expect(lines[5]).toBe('\tother item description:');
            expect(lines[6]).toBe('\t\tformatted');
            expect(lines[7]).toBe('');
            expect(lines.length).toBe(8);
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
            expect(lines[5]).toBe('\titem description:');
            expect(lines[6]).toBe('\t\tformatted');
            expect(lines[7]).toBe('\tother item description:');
            expect(lines[8]).toBe('\t\tformatted');
            expect(lines[9]).toBe('');
            expect(lines.length).toBe(10);
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
            expect(lines[5]).toBe('\t\titem description:');
            expect(lines[6]).toBe('\t\t\tformatted');
            expect(lines[7]).toBe('\t\tother item description:');
            expect(lines[8]).toBe('\t\t\tformatted');
            expect(lines[9]).toBe('');
            expect(lines.length).toBe(10);
        });
    });
});