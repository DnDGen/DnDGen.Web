export class SpecialAbility {
  constructor(
    public name: string,
    public baseName: string = '',
    public power: number = 0,
    public attributeRequirements: string[] = [],
    public bonusEquivalent: number = 0
  ) { }
}
