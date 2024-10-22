import { Pipe, PipeTransform } from '@angular/core';
import { Frequency } from '../models/frequency.model';

@Pipe({
    name: 'frequency',
    standalone: true
})
export class FrequencyPipe implements PipeTransform {
    transform(value: Frequency): string {
        if (value.quantity) {
            return `${value.quantity}/${value.timePeriod}`;
        }

        return value.timePeriod;
    }
}
