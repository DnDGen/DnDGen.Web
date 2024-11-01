import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailsComponent } from '../../shared/components/details.component';
import { By } from '@angular/platform-browser';
import { SpellGroupComponent } from './spellGroup.component';
import { SpellGroup } from '../models/spellGroup.model';
import { Spell } from '../models/spell.model';
import { TestHelper } from '../../testHelper.spec';

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
  
    beforeEach(async () => {
      await TestHelper.configureTestBed([SpellGroupComponent]);
  
      fixture = TestBed.createComponent(SpellGroupComponent);
    });
  
    it('should create the component', () => {
      const component = fixture.componentInstance;
      expect(component).toBeTruthy();
    });
  
    it(`should render the spell group`, () => {
      const component = fixture.componentInstance;
      const group = new SpellGroup('my group name', [
        new Spell('my source', 9, 'my spell'),
        new Spell('my source', 9, 'my other spell'),
      ]);
      component.group = group;

      fixture.detectChanges();
  
      expectDetails('dndgen-details.spell-group-heading', 'my group name', true);
      expectListItems('dndgen-details.spell-group-heading li', ['my spell', 'my other spell'])
    });
  
    it(`should render the spell group - with duplicates`, () => {
      const component = fixture.componentInstance;
      const group = new SpellGroup('my group name', [
        new Spell('my source', 9, 'my spell'),
        new Spell('my source', 9, 'my other spell'),
        new Spell('my source', 9, 'my other spell'),
      ]);
      component.group = group;

      fixture.detectChanges();
  
      expectDetails('dndgen-details.spell-group-heading', 'my group name', true);
      expectListItems('dndgen-details.spell-group-heading li', ['my spell', 'my other spell', 'my other spell'])
    });
  
    it(`should render the spell group - empty`, () => {
      const component = fixture.componentInstance;
      const group = new SpellGroup('my group name', []);
      component.group = group;

      fixture.detectChanges();
  
      expectDetails('dndgen-details.spell-group-heading', 'my group name', false);
    });

    function expectDetails(selector: string, heading: string, hasDetails: boolean) {
      const element = fixture.debugElement.query(By.css(selector));
      expect(element).toBeTruthy();
      expect(element.componentInstance).toBeTruthy();
      expect(element.componentInstance).toBeInstanceOf(DetailsComponent);

      const details = element.componentInstance as DetailsComponent;
      expect(details.heading).toEqual(heading);
      expect(details.hasDetails).toBe(hasDetails);
    }

    function expectListItems(selector: string, text: string[]) {
      const compiled = fixture.nativeElement as HTMLElement;
      const listItems = compiled.querySelectorAll(selector);
      expect(listItems).toBeTruthy();
      expect(listItems?.length).toEqual(text.length);

      for(var i = 0; i < listItems.length; i++) {
        expect(listItems?.item(i).textContent).toEqual(text[i]);
      }
    }
  });
});
