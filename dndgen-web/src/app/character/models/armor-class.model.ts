export class ArmorClass {
  constructor(
    public baseArmorClass: number = 0,
    public circumstantialBonus: boolean = false,
    public armorBonus: number = 0,
    public shieldBonus: number = 0,
    public sizeModifier: number = 0,
    public deflectionBonus: number = 0,
    public naturalArmorBonus: number = 0,
    public adjustedDexterityBonus: number = 0,
    public dodgeBonus: number = 0,
    public full: number = 0,
    public touch: number = 0,
    public flatFooted: number = 0
  ) { }
}
