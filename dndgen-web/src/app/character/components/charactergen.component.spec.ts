import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { CharacterGenComponent } from './charactergen.component';
import { AppModule } from '../../app.module';
import { TreasureService } from '../services/treasure.service';
import { TreasurePipe } from '../pipes/treasure.pipe';
import { SweetAlertService } from '../../shared/services/sweetAlert.service';
import { LoggerService } from '../../shared/services/logger.service';
import { Observable } from 'rxjs';
import { TreasureGenViewModel } from '../models/treasuregenViewModel.model';
import { FileSaverService } from '../../shared/services/fileSaver.service';
import { ItemTypeViewModel } from '../models/itemTypeViewModel.model';
import { Treasure } from '../models/treasure.model';
import { Coin } from '../models/coin.model';
import { Item } from '../models/item.model';
import { By } from '@angular/platform-browser';
import { TreasureComponent } from './treasure.component';
import { ItemComponent } from './item.component';
import * as FileSaver from 'file-saver';
import { Good } from '../models/good.model';
import { ItemPipe } from '../pipes/item.pipe';
import { CharacterService } from '../services/character.service';
import { LeadershipService } from '../services/leadership.service';
import { LeaderPipe } from '../pipes/leader.pipe';
import { CharacterGenViewModel } from '../models/charactergenViewModel.model';
import { Character } from '../models/character.model';
import { Leadership } from '../models/leadership.model';
import { FollowerQuantities } from '../models/followerQuantities.model';

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

        expectLeadershipGenerating(character, leadership, null, []);

        flush();
      }));

      function expectLeadershipGenerating(leader: Character, leadership: Leadership, cohort: Character | null, followers: Character[]) {
        expect(leadershipServiceSpy.generate).toHaveBeenCalledWith(7, 8, 'my animal');
        expect(leadershipServiceSpy.generate).toHaveBeenCalledTimes(1);
        expect(leadershipServiceSpy.generateCohort).not.toHaveBeenCalled();
        expect(leadershipServiceSpy.generateFollower).not.toHaveBeenCalled();

        expect(component.generating).toBeTrue();
        expect(component.generatingMessage).toEqual('Generating leadership...');
        expect(component.character).toBe(leader);
        expect(component.leadership).toBeNull();
        expect(component.cohort).toBeNull();
        expect(component.followers).toEqual([]);
        
        tick(delay - 1);

        expect(component.generating).toBeTrue();
        expect(component.generatingMessage).toEqual('Generating leadership...');
        expect(component.character).toBe(leader);
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
        expect(component.character).toBe(leader);
        expect(component.leadership).toBe(leadership);
        expect(component.cohort).toBeNull();
        expect(component.followers).toEqual([]);
        
        tick(delay - 1);

        expect(component.generating).toBeTrue();
        expect(component.generatingMessage).toEqual('Generating cohort...');
        expect(component.character).toBe(leader);
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
          expect(component.character).toBe(leader);
          expect(component.leadership).toBe(leadership);
          expect(component.cohort).toBe(cohort);
          expect(component.followers).toEqual(followers.slice(0, i));
          
          tick(delay - 1);
  
          expect(component.generating).toBeTrue();
          expect(component.generatingMessage).toEqual(message);
          expect(component.character).toBe(leader);
          expect(component.leadership).toBe(leadership);
          expect(component.cohort).toBe(cohort);
          expect(component.followers).toEqual(followers.slice(0, i));  
        }
      }
      
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

        expectLeadershipGenerating(character, leadership, cohort, []);

        flush();
      }));
      
      it(`should be generating while generating character - leader with cohort and followers <= lvl 1 - level ${test.l}, metarace ${test.m}, abilities ${test.a}`, fakeAsync(() => {
        expect('not yet written').toEqual('');
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

        expectLeadershipGenerating(character, leadership, cohort, followers);
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
      
      it(`should be generating while generating character - leader with cohort and followers <= lvl 2 - level ${test.l}, metarace ${test.m}, abilities ${test.a}`, fakeAsync(() => {
        expect('not yet written').toEqual('');
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

        expectLeadershipGenerating(character, leadership, cohort, followers);
        expectFollowerCalls(followerQuantities);

        flush();
      }));
      
      it(`should be generating while generating character - leader with cohort and followers <= lvl 3 - level ${test.l}, metarace ${test.m}, abilities ${test.a}`, fakeAsync(() => {
        expect('not yet written').toEqual('');
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

        expectLeadershipGenerating(character, leadership, cohort, followers);
        expectFollowerCalls(followerQuantities);

        flush();
      }));
      
      it(`should be generating while generating character - leader with cohort and followers <= lvl 4 - level ${test.l}, metarace ${test.m}, abilities ${test.a}`, fakeAsync(() => {
        expect('not yet written').toEqual('');
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

        expectLeadershipGenerating(character, leadership, cohort, followers);
        expectFollowerCalls(followerQuantities);

        flush();
      }));
      
      it(`should be generating while generating character - leader with cohort and followers <= lvl 5 - level ${test.l}, metarace ${test.m}, abilities ${test.a}`, fakeAsync(() => {
        expect('not yet written').toEqual('');
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

        expectLeadershipGenerating(character, leadership, cohort, followers);
        expectFollowerCalls(followerQuantities);

        flush();
      }));
      
      it(`should be generating while generating character - leader with cohort and followers <= lvl 6 - level ${test.l}, metarace ${test.m}, abilities ${test.a}`, fakeAsync(() => {
        expect('not yet written').toEqual('');
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

        expectLeadershipGenerating(character, leadership, cohort, followers);
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

    it('should generate the default character - leader', fakeAsync(() => {
      expect('not yet written').toBe('');
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
      expect(loggerServiceSpy.logError).toHaveBeenCalledWith('I failed');
      expect(sweetAlertServiceSpy.showError).toHaveBeenCalledTimes(1);
    }));

    it('should be generating while generating leadership', fakeAsync(() => {
      setupOnInit();

      characterServiceSpy.getItem.and.callFake(() => getFakeDelay(new Item('my item', 'my item type')));

      component.generateItem();

      expect(characterServiceSpy.getItem).toHaveBeenCalledWith('it1', 'power 1', '');
      expect(component.generating).toBeTrue();
      
      tick(delay - 1);

      expect(component.generating).toBeTrue();

      flush();
    }));

    it('should be generating while generating an item with name', fakeAsync(() => {
      setupOnInit();
      
      characterServiceSpy.getItem.and.callFake(() => getFakeDelay(new Item('my item', 'my item type')));

      component.itemName = component.itemNames[0];

      component.generateItem();

      expect(characterServiceSpy.getItem).toHaveBeenCalledWith('it1', 'power 1', 'item 1');
      expect(component.generating).toBeTrue();
      
      tick(delay - 1);

      expect(component.generating).toBeTrue();

      flush();
    }));

    it('should generate the default item', fakeAsync(() => {
      setupOnInit();

      let item = new Item('my item', 'my item type');
      characterServiceSpy.getItem.and.callFake(() => getFakeDelay(item));

      component.generateItem();

      expect(characterServiceSpy.getItem).toHaveBeenCalledWith('it1', 'power 1', '');
      expect(component.generating).toBeTrue();

      tick(delay);

      expect(component.item).toBe(item);
      expect(component.generating).toBeFalse();
      
      expect(loggerServiceSpy.logError).not.toHaveBeenCalled();
      expect(sweetAlertServiceSpy.showError).not.toHaveBeenCalled();
    }));

    it('should generate the default item with name', fakeAsync(() => {
      setupOnInit();

      let item = new Item('my item', 'my item type');
      characterServiceSpy.getItem.and.callFake(() => getFakeDelay(item));

      component.itemName = component.itemNames[0];

      component.generateItem();

      expect(characterServiceSpy.getItem).toHaveBeenCalledWith('it1', 'power 1', 'item 1');
      expect(component.generating).toBeTrue();

      tick(delay);

      expect(component.item).toBe(item);
      expect(component.generating).toBeFalse();
      
      expect(loggerServiceSpy.logError).not.toHaveBeenCalled();
      expect(sweetAlertServiceSpy.showError).not.toHaveBeenCalled();
    }));

    it(`should generate a non-default item`, fakeAsync(() => {
      setupOnInit();

      let item = new Item('my item', 'my item type');
      characterServiceSpy.getItem.and.callFake(() => getFakeDelay(item));

      component.itemType = component.treasureModel.itemTypeViewModels[1];
      component.power = component.treasureModel.powers[1];

      component.generateItem();

      expect(characterServiceSpy.getItem).toHaveBeenCalledWith('it2', 'power 2', '');
      expect(component.generating).toBeTrue();

      tick(delay);

      expect(component.item).toBe(item);
      expect(component.generating).toBeFalse();
      
      expect(loggerServiceSpy.logError).not.toHaveBeenCalled();
      expect(sweetAlertServiceSpy.showError).not.toHaveBeenCalled();
    }));

    it(`should generate a non-default item with name`, fakeAsync(() => {
      setupOnInit();

      let item = new Item('my item', 'my item type');
      characterServiceSpy.getItem.and.callFake(() => getFakeDelay(item));

      component.itemType = component.treasureModel.itemTypeViewModels[1];
      component.power = component.treasureModel.powers[1];
      component.itemName = component.treasureModel.itemNames['it2'][1];

      component.generateItem();

      expect(characterServiceSpy.getItem).toHaveBeenCalledWith('it2', 'power 2', 'item 4');
      expect(component.generating).toBeTrue();

      tick(delay);

      expect(component.item).toBe(item);
      expect(component.generating).toBeFalse();
      
      expect(loggerServiceSpy.logError).not.toHaveBeenCalled();
      expect(sweetAlertServiceSpy.showError).not.toHaveBeenCalled();
    }));

    it('should display error from generating an item', fakeAsync(() => {
      setupOnInit();

      characterServiceSpy.getItem.and.callFake(() => getFakeError('I failed'));

      component.generateItem();
      tick(delay);

      expect(component.treasure).toBeNull();
      expect(component.item).toBeNull();
      expect(component.generating).toBeFalse();
      expect(component.validating).toBeFalse();
      
      expect(characterServiceSpy.getItem).toHaveBeenCalledWith('it1', 'power 1', '');
      expect(loggerServiceSpy.logError).toHaveBeenCalledWith('I failed');
      expect(sweetAlertServiceSpy.showError).toHaveBeenCalledTimes(1);
    }));

    it('should display error from generating an item with name', fakeAsync(() => {
      setupOnInit();

      characterServiceSpy.getItem.and.callFake(() => getFakeError('I failed'));

      component.itemName = component.itemNames[1];

      component.generateItem();
      tick(delay);

      expect(component.treasure).toBeNull();
      expect(component.item).toBeNull();
      expect(component.generating).toBeFalse();
      expect(component.validating).toBeFalse();
      
      expect(characterServiceSpy.getItem).toHaveBeenCalledWith('it1', 'power 1', 'item 2');
      expect(loggerServiceSpy.logError).toHaveBeenCalledWith('I failed');
      expect(sweetAlertServiceSpy.showError).toHaveBeenCalledTimes(1);
    }));

    it('should validate valid item and reset name', fakeAsync(() => {
      setupOnInit();

      characterServiceSpy.validateItem.and.callFake(() => getFakeDelay(true));

      component.validateItemAndResetName(component.treasureModel.itemTypeViewModels[1].itemType, 'my power', '');

      expect(component.itemName).toEqual('');

      expect(characterServiceSpy.validateItem).toHaveBeenCalledWith('it2', 'my power', '');
      expect(component.validating).toBeTrue();

      tick(delay);

      expect(component.validItem).toBeTrue();
      expect(component.validating).toBeFalse();
    }));

    it('should validate invalid item and reset name', fakeAsync(() => {
      setupOnInit();

      characterServiceSpy.validateItem.and.callFake(() => getFakeDelay(false));

      component.validateItemAndResetName(component.treasureModel.itemTypeViewModels[1].itemType, 'my power', '');

      expect(component.itemName).toEqual('');

      expect(characterServiceSpy.validateItem).toHaveBeenCalledWith('it2', 'my power', '');
      expect(component.validating).toBeTrue();

      tick(delay);

      expect(component.validItem).toBeFalse();
      expect(component.validating).toBeFalse();
    }));

    it('should download treasure - with coin', () => {
      let treasure = new Treasure(new Coin('munny', 9266));
      component.treasure = treasure;

      treasurePipeSpy.transform.and.returnValue('my formatted treasure');

      component.downloadTreasure();

      expect(treasurePipeSpy.transform).toHaveBeenCalledWith(treasure);
      expect(fileSaverServiceSpy.save).toHaveBeenCalledWith('my formatted treasure', 'Treasure (9266 munny, 0 goods, 0 items)');
    });

    it('should download treasure - with goods', () => {
      let treasure = new Treasure();
      treasure.goods = [new Good('good 1', 90210), new Good('good 2', 42)];
      component.treasure = treasure;

      treasurePipeSpy.transform.and.returnValue('my formatted treasure');

      component.downloadTreasure();

      expect(treasurePipeSpy.transform).toHaveBeenCalledWith(treasure);
      expect(fileSaverServiceSpy.save).toHaveBeenCalledWith('my formatted treasure', 'Treasure (0 coins, 2 goods, 0 items)');
    });

    it('should download treasure - with items', () => {
      let treasure = new Treasure();
      treasure.items = [new Item('item 1', 'itemtype'), new Item('item 2', 'itemtype')];
      component.treasure = treasure;

      treasurePipeSpy.transform.and.returnValue('my formatted treasure');

      component.downloadTreasure();

      expect(treasurePipeSpy.transform).toHaveBeenCalledWith(treasure);
      expect(fileSaverServiceSpy.save).toHaveBeenCalledWith('my formatted treasure', 'Treasure (0 coins, 0 goods, 2 items)');
    });

    it('should download treasure - all', () => {
      let treasure = new Treasure(new Coin('munny', 9266));
      treasure.goods = [new Good('good 1', 90210), new Good('good 2', 42)];
      treasure.items = [new Item('item 1', 'itemtype')];
      component.treasure = treasure;

      treasurePipeSpy.transform.and.returnValue('my formatted treasure');

      component.downloadTreasure();

      expect(treasurePipeSpy.transform).toHaveBeenCalledWith(treasure);
      expect(fileSaverServiceSpy.save).toHaveBeenCalledWith('my formatted treasure', 'Treasure (9266 munny, 2 goods, 1 items)');
    });

    it('should not download missing treasure', () => {
      component.treasure = null;

      component.downloadTreasure();
      
      expect(treasurePipeSpy.transform).not.toHaveBeenCalled();
      expect(fileSaverServiceSpy.save).not.toHaveBeenCalled();
    });

    it('should download empty treasure', () => {
      let treasure = new Treasure(new Coin(), [], []);
      component.treasure = treasure;

      treasurePipeSpy.transform.and.returnValue('my empty treasure');

      component.downloadTreasure();

      expect(treasurePipeSpy.transform).toHaveBeenCalledWith(treasure);
      expect(fileSaverServiceSpy.save).toHaveBeenCalledWith('my empty treasure', 'Treasure (0 coins, 0 goods, 0 items)');
    });

    it('should download item', () => {
      let item = new Item('my item', 'my item type');
      item.description = 'my item description'

      component.item = item;

      itemPipeSpy.transform.and.returnValue('my formatted item');

      component.downloadItem();

      expect(itemPipeSpy.transform).toHaveBeenCalledWith(item);
      expect(fileSaverServiceSpy.save).toHaveBeenCalledWith('my formatted item', 'Item (my item description)');
    });

    it('should not download missing item', () => {
      component.item = null;

      component.downloadItem();
      
      expect(itemPipeSpy.transform).not.toHaveBeenCalled();
      expect(fileSaverServiceSpy.save).not.toHaveBeenCalled();
    });

    it('BUG - should show an item is invalid - not a valid matching power', fakeAsync(() => {
      setupOnInit();

      characterServiceSpy.validateItem.and.callFake(() => getFakeDelay(false));

      const itemType = component.treasureModel.itemTypeViewModels[1];
      let power = component.treasureModel.powers[0];
      
      component.validateItemAndResetName(itemType.itemType, power, '');
      component.itemType = itemType;
      
      expect(component.itemType?.itemType).toEqual('it2');
      expect(component.itemName).toEqual('');

      expect(characterServiceSpy.validateItem).toHaveBeenCalledWith('it2', 'power 1', '');
      expect(component.validating).toBeTrue();

      tick(delay);

      expect(component.validItem).toBeFalse();
      expect(component.validating).toBeFalse();
  
      power = component.treasureModel.powers[1];
      component.validateItemAndResetName(itemType.itemType, power, '');
      component.power = power;
      
      expect(component.power).toEqual('power 2');

      expect(characterServiceSpy.validateItem).toHaveBeenCalledWith('it2', 'power 2', '');
      expect(component.validating).toBeTrue();

      tick(delay);

      expect(component.validItem).toBeFalse();
      expect(component.validating).toBeFalse();
    }));
  });

  describe('integration', () => {
    let fixture: ComponentFixture<TreasureGenComponent>;
  
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [
          AppModule
        ],
      }).compileComponents();
  
      fixture = TestBed.createComponent(TreasureGenComponent);
      
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
  
    it(`should set the treasure model on init`, () => {
      const component = fixture.componentInstance;
      expect(component.treasureModel).toBeDefined();
      expect(component.treasureModel.treasureTypes).toEqual(['Treasure', 'Coin', 'Goods', 'Items']);
      expect(component.treasureModel.maxTreasureLevel).toEqual(100);
      expect(component.treasureModel.powers).toEqual(['Mundane', 'Minor', 'Medium', 'Major']);
      expect(component.treasureModel.itemTypeViewModels.length).toEqual(11);

      for(var i = 0; i < component.treasureModel.itemTypeViewModels.length; i++) {
        let itemType = component.treasureModel.itemTypeViewModels[i].itemType;
        expect(component.treasureModel.itemNames[itemType]).toBeDefined();
        expect(component.treasureModel.itemNames[itemType].length).toBeGreaterThan(0);
      }
    });
  
    it(`should validate inputs on init/changes`, async () => {
      const component = fixture.componentInstance;
      expect(component.validating).toBeFalse();
      expect(component.generating).toBeFalse();
      expect(component.valid).toBeTrue();
      expect(component.validItem).toBeTrue();
    });
  
    it(`should render the tabs`, () => {
      const compiled = fixture.nativeElement as HTMLElement;
  
      const tabLinks = compiled.querySelectorAll('ul.nav-tabs a.nav-link');
      expect(tabLinks).toBeDefined();
      expect(tabLinks?.length).toEqual(2);
      expect(tabLinks?.item(0).textContent).toEqual('Treasure');
      expect(tabLinks?.item(0).getAttribute('class')).toContain('active');
      expect(tabLinks?.item(0).getAttribute('href')).toEqual('#treasure');
      expect(tabLinks?.item(1).textContent).toEqual('Item');
      expect(tabLinks?.item(1).getAttribute('class')).not.toContain('active');
      expect(tabLinks?.item(1).getAttribute('href')).toEqual('#item');
    });

    function expectValidating(buttonSelector: string, validatingSelector: string) {
      expect(fixture.componentInstance.validating).toBeTrue();
      expectHasAttribute(buttonSelector, 'disabled', true);
      expectHasAttribute(validatingSelector, 'hidden', false);
    }

    function expectGenerating(buttonSelector: string, validatingSelector: string) {
      expect(fixture.componentInstance.generating).toBeTrue();
      expectHasAttribute(buttonSelector, 'disabled', true);
      expectHasAttribute(validatingSelector, 'hidden', true);
      expectHasAttribute('#treasureSection', 'hidden', true);
      expectHasAttribute('#generatingSection', 'hidden', false);
      expectHasAttribute('#downloadTreasureButton', 'hidden', true);
      expectHasAttribute('#downloadItemButton', 'hidden', true);
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
        expect(element).not.toBeNull();
      } else {
        expect(element).toBeNull();
      }
    }

    function expectGenerated(buttonSelector: string, validatingSelector: string, downloadSelector: string) {
      expect(fixture.componentInstance.generating).toBeFalse();
      expectHasAttribute(buttonSelector, 'disabled', false);
      expectHasAttribute(validatingSelector, 'hidden', true);
      expectHasAttribute('#treasureSection', 'hidden', false);
      expectHasAttribute('#generatingSection', 'hidden', true);
      expectHasAttribute('#downloadTreasureButton', 'hidden', downloadSelector != '#downloadTreasureButton');
      expectHasAttribute('#downloadItemButton', 'hidden', downloadSelector != '#downloadItemButton');
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

    describe('the treasure tab', () => {
      it(`should render the treasure tab`, () => {
        const compiled = fixture.nativeElement as HTMLElement;
  
        const treasureTab = compiled.querySelector('#treasure');
        expect(treasureTab).toBeDefined();
        
        const treasureTypesSelect = treasureTab!.querySelector('#treasureTypes');
        expect(treasureTypesSelect).toBeDefined();
        expectHasAttribute('#treasureTypes', 'required', true);
  
        const selectedTreasureType = treasureTab!.querySelector('#treasureTypes > option:checked');
        expect(selectedTreasureType).toBeDefined();
        expect(selectedTreasureType?.textContent).toEqual('Treasure');
  
        const treasureTypeOptions = treasureTab!.querySelectorAll('#treasureTypes > option');
        expect(treasureTypeOptions).toBeDefined();
        expect(treasureTypeOptions?.length).toEqual(4);
        expect(treasureTypeOptions?.item(0).textContent).toEqual('Treasure');
        expect(treasureTypeOptions?.item(1).textContent).toEqual('Coin');
        expect(treasureTypeOptions?.item(2).textContent).toEqual('Goods');
        expect(treasureTypeOptions?.item(3).textContent).toEqual('Items');
  
        const levelInput = treasureTab!.querySelector('#treasureLevel') as HTMLInputElement;
        expect(levelInput).toBeDefined();
        expect(levelInput?.value).toEqual('1');
        expect(levelInput?.getAttribute('type')).toEqual('number');
        expect(levelInput?.getAttribute('min')).toEqual('1');
        expect(levelInput?.getAttribute('max')).toEqual('100');
        expect(levelInput?.getAttribute('pattern')).toEqual('^[0-9]+$');
        expectHasAttribute('#treasureLevel', 'required', true);

        expectHasAttribute('#treasureButton', 'disabled', false);
        expectHasAttribute('#treasureValidating', 'hidden', true);
      });
    
      it(`should show when validating treasure`, () => {
        const component = fixture.componentInstance;
        component.validating = true;
  
        fixture.detectChanges();

        expectValidating('#treasureButton', '#treasureValidating');
      });
    
      it(`should show that treasure is invalid - missing level`, () => {
        setInput('#treasureLevel', '');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.level).toBeNull();
        expectInvalid(fixture.componentInstance.valid, '#treasureButton', '#treasureValidating');
      });
    
      it(`should show that treasure is invalid - level invalid`, () => {
        setInput('#treasureLevel', 'wrong');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.level).toBeNull();
        expectInvalid(fixture.componentInstance.valid, '#treasureButton', '#treasureValidating');
      });
    
      it(`should show that treasure is invalid - level too low`, () => {
        setInput('#treasureLevel', '0');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.level).toEqual(0);
        expectInvalid(fixture.componentInstance.valid, '#treasureButton', '#treasureValidating');
      });
    
      it(`should show that treasure is invalid - level too high`, async () => {
        setInput('#treasureLevel', '101');
  
        fixture.detectChanges();

        expect(fixture.componentInstance.level).toEqual(101);
        expectValidating('#treasureButton', '#treasureValidating');
  
        //run validation
        await waitForService();
  
        expectInvalid(fixture.componentInstance.valid, '#treasureButton', '#treasureValidating');
      });
    
      const levelTestCases = [1, 2, 10, 20, 100];

      levelTestCases.forEach(test => {
        it(`should show that treasure is valid - level ${test}`, async () => {
          setInput('#treasureLevel', test.toString());
    
          fixture.detectChanges();
    
          expect(fixture.componentInstance.level).toEqual(test);
          expectValidating('#treasureButton', '#treasureValidating');
    
          //run validation
          await waitForService();
    
          expectValid(fixture.componentInstance.valid, '#treasureButton', '#treasureValidating');
        });
      });
    
      it(`should show that treasure is invalid - missing treasure type`, () => {
        setSelectByValue('#treasureTypes', '');
  
        fixture.detectChanges();
  
        expectInvalid(fixture.componentInstance.valid, '#treasureButton', '#treasureValidating');
      });
    
      const treasureTypesIndicesTestCases = Array.from(Array(4).keys());

      treasureTypesIndicesTestCases.forEach(test => {
        it(`should show that treasure is valid - treasure type index ${test}`, async () => {
          setSelectByIndex('#treasureTypes', test);
    
          fixture.detectChanges();
          
          expect(fixture.componentInstance.treasureType).toEqual(fixture.componentInstance.treasureModel.treasureTypes[test]);
          expectValidating('#treasureButton', '#treasureValidating');

          //run validation
          await waitForService();
    
          expectValid(fixture.componentInstance.valid, '#treasureButton', '#treasureValidating');
        });
      });

      xit(`should show that treasure is invalid - validation fails`, () => {
        expect('there are no invalid treasure combinations').toBe('');
      });
    
      it(`should show that treasure is valid - validation succeeds`, async () => {
        setInput('#treasureLevel', '42');
        setSelectByIndex('#treasureTypes', 3);
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.treasureType).toEqual(fixture.componentInstance.treasureModel.treasureTypes[3]);
        expectValidating('#treasureButton', '#treasureValidating');
  
        //run validation
        await waitForService();
  
        expectValid(fixture.componentInstance.valid, '#treasureButton', '#treasureValidating');
      });
    
      it(`should show when generating treasure`, () => {
        const component = fixture.componentInstance;
        component.generating = true;
  
        fixture.detectChanges();

        expectGenerating('#treasureButton', '#treasureValidating');
      });
    
      it(`should generate the default treasure`, async () => {
        clickButton('#treasureButton');
  
        fixture.detectChanges();
        
        expectGenerating('#treasureButton', '#treasureValidating');

        //run generate treasure
        await waitForService();
  
        expectGenerated('#treasureButton', '#treasureValidating', '#downloadTreasureButton');

        expectHasAttribute('#noTreasure', 'hidden', true)
        expectExists('#treasureSection > dndgen-treasure', true);
        expectExists('#treasureSection > dndgen-item', false);

        const element = fixture.debugElement.query(By.css('#treasureSection dndgen-treasure'));
        expect(element).toBeDefined();
        expect(element.componentInstance).toBeDefined();
        expect(element.componentInstance).toBeInstanceOf(TreasureComponent);
  
        const treasureComponent = element.componentInstance as TreasureComponent;
        expect(treasureComponent.treasure).toBeDefined();
        expect(treasureComponent.treasure).not.toBeNull();
      });
    
      it(`should generate non-default treasure`, async () => {
        setInput('#treasureLevel', '42');
        setSelectByIndex('#treasureTypes', 2);
  
        fixture.detectChanges();

        expect(fixture.componentInstance.level).toEqual(42);
        expect(fixture.componentInstance.treasureType).toEqual(fixture.componentInstance.treasureModel.treasureTypes[2]);

        //run validation
        await waitForService();

        clickButton('#treasureButton');
  
        fixture.detectChanges();
        
        expectGenerating('#treasureButton', '#treasureValidating');

        //run generate treasure
        await waitForService();
  
        expectGenerated('#treasureButton', '#treasureValidating', '#downloadTreasureButton');

        expectHasAttribute('#noTreasure', 'hidden', true);
        expectExists('#treasureSection > dndgen-treasure', true);
        expectExists('#treasureSection > dndgen-item', false);

        const element = fixture.debugElement.query(By.css('#treasureSection dndgen-treasure'));
        expect(element).toBeDefined();
        expect(element.componentInstance).toBeDefined();
        expect(element.componentInstance).toBeInstanceOf(TreasureComponent);
  
        const treasureComponent = element.componentInstance as TreasureComponent;
        expect(treasureComponent.treasure).toBeDefined();
        expect(treasureComponent.treasure).not.toBeNull();
        expect(treasureComponent.treasure.isAny).toBeTrue();
        expect(treasureComponent.treasure.coin).toBeDefined();
        expect(treasureComponent.treasure.coin.currency).toBe('');
        expect(treasureComponent.treasure.coin.quantity).toBe(0);
        expect(treasureComponent.treasure.goods.length).toBeGreaterThan(0);
        expect(treasureComponent.treasure.items).toEqual([]);
      });
    });
  
    describe('the item tab', () => {
      it(`should render the item tab`, () => {
        const compiled = fixture.nativeElement as HTMLElement;
  
        const itemTab = compiled.querySelector('#item');
        expect(itemTab).toBeDefined();
  
        //item type
        const itemTypesSelect = itemTab!.querySelector('#itemTypes');
        expect(itemTypesSelect).toBeDefined();
        expectHasAttribute('#itemTypes', 'required', true);
  
        const selectedItemType = itemTab!.querySelector('#itemTypes > option:checked');
        expect(selectedItemType).toBeDefined();
        expect(selectedItemType?.textContent).toEqual('Alchemical Item');
  
        const itemTypeOptions = itemTab!.querySelectorAll('#itemTypes > option');
        expect(itemTypeOptions).toBeDefined();
        expect(itemTypeOptions?.length).toEqual(11);
        expect(itemTypeOptions?.item(0).textContent).toEqual('Alchemical Item');
        expect(itemTypeOptions?.item(1).textContent).toEqual('Armor');
        expect(itemTypeOptions?.item(2).textContent).toEqual('Potion');
        expect(itemTypeOptions?.item(3).textContent).toEqual('Ring');
        expect(itemTypeOptions?.item(4).textContent).toEqual('Rod');
        expect(itemTypeOptions?.item(5).textContent).toEqual('Scroll');
        expect(itemTypeOptions?.item(6).textContent).toEqual('Staff');
        expect(itemTypeOptions?.item(7).textContent).toEqual('Tool');
        expect(itemTypeOptions?.item(8).textContent).toEqual('Wand');
        expect(itemTypeOptions?.item(9).textContent).toEqual('Weapon');
        expect(itemTypeOptions?.item(10).textContent).toEqual('Wondrous Item');
  
        //power
        expectExists('#powers', true);
        expectHasAttribute('#powers', 'required', true);
  
        const selectedPower = itemTab!.querySelector('#powers > option:checked');
        expectExists('#powers > option:checked', true);
        expect(selectedPower?.textContent).toEqual('Mundane');
  
        const powerOptions = itemTab!.querySelectorAll('#powers > option');
        expect(powerOptions).toBeDefined();
        expect(powerOptions?.length).toEqual(4);
        expect(powerOptions?.item(0).textContent).toEqual('Mundane');
        expect(powerOptions?.item(1).textContent).toEqual('Minor');
        expect(powerOptions?.item(2).textContent).toEqual('Medium');
        expect(powerOptions?.item(3).textContent).toEqual('Major');
  
        //item name
        const itemNamesSelect = itemTab!.querySelector('#itemNames');
        expect(itemNamesSelect).toBeDefined();
        expectHasAttribute('#itemNames', 'required', false);
        expectHasAttribute('#itemNames', 'hidden', false);
        expectExists('#itemNames > option:checked', true);
  
        const selectedItemName = compiled.querySelector('#itemNames > option:checked');
        expect(selectedItemName?.textContent).toEqual('');

        expectExists('#itemNames > option', true);
        const itemNameOptions = itemTab!.querySelectorAll('#itemNames > option');
        expect(itemNameOptions?.length).toEqual(fixture.componentInstance.treasureModel.itemNames['AlchemicalItem'].length + 1);
        expect(itemNameOptions?.item(0).textContent).toEqual('');

        for(var i = 0; i < fixture.componentInstance.treasureModel.itemNames['AlchemicalItem'].length.length; i++) {
          expect(itemNameOptions?.item(i + 1).textContent).toEqual(fixture.componentInstance.treasureModel.itemNames['AlchemicalItem'][i]);
        }
  
        //Any item name
        const anyItemNameInput = itemTab!.querySelector('#anyItemName') as HTMLInputElement;
        expect(anyItemNameInput).toBeDefined();
        expect(anyItemNameInput?.value).toEqual('');
        expect(anyItemNameInput?.getAttribute('type')).toEqual('text');
        expectHasAttribute('#anyItemName', 'required', false);
        expectHasAttribute('#anyItemName', 'hidden', true);

        expectHasAttribute('#itemButton', 'disabled', false);
        expectHasAttribute('#itemValidating', 'hidden', true);
      });
    
      it(`should update item names when item type changes`, async () => {
        setSelectByIndex('#itemTypes', 4);
  
        fixture.detectChanges();

        expect(fixture.componentInstance.itemType?.itemType).toEqual('Rod');

        //run validation
        await waitForService();

        expect(fixture.componentInstance.itemNames).toEqual(fixture.componentInstance.treasureModel.itemNames['Rod']);
        
        //item name
        expectExists('#itemNames', true);
        expectHasAttribute('#itemNames', 'required', false);
        expectHasAttribute('#itemNames', 'hidden', false);
        expectExists('#itemNames > option:checked', true);
        expectExists('#itemNames > option', true);

        const compiled = fixture.nativeElement as HTMLElement;
        const selectedItemName = compiled.querySelector('#itemNames > option:checked');
        expect(selectedItemName?.textContent).toEqual('');

        const itemNameOptions = compiled.querySelectorAll('#itemNames > option');
        expect(itemNameOptions?.length).toEqual(fixture.componentInstance.treasureModel.itemNames['Rod'].length + 1);
        expect(itemNameOptions?.item(0).textContent).toEqual('');

        for(var i = 0; i < fixture.componentInstance.treasureModel.itemNames['Rod'].length; i++) {
          expect(itemNameOptions?.item(i + 1).textContent).toEqual(fixture.componentInstance.treasureModel.itemNames['Rod'][i]);
        }
      });
    
      it(`should un-set an item name back to empty`, async () => {
        setSelectByIndex('#itemNames', 4);
  
        fixture.detectChanges();

        expect(fixture.componentInstance.itemName).toEqual('Everburning Torch');

        //run validation
        await waitForService();

        expectValid(fixture.componentInstance.validItem, '#itemButton', '#itemValidating');

        setSelectByIndex('#itemNames', 0);
  
        fixture.detectChanges();

        expect(fixture.componentInstance.itemName).toEqual('');
        
        //run validation
        await waitForService();

        expectValid(fixture.componentInstance.validItem, '#itemButton', '#itemValidating');
      });
    
      it(`should un-set an item name back to empty when item type changes`, async () => {
        setSelectByIndex('#itemNames', 4);
  
        fixture.detectChanges();

        expect(fixture.componentInstance.itemName).toEqual('Everburning Torch');

        //run validation
        await waitForService();

        setSelectByIndex('#itemTypes', 6);
  
        fixture.detectChanges();

        expect(fixture.componentInstance.itemType?.itemType).toEqual('Staff');
        
        //run validation
        await waitForService();

        expect(fixture.componentInstance.itemNames).toEqual(fixture.componentInstance.treasureModel.itemNames['Staff']);
        expect(fixture.componentInstance.itemName).toEqual('');
        
        //item name
        expectExists('#itemNames', true);
        expectHasAttribute('#itemNames', 'required', false);
        expectHasAttribute('#itemNames', 'hidden', false);
        expectExists('#itemNames > option:checked', true);
        expectExists('#itemNames > option', true);

        const compiled = fixture.nativeElement as HTMLElement;
        const selectedItemName = compiled.querySelector('#itemNames > option:checked');
        expect(selectedItemName?.textContent).toEqual('');

        const itemNameOptions = compiled.querySelectorAll('#itemNames > option');
        expect(itemNameOptions?.length).toEqual(fixture.componentInstance.treasureModel.itemNames['Staff'].length + 1);
        expect(itemNameOptions?.item(0).textContent).toEqual('');

        for(var i = 0; i < fixture.componentInstance.treasureModel.itemNames['Staff'].length; i++) {
          expect(itemNameOptions?.item(i + 1).textContent).toEqual(fixture.componentInstance.treasureModel.itemNames['Staff'][i]);
        }
      });
    
      it(`should show when validating an item`, () => {
        const component = fixture.componentInstance;
        component.validating = true;
  
        fixture.detectChanges();

        expectValidating('#itemButton', '#itemValidating');
      });
    
      it(`should show that an item is invalid - missing item type`, () => {
        setSelectByValue('#itemTypes', '');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.itemType).toBeFalsy();
        expectInvalid(fixture.componentInstance.validItem, '#itemButton', '#itemValidating');
      });

      const itemTypeIndicesTestCases = Array.from(Array(11).keys());

      itemTypeIndicesTestCases.forEach(itemTypeIndex => {
        it(`should show that item is valid - item type index ${itemTypeIndex}`, async () => {
          let itemTypeViewModel = fixture.componentInstance.treasureModel.itemTypeViewModels[itemTypeIndex];
          let itemNames = fixture.componentInstance.treasureModel.itemNames[itemTypeViewModel.itemType];

          let powerIndex = fixture.componentInstance.treasureModel.powers.findIndex(p => p == 'Medium');
          if (itemTypeViewModel.itemType == 'AlchemicalItem' || itemTypeViewModel.itemType == 'Tool')
            powerIndex = fixture.componentInstance.treasureModel.powers.findIndex(p => p == 'Mundane');

          setSelectByIndex('#powers', powerIndex);
          
          fixture.detectChanges();
    
          expect(fixture.componentInstance.power).toEqual(fixture.componentInstance.treasureModel.powers[powerIndex]);

          //run validation
          await waitForService();
    
          setSelectByIndex('#itemTypes', itemTypeIndex);
    
          fixture.detectChanges();
    
          expect(fixture.componentInstance.itemType).toEqual(itemTypeViewModel);
          expect(fixture.componentInstance.itemName).toEqual('');
          
          const compiled = fixture.nativeElement as HTMLElement;
          const itemNameOptions = compiled!.querySelectorAll('#itemNames > option');
          expect(itemNameOptions).toBeDefined();
          expect(itemNameOptions?.length).toEqual(itemNames.length + 1);
          expect(itemNameOptions?.item(0).textContent).toEqual('');

          for(var i = 0; i < itemNames.length; i++) {
            expect(itemNameOptions?.item(i + 1).textContent).toEqual(itemNames[i]);
          }

          expectValidating('#itemButton', '#itemValidating');
  
          //run validation
          await waitForService();
    
          expectValid(fixture.componentInstance.validItem, '#itemButton', '#itemValidating');
        });

        it(`should show that item with any name is valid - item type index ${itemTypeIndex}`, async () => {
          let itemTypeViewModel = fixture.componentInstance.treasureModel.itemTypeViewModels[itemTypeIndex];
          let itemNames = fixture.componentInstance.treasureModel.itemNames[itemTypeViewModel.itemType];
          
          let powerIndex = fixture.componentInstance.treasureModel.powers.findIndex(p => p == 'Medium');
          if (itemTypeViewModel.itemType == 'AlchemicalItem' || itemTypeViewModel.itemType == 'Tool')
            powerIndex = fixture.componentInstance.treasureModel.powers.findIndex(p => p == 'Mundane');

          setSelectByIndex('#powers', powerIndex);
          setSelectByIndex('#itemTypes', itemTypeIndex);
          
          fixture.detectChanges();
  
          expect(fixture.componentInstance.itemType).toEqual(itemTypeViewModel);
          expect(fixture.componentInstance.itemNames).toEqual(itemNames);
            
          //run validation
          await waitForService();
    
          if (itemTypeViewModel.itemType != 'Wand' && itemTypeViewModel.itemType != 'Scroll') {
            expectHasAttribute('#itemNames', 'hidden', false);
            expectHasAttribute('#anyItemName', 'hidden', true);
            return;
          }

          expectHasAttribute('#itemNames', 'hidden', true);
          expectHasAttribute('#anyItemName', 'hidden', false);

          setInput('#anyItemName', `My ${itemTypeViewModel.displayName}`);
    
          fixture.detectChanges();
    
          expect(fixture.componentInstance.itemName).toEqual(`My ${itemTypeViewModel.displayName}`);
          expectValidating('#itemButton', '#itemValidating');
  
          //run validation
          await waitForService();
    
          expectValid(fixture.componentInstance.validItem, '#itemButton', '#itemValidating');
        });

        it(`should show that item with non-empty name is valid - item type index ${itemTypeIndex}`, async () => {
          let itemTypeViewModel = fixture.componentInstance.treasureModel.itemTypeViewModels[itemTypeIndex];
          let itemNames = fixture.componentInstance.treasureModel.itemNames[itemTypeViewModel.itemType];

          let powerIndex = fixture.componentInstance.treasureModel.powers.findIndex(p => p == 'Medium');
          if (itemTypeViewModel.itemType == 'AlchemicalItem' || itemTypeViewModel.itemType == 'Tool')
            powerIndex = fixture.componentInstance.treasureModel.powers.findIndex(p => p == 'Mundane');

          setSelectByIndex('#powers', powerIndex);
          setSelectByIndex('#itemTypes', itemTypeIndex);
          
          fixture.detectChanges();

          expect(fixture.componentInstance.itemNames).toEqual(itemNames);
          
          //run validation
          await waitForService();
    
          if (itemTypeViewModel.itemType == 'Wand' || itemTypeViewModel.itemType == 'Scroll') {
            expectHasAttribute('#itemNames', 'hidden', true);
            expectHasAttribute('#anyItemName', 'hidden', false);
            return;
          }

          expectHasAttribute('#itemNames', 'hidden', false);
          expectHasAttribute('#anyItemName', 'hidden', true);

          setSelectByIndex('#itemNames', 2);
    
          fixture.detectChanges();
    
          expect(fixture.componentInstance.itemType).toEqual(fixture.componentInstance.treasureModel.itemTypeViewModels[itemTypeIndex]);
          expect(fixture.componentInstance.itemName).toEqual(itemNames[1]);
          expectValidating('#itemButton', '#itemValidating');
  
          //run validation
          await waitForService();
    
          expectValid(fixture.componentInstance.validItem, '#itemButton', '#itemValidating');
        });

        it(`should show an item is invalid - not a valid name - item type index ${itemTypeIndex}`, async () => {
          let itemTypeViewModel = fixture.componentInstance.treasureModel.itemTypeViewModels[itemTypeIndex];
          let itemNames = fixture.componentInstance.treasureModel.itemNames[itemTypeViewModel.itemType];
  
          let powerIndex = fixture.componentInstance.treasureModel.powers.findIndex(p => p == 'Medium');
          if (itemTypeViewModel.itemType == 'AlchemicalItem' || itemTypeViewModel.itemType == 'Tool')
            powerIndex = fixture.componentInstance.treasureModel.powers.findIndex(p => p == 'Mundane');

          setSelectByIndex('#powers', powerIndex);
          setSelectByIndex('#itemTypes', itemTypeIndex);
            
          fixture.detectChanges();
  
          expect(fixture.componentInstance.itemNames).toEqual(itemNames);
          
          //run validation
          await waitForService();
    
          if (itemTypeViewModel.itemType == 'Wand' || itemTypeViewModel.itemType == 'Scroll') {
            expectHasAttribute('#itemNames', 'hidden', true);
            expectHasAttribute('#anyItemName', 'hidden', false);
            return;
          }

          expectHasAttribute('#itemNames', 'hidden', false);
          expectHasAttribute('#anyItemName', 'hidden', true);
  
          setSelectByValue('#itemNames', 'not a name');
    
          fixture.detectChanges();
    
          expect(fixture.componentInstance.itemType).toEqual(fixture.componentInstance.treasureModel.itemTypeViewModels[itemTypeIndex]);
          expect(fixture.componentInstance.itemName).toEqual('');
          expectValidating('#itemButton', '#itemValidating');
  
          //run validation
          await waitForService();
    
          //Since we are emptying out the invalid name, it ends up valid
          expectValid(fixture.componentInstance.validItem, '#itemButton', '#itemValidating');
        });
  
        it(`should not allow an invalid name - item type index ${itemTypeIndex}`, async () => {
          let itemTypeViewModel = fixture.componentInstance.treasureModel.itemTypeViewModels[itemTypeIndex];
          let itemNames = fixture.componentInstance.treasureModel.itemNames[itemTypeViewModel.itemType];
  
          let powerIndex = fixture.componentInstance.treasureModel.powers.findIndex(p => p == 'Medium');
          if (itemTypeViewModel.itemType == 'AlchemicalItem' || itemTypeViewModel.itemType == 'Tool')
            powerIndex = fixture.componentInstance.treasureModel.powers.findIndex(p => p == 'Mundane');

          setSelectByIndex('#powers', powerIndex);
          setSelectByIndex('#itemTypes', itemTypeIndex);
            
          fixture.detectChanges();
  
          expect(fixture.componentInstance.itemNames).toEqual(itemNames);
          
          //run validation
          await waitForService();
    
          if (itemTypeViewModel.itemType == 'Wand' || itemTypeViewModel.itemType == 'Scroll') {
            expectHasAttribute('#itemNames', 'hidden', true);
            expectHasAttribute('#anyItemName', 'hidden', false);
            return;
          }

          expectHasAttribute('#itemNames', 'hidden', false);
          expectHasAttribute('#anyItemName', 'hidden', true);
  
          let wrongIndex = itemTypeIndex - 1 >= 0 ? itemTypeIndex - 1 : 10;
          let wrongItemType = fixture.componentInstance.treasureModel.itemTypeViewModels[wrongIndex];
          let wrongName = fixture.componentInstance.treasureModel.itemNames[wrongItemType.itemType][0];
          setSelectByValue('#itemNames', wrongName);
    
          fixture.detectChanges();
    
          expect(fixture.componentInstance.itemType).toEqual(fixture.componentInstance.treasureModel.itemTypeViewModels[itemTypeIndex]);
          expect(fixture.componentInstance.itemName).toEqual('');
          expectValidating('#itemButton', '#itemValidating');
  
          //run validation
          await waitForService();
    
          expectValid(fixture.componentInstance.validItem, '#itemButton', '#itemValidating');
        });
      });

      it('should show an item is invalid - missing power', () => {
        setSelectByValue('#powers', '');
          
        fixture.detectChanges();
    
        expect(fixture.componentInstance.power).toEqual('');
        expectInvalid(fixture.componentInstance.validItem, '#itemButton', '#itemValidating');
      });

      it('should show an item is invalid - not a valid power', () => {
        setSelectByValue('#powers', 'Omnipotent');
          
        fixture.detectChanges();
    
        expect(fixture.componentInstance.power).toEqual('');
        expectInvalid(fixture.componentInstance.validItem, '#itemButton', '#itemValidating');
      });

      it('should show an item is invalid - not a valid matching power', async () => {
        const rodIndex = fixture.componentInstance.treasureModel.itemTypeViewModels.findIndex(itvm => itvm.itemType == 'Rod');
        const minorIndex = fixture.componentInstance.treasureModel.powers.findIndex(p => p == 'Minor');
  
        expect(rodIndex).toBe(4);
        expect(minorIndex).toBe(1);
        setSelectByIndex('#itemTypes', rodIndex);
        
        fixture.detectChanges();
    
        const compiled = fixture.nativeElement as HTMLElement;
        const selectedPower = compiled!.querySelector('#itemTypes > option:checked');
        expectExists('#itemTypes > option:checked', true);
        expect(selectedPower?.textContent).toEqual('Rod');

        expect(fixture.componentInstance.itemType?.itemType).toEqual('Rod');
        expect(fixture.componentInstance.validating).toBeTrue();
        expectValidating('#itemButton', '#itemValidating');

        //run validation
        await waitForService();
  
        expect(fixture.componentInstance.validating).toBeFalse();

        setSelectByIndex('#powers', minorIndex);
          
        fixture.detectChanges();
    
        expect(fixture.componentInstance.power).toEqual('Minor');
        expect(fixture.componentInstance.validating).toBeTrue();
        expectValidating('#itemButton', '#itemValidating');

        //run validation
        await waitForService();
  
        expect(fixture.componentInstance.validating).toBeFalse();
        expect(fixture.componentInstance.validItem).toBeFalse();
        expectInvalid(fixture.componentInstance.validItem, '#itemButton', '#itemValidating');
      });

      const powerIndicesTestCases = Array.from(Array(4).keys());
      
      powerIndicesTestCases.forEach(powerIndex => {
        it(`should show that item is valid - power index ${powerIndex}`, async () => {
          const armorIndex = fixture.componentInstance.treasureModel.itemTypeViewModels.findIndex(itvm => itvm.itemType == 'Armor');

          setSelectByIndex('#itemTypes', armorIndex);
          setSelectByIndex('#powers', powerIndex);

          fixture.detectChanges();
    
          expect(fixture.componentInstance.itemType).toEqual(fixture.componentInstance.treasureModel.itemTypeViewModels[armorIndex]);
          expect(fixture.componentInstance.power).toEqual(fixture.componentInstance.treasureModel.powers[powerIndex]);
          expect(fixture.componentInstance.itemName).toEqual('');
          expectValidating('#itemButton', '#itemValidating');
  
          //run validation
          await waitForService();
    
          expect(fixture.componentInstance.validating).toBeFalse();
          expect(fixture.componentInstance.validItem).toBeTrue();
          expectValid(fixture.componentInstance.validItem, '#itemButton', '#itemValidating');
        });
      });
    
      it(`should show when generating an item`, () => {
        const component = fixture.componentInstance;
        component.generating = true;
  
        fixture.detectChanges();

        expectGenerating('#itemButton', '#itemValidating');
      });
    
      it(`should generate the default item`, async () => {
        clickButton('#itemButton');
  
        fixture.detectChanges();
        
        expectGenerating('#itemButton', '#itemValidating');

        //run generate item
        await waitForService();
  
        expectGenerated('#itemButton', '#itemValidating', '#downloadItemButton');
        expectHasAttribute('#noTreasure', 'hidden', true);
        expectExists('#treasureSection dndgen-treasure', false);
        expectExists('#treasureSection dndgen-item', true);

        const element = fixture.debugElement.query(By.css('#treasureSection dndgen-item'));
        expect(element).toBeDefined();
        expect(element.componentInstance).toBeDefined();
        expect(element.componentInstance).toBeInstanceOf(ItemComponent);
  
        const treasureComponent = element.componentInstance as ItemComponent;
        expect(treasureComponent.item).toBeDefined();
        expect(treasureComponent.item).not.toBeNull();
        expect(treasureComponent.item?.name).toBeTruthy();
      });
    
      it(`should generate the default item with name`, async () => {
        setSelectByIndex('#itemNames', 1);

        fixture.detectChanges();

        expect(fixture.componentInstance.itemName).toEqual("Acid");
        expect(fixture.componentInstance.validating).toBeTrue();
        

        //run validation
        await waitForService();
  
        expect(fixture.componentInstance.validating).toBeFalse();
        expect(fixture.componentInstance.validItem).toBeTrue();

        clickButton('#itemButton');
  
        fixture.detectChanges();
        
        expectGenerating('#itemButton', '#itemValidating');

        //run generate item
        await waitForService();
  
        expectGenerated('#itemButton', '#itemValidating', '#downloadItemButton');
        expectHasAttribute('#noTreasure', 'hidden', true);
        expectExists('#treasureSection dndgen-treasure', false);
        expectExists('#treasureSection dndgen-item', true);

        const element = fixture.debugElement.query(By.css('#treasureSection dndgen-item'));
        expect(element).toBeDefined();
        expect(element.componentInstance).toBeDefined();
        expect(element.componentInstance).toBeInstanceOf(ItemComponent);
  
        const itemComponent = element.componentInstance as ItemComponent;
        expect(itemComponent.item).toBeDefined();
        expect(itemComponent.item).not.toBeNull();
        expect(itemComponent.item?.name).toEqual("Acid");
        expect(itemComponent.item?.itemType).toEqual('Alchemical Item');
      });
    
      it(`should generate a non-default item`, async () => {
        setSelectByIndex('#itemTypes', 1);
        setSelectByIndex('#powers', 2);
  
        fixture.detectChanges();

        expect(fixture.componentInstance.itemType?.itemType).toEqual('Armor');
        expect(fixture.componentInstance.power).toEqual('Medium');

        //run validation
        await waitForService();

        expect(fixture.componentInstance.validItem).toBeTrue();
        expect(fixture.componentInstance.validating).toBeFalse();

        clickButton('#itemButton');
  
        fixture.detectChanges();
        
        expectGenerating('#itemButton', '#itemValidating');

        //run roll
        await waitForService();
  
        expectGenerated('#itemButton', '#itemValidating', '#downloadItemButton');
        expectHasAttribute('#noTreasure', 'hidden', true);
        expectExists('#treasureSection dndgen-treasure', false);
        expectExists('#treasureSection dndgen-item', true);

        const element = fixture.debugElement.query(By.css('#treasureSection dndgen-item'));
        expect(element).toBeDefined();
        expect(element.componentInstance).toBeDefined();
        expect(element.componentInstance).toBeInstanceOf(ItemComponent);
  
        const itemComponent = element.componentInstance as ItemComponent;
        expect(itemComponent.item).toBeDefined();
        expect(itemComponent.item).not.toBeNull();
        expect(itemComponent.item?.name).toBeTruthy();
        expect(itemComponent.item?.itemType).toEqual('Armor');
      });
    
      it(`should generate a non-default item with name`, async () => {
        setSelectByIndex('#itemTypes', 1);
        setSelectByIndex('#powers', 2);
  
        fixture.detectChanges();

        expect(fixture.componentInstance.itemType?.itemType).toEqual('Armor');
        expect(fixture.componentInstance.power).toEqual('Medium');

        //run validation
        await waitForService();

        expect(fixture.componentInstance.validItem).toBeTrue();
        expect(fixture.componentInstance.itemNames).toEqual(fixture.componentInstance.treasureModel.itemNames['Armor']);
        setSelectByIndex('#itemNames', 3);
  
        fixture.detectChanges();

        expect(fixture.componentInstance.itemName).toEqual('Banded mail');

        //run validation
        await waitForService();

        expect(fixture.componentInstance.validItem).toBeTrue();
        clickButton('#itemButton');
  
        fixture.detectChanges();
        
        expectGenerating('#itemButton', '#itemValidating');

        //run roll
        await waitForService();
  
        expectGenerated('#itemButton', '#itemValidating', '#downloadItemButton');
        expectHasAttribute('#noTreasure', 'hidden', true);
        expectExists('#treasureSection dndgen-treasure', false);
        expectExists('#treasureSection dndgen-item', true);

        const element = fixture.debugElement.query(By.css('#treasureSection dndgen-item'));
        expect(element).toBeDefined();
        expect(element.componentInstance).toBeDefined();
        expect(element.componentInstance).toBeInstanceOf(ItemComponent);
  
        const itemComponent = element.componentInstance as ItemComponent;
        expect(itemComponent.item).toBeDefined();
        expect(itemComponent.item).not.toBeNull();
        expect(['Banded mail', 'Banded Mail of Luck']).toContain(itemComponent.item?.name);
        expect(itemComponent.item?.itemType).toEqual('Armor');
      });
    
      it(`should generate a non-default item with any name`, async () => {
        const wandIndex = fixture.componentInstance.treasureModel.itemTypeViewModels.findIndex(itvm => itvm.itemType == 'Wand');
        setSelectByIndex('#itemTypes', wandIndex);
        setSelectByIndex('#powers', 3);
  
        fixture.detectChanges();

        expect(fixture.componentInstance.itemType?.itemType).toEqual('Wand');
        expect(fixture.componentInstance.power).toEqual('Major');

        //run validation
        await waitForService();

        setInput('#anyItemName', 'Wand of Awesomeness');
  
        fixture.detectChanges();

        expect(fixture.componentInstance.itemName).toEqual('Wand of Awesomeness');

        //run validation
        await waitForService();

        clickButton('#itemButton');
  
        fixture.detectChanges();
        
        expectGenerating('#itemButton', '#itemValidating');

        //run generate item
        await waitForService();
  
        expectGenerated('#itemButton', '#itemValidating', '#downloadItemButton');
        expectHasAttribute('#noTreasure', 'hidden', true);
        expectExists('#treasureSection dndgen-treasure', false);
        expectExists('#treasureSection dndgen-item', true);

        const element = fixture.debugElement.query(By.css('#treasureSection dndgen-item'));
        expect(element).toBeDefined();
        expect(element.componentInstance).toBeDefined();
        expect(element.componentInstance).toBeInstanceOf(ItemComponent);
  
        const itemComponent = element.componentInstance as ItemComponent;
        expect(itemComponent.item).toBeDefined();
        expect(itemComponent.item).not.toBeNull();
        expect(itemComponent.item?.name).toEqual('Wand of Awesomeness');
        expect(itemComponent.item?.itemType).toEqual('Wand');
        expect(itemComponent.item?.isMagical).toBeTrue();
        expect(itemComponent.item?.magic.charges).toBeGreaterThan(0);
      });
    });
  
    it(`should render no treasure`, () => {
      expectHasAttribute('#noTreasure', 'hidden', false);

      const compiled = fixture.nativeElement as HTMLElement;
      let element = compiled!.querySelector('#treasureSection dndgen-treasure');
      expect(element).toBeNull();

      element = compiled!.querySelector('#treasureSection dndgen-item');
      expect(element).toBeNull();
    });
    
    it(`should render treasure`, () => {
      fixture.componentInstance.treasure = new Treasure();

      fixture.detectChanges();

      expectHasAttribute('#noTreasure', 'hidden', true);
      expectHasAttribute('#treasureSection dndgen-treasure', 'hidden', false);
      
      const compiled = fixture.nativeElement as HTMLElement;
      let element = compiled!.querySelector('#treasureSection dndgen-item');
      expect(element).toBeNull();
    });
    
    it(`should render item`, () => {
      fixture.componentInstance.item = new Item('my item', 'my item type');

      fixture.detectChanges();

      expectHasAttribute('#noTreasure', 'hidden', true);
      expectHasAttribute('#treasureSection dndgen-item', 'hidden', false);
      
      const compiled = fixture.nativeElement as HTMLElement;
      let element = compiled!.querySelector('#treasureSection dndgen-treasure');
      expect(element).toBeNull();
    });
    
    it(`should download treasure`, async () => {
      //Even for an integration test, we don't want to create an actual file
      let fileSaverSpy = spyOn(FileSaver, 'saveAs').and.stub();

      fixture.componentInstance.treasure = new Treasure(new Coin('munny', 9266));
      fixture.componentInstance.treasure.isAny = true;

      fixture.detectChanges();

      clickButton('#downloadTreasureButton');

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

      clickButton('#downloadItemButton');

      expect(FileSaver.saveAs).toHaveBeenCalledWith(
        jasmine.any(Blob),
        jasmine.stringMatching(/^Item \(my item description\)\.txt$/));
      
      const blob = fileSaverSpy.calls.first().args[0] as Blob;
      const text = await blob.text();
      expect(text).toEqual('my item\r\n');
    });
  });
});
