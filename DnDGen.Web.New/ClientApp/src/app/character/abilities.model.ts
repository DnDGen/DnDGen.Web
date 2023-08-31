import { Ability } from "./ability.model";

export class Abilities {
  constructor(
    public strength: Ability,
    public constitution: Ability | null,
    public dexterity: Ability,
    public intelligence: Ability,
    public wisdom: Ability,
    public charisma: Ability
  ) { }
}
