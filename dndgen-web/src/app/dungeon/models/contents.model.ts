import { Encounter } from "../../encounter/models/encounter.model";
import { DungeonTreasure } from "./dungeonTreasure.model";
import { Pool } from "./pool.model";
import { Trap } from "./trap.model";

export class Contents {
  constructor(
    public encounters: Encounter[] = [],
    public treasures: DungeonTreasure[] = [],
    public miscellaneous: string[] = [],
    public traps: Trap[] = [],
    public pool: Pool | null = null,
    public isEmpty: boolean = true,
  ) { }
}
