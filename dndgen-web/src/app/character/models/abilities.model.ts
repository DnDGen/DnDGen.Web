import { Ability } from "./ability.model";

export class Abilities {
  constructor(
    public Strength: Ability = new Ability(),
    public Constitution: Ability | null = new Ability(),
    public Dexterity: Ability = new Ability(),
    public Intelligence: Ability = new Ability(),
    public Wisdom: Ability = new Ability(),
    public Charisma: Ability = new Ability()
  ) { }
}
