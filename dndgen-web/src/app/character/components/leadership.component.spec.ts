import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppModule } from '../../app.module';
import { DetailsComponent } from '../../shared/components/details.component';
import { By } from '@angular/platform-browser';
import { Feat } from '../models/feat.model';
import { LeadershipComponent } from './leadership.component';
import { Frequency } from '../models/frequency.model';
import { Leadership } from '../models/leadership.model';
import { Character } from '../models/character.model';
import { CharacterComponent } from './character.component';
import { DebugElement } from '@angular/core';

describe('LeadershipComponent', () => {
  describe('unit', () => {
    let component: LeadershipComponent;

    beforeEach(() => {
      component = new LeadershipComponent();
    });
  
    it(`should set the leadership`, () => {
      const leadership = new Leadership(9266, ['my modifier', 'my other modifier']);
      component.leadership = leadership;

      expect(component.leadership).toBe(leadership);
    });
  
    it(`should set the cohort`, () => {
      const cohort = new Character('my cohort summary');
      component.cohort = cohort;

      expect(component.cohort).toBe(cohort);
    });
  
    it(`should set the cohort - null`, () => {
      component.cohort = null;

      expect(component.cohort).toBeNull();
    });
  
    it(`should set the followers`, () => {
      const followers =[
        new Character('my follower summary'),
        new Character('my other follower summary'),
      ];
      component.followers = followers;

      expect(component.followers).toBe(followers);
    });
  
    it(`should set the followers - empty`, () => {
      component.followers = [];

      expect(component.followers).toEqual([]);
    });
  });

  describe('integration', () => {
    let fixture: ComponentFixture<LeadershipComponent>;
  
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [
          AppModule
        ],
        declarations: [LeadershipComponent, DetailsComponent]
      }).compileComponents();
  
      fixture = TestBed.createComponent(LeadershipComponent);
    });
  
    it('should create the component', () => {
      const component = fixture.componentInstance;
      expect(component).toBeTruthy();
    });
  
    it(`should render leadership`, () => {
      const component = fixture.componentInstance;
      component.leadership = new Leadership(9266, []);

      fixture.detectChanges();
  
      expectDetails('dndgen-details.leadership-heading', 'Leadership', true);
      expectHasAttribute('dndgen-details.leadership-heading', 'hidden', false);
      expectElement('dndgen-details.leadership-heading li.leadership-score', 'Score: 9,266');
    });
  
    it(`should render leadership with low score`, () => {
      const component = fixture.componentInstance;
      component.leadership = new Leadership(0, []);

      fixture.detectChanges();
  
      expectDetails('dndgen-details.leadership-heading', 'Leadership', false);
      expectHasAttribute('dndgen-details.leadership-heading', 'hidden', true);
    });
  
    it(`should render leadership with modifiers`, () => {
      const component = fixture.componentInstance;
      component.leadership = new Leadership(9266, ['my modifier', 'my other modifier']);

      fixture.detectChanges();
  
      expectDetails('dndgen-details.leadership-heading', 'Leadership', true);
      expectHasAttribute('dndgen-details.leadership-heading', 'hidden', false);
      expectHasAttribute('dndgen-details.leadership-heading li.leadership-modifiers', 'hidden', false);
      expectDetails('dndgen-details.leadership-heading li.leadership-modifiers > dndgen-details', 'Leadership Modifiers', true);
      expectListItems('li.leadership-modifiers dndgen-details li', ['my modifier', 'my other modifier']);
    });
  
    it(`should render leadership without modifiers`, () => {
      const component = fixture.componentInstance;
      component.leadership = new Leadership(9266, []);

      fixture.detectChanges();
  
      expectDetails('dndgen-details.leadership-heading', 'Leadership', true);
      expectHasAttribute('dndgen-details.leadership-heading', 'hidden', false);
      expectHasAttribute('dndgen-details.leadership-heading li.leadership-modifiers', 'hidden', true);
      expectDetails('dndgen-details.leadership-heading li.leadership-modifiers > dndgen-details', 'Leadership Modifiers', false);
    });
  
    it(`should render cohort`, () => {
      const component = fixture.componentInstance;
      component.leadership = new Leadership(9266, []);

      const cohort = new Character('my cohort summary');
      component.cohort = cohort;

      fixture.detectChanges();
  
      expectDetails('dndgen-details.leadership-heading', 'Leadership', true);
      expectHasAttribute('dndgen-details.leadership-heading', 'hidden', false);
      expectElement('dndgen-details.leadership-heading li.leadership-cohort span', 'Cohort:');
      expectCharacter('dndgen-details.leadership-heading li.leadership-cohort dndgen-character', cohort);
    });
  
    it(`should render cohort - null`, () => {
      const component = fixture.componentInstance;
      component.leadership = new Leadership(9266, []);
      component.cohort = null;

      fixture.detectChanges();
  
      expectDetails('dndgen-details.leadership-heading', 'Leadership', true);
      expectHasAttribute('dndgen-details.leadership-heading', 'hidden', false);
      expectNoElement('dndgen-details.leadership-heading li.leadership-cohort');
    });
  
    it(`should render followers`, () => {
      const component = fixture.componentInstance;
      component.leadership = new Leadership(9266, []);

      const followers = [
        new Character('my follower summary'),
        new Character('my other follower summary'),
      ];
      component.followers = followers;

      fixture.detectChanges();
  
      expectDetails('dndgen-details.leadership-heading', 'Leadership', true);
      expectHasAttribute('dndgen-details.leadership-heading', 'hidden', false);
      expectHasAttribute('dndgen-details.leadership-heading li.leadership-followers', 'hidden', false);
      expectDetails('dndgen-details.leadership-heading li.leadership-followers dndgen-details', 'Followers', true);
      expectCharacters('dndgen-details.leadership-heading li.leadership-followers dndgen-details dndgen-character', followers);
    });
  
    it(`should render followers - none`, () => {
      const component = fixture.componentInstance;
      component.leadership = new Leadership(9266, []);

      component.followers = [];

      fixture.detectChanges();
  
      expectDetails('dndgen-details.leadership-heading', 'Leadership', true);
      expectHasAttribute('dndgen-details.leadership-heading', 'hidden', false);
      expectHasAttribute('dndgen-details.leadership-heading li.leadership-followers', 'hidden', true);
      expectDetails('dndgen-details.leadership-heading li.leadership-followers dndgen-details', 'Followers', false);
    });
  
    it(`should render full leadership`, () => {
      const component = fixture.componentInstance;
      component.leadership = new Leadership(9266, ['my modifier', 'my other modifier']);

      const cohort = new Character('my cohort summary');
      component.cohort = cohort;

      const followers = [
        new Character('my follower summary'),
        new Character('my other follower summary'),
      ];
      component.followers = followers;

      fixture.detectChanges();
  
      expectDetails('dndgen-details.leadership-heading', 'Leadership', true);
      expectHasAttribute('dndgen-details.leadership-heading', 'hidden', false);
      expectElement('dndgen-details.leadership-heading li.leadership-score', 'Score: 9,266');
      
      expectHasAttribute('dndgen-details.leadership-heading li.leadership-modifiers', 'hidden', false);
      expectDetails('dndgen-details.leadership-heading li.leadership-modifiers > dndgen-details', 'Leadership Modifiers', true);
      expectListItems('li.leadership-modifiers dndgen-details li', ['my modifier', 'my other modifier']);
      
      expectElement('dndgen-details.leadership-heading li.leadership-cohort span', 'Cohort:');
      expectCharacter('dndgen-details.leadership-heading li.leadership-cohort dndgen-character', cohort);
      
      expectHasAttribute('dndgen-details.leadership-heading li.leadership-followers', 'hidden', false);
      expectDetails('dndgen-details.leadership-heading li.leadership-followers dndgen-details', 'Followers', true);
      expectCharacters('dndgen-details.leadership-heading li.leadership-followers dndgen-details dndgen-character', followers);
    });

    function expectHasAttribute(selector: string, attribute: string, hasAttribute: boolean) {
      const compiled = fixture.nativeElement as HTMLElement;

      const element = compiled!.querySelector(selector);
      expect(element).toBeTruthy();
      expect(element?.hasAttribute(attribute)).toBe(hasAttribute);
    }

    function expectDetails(selector: string, heading: string, hasDetails: boolean) {
      const element = fixture.debugElement.query(By.css(selector));
      expect(element).toBeTruthy();
      expect(element.componentInstance).toBeTruthy();
      expect(element.componentInstance).toBeInstanceOf(DetailsComponent);

      const details = element.componentInstance as DetailsComponent;
      expect(details.heading).toEqual(heading);
      expect(details.hasDetails).toBe(hasDetails);
    }

    function expectCharacter(selector: string, character: Character) {
      const element = fixture.debugElement.query(By.css(selector));
      expectCharacterInElement(element, character);
    }

    function expectCharacterInElement(element: DebugElement, character: Character) {
      expect(element).toBeTruthy();
      expect(element.componentInstance).toBeTruthy();
      expect(element.componentInstance).toBeInstanceOf(CharacterComponent);

      const details = element.componentInstance as CharacterComponent;
      expect(details.character).toBe(character);
    }

    function expectCharacters(selector: string, characters: Character[]) {
      const elements = fixture.debugElement.queryAll(By.css(selector));
      expect(elements).toBeTruthy();
      expect(elements?.length).toEqual(characters.length);

      for(var i = 0; i < elements.length; i++) {
        expectCharacterInElement(elements?.at(i)!, characters[i]);
      }
    }

    function expectElement(selector: string, text: string) {
      const compiled = fixture.nativeElement as HTMLElement;
      const element = compiled.querySelector(selector);
      expect(element).toBeTruthy();
      expect(element?.textContent).toEqual(text);
    }

    function expectNoElement(selector: string) {
      const compiled = fixture.nativeElement as HTMLElement;
      const element = compiled.querySelector(selector);
      expect(element).toBeFalsy();
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
