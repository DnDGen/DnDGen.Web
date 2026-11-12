import { Pipe, PipeTransform } from '@angular/core';
import { HitPoints } from '../models/hit-points.model';

@Pipe({
  name: 'hitDice',
  standalone: true
})
export class HitDicePipe implements PipeTransform {
  transform(hitPoints: HitPoints): string {
    return `${hitPoints.defaultRoll} (${hitPoints.total} hp)`;
  }
}
