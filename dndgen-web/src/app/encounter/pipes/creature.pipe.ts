import { Pipe, PipeTransform } from "@angular/core";
import { Creature } from "../models/creature.model";

@Pipe({ name: 'creature' })
export class CreaturePipe implements PipeTransform {
  constructor() {}

  transform(value: Creature): string {
    if (value.description)
        return `${value.name} (${value.description})`;

    return value.name;
  }
}
