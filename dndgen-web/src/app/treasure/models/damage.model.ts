export class Damage {
  constructor(
    public roll: string,
    public type: string,
    public description: string,
    public condition: string,
    public isConditional: boolean,
  ) { }
}
