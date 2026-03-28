import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CharacterGenComponent } from './charactergen.component';
import { Character } from '../models/character.model';
import { Leadership } from '../models/leadership.model';
import { FollowerQuantities } from '../models/followerQuantities.model';
import { LeadershipComponent } from './leadership.component';
import { TestHelper } from '../../test-helper';
import { By } from '@angular/platform-browser';
import * as FileSaver from 'file-saver';

// Temporary stubs for unmigrated tests (fakeAsync/tick/flush require zone.js which is not available in Vitest)
// These stubs allow the file to load while unmigrated tests are skipped
const fakeAsync = (fn: (...args: any[]) => void): (...args: any[]) => void => fn;
const tick = (_ms?: number) => {};
const flush = () => {};
const waitForAsync = (fn: (...args: any[]) => void): (...args: any[]) => void => fn;

describe('CharacterGen Component', () => {
  describe('integration', () => {
    let fixture: ComponentFixture<CharacterGenComponent>;
    let helper: TestHelper<CharacterGenComponent>;

    beforeEach(async () => {
      await TestHelper.configureTestBed([CharacterGenComponent]);

      fixture = TestBed.createComponent(CharacterGenComponent);
      helper = new TestHelper(fixture);
      
      //run ngOnInit
      await helper.waitForChangeDetection();
    });

    describe('the leadership tab', () => {
      it(`should render the leadership tab`, () => {
        const compiled = fixture.nativeElement as HTMLElement;
  
        const leadershipTab = compiled.querySelector('#leadership');
        expect(leadershipTab).toBeTruthy();
  
        helper.expectSelect('#leadership #leaderAlignment', true, 'Lawful Good', 9);
        helper.expectSelect('#leadership #leaderClassName', true, 'Barbarian', 16);
        helper.expectNumberInput('#leadership #leaderLevel', true, 6, 6, 20);
        helper.expectNumberInput('#leadership #leaderCharismaBonus', true, 0, null, null, true);
        helper.expectInput('#leadership #leaderAnimal', false, '');

        helper.expectHasAttribute('#generateLeadershipButton', 'disabled', false);
      });
    
      it(`should show when generating leadership`, () => {
        const component = fixture.componentInstance;
        component.generating.set(true);
  
        fixture.detectChanges();

        helper.expectGenerating(fixture.componentInstance.generating(),
          '#generateCharacterButton', 
          '#characterSection', 
          '#generatingSection dndgen-loading', 
          '#characterValidating', 
          '#downloadButton');
      });
    
      TestHelper.runFlakyTest(() => {
        it(`should generate default leadership`, async () => {
          helper.clickButton('#generateLeadershipButton');
    
          fixture.detectChanges();
          
          helper.expectGenerating(fixture.componentInstance.generating(),
            '#generateCharacterButton', 
            '#characterSection', 
            '#generatingSection dndgen-loading', 
            null,
            '#downloadButton');

          //run generate leadership
          await helper.waitForChangeDetection();
    
          helper.expectGenerated(fixture.componentInstance.generating(),
            '#generateCharacterButton', 
            '#characterSection', 
            '#generatingSection dndgen-loading', 
            null, 
            '#downloadButton',
            false);
          
          helper.expectExists('#noCharacter', false)
          helper.expectExists('#characterSection > dndgen-character', false);
          helper.expectExists('#characterSection dndgen-leadership', true);

          const element = fixture.debugElement.query(By.css('#characterSection dndgen-leadership'));
          expect(element).toBeDefined();
          expect(element.componentInstance).toBeDefined();
          expect(element.componentInstance).toBeInstanceOf(LeadershipComponent);
    
          const leadershipComponent = element.componentInstance as LeadershipComponent;
          expect(leadershipComponent.leadership).toBeTruthy();

          //INFO: We can't guarantee our score isn't super low, and a score of 1 or lower has no cohort
          //So we can't assert anything about the cohort

          //INFO: With a score of 6, we shouldn't have any followers, but
          //Number of followers vary too much to make a reliable assertion
        });
      });
      
      it(`should say negative charisma bonus is valid`, async () => {
        helper.setInput('#leaderCharismaBonus', '-1');

        fixture.detectChanges();
  
        expect(fixture.componentInstance.leaderCharismaBonus).toEqual(-1);

        helper.expectHasAttribute('#generateLeadershipButton', 'disabled', false);
      });
      
      it(`should say invalid negative charisma bonus is invalid`, async () => {
        helper.setInput('#leaderCharismaBonus', '--1');

        fixture.detectChanges();
  
        expect(fixture.componentInstance.leaderCharismaBonus).toBeNull();

        helper.expectHasAttribute('#generateLeadershipButton', 'disabled', true);
      });
    
      //INFO: Running all permutations of generation is very slow, especially since these are "flaky" or inconsistent tests
      //Therefore, we will test minimum (score 1) and maximum (score 25)
      //Unit tests cover all other permutations of cohort and followers
      const leadershipTests = [
        { lvl: 6, cha: -5, cohort: false }, //1
        { lvl: 18, cha: 3, cohort: true }, //21
        //Scores above this can cause timeouts in the tests
        // { lvl: 19, cha: 3, cohort: true }, //22
        // { lvl: 19, cha: 4, cohort: true }, //23
        // { lvl: 20, cha: 4, cohort: true }, //24
        // { lvl: 20, cha: 5, cohort: true }, //25
      ];

      leadershipTests.forEach(test => {
        TestHelper.runFlakyTest(() => {
          it(`should generate non-default leadership - leader level ${test.lvl}, CHA bonus ${test.cha}`, async () => {
            const viewModel = fixture.componentInstance.characterModel()!;
            helper.setSelectByIndex('#leaderAlignment', viewModel.alignments.indexOf('Chaotic Neutral'));
            helper.setSelectByIndex('#leaderClassName', viewModel.classNames.indexOf('Sorcerer'));
            helper.setInput('#leaderLevel', `${test.lvl}`);
            helper.setInput('#leaderCharismaBonus', `${test.cha}`);
            helper.setInput('#leaderAnimal', 'Weasel');
      
            fixture.detectChanges();
    
            expect(fixture.componentInstance.leaderAlignment).toEqual('Chaotic Neutral');
            expect(fixture.componentInstance.leaderClassName).toEqual('Sorcerer');
            expect(fixture.componentInstance.leaderLevel).toEqual(test.lvl);
            expect(fixture.componentInstance.leaderCharismaBonus).toEqual(test.cha);
            expect(fixture.componentInstance.leaderAnimal).toEqual('Weasel');
    
            helper.clickButton('#generateLeadershipButton');
      
            fixture.detectChanges();
            
            helper.expectGenerating(fixture.componentInstance.generating(),
              '#generateCharacterButton', 
              '#characterSection', 
              '#generatingSection dndgen-loading', 
              '#characterValidating', 
              '#downloadButton');
    
            //run generation
            await helper.waitForChangeDetection();
      
            helper.expectGenerated(fixture.componentInstance.generating(),
              '#generateCharacterButton', 
              '#characterSection', 
              '#generatingSection dndgen-loading', 
              '#characterValidating', 
              '#downloadButton',
              false);
            helper.expectExists('#characterSection > dndgen-character', false);
            helper.expectExists('#characterSection dndgen-leadership', true);
    
            const element = fixture.debugElement.query(By.css('#characterSection dndgen-leadership'));
            expect(element).toBeTruthy();
            expect(element.componentInstance).toBeTruthy();
            expect(element.componentInstance).toBeInstanceOf(LeadershipComponent);
      
            const leadershipComponent = element.componentInstance as LeadershipComponent;
            expect(leadershipComponent.leadership).toBeTruthy();
  
            if (test.cohort)
              expect(leadershipComponent.cohort).toBeTruthy();
            
            //Number of followers vary too much to make a reliable assertion
          });
        });
      });
    });
  
    it(`should render no character or leadership`, () => {
      helper.expectExists('#noCharacter', true);
      helper.expectExists('#characterSection dndgen-character', false);
      helper.expectExists('#characterSection dndgen-leadership', false);
    });
    
    it(`should render character`, () => {
      const character = new Character('my character summary');
      fixture.componentInstance.character.set(character);

      fixture.detectChanges();

      helper.expectExists('#noCharacter', false);
      helper.expectExists('#characterSection dndgen-character', true);
      helper.expectCharacter('#characterSection dndgen-character', true, character);
      helper.expectExists('#characterSection dndgen-leadership', false);
    });
    
    it(`should render leadership`, () => {
      const leadership = new Leadership(90210, ['has a castle', 'smelly']);
      fixture.componentInstance.leadership.set(leadership);

      fixture.detectChanges();

      helper.expectExists('#noCharacter', false);
      helper.expectExists('#characterSection dndgen-leadership', true);
      
      const debugElement = fixture.debugElement.query(By.css('#characterSection dndgen-leadership'));
      expect(debugElement).toBeTruthy();
      expect(debugElement.componentInstance).toBeTruthy();
      expect(debugElement.componentInstance).toBeInstanceOf(LeadershipComponent);

      const leadershipComponent = debugElement.componentInstance as LeadershipComponent;
      expect(leadershipComponent.leadership).toBe(leadership);
      expect(leadershipComponent.cohort).toBeNull();
      expect(leadershipComponent.followers).toEqual([]);

      helper.expectExists('#characterSection dndgen-character', false);
    });

    it(`should render leadership with cohort`, () => {
      const leadership = new Leadership(90210, ['has a castle', 'smelly']);
      const cohort = new Character('my cohort summary');

      fixture.componentInstance.leadership.set(leadership);
      fixture.componentInstance.cohort.set(cohort);

      fixture.detectChanges();

      expect(fixture.componentInstance.character()).toBeNull();
      helper.expectExists('#noCharacter', false);
      helper.expectExists('#characterSection dndgen-leadership', true);
      
      const debugElement = fixture.debugElement.query(By.css('#characterSection dndgen-leadership'));
      expect(debugElement).toBeTruthy();
      expect(debugElement.componentInstance).toBeTruthy();
      expect(debugElement.componentInstance).toBeInstanceOf(LeadershipComponent);

      const leadershipComponent = debugElement.componentInstance as LeadershipComponent;
      expect(leadershipComponent.leadership).toBe(leadership);
      expect(leadershipComponent.cohort).toBe(cohort);
      expect(leadershipComponent.followers).toEqual([]);

      helper.expectExists('#characterSection > dndgen-character', false);
    });

    it(`should render leadership with cohort and followers`, () => {
      const leadership = new Leadership(90210, ['has a castle', 'smelly']);
      const cohort = new Character('my cohort summary');
      const followers = [
        new Character('my follower summary 1'),
        new Character('my follower summary 2'),
      ];

      fixture.componentInstance.leadership.set(leadership);
      fixture.componentInstance.cohort.set(cohort);
      fixture.componentInstance.followers.set(followers);

      fixture.detectChanges();

      helper.expectExists('#noCharacter', false);
      helper.expectExists('#characterSection dndgen-leadership', true);
      
      const debugElement = fixture.debugElement.query(By.css('#characterSection dndgen-leadership'));
      expect(debugElement).toBeTruthy();
      expect(debugElement.componentInstance).toBeTruthy();
      expect(debugElement.componentInstance).toBeInstanceOf(LeadershipComponent);

      const leadershipComponent = debugElement.componentInstance as LeadershipComponent;
      expect(leadershipComponent.leadership).toBe(leadership);
      expect(leadershipComponent.cohort).toBe(cohort);
      expect(leadershipComponent.followers).toEqual(followers);
      
      helper.expectExists('#characterSection > dndgen-character', false);
    });

    it(`should render character and leadership`, () => {
      const character = new Character('my character summary');
      const leadership = new Leadership(90210, ['has a castle', 'smelly']);

      fixture.componentInstance.character.set(character);
      fixture.componentInstance.leadership.set(leadership);

      fixture.detectChanges();

      helper.expectExists('#characterSection #noCharacter', false);
      helper.expectCharacter('#characterSection dndgen-character', true, character);

      helper.expectExists('#characterSection dndgen-leadership', true);
      
      let debugElement = fixture.debugElement.query(By.css('#characterSection dndgen-leadership'));
      expect(debugElement).toBeTruthy();
      expect(debugElement.componentInstance).toBeTruthy();
      expect(debugElement.componentInstance).toBeInstanceOf(LeadershipComponent);

      const leadershipComponent = debugElement.componentInstance as LeadershipComponent;
      expect(leadershipComponent.leadership).toBe(leadership);
      expect(leadershipComponent.cohort).toBeNull();
      expect(leadershipComponent.followers).toEqual([]);
    });

    it(`should render character and full leadership`, () => {
      const character = new Character('my character summary');
      const leadership = new Leadership(90210, ['has a castle', 'smelly']);
      const cohort = new Character('my cohort summary');
      const followers = [
        new Character('my follower summary 1'),
        new Character('my follower summary 2'),
      ];

      fixture.componentInstance.character.set(character);
      fixture.componentInstance.leadership.set(leadership);
      fixture.componentInstance.cohort.set(cohort);
      fixture.componentInstance.followers.set(followers);

      fixture.detectChanges();

      helper.expectExists('#noCharacter', false);
      helper.expectExists('#characterSection dndgen-character', true);
      helper.expectCharacter('#characterSection dndgen-character', true, character);
      
      helper.expectExists('#characterSection dndgen-leadership', true);
      
      let debugElement = fixture.debugElement.query(By.css('#characterSection dndgen-leadership'));
      expect(debugElement).toBeTruthy();
      expect(debugElement.componentInstance).toBeTruthy();
      expect(debugElement.componentInstance).toBeInstanceOf(LeadershipComponent);

      const leadershipComponent = debugElement.componentInstance as LeadershipComponent;
      expect(leadershipComponent.leadership).toBe(leadership);
      expect(leadershipComponent.cohort).toBe(cohort);
      expect(leadershipComponent.followers).toEqual(followers);
    });
    
    it(`should download character`, async () => {
      //Even for an integration test, we don't want to create an actual file
      let fileSaverSpy = spyOn(FileSaver, 'saveAs').and.stub();

      fixture.componentInstance.character.set(new Character('my character summary'));

      fixture.detectChanges();

      helper.clickButton('#downloadButton');

      expect(FileSaver.saveAs).toHaveBeenCalledWith(jasmine.any(Blob), 'my character summary.txt');
        
      const blob = fileSaverSpy.calls.first().args[0] as Blob;
      const text = await blob.text();
      expect(text).toMatch(/^my character summary:[\r\n]+[\S\s]+[\r\n\s]+$/);
    });
    
    it(`should download character with leadership`, async () => {
      //Even for an integration test, we don't want to create an actual file
      let fileSaverSpy = spyOn(FileSaver, 'saveAs').and.stub();

      fixture.componentInstance.character.set(new Character('my character summary'));
      fixture.componentInstance.leadership.set(new Leadership(90210, ['has a castle', 'smelly']));
      fixture.componentInstance.cohort.set(new Character('my cohort summary'));
      fixture.componentInstance.followers.set([
        new Character('my follower summary 1'),
        new Character('my follower summary 2'),
      ]);

      fixture.detectChanges();

      helper.clickButton('#downloadButton');

      expect(FileSaver.saveAs).toHaveBeenCalledWith(jasmine.any(Blob), 'my character summary.txt');
        
      const blob = fileSaverSpy.calls.first().args[0] as Blob;
      const text = await blob.text();
      expect(text).toMatch(/^my character summary:[\r\n]+[\S\s]+/);
      expect(text).toMatch(/^[\S\s]+[\r\n]+Leadership:[\r\n]+[\S\s]+/);

      const leadershipIndex = text.indexOf('Leadership:');
      expect(text.substring(leadershipIndex)).toMatch(/^[\S\s]+[\r\n]+Cohort:[\r\n]+[\S\s]+/);
      
      const cohortIndex = text.indexOf('Cohort:');
      expect(text.substring(cohortIndex)).toMatch(/^[\S\s]+[\r\n]+Followers \(x2\):[\r\n]+[\S\s]+[\r\n\s]+$/);
    });
  });
});
