import { CreatureSpell } from "./creature-spell.model";
import { CreatureSpellQuantity } from "./creature-spell-quantity.model";

export class CreatureMagic {
  constructor(
    public caster: string = '',
    public casterLevel: number = 0,
    public arcaneSpellFailure: number = 0,
    public domains: string[] = [],
    public spellsPerDay: CreatureSpellQuantity[] = [],
    public knownSpells: CreatureSpell[] = [],
    public preparedSpells: CreatureSpell[] = []
  ) { }
}
