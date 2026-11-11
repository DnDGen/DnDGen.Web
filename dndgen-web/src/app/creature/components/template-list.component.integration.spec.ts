import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TemplateListComponent } from './template-list.component';
import { TestHelper } from '../../test-helper';
import { NgbConfig } from '@ng-bootstrap/ng-bootstrap';
import { By } from '@angular/platform-browser';
import { SearchableSelectComponent } from '../../shared/components/searchable-select.component';

describe('Template List Component', () => {
  describe('integration', () => {
    let fixture: ComponentFixture<TemplateListComponent>;
    let helper: TestHelper<TemplateListComponent>;
    let emitted: string[][];

    beforeEach(async () => {
      await TestHelper.configureTestBed([TemplateListComponent]);

      TestBed.inject(NgbConfig).animation = false;

      fixture = TestBed.createComponent(TemplateListComponent);
      helper = new TestHelper(fixture);

      fixture.componentInstance.id = 'myTemplates';
      fixture.componentInstance.templates = ['Ghost', 'Lich', 'None', 'Vampire'];
      fixture.componentInstance.emptyText = 'Any templates';

      emitted = [];
      fixture.componentInstance.selectedChange.subscribe(selected => emitted.push(selected));

      helper.triggerChangeDetection();
      await helper.waitForChangeDetection();
    });

    async function setSelected(selected: string[]) {
      fixture.componentRef.setInput('selected', selected);
      await helper.waitForChangeDetection();
    }

    function addSelect(): SearchableSelectComponent {
      const element = fixture.debugElement.query(By.css('#myTemplates dndgen-searchable-select'));
      expect(element).toBeTruthy();
      return element.componentInstance as SearchableSelectComponent;
    }

    async function chooseFromSearch(query: string) {
      helper.setInput('#myTemplatesAdd', query);
      await helper.waitForChangeDetection();

      const button = fixture.nativeElement.querySelector('ngb-typeahead-window button.dropdown-item') as HTMLButtonElement;
      expect(button).toBeTruthy();
      button.click();
      helper.triggerChangeDetection();
      await helper.waitForChangeDetection();
    }

    function offered(): string[] {
      const buttons = fixture.nativeElement.querySelectorAll('ngb-typeahead-window button.dropdown-item');
      return Array.from(buttons).map(b => (b as HTMLElement).textContent!.trim());
    }

    it('shows the empty text when no templates are chosen', () => {
      helper.expectTextContent('#myTemplates .template-list-empty', 'Any templates');
      helper.expectExists('#myTemplates ol.template-list', false);
    });

    it('searches every template, clearing the search after each choice', () => {
      const select = addSelect();
      expect(select.id).toBe('myTemplatesAdd');
      expect(select.options).toEqual(['Ghost', 'Lich', 'None', 'Vampire']);
      expect(select.clearOnSelect).toBe(true);
      expect(select.placeholder).toBe('Add a template');
    });

    it('offers templates already chosen, including None', async () => {
      await setSelected(['None', 'Ghost']);

      const input = fixture.nativeElement.querySelector('#myTemplatesAdd') as HTMLInputElement;
      input.dispatchEvent(new Event('focus'));
      helper.triggerChangeDetection();
      await helper.waitForChangeDetection();

      expect(offered()).toEqual(['Ghost', 'Lich', 'None', 'Vampire']);
    });

    it('adds a chosen template to the end of the list', async () => {
      await setSelected(['Ghost']);

      await chooseFromSearch('lich');

      expect(emitted).toEqual([['Ghost', 'Lich']]);
      helper.expectTextContents('#myTemplates .template-name', ['Ghost', 'Lich']);
      helper.expectInput('#myTemplatesAdd', false, '');
    });

    it('adds None again when None is already chosen', async () => {
      await setSelected(['None']);

      await chooseFromSearch('none');

      expect(emitted).toEqual([['None', 'None']]);
      helper.expectTextContents('#myTemplates .template-name', ['None', 'None']);
    });

    const lists = [
      { name: '1 template', selected: ['Ghost'] },
      { name: '2 templates', selected: ['Ghost', 'Lich'] },
      { name: '3 templates', selected: ['Ghost', 'Lich', 'Vampire'] },
    ];

    lists.forEach(test => {
      it(`shows ${test.name} in order, numbered, with move and remove buttons`, async () => {
        await setSelected(test.selected);

        helper.expectExists('#myTemplates .template-list-empty', false);
        helper.expectExists('#myTemplates ol.list-group-numbered.template-list');
        helper.expectTextContents('#myTemplates .template-name', test.selected);
        helper.expectCount('#myTemplates button.template-up', test.selected.length);
        helper.expectCount('#myTemplates button.template-down', test.selected.length);
        helper.expectCount('#myTemplates button.template-remove', test.selected.length);
      });

      it(`can't move the first of ${test.name} up or the last down`, async () => {
        await setSelected(test.selected);

        const ups = Array.from(fixture.nativeElement.querySelectorAll('#myTemplates button.template-up')) as HTMLButtonElement[];
        const downs = Array.from(fixture.nativeElement.querySelectorAll('#myTemplates button.template-down')) as HTMLButtonElement[];

        expect(ups.map(b => b.disabled)).toEqual(test.selected.map((_, i) => i == 0));
        expect(downs.map(b => b.disabled)).toEqual(test.selected.map((_, i) => i == test.selected.length - 1));
      });
    });

    it('labels the buttons with the template they act on', async () => {
      await setSelected(['Ghost']);

      helper.expectAttribute('#myTemplates button.template-up', 'aria-label', 'Move Ghost up');
      helper.expectAttribute('#myTemplates button.template-down', 'aria-label', 'Move Ghost down');
      helper.expectAttribute('#myTemplates button.template-remove', 'aria-label', 'Remove Ghost');
    });

    it('moves a template up', async () => {
      await setSelected(['Ghost', 'Lich', 'Vampire']);

      helper.clickButton('#myTemplates li:nth-child(3) button.template-up');
      await helper.waitForChangeDetection();

      expect(emitted).toEqual([['Ghost', 'Vampire', 'Lich']]);
      helper.expectTextContents('#myTemplates .template-name', ['Ghost', 'Vampire', 'Lich']);
    });

    it('moves a template down', async () => {
      await setSelected(['Ghost', 'Lich', 'Vampire']);

      helper.clickButton('#myTemplates li:nth-child(1) button.template-down');
      await helper.waitForChangeDetection();

      expect(emitted).toEqual([['Lich', 'Ghost', 'Vampire']]);
      helper.expectTextContents('#myTemplates .template-name', ['Lich', 'Ghost', 'Vampire']);
    });

    it('removes a template, keeping the order of the rest', async () => {
      await setSelected(['Ghost', 'Lich', 'Vampire']);

      helper.clickButton('#myTemplates li:nth-child(2) button.template-remove');
      await helper.waitForChangeDetection();

      expect(emitted).toEqual([['Ghost', 'Vampire']]);
      helper.expectTextContents('#myTemplates .template-name', ['Ghost', 'Vampire']);
    });

    it('shows the empty text again after removing the last template', async () => {
      await setSelected(['Ghost']);

      helper.clickButton('#myTemplates button.template-remove');
      await helper.waitForChangeDetection();

      expect(emitted).toEqual([[]]);
      helper.expectTextContent('#myTemplates .template-list-empty', 'Any templates');
    });
  });
});
