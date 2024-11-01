import { EncounterDefaults } from "./encounterDefaults.model";

export class EncounterGenViewModel {
  constructor(
    public environments: string[],
    public temperatures: string[],
    public timesOfDay: string[],
    public creatureTypes: string[],
    public defaults: EncounterDefaults,
  ) { }
}
