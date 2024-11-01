import { Input, Component } from '@angular/core';
import { Treasure } from '../models/treasure.model';
import { ItemComponent } from './item.component';
import { DetailsComponent } from '../../shared/components/details.component';
import { DecimalPipe } from '@angular/common';

@Component({
    selector: 'dndgen-treasure',
    templateUrl: './treasure.component.html',
    standalone: true,
    imports: [DetailsComponent, ItemComponent, DecimalPipe]
})

export class TreasureComponent {
  @Input() treasure!: Treasure;
}
