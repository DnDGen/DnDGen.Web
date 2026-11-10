import { Bonus } from "./bonus.model";

export class CreatureArmorClass {
  constructor(
    public totalBonus: number = 10,
    public touchBonus: number = 10,
    public flatFootedBonus: number = 10,
    public isConditional: boolean = false,
    public sizeModifier: number = 0,
    public dexterityBonus: number = 0,
    public armorBonus: number = 0,
    public shieldBonus: number = 0,
    public naturalArmorBonus: number = 0,
    public deflectionBonus: number = 0,
    public dodgeBonus: number = 0,
    public bonuses: Bonus[] = []
  ) { }
}
