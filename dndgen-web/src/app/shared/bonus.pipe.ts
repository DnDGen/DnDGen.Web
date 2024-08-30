import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: 'bonus' })
export class BonusPipe implements PipeTransform {
  transform(value: number): string {
    return value < 0 ? `${value}` : `+${value}`;
  }
}
