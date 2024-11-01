import { Input, Component } from '@angular/core';
import { Encounter } from '../models/encounter.model';
import { EncounterCreaturePipe } from '../pipes/encounterCreature.pipe';
import { CreaturePipe } from '../pipes/creature.pipe';
import { CharacterComponent } from '../../character/components/character.component';
import { TreasureComponent } from '../../treasure/components/treasure.component';
import { DetailsComponent } from '../../shared/components/details.component';

@Component({
    selector: 'dndgen-encounter',
    templateUrl: './encounter.component.html',
    providers: [
        EncounterCreaturePipe,
        CreaturePipe,
    ],
    standalone: true,
    imports: [DetailsComponent, TreasureComponent, CharacterComponent, EncounterCreaturePipe, CreaturePipe]
})

export class EncounterComponent {
  constructor() { }

  @Input() encounter!: Encounter;
}
