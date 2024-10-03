import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { TreasureGenComponent } from './treasuregen.component';
import { AppModule } from '../../app.module';
import { TreasureService } from '../services/treasure.service';
import { TreasurePipe } from '../pipes/treasure.pipe';
import { SweetAlertService } from '../../shared/services/sweetAlert.service';
import { LoggerService } from '../../shared/services/logger.service';
import { Observable } from 'rxjs';
import { TreasureGenViewModel } from '../models/treasuregenViewModel.model';
import { FileSaverService } from '../../shared/services/fileSaver.service';
import { ItemTypeViewModel } from '../models/itemTypeViewModel.model';
import { Treasure } from '../models/treasure.model';
import { Coin } from '../models/coin.model';
import { Item } from '../models/item.model';
import { By } from '@angular/platform-browser';
import { TreasureComponent } from './treasure.component';
import { ItemComponent } from './item.component';
import * as FileSaver from 'file-saver';
import { Good } from '../models/good.model';
import { ItemPipe } from '../pipes/item.pipe';
import { LoadingComponent } from '../../shared/components/loading.component';
import { Size } from '../../shared/components/size.enum';
import { TestHelper } from '../../testHelper.spec';

describe('TreasureGenComponent', () => {
  describe('unit', () => {
    let component: TreasureGenComponent;
    let treasureServiceSpy: jasmine.SpyObj<TreasureService>;
    let itemPipeSpy: jasmine.SpyObj<ItemPipe>;
    let treasurePipeSpy: jasmine.SpyObj<TreasurePipe>;
    let sweetAlertServiceSpy: jasmine.SpyObj<SweetAlertService>;
    let loggerServiceSpy: jasmine.SpyObj<LoggerService>;
    let fileSaverServiceSpy: jasmine.SpyObj<FileSaverService>;

    const delay = 10;
  
    beforeEach(() => {
      treasureServiceSpy = jasmine.createSpyObj('TreasureService', ['getViewModel', 'getTreasure', 'validateTreasure', 'getItem', 'validateItem']);
      itemPipeSpy = jasmine.createSpyObj('ItemPipe', ['transform']);
      treasurePipeSpy = jasmine.createSpyObj('TreasurePipe', ['transform']);
      sweetAlertServiceSpy = jasmine.createSpyObj('SweetAlertService', ['showError']);
      loggerServiceSpy = jasmine.createSpyObj('LoggerService', ['logError']);
      fileSaverServiceSpy = jasmine.createSpyObj('FileSaverService', ['save']);

      component = new TreasureGenComponent(treasureServiceSpy, sweetAlertServiceSpy, fileSaverServiceSpy, itemPipeSpy, treasurePipeSpy, loggerServiceSpy);
    });
  
    it(`should initialize the public properties`, () => {
      expect(component.generating).toBeFalse();
      expect(component.validating).toBeFalse();
      expect(component.validTreasure).toBeFalse();
      expect(component.validItem).toBeFalse();
      expect(component.treasure).toBeNull();
      expect(component.item).toBeNull();
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

    it('should be validating and loading while fetching the treasure model', fakeAsync(() => {
      const model = getViewModel();
      treasureServiceSpy.getViewModel.and.callFake(() => getFakeDelay(model));
      treasureServiceSpy.validateTreasure.and.callFake(() => getFakeDelay(true));
      treasureServiceSpy.validateItem.and.callFake(() => getFakeDelay(true));

      component.ngOnInit();

      expect(component.treasureModel).not.toBeTruthy();
      expect(component.treasureType).toEqual('');
      expect(component.power).toEqual('');
      expect(component.itemType).toBeNull();
      expect(component.itemNames).toEqual([]);
      expect(component.validTreasure).toBeFalse();
      expect(component.validItem).toBeFalse();
      expect(component.loading).toBeTrue();
      expect(component.validating).toBeTrue();
      
      tick(delay - 1);

      expect(component.treasureModel).not.toBeTruthy();
      expect(component.treasureType).toEqual('');
      expect(component.power).toEqual('');
      expect(component.itemType).toBeNull();
      expect(component.itemNames).toEqual([]);
      expect(component.validTreasure).toBeFalse();
      expect(component.validItem).toBeFalse();
      expect(component.loading).toBeTrue();
      expect(component.validating).toBeTrue();
      
      tick(1);
      
      expect(component.treasureModel).toEqual(model);
      expect(component.treasureType).toEqual('treasure type 1');
      expect(component.power).toEqual('power 1');
      expect(component.itemType).toEqual(new ItemTypeViewModel('it1', 'Item Type 1'));
      expect(component.itemNames).toEqual(['item 1', 'item 2']);
      expect(component.validTreasure).toBeFalse();
      expect(component.validItem).toBeFalse();
      expect(component.loading).toBeTrue();
      expect(component.validating).toBeTrue();

      tick(delay - 1);

      expect(component.treasureModel).toEqual(model);
      expect(component.treasureType).toEqual('treasure type 1');
      expect(component.power).toEqual('power 1');
      expect(component.itemType).toEqual(new ItemTypeViewModel('it1', 'Item Type 1'));
      expect(component.itemNames).toEqual(['item 1', 'item 2']);
      expect(component.validTreasure).toBeFalse();
      expect(component.validItem).toBeFalse();
      expect(component.loading).toBeTrue();
      expect(component.validating).toBeTrue();

      tick(1);
      
      expect(component.treasureModel).toEqual(model);
      expect(component.treasureType).toEqual('treasure type 1');
      expect(component.power).toEqual('power 1');
      expect(component.itemType).toEqual(new ItemTypeViewModel('it1', 'Item Type 1'));
      expect(component.itemNames).toEqual(['item 1', 'item 2']);
      expect(component.validTreasure).toBeTrue();
      expect(component.validItem).toBeFalse();
      expect(component.loading).toBeTrue();
      expect(component.validating).toBeTrue();

      tick(delay - 1);

      expect(component.treasureModel).toEqual(model);
      expect(component.treasureType).toEqual('treasure type 1');
      expect(component.power).toEqual('power 1');
      expect(component.itemType).toEqual(new ItemTypeViewModel('it1', 'Item Type 1'));
      expect(component.itemNames).toEqual(['item 1', 'item 2']);
      expect(component.validTreasure).toBeTrue();
      expect(component.validItem).toBeFalse();
      expect(component.loading).toBeTrue();
      expect(component.validating).toBeTrue();

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

    let initValidations = [{ t: true, i: true }, { t: true, i: false }, { t: false, i: true }, { t: false, i: false }];

    initValidations.forEach(test => {
      it(`should set the treasure model on init - validity: treasure ${test.t}, item ${test.i}`, fakeAsync(() => {
        const model = getViewModel();
        treasureServiceSpy.getViewModel.and.callFake(() => getFakeDelay(model));
        treasureServiceSpy.validateTreasure.and.callFake(() => getFakeDelay(test.t));
        treasureServiceSpy.validateItem.and.callFake(() => getFakeDelay(test.i));
  
        component.ngOnInit();
  
        expect(component.treasureModel).not.toBeTruthy();
        expect(component.loading).toBeTrue();
        expect(component.validating).toBeTrue();
  
        tick(delay * 3);
  
        expect(component.treasureModel).toEqual(model);
        expect(component.loading).toBeFalse();
        expect(component.validating).toBeFalse();
  
        expect(component.level).toEqual(1);
        expect(component.treasureType).toEqual('treasure type 1');
        expect(component.power).toEqual('power 1');
        expect(component.itemType).toEqual(new ItemTypeViewModel('it1', 'Item Type 1'));
        expect(component.itemNames).toEqual(['item 1', 'item 2']);
  
        expect(treasureServiceSpy.validateTreasure).toHaveBeenCalledWith('treasure type 1', 1);
        expect(treasureServiceSpy.validateItem).toHaveBeenCalledWith('it1', 'power 1', '');

        expect(component.validTreasure).toEqual(test.t);
        expect(component.validItem).toEqual(test.i);
        
        expect(loggerServiceSpy.logError).not.toHaveBeenCalled();
        expect(sweetAlertServiceSpy.showError).not.toHaveBeenCalled();
      }));
    });

    it('should display error from getting treasure model', fakeAsync(() => {
      treasureServiceSpy.getViewModel.and.callFake(() => getFakeError('I failed'));
      treasureServiceSpy.validateTreasure.and.callFake(() => getFakeDelay(true));
      treasureServiceSpy.validateItem.and.callFake(() => getFakeDelay(true));

      component.ngOnInit();
      tick(delay * 3);

      expect(component.treasureModel).not.toBeTruthy();
      expect(component.treasure).toBeNull();
      expect(component.item).toBeNull();
      expect(component.generating).toBeFalse();
      expect(component.loading).toBeFalse();
      expect(component.validating).toBeFalse();
      
      expect(loggerServiceSpy.logError).toHaveBeenCalledWith('I failed');
      expect(sweetAlertServiceSpy.showError).toHaveBeenCalledTimes(1);
    }));

    it('should display error from validating treasure on init', fakeAsync(() => {
      const model = getViewModel();
      treasureServiceSpy.getViewModel.and.callFake(() => getFakeDelay(model));
      treasureServiceSpy.validateTreasure.and.callFake(() => getFakeError('I failed'));
      treasureServiceSpy.validateItem.and.callFake(() => getFakeDelay(true));

      component.ngOnInit();
      tick(delay * 3);

      expect(component.treasureModel).toEqual(model);
      expect(component.treasure).toBeNull();
      expect(component.item).toBeNull();
      expect(component.generating).toBeFalse();
      expect(component.loading).toBeFalse();
      expect(component.validating).toBeFalse();
      
      expect(loggerServiceSpy.logError).toHaveBeenCalledWith('I failed');
      expect(sweetAlertServiceSpy.showError).toHaveBeenCalledTimes(1);
    }));

    it('should display error from validating item on init', fakeAsync(() => {
      const model = getViewModel();
      treasureServiceSpy.getViewModel.and.callFake(() => getFakeDelay(model));
      treasureServiceSpy.validateTreasure.and.callFake(() => getFakeDelay(true));
      treasureServiceSpy.validateItem.and.callFake(() => getFakeError('I failed'));

      component.ngOnInit();
      tick(delay * 3);

      expect(component.treasureModel).toEqual(model);
      expect(component.treasure).toBeNull();
      expect(component.item).toBeNull();
      expect(component.generating).toBeFalse();
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

    it('should validate treasure - invalid if no treasure type', () => {
      component.validateTreasure('', 9266);
      expect(component.validating).toBeFalse();
      expect(component.validTreasure).toBeFalse();
    });

    it('should validate treasure - invalid if no level', () => {
      component.validateTreasure('my treasure type', 0);
      expect(component.validating).toBeFalse();
      expect(component.validTreasure).toBeFalse();
    });

    it('should be validating while validating the treasure', fakeAsync(() => {
      treasureServiceSpy.validateTreasure.and.callFake(() => getFakeDelay(true));

      component.validateTreasure('my treasure type', 9266);

      expect(treasureServiceSpy.validateTreasure).toHaveBeenCalledWith('my treasure type', 9266);
      expect(component.validating).toBeTrue();
      
      tick(delay - 1);

      expect(component.validating).toBeTrue();

      flush();
    }));

    it('should validate valid treasure', fakeAsync(() => {
      treasureServiceSpy.validateTreasure.and.callFake(() => getFakeDelay(true));

      component.validateTreasure('my treasure type', 9266);

      expect(treasureServiceSpy.validateTreasure).toHaveBeenCalledWith('my treasure type', 9266);
      expect(component.validating).toBeTrue();

      tick(delay);

      expect(component.validTreasure).toBeTrue();
      expect(component.validating).toBeFalse();
      
      expect(loggerServiceSpy.logError).not.toHaveBeenCalled();
      expect(sweetAlertServiceSpy.showError).not.toHaveBeenCalled();
    }));

    it('should validate invalid treasure', fakeAsync(() => {
      treasureServiceSpy.validateTreasure.and.callFake(() => getFakeDelay(false));

      component.validateTreasure('my treasure type', 9266);

      expect(treasureServiceSpy.validateTreasure).toHaveBeenCalledWith('my treasure type', 9266);
      expect(component.validating).toBeTrue();

      tick(delay);

      expect(component.validTreasure).toBeFalse();
      expect(component.validating).toBeFalse();
      
      expect(loggerServiceSpy.logError).not.toHaveBeenCalled();
      expect(sweetAlertServiceSpy.showError).not.toHaveBeenCalled();
    }));

    it('should display error from validating treasure', fakeAsync(() => {
      treasureServiceSpy.validateTreasure.and.callFake(() => getFakeError('I failed'));

      component.validateTreasure('my treasure type', 9266);
      tick(delay);

      expect(component.validTreasure).toBeFalse();
      expect(component.validItem).toBeFalse();
      expect(component.treasure).toBeNull();
      expect(component.item).toBeNull();
      expect(component.generating).toBeFalse();
      expect(component.loading).toBeFalse();
      expect(component.validating).toBeFalse();
      
      expect(treasureServiceSpy.validateTreasure).toHaveBeenCalledWith('my treasure type', 9266);
      expect(loggerServiceSpy.logError).toHaveBeenCalledWith('I failed');
      expect(sweetAlertServiceSpy.showError).toHaveBeenCalledTimes(1);
    }));

    it('should be generating while generating treasure', fakeAsync(() => {
      setupOnInit();

      treasureServiceSpy.getTreasure.and.callFake(() => getFakeDelay(new Treasure(new Coin('munny', 9266))));

      component.generateTreasure();

      expect(treasureServiceSpy.getTreasure).toHaveBeenCalledWith('treasure type 1', 1);
      expect(component.generating).toBeTrue();
      
      tick(delay - 1);

      expect(component.generating).toBeTrue();

      flush();
    }));

    function setupOnInit() {
      component.treasureModel = getViewModel();

      component.treasureType = component.treasureModel.treasureTypes[0];
      component.level = 1;

      component.itemType = component.treasureModel.itemTypeViewModels[0];
      component.power = component.treasureModel.powers[0];

      component.validTreasure = true;
      component.validItem = true;
    }

    it('should generate the default treasure', fakeAsync(() => {
      setupOnInit();

      let treasure = new Treasure(new Coin('munny', 9266));
      treasureServiceSpy.getTreasure.and.callFake(() => getFakeDelay(treasure));

      component.generateTreasure();

      expect(treasureServiceSpy.getTreasure).toHaveBeenCalledWith('treasure type 1', 1);
      expect(component.generating).toBeTrue();

      tick(delay);

      expect(component.treasure).toBe(treasure);
      expect(component.generating).toBeFalse();
      
      expect(loggerServiceSpy.logError).not.toHaveBeenCalled();
      expect(sweetAlertServiceSpy.showError).not.toHaveBeenCalled();
    }));

    it(`should generate a non-default treasure`, fakeAsync(() => {
      setupOnInit();

      let treasure = new Treasure(new Coin('munny', 9266));
      treasureServiceSpy.getTreasure.and.callFake(() => getFakeDelay(treasure));

      component.treasureType = component.treasureModel.treasureTypes[1];
      component.level = 90210;

      component.generateTreasure();

      expect(treasureServiceSpy.getTreasure).toHaveBeenCalledWith('treasure type 2', 90210);
      expect(component.generating).toBeTrue();

      tick(delay);

      expect(component.treasure).toBe(treasure);
      expect(component.generating).toBeFalse();
      
      expect(loggerServiceSpy.logError).not.toHaveBeenCalled();
      expect(sweetAlertServiceSpy.showError).not.toHaveBeenCalled();
    }));

    it('should display error from generating treasure', fakeAsync(() => {
      setupOnInit();

      treasureServiceSpy.getTreasure.and.callFake(() => getFakeError('I failed'));

      component.generateTreasure();
      tick(delay);

      expect(component.treasure).toBeNull();
      expect(component.item).toBeNull();
      expect(component.generating).toBeFalse();
      expect(component.loading).toBeFalse();
      expect(component.validating).toBeFalse();
      
      expect(treasureServiceSpy.getTreasure).toHaveBeenCalledWith('treasure type 1', 1);
      expect(loggerServiceSpy.logError).toHaveBeenCalledWith('I failed');
      expect(sweetAlertServiceSpy.showError).toHaveBeenCalledTimes(1);
    }));

    it('should validate an item - invalid if no item type', fakeAsync(() => {
      setupOnInit();

      component.validateItem('', 'my power', '');
      expect(component.validating).toBeFalse();
      expect(component.validItem).toBeFalse();
    }));

    it('should validate an item - invalid if no power', fakeAsync(() => {
      setupOnInit();

      component.validateItem('my item type', '', '');
      expect(component.validating).toBeFalse();
      expect(component.validItem).toBeFalse();
    }));

    it('should be validating while validating an item', fakeAsync(() => {
      setupOnInit();

      treasureServiceSpy.validateItem.and.callFake(() => getFakeDelay(true));

      component.validateItem('my item type', 'my power', '');

      expect(treasureServiceSpy.validateItem).toHaveBeenCalledWith('my item type', 'my power', '');
      expect(component.validating).toBeTrue();
      
      tick(delay - 1);

      expect(component.validating).toBeTrue();

      flush();
    }));

    it('should be validating while validating an item with name', fakeAsync(() => {
      setupOnInit();

      treasureServiceSpy.validateItem.and.callFake(() => getFakeDelay(true));

      component.validateItem('my item type', 'my power', 'my name');

      expect(treasureServiceSpy.validateItem).toHaveBeenCalledWith('my item type', 'my power', 'my name');
      expect(component.validating).toBeTrue();
      
      tick(delay - 1);

      expect(component.validating).toBeTrue();

      flush();
    }));

    it('should validate a valid item', fakeAsync(() => {
      setupOnInit();

      treasureServiceSpy.validateItem.and.callFake(() => getFakeDelay(true));

      component.validateItem('my item type', 'my power', '');

      expect(treasureServiceSpy.validateItem).toHaveBeenCalledWith('my item type', 'my power', '');
      expect(component.validating).toBeTrue();

      tick(delay);

      expect(component.validItem).toBeTrue();
      expect(component.validating).toBeFalse();
      
      expect(loggerServiceSpy.logError).not.toHaveBeenCalled();
      expect(sweetAlertServiceSpy.showError).not.toHaveBeenCalled();
    }));

    it('should validate a valid item with name', fakeAsync(() => {
      setupOnInit();

      treasureServiceSpy.validateItem.and.callFake(() => getFakeDelay(true));

      component.validateItem('my item type', 'my power', 'my name');

      expect(treasureServiceSpy.validateItem).toHaveBeenCalledWith('my item type', 'my power', 'my name');
      expect(component.validating).toBeTrue();

      tick(delay);

      expect(component.validItem).toBeTrue();
      expect(component.validating).toBeFalse();
      
      expect(loggerServiceSpy.logError).not.toHaveBeenCalled();
      expect(sweetAlertServiceSpy.showError).not.toHaveBeenCalled();
    }));

    it('should validate an invalid item', fakeAsync(() => {
      setupOnInit();

      treasureServiceSpy.validateItem.and.callFake(() => getFakeDelay(false));

      component.validateItem('my item type', 'my power', '');

      expect(treasureServiceSpy.validateItem).toHaveBeenCalledWith('my item type', 'my power', '');
      expect(component.validating).toBeTrue();

      tick(delay);

      expect(component.validItem).toBeFalse();
      expect(component.validating).toBeFalse();
      
      expect(loggerServiceSpy.logError).not.toHaveBeenCalled();
      expect(sweetAlertServiceSpy.showError).not.toHaveBeenCalled();
    }));

    it('should validate an invalid item with name', fakeAsync(() => {
      setupOnInit();

      treasureServiceSpy.validateItem.and.callFake(() => getFakeDelay(false));

      component.validateItem('my item type', 'my power', 'my name');

      expect(treasureServiceSpy.validateItem).toHaveBeenCalledWith('my item type', 'my power', 'my name');
      expect(component.validating).toBeTrue();

      tick(delay);

      expect(component.validItem).toBeFalse();
      expect(component.validating).toBeFalse();
      
      expect(loggerServiceSpy.logError).not.toHaveBeenCalled();
      expect(sweetAlertServiceSpy.showError).not.toHaveBeenCalled();
    }));

    it('should display error from validating item', fakeAsync(() => {
      setupOnInit();

      treasureServiceSpy.validateItem.and.callFake(() => getFakeError('I failed'));

      component.validateItem('my item type', 'my power', '');
      tick(delay);

      expect(component.validTreasure).toBeFalse();
      expect(component.validItem).toBeFalse();
      expect(component.treasure).toBeNull();
      expect(component.item).toBeNull();
      expect(component.generating).toBeFalse();
      expect(component.loading).toBeFalse();
      expect(component.validating).toBeFalse();
      
      expect(treasureServiceSpy.validateItem).toHaveBeenCalledWith('my item type', 'my power', '');
      expect(loggerServiceSpy.logError).toHaveBeenCalledWith('I failed');
      expect(sweetAlertServiceSpy.showError).toHaveBeenCalledTimes(1);
    }));

    it('should display error from validating item with name', fakeAsync(() => {
      setupOnInit();

      treasureServiceSpy.validateItem.and.callFake(() => getFakeError('I failed'));

      component.validateItem('my item type', 'my power', 'my name');
      tick(delay);

      expect(component.validTreasure).toBeFalse();
      expect(component.validItem).toBeFalse();
      expect(component.treasure).toBeNull();
      expect(component.item).toBeNull();
      expect(component.generating).toBeFalse();
      expect(component.loading).toBeFalse();
      expect(component.validating).toBeFalse();
      
      expect(treasureServiceSpy.validateItem).toHaveBeenCalledWith('my item type', 'my power', 'my name');
      expect(loggerServiceSpy.logError).toHaveBeenCalledWith('I failed');
      expect(sweetAlertServiceSpy.showError).toHaveBeenCalledTimes(1);
    }));

    it('should be generating while generating an item', fakeAsync(() => {
      setupOnInit();

      treasureServiceSpy.getItem.and.callFake(() => getFakeDelay(new Item('my item', 'my item type')));

      component.generateItem();

      expect(treasureServiceSpy.getItem).toHaveBeenCalledWith('it1', 'power 1', '');
      expect(component.generating).toBeTrue();
      
      tick(delay - 1);

      expect(component.generating).toBeTrue();

      flush();
    }));

    it('should be generating while generating an item with name', fakeAsync(() => {
      setupOnInit();
      
      treasureServiceSpy.getItem.and.callFake(() => getFakeDelay(new Item('my item', 'my item type')));

      component.itemName = component.itemNames[0];

      component.generateItem();

      expect(treasureServiceSpy.getItem).toHaveBeenCalledWith('it1', 'power 1', 'item 1');
      expect(component.generating).toBeTrue();
      
      tick(delay - 1);

      expect(component.generating).toBeTrue();

      flush();
    }));

    it('should generate the default item', fakeAsync(() => {
      setupOnInit();

      let item = new Item('my item', 'my item type');
      treasureServiceSpy.getItem.and.callFake(() => getFakeDelay(item));

      component.generateItem();

      expect(treasureServiceSpy.getItem).toHaveBeenCalledWith('it1', 'power 1', '');
      expect(component.generating).toBeTrue();

      tick(delay);

      expect(component.item).toBe(item);
      expect(component.generating).toBeFalse();
      
      expect(loggerServiceSpy.logError).not.toHaveBeenCalled();
      expect(sweetAlertServiceSpy.showError).not.toHaveBeenCalled();
    }));

    it('should generate the default item with name', fakeAsync(() => {
      setupOnInit();

      let item = new Item('my item', 'my item type');
      treasureServiceSpy.getItem.and.callFake(() => getFakeDelay(item));

      component.itemName = component.itemNames[0];

      component.generateItem();

      expect(treasureServiceSpy.getItem).toHaveBeenCalledWith('it1', 'power 1', 'item 1');
      expect(component.generating).toBeTrue();

      tick(delay);

      expect(component.item).toBe(item);
      expect(component.generating).toBeFalse();
      
      expect(loggerServiceSpy.logError).not.toHaveBeenCalled();
      expect(sweetAlertServiceSpy.showError).not.toHaveBeenCalled();
    }));

    it(`should generate a non-default item`, fakeAsync(() => {
      setupOnInit();

      let item = new Item('my item', 'my item type');
      treasureServiceSpy.getItem.and.callFake(() => getFakeDelay(item));

      component.itemType = component.treasureModel.itemTypeViewModels[1];
      component.power = component.treasureModel.powers[1];

      component.generateItem();

      expect(treasureServiceSpy.getItem).toHaveBeenCalledWith('it2', 'power 2', '');
      expect(component.generating).toBeTrue();

      tick(delay);

      expect(component.item).toBe(item);
      expect(component.generating).toBeFalse();
      
      expect(loggerServiceSpy.logError).not.toHaveBeenCalled();
      expect(sweetAlertServiceSpy.showError).not.toHaveBeenCalled();
    }));

    it(`should generate a non-default item with name`, fakeAsync(() => {
      setupOnInit();

      let item = new Item('my item', 'my item type');
      treasureServiceSpy.getItem.and.callFake(() => getFakeDelay(item));

      component.itemType = component.treasureModel.itemTypeViewModels[1];
      component.power = component.treasureModel.powers[1];
      component.itemName = component.treasureModel.itemNames['it2'][1];

      component.generateItem();

      expect(treasureServiceSpy.getItem).toHaveBeenCalledWith('it2', 'power 2', 'item 4');
      expect(component.generating).toBeTrue();

      tick(delay);

      expect(component.item).toBe(item);
      expect(component.generating).toBeFalse();
      
      expect(loggerServiceSpy.logError).not.toHaveBeenCalled();
      expect(sweetAlertServiceSpy.showError).not.toHaveBeenCalled();
    }));

    it('should display error from generating an item', fakeAsync(() => {
      setupOnInit();

      treasureServiceSpy.getItem.and.callFake(() => getFakeError('I failed'));

      component.generateItem();
      tick(delay);

      expect(component.treasure).toBeNull();
      expect(component.item).toBeNull();
      expect(component.generating).toBeFalse();
      expect(component.loading).toBeFalse();
      expect(component.validating).toBeFalse();
      
      expect(treasureServiceSpy.getItem).toHaveBeenCalledWith('it1', 'power 1', '');
      expect(loggerServiceSpy.logError).toHaveBeenCalledWith('I failed');
      expect(sweetAlertServiceSpy.showError).toHaveBeenCalledTimes(1);
    }));

    it('should display error from generating an item with name', fakeAsync(() => {
      setupOnInit();

      treasureServiceSpy.getItem.and.callFake(() => getFakeError('I failed'));

      component.itemName = component.itemNames[1];

      component.generateItem();
      tick(delay);

      expect(component.treasure).toBeNull();
      expect(component.item).toBeNull();
      expect(component.generating).toBeFalse();
      expect(component.loading).toBeFalse();
      expect(component.validating).toBeFalse();
      
      expect(treasureServiceSpy.getItem).toHaveBeenCalledWith('it1', 'power 1', 'item 2');
      expect(loggerServiceSpy.logError).toHaveBeenCalledWith('I failed');
      expect(sweetAlertServiceSpy.showError).toHaveBeenCalledTimes(1);
    }));

    it('should validate valid item and reset name', fakeAsync(() => {
      setupOnInit();

      treasureServiceSpy.validateItem.and.callFake(() => getFakeDelay(true));

      component.validateItemAndResetName(component.treasureModel.itemTypeViewModels[1].itemType, 'my power', '');

      expect(component.itemName).toEqual('');

      expect(treasureServiceSpy.validateItem).toHaveBeenCalledWith('it2', 'my power', '');
      expect(component.validating).toBeTrue();

      tick(delay);

      expect(component.validItem).toBeTrue();
      expect(component.validating).toBeFalse();
    }));

    it('should validate invalid item and reset name', fakeAsync(() => {
      setupOnInit();

      treasureServiceSpy.validateItem.and.callFake(() => getFakeDelay(false));

      component.validateItemAndResetName(component.treasureModel.itemTypeViewModels[1].itemType, 'my power', '');

      expect(component.itemName).toEqual('');

      expect(treasureServiceSpy.validateItem).toHaveBeenCalledWith('it2', 'my power', '');
      expect(component.validating).toBeTrue();

      tick(delay);

      expect(component.validItem).toBeFalse();
      expect(component.validating).toBeFalse();
    }));

    it('should download treasure - with coin', () => {
      let treasure = new Treasure(new Coin('munny', 9266));
      component.treasure = treasure;

      treasurePipeSpy.transform.and.returnValue('my formatted treasure');

      component.downloadTreasure();

      expect(treasurePipeSpy.transform).toHaveBeenCalledWith(treasure);
      expect(fileSaverServiceSpy.save).toHaveBeenCalledWith('my formatted treasure', 'Treasure (9266 munny, 0 goods, 0 items)');
    });

    it('should download treasure - with goods', () => {
      let treasure = new Treasure();
      treasure.goods = [new Good('good 1', 90210), new Good('good 2', 42)];
      component.treasure = treasure;

      treasurePipeSpy.transform.and.returnValue('my formatted treasure');

      component.downloadTreasure();

      expect(treasurePipeSpy.transform).toHaveBeenCalledWith(treasure);
      expect(fileSaverServiceSpy.save).toHaveBeenCalledWith('my formatted treasure', 'Treasure (0 coins, 2 goods, 0 items)');
    });

    it('should download treasure - with items', () => {
      let treasure = new Treasure();
      treasure.items = [new Item('item 1', 'itemtype'), new Item('item 2', 'itemtype')];
      component.treasure = treasure;

      treasurePipeSpy.transform.and.returnValue('my formatted treasure');

      component.downloadTreasure();

      expect(treasurePipeSpy.transform).toHaveBeenCalledWith(treasure);
      expect(fileSaverServiceSpy.save).toHaveBeenCalledWith('my formatted treasure', 'Treasure (0 coins, 0 goods, 2 items)');
    });

    it('should download treasure - all', () => {
      let treasure = new Treasure(new Coin('munny', 9266));
      treasure.goods = [new Good('good 1', 90210), new Good('good 2', 42)];
      treasure.items = [new Item('item 1', 'itemtype')];
      component.treasure = treasure;

      treasurePipeSpy.transform.and.returnValue('my formatted treasure');

      component.downloadTreasure();

      expect(treasurePipeSpy.transform).toHaveBeenCalledWith(treasure);
      expect(fileSaverServiceSpy.save).toHaveBeenCalledWith('my formatted treasure', 'Treasure (9266 munny, 2 goods, 1 items)');
    });

    it('should not download missing treasure', () => {
      component.treasure = null;

      component.downloadTreasure();
      
      expect(treasurePipeSpy.transform).not.toHaveBeenCalled();
      expect(fileSaverServiceSpy.save).not.toHaveBeenCalled();
    });

    it('should download empty treasure', () => {
      let treasure = new Treasure(new Coin(), [], []);
      component.treasure = treasure;

      treasurePipeSpy.transform.and.returnValue('my empty treasure');

      component.downloadTreasure();

      expect(treasurePipeSpy.transform).toHaveBeenCalledWith(treasure);
      expect(fileSaverServiceSpy.save).toHaveBeenCalledWith('my empty treasure', 'Treasure (0 coins, 0 goods, 0 items)');
    });

    it('should download item', () => {
      let item = new Item('my item', 'my item type');
      item.description = 'my item description'

      component.item = item;

      itemPipeSpy.transform.and.returnValue('my formatted item');

      component.downloadItem();

      expect(itemPipeSpy.transform).toHaveBeenCalledWith(item);
      expect(fileSaverServiceSpy.save).toHaveBeenCalledWith('my formatted item', 'Item (my item description)');
    });

    it('should not download missing item', () => {
      component.item = null;

      component.downloadItem();
      
      expect(itemPipeSpy.transform).not.toHaveBeenCalled();
      expect(fileSaverServiceSpy.save).not.toHaveBeenCalled();
    });

    it('BUG - should show an item is invalid - not a valid matching power', fakeAsync(() => {
      setupOnInit();

      treasureServiceSpy.validateItem.and.callFake(() => getFakeDelay(false));

      const itemType = component.treasureModel.itemTypeViewModels[1];
      let power = component.treasureModel.powers[0];
      
      component.validateItemAndResetName(itemType.itemType, power, '');
      component.itemType = itemType;
      
      expect(component.itemType?.itemType).toEqual('it2');
      expect(component.itemName).toEqual('');

      expect(treasureServiceSpy.validateItem).toHaveBeenCalledWith('it2', 'power 1', '');
      expect(component.validating).toBeTrue();

      tick(delay);

      expect(component.validItem).toBeFalse();
      expect(component.validating).toBeFalse();
  
      power = component.treasureModel.powers[1];
      component.validateItemAndResetName(itemType.itemType, power, '');
      component.power = power;
      
      expect(component.power).toEqual('power 2');

      expect(treasureServiceSpy.validateItem).toHaveBeenCalledWith('it2', 'power 2', '');
      expect(component.validating).toBeTrue();

      tick(delay);

      expect(component.validItem).toBeFalse();
      expect(component.validating).toBeFalse();
    }));
  });

  describe('integration', () => {
    let fixture: ComponentFixture<TreasureGenComponent>;
    let helper: TestHelper<TreasureGenComponent>;
  
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [
          AppModule
        ],
      }).compileComponents();
  
      fixture = TestBed.createComponent(TreasureGenComponent);
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
  
    it(`should set the treasure model on init`, () => {
      const component = fixture.componentInstance;
      expect(component.treasureModel).toBeTruthy();
      expect(component.treasureModel.treasureTypes).toEqual(['Treasure', 'Coin', 'Goods', 'Items']);
      expect(component.treasureModel.maxTreasureLevel).toEqual(100);
      expect(component.treasureModel.powers).toEqual(['Mundane', 'Minor', 'Medium', 'Major']);
      expect(component.treasureModel.itemTypeViewModels.length).toEqual(11);

      for(var i = 0; i < component.treasureModel.itemTypeViewModels.length; i++) {
        let itemType = component.treasureModel.itemTypeViewModels[i].itemType;
        expect(component.treasureModel.itemNames[itemType]).toBeTruthy();
        expect(component.treasureModel.itemNames[itemType].length).toBeGreaterThan(0);
      }
    });
  
    it(`should validate inputs on init/changes`, async () => {
      const component = fixture.componentInstance;
      expect(component.validating).toBeFalse();
      expect(component.generating).toBeFalse();
      expect(component.validTreasure).toBeTrue();
      expect(component.validItem).toBeTrue();
    });
  
    it(`should render the tabs`, () => {
      const compiled = fixture.nativeElement as HTMLElement;
  
      const tabLinks = compiled.querySelectorAll('ul.nav-tabs a.nav-link');
      expect(tabLinks).toBeTruthy();
      expect(tabLinks?.length).toEqual(2);
      expect(tabLinks?.item(0).textContent).toEqual('Treasure');
      expect(tabLinks?.item(0).getAttribute('class')).toContain('active');
      expect(tabLinks?.item(0).getAttribute('href')).toEqual('#treasure');
      expect(tabLinks?.item(1).textContent).toEqual('Item');
      expect(tabLinks?.item(1).getAttribute('class')).not.toContain('active');
      expect(tabLinks?.item(1).getAttribute('href')).toEqual('#item');
    });

    describe('the treasure tab', () => {
      it(`should render the treasure tab`, () => {
        helper.expectExists('#treasure');
        
        helper.expectSelect('#treasure #treasureTypes', true, 'Treasure', 4, ['Treasure', 'Coin', 'Goods', 'Items']);
        helper.expectNumberInput('#treasure #treasureLevel', true, 1, 1, 100);

        helper.expectHasAttribute('#treasure #treasureButton', 'disabled', false);
        helper.expectLoading('#treasure #treasureValidating', false, Size.Small);
      });
    
      it(`should show when validating treasure`, () => {
        const component = fixture.componentInstance;
        component.validating = true;
  
        fixture.detectChanges();

        helper.expectValidating(component.validating, '#treasureButton', '#treasureValidating');
      });
    
      it(`should show that treasure is invalid - missing level`, () => {
        helper.setInput('#treasureLevel', '');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.level).toBeNull();
        helper.expectInvalid(fixture.componentInstance.validating, fixture.componentInstance.validTreasure, '#treasureButton', '#treasureValidating');
      });
    
      it(`should show that treasure is invalid - level invalid`, () => {
        helper.setInput('#treasureLevel', 'wrong');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.level).toBeNull();
        helper.expectInvalid(fixture.componentInstance.validating, fixture.componentInstance.validTreasure, '#treasureButton', '#treasureValidating');
      });
    
      it(`should show that treasure is invalid - level too low`, () => {
        helper.setInput('#treasureLevel', '0');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.level).toEqual(0);
        helper.expectInvalid(fixture.componentInstance.validating, fixture.componentInstance.validTreasure, '#treasureButton', '#treasureValidating');
      });
    
      it(`should show that treasure is invalid - level too high`, async () => {
        helper.setInput('#treasureLevel', '101');
  
        fixture.detectChanges();

        expect(fixture.componentInstance.level).toEqual(101);
        helper.expectValidating(fixture.componentInstance.validating, '#treasureButton', '#treasureValidating');
  
        //run validation
        await waitForService();
  
        helper.expectInvalid(fixture.componentInstance.validating, fixture.componentInstance.validTreasure, '#treasureButton', '#treasureValidating');
      });
    
      const levelTestCases = [1, 2, 10, 20, 100];

      levelTestCases.forEach(test => {
        it(`should show that treasure is valid - level ${test}`, async () => {
          helper.setInput('#treasureLevel', test.toString());
    
          fixture.detectChanges();
    
          expect(fixture.componentInstance.level).toEqual(test);
          helper.expectValidating(fixture.componentInstance.validating, '#treasureButton', '#treasureValidating');
    
          //run validation
          await waitForService();
    
          helper.expectValid(fixture.componentInstance.validating, fixture.componentInstance.validTreasure, '#treasureButton', '#treasureValidating');
        });
      });
    
      it(`should show that treasure is invalid - missing treasure type`, () => {
        helper.setSelectByValue('#treasureTypes', '');
  
        fixture.detectChanges();
  
        helper.expectInvalid(fixture.componentInstance.validating, fixture.componentInstance.validTreasure, '#treasureButton', '#treasureValidating');
      });
    
      const treasureTypesIndicesTestCases = Array.from(Array(4).keys());

      treasureTypesIndicesTestCases.forEach(test => {
        it(`should show that treasure is valid - treasure type index ${test}`, async () => {
          helper.setSelectByIndex('#treasureTypes', test);
    
          fixture.detectChanges();
          
          expect(fixture.componentInstance.treasureType).toEqual(fixture.componentInstance.treasureModel.treasureTypes[test]);
          helper.expectValidating(fixture.componentInstance.validating, '#treasureButton', '#treasureValidating');

          //run validation
          await waitForService();
    
          helper.expectValid(fixture.componentInstance.validating, fixture.componentInstance.validTreasure, '#treasureButton', '#treasureValidating');
        });
      });

      xit(`should show that treasure is invalid - validation fails`, () => {
        expect('there are no invalid treasure combinations').toBe('');
      });
    
      it(`should show that treasure is valid - validation succeeds`, async () => {
        helper.setInput('#treasureLevel', '42');
        helper.setSelectByIndex('#treasureTypes', 3);
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.treasureType).toEqual(fixture.componentInstance.treasureModel.treasureTypes[3]);
        helper.expectValidating(fixture.componentInstance.validating, '#treasureButton', '#treasureValidating');
  
        //run validation
        await waitForService();
  
        helper.expectValid(fixture.componentInstance.validating, fixture.componentInstance.validTreasure, '#treasureButton', '#treasureValidating');
      });
    
      it(`should show when generating treasure`, () => {
        const component = fixture.componentInstance;
        component.generating = true;
  
        fixture.detectChanges();

        helper.expectGenerating(
          fixture.componentInstance.generating, 
          '#treasureButton', 
          '#treasureSection', 
          '#generatingSection', 
          '#treasureValidating', 
          '#downloadTreasureButton');
      });
    
      it(`should generate the default treasure`, async () => {
        helper.clickButton('#treasureButton');
  
        fixture.detectChanges();
        
        helper.expectGenerating(
          fixture.componentInstance.generating, 
          '#treasureButton', 
          '#treasureSection', 
          '#generatingSection', 
          '#treasureValidating', 
          '#downloadTreasureButton');

        //run generate treasure
        await waitForService();
  
        helper.expectGenerated(
          fixture.componentInstance.generating, 
          '#treasureButton', 
          '#treasureSection', 
          '#generatingSection', 
          '#treasureValidating', 
          '#downloadTreasureButton');

        helper.expectHasAttribute('#noTreasure', 'hidden', true)
        helper.expectExists('#treasureSection > dndgen-treasure', true);
        helper.expectExists('#treasureSection > dndgen-item', false);

        const element = fixture.debugElement.query(By.css('#treasureSection dndgen-treasure'));
        expect(element).toBeTruthy();
        expect(element.componentInstance).toBeTruthy();
        expect(element.componentInstance).toBeInstanceOf(TreasureComponent);
  
        const treasureComponent = element.componentInstance as TreasureComponent;
        expect(treasureComponent.treasure).toBeTruthy();
        expect(treasureComponent.treasure).not.toBeNull();
      });
    
      it(`should generate non-default treasure`, async () => {
        helper.setInput('#treasureLevel', '42');
        helper.setSelectByIndex('#treasureTypes', 2);
  
        fixture.detectChanges();

        expect(fixture.componentInstance.level).toEqual(42);
        expect(fixture.componentInstance.treasureType).toEqual(fixture.componentInstance.treasureModel.treasureTypes[2]);

        //run validation
        await waitForService();

        helper.clickButton('#treasureButton');
  
        fixture.detectChanges();
        
        helper.expectGenerating(
          fixture.componentInstance.generating, 
          '#treasureButton', 
          '#treasureSection', 
          '#generatingSection', 
          '#treasureValidating', 
          '#downloadTreasureButton');

        //run generate treasure
        await waitForService();
  
        helper.expectGenerated(
          fixture.componentInstance.generating, 
          '#treasureButton', 
          '#treasureSection', 
          '#generatingSection', 
          '#treasureValidating', 
          '#downloadTreasureButton');

        helper.expectHasAttribute('#noTreasure', 'hidden', true);
        helper.expectExists('#treasureSection > dndgen-treasure', true);
        helper.expectExists('#treasureSection > dndgen-item', false);

        const element = fixture.debugElement.query(By.css('#treasureSection dndgen-treasure'));
        expect(element).toBeTruthy();
        expect(element.componentInstance).toBeTruthy();
        expect(element.componentInstance).toBeInstanceOf(TreasureComponent);
  
        const treasureComponent = element.componentInstance as TreasureComponent;
        expect(treasureComponent.treasure).toBeTruthy();
        expect(treasureComponent.treasure).not.toBeNull();
        expect(treasureComponent.treasure.isAny).toBeTrue();
        expect(treasureComponent.treasure.coin).toBeTruthy();
        expect(treasureComponent.treasure.coin.currency).toBe('');
        expect(treasureComponent.treasure.coin.quantity).toBe(0);
        expect(treasureComponent.treasure.goods.length).toBeGreaterThan(0);
        expect(treasureComponent.treasure.items).toEqual([]);
      });
    });
  
    describe('the item tab', () => {
      it(`should render the item tab`, () => {
        helper.expectExists('#item');
  
        //item type
        helper.expectSelect('#item #itemTypes', true, 'Alchemical Item', 11, [
          'Alchemical Item',
          'Armor',
          'Potion',
          'Ring',
          'Rod',
          'Scroll',
          'Staff',
          'Tool',
          'Wand',
          'Weapon',
          'Wondrous Item',
        ]);
  
        //power
        helper.expectSelect('#item #powers', true, 'Mundane', 4, [
          'Mundane',
          'Minor',
          'Medium',
          'Major',
        ]);
  
        //item name
        const alchemicalItemNames = fixture.componentInstance.treasureModel.itemNames['AlchemicalItem'];
        helper.expectSelect('#item #itemNames', false, '', alchemicalItemNames.length + 1, [''].concat(alchemicalItemNames)
        );
        helper.expectHasAttribute('#itemNames', 'hidden', false);
  
        //Any item name
        helper.expectInput('#item #anyItemName', false, '');
        helper.expectHasAttribute('#anyItemName', 'hidden', true);

        helper.expectHasAttribute('#itemButton', 'disabled', false);
        helper.expectLoading('#itemValidating', false, Size.Small);
      });
    
      it(`should update item names when item type changes`, async () => {
        helper.setSelectByIndex('#itemTypes', 4);
  
        fixture.detectChanges();

        expect(fixture.componentInstance.itemType?.itemType).toEqual('Rod');

        //run validation
        await waitForService();

        expect(fixture.componentInstance.itemNames).toEqual(fixture.componentInstance.treasureModel.itemNames['Rod']);
        
        //item name
        const rodNames = fixture.componentInstance.treasureModel.itemNames['Rod'];
        helper.expectSelect('#itemNames', false, '', rodNames.length + 1, [''].concat(rodNames));
        helper.expectHasAttribute('#itemNames', 'hidden', false);
      });
    
      it(`should un-set an item name back to empty`, async () => {
        helper.setSelectByIndex('#itemNames', 4);
  
        fixture.detectChanges();

        expect(fixture.componentInstance.itemName).toEqual('Everburning Torch');

        //run validation
        await waitForService();

        helper.expectValid(fixture.componentInstance.validating, fixture.componentInstance.validItem, '#itemButton', '#itemValidating');

        helper.setSelectByIndex('#itemNames', 0);
  
        fixture.detectChanges();

        expect(fixture.componentInstance.itemName).toEqual('');
        
        //run validation
        await waitForService();

        helper.expectValid(fixture.componentInstance.validating, fixture.componentInstance.validItem, '#itemButton', '#itemValidating');
      });
    
      it(`should un-set an item name back to empty when item type changes`, async () => {
        helper.setSelectByIndex('#itemNames', 4);
  
        fixture.detectChanges();

        expect(fixture.componentInstance.itemName).toEqual('Everburning Torch');

        //run validation
        await waitForService();

        helper.setSelectByIndex('#itemTypes', 6);
  
        fixture.detectChanges();

        expect(fixture.componentInstance.itemType?.itemType).toEqual('Staff');
        
        //run validation
        await waitForService();

        expect(fixture.componentInstance.itemNames).toEqual(fixture.componentInstance.treasureModel.itemNames['Staff']);
        expect(fixture.componentInstance.itemName).toEqual('');
        
        //item name
        const staffNames = fixture.componentInstance.treasureModel.itemNames['Staff'];
        helper.expectSelect('#itemNames', false, '', staffNames.length + 1, [''].concat(staffNames));
        helper.expectHasAttribute('#itemNames', 'hidden', false);
      });
    
      it(`should show when validating an item`, () => {
        const component = fixture.componentInstance;
        component.validating = true;
  
        fixture.detectChanges();

        helper.expectValidating(fixture.componentInstance.validating, '#itemButton', '#itemValidating');
      });
    
      it(`should show that an item is invalid - missing item type`, () => {
        helper.setSelectByValue('#itemTypes', '');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.itemType).toBeFalsy();
        helper.expectInvalid(fixture.componentInstance.validating, fixture.componentInstance.validItem, '#itemButton', '#itemValidating');
      });

      const itemTypeIndicesTestCases = Array.from(Array(11).keys());

      itemTypeIndicesTestCases.forEach(itemTypeIndex => {
        it(`should show that item is valid - item type index ${itemTypeIndex}`, async () => {
          let itemTypeViewModel = fixture.componentInstance.treasureModel.itemTypeViewModels[itemTypeIndex];
          let itemNames = fixture.componentInstance.treasureModel.itemNames[itemTypeViewModel.itemType];

          let powerIndex = fixture.componentInstance.treasureModel.powers.findIndex(p => p == 'Medium');
          if (itemTypeViewModel.itemType == 'AlchemicalItem' || itemTypeViewModel.itemType == 'Tool')
            powerIndex = fixture.componentInstance.treasureModel.powers.findIndex(p => p == 'Mundane');

          helper.setSelectByIndex('#powers', powerIndex);
          
          fixture.detectChanges();
    
          expect(fixture.componentInstance.power).toEqual(fixture.componentInstance.treasureModel.powers[powerIndex]);

          //run validation
          await waitForService();
    
          helper.setSelectByIndex('#itemTypes', itemTypeIndex);
    
          fixture.detectChanges();
    
          expect(fixture.componentInstance.itemType).toEqual(itemTypeViewModel);
          expect(fixture.componentInstance.itemName).toEqual('');
          
          helper.expectSelect('#itemNames', false, '', itemNames.length + 1, [''].concat(itemNames));
          helper.expectValidating(fixture.componentInstance.validating, '#itemButton', '#itemValidating');
  
          //run validation
          await waitForService();
    
          helper.expectValid(fixture.componentInstance.validating, fixture.componentInstance.validItem, '#itemButton', '#itemValidating');
        });

        it(`should show that item with any name is valid - item type index ${itemTypeIndex}`, async () => {
          let itemTypeViewModel = fixture.componentInstance.treasureModel.itemTypeViewModels[itemTypeIndex];
          let itemNames = fixture.componentInstance.treasureModel.itemNames[itemTypeViewModel.itemType];
          
          let powerIndex = fixture.componentInstance.treasureModel.powers.findIndex(p => p == 'Medium');
          if (itemTypeViewModel.itemType == 'AlchemicalItem' || itemTypeViewModel.itemType == 'Tool')
            powerIndex = fixture.componentInstance.treasureModel.powers.findIndex(p => p == 'Mundane');

          helper.setSelectByIndex('#powers', powerIndex);
          helper.setSelectByIndex('#itemTypes', itemTypeIndex);
          
          fixture.detectChanges();
  
          expect(fixture.componentInstance.itemType).toEqual(itemTypeViewModel);
          expect(fixture.componentInstance.itemNames).toEqual(itemNames);
            
          //run validation
          await waitForService();
    
          if (itemTypeViewModel.itemType != 'Wand' && itemTypeViewModel.itemType != 'Scroll') {
            helper.expectHasAttribute('#itemNames', 'hidden', false);
            helper.expectHasAttribute('#anyItemName', 'hidden', true);
            return;
          }

          helper.expectHasAttribute('#itemNames', 'hidden', true);
          helper.expectHasAttribute('#anyItemName', 'hidden', false);

          helper.setInput('#anyItemName', `My ${itemTypeViewModel.displayName}`);
    
          fixture.detectChanges();
    
          expect(fixture.componentInstance.itemName).toEqual(`My ${itemTypeViewModel.displayName}`);
          helper.expectValidating(fixture.componentInstance.validating, '#itemButton', '#itemValidating');
  
          //run validation
          await waitForService();
    
          helper.expectValid(fixture.componentInstance.validating, fixture.componentInstance.validItem, '#itemButton', '#itemValidating');
        });

        it(`should show that item with non-empty name is valid - item type index ${itemTypeIndex}`, async () => {
          let itemTypeViewModel = fixture.componentInstance.treasureModel.itemTypeViewModels[itemTypeIndex];
          let itemNames = fixture.componentInstance.treasureModel.itemNames[itemTypeViewModel.itemType];

          let powerIndex = fixture.componentInstance.treasureModel.powers.findIndex(p => p == 'Medium');
          if (itemTypeViewModel.itemType == 'AlchemicalItem' || itemTypeViewModel.itemType == 'Tool')
            powerIndex = fixture.componentInstance.treasureModel.powers.findIndex(p => p == 'Mundane');

          helper.setSelectByIndex('#powers', powerIndex);
          helper.setSelectByIndex('#itemTypes', itemTypeIndex);
          
          fixture.detectChanges();

          expect(fixture.componentInstance.itemNames).toEqual(itemNames);
          
          //run validation
          await waitForService();
    
          if (itemTypeViewModel.itemType == 'Wand' || itemTypeViewModel.itemType == 'Scroll') {
            helper.expectHasAttribute('#itemNames', 'hidden', true);
            helper.expectHasAttribute('#anyItemName', 'hidden', false);
            return;
          }

          helper.expectHasAttribute('#itemNames', 'hidden', false);
          helper.expectHasAttribute('#anyItemName', 'hidden', true);

          helper.setSelectByIndex('#itemNames', 2);
    
          fixture.detectChanges();
    
          expect(fixture.componentInstance.itemType).toEqual(fixture.componentInstance.treasureModel.itemTypeViewModels[itemTypeIndex]);
          expect(fixture.componentInstance.itemName).toEqual(itemNames[1]);
          helper.expectValidating(fixture.componentInstance.validating, '#itemButton', '#itemValidating');
  
          //run validation
          await waitForService();
    
          helper.expectValid(fixture.componentInstance.validating, fixture.componentInstance.validItem, '#itemButton', '#itemValidating');
        });

        it(`should show an item is invalid - not a valid name - item type index ${itemTypeIndex}`, async () => {
          let itemTypeViewModel = fixture.componentInstance.treasureModel.itemTypeViewModels[itemTypeIndex];
          let itemNames = fixture.componentInstance.treasureModel.itemNames[itemTypeViewModel.itemType];
  
          let powerIndex = fixture.componentInstance.treasureModel.powers.findIndex(p => p == 'Medium');
          if (itemTypeViewModel.itemType == 'AlchemicalItem' || itemTypeViewModel.itemType == 'Tool')
            powerIndex = fixture.componentInstance.treasureModel.powers.findIndex(p => p == 'Mundane');

          helper.setSelectByIndex('#powers', powerIndex);
          helper.setSelectByIndex('#itemTypes', itemTypeIndex);
            
          fixture.detectChanges();
  
          expect(fixture.componentInstance.itemNames).toEqual(itemNames);
          
          //run validation
          await waitForService();
    
          if (itemTypeViewModel.itemType == 'Wand' || itemTypeViewModel.itemType == 'Scroll') {
            helper.expectHasAttribute('#itemNames', 'hidden', true);
            helper.expectHasAttribute('#anyItemName', 'hidden', false);
            return;
          }

          helper.expectHasAttribute('#itemNames', 'hidden', false);
          helper.expectHasAttribute('#anyItemName', 'hidden', true);
  
          helper.setSelectByValue('#itemNames', 'not a name');
    
          fixture.detectChanges();
    
          expect(fixture.componentInstance.itemType).toEqual(fixture.componentInstance.treasureModel.itemTypeViewModels[itemTypeIndex]);
          expect(fixture.componentInstance.itemName).toEqual('');
          helper.expectValidating(fixture.componentInstance.validating, '#itemButton', '#itemValidating');
  
          //run validation
          await waitForService();
    
          //Since we are emptying out the invalid name, it ends up valid
          helper.expectValid(fixture.componentInstance.validating, fixture.componentInstance.validItem, '#itemButton', '#itemValidating');
        });
  
        it(`should not allow an invalid name - item type index ${itemTypeIndex}`, async () => {
          let itemTypeViewModel = fixture.componentInstance.treasureModel.itemTypeViewModels[itemTypeIndex];
          let itemNames = fixture.componentInstance.treasureModel.itemNames[itemTypeViewModel.itemType];
  
          let powerIndex = fixture.componentInstance.treasureModel.powers.findIndex(p => p == 'Medium');
          if (itemTypeViewModel.itemType == 'AlchemicalItem' || itemTypeViewModel.itemType == 'Tool')
            powerIndex = fixture.componentInstance.treasureModel.powers.findIndex(p => p == 'Mundane');

          helper.setSelectByIndex('#powers', powerIndex);
          helper.setSelectByIndex('#itemTypes', itemTypeIndex);
            
          fixture.detectChanges();
  
          expect(fixture.componentInstance.itemNames).toEqual(itemNames);
          
          //run validation
          await waitForService();
    
          if (itemTypeViewModel.itemType == 'Wand' || itemTypeViewModel.itemType == 'Scroll') {
            helper.expectHasAttribute('#itemNames', 'hidden', true);
            helper.expectHasAttribute('#anyItemName', 'hidden', false);
            return;
          }

          helper.expectHasAttribute('#itemNames', 'hidden', false);
          helper.expectHasAttribute('#anyItemName', 'hidden', true);
  
          let wrongIndex = itemTypeIndex - 1 >= 0 ? itemTypeIndex - 1 : 10;
          let wrongItemType = fixture.componentInstance.treasureModel.itemTypeViewModels[wrongIndex];
          let wrongName = fixture.componentInstance.treasureModel.itemNames[wrongItemType.itemType][0];
          helper.setSelectByValue('#itemNames', wrongName);
    
          fixture.detectChanges();
    
          expect(fixture.componentInstance.itemType).toEqual(fixture.componentInstance.treasureModel.itemTypeViewModels[itemTypeIndex]);
          expect(fixture.componentInstance.itemName).toEqual('');
          helper.expectValidating(fixture.componentInstance.validating, '#itemButton', '#itemValidating');
  
          //run validation
          await waitForService();
    
          helper.expectValid(fixture.componentInstance.validating, fixture.componentInstance.validItem, '#itemButton', '#itemValidating');
        });
      });

      it('should show an item is invalid - missing power', () => {
        helper.setSelectByValue('#powers', '');
          
        fixture.detectChanges();
    
        expect(fixture.componentInstance.power).toEqual('');
        helper.expectInvalid(fixture.componentInstance.validating, fixture.componentInstance.validItem, '#itemButton', '#itemValidating');
      });

      it('should show an item is invalid - not a valid power', () => {
        helper.setSelectByValue('#powers', 'Omnipotent');
          
        fixture.detectChanges();
    
        expect(fixture.componentInstance.power).toEqual('');
        helper.expectInvalid(fixture.componentInstance.validating, fixture.componentInstance.validItem, '#itemButton', '#itemValidating');
      });

      it('should show an item is invalid - not a valid matching power', async () => {
        const rodIndex = fixture.componentInstance.treasureModel.itemTypeViewModels.findIndex(itvm => itvm.itemType == 'Rod');
        const minorIndex = fixture.componentInstance.treasureModel.powers.findIndex(p => p == 'Minor');
  
        expect(rodIndex).toBe(4);
        expect(minorIndex).toBe(1);
        helper.setSelectByIndex('#itemTypes', rodIndex);
        
        fixture.detectChanges();
    
        const compiled = fixture.nativeElement as HTMLElement;
        const selectedPower = compiled!.querySelector('#itemTypes > option:checked');
        helper.expectExists('#itemTypes > option:checked', true);
        expect(selectedPower?.textContent).toEqual('Rod');

        expect(fixture.componentInstance.itemType?.itemType).toEqual('Rod');
        expect(fixture.componentInstance.validating).toBeTrue();
        helper.expectValidating(fixture.componentInstance.validating, '#itemButton', '#itemValidating');

        //run validation
        await waitForService();
  
        expect(fixture.componentInstance.validating).toBeFalse();

        helper.setSelectByIndex('#powers', minorIndex);
          
        fixture.detectChanges();
    
        expect(fixture.componentInstance.power).toEqual('Minor');
        expect(fixture.componentInstance.validating).toBeTrue();
        helper.expectValidating(fixture.componentInstance.validating, '#itemButton', '#itemValidating');

        //run validation
        await waitForService();
  
        expect(fixture.componentInstance.validating).toBeFalse();
        expect(fixture.componentInstance.validItem).toBeFalse();
        helper.expectInvalid(fixture.componentInstance.validating, fixture.componentInstance.validItem, '#itemButton', '#itemValidating');
      });

      const powerIndicesTestCases = Array.from(Array(4).keys());
      
      powerIndicesTestCases.forEach(powerIndex => {
        it(`should show that item is valid - power index ${powerIndex}`, async () => {
          const armorIndex = fixture.componentInstance.treasureModel.itemTypeViewModels.findIndex(itvm => itvm.itemType == 'Armor');

          helper.setSelectByIndex('#itemTypes', armorIndex);
          helper.setSelectByIndex('#powers', powerIndex);

          fixture.detectChanges();
    
          expect(fixture.componentInstance.itemType).toEqual(fixture.componentInstance.treasureModel.itemTypeViewModels[armorIndex]);
          expect(fixture.componentInstance.power).toEqual(fixture.componentInstance.treasureModel.powers[powerIndex]);
          expect(fixture.componentInstance.itemName).toEqual('');
          helper.expectValidating(fixture.componentInstance.validating, '#itemButton', '#itemValidating');
  
          //run validation
          await waitForService();
    
          expect(fixture.componentInstance.validating).toBeFalse();
          expect(fixture.componentInstance.validItem).toBeTrue();
          helper.expectValid(fixture.componentInstance.validating, fixture.componentInstance.validItem, '#itemButton', '#itemValidating');
        });
      });
    
      it(`should show when generating an item`, () => {
        const component = fixture.componentInstance;
        component.generating = true;
  
        fixture.detectChanges();

        helper.expectGenerating(fixture.componentInstance.generating, '#itemButton', '#treasureSection', '#generatingSection', '#itemValidating', '#downloadItemButton');
        helper.expectHasAttribute('#downloadTreasureButton', 'hidden', true);
      });
    
      it(`should generate the default item`, async () => {
        helper.clickButton('#itemButton');
  
        fixture.detectChanges();
        
        helper.expectGenerating(fixture.componentInstance.generating, '#itemButton', '#treasureSection', '#generatingSection', '#itemValidating', '#downloadItemButton');
        helper.expectHasAttribute('#downloadTreasureButton', 'hidden', true);

        //run generate item
        await waitForService();
  
        helper.expectGenerated(fixture.componentInstance.generating, '#itemButton', '#treasureSection', '#generatingSection', '#itemValidating', '#downloadItemButton');
        helper.expectHasAttribute('#downloadTreasureButton', 'hidden', true);

        helper.expectHasAttribute('#noTreasure', 'hidden', true);
        helper.expectExists('#treasureSection dndgen-treasure', false);
        helper.expectExists('#treasureSection dndgen-item', true);

        const element = fixture.debugElement.query(By.css('#treasureSection dndgen-item'));
        expect(element).toBeTruthy();
        expect(element.componentInstance).toBeTruthy();
        expect(element.componentInstance).toBeInstanceOf(ItemComponent);
  
        const treasureComponent = element.componentInstance as ItemComponent;
        expect(treasureComponent.item).toBeTruthy();
        expect(treasureComponent.item).not.toBeNull();
        expect(treasureComponent.item?.name).toBeTruthy();
      });
    
      it(`should generate the default item with name`, async () => {
        helper.setSelectByIndex('#itemNames', 1);

        fixture.detectChanges();

        expect(fixture.componentInstance.itemName).toEqual("Acid");
        expect(fixture.componentInstance.validating).toBeTrue();
        

        //run validation
        await waitForService();
  
        expect(fixture.componentInstance.validating).toBeFalse();
        expect(fixture.componentInstance.validItem).toBeTrue();

        helper.clickButton('#itemButton');
  
        fixture.detectChanges();
        
        helper.expectGenerating(fixture.componentInstance.generating, '#itemButton', '#treasureSection', '#generatingSection', '#itemValidating', '#downloadItemButton');
        helper.expectHasAttribute('#downloadTreasureButton', 'hidden', true);

        //run generate item
        await waitForService();
  
        helper.expectGenerated(fixture.componentInstance.generating, '#itemButton', '#treasureSection', '#generatingSection', '#itemValidating', '#downloadItemButton');
        helper.expectHasAttribute('#downloadTreasureButton', 'hidden', true);

        helper.expectHasAttribute('#noTreasure', 'hidden', true);
        helper.expectExists('#treasureSection dndgen-treasure', false);
        helper.expectExists('#treasureSection dndgen-item', true);

        const element = fixture.debugElement.query(By.css('#treasureSection dndgen-item'));
        expect(element).toBeTruthy();
        expect(element.componentInstance).toBeTruthy();
        expect(element.componentInstance).toBeInstanceOf(ItemComponent);
  
        const itemComponent = element.componentInstance as ItemComponent;
        expect(itemComponent.item).toBeTruthy();
        expect(itemComponent.item).not.toBeNull();
        expect(itemComponent.item?.name).toEqual("Acid");
        expect(itemComponent.item?.itemType).toEqual('Alchemical Item');
      });
    
      it(`should generate a non-default item`, async () => {
        helper.setSelectByIndex('#itemTypes', 1);
        helper.setSelectByIndex('#powers', 2);
  
        fixture.detectChanges();

        expect(fixture.componentInstance.itemType?.itemType).toEqual('Armor');
        expect(fixture.componentInstance.power).toEqual('Medium');

        //run validation
        await waitForService();

        expect(fixture.componentInstance.validItem).toBeTrue();
        expect(fixture.componentInstance.validating).toBeFalse();

        helper.clickButton('#itemButton');
  
        fixture.detectChanges();
        
        helper.expectGenerating(fixture.componentInstance.generating, '#itemButton', '#treasureSection', '#generatingSection', '#itemValidating', '#downloadItemButton');
        helper.expectHasAttribute('#downloadTreasureButton', 'hidden', true);

        //run roll
        await waitForService();
  
        helper.expectGenerated(fixture.componentInstance.generating, '#itemButton', '#treasureSection', '#generatingSection', '#itemValidating', '#downloadItemButton');
        helper.expectHasAttribute('#downloadTreasureButton', 'hidden', true);

        helper.expectHasAttribute('#noTreasure', 'hidden', true);
        helper.expectExists('#treasureSection dndgen-treasure', false);
        helper.expectExists('#treasureSection dndgen-item', true);

        const element = fixture.debugElement.query(By.css('#treasureSection dndgen-item'));
        expect(element).toBeTruthy();
        expect(element.componentInstance).toBeTruthy();
        expect(element.componentInstance).toBeInstanceOf(ItemComponent);
  
        const itemComponent = element.componentInstance as ItemComponent;
        expect(itemComponent.item).toBeTruthy();
        expect(itemComponent.item).not.toBeNull();
        expect(itemComponent.item?.name).toBeTruthy();
        expect(itemComponent.item?.itemType).toEqual('Armor');
      });
    
      it(`should generate a non-default item with name`, async () => {
        helper.setSelectByIndex('#itemTypes', 1);
        helper.setSelectByIndex('#powers', 2);
  
        fixture.detectChanges();

        expect(fixture.componentInstance.itemType?.itemType).toEqual('Armor');
        expect(fixture.componentInstance.power).toEqual('Medium');

        //run validation
        await waitForService();

        expect(fixture.componentInstance.validItem).toBeTrue();
        expect(fixture.componentInstance.itemNames).toEqual(fixture.componentInstance.treasureModel.itemNames['Armor']);
        helper.setSelectByIndex('#itemNames', 3);
  
        fixture.detectChanges();

        expect(fixture.componentInstance.itemName).toEqual('Banded mail');

        //run validation
        await waitForService();

        expect(fixture.componentInstance.validItem).toBeTrue();
        helper.clickButton('#itemButton');
  
        fixture.detectChanges();
        
        helper.expectGenerating(fixture.componentInstance.generating, '#itemButton', '#treasureSection', '#generatingSection', '#itemValidating', '#downloadItemButton');
        helper.expectHasAttribute('#downloadTreasureButton', 'hidden', true);

        //run roll
        await waitForService();
  
        helper.expectGenerated(fixture.componentInstance.generating, '#itemButton', '#treasureSection', '#generatingSection', '#itemValidating', '#downloadItemButton');
        helper.expectHasAttribute('#downloadTreasureButton', 'hidden', true);

        helper.expectHasAttribute('#noTreasure', 'hidden', true);
        helper.expectExists('#treasureSection dndgen-treasure', false);
        helper.expectExists('#treasureSection dndgen-item', true);

        const element = fixture.debugElement.query(By.css('#treasureSection dndgen-item'));
        expect(element).toBeTruthy();
        expect(element.componentInstance).toBeTruthy();
        expect(element.componentInstance).toBeInstanceOf(ItemComponent);
  
        const itemComponent = element.componentInstance as ItemComponent;
        expect(itemComponent.item).toBeTruthy();
        expect(itemComponent.item).not.toBeNull();
        expect(['Banded mail', 'Banded Mail of Luck']).toContain(itemComponent.item?.name);
        expect(itemComponent.item?.itemType).toEqual('Armor');
      });
    
      it(`should generate a non-default item with any name`, async () => {
        const wandIndex = fixture.componentInstance.treasureModel.itemTypeViewModels.findIndex(itvm => itvm.itemType == 'Wand');
        helper.setSelectByIndex('#itemTypes', wandIndex);
        helper.setSelectByIndex('#powers', 3);
  
        fixture.detectChanges();

        expect(fixture.componentInstance.itemType?.itemType).toEqual('Wand');
        expect(fixture.componentInstance.power).toEqual('Major');

        //run validation
        await waitForService();

        helper.setInput('#anyItemName', 'Wand of Awesomeness');
  
        fixture.detectChanges();

        expect(fixture.componentInstance.itemName).toEqual('Wand of Awesomeness');

        //run validation
        await waitForService();

        helper.clickButton('#itemButton');
  
        fixture.detectChanges();
        
        helper.expectGenerating(fixture.componentInstance.generating, '#itemButton', '#treasureSection', '#generatingSection', '#itemValidating', '#downloadItemButton');
        helper.expectHasAttribute('#downloadTreasureButton', 'hidden', true);

        //run generate item
        await waitForService();
  
        helper.expectGenerated(fixture.componentInstance.generating, '#itemButton', '#treasureSection', '#generatingSection', '#itemValidating', '#downloadItemButton');
        helper.expectHasAttribute('#downloadTreasureButton', 'hidden', true);

        helper.expectHasAttribute('#noTreasure', 'hidden', true);
        helper.expectExists('#treasureSection dndgen-treasure', false);
        helper.expectExists('#treasureSection dndgen-item', true);

        const element = fixture.debugElement.query(By.css('#treasureSection dndgen-item'));
        expect(element).toBeTruthy();
        expect(element.componentInstance).toBeTruthy();
        expect(element.componentInstance).toBeInstanceOf(ItemComponent);
  
        const itemComponent = element.componentInstance as ItemComponent;
        expect(itemComponent.item).toBeTruthy();
        expect(itemComponent.item).not.toBeNull();
        expect(itemComponent.item?.name).toEqual('Wand of Awesomeness');
        expect(itemComponent.item?.itemType).toEqual('Wand');
        expect(itemComponent.item?.isMagical).toBeTrue();
        expect(itemComponent.item?.magic.charges).toBeGreaterThan(0);
      });
    });
  
    it(`should render no treasure`, () => {
      helper.expectHasAttribute('#noTreasure', 'hidden', false);

      const compiled = fixture.nativeElement as HTMLElement;
      let element = compiled!.querySelector('#treasureSection dndgen-treasure');
      expect(element).toBeNull();

      element = compiled!.querySelector('#treasureSection dndgen-item');
      expect(element).toBeNull();
    });
    
    it(`should render treasure`, () => {
      fixture.componentInstance.treasure = new Treasure();

      fixture.detectChanges();

      helper.expectHasAttribute('#noTreasure', 'hidden', true);
      helper.expectHasAttribute('#treasureSection dndgen-treasure', 'hidden', false);
      
      const compiled = fixture.nativeElement as HTMLElement;
      let element = compiled!.querySelector('#treasureSection dndgen-item');
      expect(element).toBeNull();
    });
    
    it(`should render item`, () => {
      fixture.componentInstance.item = new Item('my item', 'my item type');

      fixture.detectChanges();

      helper.expectHasAttribute('#noTreasure', 'hidden', true);
      helper.expectHasAttribute('#treasureSection dndgen-item', 'hidden', false);
      
      const compiled = fixture.nativeElement as HTMLElement;
      let element = compiled!.querySelector('#treasureSection dndgen-treasure');
      expect(element).toBeNull();
    });
    
    it(`should download treasure`, async () => {
      //Even for an integration test, we don't want to create an actual file
      let fileSaverSpy = spyOn(FileSaver, 'saveAs').and.stub();

      fixture.componentInstance.treasure = new Treasure(new Coin('munny', 9266));
      fixture.componentInstance.treasure.isAny = true;

      fixture.detectChanges();

      helper.clickButton('#downloadTreasureButton');

      expect(FileSaver.saveAs).toHaveBeenCalledWith(
        jasmine.any(Blob),
        jasmine.stringMatching(/^Treasure \(.+, [0-9] goods, [0-9] items\)\.txt$/));
        
      const blob = fileSaverSpy.calls.first().args[0] as Blob;
      const text = await blob.text();
      expect(text).toEqual('9,266 munny\r\n' +
        'Goods (x0)\r\n' +
        'Items (x0)\r\n');
    });
    
    it(`should download item`, async () => {
      //Even for an integration test, we don't want to create an actual file
      let fileSaverSpy = spyOn(FileSaver, 'saveAs').and.stub();

      fixture.componentInstance.item = new Item('my item', 'my item type');
      fixture.componentInstance.item.description = 'my item description';

      fixture.detectChanges();

      helper.clickButton('#downloadItemButton');

      expect(FileSaver.saveAs).toHaveBeenCalledWith(
        jasmine.any(Blob),
        jasmine.stringMatching(/^Item \(my item description\)\.txt$/));
      
      const blob = fileSaverSpy.calls.first().args[0] as Blob;
      const text = await blob.text();
      expect(text).toEqual('my item\r\n');
    });
  });
});
