import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { RollGenComponent } from './rollgen.component';
import { AppModule } from '../../app.module';
import { RollService } from '../services/roll.service';
import { SweetAlertService } from '../../shared/services/sweetAlert.service';
import { LoggerService } from '../../shared/services/logger.service';
import { Observable } from 'rxjs';
import { RollGenViewModel } from '../models/rollgenViewModel.model';
import { By } from '@angular/platform-browser';
import { LoadingComponent } from '../../shared/components/loading.component';

describe('RollGenComponent', () => {
  describe('unit', () => {
    let component: RollGenComponent;
    let rollServiceSpy: jasmine.SpyObj<RollService>;
    let sweetAlertServiceSpy: jasmine.SpyObj<SweetAlertService>;
    let loggerServiceSpy: jasmine.SpyObj<LoggerService>;

    const delay = 10;
  
    beforeEach(() => {
      rollServiceSpy = jasmine.createSpyObj('RollService', ['getViewModel', 'getRoll', 'validateRoll', 'getExpressionRoll', 'validateExpression']);
      sweetAlertServiceSpy = jasmine.createSpyObj('SweetAlertService', ['showError']);
      loggerServiceSpy = jasmine.createSpyObj('LoggerService', ['logError']);

      component = new RollGenComponent(rollServiceSpy, sweetAlertServiceSpy, loggerServiceSpy);
    });
  
    it(`should initialize the public properties`, () => {
      expect(component.rolling).toEqual(false);
      expect(component.loading).toEqual(false);
      expect(component.validating).toEqual(false);
      expect(component.rollIsValid).toEqual(true);
      expect(component.roll).toEqual(0);
      expect(component.standardDice.length).toEqual(9);
      expect(component.standardDice[0].die).toEqual(2);
      expect(component.standardDice[0].name).toEqual('2');
      expect(component.standardDice[1].die).toEqual(3);
      expect(component.standardDice[1].name).toEqual('3');
      expect(component.standardDice[2].die).toEqual(4);
      expect(component.standardDice[2].name).toEqual('4');
      expect(component.standardDice[3].die).toEqual(6);
      expect(component.standardDice[3].name).toEqual('6');
      expect(component.standardDice[4].die).toEqual(8);
      expect(component.standardDice[4].name).toEqual('8');
      expect(component.standardDice[5].die).toEqual(10);
      expect(component.standardDice[5].name).toEqual('10');
      expect(component.standardDice[6].die).toEqual(12);
      expect(component.standardDice[6].name).toEqual('12');
      expect(component.standardDice[7].die).toEqual(20);
      expect(component.standardDice[7].name).toEqual('20');
      expect(component.standardDice[8].die).toEqual(100);
      expect(component.standardDice[8].name).toEqual('Percentile');
    });
  
    it(`should initialize the input values`, () => {
      expect(component.standardQuantity).toEqual(1);
      expect(component.standardDie).toEqual(component.standardDice[7]);
      expect(component.customQuantity).toEqual(1);
      expect(component.customDie).toEqual(5);
      expect(component.expression).toEqual('4d6k3+2');
    });

    it('should be loading while fetching the roll model', fakeAsync(() => {
      const model = new RollGenViewModel(9266, 90210, 42, 600);
      rollServiceSpy.getViewModel.and.callFake(() => getFakeDelay(model));

      component.ngOnInit();

      expect(component.rollModel).not.toBeDefined();
      expect(component.loading).toBeTrue();
      
      tick(delay / 2);

      expect(component.rollModel).not.toBeDefined();
      expect(component.loading).toBeTrue();

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

    it('should set the roll model on init', fakeAsync(() => {
      const model = new RollGenViewModel(9266, 90210, 42, 600);
      rollServiceSpy.getViewModel.and.callFake(() => getFakeDelay(model));

      component.ngOnInit();

      expect(component.rollModel).not.toBeDefined();
      expect(component.loading).toBeTrue();

      tick(delay);

      expect(component.rollModel).toEqual(model);
      expect(component.loading).toBeFalse();
    }));

    it('should display error from getting roll model', fakeAsync(() => {
      rollServiceSpy.getViewModel.and.callFake(() => getFakeError('I failed'));

      component.ngOnInit();
      tick(delay);

      expect(component.rollModel).not.toBeDefined();
      expect(component.roll).toEqual(0);
      expect(component.rolling).toBeFalse();
      expect(component.loading).toBeFalse();
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

    it('should validate a roll - invalid if no quantity', () => {
      component.validateRoll(0, 90210);
      expect(component.validating).toBeFalse();
      expect(component.rollIsValid).toBeFalse();
    });

    it('should validate a roll - invalid if no die', () => {
      component.validateRoll(9266, 0);
      expect(component.validating).toBeFalse();
      expect(component.rollIsValid).toBeFalse();
    });

    it('should be validating while validating the roll', fakeAsync(() => {
      rollServiceSpy.validateRoll.and.callFake(() => getFakeDelay(true));

      component.validateRoll(9266, 90210);

      expect(rollServiceSpy.validateRoll).toHaveBeenCalledWith(9266, 90210);
      expect(component.validating).toBeTrue();
      
      tick(delay / 2);

      expect(component.validating).toBeTrue();

      flush();
    }));

    it('should validate a valid roll', fakeAsync(() => {
      rollServiceSpy.validateRoll.and.callFake(() => getFakeDelay(true));

      component.validateRoll(9266, 90210);

      expect(rollServiceSpy.validateRoll).toHaveBeenCalledWith(9266, 90210);
      expect(component.validating).toBeTrue();

      tick(delay);

      expect(component.rollIsValid).toBeTrue();
      expect(component.validating).toBeFalse();
    }));

    it('should validate an invalid roll', fakeAsync(() => {
      rollServiceSpy.validateRoll.and.callFake(() => getFakeDelay(false));

      component.validateRoll(9266, 90210);

      expect(rollServiceSpy.validateRoll).toHaveBeenCalledWith(9266, 90210);
      expect(component.validating).toBeTrue();

      tick(delay);

      expect(component.rollIsValid).toBeFalse();
      expect(component.validating).toBeFalse();
    }));

    it('should display error from validating roll', fakeAsync(() => {
      rollServiceSpy.validateRoll.and.callFake(() => getFakeError('I failed'));

      component.validateRoll(9266, 90210);
      tick(delay);

      expect(component.rollIsValid).toBeFalse();
      expect(component.roll).toEqual(0);
      expect(component.rolling).toBeFalse();
      expect(component.loading).toBeFalse();
      expect(component.validating).toBeFalse();
      
      expect(rollServiceSpy.validateRoll).toHaveBeenCalledWith(9266, 90210);
      expect(loggerServiceSpy.logError).toHaveBeenCalledWith('I failed');
      expect(sweetAlertServiceSpy.showError).toHaveBeenCalledTimes(1);
    }));

    it('should be rolling while rolling a standard roll', fakeAsync(() => {
      rollServiceSpy.getRoll.and.callFake(() => getFakeDelay(90210));

      component.rollStandard();

      expect(rollServiceSpy.getRoll).toHaveBeenCalledWith(1, 20);
      expect(component.rolling).toBeTrue();
      
      tick(delay / 2);

      expect(component.rolling).toBeTrue();

      flush();
    }));

    it('should roll the default standard roll', fakeAsync(() => {
      rollServiceSpy.getRoll.and.callFake(() => getFakeDelay(90210));

      component.rollStandard();

      expect(rollServiceSpy.getRoll).toHaveBeenCalledWith(1, 20);
      expect(component.rolling).toBeTrue();

      tick(delay);

      expect(component.roll).toBe(90210);
      expect(component.rolling).toBeFalse();
    }));

    const standardDieIndicesTestCases = Array.from(Array(9).keys());

    standardDieIndicesTestCases.forEach(test => {
      it(`should roll a non-default standard roll - standard die index ${test}`, fakeAsync(() => {
        rollServiceSpy.getRoll.and.callFake(() => getFakeDelay(90210));
  
        component.standardQuantity = 9266;
        component.standardDie = component.standardDice[test];
  
        component.rollStandard();
  
        expect(rollServiceSpy.getRoll).toHaveBeenCalledWith(9266, component.standardDice[test].die);
        expect(component.rolling).toBeTrue();
  
        tick(delay);
  
        expect(component.roll).toBe(90210);
        expect(component.rolling).toBeFalse();
      }));
    });

    it('should display error from rolling a standard roll', fakeAsync(() => {
      rollServiceSpy.getRoll.and.callFake(() => getFakeError('I failed'));

      component.rollStandard();
      tick(delay);

      expect(component.roll).toEqual(0);
      expect(component.rolling).toBeFalse();
      expect(component.loading).toBeFalse();
      expect(component.validating).toBeFalse();
      
      expect(rollServiceSpy.getRoll).toHaveBeenCalledWith(1, 20);
      expect(loggerServiceSpy.logError).toHaveBeenCalledWith('I failed');
      expect(sweetAlertServiceSpy.showError).toHaveBeenCalledTimes(1);
    }));

    it('should be rolling while rolling a custom roll', fakeAsync(() => {
      rollServiceSpy.getRoll.and.callFake(() => getFakeDelay(90210));

      component.rollCustom();

      expect(rollServiceSpy.getRoll).toHaveBeenCalledWith(1, 5);
      expect(component.rolling).toBeTrue();
      
      tick(delay / 2);

      expect(component.rolling).toBeTrue();

      flush();
    }));

    it('should roll the default custom roll', fakeAsync(() => {
      rollServiceSpy.getRoll.and.callFake(() => getFakeDelay(90210));

      component.rollCustom();

      expect(rollServiceSpy.getRoll).toHaveBeenCalledWith(1, 5);
      expect(component.rolling).toBeTrue();

      tick(delay);

      expect(component.roll).toBe(90210);
      expect(component.rolling).toBeFalse();
    }));

    it(`should roll a non-default custom roll`, fakeAsync(() => {
      rollServiceSpy.getRoll.and.callFake(() => getFakeDelay(90210));

      component.customQuantity = 9266;
      component.customDie = 42;

      component.rollCustom();

      expect(rollServiceSpy.getRoll).toHaveBeenCalledWith(9266, 42);
      expect(component.rolling).toBeTrue();

      tick(delay);

      expect(component.roll).toBe(90210);
      expect(component.rolling).toBeFalse();
    }));

    it('should display error from rolling a custom roll', fakeAsync(() => {
      rollServiceSpy.getRoll.and.callFake(() => getFakeError('I failed'));

      component.rollCustom();
      tick(delay);

      expect(component.roll).toEqual(0);
      expect(component.rolling).toBeFalse();
      expect(component.loading).toBeFalse();
      expect(component.validating).toBeFalse();
      
      expect(rollServiceSpy.getRoll).toHaveBeenCalledWith(1, 5);
      expect(loggerServiceSpy.logError).toHaveBeenCalledWith('I failed');
      expect(sweetAlertServiceSpy.showError).toHaveBeenCalledTimes(1);
    }));

    it('should validate a expression - invalid if empty', () => {
      component.validateExpression('');
      expect(component.validating).toBeFalse();
      expect(component.rollIsValid).toBeFalse();
    });

    it('should be validating while validating the expression', fakeAsync(() => {
      rollServiceSpy.validateExpression.and.callFake(() => getFakeDelay(true));

      component.validateExpression('my expression');

      expect(rollServiceSpy.validateExpression).toHaveBeenCalledWith('my expression');
      expect(component.validating).toBeTrue();
      
      tick(delay / 2);

      expect(component.validating).toBeTrue();

      flush();
    }));

    it('should validate a valid expression', fakeAsync(() => {
      rollServiceSpy.validateExpression.and.callFake(() => getFakeDelay(true));

      component.validateExpression('my expression');

      expect(rollServiceSpy.validateExpression).toHaveBeenCalledWith('my expression');
      expect(component.validating).toBeTrue();

      tick(delay);

      expect(component.rollIsValid).toBeTrue();
      expect(component.validating).toBeFalse();
    }));

    it('should validate an invalid expression', fakeAsync(() => {
      rollServiceSpy.validateExpression.and.callFake(() => getFakeDelay(false));

      component.validateExpression('my expression');

      expect(rollServiceSpy.validateExpression).toHaveBeenCalledWith('my expression');
      expect(component.validating).toBeTrue();

      tick(delay);

      expect(component.rollIsValid).toBeFalse();
      expect(component.validating).toBeFalse();
    }));

    it('should display error from validating expression', fakeAsync(() => {
      rollServiceSpy.validateExpression.and.callFake(() => getFakeError('I failed'));

      component.validateExpression('my expression');
      tick(delay);

      expect(component.rollIsValid).toBeFalse();
      expect(component.roll).toEqual(0);
      expect(component.rolling).toBeFalse();
      expect(component.loading).toBeFalse();
      expect(component.validating).toBeFalse();
      
      expect(rollServiceSpy.validateExpression).toHaveBeenCalledWith('my expression');
      expect(loggerServiceSpy.logError).toHaveBeenCalledWith('I failed');
      expect(sweetAlertServiceSpy.showError).toHaveBeenCalledTimes(1);
    }));

    it('should be rolling while rolling an expression', fakeAsync(() => {
      rollServiceSpy.getExpressionRoll.and.callFake(() => getFakeDelay(90210));

      component.rollExpression();

      expect(rollServiceSpy.getExpressionRoll).toHaveBeenCalledWith('4d6k3+2');
      expect(component.rolling).toBeTrue();
      
      tick(delay / 2);

      expect(component.rolling).toBeTrue();

      flush();
    }));

    it('should roll the default expression', fakeAsync(() => {
      rollServiceSpy.getExpressionRoll.and.callFake(() => getFakeDelay(90210));

      component.rollExpression();

      expect(rollServiceSpy.getExpressionRoll).toHaveBeenCalledWith('4d6k3+2');
      expect(component.rolling).toBeTrue();

      tick(delay);

      expect(component.roll).toBe(90210);
      expect(component.rolling).toBeFalse();
    }));

    it(`should roll a non-default expression`, fakeAsync(() => {
      rollServiceSpy.getExpressionRoll.and.callFake(() => getFakeDelay(90210));

      component.expression = 'my custom expression';

      component.rollExpression();

      expect(rollServiceSpy.getExpressionRoll).toHaveBeenCalledWith('my custom expression');
      expect(component.rolling).toBeTrue();

      tick(delay);

      expect(component.roll).toBe(90210);
      expect(component.rolling).toBeFalse();
    }));

    it('should display error from rolling an expression', fakeAsync(() => {
      rollServiceSpy.getExpressionRoll.and.callFake(() => getFakeError('I failed'));

      component.rollExpression();
      tick(delay);

      expect(component.roll).toEqual(0);
      expect(component.rolling).toBeFalse();
      expect(component.loading).toBeFalse();
      expect(component.validating).toBeFalse();
      
      expect(rollServiceSpy.getExpressionRoll).toHaveBeenCalledWith('4d6k3+2');
      expect(loggerServiceSpy.logError).toHaveBeenCalledWith('I failed');
      expect(sweetAlertServiceSpy.showError).toHaveBeenCalledTimes(1);
    }));
  });

  describe('integration', () => {
    let fixture: ComponentFixture<RollGenComponent>;
  
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [
          AppModule
        ],
      }).compileComponents();
  
      fixture = TestBed.createComponent(RollGenComponent);
      
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
  
    it(`should set the roll model on init`, () => {
      const component = fixture.componentInstance;
      expect(component.rollModel).toBeDefined();
      expect(component.rollModel.quantityLimit_Lower).toEqual(1);
      expect(component.rollModel.quantityLimit_Upper).toEqual(10000);
      expect(component.rollModel.dieLimit_Lower).toEqual(1);
      expect(component.rollModel.dieLimit_Upper).toEqual(10000);
    });
  
    it(`should render the tabs`, () => {
      const compiled = fixture.nativeElement as HTMLElement;
  
      const tabLinks = compiled.querySelectorAll('ul.nav-tabs > li > a.nav-link');
      expect(tabLinks).toBeDefined();
      expect(tabLinks?.length).toEqual(3);
      expect(tabLinks?.item(0).textContent).toEqual('Standard');
      expect(tabLinks?.item(0).getAttribute('class')).toContain('active');
      expect(tabLinks?.item(0).getAttribute('href')).toEqual('#standard');
      expect(tabLinks?.item(1).textContent).toEqual('Custom');
      expect(tabLinks?.item(1).getAttribute('class')).not.toContain('active');
      expect(tabLinks?.item(1).getAttribute('href')).toEqual('#custom');
      expect(tabLinks?.item(2).textContent).toEqual('Expression');
      expect(tabLinks?.item(2).getAttribute('class')).not.toContain('active');
      expect(tabLinks?.item(2).getAttribute('href')).toEqual('#expression');
    });

    function expectValidating(buttonSelector: string, validatingSelector: string) {
      expectHasAttribute(buttonSelector, 'disabled', true);
      expectHasAttribute(validatingSelector, 'hidden', false);
    }

    function expectRolling(buttonSelector: string, validatingSelector: string) {
      expectHasAttribute(buttonSelector, 'disabled', true);
      expectHasAttribute(validatingSelector, 'hidden', true);
      expectHasAttribute('#rollSection', 'hidden', true);
      expectHasAttribute('#rollingSection', 'hidden', false);
    }

    function expectHasAttribute(selector: string, attribute: string, hasAttribute: boolean) {
      const compiled = fixture.nativeElement as HTMLElement;

      const validatingSection = compiled!.querySelector(selector);
      expect(validatingSection).toBeDefined();
      expect(validatingSection?.hasAttribute(attribute)).toBe(hasAttribute);
    }

    function expectRolled(buttonSelector: string, validatingSelector: string) {
      expectHasAttribute(buttonSelector, 'disabled', false);
      expectHasAttribute(validatingSelector, 'hidden', true);
      expectHasAttribute('#rollSection', 'hidden', false);
      expectHasAttribute('#rollingSection', 'hidden', true);
    }

    function expectInvalid(buttonSelector: string, validatingSelector: string) {
      expectHasAttribute(buttonSelector, 'disabled', true);
      expectHasAttribute(validatingSelector, 'hidden', true);
    }

    function expectValid(buttonSelector: string, validatingSelector: string) {
      expectHasAttribute(buttonSelector, 'disabled', false);
      expectHasAttribute(validatingSelector, 'hidden', true);
    }

    function setInput(selector: string, value: string) {
      const compiled = fixture.nativeElement as HTMLElement;
      const input = compiled!.querySelector(selector) as HTMLInputElement;
      input.value = value;

      input.dispatchEvent(new Event('input'));
    }

    function setSelectByValue(selector: string, value: string) {
      const compiled = fixture.nativeElement as HTMLElement;
      const select = compiled!.querySelector(selector) as HTMLSelectElement;
      select.value = value;

      select.dispatchEvent(new Event('change'));
    }

    function setSelectByIndex(selector: string, index: number) {
      const compiled = fixture.nativeElement as HTMLElement;
      const select = compiled!.querySelector(selector) as HTMLSelectElement;
      select.value = select.options[index].value;

      select.dispatchEvent(new Event('change'));
    }

    function clickButton(selector: string) {
      expectHasAttribute(selector, 'disabled', false);

      const compiled = fixture.nativeElement as HTMLElement;
      const button = compiled!.querySelector(selector) as HTMLButtonElement;

      button.click();
    }

    describe('the standard tab', () => {
      it(`should render the standard tab`, () => {
        const compiled = fixture.nativeElement as HTMLElement;
  
        const standardTab = compiled.querySelector('#standard');
        expect(standardTab).toBeDefined();
        
        const standardQuantityInput = standardTab!.querySelector('#standardQuantity') as HTMLInputElement;
        expect(standardQuantityInput).toBeDefined();
        expect(standardQuantityInput?.value).toEqual('1');
        expect(standardQuantityInput?.getAttribute('type')).toEqual('number');
        expect(standardQuantityInput?.getAttribute('min')).toEqual('1');
        expect(standardQuantityInput?.getAttribute('max')).toEqual('10000');
        expect(standardQuantityInput?.getAttribute('pattern')).toEqual('^[0-9]+$');
        expectHasAttribute('#standardQuantity', 'required', true);

        const standardDieSelect = standardTab!.querySelector('#standardDie');
        expect(standardDieSelect).toBeDefined();
        expectHasAttribute('#standardDie', 'required', true);
  
        const selectedStandardRoll = standardTab!.querySelector('#standardDie > option:checked');
        expect(selectedStandardRoll).toBeDefined();
        expect(selectedStandardRoll?.textContent).toEqual('20');
  
        const standardDieOptions = standardTab!.querySelectorAll('#standardDie > option');
        expect(standardDieOptions).toBeDefined();
        expect(standardDieOptions?.length).toEqual(9);
        expect(standardDieOptions?.item(0).textContent).toEqual('2');
        expect(standardDieOptions?.item(1).textContent).toEqual('3');
        expect(standardDieOptions?.item(2).textContent).toEqual('4');
        expect(standardDieOptions?.item(3).textContent).toEqual('6');
        expect(standardDieOptions?.item(4).textContent).toEqual('8');
        expect(standardDieOptions?.item(5).textContent).toEqual('10');
        expect(standardDieOptions?.item(6).textContent).toEqual('12');
        expect(standardDieOptions?.item(7).textContent).toEqual('20');
        expect(standardDieOptions?.item(8).textContent).toEqual('Percentile');
  
        expectHasAttribute('#standardRollButton', 'disabled', false);
        expectHasAttribute('#standardValidating', 'hidden', true);
      });
    
      it(`should show when validating a standard roll`, () => {
        const component = fixture.componentInstance;
        component.validating = true;
  
        fixture.detectChanges();

        expectValidating('#standardRollButton', '#standardValidating');
      });
    
      it(`should show that a standard roll is invalid - missing standard quantity`, () => {
        setInput('#standardQuantity', '');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.standardQuantity).toBeNull();
        expectInvalid('#standardRollButton', '#standardValidating');
      });
    
      it(`should show that a standard roll is invalid - standard quantity invalid`, () => {
        setInput('#standardQuantity', 'wrong');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.standardQuantity).toBeNull();
        expectInvalid('#standardRollButton', '#standardValidating');
      });
    
      it(`should show that a standard roll is invalid - standard quantity too low`, () => {
        setInput('#standardQuantity', '0');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.standardQuantity).toEqual(0);
        expectInvalid('#standardRollButton', '#standardValidating');
      });
    
      it(`should show that a standard roll is invalid - standard quantity too high`, async () => {
        setInput('#standardQuantity', '10001');
  
        fixture.detectChanges();

        expect(fixture.componentInstance.standardQuantity).toEqual(10001);
        expectValidating('#standardRollButton', '#standardValidating');
  
        //run roll validation
        await waitForService();
  
        expectInvalid('#standardRollButton', '#standardValidating');
      });
    
      const standardQuantityTestCases = [1, 2, 10, 20, 100, 1000, 10000];

      standardQuantityTestCases.forEach(test => {
        it(`should show that a standard roll is valid - standard quantity ${test}`, async () => {
          setInput('#standardQuantity', test.toString());
    
          fixture.detectChanges();
    
          expect(fixture.componentInstance.standardQuantity).toEqual(test);
          expectValidating('#standardRollButton', '#standardValidating');
    
          //run roll validation
          await waitForService();
    
          expectValid('#standardRollButton', '#standardValidating');
        });
      });
    
      it(`should show that a standard roll is invalid - missing standard die`, () => {
        setSelectByValue('#standardDie', '');
  
        fixture.detectChanges();
  
        expectInvalid('#standardRollButton', '#standardValidating');
      });
    
      it('should validate a standard roll when standard die changes', async () => {
        setSelectByIndex('#standardDie', 1);
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.standardDie).toEqual(fixture.componentInstance.standardDice[1]);
        expectValidating('#standardRollButton', '#standardValidating');

        await waitForService();
        
        expectValid('#standardRollButton', '#standardValidating');
      });

      const standardDieIndicesTestCases = Array.from(Array(9).keys());

      standardDieIndicesTestCases.forEach(test => {
        it(`should show that a standard roll is valid - non-default standard die index ${test}`, async () => {
          setSelectByIndex('#standardDie', test);
    
          fixture.detectChanges();
    
          expect(fixture.componentInstance.standardDie).toEqual(fixture.componentInstance.standardDice[test]);
          expectValidating('#standardRollButton', '#standardValidating');

          await waitForService();

          expectValid('#standardRollButton', '#standardValidating');
        });
      });

      it(`should show that a standard roll is invalid - validation fails`, async () => {
        setInput('#standardQuantity', '66666');
        setSelectByIndex('#standardDie', 4);
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.standardDie).toEqual(fixture.componentInstance.standardDice[4]);
        expectValidating('#standardRollButton', '#standardValidating');
  
        //run roll validation
        await waitForService();

        expectInvalid('#standardRollButton', '#standardValidating');
      });
    
      it(`should show that a standard roll is valid - validation succeeds`, async () => {
        setInput('#standardQuantity', '9266');
        setSelectByIndex('#standardDie', 5);
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.standardDie).toEqual(fixture.componentInstance.standardDice[5]);
        expectValidating('#standardRollButton', '#standardValidating');
  
        //run roll validation
        await waitForService();
  
        expectValid('#standardRollButton', '#standardValidating');
      });
    
      it(`should show when rolling a standard roll`, () => {
        const component = fixture.componentInstance;
        component.rolling = true;
  
        fixture.detectChanges();

        expectRolling('#standardRollButton', '#standardValidating');
      });
    
      it(`should roll the default standard roll`, async () => {
        clickButton('#standardRollButton');
  
        fixture.detectChanges();
        
        expectRolling('#standardRollButton', '#standardValidating');

        //run roll
        await waitForService();
  
        expectRolled('#standardRollButton', '#standardValidating');

        const compiled = fixture.nativeElement as HTMLElement;
        const rollSection = compiled.querySelector('#rollSection');
        const rolledNumber = new Number(rollSection?.textContent);
        expect(rolledNumber).toBeGreaterThanOrEqual(1);
        expect(rolledNumber).toBeLessThanOrEqual(20);
      });
    
      it(`should roll a non-default standard roll`, async () => {
        setInput('#standardQuantity', '42');
        setSelectByIndex('#standardDie', 2);
  
        fixture.detectChanges();

        expect(fixture.componentInstance.standardQuantity).toEqual(42);
        expect(fixture.componentInstance.standardDie).toEqual(fixture.componentInstance.standardDice[2]);

        //run validation
        await waitForService();

        clickButton('#standardRollButton');
  
        fixture.detectChanges();
        
        expectRolling('#standardRollButton', '#standardValidating');

        //run roll
        await waitForService();
  
        expectRolled('#standardRollButton', '#standardValidating');

        const compiled = fixture.nativeElement as HTMLElement;
        const rollSection = compiled.querySelector('#rollSection');
        const rolledNumber = new Number(rollSection?.textContent);
        expect(rolledNumber).toBeGreaterThanOrEqual(42);
        expect(rolledNumber).toBeLessThanOrEqual(42 * 4);
      });
    });
  
    describe('the custom tab', () => {
      it(`should render the custom tab`, () => {
        const compiled = fixture.nativeElement as HTMLElement;
  
        const customTab = compiled.querySelector('#custom');
        expect(customTab).toBeDefined();
  
        const customQuantityInput = customTab!.querySelector('#customQuantity') as HTMLInputElement;
        expect(customQuantityInput).toBeDefined();
        expect(customQuantityInput?.value).toEqual('1');
        expect(customQuantityInput?.getAttribute('type')).toEqual('number');
        expect(customQuantityInput?.getAttribute('min')).toEqual('1');
        expect(customQuantityInput?.getAttribute('max')).toEqual('10000');
        expect(customQuantityInput?.getAttribute('pattern')).toEqual('^[0-9]+$');
        expectHasAttribute('#customQuantity', 'required', true);
  
        const customDieInput = customTab!.querySelector('#customDie') as HTMLInputElement;
        expect(customDieInput).toBeDefined();
        expect(customDieInput?.value).toEqual('5');
        expect(customDieInput?.getAttribute('type')).toEqual('number');
        expect(customDieInput?.getAttribute('min')).toEqual('1');
        expect(customDieInput?.getAttribute('max')).toEqual('10000');
        expect(customDieInput?.getAttribute('pattern')).toEqual('^[0-9]+$');
        expectHasAttribute('#customDie', 'required', true);
  
        expectHasAttribute('#customRollButton', 'disabled', false);
        expectHasAttribute('#customValidating', 'hidden', true);
      });
    
      it(`should show when validating a custom roll`, () => {
        const component = fixture.componentInstance;
        component.validating = true;
  
        fixture.detectChanges();

        expectValidating('#customRollButton', '#customValidating');
      });
    
      it(`should show that a custom roll is invalid - missing custom quantity`, () => {
        setInput('#customQuantity', '');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.customQuantity).toBeNull();
        expectInvalid('#customRollButton', '#customValidating');
      });
    
      it(`should show that a custom roll is invalid - custom quantity invalid`, () => {
        setInput('#customQuantity', 'wrong');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.customQuantity).toBeNull();
        expectInvalid('#customRollButton', '#customValidating');
      });
    
      it(`should show that a custom roll is invalid - custom quantity too low`, () => {
        setInput('#customQuantity', '0');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.customQuantity).toEqual(0);
        expectInvalid('#customRollButton', '#customValidating');
      });
    
      it(`should show that a custom roll is invalid - custom quantity too high`, async () => {
        setInput('#customQuantity', '10001');
  
        fixture.detectChanges();

        expect(fixture.componentInstance.customQuantity).toEqual(10001);
        expectValidating('#customRollButton', '#customValidating');
  
        //run roll validation
        await waitForService();
  
        expectInvalid('#customRollButton', '#customValidating');
      });
    
      const validCustomInputTestCases = [1, 2, 10, 20, 100, 1000, 10000];

      validCustomInputTestCases.forEach(test => {
        it(`should show that a custom roll is valid - custom quantity ${test}`, async () => {
          setInput('#customQuantity', test.toString());
    
          fixture.detectChanges();
    
          expect(fixture.componentInstance.customQuantity).toEqual(test);
          expectValidating('#customRollButton', '#customValidating');
    
          //run roll validation
          await waitForService();
    
          expectValid('#customRollButton', '#customValidating');
        });
      });
    
      it(`should show that a custom roll is invalid - missing custom die`, () => {
        setInput('#customDie', '');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.customDie).toBeNull();
        expectInvalid('#customRollButton', '#customValidating');
      });
    
      it(`should show that a custom roll is invalid - custom die invalid`, () => {
        setInput('#customDie', 'wrong');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.customDie).toBeNull();
        expectInvalid('#customRollButton', '#customValidating');
      });
    
      it(`should show that a custom roll is invalid - custom die too low`, () => {
        setInput('#customDie', '0');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.customDie).toEqual(0);
        expectInvalid('#customRollButton', '#customValidating');
      });
    
      it(`should show that a custom roll is invalid - custom die too high`, async () => {
        setInput('#customDie', '10001');
  
        fixture.detectChanges();

        expect(fixture.componentInstance.customDie).toEqual(10001);
        expectValidating('#customRollButton', '#customValidating');
  
        //run roll validation
        await waitForService();
  
        expectInvalid('#customRollButton', '#customValidating');
      });
    
      validCustomInputTestCases.forEach(test => {
        it(`should show that a custom roll is valid - custom die ${test}`, async () => {
          setInput('#customDie', test.toString());
    
          fixture.detectChanges();
    
          expect(fixture.componentInstance.customDie).toEqual(test);
          expectValidating('#customRollButton', '#customValidating');
    
          //run roll validation
          await waitForService();
    
          expectValid('#customRollButton', '#customValidating');
        });
      });

      it(`should show that a custom roll is invalid - validation fails`, async () => {
        setInput('#customQuantity', '66666');
        setInput('#customDie', '666666');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.customQuantity).toEqual(66666);
        expect(fixture.componentInstance.customDie).toEqual(666666);
        expectValidating('#customRollButton', '#customValidating');
  
        //run roll validation
        await waitForService();

        expectInvalid('#customRollButton', '#customValidating');
      });
    
      it(`should show that a custom roll is valid - validation succeeds`, async () => {
        setInput('#customQuantity', '9266');
        setInput('#customDie', '42');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.customQuantity).toEqual(9266);
        expect(fixture.componentInstance.customDie).toEqual(42);
        expectValidating('#customRollButton', '#customValidating');
  
        //run roll validation
        await waitForService();
  
        expectValid('#customRollButton', '#customValidating');
      });
    
      it(`should show when rolling a custom roll`, () => {
        const component = fixture.componentInstance;
        component.rolling = true;
  
        fixture.detectChanges();

        expectRolling('#customRollButton', '#customValidating');
      });
    
      it(`should roll the default custom roll`, async () => {
        clickButton('#customRollButton');
  
        fixture.detectChanges();
        
        expectRolling('#customRollButton', '#customValidating');

        //run roll
        await waitForService();
  
        expectRolled('#customRollButton', '#customValidating');

        const compiled = fixture.nativeElement as HTMLElement;
        const rollSection = compiled.querySelector('#rollSection');
        const rolledNumber = new Number(rollSection?.textContent);
        expect(rolledNumber).toBeGreaterThanOrEqual(1);
        expect(rolledNumber).toBeLessThanOrEqual(5);
      });
    
      it(`should roll a non-default custom roll`, async () => {
        setInput('#customQuantity', '42');
        setInput('#customDie', '7');
  
        fixture.detectChanges();

        expect(fixture.componentInstance.customQuantity).toEqual(42);
        expect(fixture.componentInstance.customDie).toEqual(7);

        //run validation
        await waitForService();

        clickButton('#customRollButton');
  
        fixture.detectChanges();
        
        expectRolling('#customRollButton', '#customValidating');

        //run roll
        await waitForService();
  
        expectRolled('#customRollButton', '#customValidating');

        const compiled = fixture.nativeElement as HTMLElement;
        const rollSection = compiled.querySelector('#rollSection');
        const rolledNumber = new Number(rollSection?.textContent);
        expect(rolledNumber).toBeGreaterThanOrEqual(42);
        expect(rolledNumber).toBeLessThanOrEqual(42 * 7);
      });
    });
  
    describe('the expression tab', () => {
      it(`should render the expression tab`, () => {
        const compiled = fixture.nativeElement as HTMLElement;
  
        const expressionTab = compiled.querySelector('#expression');
        expect(expressionTab).toBeTruthy();
  
        const expressionInput = expressionTab!.querySelector('#rollExpression') as HTMLInputElement;
        expect(expressionInput).toBeDefined();
        expect(expressionInput?.value).toEqual('4d6k3+2');
        expect(expressionInput?.getAttribute('type')).toEqual('text');
        expectHasAttribute('#rollExpression', 'required', true);
  
        expectHasAttribute('#expressionRollButton', 'disabled', false);
        expectHasAttribute('#expressionValidating', 'hidden', true);
      });
    
      it(`should show when validating an expression`, () => {
        const component = fixture.componentInstance;
        component.validating = true;
  
        fixture.detectChanges();

        expectValidating('#expressionRollButton', '#expressionValidating');
      });
    
      it(`should show that an expression is invalid - empty`, () => {
        setInput('#rollExpression', '');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.expression).toEqual('');
        expectInvalid('#expressionRollButton', '#expressionValidating');
      });
    
      it(`should show that an expression is invalid - invalid syntax`, async () => {
        setInput('#rollExpression', 'wrong+invalid');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.expression).toEqual('wrong+invalid');
        expectValidating('#expressionRollButton', '#expressionValidating');
  
        //run roll validation
        await waitForService();
  
        expectInvalid('#expressionRollButton', '#expressionValidating');
      });
    
      it(`should show that an expression is invalid - too high`, async () => {
        setInput('#rollExpression', '1000d100d2');
  
        fixture.detectChanges();

        expect(fixture.componentInstance.expression).toEqual('1000d100d2');
        expectValidating('#expressionRollButton', '#expressionValidating');
  
        //run roll validation
        await waitForService();
  
        expectInvalid('#expressionRollButton', '#expressionValidating');
      });
    
      it(`should show that an expression is valid`, async () => {
        setInput('#rollExpression', '100d100d2');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.expression).toEqual('100d100d2');
        expectValidating('#expressionRollButton', '#expressionValidating');
  
        //run roll validation
        await waitForService();
  
        expectValid('#expressionRollButton', '#expressionValidating');
      });

      it(`should show that an expression is invalid - validation fails`, async () => {
        setInput('#rollExpression', '3d6t1-x');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.expression).toEqual('3d6t1-x');
        expectValidating('#expressionRollButton', '#expressionValidating');
  
        //run roll validation
        await waitForService();

        expectInvalid('#expressionRollButton', '#expressionValidating');
      });
    
      it(`should show that an expression is valid - validation succeeds`, async () => {
        setInput('#rollExpression', '3d6t1-2');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.expression).toEqual('3d6t1-2');
        expectValidating('#expressionRollButton', '#expressionValidating');
  
        //run roll validation
        await waitForService();
  
        expectValid('#expressionRollButton', '#expressionValidating');
      });
    
      it(`should show when rolling an expression`, () => {
        const component = fixture.componentInstance;
        component.rolling = true;
  
        fixture.detectChanges();

        expectRolling('#expressionRollButton', '#expressionValidating');
      });
    
      it(`should roll the default expression`, async () => {
        clickButton('#expressionRollButton');
  
        fixture.detectChanges();
        
        expectRolling('#expressionRollButton', '#expressionValidating');

        //run roll
        await waitForService();
  
        expectRolled('#expressionRollButton', '#expressionValidating');

        const compiled = fixture.nativeElement as HTMLElement;
        const rollSection = compiled.querySelector('#rollSection');
        const rolledNumber = new Number(rollSection?.textContent);
        expect(rolledNumber).toBeGreaterThanOrEqual(5);
        expect(rolledNumber).toBeLessThanOrEqual(20);
      });
    
      it(`should roll a non-default expression`, async () => {
        setInput('#rollExpression', '3d6t1-2');
  
        fixture.detectChanges();

        expect(fixture.componentInstance.expression).toEqual('3d6t1-2');

        //run validation
        await waitForService();

        clickButton('#expressionRollButton');
  
        fixture.detectChanges();
        
        expectRolling('#expressionRollButton', '#expressionValidating');

        //run roll
        await waitForService();
  
        expectRolled('#expressionRollButton', '#expressionValidating');

        const compiled = fixture.nativeElement as HTMLElement;
        const rollSection = compiled.querySelector('#rollSection');
        const rolledNumber = new Number(rollSection?.textContent);
        expect(rolledNumber).toBeGreaterThanOrEqual(4);
        expect(rolledNumber).toBeLessThanOrEqual(16);
      });
    
      it(`should display examples of rolls`, async () => {
        const compiled = fixture.nativeElement as HTMLElement;
        const expressionTab = compiled.querySelector('#expression');
        expect(expressionTab).toBeTruthy();

        const examples = expressionTab!.querySelectorAll('span.roll-expression-example');
        expect(examples).toBeTruthy();
        expect(examples!.length).toBe(10);
        expect(examples!.item(0).textContent).toEqual('3d6 - Roll 3 6-sided dice');
        expect(examples!.item(0).textContent).toEqual('4d4*1000 - Roll 4 4-sided dice, then multiply by 1000');
        expect(examples!.item(1).textContent).toEqual('1d2+3 - Roll 1 2-sided die, then add 3');
        expect(examples!.item(1).textContent).toEqual('4d6k3 - Roll 4 6-sided dice, keep the highest 3');
        expect(examples!.item(2).textContent).toEqual('1d20! - Roll 1 20-sided die, roll again if a 20 is rolled');
        expect(examples!.item(3).textContent).toEqual('3d6t1 - Roll 3 6-sided dice, transform 1s into 6s');
        expect(examples!.item(4).textContent).toEqual('4d8t2:3 - Roll 4 8-sided dice, transform 2s into 3s');
        expect(examples!.item(5).textContent).toEqual('1d2d3 - Roll 1 2-sided die [sum x], then roll x 3-sided dice');
        expect(examples!.item(6).textContent).toEqual('1d(2d3) - Roll 2 3-sided dice [sum x], then roll 1 x-sided die');
        expect(examples!.item(7).textContent).toEqual('1d2!+3d4k2 - Roll 1 2-sided die, roll again if a 2 is rolled; roll 3 4-sided dice, keep the highest 2');
      });

      const exampleCases = [
        { e: '3d6', l: 3, u: 3 * 6 },
        { e: '4d4*1000', l: 4 * 1000, u: 4 * 4 * 1000 },
        { e: '1d2+3', l: 4, u: 5 },
        { e: '4d6k3', l: 3, u: 3 * 6 },
        { e: '1d20!', l: 1, u: 20 * 10 },
        { e: '3d6t1', l: 6, u: 3 * 6 },
        { e: '4d8t2:3', l: 4, u: 4 * 8 },
        { e: '1d2d3', l: 1, u: 6 },
        { e: '1d(2d3)', l: 1, u: 6 },
        { e: '1d2!+3d4k2', l: 1 + 2, u: 2 * 10 + 2 * 4 },
      ];

      exampleCases.forEach(test => {
        it(`should roll an example roll - ${test.e}`, async () => {
          setInput('#rollExpression', test.e);
    
          fixture.detectChanges();
  
          expect(fixture.componentInstance.expression).toEqual(test.e);
  
          //run validation
          await waitForService();
  
          expectValid('#expressionRollButton', '#expressionValidating');
          clickButton('#expressionRollButton');
    
          fixture.detectChanges();
          
          expectRolling('#expressionRollButton', '#expressionValidating');
  
          //run roll
          await waitForService();
    
          expectRolled('#expressionRollButton', '#expressionValidating');
  
          const compiled = fixture.nativeElement as HTMLElement;
          const rollSection = compiled.querySelector('#rollSection');
          const rolledNumber = new Number(rollSection?.textContent);
          expect(rolledNumber).toBeGreaterThanOrEqual(test.l);
          expect(rolledNumber).toBeLessThanOrEqual(test.u);
        });
      });
    });
  
    it(`should render the initial roll`, () => {
      const compiled = fixture.nativeElement as HTMLElement;

      const rollSection = compiled.querySelector('#rollSection');
      expect(rollSection).toBeDefined();
      expect(rollSection?.textContent).toEqual('0');
      expect(rollSection?.hasAttribute('hidden')).toBeFalse();

      const rollingSection = compiled.querySelector('#rollingSection');
      expect(rollingSection).toBeDefined();
      expect(rollingSection?.hasAttribute('hidden')).toBeTrue();
    });
    
    it(`should format a large roll`, () => {
      fixture.componentInstance.roll = 9266;

      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;

      const rollSection = compiled.querySelector('#rollSection');
      expect(rollSection).toBeDefined();
      expect(rollSection?.hasAttribute('hidden')).toBeFalse();
      expect(rollSection?.textContent).toEqual('9,266');
    });
  });
});
