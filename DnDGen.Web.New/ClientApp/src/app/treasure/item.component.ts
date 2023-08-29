import { Input, Component } from '@angular/core';
import { Item } from './item.model';

@Component({
  selector: 'dndgen-item',
  templateUrl: './item.component.html'
})

export class ItemComponent {
  @Input() item!: Item;
}
