import { Spell } from "./spell.model";
import { SpellQuantity } from "./spellQuantity.model";

export class Magic {
  constructor(
    public animal: string,
    public spellsPerDay: SpellQuantity[],
    public knownSpells: Spell[],
    public preparedSpells: Spell[],
    public arcaneSpellFailure: number
  ) { }
}
