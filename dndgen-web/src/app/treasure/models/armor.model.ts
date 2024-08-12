import { Item } from "./item.model";
import { Magic } from "./magic.model";

export class Armor extends Item {
  constructor(
    public override name: string,
    public override itemType: string,
    public override baseNames: string[] = [],
    public override traits: string[] = [],
    public override attributes: string[] = [],
    public override magic: Magic = new Magic(),
    public override quantity: number = 1,
    public override contents: string[] = [],
    public override isMagical: boolean = false,

    public size: string = '',
    public totalArmorBonus: number = 0,
    public armorBonus: number = 0,
    public armorCheckPenalty: number = 0,
    public maxDexterityBonus: number = 0,
    public totalArmorCheckPenalty: number = 0,
    public totalMaxDexterityBonus: number = 0
  ) {
    super(name, itemType, baseNames, traits, attributes, magic, quantity, contents, isMagical, true);
  }
}
