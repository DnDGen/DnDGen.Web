import { Pipe, PipeTransform } from "@angular/core";
import { CreaturePipe } from "./creature.pipe";
import { EncounterCreature } from "../models/encounterCreature.model";

@Pipe({ name: 'encounterCreature' })
export class EncounterCreaturePipe implements PipeTransform {
  constructor(private creaturePipe: CreaturePipe) {}

  transform(value: EncounterCreature): string {
    const transformedCreature = this.creaturePipe.transform(value.creature);
    return `${transformedCreature} x${value.quantity}`;
  }
}
