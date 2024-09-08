import { Input, Component } from '@angular/core';
import { SpellGroup } from '../models/spellGroup.model';

@Component({
  selector: 'dndgen-spell-group',
  templateUrl: './spellGroup.component.html',
})

export class SpellGroupComponent {
  @Input() group!: SpellGroup;
}
