import { Encounter } from "../../encounter/models/encounter.model";
import { DungeonTreasure } from "./dungeonTreasure.model";

export class Pool {
  constructor(
    public encounter: Encounter | null = null,
    public treasure: DungeonTreasure | null = null,
    public magicPower: string = '',
  ) { }
}
