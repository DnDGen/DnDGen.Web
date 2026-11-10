import { Armor } from "../../treasure/models/armor.model";
import { Item } from "../../treasure/models/item.model";
import { Weapon } from "../../treasure/models/weapon.model";

export class CreatureEquipment {
  constructor(
    public weapons: Weapon[] = [],
    public armor: Armor | null = null,
    public shield: Armor | null = null,
    public items: Item[] = []
  ) { }
}
