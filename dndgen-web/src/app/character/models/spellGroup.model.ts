import { Spell } from "./spell.model";

export class SpellGroup {
  constructor(
    public name: string,
    public spells: Spell[] = []
  ) { }
}
