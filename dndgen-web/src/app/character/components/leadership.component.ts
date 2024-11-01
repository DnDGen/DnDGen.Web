import { Input, Component } from '@angular/core';
import { Character } from '../models/character.model';
import { Leadership } from '../models/leadership.model';
import { CharacterComponent } from './character.component';
import { DecimalPipe } from '@angular/common';
import { DetailsComponent } from '../../shared/components/details.component';

@Component({
    selector: 'dndgen-leadership',
    templateUrl: './leadership.component.html',
    standalone: true,
    imports: [DetailsComponent, CharacterComponent, DecimalPipe]
})

export class LeadershipComponent {
  @Input() leadership!: Leadership | null;
  @Input() cohort!: Character | null;
  @Input() followers: Character[] = [];
}
