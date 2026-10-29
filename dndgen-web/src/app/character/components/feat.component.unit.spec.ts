import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { Feat } from '../models/feat.model';
import { FeatComponent } from './feat.component';
import { Frequency } from '../models/frequency.model';
import { TestHelper } from '../../test-helper';

describe('Feat Component', () => {
  describe('unit', () => {
    let component: FeatComponent;

    beforeEach(() => {
      component = new FeatComponent();
    });
  
    it(`should set the feat`, () => {
      const feat = new Feat('my feat');
      component.feat = feat;

      expect(component.feat).toBe(feat);
    });
  });
});