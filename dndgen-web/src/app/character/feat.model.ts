import { Frequency } from "./frequency.model";

export class Feat {
  constructor(
    public name: string,
    public foci: string[],
    public power: number,
    public frequency: Frequency,
    public canBeTakenMultipleTimes: boolean
  ) { }
}
