import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CharacterGenComponent } from './charactergen.component';
import { TestHelper } from '../../test-helper';
import { Size } from '../../shared/components/size.enum';

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

  });
});
