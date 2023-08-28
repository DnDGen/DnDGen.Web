import { Item } from "../treasure/item.model";

export class Equipment {
  constructor(
    public primaryHand: Weapon,
    public offHand: Item,
    public armor: Armor,
    public treasure: Treasure
  ) { }
}
