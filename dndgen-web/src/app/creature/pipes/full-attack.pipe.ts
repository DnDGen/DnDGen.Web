import { Pipe, PipeTransform } from '@angular/core';
import { Attack } from '../models/attack.model';
import { AttackPipe } from './attack.pipe';

@Pipe({
  name: 'fullAttack',
  standalone: true
})
export class FullAttackPipe implements PipeTransform {
  constructor(private attackPipe: AttackPipe) { }

  transform(attacks: Attack[]): string {
    const groups: { summary: string, count: number }[] = [];

    for (const attack of attacks) {
      const summary = this.attackPipe.transform(attack, true);
      const group = groups.find(g => g.summary == summary);

      if (group)
        group.count++;
      else
        groups.push({ summary, count: 1 });
    }

    return groups
      .map(group => group.count > 1 ? `${group.count} × ${group.summary}` : group.summary)
      .join(' and ');
  }
}
