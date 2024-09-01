import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: 'bonus' })
export class BonusPipe implements PipeTransform {
  transform(value: number, conditional: boolean = false, includePlus: boolean = true): string {
    let bonus = '';

    if (value >= 0 && includePlus)
      bonus += '+';

    bonus += value;

    if (conditional)
      bonus += ' *';

    return bonus;
  }
}
