import { Input, Component } from '@angular/core';
import { Encounter } from '../models/encounter.model';
import { EncounterCreaturePipe } from '../pipes/encounterCreature.pipe';
import { CreaturePipe } from '../pipes/creature.pipe';

@Component({
  selector: 'dndgen-encounter',
  templateUrl: './encounter.component.html',
  providers: [
    EncounterCreaturePipe,
    CreaturePipe,
  ]
})

export class EncounterComponent {
  constructor() { }

  @Input() encounter!: Encounter;
}
