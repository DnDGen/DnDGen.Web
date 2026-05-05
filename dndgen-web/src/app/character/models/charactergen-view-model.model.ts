export class CharacterGenViewModel {
  constructor(
    public alignmentRandomizerTypes: string[],
    public alignments: string[],
    public classNameRandomizerTypes: string[],
    public classNames: string[],
    public levelRandomizerTypes: string[],
    public baseRaceRandomizerTypes: string[],
    public baseRaces: string[],
    public metaraceRandomizerTypes: string[],
    public metaraces: string[],
    public abilitiesRandomizerTypes: string[]
  ) { }
}
