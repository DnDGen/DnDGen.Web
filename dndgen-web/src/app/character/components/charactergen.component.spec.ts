import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { CharacterGenComponent } from './charactergen.component';
import { AppModule } from '../../app.module';
import { SweetAlertService } from '../../shared/services/sweetAlert.service';
import { LoggerService } from '../../shared/services/logger.service';
import { Observable } from 'rxjs';
import { FileSaverService } from '../../shared/services/fileSaver.service';
import { Treasure } from '../../treasure/models/treasure.model';
import { Coin } from '../../treasure/models/coin.model';
import { Item } from '../../treasure/models/item.model';
import { By } from '@angular/platform-browser';
import { ItemComponent } from '../../treasure/components/item.component';
import * as FileSaver from 'file-saver';
import { CharacterService } from '../services/character.service';
import { LeadershipService } from '../services/leadership.service';
import { LeaderPipe } from '../pipes/leader.pipe';
import { CharacterGenViewModel } from '../models/charactergenViewModel.model';
import { Character } from '../models/character.model';
import { Leadership } from '../models/leadership.model';
import { FollowerQuantities } from '../models/followerQuantities.model';
import { LoadingComponent } from '../../shared/components/loading.component';
import { CharacterComponent } from './character.component';
import { LeadershipComponent } from './leadership.component';

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
      expect(component.character).toBeNull();
      expect(component.leadership).toBeNull();
      expect(component.cohort).toBeNull();
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
      expect(component.setLevel).toEqual(0);
      expect(component.allowLevelAdjustments).toEqual(true);
      expect(component.baseRaceRandomizerType).toEqual('');
      expect(component.setBaseRace).toEqual('');
      expect(component.metaraceRandomizerType).toEqual('');
      expect(component.forceMetarace).toEqual(false);
      expect(component.setMetarace).toEqual('');
      expect(component.abilitiesRandomizerType).toEqual('');
      expect(component.setStrength).toEqual(0);
      expect(component.setConstitution).toEqual(0);
      expect(component.setDexterity).toEqual(0);
      expect(component.setIntelligence).toEqual(0);
      expect(component.setWisdom).toEqual(0);
      expect(component.setCharisma).toEqual(0);
      expect(component.allowAbilitiesAdjustments).toEqual(true);
    }

    function expectDefaultInputValues() {
      expect(component.alignmentRandomizerType).toEqual('alignment randomizer 1');
      expect(component.setAlignment).toEqual('alignment 1');
      expect(component.classNameRandomizerType).toEqual('class name randomizer 1');
      expect(component.setClassName).toEqual('class name 1');
      expect(component.levelRandomizerType).toEqual('level randomizer 1');
      expect(component.setLevel).toEqual(0);
      expect(component.allowLevelAdjustments).toEqual(true);
      expect(component.baseRaceRandomizerType).toEqual('base race randomizer 1');
      expect(component.setBaseRace).toEqual('base race 1');
      expect(component.metaraceRandomizerType).toEqual('metarace randomizer 1');
      expect(component.forceMetarace).toEqual(false);
      expect(component.setMetarace).toEqual('metarace 1');
      expect(component.abilitiesRandomizerType).toEqual('abilities randomizer 1');
      expect(component.setStrength).toEqual(0);
      expect(component.setConstitution).toEqual(0);
      expect(component.setDexterity).toEqual(0);
      expect(component.setIntelligence).toEqual(0);
      expect(component.setWisdom).toEqual(0);
      expect(component.setCharisma).toEqual(0);
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
          0,
          true,
          'base race randomizer 1',
          'base race 1',
          'metarace randomizer 1',
          true,
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
      component.levelRandomizerType = 'Set';
      component.setLevel = 0;

      component.validateRandomizers();
      expect(component.validating).toBeFalse();
      expect(component.valid).toBeFalse();
    });

    it('should validate randomizers - invalid if set abilities randomizer, but no set strength', () => {
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
      component.setLevel = 0;
      component.allowLevelAdjustments = true;
  
      component.baseRaceRandomizerType = component.characterModel.baseRaceRandomizerTypes[0];
      component.setBaseRace = component.characterModel.baseRaces[0];
  
      component.metaraceRandomizerType = component.characterModel.metaraceRandomizerTypes[0];
      component.forceMetarace = false;
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
        0,
        true,
        'base race randomizer 1',
        'base race 1',
        'metarace randomizer 1',
        false,
        'metarace 1',
        'abilities randomizer 1',
        0,
        0,
        0,
        0,
        0,
        0,
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
      expect(leadershipServiceSpy.generateCohort).toHaveBeenCalledWith(7, 1, 'my leader alignment', 'my leader class');
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
        expect(component.generatingMessage).toEqual(message);
        expect(component.leadership).toBe(leadership);
        expect(component.cohort).toBe(cohort);
        expect(component.followers).toEqual(followers.slice(0, i));
        
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
  
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [
          AppModule
        ],
      }).compileComponents();
  
      fixture = TestBed.createComponent(CharacterGenComponent);
      
      //run ngOnInit
      await waitForService();
    });

    async function waitForService() {
      fixture.detectChanges();
      await fixture.whenStable();
      
      //update view
      fixture.detectChanges();
    }
  
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
      expect(component.characterModel.alignmentRandomizerTypes.length).toEqual(1);
      expect(component.characterModel.alignmentRandomizerTypes).toContain('Set');
      expect(component.characterModel.alignments.length).toEqual(2);
      expect(component.characterModel.classNameRandomizerTypes.length).toEqual(3);
      expect(component.characterModel.classNameRandomizerTypes).toContain('Set');
      expect(component.characterModel.classNames.length).toEqual(4);
      expect(component.characterModel.levelRandomizerTypes.length).toEqual(5);
      expect(component.characterModel.levelRandomizerTypes).toContain('Set');
      expect(component.characterModel.baseRaceRandomizerTypes.length).toEqual(6);
      expect(component.characterModel.baseRaceRandomizerTypes).toContain('Set');
      expect(component.characterModel.baseRaces.length).toEqual(7);
      expect(component.characterModel.metaraceRandomizerTypes.length).toEqual(8);
      expect(component.characterModel.metaraceRandomizerTypes).toContain('Set');
      expect(component.characterModel.metaraceRandomizerTypes).toContain('No Meta');
      expect(component.characterModel.metaraces.length).toEqual(9);
      expect(component.characterModel.abilitiesRandomizerTypes.length).toEqual(10);
      expect(component.characterModel.abilitiesRandomizerTypes).toContain('Set');
    });
  
    it(`should set initial values on init`, () => {
      const component = fixture.componentInstance;
      expect(component.alignmentRandomizerType).toEqual(component.characterModel.alignmentRandomizerTypes[0]);
      expect(component.setAlignment).toEqual(component.characterModel.alignments[0]);

      expect(component.classNameRandomizerType).toEqual(component.characterModel.classNameRandomizerTypes[0]);
      expect(component.setClassName).toEqual(component.characterModel.classNames[0]);

      expect(component.levelRandomizerType).toEqual(component.characterModel.levelRandomizerTypes[0]);
      expect(component.setLevel).toEqual(0);
      expect(component.allowLevelAdjustments).toEqual(true);

      expect(component.baseRaceRandomizerType).toEqual(component.characterModel.baseRaceRandomizerTypes[0]);
      expect(component.setBaseRace).toEqual(component.characterModel.baseRaces[0]);

      expect(component.metaraceRandomizerType).toEqual(component.characterModel.metaraceRandomizerTypes[0]);
      expect(component.forceMetarace).toEqual(false);
      expect(component.setMetarace).toEqual(component.characterModel.metaraces[0]);

      expect(component.abilitiesRandomizerType).toEqual(component.characterModel.abilitiesRandomizerTypes[0]);
      expect(component.setStrength).toEqual(0);
      expect(component.setConstitution).toEqual(0);
      expect(component.setDexterity).toEqual(0);
      expect(component.setIntelligence).toEqual(0);
      expect(component.setWisdom).toEqual(0);
      expect(component.setCharisma).toEqual(0);
      
      expect(component.leaderAlignment).toEqual(component.characterModel.alignments[0]);
      expect(component.leaderClassName).toEqual(component.characterModel.classNames[0]);
      expect(component.leaderLevel).toEqual(6);
      expect(component.leaderCharismaBonus).toEqual(0);
      expect(component.leaderAnimal).toEqual('');
    });
  
    it(`should validate inputs on init/changes`, async () => {
      const component = fixture.componentInstance;
      expect(component.loading).toBeFalse();
      expect(component.validating).toBeFalse();
      expect(component.generating).toBeFalse();
      expect(component.valid).toBeTrue();
    });
  
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

    function expectValidating(buttonSelector: string, validatingSelector: string) {
      expect(fixture.componentInstance.validating).toBeTrue();
      expectHasAttribute(buttonSelector, 'disabled', true);
      expectHasAttribute(validatingSelector, 'hidden', false);
    }

    function expectGenerating(buttonSelector: string, validatingSelector?: string) {
      expect(fixture.componentInstance.generating).toBeTrue();
      expectHasAttribute(buttonSelector, 'disabled', true);

      if (validatingSelector)
        expectHasAttribute(validatingSelector, 'hidden', true);

      expectHasAttribute('#generatingSection', 'hidden', false);
      expectHasAttribute('#characterSection', 'hidden', true);
      expectHasAttribute('#downloadButton', 'hidden', true);
    }

    function expectHasAttribute(selector: string, attribute: string, hasAttribute: boolean) {
      const compiled = fixture.nativeElement as HTMLElement;

      const element = compiled!.querySelector(selector);
      expect(element).toBeDefined();
      expect(element?.hasAttribute(attribute)).toBe(hasAttribute);
    }

    function expectExists(selector: string, exists: boolean) {
      const compiled = fixture.nativeElement as HTMLElement;

      const element = compiled!.querySelector(selector);
      if (exists) {
        expect(element).toBeTruthy();
      } else {
        expect(element).toBeFalsy();
      }
    }

    function expectGenerated(buttonSelector: string, validatingSelector?: string) {
      expect(fixture.componentInstance.generating).toBeFalse();
      expectHasAttribute(buttonSelector, 'disabled', false);

      if (validatingSelector)
        expectHasAttribute(validatingSelector, 'hidden', true);

      expectHasAttribute('#generatingSection', 'hidden', true);
      expectHasAttribute('#characterSection', 'hidden', false);
      expectHasAttribute('#downloadButton', 'hidden', false);
    }

    function expectInvalid(validProperty: boolean, buttonSelector: string, validatingSelector: string) {
      expect(fixture.componentInstance.validating).toBeFalse();
      expect(validProperty).toBeFalse();
      expectHasAttribute(buttonSelector, 'disabled', true);
      expectHasAttribute(validatingSelector, 'hidden', true);
    }

    function expectValid(validProperty: boolean, buttonSelector: string, validatingSelector: string) {
      expect(fixture.componentInstance.validating).toBeFalse();
      expect(validProperty).toBeTrue();
      expectHasAttribute(buttonSelector, 'disabled', false);
      expectHasAttribute(validatingSelector, 'hidden', true);
    }

    function setInput(selector: string, value: string) {
      expectHasAttribute(selector, 'hidden', false);
      expectHasAttribute(selector, 'disabled', false);
      
      const compiled = fixture.nativeElement as HTMLElement;
      const input = compiled!.querySelector(selector) as HTMLInputElement;
      input.value = value;

      input.dispatchEvent(new Event('input'));
    }

    function setCheckbox(selector: string, value: boolean) {
      expectHasAttribute(selector, 'hidden', false);
      expectHasAttribute(selector, 'disabled', false);

      const compiled = fixture.nativeElement as HTMLElement;
      const checkbox = compiled!.querySelector(selector) as HTMLInputElement;
      checkbox.checked = value;

      checkbox.dispatchEvent(new Event('change'));
    }

    function setSelectByValue(selector: string, value: string) {
      expectHasAttribute(selector, 'hidden', false);
      expectHasAttribute(selector, 'disabled', false);

      const compiled = fixture.nativeElement as HTMLElement;
      const select = compiled!.querySelector(selector) as HTMLSelectElement;
      select.value = value;

      select.dispatchEvent(new Event('change'));
    }

    function setSelectByIndex(selector: string, index: number) {
      expectHasAttribute(selector, 'hidden', false);
      expectHasAttribute(selector, 'disabled', false);

      const compiled = fixture.nativeElement as HTMLElement;
      const select = compiled!.querySelector(selector) as HTMLSelectElement;
      select.value = select.options[index].value;

      select.dispatchEvent(new Event('change'));
    }

    function clickButton(selector: string) {
      expectHasAttribute(selector, 'hidden', false);
      expectHasAttribute(selector, 'disabled', false);

      const compiled = fixture.nativeElement as HTMLElement;
      const button = compiled!.querySelector(selector) as HTMLButtonElement;

      button.dispatchEvent(new Event('click'));
    }

    function expectInput(tab: Element, selector: string, required: boolean, value: string) {
      const input = tab!.querySelector(selector) as HTMLInputElement;
      expect(input).toBeTruthy();
      expect(input!.value).toEqual(value);
      expect(input.getAttribute('type')).toEqual('text');
      expectHasAttribute(selector, 'required', required);
    }

    function expectNumberInput(tab: Element, selector: string, required: boolean, value: number, min?: number, max?: number) {
      const input = tab!.querySelector(selector) as HTMLInputElement;
      expect(input).toBeTruthy();
      expect(input!.value).toEqual(`${value}`);
      expect(input.getAttribute('type')).toEqual('number');

      if (min)
        expect(input.getAttribute('min')).toEqual(`${min}`);

      if (max)
        expect(input.getAttribute('max')).toEqual(`${max}`);
      
      expect(input.getAttribute('pattern')).toEqual('^[0-9]+$');
      expectHasAttribute(selector, 'required', required);
    }

    function expectCheckboxInput(tab: Element, selector: string, required: boolean, value: boolean) {
      const input = tab!.querySelector(selector) as HTMLInputElement;
      expect(input).toBeTruthy();
      expect(input!.value).toEqual(`${value}`);
      expect(input.getAttribute('checkbox')).toEqual('number');
      expectHasAttribute(selector, 'required', required);
    }

    function expectSelect(tab: Element, selector: string, required: boolean, selectedValue: string, optionCount: number) {   
      const randomizerTypesSelect = tab!.querySelector(selector);
      expect(randomizerTypesSelect).toBeTruthy();
      expectHasAttribute(selector, 'required', required);

      const selectedRandomizerType = tab!.querySelector(`${selector} > option:checked`);
      expect(selectedRandomizerType).toBeTruthy();
      expect(selectedRandomizerType!.textContent).toEqual(selectedValue);

      const randomizerTypeOptions = tab!.querySelectorAll(`${selector} > option`);
      expect(randomizerTypeOptions).toBeTruthy();
      expect(randomizerTypeOptions!.length).toEqual(optionCount);
    }

    describe('the character tab', () => {
      it(`should render the character tab`, () => {
        const compiled = fixture.nativeElement as HTMLElement;
  
        const characterTab = compiled.querySelector('#character');
        expect(characterTab).toBeDefined();
        
        expectSelect(characterTab!, '#alignmentRandomizerTypes', true, 'Any', 1);
        expectSelect(characterTab!, '#setAlignments', false, 'Lawful Good', 9);
        
        expectSelect(characterTab!, '#classNameRandomizerTypes', true, 'Any Player', 2);
        expectSelect(characterTab!, '#setClassNames', false, 'Barbarian', 3);

        expectSelect(characterTab!, '#levelRandomizerTypes', true, 'Any', 4);
        expectCheckboxInput(characterTab!, '#levelAdjustCheckbox', false, true);
        expectNumberInput(characterTab!, '#setLevel', false, 1, 1, 20);

        expectSelect(characterTab!, '#baseRaceRandomizerTypes', true, 'Any Base', 5);
        expectSelect(characterTab!, '#setBaseRaces', false, 'Human', 6);

        expectSelect(characterTab!, '#metaraceRandomizerTypes', true, 'Any Meta', 7);
        expectCheckboxInput(characterTab!, '#forceMetaraceCheckbox', false, false);
        expectSelect(characterTab!, '#setMetaraces', false, 'Ghost', 8);

        expectSelect(characterTab!, '#abilitiesRandomizerTypes', true, 'Raw', 9);
        expectCheckboxInput(characterTab!, '#abilitiesAdjustCheckbox', false, true);
        expectNumberInput(characterTab!, '#setStrength', false, 0, 0);
        expectNumberInput(characterTab!, '#setConstitution', false, 0, 0);
        expectNumberInput(characterTab!, '#setDexterity', false, 0, 0);
        expectNumberInput(characterTab!, '#setIntelligence', false, 0, 0);
        expectNumberInput(characterTab!, '#setWisdom', false, 0, 0);
        expectNumberInput(characterTab!, '#setCharisma', false, 0, 0);

        expectHasAttribute('#generateCharacterButton', 'disabled', false);
        expectHasAttribute('#characterValidating', 'hidden', true);
      });
    
      it(`should show when validating character`, () => {
        const component = fixture.componentInstance;
        component.validating = true;
  
        fixture.detectChanges();

        expectValidating('#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - missing alignment randomizer`, () => {
        setSelectByValue('#alignmentRandomizerTypes', '');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.alignmentRandomizerType).toBeNull();
        expectInvalid(fixture.componentInstance.valid, '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - missing set alignment`, () => {
        setSelectByValue('#alignmentRandomizerTypes', 'Set');
        setSelectByValue('#setAlignment', '');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.alignmentRandomizerType).toEqual('Set');
        expect(fixture.componentInstance.setAlignment).toBeNull();
        expectInvalid(fixture.componentInstance.valid, '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - missing class name randomizer`, () => {
        setSelectByValue('#classNameRandomizerTypes', '');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.classNameRandomizerType).toBeNull();
        expectInvalid(fixture.componentInstance.valid, '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - missing set class name`, () => {
        setSelectByValue('#classNameRandomizerTypes', 'Set');
        setSelectByValue('#setClassName', '');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.classNameRandomizerType).toEqual('Set');
        expect(fixture.componentInstance.setClassName).toBeNull();
        expectInvalid(fixture.componentInstance.valid, '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - missing level randomizer`, () => {
        setSelectByValue('#levelRandomizerTypes', '');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.levelRandomizerType).toBeNull();
        expectInvalid(fixture.componentInstance.valid, '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - missing set level`, () => {
        setSelectByValue('#levelRandomizerTypes', 'Set');
        setInput('#setLevel', '');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.levelRandomizerType).toEqual('Set');
        expect(fixture.componentInstance.setLevel).toBeNull();
        expectInvalid(fixture.componentInstance.valid, '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - set level invalid`, () => {
        setSelectByValue('#levelRandomizerTypes', 'Set');
        setInput('#setLevel', 'wrong');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.levelRandomizerType).toEqual('Set');
        expect(fixture.componentInstance.setLevel).toBeNull();
        expectInvalid(fixture.componentInstance.valid, '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - set level too low`, () => {
        setSelectByValue('#levelRandomizerTypes', 'Set');
        setInput('#setLevel', '-1');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.levelRandomizerType).toEqual('Set');
        expect(fixture.componentInstance.setLevel).toBeNull();
        expectInvalid(fixture.componentInstance.valid, '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - set level too high`, () => {
        setSelectByValue('#levelRandomizerTypes', 'Set');
        setInput('#setLevel', '21');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.levelRandomizerType).toEqual('Set');
        expect(fixture.componentInstance.setLevel).toBeNull();
        expectInvalid(fixture.componentInstance.valid, '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - missing base race randomizer`, () => {
        setSelectByValue('#baseRaceRandomizerTypes', '');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.baseRaceRandomizerType).toBeNull();
        expectInvalid(fixture.componentInstance.valid, '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - missing set base race`, () => {
        setSelectByValue('#baseRaceRandomizerTypes', 'Set');
        setSelectByValue('#setBaseRace', '');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.baseRaceRandomizerType).toEqual('Set');
        expect(fixture.componentInstance.setBaseRace).toBeNull();
        expectInvalid(fixture.componentInstance.valid, '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - missing metarace randomizer`, () => {
        setSelectByValue('#metaraceRandomizerTypes', '');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.metaraceRandomizerType).toBeNull();
        expectInvalid(fixture.componentInstance.valid, '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - missing set metarace`, () => {
        setSelectByValue('#metaraceRandomizerTypes', 'Set');
        setSelectByValue('#setMetarace', '');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.metaraceRandomizerType).toEqual('Set');
        expect(fixture.componentInstance.setMetarace).toBeNull();
        expectInvalid(fixture.componentInstance.valid, '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - missing abilities randomizer`, () => {
        setSelectByValue('#abilitiesRandomizerTypes', '');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.abilitiesRandomizerType).toBeNull();
        expectInvalid(fixture.componentInstance.valid, '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - missing set strength`, () => {
        setSelectByValue('#abilitiesRandomizerTypes', 'Set');
        setInput('#setStrength', '');
        setInput('#setConstitution', '26');
        setInput('#setDexterity', '6');
        setInput('#setIntellience', '2');
        setInput('#setWisdom', '10');
        setInput('#setCharisma', '4');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.abilitiesRandomizerType).toEqual('Set');
        expect(fixture.componentInstance.setStrength).toBeNull();
        expect(fixture.componentInstance.setConstitution).toEqual(26);
        expect(fixture.componentInstance.setDexterity).toEqual(6);
        expect(fixture.componentInstance.setIntelligence).toEqual(2);
        expect(fixture.componentInstance.setWisdom).toEqual(10);
        expect(fixture.componentInstance.setCharisma).toEqual(4);
        expectInvalid(fixture.componentInstance.valid, '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - set strength invalid`, () => {
        setSelectByValue('#abilitiesRandomizerTypes', 'Set');
        setInput('#setStrength', 'wrong');
        setInput('#setConstitution', '26');
        setInput('#setDexterity', '6');
        setInput('#setIntellience', '2');
        setInput('#setWisdom', '10');
        setInput('#setCharisma', '4');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.abilitiesRandomizerType).toEqual('Set');
        expect(fixture.componentInstance.setStrength).toBeNull();
        expect(fixture.componentInstance.setConstitution).toEqual(26);
        expect(fixture.componentInstance.setDexterity).toEqual(6);
        expect(fixture.componentInstance.setIntelligence).toEqual(2);
        expect(fixture.componentInstance.setWisdom).toEqual(10);
        expect(fixture.componentInstance.setCharisma).toEqual(4);
        expectInvalid(fixture.componentInstance.valid, '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - set strength too low`, () => {
        setSelectByValue('#abilitiesRandomizerTypes', 'Set');
        setInput('#setStrength', '-1');
        setInput('#setConstitution', '26');
        setInput('#setDexterity', '6');
        setInput('#setIntellience', '2');
        setInput('#setWisdom', '10');
        setInput('#setCharisma', '4');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.abilitiesRandomizerType).toEqual('Set');
        expect(fixture.componentInstance.setStrength).toBeNull();
        expect(fixture.componentInstance.setConstitution).toEqual(26);
        expect(fixture.componentInstance.setDexterity).toEqual(6);
        expect(fixture.componentInstance.setIntelligence).toEqual(2);
        expect(fixture.componentInstance.setWisdom).toEqual(10);
        expect(fixture.componentInstance.setCharisma).toEqual(4);
        expectInvalid(fixture.componentInstance.valid, '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - missing set constitution`, () => {
        setSelectByValue('#abilitiesRandomizerTypes', 'Set');
        setInput('#setStrength', '9');
        setInput('#setConstitution', '');
        setInput('#setDexterity', '6');
        setInput('#setIntellience', '2');
        setInput('#setWisdom', '10');
        setInput('#setCharisma', '4');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.abilitiesRandomizerType).toEqual('Set');
        expect(fixture.componentInstance.setStrength).toEqual(9);
        expect(fixture.componentInstance.setConstitution).toBeNull();
        expect(fixture.componentInstance.setDexterity).toEqual(6);
        expect(fixture.componentInstance.setIntelligence).toEqual(2);
        expect(fixture.componentInstance.setWisdom).toEqual(10);
        expect(fixture.componentInstance.setCharisma).toEqual(4);
        expectInvalid(fixture.componentInstance.valid, '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - set constitution invalid`, () => {
        setSelectByValue('#abilitiesRandomizerTypes', 'Set');
        setInput('#setStrength', '9');
        setInput('#setConstitution', 'wrong');
        setInput('#setDexterity', '6');
        setInput('#setIntellience', '2');
        setInput('#setWisdom', '10');
        setInput('#setCharisma', '4');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.abilitiesRandomizerType).toEqual('Set');
        expect(fixture.componentInstance.setStrength).toEqual(9);
        expect(fixture.componentInstance.setConstitution).toBeNull();
        expect(fixture.componentInstance.setDexterity).toEqual(6);
        expect(fixture.componentInstance.setIntelligence).toEqual(2);
        expect(fixture.componentInstance.setWisdom).toEqual(10);
        expect(fixture.componentInstance.setCharisma).toEqual(4);
        expectInvalid(fixture.componentInstance.valid, '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - set constitution too low`, () => {
        setSelectByValue('#abilitiesRandomizerTypes', 'Set');
        setInput('#setStrength', '9');
        setInput('#setConstitution', '-1');
        setInput('#setDexterity', '6');
        setInput('#setIntellience', '2');
        setInput('#setWisdom', '10');
        setInput('#setCharisma', '4');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.abilitiesRandomizerType).toEqual('Set');
        expect(fixture.componentInstance.setStrength).toEqual(9);
        expect(fixture.componentInstance.setConstitution).toBeNull();
        expect(fixture.componentInstance.setDexterity).toEqual(6);
        expect(fixture.componentInstance.setIntelligence).toEqual(2);
        expect(fixture.componentInstance.setWisdom).toEqual(10);
        expect(fixture.componentInstance.setCharisma).toEqual(4);
        expectInvalid(fixture.componentInstance.valid, '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - missing set dexterity`, () => {
        setSelectByValue('#abilitiesRandomizerTypes', 'Set');
        setInput('#setStrength', '9');
        setInput('#setConstitution', '26');
        setInput('#setDexterity', '');
        setInput('#setIntellience', '2');
        setInput('#setWisdom', '10');
        setInput('#setCharisma', '4');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.abilitiesRandomizerType).toEqual('Set');
        expect(fixture.componentInstance.setStrength).toEqual(9);
        expect(fixture.componentInstance.setConstitution).toEqual(26);
        expect(fixture.componentInstance.setDexterity).toEqual(0);
        expect(fixture.componentInstance.setIntelligence).toEqual(2);
        expect(fixture.componentInstance.setWisdom).toEqual(10);
        expect(fixture.componentInstance.setCharisma).toEqual(4);
        expectInvalid(fixture.componentInstance.valid, '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - set dexterity invalid`, () => {
        setSelectByValue('#abilitiesRandomizerTypes', 'Set');
        setInput('#setStrength', '9');
        setInput('#setConstitution', '26');
        setInput('#setDexterity', 'wrong');
        setInput('#setIntellience', '2');
        setInput('#setWisdom', '10');
        setInput('#setCharisma', '4');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.abilitiesRandomizerType).toEqual('Set');
        expect(fixture.componentInstance.setStrength).toEqual(9);
        expect(fixture.componentInstance.setConstitution).toEqual(26);
        expect(fixture.componentInstance.setDexterity).toEqual(0);
        expect(fixture.componentInstance.setIntelligence).toEqual(2);
        expect(fixture.componentInstance.setWisdom).toEqual(10);
        expect(fixture.componentInstance.setCharisma).toEqual(4);
        expectInvalid(fixture.componentInstance.valid, '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - set dexterity too low`, () => {
        setSelectByValue('#abilitiesRandomizerTypes', 'Set');
        setInput('#setStrength', '9');
        setInput('#setConstitution', '26');
        setInput('#setDexterity', '-1');
        setInput('#setIntellience', '2');
        setInput('#setWisdom', '10');
        setInput('#setCharisma', '4');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.abilitiesRandomizerType).toEqual('Set');
        expect(fixture.componentInstance.setStrength).toEqual(9);
        expect(fixture.componentInstance.setConstitution).toEqual(26);
        expect(fixture.componentInstance.setDexterity).toEqual(0);
        expect(fixture.componentInstance.setIntelligence).toEqual(2);
        expect(fixture.componentInstance.setWisdom).toEqual(10);
        expect(fixture.componentInstance.setCharisma).toEqual(4);
        expectInvalid(fixture.componentInstance.valid, '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - missing set intelligence`, () => {
        setSelectByValue('#abilitiesRandomizerTypes', 'Set');
        setInput('#setStrength', '9');
        setInput('#setConstitution', '26');
        setInput('#setDexterity', '6');
        setInput('#setIntellience', '');
        setInput('#setWisdom', '10');
        setInput('#setCharisma', '4');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.abilitiesRandomizerType).toEqual('Set');
        expect(fixture.componentInstance.setStrength).toEqual(9);
        expect(fixture.componentInstance.setConstitution).toEqual(26);
        expect(fixture.componentInstance.setDexterity).toEqual(6);
        expect(fixture.componentInstance.setIntelligence).toEqual(0);
        expect(fixture.componentInstance.setWisdom).toEqual(10);
        expect(fixture.componentInstance.setCharisma).toEqual(4);
        expectInvalid(fixture.componentInstance.valid, '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - set intelligence invalid`, () => {
        setSelectByValue('#abilitiesRandomizerTypes', 'Set');
        setInput('#setStrength', '9');
        setInput('#setConstitution', '26');
        setInput('#setDexterity', '6');
        setInput('#setIntellience', 'wrong');
        setInput('#setWisdom', '10');
        setInput('#setCharisma', '4');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.abilitiesRandomizerType).toEqual('Set');
        expect(fixture.componentInstance.setStrength).toEqual(9);
        expect(fixture.componentInstance.setConstitution).toEqual(26);
        expect(fixture.componentInstance.setDexterity).toEqual(6);
        expect(fixture.componentInstance.setIntelligence).toEqual(0);
        expect(fixture.componentInstance.setWisdom).toEqual(10);
        expect(fixture.componentInstance.setCharisma).toEqual(4);
        expectInvalid(fixture.componentInstance.valid, '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - set intelligence too low`, () => {
        setSelectByValue('#abilitiesRandomizerTypes', 'Set');
        setInput('#setStrength', '9');
        setInput('#setConstitution', '26');
        setInput('#setDexterity', '6');
        setInput('#setIntellience', '-1');
        setInput('#setWisdom', '10');
        setInput('#setCharisma', '4');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.abilitiesRandomizerType).toEqual('Set');
        expect(fixture.componentInstance.setStrength).toEqual(9);
        expect(fixture.componentInstance.setConstitution).toEqual(26);
        expect(fixture.componentInstance.setDexterity).toEqual(6);
        expect(fixture.componentInstance.setIntelligence).toEqual(0);
        expect(fixture.componentInstance.setWisdom).toEqual(10);
        expect(fixture.componentInstance.setCharisma).toEqual(4);
        expectInvalid(fixture.componentInstance.valid, '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - missing set wisdom`, () => {
        setSelectByValue('#abilitiesRandomizerTypes', 'Set');
        setInput('#setStrength', '9');
        setInput('#setConstitution', '26');
        setInput('#setDexterity', '6');
        setInput('#setIntellience', '2');
        setInput('#setWisdom', '');
        setInput('#setCharisma', '4');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.abilitiesRandomizerType).toEqual('Set');
        expect(fixture.componentInstance.setStrength).toEqual(9);
        expect(fixture.componentInstance.setConstitution).toEqual(26);
        expect(fixture.componentInstance.setDexterity).toEqual(6);
        expect(fixture.componentInstance.setIntelligence).toEqual(2);
        expect(fixture.componentInstance.setWisdom).toEqual(0);
        expect(fixture.componentInstance.setCharisma).toEqual(4);
        expectInvalid(fixture.componentInstance.valid, '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - set wisdom invalid`, () => {
        setSelectByValue('#abilitiesRandomizerTypes', 'Set');
        setInput('#setStrength', '9');
        setInput('#setConstitution', '26');
        setInput('#setDexterity', '6');
        setInput('#setIntellience', '2');
        setInput('#setWisdom', 'wrong');
        setInput('#setCharisma', '4');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.abilitiesRandomizerType).toEqual('Set');
        expect(fixture.componentInstance.setStrength).toEqual(9);
        expect(fixture.componentInstance.setConstitution).toEqual(26);
        expect(fixture.componentInstance.setDexterity).toEqual(6);
        expect(fixture.componentInstance.setIntelligence).toEqual(2);
        expect(fixture.componentInstance.setWisdom).toEqual(0);
        expect(fixture.componentInstance.setCharisma).toEqual(4);
        expectInvalid(fixture.componentInstance.valid, '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - set wisdom too low`, () => {
        setSelectByValue('#abilitiesRandomizerTypes', 'Set');
        setInput('#setStrength', '9');
        setInput('#setConstitution', '26');
        setInput('#setDexterity', '6');
        setInput('#setIntellience', '2');
        setInput('#setWisdom', '-1');
        setInput('#setCharisma', '4');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.abilitiesRandomizerType).toEqual('Set');
        expect(fixture.componentInstance.setStrength).toEqual(9);
        expect(fixture.componentInstance.setConstitution).toEqual(26);
        expect(fixture.componentInstance.setDexterity).toEqual(6);
        expect(fixture.componentInstance.setIntelligence).toEqual(2);
        expect(fixture.componentInstance.setWisdom).toEqual(0);
        expect(fixture.componentInstance.setCharisma).toEqual(4);
        expectInvalid(fixture.componentInstance.valid, '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - missing set charisma`, () => {
        setSelectByValue('#abilitiesRandomizerTypes', 'Set');
        setInput('#setStrength', '9');
        setInput('#setConstitution', '26');
        setInput('#setDexterity', '6');
        setInput('#setIntellience', '2');
        setInput('#setWisdom', '10');
        setInput('#setCharisma', '');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.abilitiesRandomizerType).toEqual('Set');
        expect(fixture.componentInstance.setStrength).toEqual(9);
        expect(fixture.componentInstance.setConstitution).toEqual(26);
        expect(fixture.componentInstance.setDexterity).toEqual(6);
        expect(fixture.componentInstance.setIntelligence).toEqual(2);
        expect(fixture.componentInstance.setWisdom).toEqual(10);
        expect(fixture.componentInstance.setCharisma).toEqual(0);
        expectInvalid(fixture.componentInstance.valid, '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - set charisma invalid`, () => {
        setSelectByValue('#abilitiesRandomizerTypes', 'Set');
        setInput('#setStrength', '9');
        setInput('#setConstitution', '26');
        setInput('#setDexterity', '6');
        setInput('#setIntellience', '2');
        setInput('#setWisdom', '10');
        setInput('#setCharisma', 'wrong');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.abilitiesRandomizerType).toEqual('Set');
        expect(fixture.componentInstance.setStrength).toEqual(9);
        expect(fixture.componentInstance.setConstitution).toEqual(26);
        expect(fixture.componentInstance.setDexterity).toEqual(6);
        expect(fixture.componentInstance.setIntelligence).toEqual(2);
        expect(fixture.componentInstance.setWisdom).toEqual(10);
        expect(fixture.componentInstance.setCharisma).toEqual(0);
        expectInvalid(fixture.componentInstance.valid, '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is invalid - set charisma too low`, () => {
        setSelectByValue('#abilitiesRandomizerTypes', 'Set');
        setInput('#setStrength', '9');
        setInput('#setConstitution', '26');
        setInput('#setDexterity', '6');
        setInput('#setIntellience', '2');
        setInput('#setWisdom', '10');
        setInput('#setCharisma', '-1');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.abilitiesRandomizerType).toEqual('Set');
        expect(fixture.componentInstance.setStrength).toEqual(9);
        expect(fixture.componentInstance.setConstitution).toEqual(26);
        expect(fixture.componentInstance.setDexterity).toEqual(6);
        expect(fixture.componentInstance.setIntelligence).toEqual(2);
        expect(fixture.componentInstance.setWisdom).toEqual(10);
        expect(fixture.componentInstance.setCharisma).toEqual(0);
        expectInvalid(fixture.componentInstance.valid, '#generateCharacterButton', '#characterValidating');
      });
    
      // const levelTestCases = [1, 2, 10, 20];

      // levelTestCases.forEach(test => {
      //   it(`should show that treasure is valid - level ${test}`, async () => {
      //     setInput('#treasureLevel', test.toString());
    
      //     fixture.detectChanges();
    
      //     expect(fixture.componentInstance.level).toEqual(test);
      //     expectValidating('#generateCharacterButton', '#characterValidating');
    
      //     //run validation
      //     await waitForService();
    
      //     expectValid(fixture.componentInstance.valid, '#generateCharacterButton', '#characterValidating');
      //   });
      // });

      it(`should show that character is invalid - validation fails`, async () => {
        setSelectByValue('#alignmentRandomizerType', 'Good');
        setSelectByValue('#metaraceRandomizerType', 'Set');
        setSelectByValue('#setMetarace', 'Lich');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.alignmentRandomizerType).toEqual(fixture.componentInstance.characterModel.alignmentRandomizerTypes[3]);
        expectValidating('#generateCharacterButton', '#characterValidating');
  
        //run validation
        await waitForService();
  
        expectInvalid(fixture.componentInstance.valid, '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show that character is valid - validation succeeds`, async () => {
        setSelectByValue('#alignmentRandomizerType', 'Evil');
        setSelectByValue('#metaraceRandomizerType', 'Set');
        setSelectByValue('#setMetarace', 'Lich');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.alignmentRandomizerType).toEqual(fixture.componentInstance.characterModel.alignmentRandomizerTypes[3]);
        expectValidating('#generateCharacterButton', '#characterValidating');
  
        //run validation
        await waitForService();
  
        expectValid(fixture.componentInstance.valid, '#generateCharacterButton', '#characterValidating');
      });
    
      it(`should show when generating a character`, () => {
        const component = fixture.componentInstance;
        component.generating = true;
  
        fixture.detectChanges();

        expectGenerating('#generateCharacterButton', '#characterValidating');
      });
    
      it(`should generate the default character`, async () => {
        clickButton('#generateCharacterButton');
  
        fixture.detectChanges();
        
        expectGenerating('#generateCharacterButton', '#characterValidating');

        //run generate character
        await waitForService();
  
        expectGenerated('#generateCharacterButton', '#characterValidating');

        expectHasAttribute('#noCharacter', 'hidden', true)
        expectExists('#characterSection dndgen-character', true);
        expectExists('#characterSection dndgen-leadership', false);

        const element = fixture.debugElement.query(By.css('#characterSection dndgen-character'));
        expect(element).toBeDefined();
        expect(element.componentInstance).toBeDefined();
        expect(element.componentInstance).toBeInstanceOf(CharacterComponent);
  
        const characterComponent = element.componentInstance as CharacterComponent;
        expect(characterComponent.character).toBeTruthy();
      });
    
      it(`should generate non-default character`, async () => {
        setSelectByValue('#alignmentRandomizerType', 'Non-Evil');
        setSelectByValue('#classNameRandomizerType', 'Physical Combat');
        setSelectByValue('#levelRandomizerType', 'Low');
        setCheckbox('#levelAdjustCheckbox', false);
        setSelectByValue('#baseRaceRandomizerType', 'Non-Monster');
        setSelectByValue('#metaraceRandomizerType', 'Lycanthrope');
        setCheckbox('#forceMetaraceCheckbox', true);
        setSelectByValue('#abilitiesRandomizerType', 'Ones as Sixes');
  
        fixture.detectChanges();

        expect(fixture.componentInstance.alignmentRandomizerType).toEqual('Non-Evil');
        expect(fixture.componentInstance.classNameRandomizerType).toEqual('Physical Combat');
        expect(fixture.componentInstance.levelRandomizerType).toEqual('Low');
        expect(fixture.componentInstance.baseRaceRandomizerType).toEqual('Non-Monster');
        expect(fixture.componentInstance.metaraceRandomizerType).toEqual('Lycanthrope');
        expect(fixture.componentInstance.abilitiesRandomizerType).toEqual('Ones as Sixes');

        //run validation
        await waitForService();

        clickButton('#generateCharacterButton');
  
        fixture.detectChanges();
        
        expectGenerating('#generateCharacterButton', '#characterValidating');

        //run generate character
        await waitForService();
  
        expectGenerated('#generateCharacterButton', '#characterValidating');

        expectHasAttribute('#noCharacter', 'hidden', true)
        expectExists('#characterSection dndgen-character', true);
        expectExists('#characterSection dndgen-leadership', false);

        const element = fixture.debugElement.query(By.css('#characterSection dndgen-character'));
        expect(element).toBeDefined();
        expect(element.componentInstance).toBeDefined();
        expect(element.componentInstance).toBeInstanceOf(CharacterComponent);
  
        const characterComponent = element.componentInstance as CharacterComponent;
        expect(characterComponent.character).toBeTruthy();
      });
    
      it(`should generate non-default character - set values`, async () => {
        setSelectByValue('#alignmentRandomizerType', 'Set');
        setSelectByValue('#setAlignment', 'Neutral Good');
        setSelectByValue('#classNameRandomizerType', 'Set');
        setSelectByValue('#setClassName', 'Fighter');
        setSelectByValue('#levelRandomizerType', 'Set');
        setCheckbox('#levelAdjustCheckbox', false);
        setInput('#setLevel', '4');
        setSelectByValue('#baseRaceRandomizerType', 'Set');
        setSelectByValue('#setBaseRace', 'Mountain Dwarf');
        setSelectByValue('#metaraceRandomizerType', 'Set');
        setSelectByValue('#setMetarace', 'Half-Dragon');
        setSelectByValue('#abilitiesRandomizerType', 'Set');
        setInput('#setStrength', '9');
        setInput('#setConstitution', '21');
        setInput('#setDexterity', '2');
        setInput('#setIntelligence', '6');
        setInput('#setWisdom', '13');
        setInput('#setCharisma', '3');
  
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
        await waitForService();

        clickButton('#generateCharacterButton');
  
        fixture.detectChanges();
        
        expectGenerating('#generateCharacterButton', '#characterValidating');

        //run generate character
        await waitForService();
  
        expectGenerated('#generateCharacterButton', '#characterValidating');

        expectHasAttribute('#noCharacter', 'hidden', true)
        expectExists('#characterSection dndgen-character', true);
        expectExists('#characterSection dndgen-leadership', false);

        const element = fixture.debugElement.query(By.css('#characterSection dndgen-character'));
        expect(element).toBeDefined();
        expect(element.componentInstance).toBeDefined();
        expect(element.componentInstance).toBeInstanceOf(CharacterComponent);
  
        const characterComponent = element.componentInstance as CharacterComponent;
        expect(characterComponent.character).toBeTruthy();
      });
    });
  
    describe('the leadership tab', () => {
      it(`should render the leadership tab`, () => {
        const compiled = fixture.nativeElement as HTMLElement;
  
        const leadershipTab = compiled.querySelector('#leadership');
        expect(leadershipTab).toBeTruthy();
  
        expectSelect(leadershipTab!, '#leaderAlignment', true, 'Lawful Good', 9);
        expectSelect(leadershipTab!, '#leaderClassName', true, 'Barbarian', 11);
        expectNumberInput(leadershipTab!, '#leaderLevel', true, 6, 6, 20);
        expectNumberInput(leadershipTab!, '#leaderCharismaBonus', false, 0);
        expectInput(leadershipTab!, '#leaderAnimal', false, '');

        expectHasAttribute('#generateLeadershipButton', 'disabled', false);
      });
    
      it(`should show when generating leadership`, () => {
        const component = fixture.componentInstance;
        component.generating = true;
  
        fixture.detectChanges();

        expectGenerating('#generateLeadershipButton');
      });
    
      it(`should generate default leadership`, async () => {
        clickButton('#generateLeadershipButton');
  
        fixture.detectChanges();
        
        expectGenerating('#generateLeadershipButton');

        //run generate leadership
        await waitForService();
  
        expectGenerated('#generateLeadershipButton');
        
        expectHasAttribute('#noCharacter', 'hidden', true)
        expectExists('#characterSection dndgen-character', false);
        expectExists('#characterSection dndgen-leadership', true);

        const element = fixture.debugElement.query(By.css('#characterSection dndgen-leadership'));
        expect(element).toBeDefined();
        expect(element.componentInstance).toBeDefined();
        expect(element.componentInstance).toBeInstanceOf(LeadershipComponent);
  
        const leadershipComponent = element.componentInstance as LeadershipComponent;
        expect(leadershipComponent.leadership).toBeTruthy();
        expect(leadershipComponent.cohort).toBeTruthy();
        expect(leadershipComponent.followers.length).toBeGreaterThan(0);
      });
    
      it(`should generate non-default leadership`, async () => {
        setSelectByValue('#leaderAlignment', 'Chaotic Neutral');
        setSelectByValue('#leaderClassName', 'Sorcerer');
        setInput('#leaderLevel', '20');
        setInput('#leaderCharismaBonus', '5');
        setInput('#leaderAnimal', 'Weasel');
  
        fixture.detectChanges();

        expect(fixture.componentInstance.leaderAlignment).toEqual('Chaotic Neutral');
        expect(fixture.componentInstance.leaderClassName).toEqual('Sorcerer');
        expect(fixture.componentInstance.leaderLevel).toEqual(20);
        expect(fixture.componentInstance.leaderCharismaBonus).toEqual(5);
        expect(fixture.componentInstance.leaderAnimal).toEqual('Weasel');

        clickButton('#generateLeadershipButton');
  
        fixture.detectChanges();
        
        expectGenerating('#generateLeadershipButton');

        //run roll
        await waitForService();
  
        expectGenerated('#generateLeadershipButton');
        expectExists('#characterSection dndgen-character', false);
        expectExists('#characterSection dndgen-leadership', true);

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
      expectHasAttribute('#noCharacter', 'hidden', false);

      const compiled = fixture.nativeElement as HTMLElement;
      let element = compiled!.querySelector('#characterSection dndgen-character');
      expect(element).toBeFalsy();

      element = compiled!.querySelector('#characterSection dndgen-leadership');
      expect(element).toBeFalsy();
    });
    
    it(`should render character`, () => {
      const character = new Character('my character summary');
      fixture.componentInstance.character = character;

      fixture.detectChanges();

      expectHasAttribute('#noCharacter', 'hidden', true);
      expectHasAttribute('#characterSection dndgen-character', 'hidden', false);
      
      const debugElement = fixture.debugElement.query(By.css('#characterSection dndgen-character'));
      expect(debugElement).toBeTruthy();
      expect(debugElement.componentInstance).toBeTruthy();
      expect(debugElement.componentInstance).toBeInstanceOf(CharacterComponent);

      const characterComponent = debugElement.componentInstance as CharacterComponent;
      expect(characterComponent.character).toBe(character);
      
      const compiled = fixture.nativeElement as HTMLElement;
      let element = compiled!.querySelector('#characterSection dndgen-leadership');
      expect(element).toBeFalsy();
    });
    
    it(`should render leadership`, () => {
      const leadership = new Leadership(90210, ['has a castle', 'smelly']);
      fixture.componentInstance.leadership = leadership;

      fixture.detectChanges();

      expectHasAttribute('#noCharacter', 'hidden', true);
      expectHasAttribute('#characterSection dndgen-leadership', 'hidden', false);
      
      const debugElement = fixture.debugElement.query(By.css('#characterSection dndgen-leadership'));
      expect(debugElement).toBeTruthy();
      expect(debugElement.componentInstance).toBeTruthy();
      expect(debugElement.componentInstance).toBeInstanceOf(LeadershipComponent);

      const leadershipComponent = debugElement.componentInstance as LeadershipComponent;
      expect(leadershipComponent.leadership).toBe(leadership);
      
      const compiled = fixture.nativeElement as HTMLElement;
      let element = compiled!.querySelector('#characterSection dndgen-character');
      expect(element).toBeNull();
    });

    it(`should render leadership with cohort`, () => {
      expect('not yet written').toBe('');
    });

    it(`should render leadership with cohort and followers`, () => {
      expect('not yet written').toBe('');
    });

    it(`should render character and leadership`, () => {
      expect('not yet written').toBe('');
    });

    it(`should render character and full leadership`, () => {
      expect('not yet written').toBe('');
    });
    
    it(`should download treasure`, async () => {
      //Even for an integration test, we don't want to create an actual file
      let fileSaverSpy = spyOn(FileSaver, 'saveAs').and.stub();

      fixture.componentInstance.treasure = new Treasure(new Coin('munny', 9266));
      fixture.componentInstance.treasure.isAny = true;

      fixture.detectChanges();

      clickButton('#downloadCharacterButton');

      expect(FileSaver.saveAs).toHaveBeenCalledWith(
        jasmine.any(Blob),
        jasmine.stringMatching(/^Treasure \(.+, [0-9] goods, [0-9] items\)\.txt$/));
        
      const blob = fileSaverSpy.calls.first().args[0] as Blob;
      const text = await blob.text();
      expect(text).toEqual('9,266 munny\r\n' +
        'Goods (x0)\r\n' +
        'Items (x0)\r\n');
    });
    
    it(`should download item`, async () => {
      //Even for an integration test, we don't want to create an actual file
      let fileSaverSpy = spyOn(FileSaver, 'saveAs').and.stub();

      fixture.componentInstance.item = new Item('my item', 'my item type');
      fixture.componentInstance.item.description = 'my item description';

      fixture.detectChanges();

      clickButton('#downloadgenerateLeadershipButton');

      expect(FileSaver.saveAs).toHaveBeenCalledWith(
        jasmine.any(Blob),
        jasmine.stringMatching(/^Item \(my item description\)\.txt$/));
      
      const blob = fileSaverSpy.calls.first().args[0] as Blob;
      const text = await blob.text();
      expect(text).toEqual('my item\r\n');
    });
  });
});
