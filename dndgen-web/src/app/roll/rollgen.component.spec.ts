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
      const compiled = fixture.nativeElement as HTMLElement;

      const button = compiled!.querySelector(selector);
      expect(button).toBeDefined();
      expect(button?.hasAttribute('disabled')).toBeFalse();

      (button as HTMLButtonElement).click();
    }

    describe('the standard tab', () => {
      it(`should render the standard tab`, () => {
        const compiled = fixture.nativeElement as HTMLElement;
  
        const standardTab = compiled.querySelector('#standard');
        expect(standardTab).toBeDefined();
        
        const standardQuantityInput = standardTab!.querySelector('#standardQuantity') as HTMLInputElement;
        expect(standardQuantityInput).toBeDefined();
        expect(standardQuantityInput?.value).toEqual('1');
        expect(standardQuantityInput?.hasAttribute('required')).toBeTrue();
        expect(standardQuantityInput?.getAttribute('type')).toEqual('number');
        expect(standardQuantityInput?.getAttribute('min')).toEqual('1');
        expect(standardQuantityInput?.getAttribute('max')).toEqual('10000');
        expect(standardQuantityInput?.getAttribute('pattern')).toEqual('^[0-9]+$');
  
        const standardDieSelect = standardTab!.querySelector('#standardDie');
        expect(standardDieSelect).toBeDefined();
        expect(standardDieSelect?.hasAttribute('required')).toBeTrue();
  
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
  
        const standardRollButton = standardTab!.querySelector('#standardRollButton');
        expect(standardRollButton).toBeDefined();
        expect(standardRollButton?.textContent).toEqual('Roll');
        expect(standardRollButton?.hasAttribute('disabled')).toBeFalse();
  
        const standardValidatingSection = standardTab!.querySelector('#standardValidating');
        expect(standardValidatingSection).toBeDefined();
        expect(standardValidatingSection?.hasAttribute('hidden')).toBeTrue();
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
  
        expectInvalid('#standardRollButton', '#standardValidating');
      });
    
      it(`should show that a standard roll is invalid - standard quantity too low`, () => {
        setInput('#standardQuantity', '0');
  
        fixture.detectChanges();
  
        expectInvalid('#standardRollButton', '#standardValidating');
      });
    
      it(`should show that a standard roll is invalid - standard quantity too high`, async () => {
        setInput('#standardQuantity', '10001');
  
        fixture.detectChanges();

        expectValidating('#standardRollButton', '#standardValidating');
  
        //run roll validation
        await waitForService();
  
        expectInvalid('#standardRollButton', '#standardValidating');
      });
    
      it(`should show that a standard roll is invalid - missing standard die`, async () => {
        setSelectByValue('#standardDie', '');
  
        fixture.detectChanges();
  
        expectInvalid('#standardRollButton', '#standardValidating');
      });
    
      it(`should show that a standard roll is valid - non-default standard die`, async () => {
        setSelectByIndex('#standardDie', 3);
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.standardDie).toEqual(fixture.componentInstance.standardDice[3]);
        expectValid('#standardRollButton', '#standardValidating');
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
        expect(customQuantityInput?.hasAttribute('required')).toBeTrue();
        expect(customQuantityInput?.getAttribute('type')).toEqual('number');
        expect(customQuantityInput?.getAttribute('min')).toEqual('1');
        expect(customQuantityInput?.getAttribute('max')).toEqual('10000');
        expect(customQuantityInput?.getAttribute('pattern')).toEqual('^[0-9]+$');
  
        const customDieInput = customTab!.querySelector('#customDie') as HTMLInputElement;
        expect(customDieInput).toBeDefined();
        expect(customDieInput?.value).toEqual('5');
        expect(customDieInput?.hasAttribute('required')).toBeTrue();
        expect(customDieInput?.getAttribute('type')).toEqual('number');
        expect(customDieInput?.getAttribute('min')).toEqual('1');
        expect(customDieInput?.getAttribute('max')).toEqual('10000');
        expect(customDieInput?.getAttribute('pattern')).toEqual('^[0-9]+$');
  
        const customRollButton = customTab!.querySelector('#customRollButton');
        expect(customRollButton).toBeDefined();
        expect(customRollButton?.textContent).toEqual('Roll');
        expect(customRollButton?.hasAttribute('disabled')).toBeFalse();
        
        const customValidatingSection = customTab!.querySelector('#customValidating');
        expect(customValidatingSection).toBeDefined();
        expect(customValidatingSection?.hasAttribute('hidden')).toBeTrue();
      });
    
      it(`should show when validating a custom roll`, () => {
        expect('need to update from standard to custom').toBe('');
        
        const component = fixture.componentInstance;
        component.validating = true;
  
        fixture.detectChanges();
  
        const compiled = fixture.nativeElement as HTMLElement;
  
        const customRollButton = compiled!.querySelector('#customRollButton');
        expect(customRollButton).toBeDefined();
        expect(customRollButton?.textContent).toEqual('Roll');
        expect(customRollButton?.hasAttribute('disabled')).toBeTrue();
  
        const customValidatingSection = compiled!.querySelector('#customValidating');
        expect(customValidatingSection).toBeDefined();
        expect(customValidatingSection?.hasAttribute('hidden')).toBeFalse();
      });
    
      it(`should show that a standard roll is invalid - missing standard quantity`, () => {
        expect('need to update from standard to custom').toBe('');
        
        const compiled = fixture.nativeElement as HTMLElement;
        const standardQuantityInput = compiled!.querySelector('#standardQuantity') as HTMLInputElement;
        standardQuantityInput.value = '';
  
        standardQuantityInput.dispatchEvent(new Event('input'));
  
        fixture.detectChanges();
  
        const standardRollButton = compiled!.querySelector('#standardRollButton');
        expect(standardRollButton).toBeDefined();
        expect(standardRollButton?.textContent).toEqual('Roll');
        expect(standardRollButton?.hasAttribute('disabled')).toBeTrue();
  
        const standardValidatingSection = compiled!.querySelector('#standardValidating');
        expect(standardValidatingSection).toBeDefined();
        expect(standardValidatingSection?.hasAttribute('hidden')).toBeTrue();
      });
    
      it(`should show that a standard roll is invalid - standard quantity too low`, () => {
        expect('need to update from standard to custom').toBe('');
        
        const compiled = fixture.nativeElement as HTMLElement;
        const standardQuantityInput = compiled!.querySelector('#standardQuantity') as HTMLInputElement;
        standardQuantityInput.value = '0';
  
        standardQuantityInput.dispatchEvent(new Event('input'));
  
        fixture.detectChanges();
  
        const standardRollButton = compiled!.querySelector('#standardRollButton');
        expect(standardRollButton).toBeDefined();
        expect(standardRollButton?.textContent).toEqual('Roll');
        expect(standardRollButton?.hasAttribute('disabled')).toBeTrue();
  
        const standardValidatingSection = compiled!.querySelector('#standardValidating');
        expect(standardValidatingSection).toBeDefined();
        expect(standardValidatingSection?.hasAttribute('hidden')).toBeTrue();
      });
    
      it(`should show that a standard roll is invalid - standard quantity too high`, async () => {
        expect('need to update from standard to custom').toBe('');
        
        const compiled = fixture.nativeElement as HTMLElement;
        const standardQuantityInput = compiled!.querySelector('#standardQuantity') as HTMLInputElement;
        standardQuantityInput.value = '10001';
  
        standardQuantityInput.dispatchEvent(new Event('input'));
  
        fixture.detectChanges();
  
        let standardRollButton = compiled!.querySelector('#standardRollButton');
        expect(standardRollButton).toBeDefined();
        expect(standardRollButton?.textContent).toEqual('Roll');
        expect(standardRollButton?.hasAttribute('disabled')).toBeTrue();
  
        let standardValidatingSection = compiled!.querySelector('#standardValidating');
        expect(standardValidatingSection).toBeDefined();
        expect(standardValidatingSection?.hasAttribute('hidden')).toBeFalse();
  
        //run roll validation
        await waitForService();
  
        standardRollButton = compiled!.querySelector('#standardRollButton');
        expect(standardRollButton).toBeDefined();
        expect(standardRollButton?.textContent).toEqual('Roll');
        expect(standardRollButton?.hasAttribute('disabled')).toBeTrue();
  
        standardValidatingSection = compiled!.querySelector('#standardValidating');
        expect(standardValidatingSection).toBeDefined();
        expect(standardValidatingSection?.hasAttribute('hidden')).toBeTrue();
      });
    
      it(`should show that a standard roll is invalid - missing standard die`, async () => {
        expect('need to update from standard to custom').toBe('');
        
        const compiled = fixture.nativeElement as HTMLElement;
        const standardDieSelect = compiled!.querySelector('#standardDie') as HTMLSelectElement;
        standardDieSelect.value = '';
  
        standardDieSelect.dispatchEvent(new Event('change'));
  
        fixture.detectChanges();
  
        let standardRollButton = compiled!.querySelector('#standardRollButton');
        expect(standardRollButton).toBeDefined();
        expect(standardRollButton?.textContent).toEqual('Roll');
        expect(standardRollButton?.hasAttribute('disabled')).toBeTrue();
  
        let standardValidatingSection = compiled!.querySelector('#standardValidating');
        expect(standardValidatingSection).toBeDefined();
        expect(standardValidatingSection?.hasAttribute('hidden')).toBeTrue();
      });
    
      it(`should show that a standard roll is valid - non-default standard die`, async () => {
        expect('need to update from standard to custom').toBe('');
        
        const compiled = fixture.nativeElement as HTMLElement;
        const standardDieSelect = compiled!.querySelector('#standardDie') as HTMLSelectElement;
        standardDieSelect.value = standardDieSelect.options[3].value;
  
        standardDieSelect.dispatchEvent(new Event('change'));
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.standardDie).toEqual(fixture.componentInstance.standardDice[3]);
  
        let standardRollButton = compiled!.querySelector('#standardRollButton');
        expect(standardRollButton).toBeDefined();
        expect(standardRollButton?.textContent).toEqual('Roll');
        expect(standardRollButton?.hasAttribute('disabled')).toBeFalse();
  
        let standardValidatingSection = compiled!.querySelector('#standardValidating');
        expect(standardValidatingSection).toBeDefined();
        expect(standardValidatingSection?.hasAttribute('hidden')).toBeTrue();
      });
    
      it(`should show that a standard roll is invalid - validation fails`, async () => {
        expect('need to update from standard to custom').toBe('');
        
        const compiled = fixture.nativeElement as HTMLElement;
        const standardQuantityInput = compiled!.querySelector('#standardQuantity') as HTMLInputElement;
        standardQuantityInput.value = '66666';
  
        standardQuantityInput.dispatchEvent(new Event('input'));
  
        const standardDieSelect = compiled!.querySelector('#standardDie') as HTMLSelectElement;
        standardDieSelect.value = standardDieSelect.options[4].value;
  
        standardDieSelect.dispatchEvent(new Event('change'));
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.standardDie).toEqual(fixture.componentInstance.standardDice[4]);
  
        let standardRollButton = compiled!.querySelector('#standardRollButton');
        expect(standardRollButton).toBeDefined();
        expect(standardRollButton?.textContent).toEqual('Roll');
        expect(standardRollButton?.hasAttribute('disabled')).toBeTrue();
  
        let standardValidatingSection = compiled!.querySelector('#standardValidating');
        expect(standardValidatingSection).toBeDefined();
        expect(standardValidatingSection?.hasAttribute('hidden')).toBeFalse();
  
        //run roll validation
        await waitForService();
  
        standardRollButton = compiled!.querySelector('#standardRollButton');
        expect(standardRollButton).toBeDefined();
        expect(standardRollButton?.textContent).toEqual('Roll');
        expect(standardRollButton?.hasAttribute('disabled')).toBeTrue();
  
        standardValidatingSection = compiled!.querySelector('#standardValidating');
        expect(standardValidatingSection).toBeDefined();
        expect(standardValidatingSection?.hasAttribute('hidden')).toBeTrue();
      });
    
      it(`should show that a standard roll is valid - validation succeeds`, async () => {
        expect('need to update from standard to custom').toBe('');
        
        const compiled = fixture.nativeElement as HTMLElement;
        const standardQuantityInput = compiled!.querySelector('#standardQuantity') as HTMLInputElement;
        standardQuantityInput.value = '9266';
  
        standardQuantityInput.dispatchEvent(new Event('input'));
  
        const standardDieSelect = compiled!.querySelector('#standardDie') as HTMLSelectElement;
        standardDieSelect.value = standardDieSelect.options[5].value;
  
        standardDieSelect.dispatchEvent(new Event('change'));
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.standardDie).toEqual(fixture.componentInstance.standardDice[5]);
  
        let standardRollButton = compiled!.querySelector('#standardRollButton');
        expect(standardRollButton).toBeDefined();
        expect(standardRollButton?.textContent).toEqual('Roll');
        expect(standardRollButton?.hasAttribute('disabled')).toBeTrue();
  
        let standardValidatingSection = compiled!.querySelector('#standardValidating');
        expect(standardValidatingSection).toBeDefined();
        expect(standardValidatingSection?.hasAttribute('hidden')).toBeFalse();
  
        //run roll validation
        await waitForService();
  
        standardRollButton = compiled!.querySelector('#standardRollButton');
        expect(standardRollButton).toBeDefined();
        expect(standardRollButton?.textContent).toEqual('Roll');
        expect(standardRollButton?.hasAttribute('disabled')).toBeFalse();
  
        standardValidatingSection = compiled!.querySelector('#standardValidating');
        expect(standardValidatingSection).toBeDefined();
        expect(standardValidatingSection?.hasAttribute('hidden')).toBeTrue();
      });
    
      it(`should roll the default standard roll`, async () => {
        expect('need to update from standard to custom').toBe('');
        
        const compiled = fixture.nativeElement as HTMLElement;

        let standardRollButton = compiled!.querySelector('#standardRollButton');
        expect(standardRollButton).toBeDefined();
        expect(standardRollButton?.hasAttribute('disabled')).toBeFalse();

        (standardRollButton as HTMLButtonElement).click();
  
        fixture.detectChanges();
        
        standardRollButton = compiled!.querySelector('#standardRollButton');
        expect(standardRollButton).toBeDefined();
        expect(standardRollButton?.hasAttribute('disabled')).toBeTrue();
  
        let standardValidatingSection = compiled!.querySelector('#standardValidating');
        expect(standardValidatingSection).toBeDefined();
        expect(standardValidatingSection?.hasAttribute('hidden')).toBeTrue();

        let rollSection = compiled.querySelector('#rollSection');
        expect(rollSection).toBeDefined();
        expect(rollSection?.textContent).toEqual('0');
        expect(rollSection?.hasAttribute('hidden')).toBeTrue();
  
        let rollingSection = compiled.querySelector('#rollingSection');
        expect(rollingSection).toBeDefined();
        expect(rollingSection?.hasAttribute('hidden')).toBeFalse();
  
        //run roll
        await waitForService();
  
        standardRollButton = compiled!.querySelector('#standardRollButton');
        expect(standardRollButton).toBeDefined();
        expect(standardRollButton?.textContent).toEqual('Roll');
        expect(standardRollButton?.hasAttribute('disabled')).toBeFalse();
  
        standardValidatingSection = compiled!.querySelector('#standardValidating');
        expect(standardValidatingSection).toBeDefined();
        expect(standardValidatingSection?.hasAttribute('hidden')).toBeTrue();

        rollSection = compiled.querySelector('#rollSection');
        expect(rollSection).toBeDefined();
        expect(rollSection?.hasAttribute('hidden')).toBeFalse();

        const rolledNumber = new Number(rollSection?.textContent);
        expect(rolledNumber).toBeGreaterThanOrEqual(1);
        expect(rolledNumber).toBeLessThanOrEqual(20);
  
        rollingSection = compiled.querySelector('#rollingSection');
        expect(rollingSection).toBeDefined();
        expect(rollingSection?.hasAttribute('hidden')).toBeTrue();
      });
    
      it(`should roll a non-default standard roll`, async () => {
        expect('need to update from standard to custom').toBe('');
        
        const compiled = fixture.nativeElement as HTMLElement;
        const standardQuantityInput = compiled!.querySelector('#standardQuantity') as HTMLInputElement;
        standardQuantityInput.value = '42';
  
        standardQuantityInput.dispatchEvent(new Event('input'));
  
        const standardDieSelect = compiled!.querySelector('#standardDie') as HTMLSelectElement;
        standardDieSelect.value = standardDieSelect.options[2].value;
  
        standardDieSelect.dispatchEvent(new Event('change'));
  
        fixture.detectChanges();

        //run validation
        await waitForService();
  
        let standardRollButton = compiled!.querySelector('#standardRollButton');
        expect(standardRollButton).toBeDefined();
        expect(standardRollButton?.hasAttribute('disabled')).toBeFalse();

        (standardRollButton as HTMLButtonElement).click();
  
        fixture.detectChanges();
        
        standardRollButton = compiled!.querySelector('#standardRollButton');
        expect(standardRollButton).toBeDefined();
        expect(standardRollButton?.hasAttribute('disabled')).toBeTrue();
  
        let standardValidatingSection = compiled!.querySelector('#standardValidating');
        expect(standardValidatingSection).toBeDefined();
        expect(standardValidatingSection?.hasAttribute('hidden')).toBeTrue();

        let rollSection = compiled.querySelector('#rollSection');
        expect(rollSection).toBeDefined();
        expect(rollSection?.textContent).toEqual('0');
        expect(rollSection?.hasAttribute('hidden')).toBeTrue();
  
        let rollingSection = compiled.querySelector('#rollingSection');
        expect(rollingSection).toBeDefined();
        expect(rollingSection?.hasAttribute('hidden')).toBeFalse();
  
        //run roll
        await waitForService();
  
        standardRollButton = compiled!.querySelector('#standardRollButton');
        expect(standardRollButton).toBeDefined();
        expect(standardRollButton?.textContent).toEqual('Roll');
        expect(standardRollButton?.hasAttribute('disabled')).toBeFalse();
  
        standardValidatingSection = compiled!.querySelector('#standardValidating');
        expect(standardValidatingSection).toBeDefined();
        expect(standardValidatingSection?.hasAttribute('hidden')).toBeTrue();

        rollSection = compiled.querySelector('#rollSection');
        expect(rollSection).toBeDefined();
        expect(rollSection?.hasAttribute('hidden')).toBeFalse();

        const rolledNumber = new Number(rollSection?.textContent);
        expect(rolledNumber).toBeGreaterThanOrEqual(42);
        expect(rolledNumber).toBeLessThanOrEqual(42 * 4);
  
        rollingSection = compiled.querySelector('#rollingSection');
        expect(rollingSection).toBeDefined();
        expect(rollingSection?.hasAttribute('hidden')).toBeTrue();
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
