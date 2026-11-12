import { Bonus } from "./bonus.model";
import { CreatureAbility } from "./creature-ability.model";

export class CreatureSkill {
  constructor(
    public name: string,
    public focus: string = '',
    public totalBonus: number = 0,
    public ranks: number = 0,
    public effectiveRanks: number = 0,
    public classSkill: boolean = false,
    public circumstantialBonus: boolean = false,
    public armorCheckPenalty: number = 0,
    public hasArmorCheckPenalty: boolean = false,
    public baseAbility: CreatureAbility = new CreatureAbility(),
    public bonuses: Bonus[] = []
  ) { }
}
