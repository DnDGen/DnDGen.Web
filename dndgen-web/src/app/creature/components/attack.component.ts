import { Input, Component } from '@angular/core';
import { Attack } from '../models/attack.model';
import { DetailsComponent } from '../../shared/components/details.component';
import { BonusPipe } from '../../shared/pipes/bonus.pipe';
import { BonusesPipe } from '../../shared/pipes/bonuses.pipe';
import { FrequencyPipe } from '../../character/pipes/frequency.pipe';
import { CreatureFormatService } from '../services/creature-format.service';

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
  constructor(public format: CreatureFormatService) { }

  @Input() attack!: Attack;
}
