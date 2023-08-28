import { Input, Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Character } from './character.model';

@Component({
  selector: 'dndgen-character',
  templateUrl: './character.directive.html'
})

export class CharacterDirective {
  @Input() character!: Character;
  @Input() leadership!: Leadership;
  @Input() cohort!: Character;
  @Input() followers!: Character[];
}
