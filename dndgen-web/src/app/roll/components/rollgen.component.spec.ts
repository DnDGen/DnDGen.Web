import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { RollGenComponent } from './rollgen.component';
import { AppModule } from '../../app.module';
import { RollService } from '../services/roll.service';
import { SweetAlertService } from '../../shared/services/sweetAlert.service';
import { LoggerService } from '../../shared/services/logger.service';
import { Observable } from 'rxjs';
import { RollGenViewModel } from '../models/rollgenViewModel.model';
import { Size } from '../../shared/components/size.enum';
import { TestHelper } from '../../testHelper.spec';

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
    let helper: TestHelper<RollGenComponent>;
  
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [
          AppModule
        ],
      }).compileComponents();
  
      fixture = TestBed.createComponent(RollGenComponent);
      helper = new TestHelper(fixture);
      
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

      helper.expectLoading('dndgen-loading', true, Size.Large);
    });
  
    it('should hide the loading component when not loading', () => {
      const component = fixture.componentInstance;
      component.loading = false;

      fixture.detectChanges();

      helper.expectLoading('dndgen-loading', false, Size.Large);
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
  
      helper.expectTextContents('ul.nav-tabs > li > a.nav-link', ['Standard', 'Custom', 'Expression']);

      const tabLinks = compiled.querySelectorAll('ul.nav-tabs > li > a.nav-link');
      expect(tabLinks).toBeTruthy();
      expect(tabLinks.length).toEqual(3);
      expect(tabLinks.item(0).getAttribute('class')).toContain('active');
      expect(tabLinks.item(0).getAttribute('href')).toEqual('#standard');
      expect(tabLinks.item(1).getAttribute('class')).not.toContain('active');
      expect(tabLinks.item(1).getAttribute('href')).toEqual('#custom');
      expect(tabLinks.item(2).getAttribute('class')).not.toContain('active');
      expect(tabLinks.item(2).getAttribute('href')).toEqual('#expression');
    });

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
        helper.expectHasAttribute('#standardQuantity', 'required', true);

        const standardDieSelect = standardTab!.querySelector('#standardDie');
        expect(standardDieSelect).toBeDefined();
        helper.expectHasAttribute('#standardDie', 'required', true);
  
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
  
        helper.expectHasAttribute('#standardRollButton', 'disabled', false);
        helper.expectLoading('#standardValidating', false, Size.Small);
      });
    
      it(`should show when validating a standard roll`, () => {
        const component = fixture.componentInstance;
        component.validating = true;
  
        fixture.detectChanges();

        helper.expectValidating('#standardRollButton', '#standardValidating');
      });
    
      it(`should show that a standard roll is invalid - missing standard quantity`, () => {
        helper.setInput('#standardQuantity', '');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.standardQuantity).toBeNull();
        helper.expectInvalid('#standardRollButton', '#standardValidating');
      });
    
      it(`should show that a standard roll is invalid - standard quantity invalid`, () => {
        helper.setInput('#standardQuantity', 'wrong');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.standardQuantity).toBeNull();
        helper.expectInvalid('#standardRollButton', '#standardValidating');
      });
    
      it(`should show that a standard roll is invalid - standard quantity too low`, () => {
        helper.setInput('#standardQuantity', '0');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.standardQuantity).toEqual(0);
        helper.expectInvalid('#standardRollButton', '#standardValidating');
      });
    
      it(`should show that a standard roll is invalid - standard quantity too high`, async () => {
        helper.setInput('#standardQuantity', '10001');
  
        fixture.detectChanges();

        expect(fixture.componentInstance.standardQuantity).toEqual(10001);
        helper.expectValidating('#standardRollButton', '#standardValidating');
  
        //run roll validation
        await waitForService();
  
        helper.expectInvalid('#standardRollButton', '#standardValidating');
      });
    
      const standardQuantityTestCases = [1, 2, 10, 20, 100, 1000, 10000];

      standardQuantityTestCases.forEach(test => {
        it(`should show that a standard roll is valid - standard quantity ${test}`, async () => {
          helper.setInput('#standardQuantity', test.toString());
    
          fixture.detectChanges();
    
          expect(fixture.componentInstance.standardQuantity).toEqual(test);
          helper.expectValidating('#standardRollButton', '#standardValidating');
    
          //run roll validation
          await waitForService();
    
          helper.expectValid('#standardRollButton', '#standardValidating');
        });
      });
    
      it(`should show that a standard roll is invalid - missing standard die`, () => {
        helper.setSelectByValue('#standardDie', '');
  
        fixture.detectChanges();
  
        helper.expectInvalid('#standardRollButton', '#standardValidating');
      });
    
      it('should validate a standard roll when standard die changes', async () => {
        helper.setSelectByIndex('#standardDie', 1);
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.standardDie).toEqual(fixture.componentInstance.standardDice[1]);
        helper.expectValidating('#standardRollButton', '#standardValidating');

        await waitForService();
        
        helper.expectValid('#standardRollButton', '#standardValidating');
      });

      const standardDieIndicesTestCases = Array.from(Array(9).keys());

      standardDieIndicesTestCases.forEach(test => {
        it(`should show that a standard roll is valid - non-default standard die index ${test}`, async () => {
          helper.setSelectByIndex('#standardDie', test);
    
          fixture.detectChanges();
    
          expect(fixture.componentInstance.standardDie).toEqual(fixture.componentInstance.standardDice[test]);
          helper.expectValidating('#standardRollButton', '#standardValidating');

          await waitForService();

          helper.expectValid('#standardRollButton', '#standardValidating');
        });
      });

      it(`should show that a standard roll is invalid - validation fails`, async () => {
        helper.setInput('#standardQuantity', '66666');
        helper.setSelectByIndex('#standardDie', 4);
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.standardDie).toEqual(fixture.componentInstance.standardDice[4]);
        helper.expectValidating('#standardRollButton', '#standardValidating');
  
        //run roll validation
        await waitForService();

        helper.expectInvalid('#standardRollButton', '#standardValidating');
      });
    
      it(`should show that a standard roll is valid - validation succeeds`, async () => {
        helper.setInput('#standardQuantity', '9266');
        helper.setSelectByIndex('#standardDie', 5);
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.standardDie).toEqual(fixture.componentInstance.standardDice[5]);
        helper.expectValidating('#standardRollButton', '#standardValidating');
  
        //run roll validation
        await waitForService();
  
        helper.expectValid('#standardRollButton', '#standardValidating');
      });
    
      it(`should show when rolling a standard roll`, () => {
        const component = fixture.componentInstance;
        component.rolling = true;
  
        fixture.detectChanges();

        helper.expectGenerating('#standardRollButton', '#standardValidating', '#rollSection', '#rollingSection');
      });
    
      it(`should roll the default standard roll`, async () => {
        helper.clickButton('#standardRollButton');
  
        fixture.detectChanges();
        
        helper.expectGenerating('#standardRollButton', '#standardValidating', '#rollSection', '#rollingSection');

        //run roll
        await waitForService();
  
        helper.expectGenerated('#standardRollButton', '#standardValidating', '#rollSection', '#rollingSection');

        const compiled = fixture.nativeElement as HTMLElement;
        const rollSection = compiled.querySelector('#rollSection');
        const rolledNumber = new Number(rollSection?.textContent);
        expect(rolledNumber).toBeGreaterThanOrEqual(1);
        expect(rolledNumber).toBeLessThanOrEqual(20);
      });
    
      it(`should roll a non-default standard roll`, async () => {
        helper.setInput('#standardQuantity', '42');
        helper.setSelectByIndex('#standardDie', 2);
  
        fixture.detectChanges();

        expect(fixture.componentInstance.standardQuantity).toEqual(42);
        expect(fixture.componentInstance.standardDie).toEqual(fixture.componentInstance.standardDice[2]);

        //run validation
        await waitForService();

        helper.clickButton('#standardRollButton');
  
        fixture.detectChanges();
        
        helper.expectGenerating('#standardRollButton', '#standardValidating', '#rollSection', '#rollingSection');

        //run roll
        await waitForService();
  
        helper.expectGenerated('#standardRollButton', '#standardValidating', '#rollSection', '#rollingSection');

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
        helper.expectHasAttribute('#customQuantity', 'required', true);
  
        const customDieInput = customTab!.querySelector('#customDie') as HTMLInputElement;
        expect(customDieInput).toBeDefined();
        expect(customDieInput?.value).toEqual('5');
        expect(customDieInput?.getAttribute('type')).toEqual('number');
        expect(customDieInput?.getAttribute('min')).toEqual('1');
        expect(customDieInput?.getAttribute('max')).toEqual('10000');
        expect(customDieInput?.getAttribute('pattern')).toEqual('^[0-9]+$');
        helper.expectHasAttribute('#customDie', 'required', true);
  
        helper.expectHasAttribute('#customRollButton', 'disabled', false);
        helper.expectLoading('#customValidating', false, Size.Small);
      });
    
      it(`should show when validating a custom roll`, () => {
        const component = fixture.componentInstance;
        component.validating = true;
  
        fixture.detectChanges();

        helper.expectValidating('#customRollButton', '#customValidating');
      });
    
      it(`should show that a custom roll is invalid - missing custom quantity`, () => {
        helper.setInput('#customQuantity', '');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.customQuantity).toBeNull();
        helper.expectInvalid('#customRollButton', '#customValidating');
      });
    
      it(`should show that a custom roll is invalid - custom quantity invalid`, () => {
        helper.setInput('#customQuantity', 'wrong');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.customQuantity).toBeNull();
        helper.expectInvalid('#customRollButton', '#customValidating');
      });
    
      it(`should show that a custom roll is invalid - custom quantity too low`, () => {
        helper.setInput('#customQuantity', '0');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.customQuantity).toEqual(0);
        helper.expectInvalid('#customRollButton', '#customValidating');
      });
    
      it(`should show that a custom roll is invalid - custom quantity too high`, async () => {
        helper.setInput('#customQuantity', '10001');
  
        fixture.detectChanges();

        expect(fixture.componentInstance.customQuantity).toEqual(10001);
        helper.expectValidating('#customRollButton', '#customValidating');
  
        //run roll validation
        await waitForService();
  
        helper.expectInvalid('#customRollButton', '#customValidating');
      });
    
      const validCustomInputTestCases = [1, 2, 10, 20, 100, 1000, 10000];

      validCustomInputTestCases.forEach(test => {
        it(`should show that a custom roll is valid - custom quantity ${test}`, async () => {
          helper.setInput('#customQuantity', test.toString());
    
          fixture.detectChanges();
    
          expect(fixture.componentInstance.customQuantity).toEqual(test);
          helper.expectValidating('#customRollButton', '#customValidating');
    
          //run roll validation
          await waitForService();
    
          helper.expectValid('#customRollButton', '#customValidating');
        });
      });
    
      it(`should show that a custom roll is invalid - missing custom die`, () => {
        helper.setInput('#customDie', '');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.customDie).toBeNull();
        helper.expectInvalid('#customRollButton', '#customValidating');
      });
    
      it(`should show that a custom roll is invalid - custom die invalid`, () => {
        helper.setInput('#customDie', 'wrong');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.customDie).toBeNull();
        helper.expectInvalid('#customRollButton', '#customValidating');
      });
    
      it(`should show that a custom roll is invalid - custom die too low`, () => {
        helper.setInput('#customDie', '0');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.customDie).toEqual(0);
        helper.expectInvalid('#customRollButton', '#customValidating');
      });
    
      it(`should show that a custom roll is invalid - custom die too high`, async () => {
        helper.setInput('#customDie', '10001');
  
        fixture.detectChanges();

        expect(fixture.componentInstance.customDie).toEqual(10001);
        helper.expectValidating('#customRollButton', '#customValidating');
  
        //run roll validation
        await waitForService();
  
        helper.expectInvalid('#customRollButton', '#customValidating');
      });
    
      validCustomInputTestCases.forEach(test => {
        it(`should show that a custom roll is valid - custom die ${test}`, async () => {
          helper.setInput('#customDie', test.toString());
    
          fixture.detectChanges();
    
          expect(fixture.componentInstance.customDie).toEqual(test);
          helper.expectValidating('#customRollButton', '#customValidating');
    
          //run roll validation
          await waitForService();
    
          helper.expectValid('#customRollButton', '#customValidating');
        });
      });

      it(`should show that a custom roll is invalid - validation fails`, async () => {
        helper.setInput('#customQuantity', '66666');
        helper.setInput('#customDie', '666666');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.customQuantity).toEqual(66666);
        expect(fixture.componentInstance.customDie).toEqual(666666);
        helper.expectValidating('#customRollButton', '#customValidating');
  
        //run roll validation
        await waitForService();

        helper.expectInvalid('#customRollButton', '#customValidating');
      });
    
      it(`should show that a custom roll is valid - validation succeeds`, async () => {
        helper.setInput('#customQuantity', '9266');
        helper.setInput('#customDie', '42');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.customQuantity).toEqual(9266);
        expect(fixture.componentInstance.customDie).toEqual(42);
        helper.expectValidating('#customRollButton', '#customValidating');
  
        //run roll validation
        await waitForService();
  
        helper.expectValid('#customRollButton', '#customValidating');
      });
    
      it(`should show when rolling a custom roll`, () => {
        const component = fixture.componentInstance;
        component.rolling = true;
  
        fixture.detectChanges();

        helper.expectGenerating('#customRollButton', '#customValidating', '#rollSection', '#rollingSection');
      });
    
      it(`should roll the default custom roll`, async () => {
        helper.clickButton('#customRollButton');
  
        fixture.detectChanges();
        
        helper.expectGenerating('#customRollButton', '#customValidating', '#rollSection', '#rollingSection');

        //run roll
        await waitForService();
  
        helper.expectGenerated('#customRollButton', '#customValidating', '#rollSection', '#rollingSection');

        const compiled = fixture.nativeElement as HTMLElement;
        const rollSection = compiled.querySelector('#rollSection');
        const rolledNumber = new Number(rollSection?.textContent);
        expect(rolledNumber).toBeGreaterThanOrEqual(1);
        expect(rolledNumber).toBeLessThanOrEqual(5);
      });
    
      it(`should roll a non-default custom roll`, async () => {
        helper.setInput('#customQuantity', '42');
        helper.setInput('#customDie', '7');
  
        fixture.detectChanges();

        expect(fixture.componentInstance.customQuantity).toEqual(42);
        expect(fixture.componentInstance.customDie).toEqual(7);

        //run validation
        await waitForService();

        helper.clickButton('#customRollButton');
  
        fixture.detectChanges();
        
        helper.expectGenerating('#customRollButton', '#customValidating', '#rollSection', '#rollingSection');

        //run roll
        await waitForService();
  
        helper.expectGenerated('#customRollButton', '#customValidating', '#rollSection', '#rollingSection');

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
        helper.expectHasAttribute('#rollExpression', 'required', true);
  
        helper.expectHasAttribute('#expressionRollButton', 'disabled', false);
        helper.expectLoading('#expressionValidating', false, Size.Small);
      });
    
      it(`should show when validating an expression`, () => {
        const component = fixture.componentInstance;
        component.validating = true;
  
        fixture.detectChanges();

        helper.expectValidating('#expressionRollButton', '#expressionValidating');
      });
    
      it(`should show that an expression is invalid - empty`, () => {
        helper.setInput('#rollExpression', '');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.expression).toEqual('');
        helper.expectInvalid('#expressionRollButton', '#expressionValidating');
      });
    
      it(`should show that an expression is invalid - invalid syntax`, async () => {
        helper.setInput('#rollExpression', 'wrong+invalid');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.expression).toEqual('wrong+invalid');
        helper.expectValidating('#expressionRollButton', '#expressionValidating');
  
        //run roll validation
        await waitForService();
  
        helper.expectInvalid('#expressionRollButton', '#expressionValidating');
      });
    
      it(`should show that an expression is invalid - too high`, async () => {
        helper.setInput('#rollExpression', '1000d100d2');
  
        fixture.detectChanges();

        expect(fixture.componentInstance.expression).toEqual('1000d100d2');
        helper.expectValidating('#expressionRollButton', '#expressionValidating');
  
        //run roll validation
        await waitForService();
  
        helper.expectInvalid('#expressionRollButton', '#expressionValidating');
      });
    
      it(`should show that an expression is valid`, async () => {
        helper.setInput('#rollExpression', '100d100d2');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.expression).toEqual('100d100d2');
        helper.expectValidating('#expressionRollButton', '#expressionValidating');
  
        //run roll validation
        await waitForService();
  
        helper.expectValid('#expressionRollButton', '#expressionValidating');
      });

      it(`should show that an expression is invalid - validation fails`, async () => {
        helper.setInput('#rollExpression', '3d6t1-x');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.expression).toEqual('3d6t1-x');
        helper.expectValidating('#expressionRollButton', '#expressionValidating');
  
        //run roll validation
        await waitForService();

        helper.expectInvalid('#expressionRollButton', '#expressionValidating');
      });
    
      it(`should show that an expression is valid - validation succeeds`, async () => {
        helper.setInput('#rollExpression', '3d6t1-2');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.expression).toEqual('3d6t1-2');
        helper.expectValidating('#expressionRollButton', '#expressionValidating');
  
        //run roll validation
        await waitForService();
  
        helper.expectValid('#expressionRollButton', '#expressionValidating');
      });
    
      it(`should show when rolling an expression`, () => {
        const component = fixture.componentInstance;
        component.rolling = true;
  
        fixture.detectChanges();

        helper.expectGenerating('#expressionRollButton', '#expressionValidating', '#rollSection', '#rollingSection');
      });
    
      it(`should roll the default expression`, async () => {
        helper.clickButton('#expressionRollButton');
  
        fixture.detectChanges();
        
        helper.expectGenerating('#expressionRollButton', '#expressionValidating', '#rollSection', '#rollingSection');

        //run roll
        await waitForService();
  
        helper.expectGenerated('#expressionRollButton', '#expressionValidating', '#rollSection', '#rollingSection');

        const compiled = fixture.nativeElement as HTMLElement;
        const rollSection = compiled.querySelector('#rollSection');
        const rolledNumber = new Number(rollSection?.textContent);
        expect(rolledNumber).toBeGreaterThanOrEqual(5);
        expect(rolledNumber).toBeLessThanOrEqual(20);
      });
    
      it(`should roll a non-default expression`, async () => {
        helper.setInput('#rollExpression', '3d6t1-2');
  
        fixture.detectChanges();

        expect(fixture.componentInstance.expression).toEqual('3d6t1-2');

        //run validation
        await waitForService();

        helper.clickButton('#expressionRollButton');
  
        fixture.detectChanges();
        
        helper.expectGenerating('#expressionRollButton', '#expressionValidating', '#rollSection', '#rollingSection');

        //run roll
        await waitForService();
  
        helper.expectGenerated('#expressionRollButton', '#expressionValidating', '#rollSection', '#rollingSection');

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
        expect(examples!.item(1).textContent).toEqual('4d4*1000 - Roll 4 4-sided dice, then multiply by 1000');
        expect(examples!.item(2).textContent).toEqual('1d2+3 - Roll 1 2-sided die, then add 3');
        expect(examples!.item(3).textContent).toEqual('4d6k3 - Roll 4 6-sided dice, keep the highest 3');
        expect(examples!.item(4).textContent).toEqual('1d20! - Roll 1 20-sided die, roll again if a 20 is rolled');
        expect(examples!.item(5).textContent).toEqual('3d6t1 - Roll 3 6-sided dice, transform 1s into 6s');
        expect(examples!.item(6).textContent).toEqual('4d8t2:3 - Roll 4 8-sided dice, transform 2s into 3s');
        expect(examples!.item(7).textContent).toEqual('1d2d3 - Roll 1 2-sided die [sum x], then roll x 3-sided dice');
        expect(examples!.item(8).textContent).toEqual('1d(2d3) - Roll 2 3-sided dice [sum x], then roll 1 x-sided die');
        expect(examples!.item(9).textContent).toEqual('1d2!+3d4k2 - Roll 1 2-sided die, roll again if a 2 is rolled; roll 3 4-sided dice, keep the highest 2');
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
          helper.setInput('#rollExpression', test.e);
    
          fixture.detectChanges();
  
          expect(fixture.componentInstance.expression).toEqual(test.e);
  
          //run validation
          await waitForService();
  
          helper.expectValid('#expressionRollButton', '#expressionValidating');
          helper.clickButton('#expressionRollButton');
    
          fixture.detectChanges();
          
          helper.expectGenerating('#expressionRollButton', '#expressionValidating', '#rollSection', '#rollingSection');
  
          //run roll
          await waitForService();
    
          helper.expectGenerated('#expressionRollButton', '#expressionValidating', '#rollSection', '#rollingSection');
  
          const compiled = fixture.nativeElement as HTMLElement;
          const rollSection = compiled.querySelector('#rollSection');
          expect(rollSection).toBeTruthy();
          expect(rollSection!.textContent).toBeTruthy();

          const rolledNumber = parseInt(rollSection!.textContent!.replace(/,/g, ''));
          expect(rolledNumber).toBeGreaterThanOrEqual(test.l);
          expect(rolledNumber).toBeLessThanOrEqual(test.u);
        });
      });
    });
  
    it(`should render the initial roll`, () => {
      const compiled = fixture.nativeElement as HTMLElement;

      helper.expectHasAttribute('#rollSection', 'hidden', false);

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
