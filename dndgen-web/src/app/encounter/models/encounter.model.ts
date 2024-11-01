import { Character } from "../../character/models/character.model";
import { Treasure } from "../../treasure/models/treasure.model";
import { EncounterCreature } from "./encounterCreature.model";

export class Encounter {
    constructor(
      public description: string,
      public creatures: EncounterCreature[] = [],
      public characters: Character[] = [],
      public treasures: Treasure[] = [],
      public targetEncounterLevel: number = 0,
      public averageEncounterLevel: number = 0,
      public actualEncounterLevel: number = 0,
      public averageDifficulty: string = '',
      public actualDifficulty: string = '',
    ) { }
  }
  