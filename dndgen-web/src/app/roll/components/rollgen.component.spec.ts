﻿import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RollGenComponent } from './rollgen.component';
import { RollService } from '../services/roll.service';
import { SweetAlertService } from '../../shared/services/sweet-alert.service';
import { LoggerService } from '../../shared/services/logger.service';
import { Observable, of } from 'rxjs';
import { RollGenViewModel } from '../models/rollgen-view-model.model';
import { Size } from '../../shared/components/size.enum';
import { TestHelper } from '../../test-helper';

describe('RollGen Component', () => {
  describe('unit', () => {
    let component: RollGenComponent;
    let rollServiceSpy: {
      getViewModel: ReturnType<typeof vi.fn>,
      getRoll: ReturnType<typeof vi.fn>,
      validateRoll: ReturnType<typeof vi.fn>,
      getExpressionRoll: ReturnType<typeof vi.fn>,
      validateExpression: ReturnType<typeof vi.fn>
    };
    let sweetAlertServiceSpy: { showError: ReturnType<typeof vi.fn> };
    let loggerServiceSpy: { logError: ReturnType<typeof vi.fn> };

    const delay = 10;

    function getFakeDelay<T>(response: T): Observable<T> {
      return new Observable((observer) => {
        setTimeout(() => {
          observer.next(response);
          observer.complete();
        }, delay);
      });
    }

    function getFakeError<T>(message: string): Observable<T> {
      return new Observable((observer) => {
        setTimeout(() => {
          observer.error(new Error(message));
        }, delay);
      });
    }

    function setupInit() {
      const model = new RollGenViewModel(9266, 90210, 42, 600);
      rollServiceSpy.getViewModel.mockReturnValue(of(model));
      component.ngOnInit();
    }

    beforeEach(() => {
      vi.useFakeTimers();

      rollServiceSpy = {
        getViewModel: vi.fn(),
        getRoll: vi.fn(),
        validateRoll: vi.fn(),
        getExpressionRoll: vi.fn(),
        validateExpression: vi.fn(),
      };
      sweetAlertServiceSpy = { showError: vi.fn() };
      loggerServiceSpy = { logError: vi.fn() };

      component = new RollGenComponent(
        rollServiceSpy as unknown as RollService,
        sweetAlertServiceSpy as unknown as SweetAlertService,
        loggerServiceSpy as unknown as LoggerService
      );
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it(`should initialize the public properties`, () => {
      expect(component.rolling()).toBe(false);
      expect(component.loading()).toBe(false);
      expect(component.validating()).toBe(false);
      expect(component.rollIsValid()).toBe(true);
      expect(component.roll()).toEqual(0);
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

    it('should be loading while fetching the roll model', async () => {
      const model = new RollGenViewModel(9266, 90210, 42, 600);
      rollServiceSpy.getViewModel.mockImplementation(() => getFakeDelay(model));

      component.ngOnInit();

      expect(component.rollModel()).not.toBeDefined();
      expect(component.loading()).toBe(true);

      await vi.advanceTimersByTimeAsync(delay - 1);

      expect(component.rollModel()).not.toBeDefined();
      expect(component.loading()).toBe(true);

      await vi.advanceTimersByTimeAsync(delay + 1);
    });

    it('should set the roll model on init', async () => {
      const model = new RollGenViewModel(9266, 90210, 42, 600);
      rollServiceSpy.getViewModel.mockImplementation(() => getFakeDelay(model));

      component.ngOnInit();

      expect(component.rollModel()).not.toBeDefined();
      expect(component.loading()).toBe(true);

      await vi.advanceTimersByTimeAsync(delay);

      expect(component.rollModel()).toEqual(model);
      expect(component.loading()).toBe(false);
    });

    it('should display error from getting roll model', async () => {
      rollServiceSpy.getViewModel.mockImplementation(() => getFakeError('I failed'));

      component.ngOnInit();
      await vi.advanceTimersByTimeAsync(delay);

      expect(component.rollModel()).not.toBeDefined();
      expect(component.roll()).toEqual(0);
      expect(component.rolling()).toBe(false);
      expect(component.loading()).toBe(false);
      expect(component.validating()).toBe(false);

      expect(loggerServiceSpy.logError).toHaveBeenCalledWith('I failed');
      expect(sweetAlertServiceSpy.showError).toHaveBeenCalledTimes(1);
    });

    it('should validate a roll - invalid if no quantity', () => {
      component.validateRoll(0, 90210);
      expect(component.validating()).toBe(false);
      expect(component.rollIsValid()).toBe(false);
    });

    it('should validate a roll - invalid if no die', () => {
      component.validateRoll(9266, 0);
      expect(component.validating()).toBe(false);
      expect(component.rollIsValid()).toBe(false);
    });

    it('should be validating while validating the roll', async () => {
      rollServiceSpy.validateRoll.mockImplementation(() => getFakeDelay(true));

      component.validateRoll(9266, 90210);

      expect(rollServiceSpy.validateRoll).toHaveBeenCalledWith(9266, 90210);
      expect(component.validating()).toBe(true);

      await vi.advanceTimersByTimeAsync(delay / 2);

      expect(component.validating()).toBe(true);

      await vi.advanceTimersByTimeAsync(delay + 1);
    });

    it('should validate a valid roll', async () => {
      rollServiceSpy.validateRoll.mockImplementation(() => getFakeDelay(true));

      component.validateRoll(9266, 90210);

      expect(rollServiceSpy.validateRoll).toHaveBeenCalledWith(9266, 90210);
      expect(component.validating()).toBe(true);

      await vi.advanceTimersByTimeAsync(delay);

      expect(component.rollIsValid()).toBe(true);
      expect(component.validating()).toBe(false);
    });

    it('should validate an invalid roll', async () => {
      rollServiceSpy.validateRoll.mockImplementation(() => getFakeDelay(false));

      component.validateRoll(9266, 90210);

      expect(rollServiceSpy.validateRoll).toHaveBeenCalledWith(9266, 90210);
      expect(component.validating()).toBe(true);

      await vi.advanceTimersByTimeAsync(delay);

      expect(component.rollIsValid()).toBe(false);
      expect(component.validating()).toBe(false);
    });

    it('should display error from validating roll', async () => {
      rollServiceSpy.validateRoll.mockImplementation(() => getFakeError('I failed'));

      component.validateRoll(9266, 90210);
      await vi.advanceTimersByTimeAsync(delay);

      expect(component.rollIsValid()).toBe(false);
      expect(component.roll()).toEqual(0);
      expect(component.rolling()).toBe(false);
      expect(component.loading()).toBe(false);
      expect(component.validating()).toBe(false);

      expect(rollServiceSpy.validateRoll).toHaveBeenCalledWith(9266, 90210);
      expect(loggerServiceSpy.logError).toHaveBeenCalledWith('I failed');
      expect(sweetAlertServiceSpy.showError).toHaveBeenCalledTimes(1);
    });

    it('should be rolling while rolling a standard roll', async () => {
      rollServiceSpy.getRoll.mockImplementation(() => getFakeDelay(90210));

      component.rollStandard();

      expect(rollServiceSpy.getRoll).toHaveBeenCalledWith(1, 20);
      expect(component.rolling()).toBe(true);

      await vi.advanceTimersByTimeAsync(delay / 2);

      expect(component.rolling()).toBe(true);

      await vi.advanceTimersByTimeAsync(delay + 1);
    });

    it('should roll the default standard roll', async () => {
      rollServiceSpy.getRoll.mockImplementation(() => getFakeDelay(90210));

      component.rollStandard();

      expect(rollServiceSpy.getRoll).toHaveBeenCalledWith(1, 20);
      expect(component.rolling()).toBe(true);

      await vi.advanceTimersByTimeAsync(delay);

      expect(component.roll()).toBe(90210);
      expect(component.rolling()).toBe(false);
    });

    const standardDieIndicesTestCases = Array.from(Array(9).keys());

    standardDieIndicesTestCases.forEach(test => {
      it(`should roll a non-default standard roll - standard die index ${test}`, async () => {
        rollServiceSpy.getRoll.mockImplementation(() => getFakeDelay(90210));

        component.standardQuantity = 9266;
        component.standardDie = component.standardDice[test];

        component.rollStandard();

        expect(rollServiceSpy.getRoll).toHaveBeenCalledWith(9266, component.standardDice[test].die);
        expect(component.rolling()).toBe(true);

        await vi.advanceTimersByTimeAsync(delay);

        expect(component.roll()).toBe(90210);
        expect(component.rolling()).toBe(false);
      });
    });

    it('should display error from rolling a standard roll', async () => {
      rollServiceSpy.getRoll.mockImplementation(() => getFakeError('I failed'));

      component.rollStandard();
      await vi.advanceTimersByTimeAsync(delay);

      expect(component.roll()).toEqual(0);
      expect(component.rolling()).toBe(false);
      expect(component.loading()).toBe(false);
      expect(component.validating()).toBe(false);

      expect(rollServiceSpy.getRoll).toHaveBeenCalledWith(1, 20);
      expect(loggerServiceSpy.logError).toHaveBeenCalledWith('I failed');
      expect(sweetAlertServiceSpy.showError).toHaveBeenCalledTimes(1);
    });

    it('should be rolling while rolling a custom roll', async () => {
      rollServiceSpy.getRoll.mockImplementation(() => getFakeDelay(90210));

      component.rollCustom();

      expect(rollServiceSpy.getRoll).toHaveBeenCalledWith(1, 5);
      expect(component.rolling()).toBe(true);

      await vi.advanceTimersByTimeAsync(delay / 2);

      expect(component.rolling()).toBe(true);

      await vi.advanceTimersByTimeAsync(delay + 1);
    });

    it('should roll the default custom roll', async () => {
      rollServiceSpy.getRoll.mockImplementation(() => getFakeDelay(90210));

      component.rollCustom();

      expect(rollServiceSpy.getRoll).toHaveBeenCalledWith(1, 5);
      expect(component.rolling()).toBe(true);

      await vi.advanceTimersByTimeAsync(delay);

      expect(component.roll()).toBe(90210);
      expect(component.rolling()).toBe(false);
    });

    it(`should roll a non-default custom roll`, async () => {
      rollServiceSpy.getRoll.mockImplementation(() => getFakeDelay(90210));

      component.customQuantity = 9266;
      component.customDie = 42;

      component.rollCustom();

      expect(rollServiceSpy.getRoll).toHaveBeenCalledWith(9266, 42);
      expect(component.rolling()).toBe(true);

      await vi.advanceTimersByTimeAsync(delay);

      expect(component.roll()).toBe(90210);
      expect(component.rolling()).toBe(false);
    });

    it('should display error from rolling a custom roll', async () => {
      rollServiceSpy.getRoll.mockImplementation(() => getFakeError('I failed'));

      component.rollCustom();
      await vi.advanceTimersByTimeAsync(delay);

      expect(component.roll()).toEqual(0);
      expect(component.rolling()).toBe(false);
      expect(component.loading()).toBe(false);
      expect(component.validating()).toBe(false);

      expect(rollServiceSpy.getRoll).toHaveBeenCalledWith(1, 5);
      expect(loggerServiceSpy.logError).toHaveBeenCalledWith('I failed');
      expect(sweetAlertServiceSpy.showError).toHaveBeenCalledTimes(1);
    });

    it('should validate a expression - invalid if empty', () => {
      component.validateExpression('');
      expect(component.validating()).toBe(false);
      expect(component.rollIsValid()).toBe(false);
    });

    it('should pause before submitting expression for validation', async () => {
      component.validateExpression('my expression');

      expect(component.validating()).toBe(true);
      expect(rollServiceSpy.validateExpression).not.toHaveBeenCalled();

      await vi.advanceTimersByTimeAsync(500 - 1);
      expect(rollServiceSpy.validateExpression).not.toHaveBeenCalled();

      await vi.advanceTimersByTimeAsync(501);
    });

    it('should wait for typing to stop before submitting expression for validation', async () => {
      setupInit();
      rollServiceSpy.validateExpression.mockImplementation(() => getFakeDelay(true));

      component.validateExpression('my expression');
      expect(component.validating()).toBe(true);
      expect(rollServiceSpy.validateExpression).not.toHaveBeenCalled();

      await vi.advanceTimersByTimeAsync(500 - 1);

      component.validateExpression('my other expression');
      expect(component.validating()).toBe(true);
      expect(rollServiceSpy.validateExpression).not.toHaveBeenCalled();

      await vi.advanceTimersByTimeAsync(500 - 1);

      expect(component.validating()).toBe(true);
      expect(rollServiceSpy.validateExpression).not.toHaveBeenCalled();

      await vi.advanceTimersByTimeAsync(1);

      expect(rollServiceSpy.validateExpression).toHaveBeenCalledWith('my other expression');
      expect(rollServiceSpy.validateExpression).toHaveBeenCalledTimes(1);

      await vi.advanceTimersByTimeAsync(delay + 1);
    });

    it('should be validating while validating the expression', async () => {
      setupInit();
      rollServiceSpy.validateExpression.mockImplementation(() => getFakeDelay(true));

      component.validateExpression('my expression');
      expect(component.validating()).toBe(true);

      await vi.advanceTimersByTimeAsync(500);

      expect(rollServiceSpy.validateExpression).toHaveBeenCalledWith('my expression');

      await vi.advanceTimersByTimeAsync(delay / 2);

      expect(component.validating()).toBe(true);

      await vi.advanceTimersByTimeAsync(delay + 1);
    });

    it('should validate a valid expression', async () => {
      setupInit();
      rollServiceSpy.validateExpression.mockImplementation(() => getFakeDelay(true));

      component.validateExpression('my expression');
      expect(component.validating()).toBe(true);

      await vi.advanceTimersByTimeAsync(500);

      expect(rollServiceSpy.validateExpression).toHaveBeenCalledWith('my expression');

      await vi.advanceTimersByTimeAsync(delay);

      expect(component.rollIsValid()).toBe(true);
      expect(component.validating()).toBe(false);
    });

    it('should validate an invalid expression', async () => {
      setupInit();
      rollServiceSpy.validateExpression.mockImplementation(() => getFakeDelay(false));

      component.validateExpression('my expression');
      expect(component.validating()).toBe(true);

      await vi.advanceTimersByTimeAsync(500);

      expect(rollServiceSpy.validateExpression).toHaveBeenCalledWith('my expression');

      await vi.advanceTimersByTimeAsync(delay);

      expect(component.rollIsValid()).toBe(false);
      expect(component.validating()).toBe(false);
    });

    it('should handle error from validating expression', async () => {
      setupInit();
      rollServiceSpy.validateExpression.mockImplementation(() => getFakeError('I failed'));

      component.validateExpression('my expression');
      await vi.advanceTimersByTimeAsync(500 + delay);

      expect(component.rollIsValid()).toBe(false);
      expect(component.roll()).toEqual(0);
      expect(component.rolling()).toBe(false);
      expect(component.loading()).toBe(false);
      expect(component.validating()).toBe(false);

      expect(rollServiceSpy.validateExpression).toHaveBeenCalledWith('my expression');
      expect(loggerServiceSpy.logError).not.toHaveBeenCalled();
      expect(sweetAlertServiceSpy.showError).not.toHaveBeenCalled();
    });

    it('should handle expression validation error, then continue validating', async () => {
      setupInit();
      rollServiceSpy.validateExpression.mockImplementation(() => getFakeError('I failed'));

      component.validateExpression('my bad expression');
      await vi.advanceTimersByTimeAsync(500 + delay);

      expect(rollServiceSpy.validateExpression).toHaveBeenCalledWith('my bad expression');
      expect(loggerServiceSpy.logError).not.toHaveBeenCalled();
      expect(sweetAlertServiceSpy.showError).not.toHaveBeenCalled();

      expect(component.validating()).toBe(false);
      expect(component.rollIsValid()).toBe(false);

      rollServiceSpy.validateExpression.mockImplementation(() => getFakeDelay(true));

      component.validateExpression('my expression');
      await vi.advanceTimersByTimeAsync(500 + delay);

      expect(rollServiceSpy.validateExpression).toHaveBeenCalledWith('my expression');
      expect(loggerServiceSpy.logError).not.toHaveBeenCalled();
      expect(sweetAlertServiceSpy.showError).not.toHaveBeenCalled();

      expect(component.validating()).toBe(false);
      expect(component.rollIsValid()).toBe(true);
    });

    it('should be rolling while rolling an expression', async () => {
      rollServiceSpy.getExpressionRoll.mockImplementation(() => getFakeDelay(90210));

      component.rollExpression();

      expect(rollServiceSpy.getExpressionRoll).toHaveBeenCalledWith('4d6k3+2');
      expect(component.rolling()).toBe(true);

      await vi.advanceTimersByTimeAsync(delay / 2);

      expect(component.rolling()).toBe(true);

      await vi.advanceTimersByTimeAsync(delay + 1);
    });

    it('should roll the default expression', async () => {
      rollServiceSpy.getExpressionRoll.mockImplementation(() => getFakeDelay(90210));

      component.rollExpression();

      expect(rollServiceSpy.getExpressionRoll).toHaveBeenCalledWith('4d6k3+2');
      expect(component.rolling()).toBe(true);

      await vi.advanceTimersByTimeAsync(delay);

      expect(component.roll()).toBe(90210);
      expect(component.rolling()).toBe(false);
    });

    it(`should roll a non-default expression`, async () => {
      rollServiceSpy.getExpressionRoll.mockImplementation(() => getFakeDelay(90210));

      component.expression = 'my custom expression';

      component.rollExpression();

      expect(rollServiceSpy.getExpressionRoll).toHaveBeenCalledWith('my custom expression');
      expect(component.rolling()).toBe(true);

      await vi.advanceTimersByTimeAsync(delay);

      expect(component.roll()).toBe(90210);
      expect(component.rolling()).toBe(false);
    });

    it('should display error from rolling an expression', async () => {
      rollServiceSpy.getExpressionRoll.mockImplementation(() => getFakeError('I failed'));

      component.rollExpression();
      await vi.advanceTimersByTimeAsync(delay);

      expect(component.roll()).toEqual(0);
      expect(component.rolling()).toBe(false);
      expect(component.loading()).toBe(false);
      expect(component.validating()).toBe(false);

      expect(rollServiceSpy.getExpressionRoll).toHaveBeenCalledWith('4d6k3+2');
      expect(loggerServiceSpy.logError).toHaveBeenCalledWith('I failed');
      expect(sweetAlertServiceSpy.showError).toHaveBeenCalledTimes(1);
    });
  });
  describe('integration', () => {
    let fixture: ComponentFixture<RollGenComponent>;
    let helper: TestHelper<RollGenComponent>;

    beforeEach(async () => {
      await TestHelper.configureTestBed([RollGenComponent]);

      fixture = TestBed.createComponent(RollGenComponent);
      helper = new TestHelper(fixture);

      //run ngOnInit
      await helper.waitForChangeDetection();
    });

    it('should create the component', () => {
      const component = fixture.componentInstance;
      expect(component).toBeTruthy();
    });

    it('should show the loading component when loading', async () => {
      const component = fixture.componentInstance;
      component.loading.set(true);

      await helper.waitForChangeDetection();

      helper.expectLoading('dndgen-loading', true, Size.Large);
    });

    it('should hide the loading component when not loading', async () => {
      const component = fixture.componentInstance;
      component.loading.set(false);

      await helper.waitForChangeDetection();

      helper.expectLoading('dndgen-loading', false, Size.Large);
    });

    it(`should set the roll model on init`, () => {
      const component = fixture.componentInstance;
      const viewModel = component.rollModel();
      expect(viewModel).toBeDefined();
      expect(viewModel!.quantityLimit_Lower).toEqual(1);
      expect(viewModel!.quantityLimit_Upper).toEqual(10000);
      expect(viewModel!.dieLimit_Lower).toEqual(1);
      expect(viewModel!.dieLimit_Upper).toEqual(10000);
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

      it(`should show when validating a standard roll`, async () => {
        const component = fixture.componentInstance;
        component.validating.set(true);

        await helper.waitForChangeDetection();

        helper.expectValidating(component.validating(), '#standardRollButton', '#standardValidating');
      });

      it(`should show that a standard roll is invalid - missing standard quantity`, async () => {
        helper.setInput('#standardQuantity', '');

        expect(fixture.componentInstance.standardQuantity).toBeNull();
        helper.expectInvalid(fixture.componentInstance.validating(), fixture.componentInstance.rollIsValid(), '#standardRollButton', '#standardValidating');
      });

      it(`should show that a standard roll is invalid - standard quantity invalid`, async () => {
        helper.setInput('#standardQuantity', 'wrong');

        expect(fixture.componentInstance.standardQuantity).toBeNull();
        helper.expectInvalid(fixture.componentInstance.validating(), fixture.componentInstance.rollIsValid(), '#standardRollButton', '#standardValidating');
      });

      it(`should show that a standard roll is invalid - standard quantity too low`, async () => {
        helper.setInput('#standardQuantity', '0');

        expect(fixture.componentInstance.standardQuantity).toEqual(0);
        helper.expectInvalid(fixture.componentInstance.validating(), fixture.componentInstance.rollIsValid(), '#standardRollButton', '#standardValidating');
      });

      it(`should show that a standard roll is invalid - standard quantity too high`, async () => {
        helper.setInput('#standardQuantity', '10001');

        expect(fixture.componentInstance.standardQuantity).toEqual(10001);
        helper.expectValidating(fixture.componentInstance.validating(), '#standardRollButton', '#standardValidating');

        //run roll validation
        await helper.waitForChangeDetection();

        helper.expectInvalid(fixture.componentInstance.validating(), fixture.componentInstance.rollIsValid(), '#standardRollButton', '#standardValidating');
      });

      const standardQuantityTestCases = [1, 2, 10, 20, 100, 1000, 10000];

      standardQuantityTestCases.forEach(test => {
        it(`should show that a standard roll is valid - standard quantity ${test}`, async () => {
          helper.setInput('#standardQuantity', test.toString());

          expect(fixture.componentInstance.standardQuantity).toEqual(test);
          helper.expectValidating(fixture.componentInstance.validating(), '#standardRollButton', '#standardValidating');

          //run roll validation
          await helper.waitForChangeDetection();

          helper.expectValid(fixture.componentInstance.validating(), fixture.componentInstance.rollIsValid(), '#standardRollButton', '#standardValidating');
        });
      });

      it(`should show that a standard roll is invalid - missing standard die`, async () => {
        helper.setSelectByValue('#standardDie', '');

        helper.expectInvalid(fixture.componentInstance.validating(), fixture.componentInstance.rollIsValid(), '#standardRollButton', '#standardValidating');
      });

      it('should validate a standard roll when standard die changes', async () => {
        helper.setSelectByIndex('#standardDie', 1);

        expect(fixture.componentInstance.standardDie).toEqual(fixture.componentInstance.standardDice[1]);
        helper.expectValidating(fixture.componentInstance.validating(), '#standardRollButton', '#standardValidating');

        await helper.waitForChangeDetection();

        helper.expectValid(fixture.componentInstance.validating(), fixture.componentInstance.rollIsValid(), '#standardRollButton', '#standardValidating');
      });

      const standardDieIndicesTestCases = Array.from(Array(9).keys());

      standardDieIndicesTestCases.forEach(test => {
        it(`should show that a standard roll is valid - non-default standard die index ${test}`, async () => {
          helper.setSelectByIndex('#standardDie', test);

          expect(fixture.componentInstance.standardDie).toEqual(fixture.componentInstance.standardDice[test]);
          helper.expectValidating(fixture.componentInstance.validating(), '#standardRollButton', '#standardValidating');

          await helper.waitForChangeDetection();

          helper.expectValid(fixture.componentInstance.validating(), fixture.componentInstance.rollIsValid(), '#standardRollButton', '#standardValidating');
        });
      });

      it(`should show that a standard roll is invalid - validation fails`, async () => {
        helper.setInput('#standardQuantity', '66666');
        helper.setSelectByIndex('#standardDie', 4);

        expect(fixture.componentInstance.standardDie).toEqual(fixture.componentInstance.standardDice[4]);
        helper.expectValidating(fixture.componentInstance.validating(), '#standardRollButton', '#standardValidating');

        //run roll validation
        await helper.waitForChangeDetection();

        helper.expectInvalid(fixture.componentInstance.validating(), fixture.componentInstance.rollIsValid(), '#standardRollButton', '#standardValidating');
      });

      it(`should show that a standard roll is valid - validation succeeds`, async () => {
        helper.setInput('#standardQuantity', '9266');
        helper.setSelectByIndex('#standardDie', 5);

        expect(fixture.componentInstance.standardDie).toEqual(fixture.componentInstance.standardDice[5]);
        helper.expectValidating(fixture.componentInstance.validating(), '#standardRollButton', '#standardValidating');

        //run roll validation
        await helper.waitForChangeDetection();

        helper.expectValid(fixture.componentInstance.validating(), fixture.componentInstance.rollIsValid(), '#standardRollButton', '#standardValidating');
      });

      it(`should show when rolling a standard roll`, async () => {
        const component = fixture.componentInstance;
        component.rolling.set(true);

        await helper.waitForChangeDetection();

        helper.expectGenerating(
          fixture.componentInstance.rolling(),
          '#standardRollButton',
          '#rollSection',
          '#rollingSection',
          '#standardValidating',
        );
      });

      it(`should roll the default standard roll`, async () => {
        helper.clickButton('#standardRollButton');

        helper.expectGenerating(
          fixture.componentInstance.rolling(),
          '#standardRollButton',
          '#rollSection',
          '#rollingSection',
          '#standardValidating',
        );

        //run roll
        await helper.waitForChangeDetection();

        helper.expectGenerated(fixture.componentInstance.rolling(), '#standardRollButton', '#rollSection', '#rollingSection', '#standardValidating');

        const compiled = fixture.nativeElement as HTMLElement;
        const rollSection = compiled.querySelector('#rollSection');
        const rolledNumber = Number(rollSection?.textContent?.replace(/,/g, ""));
        expect(rolledNumber).toBeGreaterThanOrEqual(1);
        expect(rolledNumber).toBeLessThanOrEqual(20);
      });

      it(`should roll a non-default standard roll`, async () => {
        helper.setInput('#standardQuantity', '42');
        helper.setSelectByIndex('#standardDie', 2);

        expect(fixture.componentInstance.standardQuantity).toEqual(42);
        expect(fixture.componentInstance.standardDie).toEqual(fixture.componentInstance.standardDice[2]);

        //run validation
        await helper.waitForChangeDetection();

        helper.clickButton('#standardRollButton');


        helper.expectGenerating(
          fixture.componentInstance.rolling(),
          '#standardRollButton',
          '#rollSection',
          '#rollingSection',
          '#standardValidating',
        );

        //run roll
        await helper.waitForChangeDetection();

        helper.expectGenerated(fixture.componentInstance.rolling(), '#standardRollButton', '#rollSection', '#rollingSection', '#standardValidating');

        const compiled = fixture.nativeElement as HTMLElement;
        const rollSection = compiled.querySelector('#rollSection');
        const rolledNumber = Number(rollSection?.textContent?.replace(/,/g, ""));
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

      it(`should show when validating a custom roll`, async () => {
        const component = fixture.componentInstance;
        component.validating.set(true);

        await helper.waitForChangeDetection();

        helper.expectValidating(fixture.componentInstance.validating(), '#customRollButton', '#customValidating');
      });

      it(`should show that a custom roll is invalid - missing custom quantity`, async () => {
        helper.setInput('#customQuantity', '');

        expect(fixture.componentInstance.customQuantity).toBeNull();
        helper.expectInvalid(fixture.componentInstance.validating(), fixture.componentInstance.rollIsValid(), '#customRollButton', '#customValidating');
      });

      it(`should show that a custom roll is invalid - custom quantity invalid`, async () => {
        helper.setInput('#customQuantity', 'wrong');

        expect(fixture.componentInstance.customQuantity).toBeNull();
        helper.expectInvalid(fixture.componentInstance.validating(), fixture.componentInstance.rollIsValid(), '#customRollButton', '#customValidating');
      });

      it(`should show that a custom roll is invalid - custom quantity too low`, async () => {
        helper.setInput('#customQuantity', '0');

        expect(fixture.componentInstance.customQuantity).toEqual(0);
        helper.expectInvalid(fixture.componentInstance.validating(), fixture.componentInstance.rollIsValid(), '#customRollButton', '#customValidating');
      });

      it(`should show that a custom roll is invalid - custom quantity too high`, async () => {
        helper.setInput('#customQuantity', '10001');

        expect(fixture.componentInstance.customQuantity).toEqual(10001);
        helper.expectValidating(fixture.componentInstance.validating(), '#customRollButton', '#customValidating');

        //run roll validation
        await helper.waitForChangeDetection();

        helper.expectInvalid(fixture.componentInstance.validating(), fixture.componentInstance.rollIsValid(), '#customRollButton', '#customValidating');
      });

      const validCustomInputTestCases = [1, 2, 10, 20, 100, 1000, 10000];

      validCustomInputTestCases.forEach(test => {
        it(`should show that a custom roll is valid - custom quantity ${test}`, async () => {
          helper.setInput('#customQuantity', test.toString());

          expect(fixture.componentInstance.customQuantity).toEqual(test);
          helper.expectValidating(fixture.componentInstance.validating(), '#customRollButton', '#customValidating');

          //run roll validation
          await helper.waitForChangeDetection();

          helper.expectValid(fixture.componentInstance.validating(), fixture.componentInstance.rollIsValid(), '#customRollButton', '#customValidating');
        });
      });

      it(`should show that a custom roll is invalid - missing custom die`, async () => {
        helper.setInput('#customDie', '');

        expect(fixture.componentInstance.customDie).toBeNull();
        helper.expectInvalid(fixture.componentInstance.validating(), fixture.componentInstance.rollIsValid(), '#customRollButton', '#customValidating');
      });

      it(`should show that a custom roll is invalid - custom die invalid`, async () => {
        helper.setInput('#customDie', 'wrong');

        expect(fixture.componentInstance.customDie).toBeNull();
        helper.expectInvalid(fixture.componentInstance.validating(), fixture.componentInstance.rollIsValid(), '#customRollButton', '#customValidating');
      });

      it(`should show that a custom roll is invalid - custom die too low`, async () => {
        helper.setInput('#customDie', '0');

        expect(fixture.componentInstance.customDie).toEqual(0);
        helper.expectInvalid(fixture.componentInstance.validating(), fixture.componentInstance.rollIsValid(), '#customRollButton', '#customValidating');
      });

      it(`should show that a custom roll is invalid - custom die too high`, async () => {
        helper.setInput('#customDie', '10001');

        expect(fixture.componentInstance.customDie).toEqual(10001);
        helper.expectValidating(fixture.componentInstance.validating(), '#customRollButton', '#customValidating');

        //run roll validation
        await helper.waitForChangeDetection();

        helper.expectInvalid(fixture.componentInstance.validating(), fixture.componentInstance.rollIsValid(), '#customRollButton', '#customValidating');
      });

      validCustomInputTestCases.forEach(test => {
        it(`should show that a custom roll is valid - custom die ${test}`, async () => {
          helper.setInput('#customDie', test.toString());

          expect(fixture.componentInstance.customDie).toEqual(test);
          helper.expectValidating(fixture.componentInstance.validating(), '#customRollButton', '#customValidating');

          //run roll validation
          await helper.waitForChangeDetection();

          helper.expectValid(fixture.componentInstance.validating(), fixture.componentInstance.rollIsValid(), '#customRollButton', '#customValidating');
        });
      });

      it(`should show that a custom roll is invalid - validation fails`, async () => {
        helper.setInput('#customQuantity', '66666');
        helper.setInput('#customDie', '666666');

        expect(fixture.componentInstance.customQuantity).toEqual(66666);
        expect(fixture.componentInstance.customDie).toEqual(666666);
        helper.expectValidating(fixture.componentInstance.validating(), '#customRollButton', '#customValidating');

        //run roll validation
        await helper.waitForChangeDetection();

        helper.expectInvalid(fixture.componentInstance.validating(), fixture.componentInstance.rollIsValid(), '#customRollButton', '#customValidating');
      });

      it(`should show that a custom roll is valid - validation succeeds`, async () => {
        helper.setInput('#customQuantity', '9266');
        helper.setInput('#customDie', '42');

        expect(fixture.componentInstance.customQuantity).toEqual(9266);
        expect(fixture.componentInstance.customDie).toEqual(42);
        helper.expectValidating(fixture.componentInstance.validating(), '#customRollButton', '#customValidating');

        //run roll validation
        await helper.waitForChangeDetection();

        helper.expectValid(fixture.componentInstance.validating(), fixture.componentInstance.rollIsValid(), '#customRollButton', '#customValidating');
      });

      it(`should show when rolling a custom roll`, async () => {
        const component = fixture.componentInstance;
        component.rolling.set(true);

        await helper.waitForChangeDetection();

        helper.expectGenerating(fixture.componentInstance.rolling(), '#customRollButton', '#rollSection', '#rollingSection', '#customValidating');
      });

      it(`should roll the default custom roll`, async () => {
        helper.clickButton('#customRollButton');

        helper.expectGenerating(fixture.componentInstance.rolling(), '#customRollButton', '#rollSection', '#rollingSection', '#customValidating');

        //run roll
        await helper.waitForChangeDetection();

        helper.expectGenerated(fixture.componentInstance.rolling(), '#customRollButton', '#rollSection', '#rollingSection', '#customValidating');

        const compiled = fixture.nativeElement as HTMLElement;
        const rollSection = compiled.querySelector('#rollSection');
        const rolledNumber = Number(rollSection?.textContent?.replace(/,/g, ""));
        expect(rolledNumber).toBeGreaterThanOrEqual(1);
        expect(rolledNumber).toBeLessThanOrEqual(5);
      });

      it(`should roll a non-default custom roll`, async () => {
        helper.setInput('#customQuantity', '42');
        helper.setInput('#customDie', '7');

        expect(fixture.componentInstance.customQuantity).toEqual(42);
        expect(fixture.componentInstance.customDie).toEqual(7);

        //run validation
        await helper.waitForChangeDetection();

        helper.clickButton('#customRollButton');

        helper.expectGenerating(fixture.componentInstance.rolling(), '#customRollButton', '#rollSection', '#rollingSection', '#customValidating');

        //run roll
        await helper.waitForChangeDetection();

        helper.expectGenerated(fixture.componentInstance.rolling(), '#customRollButton', '#rollSection', '#rollingSection', '#customValidating');

        const compiled = fixture.nativeElement as HTMLElement;
        const rollSection = compiled.querySelector('#rollSection');
        const rolledNumber = Number(rollSection?.textContent?.replace(/,/g, ""));
        expect(rolledNumber).toBeGreaterThanOrEqual(42);
        expect(rolledNumber).toBeLessThanOrEqual(42 * 7);
      });
    });
    describe('the expression tab', () => {
      it(`should render the expression tab`, async () => {
        helper.expectExists('#expression');
        helper.expectInput('#expression #rollExpression', true, '4d6k3+2');

        expect(fixture.componentInstance.rolling()).toBe(false);
        expect(fixture.componentInstance.validating()).toBe(false);

        helper.expectHasAttribute('#expression #expressionRollButton', 'disabled', false);
        helper.expectLoading('#expression #expressionValidating', false, Size.Small);
      });

      it(`should show when validating an expression`, async () => {
        const component = fixture.componentInstance;
        component.validating.set(true);

        await helper.waitForChangeDetection();

        helper.expectValidating(fixture.componentInstance.validating(), '#expressionRollButton', '#expressionValidating');
      });

      it(`should show that an expression is invalid - empty`, () => {
        helper.setInput('#rollExpression', '', 'keyup');

        expect(fixture.componentInstance.expression).toEqual('');
        helper.expectInvalid(fixture.componentInstance.validating(), fixture.componentInstance.rollIsValid(), '#expressionRollButton', '#expressionValidating');
      });

      it(`should show that an expression is invalid - invalid syntax`, async () => {
        helper.setInput('#rollExpression', 'wrong+invalid', 'keyup');

        expect(fixture.componentInstance.expression).toEqual('wrong+invalid');
        helper.expectValidating(fixture.componentInstance.validating(), '#expressionRollButton', '#expressionValidating');

        //run roll validation
        await helper.waitForDebounce();

        helper.expectInvalid(fixture.componentInstance.validating(), fixture.componentInstance.rollIsValid(), '#expressionRollButton', '#expressionValidating');
      });

      it(`should show that an expression is invalid - too high`, async () => {
        helper.setInput('#rollExpression', '1000d100d2', 'keyup');

        expect(fixture.componentInstance.expression).toEqual('1000d100d2');
        helper.expectValidating(fixture.componentInstance.validating(), '#expressionRollButton', '#expressionValidating');

        //run roll validation
        await helper.waitForDebounce();

        helper.expectInvalid(fixture.componentInstance.validating(), fixture.componentInstance.rollIsValid(), '#expressionRollButton', '#expressionValidating');
      });

      it(`should show that an expression is valid`, async () => {
        helper.setInput('#rollExpression', '100d100d2', 'keyup');

        expect(fixture.componentInstance.expression).toEqual('100d100d2');
        helper.expectValidating(fixture.componentInstance.validating(), '#expressionRollButton', '#expressionValidating');

        //run roll validation
        await helper.waitForDebounce();

        helper.expectValid(fixture.componentInstance.validating(), fixture.componentInstance.rollIsValid(), '#expressionRollButton', '#expressionValidating');
      });

      it(`should show that an expression is invalid - validation fails`, async () => {
        helper.setInput('#rollExpression', '3d6t1-x', 'keyup');

        expect(fixture.componentInstance.expression).toEqual('3d6t1-x');
        helper.expectValidating(fixture.componentInstance.validating(), '#expressionRollButton', '#expressionValidating');

        //run roll validation
        await helper.waitForDebounce();

        helper.expectInvalid(fixture.componentInstance.validating(), fixture.componentInstance.rollIsValid(), '#expressionRollButton', '#expressionValidating');
      });

      it(`should show that an expression is valid - validation succeeds`, async () => {
        helper.setInput('#rollExpression', '3d6t1-2', 'keyup');

        expect(fixture.componentInstance.expression).toEqual('3d6t1-2');
        helper.expectValidating(fixture.componentInstance.validating(), '#expressionRollButton', '#expressionValidating');

        //run roll validation
        await helper.waitForDebounce();

        helper.expectValid(fixture.componentInstance.validating(), fixture.componentInstance.rollIsValid(), '#expressionRollButton', '#expressionValidating');
      });

      it(`should show when rolling an expression`, async () => {
        const component = fixture.componentInstance;
        component.rolling.set(true);

        await helper.waitForChangeDetection();

        helper.expectGenerating(fixture.componentInstance.rolling(), '#expressionRollButton', '#rollSection', '#rollingSection', '#expressionValidating');
      });

      it(`should roll the default expression`, async () => {
        helper.clickButton('#expressionRollButton');

        helper.expectGenerating(fixture.componentInstance.rolling(), '#expressionRollButton', '#rollSection', '#rollingSection', '#expressionValidating');

        //run roll
        await helper.waitForChangeDetection();

        helper.expectGenerated(fixture.componentInstance.rolling(), '#expressionRollButton', '#rollSection', '#rollingSection', '#expressionValidating');

        const compiled = fixture.nativeElement as HTMLElement;
        const rollSection = compiled.querySelector('#rollSection');
        const rolledNumber = Number(rollSection?.textContent?.replace(/,/g, ""));
        expect(rolledNumber).toBeGreaterThanOrEqual(5);
        expect(rolledNumber).toBeLessThanOrEqual(20);
      });

      it(`should roll a non-default expression`, async () => {
        helper.setInput('#rollExpression', '3d6t1-2', 'keyup');

        expect(fixture.componentInstance.expression).toEqual('3d6t1-2');

        //run validation
        await helper.waitForDebounce();

        helper.clickButton('#expressionRollButton');

        helper.expectGenerating(fixture.componentInstance.rolling(), '#expressionRollButton', '#rollSection', '#rollingSection', '#expressionValidating');

        //run roll
        await helper.waitForChangeDetection();

        helper.expectGenerated(fixture.componentInstance.rolling(), '#expressionRollButton', '#rollSection', '#rollingSection', '#expressionValidating');

        const compiled = fixture.nativeElement as HTMLElement;
        const rollSection = compiled.querySelector('#rollSection');
        const rolledNumber = Number(rollSection?.textContent?.replace(/,/g, ""));
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

          expect(fixture.componentInstance.expression).toEqual(test.e);

          //run validation
          await helper.waitForDebounce();

          helper.expectValid(fixture.componentInstance.validating(), fixture.componentInstance.rollIsValid(), '#expressionRollButton', '#expressionValidating');
          helper.clickButton('#expressionRollButton');

          helper.expectGenerating(fixture.componentInstance.rolling(), '#expressionRollButton', '#rollSection', '#rollingSection', '#expressionValidating');

          //run roll
          await helper.waitForChangeDetection();

          helper.expectGenerated(fixture.componentInstance.rolling(), '#expressionRollButton', '#rollSection', '#rollingSection', '#expressionValidating');

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

    it(`should format a roll`, async () => {
      fixture.componentInstance.roll.set(42);

      await helper.waitForChangeDetection();

      helper.expectExists('#rollSection', true);
      helper.expectTextContent('#rollSection', '42');
    });

    it(`should format a large roll`, async () => {
      fixture.componentInstance.roll.set(9266);

      await helper.waitForChangeDetection();

      helper.expectExists('#rollSection', true);
      helper.expectTextContent('#rollSection', '9,266');
    });
  });
});
