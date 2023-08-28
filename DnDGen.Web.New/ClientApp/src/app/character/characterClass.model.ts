export class CharacterClass {
  constructor(
    public level: number,
    public isNPC: boolean,
    public name: string,
    public specialistFields: string[],
    public prohibitedFields: string[],
    public effectiveLevel: number,
    public summary: string
  ) { }
}
