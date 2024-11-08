import { ComponentFixture, fakeAsync, flush, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { DungeonGenComponent } from './dungeongen.component';
import { SweetAlertService } from '../../shared/services/sweetAlert.service';
import { LoggerService } from '../../shared/services/logger.service';
import { Observable } from 'rxjs';
import { FileSaverService } from '../../shared/services/fileSaver.service';
import * as FileSaver from 'file-saver';
import { DungeonService } from '../services/dungeon.service';
import { DungeonPipe } from '../pipes/dungeon.pipe';
import { DungeonGenViewModel } from '../models/dungeongenViewModel.model';
import { TestHelper } from '../../testHelper.spec';
import { Size } from '../../shared/components/size.enum';
import { EncounterDefaults } from '../../encounter/models/encounterDefaults.model';
import { EncounterService } from '../../encounter/services/encounter.service';
import { Area } from '../models/area.model';

describe('DungeonGen Component', () => {
  describe('unit', () => {
    let component: DungeonGenComponent;
    let dungeonServiceSpy: jasmine.SpyObj<DungeonService>;
    let encounterServiceSpy: jasmine.SpyObj<EncounterService>;
    let dungeonPipeSpy: jasmine.SpyObj<DungeonPipe>;
    let sweetAlertServiceSpy: jasmine.SpyObj<SweetAlertService>;
    let loggerServiceSpy: jasmine.SpyObj<LoggerService>;
    let fileSaverServiceSpy: jasmine.SpyObj<FileSaverService>;

    const delay = 10;
  
    beforeEach(() => {
      dungeonServiceSpy = jasmine.createSpyObj('DungeonService', ['getViewModel', 'generateAreasFromDoor', 'generateAreasFromHall']);
      encounterServiceSpy = jasmine.createSpyObj('EncounterService', ['validate']);
      dungeonPipeSpy = jasmine.createSpyObj('DungeonPipe', ['transform']);
      sweetAlertServiceSpy = jasmine.createSpyObj('SweetAlertService', ['showError']);
      loggerServiceSpy = jasmine.createSpyObj('LoggerService', ['logError']);
      fileSaverServiceSpy = jasmine.createSpyObj('FileSaverService', ['save']);

      component = new DungeonGenComponent(dungeonServiceSpy, encounterServiceSpy, dungeonPipeSpy, fileSaverServiceSpy, sweetAlertServiceSpy, loggerServiceSpy);
    });
  
    it(`should initialize the public properties`, () => {
      expect(component.generating).toBeFalse();
      expect(component.validating).toBeFalse();
      expect(component.valid).toBeFalse();
      expect(component.areas).toBeTruthy();
      expect(component.areas.length).toBeFalsy();
    });
  
    it(`should initialize the input values`, () => {
      expectInitialInputValues();
    });

    function expectInitialInputValues() {
      expect(component.dungeonLevel).toEqual(1);
      expect(component.temperature).toEqual('');
      expect(component.environment).toEqual('');
      expect(component.timeOfDay).toEqual('');
      expect(component.level).toEqual(1);
      expect(component.allowAquatic).toEqual(false);
      expect(component.allowUnderground).toEqual(false);
    }

    function expectDefaultInputValues() {
      expect(component.dungeonLevel).toEqual(1);
      expect(component.temperature).toEqual('temperature 1');
      expect(component.environment).toEqual('environment 2');
      expect(component.timeOfDay).toEqual('time of day 2');
      expect(component.level).toEqual(10);
      expect(component.allowAquatic).toBeFalse();
      expect(component.allowUnderground).toBeTrue();

      expect(component.creatureTypeFilters.length).toBe(2);
      expect(component.creatureTypeFilters[0].id).toBe('creature_type_1');
      expect(component.creatureTypeFilters[0].displayName).toBe('creature type 1');
      expect(component.creatureTypeFilters[0].checked).toBeFalse();
      expect(component.creatureTypeFilters[1].id).toBe('creature_type_2');
      expect(component.creatureTypeFilters[1].displayName).toBe('creature type 2');
      expect(component.creatureTypeFilters[1].checked).toBeFalse();
    }

    function getViewModel(): DungeonGenViewModel {
      return new DungeonGenViewModel(
        ['environment 1', 'environment 2'],
        ['temperature 1', 'temperature 2'],
        ['time of day 1', 'time of day 2'],
        ['creature type 1', 'creature type 2'],
        new EncounterDefaults('environment 2', 'temperature 1', 'time of day 2', 10, false, true)
      );
    }

    it('should be validating while fetching the dungeon model', fakeAsync(() => {
      const model = getViewModel();
      dungeonServiceSpy.getViewModel.and.callFake(() => getFakeDelay(model));
      encounterServiceSpy.validate.and.callFake(() => getFakeDelay(true));

      component.ngOnInit();

      expect(component.loading).toBeTrue();
      expect(component.dungeonModel).toBeFalsy();
      
      expectInitialInputValues();

      expect(component.loading).toBeTrue();
      expect(component.valid).toBeFalse();
      expect(component.validating).toBeTrue();
      
      tick(delay - 1);

      expect(component.dungeonModel).toBeFalsy();

      expectInitialInputValues();

      expect(component.loading).toBeTrue();
      expect(component.valid).toBeFalse();
      expect(component.validating).toBeTrue();
      
      tick(1);
      
      expect(component.dungeonModel).toEqual(model);
      
      expectDefaultInputValues();
      
      expect(component.loading).toBeTrue();
      expect(component.valid).toBeFalse();
      expect(component.validating).toBeTrue();

      tick(delay - 1);

      expect(component.dungeonModel).toEqual(model);
      
      expectDefaultInputValues();
      
      expect(component.loading).toBeTrue();
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
      it(`should set the dungeon model on init - validity: ${test}`, fakeAsync(() => {
        const model = getViewModel();
        dungeonServiceSpy.getViewModel.and.callFake(() => getFakeDelay(model));
        encounterServiceSpy.validate.and.callFake(() => getFakeDelay(test));
  
        component.ngOnInit();
  
        expect(component.loading).toBeTrue();
        expect(component.dungeonModel).toBeFalsy();
        expect(component.validating).toBeTrue();
  
        tick(delay * 2);
  
        expect(component.loading).toBeFalse();
        expect(component.dungeonModel).toEqual(model);
        expect(component.validating).toBeFalse();
  
        expectDefaultInputValues();
      
        expect(encounterServiceSpy.validate).toHaveBeenCalledWith(
          'environment 2',
          'temperature 1',
          'time of day 2',
          10,
          [],
          false,
          true,
        );

        expect(component.valid).toEqual(test);
        
        expect(loggerServiceSpy.logError).not.toHaveBeenCalled();
        expect(sweetAlertServiceSpy.showError).not.toHaveBeenCalled();
      }));
    });

    it('should display error from getting dungeon model', fakeAsync(() => {
      dungeonServiceSpy.getViewModel.and.callFake(() => getFakeError('I failed'));
      encounterServiceSpy.validate.and.callFake(() => getFakeDelay(true));

      component.ngOnInit();
      tick(delay * 2);

      expect(component.dungeonModel).toBeFalsy();
      expect(component.areas).toEqual([]);
      expect(component.generating).toBeFalse();
      expect(component.validating).toBeFalse();
      expect(component.valid).toBeFalse();
      expect(component.loading).toBeFalse();
      
      expect(loggerServiceSpy.logError).toHaveBeenCalledWith('I failed');
      expect(sweetAlertServiceSpy.showError).toHaveBeenCalledTimes(1);
    }));

    it('should display error from validating on init', fakeAsync(() => {
      const model = getViewModel();
      dungeonServiceSpy.getViewModel.and.callFake(() => getFakeDelay(model));
      encounterServiceSpy.validate.and.callFake(() => getFakeError('I failed'));

      component.ngOnInit();
      tick(delay * 2);

      expect(component.dungeonModel).toEqual(model);
      expect(component.areas).toEqual([]);
      expect(component.generating).toBeFalse();
      expect(component.validating).toBeFalse();
      expect(component.valid).toBeFalse();
      expect(component.loading).toBeFalse();
      
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

    const parameterBooleans = [
      { c0: true, c1: true, a: true, u: true },
      { c0: true, c1: true, a: true, u: false },
      { c0: true, c1: true, a: false, u: true },
      { c0: true, c1: true, a: false, u: false },
      { c0: true, c1: false, a: true, u: true },
      { c0: true, c1: false, a: true, u: false },
      { c0: true, c1: false, a: false, u: true },
      { c0: true, c1: false, a: false, u: false },
      { c0: false, c1: true, a: true, u: true },
      { c0: false, c1: true, a: true, u: false },
      { c0: false, c1: true, a: false, u: true },
      { c0: false, c1: true, a: false, u: false },
      { c0: false, c1: false, a: true, u: true },
      { c0: false, c1: false, a: true, u: false },
      { c0: false, c1: false, a: false, u: true },
      { c0: false, c1: false, a: false, u: false },
    ];

    function getCheckedFilters(c0: boolean, c1: boolean): string[] {
      var checkedFilters = [];

      if (c0)
        checkedFilters.push(component.creatureTypeFilters[0].displayName);

      if (c1)
        checkedFilters.push(component.creatureTypeFilters[1].displayName);

      return checkedFilters;
    }

    parameterBooleans.forEach(test => {
      it(`should show invalid when dungeon level is missing - aquatic ${test.a}, underground ${test.u}, filter 0 ${test.c0}, filter 1 ${test.c1}`, fakeAsync(() => {
        setupOnInit();
  
        encounterServiceSpy.validate.and.callFake(() => getFakeDelay(true));

        component.creatureTypeFilters[0].checked = test.c0;
        component.creatureTypeFilters[1].checked = test.c1;
  
        component.validate(0, 'my environment', 'my temperature', 'my time of day', 9266, test.a, test.u);
  
        expect(component.validating).toBeFalse();
        expect(component.valid).toBeFalse();
      }));
      
      it(`should show invalid when level is missing - aquatic ${test.a}, underground ${test.u}, filter 0 ${test.c0}, filter 1 ${test.c1}`, fakeAsync(() => {
        setupOnInit();
  
        encounterServiceSpy.validate.and.callFake(() => getFakeDelay(true));

        component.creatureTypeFilters[0].checked = test.c0;
        component.creatureTypeFilters[1].checked = test.c1;
  
        component.validate(90210, 'my environment', 'my temperature', 'my time of day', 0, test.a, test.u);
        
        expect(component.validating).toBeFalse();
        expect(component.valid).toBeFalse();
      }));

      it(`should be validating while validating the parameters - aquatic ${test.a}, underground ${test.u}, filter 0 ${test.c0}, filter 1 ${test.c1}`, fakeAsync(() => {
        setupOnInit();
  
        encounterServiceSpy.validate.and.callFake(() => getFakeDelay(true));

        component.creatureTypeFilters[0].checked = test.c0;
        component.creatureTypeFilters[1].checked = test.c1;
  
        component.validate(90210, 'my environment', 'my temperature', 'my time of day', 9266, test.a, test.u);
        const checkedFilters = getCheckedFilters(test.c0, test.c1);
  
        expect(encounterServiceSpy.validate).toHaveBeenCalledWith(
          'my environment',
          'my temperature',
          'my time of day',
          9266,
          checkedFilters,
          test.a,
          test.u);
        expect(component.validating).toBeTrue();
        
        tick(delay - 1);
  
        expect(component.validating).toBeTrue();
  
        flush();
      }));
  
      it(`should validate valid parameters - aquatic ${test.a}, underground ${test.u}, filter 0 ${test.c0}, filter 1 ${test.c1}`, fakeAsync(() => {
        setupOnInit();

        encounterServiceSpy.validate.and.callFake(() => getFakeDelay(true));
  
        component.creatureTypeFilters[0].checked = test.c0;
        component.creatureTypeFilters[1].checked = test.c1;
  
        component.validate(90210, 'my environment', 'my temperature', 'my time of day', 9266, test.a, test.u);
        const checkedFilters = getCheckedFilters(test.c0, test.c1);
  
        expect(encounterServiceSpy.validate).toHaveBeenCalledWith(
          'my environment',
          'my temperature',
          'my time of day',
          9266,
          checkedFilters,
          test.a,
          test.u);
        expect(component.validating).toBeTrue();
  
        tick(delay);
  
        expect(component.valid).toBeTrue();
        expect(component.validating).toBeFalse();
        
        expect(loggerServiceSpy.logError).not.toHaveBeenCalled();
        expect(sweetAlertServiceSpy.showError).not.toHaveBeenCalled();
      }));
  
      it(`should validate invalid parameters - aquatic ${test.a}, underground ${test.u}, filter 0 ${test.c0}, filter 1 ${test.c1}`, fakeAsync(() => {
        setupOnInit();

        encounterServiceSpy.validate.and.callFake(() => getFakeDelay(false));
  
        component.creatureTypeFilters[0].checked = test.c0;
        component.creatureTypeFilters[1].checked = test.c1;
  
        component.validate(90210, 'my environment', 'my temperature', 'my time of day', 9266, test.a, test.u);
        const checkedFilters = getCheckedFilters(test.c0, test.c1);
  
        expect(encounterServiceSpy.validate).toHaveBeenCalledWith(
          'my environment',
          'my temperature',
          'my time of day',
          9266,
          checkedFilters,
          test.a,
          test.u);
        expect(component.validating).toBeTrue();
  
        tick(delay);
  
        expect(component.valid).toBeFalse();
        expect(component.validating).toBeFalse();
        
        expect(loggerServiceSpy.logError).not.toHaveBeenCalled();
        expect(sweetAlertServiceSpy.showError).not.toHaveBeenCalled();
      }));
  
      it(`should display error from validating parameters - aquatic ${test.a}, underground ${test.u}, filter 0 ${test.c0}, filter 1 ${test.c1}`, fakeAsync(() => {
        setupOnInit();

        encounterServiceSpy.validate.and.callFake(() => getFakeError('I failed'));
  
        component.creatureTypeFilters[0].checked = test.c0;
        component.creatureTypeFilters[1].checked = test.c1;
  
        component.validate(90210, 'my environment', 'my temperature', 'my time of day', 9266, test.a, test.u);
        const checkedFilters = getCheckedFilters(test.c0, test.c1);

        tick(delay);
  
        expect(component.valid).toBeFalse();
        expect(component.areas).toEqual([]);
        expect(component.generating).toBeFalse();
        expect(component.validating).toBeFalse();
        
        expect(encounterServiceSpy.validate).toHaveBeenCalledWith(
          'my environment',
          'my temperature',
          'my time of day',
          9266,
          checkedFilters,
          test.a,
          test.u);
        expect(loggerServiceSpy.logError).toHaveBeenCalledWith('I failed');
        expect(sweetAlertServiceSpy.showError).toHaveBeenCalledTimes(1);
      }));
      
      it(`should be generating while generating from door - aquatic ${test.a}, underground ${test.u}, filter 0 ${test.c0}, filter 1 ${test.c1}`, fakeAsync(() => {
        setupOnInit();

        const areas = [
          new Area('my area type'),
          new Area('my other area type'),
        ];
        dungeonServiceSpy.generateAreasFromDoor.and.callFake(() => getFakeDelay(areas));

        component.dungeonLevel = 90210;
        component.environment = 'my environment';
        component.temperature = 'my temperature';
        component.timeOfDay = 'my time of day';
        component.level = 9266;
        component.allowAquatic = test.a;
        component.allowUnderground = test.u;
        component.creatureTypeFilters[0].checked = test.c0;
        component.creatureTypeFilters[1].checked = test.c1;

        component.generateFromDoor();
        const checkedFilters = getCheckedFilters(test.c0, test.c1);

        expect(dungeonServiceSpy.generateAreasFromDoor).toHaveBeenCalledWith(
          90210,
          'my environment',
          'my temperature',
          'my time of day',
          9266,
          checkedFilters,
          test.a,
          test.u);

        expect(component.generating).toBeTrue();
        expect(component.areas).toEqual([]);
        
        tick(delay - 1);

        expect(component.generating).toBeTrue();
        expect(component.areas).toEqual([]);

        flush();
      }));
      
      
      it(`should be generating while generating from hall - aquatic ${test.a}, underground ${test.u}, filter 0 ${test.c0}, filter 1 ${test.c1}`, fakeAsync(() => {
        setupOnInit();

        const areas = [
          new Area('my area type'),
          new Area('my other area type'),
        ];
        dungeonServiceSpy.generateAreasFromHall.and.callFake(() => getFakeDelay(areas));

        component.dungeonLevel = 90210;
        component.environment = 'my environment';
        component.temperature = 'my temperature';
        component.timeOfDay = 'my time of day';
        component.level = 9266;
        component.allowAquatic = test.a;
        component.allowUnderground = test.u;
        component.creatureTypeFilters[0].checked = test.c0;
        component.creatureTypeFilters[1].checked = test.c1;

        component.generateFromHall();
        const checkedFilters = getCheckedFilters(test.c0, test.c1);

        expect(dungeonServiceSpy.generateAreasFromHall).toHaveBeenCalledWith(
          90210,
          'my environment',
          'my temperature',
          'my time of day',
          9266,
          checkedFilters,
          test.a,
          test.u);

        expect(component.generating).toBeTrue();
        expect(component.areas).toEqual([]);
        
        tick(delay - 1);

        expect(component.generating).toBeTrue();
        expect(component.areas).toEqual([]);

        flush();
      }));
    });

    function setupOnInit() {
      component.dungeonModel = getViewModel();

      component.environment = component.dungeonModel.defaults.environment;
      component.temperature = component.dungeonModel.defaults.temperature;
      component.timeOfDay = component.dungeonModel.defaults.timeOfDay;
      component.level = component.dungeonModel.defaults.level;
      component.allowAquatic = component.dungeonModel.defaults.allowAquatic;
      component.allowUnderground = component.dungeonModel.defaults.allowUnderground;

      for (var i = 0; i < component.dungeonModel.creatureTypes.length; i++) {
        component.creatureTypeFilters.push({ 
            id: component.dungeonModel.creatureTypes[i].replaceAll(' ', '_'),
            displayName: component.dungeonModel.creatureTypes[i],
            checked: false
        });
      }

      component.valid = true;
    }

    it('should generate the default dungeon area from door', fakeAsync(() => {
      setupOnInit();

      const areas = [
        new Area('my area type'),
        new Area('my other area type'),
      ];
      dungeonServiceSpy.generateAreasFromDoor.and.callFake(() => getFakeDelay(areas));

      component.generateFromDoor();

      expect(dungeonServiceSpy.generateAreasFromDoor).toHaveBeenCalledWith(
        1,
        'environment 2',
        'temperature 1',
        'time of day 2',
        10,
        [],
        false,
        true,
      );
      expect(component.generating).toBeTrue();

      tick(delay);

      expect(component.areas).toBe(areas);
      expect(component.generating).toBeFalse();
      
      expect(loggerServiceSpy.logError).not.toHaveBeenCalled();
      expect(sweetAlertServiceSpy.showError).not.toHaveBeenCalled();
    }));

    it('should generate the default dungeon area from hall', fakeAsync(() => {
      setupOnInit();

      const areas = [
        new Area('my area type'),
        new Area('my other area type'),
      ];
      dungeonServiceSpy.generateAreasFromHall.and.callFake(() => getFakeDelay(areas));

      component.generateFromHall();

      expect(dungeonServiceSpy.generateAreasFromHall).toHaveBeenCalledWith(
        1,
        'environment 2',
        'temperature 1',
        'time of day 2',
        10,
        [],
        false,
        true,
      );
      expect(component.generating).toBeTrue();

      tick(delay);

      expect(component.areas).toBe(areas);
      expect(component.generating).toBeFalse();
      
      expect(loggerServiceSpy.logError).not.toHaveBeenCalled();
      expect(sweetAlertServiceSpy.showError).not.toHaveBeenCalled();
    }));

    it(`should generate a non-default dungeon area from door`, fakeAsync(() => {
      setupOnInit();

      const areas = [
        new Area('my area type'),
        new Area('my other area type'),
      ];
      dungeonServiceSpy.generateAreasFromDoor.and.callFake(() => getFakeDelay(areas));

      component.dungeonLevel = 2;
      component.environment = component.dungeonModel.environments.find(e => e != component.dungeonModel.defaults.environment)!;
      component.temperature = component.dungeonModel.temperatures.find(e => e != component.dungeonModel.defaults.temperature)!;
      component.timeOfDay = component.dungeonModel.timesOfDay.find(e => e != component.dungeonModel.defaults.timeOfDay)!;
      component.level = component.dungeonModel.defaults.level + 1;
      component.allowAquatic = !component.dungeonModel.defaults.allowAquatic;
      component.allowUnderground = !component.dungeonModel.defaults.allowUnderground;
      component.creatureTypeFilters[0].checked = true;
      component.creatureTypeFilters[1].checked = true;

      component.generateFromDoor();

      expect(dungeonServiceSpy.generateAreasFromDoor).toHaveBeenCalledWith(
        2,
        'environment 1',
        'temperature 2',
        'time of day 1',
        11,
        ['creature type 1', 'creature type 2'],
        true,
        false,
      );
      expect(component.generating).toBeTrue();

      tick(delay);

      expect(component.areas).toBe(areas);
      expect(component.generating).toBeFalse();
      
      expect(loggerServiceSpy.logError).not.toHaveBeenCalled();
      expect(sweetAlertServiceSpy.showError).not.toHaveBeenCalled();
    }));

    it(`should generate a non-default dungeon area from hall`, fakeAsync(() => {
      setupOnInit();

      const areas = [
        new Area('my area type'),
        new Area('my other area type'),
      ];
      dungeonServiceSpy.generateAreasFromHall.and.callFake(() => getFakeDelay(areas));

      component.dungeonLevel = 2;
      component.environment = component.dungeonModel.environments.find(e => e != component.dungeonModel.defaults.environment)!;
      component.temperature = component.dungeonModel.temperatures.find(e => e != component.dungeonModel.defaults.temperature)!;
      component.timeOfDay = component.dungeonModel.timesOfDay.find(e => e != component.dungeonModel.defaults.timeOfDay)!;
      component.level = component.dungeonModel.defaults.level + 1;
      component.allowAquatic = !component.dungeonModel.defaults.allowAquatic;
      component.allowUnderground = !component.dungeonModel.defaults.allowUnderground;
      component.creatureTypeFilters[0].checked = true;
      component.creatureTypeFilters[1].checked = true;

      component.generateFromHall();

      expect(dungeonServiceSpy.generateAreasFromHall).toHaveBeenCalledWith(
        2,
        'environment 1',
        'temperature 2',
        'time of day 1',
        11,
        ['creature type 1', 'creature type 2'],
        true,
        false,
      );
      expect(component.generating).toBeTrue();

      tick(delay);

      expect(component.areas).toBe(areas);
      expect(component.generating).toBeFalse();
      
      expect(loggerServiceSpy.logError).not.toHaveBeenCalled();
      expect(sweetAlertServiceSpy.showError).not.toHaveBeenCalled();
    }));

    it('should display error from generating dungeon area from door', fakeAsync(() => {
      setupOnInit();

      dungeonServiceSpy.generateAreasFromDoor.and.callFake(() => getFakeError('I failed'));

      component.generateFromDoor();
      tick(delay);

      expect(component.areas).toEqual([]);
      expect(component.generating).toBeFalse();
      expect(component.validating).toBeFalse();
      
      expect(loggerServiceSpy.logError).toHaveBeenCalledWith('I failed');
      expect(sweetAlertServiceSpy.showError).toHaveBeenCalledTimes(1);
    }));

    it('should display error from generating dungeon area from hall', fakeAsync(() => {
      setupOnInit();

      dungeonServiceSpy.generateAreasFromHall.and.callFake(() => getFakeError('I failed'));

      component.generateFromHall();
      tick(delay);

      expect(component.areas).toEqual([]);
      expect(component.generating).toBeFalse();
      expect(component.validating).toBeFalse();
      
      expect(loggerServiceSpy.logError).toHaveBeenCalledWith('I failed');
      expect(sweetAlertServiceSpy.showError).toHaveBeenCalledTimes(1);
    }));

    it('should download dungeon areas', () => {
      const areas = [
        new Area('my area type'),
        new Area('my other area type'),
      ];
      component.areas = areas;

      dungeonPipeSpy.transform.and.returnValue('my formatted dungeon areas');

      component.download();

      expect(dungeonPipeSpy.transform).toHaveBeenCalledWith(areas);
      expect(fileSaverServiceSpy.save).toHaveBeenCalledWith('my formatted dungeon areas', 'my area type');
    });

    it('should not download missing dungeon areas', () => {
      component.areas = [];

      component.download();
      
      expect(dungeonPipeSpy.transform).not.toHaveBeenCalled();
      expect(fileSaverServiceSpy.save).not.toHaveBeenCalled();
    });
  });

  describe('integration', () => {
    let fixture: ComponentFixture<DungeonGenComponent>;
    let helper: TestHelper<DungeonGenComponent>;
  
    beforeEach(async () => {
      await TestHelper.configureTestBed([DungeonGenComponent]);
  
      fixture = TestBed.createComponent(DungeonGenComponent);
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

      helper.expectLoading('dndgen-loading', true, Size.Large);
    });
  
    it('should hide the loading component when not loading', () => {
      const component = fixture.componentInstance;
      component.loading = false;

      fixture.detectChanges();

      helper.expectLoading('dndgen-loading', false, Size.Large);
    });
  
    const expectedCreatureTypeCount = 15;

    it(`should set the dungeon model on init`, () => {
      const component = fixture.componentInstance;
      expect(component.dungeonModel).toBeTruthy();
      expect(component.dungeonModel.environments.length).toEqual(9);
      expect(component.dungeonModel.environments).toContain(component.dungeonModel.defaults.environment);
      expect(component.dungeonModel.temperatures.length).toEqual(3);
      expect(component.dungeonModel.temperatures).toContain(component.dungeonModel.defaults.temperature);
      expect(component.dungeonModel.timesOfDay.length).toEqual(2);
      expect(component.dungeonModel.timesOfDay).toContain(component.dungeonModel.defaults.timeOfDay);
      expect(component.dungeonModel.creatureTypes.length).toEqual(expectedCreatureTypeCount);
      expect(component.dungeonModel.defaults.environment).toBe('Underground');
      expect(component.dungeonModel.defaults.temperature).toBe('Temperate');
      expect(component.dungeonModel.defaults.timeOfDay).toBe('Day');
      expect(component.dungeonModel.defaults.level).toBe(1);
      expect(component.dungeonModel.defaults.allowAquatic).toBeFalse();
      expect(component.dungeonModel.defaults.allowUnderground).toBeTrue();
    });
  
    it(`should set initial values on init`, () => {
      const component = fixture.componentInstance;
      expect(component.environment).toEqual(component.dungeonModel.defaults.environment);
      expect(component.temperature).toEqual(component.dungeonModel.defaults.temperature);
      expect(component.timeOfDay).toEqual(component.dungeonModel.defaults.timeOfDay);
      expect(component.level).toEqual(component.dungeonModel.defaults.level);
      expect(component.allowAquatic).toEqual(component.dungeonModel.defaults.allowAquatic);
      expect(component.allowUnderground).toEqual(component.dungeonModel.defaults.allowUnderground);
      expect(component.creatureTypeFilters.length).toEqual(component.dungeonModel.creatureTypes.length);

      for(let i = 0; i < component.dungeonModel.creatureTypes.length; i++) {
        expect(component.creatureTypeFilters[i].id).not.toContain(' ');
        expect(component.creatureTypeFilters[i].id).toBe(component.dungeonModel.creatureTypes[i].replaceAll(' ', '_'));
        expect(component.creatureTypeFilters[i].displayName).toBe(component.dungeonModel.creatureTypes[i]);
        expect(component.creatureTypeFilters[i].checked).toBeFalse();
      }
    });
  
    it(`should initialize public properties`, async () => {
      const component = fixture.componentInstance;
      expect(component.loading).toBeFalse();
      expect(component.validating).toBeFalse();
      expect(component.generating).toBeFalse();
      expect(component.valid).toBeTrue();
    });
  
    it(`should be ready to generate dungeon areas on load`, async () => {
      expectReady();
    });

    function expectReady() {
      expect(fixture.componentInstance.loading).toBeFalse();
      expect(fixture.componentInstance.validating).toBeFalse();
      expect(fixture.componentInstance.generating).toBeFalse();
      expect(fixture.componentInstance.valid).toBeTrue();

      helper.expectHasAttribute('#generateFromDoorButton', 'disabled', false);
      helper.expectHasAttribute('#generateFromHallButton', 'disabled', false);
    }

    it(`should render the dungeon inputs`, () => {
      helper.expectNumberInput('#dungeonLevel', true, 1, 1);
      helper.expectSelect('#temperature', true, 'Temperate', 3);
      helper.expectSelect('#environment', true, 'Underground', 9);
      helper.expectSelect('#timeOfDay', true, 'Day', 2);
      helper.expectNumberInput('#level', true, 1, 1);
      helper.expectCheckboxInput('#allowAquatic', false, false);
      helper.expectCheckboxInput('#allowUnderground', false, true);

      for(let i = 0; i < fixture.componentInstance.creatureTypeFilters.length; i++) {
        helper.expectCheckboxInput(`#${fixture.componentInstance.creatureTypeFilters[i].id}`, false, false);
      }

      helper.expectHasAttribute('#generateFromDoorButton', 'disabled', false);
      helper.expectHasAttribute('#generateFromHallButton', 'disabled', false);
      helper.expectLoading('#dungeonValidating', false, Size.Small);
    });
  
    it(`should show when validating dungeon`, () => {
      const component = fixture.componentInstance;
      component.validating = true;

      fixture.detectChanges();

      helper.expectValidating(fixture.componentInstance.validating, '#generateFromDoorButton', '#dungeonValidating');
      helper.expectValidating(fixture.componentInstance.validating, '#generateFromHallButton', '#dungeonValidating');
    });
  
    it(`should show that dungeon is invalid - missing dungeon level`, async () => {
      helper.setInput('#dungeonLevel', '');

      fixture.detectChanges();

      expect(fixture.componentInstance.dungeonLevel).toBeNull();
      helper.expectInvalid(fixture.componentInstance.validating, fixture.componentInstance.valid, '#generateFromDoorButton', '#dungeonValidating');
      helper.expectInvalid(fixture.componentInstance.validating, fixture.componentInstance.valid, '#generateFromHallButton', '#dungeonValidating');
    });
  
    it(`should show that dungeon is invalid - dungeon level invalid`, () => {
      helper.setInput('#dungeonLevel', 'wrong');

      fixture.detectChanges();

      expect(fixture.componentInstance.dungeonLevel).toBeNull();
      helper.expectInvalid(fixture.componentInstance.validating, fixture.componentInstance.valid, '#generateFromDoorButton', '#dungeonValidating');
      helper.expectInvalid(fixture.componentInstance.validating, fixture.componentInstance.valid, '#generateFromHallButton', '#dungeonValidating');
    });
  
    it(`should show that dungeon is invalid - dungeon level too low`, () => {
      helper.setInput('#dungeonLevel', '0');

      fixture.detectChanges();

      expect(fixture.componentInstance.dungeonLevel).toEqual(0);
      helper.expectInvalid(fixture.componentInstance.validating, fixture.componentInstance.valid, '#generateFromDoorButton', '#dungeonValidating');
      helper.expectInvalid(fixture.componentInstance.validating, fixture.componentInstance.valid, '#generateFromHallButton', '#dungeonValidating');
    });
  
    it(`should show that dungeon is invalid - missing environment`, async () => {
      helper.setSelectByValue('#environment', '');

      fixture.detectChanges();

      expect(fixture.componentInstance.environment).toEqual('');
      helper.expectInvalid(fixture.componentInstance.validating, fixture.componentInstance.valid, '#generateFromDoorButton', '#dungeonValidating');
      helper.expectInvalid(fixture.componentInstance.validating, fixture.componentInstance.valid, '#generateFromHallButton', '#dungeonValidating');
    });
  
    it(`should show that dungeon is invalid - missing temperature`, async () => {
      helper.setSelectByValue('#temperature', '');

      fixture.detectChanges();

      expect(fixture.componentInstance.temperature).toEqual('');
      helper.expectInvalid(fixture.componentInstance.validating, fixture.componentInstance.valid, '#generateFromDoorButton', '#dungeonValidating');
      helper.expectInvalid(fixture.componentInstance.validating, fixture.componentInstance.valid, '#generateFromHallButton', '#dungeonValidating');
    });
  
    it(`should show that dungeon is invalid - missing time of day`, async () => {
      helper.setSelectByValue('#timeOfDay', '');

      fixture.detectChanges();

      expect(fixture.componentInstance.timeOfDay).toEqual('');
      helper.expectInvalid(fixture.componentInstance.validating, fixture.componentInstance.valid, '#generateFromDoorButton', '#dungeonValidating');
      helper.expectInvalid(fixture.componentInstance.validating, fixture.componentInstance.valid, '#generateFromHallButton', '#dungeonValidating');
    });
  
    it(`should show that dungeon is invalid - missing level`, async () => {
      helper.setInput('#level', '');

      fixture.detectChanges();

      expect(fixture.componentInstance.level).toBeNull();
      helper.expectInvalid(fixture.componentInstance.validating, fixture.componentInstance.valid, '#generateFromDoorButton', '#dungeonValidating');
      helper.expectInvalid(fixture.componentInstance.validating, fixture.componentInstance.valid, '#generateFromHallButton', '#dungeonValidating');
    });
  
    it(`should show that dungeon is invalid - level invalid`, () => {
      helper.setInput('#level', 'wrong');

      fixture.detectChanges();

      expect(fixture.componentInstance.level).toBeNull();
      helper.expectInvalid(fixture.componentInstance.validating, fixture.componentInstance.valid, '#generateFromDoorButton', '#dungeonValidating');
      helper.expectInvalid(fixture.componentInstance.validating, fixture.componentInstance.valid, '#generateFromHallButton', '#dungeonValidating');
    });
  
    it(`should show that dungeon is invalid - level too low`, () => {
      helper.setInput('#level', '0');

      fixture.detectChanges();

      expect(fixture.componentInstance.level).toEqual(0);
      helper.expectInvalid(fixture.componentInstance.validating, fixture.componentInstance.valid, '#generateFromDoorButton', '#dungeonValidating');
      helper.expectInvalid(fixture.componentInstance.validating, fixture.componentInstance.valid, '#generateFromHallButton', '#dungeonValidating');
    });

    const checkboxValues = [ true, false ];

    checkboxValues.forEach(v => {
      it(`should validate when allow aquatic changes - value ${v}`, waitForAsync(async () => {
        helper.setCheckbox('#allowAquatic', v);
        
        fixture.detectChanges();
  
        helper.expectCheckboxInput('#allowAquatic', false, v);
        helper.expectValidating(fixture.componentInstance.validating, '#generateFromDoorButton', '#dungeonValidating');
        helper.expectValidating(fixture.componentInstance.validating, '#generateFromHallButton', '#dungeonValidating');
      }));
      
      it(`should validate when allow underground changes - value ${v}`, waitForAsync(async () => {
        helper.setCheckbox('#allowUnderground', v);
        
        fixture.detectChanges();
  
        helper.expectCheckboxInput('#allowUnderground', false, v);
        helper.expectValidating(fixture.componentInstance.validating, '#generateFromDoorButton', '#dungeonValidating');
        helper.expectValidating(fixture.componentInstance.validating, '#generateFromHallButton', '#dungeonValidating');
      }));
      
      for(let i = 0; i < expectedCreatureTypeCount; i++) {
        it(`should validate when creature type filter changes - value ${v}, index ${i}`, async () => {
          const selector = `#${fixture.componentInstance.creatureTypeFilters[i].id}`;
          helper.setCheckbox(selector, v);
          
          fixture.detectChanges();
    
          helper.expectCheckboxInput(selector, false, v);
          helper.expectValidating(fixture.componentInstance.validating, '#generateFromDoorButton', '#dungeonValidating');
          helper.expectValidating(fixture.componentInstance.validating, '#generateFromHallButton', '#dungeonValidating');
        });
      }
    });

    it(`should show that dungeon is invalid - validation fails`, waitForAsync(async () => {
      helper.setCheckbox('#Ooze', true);
      
      fixture.detectChanges();

      const oozeFilter = fixture.componentInstance.creatureTypeFilters.find(f => f.id == "Ooze");
      expect(oozeFilter).toBeTruthy();
      expect(oozeFilter?.checked).toBeTrue();

      helper.expectValidating(fixture.componentInstance.validating, '#generateFromDoorButton', '#dungeonValidating');
      helper.expectValidating(fixture.componentInstance.validating, '#generateFromHallButton', '#dungeonValidating');

      //run validation
      await helper.waitForService();
      
      expect(fixture.componentInstance.valid).toBeFalse();
      helper.expectInvalid(fixture.componentInstance.validating, fixture.componentInstance.valid, '#generateFromDoorButton', '#dungeonValidating');
      helper.expectInvalid(fixture.componentInstance.validating, fixture.componentInstance.valid, '#generateFromHallButton', '#dungeonValidating');
    }));
  
    it(`should show that dungeon is valid - validation succeeds`, async () => {
      helper.setCheckbox('#Ooze', true);
      
      //run validation
      await helper.waitForService();

      helper.setCheckbox('#allowUnderground', true);
      
      //run validation
      await helper.waitForService();

      helper.setInput('#level', '7');

      fixture.detectChanges();

      expect(fixture.componentInstance.allowUnderground).toBeTrue();
      expect(fixture.componentInstance.level).toEqual(7);

      const oozeFilter = fixture.componentInstance.creatureTypeFilters.find(f => f.id == "Ooze");
      expect(oozeFilter).toBeTruthy();
      expect(oozeFilter?.checked).toBeTrue();

      helper.expectValidating(fixture.componentInstance.validating, '#generateFromDoorButton', '#dungeonValidating');
      helper.expectValidating(fixture.componentInstance.validating, '#generateFromHallButton', '#dungeonValidating');

      //run validation
      await helper.waitForService();

      helper.expectValid(fixture.componentInstance.validating, fixture.componentInstance.valid, '#generateFromDoorButton', '#dungeonValidating');
      helper.expectValid(fixture.componentInstance.validating, fixture.componentInstance.valid, '#generateFromHallButton', '#dungeonValidating');
    });
  
    it(`should bind allowing aquatic`, () => {
      expect(fixture.componentInstance.allowAquatic).toBeFalse();

      helper.clickCheckbox('#allowAquatic');

      fixture.detectChanges();
      expect(fixture.componentInstance.allowAquatic).toBeTrue();

      helper.clickCheckbox('#allowAquatic');

      fixture.detectChanges();
      expect(fixture.componentInstance.allowAquatic).toBeFalse();
    });
  
    it(`should bind allowing underground`, () => {
      expect(fixture.componentInstance.allowUnderground).toBeTrue();

      helper.clickCheckbox('#allowUnderground');

      fixture.detectChanges();
      expect(fixture.componentInstance.allowUnderground).toBeFalse();

      helper.clickCheckbox('#allowUnderground');

      fixture.detectChanges();
      expect(fixture.componentInstance.allowUnderground).toBeTrue();
    });

    for(let i = 0; i < expectedCreatureTypeCount; i++) {
      it(`should bind creature type filters - index ${i}`, () => {
        expect(fixture.componentInstance.creatureTypeFilters[i].checked).toBeFalse();
  
        helper.clickCheckbox(`#${fixture.componentInstance.creatureTypeFilters[i].id}`);
  
        fixture.detectChanges();
        expect(fixture.componentInstance.creatureTypeFilters[i].checked).toBeTrue();
  
        helper.clickCheckbox(`#${fixture.componentInstance.creatureTypeFilters[i].id}`);
  
        fixture.detectChanges();
        expect(fixture.componentInstance.creatureTypeFilters[i].checked).toBeFalse();
      });
    }
  
    it(`should show when generating a dungeon area`, () => {
      const component = fixture.componentInstance;
      component.generating = true;

      fixture.detectChanges();

      helper.expectGenerating(
        fixture.componentInstance.generating,
        '#generateFromDoorButton', 
        '#areasSection', 
        '#generatingSection', 
        '#dungeonValidating', 
        '#downloadButton');
      helper.expectGenerating(
        fixture.componentInstance.generating,
        '#generateFromHallButton', 
        '#areasSection', 
        '#generatingSection', 
        '#dungeonValidating', 
        '#downloadButton');
    });
  
    it(`should generate the default dungeon from door`, async () => {
      helper.clickButton('#generateFromDoorButton');

      fixture.detectChanges();
      
      helper.expectGenerating(
        fixture.componentInstance.generating,
        '#generateFromDoorButton', 
        '#areasSection', 
        '#generatingSection', 
        '#dungeonValidating', 
        '#downloadButton');
      helper.expectGenerating(
        fixture.componentInstance.generating,
        '#generateFromHallButton', 
        '#areasSection', 
        '#generatingSection', 
        '#dungeonValidating', 
        '#downloadButton');

      //run generate encounter
      await helper.waitForService();

      helper.expectGenerated(
        fixture.componentInstance.generating,
        '#generateFromDoorButton', 
        '#areasSection', 
        '#generatingSection', 
        '#dungeonValidating',
        '#downloadButton');
      helper.expectGenerated(
        fixture.componentInstance.generating,
        '#generateFromHallButton', 
        '#areasSection', 
        '#generatingSection', 
        '#dungeonValidating',
        '#downloadButton');

      helper.expectExists('#noAreas', false)
      helper.expectExists('#areasSection dndgen-area', true);
      helper.expectAreas('#areasSection dndgen-area', true);
    });
  
    it(`should generate the default dungeon from hall`, async () => {
      helper.clickButton('#generateFromHallButton');

      fixture.detectChanges();
      
      helper.expectGenerating(
        fixture.componentInstance.generating,
        '#generateFromDoorButton', 
        '#areasSection', 
        '#generatingSection', 
        '#dungeonValidating', 
        '#downloadButton');
      helper.expectGenerating(
        fixture.componentInstance.generating,
        '#generateFromHallButton', 
        '#areasSection', 
        '#generatingSection', 
        '#dungeonValidating', 
        '#downloadButton');

      //run generate encounter
      await helper.waitForService();

      helper.expectGenerated(
        fixture.componentInstance.generating,
        '#generateFromDoorButton', 
        '#areasSection', 
        '#generatingSection', 
        '#dungeonValidating',
        '#downloadButton');
      helper.expectGenerated(
        fixture.componentInstance.generating,
        '#generateFromHallButton', 
        '#areasSection', 
        '#generatingSection', 
        '#dungeonValidating',
        '#downloadButton');

      helper.expectExists('#noAreas', false)
      helper.expectExists('#areasSection dndgen-area', true);
      helper.expectAreas('#areasSection dndgen-area', true);
    });
  
    it(`should generate non-default dungeon from door`, async () => {
      helper.setInput('#dungeonLevel', '3');
      helper.setSelectByIndex('#environment', fixture.componentInstance.dungeonModel.environments.indexOf('Mountain'));
      helper.setSelectByIndex('#temperature', fixture.componentInstance.dungeonModel.temperatures.indexOf('Cold'));
      helper.setSelectByIndex('#timeOfDay', fixture.componentInstance.dungeonModel.timesOfDay.indexOf('Night'));
      helper.setInput('#level', '10');
      helper.setCheckbox('#allowAquatic', true);
      helper.setCheckbox('#allowUnderground', false);
      helper.setCheckbox('#Dragon', true);
      helper.setCheckbox('#Giant', true);
      helper.setCheckbox('#Humanoid', true);
      
      fixture.detectChanges();

      expect(fixture.componentInstance.dungeonLevel).toEqual(3);
      expect(fixture.componentInstance.environment).toEqual('Mountain');
      expect(fixture.componentInstance.temperature).toEqual('Cold');
      expect(fixture.componentInstance.timeOfDay).toEqual('Night');
      expect(fixture.componentInstance.level).toEqual(10);
      expect(fixture.componentInstance.allowAquatic).toBeTrue();
      expect(fixture.componentInstance.allowUnderground).toBeFalse();

      const checkedfilters = getCheckedFilters();
      expect(checkedfilters).toEqual(['Dragon', 'Giant', 'Humanoid']);

      //run validation
      await helper.waitForService();

      helper.clickButton('#generateFromDoorButton');

      fixture.detectChanges();
      
      helper.expectGenerating(
        fixture.componentInstance.generating,
        '#generateFromDoorButton', 
        '#areasSection', 
        '#generatingSection', 
        '#dungeonValidating', 
        '#downloadButton');
      helper.expectGenerating(
        fixture.componentInstance.generating,
        '#generateFromHallButton', 
        '#areasSection', 
        '#generatingSection', 
        '#dungeonValidating', 
        '#downloadButton');

      //run generate encounter
      await helper.waitForService();

      helper.expectGenerated(
        fixture.componentInstance.generating,
        '#generateFromDoorButton', 
        '#areasSection', 
        '#generatingSection', 
        '#dungeonValidating',
        '#downloadButton');
      helper.expectGenerated(
        fixture.componentInstance.generating,
        '#generateFromHallButton', 
        '#areasSection', 
        '#generatingSection', 
        '#dungeonValidating',
        '#downloadButton');

      helper.expectExists('#noAreas', false);
      helper.expectAreas('#areasSection dndgen-area', true);
    });
  
    it(`should generate non-default dungeon from hall`, async () => {
      helper.setInput('#dungeonLevel', '3');
      helper.setSelectByIndex('#environment', fixture.componentInstance.dungeonModel.environments.indexOf('Mountain'));
      helper.setSelectByIndex('#temperature', fixture.componentInstance.dungeonModel.temperatures.indexOf('Cold'));
      helper.setSelectByIndex('#timeOfDay', fixture.componentInstance.dungeonModel.timesOfDay.indexOf('Night'));
      helper.setInput('#level', '10');
      helper.setCheckbox('#allowAquatic', true);
      helper.setCheckbox('#allowUnderground', false);
      helper.setCheckbox('#Dragon', true);
      helper.setCheckbox('#Giant', true);
      helper.setCheckbox('#Humanoid', true);
      
      fixture.detectChanges();

      expect(fixture.componentInstance.dungeonLevel).toEqual(3);
      expect(fixture.componentInstance.environment).toEqual('Mountain');
      expect(fixture.componentInstance.temperature).toEqual('Cold');
      expect(fixture.componentInstance.timeOfDay).toEqual('Night');
      expect(fixture.componentInstance.level).toEqual(10);
      expect(fixture.componentInstance.allowAquatic).toBeTrue();
      expect(fixture.componentInstance.allowUnderground).toBeFalse();

      const checkedfilters = getCheckedFilters();
      expect(checkedfilters).toEqual(['Dragon', 'Giant', 'Humanoid']);

      //run validation
      await helper.waitForService();

      helper.clickButton('#generateFromHallButton');

      fixture.detectChanges();
      
      helper.expectGenerating(
        fixture.componentInstance.generating,
        '#generateFromDoorButton', 
        '#areasSection', 
        '#generatingSection', 
        '#dungeonValidating', 
        '#downloadButton');
      helper.expectGenerating(
        fixture.componentInstance.generating,
        '#generateFromHallButton', 
        '#areasSection', 
        '#generatingSection', 
        '#dungeonValidating', 
        '#downloadButton');

      //run generate encounter
      await helper.waitForService();

      helper.expectGenerated(
        fixture.componentInstance.generating,
        '#generateFromDoorButton', 
        '#areasSection', 
        '#generatingSection', 
        '#dungeonValidating',
        '#downloadButton');
      helper.expectGenerated(
        fixture.componentInstance.generating,
        '#generateFromHallButton', 
        '#areasSection', 
        '#generatingSection', 
        '#dungeonValidating',
        '#downloadButton');

      helper.expectExists('#noAreas', false);
      helper.expectAreas('#areasSection dndgen-area', true);
    });
    
    function getCheckedFilters(): string[] {
      var checkedFilters = [];
  
      for (var i = 0; i < fixture.componentInstance.creatureTypeFilters.length; i++) {
          if (fixture.componentInstance.creatureTypeFilters[i].checked) {
              checkedFilters.push(fixture.componentInstance.creatureTypeFilters[i].displayName);
          }
      }
  
      return checkedFilters;
    }
  
    it(`should render no areas`, () => {
      helper.expectExists('#noAreas', true);
      helper.expectExists('#areasSection dndgen-area', false);
    });
    
    it(`should render 1 area`, () => {
      const areas = [
        new Area('my area type'),
      ];
      fixture.componentInstance.areas = areas;

      fixture.detectChanges();

      helper.expectExists('#noAreas', false);
      helper.expectExists('#areasSection dndgen-area', true);
      helper.expectAreas('#areasSection dndgen-area', true, areas);
    });
    
    it(`should render 2 areas`, () => {
      const areas = [
        new Area('my area type'),
        new Area('my other area type'),
      ];
      fixture.componentInstance.areas = areas;

      fixture.detectChanges();

      helper.expectExists('#noAreas', false);
      helper.expectExists('#areasSection dndgen-area', true);
      helper.expectAreas('#areasSection dndgen-area', true, areas);
    });
    
    it(`should download dungeon`, async () => {
      //Even for an integration test, we don't want to create an actual file
      let fileSaverSpy = spyOn(FileSaver, 'saveAs').and.stub();

      const areas = [
        new Area('my area type'),
        new Area('my other area type'),
      ];
      fixture.componentInstance.areas = areas;

      fixture.detectChanges();

      helper.clickButton('#downloadButton');

      expect(FileSaver.saveAs).toHaveBeenCalledWith(jasmine.any(Blob), 'my area type.txt');
        
      const blob = fileSaverSpy.calls.first().args[0] as Blob;
      const text = await blob.text();
      expect(text).toMatch(/^my area type[\r\n]+my other area type[\r\n\s]+$/);
    });
  });
});
