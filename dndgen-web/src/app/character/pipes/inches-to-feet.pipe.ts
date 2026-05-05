import { DecimalPipe } from "@angular/common";
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'inchesToFeet',
    standalone: true
})
export class InchesToFeetPipe implements PipeTransform {
  constructor(private numberPipe: DecimalPipe) {}

  transform(value: number): string {
    var feet = Math.floor(value / 12);
    var inches = value % 12;

    var output = "";

    if (feet > 0)
        output += this.numberPipe.transform(feet) + "'";

    if (inches == 0)
      return output;

    if (output.length > 0)
      output += " ";

    output += inches + '"';

    return output;
  }
}
