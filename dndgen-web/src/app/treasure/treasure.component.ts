import { Input, Component } from '@angular/core';
import { Treasure } from './models/treasure.model';

@Component({
  selector: 'dndgen-treasure',
  templateUrl: './treasure.component.html'
})

export class TreasureComponent {
  @Input() treasure!: Treasure;
}
