import { Feat } from "./feat.model";

export class FeatCollection {
  constructor(
    public racial: Feat[],
    public Class: Feat[],
    public additional: Feat[],
    public all: Feat[]
  ) { }
}
