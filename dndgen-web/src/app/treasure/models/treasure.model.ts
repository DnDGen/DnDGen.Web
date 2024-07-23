import { Coin } from "./coin.model";
import { Good } from "./good.model";
import { Item } from "./item.model";

export class Treasure {
  constructor(
    public coin: Coin,
    public goods: Good[],
    public items: Item[],
    public isAny: boolean
  ) { }
}
