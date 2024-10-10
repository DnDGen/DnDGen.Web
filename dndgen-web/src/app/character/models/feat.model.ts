import { Frequency } from "./frequency.model";

export class Feat {
  constructor(
    public name: string,
    public foci: string[] = [],
    public power: number = 0,
    public frequency: Frequency = new Frequency(),
    public canBeTakenMultipleTimes: boolean = false,
  ) { }
}
