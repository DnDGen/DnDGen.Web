import { Item } from "./item.model";
import { Magic } from "./magic.model";

export class Weapon extends Item {
  constructor(
    public override name: string,
    public override baseNames: string[],
    public override itemType: string,
    public override traits: string[],
    public override attributes: string[],
    public override magic: Magic,
    public override quantity: number,
    public override contents: string[],
    public override isMagical: boolean,
    public override canBeUsedAsWeaponOrArmor: boolean,

    public ammunition: string,
    public criticalMultiplier: string,
    public damage: string,
    public damageType: string,
    public size: string,
    public threatRange: string,
    public combatTypes: string[]
  ) {
    super(name, itemType, baseNames, traits, attributes, magic, quantity, contents, isMagical, canBeUsedAsWeaponOrArmor);
  }
}
