import { Pipe, PipeTransform } from '@angular/core';
import { Save } from '../models/save.model';
import { BonusPipe } from '../../shared/pipes/bonus.pipe';

@Pipe({
  name: 'saves',
  standalone: true
})
export class SavesPipe implements PipeTransform {
  constructor(private bonusPipe: BonusPipe) { }

  private readonly abbreviations = [
    { name: 'Fortitude', abbreviation: 'Fort' },
    { name: 'Reflex', abbreviation: 'Ref' },
    { name: 'Will', abbreviation: 'Will' },
  ];

  transform(saves: { [name: string]: Save }): string {
    return this.abbreviations
      .map(save => `${save.abbreviation} ${this.formatSave(saves[save.name])}`)
      .join(', ');
  }

  private formatSave(save: Save): string {
    if (!save.hasSave)
      return '—';

    return this.bonusPipe.transform(save.totalBonus, save.isConditional);
  }
}
