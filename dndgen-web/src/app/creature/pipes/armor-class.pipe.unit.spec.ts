import { describe, it, expect, beforeEach } from 'vitest';
import { ArmorClassPipe } from './armor-class.pipe';
import { BonusPipe } from '../../shared/pipes/bonus.pipe';
import { CreatureArmorClass } from '../models/creature-armor-class.model';

describe('ArmorClassPipe', () => {
  describe('unit', () => {
    let pipe: ArmorClassPipe;
    let armorClass: CreatureArmorClass;

    beforeEach(() => {
      pipe = new ArmorClassPipe(new BonusPipe());
      armorClass = new CreatureArmorClass();
      armorClass.totalBonus = 10;
    });

    it('formats an armor class with no components', () => {
      expect(pipe.transform(armorClass)).toEqual('10');
    });

    it('marks a conditional armor class', () => {
      armorClass.isConditional = true;

      expect(pipe.transform(armorClass)).toEqual('10 *');
    });

    const components = [
      { name: 'a negative size modifier', set: (ac: CreatureArmorClass) => ac.sizeModifier = -1, expected: '-1 size' },
      { name: 'a positive size modifier', set: (ac: CreatureArmorClass) => ac.sizeModifier = 8, expected: '+8 size' },
      { name: 'a dexterity bonus', set: (ac: CreatureArmorClass) => ac.dexterityBonus = 4, expected: '+4 Dex' },
      { name: 'a negative dexterity bonus', set: (ac: CreatureArmorClass) => ac.dexterityBonus = -5, expected: '-5 Dex' },
      { name: 'an armor bonus', set: (ac: CreatureArmorClass) => ac.armorBonus = 3, expected: '+3 armor' },
      { name: 'a shield bonus', set: (ac: CreatureArmorClass) => ac.shieldBonus = 1, expected: '+1 shield' },
      { name: 'a natural armor bonus', set: (ac: CreatureArmorClass) => ac.naturalArmorBonus = 16, expected: '+16 natural' },
      { name: 'a deflection bonus', set: (ac: CreatureArmorClass) => ac.deflectionBonus = 2, expected: '+2 deflection' },
      { name: 'a dodge bonus', set: (ac: CreatureArmorClass) => ac.dodgeBonus = 1, expected: '+1 dodge' },
    ];

    components.forEach(test => {
      it(`formats an armor class with ${test.name}`, () => {
        test.set(armorClass);

        expect(pipe.transform(armorClass)).toEqual(`10 (${test.expected})`);
      });
    });

    it('formats every component in stat block order', () => {
      armorClass.totalBonus = 37;
      armorClass.dodgeBonus = 1;
      armorClass.deflectionBonus = 2;
      armorClass.naturalArmorBonus = 16;
      armorClass.shieldBonus = 1;
      armorClass.armorBonus = 3;
      armorClass.dexterityBonus = 4;
      armorClass.sizeModifier = -1;

      expect(pipe.transform(armorClass)).toEqual('37 (-1 size, +4 Dex, +3 armor, +1 shield, +16 natural, +2 deflection, +1 dodge)');
    });

    it('formats a conditional armor class with components', () => {
      armorClass.totalBonus = 29;
      armorClass.isConditional = true;
      armorClass.sizeModifier = -1;
      armorClass.dexterityBonus = 4;
      armorClass.naturalArmorBonus = 16;

      expect(pipe.transform(armorClass)).toEqual('29 * (-1 size, +4 Dex, +16 natural)');
    });
  });
});
