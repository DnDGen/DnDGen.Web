import type { ItemTypeViewModel } from './item-type-view-model.model';

export class TreasureGenViewModel {
  constructor(
    public treasureTypes: string[],
    public maxTreasureLevel: number,
    public itemTypeViewModels: ItemTypeViewModel[],
    public powers: string[],
    public itemNames: { [key: string]: any }
  ) {
  }
}
