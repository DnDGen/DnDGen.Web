import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CharacterGenComponent } from './charactergen.component';
import { Character } from '../models/character.model';
import { Leadership } from '../models/leadership.model';
import { TestHelper } from '../../test-helper';
import { By } from '@angular/platform-browser';
import { Size } from '../../shared/components/size.enum';

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

    function expectReady() {
      expect(fixture.componentInstance.loading()).toBe(false);
      expect(fixture.componentInstance.validating()).toBe(false);
      expect(fixture.componentInstance.generating()).toBe(false);
      expect(fixture.componentInstance.valid()).toBe(true);

      helper.expectHasAttribute('#generateCharacterButton', 'disabled', false);
    }

    describe('the character tab', () => {
      it(`should render the character tab`, () => {
        helper.expectExists('#character');
        
        helper.expectSelect('#character #alignmentRandomizerType', true, 'Any', 12);
        helper.expectSelect('#character #setAlignment', false, 'Lawful Good', 9);
        
        helper.expectSelect('#character #classNameRandomizerType', true, 'Any Player', 9);
        helper.expectSelect('#character #setClassName', false, 'Barbarian', 16);

        helper.expectSelect('#character #levelRandomizerType', true, 'Any', 6);
        helper.expectNumberInput('#character #setLevel', false, 1, 1, 20);

        helper.expectSelect('#character #baseRaceRandomizerType', true, 'Any Base', 7);
        helper.expectSelect('#character #setBaseRace', false, 'Aasimar', 71);

        helper.expectSelect('#character #metaraceRandomizerType', true, 'Any Meta', 6);
        helper.expectCheckboxInput('#character #forceMetaraceCheckbox', false, false);
        helper.expectSelect('#character #setMetarace', false, 'Ghost', 13);

        // helper.expectSelect('#character #abilitiesRandomizerType', true, 'Best of four', 8);
        const compiled = fixture.nativeElement as HTMLElement;
        const options = compiled.querySelectorAll('#character #abilitiesRandomizerType > option');
        expect(options).toBeTruthy();

        if (options.length == 9) {
          helper.expectSelect('#character #abilitiesRandomizerType', true, 'Raw', 9);
        } else {
          helper.expectSelect('#character #abilitiesRandomizerType', true, 'Best of four', 8);
        }

        helper.expectCheckboxInput('#character #abilitiesAdjustCheckbox', false, true);
        helper.expectNumberInput('#character #setStrength', false, 10, 0);
        helper.expectNumberInput('#character #setConstitution', false, 10, 0);
        helper.expectNumberInput('#character #setDexterity', false, 10, 0);
        helper.expectNumberInput('#character #setIntelligence', false, 10, 0);
        helper.expectNumberInput('#character #setWisdom', false, 10, 0);
        helper.expectNumberInput('#character #setCharisma', false, 10, 0);

        helper.expectHasAttribute('#generateCharacterButton', 'disabled', false);
        helper.expectLoading('#characterValidating', false, Size.Small);
      });

      it(`should hide set alignment, except for Set alignment randomizer`, () => {
        const viewModel = fixture.componentInstance.characterModel()!;
        for(let i = 0; i < viewModel.alignmentRandomizerTypes.length; i++) {
          helper.setSelectByIndex('#alignmentRandomizerType', i);

          fixture.detectChanges();
  
          const randomizer = viewModel.alignmentRandomizerTypes[i];
          helper.expectSelect('#alignmentRandomizerType', true, randomizer, viewModel.alignmentRandomizerTypes.length);

          const isSet = randomizer == 'Set';
          helper.expectHasAttribute('#setAlignment', 'hidden', !isSet);
          helper.expectHasAttribute('#setAlignment', 'required', isSet);
        }
      });

      it(`should hide set class name, except for Set class name randomizer`, () => {
        const viewModel = fixture.componentInstance.characterModel()!;
        for(let i = 0; i < viewModel.classNameRandomizerTypes.length; i++) {
          helper.setSelectByIndex('#classNameRandomizerType', i);

          fixture.detectChanges();
  
          const randomizer = viewModel.classNameRandomizerTypes[i];
          helper.expectSelect('#classNameRandomizerType', true, randomizer, viewModel.classNameRandomizerTypes.length);

          const isSet = randomizer == 'Set';
          helper.expectHasAttribute('#setClassName', 'hidden', !isSet);
          helper.expectHasAttribute('#setClassName', 'required', isSet);
        }
      });

      it(`should hide set level, except for Set level randomizer`, () => {
        const viewModel = fixture.componentInstance.characterModel()!;
        for(let i = 0; i < viewModel.levelRandomizerTypes.length; i++) {
          helper.setSelectByIndex('#levelRandomizerType', i);

          fixture.detectChanges();
  
          const randomizer = viewModel.levelRandomizerTypes[i];
          helper.expectSelect('#levelRandomizerType', true, randomizer, viewModel.levelRandomizerTypes.length);

          const isSet = randomizer == 'Set';
          helper.expectHasAttribute('#setLevel', 'hidden', !isSet);
          helper.expectHasAttribute('#setLevel', 'required', isSet);
        }
      });

      it(`should hide set base race, except for Set base race randomizer`, () => {
        const viewModel = fixture.componentInstance.characterModel()!;
        for(let i = 0; i < viewModel.baseRaceRandomizerTypes.length; i++) {
          helper.setSelectByIndex('#baseRaceRandomizerType', i);

          fixture.detectChanges();
  
          const randomizer = viewModel.baseRaceRandomizerTypes[i];
          helper.expectSelect('#baseRaceRandomizerType', true, randomizer, viewModel.baseRaceRandomizerTypes.length);

          const isSet = randomizer == 'Set';
          helper.expectHasAttribute('#setBaseRace', 'hidden', !isSet);
          helper.expectHasAttribute('#setBaseRace', 'required', isSet);
        }
      });

      it(`should hide set metarace, except for Set metarace randomizer`, () => {
        const viewModel = fixture.componentInstance.characterModel()!;
        for(let i = 0; i < viewModel.metaraceRandomizerTypes.length; i++) {
          helper.setSelectByIndex('#metaraceRandomizerType', i);

          fixture.detectChanges();
  
          const randomizer = viewModel.metaraceRandomizerTypes[i];
          helper.expectSelect('#metaraceRandomizerType', true, randomizer, viewModel.metaraceRandomizerTypes.length);

          const isSet = randomizer == 'Set';
          helper.expectHasAttribute('#setMetarace', 'hidden', !isSet);
          helper.expectHasAttribute('#setMetarace', 'required', isSet);
        }
      });

      it(`should hide force metarace for Set and None metarace randomizer`, () => {
        const viewModel = fixture.componentInstance.characterModel()!;
        for(let i = 0; i < viewModel.metaraceRandomizerTypes.length; i++) {
          helper.setSelectByIndex('#metaraceRandomizerType', i);

          fixture.detectChanges();
  
          const randomizer = viewModel.metaraceRandomizerTypes[i];
          helper.expectSelect('#metaraceRandomizerType', true, randomizer, viewModel.metaraceRandomizerTypes.length);

          const isSetOrNone = randomizer == 'Set' || randomizer == 'No Meta';
          helper.expectHasAttribute('#force-metarace-col', 'hidden', isSetOrNone);
          helper.expectHasAttribute('#force-metarace-col #forceMetaraceCheckbox', 'required', false);
        }
      });

      it(`should hide set abilities, except for Set abilities randomizer`, () => {
        const viewModel = fixture.componentInstance.characterModel()!;
        for(let i = 0; i < viewModel.abilitiesRandomizerTypes.length; i++) {
          helper.setSelectByIndex('#abilitiesRandomizerType', i);

          fixture.detectChanges();
  
          const randomizer = viewModel.abilitiesRandomizerTypes[i];
          helper.expectSelect('#abilitiesRandomizerType', true, randomizer, viewModel.abilitiesRandomizerTypes.length);

          const isSet = randomizer == 'Set';
          helper.expectHasAttribute('#set-abilities-row-1', 'hidden', !isSet);
          helper.expectHasAttribute('#set-abilities-row-2', 'hidden', !isSet);
          helper.expectHasAttribute('#set-abilities-row-1 #setStrength', 'required', isSet);
          helper.expectHasAttribute('#set-abilities-row-1 #setConstitution', 'required', isSet);
          helper.expectHasAttribute('#set-abilities-row-1 #setDexterity', 'required', isSet);
          helper.expectHasAttribute('#set-abilities-row-2 #setIntelligence', 'required', isSet);
          helper.expectHasAttribute('#set-abilities-row-2 #setWisdom', 'required', isSet);
          helper.expectHasAttribute('#set-abilities-row-2 #setCharisma', 'required', isSet);
        }
      });

      it(`should hide allow ability adjustments, except for Set abilities randomizer`, () => {
        const viewModel = fixture.componentInstance.characterModel()!;
        for(let i = 0; i < viewModel.abilitiesRandomizerTypes.length; i++) {
          helper.setSelectByIndex('#abilitiesRandomizerType', i);

          fixture.detectChanges();
  
          const randomizer = viewModel.abilitiesRandomizerTypes[i];
          helper.expectSelect('#abilitiesRandomizerType', true, randomizer, viewModel.abilitiesRandomizerTypes.length);

          const isSet = randomizer == 'Set';
          helper.expectHasAttribute('#adjust-abilities-col', 'hidden', !isSet);
          helper.expectHasAttribute('#adjust-abilities-col #abilitiesAdjustCheckbox', 'required', false);
        }
      });
    
      it(`should show when validating character`, () => {
        const component = fixture.componentInstance;
        component.validating.set(true);
  
        fixture.detectChanges();

        helper.expectValidating(fixture.componentInstance.validating(), '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - missing alignment randomizer`, async () => {
        helper.setSelectByValue('#alignmentRandomizerType', '');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.alignmentRandomizerType).toEqual('');
        helper.expectInvalid(fixture.componentInstance.validating(), fixture.componentInstance.valid(), '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - missing set alignment`, async () => {
        expectReady();

        const viewModel = fixture.componentInstance.characterModel()!;
        helper.setSelectByIndex('#alignmentRandomizerType', viewModel.alignmentRandomizerTypes.indexOf('Set'));
        helper.setSelectByValue('#setAlignment', '');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.alignmentRandomizerType).toEqual('Set');
        expect(fixture.componentInstance.setAlignment).toEqual('');
        
        helper.expectInvalid(fixture.componentInstance.validating(), fixture.componentInstance.valid(), '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - missing class name randomizer`, async () => {
        helper.setSelectByValue('#classNameRandomizerType', '');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.classNameRandomizerType).toEqual('');
        helper.expectInvalid(fixture.componentInstance.validating(), fixture.componentInstance.valid(), '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - missing set class name`, async () => {
        expectReady();

        const viewModel = fixture.componentInstance.characterModel()!;
        helper.setSelectByIndex('#classNameRandomizerType', viewModel.classNameRandomizerTypes.indexOf('Set'));
        helper.setSelectByValue('#setClassName', '');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.classNameRandomizerType).toEqual('Set');
        expect(fixture.componentInstance.setClassName).toEqual('');
        helper.expectInvalid(fixture.componentInstance.validating(), fixture.componentInstance.valid(), '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - missing level randomizer`, async () => {
        helper.setSelectByValue('#levelRandomizerType', '');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.levelRandomizerType).toEqual('');
        helper.expectInvalid(fixture.componentInstance.validating(), fixture.componentInstance.valid(), '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - missing set level`, async () => {
        const viewModel = fixture.componentInstance.characterModel()!;
        helper.setSelectByIndex('#levelRandomizerType', viewModel.levelRandomizerTypes.indexOf('Set'));
        helper.setInput('#setLevel', '');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.levelRandomizerType).toEqual('Set');
        expect(fixture.componentInstance.setLevel).toBeNull();
        helper.expectInvalid(fixture.componentInstance.validating(), fixture.componentInstance.valid(), '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - set level invalid`, () => {
        const viewModel = fixture.componentInstance.characterModel()!;
        helper.setSelectByIndex('#levelRandomizerType', viewModel.levelRandomizerTypes.indexOf('Set'));
        helper.setInput('#setLevel', 'wrong');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.levelRandomizerType).toEqual('Set');
        expect(fixture.componentInstance.setLevel).toBeNull();
        
        helper.expectInvalid(fixture.componentInstance.validating(), fixture.componentInstance.valid(), '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - set level too low`, () => {
        const viewModel = fixture.componentInstance.characterModel()!;
        helper.setSelectByIndex('#levelRandomizerType', viewModel.levelRandomizerTypes.indexOf('Set'));
        helper.setInput('#setLevel', '-1');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.levelRandomizerType).toEqual('Set');
        expect(fixture.componentInstance.setLevel).toEqual(-1);
        helper.expectInvalid(fixture.componentInstance.validating(), fixture.componentInstance.valid(), '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - set level too high`, waitForAsync(async () => {
        const viewModel = fixture.componentInstance.characterModel()!;
        helper.setSelectByIndex('#levelRandomizerType', viewModel.levelRandomizerTypes.indexOf('Set'));
        
        //run validation
        await helper.waitForChangeDetection();

        helper.setInput('#setLevel', '21');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.levelRandomizerType).toEqual('Set');
        expect(fixture.componentInstance.setLevel).toEqual(21);

        helper.expectValidating(fixture.componentInstance.validating(), '#generateCharacterButton', '#characterValidating');
        
        //run validation
        await helper.waitForChangeDetection();
  
        expect(fixture.componentInstance.valid()).toBe(false);
        helper.expectInvalid(fixture.componentInstance.validating(), fixture.componentInstance.valid(), '#generateCharacterButton', '#characterValidating');
      }));
    
      it(`should show that character is invalid - missing base race randomizer`, async () => {
        helper.setSelectByValue('#baseRaceRandomizerType', '');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.baseRaceRandomizerType).toEqual('');
        helper.expectInvalid(fixture.componentInstance.validating(), fixture.componentInstance.valid(), '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - missing set base race`, async () => {
        const viewModel = fixture.componentInstance.characterModel()!;
        helper.setSelectByIndex('#baseRaceRandomizerType', viewModel.baseRaceRandomizerTypes.indexOf('Set'));
        helper.setSelectByValue('#setBaseRace', '');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.baseRaceRandomizerType).toEqual('Set');
        expect(fixture.componentInstance.setBaseRace).toEqual('');
        helper.expectInvalid(fixture.componentInstance.validating(), fixture.componentInstance.valid(), '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - missing metarace randomizer`, async () => {
        helper.setSelectByValue('#metaraceRandomizerType', '');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.metaraceRandomizerType).toEqual('');
        helper.expectInvalid(fixture.componentInstance.validating(), fixture.componentInstance.valid(), '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should validate when force metarace changes`, waitForAsync(async () => {
        helper.clickCheckbox('#forceMetaraceCheckbox');
        
        fixture.detectChanges();
  
        expect(fixture.componentInstance.forceMetarace).toBe(true);

        helper.expectValidating(fixture.componentInstance.validating(), '#generateCharacterButton', '#characterValidating');
      }));
    
      it(`should show that character is invalid - missing set metarace`, async () => {
        expectReady();

        const viewModel = fixture.componentInstance.characterModel()!;
        helper.setSelectByIndex('#metaraceRandomizerType', viewModel.metaraceRandomizerTypes.indexOf('Set'));
        helper.setSelectByValue('#setMetarace', '');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.metaraceRandomizerType).toEqual('Set');
        expect(fixture.componentInstance.setMetarace).toEqual('');
        helper.expectInvalid(fixture.componentInstance.validating(), fixture.componentInstance.valid(), '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - missing abilities randomizer`, async () => {
        helper.setSelectByValue('#abilitiesRandomizerType', '');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.abilitiesRandomizerType).toEqual('');
        helper.expectInvalid(fixture.componentInstance.validating(), fixture.componentInstance.valid(), '#generateCharacterButton', '#characterValidating');
      });
    
      it(`BUG - should set set level`, () => {
        const viewModel = fixture.componentInstance.characterModel()!;
        helper.setSelectByIndex('#levelRandomizerType', viewModel.levelRandomizerTypes.indexOf('Set'));
        
        fixture.detectChanges();
  
        expect(fixture.componentInstance.levelRandomizerType).toEqual('Set');

        helper.setInput('#setLevel', '9');
  
        fixture.detectChanges();
  
        helper.expectNumberInput('#setLevel', true, 9);

        expect(fixture.componentInstance.setLevel).toEqual(9);
      });
    
      it(`BUG - should set set abilities`, () => {
        const viewModel = fixture.componentInstance.characterModel()!;
        helper.setSelectByIndex('#abilitiesRandomizerType', viewModel.abilitiesRandomizerTypes.indexOf('Set'));
        
        fixture.detectChanges();
  
        expect(fixture.componentInstance.abilitiesRandomizerType).toEqual('Set');

        helper.setInput('#setStrength', '9');
        helper.setInput('#setConstitution', '26');
        helper.setInput('#setDexterity', '6');
        helper.setInput('#setIntelligence', '2');
        helper.setInput('#setWisdom', '10');
        helper.setInput('#setCharisma', '4');
  
        fixture.detectChanges();
  
        helper.expectNumberInput('#setStrength', true, 9);
        helper.expectNumberInput('#setConstitution', true, 26);
        helper.expectNumberInput('#setDexterity', true, 6);
        helper.expectNumberInput('#setIntelligence', true, 2);
        helper.expectNumberInput('#setWisdom', true, 10);
        helper.expectNumberInput('#setCharisma', true, 4);

        expect(fixture.componentInstance.setStrength).toEqual(9);
        expect(fixture.componentInstance.setConstitution).toEqual(26);
        expect(fixture.componentInstance.setDexterity).toEqual(6);
        expect(fixture.componentInstance.setIntelligence).toEqual(2);
        expect(fixture.componentInstance.setWisdom).toEqual(10);
        expect(fixture.componentInstance.setCharisma).toEqual(4);
      });

      it(`should show that character is invalid - missing set strength`, () => {
        const viewModel = fixture.componentInstance.characterModel()!;
        helper.setSelectByIndex('#abilitiesRandomizerType', viewModel.abilitiesRandomizerTypes.indexOf('Set'));
        
        fixture.detectChanges();
  
        helper.setInput('#setStrength', '');
        helper.setInput('#setConstitution', '26');
        helper.setInput('#setDexterity', '6');
        helper.setInput('#setIntelligence', '2');
        helper.setInput('#setWisdom', '10');
        helper.setInput('#setCharisma', '4');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.abilitiesRandomizerType).toEqual('Set');
        expect(fixture.componentInstance.setStrength).toBeNull();
        expect(fixture.componentInstance.setConstitution).toEqual(26);
        expect(fixture.componentInstance.setDexterity).toEqual(6);
        expect(fixture.componentInstance.setIntelligence).toEqual(2);
        expect(fixture.componentInstance.setWisdom).toEqual(10);
        expect(fixture.componentInstance.setCharisma).toEqual(4);
        helper.expectInvalid(fixture.componentInstance.validating(), fixture.componentInstance.valid(), '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - set strength invalid`, () => {
        const viewModel = fixture.componentInstance.characterModel()!;
        helper.setSelectByIndex('#abilitiesRandomizerType', viewModel.abilitiesRandomizerTypes.indexOf('Set'));
        
        fixture.detectChanges();
  
        helper.setInput('#setStrength', 'wrong');
        helper.setInput('#setConstitution', '26');
        helper.setInput('#setDexterity', '6');
        helper.setInput('#setIntelligence', '2');
        helper.setInput('#setWisdom', '10');
        helper.setInput('#setCharisma', '4');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.abilitiesRandomizerType).toEqual('Set');
        expect(fixture.componentInstance.setStrength).toBeNull();
        expect(fixture.componentInstance.setConstitution).toEqual(26);
        expect(fixture.componentInstance.setDexterity).toEqual(6);
        expect(fixture.componentInstance.setIntelligence).toEqual(2);
        expect(fixture.componentInstance.setWisdom).toEqual(10);
        expect(fixture.componentInstance.setCharisma).toEqual(4);
        helper.expectInvalid(fixture.componentInstance.validating(), fixture.componentInstance.valid(), '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - set strength too low`, () => {
        const viewModel = fixture.componentInstance.characterModel()!;
        helper.setSelectByIndex('#abilitiesRandomizerType', viewModel.abilitiesRandomizerTypes.indexOf('Set'));
        
        fixture.detectChanges();
  
        helper.setInput('#setStrength', '-1');
        helper.setInput('#setConstitution', '26');
        helper.setInput('#setDexterity', '6');
        helper.setInput('#setIntelligence', '2');
        helper.setInput('#setWisdom', '10');
        helper.setInput('#setCharisma', '4');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.abilitiesRandomizerType).toEqual('Set');
        expect(fixture.componentInstance.setStrength).toEqual(-1);
        expect(fixture.componentInstance.setConstitution).toEqual(26);
        expect(fixture.componentInstance.setDexterity).toEqual(6);
        expect(fixture.componentInstance.setIntelligence).toEqual(2);
        expect(fixture.componentInstance.setWisdom).toEqual(10);
        expect(fixture.componentInstance.setCharisma).toEqual(4);

        helper.expectInvalid(fixture.componentInstance.validating(), fixture.componentInstance.valid(), '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - missing set constitution`, () => {
        const viewModel = fixture.componentInstance.characterModel()!;
        helper.setSelectByIndex('#abilitiesRandomizerType', viewModel.abilitiesRandomizerTypes.indexOf('Set'));
        
        fixture.detectChanges();
  
        helper.setInput('#setStrength', '9');
        helper.setInput('#setConstitution', '');
        helper.setInput('#setDexterity', '6');
        helper.setInput('#setIntelligence', '2');
        helper.setInput('#setWisdom', '10');
        helper.setInput('#setCharisma', '4');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.abilitiesRandomizerType).toEqual('Set');
        expect(fixture.componentInstance.setStrength).toEqual(9);
        expect(fixture.componentInstance.setConstitution).toBeNull();
        expect(fixture.componentInstance.setDexterity).toEqual(6);
        expect(fixture.componentInstance.setIntelligence).toEqual(2);
        expect(fixture.componentInstance.setWisdom).toEqual(10);
        expect(fixture.componentInstance.setCharisma).toEqual(4);
        helper.expectInvalid(fixture.componentInstance.validating(), fixture.componentInstance.valid(), '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - set constitution invalid`, () => {
        const viewModel = fixture.componentInstance.characterModel()!;
        helper.setSelectByIndex('#abilitiesRandomizerType', viewModel.abilitiesRandomizerTypes.indexOf('Set'));
        
        fixture.detectChanges();
  
        helper.setInput('#setStrength', '9');
        helper.setInput('#setConstitution', 'wrong');
        helper.setInput('#setDexterity', '6');
        helper.setInput('#setIntelligence', '2');
        helper.setInput('#setWisdom', '10');
        helper.setInput('#setCharisma', '4');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.abilitiesRandomizerType).toEqual('Set');
        expect(fixture.componentInstance.setStrength).toEqual(9);
        expect(fixture.componentInstance.setConstitution).toBeNull();
        expect(fixture.componentInstance.setDexterity).toEqual(6);
        expect(fixture.componentInstance.setIntelligence).toEqual(2);
        expect(fixture.componentInstance.setWisdom).toEqual(10);
        expect(fixture.componentInstance.setCharisma).toEqual(4);
        helper.expectInvalid(fixture.componentInstance.validating(), fixture.componentInstance.valid(), '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - set constitution too low`, () => {
        const viewModel = fixture.componentInstance.characterModel()!;
        helper.setSelectByIndex('#abilitiesRandomizerType', viewModel.abilitiesRandomizerTypes.indexOf('Set'));
        
        fixture.detectChanges();
  
        helper.setInput('#setStrength', '9');
        helper.setInput('#setConstitution', '-1');
        helper.setInput('#setDexterity', '6');
        helper.setInput('#setIntelligence', '2');
        helper.setInput('#setWisdom', '10');
        helper.setInput('#setCharisma', '4');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.abilitiesRandomizerType).toEqual('Set');
        expect(fixture.componentInstance.setStrength).toEqual(9);
        expect(fixture.componentInstance.setConstitution).toEqual(-1);
        expect(fixture.componentInstance.setDexterity).toEqual(6);
        expect(fixture.componentInstance.setIntelligence).toEqual(2);
        expect(fixture.componentInstance.setWisdom).toEqual(10);
        expect(fixture.componentInstance.setCharisma).toEqual(4);
        helper.expectInvalid(fixture.componentInstance.validating(), fixture.componentInstance.valid(), '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - missing set dexterity`, () => {
        const viewModel = fixture.componentInstance.characterModel()!;
        helper.setSelectByIndex('#abilitiesRandomizerType', viewModel.abilitiesRandomizerTypes.indexOf('Set'));
        
        fixture.detectChanges();
  
        helper.setInput('#setStrength', '9');
        helper.setInput('#setConstitution', '26');
        helper.setInput('#setDexterity', '');
        helper.setInput('#setIntelligence', '2');
        helper.setInput('#setWisdom', '10');
        helper.setInput('#setCharisma', '4');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.abilitiesRandomizerType).toEqual('Set');
        expect(fixture.componentInstance.setStrength).toEqual(9);
        expect(fixture.componentInstance.setConstitution).toEqual(26);
        expect(fixture.componentInstance.setDexterity).toBeNull();
        expect(fixture.componentInstance.setIntelligence).toEqual(2);
        expect(fixture.componentInstance.setWisdom).toEqual(10);
        expect(fixture.componentInstance.setCharisma).toEqual(4);
        helper.expectInvalid(fixture.componentInstance.validating(), fixture.componentInstance.valid(), '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - set dexterity invalid`, () => {
        const viewModel = fixture.componentInstance.characterModel()!;
        helper.setSelectByIndex('#abilitiesRandomizerType', viewModel.abilitiesRandomizerTypes.indexOf('Set'));
        
        fixture.detectChanges();
  
        helper.setInput('#setStrength', '9');
        helper.setInput('#setConstitution', '26');
        helper.setInput('#setDexterity', 'wrong');
        helper.setInput('#setIntelligence', '2');
        helper.setInput('#setWisdom', '10');
        helper.setInput('#setCharisma', '4');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.abilitiesRandomizerType).toEqual('Set');
        expect(fixture.componentInstance.setStrength).toEqual(9);
        expect(fixture.componentInstance.setConstitution).toEqual(26);
        expect(fixture.componentInstance.setDexterity).toBeNull();
        expect(fixture.componentInstance.setIntelligence).toEqual(2);
        expect(fixture.componentInstance.setWisdom).toEqual(10);
        expect(fixture.componentInstance.setCharisma).toEqual(4);
        
        helper.expectInvalid(fixture.componentInstance.validating(), fixture.componentInstance.valid(), '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - set dexterity too low`, () => {
        const viewModel = fixture.componentInstance.characterModel()!;
        helper.setSelectByIndex('#abilitiesRandomizerType', viewModel.abilitiesRandomizerTypes.indexOf('Set'));
        
        fixture.detectChanges();
  
        helper.setInput('#setStrength', '9');
        helper.setInput('#setConstitution', '26');
        helper.setInput('#setDexterity', '-1');
        helper.setInput('#setIntelligence', '2');
        helper.setInput('#setWisdom', '10');
        helper.setInput('#setCharisma', '4');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.abilitiesRandomizerType).toEqual('Set');
        expect(fixture.componentInstance.setStrength).toEqual(9);
        expect(fixture.componentInstance.setConstitution).toEqual(26);
        expect(fixture.componentInstance.setDexterity).toEqual(-1);
        expect(fixture.componentInstance.setIntelligence).toEqual(2);
        expect(fixture.componentInstance.setWisdom).toEqual(10);
        expect(fixture.componentInstance.setCharisma).toEqual(4);
        helper.expectInvalid(fixture.componentInstance.validating(), fixture.componentInstance.valid(), '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - missing set intelligence`, () => {
        const viewModel = fixture.componentInstance.characterModel()!;
        helper.setSelectByIndex('#abilitiesRandomizerType', viewModel.abilitiesRandomizerTypes.indexOf('Set'));
        
        fixture.detectChanges();
  
        helper.setInput('#setStrength', '9');
        helper.setInput('#setConstitution', '26');
        helper.setInput('#setDexterity', '6');
        helper.setInput('#setIntelligence', '');
        helper.setInput('#setWisdom', '10');
        helper.setInput('#setCharisma', '4');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.abilitiesRandomizerType).toEqual('Set');
        expect(fixture.componentInstance.setStrength).toEqual(9);
        expect(fixture.componentInstance.setConstitution).toEqual(26);
        expect(fixture.componentInstance.setDexterity).toEqual(6);
        expect(fixture.componentInstance.setIntelligence).toBeNull();
        expect(fixture.componentInstance.setWisdom).toEqual(10);
        expect(fixture.componentInstance.setCharisma).toEqual(4);
        helper.expectInvalid(fixture.componentInstance.validating(), fixture.componentInstance.valid(), '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - set intelligence invalid`, () => {
        const viewModel = fixture.componentInstance.characterModel()!;
        helper.setSelectByIndex('#abilitiesRandomizerType', viewModel.abilitiesRandomizerTypes.indexOf('Set'));
        
        fixture.detectChanges();
  
        helper.setInput('#setStrength', '9');
        helper.setInput('#setConstitution', '26');
        helper.setInput('#setDexterity', '6');
        helper.setInput('#setIntelligence', 'wrong');
        helper.setInput('#setWisdom', '10');
        helper.setInput('#setCharisma', '4');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.abilitiesRandomizerType).toEqual('Set');
        expect(fixture.componentInstance.setStrength).toEqual(9);
        expect(fixture.componentInstance.setConstitution).toEqual(26);
        expect(fixture.componentInstance.setDexterity).toEqual(6);
        expect(fixture.componentInstance.setIntelligence).toBeNull();
        expect(fixture.componentInstance.setWisdom).toEqual(10);
        expect(fixture.componentInstance.setCharisma).toEqual(4);
        helper.expectInvalid(fixture.componentInstance.validating(), fixture.componentInstance.valid(), '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - set intelligence too low`, () => {
        const viewModel = fixture.componentInstance.characterModel()!;
        helper.setSelectByIndex('#abilitiesRandomizerType', viewModel.abilitiesRandomizerTypes.indexOf('Set'));
        
        fixture.detectChanges();
  
        helper.setInput('#setStrength', '9');
        helper.setInput('#setConstitution', '26');
        helper.setInput('#setDexterity', '6');
        helper.setInput('#setIntelligence', '-1');
        helper.setInput('#setWisdom', '10');
        helper.setInput('#setCharisma', '4');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.abilitiesRandomizerType).toEqual('Set');
        expect(fixture.componentInstance.setStrength).toEqual(9);
        expect(fixture.componentInstance.setConstitution).toEqual(26);
        expect(fixture.componentInstance.setDexterity).toEqual(6);
        expect(fixture.componentInstance.setIntelligence).toEqual(-1);
        expect(fixture.componentInstance.setWisdom).toEqual(10);
        expect(fixture.componentInstance.setCharisma).toEqual(4);
        helper.expectInvalid(fixture.componentInstance.validating(), fixture.componentInstance.valid(), '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - missing set wisdom`, () => {
        const viewModel = fixture.componentInstance.characterModel()!;
        helper.setSelectByIndex('#abilitiesRandomizerType', viewModel.abilitiesRandomizerTypes.indexOf('Set'));
        
        fixture.detectChanges();
  
        helper.setInput('#setStrength', '9');
        helper.setInput('#setConstitution', '26');
        helper.setInput('#setDexterity', '6');
        helper.setInput('#setIntelligence', '2');
        helper.setInput('#setWisdom', '');
        helper.setInput('#setCharisma', '4');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.abilitiesRandomizerType).toEqual('Set');
        expect(fixture.componentInstance.setStrength).toEqual(9);
        expect(fixture.componentInstance.setConstitution).toEqual(26);
        expect(fixture.componentInstance.setDexterity).toEqual(6);
        expect(fixture.componentInstance.setIntelligence).toEqual(2);
        expect(fixture.componentInstance.setWisdom).toBeNull();
        expect(fixture.componentInstance.setCharisma).toEqual(4);
        helper.expectInvalid(fixture.componentInstance.validating(), fixture.componentInstance.valid(), '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - set wisdom invalid`, () => {
        const viewModel = fixture.componentInstance.characterModel()!;
        helper.setSelectByIndex('#abilitiesRandomizerType', viewModel.abilitiesRandomizerTypes.indexOf('Set'));
        
        fixture.detectChanges();
  
        helper.setInput('#setStrength', '9');
        helper.setInput('#setConstitution', '26');
        helper.setInput('#setDexterity', '6');
        helper.setInput('#setIntelligence', '2');
        helper.setInput('#setWisdom', 'wrong');
        helper.setInput('#setCharisma', '4');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.abilitiesRandomizerType).toEqual('Set');
        expect(fixture.componentInstance.setStrength).toEqual(9);
        expect(fixture.componentInstance.setConstitution).toEqual(26);
        expect(fixture.componentInstance.setDexterity).toEqual(6);
        expect(fixture.componentInstance.setIntelligence).toEqual(2);
        expect(fixture.componentInstance.setWisdom).toBeNull();
        expect(fixture.componentInstance.setCharisma).toEqual(4);
        helper.expectInvalid(fixture.componentInstance.validating(), fixture.componentInstance.valid(), '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - set wisdom too low`, () => {
        const viewModel = fixture.componentInstance.characterModel()!;
        helper.setSelectByIndex('#abilitiesRandomizerType', viewModel.abilitiesRandomizerTypes.indexOf('Set'));
        
        fixture.detectChanges();
  
        helper.setInput('#setStrength', '9');
        helper.setInput('#setConstitution', '26');
        helper.setInput('#setDexterity', '6');
        helper.setInput('#setIntelligence', '2');
        helper.setInput('#setWisdom', '-1');
        helper.setInput('#setCharisma', '4');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.abilitiesRandomizerType).toEqual('Set');
        expect(fixture.componentInstance.setStrength).toEqual(9);
        expect(fixture.componentInstance.setConstitution).toEqual(26);
        expect(fixture.componentInstance.setDexterity).toEqual(6);
        expect(fixture.componentInstance.setIntelligence).toEqual(2);
        expect(fixture.componentInstance.setWisdom).toEqual(-1);
        expect(fixture.componentInstance.setCharisma).toEqual(4);
        helper.expectInvalid(fixture.componentInstance.validating(), fixture.componentInstance.valid(), '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - missing set charisma`, () => {
        const viewModel = fixture.componentInstance.characterModel()!;
        helper.setSelectByIndex('#abilitiesRandomizerType', viewModel.abilitiesRandomizerTypes.indexOf('Set'));
        
        fixture.detectChanges();
  
        helper.setInput('#setStrength', '9');
        helper.setInput('#setConstitution', '26');
        helper.setInput('#setDexterity', '6');
        helper.setInput('#setIntelligence', '2');
        helper.setInput('#setWisdom', '10');
        helper.setInput('#setCharisma', '');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.abilitiesRandomizerType).toEqual('Set');
        expect(fixture.componentInstance.setStrength).toEqual(9);
        expect(fixture.componentInstance.setConstitution).toEqual(26);
        expect(fixture.componentInstance.setDexterity).toEqual(6);
        expect(fixture.componentInstance.setIntelligence).toEqual(2);
        expect(fixture.componentInstance.setWisdom).toEqual(10);
        expect(fixture.componentInstance.setCharisma).toBeNull();

        helper.expectInvalid(fixture.componentInstance.validating(), fixture.componentInstance.valid(), '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - set charisma invalid`, () => {
        const viewModel = fixture.componentInstance.characterModel()!;
        helper.setSelectByIndex('#abilitiesRandomizerType', viewModel.abilitiesRandomizerTypes.indexOf('Set'));
        
        fixture.detectChanges();
  
        helper.setInput('#setStrength', '9');
        helper.setInput('#setConstitution', '26');
        helper.setInput('#setDexterity', '6');
        helper.setInput('#setIntelligence', '2');
        helper.setInput('#setWisdom', '10');
        helper.setInput('#setCharisma', 'wrong');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.abilitiesRandomizerType).toEqual('Set');
        expect(fixture.componentInstance.setStrength).toEqual(9);
        expect(fixture.componentInstance.setConstitution).toEqual(26);
        expect(fixture.componentInstance.setDexterity).toEqual(6);
        expect(fixture.componentInstance.setIntelligence).toEqual(2);
        expect(fixture.componentInstance.setWisdom).toEqual(10);
        expect(fixture.componentInstance.setCharisma).toBeNull();
        helper.expectInvalid(fixture.componentInstance.validating(), fixture.componentInstance.valid(), '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - set charisma too low`, () => {
        const viewModel = fixture.componentInstance.characterModel()!;
        helper.setSelectByIndex('#abilitiesRandomizerType', viewModel.abilitiesRandomizerTypes.indexOf('Set'));
        
        fixture.detectChanges();
  
        helper.setInput('#setStrength', '9');
        helper.setInput('#setConstitution', '26');
        helper.setInput('#setDexterity', '6');
        helper.setInput('#setIntelligence', '2');
        helper.setInput('#setWisdom', '10');
        helper.setInput('#setCharisma', '-1');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.abilitiesRandomizerType).toEqual('Set');
        expect(fixture.componentInstance.setStrength).toEqual(9);
        expect(fixture.componentInstance.setConstitution).toEqual(26);
        expect(fixture.componentInstance.setDexterity).toEqual(6);
        expect(fixture.componentInstance.setIntelligence).toEqual(2);
        expect(fixture.componentInstance.setWisdom).toEqual(10);
        expect(fixture.componentInstance.setCharisma).toEqual(-1);

        helper.expectInvalid(fixture.componentInstance.validating(), fixture.componentInstance.valid(), '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should validate when allow ability adjustments changes`, waitForAsync(async () => {
        helper.clickCheckbox('#abilitiesAdjustCheckbox');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.allowAbilitiesAdjustments).toBe(false);

        helper.expectValidating(fixture.componentInstance.validating(), '#generateCharacterButton', '#characterValidating');
      }));

      it(`should show that character is invalid - validation fails`, waitForAsync(async () => {
        const viewModel = fixture.componentInstance.characterModel()!;
        helper.setSelectByIndex('#alignmentRandomizerType', viewModel.alignmentRandomizerTypes.indexOf('Good'));
        
        //run validation
        await helper.waitForChangeDetection();

        helper.setSelectByIndex('#metaraceRandomizerType', viewModel.metaraceRandomizerTypes.indexOf('Set'));
        
        //run validation
        await helper.waitForChangeDetection();

        helper.setSelectByIndex('#setMetarace', viewModel.metaraces.indexOf('Lich'));
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.alignmentRandomizerType).toEqual('Good');
        expect(fixture.componentInstance.metaraceRandomizerType).toEqual('Set');
        expect(fixture.componentInstance.setMetarace).toEqual('Lich');

        helper.expectValidating(fixture.componentInstance.validating(), '#generateCharacterButton', '#characterValidating');
  
        //run validation
        await helper.waitForChangeDetection();
        
        expect(fixture.componentInstance.valid()).toBe(false);
        helper.expectInvalid(fixture.componentInstance.validating(), fixture.componentInstance.valid(), '#generateCharacterButton', '#characterValidating');
      }));
    
      it(`should show that character is valid - validation succeeds`, async () => {
        const viewModel = fixture.componentInstance.characterModel()!;
        helper.setSelectByIndex('#alignmentRandomizerType', viewModel.alignmentRandomizerTypes.indexOf('Evil'));
        helper.setSelectByIndex('#metaraceRandomizerType', viewModel.metaraceRandomizerTypes.indexOf('Set'));
        helper.setSelectByIndex('#setMetarace', viewModel.metaraces.indexOf('Lich'));
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.alignmentRandomizerType).toEqual('Evil');
        expect(fixture.componentInstance.metaraceRandomizerType).toEqual('Set');
        expect(fixture.componentInstance.setMetarace).toEqual('Lich');

        helper.expectValidating(fixture.componentInstance.validating(), '#generateCharacterButton', '#characterValidating');
  
        //run validation
        await helper.waitForChangeDetection();
  
        helper.expectValid(fixture.componentInstance.validating(), fixture.componentInstance.valid(), '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should bind forcing metaraces`, async () => {
        expect(fixture.componentInstance.forceMetarace).toBe(false);

        helper.clickCheckbox('#forceMetaraceCheckbox');

        fixture.detectChanges();
        expect(fixture.componentInstance.forceMetarace).toBe(true);

        helper.clickCheckbox('#forceMetaraceCheckbox');

        fixture.detectChanges();
        expect(fixture.componentInstance.forceMetarace).toBe(false);
      });
    
      it(`should bind allowing ability adjustments`, async () => {
        expect(fixture.componentInstance.allowAbilitiesAdjustments).toBe(true);

        helper.clickCheckbox('#abilitiesAdjustCheckbox');

        fixture.detectChanges();
        expect(fixture.componentInstance.allowAbilitiesAdjustments).toBe(false);

        helper.clickCheckbox('#abilitiesAdjustCheckbox');

        fixture.detectChanges();
        expect(fixture.componentInstance.allowAbilitiesAdjustments).toBe(true);
      });
    
      it(`should show when generating a character`, () => {
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
    
      it(`should generate the default character`, async () => {
        helper.clickButton('#generateCharacterButton');
  
        fixture.detectChanges();
        
        helper.expectGenerating(fixture.componentInstance.generating(),
          '#generateCharacterButton', 
          '#characterSection', 
          '#generatingSection dndgen-loading', 
          '#characterValidating', 
          '#downloadButton');

        //run generate character
        await helper.waitForChangeDetection();
  
        helper.expectGenerated(fixture.componentInstance.generating(),
          '#generateCharacterButton', 
          '#characterSection', 
          '#generatingSection dndgen-loading', 
          '#characterValidating', 
          '#downloadButton',
          false);

        helper.expectExists('#noCharacter', false);
        helper.expectExists('#characterSection > dndgen-character', true);
        // HACK: We might generate leadership, so we can't assert this
        // helper.expectExists('#characterSection dndgen-leadership', false);
        helper.expectCharacter('#characterSection > dndgen-character', true);
      });
    
      it(`should generate non-default character`, async () => {
        const viewModel = fixture.componentInstance.characterModel()!;
        helper.setSelectByIndex('#alignmentRandomizerType', viewModel.alignmentRandomizerTypes.indexOf('Non-evil'));
        helper.setSelectByIndex('#classNameRandomizerType', viewModel.classNameRandomizerTypes.indexOf('Physical Combat'));
        helper.setSelectByIndex('#levelRandomizerType', viewModel.levelRandomizerTypes.indexOf('Low'));
        helper.setSelectByIndex('#baseRaceRandomizerType', viewModel.baseRaceRandomizerTypes.indexOf('Non-Monster Base'));
        helper.setSelectByIndex('#metaraceRandomizerType', viewModel.metaraceRandomizerTypes.indexOf('Lycanthrope Meta'));
        helper.setCheckbox('#forceMetaraceCheckbox', true);
        helper.setSelectByIndex('#abilitiesRandomizerType', viewModel.abilitiesRandomizerTypes.indexOf('Ones as sixes'));
  
        fixture.detectChanges();

        expect(fixture.componentInstance.alignmentRandomizerType).toEqual('Non-evil');
        expect(fixture.componentInstance.classNameRandomizerType).toEqual('Physical Combat');
        expect(fixture.componentInstance.levelRandomizerType).toEqual('Low');
        expect(fixture.componentInstance.baseRaceRandomizerType).toEqual('Non-Monster Base');
        expect(fixture.componentInstance.metaraceRandomizerType).toEqual('Lycanthrope Meta');
        expect(fixture.componentInstance.abilitiesRandomizerType).toEqual('Ones as sixes');

        //run validation
        await helper.waitForChangeDetection();

        helper.clickButton('#generateCharacterButton');
  
        fixture.detectChanges();
        
        helper.expectGenerating(fixture.componentInstance.generating(),
          '#generateCharacterButton', 
          '#characterSection', 
          '#generatingSection dndgen-loading', 
          '#characterValidating', 
          '#downloadButton');

        //run generate character
        await helper.waitForChangeDetection();
  
        helper.expectGenerated(fixture.componentInstance.generating(),
          '#generateCharacterButton', 
          '#characterSection', 
          '#generatingSection dndgen-loading', 
          '#characterValidating', 
          '#downloadButton',
          false);

        helper.expectExists('#noCharacter', false)
        helper.expectExists('#characterSection dndgen-character', true);
        helper.expectExists('#characterSection dndgen-leadership', false);
        helper.expectCharacter('#characterSection dndgen-character', true);
      });
    
      it(`should generate non-default character - set values`, async () => {
        const viewModel = fixture.componentInstance.characterModel()!;
        helper.setSelectByIndex('#alignmentRandomizerType', viewModel.alignmentRandomizerTypes.indexOf('Set'));
        fixture.detectChanges();

        helper.setSelectByIndex('#setAlignment', viewModel.alignments.indexOf('Neutral Good'));
        helper.setSelectByIndex('#classNameRandomizerType', viewModel.classNameRandomizerTypes.indexOf('Set'));
        fixture.detectChanges();

        helper.setSelectByIndex('#setClassName', viewModel.classNames.indexOf('Fighter'));
        helper.setSelectByIndex('#levelRandomizerType', viewModel.levelRandomizerTypes.indexOf('Set'));
        fixture.detectChanges();

        helper.setInput('#setLevel', '4');
        helper.setSelectByIndex('#baseRaceRandomizerType', viewModel.baseRaceRandomizerTypes.indexOf('Set'));
        fixture.detectChanges();

        helper.setSelectByIndex('#setBaseRace', viewModel.baseRaces.indexOf('Mountain Dwarf'));
        helper.setSelectByIndex('#metaraceRandomizerType', viewModel.metaraceRandomizerTypes.indexOf('Set'));
        fixture.detectChanges();

        helper.setSelectByIndex('#setMetarace', viewModel.metaraces.indexOf('Half-Dragon'));
        helper.setSelectByIndex('#abilitiesRandomizerType', viewModel.abilitiesRandomizerTypes.indexOf('Set'));
        fixture.detectChanges();

        helper.setInput('#setStrength', '9');
        helper.setInput('#setConstitution', '21');
        helper.setInput('#setDexterity', '2');
        helper.setInput('#setIntelligence', '6');
        helper.setInput('#setWisdom', '13');
        helper.setInput('#setCharisma', '3');
  
        fixture.detectChanges();

        expect(fixture.componentInstance.alignmentRandomizerType).toEqual('Set');
        expect(fixture.componentInstance.setAlignment).toEqual('Neutral Good');
        expect(fixture.componentInstance.classNameRandomizerType).toEqual('Set');
        expect(fixture.componentInstance.setClassName).toEqual('Fighter');
        expect(fixture.componentInstance.levelRandomizerType).toEqual('Set');
        expect(fixture.componentInstance.setLevel).toEqual(4);
        expect(fixture.componentInstance.baseRaceRandomizerType).toEqual('Set');
        expect(fixture.componentInstance.setBaseRace).toEqual('Mountain Dwarf');
        expect(fixture.componentInstance.metaraceRandomizerType).toEqual('Set');
        expect(fixture.componentInstance.setMetarace).toEqual('Half-Dragon');
        expect(fixture.componentInstance.abilitiesRandomizerType).toEqual('Set');
        expect(fixture.componentInstance.setStrength).toEqual(9);
        expect(fixture.componentInstance.setConstitution).toEqual(21);
        expect(fixture.componentInstance.setDexterity).toEqual(2);
        expect(fixture.componentInstance.setIntelligence).toEqual(6);
        expect(fixture.componentInstance.setWisdom).toEqual(13);
        expect(fixture.componentInstance.setCharisma).toEqual(3);

        //run validation
        await helper.waitForChangeDetection();

        helper.clickButton('#generateCharacterButton');
  
        fixture.detectChanges();
        
        helper.expectGenerating(fixture.componentInstance.generating(),
          '#generateCharacterButton', 
          '#characterSection', 
          '#generatingSection dndgen-loading', 
          '#characterValidating', 
          '#downloadButton');

        //run generate character
        await helper.waitForChangeDetection();
  
        helper.expectGenerated(fixture.componentInstance.generating(),
          '#generateCharacterButton', 
          '#characterSection', 
          '#generatingSection dndgen-loading', 
          '#characterValidating', 
          '#downloadButton',
          false);

        helper.expectExists('#noCharacter', false)
        helper.expectExists('#characterSection dndgen-character', true);
        helper.expectExists('#characterSection dndgen-leadership', false);
        helper.expectCharacter('#characterSection dndgen-character', true);
      });
    });
  });
});
