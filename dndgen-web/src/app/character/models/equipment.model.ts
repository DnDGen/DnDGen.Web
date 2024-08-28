import { Armor } from "../../treasure/models/armor.model";
import { Item } from "../../treasure/models/item.model";
import { Treasure } from "../../treasure/models/treasure.model";
import { Weapon } from "../../treasure/models/weapon.model";

export class Equipment {
  constructor(
    public primaryHand: Weapon | null = null,
    public offHand: Item | null = null,
    public armor: Armor | null = null,
    public treasure: Treasure = new Treasure()
  ) { }
}
