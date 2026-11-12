import { Pipe, PipeTransform } from '@angular/core';
import { CreatureType } from '../models/creature-type.model';

@Pipe({
  name: 'creatureType',
  standalone: true
})
export class CreatureTypePipe implements PipeTransform {
  transform(type: CreatureType): string {
    if (!type.subTypes.length)
      return type.name;

    return `${type.name} (${type.subTypes.join(', ')})`;
  }
}
