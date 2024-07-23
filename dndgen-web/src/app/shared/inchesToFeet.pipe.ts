import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: 'inchesToFeet' })
export class InchesToFeetPipe implements PipeTransform {
  transform(value: number): string {
    var feet = Math.floor(value / 12);
    var inches = value % 12;

    var output = "";

    if (feet > 0)
        output += feet + "'";

    if (inches > 0 || feet == 0) {
        if (output.length > 0)
            output += " ";

        output += inches + '"';
    }

    return output;
  }
}
