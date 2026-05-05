import { EncounterDefaults } from "./encounter-defaults.model";

export class EncounterGenViewModel {
  constructor(
    public environments: string[],
    public temperatures: string[],
    public timesOfDay: string[],
    public creatureTypes: string[],
    public defaults: EncounterDefaults,
  ) { }
}
