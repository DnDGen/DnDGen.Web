import { Input, Component } from '@angular/core';
import { Treasure } from './treasure.model';

@Component({
  selector: 'dndgen-treasure',
  templateUrl: './treasure.component.html'
})

export class TreasureComponent {
  @Input() treasure!: Treasure;
}
