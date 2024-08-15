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
      expect(component.validTreasure).toBeTrue();
      expect(component.validItem).toBeTrue();
      expect(component.treasure).toBeNull();
      expect(component.item).toBeNull();
      expect(component.itemNames).toEqual([]);
    });
  
    it(`should initialize the input values`, () => {
      expect(component.level).toEqual(1);
      expect(component.treasureType).toEqual('');
      expect(component.power).toEqual('');
      expect(component.itemType).toBeNull();
      expect(component.itemName).toBeNull();
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

      component.ngOnInit();

      expect(component.treasureModel).not.toBeDefined();
      expect(component.validating).toBeTrue();
      
      tick(delay / 2);

      expect(component.treasureModel).not.toBeDefined();
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

    it('should set the treasure model on init', fakeAsync(() => {
      const model = getViewModel();
      treasureServiceSpy.getViewModel.and.callFake(() => getFakeDelay(model));

      component.ngOnInit();

      expect(component.treasureModel).not.toBeDefined();
      expect(component.validating).toBeTrue();

      tick(delay);

      expect(component.treasureModel).toBeDefined();
      expect(component.treasureModel).toEqual(model);
      expect(component.validating).toBeFalse();

      expect(component.level).toEqual(1);
      expect(component.treasureType).toEqual('treasure type 1');
      expect(component.power).toEqual('power 1');
      expect(component.itemType).toEqual(new ItemTypeViewModel('it1', 'Item Type 1'));
      expect(component.itemNames).toEqual(['item 1', 'item 2']);
    }));

    it('should display error from getting treasure model', fakeAsync(() => {
      treasureServiceSpy.getViewModel.and.callFake(() => getFakeError('I failed'));

      component.ngOnInit();
      tick(delay);

      expect(component.treasureModel).not.toBeDefined();
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
      
      tick(delay / 2);

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
    }));

    it('should validate invalid treasure', fakeAsync(() => {
      treasureServiceSpy.validateTreasure.and.callFake(() => getFakeDelay(false));

      component.validateTreasure('my treasure type', 9266);

      expect(treasureServiceSpy.validateTreasure).toHaveBeenCalledWith('my treasure type', 9266);
      expect(component.validating).toBeTrue();

      tick(delay);

      expect(component.validTreasure).toBeFalse();
      expect(component.validating).toBeFalse();
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
      
      tick(delay / 2);

      expect(component.generating).toBeTrue();

      flush();
    }));

    function setupOnInit() {
      const model = getViewModel();
      treasureServiceSpy.getViewModel.and.returnValue(of(model));

      component.ngOnInit();

      tick();

      expect(component.treasureModel).toBeDefined();
      expect(component.treasureModel).toEqual(model);

      expect(component.level).toEqual(1);
      expect(component.treasureType).toEqual(model.treasureTypes[0]);
      expect(component.power).toEqual(model.powers[0]);
      expect(component.itemType).toEqual(model.itemTypeViewModels[0]);
      expect(component.itemNames).toEqual(model.itemNames[model.itemTypeViewModels[0].itemType]);
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
    }));

    it(`should generate a non-default treasure`, fakeAsync(() => {
      setupOnInit();

      let treasure = new Treasure(new Coin('munny', 9266));
      treasureServiceSpy.getTreasure.and.callFake(() => getFakeDelay(treasure));

      component.treasureType = component.treasureModel.treasureTypes[1];
      component.level = 90210;

      component.generateTreasure();

      expect(treasureServiceSpy.getTreasure).toHaveBeenCalledWith('treasure type 2', 9266);
      expect(component.generating).toBeTrue();

      tick(delay);

      expect(component.treasure).toBe(treasure);
      expect(component.generating).toBeFalse();
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
      expect(component.validTreasure).toBeTrue();
      expect(component.validItem).toBeTrue();
      
      expect(treasureServiceSpy.getTreasure).toHaveBeenCalledWith('treasure type 1', 1);
      expect(loggerServiceSpy.logError).toHaveBeenCalledWith('I failed');
      expect(sweetAlertServiceSpy.showError).toHaveBeenCalledTimes(1);
    }));

    it('should validate an item - invalid if no item type', () => {
      setupOnInit();

      component.validateItem('', 'my power', '');
      expect(component.validating).toBeFalse();
      expect(component.validItem).toBeFalse();
    });

    it('should validate an item - invalid if no power', () => {
      setupOnInit();

      component.validateItem('my item type', '', '');
      expect(component.validating).toBeFalse();
      expect(component.validItem).toBeFalse();
    });

    it('should be validating while validating an item', fakeAsync(() => {
      setupOnInit();

      treasureServiceSpy.validateItem.and.callFake(() => getFakeDelay(true));

      component.validateItem('my item type', 'my power', '');

      expect(treasureServiceSpy.validateItem).toHaveBeenCalledWith('my item type', 'my power', '');
      expect(component.validating).toBeTrue();
      
      tick(delay / 2);

      expect(component.validating).toBeTrue();

      flush();
    }));

    it('should be validating while validating an item with name', fakeAsync(() => {
      setupOnInit();

      treasureServiceSpy.validateItem.and.callFake(() => getFakeDelay(true));

      component.validateItem('my item type', 'my power', 'my name');

      expect(treasureServiceSpy.validateItem).toHaveBeenCalledWith('my item type', 'my power', 'my name');
      expect(component.validating).toBeTrue();
      
      tick(delay / 2);

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
      
      tick(delay / 2);

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
      
      tick(delay / 2);

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
    }));

    it(`should generate a non-default item with name`, fakeAsync(() => {
      setupOnInit();

      let item = new Item('my item', 'my item type');
      treasureServiceSpy.getItem.and.callFake(() => getFakeDelay(item));

      component.itemType = component.treasureModel.itemTypeViewModels[1];
      component.power = component.treasureModel.powers[1];

      component.updateItemNames(component.itemType);
      component.itemName = component.itemNames[1];

      component.generateItem();

      expect(treasureServiceSpy.getItem).toHaveBeenCalledWith('it2', 'power 2', 'item 4');
      expect(component.generating).toBeTrue();

      tick(delay);

      expect(component.item).toBe(item);
      expect(component.generating).toBeFalse();
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
      expect(component.validTreasure).toBeTrue();
      expect(component.validItem).toBeTrue();
      
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
      expect(component.validTreasure).toBeTrue();
      expect(component.validItem).toBeTrue();
      
      expect(treasureServiceSpy.getItem).toHaveBeenCalledWith('it1', 'power 1', 'item 2');
      expect(loggerServiceSpy.logError).toHaveBeenCalledWith('I failed');
      expect(sweetAlertServiceSpy.showError).toHaveBeenCalledTimes(1);
    }));

    it('should update item names to valid name', fakeAsync(() => {
      setupOnInit();

      treasureServiceSpy.validateItem.and.callFake(() => getFakeDelay(true));

      component.updateItemNames(component.treasureModel.itemTypeViewModels[1]);

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

      component.updateItemNames(component.treasureModel.itemTypeViewModels[1]);

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

    it('should not download empty treasure', () => {
      component.treasure = new Treasure(new Coin(), [], []);

      component.downloadTreasure();
      
      expect(treasureFormatterServiceSpy.formatTreasure).not.toHaveBeenCalled();
      expect(idServiceSpy.generate).not.toHaveBeenCalled();
      expect(fileSaverServiceSpy.save).not.toHaveBeenCalled();
    });

    it('should download item', () => {
      let item = new Item('my item', 'my item type');
      component.item = item;

      treasureFormatterServiceSpy.formatItem.and.returnValue('my formatted item');
      idServiceSpy.generate.and.returnValue('123');

      component.downloadTreasure();

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
    }

    function expectHasAttribute(selector: string, attribute: string, hasAttribute: boolean) {
      const compiled = fixture.nativeElement as HTMLElement;

      const element = compiled!.querySelector(selector);
      expect(element).toBeDefined();
      expect(element?.hasAttribute(attribute)).toBe(hasAttribute);
    }

    function expectGenerated(buttonSelector: string, validatingSelector: string) {
      expectHasAttribute(buttonSelector, 'disabled', false);
      expectHasAttribute(validatingSelector, 'hidden', true);
      expectHasAttribute('#treasureSection', 'hidden', false);
      expectHasAttribute('#generatingSection', 'hidden', true);
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
  
        const TreasureTypeOptions = treasureTab!.querySelectorAll('#treasureTypes > option');
        expect(TreasureTypeOptions).toBeDefined();
        expect(TreasureTypeOptions?.length).toEqual(4);
        expect(TreasureTypeOptions?.item(0).textContent).toEqual('Treasure');
        expect(TreasureTypeOptions?.item(1).textContent).toEqual('Coin');
        expect(TreasureTypeOptions?.item(2).textContent).toEqual('Goods');
        expect(TreasureTypeOptions?.item(3).textContent).toEqual('Items');
  
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
  
        expect(fixture.componentInstance.treasureType).toEqual(fixture.componentInstance.treasureModel.treasureTypes[5]);
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
    
      it(`should roll the default treasure`, async () => {
        clickButton('#treasureButton');
  
        fixture.detectChanges();
        
        expectGenerating('#treasureButton', '#treasureValidating');

        //run generate treasure
        await waitForService();
  
        expectGenerated('#treasureButton', '#treasureValidating');

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
  
        expectGenerated('#treasureButton', '#treasureValidating');

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
      it(`should render the expression tab`, () => {
        const compiled = fixture.nativeElement as HTMLElement;
  
        const expressionTab = compiled.querySelector('#expression');
        expect(expressionTab).toBeDefined();
  
        const expressionInput = expressionTab!.querySelector('#rollExpression') as HTMLInputElement;
        expect(expressionInput).toBeDefined();
        expect(expressionInput?.value).toEqual('4d6k3+2');
        expect(expressionInput?.getAttribute('type')).toEqual('text');
        expectHasAttribute('#rollExpression', 'required', true);
  
        expectHasAttribute('#expressionRollButton', 'disabled', false);
        expectHasAttribute('#expressionValidating', 'hidden', true);
      });
    
      it(`should show when validating an expression`, () => {
        const component = fixture.componentInstance;
        component.validating = true;
  
        fixture.detectChanges();

        expectValidating('#expressionRollButton', '#expressionValidating');
      });
    
      it(`should show that an expression is invalid - empty`, () => {
        setInput('#rollExpression', '');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.expression).toEqual('');
        expectInvalid('#expressionRollButton', '#expressionValidating');
      });
    
      it(`should show that an expression is invalid - invalid syntax`, async () => {
        setInput('#rollExpression', 'wrong+invalid');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.expression).toEqual('wrong+invalid');
        expectValidating('#expressionRollButton', '#expressionValidating');
  
        //run roll validation
        await waitForService();
  
        expectInvalid('#expressionRollButton', '#expressionValidating');
      });
    
      it(`should show that an expression is invalid - too high`, async () => {
        setInput('#rollExpression', '1000d100d2');
  
        fixture.detectChanges();

        expect(fixture.componentInstance.expression).toEqual('1000d100d2');
        expectValidating('#expressionRollButton', '#expressionValidating');
  
        //run roll validation
        await waitForService();
  
        expectInvalid('#expressionRollButton', '#expressionValidating');
      });
    
      it(`should show that an expression is valid`, async () => {
        setInput('#rollExpression', '100d100d2');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.expression).toEqual('100d100d2');
        expectValidating('#expressionRollButton', '#expressionValidating');
  
        //run roll validation
        await waitForService();
  
        expectValid('#expressionRollButton', '#expressionValidating');
      });

      it(`should show that an expression is invalid - validation fails`, async () => {
        setInput('#rollExpression', '3d6t1-x');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.expression).toEqual('3d6t1-x');
        expectValidating('#expressionRollButton', '#expressionValidating');
  
        //run roll validation
        await waitForService();

        expectInvalid('#expressionRollButton', '#expressionValidating');
      });
    
      it(`should show that an expression is valid - validation succeeds`, async () => {
        setInput('#rollExpression', '3d6t1-2');
  
        fixture.detectChanges();
  
        expect(fixture.componentInstance.expression).toEqual('3d6t1-2');
        expectValidating('#expressionRollButton', '#expressionValidating');
  
        //run roll validation
        await waitForService();
  
        expectValid('#expressionRollButton', '#expressionValidating');
      });
    
      it(`should show when rolling an expression`, () => {
        const component = fixture.componentInstance;
        component.rolling = true;
  
        fixture.detectChanges();

        expectGenerating('#expressionRollButton', '#expressionValidating');
      });
    
      it(`should roll the default expression`, async () => {
        clickButton('#expressionRollButton');
  
        fixture.detectChanges();
        
        expectGenerating('#expressionRollButton', '#expressionValidating');

        //run roll
        await waitForService();
  
        expectGenerated('#expressionRollButton', '#expressionValidating');

        const compiled = fixture.nativeElement as HTMLElement;
        const rollSection = compiled.querySelector('#rollSection');
        const rolledNumber = new Number(rollSection?.textContent);
        expect(rolledNumber).toBeGreaterThanOrEqual(5);
        expect(rolledNumber).toBeLessThanOrEqual(20);
      });
    
      it(`should roll a non-default expression`, async () => {
        setInput('#rollExpression', '3d6t1-2');
  
        fixture.detectChanges();

        expect(fixture.componentInstance.expression).toEqual('3d6t1-2');

        //run validation
        await waitForService();

        clickButton('#expressionRollButton');
  
        fixture.detectChanges();
        
        expectGenerating('#expressionRollButton', '#expressionValidating');

        //run roll
        await waitForService();
  
        expectGenerated('#expressionRollButton', '#expressionValidating');

        const compiled = fixture.nativeElement as HTMLElement;
        const rollSection = compiled.querySelector('#rollSection');
        const rolledNumber = new Number(rollSection?.textContent);
        expect(rolledNumber).toBeGreaterThanOrEqual(4);
        expect(rolledNumber).toBeLessThanOrEqual(16);
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
    
    it(`should format a large roll`, () => {
      fixture.componentInstance.roll = 9266;

      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;

      const rollSection = compiled.querySelector('#rollSection');
      expect(rollSection).toBeDefined();
      expect(rollSection?.hasAttribute('hidden')).toBeFalse();
      expect(rollSection?.textContent).toEqual('9,266');
    });
  });
});
