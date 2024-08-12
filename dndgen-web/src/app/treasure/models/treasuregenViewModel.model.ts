import type { ItemTypeViewModel } from './itemTypeViewModel.model';

export class TreasureGenViewModel {
  constructor(
    public treasureTypes: string[],
    public maxTreasureLevel: number,
    public itemTypeViewModels: ItemTypeViewModel[],
    public powers: string[],
    itemNames: object
  ) { 
    this.itemNames = new Map<string, string[]>(Object.entries(itemNames));
  }

  public itemNames: Map<string, string[]>;
}
