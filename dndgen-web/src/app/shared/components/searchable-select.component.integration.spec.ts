import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchableSelectComponent } from './searchable-select.component';
import { TestHelper } from '../../test-helper';
import { NgbConfig } from '@ng-bootstrap/ng-bootstrap';
import { CreatureService } from '../../creature/services/creature.service';
import { firstValueFrom } from 'rxjs';

describe('Searchable Select Component', () => {
  describe('integration', () => {
    let fixture: ComponentFixture<SearchableSelectComponent>;
    let helper: TestHelper<SearchableSelectComponent>;
    let emitted: string[];

    beforeEach(async () => {
      await TestHelper.configureTestBed([SearchableSelectComponent]);

      TestBed.inject(NgbConfig).animation = false;

      fixture = TestBed.createComponent(SearchableSelectComponent);
      helper = new TestHelper(fixture);

      fixture.componentInstance.id = 'mySelect';
      fixture.componentInstance.options = ['Hill Giant', 'Frost Giant', 'Human', 'Giant Eagle'];
      fixture.componentInstance.value = 'Human';
      fixture.componentInstance.placeholder = 'Search for a thing';

      emitted = [];
      fixture.componentInstance.valueChange.subscribe(value => emitted.push(value));

      helper.triggerChangeDetection();
      await helper.waitForChangeDetection();
    });

    function type(text: string) {
      helper.setInput('#mySelect', text);
    }

    function results(): string[] {
      const buttons = fixture.nativeElement.querySelectorAll('ngb-typeahead-window button.dropdown-item');
      return Array.from(buttons).map(b => (b as HTMLElement).textContent!.trim());
    }

    it('shows the current value in a text input with the id and placeholder', () => {
      helper.expectExists('input#mySelect.form-control');
      helper.expectAttribute('#mySelect', 'placeholder', 'Search for a thing');
      helper.expectInput('#mySelect', false, 'Human');
    });

    it('lists only the options containing the typed text, ignoring case', async () => {
      type('GIANT');
      await helper.waitForChangeDetection();

      expect(results()).toEqual(['Hill Giant', 'Frost Giant', 'Giant Eagle']);
    });

    it('lists every option when focused with no text', async () => {
      type('');
      const input = fixture.nativeElement.querySelector('#mySelect') as HTMLInputElement;
      input.dispatchEvent(new Event('focus'));
      helper.triggerChangeDetection();
      await helper.waitForChangeDetection();

      expect(results()).toEqual(['Hill Giant', 'Frost Giant', 'Human', 'Giant Eagle']);
    });

    it('lists nothing when no option contains the typed text', async () => {
      type('dragon');
      await helper.waitForChangeDetection();

      expect(results()).toEqual([]);
      expect(emitted).toEqual([]);
    });

    it('emits the option chosen from the list and shows it', async () => {
      type('frost');
      await helper.waitForChangeDetection();

      const button = fixture.nativeElement.querySelector('ngb-typeahead-window button.dropdown-item') as HTMLButtonElement;
      button.click();
      helper.triggerChangeDetection();
      await helper.waitForChangeDetection();

      expect(emitted).toEqual(['Frost Giant']);
      helper.expectInput('#mySelect', false, 'Frost Giant');
    });

    it('emits the option chosen from the list and empties the input when clearing on select', async () => {
      fixture.componentInstance.clearOnSelect = true;
      type('frost');
      await helper.waitForChangeDetection();

      const button = fixture.nativeElement.querySelector('ngb-typeahead-window button.dropdown-item') as HTMLButtonElement;
      button.click();
      helper.triggerChangeDetection();
      await helper.waitForChangeDetection();

      expect(emitted).toEqual(['Frost Giant']);
      helper.expectInput('#mySelect', false, '');
    });

    it('restores the current value when leaving the input after typing text that was not chosen', async () => {
      type('dragon');
      await helper.waitForChangeDetection();

      const input = fixture.nativeElement.querySelector('#mySelect') as HTMLInputElement;
      input.dispatchEvent(new Event('blur'));
      helper.triggerChangeDetection();
      await helper.waitForChangeDetection();

      expect(emitted).toEqual([]);
      helper.expectInput('#mySelect', false, 'Human');
    });

    it('shows a long option name in full', async () => {
      const longName = 'Yuan-ti Halfblood (Snake Head, Snake Tail instead of Human Legs)';
      fixture.componentInstance.options = [longName];
      helper.triggerChangeDetection();
      type('yuan');
      await helper.waitForChangeDetection();

      expect(results()).toEqual([longName]);
    });

    describe('with the real creature list', () => {
      let creatures: string[];

      beforeAll(async () => {
        await TestHelper.configureTestBed();
        const viewModel = await firstValueFrom(TestBed.inject(CreatureService).getViewModel());
        creatures = viewModel.creatures;
        TestBed.resetTestingModule();
      });

      beforeEach(async () => {
        fixture.componentInstance.options = creatures;
        helper.triggerChangeDetection();
        await helper.waitForChangeDetection();
      });

      const searches = [
        {
          query: 'yuan-ti',
          expected: [
            'Yuan-ti Abomination',
            'Yuan-ti Halfblood (Human Head, Arms are Snakes)',
            'Yuan-ti Halfblood (Snake Head)',
            'Yuan-ti Halfblood (Snake Head, Snake Tail instead of Human Legs)',
            'Yuan-ti Halfblood (Snake Head, Snake Tail and Human Legs)',
            'Yuan-ti Pureblood',
          ]
        },
        {
          query: 'YUAN-TI',
          expected: [
            'Yuan-ti Abomination',
            'Yuan-ti Halfblood (Human Head, Arms are Snakes)',
            'Yuan-ti Halfblood (Snake Head)',
            'Yuan-ti Halfblood (Snake Head, Snake Tail instead of Human Legs)',
            'Yuan-ti Halfblood (Snake Head, Snake Tail and Human Legs)',
            'Yuan-ti Pureblood',
          ]
        },
        {
          query: 'red dragon',
          expected: [
            'Chimera (Red Dragon head)',
            'Red Dragon, Wyrmling',
            'Red Dragon, Very Young',
            'Red Dragon, Young',
            'Red Dragon, Juvenile',
            'Red Dragon, Young Adult',
            'Red Dragon, Adult',
            'Red Dragon, Mature Adult',
            'Red Dragon, Old',
            'Red Dragon, Very Old',
            'Red Dragon, Ancient',
            'Red Dragon, Wyrm',
            'Red Dragon, Great Wyrm',
          ]
        },
        {
          query: 'colossal',
          expected: [
            'Animated Object, Colossal',
            'Animated Object, Colossal (Flexible)',
            'Animated Object, Colossal (More Than Two Legs, Long)',
            'Animated Object, Colossal (More Than Two Legs, Long, Wooden)',
            'Animated Object, Colossal (More Than Two Legs, Tall)',
            'Animated Object, Colossal (More Than Two Legs, Tall, Wooden)',
            'Animated Object, Colossal (Sheetlike)',
            'Animated Object, Colossal (Two Legs)',
            'Animated Object, Colossal (Two Legs, Wooden)',
            'Animated Object, Colossal (Wheels, Wooden)',
            'Animated Object, Colossal (Wooden)',
            'Monstrous Centipede, Colossal',
            'Monstrous Scorpion, Colossal',
            'Monstrous Spider, Hunter, Colossal',
            'Monstrous Spider, Web-Spinner, Colossal',
          ]
        },
      ];

      searches.forEach(test => {
        it(`lists exactly the creatures containing "${test.query}"`, async () => {
          type(test.query);
          await helper.waitForChangeDetection();

          expect(results()).toEqual(test.expected);
        });
      });
    });
  });
});
