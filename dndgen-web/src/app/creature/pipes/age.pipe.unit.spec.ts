import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DecimalPipe } from '@angular/common';
import { AgePipe } from './age.pipe';
import { Measurement } from '../../shared/models/measurement.model';

describe('AgePipe', () => {
  describe('unit', () => {
    let pipe: AgePipe;
    let numberPipeSpy: { transform: ReturnType<typeof vi.fn> };

    beforeEach(() => {
      numberPipeSpy = { transform: vi.fn() };
      pipe = new AgePipe(numberPipeSpy as unknown as DecimalPipe);

      numberPipeSpy.transform.mockImplementation((value: number) => {
        return `${value} formatted`;
      });
    });

    const ages = [
      { value: 1, expected: '1 formatted years (Adulthood)' },
      { value: 1.5, expected: '1 formatted years (Adulthood)' },
      { value: 45, expected: '45 formatted years (Adulthood)' },
      { value: 298.167, expected: '298 formatted years (Adulthood)' },
      { value: 298.999, expected: '298 formatted years (Adulthood)' },
      { value: 967117.5, expected: '967117 formatted years (Adulthood)' },
    ];

    ages.forEach(test => {
      it(`formats an age of ${test.value}, rounded down`, () => {
        const age = new Measurement(test.value, 'years', 'Adulthood');

        const formattedAge = pipe.transform(age);
        expect(formattedAge).toEqual(test.expected);
      });
    });

    const lowAges = [0.001, 0.333, 0.999];

    lowAges.forEach(test => {
      it(`formats an age of ${test} as less than 1`, () => {
        const age = new Measurement(test, 'years', 'Middle Age');

        const formattedAge = pipe.transform(age);
        expect(formattedAge).toEqual('less than 1 years (Middle Age)');
      });
    });

    it('formats no age as its description', () => {
      const age = new Measurement(0, 'years', 'Ageless');

      const formattedAge = pipe.transform(age);
      expect(formattedAge).toEqual('Ageless');
    });

    it('formats an age without a description', () => {
      const age = new Measurement(45, 'years');

      const formattedAge = pipe.transform(age);
      expect(formattedAge).toEqual('45 formatted years');
    });
  });
});
