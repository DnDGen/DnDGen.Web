import { Measurement } from "../../shared/models/measurement.model";

export class Demographics {
  constructor(
    public gender: string = '',
    public age: Measurement = new Measurement(),
    public maximumAge: Measurement = new Measurement(),
    public height: Measurement = new Measurement(),
    public length: Measurement = new Measurement(),
    public weight: Measurement = new Measurement(),
    public wingspan: Measurement = new Measurement(),
    public skin: string = '',
    public hair: string = '',
    public eyes: string = '',
    public other: string = ''
  ) { }
}
