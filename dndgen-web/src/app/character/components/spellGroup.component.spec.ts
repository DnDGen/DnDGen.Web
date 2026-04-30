import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailsComponent } from '../../shared/components/details.component';
import { By } from '@angular/platform-browser';
import { SpellGroupComponent } from './spellGroup.component';
import { SpellGroup } from '../models/spellGroup.model';
import { Spell } from '../models/spell.model';
import { TestHelper } from '../../test-helper';

describe('SpellGroup Component', () => {
  describe('unit', () => {
    let component: SpellGroupComponent;

    beforeEach(() => {
      component = new SpellGroupComponent();
    });
  
    it(`should set the spell group `, () => {
      const group = new SpellGroup('my group name');
      component.group = group;

      expect(component.group).toBe(group);
    });
  });

  describe('integration', () => {
    let fixture: ComponentFixture<SpellGroupComponent>;
    let helper: TestHelper<SpellGroupComponent>;
  
    beforeEach(async () => {
      await TestHelper.configureTestBed([SpellGroupComponent]);
  
      fixture = TestBed.createComponent(SpellGroupComponent);
      helper = new TestHelper(fixture);
    });
  
    it('should create the component', () => {
      const component = fixture.componentInstance;
      expect(component).toBeTruthy();
    });
  
    it(`should render the spell group`, async () => {
      const component = fixture.componentInstance;
      const group = new SpellGroup('my group name', [
        new Spell({'my source': 9}, 'my spell'),
        new Spell({'my source': 9}, 'my other spell'),
      ]);
      component.group = group;

      await helper.waitForChangeDetection();
  
      helper.expectDetails('dndgen-details.spell-group-heading', 'my group name', true);
      helper.expectTextContents('dndgen-details.spell-group-heading li', ['my spell', 'my other spell'])
    });
  
    it(`should render the spell group - with duplicates`, async () => {
      const component = fixture.componentInstance;
      const group = new SpellGroup('my group name', [
        new Spell({'my source': 9}, 'my spell'),
        new Spell({'my source': 9}, 'my other spell'),
        new Spell({'my source': 9}, 'my other spell'),
      ]);
      component.group = group;

      await helper.waitForChangeDetection();
  
      helper.expectDetails('dndgen-details.spell-group-heading', 'my group name', true);
      helper.expectTextContents('dndgen-details.spell-group-heading li', ['my spell', 'my other spell', 'my other spell'])
    });
  
    it(`should render the spell group - empty`, async () => {
      const component = fixture.componentInstance;
      const group = new SpellGroup('my group name', []);
      component.group = group;

      await helper.waitForChangeDetection();
  
      helper.expectDetails('dndgen-details.spell-group-heading', 'my group name', false);
    });
  });
});
