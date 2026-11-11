import { Pipe, PipeTransform } from '@angular/core';
import { Attack } from '../models/attack.model';
import { BonusesPipe } from '../../shared/pipes/bonuses.pipe';

@Pipe({
  name: 'attack',
  standalone: true
})
export class AttackPipe implements PipeTransform {
  constructor(private bonusesPipe: BonusesPipe) { }

  transform(attack: Attack, full: boolean = false): string {
    const damage = attack.damageSummary ? ` (${attack.damageSummary})` : '';

    if (attack.isSpecial)
      return `${attack.name}${damage}`;

    const bonuses = full ? attack.fullAttackBonuses : [attack.totalAttackBonus];

    return `${attack.name} ${this.bonusesPipe.transform(bonuses)} ${attack.attackType}${damage}`;
  }
}
