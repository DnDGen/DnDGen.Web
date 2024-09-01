import { DecimalPipe } from '@angular/common';
import { MeasurementPipe } from './measurement.pipe';
import { InchesToFeetPipe } from './inchesToFeet.pipe';
import { Measurement } from '../character/models/measurement.model';

describe('MeasurementPipe', () => {
  describe('unit', () => {
    let pipe: MeasurementPipe;
    let measurement: Measurement;

    beforeEach(() => {
      const numberPipe = new DecimalPipe('en-US');
      const inchesToFeetPipe = new InchesToFeetPipe(numberPipe);
      pipe = new MeasurementPipe(numberPipe, inchesToFeetPipe);
      
      measurement = new Measurement();
    });

    it('should return 42 m/s', () => {
      measurement.value = 42;
      measurement.unit = 'm/s';

      const result = pipe.transform(measurement);
      expect(result).toEqual('42 m/s');
    });

    it('should return 9,266 feet per round', () => {
      measurement.value = 9266;
      measurement.unit = 'feet per round';

      const result = pipe.transform(measurement);
      expect(result).toEqual('9,266 feet per round');
    });

    it('should return 7,517\' 6"', () => {
      measurement.value = 90210;
      measurement.unit = 'Inches';

      const result = pipe.transform(measurement);
      expect(result).toEqual('7,517\' 6"');
    });

    it('should return 111\' 4" cases-insensitive', () => {
      measurement.value = 1336;
      measurement.unit = 'inches';

      const result = pipe.transform(measurement);
      expect(result).toEqual('111\' 4"');
    });

    it('should return 600 pounds with description', () => {
      measurement.value = 600;
      measurement.unit = 'pounds';
      measurement.description = 'my description';

      const result = pipe.transform(measurement);
      expect(result).toEqual('600 pounds (my description)');
    });

    it('should return 111\' 5" with description', () => {
      measurement.value = 1337;
      measurement.unit = 'Inches';
      measurement.description = 'my description';

      const result = pipe.transform(measurement);
      expect(result).toEqual('111\' 5" (my description)');
    });

    it('should return ageless', () => {
      measurement.value = 0;
      measurement.unit = 'years';
      measurement.description = 'ageless';

      const result = pipe.transform(measurement);
      expect(result).toEqual('ageless');
    });
  });
});
