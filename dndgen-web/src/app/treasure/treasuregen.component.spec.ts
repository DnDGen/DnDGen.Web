import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { TreasureGenComponent } from './treasuregen.component';
import { AppModule } from '../app.module';
import { TreasureService } from './services/treasure.service';
import { TreasureFormatterService } from './services/treasureFormatter.service';
import { SweetAlertService } from '../shared/sweetAlert.service';
import { LoggerService } from '../shared/logger.service';
import { Observable, of } from 'rxjs';
import { TreasureGenViewModel } from './models/treasuregenViewModel.model';
import { FileSaverService } from '../shared/fileSaver.service';
import { ItemTypeViewModel } from './models/itemTypeViewModel.model';
import { Treasure } from './models/treasure.model';
import { Coin } from './models/coin.model';
import { Item } from './models/item.model';
import { UuidService } from '../shared/uuid.service';
import { By } from '@angular/platform-browser';
import { TreasureComponent } from './treasure.component';
import { ItemComponent } from './item.component';
import * as FileSaver from 'file-saver';

describe('TreasureGenComponent', () => {
  describe('unit', () => {
    let component: TreasureGenComponent;
    let treasureServiceSpy: jasmine.SpyObj<TreasureService>;
    let treasureFormatterServiceSpy: jasmine.SpyObj<TreasureFormatterService>;
    let sweetAlertServiceSpy: jasmine.SpyObj<SweetAlertService>;
    let loggerServiceSpy: jasmine.SpyObj<LoggerService>;
    let fileSaverServiceSpy: jasmine.SpyObj<FileSaverService>;
    let idServiceSpy: jasmine.SpyObj<UuidService>;

    const delay = 10;
  
    beforeEach(() => {
      treasureServiceSpy = jasmine.createSpyObj('TreasureService', ['getViewModel', 'getTreasure', 'validateTreasure', 'getItem', 'validateItem']);
      treasureFormatterServiceSpy = jasmine.createSpyObj('TreasureFormatterService', ['formatTreasure', 'formatItem']);
      sweetAlertServiceSpy = jasmine.createSpyObj('SweetAlertService', ['showError']);
      loggerServiceSpy = jasmine.createSpyObj('LoggerService', ['logError']);
      fileSaverServiceSpy = jasmine.createSpyObj('FileSaverService', ['save']);
      idServiceSpy = jasmine.createSpyObj('UuidService', ['generate']);

      component = new TreasureGenComponent(treasureServiceSpy, sweetAlertServiceSpy, fileSaverServiceSpy, treasureFormatterServiceSpy, idServiceSpy, loggerServiceSpy);
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

    it('should be validating while fetching the treasure model', fakeAsync(() => {
      const model = getViewModel();
      treasureServiceSpy.getViewModel.and.callFake(() => getFakeDelay(model));
      treasureServiceSpy.validateTreasure.and.callFake(() => getFakeDelay(true));
      treasureServiceSpy.validateItem.and.callFake(() => getFakeDelay(true));

      component.ngOnInit();

      expect(component.treasureModel).not.toBeDefined();
      expect(component.treasureType).toEqual('');
      expect(component.power).toEqual('');
      expect(component.itemType).toBeNull();
      expect(component.itemNames).toEqual([]);
      expect(component.validTreasure).toBeFalse();
      expect(component.validItem).toBeFalse();
      expect(component.validating).toBeTrue();
      
      tick(delay - 1);

      expect(component.treasureModel).not.toBeDefined();
      expect(component.treasureType).toEqual('');
      expect(component.power).toEqual('');
      expect(component.itemType).toBeNull();
      expect(component.itemNames).toEqual([]);
      expect(component.validTreasure).toBeFalse();
      expect(component.validItem).toBeFalse();
      expect(component.validating).toBeTrue();
      
      tick(1);
      
      expect(component.treasureModel).toEqual(model);
      expect(component.treasureType).toEqual('treasure type 1');
      expect(component.power).toEqual('power 1');
      expect(component.itemType).toEqual(new ItemTypeViewModel('it1', 'Item Type 1'));
      expect(component.itemNames).toEqual(['item 1', 'item 2']);
      expect(component.validTreasure).toBeFalse();
      expect(component.validItem).toBeFalse();
      expect(component.validating).toBeTrue();

      tick(delay - 1);

      expect(component.treasureModel).toEqual(model);
      expect(component.treasureType).toEqual('treasure type 1');
      expect(component.power).toEqual('power 1');
      expect(component.itemType).toEqual(new ItemTypeViewModel('it1', 'Item Type 1'));
      expect(component.itemNames).toEqual(['item 1', 'item 2']);
      expect(component.validTreasure).toBeFalse();
      expect(component.validItem).toBeFalse();
      expect(component.validating).toBeTrue();

      tick(1);
      
      expect(component.treasureModel).toEqual(model);
      expect(component.treasureType).toEqual('treasure type 1');
      expect(component.power).toEqual('power 1');
      expect(component.itemType).toEqual(new ItemTypeViewModel('it1', 'Item Type 1'));
      expect(component.itemNames).toEqual(['item 1', 'item 2']);
      expect(component.validTreasure).toBeTrue();
      expect(component.validItem).toBeFalse();
      expect(component.validating).toBeTrue();

      tick(delay - 1);

      expect(component.treasureModel).toEqual(model);
      expect(component.treasureType).toEqual('treasure type 1');
      expect(component.power).toEqual('power 1');
      expect(component.itemType).toEqual(new ItemTypeViewModel('it1', 'Item Type 1'));
      expect(component.itemNames).toEqual(['item 1', 'item 2']);
      expect(component.validTreasure).toBeTrue();
      expect(component.validItem).toBeFalse();
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
  
        expect(component.treasureModel).not.toBeDefined();
        expect(component.validating).toBeTrue();
  
        tick(delay * 3);
  
        expect(component.treasureModel).toEqual(model);
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

      expect(component.treasureModel).not.toBeDefined();
      expect(component.treasure).toBeNull();
      expect(component.item).toBeNull();
      expect(component.generating).toBeFalse();
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
      component.itemNames = component.treasureModel.itemNames[component.itemType.itemType];

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
      expect(component.validating).toBeFalse();
      
      expect(treasureServiceSpy.getItem).toHaveBeenCalledWith('it1', 'power 1', 'item 2');
      expect(loggerServiceSpy.logError).toHaveBeenCalledWith('I failed');
      expect(sweetAlertServiceSpy.showError).toHaveBeenCalledTimes(1);
    }));

    it('should update item names to valid name', fakeAsync(() => {
      setupOnInit();

      treasureServiceSpy.validateItem.and.callFake(() => getFakeDelay(true));

      component.updateItemType(component.treasureModel.itemTypeViewModels[1]);

      expect(component.itemType).toEqual(component.treasureModel.itemTypeViewModels[1]);
      expect(component.itemNames).toEqual(component.treasureModel.itemNames['it2']);
      expect(component.itemName).toEqual('');

      expect(treasureServiceSpy.validateItem).toHaveBeenCalledWith('it2', 'power 1', '');
      expect(component.validating).toBeTrue();

      tick(delay);

      expect(component.validItem).toBeTrue();
      expect(component.validating).toBeFalse();
    }));

    it('should update item names to invalid name', fakeAsync(() => {
      setupOnInit();

      treasureServiceSpy.validateItem.and.callFake(() => getFakeDelay(false));

      component.updateItemType(component.treasureModel.itemTypeViewModels[1]);

      expect(component.itemType).toEqual(component.treasureModel.itemTypeViewModels[1]);
      expect(component.itemNames).toEqual(component.treasureModel.itemNames['it2']);
      expect(component.itemName).toEqual('');

      expect(treasureServiceSpy.validateItem).toHaveBeenCalledWith('it2', 'power 1', '');
      expect(component.validating).toBeTrue();

      tick(delay);

      expect(component.validItem).toBeFalse();
      expect(component.validating).toBeFalse();
    }));

    it('should download treasure', () => {
      let treasure = new Treasure(new Coin('munny', 9266));
      component.treasure = treasure;

      treasureFormatterServiceSpy.formatTreasure.and.returnValue('my formatted treasure');
      idServiceSpy.generate.and.returnValue('abc');

      component.downloadTreasure();

      expect(treasureFormatterServiceSpy.formatTreasure).toHaveBeenCalledWith(treasure);
      expect(fileSaverServiceSpy.save).toHaveBeenCalledWith('my formatted treasure', 'Treasure abc');
    });

    it('should not download missing treasure', () => {
      component.treasure = null;

      component.downloadTreasure();
      
      expect(treasureFormatterServiceSpy.formatTreasure).not.toHaveBeenCalled();
      expect(idServiceSpy.generate).not.toHaveBeenCalled();
      expect(fileSaverServiceSpy.save).not.toHaveBeenCalled();
    });

    it('should download empty treasure', () => {
      let treasure = new Treasure(new Coin(), [], []);
      component.treasure = treasure;

      treasureFormatterServiceSpy.formatTreasure.and.returnValue('my empty treasure');
      idServiceSpy.generate.and.returnValue('def');

      component.downloadTreasure();

      expect(treasureFormatterServiceSpy.formatTreasure).toHaveBeenCalledWith(treasure);
      expect(fileSaverServiceSpy.save).toHaveBeenCalledWith('my empty treasure', 'Treasure def');
    });

    it('should download item', () => {
      let item = new Item('my item', 'my item type');
      component.item = item;

      treasureFormatterServiceSpy.formatItem.and.returnValue('my formatted item');
      idServiceSpy.generate.and.returnValue('123');

      component.downloadItem();

      expect(treasureFormatterServiceSpy.formatItem).toHaveBeenCalledWith(item);
      expect(fileSaverServiceSpy.save).toHaveBeenCalledWith('my formatted item', 'Item (my item) 123');
    });

    it('should not download missing item', () => {
      component.item = null;

      component.downloadItem();
      
      expect(treasureFormatterServiceSpy.formatItem).not.toHaveBeenCalled();
      expect(idServiceSpy.generate).not.toHaveBeenCalled();
      expect(fileSaverServiceSpy.save).not.toHaveBeenCalled();
    });
  });

  describe('integration', () => {
    let fixture: ComponentFixture<TreasureGenComponent>;
  
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [
          AppModule
        ],
      }).compileComponents();
  
      fixture = TestBed.createComponent(TreasureGenComponent);
      
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
  
    it(`should set the treasure model on init`, () => {
      const component = fixture.componentInstance;
      expect(component.treasureModel).toBeDefined();
      expect(component.treasureModel.treasureTypes).toEqual(['Treasure', 'Coin', 'Goods', 'Items']);
      expect(component.treasureModel.maxTreasureLevel).toEqual(100);
      expect(component.treasureModel.powers).toEqual(['Mundane', 'Minor', 'Medium', 'Major']);
      expect(component.treasureModel.itemTypeViewModels.length).toEqual(11);

      for(var i = 0; i < component.treasureModel.itemTypeViewModels.length; i++) {
        let itemType = component.treasureModel.itemTypeViewModels[i].itemType;
        expect(component.treasureModel.itemNames[itemType]).toBeDefined();
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
  
      const tabLinks = compiled.querySelectorAll('ul.nav-tabs > li > a.nav-link');
      expect(tabLinks).toBeDefined();
      expect(tabLinks?.length).toEqual(2);
      expect(tabLinks?.item(0).textContent).toEqual('Treasure');
      expect(tabLinks?.item(0).getAttribute('class')).toContain('active');
      expect(tabLinks?.item(0).getAttribute('href')).toEqual('#treasure');
      expect(tabLinks?.item(1).textContent).toEqual('Item');
      expect(tabLinks?.item(1).getAttribute('class')).not.toContain('active');
      expect(tabLinks?.item(1).getAttribute('href')).toEqual('#item');
    });

    function expectValidating(buttonSelector: string, validatingSelector: string) {
      expectHasAttribute(buttonSelector, 'disabled', true);
      expectHasAttribute(validatingSelector, 'hidden', false);
    }

    function expectGenerating(buttonSelector: string, validatingSelector: string) {
      expectHasAttribute(buttonSelector, 'disabled', true);
      expectHasAttribute(validatingSelector, 'hidden', true);
      expectHasAttribute('#treasureSection', 'hidden', true);
      expectHasAttribute('#generatingSection', 'hidden', false);
      expectHasAttribute('#downloadTreasureButton', 'hidden', true);
      expectHasAttribute('#downloadItemButton', 'hidden', true);
    }

    function expectHasAttribute(selector: string, attribute: string, hasAttribute: boolean) {
      const compiled = fixture.nativeElement as HTMLElement;

      const element = compiled!.querySelector(selector);
      expect(element).toBeDefined();
      expect(element?.hasAttribute(attribute)).toBe(hasAttribute);
    }

    function expectExists(selector: string, exists: boolean) {
      const compiled = fixture.nativeElement as HTMLElement;

      const element = compiled!.querySelector(selector);
      if (exists) {
        expect(element).not.toBeNull();
      } else {
        expect(element).toBeNull();
      }
    }

    function expectGenerated(buttonSelector: string, validatingSelector: string, downloadSelector: string) {
      expectHasAttribute(buttonSelector, 'disabled', false);
      expectHasAttribute(validatingSelector, 'hidden', true);
      expectHasAttribute('#treasureSection', 'hidden', false);
      expectHasAttribute('#generatingSection', 'hidden', true);
      expectHasAttribute('#downloadTreasureButton', 'hidden', downloadSelector != '#downloadTreasureButton');
      expectHasAttribute('#downloadItemButton', 'hidden', downloadSelector != '#downloadItemButton');
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

      button.dispatchEvent(new Event('click'));
    }

    describe('the treasure tab', () => {
      it(`should render the treasure tab`, () => {
        const compiled = fixture.nativeElement as HTMLElement;
  
        const treasureTab = compiled.querySelector('#treasure');
        expect(treasureTab).toBeDefined();
        
        const treasureTypesSelect = treasureTab!.querySelector('#treasureTypes');
        expect(treasureTypesSelect).toBeDefined();
        expectHasAttribute('#treasureTypes', 'required', true);
  
        const selectedTreasureType = treasureTab!.querySelector('#treasureTypes > option:checked');
        expect(selectedTreasureType).toBeDefined();
        expect(selectedTreasureType?.textContent).toEqual('Treasure');
  
        const treasureTypeOptions = treasureTab!.querySelectorAll('#treasureTypes > option');
        expect(treasureTypeOptions).toBeDefined();
        expect(treasureTypeOptions?.length).toEqual(4);
        expect(treasureTypeOptions?.item(0).textContent).toEqual('Treasure');
        expect(treasureTypeOptions?.item(1).textContent).toEqual('Coin');
        expect(treasureTypeOptions?.item(2).textContent).toEqual('Goods');
        expect(treasureTypeOptions?.item(3).textContent).toEqual('Items');
  
        const levelInput = treasureTab!.querySelector('#treasureLevel') as HTMLInputElement;
        expect(levelInput).toBeDefined();
        expect(levelInput?.value).toEqual('1');
        expect(levelInput?.getAttribute('type')).toEqual('number');
        expect(levelInput?.getAttribute('min')).toEqual('1');
        expect(levelInput?.getAttribute('max')).toEqual('100');
        expect(levelInput?.getAttribute('pattern')).toEqual('^[0-9]+$');
        expectHasAttribute('#treasureLevel', 'required', true);

        expectHasAttribute('#treasureButton', 'disabled', false);
        expectHasAttribute('#treasureValidating', 'hidden', true);
      });
    
      it(`should show when validating treasure`, () => {
        const component = fixture.componentInstance;
        component.validating = true;
  
        fixture.detectChanges();

        expectValidating('#treasureButton', '#treasureValidating');
      });
    
      it(`should show that treasure is invalid - missing level`, () => {
        setInput('#treasureLevel', '');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.level).toBeNull();
        expectInvalid('#treasureButton', '#treasureValidating');
      });
    
      it(`should show that treasure is invalid - level invalid`, () => {
        setInput('#treasureLevel', 'wrong');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.level).toBeNull();
        expectInvalid('#treasureButton', '#treasureValidating');
      });
    
      it(`should show that treasure is invalid - level too low`, () => {
        setInput('#treasureLevel', '0');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.level).toEqual(0);
        expectInvalid('#treasureButton', '#treasureValidating');
      });
    
      it(`should show that treasure is invalid - level too high`, async () => {
        setInput('#treasureLevel', '101');
  
        fixture.detectChanges();

        expect(fixture.componentInstance.level).toEqual(101);
        expectValidating('#treasureButton', '#treasureValidating');
  
        //run validation
        await waitForService();
  
        expectInvalid('#treasureButton', '#treasureValidating');
      });
    
      const levelTestCases = [1, 2, 10, 20, 100];

      levelTestCases.forEach(test => {
        it(`should show that treasure is valid - level ${test}`, async () => {
          setInput('#treasureLevel', test.toString());
    
          fixture.detectChanges();
    
          expect(fixture.componentInstance.level).toEqual(test);
          expectValidating('#treasureButton', '#treasureValidating');
    
          //run validation
          await waitForService();
    
          expectValid('#treasureButton', '#treasureValidating');
        });
      });
    
      it(`should show that treasure is invalid - missing treasure type`, () => {
        setSelectByValue('#treasureTypes', '');
  
        fixture.detectChanges();
  
        expectInvalid('#treasureButton', '#treasureValidating');
      });
    
      const treasureTypesIndicesTestCases = Array.from(Array(4).keys());

      treasureTypesIndicesTestCases.forEach(test => {
        it(`should show that treasure is valid - non-default treasure type index ${test}`, () => {
          setSelectByIndex('#treasureTypes', test);
    
          fixture.detectChanges();
    
          expect(fixture.componentInstance.treasureType).toEqual(fixture.componentInstance.treasureModel.treasureTypes[test]);
          expectValid('#treasureButton', '#treasureValidating');
        });
      });

      xit(`should show that treasure is invalid - validation fails`, () => {
        expect('there are no invalid treasure combinations').toBe('');
      });
    
      it(`should show that treasure is valid - validation succeeds`, async () => {
        setInput('#treasureLevel', '42');
        setSelectByIndex('#treasureTypes', 3);
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.treasureType).toEqual(fixture.componentInstance.treasureModel.treasureTypes[3]);
        expectValidating('#treasureButton', '#treasureValidating');
  
        //run validation
        await waitForService();
  
        expectValid('#treasureButton', '#treasureValidating');
      });
    
      it(`should show when generating treasure`, () => {
        const component = fixture.componentInstance;
        component.generating = true;
  
        fixture.detectChanges();

        expectGenerating('#treasureButton', '#treasureValidating');
      });
    
      it(`should generate the default treasure`, async () => {
        clickButton('#treasureButton');
  
        fixture.detectChanges();
        
        expectGenerating('#treasureButton', '#treasureValidating');

        //run generate treasure
        await waitForService();
  
        expectGenerated('#treasureButton', '#treasureValidating', '#downloadTreasureButton');

        expectHasAttribute('#noTreasure', 'hidden', true)
        expectExists('#treasureSection > dndgen-treasure', true);
        expectExists('#treasureSection > dndgen-item', false);

        const element = fixture.debugElement.query(By.css('#treasureSection dndgen-treasure'));
        expect(element).toBeDefined();
        expect(element.componentInstance).toBeDefined();
        expect(element.componentInstance).toBeInstanceOf(TreasureComponent);
  
        const treasureComponent = element.componentInstance as TreasureComponent;
        expect(treasureComponent.treasure).toBeDefined();
        expect(treasureComponent.treasure).not.toBeNull();
      });
    
      it(`should generate non-default treasure`, async () => {
        setInput('#treasureLevel', '42');
        setSelectByIndex('#treasureTypes', 2);
  
        fixture.detectChanges();

        expect(fixture.componentInstance.level).toEqual(42);
        expect(fixture.componentInstance.treasureType).toEqual(fixture.componentInstance.treasureModel.treasureTypes[2]);

        //run validation
        await waitForService();

        clickButton('#treasureButton');
  
        fixture.detectChanges();
        
        expectGenerating('#treasureButton', '#treasureValidating');

        //run generate treasure
        await waitForService();
  
        expectGenerated('#treasureButton', '#treasureValidating', '#downloadTreasureButton');

        expectHasAttribute('#noTreasure', 'hidden', true);
        expectExists('#treasureSection > dndgen-treasure', true);
        expectExists('#treasureSection > dndgen-item', false);

        const element = fixture.debugElement.query(By.css('#treasureSection dndgen-treasure'));
        expect(element).toBeDefined();
        expect(element.componentInstance).toBeDefined();
        expect(element.componentInstance).toBeInstanceOf(TreasureComponent);
  
        const treasureComponent = element.componentInstance as TreasureComponent;
        expect(treasureComponent.treasure).toBeDefined();
        expect(treasureComponent.treasure).not.toBeNull();
        expect(treasureComponent.treasure.isAny).toBeTrue();
        expect(treasureComponent.treasure.coin).toBeDefined();
        expect(treasureComponent.treasure.coin.currency).toBe('');
        expect(treasureComponent.treasure.coin.quantity).toBe(0);
        expect(treasureComponent.treasure.goods.length).toBeGreaterThan(0);
        expect(treasureComponent.treasure.items).toEqual([]);
      });
    });
  
    describe('the item tab', () => {
      it(`should render the item tab`, () => {
        const compiled = fixture.nativeElement as HTMLElement;
  
        const itemTab = compiled.querySelector('#item');
        expect(itemTab).toBeDefined();
  
        //item type
        const itemTypesSelect = itemTab!.querySelector('#itemTypes');
        expect(itemTypesSelect).toBeDefined();
        expectHasAttribute('#itemTypes', 'required', true);
  
        const selectedItemType = itemTab!.querySelector('#itemTypes > option:checked');
        expect(selectedItemType).toBeDefined();
        expect(selectedItemType?.textContent).toEqual('Alchemical Item');
  
        const itemTypeOptions = itemTab!.querySelectorAll('#itemTypes > option');
        expect(itemTypeOptions).toBeDefined();
        expect(itemTypeOptions?.length).toEqual(11);
        expect(itemTypeOptions?.item(0).textContent).toEqual('Alchemical Item');
        expect(itemTypeOptions?.item(1).textContent).toEqual('Armor');
        expect(itemTypeOptions?.item(2).textContent).toEqual('Potion');
        expect(itemTypeOptions?.item(5).textContent).toEqual('Ring');
        expect(itemTypeOptions?.item(6).textContent).toEqual('Rod');
        expect(itemTypeOptions?.item(3).textContent).toEqual('Scroll');
        expect(itemTypeOptions?.item(4).textContent).toEqual('Staff');
        expect(itemTypeOptions?.item(7).textContent).toEqual('Tool');
        expect(itemTypeOptions?.item(8).textContent).toEqual('Wand');
        expect(itemTypeOptions?.item(9).textContent).toEqual('Weapon');
        expect(itemTypeOptions?.item(10).textContent).toEqual('Wondrous Item');
  
        //power
        const powersSelect = itemTab!.querySelector('#powers');
        expect(powersSelect).toBeDefined();
        expectHasAttribute('#powers', 'required', true);
  
        const selectedPower = itemTab!.querySelector('#powers > option:checked');
        expect(selectedPower).toBeDefined();
        expect(selectedPower?.textContent).toEqual('Mundane');
  
        const powerOptions = itemTab!.querySelectorAll('#powers > option');
        expect(powerOptions).toBeDefined();
        expect(powerOptions?.length).toEqual(4);
        expect(powerOptions?.item(0).textContent).toEqual('Mundane');
        expect(powerOptions?.item(1).textContent).toEqual('Minor');
        expect(powerOptions?.item(2).textContent).toEqual('Medium');
        expect(powerOptions?.item(3).textContent).toEqual('Major');
  
        //item name
        const itemNamesSelect = itemTab!.querySelector('#itemNames');
        expect(itemNamesSelect).toBeDefined();
        expectHasAttribute('#itemNames', 'required', false);
        expectHasAttribute('#itemNames', 'hidden', false);
  
        const selectedItemName = itemTab!.querySelector('#itemNames > option:checked');
        expect(selectedItemName).toBeDefined();
        expect(selectedItemName?.textContent).toEqual('');
  
        const itemNameOptions = itemTab!.querySelectorAll('#itemNames > option');
        expect(itemNameOptions).toBeDefined();
        expect(itemNameOptions?.length).toEqual(fixture.componentInstance.treasureModel.itemNames['AlchemicalItem'].length);

        for(var i = 0; i < itemNameOptions?.length; i++) {
          expect(itemNameOptions?.item(i).textContent).toEqual(fixture.componentInstance.treasureModel.itemNames['AlchemicalItem'][i]);
        }
  
        //Any item name
        const anyItemNameInput = itemTab!.querySelector('#anyItemName') as HTMLInputElement;
        expect(anyItemNameInput).toBeDefined();
        expect(anyItemNameInput?.value).toEqual('');
        expect(anyItemNameInput?.getAttribute('type')).toEqual('text');
        expectHasAttribute('#anyItemName', 'required', false);
        expectHasAttribute('#anyItemName', 'hidden', true);

        expectHasAttribute('#itemButton', 'disabled', false);
        expectHasAttribute('#itemValidating', 'hidden', true);
      });
    
      it(`should show when validating an item`, () => {
        const component = fixture.componentInstance;
        component.validating = true;
  
        fixture.detectChanges();

        expectValidating('#itemButton', '#itemValidating');
      });
    
      it(`should show that an item is invalid - missing item type`, () => {
        setSelectByValue('#itemTypes', '');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.itemType).toBeUndefined();
        expectInvalid('#itemButton', '#itemValidating');
      });

      // const itemTypeIndicesTestCases = Array.from(Array(11).keys());

      // itemTypeIndicesTestCases.forEach(itemTypeIndex => {
      //   it(`should show that item is valid - non-default item type index ${itemTypeIndex}`, async () => {
      //     let itemTypeViewModel = fixture.componentInstance.treasureModel.itemTypeViewModels[itemTypeIndex];
      //     let itemNames = fixture.componentInstance.treasureModel.itemNames[itemTypeViewModel.itemType];

      //     setSelectByIndex('#itemTypes', itemTypeIndex);
    
      //     fixture.detectChanges();
    
      //     expect(fixture.componentInstance.itemType).toEqual(itemTypeViewModel);
      //     expect(fixture.componentInstance.itemName).toEqual('');
          
      //     const compiled = fixture.nativeElement as HTMLElement;
      //     const itemNameOptions = compiled!.querySelectorAll('#itemNames > option');
      //     expect(itemNameOptions).toBeDefined();
      //     expect(itemNameOptions?.length).toEqual(itemNames.length);

      //     for(var i = 0; i < itemNameOptions?.length; i++) {
      //       expect(itemNameOptions?.item(i).textContent).toEqual(itemNames[itemTypeViewModel.itemType][i]);
      //     }

      //     expectValidating('#itemButton', '#itemValidating');
  
      //     //run validation
      //     await waitForService();
    
      //     expectInvalid('#itemButton', '#itemValidating');
      //   });

      //   it(`should show that item with any name is valid - non-default item type index ${itemTypeIndex}`, async () => {
      //     let itemTypeViewModel = fixture.componentInstance.treasureModel.itemTypeViewModels[itemTypeIndex];
      //     let itemNames = fixture.componentInstance.treasureModel.itemNames[itemTypeViewModel.itemType];
          
      //     setSelectByIndex('#itemTypes', itemTypeIndex);
          
      //     fixture.detectChanges();
  
      //     expect(fixture.componentInstance.itemNames).toEqual(itemNames);
            
      //     //run validation
      //     await waitForService();
    
      //     if (itemTypeViewModel.itemType != 'Wand' && itemTypeViewModel.itemType != 'Scroll') {
      //       expectHasAttribute('#itemNames', 'hidden', false);
      //       expectHasAttribute('#anyItemName', 'hidden', true);
      //       return;
      //     }

      //     expectHasAttribute('#itemNames', 'hidden', true);
      //     expectHasAttribute('#anyItemName', 'hidden', false);

      //     setInput('#anyItemName', `My ${itemTypeViewModel.displayName}`);
    
      //     fixture.detectChanges();
    
      //     expect(fixture.componentInstance.itemType).toEqual(fixture.componentInstance.treasureModel.itemTypeViewModels[itemTypeIndex]);
      //     expect(fixture.componentInstance.itemName).toEqual(`My ${itemTypeViewModel.displayName}`);
      //     expectValidating('#itemButton', '#itemValidating');
  
      //     //run validation
      //     await waitForService();
    
      //     expectInvalid('#itemButton', '#itemValidating');
      //   });

      //   const itemNameIndicesTestCases = Array.from(Array(300).keys());

      //   itemNameIndicesTestCases.forEach(nameIndex => {
      //     it(`should show that item with name is valid - item type index ${itemTypeIndex}, name index ${nameIndex}`, async () => {
      //       let itemTypeViewModel = fixture.componentInstance.treasureModel.itemTypeViewModels[itemTypeIndex];
      //       let itemNames = fixture.componentInstance.treasureModel.itemNames[itemTypeViewModel.itemType];

      //       if (nameIndex >= itemNames.length) {
      //         return;
      //       }

      //       setSelectByIndex('#itemTypes', itemTypeIndex);
            
      //       fixture.detectChanges();

      //       expect(fixture.componentInstance.itemNames).toEqual(itemNames);
            
      //       //run validation
      //       await waitForService();
      
      //       if (itemTypeViewModel.itemType == 'Wand' || itemTypeViewModel.itemType == 'Scroll') {
      //         expectHasAttribute('#itemNames', 'hidden', true);
      //         expectHasAttribute('#anyItemName', 'hidden', false);
      //         return;
      //       }
  
      //       expectHasAttribute('#itemNames', 'hidden', false);
      //       expectHasAttribute('#anyItemName', 'hidden', true);

      //       setSelectByIndex('#itemNames', nameIndex);
      
      //       fixture.detectChanges();
      
      //       expect(fixture.componentInstance.itemType).toEqual(fixture.componentInstance.treasureModel.itemTypeViewModels[itemTypeIndex]);
      //       expect(fixture.componentInstance.itemName).toEqual(itemNames[nameIndex]);
      //       expectValidating('#itemButton', '#itemValidating');
    
      //       //run validation
      //       await waitForService();
      
      //       expectValid('#itemButton', '#itemValidating');
      //     });
      //   });

      //   it(`should show an item is invalid - not a valid name - item type index ${itemTypeIndex}`, async () => {
      //     let itemTypeViewModel = fixture.componentInstance.treasureModel.itemTypeViewModels[itemTypeIndex];
      //     let itemNames = fixture.componentInstance.treasureModel.itemNames[itemTypeViewModel.itemType];
  
      //     setSelectByIndex('#itemTypes', itemTypeIndex);
            
      //     fixture.detectChanges();
  
      //     expect(fixture.componentInstance.itemNames).toEqual(itemNames);
          
      //     //run validation
      //     await waitForService();
    
      //     if (itemTypeViewModel.itemType == 'Wand' || itemTypeViewModel.itemType == 'Scroll') {
      //       expectHasAttribute('#itemNames', 'hidden', true);
      //       expectHasAttribute('#anyItemName', 'hidden', false);
      //       return;
      //     }

      //     expectHasAttribute('#itemNames', 'hidden', false);
      //     expectHasAttribute('#anyItemName', 'hidden', true);
  
      //     setSelectByValue('#itemNames', 'not a name');
    
      //     fixture.detectChanges();
    
      //     expect(fixture.componentInstance.itemType).toEqual(fixture.componentInstance.treasureModel.itemTypeViewModels[itemTypeIndex]);
      //     expect(fixture.componentInstance.itemName).toEqual('not a name');
      //     expectValidating('#itemButton', '#itemValidating');
  
      //     //run validation
      //     await waitForService();
    
      //     expectInvalid('#itemButton', '#itemValidating');
      //   });
  
      //   it(`should show an item is invalid - not a valid matching name - item type index ${itemTypeIndex}`, async () => {
      //     let itemTypeViewModel = fixture.componentInstance.treasureModel.itemTypeViewModels[itemTypeIndex];
      //     let itemNames = fixture.componentInstance.treasureModel.itemNames[itemTypeViewModel.itemType];
  
      //     setSelectByIndex('#itemTypes', itemTypeIndex);
            
      //     fixture.detectChanges();
  
      //     expect(fixture.componentInstance.itemNames).toEqual(itemNames);
          
      //     //run validation
      //     await waitForService();
    
      //     if (itemTypeViewModel.itemType == 'Wand' || itemTypeViewModel.itemType == 'Scroll') {
      //       expectHasAttribute('#itemNames', 'hidden', true);
      //       expectHasAttribute('#anyItemName', 'hidden', false);
      //       return;
      //     }

      //     expectHasAttribute('#itemNames', 'hidden', false);
      //     expectHasAttribute('#anyItemName', 'hidden', true);
  
      //     let wrongIndex = itemTypeIndex - 1 >= 0 ? itemTypeIndex - 1 : 10;
      //     let wrongItemType = fixture.componentInstance.treasureModel.itemTypeViewModels[wrongIndex];
      //     let wrongName = fixture.componentInstance.treasureModel.itemNames[wrongItemType.itemType][0];
      //     setSelectByValue('#itemNames', wrongName);
    
      //     fixture.detectChanges();
    
      //     expect(fixture.componentInstance.itemType).toEqual(fixture.componentInstance.treasureModel.itemTypeViewModels[itemTypeIndex]);
      //     expect(fixture.componentInstance.itemName).toEqual(wrongName);
      //     expectValidating('#itemButton', '#itemValidating');
  
      //     //run validation
      //     await waitForService();
    
      //     expectInvalid('#itemButton', '#itemValidating');
      //   });
      // });

      it('should show an item is invalid - missing power', async () => {
        setSelectByValue('#powers', '');
          
        fixture.detectChanges();
    
        expect(fixture.componentInstance.power).toEqual('');
        expectValidating('#itemButton', '#itemValidating');

        //run validation
        await waitForService();
  
        expectInvalid('#itemButton', '#itemValidating');
      });

      it('should show an item is invalid - not a valid power', async () => {
        setSelectByValue('#powers', 'Omnipotent');
          
        fixture.detectChanges();
    
        expect(fixture.componentInstance.power).toEqual('Omnipotent');
        expectValidating('#itemButton', '#itemValidating');

        //run validation
        await waitForService();
  
        expectInvalid('#itemButton', '#itemValidating');
      });

      it('should show an item is invalid - not a valid matching power', async () => {
        const rodIndex = fixture.componentInstance.treasureModel.itemTypeViewModels.findIndex(itvm => itvm.itemType == 'Rod');
        const minorIndex = fixture.componentInstance.treasureModel.powers.findIndex(p => p == 'Minor');
  
        setSelectByIndex('#itemTypes', rodIndex);
        setSelectByIndex('#powers', minorIndex);
          
        fixture.detectChanges();
    
        expect(fixture.componentInstance.itemType?.itemType).toEqual('Rod');
        expect(fixture.componentInstance.power).toEqual('Minor');
        expectValidating('#itemButton', '#itemValidating');

        //run validation
        await waitForService();
  
        expectInvalid('#itemButton', '#itemValidating');
      });

      const powerIndicesTestCases = Array.from(Array(4).keys());
      
      powerIndicesTestCases.forEach(powerIndex => {
        it(`should show that item is valid - non-default power index ${powerIndex}`, async () => {
          const armorIndex = fixture.componentInstance.treasureModel.itemTypeViewModels.findIndex(itvm => itvm.itemType == 'Armor');

          setSelectByIndex('#itemTypes', armorIndex);
          setSelectByIndex('#powers', powerIndex);

          fixture.detectChanges();
    
          expect(fixture.componentInstance.itemType).toEqual(fixture.componentInstance.treasureModel.itemTypeViewModels[armorIndex]);
          expect(fixture.componentInstance.power).toEqual(fixture.componentInstance.treasureModel.powers[powerIndex]);
          expect(fixture.componentInstance.itemName).toEqual('');
          expectValidating('#itemButton', '#itemValidating');
  
          //run validation
          await waitForService();
    
          expectValid('#itemButton', '#itemValidating');
        });
      });
    
      it(`should show when generating an item`, () => {
        const component = fixture.componentInstance;
        component.generating = true;
  
        fixture.detectChanges();

        expectGenerating('#itemButton', '#itemValidating');
      });
    
      it(`should generate the default item`, async () => {
        clickButton('#itemButton');
  
        fixture.detectChanges();
        
        expectGenerating('#itemButton', '#itemValidating');

        //run generate item
        await waitForService();
  
        expectGenerated('#itemButton', '#itemValidating', '#downloadItemButton');
        expectHasAttribute('#noTreasure', 'hidden', true);
        expectHasAttribute('#treasureSection dndgen-treasure', 'hidden', true);
        expectHasAttribute('#treasureSection dndgen-item', 'hidden', false);

        const element = fixture.debugElement.query(By.css('#treasureSection dndgen-item'));
        expect(element).toBeDefined();
        expect(element.componentInstance).toBeDefined();
        expect(element.componentInstance).toBeInstanceOf(ItemComponent);
  
        const treasureComponent = element.componentInstance as ItemComponent;
        expect(treasureComponent.item).toBeDefined();
        expect(treasureComponent.item).not.toBeNull();
        expect(treasureComponent.item?.name).toBeTruthy();
      });
    
      it(`should generate the default item`, async () => {
        clickButton('#itemButton');
  
        fixture.detectChanges();
        
        expectGenerating('#itemButton', '#itemValidating');

        //run generate item
        await waitForService();
  
        expectGenerated('#itemButton', '#itemValidating', '#downloadItemButton');
        expectHasAttribute('#noTreasure', 'hidden', true);
        expectHasAttribute('#treasureSection dndgen-treasure', 'hidden', true);
        expectHasAttribute('#treasureSection dndgen-item', 'hidden', false);

        const element = fixture.debugElement.query(By.css('#treasureSection dndgen-item'));
        expect(element).toBeDefined();
        expect(element.componentInstance).toBeDefined();
        expect(element.componentInstance).toBeInstanceOf(ItemComponent);
  
        const itemComponent = element.componentInstance as ItemComponent;
        expect(itemComponent.item).toBeDefined();
        expect(itemComponent.item).not.toBeNull();
        expect(itemComponent.item?.name).toBeTruthy();
        expect(itemComponent.item?.itemType).toEqual('AlchemicalItem');
      });
    
      it(`should generate the default item with name`, async () => {
        setSelectByIndex('#itemNames', 1);

        fixture.detectChanges();

        expect(fixture.componentInstance.itemName).toEqual('Antitoxin');

        //run validation
        await waitForService();
  
        clickButton('#itemButton');
  
        fixture.detectChanges();
        
        expectGenerating('#itemButton', '#itemValidating');

        //run generate item
        await waitForService();
  
        expectGenerated('#itemButton', '#itemValidating', '#downloadItemButton');
        expectHasAttribute('#noTreasure', 'hidden', true);
        expectHasAttribute('#treasureSection dndgen-treasure', 'hidden', true);
        expectHasAttribute('#treasureSection dndgen-item', 'hidden', false);

        const element = fixture.debugElement.query(By.css('#treasureSection dndgen-item'));
        expect(element).toBeDefined();
        expect(element.componentInstance).toBeDefined();
        expect(element.componentInstance).toBeInstanceOf(ItemComponent);
  
        const itemComponent = element.componentInstance as ItemComponent;
        expect(itemComponent.item).toBeDefined();
        expect(itemComponent.item).not.toBeNull();
        expect(itemComponent.item?.name).toEqual('Antitoxin');
        expect(itemComponent.item?.itemType).toEqual('AlchemicalItem');
      });
    
      it(`should generate a non-default item`, async () => {
        setSelectByIndex('#itemTypes', 1);
        setSelectByIndex('#powers', 2);
  
        fixture.detectChanges();

        expect(fixture.componentInstance.itemType?.itemType).toEqual('Armor');
        expect(fixture.componentInstance.power).toEqual('Medium');

        //run validation
        await waitForService();

        clickButton('#itemButton');
  
        fixture.detectChanges();
        
        expectGenerating('#itemButton', '#itemValidating');

        //run roll
        await waitForService();
  
        expectGenerated('#itemButton', '#itemValidating', '#downloadItemButton');
        expectHasAttribute('#noTreasure', 'hidden', true);
        expectHasAttribute('#treasureSection dndgen-treasure', 'hidden', true);
        expectHasAttribute('#treasureSection dndgen-item', 'hidden', false);

        const element = fixture.debugElement.query(By.css('#treasureSection dndgen-item'));
        expect(element).toBeDefined();
        expect(element.componentInstance).toBeDefined();
        expect(element.componentInstance).toBeInstanceOf(ItemComponent);
  
        const itemComponent = element.componentInstance as ItemComponent;
        expect(itemComponent.item).toBeDefined();
        expect(itemComponent.item).not.toBeNull();
        expect(itemComponent.item?.name).toBeTruthy();
        expect(itemComponent.item?.itemType).toEqual('Armor');
      });
    
      it(`should generate a non-default item with name`, async () => {
        setSelectByIndex('#itemTypes', 1);
        setSelectByIndex('#powers', 2);
  
        fixture.detectChanges();

        expect(fixture.componentInstance.itemType?.itemType).toEqual('Armor');
        expect(fixture.componentInstance.power).toEqual('Medium');

        //run validation
        await waitForService();

        setSelectByIndex('#itemNames', 3);
  
        fixture.detectChanges();

        expect(fixture.componentInstance.itemName).toEqual('Breastplate');

        //run validation
        await waitForService();

        clickButton('#itemButton');
  
        fixture.detectChanges();
        
        expectGenerating('#itemButton', '#itemValidating');

        //run roll
        await waitForService();
  
        expectGenerated('#itemButton', '#itemValidating', '#downloadItemButton');
        expectHasAttribute('#noTreasure', 'hidden', true);
        expectHasAttribute('#treasureSection dndgen-treasure', 'hidden', true);
        expectHasAttribute('#treasureSection dndgen-item', 'hidden', false);

        const element = fixture.debugElement.query(By.css('#treasureSection dndgen-item'));
        expect(element).toBeDefined();
        expect(element.componentInstance).toBeDefined();
        expect(element.componentInstance).toBeInstanceOf(ItemComponent);
  
        const itemComponent = element.componentInstance as ItemComponent;
        expect(itemComponent.item).toBeDefined();
        expect(itemComponent.item).not.toBeNull();
        expect(itemComponent.item?.name).toEqual('Breastplate');
        expect(itemComponent.item?.itemType).toEqual('Armor');
      });
    
      it(`should generate a non-default item with any name`, async () => {
        const wandIndex = fixture.componentInstance.treasureModel.itemTypeViewModels.findIndex(itvm => itvm.itemType == 'Wand');
        setSelectByIndex('#itemTypes', wandIndex);
        setSelectByIndex('#powers', 3);
  
        fixture.detectChanges();

        expect(fixture.componentInstance.itemType?.itemType).toEqual('Wand');
        expect(fixture.componentInstance.power).toEqual('Major');

        //run validation
        await waitForService();

        setInput('#anyItemName', 'Wand of Awesomeness');
  
        fixture.detectChanges();

        expect(fixture.componentInstance.itemName).toEqual('Wand of Awesomeness');

        //run validation
        await waitForService();

        clickButton('#itemButton');
  
        fixture.detectChanges();
        
        expectGenerating('#itemButton', '#itemValidating');

        //run generate item
        await waitForService();
  
        expectGenerated('#itemButton', '#itemValidating', '#downloadItemButton');
        expectHasAttribute('#noTreasure', 'hidden', true);
        expectHasAttribute('#treasureSection dndgen-treasure', 'hidden', true);
        expectHasAttribute('#treasureSection dndgen-item', 'hidden', false);

        const element = fixture.debugElement.query(By.css('#treasureSection dndgen-item'));
        expect(element).toBeDefined();
        expect(element.componentInstance).toBeDefined();
        expect(element.componentInstance).toBeInstanceOf(ItemComponent);
  
        const itemComponent = element.componentInstance as ItemComponent;
        expect(itemComponent.item).toBeDefined();
        expect(itemComponent.item).not.toBeNull();
        expect(itemComponent.item?.name).toEqual('Wand of Awesomeness');
        expect(itemComponent.item?.itemType).toEqual('Wand');
        expect(itemComponent.item?.isMagical).toBeTrue();
        expect(itemComponent.item?.magic.charges).toBeGreaterThan(0);
      });
    });
  
    it(`should render no treasure`, () => {
      expectHasAttribute('#noTreasure', 'hidden', false);

      const compiled = fixture.nativeElement as HTMLElement;
      let element = compiled!.querySelector('#treasureSection dndgen-treasure');
      expect(element).toBeNull();

      element = compiled!.querySelector('#treasureSection dndgen-item');
      expect(element).toBeNull();
    });
    
    it(`should render treasure`, () => {
      fixture.componentInstance.treasure = new Treasure();

      fixture.detectChanges();

      expectHasAttribute('#noTreasure', 'hidden', true);
      expectHasAttribute('#treasureSection dndgen-treasure', 'hidden', false);
      
      const compiled = fixture.nativeElement as HTMLElement;
      let element = compiled!.querySelector('#treasureSection dndgen-item');
      expect(element).toBeNull();
    });
    
    it(`should render item`, () => {
      fixture.componentInstance.item = new Item('my item', 'my item type');

      fixture.detectChanges();

      expectHasAttribute('#noTreasure', 'hidden', true);
      expectHasAttribute('#treasureSection dndgen-item', 'hidden', false);
      
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

      clickButton('#downloadTreasureButton');

      expect(FileSaver.saveAs).toHaveBeenCalledWith(
        jasmine.any(Blob),
        jasmine.stringMatching(/^Treasure [0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.txt$/));
        
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

      fixture.detectChanges();

      clickButton('#downloadItemButton');

      expect(FileSaver.saveAs).toHaveBeenCalledWith(
        jasmine.any(Blob),
        jasmine.stringMatching(/^Item \(my item\) [0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.txt$/));
      
      const blob = fileSaverSpy.calls.first().args[0] as Blob;
      const text = await blob.text();
      expect(text).toEqual('my item\r\n');
    });
  });
});
