import { Input, Component } from '@angular/core';
import { Attack } from '../models/attack.model';
import { DetailsComponent } from '../../shared/components/details.component';
import { FrequencyPipe } from '../../character/pipes/frequency.pipe';
import { AttackPipe } from '../pipes/attack.pipe';
import { AttackTypePipe } from '../pipes/attack-type.pipe';
import { AttackSavePipe } from '../pipes/attack-save.pipe';

@Component({
    selector: 'dndgen-attack',
    templateUrl: './attack.component.html',
    standalone: true,
    imports: [
      DetailsComponent,
      FrequencyPipe,
      AttackPipe,
      AttackTypePipe,
      AttackSavePipe,
    ]
})

export class AttackComponent {
  @Input() attack!: Attack;
  @Input() full: boolean = false;
}
