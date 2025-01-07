import { Magic } from "./magic.model";

export class Item {
  constructor(
    public name: string,
    public itemType: string,
    public summary: string = '',
    public baseNames: string[] = [],
    public traits: string[] = [],
    public attributes: string[] = [],
    public magic: Magic = new Magic(),
    public quantity: number = 1,
    public contents: string[] = [],
    public isMagical: boolean = false,
    public canBeUsedAsWeaponOrArmor: boolean = false
  ) { }
}
