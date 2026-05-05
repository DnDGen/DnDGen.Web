export class CharacterClass {
  constructor(
    public summary: string,
    public level: number = 0,
    public isNPC: boolean = false,
    public name: string = '',
    public specialistFields: string[] = [],
    public prohibitedFields: string[] = [],
    public effectiveLevel: number = 0,
  ) { }
}
