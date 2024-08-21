export class BaseAttack {
  constructor(
    public baseBonus: number = 0,
    public strengthBonus: number = 0,
    public dexterityBonus: number = 0,
    public sizeModifier: number = 0,
    public racialModifier: number = 0,
    public circumstantialBonus: boolean = false,
    public rangedBonus: number = 0,
    public meleeBonus: number = 0,
    public allRangedBonuses: number[] = [],
    public allMeleeBonuses: number[] = []
  ) { }
}
