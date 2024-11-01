import { Pipe, PipeTransform } from "@angular/core";
import { Measurement } from "../../character/models/measurement.model";
import { InchesToFeetPipe } from "./inchesToFeet.pipe";
import { DecimalPipe } from "@angular/common";

@Pipe({
    name: 'measurement',
    standalone: true
})
export class MeasurementPipe implements PipeTransform {
  private inchesUnit = 'inches';

  constructor(private numberPipe: DecimalPipe, private inchesToFeetPipe: InchesToFeetPipe) {}

  transform(value: Measurement): string {
    if (value.value == 0)
      return value.description;

    const transformedValue = this.numberPipe.transform(value.value);
    let measurement = `${transformedValue} ${value.unit}`;

    if (value.unit.toLowerCase() == this.inchesUnit)
      measurement = this.inchesToFeetPipe.transform(value.value);

    if (value.description)
      measurement += ` (${value.description})`;

    return measurement;
  }
}
