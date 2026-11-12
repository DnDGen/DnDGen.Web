import { Pipe, PipeTransform } from '@angular/core';
import { Demographics } from '../models/demographics.model';
import { AgePipe } from './age.pipe';

@Pipe({
  name: 'maximumAge',
  standalone: true
})
export class MaximumAgePipe implements PipeTransform {
  constructor(private agePipe: AgePipe) { }

  transform(demographics: Demographics): string {
    if (demographics.maximumAge.value < demographics.age.value)
      return demographics.maximumAge.description;

    return this.agePipe.transform(demographics.maximumAge);
  }
}
