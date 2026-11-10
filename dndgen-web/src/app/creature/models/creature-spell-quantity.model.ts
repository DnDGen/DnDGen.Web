export class CreatureSpellQuantity {
  constructor(
    public source: string,
    public level: number,
    public quantity: number,
    public bonusSpells: number = 0,
    public hasDomainSpell: boolean = false,
    public totalQuantity: number = 0
  ) { }
}
