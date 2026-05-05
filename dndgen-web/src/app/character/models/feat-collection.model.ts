import { Feat } from "./feat.model";

export class FeatCollection {
  public "class": Feat[]
  constructor(
    public racial: Feat[] = [],
    classParam: Feat[] = [],
    public additional: Feat[] = [],
    public all: Feat[] = []
  ) {
    this.class = classParam;
  }
}
