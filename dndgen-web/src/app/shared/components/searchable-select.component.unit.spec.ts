import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SearchableSelectComponent } from './searchable-select.component';
import { NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';
import { ElementRef } from '@angular/core';

describe('Searchable Select Component', () => {
  describe('unit', () => {
    let component: SearchableSelectComponent;

    beforeEach(() => {
      component = new SearchableSelectComponent();
      component.options = ['Hill Giant', 'Frost Giant', 'Human', 'Giant Eagle', 'Yuan-ti Pureblood'];
    });

    it('initializes the inputs', () => {
      const newComponent = new SearchableSelectComponent();
      expect(newComponent.id).toBe('');
      expect(newComponent.options).toEqual([]);
      expect(newComponent.value).toBe('');
      expect(newComponent.placeholder).toBe('');
      expect(newComponent.clearOnSelect).toBe(false);
    });

    const searches = [
      { query: '', expected: ['Hill Giant', 'Frost Giant', 'Human', 'Giant Eagle', 'Yuan-ti Pureblood'] },
      { query: 'giant', expected: ['Hill Giant', 'Frost Giant', 'Giant Eagle'] },
      { query: 'GIANT', expected: ['Hill Giant', 'Frost Giant', 'Giant Eagle'] },
      { query: 'Giant', expected: ['Hill Giant', 'Frost Giant', 'Giant Eagle'] },
      { query: 'hill giant', expected: ['Hill Giant'] },
      { query: 'an', expected: ['Hill Giant', 'Frost Giant', 'Human', 'Giant Eagle', 'Yuan-ti Pureblood'] },
      { query: 'yuan-ti', expected: ['Yuan-ti Pureblood'] },
      { query: 'dragon', expected: [] },
    ];

    searches.forEach(test => {
      it(`lists the options that contain "${test.query}"`, () => {
        expect(component.filter(test.query)).toEqual(test.expected);
      });
    });

    it('emits the chosen option', () => {
      const emitted: string[] = [];
      component.valueChange.subscribe(value => emitted.push(value));
      const preventDefault = vi.fn();

      component.select({ item: 'Human', preventDefault: preventDefault } as NgbTypeaheadSelectItemEvent<string>);

      expect(emitted).toEqual(['Human']);
      expect(preventDefault).not.toHaveBeenCalled();
    });

    it('emits the chosen option and keeps the input empty when clearing on select', () => {
      component.clearOnSelect = true;
      component.input = { nativeElement: { value: 'hum' } } as ElementRef<HTMLInputElement>;
      const emitted: string[] = [];
      component.valueChange.subscribe(value => emitted.push(value));
      const preventDefault = vi.fn();

      component.select({ item: 'Human', preventDefault: preventDefault } as NgbTypeaheadSelectItemEvent<string>);

      expect(emitted).toEqual(['Human']);
      expect(preventDefault).toHaveBeenCalledTimes(1);
      expect(component.input.nativeElement.value).toBe('');
    });
  });
});
