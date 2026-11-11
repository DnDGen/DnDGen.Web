import { describe, it, expect, beforeEach } from 'vitest';
import { AbilitiesPipe } from './abilities.pipe';
import { CreatureAbility } from '../models/creature-ability.model';

describe('AbilitiesPipe', () => {
  describe('unit', () => {
    let pipe: AbilitiesPipe;
    let abilities: { [name: string]: CreatureAbility };

    beforeEach(() => {
      pipe = new AbilitiesPipe();
      abilities = {
        Strength: new CreatureAbility('Strength', 29, 9),
        Constitution: new CreatureAbility('Constitution', 28, 9),
        Dexterity: new CreatureAbility('Dexterity', 19, 4),
        Intelligence: new CreatureAbility('Intelligence', 18, 4),
        Wisdom: new CreatureAbility('Wisdom', 3, -4),
        Charisma: new CreatureAbility('Charisma', 24, 7),
      };
    });

    it('formats every ability score, abbreviated, in stat block order', () => {
      expect(pipe.transform(abilities)).toEqual('Str 29, Dex 19, Con 28, Int 18, Wis 3, Cha 24');
    });

    const missing = [
      { ability: 'Strength', expected: 'Str —, Dex 19, Con 28, Int 18, Wis 3, Cha 24' },
      { ability: 'Dexterity', expected: 'Str 29, Dex —, Con 28, Int 18, Wis 3, Cha 24' },
      { ability: 'Constitution', expected: 'Str 29, Dex 19, Con —, Int 18, Wis 3, Cha 24' },
      { ability: 'Intelligence', expected: 'Str 29, Dex 19, Con 28, Int —, Wis 3, Cha 24' },
      { ability: 'Wisdom', expected: 'Str 29, Dex 19, Con 28, Int 18, Wis —, Cha 24' },
      { ability: 'Charisma', expected: 'Str 29, Dex 19, Con 28, Int 18, Wis 3, Cha —' },
    ];

    missing.forEach(test => {
      it(`shows a missing ${test.ability} score as —`, () => {
        abilities[test.ability].hasScore = false;

        expect(pipe.transform(abilities)).toEqual(test.expected);
      });
    });

    it('shows many missing scores as —', () => {
      abilities['Constitution'].hasScore = false;
      abilities['Intelligence'].hasScore = false;

      expect(pipe.transform(abilities)).toEqual('Str 29, Dex 19, Con —, Int —, Wis 3, Cha 24');
    });
  });
});
