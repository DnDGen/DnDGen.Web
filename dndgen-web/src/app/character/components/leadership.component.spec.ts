import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailsComponent } from '../../shared/components/details.component';
import { LeadershipComponent } from './leadership.component';
import { Leadership } from '../models/leadership.model';
import { Character } from '../models/character.model';
import { TestHelper } from '../../testHelper.spec';

describe('Leadership Component', () => {
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
    let helper: TestHelper<LeadershipComponent>;
  
    beforeEach(async () => {
      await TestHelper.configureTestBed([LeadershipComponent]);
  
      fixture = TestBed.createComponent(LeadershipComponent);
      helper = new TestHelper(fixture);
    });
  
    it('should create the component', () => {
      const component = fixture.componentInstance;
      expect(component).toBeTruthy();
    });
  
    it(`should render leadership`, () => {
      const component = fixture.componentInstance;
      component.leadership = new Leadership(9266, []);

      fixture.detectChanges();
  
      helper.expectDetails('dndgen-details.leadership-heading', 'Leadership', true);
      helper.expectTextContent('dndgen-details.leadership-heading li.leadership-score', 'Score: 9,266');
    });
  
    it(`should render leadership with low score`, () => {
      const component = fixture.componentInstance;
      component.leadership = new Leadership(0, []);

      fixture.detectChanges();
  
      helper.expectExists('dndgen-details.leadership-heading', false);
    });
  
    it(`should render leadership with modifiers`, () => {
      const component = fixture.componentInstance;
      component.leadership = new Leadership(9266, ['my modifier', 'my other modifier']);

      fixture.detectChanges();
  
      helper.expectDetails('dndgen-details.leadership-heading', 'Leadership', true);
      helper.expectExists('dndgen-details.leadership-heading li.leadership-modifiers', true);
      helper.expectDetails('dndgen-details.leadership-heading li.leadership-modifiers > dndgen-details', 'Leadership Modifiers', true);
      helper.expectTextContents('li.leadership-modifiers dndgen-details li', ['my modifier', 'my other modifier']);
    });
  
    it(`should render leadership without modifiers`, () => {
      const component = fixture.componentInstance;
      component.leadership = new Leadership(9266, []);

      fixture.detectChanges();
  
      helper.expectDetails('dndgen-details.leadership-heading', 'Leadership', true);
      helper.expectExists('dndgen-details.leadership-heading li.leadership-modifiers', false);
    });
  
    it(`should render cohort`, () => {
      const component = fixture.componentInstance;
      component.leadership = new Leadership(9266, []);

      const cohort = new Character('my cohort summary');
      component.cohort = cohort;

      fixture.detectChanges();
  
      helper.expectDetails('dndgen-details.leadership-heading', 'Leadership', true);
      helper.expectTextContent('dndgen-details.leadership-heading li.leadership-cohort span', 'Cohort:');
      helper.expectCharacter('dndgen-details.leadership-heading li.leadership-cohort dndgen-character', true, cohort);
    });
  
    it(`should render cohort - null`, () => {
      const component = fixture.componentInstance;
      component.leadership = new Leadership(9266, []);
      component.cohort = null;

      fixture.detectChanges();
  
      helper.expectDetails('dndgen-details.leadership-heading', 'Leadership', true);
      helper.expectExists('dndgen-details.leadership-heading li.leadership-cohort', false);
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
  
      helper.expectDetails('dndgen-details.leadership-heading', 'Leadership', true);
      helper.expectExists('dndgen-details.leadership-heading li.leadership-followers', true);
      helper.expectDetails('dndgen-details.leadership-heading li.leadership-followers dndgen-details', 'Followers', true);
      helper.expectCharacters('dndgen-details.leadership-heading li.leadership-followers dndgen-details dndgen-character', followers);
    });
  
    it(`should render followers - none`, () => {
      const component = fixture.componentInstance;
      component.leadership = new Leadership(9266, []);

      component.followers = [];

      fixture.detectChanges();
  
      helper.expectDetails('dndgen-details.leadership-heading', 'Leadership', true);
      helper.expectExists('dndgen-details.leadership-heading li.leadership-followers', false);
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
  
      helper.expectDetails('dndgen-details.leadership-heading', 'Leadership', true);
      helper.expectTextContent('dndgen-details.leadership-heading li.leadership-score', 'Score: 9,266');
      
      helper.expectExists('dndgen-details.leadership-heading li.leadership-modifiers', true);
      helper.expectDetails('dndgen-details.leadership-heading li.leadership-modifiers > dndgen-details', 'Leadership Modifiers', true);
      helper.expectTextContents('li.leadership-modifiers dndgen-details li', ['my modifier', 'my other modifier']);
      
      helper.expectTextContent('dndgen-details.leadership-heading li.leadership-cohort span', 'Cohort:');
      helper.expectCharacter('dndgen-details.leadership-heading li.leadership-cohort dndgen-character', true, cohort);
      
      helper.expectExists('dndgen-details.leadership-heading li.leadership-followers', true);
      helper.expectDetails('dndgen-details.leadership-heading li.leadership-followers dndgen-details', 'Followers', true);
      helper.expectCharacters('dndgen-details.leadership-heading li.leadership-followers dndgen-details dndgen-character', followers);
    });
  });
});
