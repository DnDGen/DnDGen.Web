import { Item } from "./item.model";
import { Magic } from "./magic.model";

export class Armor extends Item {
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

    public armorBonus: number,
    public size: string,
    public armorCheckPenalty: number,
    public maxDexterityBonus: number,
    public totalArmorBonus: number,
    public totalArmorCheckPenalty: number,
    public totalMaxDexterityBonus: number
  ) {
    super(name, itemType, baseNames, traits, attributes, magic, quantity, contents, isMagical, canBeUsedAsWeaponOrArmor);
  }
}
