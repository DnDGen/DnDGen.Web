import { Measurement } from "./measurement.model";

export class Race {
  constructor(
    public summary: string,
    public baseRace: string = '',
    public metarace: string = '',
    public metaraceSpecies: string = '',
    public isMale: boolean = false,
    public hasWings: boolean = false,
    public size: string = '',
    public challengeRating: number = 0,
    public age: Measurement = new Measurement(''),
    public maximumAge: Measurement = new Measurement(''),
    public height: Measurement = new Measurement(''),
    public weight: Measurement = new Measurement(''),
    public landSpeed: Measurement = new Measurement(''),
    public aerialSpeed: Measurement = new Measurement(''),
    public swimSpeed: Measurement = new Measurement(''),
    public gender: string = '',
  ) { }
}
