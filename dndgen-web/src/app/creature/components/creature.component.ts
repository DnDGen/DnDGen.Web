import { Input, Component } from '@angular/core';
import { Creature } from '../models/creature.model';
import { DetailsComponent } from '../../shared/components/details.component';

@Component({
    selector: 'dndgen-creature',
    templateUrl: './creature.component.html',
    standalone: true,
    imports: [
      DetailsComponent,
    ]
})

export class CreatureComponent {
  @Input() creature!: Creature;
}
