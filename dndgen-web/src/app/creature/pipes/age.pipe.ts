import { Pipe, PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { CreatureMeasurement } from '../models/creature-measurement.model';

@Pipe({
  name: 'age',
  standalone: true
})
export class AgePipe implements PipeTransform {
  constructor(private numberPipe: DecimalPipe) { }

  transform(age: CreatureMeasurement): string {
    if (age.value == 0)
      return age.description;

    const formatted = `${this.formatValue(age.value)} ${age.unit}`;

    if (!age.description)
      return formatted;

    return `${formatted} (${age.description})`;
  }

  private formatValue(value: number): string {
    if (value < 1)
      return 'less than 1';

    return this.numberPipe.transform(Math.floor(value))!;
  }
}
