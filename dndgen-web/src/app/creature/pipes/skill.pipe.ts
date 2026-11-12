import { Pipe, PipeTransform } from '@angular/core';
import { CreatureSkill } from '../models/creature-skill.model';
import { BonusPipe } from '../../shared/pipes/bonus.pipe';

@Pipe({
  name: 'skill',
  standalone: true
})
export class SkillPipe implements PipeTransform {
  constructor(private bonusPipe: BonusPipe) { }

  transform(skill: CreatureSkill): string {
    const name = skill.focus ? `${skill.name} (${skill.focus})` : skill.name;
    const conditional = skill.bonuses
      .filter(bonus => bonus.isConditional)
      .map(bonus => `${this.bonusPipe.transform(skill.totalBonus + bonus.value)} ${bonus.condition}`)
      .filter((bonus, index, all) => all.indexOf(bonus) == index);

    if (!conditional.length)
      return `${name} ${this.bonusPipe.transform(skill.totalBonus, skill.circumstantialBonus)}`;

    return `${name} ${this.bonusPipe.transform(skill.totalBonus)} (${conditional.join(', ')})`;
  }
}
