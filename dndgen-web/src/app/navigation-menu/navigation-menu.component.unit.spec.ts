import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavMenuComponent } from './navigation-menu.component';
import { TestHelper } from '../test-helper';

describe('Nav-Menu Component', () => {
  describe('unit', () => {
      let component: NavMenuComponent;
      
      beforeEach(() => {
        component = new NavMenuComponent();
      });
  
      it('initializes as collapsed', () => {
        expect(component.isMenuCollapsed).toBe(true);
      });
  });
});