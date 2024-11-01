import { Ability } from "./ability.model";

export class Skill {
  constructor(
    public name: string,
    public focus: string,
    public totalBonus: number,
    public circumstantialBonus: boolean,
    public effectiveRanks: number,
    public baseAbility: Ability,
    public bonus: number,
    public armorCheckPenalty: number,
    public classSkill: boolean = false,
    public rankCap: number = 0,
    public hasArmorCheckPenalty: boolean = false,
    public ranksMaxedOut: boolean = false,
    public ranks: number = 0,
    public qualifiesForSkillSynergy: boolean = false,
  ) { }
}
