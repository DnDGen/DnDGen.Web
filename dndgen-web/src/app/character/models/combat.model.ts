import { ArmorClass } from "./armor-class.model";
import { BaseAttack } from "./base-attack.model";
import { SavingThrows } from "./saving-throws.model";

export class Combat {
  constructor(
    public armorClass: ArmorClass = new ArmorClass(),
    public savingThrows: SavingThrows = new SavingThrows(),
    public hitPoints: number = 0,
    public baseAttack: BaseAttack = new BaseAttack(),
    public adjustedDexterityBonus: number = 0,
    public initiativeBonus: number = 0
  ) { }
}
