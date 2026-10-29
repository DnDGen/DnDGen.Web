import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadingComponent } from './loading.component';
import { Size } from './size.enum';
import { TestHelper } from '../../test-helper';

describe('Loading Component', () => {
  describe('unit', () => {
    let component: LoadingComponent;
    
    beforeEach(() => {
      component = new LoadingComponent();
    });

    it('initializes the inputs', () => {
      expect(component.isLoading).toBe(true);
      expect(component.size).toBe(Size.Small);
    });

    it('should return a large loading class', () => {
      component.size = Size.Large;
      expect(component.loadingClass).toBe('dndgen-loading-large');
    });

    it('should return a medium loading class', () => {
      component.size = Size.Medium;
      expect(component.loadingClass).toBe('dndgen-loading-medium');
    });

    it('should return a small loading class', () => {
      component.size = Size.Small;
      expect(component.loadingClass).toBe('dndgen-loading-small');
    });

    it('should return that large is large', () => {
      component.size = Size.Large;
      expect(component.isLarge).toBe(true);
    });

    it('should return that medium is not large', () => {
      component.size = Size.Medium;
      expect(component.isLarge).toBe(false);
    });

    it('should return that small is not large', () => {
      component.size = Size.Small;
      expect(component.isLarge).toBe(false);
    });
  });
});