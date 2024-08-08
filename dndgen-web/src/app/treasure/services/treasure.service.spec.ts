import { TreasureService } from './treasure.service'
import { HttpClient, HttpParams } from '@angular/common/http';
import { of } from 'rxjs';
import '@angular/compiler';
import { TestBed } from '@angular/core/testing';
import { AppModule } from '../../app.module';
import { TreasureGenViewModel } from '../models/treasuregenViewModel.model';
import { ItemTypeViewModel } from '../models/itemTypeViewModel.model';
import { Treasure } from '../models/treasure.model';
import { Coin } from '../models/coin.model';
import { Good } from '../models/good.model';
import { Item } from '../models/item.model';
import { Weapon } from '../models/weapon.model';
import { Armor } from '../models/armor.model';

describe('Treasure Service', () => {
    describe('unit', () => {
        let treasureService: TreasureService;
        let httpClientSpy: jasmine.SpyObj<HttpClient>;
    
        beforeEach(() => {
            httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    
            treasureService = new TreasureService(httpClientSpy);
        });

        it('gets the treasure view model', done => {
            let model = new TreasureGenViewModel(
                ['treasure type 1', 'treasure type 2'],
                9266,
                [
                    new ItemTypeViewModel('myItemType', 'My Item Type'),
                    new ItemTypeViewModel('myOtherItemType', 'My Other Item Type'),
                ],
                ['power 1', 'power 2'],
                new Map<string, string[]>([
                    ["myItemType", ['item 1', 'item 2']],
                    ["myOtherItemType", ['item 3', 'item 4']]
                ])
            );
            httpClientSpy.get.and.returnValue(of(model));
    
            treasureService.getViewModel().subscribe((viewmodel) => {
                expect(viewmodel).toBe(model);
                expect(httpClientSpy.get).toHaveBeenCalledWith('https://web.dndgen.com/api/v1/treasure/viewmodel');
                done();
            });
        });
    
        it('gets treasure', done => {
            const expected = new Treasure(
                new Coin('munny', 42),
                [
                    new Good('good 1', 600),
                    new Good('good 2', 1337),
                ],
                [
                    new Item('item 1', 'item type 1'),
                    new Item('item 2', 'item type 2'),
                ],
                true
            );
            httpClientSpy.get.and.returnValue(of(expected));
    
            treasureService.getTreasure('myTreasureType', 90210).subscribe((treasure) => {
                expect(treasure).toBe(expected);
                expect(httpClientSpy.get).toHaveBeenCalledWith('https://treasure.dndgen.com/api/v1/myTreasureType/level/90210/generate');
                done();
            });
        });
    
        it('validates a valid treasure', done => {
            httpClientSpy.get.and.returnValue(of(true));
    
            treasureService.validateTreasure('myTreasureType', 90210).subscribe((validity) => {
                expect(validity).toBe(true);
                expect(httpClientSpy.get).toHaveBeenCalledWith('https://treasure.dndgen.com/api/v1/myTreasureType/level/90210/validate');
                done();
            });
        });
    
        it('validates an invalid treasure', done => {
            httpClientSpy.get.and.returnValue(of(false));
    
            treasureService.validateTreasure('myTreasureType', 90210).subscribe((validity) => {
                expect(validity).toBe(false);
                expect(httpClientSpy.get).toHaveBeenCalledWith('https://treasure.dndgen.com/api/v1/myTreasureType/level/90210/validate');
                done();
            });
        });
    
        it('gets an item', done => {
            const expected = new Item('my super item', 'my item type');
            httpClientSpy.get.and.returnValue(of(expected));
    
            treasureService.getItem("myItemType", "super", null).subscribe((item) => {
                expect(item).toBe(expected);
                expect(httpClientSpy.get).toHaveBeenCalledWith('https://treasure.dndgen.com/api/v1/item/myItemType/power/super/generate');
                done();
            });
        });
    
        it('gets an item with a name', done => {
            const expected = new Item('my super name', 'my item type');
            httpClientSpy.get.and.returnValue(of(expected));
            let params = new HttpParams().set('name', 'my name');
    
            treasureService.getItem("myItemType", "super", 'my name').subscribe((item) => {
                expect(item).toBe(expected);
                expect(httpClientSpy.get).toHaveBeenCalledWith(
                    'https://treasure.dndgen.com/api/v1/item/myItemType/power/super/generate',
                    { params: params }
                );
                done();
            });
        });
    
        it('validates a valid item', done => {
            httpClientSpy.get.and.returnValue(of(true));
    
            treasureService.validateItem("myItemType", "super", null).subscribe((validity) => {
                expect(validity).toBe(true);
                expect(httpClientSpy.get).toHaveBeenCalledWith('https://treasure.dndgen.com/api/v1/item/myItemType/power/super/validate');
                done();
            });
        });
    
        it('validates a valid item with name', done => {
            httpClientSpy.get.and.returnValue(of(true));
            let params = new HttpParams().set('name', 'my name');
    
            treasureService.validateItem("myItemType", "super", 'my name').subscribe((validity) => {
                expect(validity).toBe(true);
                expect(httpClientSpy.get).toHaveBeenCalledWith(
                    'https://treasure.dndgen.com/api/v1/item/myItemType/power/super/validate',
                    { params: params });
                done();
            });
        });
    
        it('validates an invalid item', done => {
            httpClientSpy.get.and.returnValue(of(false));
    
            treasureService.validateItem("myItemType", "super", null).subscribe((validity) => {
                expect(validity).toBeFalse();
                expect(httpClientSpy.get).toHaveBeenCalledWith('https://treasure.dndgen.com/api/v1/item/myItemType/power/super/validate');
                done();
            });
        });
    
        it('validates an invalid item with name', done => {
            httpClientSpy.get.and.returnValue(of(false));
            let params = new HttpParams().set('name', 'my name');
    
            treasureService.validateItem("myItemType", "super", 'my name').subscribe((validity) => {
                expect(validity).toBeTrue();
                expect(httpClientSpy.get).toHaveBeenCalledWith(
                    'https://treasure.dndgen.com/api/v1/item/myItemType/power/super/validate',
                    { params: params });
                done();
            });
        });
    });
    
    describe('integration', () => {
        let treasureService: TreasureService;
    
        beforeEach(async () => {
            await TestBed.configureTestingModule({
              imports: [
                AppModule
              ],
            }).compileComponents();
        
            treasureService = TestBed.inject(TreasureService);
        });

        it('gets the treasure view model', done => {
            treasureService.getViewModel().subscribe((viewmodel) => {
                expect(viewmodel).toBeDefined();
                expect(viewmodel.treasureTypes.length).toBe(4);
                expect(viewmodel.powers.length).toBe(4);
                expect(viewmodel.maxTreasureLevel).toBe(30);
                expect(viewmodel.itemTypeViewModels.length).toBe(11);
                expect(viewmodel.itemNames.size).toBe(11);

                for(var i = 0; i < viewmodel.itemTypeViewModels.length; i++) {
                    const itemType = viewmodel.itemTypeViewModels[i].itemType;
                    const names = viewmodel.itemNames.get(itemType);
                    expect(names).toBeDefined();
                    expect(names?.length).toBeGreaterThanOrEqual(1);
                }

                done();
            });
        });
    
        it('gets treasure', done => {
            treasureService.getTreasure('treasure', 21).subscribe((treasure) => {
                expect(treasure).toBeDefined();
                expect(treasure).not.toBeNull();
                expect(treasure.isAny).toBeTrue();
                expect(treasure.items.length).toBeGreaterThanOrEqual(1);
                done();
            });
        });
    
        it('validates a valid treasure', done => {
            treasureService.validateTreasure('coin', 9).subscribe((validity) => {
                expect(validity).toBe(true);
                done();
            });
        });
    
        it('validates an invalid treasure - treasure type', done => {
            treasureService.validateTreasure('stuff', 2).subscribe((validity) => {
                expect(validity).toBe(false);
                done();
            });
        });
    
        it('validates an invalid treasure - level', done => {
            treasureService.validateTreasure('treasure', 101).subscribe((validity) => {
                expect(validity).toBe(false);
                done();
            });
        });
    
        it('gets an item', done => {
            treasureService.getItem('ring', 'minor', null).subscribe((item) => {
                expect(item).toBeDefined();
                expect(item).not.toBeNull();
                expect(item.name).toBeTruthy();

                done();
            });
        });
    
        it('gets an item with name', done => {
            treasureService.getItem('wondrousitem', 'medium', 'bracers of armor').subscribe((item) => {
                expect(item).toBeDefined();
                expect(item).not.toBeNull();
                expect(item.name).toBeTruthy();
                expect(item.name).toEqual('Bracers of Armor');
                
                done();
            });
        });
    
        it('BUG - gets armor', done => {
            treasureService.getItem('armor', 'major', null).subscribe((item) => {
                expect(item).toBeDefined();
                expect(item).not.toBeNull();
                expect(item.name).toBeTruthy();

                const armor = item as Armor;
                expect(armor.canBeUsedAsWeaponOrArmor).toBeTruthy();
                expect(armor.size).toBeTruthy();
                expect(armor.totalArmorBonus).toBeGreaterThanOrEqual(1);

                done();
            });
        });
    
        it('BUG - gets weapon', done => {
            treasureService.getItem('weapon', 'mundane', null).subscribe((item) => {
                expect(item).toBeDefined();
                expect(item).not.toBeNull();
                expect(item.name).toBeTruthy();

                const weapon = item as Weapon;
                expect(weapon.canBeUsedAsWeaponOrArmor).toBeTruthy();
                expect(weapon.size).toBeTruthy();
                expect(weapon.damage).toBeTruthy();

                done();
            });
        });
    
        it('validates a valid item', done => {
            treasureService.validateItem('potion', 'medium', null).subscribe((validity) => {
                expect(validity).toBe(true);
                done();
            });
        });
    
        it('validates a valid item with name', done => {
            treasureService.validateItem('tool', 'mundane', 'spyglass').subscribe((validity) => {
                expect(validity).toBe(true);
                done();
            });
        });
    
        it('validates an invalid item - item type', done => {
            treasureService.validateItem('vehicle', 'minor', null).subscribe((validity) => {
                expect(validity).toBe(false);
                done();
            });
        });
    
        it('validates an invalid item - power', done => {
            treasureService.validateItem('weapon', 'super', null).subscribe((validity) => {
                expect(validity).toBe(false);
                done();
            });
        });
    
        it('validates an invalid item - name', done => {
            treasureService.validateItem('tool', 'mundane', 'hammer').subscribe((validity) => {
                expect(validity).toBe(false);
                done();
            });
        });
    
        it('validates an invalid item - bad combo', done => {
            treasureService.validateItem('alchemicalitem', 'minor', null).subscribe((validity) => {
                expect(validity).toBe(false);
                done();
            });
        });
    
        it('validates an invalid item - bad name combo', done => {
            treasureService.validateItem('alchemicalitem', 'mundane', 'longsword').subscribe((validity) => {
                expect(validity).toBe(false);
                done();
            });
        });
    });
});