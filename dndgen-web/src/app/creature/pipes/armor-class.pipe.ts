import { Pipe, PipeTransform } from '@angular/core';
import { CreatureArmorClass } from '../models/creature-armor-class.model';
import { BonusPipe } from '../../shared/pipes/bonus.pipe';

@Pipe({
  name: 'armorClass',
  standalone: true
})
export class ArmorClassPipe implements PipeTransform {
  constructor(private bonusPipe: BonusPipe) { }

  transform(armorClass: CreatureArmorClass): string {
    const total = this.bonusPipe.transform(armorClass.totalBonus, armorClass.isConditional, false);
    const components = [
      { value: armorClass.sizeModifier, label: 'size' },
      { value: armorClass.dexterityBonus, label: 'Dex' },
      { value: armorClass.armorBonus, label: 'armor' },
      { value: armorClass.shieldBonus, label: 'shield' },
      { value: armorClass.naturalArmorBonus, label: 'natural' },
      { value: armorClass.deflectionBonus, label: 'deflection' },
      { value: armorClass.dodgeBonus, label: 'dodge' },
    ]
      .filter(component => component.value != 0)
      .map(component => `${this.bonusPipe.transform(component.value)} ${component.label}`);

    if (!components.length)
      return total;

    return `${total} (${components.join(', ')})`;
  }
}
