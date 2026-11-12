import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MaximumAgePipe } from './maximum-age.pipe';
import { AgePipe } from './age.pipe';
import { Demographics } from '../models/demographics.model';
import { CreatureMeasurement } from '../models/creature-measurement.model';

describe('MaximumAgePipe', () => {
  describe('unit', () => {
    let pipe: MaximumAgePipe;
    let agePipeSpy: { transform: ReturnType<typeof vi.fn> };
    let demographics: Demographics;

    beforeEach(() => {
      agePipeSpy = { transform: vi.fn() };
      pipe = new MaximumAgePipe(agePipeSpy as unknown as AgePipe);

      agePipeSpy.transform.mockImplementation((age: CreatureMeasurement) => {
        return `${age.value} ${age.unit} (${age.description}) formatted`;
      });

      demographics = new Demographics('Male', new CreatureMeasurement(45, 'years', 'Adulthood'));
    });

    const greaterOrEqual = [
      { name: 'above the age', maximum: 86 },
      { name: 'just above the age', maximum: 46 },
      { name: 'equal to the age', maximum: 45 },
    ];

    greaterOrEqual.forEach(test => {
      it(`formats a maximum age ${test.name}`, () => {
        demographics.maximumAge = new CreatureMeasurement(test.maximum, 'years', 'Will die of natural causes');

        const formattedAge = pipe.transform(demographics);
        expect(formattedAge).toEqual(`${test.maximum} years (Will die of natural causes) formatted`);
        expect(agePipeSpy.transform).toHaveBeenCalledWith(demographics.maximumAge);
      });
    });

    const below = [
      { name: 'of -1', age: 2150.5, maximum: -1, description: 'Undead' },
      { name: 'rounded down from the age', age: 3014.833, maximum: 3014, description: 'Undead' },
      { name: 'far below the age', age: 45, maximum: 1, description: 'Immortal' },
      { name: 'of 0', age: 490.583, maximum: 0, description: 'Immortal' },
    ];

    below.forEach(test => {
      it(`formats a maximum age ${test.name} as its description`, () => {
        demographics.age = new CreatureMeasurement(test.age, 'years', test.description);
        demographics.maximumAge = new CreatureMeasurement(test.maximum, 'years', test.description);

        const formattedAge = pipe.transform(demographics);
        expect(formattedAge).toEqual(test.description);
      });
    });
  });
});
