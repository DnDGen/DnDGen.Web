import { Pipe, PipeTransform } from '@angular/core';
import { AttackSave } from '../models/attack-save.model';

@Pipe({
  name: 'attackSave',
  standalone: true
})
export class AttackSavePipe implements PipeTransform {
  transform(save: AttackSave): string {
    const check = [save.save, `DC ${save.dc}`]
      .filter(part => part)
      .join(' ');

    if (!save.baseAbility)
      return check;

    return `${check} (${save.baseAbility.name})`;
  }
}
