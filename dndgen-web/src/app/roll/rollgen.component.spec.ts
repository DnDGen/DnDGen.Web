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
      expect(component.customDie).toEqual(1);
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
    });
  
    it('should create the component', () => {
      const component = fixture.componentInstance;
      expect(component).toBeTruthy();
    });
  
    it(`should render the tabs`, done => {
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        const compiled = fixture.debugElement.nativeElement as HTMLElement;
  
        const tabLinks = compiled.querySelectorAll('ul.nav-tabs > a.nav-link');
        expect(tabLinks).toBeDefined();
        expect(tabLinks?.length).toEqual(3);
        expect(tabLinks?.item(0).textContent).toEqual('Standard');
        expect(tabLinks?.item(0).getAttribute('class')).toContain('active');
        expect(tabLinks?.item(0).getAttribute('href')).toEqual('standard');
        expect(tabLinks?.item(1).textContent).toEqual('Custom');
        expect(tabLinks?.item(1).getAttribute('class')).not.toContain('active');
        expect(tabLinks?.item(1).getAttribute('href')).toEqual('custom');
        expect(tabLinks?.item(2).textContent).toEqual('Expression');
        expect(tabLinks?.item(2).getAttribute('class')).not.toContain('active');
        expect(tabLinks?.item(2).getAttribute('href')).toEqual('expression');

        done();
      });
    });
  
    it(`should render the standard tab`, done => {
      fixture.componentInstance.ngOnInit();

      fixture.detectChanges();
      fixture.whenStable().then(() => {
        const compiled = fixture.debugElement.nativeElement as HTMLElement;
  
        const standardTab = compiled.querySelector('#standard');
        expect(standardTab).toBeDefined();
        
        const standardQuantityInput = standardTab!.querySelector('#standardQuantity');
        expect(standardQuantityInput).toBeDefined();
        expect(standardQuantityInput?.textContent).toEqual('1');
        expect(standardQuantityInput?.getAttribute('required')).toBeDefined();
        expect(standardQuantityInput?.getAttribute('min')).toEqual('1');
        expect(standardQuantityInput?.getAttribute('max')).toEqual('10000');
        expect(standardQuantityInput?.getAttribute('type')).toEqual('number');
        expect(standardQuantityInput?.getAttribute('pattern')).toEqual('^[0-9]+$');
  
        const standardRolls = standardTab!.querySelectorAll('#standard > #standardRolls > option');
        expect(standardRolls).toBeDefined();
        expect(standardRolls?.length).toEqual(9);
        expect(standardRolls?.item(0).getAttribute('value')).toEqual('2');
        expect(standardRolls?.item(0).textContent).toEqual('2');
        expect(standardRolls?.item(0).getAttribute('selected')).not.toBeDefined();
        expect(standardRolls?.item(1).getAttribute('value')).toEqual('3');
        expect(standardRolls?.item(1).textContent).toEqual('3');
        expect(standardRolls?.item(1).getAttribute('selected')).not.toBeDefined();
        expect(standardRolls?.item(2).getAttribute('value')).toEqual('4');
        expect(standardRolls?.item(2).textContent).toEqual('4');
        expect(standardRolls?.item(2).getAttribute('selected')).not.toBeDefined();
        expect(standardRolls?.item(3).getAttribute('value')).toEqual('6');
        expect(standardRolls?.item(3).textContent).toEqual('6');
        expect(standardRolls?.item(3).getAttribute('selected')).not.toBeDefined();
        expect(standardRolls?.item(4).getAttribute('value')).toEqual('8');
        expect(standardRolls?.item(4).textContent).toEqual('8');
        expect(standardRolls?.item(4).getAttribute('selected')).not.toBeDefined();
        expect(standardRolls?.item(5).getAttribute('value')).toEqual('10');
        expect(standardRolls?.item(5).textContent).toEqual('10');
        expect(standardRolls?.item(5).getAttribute('selected')).not.toBeDefined();
        expect(standardRolls?.item(6).getAttribute('value')).toEqual('12');
        expect(standardRolls?.item(6).textContent).toEqual('12');
        expect(standardRolls?.item(6).getAttribute('selected')).not.toBeDefined();
        expect(standardRolls?.item(7).getAttribute('value')).toEqual('20');
        expect(standardRolls?.item(7).textContent).toEqual('20');
        expect(standardRolls?.item(7).getAttribute('selected')).toBeDefined();
        expect(standardRolls?.item(8).getAttribute('value')).toEqual('100');
        expect(standardRolls?.item(8).textContent).toEqual('Percentile');
        expect(standardRolls?.item(8).getAttribute('selected')).not.toBeDefined();
  
        const standardRollButton = standardTab!.querySelector('#standard > #standardRollButton');
        expect(standardRollButton).toBeDefined();
        expect(standardRollButton?.textContent).toEqual('Roll');
        expect(standardRollButton?.getAttribute('disabled')).not.toBeDefined();
  
        const standardValidatingSection = standardTab!.querySelector('#standard > #standardValidating');
        expect(standardValidatingSection).toBeDefined();
        expect(standardValidatingSection?.getAttribute('hidden')).toBeDefined();

        done();
      });
    });
  
    it(`should render the custom tab`, done => {
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        const compiled = fixture.debugElement.nativeElement as HTMLElement;
  
        const customTab = compiled.querySelector('#custom');
        expect(customTab).toBeDefined();
  
        const customQuantityInput = customTab!.querySelector('#customQuantity');
        expect(customQuantityInput).toBeDefined();
        expect(customQuantityInput?.textContent).toEqual('1');
        expect(customQuantityInput?.getAttribute('required')).toBeDefined();
        expect(customQuantityInput?.getAttribute('min')).toEqual('1');
        expect(customQuantityInput?.getAttribute('max')).toEqual('10000');
        expect(customQuantityInput?.getAttribute('type')).toEqual('number');
        expect(customQuantityInput?.getAttribute('pattern')).toEqual('^[0-9]+$');
  
        //expect(component.customDie).toEqual(1);
        expect('custom die input assertions').toEqual('');
  
        const customRollButton = customTab!.querySelector('#customRollButton');
        expect(customRollButton).toBeDefined();
        expect(customRollButton?.textContent).toEqual('Roll');
        expect(customRollButton?.getAttribute('disabled')).not.toBeDefined();
        
        const customValidatingSection = customTab!.querySelector('#customValidating');
        expect(customValidatingSection).toBeDefined();
        expect(customValidatingSection?.getAttribute('hidden')).toBeDefined();

        done();
      });
    });
  
    it(`should render the expression tab`, done => {
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        const compiled = fixture.debugElement.nativeElement as HTMLElement;
  
        const expressionTab = compiled.querySelector('#expression');
        expect(expressionTab).toBeDefined();
  
        //expect(component.expression).toEqual('3d6+2');
        expect('expression input assertions').toEqual('');
  
        const expressionRollButton = expressionTab!.querySelector('#expressionRollButton');
        expect(expressionRollButton).toBeDefined();
        expect(expressionRollButton?.textContent).toEqual('Roll');
        expect(expressionRollButton?.getAttribute('disabled')).not.toBeDefined();
        
        const expressionValidatingSection = expressionTab!.querySelector('#expressionValidating');
        expect(expressionValidatingSection).toBeDefined();
        expect(expressionValidatingSection?.getAttribute('hidden')).toBeDefined();

        done();
      });
    });
  
    it(`should render the initial roll`, done => {
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        const compiled = fixture.debugElement.nativeElement as HTMLElement;
  
        const rollSection = compiled.querySelector('#rollSection');
        expect(rollSection).toBeDefined();
        expect(rollSection?.textContent).toEqual('0');
        expect(rollSection?.getAttribute('hidden')).not.toBeDefined();
  
        const rollingSection = compiled.querySelector('#rollingSection');
        expect(rollingSection).toBeDefined();
        expect(rollingSection?.getAttribute('hidden')).toBeDefined();

        done();
      });
    });
  
    it('TODO - MORE TESTS TO WRITE', () => {
      expect('show validating standard').toEqual('');
      expect('show invalid standard - missing standard quantity').toEqual('');
      expect('show invalid standard - too low standard quantity').toEqual('');
      expect('show invalid standard - too high standard quantity').toEqual('');
      expect('show invalid standard - missing standard die').toEqual('');
      expect('show invalid standard - validation fails').toEqual('');
      expect('show rolling standard').toEqual('');
      expect('show standard roll').toEqual('');

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
