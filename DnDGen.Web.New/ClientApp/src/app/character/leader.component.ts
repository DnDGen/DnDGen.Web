import { Input, Component } from '@angular/core';
import { Character } from './character.model';
import { Leadership } from './leadership.model';

@Component({
  selector: 'dndgen-leader',
  templateUrl: './leader.component.html'
})

export class LeaderComponent {
  @Input() character!: Character | null;
  @Input() leadership!: Leadership | null;
  @Input() cohort!: Character | null;
  @Input() followers: Character[] = [];
}
