import { Input, Component } from '@angular/core';
import { Feat } from '../models/feat.model';
import { FrequencyPipe } from '../pipes/frequency.pipe';
import { DetailsComponent } from '../../shared/components/details.component';

@Component({
    selector: 'dndgen-feat',
    templateUrl: './feat.component.html',
    providers: [
        FrequencyPipe
    ],
    standalone: true,
    imports: [DetailsComponent, FrequencyPipe]
})

export class FeatComponent {
  @Input() feat!: Feat;
}
