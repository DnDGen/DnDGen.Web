import { Contents } from "./contents.model";

export class Area {
  constructor(
    public type: string = '',
    public length: number = 0,
    public width: number = 0,
    public descriptions: string[] = [],
    public contents: Contents = new Contents(),
  ) { }
}
