import { Creature } from "./creature.model";

export class EncounterCreature {
    constructor(
      public creature: Creature,
      public quantity: number,
      public challengeRating: string,
    ) { }
  }
  