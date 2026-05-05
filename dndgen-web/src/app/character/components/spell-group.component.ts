import { Input, Component } from '@angular/core';
import { SpellGroup } from '../models/spell-group.model';
import { DetailsComponent } from '../../shared/components/details.component';

@Component({
    selector: 'dndgen-spell-group',
    templateUrl: './spell-group.component.html',
    standalone: true,
    imports: [DetailsComponent],
})

export class SpellGroupComponent {
  @Input() group!: SpellGroup;
}
