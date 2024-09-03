import { Input, Component } from '@angular/core';
import { Character } from '../models/character.model';
import { Leadership } from '../models/leadership.model';

@Component({
  selector: 'dndgen-leadership',
  templateUrl: './leadership.component.html'
})

export class LeaderComponent {
  @Input() leadership!: Leadership | null;
  @Input() cohort!: Character | null;
  @Input() followers: Character[] = [];
}
