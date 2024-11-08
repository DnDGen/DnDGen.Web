import { Input, Component } from '@angular/core';
import { TreasureComponent } from '../../treasure/components/treasure.component';
import { DungeonTreasure } from '../models/dungeonTreasure.model';

@Component({
    selector: 'dndgen-dungeon-treasure',
    templateUrl: './dungeonTreasure.component.html',
    standalone: true,
    imports: [TreasureComponent]
})

export class DungeonTreasureComponent {
  constructor() { }

  @Input() dungeonTreasure!: DungeonTreasure;
}
