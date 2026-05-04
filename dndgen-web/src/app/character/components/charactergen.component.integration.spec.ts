import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CharacterGenComponent } from './charactergen.component';
import { TestHelper } from '../../test-helper';
import { Size } from '../../shared/components/size.enum';
import { Character } from '../models/character.model';
import { Leadership } from '../models/leadership.model';
import { LeadershipComponent } from './leadership.component';
import { By } from '@angular/platform-browser';
import FileSaver from 'file-saver';

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

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should create the component', () => {
      const component = fixture.componentInstance;
      expect(component).toBeTruthy();
    });
  
    it('should show the loading component when loading', async () => {
      const component = fixture.componentInstance;
      component.loading.set(true);

      await helper.waitForChangeDetection();

      helper.expectLoading('dndgen-loading', true, Size.Large);
    });
  
    it('should hide the loading component when not loading', async () => {
      const component = fixture.componentInstance;
      component.loading.set(false);

      await helper.waitForChangeDetection();

      helper.expectLoading('dndgen-loading', false, Size.Large);
    });
  
    it(`should set the character model on init`, () => {
      const component = fixture.componentInstance;
      const viewModel = component.characterModel();
      expect(viewModel).toBeDefined();
      expect(viewModel!.alignmentRandomizerTypes.length).toEqual(12);
      expect(viewModel!.alignmentRandomizerTypes).toContain('Set');
      expect(viewModel!.alignments.length).toEqual(9);
      expect(viewModel!.classNameRandomizerTypes.length).toEqual(9);
      expect(viewModel!.classNameRandomizerTypes).toContain('Set');
      expect(viewModel!.classNames.length).toEqual(16);
      expect(viewModel!.levelRandomizerTypes.length).toEqual(6);
      expect(viewModel!.levelRandomizerTypes).toContain('Set');
      expect(viewModel!.baseRaceRandomizerTypes.length).toEqual(7);
      expect(viewModel!.baseRaceRandomizerTypes).toContain('Set');
      expect(viewModel!.baseRaces.length).toEqual(71);
      expect(viewModel!.metaraceRandomizerTypes.length).toEqual(6);
      expect(viewModel!.metaraceRandomizerTypes).toContain('Set');
      expect(viewModel!.metaraceRandomizerTypes).toContain('No Meta');
      expect(viewModel!.metaraces.length).toEqual(13);
      expect(viewModel!.abilitiesRandomizerTypes.length).toEqual(8);
      expect(viewModel!.abilitiesRandomizerTypes).toContain('Set');
    });
  
    it(`should set initial values on init`, () => {
      const component = fixture.componentInstance;
      expect(component.alignmentRandomizerType).toEqual(component.characterModel()!.alignmentRandomizerTypes[0]);
      expect(component.setAlignment).toEqual(component.characterModel()!.alignments[0]);

      expect(component.classNameRandomizerType).toEqual(component.characterModel()!.classNameRandomizerTypes[0]);
      expect(component.setClassName).toEqual(component.characterModel()!.classNames[0]);

      expect(component.levelRandomizerType).toEqual(component.characterModel()!.levelRandomizerTypes[0]);
      expect(component.setLevel).toEqual(1);

      expect(component.baseRaceRandomizerType).toEqual(component.characterModel()!.baseRaceRandomizerTypes[0]);
      expect(component.setBaseRace).toEqual(component.characterModel()!.baseRaces[0]);

      expect(component.metaraceRandomizerType).toEqual(component.characterModel()!.metaraceRandomizerTypes[0]);
      expect(component.forceMetarace).toEqual(false);
      expect(component.setMetarace).toEqual(component.characterModel()!.metaraces[0]);

      expect(component.abilitiesRandomizerType).toEqual(component.characterModel()!.abilitiesRandomizerTypes[0]);
      expect(component.setStrength).toEqual(10);
      expect(component.setConstitution).toEqual(10);
      expect(component.setDexterity).toEqual(10);
      expect(component.setIntelligence).toEqual(10);
      expect(component.setWisdom).toEqual(10);
      expect(component.setCharisma).toEqual(10);
      
      expect(component.leaderAlignment).toEqual(component.characterModel()!.alignments[0]);
      expect(component.leaderClassName).toEqual(component.characterModel()!.classNames[0]);
      expect(component.leaderLevel).toEqual(6);
      expect(component.leaderCharismaBonus).toEqual(0);
      expect(component.leaderAnimal).toEqual('');
    });
  
    it(`should initialize public properties`, async () => {
      const component = fixture.componentInstance;
      expect(component.loading()).toBe(false);
      expect(component.validating()).toBe(false);
      expect(component.generating()).toBe(false);
      expect(component.valid()).toBe(true);
    });
  
    it(`should be ready to generate a character on load`, async () => {
      expectReady();
    });

    function expectReady() {
      expect(fixture.componentInstance.loading()).toBe(false);
      expect(fixture.componentInstance.validating()).toBe(false);
      expect(fixture.componentInstance.generating()).toBe(false);
      expect(fixture.componentInstance.valid()).toBe(true);

      helper.expectHasAttribute('#generateCharacterButton', 'disabled', false);
    }
  
    it(`should render the tabs`, () => {
      const compiled = fixture.nativeElement as HTMLElement;
  
      const tabLinks = compiled.querySelectorAll('ul.nav-tabs a.nav-link');
      expect(tabLinks).toBeDefined();
      expect(tabLinks?.length).toEqual(2);
      expect(tabLinks?.item(0).textContent).toEqual('Character');
      expect(tabLinks?.item(0).getAttribute('class')).toContain('active');
      expect(tabLinks?.item(1).textContent).toEqual('Leadership');
      expect(tabLinks?.item(1).getAttribute('class')).not.toContain('active');
    });

    it(`should render no character or leadership`, () => {
      helper.expectExists('#noCharacter', true);
      helper.expectExists('#characterSection dndgen-character', false);
      helper.expectExists('#characterSection dndgen-leadership', false);
    });
    
    it(`should render character`, async () => {
      const character = new Character('my character summary');
      fixture.componentInstance.character.set(character);

      await helper.waitForChangeDetection();

      helper.expectExists('#noCharacter', false);
      helper.expectExists('#characterSection dndgen-character', true);
      helper.expectCharacter('#characterSection dndgen-character', true, character);
      helper.expectExists('#characterSection dndgen-leadership', false);
    });
    
    it(`should render leadership`, async () => {
      const leadership = new Leadership(90210, ['has a castle', 'smelly']);
      fixture.componentInstance.leadership.set(leadership);

      await helper.waitForChangeDetection();

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

    it(`should render leadership with cohort`, async () => {
      const leadership = new Leadership(90210, ['has a castle', 'smelly']);
      const cohort = new Character('my cohort summary');

      fixture.componentInstance.leadership.set(leadership);
      fixture.componentInstance.cohort.set(cohort);

      await helper.waitForChangeDetection();

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

    it(`should render leadership with cohort and followers`, async () => {
      const leadership = new Leadership(90210, ['has a castle', 'smelly']);
      const cohort = new Character('my cohort summary');
      const followers = [
        new Character('my follower summary 1'),
        new Character('my follower summary 2'),
      ];

      fixture.componentInstance.leadership.set(leadership);
      fixture.componentInstance.cohort.set(cohort);
      fixture.componentInstance.followers.set(followers);

      await helper.waitForChangeDetection();

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

    it(`should render character and leadership`, async () => {
      const character = new Character('my character summary');
      const leadership = new Leadership(90210, ['has a castle', 'smelly']);

      fixture.componentInstance.character.set(character);
      fixture.componentInstance.leadership.set(leadership);

      await helper.waitForChangeDetection();

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

    it(`should render character and full leadership`, async () => {
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

      await helper.waitForChangeDetection();

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
      const fileSaverSpy = vi.spyOn(FileSaver, 'saveAs').mockImplementation(() => {});

      fixture.componentInstance.character.set(new Character('my character summary'));

      await helper.waitForChangeDetection();

      helper.clickButton('#downloadButton');

      expect(FileSaver.saveAs).toHaveBeenCalledWith(expect.any(Blob), 'my character summary.txt');
        
      const blob = fileSaverSpy.mock.calls[0][0] as Blob;
      const text = await blob.text();
      expect(text).toMatch(/^my character summary:[\r\n]+[\S\s]+[\r\n\s]+$/);
    });
    
    it(`should download character with leadership`, async () => {
      //Even for an integration test, we don't want to create an actual file
      const component = fixture.componentInstance;
      const fileSaverSpy = vi.spyOn(FileSaver, 'saveAs').mockImplementation(() => {});
      const character = new Character('my character summary');
      const leadership = new Leadership(90210, ['has a castle', 'smelly']);
      const cohort = new Character('my cohort summary');
      const followers = [
        new Character('my follower summary 1'),
        new Character('my follower summary 2'),
      ];

      component.character.set(character);
      component.leadership.set(leadership);
      component.cohort.set(cohort);
      component.followers.set(followers);

      await helper.waitForChangeDetection();

      helper.clickButton('#downloadButton');

      expect(FileSaver.saveAs).toHaveBeenCalledWith(expect.any(Blob), 'my character summary.txt');

      const blob = fileSaverSpy.mock.calls[0][0] as Blob;
      const text = await blob.text();

      expect(text).toContain('my character summary');
      expect(text).toContain('Leadership');
      expect(text).toContain('Cohort');
      expect(text).toContain('Followers');
      expect(text).toMatch(/^my character summary:[\r\n]+[\S\s]+/);
      expect(text).toMatch(/[\S\s]+[\r\n]+Leadership:[\r\n]+[\S\s]+/);
      expect(text).toMatch(/[\S\s]+[\r\n]+Cohort:[\r\n]+[\S\s]+/);
      expect(text).toMatch(/[\S\s]+[\r\n]+Followers \(x2\):[\r\n]+[\S\s]+/);

      const leadershipIndex = text.indexOf('Leadership:');
      const leadershipText = text.substring(leadershipIndex);
      expect(leadershipText).toContain('has a castle');
      expect(leadershipText).toContain('smelly');
      expect(leadershipText).toContain('Score: 90210');

      const cohortIndex = text.indexOf('Cohort:');
      const cohortText = text.substring(cohortIndex);
      expect(cohortText).toContain('my cohort summary');
      
      const followersIndex = text.indexOf('Followers:');
      const followersText = text.substring(followersIndex);
      expect(followersText).toContain('my follower summary 1');
      expect(followersText).toContain('my follower summary 2');
    });
  });
});
