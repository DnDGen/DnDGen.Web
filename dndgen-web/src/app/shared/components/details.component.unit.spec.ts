import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailsComponent } from './details.component';
import { TestHelper } from '../../test-helper';
import { NgbConfig } from '@ng-bootstrap/ng-bootstrap';

describe('Details Component', () => {
  describe('unit', () => {
    let component: DetailsComponent;
    
    beforeEach(() => {
      component = new DetailsComponent();
    });

    it('initializes the inputs', () => {
      expect(component.hasDetails).toBe(false);
      expect(component.heading).toBe('');
    });

    it('initializes as collapsed', () => {
      expect(component.collapsed).toBe(true);
    });
  });
});