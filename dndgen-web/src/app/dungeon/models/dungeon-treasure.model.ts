import { Treasure } from "../../treasure/models/treasure.model";

export class DungeonTreasure {
  constructor(
    public container: string = '',
    public treasure: Treasure = new Treasure(),
    public concealment: string = '',
  ) { }
}
