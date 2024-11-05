import { Input, Component } from '@angular/core';
import { Encounter } from '../models/encounter.model';
import { EncounterCreaturePipe } from '../pipes/encounterCreature.pipe';
import { CreaturePipe } from '../pipes/creature.pipe';
import { CharacterComponent } from '../../character/components/character.component';
import { TreasureComponent } from '../../treasure/components/treasure.component';
import { DetailsComponent } from '../../shared/components/details.component';
import { Area } from '../models/area.model';
import { DecimalPipe } from '@angular/common';
import { EncounterComponent } from '../../encounter/components/encounter.component';
import { DungeonTreasureComponent } from './dungeonTreasure.component';

@Component({
    selector: 'dndgen-area',
    templateUrl: './area.component.html',
    providers: [
        EncounterCreaturePipe,
        CreaturePipe,
    ],
    standalone: true,
    imports: [DetailsComponent, DungeonTreasureComponent, EncounterComponent, DecimalPipe]
})

export class AreaComponent {
  constructor() { }

  @Input() area!: Area;
}
