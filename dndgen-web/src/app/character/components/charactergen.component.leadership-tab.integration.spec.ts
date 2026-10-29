import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CharacterGenComponent } from './charactergen.component';
import { LeadershipComponent } from './leadership.component';
import { TestHelper } from '../../test-helper';
import { By } from '@angular/platform-browser';

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
    
      it(`should show when generating leadership`, async () => {
        const component = fixture.componentInstance;
        component.generating.set(true);
  
        await helper.waitForChangeDetection();

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

        await helper.waitForChangeDetection();
  
        expect(fixture.componentInstance.leaderCharismaBonus).toEqual(-1);

        helper.expectHasAttribute('#generateLeadershipButton', 'disabled', false);
      });
      
      it(`should say invalid negative charisma bonus is invalid`, async () => {
        helper.setInput('#leaderCharismaBonus', '--1');

        await helper.waitForChangeDetection();
  
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
      
            await helper.waitForChangeDetection();
    
            expect(fixture.componentInstance.leaderAlignment).toEqual('Chaotic Neutral');
            expect(fixture.componentInstance.leaderClassName).toEqual('Sorcerer');
            expect(fixture.componentInstance.leaderLevel).toEqual(test.lvl);
            expect(fixture.componentInstance.leaderCharismaBonus).toEqual(test.cha);
            expect(fixture.componentInstance.leaderAnimal).toEqual('Weasel');
    
            helper.clickButton('#generateLeadershipButton');
      
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
          }, 60000);
        });
      });
    });
  });
});
