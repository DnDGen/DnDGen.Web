import { Input, Component } from '@angular/core';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'dndgen-details',
    templateUrl: './details.component.html',
    imports: [
      NgbCollapseModule,
    ],
    standalone: true
})

export class DetailsComponent {
  @Input() heading: string = '';
  @Input() hasDetails: boolean = false;

  public collapsed: boolean = true;
}
