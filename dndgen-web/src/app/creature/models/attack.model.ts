import { Frequency } from "../../character/models/frequency.model";
import { AttackSave } from "./attack-save.model";

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
    public attackBonuses: number[] = [],
    public damageSummary: string = '',
    public damageEffect: string = '',
    public frequency: Frequency = new Frequency(),
    public maxNumberOfAttacks: number = 1,
    public save?: AttackSave | null
  ) { }
}
