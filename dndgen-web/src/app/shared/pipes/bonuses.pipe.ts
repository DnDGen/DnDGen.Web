import { Pipe, PipeTransform } from "@angular/core";
import { BonusPipe } from "./bonus.pipe";

@Pipe({
    name: 'bonuses',
    standalone: true
})
export class BonusesPipe implements PipeTransform {
  constructor(private bonusPipe: BonusPipe) {}

  transform(values: number[], conditional: boolean = false, includePlus: boolean = true): string {
    let bonus = '';

    for(var i = 0; i < values.length - 1; i++) {
      bonus += this.bonusPipe.transform(values[i], false, includePlus);
      bonus += '/';
    }

    bonus += this.bonusPipe.transform(values[values.length - 1], conditional, includePlus);

    return bonus;
  }
}
