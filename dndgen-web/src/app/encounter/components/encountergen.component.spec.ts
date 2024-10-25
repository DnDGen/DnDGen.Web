import { ComponentFixture, fakeAsync, flush, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { EncounterGenComponent } from './encountergen.component';
import { SweetAlertService } from '../../shared/services/sweetAlert.service';
import { LoggerService } from '../../shared/services/logger.service';
import { Observable } from 'rxjs';
import { FileSaverService } from '../../shared/services/fileSaver.service';
import * as FileSaver from 'file-saver';
import { EncounterService } from '../services/encounter.service';
import { EncounterPipe } from '../pipes/encounter.pipe';
import { EncounterGenViewModel } from '../models/encountergenViewModel.model';
import { TestHelper } from '../../testHelper.spec';
import { Size } from '../../shared/components/size.enum';
import { EncounterDefaults } from '../models/encounterDefaults.model';
import { Encounter } from '../models/encounter.model';

describe('EncounterGen Component', () => {
  describe('unit', () => {
    let component: EncounterGenComponent;
    let encounterServiceSpy: jasmine.SpyObj<EncounterService>;
    let encounterPipeSpy: jasmine.SpyObj<EncounterPipe>;
    let sweetAlertServiceSpy: jasmine.SpyObj<SweetAlertService>;
    let loggerServiceSpy: jasmine.SpyObj<LoggerService>;
    let fileSaverServiceSpy: jasmine.SpyObj<FileSaverService>;

    const delay = 10;
  
    beforeEach(() => {
      encounterServiceSpy = jasmine.createSpyObj('EncounterService', ['getViewModel', 'generate', 'validate']);
      encounterPipeSpy = jasmine.createSpyObj('EncounterPipe', ['transform']);
      sweetAlertServiceSpy = jasmine.createSpyObj('SweetAlertService', ['showError']);
      loggerServiceSpy = jasmine.createSpyObj('LoggerService', ['logError']);
      fileSaverServiceSpy = jasmine.createSpyObj('FileSaverService', ['save']);

      component = new EncounterGenComponent(encounterServiceSpy, encounterPipeSpy, fileSaverServiceSpy, sweetAlertServiceSpy, loggerServiceSpy);
    });
  
    it(`should initialize the public properties`, () => {
      expect(component.generating).toBeFalse();
      expect(component.validating).toBeFalse();
      expect(component.valid).toBeFalse();
      expect(component.encounter).toBeFalsy();
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
      expect(component.creatureTypeFilters[0].name).toBe('creature type 1');
      expect(component.creatureTypeFilters[0].checked).toBeFalse();
      expect(component.creatureTypeFilters[1].name).toBe('creature type 2');
      expect(component.creatureTypeFilters[1].checked).toBeFalse();
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

    it('should be validating while fetching the encounter model', fakeAsync(() => {
      const model = getViewModel();
      encounterServiceSpy.getViewModel.and.callFake(() => getFakeDelay(model));
      encounterServiceSpy.validate.and.callFake(() => getFakeDelay(true));

      component.ngOnInit();

      expect(component.loading).toBeTrue();
      expect(component.encounterModel).toBeFalsy();
      
      expectInitialInputValues();

      expect(component.loading).toBeTrue();
      expect(component.valid).toBeFalse();
      expect(component.validating).toBeTrue();
      
      tick(delay - 1);

      expect(component.encounterModel).toBeFalsy();

      expectInitialInputValues();

      expect(component.loading).toBeTrue();
      expect(component.valid).toBeFalse();
      expect(component.validating).toBeTrue();
      
      tick(1);
      
      expect(component.encounterModel).toEqual(model);
      
      expectDefaultInputValues();
      
      expect(component.loading).toBeTrue();
      expect(component.valid).toBeFalse();
      expect(component.validating).toBeTrue();

      tick(delay - 1);

      expect(component.encounterModel).toEqual(model);
      
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
      it(`should set the encounter model on init - validity: ${test}`, fakeAsync(() => {
        const model = getViewModel();
        encounterServiceSpy.getViewModel.and.callFake(() => getFakeDelay(model));
        encounterServiceSpy.validate.and.callFake(() => getFakeDelay(test));
  
        component.ngOnInit();
  
        expect(component.loading).toBeTrue();
        expect(component.encounterModel).toBeFalsy();
        expect(component.validating).toBeTrue();
  
        tick(delay * 2);
  
        expect(component.loading).toBeFalse();
        expect(component.encounterModel).toEqual(model);
        expect(component.validating).toBeFalse();
  
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

        expect(component.valid).toEqual(test);
        
        expect(loggerServiceSpy.logError).not.toHaveBeenCalled();
        expect(sweetAlertServiceSpy.showError).not.toHaveBeenCalled();
      }));
    });

    it('should display error from getting encounter model', fakeAsync(() => {
      encounterServiceSpy.getViewModel.and.callFake(() => getFakeError('I failed'));
      encounterServiceSpy.validate.and.callFake(() => getFakeDelay(true));

      component.ngOnInit();
      tick(delay * 2);

      expect(component.encounterModel).toBeFalsy();
      expect(component.encounter).toBeFalsy();
      expect(component.generating).toBeFalse();
      expect(component.validating).toBeFalse();
      expect(component.loading).toBeFalse();
      
      expect(loggerServiceSpy.logError).toHaveBeenCalledWith('I failed');
      expect(sweetAlertServiceSpy.showError).toHaveBeenCalledTimes(1);
    }));

    it('should display error from validating on init', fakeAsync(() => {
      const model = getViewModel();
      encounterServiceSpy.getViewModel.and.callFake(() => getFakeDelay(model));
      encounterServiceSpy.validate.and.callFake(() => getFakeError('I failed'));

      component.ngOnInit();
      tick(delay * 2);

      expect(component.encounterModel).toEqual(model);
      expect(component.encounter).toBeNull();
      expect(component.generating).toBeFalse();
      expect(component.validating).toBeFalse();
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
        checkedFilters.push(component.creatureTypeFilters[0].name);

      if (c1)
        checkedFilters.push(component.creatureTypeFilters[1].name);

      return checkedFilters;
    }

    parameterBooleans.forEach(test => {
      it(`should be validating while validating the parameters - aquatic ${test.a}, underground ${test.u}, filter 0 ${test.c0}, filter 1 ${test.c1}`, fakeAsync(() => {
        setupOnInit();
  
        encounterServiceSpy.validate.and.callFake(() => getFakeDelay(true));

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
  
        component.validate('my environment', 'my temperature', 'my time of day', 9266, test.a, test.u);
        const checkedFilters = getCheckedFilters(test.c0, test.c1);

        tick(delay);
  
        expect(component.valid).toBeFalse();
        expect(component.encounter).toBeNull();
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
      
      it(`should be generating while generating encounter - aquatic ${test.a}, underground ${test.u}, filter 0 ${test.c0}, filter 1 ${test.c1}`, fakeAsync(() => {
        setupOnInit();

        const encounter = new Encounter('my encounter description');
        encounterServiceSpy.generate.and.callFake(() => getFakeDelay(encounter));

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

        expect(component.generating).toBeTrue();
        expect(component.encounter).toBeNull();
        
        tick(delay - 1);

        expect(component.generating).toBeTrue();
        expect(component.encounter).toBeNull();

        flush();
      }));
    });

    function setupOnInit() {
      component.encounterModel = getViewModel();

      component.environment = component.encounterModel.defaults.environment;
      component.temperature = component.encounterModel.defaults.temperature;
      component.timeOfDay = component.encounterModel.defaults.timeOfDay;
      component.level = component.encounterModel.defaults.level;

      for (var i = 0; i < component.encounterModel.creatureTypes.length; i++) {
        component.creatureTypeFilters.push({ 
            name: component.encounterModel.creatureTypes[i],
            checked: false
        });
      }

      component.valid = true;
    }

    it('should generate the default encounter', fakeAsync(() => {
      setupOnInit();

      let encounter = new Encounter('my encounter description');
      encounterServiceSpy.generate.and.callFake(() => getFakeDelay(encounter));

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
      expect(component.generating).toBeTrue();

      tick(delay);

      expect(component.encounter).toBe(encounter);
      expect(component.generating).toBeFalse();
      
      expect(loggerServiceSpy.logError).not.toHaveBeenCalled();
      expect(sweetAlertServiceSpy.showError).not.toHaveBeenCalled();
    }));

    it(`should generate a non-default encounter`, fakeAsync(() => {
      setupOnInit();

      let encounter = new Encounter('my encounter description');
      encounterServiceSpy.generate.and.callFake(() => getFakeDelay(encounter));

      component.environment = component.encounterModel.environments.find(e => e != component.encounterModel.defaults.environment)!;
      component.temperature = component.encounterModel.temperatures.find(e => e != component.encounterModel.defaults.temperature)!;
      component.timeOfDay = component.encounterModel.timesOfDay.find(e => e != component.encounterModel.defaults.timeOfDay)!;
      component.level = component.encounterModel.defaults.level + 1;
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
      expect(component.generating).toBeTrue();

      tick(delay);

      expect(component.encounter).toBe(encounter);
      expect(component.generating).toBeFalse();
      
      expect(loggerServiceSpy.logError).not.toHaveBeenCalled();
      expect(sweetAlertServiceSpy.showError).not.toHaveBeenCalled();
    }));

    it('should display error from generating encounter', fakeAsync(() => {
      setupOnInit();

      encounterServiceSpy.generate.and.callFake(() => getFakeError('I failed'));

      component.generateEncounter();
      tick(delay);

      expect(component.encounter).toBeNull();
      expect(component.generating).toBeFalse();
      expect(component.validating).toBeFalse();
      
      expect(loggerServiceSpy.logError).toHaveBeenCalledWith('I failed');
      expect(sweetAlertServiceSpy.showError).toHaveBeenCalledTimes(1);
    }));

    it('should download encounter', () => {
      const encounter = new Encounter('my encounter description');
      component.encounter = encounter;

      encounterPipeSpy.transform.and.returnValue('my formatted encounter');

      component.download();

      expect(encounterPipeSpy.transform).toHaveBeenCalledWith(encounter);
      expect(fileSaverServiceSpy.save).toHaveBeenCalledWith('my formatted encounter', 'my encounter description');
    });

    it('should not download missing encounter', () => {
      component.encounter = null;

      component.download();
      
      expect(encounterPipeSpy.transform).not.toHaveBeenCalled();
      expect(fileSaverServiceSpy.save).not.toHaveBeenCalled();
    });
  });

  describe('integration', () => {
    let fixture: ComponentFixture<EncounterGenComponent>;
    let helper: TestHelper<EncounterGenComponent>;
  
    beforeEach(async () => {
      await TestHelper.configureTestBed([EncounterGenComponent]);
  
      fixture = TestBed.createComponent(EncounterGenComponent);
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
  
    const expectedCreatureTypeCount = 16;

    it(`should set the encounter model on init`, () => {
      const component = fixture.componentInstance;
      expect(component.encounterModel).toBeTruthy();
      expect(component.encounterModel.environments.length).toEqual(12);
      expect(component.encounterModel.environments).toContain(component.encounterModel.defaults.environment);
      expect(component.encounterModel.temperatures.length).toEqual(3);
      expect(component.encounterModel.temperatures).toContain(component.encounterModel.defaults.temperature);
      expect(component.encounterModel.timesOfDay.length).toEqual(2);
      expect(component.encounterModel.timesOfDay).toContain(component.encounterModel.defaults.timeOfDay);
      expect(component.encounterModel.creatureTypes.length).toEqual(expectedCreatureTypeCount);
      expect(component.encounterModel.defaults.environment).toBe('Plains');
      expect(component.encounterModel.defaults.temperature).toBe('Temperate');
      expect(component.encounterModel.defaults.timeOfDay).toBe('Day');
      expect(component.encounterModel.defaults.level).toBe(1);
    });
  
    it(`should set initial values on init`, () => {
      const component = fixture.componentInstance;
      expect(component.environment).toEqual(component.encounterModel.defaults.environment);
      expect(component.temperature).toEqual(component.encounterModel.defaults.temperature);
      expect(component.timeOfDay).toEqual(component.encounterModel.defaults.timeOfDay);
      expect(component.level).toEqual(component.encounterModel.defaults.level);
      expect(component.allowAquatic).toBeFalse();
      expect(component.allowUnderground).toBeFalse();
      expect(component.creatureTypeFilters.length).toEqual(component.encounterModel.creatureTypes.length);

      for(let i = 0; i < component.encounterModel.creatureTypes.length; i++) {
        expect(component.creatureTypeFilters[i].name).toBe(component.encounterModel.creatureTypes[i]);
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
  
    it(`should be ready to generate an encounter on load`, async () => {
      expectReady();
    });

    function expectReady() {
      expect(fixture.componentInstance.loading).toBeFalse();
      expect(fixture.componentInstance.validating).toBeFalse();
      expect(fixture.componentInstance.generating).toBeFalse();
      expect(fixture.componentInstance.valid).toBeTrue();

      helper.expectHasAttribute('#generateButton', 'disabled', false);
    }

    it(`should render the encounter inputs`, () => {
      helper.expectSelect('#temperature', true, 'Temperate', 3);
      helper.expectSelect('#environment', true, 'Plains', 3);
      helper.expectSelect('#timeOfDay', true, 'Day', 2);
      helper.expectNumberInput('#level', true, 1, 1);
      helper.expectCheckboxInput('#allowAquatic', false, false);
      helper.expectCheckboxInput('#allowUnderground', false, false);

      for(let i = 0; i < fixture.componentInstance.encounterModel.creatureTypes.length; i++) {
        helper.expectCheckboxInput(`#${fixture.componentInstance.encounterModel.creatureTypes[i]}`, false, false);
      }

      helper.expectHasAttribute('#generateButton', 'disabled', false);
      helper.expectLoading('#encounterValidating', false, Size.Small);
    });
  
    it(`should show when validating encounter`, () => {
      const component = fixture.componentInstance;
      component.validating = true;

      fixture.detectChanges();

      helper.expectValidating(fixture.componentInstance.validating, '#generateButton', '#encounterValidating');
    });
  
    it(`should show that encounter is invalid - missing environment`, async () => {
      helper.setSelectByValue('#environment', '');

      fixture.detectChanges();

      expect(fixture.componentInstance.environment).toEqual('');
      helper.expectInvalid(fixture.componentInstance.validating, fixture.componentInstance.valid, '#generateButton', '#encounterValidating');
    });
  
    it(`should show that encounter is invalid - missing temperature`, async () => {
      helper.setSelectByValue('#temperature', '');

      fixture.detectChanges();

      expect(fixture.componentInstance.temperature).toEqual('');
      helper.expectInvalid(fixture.componentInstance.validating, fixture.componentInstance.valid, '#generateButton', '#encounterValidating');
    });
  
    it(`should show that encounter is invalid - missing time of day`, async () => {
      helper.setSelectByValue('#timeOfDay', '');

      fixture.detectChanges();

      expect(fixture.componentInstance.timeOfDay).toEqual('');
      helper.expectInvalid(fixture.componentInstance.validating, fixture.componentInstance.valid, '#generateButton', '#encounterValidating');
    });
  
    it(`should show that encounter is invalid - missing level`, async () => {
      helper.setInput('#level', '');

      fixture.detectChanges();

      expect(fixture.componentInstance.level).toBeNull();
      helper.expectInvalid(fixture.componentInstance.validating, fixture.componentInstance.valid, '#generateButton', '#encounterValidating');
    });
  
    it(`should show that encounter is invalid - level invalid`, () => {
      helper.setInput('#level', 'wrong');

      fixture.detectChanges();

      expect(fixture.componentInstance.level).toBeNull();
      helper.expectInvalid(fixture.componentInstance.validating, fixture.componentInstance.valid, '#generateButton', '#encounterValidating');
    });
  
    it(`should show that encounter is invalid - level too low`, () => {
      helper.setInput('#level', '0');

      fixture.detectChanges();

      expect(fixture.componentInstance.level).toEqual(0);
      helper.expectInvalid(fixture.componentInstance.validating, fixture.componentInstance.valid, '#generateButton', '#encounterValidating');
    });

    it(`should show that encounter is invalid - validation fails`, waitForAsync(async () => {
      helper.setCheckbox('#Ooze', true);
      
      fixture.detectChanges();

      const oozeFilter = fixture.componentInstance.creatureTypeFilters.find(f => f.name == "Ooze");
      expect(oozeFilter).toBeTruthy();
      expect(oozeFilter?.checked).toBeTrue();

      helper.expectValidating(fixture.componentInstance.validating, '#generateButton', '#encounterValidating');

      //run validation
      await helper.waitForService();
      
      expect(fixture.componentInstance.valid).toBeFalse();
      helper.expectInvalid(fixture.componentInstance.validating, fixture.componentInstance.valid, '#generateButton', '#encounterValidating');
    }));
  
    it(`should show that character is valid - validation succeeds`, async () => {
      helper.setCheckbox('#Ooze', true);
      helper.setCheckbox('#allowUnderground', true);
      helper.setInput('#level', '7');

      fixture.detectChanges();

      expect(fixture.componentInstance.allowUnderground).toBeTrue();
      expect(fixture.componentInstance.level).toEqual(7);

      const oozeFilter = fixture.componentInstance.creatureTypeFilters.find(f => f.name == "Ooze");
      expect(oozeFilter).toBeTruthy();
      expect(oozeFilter?.checked).toBeTrue();

      helper.expectValidating(fixture.componentInstance.validating, '#generateButton', '#encounterValidating');

      //run validation
      await helper.waitForService();

      helper.expectValid(fixture.componentInstance.validating, fixture.componentInstance.valid, '#generateButton', '#encounterValidating');
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
      expect(fixture.componentInstance.allowUnderground).toBeFalse();

      helper.clickCheckbox('#allowUnderground');

      fixture.detectChanges();
      expect(fixture.componentInstance.allowUnderground).toBeTrue();

      helper.clickCheckbox('#allowUnderground');

      fixture.detectChanges();
      expect(fixture.componentInstance.allowUnderground).toBeFalse();
    });

    for(let i = 0; i < expectedCreatureTypeCount; i++) {
      it(`should bind creature type filters - index ${i}`, () => {
        expect(fixture.componentInstance.creatureTypeFilters[i].checked).toBeFalse();
  
        helper.clickCheckbox(`#${fixture.componentInstance.creatureTypeFilters[i].name}`);
  
        fixture.detectChanges();
        expect(fixture.componentInstance.creatureTypeFilters[i].checked).toBeTrue();
  
        helper.clickCheckbox(`#${fixture.componentInstance.creatureTypeFilters[i].name}`);
  
        fixture.detectChanges();
        expect(fixture.componentInstance.creatureTypeFilters[i].checked).toBeFalse();
      });
    }
  
    it(`should show when generating an encounter`, () => {
      const component = fixture.componentInstance;
      component.generating = true;

      fixture.detectChanges();

      helper.expectGenerating(
        fixture.componentInstance.generating,
        '#generateButton', 
        '#encounterSection', 
        '#generatingSection dndgen-loading', 
        '#encounterValidating', 
        '#downloadButton');
    });
  
    it(`should generate the default encounter`, async () => {
      helper.clickButton('#generateButton');

      fixture.detectChanges();
      
      helper.expectGenerating(
        fixture.componentInstance.generating,
        '#generateButton', 
        '#encounterSection', 
        '#generatingSection dndgen-loading', 
        '#encounterValidating', 
        '#downloadButton');

      //run generate encounter
      await helper.waitForService();

      helper.expectGenerated(
        fixture.componentInstance.generating,
        '#generateButton', 
        '#encounterSection', 
        '#generatingSection dndgen-loading', 
        '#encounterValidating', 
        '#downloadButton');

      helper.expectExists('#noEncounter', false)
      helper.expectExists('#encounterSection > dndgen-encounter', true);
      helper.expectEncounter('#encounterSection > dndgen-encounter', true);
    });
  
    it(`should generate non-default encounter`, async () => {
      helper.setSelectByIndex('#environment', fixture.componentInstance.encounterModel.environments.indexOf('Mountain'));
      helper.setSelectByIndex('#temperature', fixture.componentInstance.encounterModel.temperatures.indexOf('Cold'));
      helper.setSelectByIndex('#timeOfDay', fixture.componentInstance.encounterModel.timesOfDay.indexOf('Night'));
      helper.setInput('#level', '10');
      helper.setCheckbox('#allowAquatic', true);
      helper.setCheckbox('#allowUnderground', true);
      helper.setCheckbox('#Dragon', true);
      helper.setCheckbox('#Giant', true);
      helper.setCheckbox('#Humanoid', true);
      
      fixture.detectChanges();

      expect(fixture.componentInstance.environment).toEqual('Mountain');
      expect(fixture.componentInstance.temperature).toEqual('Cold');
      expect(fixture.componentInstance.timeOfDay).toEqual('Night');
      expect(fixture.componentInstance.level).toEqual(10);
      expect(fixture.componentInstance.allowAquatic).toBeTrue();
      expect(fixture.componentInstance.allowUnderground).toBeTrue();

      const checkedfilters = getCheckedFilters();
      expect(checkedfilters).toEqual(['Dragon', 'Giant', 'Humanoid']);

      //run validation
      await helper.waitForService();

      helper.clickButton('#generateButton');

      fixture.detectChanges();
      
      helper.expectGenerating(
        fixture.componentInstance.generating,
        '#generateButton', 
        '#encounterSection', 
        '#generatingSection dndgen-loading', 
        '#encounterValidating', 
        '#downloadButton');

      //run generate encounter
      await helper.waitForService();

      helper.expectGenerated(
        fixture.componentInstance.generating,
        '#generateButton', 
        '#encounterSection', 
        '#generatingSection dndgen-loading', 
        '#encounterValidating', 
        '#downloadButton');

      helper.expectExists('#noEncounter', false)
      helper.expectExists('#encounterSection dndgen-character', true);
      helper.expectExists('#encounterSection dndgen-leadership', false);
      helper.expectCharacter('#encounterSection dndgen-character', true);
    });
    
    function getCheckedFilters(): string[] {
      var checkedFilters = [];
  
      for (var i = 0; i < fixture.componentInstance.creatureTypeFilters.length; i++) {
          if (fixture.componentInstance.creatureTypeFilters[i].checked) {
              checkedFilters.push(fixture.componentInstance.creatureTypeFilters[i].name);
          }
      }
  
      return checkedFilters;
    }
  
    it(`should render no encounter`, () => {
      helper.expectExists('#noEncounter', true);
      helper.expectExists('#encounterSection dndgen-character', false);
      helper.expectExists('#encounterSection dndgen-leadership', false);
    });
    
    it(`should render encounter`, () => {
      const encounter = new Encounter('my encounter description');
      fixture.componentInstance.encounter = encounter;

      fixture.detectChanges();

      helper.expectExists('#noEncounter', false);
      helper.expectExists('#encounterSection dndgen-encounter', true);
      helper.expectEncounter('#encounterSection dndgen-encounter', true, encounter);
      helper.expectExists('#encounterSection dndgen-leadership', false);
    });
    
    it(`should download encounter`, async () => {
      //Even for an integration test, we don't want to create an actual file
      let fileSaverSpy = spyOn(FileSaver, 'saveAs').and.stub();

      fixture.componentInstance.encounter = new Encounter('my encounter description');

      fixture.detectChanges();

      helper.clickButton('#downloadButton');

      expect(FileSaver.saveAs).toHaveBeenCalledWith(jasmine.any(Blob), 'my encounter description.txt');
        
      const blob = fileSaverSpy.calls.first().args[0] as Blob;
      const text = await blob.text();
      expect(text).toMatch(/^my encounter description:[\r\n]+[\S\s]+[\r\n\s]+$/);
    });
  });
});
