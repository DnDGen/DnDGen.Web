import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailsComponent } from '../../shared/components/details.component';
import { By } from '@angular/platform-browser';
import { SpellGroupComponent } from './spell-group.component';
import { SpellGroup } from '../models/spell-group.model';
import { Spell } from '../models/spell.model';
import { TestHelper } from '../../test-helper';

describe('SpellGroup Component', () => {
  describe('unit', () => {
    let component: SpellGroupComponent;

    beforeEach(() => {
      component = new SpellGroupComponent();
    });
  
    it(`should set the spell group `, () => {
      const group = new SpellGroup('my group name');
      component.group = group;

      expect(component.group).toBe(group);
    });
  });
});