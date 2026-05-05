import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { CharacterGenComponent } from './charactergen.component';
import { Character } from '../models/character.model';
import { Leadership } from '../models/leadership.model';
import { FollowerQuantities } from '../models/follower-quantities.model';
import { getViewModel, getFakeDelay, getFakeError, delay } from './charactergen.component.test-helper';


describe('CharacterGen Component', () => {
  describe('unit', () => {
    let component: CharacterGenComponent;
    let characterServiceSpy: any;
    let leadershipServiceSpy: any;
    let leaderPipeSpy: any;
    let sweetAlertServiceSpy: any;
    let loggerServiceSpy: any;
    let fileSaverServiceSpy: any;

    beforeEach(() => {
      vi.useFakeTimers();

      characterServiceSpy = {
        getViewModel: vi.fn(),
        generate: vi.fn(),
        validate: vi.fn()
      };
      leadershipServiceSpy = {
        generate: vi.fn(),
        generateCohort: vi.fn(),
        generateFollower: vi.fn()
      };
      leaderPipeSpy = { transform: vi.fn() };
      sweetAlertServiceSpy = { showError: vi.fn() };
      loggerServiceSpy = { logError: vi.fn() };
      fileSaverServiceSpy = { save: vi.fn() };

      component = new CharacterGenComponent(
        characterServiceSpy,
        leadershipServiceSpy,
        leaderPipeSpy,
        fileSaverServiceSpy,
        sweetAlertServiceSpy,
        loggerServiceSpy
      );
    });

    afterEach(() => {
      vi.useRealTimers();
    });
  
    it(`should initialize the public properties`, () => {
      expect(component.generating()).toBe(false);
      expect(component.validating()).toBe(false);
      expect(component.valid()).toBe(false);
      expect(component.character()).toBeFalsy();
      expect(component.leadership()).toBeFalsy();
      expect(component.cohort()).toBeFalsy();
      expect(component.followers()).toEqual([]);
      expect(component.generatingMessage()).toEqual('');
    });
  
    it(`should initialize the input values`, () => {
      expectInitialInputValues();
    });

    function expectInitialInputValues() {
      expect(component.alignmentRandomizerType).toEqual('');
      expect(component.setAlignment).toEqual('');
      expect(component.classNameRandomizerType).toEqual('');
      expect(component.setClassName).toEqual('');
      expect(component.levelRandomizerType).toEqual('');
      expect(component.setLevel).toEqual(1);
      expect(component.baseRaceRandomizerType).toEqual('');
      expect(component.setBaseRace).toEqual('');
      expect(component.metaraceRandomizerType).toEqual('');
      expect(component.forceMetarace).toEqual(false);
      expect(component.setMetarace).toEqual('');
      expect(component.abilitiesRandomizerType).toEqual('');
      expect(component.setStrength).toEqual(10);
      expect(component.setConstitution).toEqual(10);
      expect(component.setDexterity).toEqual(10);
      expect(component.setIntelligence).toEqual(10);
      expect(component.setWisdom).toEqual(10);
      expect(component.setCharisma).toEqual(10);
      expect(component.allowAbilitiesAdjustments).toEqual(true);
    }

    function expectDefaultInputValues() {
      expect(component.alignmentRandomizerType).toEqual('alignment randomizer 1');
      expect(component.setAlignment).toEqual('alignment 1');
      expect(component.classNameRandomizerType).toEqual('class name randomizer 1');
      expect(component.setClassName).toEqual('class name 1');
      expect(component.levelRandomizerType).toEqual('level randomizer 1');
      expect(component.setLevel).toEqual(1);
      expect(component.baseRaceRandomizerType).toEqual('base race randomizer 1');
      expect(component.setBaseRace).toEqual('base race 1');
      expect(component.metaraceRandomizerType).toEqual('metarace randomizer 1');
      expect(component.forceMetarace).toEqual(false);
      expect(component.setMetarace).toEqual('metarace 1');
      expect(component.abilitiesRandomizerType).toEqual('abilities randomizer 1');
      expect(component.setStrength).toEqual(10);
      expect(component.setConstitution).toEqual(10);
      expect(component.setDexterity).toEqual(10);
      expect(component.setIntelligence).toEqual(10);
      expect(component.setWisdom).toEqual(10);
      expect(component.setCharisma).toEqual(10);
      expect(component.allowAbilitiesAdjustments).toEqual(true);
    }

    it('should be validating while fetching the character model', async () => {
      const model = getViewModel();
      characterServiceSpy.getViewModel.mockImplementation(() => getFakeDelay(model));
      characterServiceSpy.validate.mockImplementation(() => getFakeDelay(true));

      component.ngOnInit();

      expect(component.characterModel()).not.toBeDefined();
      
      expectInitialInputValues();

      expect(component.valid()).toBe(false);
      expect(component.validating()).toBe(true);
      
      await vi.advanceTimersByTimeAsync(delay - 1);

      expect(component.characterModel()).not.toBeDefined();

      expectInitialInputValues();

      expect(component.valid()).toBe(false);
      expect(component.validating()).toBe(true);
      
      await vi.advanceTimersByTimeAsync(1);
      
      expect(component.characterModel()).toEqual(model);
      
      expectDefaultInputValues();
      
      expect(component.valid()).toBe(false);
      expect(component.validating()).toBe(true);

      await vi.advanceTimersByTimeAsync(delay - 1);

      expect(component.characterModel()).toEqual(model);
      
      expectDefaultInputValues();
      
      expect(component.valid()).toBe(false);
      expect(component.validating()).toBe(true);

      await vi.runAllTimersAsync();
    });

    let initValidations = [true, false];

    initValidations.forEach(test => {
      it(`should set the character model on init - validity: ${test}`, async () => {
        const model = getViewModel();
        characterServiceSpy.getViewModel.mockImplementation(() => getFakeDelay(model));
        characterServiceSpy.validate.mockImplementation(() => getFakeDelay(test));
  
        component.ngOnInit();
  
        expect(component.characterModel()).not.toBeDefined();
        expect(component.validating()).toBe(true);
  
        await vi.advanceTimersByTimeAsync(delay * 2);
  
        expect(component.characterModel()).toEqual(model);
        expect(component.validating()).toBe(false);
  
        expectDefaultInputValues();
      
        expect(characterServiceSpy.validate).toHaveBeenCalledWith(
          'alignment randomizer 1',
          'alignment 1',
          'class name randomizer 1',
          'class name 1',
          'level randomizer 1',
          1,
          'base race randomizer 1',
          'base race 1',
          'metarace randomizer 1',
          false,
          'metarace 1'
        );

        expect(component.valid()).toEqual(test);
        
        expect(loggerServiceSpy.logError).not.toHaveBeenCalled();
        expect(sweetAlertServiceSpy.showError).not.toHaveBeenCalled();
      });
    });

    it('should display error from getting character model', async () => {
      characterServiceSpy.getViewModel.mockImplementation(() => getFakeError('I failed'));
      characterServiceSpy.validate.mockImplementation(() => getFakeDelay(true));

      component.ngOnInit();
      await vi.advanceTimersByTimeAsync(delay * 2);

      expect(component.characterModel()).not.toBeDefined();
      expect(component.character()).toBeNull();
      expect(component.leadership()).toBeNull();
      expect(component.cohort()).toBeNull();
      expect(component.followers()).toEqual([]);
      expect(component.generating()).toBe(false);
      expect(component.validating()).toBe(false);
      
      expect(loggerServiceSpy.logError).toHaveBeenCalledWith('I failed');
      expect(sweetAlertServiceSpy.showError).toHaveBeenCalledTimes(1);
    });

    it('should display error from validating on init', async () => {
      const model = getViewModel();
      characterServiceSpy.getViewModel.mockImplementation(() => getFakeDelay(model));
      characterServiceSpy.validate.mockImplementation(() => getFakeError('I failed'));

      component.ngOnInit();
      await vi.advanceTimersByTimeAsync(delay * 2);

      expect(component.characterModel()).toEqual(model);
      expect(component.character()).toBeNull();
      expect(component.leadership()).toBeNull();
      expect(component.cohort()).toBeNull();
      expect(component.followers()).toEqual([]);
      expect(component.generating()).toBe(false);
      expect(component.validating()).toBe(false);
      
      expect(loggerServiceSpy.logError).toHaveBeenCalledWith('I failed');
      expect(sweetAlertServiceSpy.showError).toHaveBeenCalledTimes(1);
    });

    it('should validate randomizers - invalid if set level randomizer, but no set level', () => {
      setupOnInit();

      component.levelRandomizerType = 'Set';
      component.setLevel = 0;

      component.validateRandomizers();
      expect(component.validating()).toBe(false);
      expect(component.valid()).toBe(false);
    });

    it('should validate randomizers - invalid if set abilities randomizer, but no set strength', () => {
      setupOnInit();

      component.abilitiesRandomizerType = 'Set';
      component.setStrength = 0;
      component.setConstitution = 2;
      component.setDexterity = 3;
      component.setIntelligence = 4;
      component.setWisdom = 5;
      component.setCharisma = 6;

      component.validateRandomizers();
      expect(component.validating()).toBe(false);
      expect(component.valid()).toBe(false);
    });

    it('should validate randomizers - invalid if set abilities randomizer, but no set constitution', () => {
      setupOnInit();

      component.abilitiesRandomizerType = 'Set';
      component.setStrength = 1;
      component.setConstitution = 0;
      component.setDexterity = 3;
      component.setIntelligence = 4;
      component.setWisdom = 5;
      component.setCharisma = 6;

      component.validateRandomizers();
      expect(component.validating()).toBe(false);
      expect(component.valid()).toBe(false);
    });

    it('should validate randomizers - invalid if set abilities randomizer, but no set dexterity', () => {
      setupOnInit();

      component.abilitiesRandomizerType = 'Set';
      component.setStrength = 1;
      component.setConstitution = 2;
      component.setDexterity = 0;
      component.setIntelligence = 4;
      component.setWisdom = 5;
      component.setCharisma = 6;

      component.validateRandomizers();
      expect(component.validating()).toBe(false);
      expect(component.valid()).toBe(false);
    });

    it('should validate randomizers - invalid if set abilities randomizer, but no set intelligence', () => {
      setupOnInit();

      component.abilitiesRandomizerType = 'Set';
      component.setStrength = 1;
      component.setConstitution = 2;
      component.setDexterity = 3;
      component.setIntelligence = 0;
      component.setWisdom = 5;
      component.setCharisma = 6;

      component.validateRandomizers();
      expect(component.validating()).toBe(false);
      expect(component.valid()).toBe(false);
    });

    it('should validate randomizers - invalid if set abilities randomizer, but no set wisdom', () => {
      setupOnInit();

      component.abilitiesRandomizerType = 'Set';
      component.setStrength = 1;
      component.setConstitution = 2;
      component.setDexterity = 3;
      component.setIntelligence = 4;
      component.setWisdom = 0;
      component.setCharisma = 6;

      component.validateRandomizers();
      expect(component.validating()).toBe(false);
      expect(component.valid()).toBe(false);
    });

    it('should validate randomizers - invalid if set abilities randomizer, but no set charisma', () => {
      setupOnInit();

      component.abilitiesRandomizerType = 'Set';
      component.setStrength = 1;
      component.setConstitution = 2;
      component.setDexterity = 3;
      component.setIntelligence = 4;
      component.setWisdom = 5;
      component.setCharisma = 0;

      component.validateRandomizers();
      expect(component.validating()).toBe(false);
      expect(component.valid()).toBe(false);
    });

    const randomizerBooleans = [
      { a: true, m: true },
      { a: true, m: false },
      { a: false, m: true },
      { a: false, m: false },
    ];

    randomizerBooleans.forEach(test => {
      it(`should be validating while validating the randomizers - metarace ${test.m}, abilities ${test.a}`, async () => {
        setupOnInit();

        characterServiceSpy.validate.mockImplementation(() => getFakeDelay(true));
  
        component.alignmentRandomizerType = 'my alignment randomizer';
        component.setAlignment = 'my alignment';
        component.classNameRandomizerType = 'my class name randomizer';
        component.setClassName = 'my class name';
        component.levelRandomizerType = 'my level randomizer';
        component.setLevel = 9266;
        component.baseRaceRandomizerType = 'my base race randomizer';
        component.setBaseRace = 'my base race';
        component.metaraceRandomizerType = 'my metarace randomizer';
        component.setMetarace = 'my metarace';
        component.forceMetarace = test.m;
  
        component.validateRandomizers();
  
        expect(characterServiceSpy.validate).toHaveBeenCalledWith(
          'my alignment randomizer',
          'my alignment',
          'my class name randomizer',
          'my class name',
          'my level randomizer',
          9266,
          'my base race randomizer',
          'my base race',
          'my metarace randomizer',
          test.m,
          'my metarace');
        expect(component.validating()).toBe(true);
        
        await vi.advanceTimersByTimeAsync(delay - 1);
  
        expect(component.validating()).toBe(true);
  
        await vi.runAllTimersAsync();
      });
  
      it(`should validate valid randomizers - metarace ${test.m}, abilities ${test.a}`, async () => {
        setupOnInit();

        characterServiceSpy.validate.mockImplementation(() => getFakeDelay(true));
  
        component.alignmentRandomizerType = 'my alignment randomizer';
        component.setAlignment = 'my alignment';
        component.classNameRandomizerType = 'my class name randomizer';
        component.setClassName = 'my class name';
        component.levelRandomizerType = 'my level randomizer';
        component.setLevel = 9266;
        component.baseRaceRandomizerType = 'my base race randomizer';
        component.setBaseRace = 'my base race';
        component.metaraceRandomizerType = 'my metarace randomizer';
        component.setMetarace = 'my metarace';
        component.forceMetarace = test.m;
  
        component.validateRandomizers();
  
        expect(characterServiceSpy.validate).toHaveBeenCalledWith(
          'my alignment randomizer',
          'my alignment',
          'my class name randomizer',
          'my class name',
          'my level randomizer',
          9266,
          'my base race randomizer',
          'my base race',
          'my metarace randomizer',
          test.m,
          'my metarace');
        expect(component.validating()).toBe(true);
  
        await vi.advanceTimersByTimeAsync(delay);
  
        expect(component.valid()).toBe(true);
        expect(component.validating()).toBe(false);
        
        expect(loggerServiceSpy.logError).not.toHaveBeenCalled();
        expect(sweetAlertServiceSpy.showError).not.toHaveBeenCalled();
      });
  
      it(`should validate invalid randomizers - metarace ${test.m}, abilities ${test.a}`, async () => {
        setupOnInit();

        characterServiceSpy.validate.mockImplementation(() => getFakeDelay(false));
  
        component.alignmentRandomizerType = 'my alignment randomizer';
        component.setAlignment = 'my alignment';
        component.classNameRandomizerType = 'my class name randomizer';
        component.setClassName = 'my class name';
        component.levelRandomizerType = 'my level randomizer';
        component.setLevel = 9266;
        component.baseRaceRandomizerType = 'my base race randomizer';
        component.setBaseRace = 'my base race';
        component.metaraceRandomizerType = 'my metarace randomizer';
        component.setMetarace = 'my metarace';
        component.forceMetarace = test.m;

        component.validateRandomizers();
  
        expect(characterServiceSpy.validate).toHaveBeenCalledWith(
          'my alignment randomizer',
          'my alignment',
          'my class name randomizer',
          'my class name',
          'my level randomizer',
          9266,
          'my base race randomizer',
          'my base race',
          'my metarace randomizer',
          test.m,
          'my metarace');
        expect(component.validating()).toBe(true);
  
        await vi.advanceTimersByTimeAsync(delay);
  
        expect(component.valid()).toBe(false);
        expect(component.validating()).toBe(false);
        
        expect(loggerServiceSpy.logError).not.toHaveBeenCalled();
        expect(sweetAlertServiceSpy.showError).not.toHaveBeenCalled();
      });
  
      it(`should display error from validating randomizers - metarace ${test.m}, abilities ${test.a}`, async () => {
        setupOnInit();

        characterServiceSpy.validate.mockImplementation(() => getFakeError('I failed'));
  
        component.alignmentRandomizerType = 'my alignment randomizer';
        component.setAlignment = 'my alignment';
        component.classNameRandomizerType = 'my class name randomizer';
        component.setClassName = 'my class name';
        component.levelRandomizerType = 'my level randomizer';
        component.setLevel = 9266;
        component.baseRaceRandomizerType = 'my base race randomizer';
        component.setBaseRace = 'my base race';
        component.metaraceRandomizerType = 'my metarace randomizer';
        component.setMetarace = 'my metarace';
        component.forceMetarace = test.m;

        component.validateRandomizers();

        await vi.advanceTimersByTimeAsync(delay);
  
        expect(component.valid()).toBe(false);
        expect(component.character()).toBeNull();
        expect(component.leadership()).toBeNull();
        expect(component.cohort()).toBeNull();
        expect(component.followers()).toEqual([]);
        expect(component.generating()).toBe(false);
        expect(component.validating()).toBe(false);
        
        expect(characterServiceSpy.validate).toHaveBeenCalledWith(
          'my alignment randomizer',
          'my alignment',
          'my class name randomizer',
          'my class name',
          'my level randomizer',
          9266,
          'my base race randomizer',
          'my base race',
          'my metarace randomizer',
          test.m,
          'my metarace');
        expect(loggerServiceSpy.logError).toHaveBeenCalledWith('I failed');
        expect(sweetAlertServiceSpy.showError).toHaveBeenCalledTimes(1);
      });
      
      it(`should be generating while generating character - metarace ${test.m}, abilities ${test.a}`, async () => {
        setupOnInit();

        const character = new Character('my character summary');
        characterServiceSpy.generate.mockImplementation(() => getFakeDelay(character));

        component.alignmentRandomizerType = 'my alignment randomizer';
        component.setAlignment = 'my alignment';
        component.classNameRandomizerType = 'my class name randomizer';
        component.setClassName = 'my class name';
        component.levelRandomizerType = 'my level randomizer';
        component.setLevel = 9266;
        component.baseRaceRandomizerType = 'my base race randomizer';
        component.setBaseRace = 'my base race';
        component.metaraceRandomizerType = 'my metarace randomizer';
        component.setMetarace = 'my metarace';
        component.forceMetarace = test.m;
        component.abilitiesRandomizerType = 'my abilities randomizer';
        component.allowAbilitiesAdjustments = test.a;
        component.setStrength = 90210;
        component.setConstitution = 42;
        component.setDexterity = 600;
        component.setIntelligence = 1337;
        component.setWisdom = 1336;
        component.setCharisma = 96;

        component.generateCharacter();

        expect(characterServiceSpy.generate).toHaveBeenCalledWith(
          'my alignment randomizer',
          'my alignment',
          'my class name randomizer',
          'my class name',
          'my level randomizer',
          9266,
          'my base race randomizer',
          'my base race',
          'my metarace randomizer',
          test.m,
          'my metarace',
          'my abilities randomizer',
          90210,
          42,
          600,
          1337,
          1336,
          96,
          test.a
        );
        expect(leadershipServiceSpy.generate).not.toHaveBeenCalled();
        expect(leadershipServiceSpy.generateCohort).not.toHaveBeenCalled();
        expect(leadershipServiceSpy.generateFollower).not.toHaveBeenCalled();

        expect(component.generating()).toBe(true);
        expect(component.generatingMessage()).toEqual('Generating character...');
        expect(component.character()).toBeNull();
        expect(component.leadership()).toBeNull();
        expect(component.cohort()).toBeNull();
        expect(component.followers()).toEqual([]);
        
        await vi.advanceTimersByTimeAsync(delay - 1);

        expect(component.generating()).toBe(true);
        expect(component.generatingMessage()).toEqual('Generating character...');
        expect(component.character()).toBeNull();
        expect(component.leadership()).toBeNull();
        expect(component.cohort()).toBeNull();
        expect(component.followers()).toEqual([]);

        await vi.runAllTimersAsync();
      });
      
      it(`should be generating while generating character - leader without cohort or followers - metarace ${test.m}, abilities ${test.a}`, async () => {
        setupOnInit();

        const character = new Character('my character summary');
        character.isLeader = true;
        character.class.level = 7;
        character.abilities.Charisma.bonus = 8;
        character.magic.animal = 'my animal';
        character.alignment.full = 'my leader alignment';
        character.class.name = 'my leader class';
        characterServiceSpy.generate.mockImplementation(() => getFakeDelay(character));
        
        const leadership = new Leadership(2, [], 1);
        leadershipServiceSpy.generate.mockImplementation(() => getFakeDelay(leadership));
        leadershipServiceSpy.generateCohort.mockImplementation(() => getFakeDelay(null));

        component.alignmentRandomizerType = 'my alignment randomizer';
        component.setAlignment = 'my alignment';
        component.classNameRandomizerType = 'my class name randomizer';
        component.setClassName = 'my class name';
        component.levelRandomizerType = 'my level randomizer';
        component.setLevel = 9266;
        component.baseRaceRandomizerType = 'my base race randomizer';
        component.setBaseRace = 'my base race';
        component.metaraceRandomizerType = 'my metarace randomizer';
        component.setMetarace = 'my metarace';
        component.forceMetarace = test.m;
        component.abilitiesRandomizerType = 'my abilities randomizer';
        component.allowAbilitiesAdjustments = test.a;
        component.setStrength = 90210;
        component.setConstitution = 42;
        component.setDexterity = 600;
        component.setIntelligence = 1337;
        component.setWisdom = 1336;
        component.setCharisma = 96;

        component.generateCharacter();

        expect(characterServiceSpy.generate).toHaveBeenCalledWith(
          'my alignment randomizer',
          'my alignment',
          'my class name randomizer',
          'my class name',
          'my level randomizer',
          9266,
          'my base race randomizer',
          'my base race',
          'my metarace randomizer',
          test.m,
          'my metarace',
          'my abilities randomizer',
          90210,
          42,
          600,
          1337,
          1336,
          96,
          test.a
        );
        expect(leadershipServiceSpy.generate).not.toHaveBeenCalled();
        expect(leadershipServiceSpy.generateCohort).not.toHaveBeenCalled();
        expect(leadershipServiceSpy.generateFollower).not.toHaveBeenCalled();

        expect(component.generating()).toBe(true);
        expect(component.generatingMessage()).toEqual('Generating character...');
        expect(component.character()).toBeNull();
        expect(component.leadership()).toBeNull();
        expect(component.cohort()).toBeNull();
        expect(component.followers()).toEqual([]);
        
        await vi.advanceTimersByTimeAsync(delay - 1);

        expect(component.generating()).toBe(true);
        expect(component.generatingMessage()).toEqual('Generating character...');
        expect(component.character()).toBeNull();
        expect(component.leadership()).toBeNull();
        expect(component.cohort()).toBeNull();
        expect(component.followers()).toEqual([]);

        await vi.advanceTimersByTimeAsync(1);

        expect(component.character()).toBe(character);
        expect(component.leaderAlignment).toEqual('my leader alignment');
        expect(component.leaderAnimal).toEqual('my animal');
        expect(component.leaderCharismaBonus).toEqual(8);
        expect(component.leaderClassName).toEqual('my leader class');
        expect(component.leaderLevel).toEqual(7);

        await expectLeadershipGenerating(leadership, null, []);

        await vi.runAllTimersAsync();
      });
      
      it(`should be generating while generating character - leader with cohort but without followers - metarace ${test.m}, abilities ${test.a}`, async () => {
        setupOnInit();

        const character = new Character('my character summary');
        character.isLeader = true;
        character.class.level = 7;
        character.abilities.Charisma.bonus = 8;
        character.magic.animal = 'my animal';
        character.alignment.full = 'my leader alignment';
        character.class.name = 'my leader class';
        characterServiceSpy.generate.mockImplementation(() => getFakeDelay(character));
        
        const leadership = new Leadership(3, [], 8);
        leadershipServiceSpy.generate.mockImplementation(() => getFakeDelay(leadership));

        const cohort = new Character('my cohort summary');
        leadershipServiceSpy.generateCohort.mockImplementation(() => getFakeDelay(cohort));

        component.alignmentRandomizerType = 'my alignment randomizer';
        component.setAlignment = 'my alignment';
        component.classNameRandomizerType = 'my class name randomizer';
        component.setClassName = 'my class name';
        component.levelRandomizerType = 'my level randomizer';
        component.setLevel = 9266;
        component.baseRaceRandomizerType = 'my base race randomizer';
        component.setBaseRace = 'my base race';
        component.metaraceRandomizerType = 'my metarace randomizer';
        component.setMetarace = 'my metarace';
        component.forceMetarace = test.m;
        component.abilitiesRandomizerType = 'my abilities randomizer';
        component.allowAbilitiesAdjustments = test.a;
        component.setStrength = 90210;
        component.setConstitution = 42;
        component.setDexterity = 600;
        component.setIntelligence = 1337;
        component.setWisdom = 1336;
        component.setCharisma = 96;

        component.generateCharacter();

        expect(characterServiceSpy.generate).toHaveBeenCalledWith(
          'my alignment randomizer',
          'my alignment',
          'my class name randomizer',
          'my class name',
          'my level randomizer',
          9266,
          'my base race randomizer',
          'my base race',
          'my metarace randomizer',
          test.m,
          'my metarace',
          'my abilities randomizer',
          90210,
          42,
          600,
          1337,
          1336,
          96,
          test.a
        );
        expect(leadershipServiceSpy.generate).not.toHaveBeenCalled();
        expect(leadershipServiceSpy.generateCohort).not.toHaveBeenCalled();
        expect(leadershipServiceSpy.generateFollower).not.toHaveBeenCalled();

        expect(component.generating()).toBe(true);
        expect(component.generatingMessage()).toEqual('Generating character...');
        expect(component.character()).toBeNull();
        expect(component.leadership()).toBeNull();
        expect(component.cohort()).toBeNull();
        expect(component.followers()).toEqual([]);
        
        await vi.advanceTimersByTimeAsync(delay - 1);

        expect(component.generating()).toBe(true);
        expect(component.generatingMessage()).toEqual('Generating character...');
        expect(component.character()).toBeNull();
        expect(component.leadership()).toBeNull();
        expect(component.cohort()).toBeNull();
        expect(component.followers()).toEqual([]);

        await vi.advanceTimersByTimeAsync(1);

        expect(component.character()).toBe(character);
        expect(component.leaderAlignment).toEqual('my leader alignment');
        expect(component.leaderAnimal).toEqual('my animal');
        expect(component.leaderCharismaBonus).toEqual(8);
        expect(component.leaderClassName).toEqual('my leader class');
        expect(component.leaderLevel).toEqual(7);

        await expectLeadershipGenerating(leadership, cohort, []);

        await vi.runAllTimersAsync();
      });
      
      it(`should be generating while generating character - leader with cohort and followers <= lvl 1 - metarace ${test.m}, abilities ${test.a}`, async () => {
        setupOnInit();

        const character = new Character('my character summary');
        character.isLeader = true;
        character.class.level = 7;
        character.abilities.Charisma.bonus = 8;
        character.magic.animal = 'my animal';
        character.alignment.full = 'my leader alignment';
        character.class.name = 'my leader class';
        characterServiceSpy.generate.mockImplementation(() => getFakeDelay(character));
        
        const followerQuantities = new FollowerQuantities(2);
        const leadership = new Leadership(3, [], 8, followerQuantities);
        leadershipServiceSpy.generate.mockImplementation(() => getFakeDelay(leadership));

        const cohort = new Character('my cohort summary');
        leadershipServiceSpy.generateCohort.mockImplementation(() => getFakeDelay(cohort));

        let followerIndex = 0;
        const followers = [
          new Character('my follower summary 1.1'),
          new Character('my follower summary 1.2'),
        ];
        leadershipServiceSpy.generateFollower.mockImplementation(() => getFakeDelay(followers[followerIndex++]));

        component.alignmentRandomizerType = 'my alignment randomizer';
        component.setAlignment = 'my alignment';
        component.classNameRandomizerType = 'my class name randomizer';
        component.setClassName = 'my class name';
        component.levelRandomizerType = 'my level randomizer';
        component.setLevel = 9266;
        component.baseRaceRandomizerType = 'my base race randomizer';
        component.setBaseRace = 'my base race';
        component.metaraceRandomizerType = 'my metarace randomizer';
        component.setMetarace = 'my metarace';
        component.forceMetarace = test.m;
        component.abilitiesRandomizerType = 'my abilities randomizer';
        component.allowAbilitiesAdjustments = test.a;
        component.setStrength = 90210;
        component.setConstitution = 42;
        component.setDexterity = 600;
        component.setIntelligence = 1337;
        component.setWisdom = 1336;
        component.setCharisma = 96;

        component.generateCharacter();

        expect(characterServiceSpy.generate).toHaveBeenCalledWith(
          'my alignment randomizer',
          'my alignment',
          'my class name randomizer',
          'my class name',
          'my level randomizer',
          9266,
          'my base race randomizer',
          'my base race',
          'my metarace randomizer',
          test.m,
          'my metarace',
          'my abilities randomizer',
          90210,
          42,
          600,
          1337,
          1336,
          96,
          test.a
        );
        expect(leadershipServiceSpy.generate).not.toHaveBeenCalled();
        expect(leadershipServiceSpy.generateCohort).not.toHaveBeenCalled();
        expect(leadershipServiceSpy.generateFollower).not.toHaveBeenCalled();

        expect(component.generating()).toBe(true);
        expect(component.generatingMessage()).toEqual('Generating character...');
        expect(component.character()).toBeNull();
        expect(component.leadership()).toBeNull();
        expect(component.cohort()).toBeNull();
        expect(component.followers()).toEqual([]);
        
        await vi.advanceTimersByTimeAsync(delay - 1);

        expect(component.generating()).toBe(true);
        expect(component.generatingMessage()).toEqual('Generating character...');
        expect(component.character()).toBeNull();
        expect(component.leadership()).toBeNull();
        expect(component.cohort()).toBeNull();
        expect(component.followers()).toEqual([]);

        await vi.advanceTimersByTimeAsync(1);

        expect(component.character()).toBe(character);
        expect(component.leaderAlignment).toEqual('my leader alignment');
        expect(component.leaderAnimal).toEqual('my animal');
        expect(component.leaderCharismaBonus).toEqual(8);
        expect(component.leaderClassName).toEqual('my leader class');
        expect(component.leaderLevel).toEqual(7);

        await expectLeadershipGenerating(leadership, cohort, followers);
        expectFollowerCalls(followerQuantities);

        await vi.runAllTimersAsync();
      });
      
      it(`should be generating while generating character - leader with cohort and followers <= lvl 2 - metarace ${test.m}, abilities ${test.a}`, async () => {
        setupOnInit();

        const character = new Character('my character summary');
        character.isLeader = true;
        character.class.level = 7;
        character.abilities.Charisma.bonus = 8;
        character.magic.animal = 'my animal';
        character.alignment.full = 'my leader alignment';
        character.class.name = 'my leader class';
        characterServiceSpy.generate.mockImplementation(() => getFakeDelay(character));
        
        const followerQuantities = new FollowerQuantities(3, 2);
        const leadership = new Leadership(3, [], 8, followerQuantities);
        leadershipServiceSpy.generate.mockImplementation(() => getFakeDelay(leadership));

        const cohort = new Character('my cohort summary');
        leadershipServiceSpy.generateCohort.mockImplementation(() => getFakeDelay(cohort));

        let followerIndex = 0;
        const followers = [
          new Character('my follower summary 1.1'),
          new Character('my follower summary 1.2'),
          new Character('my follower summary 1.3'),
          new Character('my follower summary 2.1'),
          new Character('my follower summary 2.2'),
        ];
        leadershipServiceSpy.generateFollower.mockImplementation(() => getFakeDelay(followers[followerIndex++]));

        component.alignmentRandomizerType = 'my alignment randomizer';
        component.setAlignment = 'my alignment';
        component.classNameRandomizerType = 'my class name randomizer';
        component.setClassName = 'my class name';
        component.levelRandomizerType = 'my level randomizer';
        component.setLevel = 9266;
        component.baseRaceRandomizerType = 'my base race randomizer';
        component.setBaseRace = 'my base race';
        component.metaraceRandomizerType = 'my metarace randomizer';
        component.setMetarace = 'my metarace';
        component.forceMetarace = test.m;
        component.abilitiesRandomizerType = 'my abilities randomizer';
        component.allowAbilitiesAdjustments = test.a;
        component.setStrength = 90210;
        component.setConstitution = 42;
        component.setDexterity = 600;
        component.setIntelligence = 1337;
        component.setWisdom = 1336;
        component.setCharisma = 96;

        component.generateCharacter();

        expect(characterServiceSpy.generate).toHaveBeenCalledWith(
          'my alignment randomizer',
          'my alignment',
          'my class name randomizer',
          'my class name',
          'my level randomizer',
          9266,
          'my base race randomizer',
          'my base race',
          'my metarace randomizer',
          test.m,
          'my metarace',
          'my abilities randomizer',
          90210,
          42,
          600,
          1337,
          1336,
          96,
          test.a
        );
        expect(leadershipServiceSpy.generate).not.toHaveBeenCalled();
        expect(leadershipServiceSpy.generateCohort).not.toHaveBeenCalled();
        expect(leadershipServiceSpy.generateFollower).not.toHaveBeenCalled();

        expect(component.generating()).toBe(true);
        expect(component.generatingMessage()).toEqual('Generating character...');
        expect(component.character()).toBeNull();
        expect(component.leadership()).toBeNull();
        expect(component.cohort()).toBeNull();
        expect(component.followers()).toEqual([]);
        
        await vi.advanceTimersByTimeAsync(delay - 1);

        expect(component.generating()).toBe(true);
        expect(component.generatingMessage()).toEqual('Generating character...');
        expect(component.character()).toBeNull();
        expect(component.leadership()).toBeNull();
        expect(component.cohort()).toBeNull();
        expect(component.followers()).toEqual([]);

        await vi.advanceTimersByTimeAsync(1);

        expect(component.character()).toBe(character);
        expect(component.leaderAlignment).toEqual('my leader alignment');
        expect(component.leaderAnimal).toEqual('my animal');
        expect(component.leaderCharismaBonus).toEqual(8);
        expect(component.leaderClassName).toEqual('my leader class');
        expect(component.leaderLevel).toEqual(7);

        await expectLeadershipGenerating(leadership, cohort, followers);
        expectFollowerCalls(followerQuantities);

        await vi.runAllTimersAsync();
      });
      
      it(`should be generating while generating character - leader with cohort and followers <= lvl 3 - metarace ${test.m}, abilities ${test.a}`, async () => {
        setupOnInit();

        const character = new Character('my character summary');
        character.isLeader = true;
        character.class.level = 7;
        character.abilities.Charisma.bonus = 8;
        character.magic.animal = 'my animal';
        character.alignment.full = 'my leader alignment';
        character.class.name = 'my leader class';
        characterServiceSpy.generate.mockImplementation(() => getFakeDelay(character));
        
        const followerQuantities = new FollowerQuantities(4, 3, 2);
        const leadership = new Leadership(3, [], 8, followerQuantities);
        leadershipServiceSpy.generate.mockImplementation(() => getFakeDelay(leadership));

        const cohort = new Character('my cohort summary');
        leadershipServiceSpy.generateCohort.mockImplementation(() => getFakeDelay(cohort));

        let followerIndex = 0;
        const followers = [
          new Character('my follower summary 1.1'),
          new Character('my follower summary 1.2'),
          new Character('my follower summary 1.3'),
          new Character('my follower summary 1.4'),
          new Character('my follower summary 2.1'),
          new Character('my follower summary 2.2'),
          new Character('my follower summary 2.3'),
          new Character('my follower summary 3.1'),
          new Character('my follower summary 3.2'),
        ];
        leadershipServiceSpy.generateFollower.mockImplementation(() => getFakeDelay(followers[followerIndex++]));

        component.alignmentRandomizerType = 'my alignment randomizer';
        component.setAlignment = 'my alignment';
        component.classNameRandomizerType = 'my class name randomizer';
        component.setClassName = 'my class name';
        component.levelRandomizerType = 'my level randomizer';
        component.setLevel = 9266;
        component.baseRaceRandomizerType = 'my base race randomizer';
        component.setBaseRace = 'my base race';
        component.metaraceRandomizerType = 'my metarace randomizer';
        component.setMetarace = 'my metarace';
        component.forceMetarace = test.m;
        component.abilitiesRandomizerType = 'my abilities randomizer';
        component.allowAbilitiesAdjustments = test.a;
        component.setStrength = 90210;
        component.setConstitution = 42;
        component.setDexterity = 600;
        component.setIntelligence = 1337;
        component.setWisdom = 1336;
        component.setCharisma = 96;

        component.generateCharacter();

        expect(characterServiceSpy.generate).toHaveBeenCalledWith(
          'my alignment randomizer',
          'my alignment',
          'my class name randomizer',
          'my class name',
          'my level randomizer',
          9266,
          'my base race randomizer',
          'my base race',
          'my metarace randomizer',
          test.m,
          'my metarace',
          'my abilities randomizer',
          90210,
          42,
          600,
          1337,
          1336,
          96,
          test.a
        );
        expect(leadershipServiceSpy.generate).not.toHaveBeenCalled();
        expect(leadershipServiceSpy.generateCohort).not.toHaveBeenCalled();
        expect(leadershipServiceSpy.generateFollower).not.toHaveBeenCalled();

        expect(component.generating()).toBe(true);
        expect(component.generatingMessage()).toEqual('Generating character...');
        expect(component.character()).toBeNull();
        expect(component.leadership()).toBeNull();
        expect(component.cohort()).toBeNull();
        expect(component.followers()).toEqual([]);
        
        await vi.advanceTimersByTimeAsync(delay - 1);

        expect(component.generating()).toBe(true);
        expect(component.generatingMessage()).toEqual('Generating character...');
        expect(component.character()).toBeNull();
        expect(component.leadership()).toBeNull();
        expect(component.cohort()).toBeNull();
        expect(component.followers()).toEqual([]);

        await vi.advanceTimersByTimeAsync(1);

        expect(component.character()).toBe(character);
        expect(component.leaderAlignment).toEqual('my leader alignment');
        expect(component.leaderAnimal).toEqual('my animal');
        expect(component.leaderCharismaBonus).toEqual(8);
        expect(component.leaderClassName).toEqual('my leader class');
        expect(component.leaderLevel).toEqual(7);

        await expectLeadershipGenerating(leadership, cohort, followers);
        expectFollowerCalls(followerQuantities);

        await vi.runAllTimersAsync();
      });
      
      it(`should be generating while generating character - leader with cohort and followers <= lvl 4 - metarace ${test.m}, abilities ${test.a}`, async () => {
        setupOnInit();

        const character = new Character('my character summary');
        character.isLeader = true;
        character.class.level = 7;
        character.abilities.Charisma.bonus = 8;
        character.magic.animal = 'my animal';
        character.alignment.full = 'my leader alignment';
        character.class.name = 'my leader class';
        characterServiceSpy.generate.mockImplementation(() => getFakeDelay(character));
        
        const followerQuantities = new FollowerQuantities(5, 4, 3, 2);
        const leadership = new Leadership(3, [], 8, followerQuantities);
        leadershipServiceSpy.generate.mockImplementation(() => getFakeDelay(leadership));

        const cohort = new Character('my cohort summary');
        leadershipServiceSpy.generateCohort.mockImplementation(() => getFakeDelay(cohort));

        let followerIndex = 0;
        const followers = [
          new Character('my follower summary 1.1'),
          new Character('my follower summary 1.2'),
          new Character('my follower summary 1.3'),
          new Character('my follower summary 1.4'),
          new Character('my follower summary 1.5'),
          new Character('my follower summary 2.1'),
          new Character('my follower summary 2.2'),
          new Character('my follower summary 2.3'),
          new Character('my follower summary 2.4'),
          new Character('my follower summary 3.1'),
          new Character('my follower summary 3.2'),
          new Character('my follower summary 3.3'),
          new Character('my follower summary 4.1'),
          new Character('my follower summary 4.2'),
        ];
        leadershipServiceSpy.generateFollower.mockImplementation(() => getFakeDelay(followers[followerIndex++]));

        component.alignmentRandomizerType = 'my alignment randomizer';
        component.setAlignment = 'my alignment';
        component.classNameRandomizerType = 'my class name randomizer';
        component.setClassName = 'my class name';
        component.levelRandomizerType = 'my level randomizer';
        component.setLevel = 9266;
        component.baseRaceRandomizerType = 'my base race randomizer';
        component.setBaseRace = 'my base race';
        component.metaraceRandomizerType = 'my metarace randomizer';
        component.setMetarace = 'my metarace';
        component.forceMetarace = test.m;
        component.abilitiesRandomizerType = 'my abilities randomizer';
        component.allowAbilitiesAdjustments = test.a;
        component.setStrength = 90210;
        component.setConstitution = 42;
        component.setDexterity = 600;
        component.setIntelligence = 1337;
        component.setWisdom = 1336;
        component.setCharisma = 96;

        component.generateCharacter();

        expect(characterServiceSpy.generate).toHaveBeenCalledWith(
          'my alignment randomizer',
          'my alignment',
          'my class name randomizer',
          'my class name',
          'my level randomizer',
          9266,
          'my base race randomizer',
          'my base race',
          'my metarace randomizer',
          test.m,
          'my metarace',
          'my abilities randomizer',
          90210,
          42,
          600,
          1337,
          1336,
          96,
          test.a
        );
        expect(leadershipServiceSpy.generate).not.toHaveBeenCalled();
        expect(leadershipServiceSpy.generateCohort).not.toHaveBeenCalled();
        expect(leadershipServiceSpy.generateFollower).not.toHaveBeenCalled();

        expect(component.generating()).toBe(true);
        expect(component.generatingMessage()).toEqual('Generating character...');
        expect(component.character()).toBeNull();
        expect(component.leadership()).toBeNull();
        expect(component.cohort()).toBeNull();
        expect(component.followers()).toEqual([]);
        
        await vi.advanceTimersByTimeAsync(delay - 1);

        expect(component.generating()).toBe(true);
        expect(component.generatingMessage()).toEqual('Generating character...');
        expect(component.character()).toBeNull();
        expect(component.leadership()).toBeNull();
        expect(component.cohort()).toBeNull();
        expect(component.followers()).toEqual([]);

        await vi.advanceTimersByTimeAsync(1);

        expect(component.character()).toBe(character);
        expect(component.leaderAlignment).toEqual('my leader alignment');
        expect(component.leaderAnimal).toEqual('my animal');
        expect(component.leaderCharismaBonus).toEqual(8);
        expect(component.leaderClassName).toEqual('my leader class');
        expect(component.leaderLevel).toEqual(7);

        await expectLeadershipGenerating(leadership, cohort, followers);
        expectFollowerCalls(followerQuantities);

        await vi.runAllTimersAsync();
      });
      
      it(`should be generating while generating character - leader with cohort and followers <= lvl 5 - metarace ${test.m}, abilities ${test.a}`, async () => {
        setupOnInit();

        const character = new Character('my character summary');
        character.isLeader = true;
        character.class.level = 7;
        character.abilities.Charisma.bonus = 8;
        character.magic.animal = 'my animal';
        character.alignment.full = 'my leader alignment';
        character.class.name = 'my leader class';
        characterServiceSpy.generate.mockImplementation(() => getFakeDelay(character));
        
        const followerQuantities = new FollowerQuantities(6, 5, 4, 3, 2);
        const leadership = new Leadership(3, [], 8, followerQuantities);
        leadershipServiceSpy.generate.mockImplementation(() => getFakeDelay(leadership));

        const cohort = new Character('my cohort summary');
        leadershipServiceSpy.generateCohort.mockImplementation(() => getFakeDelay(cohort));

        let followerIndex = 0;
        const followers = [
          new Character('my follower summary 1.1'),
          new Character('my follower summary 1.2'),
          new Character('my follower summary 1.3'),
          new Character('my follower summary 1.4'),
          new Character('my follower summary 1.5'),
          new Character('my follower summary 1.6'),
          new Character('my follower summary 2.1'),
          new Character('my follower summary 2.2'),
          new Character('my follower summary 2.3'),
          new Character('my follower summary 2.4'),
          new Character('my follower summary 2.5'),
          new Character('my follower summary 3.1'),
          new Character('my follower summary 3.2'),
          new Character('my follower summary 3.3'),
          new Character('my follower summary 3.4'),
          new Character('my follower summary 4.1'),
          new Character('my follower summary 4.2'),
          new Character('my follower summary 4.3'),
          new Character('my follower summary 5.1'),
          new Character('my follower summary 5.2'),
        ];
        leadershipServiceSpy.generateFollower.mockImplementation(() => getFakeDelay(followers[followerIndex++]));

        component.alignmentRandomizerType = 'my alignment randomizer';
        component.setAlignment = 'my alignment';
        component.classNameRandomizerType = 'my class name randomizer';
        component.setClassName = 'my class name';
        component.levelRandomizerType = 'my level randomizer';
        component.setLevel = 9266;
        component.baseRaceRandomizerType = 'my base race randomizer';
        component.setBaseRace = 'my base race';
        component.metaraceRandomizerType = 'my metarace randomizer';
        component.setMetarace = 'my metarace';
        component.forceMetarace = test.m;
        component.abilitiesRandomizerType = 'my abilities randomizer';
        component.allowAbilitiesAdjustments = test.a;
        component.setStrength = 90210;
        component.setConstitution = 42;
        component.setDexterity = 600;
        component.setIntelligence = 1337;
        component.setWisdom = 1336;
        component.setCharisma = 96;

        component.generateCharacter();

        expect(characterServiceSpy.generate).toHaveBeenCalledWith(
          'my alignment randomizer',
          'my alignment',
          'my class name randomizer',
          'my class name',
          'my level randomizer',
          9266,
          'my base race randomizer',
          'my base race',
          'my metarace randomizer',
          test.m,
          'my metarace',
          'my abilities randomizer',
          90210,
          42,
          600,
          1337,
          1336,
          96,
          test.a
        );
        expect(leadershipServiceSpy.generate).not.toHaveBeenCalled();
        expect(leadershipServiceSpy.generateCohort).not.toHaveBeenCalled();
        expect(leadershipServiceSpy.generateFollower).not.toHaveBeenCalled();

        expect(component.generating()).toBe(true);
        expect(component.generatingMessage()).toEqual('Generating character...');
        expect(component.character()).toBeNull();
        expect(component.leadership()).toBeNull();
        expect(component.cohort()).toBeNull();
        expect(component.followers()).toEqual([]);
        
        await vi.advanceTimersByTimeAsync(delay - 1);

        expect(component.generating()).toBe(true);
        expect(component.generatingMessage()).toEqual('Generating character...');
        expect(component.character()).toBeNull();
        expect(component.leadership()).toBeNull();
        expect(component.cohort()).toBeNull();
        expect(component.followers()).toEqual([]);

        await vi.advanceTimersByTimeAsync(1);

        expect(component.character()).toBe(character);
        expect(component.leaderAlignment).toEqual('my leader alignment');
        expect(component.leaderAnimal).toEqual('my animal');
        expect(component.leaderCharismaBonus).toEqual(8);
        expect(component.leaderClassName).toEqual('my leader class');
        expect(component.leaderLevel).toEqual(7);

        await expectLeadershipGenerating(leadership, cohort, followers);
        expectFollowerCalls(followerQuantities);

        await vi.runAllTimersAsync();
      });
      
      it(`should be generating while generating character - leader with cohort and followers <= lvl 6 - metarace ${test.m}, abilities ${test.a}`, async () => {
        setupOnInit();

        const character = new Character('my character summary');
        character.isLeader = true;
        character.class.level = 7;
        character.abilities.Charisma.bonus = 8;
        character.magic.animal = 'my animal';
        character.alignment.full = 'my leader alignment';
        character.class.name = 'my leader class';
        characterServiceSpy.generate.mockImplementation(() => getFakeDelay(character));
        
        const followerQuantities = new FollowerQuantities(7, 6, 5, 4, 3, 2);
        const leadership = new Leadership(3, [], 8, followerQuantities);
        leadershipServiceSpy.generate.mockImplementation(() => getFakeDelay(leadership));

        const cohort = new Character('my cohort summary');
        leadershipServiceSpy.generateCohort.mockImplementation(() => getFakeDelay(cohort));

        let followerIndex = 0;
        const followers = [
          new Character('my follower summary 1.1'),
          new Character('my follower summary 1.2'),
          new Character('my follower summary 1.3'),
          new Character('my follower summary 1.4'),
          new Character('my follower summary 1.5'),
          new Character('my follower summary 1.6'),
          new Character('my follower summary 1.7'),
          new Character('my follower summary 2.1'),
          new Character('my follower summary 2.2'),
          new Character('my follower summary 2.3'),
          new Character('my follower summary 2.4'),
          new Character('my follower summary 2.5'),
          new Character('my follower summary 2.6'),
          new Character('my follower summary 3.1'),
          new Character('my follower summary 3.2'),
          new Character('my follower summary 3.3'),
          new Character('my follower summary 3.4'),
          new Character('my follower summary 3.5'),
          new Character('my follower summary 4.1'),
          new Character('my follower summary 4.2'),
          new Character('my follower summary 4.3'),
          new Character('my follower summary 4.4'),
          new Character('my follower summary 5.1'),
          new Character('my follower summary 5.2'),
          new Character('my follower summary 5.3'),
          new Character('my follower summary 6.1'),
          new Character('my follower summary 6.2'),
        ];
        leadershipServiceSpy.generateFollower.mockImplementation(() => getFakeDelay(followers[followerIndex++]));

        component.alignmentRandomizerType = 'my alignment randomizer';
        component.setAlignment = 'my alignment';
        component.classNameRandomizerType = 'my class name randomizer';
        component.setClassName = 'my class name';
        component.levelRandomizerType = 'my level randomizer';
        component.setLevel = 9266;
        component.baseRaceRandomizerType = 'my base race randomizer';
        component.setBaseRace = 'my base race';
        component.metaraceRandomizerType = 'my metarace randomizer';
        component.setMetarace = 'my metarace';
        component.forceMetarace = test.m;
        component.abilitiesRandomizerType = 'my abilities randomizer';
        component.allowAbilitiesAdjustments = test.a;
        component.setStrength = 90210;
        component.setConstitution = 42;
        component.setDexterity = 600;
        component.setIntelligence = 1337;
        component.setWisdom = 1336;
        component.setCharisma = 96;

        component.generateCharacter();

        expect(characterServiceSpy.generate).toHaveBeenCalledWith(
          'my alignment randomizer',
          'my alignment',
          'my class name randomizer',
          'my class name',
          'my level randomizer',
          9266,
          'my base race randomizer',
          'my base race',
          'my metarace randomizer',
          test.m,
          'my metarace',
          'my abilities randomizer',
          90210,
          42,
          600,
          1337,
          1336,
          96,
          test.a
        );
        expect(leadershipServiceSpy.generate).not.toHaveBeenCalled();
        expect(leadershipServiceSpy.generateCohort).not.toHaveBeenCalled();
        expect(leadershipServiceSpy.generateFollower).not.toHaveBeenCalled();

        expect(component.generating()).toBe(true);
        expect(component.generatingMessage()).toEqual('Generating character...');
        expect(component.character()).toBeNull();
        expect(component.leadership()).toBeNull();
        expect(component.cohort()).toBeNull();
        expect(component.followers()).toEqual([]);
        
        await vi.advanceTimersByTimeAsync(delay - 1);

        expect(component.generating()).toBe(true);
        expect(component.generatingMessage()).toEqual('Generating character...');
        expect(component.character()).toBeNull();
        expect(component.leadership()).toBeNull();
        expect(component.cohort()).toBeNull();
        expect(component.followers()).toEqual([]);

        await vi.advanceTimersByTimeAsync(1);

        expect(component.character()).toBe(character);
        expect(component.leaderAlignment).toEqual('my leader alignment');
        expect(component.leaderAnimal).toEqual('my animal');
        expect(component.leaderCharismaBonus).toEqual(8);
        expect(component.leaderClassName).toEqual('my leader class');
        expect(component.leaderLevel).toEqual(7);

        await expectLeadershipGenerating(leadership, cohort, followers);
        expectFollowerCalls(followerQuantities);

        await vi.runAllTimersAsync();
      });
    });

    function setupOnInit() {
      const viewModel = getViewModel();
      component.characterModel.set(viewModel);

      component.alignmentRandomizerType = viewModel.alignmentRandomizerTypes[0];
      component.setAlignment = viewModel.alignments[0];
  
      component.classNameRandomizerType = viewModel.classNameRandomizerTypes[0];
      component.setClassName = viewModel.classNames[0];
  
      component.levelRandomizerType = viewModel.levelRandomizerTypes[0];
  
      component.baseRaceRandomizerType = viewModel.baseRaceRandomizerTypes[0];
      component.setBaseRace = viewModel.baseRaces[0];
  
      component.metaraceRandomizerType = viewModel.metaraceRandomizerTypes[0];
      component.setMetarace = viewModel.metaraces[0];
  
      component.abilitiesRandomizerType = viewModel.abilitiesRandomizerTypes[0];
      
      component.leaderAlignment = viewModel.alignments[0];
      component.leaderClassName = viewModel.classNames[0];

      component.valid.set(true);
    }

    it('should generate the default character', async () => {
      setupOnInit();

      let character = new Character('my character summary');
      characterServiceSpy.generate.mockImplementation(() => getFakeDelay(character));

      component.generateCharacter();

      expect(characterServiceSpy.generate).toHaveBeenCalledWith(
        'alignment randomizer 1',
        'alignment 1',
        'class name randomizer 1',
        'class name 1',
        'level randomizer 1',
        1,
        'base race randomizer 1',
        'base race 1',
        'metarace randomizer 1',
        false,
        'metarace 1',
        'abilities randomizer 1',
        10,
        10,
        10,
        10,
        10,
        10,
        true
      );
      expect(component.generating()).toBe(true);

      await vi.advanceTimersByTimeAsync(delay);

      expect(component.character()).toBe(character);
      expect(component.generating()).toBe(false);
      
      expect(loggerServiceSpy.logError).not.toHaveBeenCalled();
      expect(sweetAlertServiceSpy.showError).not.toHaveBeenCalled();
    });

    it(`should generate a non-default character`, async () => {
      setupOnInit();

      let character = new Character('my character summary');
      characterServiceSpy.generate.mockImplementation(() => getFakeDelay(character));

      const viewModel = component.characterModel()!;
      component.alignmentRandomizerType = viewModel.alignmentRandomizerTypes[1];
      component.setAlignment = viewModel.alignments[1];
      component.classNameRandomizerType = viewModel.classNameRandomizerTypes[1];
      component.setClassName = viewModel.classNames[1];
      component.levelRandomizerType = viewModel.levelRandomizerTypes[1];
      component.setLevel = 9266;
      component.baseRaceRandomizerType = viewModel.baseRaceRandomizerTypes[1];
      component.setBaseRace = viewModel.baseRaces[1];
      component.metaraceRandomizerType = viewModel.metaraceRandomizerTypes[1];
      component.setMetarace = viewModel.metaraces[1];
      component.forceMetarace = true;
      component.abilitiesRandomizerType = viewModel.abilitiesRandomizerTypes[1];
      component.setStrength = 90210;
      component.setConstitution = 42;
      component.setDexterity = 600;
      component.setIntelligence = 1337;
      component.setWisdom = 1336;
      component.setCharisma = 96;
      component.allowAbilitiesAdjustments = false;

      component.generateCharacter();

      expect(characterServiceSpy.generate).toHaveBeenCalledWith(
        'alignment randomizer 2',
        'alignment 2',
        'class name randomizer 2',
        'class name 2',
        'level randomizer 2',
        9266,
        'base race randomizer 2',
        'base race 2',
        'metarace randomizer 2',
        true,
        'metarace 2',
        'abilities randomizer 2',
        90210,
        42,
        600,
        1337,
        1336,
        96,
        false
      );
      expect(component.generating()).toBe(true);

      await vi.advanceTimersByTimeAsync(delay);

      expect(component.character()).toBe(character);
      expect(component.generating()).toBe(false);
      
      expect(loggerServiceSpy.logError).not.toHaveBeenCalled();
      expect(sweetAlertServiceSpy.showError).not.toHaveBeenCalled();
    });

    it('should display error from generating character', async () => {
      setupOnInit();

      characterServiceSpy.generate.mockImplementation(() => getFakeError('I failed'));

      component.generateCharacter();
      await vi.advanceTimersByTimeAsync(delay);

      expect(component.character()).toBeNull();
      expect(component.leadership()).toBeNull();
      expect(component.cohort()).toBeNull();
      expect(component.followers()).toEqual([]);
      expect(component.generating()).toBe(false);
      expect(component.validating()).toBe(false);
      
      expect(loggerServiceSpy.logError).toHaveBeenCalledWith('I failed');
      expect(sweetAlertServiceSpy.showError).toHaveBeenCalledTimes(1);
    });

    it('should display error from generating leadership', async () => {
      setupOnInit();

      let character = new Character('my character summary');
      character.isLeader = true;
      character.class.level = 7;
      character.abilities.Charisma.bonus = 8;
      character.magic.animal = 'my animal';
      character.alignment.full = 'my leader alignment';
      character.class.name = 'my leader class';
      characterServiceSpy.generate.mockImplementation(() => getFakeDelay(character));
      leadershipServiceSpy.generate.mockImplementation(() => getFakeError('I failed'));

      component.generateCharacter();
      await vi.advanceTimersByTimeAsync(delay * 2);

      expect(component.character()).toBeNull();
      expect(component.leadership()).toBeNull();
      expect(component.cohort()).toBeNull();
      expect(component.followers()).toEqual([]);
      expect(component.generating()).toBe(false);
      expect(component.validating()).toBe(false);
      
      expect(loggerServiceSpy.logError).toHaveBeenCalledWith('I failed');
      expect(sweetAlertServiceSpy.showError).toHaveBeenCalledTimes(1);
    });

    it('should display error from generating cohort', async () => {
      setupOnInit();

      const character = new Character('my character summary');
      character.isLeader = true;
      character.class.level = 7;
      character.abilities.Charisma.bonus = 8;
      character.magic.animal = 'my animal';
      character.alignment.full = 'my leader alignment';
      character.class.name = 'my leader class';
      characterServiceSpy.generate.mockImplementation(() => getFakeDelay(character));

      const followerQuantities = new FollowerQuantities(7, 6, 5, 4, 3, 2);
      const leadership = new Leadership(3, [], 8, followerQuantities);
      leadershipServiceSpy.generate.mockImplementation(() => getFakeDelay(leadership));
      leadershipServiceSpy.generateCohort.mockImplementation(() => getFakeError('I failed'));

      component.generateCharacter();
      await vi.advanceTimersByTimeAsync(delay * 3);

      expect(component.character()).toBeNull();
      expect(component.leadership()).toBeNull();
      expect(component.cohort()).toBeNull();
      expect(component.followers()).toEqual([]);
      expect(component.generating()).toBe(false);
      expect(component.validating()).toBe(false);
      
      expect(loggerServiceSpy.logError).toHaveBeenCalledWith('I failed');
      expect(sweetAlertServiceSpy.showError).toHaveBeenCalledTimes(1);
    });

    it('should display error from generating follower', async () => {
      setupOnInit();

      const character = new Character('my character summary');
      character.isLeader = true;
      character.class.level = 7;
      character.abilities.Charisma.bonus = 8;
      character.magic.animal = 'my animal';
      character.alignment.full = 'my leader alignment';
      character.class.name = 'my leader class';
      characterServiceSpy.generate.mockImplementation(() => getFakeDelay(character));

      const followerQuantities = new FollowerQuantities(7, 6, 5, 4, 3, 2);
      const leadership = new Leadership(3, [], 8, followerQuantities);
      leadershipServiceSpy.generate.mockImplementation(() => getFakeDelay(leadership));
      
      const cohort = new Character('my cohort summary');
      leadershipServiceSpy.generateCohort.mockImplementation(() => getFakeDelay(cohort));
      
      leadershipServiceSpy.generateFollower.mockImplementation(() => getFakeError('I failed'));

      component.generateCharacter();
      await vi.advanceTimersByTimeAsync(delay * 4);

      expect(component.character()).toBeNull();
      expect(component.leadership()).toBeNull();
      expect(component.cohort()).toBeNull();
      expect(component.followers()).toEqual([]);
      expect(component.generating()).toBe(false);
      expect(component.validating()).toBe(false);
      
      expect(loggerServiceSpy.logError).toHaveBeenCalledWith('I failed');
      expect(sweetAlertServiceSpy.showError).toHaveBeenCalledTimes(1);
    });

    it('should display error from generating any follower', async () => {
      setupOnInit();

      const character = new Character('my character summary');
      character.isLeader = true;
      character.class.level = 7;
      character.abilities.Charisma.bonus = 8;
      character.magic.animal = 'my animal';
      character.alignment.full = 'my leader alignment';
      character.class.name = 'my leader class';
      characterServiceSpy.generate.mockImplementation(() => getFakeDelay(character));

      const followerQuantities = new FollowerQuantities(7, 6, 5, 4, 3, 2);
      const leadership = new Leadership(3, [], 8, followerQuantities);
      leadershipServiceSpy.generate.mockImplementation(() => getFakeDelay(leadership));
      
      const cohort = new Character('my cohort summary');
      leadershipServiceSpy.generateCohort.mockImplementation(() => getFakeDelay(cohort));
      
      const follower = new Character('my follower summary');
      leadershipServiceSpy.generateFollower.mockReturnValueOnce(getFakeDelay(follower)).mockReturnValueOnce(getFakeError('I failed'));

      component.generateCharacter();
      await vi.advanceTimersByTimeAsync(delay * 5);

      expect(component.character()).toBeNull();
      expect(component.leadership()).toBeNull();
      expect(component.cohort()).toBeNull();
      expect(component.followers()).toEqual([]);
      expect(component.generating()).toBe(false);
      expect(component.validating()).toBe(false);
      
      expect(loggerServiceSpy.logError).toHaveBeenCalledWith('I failed');
      expect(sweetAlertServiceSpy.showError).toHaveBeenCalledTimes(1);
    });
      
    it(`should be generating while generating leadership - without cohort or followers`, async () => {
      setupOnInit();

      component.leaderLevel = 7;
      component.leaderCharismaBonus = 8;
      component.leaderAnimal = 'my animal';
      component.leaderAlignment = 'my leader alignment';
      component.leaderClassName = 'my leader class';
      
      const leadership = new Leadership(2, [], 1);
      leadershipServiceSpy.generate.mockImplementation(() => getFakeDelay(leadership));
      leadershipServiceSpy.generateCohort.mockImplementation(() => getFakeDelay(null));

      component.generateLeadership();

      await expectLeadershipGenerating(leadership, null, []);

      await vi.runAllTimersAsync();
    });

    async function expectLeadershipGenerating(leadership: Leadership, cohort: Character | null, followers: Character[]) {
      expect(leadershipServiceSpy.generate).toHaveBeenCalledWith(7, 8, 'my animal');
      expect(leadershipServiceSpy.generate).toHaveBeenCalledTimes(1);
      expect(leadershipServiceSpy.generateCohort).not.toHaveBeenCalled();
      expect(leadershipServiceSpy.generateFollower).not.toHaveBeenCalled();

      expect(component.generating()).toBe(true);
      expect(component.generatingMessage()).toEqual('Generating leadership...');
      expect(component.leadership()).toBeNull();
      expect(component.cohort()).toBeNull();
      expect(component.followers()).toEqual([]);
      
      await vi.advanceTimersByTimeAsync(delay - 1);

      expect(component.generating()).toBe(true);
      expect(component.generatingMessage()).toEqual('Generating leadership...');
      expect(component.leadership()).toBeNull();
      expect(component.cohort()).toBeNull();
      expect(component.followers()).toEqual([]);

      await vi.advanceTimersByTimeAsync(1);

      expect(leadershipServiceSpy.generate).toHaveBeenCalledTimes(1);
      expect(leadershipServiceSpy.generateCohort).toHaveBeenCalledWith(7, leadership.cohortScore, 'my leader alignment', 'my leader class');
      expect(leadershipServiceSpy.generateCohort).toHaveBeenCalledTimes(1);
      expect(leadershipServiceSpy.generateFollower).not.toHaveBeenCalled();

      expect(component.generating()).toBe(true);
      expect(component.generatingMessage()).toEqual('Generating cohort...');
      expect(component.leadership()).toBe(leadership);
      expect(component.cohort()).toBeNull();
      expect(component.followers()).toEqual([]);
      
      await vi.advanceTimersByTimeAsync(delay - 1);

      expect(component.generating()).toBe(true);
      expect(component.generatingMessage()).toEqual('Generating cohort...');
      expect(component.leadership()).toBe(leadership);
      expect(component.cohort()).toBeNull();
      expect(component.followers()).toEqual([]);

      const followerCount = followers.length;

      if (!followerCount) {
        return;
      }
      
      for(let i = 0; i < followerCount; i++) {
        const message = `Generating follower ${i + 1} of ${followerCount}...`;

        await vi.advanceTimersByTimeAsync(1);

        expect(leadershipServiceSpy.generate).toHaveBeenCalledTimes(1);
        expect(leadershipServiceSpy.generateCohort).toHaveBeenCalledTimes(1);
        expect(leadershipServiceSpy.generateFollower).toHaveBeenCalledTimes(i + 1);

        expect(component.generating()).toBe(true);
        expect(component.followers()).toEqual(followers.slice(0, i));
        expect(component.generatingMessage()).toEqual(message);
        expect(component.leadership()).toBe(leadership);
        expect(component.cohort()).toBe(cohort);
        
        await vi.advanceTimersByTimeAsync(delay - 1);

        expect(component.generating()).toBe(true);
        expect(component.generatingMessage()).toEqual(message);
        expect(component.leadership()).toBe(leadership);
        expect(component.cohort()).toBe(cohort);
        expect(component.followers()).toEqual(followers.slice(0, i));  
      }
    }
    
    it(`should be generating while generating leadership - with cohort but without followers`, async () => {
      setupOnInit();

      component.leaderLevel = 7;
      component.leaderCharismaBonus = 8;
      component.leaderAnimal = 'my animal';
      component.leaderAlignment = 'my leader alignment';
      component.leaderClassName = 'my leader class';
      
      const leadership = new Leadership(3, [], 8);
      leadershipServiceSpy.generate.mockImplementation(() => getFakeDelay(leadership));

      const cohort = new Character('my cohort summary');
      leadershipServiceSpy.generateCohort.mockImplementation(() => getFakeDelay(cohort));

      component.generateLeadership();

      await expectLeadershipGenerating(leadership, cohort, []);

      await vi.runAllTimersAsync();
    });
    
    it(`should be generating while generating leadership - with cohort and followers <= lvl 1`, async () => {
      setupOnInit();

      component.leaderLevel = 7;
      component.leaderCharismaBonus = 8;
      component.leaderAnimal = 'my animal';
      component.leaderAlignment = 'my leader alignment';
      component.leaderClassName = 'my leader class';
      
      const followerQuantities = new FollowerQuantities(2);
      const leadership = new Leadership(3, [], 8, followerQuantities);
      leadershipServiceSpy.generate.mockImplementation(() => getFakeDelay(leadership));

      const cohort = new Character('my cohort summary');
      leadershipServiceSpy.generateCohort.mockImplementation(() => getFakeDelay(cohort));

      let followerIndex = 0;
      const followers = [
        new Character('my follower summary 1.1'),
        new Character('my follower summary 1.2'),
      ];
      leadershipServiceSpy.generateFollower.mockImplementation(() => getFakeDelay(followers[followerIndex++]));

      component.generateLeadership();

      await expectLeadershipGenerating(leadership, cohort, followers);
      expectFollowerCalls(followerQuantities);

      await vi.runAllTimersAsync();
    });

    function expectFollowerCalls(quantities: FollowerQuantities) {
      const total = quantities.level1 + quantities.level2 + quantities.level3 + quantities.level4 + quantities.level5 + quantities.level6;
      let callIndex = 0;

      expect(leadershipServiceSpy.generateFollower).toHaveBeenCalledTimes(total);

      for(let i = 0; i < quantities.level1; i++) {
        expect(leadershipServiceSpy.generateFollower.mock.calls[i + callIndex]).toEqual([1, 'my leader alignment', 'my leader class']);
      }

      callIndex += quantities.level1;

      for(let i = 0; i < quantities.level2; i++) {
        expect(leadershipServiceSpy.generateFollower.mock.calls[i + callIndex]).toEqual([2, 'my leader alignment', 'my leader class']);
      }

      callIndex += quantities.level2;

      for(let i = 0; i < quantities.level3; i++) {
        expect(leadershipServiceSpy.generateFollower.mock.calls[i + callIndex]).toEqual([3, 'my leader alignment', 'my leader class']);
      }

      callIndex += quantities.level3;

      for(let i = 0; i < quantities.level4; i++) {
        expect(leadershipServiceSpy.generateFollower.mock.calls[i + callIndex]).toEqual([4, 'my leader alignment', 'my leader class']);
      }

      callIndex += quantities.level4;

      for(let i = 0; i < quantities.level5; i++) {
        expect(leadershipServiceSpy.generateFollower.mock.calls[i + callIndex]).toEqual([5, 'my leader alignment', 'my leader class']);
      }

      callIndex += quantities.level5;

      for(let i = 0; i < quantities.level6; i++) {
        expect(leadershipServiceSpy.generateFollower.mock.calls[i + callIndex]).toEqual([6, 'my leader alignment', 'my leader class']);
      }
    }
    
    it(`should be generating while generating leadership - with cohort and followers <= lvl 2`, async () => {
      setupOnInit();

      component.leaderLevel = 7;
      component.leaderCharismaBonus = 8;
      component.leaderAnimal = 'my animal';
      component.leaderAlignment = 'my leader alignment';
      component.leaderClassName = 'my leader class';
      
      const followerQuantities = new FollowerQuantities(3, 2);
      const leadership = new Leadership(3, [], 8, followerQuantities);
      leadershipServiceSpy.generate.mockImplementation(() => getFakeDelay(leadership));

      const cohort = new Character('my cohort summary');
      leadershipServiceSpy.generateCohort.mockImplementation(() => getFakeDelay(cohort));

      let followerIndex = 0;
      const followers = [
        new Character('my follower summary 1.1'),
        new Character('my follower summary 1.2'),
        new Character('my follower summary 1.3'),
        new Character('my follower summary 2.1'),
        new Character('my follower summary 2.2'),
      ];
      leadershipServiceSpy.generateFollower.mockImplementation(() => getFakeDelay(followers[followerIndex++]));

      component.generateLeadership();

      await expectLeadershipGenerating(leadership, cohort, followers);
      expectFollowerCalls(followerQuantities);

      await vi.runAllTimersAsync();
    });
    
    it(`should be generating while generating leadership - with cohort and followers <= lvl 3`, async () => {
      setupOnInit();

      component.leaderLevel = 7;
      component.leaderCharismaBonus = 8;
      component.leaderAnimal = 'my animal';
      component.leaderAlignment = 'my leader alignment';
      component.leaderClassName = 'my leader class';
      
      const followerQuantities = new FollowerQuantities(4, 3, 2);
      const leadership = new Leadership(3, [], 8, followerQuantities);
      leadershipServiceSpy.generate.mockImplementation(() => getFakeDelay(leadership));

      const cohort = new Character('my cohort summary');
      leadershipServiceSpy.generateCohort.mockImplementation(() => getFakeDelay(cohort));

      let followerIndex = 0;
      const followers = [
        new Character('my follower summary 1.1'),
        new Character('my follower summary 1.2'),
        new Character('my follower summary 1.3'),
        new Character('my follower summary 1.4'),
        new Character('my follower summary 2.1'),
        new Character('my follower summary 2.2'),
        new Character('my follower summary 2.3'),
        new Character('my follower summary 3.1'),
        new Character('my follower summary 3.2'),
      ];
      leadershipServiceSpy.generateFollower.mockImplementation(() => getFakeDelay(followers[followerIndex++]));

      component.generateLeadership();

      await expectLeadershipGenerating(leadership, cohort, followers);
      expectFollowerCalls(followerQuantities);

      await vi.runAllTimersAsync();
    });
    
    it(`should be generating while generating leadership - with cohort and followers <= lvl 4`, async () => {
      setupOnInit();

      component.leaderLevel = 7;
      component.leaderCharismaBonus = 8;
      component.leaderAnimal = 'my animal';
      component.leaderAlignment = 'my leader alignment';
      component.leaderClassName = 'my leader class';
      
      const followerQuantities = new FollowerQuantities(5, 4, 3, 2);
      const leadership = new Leadership(3, [], 8, followerQuantities);
      leadershipServiceSpy.generate.mockImplementation(() => getFakeDelay(leadership));

      const cohort = new Character('my cohort summary');
      leadershipServiceSpy.generateCohort.mockImplementation(() => getFakeDelay(cohort));

      let followerIndex = 0;
      const followers = [
        new Character('my follower summary 1.1'),
        new Character('my follower summary 1.2'),
        new Character('my follower summary 1.3'),
        new Character('my follower summary 1.4'),
        new Character('my follower summary 1.5'),
        new Character('my follower summary 2.1'),
        new Character('my follower summary 2.2'),
        new Character('my follower summary 2.3'),
        new Character('my follower summary 2.4'),
        new Character('my follower summary 3.1'),
        new Character('my follower summary 3.2'),
        new Character('my follower summary 3.3'),
        new Character('my follower summary 4.1'),
        new Character('my follower summary 4.2'),
      ];
      leadershipServiceSpy.generateFollower.mockImplementation(() => getFakeDelay(followers[followerIndex++]));

      component.generateLeadership();

      await expectLeadershipGenerating(leadership, cohort, followers);
      expectFollowerCalls(followerQuantities);

      await vi.runAllTimersAsync();
    });
    
    it(`should be generating while generating leadership - with cohort and followers <= lvl 5`, async () => {
      setupOnInit();

      component.leaderLevel = 7;
      component.leaderCharismaBonus = 8;
      component.leaderAnimal = 'my animal';
      component.leaderAlignment = 'my leader alignment';
      component.leaderClassName = 'my leader class';
      
      const followerQuantities = new FollowerQuantities(6, 5, 4, 3, 2);
      const leadership = new Leadership(3, [], 8, followerQuantities);
      leadershipServiceSpy.generate.mockImplementation(() => getFakeDelay(leadership));

      const cohort = new Character('my cohort summary');
      leadershipServiceSpy.generateCohort.mockImplementation(() => getFakeDelay(cohort));

      let followerIndex = 0;
      const followers = [
        new Character('my follower summary 1.1'),
        new Character('my follower summary 1.2'),
        new Character('my follower summary 1.3'),
        new Character('my follower summary 1.4'),
        new Character('my follower summary 1.5'),
        new Character('my follower summary 1.6'),
        new Character('my follower summary 2.1'),
        new Character('my follower summary 2.2'),
        new Character('my follower summary 2.3'),
        new Character('my follower summary 2.4'),
        new Character('my follower summary 2.5'),
        new Character('my follower summary 3.1'),
        new Character('my follower summary 3.2'),
        new Character('my follower summary 3.3'),
        new Character('my follower summary 3.4'),
        new Character('my follower summary 4.1'),
        new Character('my follower summary 4.2'),
        new Character('my follower summary 4.3'),
        new Character('my follower summary 5.1'),
        new Character('my follower summary 5.2'),
      ];
      leadershipServiceSpy.generateFollower.mockImplementation(() => getFakeDelay(followers[followerIndex++]));

      component.generateLeadership();

      await expectLeadershipGenerating(leadership, cohort, followers);
      expectFollowerCalls(followerQuantities);

      await vi.runAllTimersAsync();
    });
    
    it(`should be generating while generating leadership - with cohort and followers <= lvl 6`, async () => {
      setupOnInit();

      component.leaderLevel = 7;
      component.leaderCharismaBonus = 8;
      component.leaderAnimal = 'my animal';
      component.leaderAlignment = 'my leader alignment';
      component.leaderClassName = 'my leader class';
      
      const followerQuantities = new FollowerQuantities(7, 6, 5, 4, 3, 2);
      const leadership = new Leadership(3, [], 8, followerQuantities);
      leadershipServiceSpy.generate.mockImplementation(() => getFakeDelay(leadership));

      const cohort = new Character('my cohort summary');
      leadershipServiceSpy.generateCohort.mockImplementation(() => getFakeDelay(cohort));

      let followerIndex = 0;
      const followers = [
        new Character('my follower summary 1.1'),
        new Character('my follower summary 1.2'),
        new Character('my follower summary 1.3'),
        new Character('my follower summary 1.4'),
        new Character('my follower summary 1.5'),
        new Character('my follower summary 1.6'),
        new Character('my follower summary 1.7'),
        new Character('my follower summary 2.1'),
        new Character('my follower summary 2.2'),
        new Character('my follower summary 2.3'),
        new Character('my follower summary 2.4'),
        new Character('my follower summary 2.5'),
        new Character('my follower summary 2.6'),
        new Character('my follower summary 3.1'),
        new Character('my follower summary 3.2'),
        new Character('my follower summary 3.3'),
        new Character('my follower summary 3.4'),
        new Character('my follower summary 3.5'),
        new Character('my follower summary 4.1'),
        new Character('my follower summary 4.2'),
        new Character('my follower summary 4.3'),
        new Character('my follower summary 4.4'),
        new Character('my follower summary 5.1'),
        new Character('my follower summary 5.2'),
        new Character('my follower summary 5.3'),
        new Character('my follower summary 6.1'),
        new Character('my follower summary 6.2'),
      ];
      leadershipServiceSpy.generateFollower.mockImplementation(() => getFakeDelay(followers[followerIndex++]));

      component.generateLeadership();

      await expectLeadershipGenerating(leadership, cohort, followers);
      expectFollowerCalls(followerQuantities);

      await vi.runAllTimersAsync();
    });
    
    it(`should generate full leadership`, async () => {
      setupOnInit();

      component.leaderLevel = 7;
      component.leaderCharismaBonus = 8;
      component.leaderAnimal = 'my animal';
      component.leaderAlignment = 'my leader alignment';
      component.leaderClassName = 'my leader class';
      
      const followerQuantities = new FollowerQuantities(7, 6, 5, 4, 3, 2);
      const leadership = new Leadership(3, [], 8, followerQuantities);
      leadershipServiceSpy.generate.mockImplementation(() => getFakeDelay(leadership));

      const cohort = new Character('my cohort summary');
      leadershipServiceSpy.generateCohort.mockImplementation(() => getFakeDelay(cohort));

      let followerIndex = 0;
      const followers = [
        new Character('my follower summary 1.1'),
        new Character('my follower summary 1.2'),
        new Character('my follower summary 1.3'),
        new Character('my follower summary 1.4'),
        new Character('my follower summary 1.5'),
        new Character('my follower summary 1.6'),
        new Character('my follower summary 1.7'),
        new Character('my follower summary 2.1'),
        new Character('my follower summary 2.2'),
        new Character('my follower summary 2.3'),
        new Character('my follower summary 2.4'),
        new Character('my follower summary 2.5'),
        new Character('my follower summary 2.6'),
        new Character('my follower summary 3.1'),
        new Character('my follower summary 3.2'),
        new Character('my follower summary 3.3'),
        new Character('my follower summary 3.4'),
        new Character('my follower summary 3.5'),
        new Character('my follower summary 4.1'),
        new Character('my follower summary 4.2'),
        new Character('my follower summary 4.3'),
        new Character('my follower summary 4.4'),
        new Character('my follower summary 5.1'),
        new Character('my follower summary 5.2'),
        new Character('my follower summary 5.3'),
        new Character('my follower summary 6.1'),
        new Character('my follower summary 6.2'),
      ];
      leadershipServiceSpy.generateFollower.mockImplementation(() => getFakeDelay(followers[followerIndex++]));

      component.generateLeadership();

      await expectLeadershipGenerating(leadership, cohort, followers);
      expectFollowerCalls(followerQuantities);

      await vi.advanceTimersByTimeAsync(1);

      expect(component.leadership()).toBe(leadership);
      expect(component.cohort()).toBe(cohort);
      expect(component.followers()).toEqual(followers);
    });

    it('should download character', () => {
      const character = new Character('my character summary');
      component.character.set(character);

      leaderPipeSpy.transform.mockReturnValue('my formatted character');

      component.download();

      expect(leaderPipeSpy.transform).toHaveBeenCalledWith(character, null, null, []);
      expect(fileSaverServiceSpy.save).toHaveBeenCalledWith('my formatted character', 'my character summary');
    });

    it('should download leader', () => {
      const character = new Character('my leader summary');
      component.character.set(character);
      const leadership = new Leadership(3, [], 8);
      component.leadership.set(leadership);
      const cohort = new Character('my cohort summary');
      component.cohort.set(cohort);
      const followers = [
        new Character('my follower summary 1.1'),
        new Character('my follower summary 1.2'),
        new Character('my follower summary 1.3'),
        new Character('my follower summary 1.4'),
        new Character('my follower summary 1.5'),
        new Character('my follower summary 2.1'),
        new Character('my follower summary 2.2'),
        new Character('my follower summary 2.3'),
        new Character('my follower summary 2.4'),
        new Character('my follower summary 3.1'),
        new Character('my follower summary 3.2'),
        new Character('my follower summary 3.3'),
        new Character('my follower summary 4.1'),
        new Character('my follower summary 4.2'),
      ];
      component.followers.set(followers);

      leaderPipeSpy.transform.mockReturnValue('my formatted leader');

      component.download();

      expect(leaderPipeSpy.transform).toHaveBeenCalledWith(character, leadership, cohort, followers);
      expect(fileSaverServiceSpy.save).toHaveBeenCalledWith('my formatted leader', 'my leader summary');
    });

    it('should not download missing character', () => {
      component.character.set(null);

      component.download();
      
      expect(leaderPipeSpy.transform).not.toHaveBeenCalled();
      expect(fileSaverServiceSpy.save).not.toHaveBeenCalled();
    });
  });

});
