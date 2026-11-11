import { Pipe, PipeTransform } from '@angular/core';
import { BonusPipe } from '../../shared/pipes/bonus.pipe';

@Pipe({
  name: 'optionalBonus',
  standalone: true
})
export class OptionalBonusPipe implements PipeTransform {
  constructor(private bonusPipe: BonusPipe) { }

  transform(value?: number | null): string {
    if (value == null)
      return '—';

    return this.bonusPipe.transform(value);
  }
}
