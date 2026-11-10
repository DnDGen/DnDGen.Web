import { Frequency } from "../../character/models/frequency.model";
import { Bonus } from "./bonus.model";

export class Attack {
  constructor(
    public name: string,
    public attackType: string = '',
    public isMelee: boolean = true,
    public isNatural: boolean = false,
    public isPrimary: boolean = true,
    public isSpecial: boolean = false,
    public totalAttackBonus: number = 0,
    public fullAttackBonuses: number[] = [],
    public attackBonuses: Bonus[] = [],
    public damageSummary: string = '',
    public damageEffect: string = '',
    public frequency: Frequency = new Frequency(),
    public maxNumberOfAttacks: number = 1
  ) { }
}
