import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ArmorClassPipe } from './armor-class.pipe';
import { BonusPipe } from '../../shared/pipes/bonus.pipe';
import { CreatureArmorClass } from '../models/creature-armor-class.model';

describe('ArmorClassPipe', () => {
  describe('unit', () => {
    let pipe: ArmorClassPipe;
    let bonusPipeSpy: { transform: ReturnType<typeof vi.fn> };
    let armorClass: CreatureArmorClass;

    beforeEach(() => {
      bonusPipeSpy = { transform: vi.fn() };
      pipe = new ArmorClassPipe(bonusPipeSpy as unknown as BonusPipe);

      armorClass = new CreatureArmorClass();
      armorClass.totalBonus = 902;

      bonusPipeSpy.transform.mockImplementation((input: number, conditional: boolean = false, includePlus: boolean = true) => {
          return `${includePlus && input >= 0 ? '+' : ''}${input}${conditional ? ' *' : ''} formatted`;
      });
    });

    it('formats an armor class with no components', () => {
      const formattedArmorClass = pipe.transform(armorClass);
      expect(formattedArmorClass).toEqual('902 formatted');
    });

    it('marks a conditional armor class', () => {
      armorClass.isConditional = true;

      const formattedArmorClass = pipe.transform(armorClass);
      expect(formattedArmorClass).toEqual('902 * formatted');
    });

    const components = [
      { name: 'a negative size modifier', set: (ac: CreatureArmorClass) => ac.sizeModifier = -1, expected: '-1 formatted size' },
      { name: 'a positive size modifier', set: (ac: CreatureArmorClass) => ac.sizeModifier = 8, expected: '+8 formatted size' },
      { name: 'a dexterity bonus', set: (ac: CreatureArmorClass) => ac.dexterityBonus = 4, expected: '+4 formatted Dex' },
      { name: 'a negative dexterity bonus', set: (ac: CreatureArmorClass) => ac.dexterityBonus = -5, expected: '-5 formatted Dex' },
      { name: 'an armor bonus', set: (ac: CreatureArmorClass) => ac.armorBonus = 3, expected: '+3 formatted armor' },
      { name: 'a shield bonus', set: (ac: CreatureArmorClass) => ac.shieldBonus = 1, expected: '+1 formatted shield' },
      { name: 'a natural armor bonus', set: (ac: CreatureArmorClass) => ac.naturalArmorBonus = 16, expected: '+16 formatted natural' },
      { name: 'a deflection bonus', set: (ac: CreatureArmorClass) => ac.deflectionBonus = 2, expected: '+2 formatted deflection' },
      { name: 'a dodge bonus', set: (ac: CreatureArmorClass) => ac.dodgeBonus = 1, expected: '+1 formatted dodge' },
    ];

    components.forEach(test => {
      it(`formats an armor class with ${test.name}`, () => {
        test.set(armorClass);

        const formattedArmorClass = pipe.transform(armorClass);
        expect(formattedArmorClass).toEqual(`902 formatted (${test.expected})`);
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

      const formattedArmorClass = pipe.transform(armorClass);
      expect(formattedArmorClass).toEqual('37 formatted (-1 formatted size, +4 formatted Dex, +3 formatted armor, +1 formatted shield, +16 formatted natural, +2 formatted deflection, +1 formatted dodge)');
    });

    it('formats a conditional armor class with components', () => {
      armorClass.totalBonus = 29;
      armorClass.isConditional = true;
      armorClass.sizeModifier = -1;
      armorClass.dexterityBonus = 4;
      armorClass.naturalArmorBonus = 16;

      const formattedArmorClass = pipe.transform(armorClass);
      expect(formattedArmorClass).toEqual('29 * formatted (-1 formatted size, +4 formatted Dex, +16 formatted natural)');
    });
  });
});
