import { Bonus } from "./bonus.model";
import { HitDice } from "./hit-dice.model";

export class HitPoints {
  constructor(
    public total: number = 0,
    public defaultTotal: number = 0,
    public hitDiceQuantity: number = 0,
    public roundedHitDiceQuantity: number = 0,
    public hitDice: HitDice[] = [],
    public defaultRoll: string = '',
    public conditionalBonuses: Bonus[] = [],
    public summary: string = ''
  ) { }
}
