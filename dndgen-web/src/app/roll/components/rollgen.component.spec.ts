import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { RollGenComponent } from './rollgen.component';
import { RollService } from '../services/roll.service';
import { SweetAlertService } from '../../shared/services/sweetAlert.service';
import { LoggerService } from '../../shared/services/logger.service';
import { Observable, of } from 'rxjs';
import { RollGenViewModel } from '../models/rollgenViewModel.model';
import { Size } from '../../shared/components/size.enum';
import { TestHelper } from '../../testHelper.spec';

describe('RollGen Component', () => {
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
      
      tick(delay - 1);

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

    it('should pause before submitting expression for validation', fakeAsync(() => {
      component.validateExpression('my expression');
      
      expect(component.validating).toBeTrue();
      expect(rollServiceSpy.validateExpression).not.toHaveBeenCalled();

      tick(500 - 1);
      expect(rollServiceSpy.validateExpression).not.toHaveBeenCalled();

      flush();
    }));

    function setupInit() {
      const model = new RollGenViewModel(9266, 90210, 42, 600);
      rollServiceSpy.getViewModel.and.returnValue(of(model));
      component.ngOnInit();
    }

    it('should wait for typing to stop before submitting expression for validation', fakeAsync(() => {
      setupInit();
      rollServiceSpy.validateExpression.and.callFake(() => getFakeDelay(true));
      
      component.validateExpression('my expression');
      expect(component.validating).toBeTrue();
      expect(rollServiceSpy.validateExpression).not.toHaveBeenCalled();

      tick(500 - 1);

      component.validateExpression('my other expression');
      expect(component.validating).toBeTrue();
      expect(rollServiceSpy.validateExpression).not.toHaveBeenCalled();

      tick(500 - 1);
      
      expect(component.validating).toBeTrue();
      expect(rollServiceSpy.validateExpression).not.toHaveBeenCalled();

      tick(1);

      expect(rollServiceSpy.validateExpression).toHaveBeenCalledWith('my other expression');
      expect(rollServiceSpy.validateExpression).toHaveBeenCalledTimes(1);

      flush();
    }));

    it('should be validating while validating the expression', fakeAsync(() => {
      setupInit();
      rollServiceSpy.validateExpression.and.callFake(() => getFakeDelay(true));

      component.validateExpression('my expression');
      expect(component.validating).toBeTrue();

      tick(500);

      expect(rollServiceSpy.validateExpression).toHaveBeenCalledWith('my expression');
      
      tick(delay / 2);

      expect(component.validating).toBeTrue();

      flush();
    }));

    it('should validate a valid expression', fakeAsync(() => {
      setupInit();
      rollServiceSpy.validateExpression.and.callFake(() => getFakeDelay(true));

      component.validateExpression('my expression');
      expect(component.validating).toBeTrue();

      tick(500);

      expect(rollServiceSpy.validateExpression).toHaveBeenCalledWith('my expression');

      tick(delay);

      expect(component.rollIsValid).toBeTrue();
      expect(component.validating).toBeFalse();
    }));

    it('should validate an invalid expression', fakeAsync(() => {
      setupInit();
      rollServiceSpy.validateExpression.and.callFake(() => getFakeDelay(false));

      component.validateExpression('my expression');
      expect(component.validating).toBeTrue();

      tick(500);

      expect(rollServiceSpy.validateExpression).toHaveBeenCalledWith('my expression');

      tick(delay);

      expect(component.rollIsValid).toBeFalse();
      expect(component.validating).toBeFalse();
    }));

    it('should handle error from validating expression', fakeAsync(() => {
      setupInit();
      rollServiceSpy.validateExpression.and.callFake(() => getFakeError('I failed'));

      component.validateExpression('my expression');
      tick(500 + delay);

      expect(component.rollIsValid).toBeFalse();
      expect(component.roll).toEqual(0);
      expect(component.rolling).toBeFalse();
      expect(component.loading).toBeFalse();
      expect(component.validating).toBeFalse();
      
      expect(rollServiceSpy.validateExpression).toHaveBeenCalledWith('my expression');
      expect(loggerServiceSpy.logError).not.toHaveBeenCalled();
      expect(sweetAlertServiceSpy.showError).not.toHaveBeenCalled();
    }));

    it('should handle expression validation error, then continue validating', fakeAsync(() => {
      setupInit();
      rollServiceSpy.validateExpression.and.callFake(() => getFakeError('I failed'));

      component.validateExpression('my bad expression');
      tick(500 + delay);

      expect(rollServiceSpy.validateExpression).toHaveBeenCalledWith('my bad expression');
      expect(loggerServiceSpy.logError).not.toHaveBeenCalled();
      expect(sweetAlertServiceSpy.showError).not.toHaveBeenCalled();

      expect(component.validating).toBeFalse();
      expect(component.rollIsValid).toBeFalse();

      rollServiceSpy.validateExpression.and.callFake(() => getFakeDelay(true));

      component.validateExpression('my expression');
      tick(500 + delay);

      expect(rollServiceSpy.validateExpression).toHaveBeenCalledWith('my expression');
      expect(loggerServiceSpy.logError).not.toHaveBeenCalled();
      expect(sweetAlertServiceSpy.showError).not.toHaveBeenCalled();
      
      expect(component.validating).toBeFalse();
      expect(component.rollIsValid).toBeTrue();
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
      await TestHelper.configureTestBed([RollGenComponent]);
  
      fixture = TestBed.createComponent(RollGenComponent);
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
  
      helper.expectTextContents('ul.nav-tabs a.nav-link', ['Standard', 'Custom', 'Expression']);

      const tabLinks = compiled.querySelectorAll('ul.nav-tabs a.nav-link');
      expect(tabLinks).toBeTruthy();
      expect(tabLinks.length).toEqual(3);
      expect(tabLinks.item(0).getAttribute('class')).toContain('active');
      expect(tabLinks.item(1).getAttribute('class')).not.toContain('active');
      expect(tabLinks.item(2).getAttribute('class')).not.toContain('active');
    });

    describe('the standard tab', () => {
      it(`should render the standard tab`, () => {
        helper.expectExists('#standard');
        helper.expectNumberInput('#standard #standardQuantity', true, 1, 1, 10000);
        helper.expectSelect('#standard #standardDie', true, '20', 9, [
          '2', '3', '4', '6', '8', '10', '12', '20', 'Percentile'
        ]);

        helper.expectHasAttribute('#standardRollButton', 'disabled', false);
        helper.expectLoading('#standardValidating', false, Size.Small);
      });
    
      it(`should show when validating a standard roll`, () => {
        const component = fixture.componentInstance;
        component.validating = true;
  
        fixture.detectChanges();

        helper.expectValidating(component.validating, '#standardRollButton', '#standardValidating');
      });
    
      it(`should show that a standard roll is invalid - missing standard quantity`, () => {
        helper.setInput('#standardQuantity', '');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.standardQuantity).toBeNull();
        helper.expectInvalid(fixture.componentInstance.validating, fixture.componentInstance.rollIsValid, '#standardRollButton', '#standardValidating');
      });
    
      it(`should show that a standard roll is invalid - standard quantity invalid`, () => {
        helper.setInput('#standardQuantity', 'wrong');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.standardQuantity).toBeNull();
        helper.expectInvalid(fixture.componentInstance.validating, fixture.componentInstance.rollIsValid, '#standardRollButton', '#standardValidating');
      });
    
      it(`should show that a standard roll is invalid - standard quantity too low`, () => {
        helper.setInput('#standardQuantity', '0');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.standardQuantity).toEqual(0);
        helper.expectInvalid(fixture.componentInstance.validating, fixture.componentInstance.rollIsValid, '#standardRollButton', '#standardValidating');
      });
    
      it(`should show that a standard roll is invalid - standard quantity too high`, async () => {
        helper.setInput('#standardQuantity', '10001');
  
        fixture.detectChanges();

        expect(fixture.componentInstance.standardQuantity).toEqual(10001);
        helper.expectValidating(fixture.componentInstance.validating, '#standardRollButton', '#standardValidating');
  
        //run roll validation
        await helper.waitForService();
  
        helper.expectInvalid(fixture.componentInstance.validating, fixture.componentInstance.rollIsValid, '#standardRollButton', '#standardValidating');
      });
    
      const standardQuantityTestCases = [1, 2, 10, 20, 100, 1000, 10000];

      standardQuantityTestCases.forEach(test => {
        it(`should show that a standard roll is valid - standard quantity ${test}`, async () => {
          helper.setInput('#standardQuantity', test.toString());
    
          fixture.detectChanges();
    
          expect(fixture.componentInstance.standardQuantity).toEqual(test);
          helper.expectValidating(fixture.componentInstance.validating, '#standardRollButton', '#standardValidating');
    
          //run roll validation
          await helper.waitForService();
    
          helper.expectValid(fixture.componentInstance.validating, fixture.componentInstance.rollIsValid, '#standardRollButton', '#standardValidating');
        });
      });
    
      it(`should show that a standard roll is invalid - missing standard die`, () => {
        helper.setSelectByValue('#standardDie', '');
  
        fixture.detectChanges();
  
        helper.expectInvalid(fixture.componentInstance.validating, fixture.componentInstance.rollIsValid, '#standardRollButton', '#standardValidating');
      });
    
      it('should validate a standard roll when standard die changes', async () => {
        helper.setSelectByIndex('#standardDie', 1);
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.standardDie).toEqual(fixture.componentInstance.standardDice[1]);
        helper.expectValidating(fixture.componentInstance.validating, '#standardRollButton', '#standardValidating');

        await helper.waitForService();
        
        helper.expectValid(fixture.componentInstance.validating, fixture.componentInstance.rollIsValid, '#standardRollButton', '#standardValidating');
      });

      const standardDieIndicesTestCases = Array.from(Array(9).keys());

      standardDieIndicesTestCases.forEach(test => {
        it(`should show that a standard roll is valid - non-default standard die index ${test}`, async () => {
          helper.setSelectByIndex('#standardDie', test);
    
          fixture.detectChanges();
    
          expect(fixture.componentInstance.standardDie).toEqual(fixture.componentInstance.standardDice[test]);
          helper.expectValidating(fixture.componentInstance.validating, '#standardRollButton', '#standardValidating');

          await helper.waitForService();

          helper.expectValid(fixture.componentInstance.validating, fixture.componentInstance.rollIsValid, '#standardRollButton', '#standardValidating');
        });
      });

      it(`should show that a standard roll is invalid - validation fails`, async () => {
        helper.setInput('#standardQuantity', '66666');
        helper.setSelectByIndex('#standardDie', 4);
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.standardDie).toEqual(fixture.componentInstance.standardDice[4]);
        helper.expectValidating(fixture.componentInstance.validating, '#standardRollButton', '#standardValidating');
  
        //run roll validation
        await helper.waitForService();

        helper.expectInvalid(fixture.componentInstance.validating, fixture.componentInstance.rollIsValid, '#standardRollButton', '#standardValidating');
      });
    
      it(`should show that a standard roll is valid - validation succeeds`, async () => {
        helper.setInput('#standardQuantity', '9266');
        helper.setSelectByIndex('#standardDie', 5);
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.standardDie).toEqual(fixture.componentInstance.standardDice[5]);
        helper.expectValidating(fixture.componentInstance.validating, '#standardRollButton', '#standardValidating');
  
        //run roll validation
        await helper.waitForService();
  
        helper.expectValid(fixture.componentInstance.validating, fixture.componentInstance.rollIsValid, '#standardRollButton', '#standardValidating');
      });
    
      it(`should show when rolling a standard roll`, () => {
        const component = fixture.componentInstance;
        component.rolling = true;
  
        fixture.detectChanges();

        helper.expectGenerating(
          fixture.componentInstance.rolling, 
          '#standardRollButton', 
          '#rollSection', 
          '#rollingSection',
          '#standardValidating', 
        );
      });
    
      it(`should roll the default standard roll`, async () => {
        helper.clickButton('#standardRollButton');
  
        fixture.detectChanges();
        
        helper.expectGenerating(
          fixture.componentInstance.rolling, 
          '#standardRollButton', 
          '#rollSection', 
          '#rollingSection',
          '#standardValidating', 
        );

        //run roll
        await helper.waitForService();
  
        helper.expectGenerated(fixture.componentInstance.rolling, '#standardRollButton', '#rollSection', '#rollingSection', '#standardValidating');

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
        await helper.waitForService();

        helper.clickButton('#standardRollButton');
  
        fixture.detectChanges();
        
        helper.expectGenerating(
          fixture.componentInstance.rolling, 
          '#standardRollButton', 
          '#rollSection', 
          '#rollingSection',
          '#standardValidating', 
        );

        //run roll
        await helper.waitForService();
  
        helper.expectGenerated(fixture.componentInstance.rolling, '#standardRollButton', '#rollSection', '#rollingSection', '#standardValidating');

        const compiled = fixture.nativeElement as HTMLElement;
        const rollSection = compiled.querySelector('#rollSection');
        const rolledNumber = new Number(rollSection?.textContent);
        expect(rolledNumber).toBeGreaterThanOrEqual(42);
        expect(rolledNumber).toBeLessThanOrEqual(42 * 4);
      });
    });
  
    describe('the custom tab', () => {
      it(`should render the custom tab`, () => {
        helper.expectExists('#custom');
        helper.expectNumberInput('#custom #customQuantity', true, 1, 1, 10000);
        helper.expectNumberInput('#custom #customDie', true, 5, 1, 10000);

        helper.expectHasAttribute('#custom #customRollButton', 'disabled', false);
        helper.expectLoading('#custom #customValidating', false, Size.Small);
      });
    
      it(`should show when validating a custom roll`, () => {
        const component = fixture.componentInstance;
        component.validating = true;
  
        fixture.detectChanges();

        helper.expectValidating(fixture.componentInstance.validating, '#customRollButton', '#customValidating');
      });
    
      it(`should show that a custom roll is invalid - missing custom quantity`, () => {
        helper.setInput('#customQuantity', '');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.customQuantity).toBeNull();
        helper.expectInvalid(fixture.componentInstance.validating, fixture.componentInstance.rollIsValid, '#customRollButton', '#customValidating');
      });
    
      it(`should show that a custom roll is invalid - custom quantity invalid`, () => {
        helper.setInput('#customQuantity', 'wrong');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.customQuantity).toBeNull();
        helper.expectInvalid(fixture.componentInstance.validating, fixture.componentInstance.rollIsValid, '#customRollButton', '#customValidating');
      });
    
      it(`should show that a custom roll is invalid - custom quantity too low`, () => {
        helper.setInput('#customQuantity', '0');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.customQuantity).toEqual(0);
        helper.expectInvalid(fixture.componentInstance.validating, fixture.componentInstance.rollIsValid, '#customRollButton', '#customValidating');
      });
    
      it(`should show that a custom roll is invalid - custom quantity too high`, async () => {
        helper.setInput('#customQuantity', '10001');
  
        fixture.detectChanges();

        expect(fixture.componentInstance.customQuantity).toEqual(10001);
        helper.expectValidating(fixture.componentInstance.validating, '#customRollButton', '#customValidating');
  
        //run roll validation
        await helper.waitForService();
  
        helper.expectInvalid(fixture.componentInstance.validating, fixture.componentInstance.rollIsValid, '#customRollButton', '#customValidating');
      });
    
      const validCustomInputTestCases = [1, 2, 10, 20, 100, 1000, 10000];

      validCustomInputTestCases.forEach(test => {
        it(`should show that a custom roll is valid - custom quantity ${test}`, async () => {
          helper.setInput('#customQuantity', test.toString());
    
          fixture.detectChanges();
    
          expect(fixture.componentInstance.customQuantity).toEqual(test);
          helper.expectValidating(fixture.componentInstance.validating, '#customRollButton', '#customValidating');
    
          //run roll validation
          await helper.waitForService();
    
          helper.expectValid(fixture.componentInstance.validating, fixture.componentInstance.rollIsValid, '#customRollButton', '#customValidating');
        });
      });
    
      it(`should show that a custom roll is invalid - missing custom die`, () => {
        helper.setInput('#customDie', '');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.customDie).toBeNull();
        helper.expectInvalid(fixture.componentInstance.validating, fixture.componentInstance.rollIsValid, '#customRollButton', '#customValidating');
      });
    
      it(`should show that a custom roll is invalid - custom die invalid`, () => {
        helper.setInput('#customDie', 'wrong');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.customDie).toBeNull();
        helper.expectInvalid(fixture.componentInstance.validating, fixture.componentInstance.rollIsValid, '#customRollButton', '#customValidating');
      });
    
      it(`should show that a custom roll is invalid - custom die too low`, () => {
        helper.setInput('#customDie', '0');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.customDie).toEqual(0);
        helper.expectInvalid(fixture.componentInstance.validating, fixture.componentInstance.rollIsValid, '#customRollButton', '#customValidating');
      });
    
      it(`should show that a custom roll is invalid - custom die too high`, async () => {
        helper.setInput('#customDie', '10001');
  
        fixture.detectChanges();

        expect(fixture.componentInstance.customDie).toEqual(10001);
        helper.expectValidating(fixture.componentInstance.validating, '#customRollButton', '#customValidating');
  
        //run roll validation
        await helper.waitForService();
  
        helper.expectInvalid(fixture.componentInstance.validating, fixture.componentInstance.rollIsValid, '#customRollButton', '#customValidating');
      });
    
      validCustomInputTestCases.forEach(test => {
        it(`should show that a custom roll is valid - custom die ${test}`, async () => {
          helper.setInput('#customDie', test.toString());
    
          fixture.detectChanges();
    
          expect(fixture.componentInstance.customDie).toEqual(test);
          helper.expectValidating(fixture.componentInstance.validating, '#customRollButton', '#customValidating');
    
          //run roll validation
          await helper.waitForService();
    
          helper.expectValid(fixture.componentInstance.validating, fixture.componentInstance.rollIsValid, '#customRollButton', '#customValidating');
        });
      });

      it(`should show that a custom roll is invalid - validation fails`, async () => {
        helper.setInput('#customQuantity', '66666');
        helper.setInput('#customDie', '666666');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.customQuantity).toEqual(66666);
        expect(fixture.componentInstance.customDie).toEqual(666666);
        helper.expectValidating(fixture.componentInstance.validating, '#customRollButton', '#customValidating');
  
        //run roll validation
        await helper.waitForService();

        helper.expectInvalid(fixture.componentInstance.validating, fixture.componentInstance.rollIsValid, '#customRollButton', '#customValidating');
      });
    
      it(`should show that a custom roll is valid - validation succeeds`, async () => {
        helper.setInput('#customQuantity', '9266');
        helper.setInput('#customDie', '42');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.customQuantity).toEqual(9266);
        expect(fixture.componentInstance.customDie).toEqual(42);
        helper.expectValidating(fixture.componentInstance.validating, '#customRollButton', '#customValidating');
  
        //run roll validation
        await helper.waitForService();
  
        helper.expectValid(fixture.componentInstance.validating, fixture.componentInstance.rollIsValid, '#customRollButton', '#customValidating');
      });
    
      it(`should show when rolling a custom roll`, () => {
        const component = fixture.componentInstance;
        component.rolling = true;
  
        fixture.detectChanges();

        helper.expectGenerating(fixture.componentInstance.rolling, '#customRollButton', '#rollSection', '#rollingSection', '#customValidating');
      });
    
      it(`should roll the default custom roll`, async () => {
        helper.clickButton('#customRollButton');
  
        fixture.detectChanges();
        
        helper.expectGenerating(fixture.componentInstance.rolling, '#customRollButton', '#rollSection', '#rollingSection', '#customValidating');

        //run roll
        await helper.waitForService();
  
        helper.expectGenerated(fixture.componentInstance.rolling, '#customRollButton', '#rollSection', '#rollingSection', '#customValidating');

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
        await helper.waitForService();

        helper.clickButton('#customRollButton');
  
        fixture.detectChanges();
        
        helper.expectGenerating(fixture.componentInstance.rolling, '#customRollButton', '#rollSection', '#rollingSection', '#customValidating');

        //run roll
        await helper.waitForService();
  
        helper.expectGenerated(fixture.componentInstance.rolling, '#customRollButton', '#rollSection', '#rollingSection', '#customValidating');

        const compiled = fixture.nativeElement as HTMLElement;
        const rollSection = compiled.querySelector('#rollSection');
        const rolledNumber = new Number(rollSection?.textContent);
        expect(rolledNumber).toBeGreaterThanOrEqual(42);
        expect(rolledNumber).toBeLessThanOrEqual(42 * 7);
      });
    });
  
    describe('the expression tab', () => {
      it(`should render the expression tab`, async () => {
        helper.expectExists('#expression');
        helper.expectInput('#expression #rollExpression', true, '4d6k3+2');

        expect(fixture.componentInstance.rolling).toBeFalse();
        expect(fixture.componentInstance.validating).toBeFalse();

        helper.expectHasAttribute('#expression #expressionRollButton', 'disabled', false);
        helper.expectLoading('#expression #expressionValidating', false, Size.Small);
      });
    
      it(`should show when validating an expression`, () => {
        const component = fixture.componentInstance;
        component.validating = true;
  
        fixture.detectChanges();

        helper.expectValidating(fixture.componentInstance.validating, '#expressionRollButton', '#expressionValidating');
      });
    
      it(`should show that an expression is invalid - empty`, () => {
        helper.setInput('#rollExpression', '', 'keyup');
        helper.waitForDebounce();
  
        expect(fixture.componentInstance.expression).toEqual('');
        helper.expectInvalid(fixture.componentInstance.validating, fixture.componentInstance.rollIsValid, '#expressionRollButton', '#expressionValidating');
      });
    
      it(`should show that an expression is invalid - invalid syntax`, async () => {
        helper.setInput('#rollExpression', 'wrong+invalid', 'keyup');
        helper.waitForDebounce();
  
        expect(fixture.componentInstance.expression).toEqual('wrong+invalid');
        helper.expectValidating(fixture.componentInstance.validating, '#expressionRollButton', '#expressionValidating');
  
        //run roll validation
        await helper.waitForService();
  
        helper.expectInvalid(fixture.componentInstance.validating, fixture.componentInstance.rollIsValid, '#expressionRollButton', '#expressionValidating');
      });
    
      it(`should show that an expression is invalid - too high`, async () => {
        helper.setInput('#rollExpression', '1000d100d2', 'keyup');
        helper.waitForDebounce();

        expect(fixture.componentInstance.expression).toEqual('1000d100d2');
        helper.expectValidating(fixture.componentInstance.validating, '#expressionRollButton', '#expressionValidating');
  
        //run roll validation
        await helper.waitForService();
  
        helper.expectInvalid(fixture.componentInstance.validating, fixture.componentInstance.rollIsValid, '#expressionRollButton', '#expressionValidating');
      });
    
      it(`should show that an expression is valid`, async () => {
        helper.setInput('#rollExpression', '100d100d2', 'keyup');
        helper.waitForDebounce();
  
        expect(fixture.componentInstance.expression).toEqual('100d100d2');
        helper.expectValidating(fixture.componentInstance.validating, '#expressionRollButton', '#expressionValidating');
  
        //run roll validation
        await helper.waitForService();
  
        helper.expectValid(fixture.componentInstance.validating, fixture.componentInstance.rollIsValid, '#expressionRollButton', '#expressionValidating');
      });

      it(`should show that an expression is invalid - validation fails`, async () => {
        helper.setInput('#rollExpression', '3d6t1-x', 'keyup');
        helper.waitForDebounce();
  
        expect(fixture.componentInstance.expression).toEqual('3d6t1-x');
        helper.expectValidating(fixture.componentInstance.validating, '#expressionRollButton', '#expressionValidating');
  
        //run roll validation
        await helper.waitForService();

        helper.expectInvalid(fixture.componentInstance.validating, fixture.componentInstance.rollIsValid, '#expressionRollButton', '#expressionValidating');
      });
    
      it(`should show that an expression is valid - validation succeeds`, async () => {
        helper.setInput('#rollExpression', '3d6t1-2', 'keyup');
        helper.waitForDebounce();
  
        expect(fixture.componentInstance.expression).toEqual('3d6t1-2');
        helper.expectValidating(fixture.componentInstance.validating, '#expressionRollButton', '#expressionValidating');
  
        //run roll validation
        await helper.waitForService();
  
        helper.expectValid(fixture.componentInstance.validating, fixture.componentInstance.rollIsValid, '#expressionRollButton', '#expressionValidating');
      });
    
      it(`should show when rolling an expression`, () => {
        const component = fixture.componentInstance;
        component.rolling = true;
  
        fixture.detectChanges();

        helper.expectGenerating(fixture.componentInstance.rolling, '#expressionRollButton', '#rollSection', '#rollingSection', '#expressionValidating');
      });
    
      it(`should roll the default expression`, async () => {
        helper.waitForDebounce();

        helper.clickButton('#expressionRollButton');
  
        fixture.detectChanges();
        
        helper.expectGenerating(fixture.componentInstance.rolling, '#expressionRollButton', '#rollSection', '#rollingSection', '#expressionValidating');

        //run roll
        await helper.waitForService();
  
        helper.expectGenerated(fixture.componentInstance.rolling, '#expressionRollButton', '#rollSection', '#rollingSection', '#expressionValidating');

        const compiled = fixture.nativeElement as HTMLElement;
        const rollSection = compiled.querySelector('#rollSection');
        const rolledNumber = new Number(rollSection?.textContent);
        expect(rolledNumber).toBeGreaterThanOrEqual(5);
        expect(rolledNumber).toBeLessThanOrEqual(20);
      });
    
      it(`should roll a non-default expression`, async () => {
        helper.setInput('#rollExpression', '3d6t1-2', 'keyup');
        helper.waitForDebounce();

        expect(fixture.componentInstance.expression).toEqual('3d6t1-2');

        //run validation
        await helper.waitForService();

        helper.clickButton('#expressionRollButton');
  
        fixture.detectChanges();
        
        helper.expectGenerating(fixture.componentInstance.rolling, '#expressionRollButton', '#rollSection', '#rollingSection', '#expressionValidating');

        //run roll
        await helper.waitForService();
  
        helper.expectGenerated(fixture.componentInstance.rolling, '#expressionRollButton', '#rollSection', '#rollingSection', '#expressionValidating');

        const compiled = fixture.nativeElement as HTMLElement;
        const rollSection = compiled.querySelector('#rollSection');
        const rolledNumber = new Number(rollSection?.textContent);
        expect(rolledNumber).toBeGreaterThanOrEqual(4);
        expect(rolledNumber).toBeLessThanOrEqual(16);
      });
    
      it(`should display examples of expression rolls`, async () => {
        helper.expectExists('#expression');
        helper.expectTextContents('#expression span.roll-expression-example', [
          '3d6 - Roll 3 6-sided dice',
          '4d4*1000 - Roll 4 4-sided dice, then multiply by 1000',
          '1d2+3 - Roll 1 2-sided die, then add 3',
          '4d6k3 - Roll 4 6-sided dice, keep the highest 3',
          '1d20! - Roll 1 20-sided die, roll again if a 20 is rolled',
          '3d6t1 - Roll 3 6-sided dice, transform 1s into 6s',
          '4d8t2:3 - Roll 4 8-sided dice, transform 2s into 3s',
          '1d2d3 - Roll 1 2-sided die [sum x], then roll x 3-sided dice',
          '1d(2d3) - Roll 2 3-sided dice [sum x], then roll 1 x-sided die',
          '1d2!+3d4k2 - Roll 1 2-sided die, roll again if a 2 is rolled; roll 3 4-sided dice, keep the highest 2',
        ]);
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
        it(`should roll an example expression roll - ${test.e}`, async () => {
          helper.setInput('#rollExpression', test.e, 'keyup');
          helper.waitForDebounce();
  
          expect(fixture.componentInstance.expression).toEqual(test.e);
  
          //run validation
          await helper.waitForService();
  
          helper.expectValid(fixture.componentInstance.validating, fixture.componentInstance.rollIsValid, '#expressionRollButton', '#expressionValidating');
          helper.clickButton('#expressionRollButton');
    
          fixture.detectChanges();
          
          helper.expectGenerating(fixture.componentInstance.rolling, '#expressionRollButton', '#rollSection', '#rollingSection', '#expressionValidating');
  
          //run roll
          await helper.waitForService();
    
          helper.expectGenerated(fixture.componentInstance.rolling, '#expressionRollButton', '#rollSection', '#rollingSection', '#expressionValidating');

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
      helper.expectExists('#rollSection', true);
      helper.expectTextContent('#rollSection', '0');
      helper.expectLoading('#rollingSection', false, Size.Medium);
    });
    
    it(`should format a roll`, () => {
      fixture.componentInstance.roll = 42;

      fixture.detectChanges();

      helper.expectExists('#rollSection', true);
      helper.expectTextContent('#rollSection', '42');
    });
    
    it(`should format a large roll`, () => {
      fixture.componentInstance.roll = 9266;

      fixture.detectChanges();

      helper.expectExists('#rollSection', true);
      helper.expectTextContent('#rollSection', '9,266');
    });
  });
});
