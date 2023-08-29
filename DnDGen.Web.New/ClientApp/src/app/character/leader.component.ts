import { Input, Component } from '@angular/core';
import { Character } from './character.model';
import { Leadership } from './leadership.model';

@Component({
  selector: 'dndgen-leader',
  templateUrl: './leader.component.html'
})

export class LeaderComponent {
  @Input() character!: Character;
  @Input() leadership!: Leadership;
  @Input() cohort!: Character;
  @Input() followers!: Character[];
}
