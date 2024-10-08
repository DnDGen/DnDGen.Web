import { ComponentFixture, fakeAsync, flush, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { CharacterGenComponent } from './charactergen.component';
import { AppModule } from '../../app.module';
import { SweetAlertService } from '../../shared/services/sweetAlert.service';
import { LoggerService } from '../../shared/services/logger.service';
import { Observable } from 'rxjs';
import { FileSaverService } from '../../shared/services/fileSaver.service';
import { By } from '@angular/platform-browser';
import * as FileSaver from 'file-saver';
import { CharacterService } from '../services/character.service';
import { LeadershipService } from '../services/leadership.service';
import { LeaderPipe } from '../pipes/leader.pipe';
import { CharacterGenViewModel } from '../models/charactergenViewModel.model';
import { Character } from '../models/character.model';
import { Leadership } from '../models/leadership.model';
import { FollowerQuantities } from '../models/followerQuantities.model';
import { LoadingComponent } from '../../shared/components/loading.component';
import { LeadershipComponent } from './leadership.component';
import { TestHelper } from '../../testHelper.spec';
import { Size } from '../../shared/components/size.enum';

describe('CharacterGenComponent', () => {
  describe('unit', () => {
    let component: CharacterGenComponent;
    let characterServiceSpy: jasmine.SpyObj<CharacterService>;
    let leadershipServiceSpy: jasmine.SpyObj<LeadershipService>;
    let leaderPipeSpy: jasmine.SpyObj<LeaderPipe>;
    let sweetAlertServiceSpy: jasmine.SpyObj<SweetAlertService>;
    let loggerServiceSpy: jasmine.SpyObj<LoggerService>;
    let fileSaverServiceSpy: jasmine.SpyObj<FileSaverService>;

    const delay = 10;
  
    beforeEach(() => {
      characterServiceSpy = jasmine.createSpyObj('CharacterService', ['getViewModel', 'generate', 'validate']);
      leadershipServiceSpy = jasmine.createSpyObj('LeadershipService', ['generate', 'generateCohort', 'generateFollower']);
      leaderPipeSpy = jasmine.createSpyObj('LeaderPipe', ['transform']);
      sweetAlertServiceSpy = jasmine.createSpyObj('SweetAlertService', ['showError']);
      loggerServiceSpy = jasmine.createSpyObj('LoggerService', ['logError']);
      fileSaverServiceSpy = jasmine.createSpyObj('FileSaverService', ['save']);

      component = new CharacterGenComponent(characterServiceSpy, leadershipServiceSpy, leaderPipeSpy, fileSaverServiceSpy, sweetAlertServiceSpy, loggerServiceSpy);
    });
  
    it(`should initialize the public properties`, () => {
      expect(component.generating).toBeFalse();
      expect(component.validating).toBeFalse();
      expect(component.valid).toBeFalse();
      expect(component.character).toBeFalsy();
      expect(component.leadership).toBeFalsy();
      expect(component.cohort).toBeFalsy();
      expect(component.followers).toEqual([]);
      expect(component.generatingMessage).toEqual('');
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
      expect(component.allowLevelAdjustments).toEqual(true);
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
      expect(component.allowLevelAdjustments).toEqual(true);
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

    function getViewModel(): CharacterGenViewModel {
      return new CharacterGenViewModel(
        ['alignment randomizer 1', 'alignment randomizer 2'],
        ['alignment 1', 'alignment 2'],
        ['class name randomizer 1', 'class name randomizer 2'],
        ['class name 1', 'class name 2'],
        ['level randomizer 1', 'level randomizer 2'],
        ['base race randomizer 1', 'base race randomizer 2'],
        ['base race 1', 'base race 2'],
        ['metarace randomizer 1', 'metarace randomizer 2'],
        ['metarace 1', 'metarace 2'],
        ['abilities randomizer 1', 'abilities randomizer 2'],
      );
    }

    it('should be validating while fetching the character model', fakeAsync(() => {
      const model = getViewModel();
      characterServiceSpy.getViewModel.and.callFake(() => getFakeDelay(model));
      characterServiceSpy.validate.and.callFake(() => getFakeDelay(true));

      component.ngOnInit();

      expect(component.characterModel).not.toBeDefined();
      
      expectInitialInputValues();

      expect(component.valid).toBeFalse();
      expect(component.validating).toBeTrue();
      
      tick(delay - 1);

      expect(component.characterModel).not.toBeDefined();

      expectInitialInputValues();

      expect(component.valid).toBeFalse();
      expect(component.validating).toBeTrue();
      
      tick(1);
      
      expect(component.characterModel).toEqual(model);
      
      expectDefaultInputValues();
      
      expect(component.valid).toBeFalse();
      expect(component.validating).toBeTrue();

      tick(delay - 1);

      expect(component.characterModel).toEqual(model);
      
      expectDefaultInputValues();
      
      expect(component.valid).toBeFalse();
      expect(component.validating).toBeTrue();

      flush();
    }));

    function getFakeDelay<T>(response: T): Observable<T> {
      return new Observable((observer) => {
        setTimeout(() => {
          observer.next(response);
          observer.complete();
        }, delay);
      });
    }

    let initValidations = [true, false];

    initValidations.forEach(test => {
      it(`should set the character model on init - validity: ${test}`, fakeAsync(() => {
        const model = getViewModel();
        characterServiceSpy.getViewModel.and.callFake(() => getFakeDelay(model));
        characterServiceSpy.validate.and.callFake(() => getFakeDelay(test));
  
        component.ngOnInit();
  
        expect(component.characterModel).not.toBeDefined();
        expect(component.validating).toBeTrue();
  
        tick(delay * 2);
  
        expect(component.characterModel).toEqual(model);
        expect(component.validating).toBeFalse();
  
        expectDefaultInputValues();
      
        expect(characterServiceSpy.validate).toHaveBeenCalledWith(
          'alignment randomizer 1',
          'alignment 1',
          'class name randomizer 1',
          'class name 1',
          'level randomizer 1',
          1,
          true,
          'base race randomizer 1',
          'base race 1',
          'metarace randomizer 1',
          false,
          'metarace 1'
        );

        expect(component.valid).toEqual(test);
        
        expect(loggerServiceSpy.logError).not.toHaveBeenCalled();
        expect(sweetAlertServiceSpy.showError).not.toHaveBeenCalled();
      }));
    });

    it('should display error from getting character model', fakeAsync(() => {
      characterServiceSpy.getViewModel.and.callFake(() => getFakeError('I failed'));
      characterServiceSpy.validate.and.callFake(() => getFakeDelay(true));

      component.ngOnInit();
      tick(delay * 2);

      expect(component.characterModel).not.toBeDefined();
      expect(component.character).toBeNull();
      expect(component.leadership).toBeNull();
      expect(component.cohort).toBeNull();
      expect(component.followers).toEqual([]);
      expect(component.generating).toBeFalse();
      expect(component.validating).toBeFalse();
      
      expect(loggerServiceSpy.logError).toHaveBeenCalledWith('I failed');
      expect(sweetAlertServiceSpy.showError).toHaveBeenCalledTimes(1);
    }));

    it('should display error from validating on init', fakeAsync(() => {
      const model = getViewModel();
      characterServiceSpy.getViewModel.and.callFake(() => getFakeDelay(model));
      characterServiceSpy.validate.and.callFake(() => getFakeError('I failed'));

      component.ngOnInit();
      tick(delay * 2);

      expect(component.characterModel).toEqual(model);
      expect(component.character).toBeNull();
      expect(component.leadership).toBeNull();
      expect(component.cohort).toBeNull();
      expect(component.followers).toEqual([]);
      expect(component.generating).toBeFalse();
      expect(component.validating).toBeFalse();
      
      expect(loggerServiceSpy.logError).toHaveBeenCalledWith('I failed');
      expect(sweetAlertServiceSpy.showError).toHaveBeenCalledTimes(1);
    }));

    function getFakeError<T>(message: string): Observable<T> {
      return new Observable((observer) => {
        setTimeout(() => {
          observer.error(new Error(message));
        }, delay);
      });
    }

    it('should validate randomizers - invalid if set level randomizer, but no set level', () => {
      setupOnInit();

      component.levelRandomizerType = 'Set';
      component.setLevel = 0;

      component.validateRandomizers();
      expect(component.validating).toBeFalse();
      expect(component.valid).toBeFalse();
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
      expect(component.validating).toBeFalse();
      expect(component.valid).toBeFalse();
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
      expect(component.validating).toBeFalse();
      expect(component.valid).toBeFalse();
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
      expect(component.validating).toBeFalse();
      expect(component.valid).toBeFalse();
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
      expect(component.validating).toBeFalse();
      expect(component.valid).toBeFalse();
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
      expect(component.validating).toBeFalse();
      expect(component.valid).toBeFalse();
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
      expect(component.validating).toBeFalse();
      expect(component.valid).toBeFalse();
    });

    const randomizerBooleans = [
      { a: true, l: true, m: true },
      { a: true, l: true, m: false },
      { a: true, l: false, m: true },
      { a: true, l: false, m: false },
      { a: false, l: true, m: true },
      { a: false, l: true, m: false },
      { a: false, l: false, m: true },
      { a: false, l: false, m: false },
    ];

    randomizerBooleans.forEach(test => {
      it(`should be validating while validating the randomizers - level ${test.l}, metarace ${test.m}, abilities ${test.a}`, fakeAsync(() => {
        setupOnInit();

        characterServiceSpy.validate.and.callFake(() => getFakeDelay(true));
  
        component.alignmentRandomizerType = 'my alignment randomizer';
        component.setAlignment = 'my alignment';
        component.classNameRandomizerType = 'my class name randomizer';
        component.setClassName = 'my class name';
        component.levelRandomizerType = 'my level randomizer';
        component.setLevel = 9266;
        component.allowLevelAdjustments = test.l;
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
          test.l,
          'my base race randomizer',
          'my base race',
          'my metarace randomizer',
          test.m,
          'my metarace');
        expect(component.validating).toBeTrue();
        
        tick(delay - 1);
  
        expect(component.validating).toBeTrue();
  
        flush();
      }));
  
      it(`should validate valid randomizers - level ${test.l}, metarace ${test.m}, abilities ${test.a}`, fakeAsync(() => {
        setupOnInit();

        characterServiceSpy.validate.and.callFake(() => getFakeDelay(true));
  
        component.alignmentRandomizerType = 'my alignment randomizer';
        component.setAlignment = 'my alignment';
        component.classNameRandomizerType = 'my class name randomizer';
        component.setClassName = 'my class name';
        component.levelRandomizerType = 'my level randomizer';
        component.setLevel = 9266;
        component.allowLevelAdjustments = test.l;
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
          test.l,
          'my base race randomizer',
          'my base race',
          'my metarace randomizer',
          test.m,
          'my metarace');
        expect(component.validating).toBeTrue();
  
        tick(delay);
  
        expect(component.valid).toBeTrue();
        expect(component.validating).toBeFalse();
        
        expect(loggerServiceSpy.logError).not.toHaveBeenCalled();
        expect(sweetAlertServiceSpy.showError).not.toHaveBeenCalled();
      }));
  
      it(`should validate invalid randomizers - level ${test.l}, metarace ${test.m}, abilities ${test.a}`, fakeAsync(() => {
        setupOnInit();

        characterServiceSpy.validate.and.callFake(() => getFakeDelay(false));
  
        component.alignmentRandomizerType = 'my alignment randomizer';
        component.setAlignment = 'my alignment';
        component.classNameRandomizerType = 'my class name randomizer';
        component.setClassName = 'my class name';
        component.levelRandomizerType = 'my level randomizer';
        component.setLevel = 9266;
        component.allowLevelAdjustments = test.l;
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
          test.l,
          'my base race randomizer',
          'my base race',
          'my metarace randomizer',
          test.m,
          'my metarace');
        expect(component.validating).toBeTrue();
  
        tick(delay);
  
        expect(component.valid).toBeFalse();
        expect(component.validating).toBeFalse();
        
        expect(loggerServiceSpy.logError).not.toHaveBeenCalled();
        expect(sweetAlertServiceSpy.showError).not.toHaveBeenCalled();
      }));
  
      it(`should display error from validating randomizers - level ${test.l}, metarace ${test.m}, abilities ${test.a}`, fakeAsync(() => {
        setupOnInit();

        characterServiceSpy.validate.and.callFake(() => getFakeError('I failed'));
  
        component.alignmentRandomizerType = 'my alignment randomizer';
        component.setAlignment = 'my alignment';
        component.classNameRandomizerType = 'my class name randomizer';
        component.setClassName = 'my class name';
        component.levelRandomizerType = 'my level randomizer';
        component.setLevel = 9266;
        component.allowLevelAdjustments = test.l;
        component.baseRaceRandomizerType = 'my base race randomizer';
        component.setBaseRace = 'my base race';
        component.metaraceRandomizerType = 'my metarace randomizer';
        component.setMetarace = 'my metarace';
        component.forceMetarace = test.m;

        component.validateRandomizers();

        tick(delay);
  
        expect(component.valid).toBeFalse();
        expect(component.character).toBeNull();
        expect(component.leadership).toBeNull();
        expect(component.cohort).toBeNull();
        expect(component.followers).toEqual([]);
        expect(component.generating).toBeFalse();
        expect(component.validating).toBeFalse();
        
        expect(characterServiceSpy.validate).toHaveBeenCalledWith(
          'my alignment randomizer',
          'my alignment',
          'my class name randomizer',
          'my class name',
          'my level randomizer',
          9266,
          test.l,
          'my base race randomizer',
          'my base race',
          'my metarace randomizer',
          test.m,
          'my metarace');
        expect(loggerServiceSpy.logError).toHaveBeenCalledWith('I failed');
        expect(sweetAlertServiceSpy.showError).toHaveBeenCalledTimes(1);
      }));
      
      it(`should be generating while generating character - level ${test.l}, metarace ${test.m}, abilities ${test.a}`, fakeAsync(() => {
        setupOnInit();

        const character = new Character('my character summary');
        characterServiceSpy.generate.and.callFake(() => getFakeDelay(character));

        component.alignmentRandomizerType = 'my alignment randomizer';
        component.setAlignment = 'my alignment';
        component.classNameRandomizerType = 'my class name randomizer';
        component.setClassName = 'my class name';
        component.levelRandomizerType = 'my level randomizer';
        component.setLevel = 9266;
        component.allowLevelAdjustments = test.l;
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
          test.l,
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

        expect(component.generating).toBeTrue();
        expect(component.generatingMessage).toEqual('Generating character...');
        expect(component.character).toBeNull();
        expect(component.leadership).toBeNull();
        expect(component.cohort).toBeNull();
        expect(component.followers).toEqual([]);
        
        tick(delay - 1);

        expect(component.generating).toBeTrue();
        expect(component.generatingMessage).toEqual('Generating character...');
        expect(component.character).toBeNull();
        expect(component.leadership).toBeNull();
        expect(component.cohort).toBeNull();
        expect(component.followers).toEqual([]);

        flush();
      }));
      
      it(`should be generating while generating character - leader without cohort or followers - level ${test.l}, metarace ${test.m}, abilities ${test.a}`, fakeAsync(() => {
        setupOnInit();

        const character = new Character('my character summary');
        character.isLeader = true;
        character.class.level = 7;
        character.abilities.Charisma.bonus = 8;
        character.magic.animal = 'my animal';
        character.alignment.full = 'my leader alignment';
        character.class.name = 'my leader class';
        characterServiceSpy.generate.and.callFake(() => getFakeDelay(character));
        
        const leadership = new Leadership(2, [], 1);
        leadershipServiceSpy.generate.and.callFake(() => getFakeDelay(leadership));
        leadershipServiceSpy.generateCohort.and.callFake(() => getFakeDelay(null));

        component.alignmentRandomizerType = 'my alignment randomizer';
        component.setAlignment = 'my alignment';
        component.classNameRandomizerType = 'my class name randomizer';
        component.setClassName = 'my class name';
        component.levelRandomizerType = 'my level randomizer';
        component.setLevel = 9266;
        component.allowLevelAdjustments = test.l;
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
          test.l,
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

        expect(component.generating).toBeTrue();
        expect(component.generatingMessage).toEqual('Generating character...');
        expect(component.character).toBeNull();
        expect(component.leadership).toBeNull();
        expect(component.cohort).toBeNull();
        expect(component.followers).toEqual([]);
        
        tick(delay - 1);

        expect(component.generating).toBeTrue();
        expect(component.generatingMessage).toEqual('Generating character...');
        expect(component.character).toBeNull();
        expect(component.leadership).toBeNull();
        expect(component.cohort).toBeNull();
        expect(component.followers).toEqual([]);

        tick(1);

        expect(component.character).toBe(character);
        expect(component.leaderAlignment).toEqual('my leader alignment');
        expect(component.leaderAnimal).toEqual('my animal');
        expect(component.leaderCharismaBonus).toEqual(8);
        expect(component.leaderClassName).toEqual('my leader class');
        expect(component.leaderLevel).toEqual(7);

        expectLeadershipGenerating(leadership, null, []);

        flush();
      }));
      
      it(`should be generating while generating character - leader with cohort but without followers - level ${test.l}, metarace ${test.m}, abilities ${test.a}`, fakeAsync(() => {
        setupOnInit();

        const character = new Character('my character summary');
        character.isLeader = true;
        character.class.level = 7;
        character.abilities.Charisma.bonus = 8;
        character.magic.animal = 'my animal';
        character.alignment.full = 'my leader alignment';
        character.class.name = 'my leader class';
        characterServiceSpy.generate.and.callFake(() => getFakeDelay(character));
        
        const leadership = new Leadership(3, [], 8);
        leadershipServiceSpy.generate.and.callFake(() => getFakeDelay(leadership));

        const cohort = new Character('my cohort summary');
        leadershipServiceSpy.generateCohort.and.callFake(() => getFakeDelay(cohort));

        component.alignmentRandomizerType = 'my alignment randomizer';
        component.setAlignment = 'my alignment';
        component.classNameRandomizerType = 'my class name randomizer';
        component.setClassName = 'my class name';
        component.levelRandomizerType = 'my level randomizer';
        component.setLevel = 9266;
        component.allowLevelAdjustments = test.l;
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
          test.l,
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

        expect(component.generating).toBeTrue();
        expect(component.generatingMessage).toEqual('Generating character...');
        expect(component.character).toBeNull();
        expect(component.leadership).toBeNull();
        expect(component.cohort).toBeNull();
        expect(component.followers).toEqual([]);
        
        tick(delay - 1);

        expect(component.generating).toBeTrue();
        expect(component.generatingMessage).toEqual('Generating character...');
        expect(component.character).toBeNull();
        expect(component.leadership).toBeNull();
        expect(component.cohort).toBeNull();
        expect(component.followers).toEqual([]);

        tick(1);

        expect(component.character).toBe(character);
        expect(component.leaderAlignment).toEqual('my leader alignment');
        expect(component.leaderAnimal).toEqual('my animal');
        expect(component.leaderCharismaBonus).toEqual(8);
        expect(component.leaderClassName).toEqual('my leader class');
        expect(component.leaderLevel).toEqual(7);

        expectLeadershipGenerating(leadership, cohort, []);

        flush();
      }));
      
      it(`should be generating while generating character - leader with cohort and followers <= lvl 1 - level ${test.l}, metarace ${test.m}, abilities ${test.a}`, fakeAsync(() => {
        setupOnInit();

        const character = new Character('my character summary');
        character.isLeader = true;
        character.class.level = 7;
        character.abilities.Charisma.bonus = 8;
        character.magic.animal = 'my animal';
        character.alignment.full = 'my leader alignment';
        character.class.name = 'my leader class';
        characterServiceSpy.generate.and.callFake(() => getFakeDelay(character));
        
        const followerQuantities = new FollowerQuantities(2);
        const leadership = new Leadership(3, [], 8, followerQuantities);
        leadershipServiceSpy.generate.and.callFake(() => getFakeDelay(leadership));

        const cohort = new Character('my cohort summary');
        leadershipServiceSpy.generateCohort.and.callFake(() => getFakeDelay(cohort));

        let followerIndex = 0;
        const followers = [
          new Character('my follower summary 1.1'),
          new Character('my follower summary 1.2'),
        ];
        leadershipServiceSpy.generateFollower.and.callFake(() => getFakeDelay(followers[followerIndex++]));

        component.alignmentRandomizerType = 'my alignment randomizer';
        component.setAlignment = 'my alignment';
        component.classNameRandomizerType = 'my class name randomizer';
        component.setClassName = 'my class name';
        component.levelRandomizerType = 'my level randomizer';
        component.setLevel = 9266;
        component.allowLevelAdjustments = test.l;
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
          test.l,
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

        expect(component.generating).toBeTrue();
        expect(component.generatingMessage).toEqual('Generating character...');
        expect(component.character).toBeNull();
        expect(component.leadership).toBeNull();
        expect(component.cohort).toBeNull();
        expect(component.followers).toEqual([]);
        
        tick(delay - 1);

        expect(component.generating).toBeTrue();
        expect(component.generatingMessage).toEqual('Generating character...');
        expect(component.character).toBeNull();
        expect(component.leadership).toBeNull();
        expect(component.cohort).toBeNull();
        expect(component.followers).toEqual([]);

        tick(1);

        expect(component.character).toBe(character);
        expect(component.leaderAlignment).toEqual('my leader alignment');
        expect(component.leaderAnimal).toEqual('my animal');
        expect(component.leaderCharismaBonus).toEqual(8);
        expect(component.leaderClassName).toEqual('my leader class');
        expect(component.leaderLevel).toEqual(7);

        expectLeadershipGenerating(leadership, cohort, followers);
        expectFollowerCalls(followerQuantities);

        flush();
      }));
      
      it(`should be generating while generating character - leader with cohort and followers <= lvl 2 - level ${test.l}, metarace ${test.m}, abilities ${test.a}`, fakeAsync(() => {
        setupOnInit();

        const character = new Character('my character summary');
        character.isLeader = true;
        character.class.level = 7;
        character.abilities.Charisma.bonus = 8;
        character.magic.animal = 'my animal';
        character.alignment.full = 'my leader alignment';
        character.class.name = 'my leader class';
        characterServiceSpy.generate.and.callFake(() => getFakeDelay(character));
        
        const followerQuantities = new FollowerQuantities(3, 2);
        const leadership = new Leadership(3, [], 8, followerQuantities);
        leadershipServiceSpy.generate.and.callFake(() => getFakeDelay(leadership));

        const cohort = new Character('my cohort summary');
        leadershipServiceSpy.generateCohort.and.callFake(() => getFakeDelay(cohort));

        let followerIndex = 0;
        const followers = [
          new Character('my follower summary 1.1'),
          new Character('my follower summary 1.2'),
          new Character('my follower summary 1.3'),
          new Character('my follower summary 2.1'),
          new Character('my follower summary 2.2'),
        ];
        leadershipServiceSpy.generateFollower.and.callFake(() => getFakeDelay(followers[followerIndex++]));

        component.alignmentRandomizerType = 'my alignment randomizer';
        component.setAlignment = 'my alignment';
        component.classNameRandomizerType = 'my class name randomizer';
        component.setClassName = 'my class name';
        component.levelRandomizerType = 'my level randomizer';
        component.setLevel = 9266;
        component.allowLevelAdjustments = test.l;
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
          test.l,
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

        expect(component.generating).toBeTrue();
        expect(component.generatingMessage).toEqual('Generating character...');
        expect(component.character).toBeNull();
        expect(component.leadership).toBeNull();
        expect(component.cohort).toBeNull();
        expect(component.followers).toEqual([]);
        
        tick(delay - 1);

        expect(component.generating).toBeTrue();
        expect(component.generatingMessage).toEqual('Generating character...');
        expect(component.character).toBeNull();
        expect(component.leadership).toBeNull();
        expect(component.cohort).toBeNull();
        expect(component.followers).toEqual([]);

        tick(1);

        expect(component.character).toBe(character);
        expect(component.leaderAlignment).toEqual('my leader alignment');
        expect(component.leaderAnimal).toEqual('my animal');
        expect(component.leaderCharismaBonus).toEqual(8);
        expect(component.leaderClassName).toEqual('my leader class');
        expect(component.leaderLevel).toEqual(7);

        expectLeadershipGenerating(leadership, cohort, followers);
        expectFollowerCalls(followerQuantities);

        flush();
      }));
      
      it(`should be generating while generating character - leader with cohort and followers <= lvl 3 - level ${test.l}, metarace ${test.m}, abilities ${test.a}`, fakeAsync(() => {
        setupOnInit();

        const character = new Character('my character summary');
        character.isLeader = true;
        character.class.level = 7;
        character.abilities.Charisma.bonus = 8;
        character.magic.animal = 'my animal';
        character.alignment.full = 'my leader alignment';
        character.class.name = 'my leader class';
        characterServiceSpy.generate.and.callFake(() => getFakeDelay(character));
        
        const followerQuantities = new FollowerQuantities(4, 3, 2);
        const leadership = new Leadership(3, [], 8, followerQuantities);
        leadershipServiceSpy.generate.and.callFake(() => getFakeDelay(leadership));

        const cohort = new Character('my cohort summary');
        leadershipServiceSpy.generateCohort.and.callFake(() => getFakeDelay(cohort));

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
        leadershipServiceSpy.generateFollower.and.callFake(() => getFakeDelay(followers[followerIndex++]));

        component.alignmentRandomizerType = 'my alignment randomizer';
        component.setAlignment = 'my alignment';
        component.classNameRandomizerType = 'my class name randomizer';
        component.setClassName = 'my class name';
        component.levelRandomizerType = 'my level randomizer';
        component.setLevel = 9266;
        component.allowLevelAdjustments = test.l;
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
          test.l,
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

        expect(component.generating).toBeTrue();
        expect(component.generatingMessage).toEqual('Generating character...');
        expect(component.character).toBeNull();
        expect(component.leadership).toBeNull();
        expect(component.cohort).toBeNull();
        expect(component.followers).toEqual([]);
        
        tick(delay - 1);

        expect(component.generating).toBeTrue();
        expect(component.generatingMessage).toEqual('Generating character...');
        expect(component.character).toBeNull();
        expect(component.leadership).toBeNull();
        expect(component.cohort).toBeNull();
        expect(component.followers).toEqual([]);

        tick(1);

        expect(component.character).toBe(character);
        expect(component.leaderAlignment).toEqual('my leader alignment');
        expect(component.leaderAnimal).toEqual('my animal');
        expect(component.leaderCharismaBonus).toEqual(8);
        expect(component.leaderClassName).toEqual('my leader class');
        expect(component.leaderLevel).toEqual(7);

        expectLeadershipGenerating(leadership, cohort, followers);
        expectFollowerCalls(followerQuantities);

        flush();
      }));
      
      it(`should be generating while generating character - leader with cohort and followers <= lvl 4 - level ${test.l}, metarace ${test.m}, abilities ${test.a}`, fakeAsync(() => {
        setupOnInit();

        const character = new Character('my character summary');
        character.isLeader = true;
        character.class.level = 7;
        character.abilities.Charisma.bonus = 8;
        character.magic.animal = 'my animal';
        character.alignment.full = 'my leader alignment';
        character.class.name = 'my leader class';
        characterServiceSpy.generate.and.callFake(() => getFakeDelay(character));
        
        const followerQuantities = new FollowerQuantities(5, 4, 3, 2);
        const leadership = new Leadership(3, [], 8, followerQuantities);
        leadershipServiceSpy.generate.and.callFake(() => getFakeDelay(leadership));

        const cohort = new Character('my cohort summary');
        leadershipServiceSpy.generateCohort.and.callFake(() => getFakeDelay(cohort));

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
        leadershipServiceSpy.generateFollower.and.callFake(() => getFakeDelay(followers[followerIndex++]));

        component.alignmentRandomizerType = 'my alignment randomizer';
        component.setAlignment = 'my alignment';
        component.classNameRandomizerType = 'my class name randomizer';
        component.setClassName = 'my class name';
        component.levelRandomizerType = 'my level randomizer';
        component.setLevel = 9266;
        component.allowLevelAdjustments = test.l;
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
          test.l,
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

        expect(component.generating).toBeTrue();
        expect(component.generatingMessage).toEqual('Generating character...');
        expect(component.character).toBeNull();
        expect(component.leadership).toBeNull();
        expect(component.cohort).toBeNull();
        expect(component.followers).toEqual([]);
        
        tick(delay - 1);

        expect(component.generating).toBeTrue();
        expect(component.generatingMessage).toEqual('Generating character...');
        expect(component.character).toBeNull();
        expect(component.leadership).toBeNull();
        expect(component.cohort).toBeNull();
        expect(component.followers).toEqual([]);

        tick(1);

        expect(component.character).toBe(character);
        expect(component.leaderAlignment).toEqual('my leader alignment');
        expect(component.leaderAnimal).toEqual('my animal');
        expect(component.leaderCharismaBonus).toEqual(8);
        expect(component.leaderClassName).toEqual('my leader class');
        expect(component.leaderLevel).toEqual(7);

        expectLeadershipGenerating(leadership, cohort, followers);
        expectFollowerCalls(followerQuantities);

        flush();
      }));
      
      it(`should be generating while generating character - leader with cohort and followers <= lvl 5 - level ${test.l}, metarace ${test.m}, abilities ${test.a}`, fakeAsync(() => {
        setupOnInit();

        const character = new Character('my character summary');
        character.isLeader = true;
        character.class.level = 7;
        character.abilities.Charisma.bonus = 8;
        character.magic.animal = 'my animal';
        character.alignment.full = 'my leader alignment';
        character.class.name = 'my leader class';
        characterServiceSpy.generate.and.callFake(() => getFakeDelay(character));
        
        const followerQuantities = new FollowerQuantities(6, 5, 4, 3, 2);
        const leadership = new Leadership(3, [], 8, followerQuantities);
        leadershipServiceSpy.generate.and.callFake(() => getFakeDelay(leadership));

        const cohort = new Character('my cohort summary');
        leadershipServiceSpy.generateCohort.and.callFake(() => getFakeDelay(cohort));

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
        leadershipServiceSpy.generateFollower.and.callFake(() => getFakeDelay(followers[followerIndex++]));

        component.alignmentRandomizerType = 'my alignment randomizer';
        component.setAlignment = 'my alignment';
        component.classNameRandomizerType = 'my class name randomizer';
        component.setClassName = 'my class name';
        component.levelRandomizerType = 'my level randomizer';
        component.setLevel = 9266;
        component.allowLevelAdjustments = test.l;
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
          test.l,
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

        expect(component.generating).toBeTrue();
        expect(component.generatingMessage).toEqual('Generating character...');
        expect(component.character).toBeNull();
        expect(component.leadership).toBeNull();
        expect(component.cohort).toBeNull();
        expect(component.followers).toEqual([]);
        
        tick(delay - 1);

        expect(component.generating).toBeTrue();
        expect(component.generatingMessage).toEqual('Generating character...');
        expect(component.character).toBeNull();
        expect(component.leadership).toBeNull();
        expect(component.cohort).toBeNull();
        expect(component.followers).toEqual([]);

        tick(1);

        expect(component.character).toBe(character);
        expect(component.leaderAlignment).toEqual('my leader alignment');
        expect(component.leaderAnimal).toEqual('my animal');
        expect(component.leaderCharismaBonus).toEqual(8);
        expect(component.leaderClassName).toEqual('my leader class');
        expect(component.leaderLevel).toEqual(7);

        expectLeadershipGenerating(leadership, cohort, followers);
        expectFollowerCalls(followerQuantities);

        flush();
      }));
      
      it(`should be generating while generating character - leader with cohort and followers <= lvl 6 - level ${test.l}, metarace ${test.m}, abilities ${test.a}`, fakeAsync(() => {
        setupOnInit();

        const character = new Character('my character summary');
        character.isLeader = true;
        character.class.level = 7;
        character.abilities.Charisma.bonus = 8;
        character.magic.animal = 'my animal';
        character.alignment.full = 'my leader alignment';
        character.class.name = 'my leader class';
        characterServiceSpy.generate.and.callFake(() => getFakeDelay(character));
        
        const followerQuantities = new FollowerQuantities(7, 6, 5, 4, 3, 2);
        const leadership = new Leadership(3, [], 8, followerQuantities);
        leadershipServiceSpy.generate.and.callFake(() => getFakeDelay(leadership));

        const cohort = new Character('my cohort summary');
        leadershipServiceSpy.generateCohort.and.callFake(() => getFakeDelay(cohort));

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
        leadershipServiceSpy.generateFollower.and.callFake(() => getFakeDelay(followers[followerIndex++]));

        component.alignmentRandomizerType = 'my alignment randomizer';
        component.setAlignment = 'my alignment';
        component.classNameRandomizerType = 'my class name randomizer';
        component.setClassName = 'my class name';
        component.levelRandomizerType = 'my level randomizer';
        component.setLevel = 9266;
        component.allowLevelAdjustments = test.l;
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
          test.l,
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

        expect(component.generating).toBeTrue();
        expect(component.generatingMessage).toEqual('Generating character...');
        expect(component.character).toBeNull();
        expect(component.leadership).toBeNull();
        expect(component.cohort).toBeNull();
        expect(component.followers).toEqual([]);
        
        tick(delay - 1);

        expect(component.generating).toBeTrue();
        expect(component.generatingMessage).toEqual('Generating character...');
        expect(component.character).toBeNull();
        expect(component.leadership).toBeNull();
        expect(component.cohort).toBeNull();
        expect(component.followers).toEqual([]);

        tick(1);

        expect(component.character).toBe(character);
        expect(component.leaderAlignment).toEqual('my leader alignment');
        expect(component.leaderAnimal).toEqual('my animal');
        expect(component.leaderCharismaBonus).toEqual(8);
        expect(component.leaderClassName).toEqual('my leader class');
        expect(component.leaderLevel).toEqual(7);

        expectLeadershipGenerating(leadership, cohort, followers);
        expectFollowerCalls(followerQuantities);

        flush();
      }));
    });

    function setupOnInit() {
      component.characterModel = getViewModel();

      component.alignmentRandomizerType = component.characterModel.alignmentRandomizerTypes[0];
      component.setAlignment = component.characterModel.alignments[0];
  
      component.classNameRandomizerType = component.characterModel.classNameRandomizerTypes[0];
      component.setClassName = component.characterModel.classNames[0];
  
      component.levelRandomizerType = component.characterModel.levelRandomizerTypes[0];
  
      component.baseRaceRandomizerType = component.characterModel.baseRaceRandomizerTypes[0];
      component.setBaseRace = component.characterModel.baseRaces[0];
  
      component.metaraceRandomizerType = component.characterModel.metaraceRandomizerTypes[0];
      component.setMetarace = component.characterModel.metaraces[0];
  
      component.abilitiesRandomizerType = component.characterModel.abilitiesRandomizerTypes[0];
      
      component.leaderAlignment = component.characterModel.alignments[0];
      component.leaderClassName = component.characterModel.classNames[0];

      component.valid = true;
    }

    it('should generate the default character', fakeAsync(() => {
      setupOnInit();

      let character = new Character('my character summary');
      characterServiceSpy.generate.and.callFake(() => getFakeDelay(character));

      component.generateCharacter();

      expect(characterServiceSpy.generate).toHaveBeenCalledWith(
        'alignment randomizer 1',
        'alignment 1',
        'class name randomizer 1',
        'class name 1',
        'level randomizer 1',
        1,
        true,
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
      expect(component.generating).toBeTrue();

      tick(delay);

      expect(component.character).toBe(character);
      expect(component.generating).toBeFalse();
      
      expect(loggerServiceSpy.logError).not.toHaveBeenCalled();
      expect(sweetAlertServiceSpy.showError).not.toHaveBeenCalled();
    }));

    it(`should generate a non-default character`, fakeAsync(() => {
      setupOnInit();

      let character = new Character('my character summary');
      characterServiceSpy.generate.and.callFake(() => getFakeDelay(character));

      component.alignmentRandomizerType = component.characterModel.alignmentRandomizerTypes[1];
      component.setAlignment = component.characterModel.alignments[1];
      component.classNameRandomizerType = component.characterModel.classNameRandomizerTypes[1];
      component.setClassName = component.characterModel.classNames[1];
      component.levelRandomizerType = component.characterModel.levelRandomizerTypes[1];
      component.setLevel = 9266;
      component.allowLevelAdjustments = false;
      component.baseRaceRandomizerType = component.characterModel.baseRaceRandomizerTypes[1];
      component.setBaseRace = component.characterModel.baseRaces[1];
      component.metaraceRandomizerType = component.characterModel.metaraceRandomizerTypes[1];
      component.setMetarace = component.characterModel.metaraces[1];
      component.forceMetarace = true;
      component.abilitiesRandomizerType = component.characterModel.abilitiesRandomizerTypes[1];
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
        false,
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
      expect(component.generating).toBeTrue();

      tick(delay);

      expect(component.character).toBe(character);
      expect(component.generating).toBeFalse();
      
      expect(loggerServiceSpy.logError).not.toHaveBeenCalled();
      expect(sweetAlertServiceSpy.showError).not.toHaveBeenCalled();
    }));

    it('should display error from generating character', fakeAsync(() => {
      setupOnInit();

      characterServiceSpy.generate.and.callFake(() => getFakeError('I failed'));

      component.generateCharacter();
      tick(delay);

      expect(component.character).toBeNull();
      expect(component.leadership).toBeNull();
      expect(component.cohort).toBeNull();
      expect(component.followers).toEqual([]);
      expect(component.generating).toBeFalse();
      expect(component.validating).toBeFalse();
      
      expect(loggerServiceSpy.logError).toHaveBeenCalledWith('I failed');
      expect(sweetAlertServiceSpy.showError).toHaveBeenCalledTimes(1);
    }));

    it('should display error from generating leadership', fakeAsync(() => {
      setupOnInit();

      let character = new Character('my character summary');
      character.isLeader = true;
      character.class.level = 7;
      character.abilities.Charisma.bonus = 8;
      character.magic.animal = 'my animal';
      character.alignment.full = 'my leader alignment';
      character.class.name = 'my leader class';
      characterServiceSpy.generate.and.callFake(() => getFakeDelay(character));
      leadershipServiceSpy.generate.and.callFake(() => getFakeError('I failed'));

      component.generateCharacter();
      tick(delay * 2);

      expect(component.character).toBeNull();
      expect(component.leadership).toBeNull();
      expect(component.cohort).toBeNull();
      expect(component.followers).toEqual([]);
      expect(component.generating).toBeFalse();
      expect(component.validating).toBeFalse();
      
      expect(loggerServiceSpy.logError).toHaveBeenCalledWith('I failed');
      expect(sweetAlertServiceSpy.showError).toHaveBeenCalledTimes(1);
    }));

    it('should display error from generating cohort', fakeAsync(() => {
      setupOnInit();

      const character = new Character('my character summary');
      character.isLeader = true;
      character.class.level = 7;
      character.abilities.Charisma.bonus = 8;
      character.magic.animal = 'my animal';
      character.alignment.full = 'my leader alignment';
      character.class.name = 'my leader class';
      characterServiceSpy.generate.and.callFake(() => getFakeDelay(character));

      const followerQuantities = new FollowerQuantities(7, 6, 5, 4, 3, 2);
      const leadership = new Leadership(3, [], 8, followerQuantities);
      leadershipServiceSpy.generate.and.callFake(() => getFakeDelay(leadership));
      leadershipServiceSpy.generateCohort.and.callFake(() => getFakeError('I failed'));

      component.generateCharacter();
      tick(delay * 3);

      expect(component.character).toBeNull();
      expect(component.leadership).toBeNull();
      expect(component.cohort).toBeNull();
      expect(component.followers).toEqual([]);
      expect(component.generating).toBeFalse();
      expect(component.validating).toBeFalse();
      
      expect(loggerServiceSpy.logError).toHaveBeenCalledWith('I failed');
      expect(sweetAlertServiceSpy.showError).toHaveBeenCalledTimes(1);
    }));

    it('should display error from generating follower', fakeAsync(() => {
      setupOnInit();

      const character = new Character('my character summary');
      character.isLeader = true;
      character.class.level = 7;
      character.abilities.Charisma.bonus = 8;
      character.magic.animal = 'my animal';
      character.alignment.full = 'my leader alignment';
      character.class.name = 'my leader class';
      characterServiceSpy.generate.and.callFake(() => getFakeDelay(character));

      const followerQuantities = new FollowerQuantities(7, 6, 5, 4, 3, 2);
      const leadership = new Leadership(3, [], 8, followerQuantities);
      leadershipServiceSpy.generate.and.callFake(() => getFakeDelay(leadership));
      
      const cohort = new Character('my cohort summary');
      leadershipServiceSpy.generateCohort.and.callFake(() => getFakeDelay(cohort));
      
      const follower = new Character('my follower summary');
      leadershipServiceSpy.generateFollower.and.callFake(() => getFakeError('I failed'));

      component.generateCharacter();
      tick(delay * 4);

      expect(component.character).toBeNull();
      expect(component.leadership).toBeNull();
      expect(component.cohort).toBeNull();
      expect(component.followers).toEqual([]);
      expect(component.generating).toBeFalse();
      expect(component.validating).toBeFalse();
      
      expect(loggerServiceSpy.logError).toHaveBeenCalledWith('I failed');
      expect(sweetAlertServiceSpy.showError).toHaveBeenCalledTimes(1);
    }));

    it('should display error from generating any follower', fakeAsync(() => {
      setupOnInit();

      const character = new Character('my character summary');
      character.isLeader = true;
      character.class.level = 7;
      character.abilities.Charisma.bonus = 8;
      character.magic.animal = 'my animal';
      character.alignment.full = 'my leader alignment';
      character.class.name = 'my leader class';
      characterServiceSpy.generate.and.callFake(() => getFakeDelay(character));

      const followerQuantities = new FollowerQuantities(7, 6, 5, 4, 3, 2);
      const leadership = new Leadership(3, [], 8, followerQuantities);
      leadershipServiceSpy.generate.and.callFake(() => getFakeDelay(leadership));
      
      const cohort = new Character('my cohort summary');
      leadershipServiceSpy.generateCohort.and.callFake(() => getFakeDelay(cohort));
      
      const follower = new Character('my follower summary');
      leadershipServiceSpy.generateFollower.and.returnValues(getFakeDelay(follower), getFakeError('I failed'));

      component.generateCharacter();
      tick(delay * 5);

      expect(component.character).toBeNull();
      expect(component.leadership).toBeNull();
      expect(component.cohort).toBeNull();
      expect(component.followers).toEqual([]);
      expect(component.generating).toBeFalse();
      expect(component.validating).toBeFalse();
      
      expect(loggerServiceSpy.logError).toHaveBeenCalledWith('I failed');
      expect(sweetAlertServiceSpy.showError).toHaveBeenCalledTimes(1);
    }));
      
    it(`should be generating while generating leadership - without cohort or followers`, fakeAsync(() => {
      setupOnInit();

      component.leaderLevel = 7;
      component.leaderCharismaBonus = 8;
      component.leaderAnimal = 'my animal';
      component.leaderAlignment = 'my leader alignment';
      component.leaderClassName = 'my leader class';
      
      const leadership = new Leadership(2, [], 1);
      leadershipServiceSpy.generate.and.callFake(() => getFakeDelay(leadership));
      leadershipServiceSpy.generateCohort.and.callFake(() => getFakeDelay(null));

      component.generateLeadership();

      expectLeadershipGenerating(leadership, null, []);

      flush();
    }));

    function expectLeadershipGenerating(leadership: Leadership, cohort: Character | null, followers: Character[]) {
      expect(leadershipServiceSpy.generate).toHaveBeenCalledWith(7, 8, 'my animal');
      expect(leadershipServiceSpy.generate).toHaveBeenCalledTimes(1);
      expect(leadershipServiceSpy.generateCohort).not.toHaveBeenCalled();
      expect(leadershipServiceSpy.generateFollower).not.toHaveBeenCalled();

      expect(component.generating).toBeTrue();
      expect(component.generatingMessage).toEqual('Generating leadership...');
      expect(component.leadership).toBeNull();
      expect(component.cohort).toBeNull();
      expect(component.followers).toEqual([]);
      
      tick(delay - 1);

      expect(component.generating).toBeTrue();
      expect(component.generatingMessage).toEqual('Generating leadership...');
      expect(component.leadership).toBeNull();
      expect(component.cohort).toBeNull();
      expect(component.followers).toEqual([]);

      tick(1);

      expect(leadershipServiceSpy.generate).toHaveBeenCalledTimes(1);
      expect(leadershipServiceSpy.generateCohort).toHaveBeenCalledWith(7, leadership.cohortScore, 'my leader alignment', 'my leader class');
      expect(leadershipServiceSpy.generateCohort).toHaveBeenCalledTimes(1);
      expect(leadershipServiceSpy.generateFollower).not.toHaveBeenCalled();

      expect(component.generating).toBeTrue();
      expect(component.generatingMessage).toEqual('Generating cohort...');
      expect(component.leadership).toBe(leadership);
      expect(component.cohort).toBeNull();
      expect(component.followers).toEqual([]);
      
      tick(delay - 1);

      expect(component.generating).toBeTrue();
      expect(component.generatingMessage).toEqual('Generating cohort...');
      expect(component.leadership).toBe(leadership);
      expect(component.cohort).toBeNull();
      expect(component.followers).toEqual([]);

      const followerCount = followers.length;

      if (!followerCount) {
        return;
      }
      
      for(let i = 0; i < followerCount; i++) {
        const message = `Generating follower ${i + 1} of ${followerCount}...`;

        tick(1);

        expect(leadershipServiceSpy.generate).toHaveBeenCalledTimes(1);
        expect(leadershipServiceSpy.generateCohort).toHaveBeenCalledTimes(1);
        expect(leadershipServiceSpy.generateFollower.calls.count()).toBe(i + 1);

        expect(component.generating).toBeTrue();
        expect(component.followers).toEqual(followers.slice(0, i));
        expect(component.generatingMessage).toEqual(message);
        expect(component.leadership).toBe(leadership);
        expect(component.cohort).toBe(cohort);
        
        tick(delay - 1);

        expect(component.generating).toBeTrue();
        expect(component.generatingMessage).toEqual(message);
        expect(component.leadership).toBe(leadership);
        expect(component.cohort).toBe(cohort);
        expect(component.followers).toEqual(followers.slice(0, i));  
      }
    }
    
    it(`should be generating while generating leadership - with cohort but without followers`, fakeAsync(() => {
      setupOnInit();

      component.leaderLevel = 7;
      component.leaderCharismaBonus = 8;
      component.leaderAnimal = 'my animal';
      component.leaderAlignment = 'my leader alignment';
      component.leaderClassName = 'my leader class';
      
      const leadership = new Leadership(3, [], 8);
      leadershipServiceSpy.generate.and.callFake(() => getFakeDelay(leadership));

      const cohort = new Character('my cohort summary');
      leadershipServiceSpy.generateCohort.and.callFake(() => getFakeDelay(cohort));

      component.generateLeadership();

      expectLeadershipGenerating(leadership, cohort, []);

      flush();
    }));
    
    it(`should be generating while generating leadership - with cohort and followers <= lvl 1`, fakeAsync(() => {
      setupOnInit();

      component.leaderLevel = 7;
      component.leaderCharismaBonus = 8;
      component.leaderAnimal = 'my animal';
      component.leaderAlignment = 'my leader alignment';
      component.leaderClassName = 'my leader class';
      
      const followerQuantities = new FollowerQuantities(2);
      const leadership = new Leadership(3, [], 8, followerQuantities);
      leadershipServiceSpy.generate.and.callFake(() => getFakeDelay(leadership));

      const cohort = new Character('my cohort summary');
      leadershipServiceSpy.generateCohort.and.callFake(() => getFakeDelay(cohort));

      let followerIndex = 0;
      const followers = [
        new Character('my follower summary 1.1'),
        new Character('my follower summary 1.2'),
      ];
      leadershipServiceSpy.generateFollower.and.callFake(() => getFakeDelay(followers[followerIndex++]));

      component.generateLeadership();

      expectLeadershipGenerating(leadership, cohort, followers);
      expectFollowerCalls(followerQuantities);

      flush();
    }));

    function expectFollowerCalls(quantities: FollowerQuantities) {
      const total = quantities.level1 + quantities.level2 + quantities.level3 + quantities.level4 + quantities.level5 + quantities.level6;
      let callIndex = 0;

      expect(leadershipServiceSpy.generateFollower).toHaveBeenCalledTimes(total);

      for(let i = 0; i < quantities.level1; i++) {
        expect(leadershipServiceSpy.generateFollower.calls.argsFor(i + callIndex)).toEqual([1, 'my leader alignment', 'my leader class']);
      }

      callIndex += quantities.level1;

      for(let i = 0; i < quantities.level2; i++) {
        expect(leadershipServiceSpy.generateFollower.calls.argsFor(i + callIndex)).toEqual([2, 'my leader alignment', 'my leader class']);
      }

      callIndex += quantities.level2;

      for(let i = 0; i < quantities.level3; i++) {
        expect(leadershipServiceSpy.generateFollower.calls.argsFor(i + callIndex)).toEqual([3, 'my leader alignment', 'my leader class']);
      }

      callIndex += quantities.level3;

      for(let i = 0; i < quantities.level4; i++) {
        expect(leadershipServiceSpy.generateFollower.calls.argsFor(i + callIndex)).toEqual([4, 'my leader alignment', 'my leader class']);
      }

      callIndex += quantities.level4;

      for(let i = 0; i < quantities.level5; i++) {
        expect(leadershipServiceSpy.generateFollower.calls.argsFor(i + callIndex)).toEqual([5, 'my leader alignment', 'my leader class']);
      }

      callIndex += quantities.level5;

      for(let i = 0; i < quantities.level6; i++) {
        expect(leadershipServiceSpy.generateFollower.calls.argsFor(i + callIndex)).toEqual([6, 'my leader alignment', 'my leader class']);
      }
    }
    
    it(`should be generating while generating leadership - with cohort and followers <= lvl 2`, fakeAsync(() => {
      setupOnInit();

      component.leaderLevel = 7;
      component.leaderCharismaBonus = 8;
      component.leaderAnimal = 'my animal';
      component.leaderAlignment = 'my leader alignment';
      component.leaderClassName = 'my leader class';
      
      const followerQuantities = new FollowerQuantities(3, 2);
      const leadership = new Leadership(3, [], 8, followerQuantities);
      leadershipServiceSpy.generate.and.callFake(() => getFakeDelay(leadership));

      const cohort = new Character('my cohort summary');
      leadershipServiceSpy.generateCohort.and.callFake(() => getFakeDelay(cohort));

      let followerIndex = 0;
      const followers = [
        new Character('my follower summary 1.1'),
        new Character('my follower summary 1.2'),
        new Character('my follower summary 1.3'),
        new Character('my follower summary 2.1'),
        new Character('my follower summary 2.2'),
      ];
      leadershipServiceSpy.generateFollower.and.callFake(() => getFakeDelay(followers[followerIndex++]));

      component.generateLeadership();

      expectLeadershipGenerating(leadership, cohort, followers);
      expectFollowerCalls(followerQuantities);

      flush();
    }));
    
    it(`should be generating while generating leadership - with cohort and followers <= lvl 3`, fakeAsync(() => {
      setupOnInit();

      component.leaderLevel = 7;
      component.leaderCharismaBonus = 8;
      component.leaderAnimal = 'my animal';
      component.leaderAlignment = 'my leader alignment';
      component.leaderClassName = 'my leader class';
      
      const followerQuantities = new FollowerQuantities(4, 3, 2);
      const leadership = new Leadership(3, [], 8, followerQuantities);
      leadershipServiceSpy.generate.and.callFake(() => getFakeDelay(leadership));

      const cohort = new Character('my cohort summary');
      leadershipServiceSpy.generateCohort.and.callFake(() => getFakeDelay(cohort));

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
      leadershipServiceSpy.generateFollower.and.callFake(() => getFakeDelay(followers[followerIndex++]));

      component.generateLeadership();

      expectLeadershipGenerating(leadership, cohort, followers);
      expectFollowerCalls(followerQuantities);

      flush();
    }));
    
    it(`should be generating while generating leadership - with cohort and followers <= lvl 4`, fakeAsync(() => {
      setupOnInit();

      component.leaderLevel = 7;
      component.leaderCharismaBonus = 8;
      component.leaderAnimal = 'my animal';
      component.leaderAlignment = 'my leader alignment';
      component.leaderClassName = 'my leader class';
      
      const followerQuantities = new FollowerQuantities(5, 4, 3, 2);
      const leadership = new Leadership(3, [], 8, followerQuantities);
      leadershipServiceSpy.generate.and.callFake(() => getFakeDelay(leadership));

      const cohort = new Character('my cohort summary');
      leadershipServiceSpy.generateCohort.and.callFake(() => getFakeDelay(cohort));

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
      leadershipServiceSpy.generateFollower.and.callFake(() => getFakeDelay(followers[followerIndex++]));

      component.generateLeadership();

      expectLeadershipGenerating(leadership, cohort, followers);
      expectFollowerCalls(followerQuantities);

      flush();
    }));
    
    it(`should be generating while generating leadership - with cohort and followers <= lvl 5`, fakeAsync(() => {
      setupOnInit();

      component.leaderLevel = 7;
      component.leaderCharismaBonus = 8;
      component.leaderAnimal = 'my animal';
      component.leaderAlignment = 'my leader alignment';
      component.leaderClassName = 'my leader class';
      
      const followerQuantities = new FollowerQuantities(6, 5, 4, 3, 2);
      const leadership = new Leadership(3, [], 8, followerQuantities);
      leadershipServiceSpy.generate.and.callFake(() => getFakeDelay(leadership));

      const cohort = new Character('my cohort summary');
      leadershipServiceSpy.generateCohort.and.callFake(() => getFakeDelay(cohort));

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
      leadershipServiceSpy.generateFollower.and.callFake(() => getFakeDelay(followers[followerIndex++]));

      component.generateLeadership();

      expectLeadershipGenerating(leadership, cohort, followers);
      expectFollowerCalls(followerQuantities);

      flush();
    }));
    
    it(`should be generating while generating leadership - with cohort and followers <= lvl 6`, fakeAsync(() => {
      setupOnInit();

      component.leaderLevel = 7;
      component.leaderCharismaBonus = 8;
      component.leaderAnimal = 'my animal';
      component.leaderAlignment = 'my leader alignment';
      component.leaderClassName = 'my leader class';
      
      const followerQuantities = new FollowerQuantities(7, 6, 5, 4, 3, 2);
      const leadership = new Leadership(3, [], 8, followerQuantities);
      leadershipServiceSpy.generate.and.callFake(() => getFakeDelay(leadership));

      const cohort = new Character('my cohort summary');
      leadershipServiceSpy.generateCohort.and.callFake(() => getFakeDelay(cohort));

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
      leadershipServiceSpy.generateFollower.and.callFake(() => getFakeDelay(followers[followerIndex++]));

      component.generateLeadership();

      expectLeadershipGenerating(leadership, cohort, followers);
      expectFollowerCalls(followerQuantities);

      flush();
    }));
    
    it(`should generate full leadership`, fakeAsync(() => {
      setupOnInit();

      component.leaderLevel = 7;
      component.leaderCharismaBonus = 8;
      component.leaderAnimal = 'my animal';
      component.leaderAlignment = 'my leader alignment';
      component.leaderClassName = 'my leader class';
      
      const followerQuantities = new FollowerQuantities(7, 6, 5, 4, 3, 2);
      const leadership = new Leadership(3, [], 8, followerQuantities);
      leadershipServiceSpy.generate.and.callFake(() => getFakeDelay(leadership));

      const cohort = new Character('my cohort summary');
      leadershipServiceSpy.generateCohort.and.callFake(() => getFakeDelay(cohort));

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
      leadershipServiceSpy.generateFollower.and.callFake(() => getFakeDelay(followers[followerIndex++]));

      component.generateLeadership();

      expectLeadershipGenerating(leadership, cohort, followers);
      expectFollowerCalls(followerQuantities);

      tick(1);

      expect(component.leadership).toBe(leadership);
      expect(component.cohort).toBe(cohort);
      expect(component.followers).toEqual(followers);
    }));

    it('should download character', () => {
      const character = new Character('my character summary');
      component.character = character;

      leaderPipeSpy.transform.and.returnValue('my formatted character');

      component.download();

      expect(leaderPipeSpy.transform).toHaveBeenCalledWith(character, null, null, []);
      expect(fileSaverServiceSpy.save).toHaveBeenCalledWith('my formatted character', 'my character summary');
    });

    it('should download leader', () => {
      const character = new Character('my leader summary');
      component.character = character;
      const leadership = new Leadership(3, [], 8);
      component.leadership = leadership;
      const cohort = new Character('my cohort summary');
      component.cohort = cohort;
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
      component.followers = followers;

      leaderPipeSpy.transform.and.returnValue('my formatted leader');

      component.download();

      expect(leaderPipeSpy.transform).toHaveBeenCalledWith(character, leadership, cohort, followers);
      expect(fileSaverServiceSpy.save).toHaveBeenCalledWith('my formatted leader', 'my leader summary');
    });

    it('should not download missing character', () => {
      component.character = null;

      component.download();
      
      expect(leaderPipeSpy.transform).not.toHaveBeenCalled();
      expect(fileSaverServiceSpy.save).not.toHaveBeenCalled();
    });
  });

  describe('integration', () => {
    let fixture: ComponentFixture<CharacterGenComponent>;
    let helper: TestHelper<CharacterGenComponent>;
  
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [
          AppModule
        ],
      }).compileComponents();
  
      fixture = TestBed.createComponent(CharacterGenComponent);
      helper = new TestHelper(fixture);
      
      //run ngOnInit
      await helper.waitForService();
    });

    it('should create the component', () => {
      const component = fixture.componentInstance;
      expect(component).toBeTruthy();
    });
  
    it('should show the loading component when loading', () => {
      const component = fixture.componentInstance;
      component.loading = true;

      fixture.detectChanges();
      
      const element = fixture.debugElement.query(By.css('dndgen-loading'));
      expect(element).toBeDefined();
      expect(element.componentInstance).toBeDefined();
      expect(element.componentInstance).toBeInstanceOf(LoadingComponent);

      const loadingComponent = element.componentInstance as LoadingComponent;
      expect(loadingComponent.isLoading).toBeTrue();
    });
  
    it('should hide the loading component when not loading', () => {
      const component = fixture.componentInstance;
      component.loading = false;

      fixture.detectChanges();
      
      const element = fixture.debugElement.query(By.css('dndgen-loading'));
      expect(element).toBeDefined();
      expect(element.componentInstance).toBeDefined();
      expect(element.componentInstance).toBeInstanceOf(LoadingComponent);

      const loadingComponent = element.componentInstance as LoadingComponent;
      expect(loadingComponent.isLoading).toBeFalse();
    });
  
    it(`should set the character model on init`, () => {
      const component = fixture.componentInstance;
      expect(component.characterModel).toBeDefined();
      expect(component.characterModel.alignmentRandomizerTypes.length).toEqual(12);
      expect(component.characterModel.alignmentRandomizerTypes).toContain('Set');
      expect(component.characterModel.alignments.length).toEqual(9);
      expect(component.characterModel.classNameRandomizerTypes.length).toEqual(9);
      expect(component.characterModel.classNameRandomizerTypes).toContain('Set');
      expect(component.characterModel.classNames.length).toEqual(16);
      expect(component.characterModel.levelRandomizerTypes.length).toEqual(6);
      expect(component.characterModel.levelRandomizerTypes).toContain('Set');
      expect(component.characterModel.baseRaceRandomizerTypes.length).toEqual(7);
      expect(component.characterModel.baseRaceRandomizerTypes).toContain('Set');
      expect(component.characterModel.baseRaces.length).toEqual(70);
      expect(component.characterModel.metaraceRandomizerTypes.length).toEqual(6);
      expect(component.characterModel.metaraceRandomizerTypes).toContain('Set');
      expect(component.characterModel.metaraceRandomizerTypes).toContain('No Meta');
      expect(component.characterModel.metaraces.length).toEqual(12);
      expect(component.characterModel.abilitiesRandomizerTypes.length).toEqual(9);
      expect(component.characterModel.abilitiesRandomizerTypes).toContain('Set');
    });
  
    it(`should set initial values on init`, () => {
      const component = fixture.componentInstance;
      expect(component.alignmentRandomizerType).toEqual(component.characterModel.alignmentRandomizerTypes[0]);
      expect(component.setAlignment).toEqual(component.characterModel.alignments[0]);

      expect(component.classNameRandomizerType).toEqual(component.characterModel.classNameRandomizerTypes[0]);
      expect(component.setClassName).toEqual(component.characterModel.classNames[0]);

      expect(component.levelRandomizerType).toEqual(component.characterModel.levelRandomizerTypes[0]);
      expect(component.setLevel).toEqual(1);
      expect(component.allowLevelAdjustments).toEqual(true);

      expect(component.baseRaceRandomizerType).toEqual(component.characterModel.baseRaceRandomizerTypes[0]);
      expect(component.setBaseRace).toEqual(component.characterModel.baseRaces[0]);

      expect(component.metaraceRandomizerType).toEqual(component.characterModel.metaraceRandomizerTypes[0]);
      expect(component.forceMetarace).toEqual(false);
      expect(component.setMetarace).toEqual(component.characterModel.metaraces[0]);

      expect(component.abilitiesRandomizerType).toEqual(component.characterModel.abilitiesRandomizerTypes[0]);
      expect(component.setStrength).toEqual(10);
      expect(component.setConstitution).toEqual(10);
      expect(component.setDexterity).toEqual(10);
      expect(component.setIntelligence).toEqual(10);
      expect(component.setWisdom).toEqual(10);
      expect(component.setCharisma).toEqual(10);
      
      expect(component.leaderAlignment).toEqual(component.characterModel.alignments[0]);
      expect(component.leaderClassName).toEqual(component.characterModel.classNames[0]);
      expect(component.leaderLevel).toEqual(6);
      expect(component.leaderCharismaBonus).toEqual(0);
      expect(component.leaderAnimal).toEqual('');
    });
  
    it(`should initialize public properties`, async () => {
      const component = fixture.componentInstance;
      expect(component.loading).toBeFalse();
      expect(component.validating).toBeFalse();
      expect(component.generating).toBeFalse();
      expect(component.valid).toBeTrue();
    });
  
    it(`should be ready to generate a character on load`, async () => {
      expectReady();
    });

    function expectReady() {
      expect(fixture.componentInstance.loading).toBeFalse();
      expect(fixture.componentInstance.validating).toBeFalse();
      expect(fixture.componentInstance.generating).toBeFalse();
      expect(fixture.componentInstance.valid).toBeTrue();

      helper.expectHasAttribute('#generateCharacterButton', 'disabled', false);
    }
  
    it(`should render the tabs`, () => {
      const compiled = fixture.nativeElement as HTMLElement;
  
      const tabLinks = compiled.querySelectorAll('ul.nav-tabs a.nav-link');
      expect(tabLinks).toBeDefined();
      expect(tabLinks?.length).toEqual(2);
      expect(tabLinks?.item(0).textContent).toEqual('Character');
      expect(tabLinks?.item(0).getAttribute('class')).toContain('active');
      expect(tabLinks?.item(0).getAttribute('href')).toEqual('#character');
      expect(tabLinks?.item(1).textContent).toEqual('Leadership');
      expect(tabLinks?.item(1).getAttribute('class')).not.toContain('active');
      expect(tabLinks?.item(1).getAttribute('href')).toEqual('#leadership');
    });

    describe('the character tab', () => {
      it(`should render the character tab`, () => {
        helper.expectExists('#character');
        
        helper.expectSelect('#character #alignmentRandomizerType', true, 'Any', 12);
        helper.expectSelect('#character #setAlignment', false, 'Lawful Good', 9);
        
        helper.expectSelect('#character #classNameRandomizerType', true, 'Any Player', 9);
        helper.expectSelect('#character #setClassName', false, 'Barbarian', 16);

        helper.expectSelect('#character #levelRandomizerType', true, 'Any', 6);
        helper.expectCheckboxInput('#character #levelAdjustCheckbox', false, true);
        helper.expectNumberInput('#character #setLevel', false, 1, 1, 20);

        helper.expectSelect('#character #baseRaceRandomizerType', true, 'Any Base', 7);
        helper.expectSelect('#character #setBaseRace', false, 'Aasimar', 70);

        helper.expectSelect('#character #metaraceRandomizerType', true, 'Any Meta', 6);
        helper.expectCheckboxInput('#character #forceMetaraceCheckbox', false, false);
        helper.expectSelect('#character #setMetarace', false, 'Ghost', 12);

        helper.expectSelect('#character #abilitiesRandomizerType', true, 'Raw', 9);
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
    
      it(`should show when validating character`, () => {
        const component = fixture.componentInstance;
        component.validating = true;
  
        fixture.detectChanges();

        helper.expectValidating(fixture.componentInstance.validating, '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - missing alignment randomizer`, async () => {
        helper.setSelectByValue('#alignmentRandomizerType', '');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.alignmentRandomizerType).toEqual('');
        helper.expectInvalid(fixture.componentInstance.validating, fixture.componentInstance.valid, '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - missing set alignment`, async () => {
        expectReady();

        helper.setSelectByIndex('#alignmentRandomizerType', fixture.componentInstance.characterModel.alignmentRandomizerTypes.indexOf('Set'));
        helper.setSelectByValue('#setAlignment', '');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.alignmentRandomizerType).toEqual('Set');
        expect(fixture.componentInstance.setAlignment).toEqual('');
        
        helper.expectInvalid(fixture.componentInstance.validating, fixture.componentInstance.valid, '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - missing class name randomizer`, async () => {
        helper.setSelectByValue('#classNameRandomizerType', '');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.classNameRandomizerType).toEqual('');
        helper.expectInvalid(fixture.componentInstance.validating, fixture.componentInstance.valid, '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - missing set class name`, async () => {
        expectReady();

        helper.setSelectByIndex('#classNameRandomizerType', fixture.componentInstance.characterModel.classNameRandomizerTypes.indexOf('Set'));
        helper.setSelectByValue('#setClassName', '');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.classNameRandomizerType).toEqual('Set');
        expect(fixture.componentInstance.setClassName).toEqual('');
        helper.expectInvalid(fixture.componentInstance.validating, fixture.componentInstance.valid, '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - missing level randomizer`, async () => {
        helper.setSelectByValue('#levelRandomizerType', '');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.levelRandomizerType).toEqual('');
        helper.expectInvalid(fixture.componentInstance.validating, fixture.componentInstance.valid, '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - missing set level`, async () => {
        helper.setSelectByIndex('#levelRandomizerType', fixture.componentInstance.characterModel.levelRandomizerTypes.indexOf('Set'));
        helper.setInput('#setLevel', '');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.levelRandomizerType).toEqual('Set');
        expect(fixture.componentInstance.setLevel).toBeNull();
        helper.expectInvalid(fixture.componentInstance.validating, fixture.componentInstance.valid, '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - set level invalid`, () => {
        helper.setSelectByIndex('#levelRandomizerType', fixture.componentInstance.characterModel.levelRandomizerTypes.indexOf('Set'));
        helper.setInput('#setLevel', 'wrong');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.levelRandomizerType).toEqual('Set');
        expect(fixture.componentInstance.setLevel).toBeNull();
        
        helper.expectInvalid(fixture.componentInstance.validating, fixture.componentInstance.valid, '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - set level too low`, () => {
        helper.setSelectByIndex('#levelRandomizerType', fixture.componentInstance.characterModel.levelRandomizerTypes.indexOf('Set'));
        helper.setInput('#setLevel', '-1');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.levelRandomizerType).toEqual('Set');
        expect(fixture.componentInstance.setLevel).toEqual(-1);
        helper.expectInvalid(fixture.componentInstance.validating, fixture.componentInstance.valid, '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - set level too high`, waitForAsync(async () => {
        helper.setSelectByIndex('#levelRandomizerType', fixture.componentInstance.characterModel.levelRandomizerTypes.indexOf('Set'));
        
        //run validation
        await helper.waitForService();

        helper.setInput('#setLevel', '21');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.levelRandomizerType).toEqual('Set');
        expect(fixture.componentInstance.setLevel).toEqual(21);

        helper.expectValidating(fixture.componentInstance.validating, '#generateCharacterButton', '#characterValidating');
        
        //run validation
        await helper.waitForService();
  
        expect(fixture.componentInstance.valid).toBeFalse();
        helper.expectInvalid(fixture.componentInstance.validating, fixture.componentInstance.valid, '#generateCharacterButton', '#characterValidating');
      }));
    
      it(`should show that character is invalid - missing base race randomizer`, async () => {
        helper.setSelectByValue('#baseRaceRandomizerType', '');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.baseRaceRandomizerType).toEqual('');
        helper.expectInvalid(fixture.componentInstance.validating, fixture.componentInstance.valid, '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - missing set base race`, async () => {
        helper.setSelectByIndex('#baseRaceRandomizerType', fixture.componentInstance.characterModel.baseRaceRandomizerTypes.indexOf('Set'));
        helper.setSelectByValue('#setBaseRace', '');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.baseRaceRandomizerType).toEqual('Set');
        expect(fixture.componentInstance.setBaseRace).toEqual('');
        helper.expectInvalid(fixture.componentInstance.validating, fixture.componentInstance.valid, '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - missing metarace randomizer`, async () => {
        helper.setSelectByValue('#metaraceRandomizerType', '');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.metaraceRandomizerType).toEqual('');
        helper.expectInvalid(fixture.componentInstance.validating, fixture.componentInstance.valid, '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - missing set metarace`, async () => {
        expectReady();

        helper.setSelectByIndex('#metaraceRandomizerType', fixture.componentInstance.characterModel.metaraceRandomizerTypes.indexOf('Set'));
        helper.setSelectByValue('#setMetarace', '');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.metaraceRandomizerType).toEqual('Set');
        expect(fixture.componentInstance.setMetarace).toEqual('');
        helper.expectInvalid(fixture.componentInstance.validating, fixture.componentInstance.valid, '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - missing abilities randomizer`, async () => {
        helper.setSelectByValue('#abilitiesRandomizerType', '');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.abilitiesRandomizerType).toEqual('');
        helper.expectInvalid(fixture.componentInstance.validating, fixture.componentInstance.valid, '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - missing set strength`, () => {
        helper.setSelectByIndex('#abilitiesRandomizerType', fixture.componentInstance.characterModel.abilitiesRandomizerTypes.indexOf('Set'));
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
        helper.expectInvalid(fixture.componentInstance.validating, fixture.componentInstance.valid, '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - set strength invalid`, () => {
        helper.setSelectByIndex('#abilitiesRandomizerType', fixture.componentInstance.characterModel.abilitiesRandomizerTypes.indexOf('Set'));
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
        helper.expectInvalid(fixture.componentInstance.validating, fixture.componentInstance.valid, '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - set strength too low`, () => {
        helper.setSelectByIndex('#abilitiesRandomizerType', fixture.componentInstance.characterModel.abilitiesRandomizerTypes.indexOf('Set'));
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

        helper.expectInvalid(fixture.componentInstance.validating, fixture.componentInstance.valid, '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - missing set constitution`, () => {
        helper.setSelectByIndex('#abilitiesRandomizerType', fixture.componentInstance.characterModel.abilitiesRandomizerTypes.indexOf('Set'));
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
        helper.expectInvalid(fixture.componentInstance.validating, fixture.componentInstance.valid, '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - set constitution invalid`, () => {
        helper.setSelectByIndex('#abilitiesRandomizerType', fixture.componentInstance.characterModel.abilitiesRandomizerTypes.indexOf('Set'));
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
        helper.expectInvalid(fixture.componentInstance.validating, fixture.componentInstance.valid, '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - set constitution too low`, () => {
        helper.setSelectByIndex('#abilitiesRandomizerType', fixture.componentInstance.characterModel.abilitiesRandomizerTypes.indexOf('Set'));
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
        helper.expectInvalid(fixture.componentInstance.validating, fixture.componentInstance.valid, '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - missing set dexterity`, () => {
        helper.setSelectByIndex('#abilitiesRandomizerType', fixture.componentInstance.characterModel.abilitiesRandomizerTypes.indexOf('Set'));
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
        helper.expectInvalid(fixture.componentInstance.validating, fixture.componentInstance.valid, '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - set dexterity invalid`, () => {
        helper.setSelectByIndex('#abilitiesRandomizerType', fixture.componentInstance.characterModel.abilitiesRandomizerTypes.indexOf('Set'));
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
        
        helper.expectInvalid(fixture.componentInstance.validating, fixture.componentInstance.valid, '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - set dexterity too low`, () => {
        helper.setSelectByIndex('#abilitiesRandomizerType', fixture.componentInstance.characterModel.abilitiesRandomizerTypes.indexOf('Set'));
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
        helper.expectInvalid(fixture.componentInstance.validating, fixture.componentInstance.valid, '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - missing set intelligence`, () => {
        helper.setSelectByIndex('#abilitiesRandomizerType', fixture.componentInstance.characterModel.abilitiesRandomizerTypes.indexOf('Set'));
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
        helper.expectInvalid(fixture.componentInstance.validating, fixture.componentInstance.valid, '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - set intelligence invalid`, () => {
        helper.setSelectByIndex('#abilitiesRandomizerType', fixture.componentInstance.characterModel.abilitiesRandomizerTypes.indexOf('Set'));
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
        helper.expectInvalid(fixture.componentInstance.validating, fixture.componentInstance.valid, '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - set intelligence too low`, () => {
        helper.setSelectByIndex('#abilitiesRandomizerType', fixture.componentInstance.characterModel.abilitiesRandomizerTypes.indexOf('Set'));
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
        helper.expectInvalid(fixture.componentInstance.validating, fixture.componentInstance.valid, '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - missing set wisdom`, () => {
        helper.setSelectByIndex('#abilitiesRandomizerType', fixture.componentInstance.characterModel.abilitiesRandomizerTypes.indexOf('Set'));
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
        helper.expectInvalid(fixture.componentInstance.validating, fixture.componentInstance.valid, '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - set wisdom invalid`, () => {
        helper.setSelectByIndex('#abilitiesRandomizerType', fixture.componentInstance.characterModel.abilitiesRandomizerTypes.indexOf('Set'));
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
        helper.expectInvalid(fixture.componentInstance.validating, fixture.componentInstance.valid, '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - set wisdom too low`, () => {
        helper.setSelectByIndex('#abilitiesRandomizerType', fixture.componentInstance.characterModel.abilitiesRandomizerTypes.indexOf('Set'));
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
        helper.expectInvalid(fixture.componentInstance.validating, fixture.componentInstance.valid, '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - missing set charisma`, () => {
        helper.setSelectByIndex('#abilitiesRandomizerType', fixture.componentInstance.characterModel.abilitiesRandomizerTypes.indexOf('Set'));
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

        helper.expectInvalid(fixture.componentInstance.validating, fixture.componentInstance.valid, '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - set charisma invalid`, () => {
        helper.setSelectByIndex('#abilitiesRandomizerType', fixture.componentInstance.characterModel.abilitiesRandomizerTypes.indexOf('Set'));
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
        helper.expectInvalid(fixture.componentInstance.validating, fixture.componentInstance.valid, '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - set charisma too low`, () => {
        helper.setSelectByIndex('#abilitiesRandomizerType', fixture.componentInstance.characterModel.abilitiesRandomizerTypes.indexOf('Set'));
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

        helper.expectInvalid(fixture.componentInstance.validating, fixture.componentInstance.valid, '#generateCharacterButton', '#characterValidating');
      });

      it(`should show that character is invalid - validation fails`, waitForAsync(async () => {
        helper.setSelectByIndex('#alignmentRandomizerType', fixture.componentInstance.characterModel.alignmentRandomizerTypes.indexOf('Good'));
        
        //run validation
        await helper.waitForService();

        helper.setSelectByIndex('#metaraceRandomizerType', fixture.componentInstance.characterModel.metaraceRandomizerTypes.indexOf('Set'));
        
        //run validation
        await helper.waitForService();

        helper.setSelectByIndex('#setMetarace', fixture.componentInstance.characterModel.metaraces.indexOf('Lich'));
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.alignmentRandomizerType).toEqual('Good');
        expect(fixture.componentInstance.metaraceRandomizerType).toEqual('Set');
        expect(fixture.componentInstance.setMetarace).toEqual('Lich');

        helper.expectValidating(fixture.componentInstance.validating, '#generateCharacterButton', '#characterValidating');
  
        //run validation
        await helper.waitForService();
        
        expect(fixture.componentInstance.valid).toBeFalse();
        helper.expectInvalid(fixture.componentInstance.validating, fixture.componentInstance.valid, '#generateCharacterButton', '#characterValidating');
      }));
    
      it(`should show that character is valid - validation succeeds`, async () => {
        helper.setSelectByIndex('#alignmentRandomizerType', fixture.componentInstance.characterModel.alignmentRandomizerTypes.indexOf('Evil'));
        helper.setSelectByIndex('#metaraceRandomizerType', fixture.componentInstance.characterModel.metaraceRandomizerTypes.indexOf('Set'));
        helper.setSelectByIndex('#setMetarace', fixture.componentInstance.characterModel.metaraces.indexOf('Lich'));
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.alignmentRandomizerType).toEqual('Evil');
        expect(fixture.componentInstance.metaraceRandomizerType).toEqual('Set');
        expect(fixture.componentInstance.setMetarace).toEqual('Lich');

        helper.expectValidating(fixture.componentInstance.validating, '#generateCharacterButton', '#characterValidating');
  
        //run validation
        await helper.waitForService();
  
        helper.expectValid(fixture.componentInstance.validating, fixture.componentInstance.valid, '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should bind allowing level adjustments`, async () => {
        expect(fixture.componentInstance.allowLevelAdjustments).toBeTrue();

        helper.clickCheckbox('#levelAdjustCheckbox');

        fixture.detectChanges();
        expect(fixture.componentInstance.allowLevelAdjustments).toBeFalse();

        helper.clickCheckbox('#levelAdjustCheckbox');

        fixture.detectChanges();
        expect(fixture.componentInstance.allowLevelAdjustments).toBeTrue();
      });
    
      it(`should bind forcing metaraces`, async () => {
        expect(fixture.componentInstance.forceMetarace).toBeFalse();

        helper.clickCheckbox('#forceMetaraceCheckbox');

        fixture.detectChanges();
        expect(fixture.componentInstance.forceMetarace).toBeTrue();

        helper.clickCheckbox('#forceMetaraceCheckbox');

        fixture.detectChanges();
        expect(fixture.componentInstance.forceMetarace).toBeFalse();
      });
    
      it(`should bind allowing ability adjustments`, async () => {
        expect(fixture.componentInstance.allowAbilitiesAdjustments).toBeTrue();

        helper.clickCheckbox('#abilitiesAdjustCheckbox');

        fixture.detectChanges();
        expect(fixture.componentInstance.allowAbilitiesAdjustments).toBeFalse();

        helper.clickCheckbox('#abilitiesAdjustCheckbox');

        fixture.detectChanges();
        expect(fixture.componentInstance.allowAbilitiesAdjustments).toBeTrue();
      });
    
      it(`should show when generating a character`, () => {
        const component = fixture.componentInstance;
        component.generating = true;
  
        fixture.detectChanges();

        helper.expectGenerating(
          fixture.componentInstance.generating,
          '#generateCharacterButton', 
          '#characterSection', 
          '#generatingSection > dndgen-loading', 
          '#characterValidating', 
          '#downloadButton');
      });
    
      it(`should generate the default character`, async () => {
        helper.clickButton('#generateCharacterButton');
  
        fixture.detectChanges();
        
        helper.expectGenerating(
          fixture.componentInstance.generating,
          '#generateCharacterButton', 
          '#characterSection', 
          '#generatingSection > dndgen-loading', 
          '#characterValidating', 
          '#downloadButton');

        //run generate character
        await helper.waitForService();
  
        helper.expectGenerated(
          fixture.componentInstance.generating,
          '#generateCharacterButton', 
          '#characterSection', 
          '#generatingSection > dndgen-loading', 
          '#characterValidating', 
          '#downloadButton');

        helper.expectHasAttribute('#noCharacter', 'hidden', true)
        helper.expectExists('#characterSection > dndgen-character', true);
        // HACK: We might generate leadership, so we can't assert this
        // helper.expectExists('#characterSection dndgen-leadership', false);
        helper.expectCharacter('#characterSection > dndgen-character', true);
      });
    
      it(`should generate non-default character`, async () => {
        helper.setSelectByIndex('#alignmentRandomizerType', fixture.componentInstance.characterModel.alignmentRandomizerTypes.indexOf('Non-evil'));
        helper.setSelectByIndex('#classNameRandomizerType', fixture.componentInstance.characterModel.classNameRandomizerTypes.indexOf('Physical Combat'));
        helper.setSelectByIndex('#levelRandomizerType', fixture.componentInstance.characterModel.levelRandomizerTypes.indexOf('Low'));
        helper.setCheckbox('#levelAdjustCheckbox', false);
        helper.setSelectByIndex('#baseRaceRandomizerType', fixture.componentInstance.characterModel.baseRaceRandomizerTypes.indexOf('Non-Monster Base'));
        helper.setSelectByIndex('#metaraceRandomizerType', fixture.componentInstance.characterModel.metaraceRandomizerTypes.indexOf('Lycanthrope Meta'));
        helper.setCheckbox('#forceMetaraceCheckbox', true);
        helper.setSelectByIndex('#abilitiesRandomizerType', fixture.componentInstance.characterModel.abilitiesRandomizerTypes.indexOf('Ones as sixes'));
  
        fixture.detectChanges();

        expect(fixture.componentInstance.alignmentRandomizerType).toEqual('Non-evil');
        expect(fixture.componentInstance.classNameRandomizerType).toEqual('Physical Combat');
        expect(fixture.componentInstance.levelRandomizerType).toEqual('Low');
        expect(fixture.componentInstance.baseRaceRandomizerType).toEqual('Non-Monster Base');
        expect(fixture.componentInstance.metaraceRandomizerType).toEqual('Lycanthrope Meta');
        expect(fixture.componentInstance.abilitiesRandomizerType).toEqual('Ones as sixes');

        //run validation
        await helper.waitForService();

        helper.clickButton('#generateCharacterButton');
  
        fixture.detectChanges();
        
        helper.expectGenerating(
          fixture.componentInstance.generating,
          '#generateCharacterButton', 
          '#characterSection', 
          '#generatingSection > dndgen-loading', 
          '#characterValidating', 
          '#downloadButton');

        //run generate character
        await helper.waitForService();
  
        helper.expectGenerated(
          fixture.componentInstance.generating,
          '#generateCharacterButton', 
          '#characterSection', 
          '#generatingSection > dndgen-loading', 
          '#characterValidating', 
          '#downloadButton');

        helper.expectHasAttribute('#noCharacter', 'hidden', true)
        helper.expectExists('#characterSection dndgen-character', true);
        helper.expectExists('#characterSection dndgen-leadership', false);
        helper.expectCharacter('#characterSection dndgen-character', true);
      });
    
      it(`should generate non-default character - set values`, async () => {
        helper.setSelectByIndex('#alignmentRandomizerType', fixture.componentInstance.characterModel.alignmentRandomizerTypes.indexOf('Set'));
        helper.setSelectByIndex('#setAlignment', fixture.componentInstance.characterModel.alignments.indexOf('Neutral Good'));
        helper.setSelectByIndex('#classNameRandomizerType', fixture.componentInstance.characterModel.classNameRandomizerTypes.indexOf('Set'));
        helper.setSelectByIndex('#setClassName', fixture.componentInstance.characterModel.classNames.indexOf('Fighter'));
        helper.setSelectByIndex('#levelRandomizerType', fixture.componentInstance.characterModel.levelRandomizerTypes.indexOf('Set'));
        helper.setCheckbox('#levelAdjustCheckbox', false);
        helper.setInput('#setLevel', '4');
        helper.setSelectByIndex('#baseRaceRandomizerType', fixture.componentInstance.characterModel.baseRaceRandomizerTypes.indexOf('Set'));
        helper.setSelectByIndex('#setBaseRace', fixture.componentInstance.characterModel.baseRaces.indexOf('Mountain Dwarf'));
        helper.setSelectByIndex('#metaraceRandomizerType', fixture.componentInstance.characterModel.metaraceRandomizerTypes.indexOf('Set'));
        helper.setSelectByIndex('#setMetarace', fixture.componentInstance.characterModel.metaraces.indexOf('Half-Dragon'));
        helper.setSelectByIndex('#abilitiesRandomizerType', fixture.componentInstance.characterModel.abilitiesRandomizerTypes.indexOf('Set'));
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
        await helper.waitForService();

        helper.clickButton('#generateCharacterButton');
  
        fixture.detectChanges();
        
        helper.expectGenerating(
          fixture.componentInstance.generating,
          '#generateCharacterButton', 
          '#characterSection', 
          '#generatingSection > dndgen-loading', 
          '#characterValidating', 
          '#downloadButton');

        //run generate character
        await helper.waitForService();
  
        helper.expectGenerated(
          fixture.componentInstance.generating,
          '#generateCharacterButton', 
          '#characterSection', 
          '#generatingSection > dndgen-loading', 
          '#characterValidating', 
          '#downloadButton');

        helper.expectHasAttribute('#noCharacter', 'hidden', true)
        helper.expectExists('#characterSection dndgen-character', true);
        helper.expectExists('#characterSection dndgen-leadership', false);
        helper.expectCharacter('#characterSection dndgen-character', true);
      });
    });
  
    describe('the leadership tab', () => {
      it(`should render the leadership tab`, () => {
        const compiled = fixture.nativeElement as HTMLElement;
  
        const leadershipTab = compiled.querySelector('#leadership');
        expect(leadershipTab).toBeTruthy();
  
        helper.expectSelect('#leadership #leaderAlignment', true, 'Lawful Good', 9);
        helper.expectSelect('#leadership #leaderClassName', true, 'Barbarian', 16);
        helper.expectNumberInput('#leadership #leaderLevel', true, 6, 6, 20);
        helper.expectNumberInput('#leadership #leaderCharismaBonus', false, 0);
        helper.expectInput('#leadership #leaderAnimal', false, '');

        helper.expectHasAttribute('#generateLeadershipButton', 'disabled', false);
      });
    
      it(`should show when generating leadership`, () => {
        const component = fixture.componentInstance;
        component.generating = true;
  
        fixture.detectChanges();

        helper.expectGenerating(
          fixture.componentInstance.generating,
          '#generateCharacterButton', 
          '#characterSection', 
          '#generatingSection > dndgen-loading', 
          '#characterValidating', 
          '#downloadButton');
      });
    
      it(`should generate default leadership`, async () => {
        helper.clickButton('#generateLeadershipButton');
  
        fixture.detectChanges();
        
        helper.expectGenerating(
          fixture.componentInstance.generating,
          '#generateCharacterButton', 
          '#characterSection', 
          '#generatingSection > dndgen-loading', 
          null,
          '#downloadButton');

        //run generate leadership
        await helper.waitForService();
  
        helper.expectGenerated(
          fixture.componentInstance.generating,
          '#generateCharacterButton', 
          '#characterSection', 
          '#generatingSection > dndgen-loading', 
          null, 
          '#downloadButton');
        
        helper.expectHasAttribute('#noCharacter', 'hidden', true)
        helper.expectExists('#characterSection > dndgen-character', false);
        helper.expectExists('#characterSection dndgen-leadership', true);

        const element = fixture.debugElement.query(By.css('#characterSection dndgen-leadership'));
        expect(element).toBeDefined();
        expect(element.componentInstance).toBeDefined();
        expect(element.componentInstance).toBeInstanceOf(LeadershipComponent);
  
        const leadershipComponent = element.componentInstance as LeadershipComponent;
        expect(leadershipComponent.leadership).toBeTruthy();
        expect(leadershipComponent.cohort).toBeTruthy();
        //INFO: We might not generate any followers, so this is the best we can do
        expect(leadershipComponent.followers.length).toBeGreaterThanOrEqual(0);
      });
    
      it(`should generate non-default leadership`, async () => {
        helper.setSelectByIndex('#leaderAlignment', fixture.componentInstance.characterModel.alignments.indexOf('Chaotic Neutral'));
        helper.setSelectByIndex('#leaderClassName', fixture.componentInstance.characterModel.classNames.indexOf('Sorcerer'));
        helper.setInput('#leaderLevel', '20');
        helper.setInput('#leaderCharismaBonus', '5');
        helper.setInput('#leaderAnimal', 'Weasel');
  
        fixture.detectChanges();

        expect(fixture.componentInstance.leaderAlignment).toEqual('Chaotic Neutral');
        expect(fixture.componentInstance.leaderClassName).toEqual('Sorcerer');
        expect(fixture.componentInstance.leaderLevel).toEqual(20);
        expect(fixture.componentInstance.leaderCharismaBonus).toEqual(5);
        expect(fixture.componentInstance.leaderAnimal).toEqual('Weasel');

        helper.clickButton('#generateLeadershipButton');
  
        fixture.detectChanges();
        
        helper.expectGenerating(
          fixture.componentInstance.generating,
          '#generateCharacterButton', 
          '#characterSection', 
          '#generatingSection > dndgen-loading', 
          '#characterValidating', 
          '#downloadButton');

        //run roll
        await helper.waitForService();
  
        helper.expectGenerated(
          fixture.componentInstance.generating,
          '#generateCharacterButton', 
          '#characterSection', 
          '#generatingSection > dndgen-loading', 
          '#characterValidating', 
          '#downloadButton');
        helper.expectExists('#characterSection > dndgen-character', false);
        helper.expectExists('#characterSection dndgen-leadership', true);

        const element = fixture.debugElement.query(By.css('#characterSection dndgen-leadership'));
        expect(element).toBeTruthy();
        expect(element.componentInstance).toBeTruthy();
        expect(element.componentInstance).toBeInstanceOf(LeadershipComponent);
  
        const leadershipComponent = element.componentInstance as LeadershipComponent;
        expect(leadershipComponent.leadership).toBeTruthy();
        expect(leadershipComponent.cohort).toBeTruthy();
        expect(leadershipComponent.followers.length).toBeGreaterThan(0);
      });
    });
  
    it(`should render no character or leadership`, () => {
      helper.expectHasAttribute('#noCharacter', 'hidden', false);
      helper.expectExists('#characterSection dndgen-character', false);
      helper.expectExists('#characterSection dndgen-leadership', false);
    });
    
    it(`should render character`, () => {
      const character = new Character('my character summary');
      fixture.componentInstance.character = character;

      fixture.detectChanges();

      helper.expectHasAttribute('#noCharacter', 'hidden', true);
      helper.expectHasAttribute('#characterSection dndgen-character', 'hidden', false);
      helper.expectCharacter('#characterSection dndgen-character', true, character);
      helper.expectExists('#characterSection dndgen-leadership', false);
    });
    
    it(`should render leadership`, () => {
      const leadership = new Leadership(90210, ['has a castle', 'smelly']);
      fixture.componentInstance.leadership = leadership;

      fixture.detectChanges();

      helper.expectHasAttribute('#noCharacter', 'hidden', true);
      helper.expectHasAttribute('#characterSection dndgen-leadership', 'hidden', false);
      
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

      fixture.componentInstance.leadership = leadership;
      fixture.componentInstance.cohort = cohort;

      fixture.detectChanges();

      expect(fixture.componentInstance.character).toBeNull();
      helper.expectHasAttribute('#noCharacter', 'hidden', true);
      helper.expectHasAttribute('#characterSection dndgen-leadership', 'hidden', false);
      
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

      fixture.componentInstance.leadership = leadership;
      fixture.componentInstance.cohort = cohort;
      fixture.componentInstance.followers = followers;

      fixture.detectChanges();

      helper.expectHasAttribute('#noCharacter', 'hidden', true);
      helper.expectHasAttribute('#characterSection dndgen-leadership', 'hidden', false);
      
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

      fixture.componentInstance.character = character;
      fixture.componentInstance.leadership = leadership;

      fixture.detectChanges();

      helper.expectHasAttribute('#noCharacter', 'hidden', true);
      helper.expectHasAttribute('#characterSection dndgen-character', 'hidden', false);
      helper.expectCharacter('#characterSection dndgen-character', true, character);

      helper.expectHasAttribute('#characterSection dndgen-leadership', 'hidden', false);
      
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

      fixture.componentInstance.character = character;
      fixture.componentInstance.leadership = leadership;
      fixture.componentInstance.cohort = cohort;
      fixture.componentInstance.followers = followers;

      fixture.detectChanges();

      helper.expectHasAttribute('#noCharacter', 'hidden', true);
      helper.expectHasAttribute('#characterSection dndgen-character', 'hidden', false);
      helper.expectCharacter('#characterSection dndgen-character', true, character);
      
      helper.expectHasAttribute('#characterSection dndgen-leadership', 'hidden', false);
      
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

      fixture.componentInstance.character = new Character('my character summary');

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

      fixture.componentInstance.character = new Character('my character summary');
      fixture.componentInstance.leadership = new Leadership(90210, ['has a castle', 'smelly']);
      fixture.componentInstance.cohort = new Character('my cohort summary');
      fixture.componentInstance.followers = [
        new Character('my follower summary 1'),
        new Character('my follower summary 2'),
      ];

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
