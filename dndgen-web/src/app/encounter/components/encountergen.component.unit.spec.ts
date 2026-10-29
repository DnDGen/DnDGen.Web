import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EncounterGenComponent } from './encountergen.component';
import { SweetAlertService } from '../../shared/services/sweet-alert.service';
import { LoggerService } from '../../shared/services/logger.service';
import { Observable } from 'rxjs';
import { FileSaverService } from '../../shared/services/file-saver.service';
import FileSaver from 'file-saver';
import { EncounterService } from '../services/encounter.service';
import { EncounterPipe } from '../pipes/encounter.pipe';
import { EncounterGenViewModel } from '../models/encountergen-view-model.model';
import { TestHelper } from '../../test-helper';
import { Size } from '../../shared/components/size.enum';
import { EncounterDefaults } from '../models/encounter-defaults.model';
import { Encounter } from '../models/encounter.model';

describe('EncounterGen Component', () => {
  describe('unit', () => {
    let component: EncounterGenComponent;
    let encounterServiceSpy: {
        getViewModel: ReturnType<typeof vi.fn>,
        generate: ReturnType<typeof vi.fn>,
        validate: ReturnType<typeof vi.fn>
      };
    let encounterPipeSpy: { transform: ReturnType<typeof vi.fn> };
    let sweetAlertServiceSpy: { showError: ReturnType<typeof vi.fn> };
    let loggerServiceSpy: { logError: ReturnType<typeof vi.fn> };
    let fileSaverServiceSpy: { save: ReturnType<typeof vi.fn> };

    const delay = 10;
  
    beforeEach(() => {
      vi.useFakeTimers();

      encounterServiceSpy = { getViewModel: vi.fn(), generate: vi.fn(), validate: vi.fn() };
      encounterPipeSpy = { transform: vi.fn() };
      sweetAlertServiceSpy = { showError: vi.fn() };
      loggerServiceSpy = { logError: vi.fn() };
      fileSaverServiceSpy = { save: vi.fn() };

      component = new EncounterGenComponent(
        encounterServiceSpy as unknown as EncounterService, 
        encounterPipeSpy as unknown as EncounterPipe, 
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
      expect(component.encounter()).toBeFalsy();
    });
  
    it(`should initialize the input values`, () => {
      expectInitialInputValues();
    });

    function expectInitialInputValues() {
      expect(component.temperature).toEqual('');
      expect(component.environment).toEqual('');
      expect(component.timeOfDay).toEqual('');
      expect(component.level).toEqual(1);
      expect(component.allowAquatic).toEqual(false);
      expect(component.allowUnderground).toEqual(false);
    }

    function expectDefaultInputValues() {
      expect(component.temperature).toEqual('temperature 1');
      expect(component.environment).toEqual('environment 2');
      expect(component.timeOfDay).toEqual('time of day 2');
      expect(component.level).toEqual(10);
      expect(component.allowAquatic).toEqual(false);
      expect(component.allowUnderground).toEqual(false);

      expect(component.creatureTypeFilters.length).toBe(2);
      expect(component.creatureTypeFilters[0].id).toBe('creature_type_1');
      expect(component.creatureTypeFilters[0].displayName).toBe('creature type 1');
      expect(component.creatureTypeFilters[0].checked).toBe(false);
      expect(component.creatureTypeFilters[1].id).toBe('creature_type_2');
      expect(component.creatureTypeFilters[1].displayName).toBe('creature type 2');
      expect(component.creatureTypeFilters[1].checked).toBe(false);
    }

    function getViewModel(): EncounterGenViewModel {
      return new EncounterGenViewModel(
        ['environment 1', 'environment 2'],
        ['temperature 1', 'temperature 2'],
        ['time of day 1', 'time of day 2'],
        ['creature type 1', 'creature type 2'],
        new EncounterDefaults('environment 2', 'temperature 1', 'time of day 2', 10)
      );
    }

    it('should be validating while fetching the encounter model', async () => {
      const model = getViewModel();
      encounterServiceSpy.getViewModel.mockImplementation(() => getFakeDelay(model));
      encounterServiceSpy.validate.mockImplementation(() => getFakeDelay(true));

      component.ngOnInit();

      expect(component.loading()).toBe(true);
      expect(component.encounterModel()).toBeFalsy();
      
      expectInitialInputValues();

      expect(component.loading()).toBe(true);
      expect(component.valid()).toBe(false);
      expect(component.validating()).toBe(true);
      
      await vi.advanceTimersByTimeAsync(delay - 1);

      expect(component.encounterModel()).toBeFalsy();

      expectInitialInputValues();

      expect(component.loading()).toBe(true);
      expect(component.valid()).toBe(false);
      expect(component.validating()).toBe(true);
      
      await vi.advanceTimersByTimeAsync(1);
      
      expect(component.encounterModel()).toEqual(model);
      
      expectDefaultInputValues();
      
      expect(component.loading()).toBe(true);
      expect(component.valid()).toBe(false);
      expect(component.validating()).toBe(true);

      await vi.advanceTimersByTimeAsync(delay - 1);

      expect(component.encounterModel()).toEqual(model);
      
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
      it(`should set the encounter model on init - validity: ${test}`, async () => {
        const model = getViewModel();
        encounterServiceSpy.getViewModel.mockImplementation(() => getFakeDelay(model));
        encounterServiceSpy.validate.mockImplementation(() => getFakeDelay(test));
  
        component.ngOnInit();
  
        expect(component.loading()).toBe(true);
        expect(component.encounterModel()).toBeFalsy();
        expect(component.validating()).toBe(true);
  
        await vi.advanceTimersByTimeAsync(delay * 2);
  
        expect(component.loading()).toBe(false);
        expect(component.encounterModel()).toEqual(model);
        expect(component.validating()).toBe(false);
  
        expectDefaultInputValues();
      
        expect(encounterServiceSpy.validate).toHaveBeenCalledWith(
          'environment 2',
          'temperature 1',
          'time of day 2',
          10,
          [],
          false,
          false,
        );

        expect(component.valid()).toEqual(test);
        
        expect(loggerServiceSpy.logError).not.toHaveBeenCalled();
        expect(sweetAlertServiceSpy.showError).not.toHaveBeenCalled();
      });
    });

    it('should display error from getting encounter model', async () => {
      encounterServiceSpy.getViewModel.mockImplementation(() => getFakeError('I failed'));
      encounterServiceSpy.validate.mockImplementation(() => getFakeDelay(true));

      component.ngOnInit();
      await vi.advanceTimersByTimeAsync(delay * 2);

      expect(component.encounterModel()).toBeFalsy();
      expect(component.encounter()).toBeFalsy();
      expect(component.generating()).toBe(false);
      expect(component.validating()).toBe(false);
      expect(component.loading()).toBe(false);
      
      expect(loggerServiceSpy.logError).toHaveBeenCalledWith('I failed');
      expect(sweetAlertServiceSpy.showError).toHaveBeenCalledTimes(1);
    });

    it('should display error from validating on init', async () => {
      const model = getViewModel();
      encounterServiceSpy.getViewModel.mockImplementation(() => getFakeDelay(model));
      encounterServiceSpy.validate.mockImplementation(() => getFakeError('I failed'));

      component.ngOnInit();
      await vi.advanceTimersByTimeAsync(delay * 2);

      expect(component.encounterModel()).toEqual(model);
      expect(component.encounter()).toBeNull();
      expect(component.generating()).toBe(false);
      expect(component.validating()).toBe(false);
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
      it(`should be validating while validating the parameters - aquatic ${test.a}, underground ${test.u}, filter 0 ${test.c0}, filter 1 ${test.c1}`, async () => {
        setupOnInit();
  
        encounterServiceSpy.validate.mockImplementation(() => getFakeDelay(true));

        component.creatureTypeFilters[0].checked = test.c0;
        component.creatureTypeFilters[1].checked = test.c1;
  
        component.validate('my environment', 'my temperature', 'my time of day', 9266, test.a, test.u);
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
  
        component.validate('my environment', 'my temperature', 'my time of day', 9266, test.a, test.u);
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
  
        component.validate('my environment', 'my temperature', 'my time of day', 9266, test.a, test.u);
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
  
        component.validate('my environment', 'my temperature', 'my time of day', 9266, test.a, test.u);
        const checkedFilters = getCheckedFilters(test.c0, test.c1);

        await vi.advanceTimersByTimeAsync(delay);
  
        expect(component.valid()).toBe(false);
        expect(component.encounter()).toBeNull();
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
      
      it(`should be generating while generating encounter - aquatic ${test.a}, underground ${test.u}, filter 0 ${test.c0}, filter 1 ${test.c1}`, async () => {
        setupOnInit();

        const encounter = new Encounter('my encounter description');
        encounterServiceSpy.generate.mockImplementation(() => getFakeDelay(encounter));

        component.environment = 'my environment';
        component.temperature = 'my temperature';
        component.timeOfDay = 'my time of day';
        component.level = 9266;
        component.allowAquatic = test.a;
        component.allowUnderground = test.u;
        component.creatureTypeFilters[0].checked = test.c0;
        component.creatureTypeFilters[1].checked = test.c1;

        component.generateEncounter();
        const checkedFilters = getCheckedFilters(test.c0, test.c1);

        expect(encounterServiceSpy.generate).toHaveBeenCalledWith(
          'my environment',
          'my temperature',
          'my time of day',
          9266,
          checkedFilters,
          test.a,
          test.u);

        expect(component.generating()).toBe(true);
        expect(component.encounter()).toBeNull();
        
        await vi.advanceTimersByTimeAsync(delay - 1);

        expect(component.generating()).toBe(true);
        expect(component.encounter()).toBeNull();

        await vi.runAllTimersAsync();
      });
    });

    function setupOnInit() {
      const model = getViewModel();
      component.encounterModel.set(model);

      component.environment = model.defaults.environment;
      component.temperature = model.defaults.temperature;
      component.timeOfDay = model.defaults.timeOfDay;
      component.level = model.defaults.level;

      for (var i = 0; i < model.creatureTypes.length; i++) {
        component.creatureTypeFilters.push({ 
            id: model.creatureTypes[i].replaceAll(' ', '_'),
            displayName: model.creatureTypes[i],
            checked: false
        });
      }

      component.valid.set(true);
    }

    it('should generate the default encounter', async () => {
      setupOnInit();

      let encounter = new Encounter('my encounter description');
      encounterServiceSpy.generate.mockImplementation(() => getFakeDelay(encounter));

      component.generateEncounter();

      expect(encounterServiceSpy.generate).toHaveBeenCalledWith(
        'environment 2',
        'temperature 1',
        'time of day 2',
        10,
        [],
        false,
        false,
      );
      expect(component.generating()).toBe(true);

      await vi.advanceTimersByTimeAsync(delay);

      expect(component.encounter()).toBe(encounter);
      expect(component.generating()).toBe(false);
      
      expect(loggerServiceSpy.logError).not.toHaveBeenCalled();
      expect(sweetAlertServiceSpy.showError).not.toHaveBeenCalled();
    });

    it(`should generate a non-default encounter`, async () => {
      setupOnInit();

      let encounter = new Encounter('my encounter description');
      encounterServiceSpy.generate.mockImplementation(() => getFakeDelay(encounter));

      const model = component.encounterModel()!;
      component.environment = model.environments.find(e => e != model.defaults.environment)!;
      component.temperature = model.temperatures.find(e => e != model.defaults.temperature)!;
      component.timeOfDay = model.timesOfDay.find(e => e != model.defaults.timeOfDay)!;
      component.level = model.defaults.level + 1;
      component.allowAquatic = true;
      component.allowUnderground = true;
      component.creatureTypeFilters[0].checked = true;
      component.creatureTypeFilters[1].checked = true;

      component.generateEncounter();

      expect(encounterServiceSpy.generate).toHaveBeenCalledWith(
        'environment 1',
        'temperature 2',
        'time of day 1',
        11,
        ['creature type 1', 'creature type 2'],
        true,
        true,
      );
      expect(component.generating()).toBe(true);

      await vi.advanceTimersByTimeAsync(delay);

      expect(component.encounter()).toBe(encounter);
      expect(component.generating()).toBe(false);
      
      expect(loggerServiceSpy.logError).not.toHaveBeenCalled();
      expect(sweetAlertServiceSpy.showError).not.toHaveBeenCalled();
    });

    it('should display error from generating encounter', async () => {
      setupOnInit();

      encounterServiceSpy.generate.mockImplementation(() => getFakeError('I failed'));

      component.generateEncounter();
      await vi.advanceTimersByTimeAsync(delay);

      expect(component.encounter()).toBeNull();
      expect(component.generating()).toBe(false);
      expect(component.validating()).toBe(false);
      
      expect(loggerServiceSpy.logError).toHaveBeenCalledWith('I failed');
      expect(sweetAlertServiceSpy.showError).toHaveBeenCalledTimes(1);
    });

    it('should download encounter', () => {
      const encounter = new Encounter('my encounter description');
      component.encounter.set(encounter);

      encounterPipeSpy.transform.mockReturnValue('my formatted encounter');

      component.download();

      expect(encounterPipeSpy.transform).toHaveBeenCalledWith(encounter);
      expect(fileSaverServiceSpy.save).toHaveBeenCalledWith('my formatted encounter', 'my encounter description');
    });

    it('should not download missing encounter', () => {
      component.encounter.set(null);

      component.download();
      
      expect(encounterPipeSpy.transform).not.toHaveBeenCalled();
      expect(fileSaverServiceSpy.save).not.toHaveBeenCalled();
    });
  });
});