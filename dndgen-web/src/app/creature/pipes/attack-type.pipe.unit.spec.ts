import { describe, it, expect, beforeEach } from 'vitest';
import { AttackTypePipe } from './attack-type.pipe';
import { Attack } from '../models/attack.model';

describe('AttackTypePipe', () => {
  describe('unit', () => {
    let pipe: AttackTypePipe;

    beforeEach(() => {
      pipe = new AttackTypePipe();
    });

    const types = [
      { attackType: 'melee', natural: true, primary: true, expected: 'Natural melee (Primary)' },
      { attackType: 'melee', natural: true, primary: false, expected: 'Natural melee (Secondary)' },
      { attackType: 'melee', natural: false, primary: true, expected: 'Manufactured melee (Primary)' },
      { attackType: 'ranged', natural: false, primary: false, expected: 'Manufactured ranged (Secondary)' },
    ];

    types.forEach(test => {
      it(`formats the type of a standard attack - ${test.expected}`, () => {
        const attack = new Attack('Attack', test.attackType, true, test.natural, test.primary, false);

        const formattedAttack = pipe.transform(attack);
        expect(formattedAttack).toEqual(test.expected);
      });
    });

    const specialTypes = ['extraordinary ability', 'supernatural ability', 'spell-like ability'];

    specialTypes.forEach(test => {
      it(`formats the type of a special attack as its attack type - ${test}`, () => {
        const attack = new Attack('Attack', test, true, true, true, true);

        const formattedAttack = pipe.transform(attack);
        expect(formattedAttack).toEqual(test);
      });
    });
  });
});
