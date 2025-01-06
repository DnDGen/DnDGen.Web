export class Spell {
  constructor(
    public sources: { [source: string]: number; },
    public name: string,
    public metamagic: string[] = []
  ) { }
}
