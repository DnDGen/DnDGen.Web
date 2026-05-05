import { Input, Component } from '@angular/core';
import { TreasureComponent } from '../../treasure/components/treasure.component';
import { DungeonTreasure } from '../models/dungeon-treasure.model';

@Component({
    selector: 'dndgen-dungeon-treasure',
    templateUrl: './dungeon-treasure.component.html',
    standalone: true,
    imports: [TreasureComponent]
})

export class DungeonTreasureComponent {
  constructor() { }

  @Input() dungeonTreasure!: DungeonTreasure;
}
