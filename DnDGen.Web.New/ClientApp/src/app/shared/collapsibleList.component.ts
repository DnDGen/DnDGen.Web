import { Input, Component } from '@angular/core';

@Component({
  selector: 'dndgen-collapsible-list',
  templateUrl: './collapsibleList.component.html'
})

export class CollapsibleListComponent {
  constructor() { }

  @Input() heading: string = '';
  @Input() hasList: boolean = false;

  public id: string = 'list-' + crypto.randomUUID();
}
