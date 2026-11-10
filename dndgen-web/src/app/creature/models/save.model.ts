import { Bonus } from "./bonus.model";

export class Save {
  constructor(
    public totalBonus: number = 0,
    public isConditional: boolean = false,
    public hasSave: boolean = true,
    public bonuses: Bonus[] = []
  ) { }
}
