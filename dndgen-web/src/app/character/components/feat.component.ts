import { Input, Component } from '@angular/core';
import { Feat } from '../models/feat.model';
import { FrequencyPipe } from '../pipes/frequency.pipe';

@Component({
  selector: 'dndgen-feat',
  templateUrl: './feat.component.html',
  providers: [
    FrequencyPipe
  ]
})

export class FeatComponent {
  @Input() feat!: Feat;
}
