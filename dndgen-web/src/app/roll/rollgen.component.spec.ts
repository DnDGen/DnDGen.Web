import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RollGenComponent } from './rollgen.component';
import { AppModule } from '../app.module';
import { RollService } from './services/roll.service';
import { SweetAlertService } from '../shared/sweetAlert.service';
import { LoggerService } from '../shared/logger.service';

describe('RollGenComponent', () => {
  describe('unit', () => {
    let component: RollGenComponent;
    let rollServiceSpy: jasmine.SpyObj<RollService>;
    let sweetAlertServiceSpy: jasmine.SpyObj<SweetAlertService>;
    let loggerServiceSpy: jasmine.SpyObj<LoggerService>;
  
    beforeEach(async () => {
      rollServiceSpy = jasmine.createSpyObj('RollService', ['getViewModel', 'getRoll', 'validateRoll', 'getExpressionRoll', 'validateExpression']);
      sweetAlertServiceSpy = jasmine.createSpyObj('SweetAlertService', ['showError']);
      loggerServiceSpy = jasmine.createSpyObj('LoggerService', ['logError']);

      component = new RollGenComponent(rollServiceSpy, sweetAlertServiceSpy, loggerServiceSpy);
    });
  
    it(`should initialize the public properties`, () => {
      expect(component.rolling).toEqual(false);
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
      expect(component.expression).toEqual('3d6+2');
    });
  
    it('TODO - MORE TESTS TO WRITE', () => {
      expect('rollStandard - is rolling while getting result').toEqual('');
      expect('rollStandard - sets result').toEqual('');
      expect('rollStandard - handles error').toEqual('');
      
      expect('rollCustom - is rolling while getting result').toEqual('');
      expect('rollCustom - sets result').toEqual('');
      expect('rollCustom - handles error').toEqual('');
      
      expect('rollExpression - is rolling while getting result').toEqual('');
      expect('rollExpression - sets result').toEqual('');
      expect('rollExpression - handles error').toEqual('');
      
      expect('validateRoll - invalid if no quantity').toEqual('');
      expect('validateRoll - invalid if no die').toEqual('');
      expect('validateRoll - is validating while getting result').toEqual('');
      expect('validateRoll - sets result').toEqual('');
      expect('validateRoll - handles error').toEqual('');
      
      expect('validateExpression - invalid if no expression').toEqual('');
      expect('validateExpression - invalid if empty expression').toEqual('');
      expect('validateExpression - is validating while getting result').toEqual('');
      expect('validateExpression - sets result').toEqual('');
      expect('validateExpression - handles error').toEqual('');
    });
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
    
      it(`should show that a standard roll is invalid - missing standard die`, async () => {
        setSelectByValue('#standardDie', '');
  
        fixture.detectChanges();
  
        expectInvalid('#standardRollButton', '#standardValidating');
      });
    
      const standardDieIndicesTestCases = [0, 1, 2, 3, 4, 5, 6, 7, 8];

      standardDieIndicesTestCases.forEach(test => {
        it(`should show that a standard roll is valid - non-default standard die index ${test}`, async () => {
          setSelectByIndex('#standardDie', test);
    
          fixture.detectChanges();
    
          expect(fixture.componentInstance.standardDie).toEqual(fixture.componentInstance.standardDice[test]);
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
    
      const customQuantityTestCases = [1, 2, 10, 20, 100, 1000, 10000];

      customQuantityTestCases.forEach(test => {
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
    
      customQuantityTestCases.forEach(test => {
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
        expect(rolledNumber).toBeLessThanOrEqual(20);
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
        expect(expressionTab).toBeDefined();
  
        const expressionInput = expressionTab!.querySelector('#rollExpression') as HTMLInputElement;
        expect(expressionInput).toBeDefined();
        expect(expressionInput?.value).toEqual('3d6+2');
        expect(expressionInput?.hasAttribute('required')).toBeTrue();
        expect(expressionInput?.getAttribute('type')).toEqual('text');
  
        const expressionRollButton = expressionTab!.querySelector('#expressionRollButton');
        expect(expressionRollButton).toBeDefined();
        expect(expressionRollButton?.textContent).toEqual('Roll');
        expect(expressionRollButton?.hasAttribute('disabled')).toBeFalse();
        
        const expressionValidatingSection = expressionTab!.querySelector('#expressionValidating');
        expect(expressionValidatingSection).toBeDefined();
        expect(expressionValidatingSection?.hasAttribute('hidden')).toBeTrue();
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
    
    it(`should format a large roll`, async () => {
      fixture.componentInstance.roll = 9266;

      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;

      const rollSection = compiled.querySelector('#rollSection');
      expect(rollSection).toBeDefined();
      expect(rollSection?.hasAttribute('hidden')).toBeFalse();
      expect(rollSection?.textContent).toEqual('9,266');
    });
  
    it('TODO - MORE TESTS TO WRITE', () => {
      expect('show validating custom').toEqual('');
      expect('show invalid custom - missing custom quantity').toEqual('');
      expect('show invalid custom - too low custom quantity').toEqual('');
      expect('show invalid custom - too high custom quantity').toEqual('');
      expect('show invalid custom - missing custom die').toEqual('');
      expect('show invalid custom - too low custom die').toEqual('');
      expect('show invalid custom - too high custom die').toEqual('');
      expect('show invalid custom - validation fails').toEqual('');
      expect('show rolling custom').toEqual('');
      expect('show custom roll').toEqual('');

      expect('show validating expression').toEqual('');
      expect('show invalid expression - missing').toEqual('');
      expect('show invalid expression - validation fails').toEqual('');
      expect('show rolling expression').toEqual('');
      expect('show expression roll').toEqual('');
    });
  });
});
