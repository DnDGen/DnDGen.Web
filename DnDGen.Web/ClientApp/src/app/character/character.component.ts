import { Input, Component } from '@angular/core';
import { Character } from './character.model';

@Component({
  selector: 'dndgen-character',
  templateUrl: './character.component.html'
})

export class CharacterComponent {
  @Input() character!: Character;
}
