export class Spell {
  constructor(
    public source: string,
    public level: number,
    public name: string,
    public metamagic: string[] = []
  ) { }
}
