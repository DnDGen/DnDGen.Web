import { Measurement } from "./measurement.model";

export class Race {
  constructor(
    public baseRace: string,
    public metarace: string,
    public metaraceSpecies: string,
    public isMale: boolean,
    public hasWings: boolean,
    public size: string,
    public challengeRating: number,
    public age: Measurement,
    public maximumAge: Measurement,
    public height: Measurement,
    public weight: Measurement,
    public landSpeed: Measurement,
    public aerialSpeed: Measurement,
    public swimSpeed: Measurement,
    public gender: string,
    public summary: string
  ) { }
}
