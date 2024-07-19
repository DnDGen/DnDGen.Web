import { Intelligence } from "./intelligence.model";
import { SpecialAbility } from "./specialAbility.model";

export class Magic {
  constructor(
    public bonus: number,
    public charges: number,
    public specialAbilities: SpecialAbility[],
    public curse: string,
    public intelligence: Intelligence
  ) { }
}
