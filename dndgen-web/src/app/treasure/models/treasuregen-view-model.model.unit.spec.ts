import { describe, it, expect } from 'vitest';
import { ItemTypeViewModel } from './item-type-view-model.model';
import { TreasureGenViewModel } from './treasuregen-view-model.model';

describe('TreasureGenViewModel', () => {
  describe('unit', () => {
      let viewmodel: TreasureGenViewModel;

      it('initializes the treasure view model', () => {
          viewmodel = new TreasureGenViewModel(
            ['treasure type 1', 'treasure type 2'],
            9266,
            [
                new ItemTypeViewModel('MyItemType', 'My Item Type'),
                new ItemTypeViewModel('MyOtherItemType', 'My Other Item Type'),
            ],
            ['power 1', 'power 2'],
            {
              "MyItemType": ['item 1', 'item 2'],
              "MyOtherItemType": ['item 3', 'item 4'],
            });

          expect(viewmodel.treasureTypes).toEqual(['treasure type 1', 'treasure type 2']);
          expect(viewmodel.maxTreasureLevel).toEqual(9266);
          expect(viewmodel.itemTypeViewModels).toEqual([
            new ItemTypeViewModel('MyItemType', 'My Item Type'),
            new ItemTypeViewModel('MyOtherItemType', 'My Other Item Type'),
          ]);
          expect(viewmodel.powers).toEqual(['power 1', 'power 2']);
          expect(viewmodel.itemNames['MyItemType']).toBeDefined();
          expect(viewmodel.itemNames['MyItemType']).toEqual(['item 1', 'item 2']);
          expect(viewmodel.itemNames['MyOtherItemType']).toBeDefined();
          expect(viewmodel.itemNames['MyOtherItemType']).toEqual(['item 3', 'item 4']);
      });
  });
});