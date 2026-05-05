import { EncounterDefaults } from "../../encounter/models/encounter-defaults.model";

export class DungeonGenViewModel {
  constructor(
    public environments: string[],
    public temperatures: string[],
    public timesOfDay: string[],
    public creatureTypes: string[],
    public defaults: EncounterDefaults,
  ) { }
}
