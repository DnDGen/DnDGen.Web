import { Pipe, PipeTransform } from '@angular/core';
import { Bonus } from '../models/bonus.model';
import { BonusPipe } from '../../shared/pipes/bonus.pipe';

@Pipe({
  name: 'conditionalBonus',
  standalone: true
})
export class ConditionalBonusPipe implements PipeTransform {
  constructor(private bonusPipe: BonusPipe) { }

  transform(bonus: Bonus): string {
    return `${this.bonusPipe.transform(bonus.value)} ${bonus.condition}`;
  }
}
