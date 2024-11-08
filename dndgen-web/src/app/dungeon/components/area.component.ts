import { Input, Component } from '@angular/core';
import { DetailsComponent } from '../../shared/components/details.component';
import { Area } from '../models/area.model';
import { DecimalPipe } from '@angular/common';
import { EncounterComponent } from '../../encounter/components/encounter.component';
import { DungeonTreasureComponent } from './dungeonTreasure.component';

@Component({
    selector: 'dndgen-area',
    templateUrl: './area.component.html',
    standalone: true,
    imports: [DetailsComponent, DungeonTreasureComponent, EncounterComponent, DecimalPipe]
})

export class AreaComponent {
  constructor() { }

  @Input() area!: Area;
}
