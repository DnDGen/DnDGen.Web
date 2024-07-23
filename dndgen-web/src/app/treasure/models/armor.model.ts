import { Item } from "./item.model";
import { Magic } from "./magic.model";

export class Armor extends Item {
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

    public armorBonus: number,
    public size: string,
    public armorCheckPenalty: number,
    public maxDexterityBonus: number,
    public totalArmorBonus: number,
    public totalArmorCheckPenalty: number,
    public totalMaxDexterityBonus: number
  ) {
    super(name, baseNames, itemType, traits, attributes, magic, quantity, contents, isMagical, canBeUsedAsWeaponOrArmor);
  }
}
