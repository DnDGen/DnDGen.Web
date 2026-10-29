import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CharacterComponent } from './character.component';
import { Item } from '../../treasure/models/item.model';
import { Armor } from '../../treasure/models/armor.model';
import { Weapon } from '../../treasure/models/weapon.model';
import { By } from '@angular/platform-browser';
import { Character } from '../models/character.model';
import { Ability } from '../models/ability.model';
import { Skill } from '../models/skill.model';
import { Feat } from '../models/feat.model';
import { Treasure } from '../../treasure/models/treasure.model';
import { Good } from '../../treasure/models/good.model';
import { Measurement } from '../models/measurement.model';
import { BonusPipe } from '../../shared/pipes/bonus.pipe';
import { FeatComponent } from './feat.component';
import { DebugElement } from '@angular/core';
import { SpellQuantity } from '../models/spell-quantity.model';
import { Spell } from '../models/spell.model';
import { SpellGroupService } from '../services/spell-group.service';
import { SpellGroup } from '../models/spell-group.model';
import { SpellGroupComponent } from './spell-group.component';
import { TestHelper } from '../../test-helper';
import { ItemComponent } from '../../treasure/components/item.component';

describe('Character Component', () => {
  describe('unit', () => {
    let component: CharacterComponent;
    let spellGroupServiceSpy: { sortIntoGroups: ReturnType<typeof vi.fn> };

    beforeEach(() => {
      spellGroupServiceSpy = { sortIntoGroups: vi.fn() };
      component = new CharacterComponent(spellGroupServiceSpy as unknown as SpellGroupService);
      
      spellGroupServiceSpy.sortIntoGroups.mockImplementation((spells) => {
        if (!spells || spells.length == 0)
            return [];

        if (spells.length == 1) {
            return [
                new SpellGroup('first spell group', spells),
            ];
        }

        return [
            new SpellGroup('first spell group', spells.slice(0, 1)),
            new SpellGroup('other spell group', spells.slice(1)),
        ];
      });
    });
  
    it(`should set the character `, () => {
      const character = new Character('my character summary');
      component.character = character;

      expect(component.character).toBe(character);
    });

    it('should say primary weapon is two-handed', () => {
      const character = new Character('my character summary');
      character.equipment.primaryHand = new Weapon('my weapon', 'Weapon');
      character.equipment.primaryHand.attributes = ['melee', 'Two-Handed'];

      component.character = character;

      expect(component.isTwoHanded()).toBe(true);
    });

    it('should say primary weapon is not two-handed - one-handed', () => {
      const character = new Character('my character summary');
      character.equipment.primaryHand = new Weapon('my weapon', 'Weapon');
      character.equipment.primaryHand.attributes = ['melee', 'One-Handed'];

      component.character = character;

      expect(component.isTwoHanded()).toBe(false);
    });

    it('should say primary weapon is not two-handed - no primary weapon', () => {
      const character = new Character('my character summary');
      character.equipment.primaryHand = null;

      component.character = character;

      expect(component.isTwoHanded()).toBe(false);
    });

    it('should sort spells into groups', () => {
      let spells = [
        new Spell({'my source': 9}, 'my spell'),
        new Spell({'my other source': 2}, 'my other spell'),
        new Spell({'my other source': 3}, 'another spell'),
      ];

      let groups = component.getSpellGroups(spells);
      expect(groups).toBeTruthy();
      expect(groups.length).toBe(2);
      expect(groups[0]).toBeTruthy();
      expect(groups[0].name).toEqual('first spell group');
      expect(groups[0].spells).toEqual([spells[0]]);
      expect(groups[1]).toBeTruthy();
      expect(groups[1].name).toEqual('other spell group');
      expect(groups[1].spells).toEqual([spells[1], spells[2]]);
    });

    it('should sort skills by display names', () => {
      const character = new Character('my character summary');
      character.skills = [
        new Skill('skill ee', 'focus 1', 1, false, 2, new Ability('ability 1', 37, 38), 3, 4),
        new Skill('skill CCC', '', 5, true, 6, new Ability('ability 2', 39, 40), 7, 8),
        new Skill('skill ff', 'focus 2', 9, false, 10, new Ability('ability 3', 41, 42), 11, 12),
        new Skill('skill dd', '', 13, true, 14, new Ability('ability 4', 43, 44), 15, 16),
        new Skill('skill aaa', '', 17, false, 18, new Ability('ability 5', 45, 46), 19, 20),
        new Skill('skill ee', 'focus 3', 21, true, 22, new Ability('ability 6', 47, 48), 23, 24),
        new Skill('skill ff', 'focus 4', 25, false, 26, new Ability('ability 1', 37, 38), 27, 28),
        new Skill('skill BBB', '', 29, true, 30, new Ability('ability 2', 39, 40), 31, 32),
        new Skill('skill ddd', '', 33, false, 34, new Ability('ability 3', 41, 42), 35, 36),
      ];

      const expectedSkills = [
        new Skill('skill aaa', '', 17, false, 18, new Ability('ability 5', 45, 46), 19, 20),
        new Skill('skill BBB', '', 29, true, 30, new Ability('ability 2', 39, 40), 31, 32),
        new Skill('skill CCC', '', 5, true, 6, new Ability('ability 2', 39, 40), 7, 8),
        new Skill('skill dd', '', 13, true, 14, new Ability('ability 4', 43, 44), 15, 16),
        new Skill('skill ddd', '', 33, false, 34, new Ability('ability 3', 41, 42), 35, 36),
        new Skill('skill ee', 'focus 1', 1, false, 2, new Ability('ability 1', 37, 38), 3, 4),
        new Skill('skill ee', 'focus 3', 21, true, 22, new Ability('ability 6', 47, 48), 23, 24),
        new Skill('skill ff', 'focus 2', 9, false, 10, new Ability('ability 3', 41, 42), 11, 12),
        new Skill('skill ff', 'focus 4', 25, false, 26, new Ability('ability 1', 37, 38), 27, 28),
      ];

      component.character = character;

      expect(component.sortedSkills).toBeTruthy();
      expect(component.sortedSkills.length).toBe(expectedSkills.length);

      for(var i = 0; i < expectedSkills.length; i++) {
        expect(component.sortedSkills[i]).toEqual(expectedSkills[i]);
      }
    });

    it('should return off-hand heading', () => {
      const character = new Character('my character summary');
      character.equipment.offHand = new Item('my item', 'my item type');

      component.character = character;

      expect(component.offHandHeading).toEqual('Off Hand');
    });

    it('should return off-hand heading - two-handed', () => {
      const character = new Character('my character summary');
      character.equipment.primaryHand = new Weapon('my weapon', 'Weapon');
      character.equipment.primaryHand.attributes.push('Two-Handed');

      character.equipment.offHand = character.equipment.primaryHand;

      component.character = character;

      expect(component.offHandHeading).toEqual('Off Hand: (Two-Handed)');
    });

    it('should return off-hand heading - none', () => {
      const character = new Character('my character summary');
      character.equipment.offHand = null;

      component.character = character;

      expect(component.offHandHeading).toEqual('Off Hand: None');
    });

    it('should return off-hand details', () => {
      const character = new Character('my character summary');
      character.equipment.offHand = new Item('my item', 'my item type');

      component.character = character;

      expect(component.offHandDetails).toBe(true);
    });

    it('should return off-hand details - two-handed', () => {
      const character = new Character('my character summary');
      character.equipment.primaryHand = new Weapon('my weapon', 'Weapon');
      character.equipment.primaryHand.attributes.push('Two-Handed');

      character.equipment.offHand = character.equipment.primaryHand;

      component.character = character;

      expect(component.offHandDetails).toBe(false);
    });

    it('should return off-hand details - none', () => {
      const character = new Character('my character summary');
      character.equipment.offHand = null;

      component.character = character;

      expect(component.offHandDetails).toBe(false);
    });

    it('should get skill display name', () => {
      const skill = new Skill('my skill', '', 0, false, 0, new Ability(), 0, 0);
      const displayName = component.getSkillDisplayName(skill);
      expect(displayName).toEqual('my skill');
    });

    it('should get skill display name with focus', () => {
      const skill = new Skill('my skill', '', 0, false, 0, new Ability(), 0, 0);
      skill.focus = 'my focus';
      
      const displayName = component.getSkillDisplayName(skill);
      expect(displayName).toEqual('my skill (my focus)');
    });
  });
});