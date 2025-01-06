import { SpellSource } from "./spellSource.model";

export class Spell {
  constructor(
    public sources: SpellSource[],
    public name: string,
    public metamagic: string[] = []
  ) { }
}
