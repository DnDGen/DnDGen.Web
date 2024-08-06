export class BaseAttack {
  constructor(
    public baseBonus: number,
    public strengthBonus: number,
    public dexterityBonus: number,
    public sizeModifier: number,
    public racialModifier: number,
    public circumstantialBonus: boolean,
    public rangedBonus: number,
    public meleeBonus: number,
    public allRangedBonuses: number[],
    public allMeleeBonuses: number[]
  ) { }
}
