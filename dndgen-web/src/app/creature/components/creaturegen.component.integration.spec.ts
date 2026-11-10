import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreatureGenComponent } from './creaturegen.component';
import { Size } from '../../shared/components/size.enum';
import { TestHelper } from '../../test-helper';
import { Creature } from '../models/creature.model';
import { By } from '@angular/platform-browser';
import { CreatureComponent } from './creature.component';
import { NgbConfig } from '@ng-bootstrap/ng-bootstrap';

describe('CreatureGen Component', () => {
  describe('integration', () => {
    let fixture: ComponentFixture<CreatureGenComponent>;
    let helper: TestHelper<CreatureGenComponent>;

    beforeEach(async () => {
      await TestHelper.configureTestBed([CreatureGenComponent]);

      TestBed.inject(NgbConfig).animation = false;

      fixture = TestBed.createComponent(CreatureGenComponent);
      helper = new TestHelper(fixture);

      //run ngOnInit
      await helper.waitForChangeDetection();
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    async function choose(inputSelector: string, query: string, option: string) {
      helper.setInput(inputSelector, query);
      await helper.waitForChangeDetection();

      const buttons = Array.from(fixture.nativeElement.querySelectorAll('ngb-typeahead-window button.dropdown-item')) as HTMLButtonElement[];
      const button = buttons.find(b => b.textContent!.trim() == option);
      expect(button).toBeTruthy();

      button!.click();
      helper.triggerChangeDetection();

      //run validation
      await helper.waitForChangeDetection();
    }

    async function setTemplates(listSelector: string, templates: string[]) {
      for (const template of templates) {
        await choose(`${listSelector}Add`, template, template);
      }
    }

    async function selectTab(index: number) {
      const tabs = fixture.nativeElement.querySelectorAll('ul.nav-tabs a.nav-link');
      (tabs.item(index) as HTMLAnchorElement).click();
      helper.triggerChangeDetection();
      await helper.waitForChangeDetection();
    }

    async function setSelect(selector: string, value: string) {
      const select = fixture.nativeElement.querySelector(selector) as HTMLSelectElement;
      const index = Array.from(select.options).findIndex(o => o.textContent == value);
      expect(index).toBeGreaterThanOrEqual(0);

      helper.setSelectByIndex(selector, index);

      //run validation
      await helper.waitForChangeDetection();
    }

    function displayedCreature(): Creature {
      const element = fixture.debugElement.query(By.css('#creatureSection dndgen-creature'));
      expect(element).toBeTruthy();
      expect(element.componentInstance).toBeInstanceOf(CreatureComponent);
      return (element.componentInstance as CreatureComponent).creature;
    }

    it('should show the loading component when loading', async () => {
      fixture.componentInstance.loading.set(true);
      await helper.waitForChangeDetection();

      helper.expectLoading('dndgen-loading', true, Size.Large);
    });

    it('should hide the loading component when not loading', () => {
      helper.expectLoading('dndgen-loading', false, Size.Large);
    });

    it('should set the creature model on init', () => {
      const viewModel = fixture.componentInstance.creatureModel()!;
      expect(viewModel).toBeTruthy();
      expect(viewModel.creatures.length).toBe(659);
      expect(viewModel.templates.length).toBe(44);
      expect(viewModel.alignments.length).toBe(9);
      expect(viewModel.creatureTypes.length).toBe(42);
      expect(viewModel.challengeRatings.length).toBe(34);
    });

    it('should validate both tabs on init', () => {
      const component = fixture.componentInstance;
      expect(component.validating()).toBe(false);
      expect(component.generating()).toBe(false);
      expect(component.validCreature()).toBe(true);
      expect(component.validRandom()).toBe(true);
    });

    it('should render the Set and Random tabs, with Set active', () => {
      helper.expectTextContents('ul.nav-tabs a.nav-link', ['Set', 'Random']);

      const tabLinks = fixture.nativeElement.querySelectorAll('ul.nav-tabs a.nav-link');
      expect(tabLinks.item(0).getAttribute('class')).toContain('active');
      expect(tabLinks.item(1).getAttribute('class')).not.toContain('active');
    });

    it('should render no creature', () => {
      helper.expectTextContent('#noCreature', 'No creature has been generated');
      helper.expectExists('#creatureSection dndgen-creature', false);
      helper.expectExists('#generatingSection', false);
    });

    it('should render a creature', async () => {
      const creature = new Creature('my creature');
      fixture.componentInstance.creature.set(creature);
      await helper.waitForChangeDetection();

      helper.expectExists('#noCreature', false);
      expect(displayedCreature()).toBe(creature);
    });

    it('should show when generating', async () => {
      fixture.componentInstance.generating.set(true);
      fixture.componentInstance.generatingMessage.set('Generating creature...');
      await helper.waitForChangeDetection();

      helper.expectExists('#creatureSection', false);
      helper.expectTextContent('#generatingSection > span', 'Generating creature...');
      helper.expectLoading('#generatingSection dndgen-loading', true, Size.Medium);
      helper.expectHasAttribute('#creatureButton', 'disabled', true);
    });

    describe('the set tab', () => {
      it('should render the set tab', () => {
        helper.expectExists('#creature');
        helper.expectInput('#creature #creatureName', false, 'Aasimar');
        helper.expectAttribute('#creature #creatureName', 'placeholder', 'Search for a creature');
        helper.expectTextContent('#creature #creatureTemplates .template-list-empty', 'No templates');
        helper.expectHasAttribute('#creature #creatureButton', 'disabled', false);
        helper.expectLoading('#creature #creatureValidating', false, Size.Small);
      });

      it('should show when validating the creature', async () => {
        fixture.componentInstance.validating.set(true);
        await helper.waitForChangeDetection();

        helper.expectValidating(fixture.componentInstance.validating(), '#creatureButton', '#creatureValidating');
      });

      it('should search for and choose a creature', async () => {
        await choose('#creatureName', 'giant', 'Hill Giant');

        expect(fixture.componentInstance.creatureName).toEqual('Hill Giant');
        helper.expectInput('#creatureName', false, 'Hill Giant');
        helper.expectValid(fixture.componentInstance.validating(), fixture.componentInstance.validCreature(), '#creatureButton', '#creatureValidating');
      });

      it('should generate the chosen creature', async () => {
        await choose('#creatureName', 'giant', 'Hill Giant');

        helper.clickButton('#creatureButton');
        helper.expectHasAttribute('#creatureButton', 'disabled', true);
        helper.expectExists('#creatureSection', false);

        //run generate
        await helper.waitForChangeDetection();

        helper.expectExists('#noCreature', false);
        const creature = displayedCreature();
        expect(creature.name).toEqual('Hill Giant');
        expect(creature.templates).toEqual([]);
        helper.expectHasAttribute('#creatureButton', 'disabled', false);
      });

      it('should validate a valid template', async () => {
        await choose('#creatureName', 'human', 'Human');
        await setTemplates('#creatureTemplates', ['Ghost']);

        expect(fixture.componentInstance.creatureTemplates).toEqual(['Ghost']);
        helper.expectTextContents('#creatureTemplates .template-name', ['Ghost']);
        helper.expectValid(fixture.componentInstance.validating(), fixture.componentInstance.validCreature(), '#creatureButton', '#creatureValidating');
      });

      it('should validate templates in an invalid order', async () => {
        await choose('#creatureName', 'human', 'Human');
        await setTemplates('#creatureTemplates', ['Ghost', 'Lich']);

        expect(fixture.componentInstance.creatureTemplates).toEqual(['Ghost', 'Lich']);
        helper.expectInvalid(fixture.componentInstance.validating(), fixture.componentInstance.validCreature(), '#creatureButton', '#creatureValidating');
      });

      it('should validate again after removing a template', async () => {
        await choose('#creatureName', 'human', 'Human');
        await setTemplates('#creatureTemplates', ['Ghost', 'Lich']);

        helper.clickButton('#creatureTemplates li:nth-child(2) button.template-remove');
        await helper.waitForChangeDetection();

        expect(fixture.componentInstance.creatureTemplates).toEqual(['Ghost']);
        helper.expectValid(fixture.componentInstance.validating(), fixture.componentInstance.validCreature(), '#creatureButton', '#creatureValidating');
      });

      it('should validate a repeated template as invalid', async () => {
        await choose('#creatureName', 'human', 'Human');
        await setTemplates('#creatureTemplates', ['Ghost', 'Ghost']);

        helper.expectInvalid(fixture.componentInstance.validating(), fixture.componentInstance.validCreature(), '#creatureButton', '#creatureValidating');
      });

      it('should validate a repeated None template as valid', async () => {
        await choose('#creatureName', 'human', 'Human');
        await setTemplates('#creatureTemplates', ['None', 'None']);

        expect(fixture.componentInstance.creatureTemplates).toEqual(['None', 'None']);
        helper.expectValid(fixture.componentInstance.validating(), fixture.componentInstance.validCreature(), '#creatureButton', '#creatureValidating');
      });

      it('should generate the creature with its template', async () => {
        await choose('#creatureName', 'human', 'Human');
        await setTemplates('#creatureTemplates', ['Ghost']);

        helper.clickButton('#creatureButton');
        await helper.waitForChangeDetection();

        const creature = displayedCreature();
        expect(creature.name).toEqual('Human');
        expect(creature.templates).toEqual(['Ghost']);
        expect(creature.summary).toEqual('Ghost Human');
      });
    });

    describe('the random tab', () => {
      beforeEach(async () => {
        await selectTab(1);
      });

      it('should render the random tab', () => {
        const model = fixture.componentInstance.creatureModel()!;

        helper.expectExists('#random');
        helper.expectSelect('#random #randomChallengeRating', false, 'Any', 35, ['Any', ...model.challengeRatings]);
        helper.expectSelect('#random #randomAlignment', false, 'Any', 10, ['Any', ...model.alignments]);
        helper.expectSelect('#random #randomCreatureType', false, 'Any', 43, ['Any', ...model.creatureTypes]);
        helper.expectTextContent('#random #randomTemplates .template-list-empty', 'Any templates');
        helper.expectHasAttribute('#random #randomButton', 'disabled', false);
        helper.expectLoading('#random #randomValidating', false, Size.Small);
      });

      it('should show when validating the random creature', async () => {
        fixture.componentInstance.validating.set(true);
        await helper.waitForChangeDetection();

        helper.expectValidating(fixture.componentInstance.validating(), '#randomButton', '#randomValidating');
      });

      const filters = [
        { name: 'challenge rating', selector: '#randomChallengeRating', value: '5', property: 'randomChallengeRating' },
        { name: 'alignment', selector: '#randomAlignment', value: 'Neutral Evil', property: 'randomAlignment' },
        { name: 'creature type', selector: '#randomCreatureType', value: 'Aberration', property: 'randomCreatureType' },
      ];

      filters.forEach(test => {
        it(`should validate the ${test.name} filter`, async () => {
          await setSelect(test.selector, test.value);

          expect((fixture.componentInstance as any)[test.property]).toEqual(test.value);
          helper.expectValid(fixture.componentInstance.validating(), fixture.componentInstance.validRandom(), '#randomButton', '#randomValidating');
        });

        it(`should clear the ${test.name} filter back to Any`, async () => {
          await setSelect(test.selector, test.value);
          await setSelect(test.selector, 'Any');

          expect((fixture.componentInstance as any)[test.property]).toEqual('');
          helper.expectValid(fixture.componentInstance.validating(), fixture.componentInstance.validRandom(), '#randomButton', '#randomValidating');
        });
      });

      it('should validate an incompatible template and alignment as invalid', async () => {
        await setSelect('#randomAlignment', 'Neutral Good');
        await setTemplates('#randomTemplates', ['Fiendish Creature']);

        helper.expectInvalid(fixture.componentInstance.validating(), fixture.componentInstance.validRandom(), '#randomButton', '#randomValidating');
      });

      it('should validate a repeated template as invalid', async () => {
        await setTemplates('#randomTemplates', ['Ghost', 'Ghost']);

        helper.expectInvalid(fixture.componentInstance.validating(), fixture.componentInstance.validRandom(), '#randomButton', '#randomValidating');
      });

      it('should validate a repeated None template as valid', async () => {
        await setTemplates('#randomTemplates', ['None', 'None']);

        helper.expectValid(fixture.componentInstance.validating(), fixture.componentInstance.validRandom(), '#randomButton', '#randomValidating');
      });

      it('should generate a random creature with no filters', async () => {
        helper.clickButton('#randomButton');
        await helper.waitForChangeDetection();

        const creature = displayedCreature();
        expect(creature.name).toBeTruthy();
        expect(creature.summary).toBeTruthy();
      });

      it('should generate a random creature matching every filter', async () => {
        await setSelect('#randomChallengeRating', '5');
        await setSelect('#randomAlignment', 'Neutral Evil');
        await setSelect('#randomCreatureType', 'Aberration');

        helper.clickButton('#randomButton');
        await helper.waitForChangeDetection();

        const creature = displayedCreature();
        expect(creature.challengeRating).toEqual('5');
        expect(creature.alignment.full).toEqual('Neutral Evil');
        expect(creature.type.allTypes).toContain('Aberration');
      });

      it('should generate an untemplated random creature with the None template', async () => {
        await setSelect('#randomChallengeRating', '5');
        await setSelect('#randomAlignment', 'Neutral Evil');
        await setSelect('#randomCreatureType', 'Aberration');
        await setTemplates('#randomTemplates', ['None']);

        helper.clickButton('#randomButton');
        await helper.waitForChangeDetection();

        const creature = displayedCreature();
        expect(creature.challengeRating).toEqual('5');
        expect(creature.alignment.full).toEqual('Neutral Evil');
        expect(creature.type.allTypes).toContain('Aberration');
        expect(creature.templates).toEqual([]);
      });

      it('should keep each tab\'s inputs when switching tabs', async () => {
        await setSelect('#randomAlignment', 'Neutral Evil');
        await setTemplates('#randomTemplates', ['None']);

        await selectTab(0);
        await choose('#creatureName', 'human', 'Human');
        await setTemplates('#creatureTemplates', ['Ghost']);

        await selectTab(1);

        const component = fixture.componentInstance;
        expect(component.randomAlignment).toEqual('Neutral Evil');
        expect(component.randomTemplates).toEqual(['None']);
        expect(component.creatureName).toEqual('Human');
        expect(component.creatureTemplates).toEqual(['Ghost']);
        helper.expectTextContent('#randomAlignment > option:checked', 'Neutral Evil');
        helper.expectTextContents('#randomTemplates .template-name', ['None']);
        helper.expectTextContents('#creatureTemplates .template-name', ['Ghost']);
      });
    });
  });
});
