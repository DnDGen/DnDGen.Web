import { Armor } from "../treasure/armor.model";
import { Item } from "../treasure/item.model";
import { Treasure } from "../treasure/treasure.model";
import { Weapon } from "../treasure/weapon.model";

export class Equipment {
  constructor(
    public primaryHand: Weapon,
    public offHand: Item,
    public armor: Armor,
    public treasure: Treasure
  ) { }
}
