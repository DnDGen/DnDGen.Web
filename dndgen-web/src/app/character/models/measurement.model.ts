export class Measurement {
  constructor(
    public description: string,
    public unit: string = '',
    public value: number = 0,
  ) { }
}
