import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreatureGenComponent } from './creaturegen.component';
import { Size } from '../../shared/components/size.enum';
import { TestHelper } from '../../test-helper';
import { Creature } from '../models/creature.model';
import { By } from '@angular/platform-browser';
import { CreatureComponent } from './creature.component';
import { NgbConfig } from '@ng-bootstrap/ng-bootstrap';
import FileSaver from 'file-saver';
import { CreatureTestHelper } from '../creature.test-helper';
import { CreatureService } from '../services/creature.service';
import { firstValueFrom } from 'rxjs';

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

    async function startChoosing(inputSelector: string, query: string, option: string) {
      helper.setInput(inputSelector, query);
      await helper.waitForChangeDetection();

      const buttons = Array.from(fixture.nativeElement.querySelectorAll('ngb-typeahead-window button.dropdown-item')) as HTMLButtonElement[];
      const button = buttons.find(b => b.textContent!.trim() == option);
      expect(button).toBeTruthy();

      button!.click();
      helper.triggerChangeDetection();
    }

    async function choose(inputSelector: string, query: string, option: string) {
      await startChoosing(inputSelector, query, option);

      //run validation
      await helper.waitForChangeDetection();
    }

    async function setTemplates(listSelector: string, templates: string[]) {
      for (const template of templates) {
        await choose(`${listSelector}Add`, template, template);
      }
    }

    function startClicking(selector: string) {
      helper.clickButton(selector);
    }

    async function selectTab(index: number) {
      const tabs = fixture.nativeElement.querySelectorAll('ul.nav-tabs a.nav-link');
      (tabs.item(index) as HTMLAnchorElement).click();
      helper.triggerChangeDetection();
      await helper.waitForChangeDetection();
    }

    function startSelecting(selector: string, value: string) {
      const select = fixture.nativeElement.querySelector(selector) as HTMLSelectElement;
      const index = Array.from(select.options).findIndex(o => o.textContent == value);
      expect(index).toBeGreaterThanOrEqual(0);

      helper.setSelectByIndex(selector, index);
    }

    async function setSelect(selector: string, value: string) {
      startSelecting(selector, value);

      //run validation
      await helper.waitForChangeDetection();
    }

    function displayedCreature(): Creature {
      const element = fixture.debugElement.query(By.css('#creatureSection dndgen-creature'));
      expect(element).toBeTruthy();
      expect(element.componentInstance).toBeInstanceOf(CreatureComponent);

      const creature = (element.componentInstance as CreatureComponent).creature;
      helper.expectDetails('#creatureSection dndgen-details.creature-header', creature.summary, true);

      return creature;
    }

    function expectSetValidating() {
      helper.expectValidating(fixture.componentInstance.validating(), '#creatureButton', '#creatureValidating');
    }

    function expectSetValid() {
      helper.expectValid(fixture.componentInstance.validating(), fixture.componentInstance.validCreature(), '#creatureButton', '#creatureValidating');
    }

    function expectSetInvalid() {
      helper.expectInvalid(fixture.componentInstance.validating(), fixture.componentInstance.validCreature(), '#creatureButton', '#creatureValidating');
    }

    function expectRandomValidating() {
      helper.expectValidating(fixture.componentInstance.validating(), '#randomButton', '#randomValidating');
    }

    function expectRandomValid() {
      helper.expectValid(fixture.componentInstance.validating(), fixture.componentInstance.validRandom(), '#randomButton', '#randomValidating');
    }

    function expectRandomInvalid() {
      helper.expectInvalid(fixture.componentInstance.validating(), fixture.componentInstance.validRandom(), '#randomButton', '#randomValidating');
    }

    async function generate(buttonSelector: string, validatingSelector: string): Promise<Creature> {
      startClicking(buttonSelector);

      helper.expectGenerating(
        fixture.componentInstance.generating(),
        buttonSelector,
        '#creatureSection',
        '#generatingSection dndgen-loading',
        validatingSelector,
        '#downloadButton');

      //run generate
      await helper.waitForChangeDetection();

      helper.expectGenerated(
        fixture.componentInstance.generating(),
        buttonSelector,
        '#creatureSection',
        '#generatingSection',
        validatingSelector,
        '#downloadButton',
        false);

      helper.expectExists('#noCreature', false);

      return displayedCreature();
    }

    it('should show the loading component when loading', async () => {
      fixture.componentInstance.loading.set(true);
      await helper.waitForChangeDetection();

      helper.expectLoading('dndgen-loading', true, Size.Large);
    });

    it('should hide the loading component when not loading', () => {
      helper.expectLoading('dndgen-loading', false, Size.Large);
    });

    it('should set the creature model on init', async () => {
      const expected = await firstValueFrom(TestBed.inject(CreatureService).getViewModel());

      expect(fixture.componentInstance.creatureModel()).toEqual(expected);
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
      helper.expectExists('#downloadButton', false);
    });

    it('should render a creature', async () => {
      const creature = CreatureTestHelper.createMinimalCreature();
      fixture.componentInstance.creature.set(creature);
      await helper.waitForChangeDetection();

      helper.expectExists('#noCreature', false);
      helper.expectExists('#downloadButton', true);
      expect(displayedCreature()).toBe(creature);
    });

    it('should show when generating', async () => {
      fixture.componentInstance.generating.set(true);
      fixture.componentInstance.generatingMessage.set('Generating creature...');
      await helper.waitForChangeDetection();

      helper.expectGenerating(
        fixture.componentInstance.generating(),
        '#creatureButton',
        '#creatureSection',
        '#generatingSection dndgen-loading',
        '#creatureValidating',
        '#downloadButton');
      helper.expectTextContent('#generatingSection > span', 'Generating creature...');
    });

    it('should download the displayed creature', async () => {
      //Even for an integration test, we don't want to create an actual file
      const fileSaverSpy = vi.spyOn(FileSaver, 'saveAs').mockImplementation(() => {});

      fixture.componentInstance.creature.set(CreatureTestHelper.createMinimalCreature());
      await helper.waitForChangeDetection();

      helper.clickButton('#downloadButton');

      expect(FileSaver.saveAs).toHaveBeenCalledWith(expect.any(Blob), 'Gelatinous Cube.txt');

      const text = await (fileSaverSpy.mock.calls[0][0] as Blob).text();
      expect(text).toMatch(/^Gelatinous Cube:[\r\n]+[\S\s]+[\r\n\s]+$/);
    });

    it('should download a generated creature', async () => {
      const fileSaverSpy = vi.spyOn(FileSaver, 'saveAs').mockImplementation(() => {});

      await choose('#creatureName', 'human', 'Human');
      await setTemplates('#creatureTemplates', ['Ghost']);
      await generate('#creatureButton', '#creatureValidating');

      helper.clickButton('#downloadButton');

      expect(FileSaver.saveAs).toHaveBeenCalledWith(expect.any(Blob), 'Ghost Human.txt');

      const text = await (fileSaverSpy.mock.calls[0][0] as Blob).text();
      expect(text).toMatch(/^Ghost Human:[\r\n]+[\S\s]+[\r\n\s]+$/);
      expect(text).toMatch(/[\r\n]+\tTemplates: Ghost[\r\n]+/);
    });

    describe('the set tab', () => {
      it('should render the set tab', () => {
        helper.expectExists('#creature');
        helper.expectInput('#creature #creatureName', false, 'Aasimar');
        helper.expectAttribute('#creature #creatureName', 'placeholder', 'Search for a creature');
        helper.expectTextContent('#creature #creatureTemplates .selected-empty', 'No templates');
        helper.expectHasAttribute('#creature #creatureButton', 'disabled', false);
        helper.expectLoading('#creature #creatureValidating', false, Size.Small);
      });

      it('should show when validating the creature', async () => {
        fixture.componentInstance.validating.set(true);
        await helper.waitForChangeDetection();

        expectSetValidating();
      });

      it('should show that the creature is valid after choosing a creature', async () => {
        await startChoosing('#creatureName', 'giant', 'Hill Giant');

        expect(fixture.componentInstance.creatureName).toEqual('Hill Giant');
        helper.expectInput('#creatureName', false, 'Hill Giant');
        expectSetValidating();

        //run validation
        await helper.waitForChangeDetection();

        expectSetValid();
      });

      it('should show that the creature is invalid after choosing a creature the templates cannot apply to', async () => {
        await choose('#creatureName', 'human', 'Human');
        await setTemplates('#creatureTemplates', ['Ghost']);
        expectSetValid();

        await startChoosing('#creatureName', 'iron golem', 'Iron Golem');
        expectSetValidating();

        //run validation
        await helper.waitForChangeDetection();

        expectSetInvalid();
      });

      it('should show that the creature is valid again after choosing a creature the templates can apply to', async () => {
        await choose('#creatureName', 'iron golem', 'Iron Golem');
        await setTemplates('#creatureTemplates', ['Ghost']);
        expectSetInvalid();

        await startChoosing('#creatureName', 'human', 'Human');
        expectSetValidating();

        //run validation
        await helper.waitForChangeDetection();

        expectSetValid();
      });

      it('should show that the creature is valid after adding a template', async () => {
        await choose('#creatureName', 'human', 'Human');

        await startChoosing('#creatureTemplatesAdd', 'ghost', 'Ghost');

        expect(fixture.componentInstance.creatureTemplates).toEqual(['Ghost']);
        helper.expectTextContents('#creatureTemplates .selected-name', ['Ghost']);
        expectSetValidating();

        //run validation
        await helper.waitForChangeDetection();

        expectSetValid();
      });

      it('should show that the creature is invalid after adding a template in an invalid order', async () => {
        await choose('#creatureName', 'human', 'Human');
        await setTemplates('#creatureTemplates', ['Ghost']);

        await startChoosing('#creatureTemplatesAdd', 'lich', 'Lich');

        expect(fixture.componentInstance.creatureTemplates).toEqual(['Ghost', 'Lich']);
        expectSetValidating();

        //run validation
        await helper.waitForChangeDetection();

        expectSetInvalid();
      });

      it('should show that the creature is valid again after removing a template', async () => {
        await choose('#creatureName', 'human', 'Human');
        await setTemplates('#creatureTemplates', ['Ghost', 'Lich']);
        expectSetInvalid();

        startClicking('#creatureTemplates li:nth-child(2) button.selected-remove');

        expect(fixture.componentInstance.creatureTemplates).toEqual(['Ghost']);
        expectSetValidating();

        //run validation
        await helper.waitForChangeDetection();

        expectSetValid();
      });

      it('should show that the creature is valid again after moving a template', async () => {
        await choose('#creatureName', 'human', 'Human');
        await setTemplates('#creatureTemplates', ['Ghost', 'Half-Dragon (Red)']);
        expectSetInvalid();

        startClicking('#creatureTemplates li:nth-child(2) button.selected-up');

        expect(fixture.componentInstance.creatureTemplates).toEqual(['Half-Dragon (Red)', 'Ghost']);
        expectSetValidating();

        //run validation
        await helper.waitForChangeDetection();

        expectSetValid();
      });

      it('should generate the chosen creature', async () => {
        await choose('#creatureName', 'giant', 'Hill Giant');

        const creature = await generate('#creatureButton', '#creatureValidating');

        expect(creature.name).toEqual('Hill Giant');
        expect(creature.templates).toEqual([]);
      });

      it('should generate the chosen creature with its template', async () => {
        await choose('#creatureName', 'human', 'Human');
        await setTemplates('#creatureTemplates', ['Ghost']);

        const creature = await generate('#creatureButton', '#creatureValidating');

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
        helper.expectTextContent('#random #randomTemplates .selected-empty', 'Any templates');
        helper.expectHasAttribute('#random #randomButton', 'disabled', false);
        helper.expectLoading('#random #randomValidating', false, Size.Small);
      });

      it('should show when validating the random creature', async () => {
        fixture.componentInstance.validating.set(true);
        await helper.waitForChangeDetection();

        expectRandomValidating();
      });

      it('should show when generating a random creature', async () => {
        fixture.componentInstance.generating.set(true);
        await helper.waitForChangeDetection();

        helper.expectGenerating(
          fixture.componentInstance.generating(),
          '#randomButton',
          '#creatureSection',
          '#generatingSection dndgen-loading',
          '#randomValidating',
          '#downloadButton');
      });

      const filters = [
        { name: 'a challenge rating', selector: '#randomChallengeRating', value: '5', property: 'randomChallengeRating' },
        { name: 'an alignment', selector: '#randomAlignment', value: 'Neutral Evil', property: 'randomAlignment' },
        { name: 'a creature type', selector: '#randomCreatureType', value: 'Aberration', property: 'randomCreatureType' },
      ];

      filters.forEach(test => {
        it(`should show that the random creature is valid after choosing ${test.name}`, async () => {
          startSelecting(test.selector, test.value);

          expect((fixture.componentInstance as any)[test.property]).toEqual(test.value);
          expectRandomValidating();

          //run validation
          await helper.waitForChangeDetection();

          expectRandomValid();
        });
      });

      const invalidFilters = [
        {
          name: 'challenge rating',
          selector: '#randomChallengeRating',
          property: 'randomChallengeRating',
          setup: [{ selector: '#randomChallengeRating', value: '27' }, { selector: '#randomCreatureType', value: 'Vermin' }],
          templates: [],
        },
        {
          name: 'creature type',
          selector: '#randomCreatureType',
          property: 'randomCreatureType',
          setup: [{ selector: '#randomChallengeRating', value: '27' }, { selector: '#randomCreatureType', value: 'Vermin' }],
          templates: [],
        },
        {
          name: 'alignment',
          selector: '#randomAlignment',
          property: 'randomAlignment',
          setup: [{ selector: '#randomAlignment', value: 'Neutral Good' }],
          templates: ['Fiendish Creature'],
        },
      ];

      invalidFilters.forEach(test => {
        it(`should show that the random creature is valid again after clearing the ${test.name} back to Any`, async () => {
          for (const filter of test.setup) {
            await setSelect(filter.selector, filter.value);
          }

          await setTemplates('#randomTemplates', test.templates);
          expectRandomInvalid();

          startSelecting(test.selector, 'Any');

          expect((fixture.componentInstance as any)[test.property]).toEqual('');
          expectRandomValidating();

          //run validation
          await helper.waitForChangeDetection();

          expectRandomValid();
        });
      });

      it('should show that the random creature is invalid after adding an incompatible template', async () => {
        await setSelect('#randomAlignment', 'Neutral Good');

        await startChoosing('#randomTemplatesAdd', 'fiendish', 'Fiendish Creature');

        expect(fixture.componentInstance.randomTemplates).toEqual(['Fiendish Creature']);
        expectRandomValidating();

        //run validation
        await helper.waitForChangeDetection();

        expectRandomInvalid();
      });

      it('should show that the random creature is valid again after removing a template', async () => {
        await setTemplates('#randomTemplates', ['Ghost', 'Lich']);
        expectRandomInvalid();

        startClicking('#randomTemplates li:nth-child(2) button.selected-remove');

        expect(fixture.componentInstance.randomTemplates).toEqual(['Ghost']);
        expectRandomValidating();

        //run validation
        await helper.waitForChangeDetection();

        expectRandomValid();
      });

      it('should generate a random creature with no filters', async () => {
        const creature = await generate('#randomButton', '#randomValidating');

        expect(creature.summary).toEqual(fixture.componentInstance.creature()!.summary);
      });

      it('should generate a random creature with the challenge rating', async () => {
        await setSelect('#randomChallengeRating', '5');

        const creature = await generate('#randomButton', '#randomValidating');

        expect(creature.challengeRating).toEqual('5');
      });

      it('should generate a random creature with the alignment', async () => {
        await setSelect('#randomAlignment', 'Neutral Evil');

        const creature = await generate('#randomButton', '#randomValidating');

        expect(creature.alignment.full).toEqual('Neutral Evil');
      });

      it('should generate a random creature with the creature type', async () => {
        await setSelect('#randomCreatureType', 'Aberration');

        const creature = await generate('#randomButton', '#randomValidating');

        expect(creature.type.allTypes).toContain('Aberration');
      });

      it('should generate a random creature matching every filter', async () => {
        await setSelect('#randomChallengeRating', '5');
        await setSelect('#randomAlignment', 'Neutral Evil');
        await setSelect('#randomCreatureType', 'Aberration');

        const creature = await generate('#randomButton', '#randomValidating');

        expect(creature.challengeRating).toEqual('5');
        expect(creature.alignment.full).toEqual('Neutral Evil');
        expect(creature.type.allTypes).toContain('Aberration');
      });

      it('should generate an untemplated random creature with the None template', async () => {
        await setTemplates('#randomTemplates', ['None']);

        const creature = await generate('#randomButton', '#randomValidating');

        expect(creature.templates).toEqual([]);
      });

      it('should generate an untemplated random creature matching every filter with the None template', async () => {
        await setSelect('#randomChallengeRating', '5');
        await setSelect('#randomAlignment', 'Neutral Evil');
        await setSelect('#randomCreatureType', 'Aberration');
        await setTemplates('#randomTemplates', ['None']);

        const creature = await generate('#randomButton', '#randomValidating');

        expect(creature.challengeRating).toEqual('5');
        expect(creature.alignment.full).toEqual('Neutral Evil');
        expect(creature.type.allTypes).toContain('Aberration');
        expect(creature.templates).toEqual([]);
      });

      it('should generate a random creature with the template', async () => {
        await setTemplates('#randomTemplates', ['Ghost']);

        const creature = await generate('#randomButton', '#randomValidating');

        expect(creature.templates).toEqual(['Ghost']);
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
        helper.expectTextContents('#randomTemplates .selected-name', ['None']);
        helper.expectTextContents('#creatureTemplates .selected-name', ['Ghost']);
      });
    });
  });
});
