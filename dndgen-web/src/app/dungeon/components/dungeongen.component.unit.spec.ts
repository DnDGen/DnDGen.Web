import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DungeonGenComponent } from './dungeongen.component';
import { SweetAlertService } from '../../shared/services/sweet-alert.service';
import { LoggerService } from '../../shared/services/logger.service';
import { Observable } from 'rxjs';
import { FileSaverService } from '../../shared/services/file-saver.service';
import FileSaver from 'file-saver';
import { DungeonService } from '../services/dungeon.service';
import { DungeonPipe } from '../pipes/dungeon.pipe';
import { DungeonGenViewModel } from '../models/dungeongen-view-model.model';
import { TestHelper } from '../../test-helper';
import { Size } from '../../shared/components/size.enum';
import { EncounterDefaults } from '../../encounter/models/encounter-defaults.model';
import { EncounterService } from '../../encounter/services/encounter.service';
import { Area } from '../models/area.model';

describe('DungeonGen Component', () => {
  describe('unit', () => {
    let component: DungeonGenComponent;
    let dungeonServiceSpy: {
        getViewModel: ReturnType<typeof vi.fn>,
        generateAreasFromDoor: ReturnType<typeof vi.fn>,
        generateAreasFromHall: ReturnType<typeof vi.fn>
      };
    let encounterServiceSpy: { validate: ReturnType<typeof vi.fn> };
    let dungeonPipeSpy: { transform: ReturnType<typeof vi.fn> };
    let sweetAlertServiceSpy: { showError: ReturnType<typeof vi.fn> };
    let loggerServiceSpy: { logError: ReturnType<typeof vi.fn> };
    let fileSaverServiceSpy: { save: ReturnType<typeof vi.fn> };

    const delay = 10;
  
    beforeEach(() => {
      vi.useFakeTimers();

      dungeonServiceSpy = { getViewModel: vi.fn(), generateAreasFromDoor: vi.fn(), generateAreasFromHall: vi.fn() };
      encounterServiceSpy = { validate: vi.fn() };
      dungeonPipeSpy = { transform: vi.fn() };
      sweetAlertServiceSpy = { showError: vi.fn() };
      loggerServiceSpy = { logError: vi.fn() };
      fileSaverServiceSpy = { save: vi.fn() };

      component = new DungeonGenComponent(
        dungeonServiceSpy as unknown as DungeonService, 
        encounterServiceSpy as unknown as EncounterService, 
        dungeonPipeSpy as unknown as DungeonPipe, 
        fileSaverServiceSpy as unknown as FileSaverService, 
        sweetAlertServiceSpy as unknown as SweetAlertService, 
        loggerServiceSpy as unknown as LoggerService);
    });
  
    afterEach(() => {
      vi.useRealTimers();
    });
  
    it(`should initialize the public properties`, () => {
      expect(component.generating()).toBe(false);
      expect(component.validating()).toBe(false);
      expect(component.valid()).toBe(false);
      expect(component.areas()).toBeTruthy();
      expect(component.areas().length).toBeFalsy();
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
      expect(component.allowAquatic).toBe(false);
      expect(component.allowUnderground).toBe(true);

      expect(component.creatureTypeFilters.length).toBe(2);
      expect(component.creatureTypeFilters[0].id).toBe('creature_type_1');
      expect(component.creatureTypeFilters[0].displayName).toBe('creature type 1');
      expect(component.creatureTypeFilters[0].checked).toBe(false);
      expect(component.creatureTypeFilters[1].id).toBe('creature_type_2');
      expect(component.creatureTypeFilters[1].displayName).toBe('creature type 2');
      expect(component.creatureTypeFilters[1].checked).toBe(false);
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

    it('should be validating while fetching the dungeon model', async () => {
      const model = getViewModel();
      dungeonServiceSpy.getViewModel.mockImplementation(() => getFakeDelay(model));
      encounterServiceSpy.validate.mockImplementation(() => getFakeDelay(true));

      component.ngOnInit();

      expect(component.loading()).toBe(true);
      expect(component.dungeonModel()).toBeFalsy();
      
      expectInitialInputValues();

      expect(component.loading()).toBe(true);
      expect(component.valid()).toBe(false);
      expect(component.validating()).toBe(true);
      
      await vi.advanceTimersByTimeAsync(delay - 1);

      expect(component.dungeonModel()).toBeFalsy();

      expectInitialInputValues();

      expect(component.loading()).toBe(true);
      expect(component.valid()).toBe(false);
      expect(component.validating()).toBe(true);
      
      await vi.advanceTimersByTimeAsync(1);
      
      const dungeonModel = component.dungeonModel();
      expect(dungeonModel).toEqual(model);
      
      expectDefaultInputValues();
      
      expect(component.loading()).toBe(true);
      expect(component.valid()).toBe(false);
      expect(component.validating()).toBe(true);

      await vi.advanceTimersByTimeAsync(delay - 1);

      expect(component.dungeonModel()).toEqual(model);
      
      expectDefaultInputValues();
      
      expect(component.loading()).toBe(true);
      expect(component.valid()).toBe(false);
      expect(component.validating()).toBe(true);

      await vi.runAllTimersAsync();
    });

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
      it(`should set the dungeon model on init - validity: ${test}`, async () => {
        const model = getViewModel();
        dungeonServiceSpy.getViewModel.mockImplementation(() => getFakeDelay(model));
        encounterServiceSpy.validate.mockImplementation(() => getFakeDelay(test));
  
        component.ngOnInit();
  
        expect(component.loading()).toBe(true);
        expect(component.dungeonModel()).toBeFalsy();
        expect(component.validating()).toBe(true);
  
        await vi.advanceTimersByTimeAsync(delay * 2);
  
        expect(component.loading()).toBe(false);
        expect(component.dungeonModel()).toEqual(model);
        expect(component.validating()).toBe(false);
  
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

        expect(component.valid()).toEqual(test);
        
        expect(loggerServiceSpy.logError).not.toHaveBeenCalled();
        expect(sweetAlertServiceSpy.showError).not.toHaveBeenCalled();
      });
    });

    it('should display error from getting dungeon model', async () => {
      dungeonServiceSpy.getViewModel.mockImplementation(() => getFakeError('I failed'));
      encounterServiceSpy.validate.mockImplementation(() => getFakeDelay(true));

      component.ngOnInit();
      await vi.advanceTimersByTimeAsync(delay * 2);

      expect(component.dungeonModel()).toBeFalsy();
      expect(component.areas()).toEqual([]);
      expect(component.generating()).toBe(false);
      expect(component.validating()).toBe(false);
      expect(component.valid()).toBe(false);
      expect(component.loading()).toBe(false);
      
      expect(loggerServiceSpy.logError).toHaveBeenCalledWith('I failed');
      expect(sweetAlertServiceSpy.showError).toHaveBeenCalledTimes(1);
    });

    it('should display error from validating on init', async () => {
      const model = getViewModel();
      dungeonServiceSpy.getViewModel.mockImplementation(() => getFakeDelay(model));
      encounterServiceSpy.validate.mockImplementation(() => getFakeError('I failed'));

      component.ngOnInit();
      await vi.advanceTimersByTimeAsync(delay * 2);

      expect(component.dungeonModel()).toEqual(model);
      expect(component.areas()).toEqual([]);
      expect(component.generating()).toBe(false);
      expect(component.validating()).toBe(false);
      expect(component.valid()).toBe(false);
      expect(component.loading()).toBe(false);
      
      expect(loggerServiceSpy.logError).toHaveBeenCalledWith('I failed');
      expect(sweetAlertServiceSpy.showError).toHaveBeenCalledTimes(1);
    });

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
      var checkedFilters: string[] = [];

      if (c0)
        checkedFilters.push(component.creatureTypeFilters[0].displayName);

      if (c1)
        checkedFilters.push(component.creatureTypeFilters[1].displayName);

      return checkedFilters;
    }

    parameterBooleans.forEach(test => {
      it(`should show invalid when dungeon level is missing - aquatic ${test.a}, underground ${test.u}, filter 0 ${test.c0}, filter 1 ${test.c1}`, async () => {
        setupOnInit();
  
        encounterServiceSpy.validate.mockImplementation(() => getFakeDelay(true));

        component.creatureTypeFilters[0].checked = test.c0;
        component.creatureTypeFilters[1].checked = test.c1;
  
        component.validate(0, 'my environment', 'my temperature', 'my time of day', 9266, test.a, test.u);
  
        expect(component.validating()).toBe(false);
        expect(component.valid()).toBe(false);
      });
      
      it(`should show invalid when level is missing - aquatic ${test.a}, underground ${test.u}, filter 0 ${test.c0}, filter 1 ${test.c1}`, async () => {
        setupOnInit();
  
        encounterServiceSpy.validate.mockImplementation(() => getFakeDelay(true));

        component.creatureTypeFilters[0].checked = test.c0;
        component.creatureTypeFilters[1].checked = test.c1;
  
        component.validate(90210, 'my environment', 'my temperature', 'my time of day', 0, test.a, test.u);
        
        expect(component.validating()).toBe(false);
        expect(component.valid()).toBe(false);
      });

      it(`should be validating while validating the parameters - aquatic ${test.a}, underground ${test.u}, filter 0 ${test.c0}, filter 1 ${test.c1}`, async () => {
        setupOnInit();
  
        encounterServiceSpy.validate.mockImplementation(() => getFakeDelay(true));

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
        expect(component.validating()).toBe(true);
        
        await vi.advanceTimersByTimeAsync(delay - 1);
  
        expect(component.validating()).toBe(true);
  
        await vi.runAllTimersAsync();
      });
  
      it(`should validate valid parameters - aquatic ${test.a}, underground ${test.u}, filter 0 ${test.c0}, filter 1 ${test.c1}`, async () => {
        setupOnInit();

        encounterServiceSpy.validate.mockImplementation(() => getFakeDelay(true));
  
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
        expect(component.validating()).toBe(true);
  
        await vi.advanceTimersByTimeAsync(delay);
  
        expect(component.valid()).toBe(true);
        expect(component.validating()).toBe(false);
        
        expect(loggerServiceSpy.logError).not.toHaveBeenCalled();
        expect(sweetAlertServiceSpy.showError).not.toHaveBeenCalled();
      });
  
      it(`should validate invalid parameters - aquatic ${test.a}, underground ${test.u}, filter 0 ${test.c0}, filter 1 ${test.c1}`, async () => {
        setupOnInit();

        encounterServiceSpy.validate.mockImplementation(() => getFakeDelay(false));
  
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
        expect(component.validating()).toBe(true);
  
        await vi.advanceTimersByTimeAsync(delay);
  
        expect(component.valid()).toBe(false);
        expect(component.validating()).toBe(false);
        
        expect(loggerServiceSpy.logError).not.toHaveBeenCalled();
        expect(sweetAlertServiceSpy.showError).not.toHaveBeenCalled();
      });
  
      it(`should display error from validating parameters - aquatic ${test.a}, underground ${test.u}, filter 0 ${test.c0}, filter 1 ${test.c1}`, async () => {
        setupOnInit();

        encounterServiceSpy.validate.mockImplementation(() => getFakeError('I failed'));
  
        component.creatureTypeFilters[0].checked = test.c0;
        component.creatureTypeFilters[1].checked = test.c1;
  
        component.validate(90210, 'my environment', 'my temperature', 'my time of day', 9266, test.a, test.u);
        const checkedFilters = getCheckedFilters(test.c0, test.c1);

        await vi.advanceTimersByTimeAsync(delay);
  
        expect(component.valid()).toBe(false);
        expect(component.areas()).toEqual([]);
        expect(component.generating()).toBe(false);
        expect(component.validating()).toBe(false);
        
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
      });
      
      it(`should be generating while generating from door - aquatic ${test.a}, underground ${test.u}, filter 0 ${test.c0}, filter 1 ${test.c1}`, async () => {
        setupOnInit();

        const areas = [
          new Area('my area type'),
          new Area('my other area type'),
        ];
        dungeonServiceSpy.generateAreasFromDoor.mockImplementation(() => getFakeDelay(areas));

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

        expect(component.generating()).toBe(true);
        expect(component.areas()).toEqual([]);
        
        await vi.advanceTimersByTimeAsync(delay - 1);

        expect(component.generating()).toBe(true);
        expect(component.areas()).toEqual([]);

        await vi.runAllTimersAsync();
      });
      
      it(`should be generating while generating from hall - aquatic ${test.a}, underground ${test.u}, filter 0 ${test.c0}, filter 1 ${test.c1}`, async () => {
        setupOnInit();

        const areas = [
          new Area('my area type'),
          new Area('my other area type'),
        ];
        dungeonServiceSpy.generateAreasFromHall.mockImplementation(() => getFakeDelay(areas));

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

        expect(component.generating()).toBe(true);
        expect(component.areas()).toEqual([]);
        
        await vi.advanceTimersByTimeAsync(delay - 1);

        expect(component.generating()).toBe(true);
        expect(component.areas()).toEqual([]);

        await vi.runAllTimersAsync();
      });
    });

    function setupOnInit() {
      const model = getViewModel();
      component.dungeonModel.set(model);

      component.environment = model.defaults.environment;
      component.temperature = model.defaults.temperature;
      component.timeOfDay = model.defaults.timeOfDay;
      component.level = model.defaults.level;
      component.allowAquatic = model.defaults.allowAquatic;
      component.allowUnderground = model.defaults.allowUnderground;

      for (var i = 0; i < model.creatureTypes.length; i++) {
        component.creatureTypeFilters.push({ 
            id: model.creatureTypes[i].replaceAll(' ', '_'),
            displayName: model.creatureTypes[i],
            checked: false
        });
      }

      component.valid.set(true);
    }

    it('should generate the default dungeon area from door', async () => {
      setupOnInit();

      const areas = [
        new Area('my area type'),
        new Area('my other area type'),
      ];
      dungeonServiceSpy.generateAreasFromDoor.mockImplementation(() => getFakeDelay(areas));

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
      expect(component.generating()).toBe(true);

      await vi.advanceTimersByTimeAsync(delay);

      expect(component.areas()).toBe(areas);
      expect(component.generating()).toBe(false);
      
      expect(loggerServiceSpy.logError).not.toHaveBeenCalled();
      expect(sweetAlertServiceSpy.showError).not.toHaveBeenCalled();
    });

    it('should generate the default dungeon area from hall', async () => {
      setupOnInit();

      const areas = [
        new Area('my area type'),
        new Area('my other area type'),
      ];
      dungeonServiceSpy.generateAreasFromHall.mockImplementation(() => getFakeDelay(areas));

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
      expect(component.generating()).toBe(true);

      await vi.advanceTimersByTimeAsync(delay);

      expect(component.areas()).toBe(areas);
      expect(component.generating()).toBe(false);
      
      expect(loggerServiceSpy.logError).not.toHaveBeenCalled();
      expect(sweetAlertServiceSpy.showError).not.toHaveBeenCalled();
    });

    it(`should generate a non-default dungeon area from door`, async () => {
      setupOnInit();

      const areas = [
        new Area('my area type'),
        new Area('my other area type'),
      ];
      dungeonServiceSpy.generateAreasFromDoor.mockImplementation(() => getFakeDelay(areas));

      const model = component.dungeonModel()!;
      component.dungeonLevel = 2;
      component.environment = model.environments.find(e => e != model.defaults.environment)!;
      component.temperature = model.temperatures.find(e => e != model.defaults.temperature)!;
      component.timeOfDay = model.timesOfDay.find(e => e != model.defaults.timeOfDay)!;
      component.level = model.defaults.level + 1;
      component.allowAquatic = !model.defaults.allowAquatic;
      component.allowUnderground = !model.defaults.allowUnderground;
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
      expect(component.generating()).toBe(true);

      await vi.advanceTimersByTimeAsync(delay);

      expect(component.areas()).toBe(areas);
      expect(component.generating()).toBe(false);
      
      expect(loggerServiceSpy.logError).not.toHaveBeenCalled();
      expect(sweetAlertServiceSpy.showError).not.toHaveBeenCalled();
    });

    it(`should generate a non-default dungeon area from hall`, async () => {
      setupOnInit();

      const areas = [
        new Area('my area type'),
        new Area('my other area type'),
      ];
      dungeonServiceSpy.generateAreasFromHall.mockImplementation(() => getFakeDelay(areas));

      const model = component.dungeonModel()!;
      component.dungeonLevel = 2;
      component.environment = model.environments.find(e => e != model.defaults.environment)!;
      component.temperature = model.temperatures.find(e => e != model.defaults.temperature)!;
      component.timeOfDay = model.timesOfDay.find(e => e != model.defaults.timeOfDay)!;
      component.level = model.defaults.level + 1;
      component.allowAquatic = !model.defaults.allowAquatic;
      component.allowUnderground = !model.defaults.allowUnderground;
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
      expect(component.generating()).toBe(true);

      await vi.advanceTimersByTimeAsync(delay);

      expect(component.areas()).toBe(areas);
      expect(component.generating()).toBe(false);
      
      expect(loggerServiceSpy.logError).not.toHaveBeenCalled();
      expect(sweetAlertServiceSpy.showError).not.toHaveBeenCalled();
    });

    it('should display error from generating dungeon area from door', async () => {
      setupOnInit();

      dungeonServiceSpy.generateAreasFromDoor.mockImplementation(() => getFakeError('I failed'));

      component.generateFromDoor();
      await vi.advanceTimersByTimeAsync(delay);

      expect(component.areas()).toEqual([]);
      expect(component.generating()).toBe(false);
      expect(component.validating()).toBe(false);
      
      expect(loggerServiceSpy.logError).toHaveBeenCalledWith('I failed');
      expect(sweetAlertServiceSpy.showError).toHaveBeenCalledTimes(1);
    });

    it('should display error from generating dungeon area from hall', async () => {
      setupOnInit();

      dungeonServiceSpy.generateAreasFromHall.mockImplementation(() => getFakeError('I failed'));

      component.generateFromHall();
      await vi.advanceTimersByTimeAsync(delay);

      expect(component.areas()).toEqual([]);
      expect(component.generating()).toBe(false);
      expect(component.validating()).toBe(false);
      
      expect(loggerServiceSpy.logError).toHaveBeenCalledWith('I failed');
      expect(sweetAlertServiceSpy.showError).toHaveBeenCalledTimes(1);
    });

    it('should download dungeon areas', () => {
      const areas = [
        new Area('my area type'),
        new Area('my other area type'),
      ];
      component.areas.set(areas);

      dungeonPipeSpy.transform.mockReturnValue('my formatted dungeon areas');

      component.download();

      expect(dungeonPipeSpy.transform).toHaveBeenCalledWith(areas);
      expect(fileSaverServiceSpy.save).toHaveBeenCalledWith('my formatted dungeon areas', 'my area type');
    });

    it('should not download missing dungeon areas', () => {
      component.areas.set([]);

      component.download();
      
      expect(dungeonPipeSpy.transform).not.toHaveBeenCalled();
      expect(fileSaverServiceSpy.save).not.toHaveBeenCalled();
    });
  });
});