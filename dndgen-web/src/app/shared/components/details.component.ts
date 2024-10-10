import { Input, Component, OnInit } from '@angular/core';
import { UuidService } from '../services/uuid.service';

@Component({
  selector: 'dndgen-details',
  templateUrl: './details.component.html',
  providers: [
    UuidService
  ]
})

export class DetailsComponent implements OnInit {
  constructor(
    private idService: UuidService
  ) { }

  @Input() heading: string = '';
  @Input() hasDetails: boolean = false;

  public id: string = '';

  ngOnInit(): void {
    this.id = 'details-' + this.idService.generate();
  }
}
