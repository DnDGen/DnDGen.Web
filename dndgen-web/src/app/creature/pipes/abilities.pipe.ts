import { Pipe, PipeTransform } from '@angular/core';
import { CreatureAbility } from '../models/creature-ability.model';

@Pipe({
  name: 'abilities',
  standalone: true
})
export class AbilitiesPipe implements PipeTransform {
  private readonly names = ['Strength', 'Dexterity', 'Constitution', 'Intelligence', 'Wisdom', 'Charisma'];

  transform(abilities: { [name: string]: CreatureAbility }): string {
    return this.names
      .map(name => `${name.substring(0, 3)} ${this.formatAbility(abilities[name])}`)
      .join(', ');
  }

  private formatAbility(ability: CreatureAbility): string {
    if (!ability.hasScore)
      return '—';

    return `${ability.fullScore}`;
  }
}
