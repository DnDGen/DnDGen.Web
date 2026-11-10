import { Input, Component } from '@angular/core';
import { Attack } from '../models/attack.model';
import { DetailsComponent } from '../../shared/components/details.component';
import { BonusPipe } from '../../shared/pipes/bonus.pipe';
import { BonusesPipe } from '../../shared/pipes/bonuses.pipe';
import { FrequencyPipe } from '../../character/pipes/frequency.pipe';

@Component({
    selector: 'dndgen-attack',
    templateUrl: './attack.component.html',
    standalone: true,
    imports: [
      DetailsComponent,
      BonusPipe,
      BonusesPipe,
      FrequencyPipe,
    ]
})

export class AttackComponent {
  @Input() attack!: Attack;

  public get isConditional(): boolean {
    return this.attack.attackBonuses.some(bonus => bonus.isConditional);
  }

  public get attackType(): string {
    if (this.attack.isSpecial)
      return this.attack.attackType;

    const natural = this.attack.isNatural ? 'Natural' : 'Manufactured';
    const primary = this.attack.isPrimary ? 'Primary' : 'Secondary';

    return `${natural} ${this.attack.attackType} (${primary})`;
  }
}
