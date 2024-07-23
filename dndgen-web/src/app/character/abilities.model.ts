import { Ability } from "./ability.model";

export class Abilities {
  constructor(
    public Strength: Ability,
    public Constitution: Ability | null,
    public Dexterity: Ability,
    public Intelligence: Ability,
    public Wisdom: Ability,
    public Charisma: Ability
  ) { }
}
