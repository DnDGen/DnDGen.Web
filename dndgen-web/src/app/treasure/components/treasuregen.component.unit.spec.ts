import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TreasureGenComponent } from './treasuregen.component';
import { TreasureService } from '../services/treasure.service';
import { TreasurePipe } from '../pipes/treasure.pipe';
import { SweetAlertService } from '../../shared/services/sweet-alert.service';
import { LoggerService } from '../../shared/services/logger.service';
import { Observable } from 'rxjs';
import { TreasureGenViewModel } from '../models/treasuregen-view-model.model';
import { FileSaverService } from '../../shared/services/file-saver.service';
import { ItemTypeViewModel } from '../models/item-type-view-model.model';
import { Treasure } from '../models/treasure.model';
import { Coin } from '../models/coin.model';
import { Item } from '../models/item.model';
import { By } from '@angular/platform-browser';
import { TreasureComponent } from './treasure.component';
import { ItemComponent } from './item.component';
import FileSaver from 'file-saver';
import { Good } from '../models/good.model';
import { ItemPipe } from '../pipes/item.pipe';
import { Size } from '../../shared/components/size.enum';
import { TestHelper } from '../../test-helper';
import { Armor } from '../models/armor.model';
import { Weapon } from '../models/weapon.model';

describe('TreasureGen Component', () => {
  describe('unit', () => {
    let component: TreasureGenComponent;
    let treasureServiceSpy: {
      getViewModel: ReturnType<typeof vi.fn>,
      getTreasure: ReturnType<typeof vi.fn>,
      validateTreasure: ReturnType<typeof vi.fn>,
      getItem: ReturnType<typeof vi.fn>,
      validateItem: ReturnType<typeof vi.fn>
    };
    let itemPipeSpy: { transform: ReturnType<typeof vi.fn> };
    let treasurePipeSpy: { transform: ReturnType<typeof vi.fn> };
    let sweetAlertServiceSpy: { showError: ReturnType<typeof vi.fn> };
    let loggerServiceSpy: { logError: ReturnType<typeof vi.fn> };
    let fileSaverServiceSpy: { save: ReturnType<typeof vi.fn> };

    const delay = 10;
  
    beforeEach(() => {
      vi.useFakeTimers();

      treasureServiceSpy = {
        getViewModel: vi.fn(),
        getTreasure: vi.fn(),
        validateTreasure: vi.fn(),
        getItem: vi.fn(),
        validateItem: vi.fn()
      };
      itemPipeSpy = { transform: vi.fn() };
      treasurePipeSpy = { transform: vi.fn() };
      sweetAlertServiceSpy = { showError: vi.fn() };
      loggerServiceSpy = { logError: vi.fn() };
      fileSaverServiceSpy = { save: vi.fn() };

      component = new TreasureGenComponent(
        treasureServiceSpy as unknown as TreasureService,
        sweetAlertServiceSpy as unknown as SweetAlertService,
        fileSaverServiceSpy as unknown as FileSaverService,
        itemPipeSpy as unknown as ItemPipe,
        treasurePipeSpy as unknown as TreasurePipe,
        loggerServiceSpy as unknown as LoggerService
      );
    });

    afterEach(() => {
      vi.useRealTimers();
    });
  
    it(`should initialize the public properties`, () => {
      expect(component.generating()).toBe(false);
      expect(component.validating()).toBe(false);
      expect(component.validTreasure()).toBe(false);
      expect(component.validItem()).toBe(false);
      expect(component.treasure()).toBeNull();
      expect(component.item()).toBeNull();
      expect(component.itemNames).toEqual([]);
    });
  
    it(`should initialize the input values`, () => {
      expect(component.level).toEqual(1);
      expect(component.treasureType).toEqual('');
      expect(component.power).toEqual('');
      expect(component.itemType).toBeNull();
      expect(component.itemName).toEqual('');
    });

    function getViewModel(): TreasureGenViewModel {
      return new TreasureGenViewModel(
        ['treasure type 1', 'treasure type 2'],
        9266,
        [
          new ItemTypeViewModel('it1', 'Item Type 1'),
          new ItemTypeViewModel('it2', 'Item Type 2'),
        ],
        ['power 1', 'power 2'],
        {
          'it1': ['item 1', 'item 2'],
          'it2': ['item 3', 'item 4'],
        }
      );
    }

    it('should be validating and loading while fetching the treasure model', async () => {
      const model = getViewModel();
      treasureServiceSpy.getViewModel.mockImplementation(() => getFakeDelay(model));
      treasureServiceSpy.validateTreasure.mockImplementation(() => getFakeDelay(true));
      treasureServiceSpy.validateItem.mockImplementation(() => getFakeDelay(true));

      component.ngOnInit();

      expect(component.treasureModel()).not.toBeTruthy();
      expect(component.treasureType).toEqual('');
      expect(component.power).toEqual('');
      expect(component.itemType).toBeNull();
      expect(component.itemNames).toEqual([]);
      expect(component.validTreasure()).toBe(false);
      expect(component.validItem()).toBe(false);
      expect(component.loading()).toBe(true);
      expect(component.validating()).toBe(true);
      
      await vi.advanceTimersByTimeAsync(delay - 1);

      expect(component.treasureModel()).not.toBeTruthy();
      expect(component.treasureType).toEqual('');
      expect(component.power).toEqual('');
      expect(component.itemType).toBeNull();
      expect(component.itemNames).toEqual([]);
      expect(component.validTreasure()).toBe(false);
      expect(component.validItem()).toBe(false);
      expect(component.loading()).toBe(true);
      expect(component.validating()).toBe(true);
      
      await vi.advanceTimersByTimeAsync(1);
      
      expect(component.treasureModel()).toEqual(model);
      expect(component.treasureType).toEqual('treasure type 1');
      expect(component.power).toEqual('power 1');
      expect(component.itemType).toEqual(new ItemTypeViewModel('it1', 'Item Type 1'));
      expect(component.itemNames).toEqual(['item 1', 'item 2']);
      expect(component.validTreasure()).toBe(false);
      expect(component.validItem()).toBe(false);
      expect(component.loading()).toBe(true);
      expect(component.validating()).toBe(true);

      await vi.advanceTimersByTimeAsync(delay - 1);

      expect(component.treasureModel()).toEqual(model);
      expect(component.treasureType).toEqual('treasure type 1');
      expect(component.power).toEqual('power 1');
      expect(component.itemType).toEqual(new ItemTypeViewModel('it1', 'Item Type 1'));
      expect(component.itemNames).toEqual(['item 1', 'item 2']);
      expect(component.validTreasure()).toBe(false);
      expect(component.validItem()).toBe(false);
      expect(component.loading()).toBe(true);
      expect(component.validating()).toBe(true);

      await vi.advanceTimersByTimeAsync(1);
      
      expect(component.treasureModel()).toEqual(model);
      expect(component.treasureType).toEqual('treasure type 1');
      expect(component.power).toEqual('power 1');
      expect(component.itemType).toEqual(new ItemTypeViewModel('it1', 'Item Type 1'));
      expect(component.itemNames).toEqual(['item 1', 'item 2']);
      expect(component.validTreasure()).toBe(true);
      expect(component.validItem()).toBe(false);
      expect(component.loading()).toBe(true);
      expect(component.validating()).toBe(true);

      await vi.advanceTimersByTimeAsync(delay - 1);

      expect(component.treasureModel()).toEqual(model);
      expect(component.treasureType).toEqual('treasure type 1');
      expect(component.power).toEqual('power 1');
      expect(component.itemType).toEqual(new ItemTypeViewModel('it1', 'Item Type 1'));
      expect(component.itemNames).toEqual(['item 1', 'item 2']);
      expect(component.validTreasure()).toBe(true);
      expect(component.validItem()).toBe(false);
      expect(component.loading()).toBe(true);
      expect(component.validating()).toBe(true);

      await vi.runAllTimersAsync();
    });

    function getFakeDelay<T>(response: T): Observable<T> {
      return new Observable((observer) => {
        setTimeout(() => {
          observer.next(response);
          observer.complete();
        }, delay);
      });
    }

    let initValidations = [{ t: true, i: true }, { t: true, i: false }, { t: false, i: true }, { t: false, i: false }];

    initValidations.forEach(test => {
      it(`should set the treasure model on init - validity: treasure ${test.t}, item ${test.i}`, async () => {
        const model = getViewModel();
        treasureServiceSpy.getViewModel.mockImplementation(() => getFakeDelay(model));
        treasureServiceSpy.validateTreasure.mockImplementation(() => getFakeDelay(test.t));
        treasureServiceSpy.validateItem.mockImplementation(() => getFakeDelay(test.i));
  
        component.ngOnInit();
  
        expect(component.treasureModel()).not.toBeTruthy();
        expect(component.loading()).toBe(true);
        expect(component.validating()).toBe(true);
  
        await vi.advanceTimersByTimeAsync(delay * 3);
  
        expect(component.treasureModel()).toEqual(model);
        expect(component.loading()).toBe(false);
        expect(component.validating()).toBe(false);
  
        expect(component.level).toEqual(1);
        expect(component.treasureType).toEqual('treasure type 1');
        expect(component.power).toEqual('power 1');
        expect(component.itemType).toEqual(new ItemTypeViewModel('it1', 'Item Type 1'));
        expect(component.itemNames).toEqual(['item 1', 'item 2']);
  
        expect(treasureServiceSpy.validateTreasure).toHaveBeenCalledWith('treasure type 1', 1);
        expect(treasureServiceSpy.validateItem).toHaveBeenCalledWith('it1', 'power 1', '');

        expect(component.validTreasure()).toEqual(test.t);
        expect(component.validItem()).toEqual(test.i);
        
        expect(loggerServiceSpy.logError).not.toHaveBeenCalled();
        expect(sweetAlertServiceSpy.showError).not.toHaveBeenCalled();
      });
    });

    it('should display error from getting treasure model', async () => {
      treasureServiceSpy.getViewModel.mockImplementation(() => getFakeError('I failed'));
      treasureServiceSpy.validateTreasure.mockImplementation(() => getFakeDelay(true));
      treasureServiceSpy.validateItem.mockImplementation(() => getFakeDelay(true));

      component.ngOnInit();
      await vi.advanceTimersByTimeAsync(delay * 3);

      expect(component.treasureModel()).not.toBeTruthy();
      expect(component.treasure()).toBeNull();
      expect(component.item()).toBeNull();
      expect(component.generating()).toBe(false);
      expect(component.loading()).toBe(false);
      expect(component.validating()).toBe(false);
      
      expect(loggerServiceSpy.logError).toHaveBeenCalledWith('I failed');
      expect(sweetAlertServiceSpy.showError).toHaveBeenCalledTimes(1);
    });

    it('should display error from validating treasure on init', async () => {
      const model = getViewModel();
      treasureServiceSpy.getViewModel.mockImplementation(() => getFakeDelay(model));
      treasureServiceSpy.validateTreasure.mockImplementation(() => getFakeError('I failed'));
      treasureServiceSpy.validateItem.mockImplementation(() => getFakeDelay(true));

      component.ngOnInit();
      await vi.advanceTimersByTimeAsync(delay * 3);

      expect(component.treasureModel()).toEqual(model);
      expect(component.treasure()).toBeNull();
      expect(component.item()).toBeNull();
      expect(component.generating()).toBe(false);
      expect(component.loading()).toBe(false);
      expect(component.validating()).toBe(false);
      
      expect(loggerServiceSpy.logError).toHaveBeenCalledWith('I failed');
      expect(sweetAlertServiceSpy.showError).toHaveBeenCalledTimes(1);
    });

    it('should display error from validating item on init', async () => {
      const model = getViewModel();
      treasureServiceSpy.getViewModel.mockImplementation(() => getFakeDelay(model));
      treasureServiceSpy.validateTreasure.mockImplementation(() => getFakeDelay(true));
      treasureServiceSpy.validateItem.mockImplementation(() => getFakeError('I failed'));

      component.ngOnInit();
      await vi.advanceTimersByTimeAsync(delay * 3);

      expect(component.treasureModel()).toEqual(model);
      expect(component.treasure()).toBeNull();
      expect(component.item()).toBeNull();
      expect(component.generating()).toBe(false);
      expect(component.loading()).toBe(false);
      expect(component.validating()).toBe(false);
      
      expect(loggerServiceSpy.logError).toHaveBeenCalledWith('I failed');
      expect(sweetAlertServiceSpy.showError).toHaveBeenCalledTimes(1);
    });

    function getFakeError<T>(message: string): Observable<T> {
      return new Observable((observer) => {
        setTimeout(() => {
          observer.error(new Error(message));
        }, delay);
      });
    }

    it('should validate treasure - invalid if no treasure type', () => {
      component.validateTreasure('', 9266);
      expect(component.validating()).toBe(false);
      expect(component.validTreasure()).toBe(false);
    });

    it('should validate treasure - invalid if no level', () => {
      component.validateTreasure('my treasure type', 0);
      expect(component.validating()).toBe(false);
      expect(component.validTreasure()).toBe(false);
    });

    it('should be validating while validating the treasure', async () => {
      treasureServiceSpy.validateTreasure.mockImplementation(() => getFakeDelay(true));

      component.validateTreasure('my treasure type', 9266);

      expect(treasureServiceSpy.validateTreasure).toHaveBeenCalledWith('my treasure type', 9266);
      expect(component.validating()).toBe(true);
      
      await vi.advanceTimersByTimeAsync(delay - 1);

      expect(component.validating()).toBe(true);

      await vi.runAllTimersAsync();
    });

    it('should validate valid treasure', async () => {
      treasureServiceSpy.validateTreasure.mockImplementation(() => getFakeDelay(true));

      component.validateTreasure('my treasure type', 9266);

      expect(treasureServiceSpy.validateTreasure).toHaveBeenCalledWith('my treasure type', 9266);
      expect(component.validating()).toBe(true);

      await vi.advanceTimersByTimeAsync(delay);

      expect(component.validTreasure()).toBe(true);
      expect(component.validating()).toBe(false);
      
      expect(loggerServiceSpy.logError).not.toHaveBeenCalled();
      expect(sweetAlertServiceSpy.showError).not.toHaveBeenCalled();
    });

    it('should validate invalid treasure', async () => {
      treasureServiceSpy.validateTreasure.mockImplementation(() => getFakeDelay(false));

      component.validateTreasure('my treasure type', 9266);

      expect(treasureServiceSpy.validateTreasure).toHaveBeenCalledWith('my treasure type', 9266);
      expect(component.validating()).toBe(true);

      await vi.advanceTimersByTimeAsync(delay);

      expect(component.validTreasure()).toBe(false);
      expect(component.validating()).toBe(false);
      
      expect(loggerServiceSpy.logError).not.toHaveBeenCalled();
      expect(sweetAlertServiceSpy.showError).not.toHaveBeenCalled();
    });

    it('should display error from validating treasure', async () => {
      treasureServiceSpy.validateTreasure.mockImplementation(() => getFakeError('I failed'));

      component.validateTreasure('my treasure type', 9266);
      await vi.advanceTimersByTimeAsync(delay);

      expect(component.validTreasure()).toBe(false);
      expect(component.validItem()).toBe(false);
      expect(component.treasure()).toBeNull();
      expect(component.item()).toBeNull();
      expect(component.generating()).toBe(false);
      expect(component.loading()).toBe(false);
      expect(component.validating()).toBe(false);
      
      expect(treasureServiceSpy.validateTreasure).toHaveBeenCalledWith('my treasure type', 9266);
      expect(loggerServiceSpy.logError).toHaveBeenCalledWith('I failed');
      expect(sweetAlertServiceSpy.showError).toHaveBeenCalledTimes(1);
    });

    it('should be generating while generating treasure', async () => {
      setupOnInit();

      treasureServiceSpy.getTreasure.mockImplementation(() => getFakeDelay(new Treasure(true, new Coin('munny', 9266))));

      component.generateTreasure();

      expect(treasureServiceSpy.getTreasure).toHaveBeenCalledWith('treasure type 1', 1);
      expect(component.generating()).toBe(true);
      
      await vi.advanceTimersByTimeAsync(delay - 1);

      expect(component.generating()).toBe(true);

      await vi.runAllTimersAsync();
    });

    function setupOnInit() {
      const viewModel = getViewModel();
      component.treasureModel.set(viewModel);

      component.treasureType = viewModel.treasureTypes[0];
      component.level = 1;

      component.itemType = viewModel.itemTypeViewModels[0];
      component.power = viewModel.powers[0];

      component.validTreasure.set(true);
      component.validItem.set(true);
    }

    it('should generate the default treasure', async () => {
      setupOnInit();

      let treasure = new Treasure(true, new Coin('munny', 9266));
      treasureServiceSpy.getTreasure.mockImplementation(() => getFakeDelay(treasure));

      component.generateTreasure();

      expect(treasureServiceSpy.getTreasure).toHaveBeenCalledWith('treasure type 1', 1);
      expect(component.generating()).toBe(true);

      await vi.advanceTimersByTimeAsync(delay);

      expect(component.treasure()).toBe(treasure);
      expect(component.generating()).toBe(false);
      
      expect(loggerServiceSpy.logError).not.toHaveBeenCalled();
      expect(sweetAlertServiceSpy.showError).not.toHaveBeenCalled();
    });

    it(`should generate a non-default treasure`, async () => {
      setupOnInit();

      let treasure = new Treasure(true, new Coin('munny', 9266));
      treasureServiceSpy.getTreasure.mockImplementation(() => getFakeDelay(treasure));

      const viewModel = component.treasureModel()!;
      component.treasureType = viewModel.treasureTypes[1];
      component.level = 90210;

      component.generateTreasure();

      expect(treasureServiceSpy.getTreasure).toHaveBeenCalledWith('treasure type 2', 90210);
      expect(component.generating()).toBe(true);

      await vi.advanceTimersByTimeAsync(delay);

      expect(component.treasure()).toBe(treasure);
      expect(component.generating()).toBe(false);
      
      expect(loggerServiceSpy.logError).not.toHaveBeenCalled();
      expect(sweetAlertServiceSpy.showError).not.toHaveBeenCalled();
    });

    it('should display error from generating treasure', async () => {
      setupOnInit();

      treasureServiceSpy.getTreasure.mockImplementation(() => getFakeError('I failed'));

      component.generateTreasure();
      await vi.advanceTimersByTimeAsync(delay);

      expect(component.treasure()).toBeNull();
      expect(component.item()).toBeNull();
      expect(component.generating()).toBe(false);
      expect(component.loading()).toBe(false);
      expect(component.validating()).toBe(false);
      
      expect(treasureServiceSpy.getTreasure).toHaveBeenCalledWith('treasure type 1', 1);
      expect(loggerServiceSpy.logError).toHaveBeenCalledWith('I failed');
      expect(sweetAlertServiceSpy.showError).toHaveBeenCalledTimes(1);
    });

    it('should validate an item - invalid if no item type', () => {
      setupOnInit();

      component.validateItem('', 'my power', '');
      expect(component.validating()).toBe(false);
      expect(component.validItem()).toBe(false);
    });

    it('should validate an item - invalid if no power', () => {
      setupOnInit();

      component.validateItem('my item type', '', '');
      expect(component.validating()).toBe(false);
      expect(component.validItem()).toBe(false);
    });

    it('should be validating while validating an item', async () => {
      setupOnInit();

      treasureServiceSpy.validateItem.mockImplementation(() => getFakeDelay(true));

      component.validateItem('my item type', 'my power', '');

      expect(treasureServiceSpy.validateItem).toHaveBeenCalledWith('my item type', 'my power', '');
      expect(component.validating()).toBe(true);
      
      await vi.advanceTimersByTimeAsync(delay - 1);

      expect(component.validating()).toBe(true);

      await vi.runAllTimersAsync();
    });

    it('should be validating while validating an item with name', async () => {
      setupOnInit();

      treasureServiceSpy.validateItem.mockImplementation(() => getFakeDelay(true));

      component.validateItem('my item type', 'my power', 'my name');

      expect(treasureServiceSpy.validateItem).toHaveBeenCalledWith('my item type', 'my power', 'my name');
      expect(component.validating()).toBe(true);
      
      await vi.advanceTimersByTimeAsync(delay - 1);

      expect(component.validating()).toBe(true);

      await vi.runAllTimersAsync();
    });

    it('should validate a valid item', async () => {
      setupOnInit();

      treasureServiceSpy.validateItem.mockImplementation(() => getFakeDelay(true));

      component.validateItem('my item type', 'my power', '');

      expect(treasureServiceSpy.validateItem).toHaveBeenCalledWith('my item type', 'my power', '');
      expect(component.validating()).toBe(true);

      await vi.advanceTimersByTimeAsync(delay);

      expect(component.validItem()).toBe(true);
      expect(component.validating()).toBe(false);
      
      expect(loggerServiceSpy.logError).not.toHaveBeenCalled();
      expect(sweetAlertServiceSpy.showError).not.toHaveBeenCalled();
    });

    it('should validate a valid item with name', async () => {
      setupOnInit();

      treasureServiceSpy.validateItem.mockImplementation(() => getFakeDelay(true));

      component.validateItem('my item type', 'my power', 'my name');

      expect(treasureServiceSpy.validateItem).toHaveBeenCalledWith('my item type', 'my power', 'my name');
      expect(component.validating()).toBe(true);

      await vi.advanceTimersByTimeAsync(delay);

      expect(component.validItem()).toBe(true);
      expect(component.validating()).toBe(false);
      
      expect(loggerServiceSpy.logError).not.toHaveBeenCalled();
      expect(sweetAlertServiceSpy.showError).not.toHaveBeenCalled();
    });

    it('should validate an invalid item', async () => {
      setupOnInit();

      treasureServiceSpy.validateItem.mockImplementation(() => getFakeDelay(false));

      component.validateItem('my item type', 'my power', '');

      expect(treasureServiceSpy.validateItem).toHaveBeenCalledWith('my item type', 'my power', '');
      expect(component.validating()).toBe(true);

      await vi.advanceTimersByTimeAsync(delay);

      expect(component.validItem()).toBe(false);
      expect(component.validating()).toBe(false);
      
      expect(loggerServiceSpy.logError).not.toHaveBeenCalled();
      expect(sweetAlertServiceSpy.showError).not.toHaveBeenCalled();
    });

    it('should validate an invalid item with name', async () => {
      setupOnInit();

      treasureServiceSpy.validateItem.mockImplementation(() => getFakeDelay(false));

      component.validateItem('my item type', 'my power', 'my name');

      expect(treasureServiceSpy.validateItem).toHaveBeenCalledWith('my item type', 'my power', 'my name');
      expect(component.validating()).toBe(true);

      await vi.advanceTimersByTimeAsync(delay);

      expect(component.validItem()).toBe(false);
      expect(component.validating()).toBe(false);
      
      expect(loggerServiceSpy.logError).not.toHaveBeenCalled();
      expect(sweetAlertServiceSpy.showError).not.toHaveBeenCalled();
    });

    it('should display error from validating item', async () => {
      setupOnInit();

      treasureServiceSpy.validateItem.mockImplementation(() => getFakeError('I failed'));

      component.validateItem('my item type', 'my power', '');
      await vi.advanceTimersByTimeAsync(delay);

      expect(component.validTreasure()).toBe(false);
      expect(component.validItem()).toBe(false);
      expect(component.treasure()).toBeNull();
      expect(component.item()).toBeNull();
      expect(component.generating()).toBe(false);
      expect(component.loading()).toBe(false);
      expect(component.validating()).toBe(false);
      
      expect(treasureServiceSpy.validateItem).toHaveBeenCalledWith('my item type', 'my power', '');
      expect(loggerServiceSpy.logError).toHaveBeenCalledWith('I failed');
      expect(sweetAlertServiceSpy.showError).toHaveBeenCalledTimes(1);
    });

    it('should display error from validating item with name', async () => {
      setupOnInit();

      treasureServiceSpy.validateItem.mockImplementation(() => getFakeError('I failed'));

      component.validateItem('my item type', 'my power', 'my name');
      await vi.advanceTimersByTimeAsync(delay);

      expect(component.validTreasure()).toBe(false);
      expect(component.validItem()).toBe(false);
      expect(component.treasure()).toBeNull();
      expect(component.item()).toBeNull();
      expect(component.generating()).toBe(false);
      expect(component.loading()).toBe(false);
      expect(component.validating()).toBe(false);
      
      expect(treasureServiceSpy.validateItem).toHaveBeenCalledWith('my item type', 'my power', 'my name');
      expect(loggerServiceSpy.logError).toHaveBeenCalledWith('I failed');
      expect(sweetAlertServiceSpy.showError).toHaveBeenCalledTimes(1);
    });

    it('should be generating while generating an item', async () => {
      setupOnInit();

      treasureServiceSpy.getItem.mockImplementation(() => getFakeDelay(new Item('my item', 'my item type')));

      component.generateItem();

      expect(treasureServiceSpy.getItem).toHaveBeenCalledWith('it1', 'power 1', '');
      expect(component.generating()).toBe(true);
      
      await vi.advanceTimersByTimeAsync(delay - 1);

      expect(component.generating()).toBe(true);

      await vi.runAllTimersAsync();
    });

    it('should be generating while generating an item with name', async () => {
      setupOnInit();
      
      treasureServiceSpy.getItem.mockImplementation(() => getFakeDelay(new Item('my item', 'my item type')));

      component.itemName = component.itemNames[0];

      component.generateItem();

      expect(treasureServiceSpy.getItem).toHaveBeenCalledWith('it1', 'power 1', 'item 1');
      expect(component.generating()).toBe(true);
      
      await vi.advanceTimersByTimeAsync(delay - 1);

      expect(component.generating()).toBe(true);

      await vi.runAllTimersAsync();
    });

    it('should generate the default item', async () => {
      setupOnInit();

      let item = new Item('my item', 'my item type');
      treasureServiceSpy.getItem.mockImplementation(() => getFakeDelay(item));

      component.generateItem();

      expect(treasureServiceSpy.getItem).toHaveBeenCalledWith('it1', 'power 1', '');
      expect(component.generating()).toBe(true);

      await vi.advanceTimersByTimeAsync(delay);

      expect(component.item()).toBe(item);
      expect(component.generating()).toBe(false);
      
      expect(loggerServiceSpy.logError).not.toHaveBeenCalled();
      expect(sweetAlertServiceSpy.showError).not.toHaveBeenCalled();
    });

    it('should generate the default item with name', async () => {
      setupOnInit();

      let item = new Item('my item', 'my item type');
      treasureServiceSpy.getItem.mockImplementation(() => getFakeDelay(item));

      component.itemName = component.itemNames[0];

      component.generateItem();

      expect(treasureServiceSpy.getItem).toHaveBeenCalledWith('it1', 'power 1', 'item 1');
      expect(component.generating()).toBe(true);

      await vi.advanceTimersByTimeAsync(delay);

      expect(component.item()).toBe(item);
      expect(component.generating()).toBe(false);
      
      expect(loggerServiceSpy.logError).not.toHaveBeenCalled();
      expect(sweetAlertServiceSpy.showError).not.toHaveBeenCalled();
    });

    it(`should generate a non-default item`, async () => {
      setupOnInit();

      let item = new Item('my item', 'my item type');
      treasureServiceSpy.getItem.mockImplementation(() => getFakeDelay(item));

      const viewModel = component.treasureModel()!;
      component.itemType = viewModel.itemTypeViewModels[1];
      component.power = viewModel.powers[1];

      component.generateItem();

      expect(treasureServiceSpy.getItem).toHaveBeenCalledWith('it2', 'power 2', '');
      expect(component.generating()).toBe(true);

      await vi.advanceTimersByTimeAsync(delay);

      expect(component.item()).toBe(item);
      expect(component.generating()).toBe(false);
      
      expect(loggerServiceSpy.logError).not.toHaveBeenCalled();
      expect(sweetAlertServiceSpy.showError).not.toHaveBeenCalled();
    });

    it(`should generate a non-default item with name`, async () => {
      setupOnInit();

      let item = new Item('my item', 'my item type');
      treasureServiceSpy.getItem.mockImplementation(() => getFakeDelay(item));

      const viewModel = component.treasureModel()!;
      component.itemType = viewModel.itemTypeViewModels[1];
      component.power = viewModel.powers[1];
      component.itemName = viewModel.itemNames['it2'][1];

      component.generateItem();

      expect(treasureServiceSpy.getItem).toHaveBeenCalledWith('it2', 'power 2', 'item 4');
      expect(component.generating()).toBe(true);

      await vi.advanceTimersByTimeAsync(delay);

      expect(component.item()).toBe(item);
      expect(component.generating()).toBe(false);
      
      expect(loggerServiceSpy.logError).not.toHaveBeenCalled();
      expect(sweetAlertServiceSpy.showError).not.toHaveBeenCalled();
    });

    it('should display error from generating an item', async () => {
      setupOnInit();

      treasureServiceSpy.getItem.mockImplementation(() => getFakeError('I failed'));

      component.generateItem();
      await vi.advanceTimersByTimeAsync(delay);

      expect(component.treasure()).toBeNull();
      expect(component.item()).toBeNull();
      expect(component.generating()).toBe(false);
      expect(component.loading()).toBe(false);
      expect(component.validating()).toBe(false);
      
      expect(treasureServiceSpy.getItem).toHaveBeenCalledWith('it1', 'power 1', '');
      expect(loggerServiceSpy.logError).toHaveBeenCalledWith('I failed');
      expect(sweetAlertServiceSpy.showError).toHaveBeenCalledTimes(1);
    });

    it('should display error from generating an item with name', async () => {
      setupOnInit();

      treasureServiceSpy.getItem.mockImplementation(() => getFakeError('I failed'));

      component.itemName = component.itemNames[1];

      component.generateItem();
      await vi.advanceTimersByTimeAsync(delay);

      expect(component.treasure()).toBeNull();
      expect(component.item()).toBeNull();
      expect(component.generating()).toBe(false);
      expect(component.loading()).toBe(false);
      expect(component.validating()).toBe(false);
      
      expect(treasureServiceSpy.getItem).toHaveBeenCalledWith('it1', 'power 1', 'item 2');
      expect(loggerServiceSpy.logError).toHaveBeenCalledWith('I failed');
      expect(sweetAlertServiceSpy.showError).toHaveBeenCalledTimes(1);
    });

    it('should validate valid item and reset name', async () => {
      setupOnInit();

      treasureServiceSpy.validateItem.mockImplementation(() => getFakeDelay(true));

      const viewModel = component.treasureModel()!;
      component.validateItemAndResetName(viewModel.itemTypeViewModels[1].itemType, 'my power', '');

      expect(component.itemName).toEqual('');

      expect(treasureServiceSpy.validateItem).toHaveBeenCalledWith('it2', 'my power', '');
      expect(component.validating()).toBe(true);

      await vi.advanceTimersByTimeAsync(delay);

      expect(component.validItem()).toBe(true);
      expect(component.validating()).toBe(false);
    });

    it('should validate invalid item and reset name', async () => {
      setupOnInit();

      treasureServiceSpy.validateItem.mockImplementation(() => getFakeDelay(false));

      const viewModel = component.treasureModel()!;
      component.validateItemAndResetName(viewModel.itemTypeViewModels[1].itemType, 'my power', '');

      expect(component.itemName).toEqual('');

      expect(treasureServiceSpy.validateItem).toHaveBeenCalledWith('it2', 'my power', '');
      expect(component.validating()).toBe(true);

      await vi.advanceTimersByTimeAsync(delay);

      expect(component.validItem()).toBe(false);
      expect(component.validating()).toBe(false);
    });

    it('should download treasure - with coin', () => {
      let treasure = new Treasure(true, new Coin('munny', 9266));
      component.treasure.set(treasure);

      treasurePipeSpy.transform.mockReturnValue('my formatted treasure');

      component.downloadTreasure();

      expect(treasurePipeSpy.transform).toHaveBeenCalledWith(treasure);
      expect(fileSaverServiceSpy.save).toHaveBeenCalledWith('my formatted treasure', 'Treasure (9266 munny, 0 goods, 0 items)');
    });

    it('should download treasure - with goods', () => {
      let treasure = new Treasure();
      treasure.goods = [new Good('good 1', 90210), new Good('good 2', 42)];
      component.treasure.set(treasure);

      treasurePipeSpy.transform.mockReturnValue('my formatted treasure');

      component.downloadTreasure();

      expect(treasurePipeSpy.transform).toHaveBeenCalledWith(treasure);
      expect(fileSaverServiceSpy.save).toHaveBeenCalledWith('my formatted treasure', 'Treasure (0 coins, 2 goods, 0 items)');
    });

    it('should download treasure - with items', () => {
      let treasure = new Treasure();
      treasure.items = [new Item('item 1', 'itemtype'), new Item('item 2', 'itemtype')];
      component.treasure.set(treasure);

      treasurePipeSpy.transform.mockReturnValue('my formatted treasure');

      component.downloadTreasure();

      expect(treasurePipeSpy.transform).toHaveBeenCalledWith(treasure);
      expect(fileSaverServiceSpy.save).toHaveBeenCalledWith('my formatted treasure', 'Treasure (0 coins, 0 goods, 2 items)');
    });

    it('should download treasure - all', () => {
      let treasure = new Treasure(true, new Coin('munny', 9266));
      treasure.goods = [new Good('good 1', 90210), new Good('good 2', 42)];
      treasure.items = [new Item('item 1', 'itemtype')];
      component.treasure.set(treasure);

      treasurePipeSpy.transform.mockReturnValue('my formatted treasure');

      component.downloadTreasure();

      expect(treasurePipeSpy.transform).toHaveBeenCalledWith(treasure);
      expect(fileSaverServiceSpy.save).toHaveBeenCalledWith('my formatted treasure', 'Treasure (9266 munny, 2 goods, 1 items)');
    });

    it('should not download missing treasure', () => {
      component.treasure.set(null);

      component.downloadTreasure();
      
      expect(treasurePipeSpy.transform).not.toHaveBeenCalled();
      expect(fileSaverServiceSpy.save).not.toHaveBeenCalled();
    });

    it('should download empty treasure', () => {
      let treasure = new Treasure(false, new Coin(), [], []);
      component.treasure.set(treasure);

      treasurePipeSpy.transform.mockReturnValue('my empty treasure');

      component.downloadTreasure();

      expect(treasurePipeSpy.transform).toHaveBeenCalledWith(treasure);
      expect(fileSaverServiceSpy.save).toHaveBeenCalledWith('my empty treasure', 'Treasure (0 coins, 0 goods, 0 items)');
    });

    it('should download item', () => {
      let item = new Item('my item', 'my item type');
      item.summary = 'my item summary'

      component.item.set(item);

      itemPipeSpy.transform.mockReturnValue('my formatted item');

      component.downloadItem();

      expect(itemPipeSpy.transform).toHaveBeenCalledWith(item);
      expect(fileSaverServiceSpy.save).toHaveBeenCalledWith('my formatted item', 'Item (my item summary)');
    });

    it('BUG - should download armor', () => {
      let item = new Armor('my armor', 'Armor');
      item.summary = 'my armor summary'

      component.item.set(item);

      itemPipeSpy.transform.mockReturnValue('my formatted armor');

      component.downloadItem();

      expect(itemPipeSpy.transform).toHaveBeenCalledWith(item);
      expect(fileSaverServiceSpy.save).toHaveBeenCalledWith('my formatted armor', 'Item (my armor summary)');
    });

    it('BUG - should download weapon', () => {
      let item = new Weapon('my weapon', 'Weapon');
      item.summary = 'my weapon summary'

      component.item.set(item);

      itemPipeSpy.transform.mockReturnValue('my formatted weapon');

      component.downloadItem();

      expect(itemPipeSpy.transform).toHaveBeenCalledWith(item);
      expect(fileSaverServiceSpy.save).toHaveBeenCalledWith('my formatted weapon', 'Item (my weapon summary)');
    });

    it('should not download missing item', () => {
      component.item.set(null);

      component.downloadItem();
      
      expect(itemPipeSpy.transform).not.toHaveBeenCalled();
      expect(fileSaverServiceSpy.save).not.toHaveBeenCalled();
    });

    it('BUG - should show an item is invalid - not a valid matching power', async () => {
      setupOnInit();

      treasureServiceSpy.validateItem.mockImplementation(() => getFakeDelay(false));

      const viewModel = component.treasureModel()!;
      const itemType = viewModel.itemTypeViewModels[1];
      let power = viewModel.powers[0];
      
      component.validateItemAndResetName(itemType.itemType, power, '');
      component.itemType = itemType;
      
      expect(component.itemType?.itemType).toEqual('it2');
      expect(component.itemName).toEqual('');

      expect(treasureServiceSpy.validateItem).toHaveBeenCalledWith('it2', 'power 1', '');
      expect(component.validating()).toBe(true);

      await vi.advanceTimersByTimeAsync(delay);

      expect(component.validItem()).toBe(false);
      expect(component.validating()).toBe(false);
  
      power = viewModel.powers[1];
      component.validateItemAndResetName(itemType.itemType, power, '');
      component.power = power;
      
      expect(component.power).toEqual('power 2');

      expect(treasureServiceSpy.validateItem).toHaveBeenCalledWith('it2', 'power 2', '');
      expect(component.validating()).toBe(true);

      await vi.advanceTimersByTimeAsync(delay);

      expect(component.validItem()).toBe(false);
      expect(component.validating()).toBe(false);
    });
  });
});