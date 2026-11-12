import { CreatureAbility } from "./creature-ability.model";

export class AttackSave {
  constructor(
    public save: string = '',
    public dc: number = 0,
    public baseValue: number = 0,
    public baseAbility?: CreatureAbility | null
  ) { }
}
