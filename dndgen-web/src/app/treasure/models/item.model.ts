import { Magic } from "./magic.model";

export class Item {
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
    public canBeUsedAsWeaponOrArmor: boolean
  ) { }
}
