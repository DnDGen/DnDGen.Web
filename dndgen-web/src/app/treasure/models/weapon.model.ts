import { Item } from "./item.model";
import { Magic } from "./magic.model";

export class Weapon extends Item {
  constructor(
    public name: string,
    public baseNames: string[],
    public itemType: string,
    public traits: string[],
    public attributes: string[],
    public magic: Magic,
    public quantity: number,
    public contents: string[],
    public isMagical: boolean,
    public canBeUsedAsWeaponOrArmor: boolean,

    public ammunition: string,
    public criticalMultiplier: string,
    public damage: string,
    public damageType: string,
    public size: string,
    public threatRange: string,
    public combatTypes: string[]
  ) {
    super(name, baseNames, itemType, traits, attributes, magic, quantity, contents, isMagical, canBeUsedAsWeaponOrArmor);
  }
}
