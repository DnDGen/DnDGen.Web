import { Coin } from "./coin.model";
import { Good } from "./good.model";
import { Item } from "./item.model";

export class Treasure {
  constructor(
    public isAny: boolean = false,
    public coin: Coin = new Coin(),
    public goods: Good[] = [],
    public items: Item[] = [],
  ) { }
}
