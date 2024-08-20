import { Intelligence } from "./intelligence.model";
import { SpecialAbility } from "./specialAbility.model";

export class Magic {
  constructor(
    public bonus: number = 0,
    public charges: number = 0,
    public specialAbilities: SpecialAbility[] = [],
    public curse: string = '',
    public intelligence: Intelligence = new Intelligence()
  ) { }
}
