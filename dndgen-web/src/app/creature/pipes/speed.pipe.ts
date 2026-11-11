import { Pipe, PipeTransform } from '@angular/core';
import { CreatureMeasurement } from '../models/creature-measurement.model';

@Pipe({
  name: 'speed',
  standalone: true
})
export class SpeedPipe implements PipeTransform {
  transform(speeds: { [movement: string]: CreatureMeasurement }): string {
    const movements = Object.keys(speeds);
    const ordered = [
      ...movements.filter(movement => movement == 'Land'),
      ...movements.filter(movement => movement != 'Land'),
    ];

    return ordered
      .map(movement => this.formatSpeed(movement, speeds[movement]))
      .join(', ');
  }

  private formatSquares(squares: number): string {
    if (squares == 1)
      return '1 square';

    return `${squares} squares`;
  }

  private formatSpeed(movement: string, speed: CreatureMeasurement): string {
    if (movement == 'Land' && speed.value == 0)
      return '0 ft.';

    if (movement == 'Land')
      return `${speed.value} ft. (${this.formatSquares(speed.value / 5)})`;

    const formatted = `${movement.toLowerCase()} ${speed.value} ft.`;

    if (!speed.description)
      return formatted;

    return `${formatted} (${speed.description})`;
  }
}
