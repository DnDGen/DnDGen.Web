import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { CreatureGenComponent } from './creaturegen.component';
import { CreatureService } from '../services/creature.service';
import { SweetAlertService } from '../../shared/services/sweet-alert.service';
import { LoggerService } from '../../shared/services/logger.service';
import { Observable } from 'rxjs';
import { CreatureGenViewModel } from '../models/creaturegen-view-model.model';
import { Creature } from '../models/creature.model';
import { FileSaverService } from '../../shared/services/file-saver.service';
import { CreaturePipe } from '../pipes/creature.pipe';

describe('CreatureGen Component', () => {
  describe('unit', () => {
    let component: CreatureGenComponent;
    let creatureServiceSpy: {
      getViewModel: ReturnType<typeof vi.fn>,
      validateCreature: ReturnType<typeof vi.fn>,
      generateCreature: ReturnType<typeof vi.fn>,
      validateRandom: ReturnType<typeof vi.fn>,
      generateRandom: ReturnType<typeof vi.fn>,
    };
    let sweetAlertServiceSpy: { showError: ReturnType<typeof vi.fn> };
    let loggerServiceSpy: { logError: ReturnType<typeof vi.fn> };
    let fileSaverServiceSpy: { save: ReturnType<typeof vi.fn> };
    let creaturePipeSpy: { transform: ReturnType<typeof vi.fn> };

    const delay = 10;

    beforeEach(() => {
      vi.useFakeTimers();

      creatureServiceSpy = {
        getViewModel: vi.fn(),
        validateCreature: vi.fn(),
        generateCreature: vi.fn(),
        validateRandom: vi.fn(),
        generateRandom: vi.fn(),
      };
      sweetAlertServiceSpy = { showError: vi.fn() };
      loggerServiceSpy = { logError: vi.fn() };
      fileSaverServiceSpy = { save: vi.fn() };
      creaturePipeSpy = { transform: vi.fn() };

      component = new CreatureGenComponent(
        creatureServiceSpy as unknown as CreatureService,
        sweetAlertServiceSpy as unknown as SweetAlertService,
        loggerServiceSpy as unknown as LoggerService,
        fileSaverServiceSpy as unknown as FileSaverService,
        creaturePipeSpy as unknown as CreaturePipe
      );
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    function getViewModel(): CreatureGenViewModel {
      return new CreatureGenViewModel(
        ['creature 1', 'creature 2'],
        ['template 1', 'template 2', 'None'],
        ['alignment 1', 'alignment 2'],
        ['type 1', 'type 2'],
        ['cr 1', 'cr 2'],
      );
    }

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

    function expectError(message: string) {
      expect(component.loading()).toBe(false);
      expect(component.validating()).toBe(false);
      expect(component.generating()).toBe(false);
      expect(component.generatingMessage()).toEqual('');
      expect(component.creature()).toBeNull();
      expect(loggerServiceSpy.logError).toHaveBeenCalledWith(message);
      expect(sweetAlertServiceSpy.showError).toHaveBeenCalledTimes(1);
    }

    it('should initialize the public properties', () => {
      expect(component.creatureModel()).toBeUndefined();
      expect(component.loading()).toBe(false);
      expect(component.validating()).toBe(false);
      expect(component.generating()).toBe(false);
      expect(component.validCreature()).toBe(false);
      expect(component.validRandom()).toBe(false);
      expect(component.creature()).toBeNull();
      expect(component.generatingMessage()).toEqual('');
    });

    it('should initialize the input values', () => {
      expect(component.creatureName).toEqual('');
      expect(component.creatureTemplates).toEqual([]);
      expect(component.randomTemplates).toEqual([]);
      expect(component.randomChallengeRating).toEqual('');
      expect(component.randomAlignment).toEqual('');
      expect(component.randomCreatureType).toEqual('');
    });

    it('should be validating and loading while fetching the creature model', async () => {
      creatureServiceSpy.getViewModel.mockImplementation(() => getFakeDelay(getViewModel()));
      creatureServiceSpy.validateRandom.mockImplementation(() => getFakeDelay(true));

      component.ngOnInit();

      expect(component.creatureModel()).toBeUndefined();
      expect(component.loading()).toBe(true);
      expect(component.validating()).toBe(true);

      await vi.advanceTimersByTimeAsync(delay * 2 - 1);

      expect(component.loading()).toBe(true);
      expect(component.validating()).toBe(true);

      await vi.advanceTimersByTimeAsync(1);

      expect(component.loading()).toBe(false);
      expect(component.validating()).toBe(false);
    });

    [true, false].forEach(valid => {
      it(`should set the creature model and defaults on init, with no creature chosen - random valid ${valid}`, async () => {
        const model = getViewModel();
        creatureServiceSpy.getViewModel.mockImplementation(() => getFakeDelay(model));
        creatureServiceSpy.validateRandom.mockImplementation(() => getFakeDelay(valid));

        component.ngOnInit();
        await vi.advanceTimersByTimeAsync(delay * 2);

        expect(component.creatureModel()).toBe(model);
        expect(component.creatureName).toEqual('');
        expect(component.creatureTemplates).toEqual([]);
        expect(component.randomTemplates).toEqual([]);
        expect(component.randomChallengeRating).toEqual('');
        expect(component.randomAlignment).toEqual('');
        expect(component.randomCreatureType).toEqual('');
        expect(component.validCreature()).toBe(false);
        expect(component.validRandom()).toBe(valid);
        expect(creatureServiceSpy.validateCreature).not.toHaveBeenCalled();
        expect(creatureServiceSpy.validateRandom).toHaveBeenCalledWith([], '', '', '');
        expect(creatureServiceSpy.validateRandom).toHaveBeenCalledTimes(1);
        expect(component.loading()).toBe(false);
        expect(component.validating()).toBe(false);
        expect(sweetAlertServiceSpy.showError).not.toHaveBeenCalled();
      });
    });

    it('should display error from getting the creature model', async () => {
      creatureServiceSpy.getViewModel.mockImplementation(() => getFakeError('I failed'));

      component.ngOnInit();
      await vi.advanceTimersByTimeAsync(delay);

      expect(component.creatureModel()).toBeUndefined();
      expectError('I failed');
    });

    it('should display error from validating the random creature on init', async () => {
      creatureServiceSpy.getViewModel.mockImplementation(() => getFakeDelay(getViewModel()));
      creatureServiceSpy.validateRandom.mockImplementation(() => getFakeError('I failed'));

      component.ngOnInit();
      await vi.advanceTimersByTimeAsync(delay * 2);

      expect(component.validRandom()).toBe(false);
      expectError('I failed');
    });

    describe('the set tab', () => {
      it('should be invalid without calling the service when there is no creature', () => {
        component.validateCreature('', ['template 1']);

        expect(component.validating()).toBe(false);
        expect(component.validCreature()).toBe(false);
        expect(creatureServiceSpy.validateCreature).not.toHaveBeenCalled();
      });

      const validations = [
        { name: 'no templates', templates: [] },
        { name: '1 template', templates: ['template 1'] },
        { name: '2 templates', templates: ['template 1', 'template 2'] },
        { name: '2 templates in the other order', templates: ['template 2', 'template 1'] },
        { name: '3 templates', templates: ['template 1', 'template 2', 'None'] },
        { name: 'a repeated template', templates: ['None', 'None'] },
      ];

      validations.forEach(test => {
        [true, false].forEach(valid => {
          it(`should validate the creature with ${test.name} - valid ${valid}`, async () => {
            creatureServiceSpy.validateCreature.mockImplementation(() => getFakeDelay(valid));

            component.validateCreature('my creature', test.templates);

            expect(component.validating()).toBe(true);
            expect(creatureServiceSpy.validateCreature).toHaveBeenCalledWith('my creature', test.templates);

            await vi.advanceTimersByTimeAsync(delay);

            expect(component.validating()).toBe(false);
            expect(component.validCreature()).toBe(valid);
          });
        });

        it(`should set and validate the templates - ${test.name}`, async () => {
          creatureServiceSpy.validateCreature.mockImplementation(() => getFakeDelay(true));
          component.creatureName = 'my creature';

          component.setCreatureTemplates(test.templates);

          expect(component.creatureTemplates).toEqual(test.templates);
          expect(component.validating()).toBe(true);
          expect(creatureServiceSpy.validateCreature).toHaveBeenCalledWith('my creature', test.templates);

          await vi.advanceTimersByTimeAsync(delay);

          expect(component.validCreature()).toBe(true);
        });

        it(`should generate the creature with ${test.name}`, async () => {
          const creature = new Creature('my creature summary');
          creatureServiceSpy.generateCreature.mockImplementation(() => getFakeDelay(creature));
          component.creatureName = 'my creature';
          component.creatureTemplates = test.templates;

          component.generateCreature();

          expect(creatureServiceSpy.generateCreature).toHaveBeenCalledWith('my creature', test.templates);

          await vi.advanceTimersByTimeAsync(delay);

          expect(component.creature()).toBe(creature);
        });
      });

      it('should set the creature name and validate it with the templates already chosen', async () => {
        creatureServiceSpy.validateCreature.mockImplementation(() => getFakeDelay(false));
        component.creatureTemplates = ['template 2', 'template 1'];

        component.setCreatureName('my creature');

        expect(component.creatureName).toEqual('my creature');
        expect(component.validating()).toBe(true);
        expect(creatureServiceSpy.validateCreature).toHaveBeenCalledWith('my creature', ['template 2', 'template 1']);

        await vi.advanceTimersByTimeAsync(delay);

        expect(component.validCreature()).toBe(false);
      });

      it('should display error from validating the creature', async () => {
        creatureServiceSpy.validateCreature.mockImplementation(() => getFakeError('I failed'));
        component.validRandom.set(true);

        component.validateCreature('my creature', []);
        await vi.advanceTimersByTimeAsync(delay);

        expect(component.validCreature()).toBe(false);
        expect(component.validRandom()).toBe(false);
        expectError('I failed');
      });

      it('should be generating while generating the creature, replacing the previous creature', async () => {
        const creature = new Creature('my creature summary');
        creatureServiceSpy.generateCreature.mockImplementation(() => getFakeDelay(creature));
        component.creatureName = 'my creature';
        component.creature.set(new Creature('my previous creature'));

        component.generateCreature();

        expect(component.generating()).toBe(true);
        expect(component.generatingMessage()).toEqual('Generating creature...');
        expect(component.creature()).toBeNull();

        await vi.advanceTimersByTimeAsync(delay - 1);

        expect(component.generating()).toBe(true);
        expect(component.creature()).toBeNull();

        await vi.advanceTimersByTimeAsync(1);

        expect(component.generating()).toBe(false);
        expect(component.generatingMessage()).toEqual('');
        expect(component.creature()).toBe(creature);
      });

      it('should display error from generating the creature', async () => {
        creatureServiceSpy.generateCreature.mockImplementation(() => getFakeError('I failed'));
        component.creatureName = 'my creature';

        component.generateCreature();
        await vi.advanceTimersByTimeAsync(delay);

        expectError('I failed');
      });
    });

    describe('the random tab', () => {
      const validations = [
        { name: 'no filters', templates: [], cr: '', alignment: '', type: '' },
        { name: 'a challenge rating', templates: [], cr: 'my cr', alignment: '', type: '' },
        { name: 'an alignment', templates: [], cr: '', alignment: 'my alignment', type: '' },
        { name: 'a creature type', templates: [], cr: '', alignment: '', type: 'my type' },
        { name: '1 template', templates: ['template 1'], cr: '', alignment: '', type: '' },
        { name: '2 templates', templates: ['template 1', 'template 2'], cr: '', alignment: '', type: '' },
        { name: '2 templates in the other order', templates: ['template 2', 'template 1'], cr: '', alignment: '', type: '' },
        { name: 'the None template', templates: ['None'], cr: '', alignment: '', type: '' },
        { name: 'all filters', templates: ['template 2', 'template 1'], cr: 'my cr', alignment: 'my alignment', type: 'my type' },
      ];

      validations.forEach(test => {
        [true, false].forEach(valid => {
          it(`should validate the random creature with ${test.name} - valid ${valid}`, async () => {
            creatureServiceSpy.validateRandom.mockImplementation(() => getFakeDelay(valid));

            component.validateRandom(test.templates, test.cr, test.alignment, test.type);

            expect(component.validating()).toBe(true);
            expect(creatureServiceSpy.validateRandom).toHaveBeenCalledWith(test.templates, test.cr, test.alignment, test.type);

            await vi.advanceTimersByTimeAsync(delay);

            expect(component.validating()).toBe(false);
            expect(component.validRandom()).toBe(valid);
          });
        });

        it(`should generate the random creature with ${test.name}`, async () => {
          const creature = new Creature('my creature summary');
          creatureServiceSpy.generateRandom.mockImplementation(() => getFakeDelay(creature));
          component.randomTemplates = test.templates;
          component.randomChallengeRating = test.cr;
          component.randomAlignment = test.alignment;
          component.randomCreatureType = test.type;

          component.generateRandom();

          expect(creatureServiceSpy.generateRandom).toHaveBeenCalledWith(test.templates, test.cr, test.alignment, test.type);

          await vi.advanceTimersByTimeAsync(delay);

          expect(component.creature()).toBe(creature);
        });
      });

      it('should set the random templates and validate them with the filters already chosen', async () => {
        creatureServiceSpy.validateRandom.mockImplementation(() => getFakeDelay(true));
        component.randomChallengeRating = 'my cr';
        component.randomAlignment = 'my alignment';
        component.randomCreatureType = 'my type';

        component.setRandomTemplates(['template 2', 'None']);

        expect(component.randomTemplates).toEqual(['template 2', 'None']);
        expect(component.validating()).toBe(true);
        expect(creatureServiceSpy.validateRandom).toHaveBeenCalledWith(['template 2', 'None'], 'my cr', 'my alignment', 'my type');

        await vi.advanceTimersByTimeAsync(delay);

        expect(component.validRandom()).toBe(true);
      });

      it('should display error from validating the random creature', async () => {
        creatureServiceSpy.validateRandom.mockImplementation(() => getFakeError('I failed'));
        component.validCreature.set(true);

        component.validateRandom([], '', '', '');
        await vi.advanceTimersByTimeAsync(delay);

        expect(component.validCreature()).toBe(false);
        expect(component.validRandom()).toBe(false);
        expectError('I failed');
      });

      it('should be generating while generating the random creature, replacing the previous creature', async () => {
        const creature = new Creature('my creature summary');
        creatureServiceSpy.generateRandom.mockImplementation(() => getFakeDelay(creature));
        component.creature.set(new Creature('my previous creature'));

        component.generateRandom();

        expect(component.generating()).toBe(true);
        expect(component.generatingMessage()).toEqual('Generating creature...');
        expect(component.creature()).toBeNull();

        await vi.advanceTimersByTimeAsync(delay);

        expect(component.generating()).toBe(false);
        expect(component.generatingMessage()).toEqual('');
        expect(component.creature()).toBe(creature);
      });

      it('should display error from generating the random creature', async () => {
        creatureServiceSpy.generateRandom.mockImplementation(() => getFakeError('I failed'));

        component.generateRandom();
        await vi.advanceTimersByTimeAsync(delay);

        expectError('I failed');
      });
    });

    it('should download the creature', () => {
      const creature = new Creature('my creature summary');
      component.creature.set(creature);
      creaturePipeSpy.transform.mockReturnValue('my formatted creature');

      component.download();

      expect(creaturePipeSpy.transform).toHaveBeenCalledWith(creature);
      expect(fileSaverServiceSpy.save).toHaveBeenCalledWith('my formatted creature', 'my creature summary');
    });

    it('should not download a missing creature', () => {
      component.creature.set(null);

      component.download();

      expect(creaturePipeSpy.transform).not.toHaveBeenCalled();
      expect(fileSaverServiceSpy.save).not.toHaveBeenCalled();
    });
  });
});
