import { ArmorClass } from "./armorClass.model";
import { BaseAttack } from "./baseAttack.model";
import { SavingThrows } from "./savingThrows.model";

export class Combat {
  constructor(
    public armorClass: ArmorClass,
    public savingThrows: SavingThrows,
    public hitPoints: number,
    public baseAttack: BaseAttack,
    public adjustedDexterityBonus: number,
    public initiativeBonus: number
  ) { }
}
