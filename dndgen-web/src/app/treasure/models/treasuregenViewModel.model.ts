import type { ItemTypeViewModel } from './itemTypeViewModel.model';

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
