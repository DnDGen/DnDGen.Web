import { CreatureMeasurement } from "./creature-measurement.model";

export class Demographics {
  constructor(
    public gender: string = '',
    public age: CreatureMeasurement = new CreatureMeasurement(),
    public maximumAge: CreatureMeasurement = new CreatureMeasurement(),
    public height: CreatureMeasurement = new CreatureMeasurement(),
    public length: CreatureMeasurement = new CreatureMeasurement(),
    public weight: CreatureMeasurement = new CreatureMeasurement(),
    public wingspan: CreatureMeasurement = new CreatureMeasurement(),
    public skin: string = '',
    public hair: string = '',
    public eyes: string = '',
    public other: string = ''
  ) { }
}
