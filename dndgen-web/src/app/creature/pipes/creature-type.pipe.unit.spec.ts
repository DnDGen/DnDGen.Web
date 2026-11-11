import { describe, it, expect, beforeEach } from 'vitest';
import { CreatureTypePipe } from './creature-type.pipe';
import { CreatureType } from '../models/creature-type.model';

describe('CreatureTypePipe', () => {
  describe('unit', () => {
    let pipe: CreatureTypePipe;

    beforeEach(() => {
      pipe = new CreatureTypePipe();
    });

    const types = [
      { name: 'no subtypes', type: 'Dragon', subTypes: [], expected: 'Dragon' },
      { name: '1 subtype', type: 'Humanoid', subTypes: ['Human'], expected: 'Humanoid (Human)' },
      { name: 'many subtypes', type: 'Outsider', subTypes: ['Chaotic', 'Extraplanar', 'Evil'], expected: 'Outsider (Chaotic, Extraplanar, Evil)' },
    ];

    types.forEach(test => {
      it(`formats a type with ${test.name}`, () => {
        const type = new CreatureType(test.type, test.subTypes);

        expect(pipe.transform(type)).toEqual(test.expected);
      });
    });
  });
});
