import { describe, it, expect, beforeEach, vi } from 'vitest';
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

      it(`should hide set alignment, except for Set alignment randomizer`, async () => {
        const viewModel = fixture.componentInstance.characterModel()!;
        for(let i = 0; i < viewModel.alignmentRandomizerTypes.length; i++) {
          helper.setSelectByIndex('#alignmentRandomizerType', i);

          await helper.waitForChangeDetection();
  
          const randomizer = viewModel.alignmentRandomizerTypes[i];
          helper.expectSelect('#alignmentRandomizerType', true, randomizer, viewModel.alignmentRandomizerTypes.length);

          const isSet = randomizer == 'Set';
          helper.expectHasAttribute('#setAlignment', 'hidden', !isSet);
          helper.expectHasAttribute('#setAlignment', 'required', isSet);
        }
      });

      it(`should hide set class name, except for Set class name randomizer`, async () => {
        const viewModel = fixture.componentInstance.characterModel()!;
        for(let i = 0; i < viewModel.classNameRandomizerTypes.length; i++) {
          helper.setSelectByIndex('#classNameRandomizerType', i);

          await helper.waitForChangeDetection();
  
          const randomizer = viewModel.classNameRandomizerTypes[i];
          helper.expectSelect('#classNameRandomizerType', true, randomizer, viewModel.classNameRandomizerTypes.length);

          const isSet = randomizer == 'Set';
          helper.expectHasAttribute('#setClassName', 'hidden', !isSet);
          helper.expectHasAttribute('#setClassName', 'required', isSet);
        }
      });

      it(`should hide set level, except for Set level randomizer`, async () => {
        const viewModel = fixture.componentInstance.characterModel()!;
        for(let i = 0; i < viewModel.levelRandomizerTypes.length; i++) {
          helper.setSelectByIndex('#levelRandomizerType', i);

          await helper.waitForChangeDetection();
  
          const randomizer = viewModel.levelRandomizerTypes[i];
          helper.expectSelect('#levelRandomizerType', true, randomizer, viewModel.levelRandomizerTypes.length);

          const isSet = randomizer == 'Set';
          helper.expectHasAttribute('#setLevel', 'hidden', !isSet);
          helper.expectHasAttribute('#setLevel', 'required', isSet);
        }
      });

      it(`should hide set base race, except for Set base race randomizer`, async () => {
        const viewModel = fixture.componentInstance.characterModel()!;
        for(let i = 0; i < viewModel.baseRaceRandomizerTypes.length; i++) {
          helper.setSelectByIndex('#baseRaceRandomizerType', i);

          await helper.waitForChangeDetection();
  
          const randomizer = viewModel.baseRaceRandomizerTypes[i];
          helper.expectSelect('#baseRaceRandomizerType', true, randomizer, viewModel.baseRaceRandomizerTypes.length);

          const isSet = randomizer == 'Set';
          helper.expectHasAttribute('#setBaseRace', 'hidden', !isSet);
          helper.expectHasAttribute('#setBaseRace', 'required', isSet);
        }
      });

      it(`should hide set metarace, except for Set metarace randomizer`, async () => {
        const viewModel = fixture.componentInstance.characterModel()!;
        for(let i = 0; i < viewModel.metaraceRandomizerTypes.length; i++) {
          helper.setSelectByIndex('#metaraceRandomizerType', i);

          await helper.waitForChangeDetection();
  
          const randomizer = viewModel.metaraceRandomizerTypes[i];
          helper.expectSelect('#metaraceRandomizerType', true, randomizer, viewModel.metaraceRandomizerTypes.length);

          const isSet = randomizer == 'Set';
          helper.expectHasAttribute('#setMetarace', 'hidden', !isSet);
          helper.expectHasAttribute('#setMetarace', 'required', isSet);
        }
      });

      it(`should hide force metarace for Set and None metarace randomizer`, async () => {
        const viewModel = fixture.componentInstance.characterModel()!;
        for(let i = 0; i < viewModel.metaraceRandomizerTypes.length; i++) {
          helper.setSelectByIndex('#metaraceRandomizerType', i);

          await helper.waitForChangeDetection();
  
          const randomizer = viewModel.metaraceRandomizerTypes[i];
          helper.expectSelect('#metaraceRandomizerType', true, randomizer, viewModel.metaraceRandomizerTypes.length);

          const isSetOrNone = randomizer == 'Set' || randomizer == 'No Meta';
          helper.expectHasAttribute('#force-metarace-col', 'hidden', isSetOrNone);
          helper.expectHasAttribute('#force-metarace-col #forceMetaraceCheckbox', 'required', false);
        }
      });

      it(`should hide set abilities, except for Set abilities randomizer`, async () => {
        const viewModel = fixture.componentInstance.characterModel()!;
        for(let i = 0; i < viewModel.abilitiesRandomizerTypes.length; i++) {
          helper.setSelectByIndex('#abilitiesRandomizerType', i);

          await helper.waitForChangeDetection();
  
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

      it(`should hide allow ability adjustments, except for Set abilities randomizer`, async () => {
        const viewModel = fixture.componentInstance.characterModel()!;
        for(let i = 0; i < viewModel.abilitiesRandomizerTypes.length; i++) {
          helper.setSelectByIndex('#abilitiesRandomizerType', i);

          await helper.waitForChangeDetection();
  
          const randomizer = viewModel.abilitiesRandomizerTypes[i];
          helper.expectSelect('#abilitiesRandomizerType', true, randomizer, viewModel.abilitiesRandomizerTypes.length);

          const isSet = randomizer == 'Set';
          helper.expectHasAttribute('#adjust-abilities-col', 'hidden', !isSet);
          helper.expectHasAttribute('#adjust-abilities-col #abilitiesAdjustCheckbox', 'required', false);
        }
      });

      it(`should show when validating character`, async () => {
        const component = fixture.componentInstance;
        component.validating.set(true);
  
        await helper.waitForChangeDetection();

        helper.expectValidating(fixture.componentInstance.validating(), '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - missing alignment randomizer`, () => {
        helper.setSelectByValue('#alignmentRandomizerType', '');
  
        expect(fixture.componentInstance.alignmentRandomizerType).toEqual('');
        helper.expectInvalid(fixture.componentInstance.validating(), fixture.componentInstance.valid(), '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - missing set alignment`, async () => {
        expectReady();

        const viewModel = fixture.componentInstance.characterModel()!;
        helper.setSelectByIndex('#alignmentRandomizerType', viewModel.alignmentRandomizerTypes.indexOf('Set'));

        //run validation
        await helper.waitForChangeDetection();

        helper.setSelectByValue('#setAlignment', '');
  
        expect(fixture.componentInstance.alignmentRandomizerType).toEqual('Set');
        expect(fixture.componentInstance.setAlignment).toEqual('');
        
        helper.expectInvalid(fixture.componentInstance.validating(), fixture.componentInstance.valid(), '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - missing class name randomizer`, () => {
        helper.setSelectByValue('#classNameRandomizerType', '');
  
        expect(fixture.componentInstance.classNameRandomizerType).toEqual('');
        helper.expectInvalid(fixture.componentInstance.validating(), fixture.componentInstance.valid(), '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - missing set class name`, async () => {
        expectReady();

        const viewModel = fixture.componentInstance.characterModel()!;
        helper.setSelectByIndex('#classNameRandomizerType', viewModel.classNameRandomizerTypes.indexOf('Set'));

        //run validation
        await helper.waitForChangeDetection();

        helper.setSelectByValue('#setClassName', '');
  
        expect(fixture.componentInstance.classNameRandomizerType).toEqual('Set');
        expect(fixture.componentInstance.setClassName).toEqual('');
        helper.expectInvalid(fixture.componentInstance.validating(), fixture.componentInstance.valid(), '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - missing level randomizer`, () => {
        helper.setSelectByValue('#levelRandomizerType', '');
  
        expect(fixture.componentInstance.levelRandomizerType).toEqual('');
        helper.expectInvalid(fixture.componentInstance.validating(), fixture.componentInstance.valid(), '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - missing set level`, async () => {
        const viewModel = fixture.componentInstance.characterModel()!;
        helper.setSelectByIndex('#levelRandomizerType', viewModel.levelRandomizerTypes.indexOf('Set'));

        //run validation
        await helper.waitForChangeDetection();

        helper.setInput('#setLevel', '');
  
        expect(fixture.componentInstance.levelRandomizerType).toEqual('Set');
        expect(fixture.componentInstance.setLevel).toBeNull();
        helper.expectInvalid(fixture.componentInstance.validating(), fixture.componentInstance.valid(), '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - set level invalid`, async () => {
        const viewModel = fixture.componentInstance.characterModel()!;
        helper.setSelectByIndex('#levelRandomizerType', viewModel.levelRandomizerTypes.indexOf('Set'));

        //run validation
        await helper.waitForChangeDetection();

        helper.setInput('#setLevel', 'wrong');
  
        expect(fixture.componentInstance.levelRandomizerType).toEqual('Set');
        expect(fixture.componentInstance.setLevel).toBeNull();
        
        helper.expectInvalid(fixture.componentInstance.validating(), fixture.componentInstance.valid(), '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - set level too low`, async () => {
        const viewModel = fixture.componentInstance.characterModel()!;
        helper.setSelectByIndex('#levelRandomizerType', viewModel.levelRandomizerTypes.indexOf('Set'));

        //run validation
        await helper.waitForChangeDetection();

        helper.setInput('#setLevel', '-1');
  
        expect(fixture.componentInstance.levelRandomizerType).toEqual('Set');
        expect(fixture.componentInstance.setLevel).toEqual(-1);
        helper.expectInvalid(fixture.componentInstance.validating(), fixture.componentInstance.valid(), '#generateCharacterButton', '#characterValidating');
      });

      it(`should show that character is invalid - set level too high`, async () => {
        const viewModel = fixture.componentInstance.characterModel()!;
        helper.setSelectByIndex('#levelRandomizerType', viewModel.levelRandomizerTypes.indexOf('Set'));
        
        //run validation
        await helper.waitForChangeDetection();

        helper.setInput('#setLevel', '21');
  
        expect(fixture.componentInstance.levelRandomizerType).toEqual('Set');
        expect(fixture.componentInstance.setLevel).toEqual(21);

        helper.expectValidating(fixture.componentInstance.validating(), '#generateCharacterButton', '#characterValidating');
        
        //run validation
        await helper.waitForChangeDetection();
  
        expect(fixture.componentInstance.valid()).toBe(false);
        helper.expectInvalid(fixture.componentInstance.validating(), fixture.componentInstance.valid(), '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - missing base race randomizer`, () => {
        helper.setSelectByValue('#baseRaceRandomizerType', '');
  
        expect(fixture.componentInstance.baseRaceRandomizerType).toEqual('');
        helper.expectInvalid(fixture.componentInstance.validating(), fixture.componentInstance.valid(), '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - missing set base race`, async () => {
        const viewModel = fixture.componentInstance.characterModel()!;
        helper.setSelectByIndex('#baseRaceRandomizerType', viewModel.baseRaceRandomizerTypes.indexOf('Set'));

        //run validation
        await helper.waitForChangeDetection();

        helper.setSelectByValue('#setBaseRace', '');
  
        expect(fixture.componentInstance.baseRaceRandomizerType).toEqual('Set');
        expect(fixture.componentInstance.setBaseRace).toEqual('');
        helper.expectInvalid(fixture.componentInstance.validating(), fixture.componentInstance.valid(), '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - missing metarace randomizer`, () => {
        helper.setSelectByValue('#metaraceRandomizerType', '');
  
        expect(fixture.componentInstance.metaraceRandomizerType).toEqual('');
        helper.expectInvalid(fixture.componentInstance.validating(), fixture.componentInstance.valid(), '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should validate when force metarace changes`, async () => {
        helper.clickCheckbox('#forceMetaraceCheckbox');
  
        expect(fixture.componentInstance.forceMetarace).toBe(true);

        helper.expectValidating(fixture.componentInstance.validating(), '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - missing set metarace`, async () => {
        expectReady();

        const viewModel = fixture.componentInstance.characterModel()!;
        helper.setSelectByIndex('#metaraceRandomizerType', viewModel.metaraceRandomizerTypes.indexOf('Set'));

        //run validation
        await helper.waitForChangeDetection();

        helper.setSelectByValue('#setMetarace', '');
  
        expect(fixture.componentInstance.metaraceRandomizerType).toEqual('Set');
        expect(fixture.componentInstance.setMetarace).toEqual('');
        helper.expectInvalid(fixture.componentInstance.validating(), fixture.componentInstance.valid(), '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - missing abilities randomizer`, () => {
        helper.setSelectByValue('#abilitiesRandomizerType', '');
  
        expect(fixture.componentInstance.abilitiesRandomizerType).toEqual('');
        helper.expectInvalid(fixture.componentInstance.validating(), fixture.componentInstance.valid(), '#generateCharacterButton', '#characterValidating');
      });

      it(`BUG - should set set level`, async () => {
        const viewModel = fixture.componentInstance.characterModel()!;
        helper.setSelectByIndex('#levelRandomizerType', viewModel.levelRandomizerTypes.indexOf('Set'));
        
        //run validation
        await helper.waitForChangeDetection();
  
        expect(fixture.componentInstance.levelRandomizerType).toEqual('Set');

        helper.setInput('#setLevel', '9');
  
        helper.expectNumberInput('#setLevel', true, 9);

        expect(fixture.componentInstance.setLevel).toEqual(9);
      });
    
      it(`BUG - should set set abilities`, async () => {
        const viewModel = fixture.componentInstance.characterModel()!;
        helper.setSelectByIndex('#abilitiesRandomizerType', viewModel.abilitiesRandomizerTypes.indexOf('Set'));
        
        //run validation
        await helper.waitForChangeDetection();
  
        expect(fixture.componentInstance.abilitiesRandomizerType).toEqual('Set');

        helper.setInput('#setStrength', '9');
        helper.setInput('#setConstitution', '26');
        helper.setInput('#setDexterity', '6');
        helper.setInput('#setIntelligence', '2');
        helper.setInput('#setWisdom', '10');
        helper.setInput('#setCharisma', '4');
  
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

      it(`should show that character is invalid - missing set strength`, async () => {
        const viewModel = fixture.componentInstance.characterModel()!;
        helper.setSelectByIndex('#abilitiesRandomizerType', viewModel.abilitiesRandomizerTypes.indexOf('Set'));
        
        //run validation
        await helper.waitForChangeDetection();
  
        helper.setInput('#setStrength', '');
        helper.setInput('#setConstitution', '26');
        helper.setInput('#setDexterity', '6');
        helper.setInput('#setIntelligence', '2');
        helper.setInput('#setWisdom', '10');
        helper.setInput('#setCharisma', '4');
  
        expect(fixture.componentInstance.abilitiesRandomizerType).toEqual('Set');
        expect(fixture.componentInstance.setStrength).toBeNull();
        expect(fixture.componentInstance.setConstitution).toEqual(26);
        expect(fixture.componentInstance.setDexterity).toEqual(6);
        expect(fixture.componentInstance.setIntelligence).toEqual(2);
        expect(fixture.componentInstance.setWisdom).toEqual(10);
        expect(fixture.componentInstance.setCharisma).toEqual(4);
        helper.expectInvalid(fixture.componentInstance.validating(), fixture.componentInstance.valid(), '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - set strength invalid`, async () => {
        const viewModel = fixture.componentInstance.characterModel()!;
        helper.setSelectByIndex('#abilitiesRandomizerType', viewModel.abilitiesRandomizerTypes.indexOf('Set'));
        
        //run validation
        await helper.waitForChangeDetection();
  
        helper.setInput('#setStrength', 'wrong');
        helper.setInput('#setConstitution', '26');
        helper.setInput('#setDexterity', '6');
        helper.setInput('#setIntelligence', '2');
        helper.setInput('#setWisdom', '10');
        helper.setInput('#setCharisma', '4');
  
        expect(fixture.componentInstance.abilitiesRandomizerType).toEqual('Set');
        expect(fixture.componentInstance.setStrength).toBeNull();
        expect(fixture.componentInstance.setConstitution).toEqual(26);
        expect(fixture.componentInstance.setDexterity).toEqual(6);
        expect(fixture.componentInstance.setIntelligence).toEqual(2);
        expect(fixture.componentInstance.setWisdom).toEqual(10);
        expect(fixture.componentInstance.setCharisma).toEqual(4);
        helper.expectInvalid(fixture.componentInstance.validating(), fixture.componentInstance.valid(), '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - set strength too low`, async () => {
        const viewModel = fixture.componentInstance.characterModel()!;
        helper.setSelectByIndex('#abilitiesRandomizerType', viewModel.abilitiesRandomizerTypes.indexOf('Set'));
        
        //run validation
        await helper.waitForChangeDetection();
  
        helper.setInput('#setStrength', '-1');
        helper.setInput('#setConstitution', '26');
        helper.setInput('#setDexterity', '6');
        helper.setInput('#setIntelligence', '2');
        helper.setInput('#setWisdom', '10');
        helper.setInput('#setCharisma', '4');
  
        expect(fixture.componentInstance.abilitiesRandomizerType).toEqual('Set');
        expect(fixture.componentInstance.setStrength).toEqual(-1);
        expect(fixture.componentInstance.setConstitution).toEqual(26);
        expect(fixture.componentInstance.setDexterity).toEqual(6);
        expect(fixture.componentInstance.setIntelligence).toEqual(2);
        expect(fixture.componentInstance.setWisdom).toEqual(10);
        expect(fixture.componentInstance.setCharisma).toEqual(4);

        helper.expectInvalid(fixture.componentInstance.validating(), fixture.componentInstance.valid(), '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - missing set constitution`, async () => {
        const viewModel = fixture.componentInstance.characterModel()!;
        helper.setSelectByIndex('#abilitiesRandomizerType', viewModel.abilitiesRandomizerTypes.indexOf('Set'));
        
        //run validation
        await helper.waitForChangeDetection();
  
        helper.setInput('#setStrength', '9');
        helper.setInput('#setConstitution', '');
        helper.setInput('#setDexterity', '6');
        helper.setInput('#setIntelligence', '2');
        helper.setInput('#setWisdom', '10');
        helper.setInput('#setCharisma', '4');
  
        expect(fixture.componentInstance.abilitiesRandomizerType).toEqual('Set');
        expect(fixture.componentInstance.setStrength).toEqual(9);
        expect(fixture.componentInstance.setConstitution).toBeNull();
        expect(fixture.componentInstance.setDexterity).toEqual(6);
        expect(fixture.componentInstance.setIntelligence).toEqual(2);
        expect(fixture.componentInstance.setWisdom).toEqual(10);
        expect(fixture.componentInstance.setCharisma).toEqual(4);
        helper.expectInvalid(fixture.componentInstance.validating(), fixture.componentInstance.valid(), '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - set constitution invalid`, async () => {
        const viewModel = fixture.componentInstance.characterModel()!;
        helper.setSelectByIndex('#abilitiesRandomizerType', viewModel.abilitiesRandomizerTypes.indexOf('Set'));
        
        //run validation
        await helper.waitForChangeDetection();
  
        helper.setInput('#setStrength', '9');
        helper.setInput('#setConstitution', 'wrong');
        helper.setInput('#setDexterity', '6');
        helper.setInput('#setIntelligence', '2');
        helper.setInput('#setWisdom', '10');
        helper.setInput('#setCharisma', '4');
  
        expect(fixture.componentInstance.abilitiesRandomizerType).toEqual('Set');
        expect(fixture.componentInstance.setStrength).toEqual(9);
        expect(fixture.componentInstance.setConstitution).toBeNull();
        expect(fixture.componentInstance.setDexterity).toEqual(6);
        expect(fixture.componentInstance.setIntelligence).toEqual(2);
        expect(fixture.componentInstance.setWisdom).toEqual(10);
        expect(fixture.componentInstance.setCharisma).toEqual(4);
        helper.expectInvalid(fixture.componentInstance.validating(), fixture.componentInstance.valid(), '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - set constitution too low`, async () => {
        const viewModel = fixture.componentInstance.characterModel()!;
        helper.setSelectByIndex('#abilitiesRandomizerType', viewModel.abilitiesRandomizerTypes.indexOf('Set'));
        
        //run validation
        await helper.waitForChangeDetection();
  
        helper.setInput('#setStrength', '9');
        helper.setInput('#setConstitution', '-1');
        helper.setInput('#setDexterity', '6');
        helper.setInput('#setIntelligence', '2');
        helper.setInput('#setWisdom', '10');
        helper.setInput('#setCharisma', '4');
  
        expect(fixture.componentInstance.abilitiesRandomizerType).toEqual('Set');
        expect(fixture.componentInstance.setStrength).toEqual(9);
        expect(fixture.componentInstance.setConstitution).toEqual(-1);
        expect(fixture.componentInstance.setDexterity).toEqual(6);
        expect(fixture.componentInstance.setIntelligence).toEqual(2);
        expect(fixture.componentInstance.setWisdom).toEqual(10);
        expect(fixture.componentInstance.setCharisma).toEqual(4);
        helper.expectInvalid(fixture.componentInstance.validating(), fixture.componentInstance.valid(), '#generateCharacterButton', '#characterValidating');
      });

      it(`should show that character is invalid - missing set dexterity`, async () => {
        const viewModel = fixture.componentInstance.characterModel()!;
        helper.setSelectByIndex('#abilitiesRandomizerType', viewModel.abilitiesRandomizerTypes.indexOf('Set'));
        
        //run validation
        await helper.waitForChangeDetection();
  
        helper.setInput('#setStrength', '9');
        helper.setInput('#setConstitution', '26');
        helper.setInput('#setDexterity', '');
        helper.setInput('#setIntelligence', '2');
        helper.setInput('#setWisdom', '10');
        helper.setInput('#setCharisma', '4');
  
        expect(fixture.componentInstance.abilitiesRandomizerType).toEqual('Set');
        expect(fixture.componentInstance.setStrength).toEqual(9);
        expect(fixture.componentInstance.setConstitution).toEqual(26);
        expect(fixture.componentInstance.setDexterity).toBeNull();
        expect(fixture.componentInstance.setIntelligence).toEqual(2);
        expect(fixture.componentInstance.setWisdom).toEqual(10);
        expect(fixture.componentInstance.setCharisma).toEqual(4);
        helper.expectInvalid(fixture.componentInstance.validating(), fixture.componentInstance.valid(), '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - set dexterity invalid`, async () => {
        const viewModel = fixture.componentInstance.characterModel()!;
        helper.setSelectByIndex('#abilitiesRandomizerType', viewModel.abilitiesRandomizerTypes.indexOf('Set'));
        
        //run validation
        await helper.waitForChangeDetection();
  
        helper.setInput('#setStrength', '9');
        helper.setInput('#setConstitution', '26');
        helper.setInput('#setDexterity', 'wrong');
        helper.setInput('#setIntelligence', '2');
        helper.setInput('#setWisdom', '10');
        helper.setInput('#setCharisma', '4');
  
        expect(fixture.componentInstance.abilitiesRandomizerType).toEqual('Set');
        expect(fixture.componentInstance.setStrength).toEqual(9);
        expect(fixture.componentInstance.setConstitution).toEqual(26);
        expect(fixture.componentInstance.setDexterity).toBeNull();
        expect(fixture.componentInstance.setIntelligence).toEqual(2);
        expect(fixture.componentInstance.setWisdom).toEqual(10);
        expect(fixture.componentInstance.setCharisma).toEqual(4);
        
        helper.expectInvalid(fixture.componentInstance.validating(), fixture.componentInstance.valid(), '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - set dexterity too low`, async () => {
        const viewModel = fixture.componentInstance.characterModel()!;
        helper.setSelectByIndex('#abilitiesRandomizerType', viewModel.abilitiesRandomizerTypes.indexOf('Set'));
        
        //run validation
        await helper.waitForChangeDetection();
  
        helper.setInput('#setStrength', '9');
        helper.setInput('#setConstitution', '26');
        helper.setInput('#setDexterity', '-1');
        helper.setInput('#setIntelligence', '2');
        helper.setInput('#setWisdom', '10');
        helper.setInput('#setCharisma', '4');
  
        expect(fixture.componentInstance.abilitiesRandomizerType).toEqual('Set');
        expect(fixture.componentInstance.setStrength).toEqual(9);
        expect(fixture.componentInstance.setConstitution).toEqual(26);
        expect(fixture.componentInstance.setDexterity).toEqual(-1);
        expect(fixture.componentInstance.setIntelligence).toEqual(2);
        expect(fixture.componentInstance.setWisdom).toEqual(10);
        expect(fixture.componentInstance.setCharisma).toEqual(4);
        helper.expectInvalid(fixture.componentInstance.validating(), fixture.componentInstance.valid(), '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - missing set intelligence`, async () => {
        const viewModel = fixture.componentInstance.characterModel()!;
        helper.setSelectByIndex('#abilitiesRandomizerType', viewModel.abilitiesRandomizerTypes.indexOf('Set'));
        
        //run validation
        await helper.waitForChangeDetection();
  
        helper.setInput('#setStrength', '9');
        helper.setInput('#setConstitution', '26');
        helper.setInput('#setDexterity', '6');
        helper.setInput('#setIntelligence', '');
        helper.setInput('#setWisdom', '10');
        helper.setInput('#setCharisma', '4');
  
        expect(fixture.componentInstance.abilitiesRandomizerType).toEqual('Set');
        expect(fixture.componentInstance.setStrength).toEqual(9);
        expect(fixture.componentInstance.setConstitution).toEqual(26);
        expect(fixture.componentInstance.setDexterity).toEqual(6);
        expect(fixture.componentInstance.setIntelligence).toBeNull();
        expect(fixture.componentInstance.setWisdom).toEqual(10);
        expect(fixture.componentInstance.setCharisma).toEqual(4);
        helper.expectInvalid(fixture.componentInstance.validating(), fixture.componentInstance.valid(), '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - set intelligence invalid`, async () => {
        const viewModel = fixture.componentInstance.characterModel()!;
        helper.setSelectByIndex('#abilitiesRandomizerType', viewModel.abilitiesRandomizerTypes.indexOf('Set'));
        
        //run validation
        await helper.waitForChangeDetection();
  
        helper.setInput('#setStrength', '9');
        helper.setInput('#setConstitution', '26');
        helper.setInput('#setDexterity', '6');
        helper.setInput('#setIntelligence', 'wrong');
        helper.setInput('#setWisdom', '10');
        helper.setInput('#setCharisma', '4');
  
        expect(fixture.componentInstance.abilitiesRandomizerType).toEqual('Set');
        expect(fixture.componentInstance.setStrength).toEqual(9);
        expect(fixture.componentInstance.setConstitution).toEqual(26);
        expect(fixture.componentInstance.setDexterity).toEqual(6);
        expect(fixture.componentInstance.setIntelligence).toBeNull();
        expect(fixture.componentInstance.setWisdom).toEqual(10);
        expect(fixture.componentInstance.setCharisma).toEqual(4);
        helper.expectInvalid(fixture.componentInstance.validating(), fixture.componentInstance.valid(), '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - set intelligence too low`, async () => {
        const viewModel = fixture.componentInstance.characterModel()!;
        helper.setSelectByIndex('#abilitiesRandomizerType', viewModel.abilitiesRandomizerTypes.indexOf('Set'));
        
        //run validation
        await helper.waitForChangeDetection();
  
        helper.setInput('#setStrength', '9');
        helper.setInput('#setConstitution', '26');
        helper.setInput('#setDexterity', '6');
        helper.setInput('#setIntelligence', '-1');
        helper.setInput('#setWisdom', '10');
        helper.setInput('#setCharisma', '4');
  
        expect(fixture.componentInstance.abilitiesRandomizerType).toEqual('Set');
        expect(fixture.componentInstance.setStrength).toEqual(9);
        expect(fixture.componentInstance.setConstitution).toEqual(26);
        expect(fixture.componentInstance.setDexterity).toEqual(6);
        expect(fixture.componentInstance.setIntelligence).toEqual(-1);
        expect(fixture.componentInstance.setWisdom).toEqual(10);
        expect(fixture.componentInstance.setCharisma).toEqual(4);
        helper.expectInvalid(fixture.componentInstance.validating(), fixture.componentInstance.valid(), '#generateCharacterButton', '#characterValidating');
      });

      it(`should show that character is invalid - missing set wisdom`, async () => {
        const viewModel = fixture.componentInstance.characterModel()!;
        helper.setSelectByIndex('#abilitiesRandomizerType', viewModel.abilitiesRandomizerTypes.indexOf('Set'));
        
        //run validation
        await helper.waitForChangeDetection();
  
        helper.setInput('#setStrength', '9');
        helper.setInput('#setConstitution', '26');
        helper.setInput('#setDexterity', '6');
        helper.setInput('#setIntelligence', '2');
        helper.setInput('#setWisdom', '');
        helper.setInput('#setCharisma', '4');
  
        expect(fixture.componentInstance.abilitiesRandomizerType).toEqual('Set');
        expect(fixture.componentInstance.setStrength).toEqual(9);
        expect(fixture.componentInstance.setConstitution).toEqual(26);
        expect(fixture.componentInstance.setDexterity).toEqual(6);
        expect(fixture.componentInstance.setIntelligence).toEqual(2);
        expect(fixture.componentInstance.setWisdom).toBeNull();
        expect(fixture.componentInstance.setCharisma).toEqual(4);
        helper.expectInvalid(fixture.componentInstance.validating(), fixture.componentInstance.valid(), '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - set wisdom invalid`, async () => {
        const viewModel = fixture.componentInstance.characterModel()!;
        helper.setSelectByIndex('#abilitiesRandomizerType', viewModel.abilitiesRandomizerTypes.indexOf('Set'));
        
        //run validation
        await helper.waitForChangeDetection();
  
        helper.setInput('#setStrength', '9');
        helper.setInput('#setConstitution', '26');
        helper.setInput('#setDexterity', '6');
        helper.setInput('#setIntelligence', '2');
        helper.setInput('#setWisdom', 'wrong');
        helper.setInput('#setCharisma', '4');
  
        expect(fixture.componentInstance.abilitiesRandomizerType).toEqual('Set');
        expect(fixture.componentInstance.setStrength).toEqual(9);
        expect(fixture.componentInstance.setConstitution).toEqual(26);
        expect(fixture.componentInstance.setDexterity).toEqual(6);
        expect(fixture.componentInstance.setIntelligence).toEqual(2);
        expect(fixture.componentInstance.setWisdom).toBeNull();
        expect(fixture.componentInstance.setCharisma).toEqual(4);
        helper.expectInvalid(fixture.componentInstance.validating(), fixture.componentInstance.valid(), '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - set wisdom too low`, async () => {
        const viewModel = fixture.componentInstance.characterModel()!;
        helper.setSelectByIndex('#abilitiesRandomizerType', viewModel.abilitiesRandomizerTypes.indexOf('Set'));
        
        //run validation
        await helper.waitForChangeDetection();
  
        helper.setInput('#setStrength', '9');
        helper.setInput('#setConstitution', '26');
        helper.setInput('#setDexterity', '6');
        helper.setInput('#setIntelligence', '2');
        helper.setInput('#setWisdom', '-1');
        helper.setInput('#setCharisma', '4');
  
        expect(fixture.componentInstance.abilitiesRandomizerType).toEqual('Set');
        expect(fixture.componentInstance.setStrength).toEqual(9);
        expect(fixture.componentInstance.setConstitution).toEqual(26);
        expect(fixture.componentInstance.setDexterity).toEqual(6);
        expect(fixture.componentInstance.setIntelligence).toEqual(2);
        expect(fixture.componentInstance.setWisdom).toEqual(-1);
        expect(fixture.componentInstance.setCharisma).toEqual(4);
        helper.expectInvalid(fixture.componentInstance.validating(), fixture.componentInstance.valid(), '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - missing set charisma`, async () => {
        const viewModel = fixture.componentInstance.characterModel()!;
        helper.setSelectByIndex('#abilitiesRandomizerType', viewModel.abilitiesRandomizerTypes.indexOf('Set'));
        
        //run validation
        await helper.waitForChangeDetection();
  
        helper.setInput('#setStrength', '9');
        helper.setInput('#setConstitution', '26');
        helper.setInput('#setDexterity', '6');
        helper.setInput('#setIntelligence', '2');
        helper.setInput('#setWisdom', '10');
        helper.setInput('#setCharisma', '');
  
        expect(fixture.componentInstance.abilitiesRandomizerType).toEqual('Set');
        expect(fixture.componentInstance.setStrength).toEqual(9);
        expect(fixture.componentInstance.setConstitution).toEqual(26);
        expect(fixture.componentInstance.setDexterity).toEqual(6);
        expect(fixture.componentInstance.setIntelligence).toEqual(2);
        expect(fixture.componentInstance.setWisdom).toEqual(10);
        expect(fixture.componentInstance.setCharisma).toBeNull();

        helper.expectInvalid(fixture.componentInstance.validating(), fixture.componentInstance.valid(), '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - set charisma invalid`, async () => {
        const viewModel = fixture.componentInstance.characterModel()!;
        helper.setSelectByIndex('#abilitiesRandomizerType', viewModel.abilitiesRandomizerTypes.indexOf('Set'));
        
        //run validation
        await helper.waitForChangeDetection();
  
        helper.setInput('#setStrength', '9');
        helper.setInput('#setConstitution', '26');
        helper.setInput('#setDexterity', '6');
        helper.setInput('#setIntelligence', '2');
        helper.setInput('#setWisdom', '10');
        helper.setInput('#setCharisma', 'wrong');
  
        expect(fixture.componentInstance.abilitiesRandomizerType).toEqual('Set');
        expect(fixture.componentInstance.setStrength).toEqual(9);
        expect(fixture.componentInstance.setConstitution).toEqual(26);
        expect(fixture.componentInstance.setDexterity).toEqual(6);
        expect(fixture.componentInstance.setIntelligence).toEqual(2);
        expect(fixture.componentInstance.setWisdom).toEqual(10);
        expect(fixture.componentInstance.setCharisma).toBeNull();
        helper.expectInvalid(fixture.componentInstance.validating(), fixture.componentInstance.valid(), '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - set charisma too low`, async () => {
        const viewModel = fixture.componentInstance.characterModel()!;
        helper.setSelectByIndex('#abilitiesRandomizerType', viewModel.abilitiesRandomizerTypes.indexOf('Set'));
        
        //run validation
        await helper.waitForChangeDetection();
  
        helper.setInput('#setStrength', '9');
        helper.setInput('#setConstitution', '26');
        helper.setInput('#setDexterity', '6');
        helper.setInput('#setIntelligence', '2');
        helper.setInput('#setWisdom', '10');
        helper.setInput('#setCharisma', '-1');
  
        expect(fixture.componentInstance.abilitiesRandomizerType).toEqual('Set');
        expect(fixture.componentInstance.setStrength).toEqual(9);
        expect(fixture.componentInstance.setConstitution).toEqual(26);
        expect(fixture.componentInstance.setDexterity).toEqual(6);
        expect(fixture.componentInstance.setIntelligence).toEqual(2);
        expect(fixture.componentInstance.setWisdom).toEqual(10);
        expect(fixture.componentInstance.setCharisma).toEqual(-1);

        helper.expectInvalid(fixture.componentInstance.validating(), fixture.componentInstance.valid(), '#generateCharacterButton', '#characterValidating');
      });

      it(`should validate when allow ability adjustments changes`, async () => {
        helper.clickCheckbox('#abilitiesAdjustCheckbox');
  
        expect(fixture.componentInstance.allowAbilitiesAdjustments).toBe(false);

        helper.expectValidating(fixture.componentInstance.validating(), '#generateCharacterButton', '#characterValidating');
      });

      it(`should show that character is invalid - validation fails`, async () => {
        const viewModel = fixture.componentInstance.characterModel()!;
        helper.setSelectByIndex('#alignmentRandomizerType', viewModel.alignmentRandomizerTypes.indexOf('Good'));
        
        //run validation
        await helper.waitForChangeDetection();

        helper.setSelectByIndex('#metaraceRandomizerType', viewModel.metaraceRandomizerTypes.indexOf('Set'));
        
        //run validation
        await helper.waitForChangeDetection();

        helper.setSelectByIndex('#setMetarace', viewModel.metaraces.indexOf('Lich'));
  
        expect(fixture.componentInstance.alignmentRandomizerType).toEqual('Good');
        expect(fixture.componentInstance.metaraceRandomizerType).toEqual('Set');
        expect(fixture.componentInstance.setMetarace).toEqual('Lich');

        helper.expectValidating(fixture.componentInstance.validating(), '#generateCharacterButton', '#characterValidating');
  
        //run validation
        await helper.waitForChangeDetection();
        
        expect(fixture.componentInstance.valid()).toBe(false);
        helper.expectInvalid(fixture.componentInstance.validating(), fixture.componentInstance.valid(), '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is valid - validation succeeds`, async () => {
        const viewModel = fixture.componentInstance.characterModel()!;
        helper.setSelectByIndex('#alignmentRandomizerType', viewModel.alignmentRandomizerTypes.indexOf('Evil'));
        helper.setSelectByIndex('#metaraceRandomizerType', viewModel.metaraceRandomizerTypes.indexOf('Set'));
        helper.setSelectByIndex('#setMetarace', viewModel.metaraces.indexOf('Lich'));
  
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

        expect(fixture.componentInstance.forceMetarace).toBe(true);

        helper.clickCheckbox('#forceMetaraceCheckbox');

        expect(fixture.componentInstance.forceMetarace).toBe(false);
      });
    
      it(`should bind allowing ability adjustments`, async () => {
        expect(fixture.componentInstance.allowAbilitiesAdjustments).toBe(true);

        helper.clickCheckbox('#abilitiesAdjustCheckbox');

        expect(fixture.componentInstance.allowAbilitiesAdjustments).toBe(false);

        helper.clickCheckbox('#abilitiesAdjustCheckbox');

        expect(fixture.componentInstance.allowAbilitiesAdjustments).toBe(true);
      });
    
      it(`should show when generating a character`, async () => {
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
    
      it(`should generate the default character`, async () => {
        helper.clickButton('#generateCharacterButton');
        
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

        expect(fixture.componentInstance.alignmentRandomizerType).toEqual('Non-evil');
        expect(fixture.componentInstance.classNameRandomizerType).toEqual('Physical Combat');
        expect(fixture.componentInstance.levelRandomizerType).toEqual('Low');
        expect(fixture.componentInstance.baseRaceRandomizerType).toEqual('Non-Monster Base');
        expect(fixture.componentInstance.metaraceRandomizerType).toEqual('Lycanthrope Meta');
        expect(fixture.componentInstance.abilitiesRandomizerType).toEqual('Ones as sixes');

        //run validation
        await helper.waitForChangeDetection();

        helper.clickButton('#generateCharacterButton');
        
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
        await helper.waitForChangeDetection();

        helper.setSelectByIndex('#setAlignment', viewModel.alignments.indexOf('Neutral Good'));
        helper.setSelectByIndex('#classNameRandomizerType', viewModel.classNameRandomizerTypes.indexOf('Set'));
        await helper.waitForChangeDetection();

        helper.setSelectByIndex('#setClassName', viewModel.classNames.indexOf('Fighter'));
        helper.setSelectByIndex('#levelRandomizerType', viewModel.levelRandomizerTypes.indexOf('Set'));
        await helper.waitForChangeDetection();

        helper.setInput('#setLevel', '4');
        helper.setSelectByIndex('#baseRaceRandomizerType', viewModel.baseRaceRandomizerTypes.indexOf('Set'));
        await helper.waitForChangeDetection();

        helper.setSelectByIndex('#setBaseRace', viewModel.baseRaces.indexOf('Mountain Dwarf'));
        helper.setSelectByIndex('#metaraceRandomizerType', viewModel.metaraceRandomizerTypes.indexOf('Set'));
        await helper.waitForChangeDetection();

        helper.setSelectByIndex('#setMetarace', viewModel.metaraces.indexOf('Half-Dragon'));
        helper.setSelectByIndex('#abilitiesRandomizerType', viewModel.abilitiesRandomizerTypes.indexOf('Set'));
        await helper.waitForChangeDetection();

        helper.setInput('#setStrength', '9');
        helper.setInput('#setConstitution', '21');
        helper.setInput('#setDexterity', '2');
        helper.setInput('#setIntelligence', '6');
        helper.setInput('#setWisdom', '13');
        helper.setInput('#setCharisma', '3');

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
