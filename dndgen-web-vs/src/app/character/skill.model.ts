import { Ability } from "./ability.model";

export class Skill {
  constructor(
    public name: string,
    public baseAbility: Ability,
    public focus: string,
    public bonus: number,
    public classSkill: boolean,
    public armorCheckPenalty: number,
    public circumstantialBonus: boolean,
    public rankCap: number,
    public hasArmorCheckPenalty: boolean,
    public effectiveRanks: number,
    public ranksMaxedOut: boolean,
    public ranks: number,
    public qualifiesForSkillSynergy: boolean,
    public totalBonus: number
  ) { }
}
