import { ArmorClass } from "./armorClass.model";
import { BaseAttack } from "./baseAttack.model";
import { SavingThrows } from "./savingThrows.model";

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
