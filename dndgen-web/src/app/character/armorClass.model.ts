export class ArmorClass {
  constructor(
    public baseArmorClass: number,
    public circumstantialBonus: boolean,
    public armorBonus: number,
    public shieldBonus: number,
    public sizeModifier: number,
    public deflectionBonus: number,
    public naturalArmorBonus: number,
    public adjustedDexterityBonus: number,
    public dodgeBonus: number,
    public full: number,
    public touch: number,
    public flatFooted: number
  ) { }
}
