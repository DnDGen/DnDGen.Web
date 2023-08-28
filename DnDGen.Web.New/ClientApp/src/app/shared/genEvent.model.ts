export class GenEvent {
  constructor(
    public source: string,
    public message: string,
    public when: Date
  ) { }
}
