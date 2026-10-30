import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
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
});