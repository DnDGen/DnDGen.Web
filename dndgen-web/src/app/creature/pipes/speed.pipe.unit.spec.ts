import { describe, it, expect, beforeEach } from 'vitest';
import { SpeedPipe } from './speed.pipe';
import { CreatureMeasurement } from '../models/creature-measurement.model';

describe('SpeedPipe', () => {
  describe('unit', () => {
    let pipe: SpeedPipe;

    beforeEach(() => {
      pipe = new SpeedPipe();
    });

    const landSpeeds = [
      { value: 0, expected: '0 ft.' },
      { value: 5, expected: '5 ft. (1 square)' },
      { value: 10, expected: '10 ft. (2 squares)' },
      { value: 30, expected: '30 ft. (6 squares)' },
      { value: 120, expected: '120 ft. (24 squares)' },
    ];

    landSpeeds.forEach(test => {
      it(`formats a land speed of ${test.value} with its squares`, () => {
        const speeds = { Land: new CreatureMeasurement(test.value, 'feet per round') };

        const formattedSpeed = pipe.transform(speeds);
        expect(formattedSpeed).toEqual(test.expected);
      });
    });

    it('formats another movement with its description', () => {
      const speeds = {
        Land: new CreatureMeasurement(20, 'feet per round'),
        Fly: new CreatureMeasurement(60, 'feet per round', 'Good Maneuverability'),
      };

      const formattedSpeed = pipe.transform(speeds);
      expect(formattedSpeed).toEqual('20 ft. (4 squares), fly 60 ft. (Good Maneuverability)');
    });

    it('formats another movement without a description', () => {
      const speeds = {
        Land: new CreatureMeasurement(20, 'feet per round'),
        Swim: new CreatureMeasurement(40, 'feet per round'),
      };

      const formattedSpeed = pipe.transform(speeds);
      expect(formattedSpeed).toEqual('20 ft. (4 squares), swim 40 ft.');
    });

    it('formats land first, then the other movements in their order', () => {
      const speeds = {
        Swim: new CreatureMeasurement(40, 'feet per round'),
        Fly: new CreatureMeasurement(150, 'feet per round', 'Poor Maneuverability'),
        Land: new CreatureMeasurement(40, 'feet per round'),
        Burrow: new CreatureMeasurement(10, 'feet per round'),
      };

      const formattedSpeed = pipe.transform(speeds);
      expect(formattedSpeed).toEqual('40 ft. (8 squares), swim 40 ft., fly 150 ft. (Poor Maneuverability), burrow 10 ft.');
    });

    it('formats movements without a land speed', () => {
      const speeds = {
        Swim: new CreatureMeasurement(60, 'feet per round'),
      };

      const formattedSpeed = pipe.transform(speeds);
      expect(formattedSpeed).toEqual('swim 60 ft.');
    });
  });
});
