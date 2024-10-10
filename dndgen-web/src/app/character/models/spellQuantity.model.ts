export class SpellQuantity {
  constructor(
    public source: string,
    public level: number,
    public quantity: number,
    public hasDomainSpell: boolean = false
  ) { }
}
