export class SpecialAbility {
  constructor(
    public name: string,
    public baseName: string,
    public power: number,
    public attributeRequirements: string[],
    public bonusEquivalent: number
  ) { }
}
