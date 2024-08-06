import { Input, Component } from '@angular/core';
import { Character } from './character.model';
import { Leadership } from './leadership.model';

@Component({
  selector: 'dndgen-leadership',
  templateUrl: './leadership.component.html'
})

export class LeaderComponent {
  @Input() leadership!: Leadership | null;
  @Input() cohort!: Character | null;
  @Input() followers: Character[] = [];
}
