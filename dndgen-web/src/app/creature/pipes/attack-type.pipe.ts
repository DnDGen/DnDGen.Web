import { Pipe, PipeTransform } from '@angular/core';
import { Attack } from '../models/attack.model';

@Pipe({
  name: 'attackType',
  standalone: true
})
export class AttackTypePipe implements PipeTransform {
  transform(attack: Attack): string {
    if (attack.isSpecial)
      return attack.attackType;

    const natural = attack.isNatural ? 'Natural' : 'Manufactured';
    const primary = attack.isPrimary ? 'Primary' : 'Secondary';

    return `${natural} ${attack.attackType} (${primary})`;
  }
}
