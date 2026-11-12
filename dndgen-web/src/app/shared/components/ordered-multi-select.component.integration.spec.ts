import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrderedMultiSelectComponent } from './ordered-multi-select.component';
import { TestHelper } from '../../test-helper';
import { NgbConfig } from '@ng-bootstrap/ng-bootstrap';
import { By } from '@angular/platform-browser';
import { SearchableSelectComponent } from './searchable-select.component';

describe('Ordered Multi-Select Component', () => {
  describe('integration', () => {
    let fixture: ComponentFixture<OrderedMultiSelectComponent>;
    let helper: TestHelper<OrderedMultiSelectComponent>;
    let emitted: string[][];

    beforeEach(async () => {
      await TestHelper.configureTestBed([OrderedMultiSelectComponent]);

      TestBed.inject(NgbConfig).animation = false;

      fixture = TestBed.createComponent(OrderedMultiSelectComponent);
      helper = new TestHelper(fixture);

      fixture.componentInstance.id = 'myOptions';
      fixture.componentInstance.options = ['Option 1', 'Option 2', 'Option 3', 'Option 4'];
      fixture.componentInstance.placeholder = 'Add an option';
      fixture.componentInstance.emptyText = 'No options';

      emitted = [];
      fixture.componentInstance.selectedChange.subscribe(selected => emitted.push(selected));

      helper.triggerChangeDetection();
      await helper.waitForChangeDetection();
    });

    async function setSelected(selected: string[]) {
      fixture.componentRef.setInput('selected', selected);
      await helper.waitForChangeDetection();
    }

    async function chooseFromSearch(query: string) {
      helper.setInput('#myOptionsAdd', query);
      await helper.waitForChangeDetection();

      const button = fixture.nativeElement.querySelector('ngb-typeahead-window button.dropdown-item') as HTMLButtonElement;
      expect(button).toBeTruthy();
      button.click();
      helper.triggerChangeDetection();
      await helper.waitForChangeDetection();
    }

    async function focusSearch() {
      const input = fixture.nativeElement.querySelector('#myOptionsAdd') as HTMLInputElement;
      input.dispatchEvent(new Event('focus'));
      helper.triggerChangeDetection();
      await helper.waitForChangeDetection();
    }

    function offered(): string[] {
      const buttons = fixture.nativeElement.querySelectorAll('ngb-typeahead-window button.dropdown-item');
      return Array.from(buttons).map(b => (b as HTMLElement).textContent!.trim());
    }

    it('shows the empty text on load', () => {
      helper.expectTextContent('#myOptions .selected-empty', 'No options');
      helper.expectExists('#myOptions ol.selected-list', false);
    });

    it('shows the empty text it is given', async () => {
      fixture.componentRef.setInput('emptyText', 'Anything goes');
      await helper.waitForChangeDetection();

      helper.expectTextContent('#myOptions .selected-empty', 'Anything goes');
    });

    it('searches the options, clearing the search after each choice', () => {
      const element = fixture.debugElement.query(By.css('#myOptions dndgen-searchable-select'));
      expect(element).toBeTruthy();

      const select = element.componentInstance as SearchableSelectComponent;
      expect(select.id).toBe('myOptionsAdd');
      expect(select.options).toEqual(['Option 1', 'Option 2', 'Option 3', 'Option 4']);
      expect(select.clearOnSelect).toBe(true);
      expect(select.placeholder).toBe('Add an option');
    });

    it('offers every option when none are selected', async () => {
      await focusSearch();

      expect(offered()).toEqual(['Option 1', 'Option 2', 'Option 3', 'Option 4']);
    });

    it('offers only the options not already selected', async () => {
      await setSelected(['Option 3', 'Option 1']);

      await focusSearch();

      expect(offered()).toEqual(['Option 2', 'Option 4']);
    });

    it('adds a chosen option to the end of the list and stops offering it', async () => {
      await setSelected(['Option 1']);

      await chooseFromSearch('2');

      expect(emitted).toEqual([['Option 1', 'Option 2']]);
      helper.expectTextContents('#myOptions .selected-name', ['Option 1', 'Option 2']);
      helper.expectInput('#myOptionsAdd', false, '');

      await focusSearch();
      expect(offered()).toEqual(['Option 3', 'Option 4']);
    });

    it('offers a removed option again', async () => {
      await setSelected(['Option 1', 'Option 2']);

      helper.clickButton('#myOptions li:nth-child(1) button.selected-remove');
      await helper.waitForChangeDetection();

      await focusSearch();
      expect(offered()).toEqual(['Option 1', 'Option 3', 'Option 4']);
    });

    const lists = [
      { name: '1 option', selected: ['Option 1'] },
      { name: '2 options', selected: ['Option 1', 'Option 2'] },
      { name: 'many options', selected: ['Option 1', 'Option 4', 'Option 2'] },
    ];

    lists.forEach(test => {
      it(`shows ${test.name} in order, numbered, with move and remove buttons`, async () => {
        await setSelected(test.selected);

        helper.expectExists('#myOptions .selected-empty', false);
        helper.expectExists('#myOptions ol.list-group-numbered.selected-list');
        helper.expectTextContents('#myOptions .selected-name', test.selected);
        helper.expectCount('#myOptions button.selected-up', test.selected.length);
        helper.expectCount('#myOptions button.selected-down', test.selected.length);
        helper.expectCount('#myOptions button.selected-remove', test.selected.length);
      });

      it(`can't move the first of ${test.name} up or the last down`, async () => {
        await setSelected(test.selected);

        const ups = Array.from(fixture.nativeElement.querySelectorAll('#myOptions button.selected-up')) as HTMLButtonElement[];
        const downs = Array.from(fixture.nativeElement.querySelectorAll('#myOptions button.selected-down')) as HTMLButtonElement[];

        expect(ups.map(b => b.disabled)).toEqual(test.selected.map((_, i) => i == 0));
        expect(downs.map(b => b.disabled)).toEqual(test.selected.map((_, i) => i == test.selected.length - 1));
      });
    });

    it('labels the buttons with the option they act on', async () => {
      await setSelected(['Option 1']);

      helper.expectAttribute('#myOptions button.selected-up', 'aria-label', 'Move Option 1 up');
      helper.expectAttribute('#myOptions button.selected-down', 'aria-label', 'Move Option 1 down');
      helper.expectAttribute('#myOptions button.selected-remove', 'aria-label', 'Remove Option 1');
    });

    it('moves an option up', async () => {
      await setSelected(['Option 1', 'Option 2', 'Option 3']);

      helper.clickButton('#myOptions li:nth-child(3) button.selected-up');
      await helper.waitForChangeDetection();

      expect(emitted).toEqual([['Option 1', 'Option 3', 'Option 2']]);
      helper.expectTextContents('#myOptions .selected-name', ['Option 1', 'Option 3', 'Option 2']);
    });

    it('moves an option down', async () => {
      await setSelected(['Option 1', 'Option 2', 'Option 3']);

      helper.clickButton('#myOptions li:nth-child(1) button.selected-down');
      await helper.waitForChangeDetection();

      expect(emitted).toEqual([['Option 2', 'Option 1', 'Option 3']]);
      helper.expectTextContents('#myOptions .selected-name', ['Option 2', 'Option 1', 'Option 3']);
    });

    it('removes an option, keeping the order of the rest', async () => {
      await setSelected(['Option 1', 'Option 2', 'Option 3']);

      helper.clickButton('#myOptions li:nth-child(2) button.selected-remove');
      await helper.waitForChangeDetection();

      expect(emitted).toEqual([['Option 1', 'Option 3']]);
      helper.expectTextContents('#myOptions .selected-name', ['Option 1', 'Option 3']);
    });

    it('shows the empty text again after removing the last option', async () => {
      await setSelected(['Option 1']);

      helper.clickButton('#myOptions button.selected-remove');
      await helper.waitForChangeDetection();

      expect(emitted).toEqual([[]]);
      helper.expectTextContent('#myOptions .selected-empty', 'No options');
    });
  });
});
