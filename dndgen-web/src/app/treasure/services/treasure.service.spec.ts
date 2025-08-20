import { TreasureService } from './treasure.service'
import { HttpClient, HttpParams } from '@angular/common/http';
import { of } from 'rxjs';
import '@angular/compiler';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { TreasureGenViewModel } from '../models/treasuregenViewModel.model';
import { ItemTypeViewModel } from '../models/itemTypeViewModel.model';
import { Treasure } from '../models/treasure.model';
import { Coin } from '../models/coin.model';
import { Good } from '../models/good.model';
import { Item } from '../models/item.model';
import { Weapon } from '../models/weapon.model';
import { Armor } from '../models/armor.model';
import { Magic } from '../models/magic.model';
import { TestHelper } from '../../testHelper.spec';

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
                {
                    "myItemType": ['item 1', 'item 2'],
                    "myOtherItemType": ['item 3', 'item 4']
                }
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
                true,
                new Coin('munny', 42),
                [
                    new Good('good 1', 600),
                    new Good('good 2', 1337),
                ],
                [
                    new Item('item 1', 'item type 1'),
                    new Item('item 2', 'item type 2'),
                ]
            );
            httpClientSpy.get.and.returnValue(of(expected));
    
            treasureService.getTreasure('myTreasureType', 90210).subscribe((treasure) => {
                expect(treasure).toBe(expected);
                expect(httpClientSpy.get).toHaveBeenCalledWith('https://treasure.dndgen.com/api/v2/myTreasureType/level/90210/generate');
                done();
            });
        });
    
        it('validates a valid treasure', done => {
            httpClientSpy.get.and.returnValue(of(true));
    
            treasureService.validateTreasure('myTreasureType', 90210).subscribe((validity) => {
                expect(validity).toBe(true);
                expect(httpClientSpy.get).toHaveBeenCalledWith('https://treasure.dndgen.com/api/v2/myTreasureType/level/90210/validate');
                done();
            });
        });
    
        it('validates an invalid treasure', done => {
            httpClientSpy.get.and.returnValue(of(false));
    
            treasureService.validateTreasure('myTreasureType', 90210).subscribe((validity) => {
                expect(validity).toBe(false);
                expect(httpClientSpy.get).toHaveBeenCalledWith('https://treasure.dndgen.com/api/v2/myTreasureType/level/90210/validate');
                done();
            });
        });
    
        it('gets an item', done => {
            const expected = new Item('my super item', 'my item type');
            httpClientSpy.get.and.returnValue(of(expected));
    
            treasureService.getItem("myItemType", "super", '').subscribe((item) => {
                expect(item).toBe(expected);
                expect(httpClientSpy.get).toHaveBeenCalledWith('https://treasure.dndgen.com/api/v2/item/myItemType/power/super/generate');
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
                    'https://treasure.dndgen.com/api/v2/item/myItemType/power/super/generate',
                    { params: params }
                );
                done();
            });
        });
    
        it('BUG - gets armor', done => {
            const expected = new Armor('my super armor', 'armor', 'my armor description', [], [], [], new Magic(), 1, [], false, 'my size', 9266);
            httpClientSpy.get.and.returnValue(of(expected));
    
            treasureService.getItem("armor", "super", '').subscribe((item) => {
                expect(item).toBe(expected);
                expect(httpClientSpy.get).toHaveBeenCalledWith('https://treasure.dndgen.com/api/v2/item/armor/power/super/generate');
                
                const armor = item as Armor;
                expect(armor.canBeUsedAsWeaponOrArmor).toBeTruthy();
                expect(armor.size).toEqual('my size');
                expect(armor.totalArmorBonus).toEqual(9266);

                done();
            });
        });
    
        it('BUG - gets weapon', done => {
            const expected = new Weapon('my super weapon', 'weapon', 'my weapon description', [], [], [], new Magic(), 1, [], false, 'my size', '', 'my damage summary');
            httpClientSpy.get.and.returnValue(of(expected));
    
            treasureService.getItem("weapon", "super", '').subscribe((item) => {
                expect(item).toBe(expected);
                expect(httpClientSpy.get).toHaveBeenCalledWith('https://treasure.dndgen.com/api/v2/item/weapon/power/super/generate');
                
                const weapon = item as Weapon;
                expect(weapon.canBeUsedAsWeaponOrArmor).toBeTruthy();
                expect(weapon.size).toEqual('my size');
                expect(weapon.damageSummary).toEqual('my damage summary');

                done();
            });
        });
    
        it('validates a valid item', done => {
            httpClientSpy.get.and.returnValue(of(true));
    
            treasureService.validateItem("myItemType", "super", '').subscribe((validity) => {
                expect(validity).toBe(true);
                expect(httpClientSpy.get).toHaveBeenCalledWith('https://treasure.dndgen.com/api/v2/item/myItemType/power/super/validate');
                done();
            });
        });
    
        it('validates a valid item with name', done => {
            httpClientSpy.get.and.returnValue(of(true));
            let params = new HttpParams().set('name', 'my name');
    
            treasureService.validateItem("myItemType", "super", 'my name').subscribe((validity) => {
                expect(validity).toBe(true);
                expect(httpClientSpy.get).toHaveBeenCalledWith(
                    'https://treasure.dndgen.com/api/v2/item/myItemType/power/super/validate',
                    { params: params });
                done();
            });
        });
    
        it('validates an invalid item', done => {
            httpClientSpy.get.and.returnValue(of(false));
    
            treasureService.validateItem("myItemType", "super", '').subscribe((validity) => {
                expect(validity).toBeFalse();
                expect(httpClientSpy.get).toHaveBeenCalledWith('https://treasure.dndgen.com/api/v2/item/myItemType/power/super/validate');
                done();
            });
        });
    
        it('validates an invalid item with name', done => {
            httpClientSpy.get.and.returnValue(of(false));
            let params = new HttpParams().set('name', 'my name');
    
            treasureService.validateItem("myItemType", "super", 'my name').subscribe((validity) => {
                expect(validity).toBeFalse();
                expect(httpClientSpy.get).toHaveBeenCalledWith(
                    'https://treasure.dndgen.com/api/v2/item/myItemType/power/super/validate',
                    { params: params });
                done();
            });
        });
    });
    
    describe('integration', () => {
        let treasureService: TreasureService;
    
        beforeEach(async () => {
            await TestHelper.configureTestBed();
        
            treasureService = TestBed.inject(TreasureService);
        });

        it('gets the treasure view model', waitForAsync(() => {
            treasureService.getViewModel().subscribe((viewmodel) => {
                expect(viewmodel).toBeTruthy();
                expect(viewmodel.treasureTypes.length).toBe(4);
                expect(viewmodel.powers.length).toBe(4);
                expect(viewmodel.maxTreasureLevel).toBe(100);
                expect(viewmodel.itemTypeViewModels.length).toBe(11);
                expect(viewmodel.itemNames).toBeTruthy();
                expect(Object.keys(viewmodel.itemNames).length).toBe(11);
                expect(Object.keys(viewmodel.itemNames)).toEqual([
                    'AlchemicalItem',
                    'Armor',
                    'Potion',
                    'Ring',
                    'Rod',
                    'Scroll',
                    'Staff',
                    'Tool',
                    'Wand',
                    'Weapon',
                    'WondrousItem',
                ]);

                for(var i = 0; i < viewmodel.itemTypeViewModels.length; i++) {
                    const itemType = viewmodel.itemTypeViewModels[i].itemType;
                    const names = viewmodel.itemNames[itemType];
                    expect(names).toBeDefined();
                    expect(names?.length).toBeGreaterThanOrEqual(1);
                }
            });
        }));
    
        it('gets treasure', waitForAsync(() => {
            treasureService.getTreasure('treasure', 21).subscribe((treasure) => {
                expect(treasure).toBeTruthy();
                expect(treasure.isAny).toBeTrue();
                expect(treasure.items.length).toBeGreaterThanOrEqual(1);
            });
        }));
    
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
            treasureService.validateTreasure('treasure', 0).subscribe((validity) => {
                expect(validity).toBe(false);
                done();
            });
        });
    
        it('gets an item', done => {
            treasureService.getItem('ring', 'minor', '').subscribe((item) => {
                expect(item).toBeTruthy();
                expect(item.name).toBeTruthy();
                expect(item.canBeUsedAsWeaponOrArmor).toBeFalse();

                done();
            });
        });
    
        it('gets an item with name', done => {
            treasureService.getItem('wondrousitem', 'medium', 'bracers of armor').subscribe((item) => {
                expect(item).toBeTruthy();
                expect(item.name).toEqual('Bracers of Armor');
                expect(item.canBeUsedAsWeaponOrArmor).toBeFalse();
                
                done();
            });
        });
    
        it('BUG - gets an item summary', done => {
            treasureService.getItem('wand', 'major', '').subscribe((item) => {
                expect(item).toBeTruthy();
                expect(item.summary).toBeTruthy();
                expect(item.canBeUsedAsWeaponOrArmor).toBeFalse();
                
                done();
            });
        });
    
        it('BUG - gets armor', done => {
            treasureService.getItem('armor', 'major', '').subscribe((item) => {
                expect(item).toBeDefined();
                expect(item).not.toBeNull();
                expect(item.name).toBeTruthy();
                expect(item.itemType).toBe('Armor');
                expect(item.canBeUsedAsWeaponOrArmor).toBeTrue();

                const armor = item as Armor;
                expect(armor.size).toBeTruthy();
                //Can't assert positive, because some cursed armors will be negative
                expect(armor.totalArmorBonus).not.toBe(0);

                done();
            });
        });
    
        it('BUG - gets weapon', done => {
            treasureService.getItem('weapon', 'mundane', '').subscribe((item) => {
                expect(item).toBeDefined();
                expect(item).not.toBeNull();
                expect(item.name).toBeTruthy();
                expect(item.itemType).toBe('Weapon');
                expect(item.canBeUsedAsWeaponOrArmor).toBeTrue();

                const weapon = item as Weapon;
                expect(weapon.canBeUsedAsWeaponOrArmor).toBeTruthy();
                expect(weapon.size).toBeTruthy();
                expect(weapon.damageSummary).toBeTruthy();
                expect(weapon.criticalDamageSummary).toBeTruthy();
                expect(weapon.threatRangeSummary).toBeTruthy();

                done();
            });
        });
    
        it('BUG - gets weapon with summaries', done => {
            treasureService.getItem('weapon', 'mundane', 'longsword').subscribe((item) => {
                expect(item).toBeDefined();
                expect(item).not.toBeNull();
                expect(item.name).toBeTruthy();
                expect(item.itemType).toBe('Weapon');
                expect(item.canBeUsedAsWeaponOrArmor).toBeTrue();

                const weapon = item as Weapon;
                expect(weapon.canBeUsedAsWeaponOrArmor).toBeTruthy();
                expect(weapon.size).toBeTruthy();
                expect(weapon.damageSummary).toBeTruthy();
                expect(weapon.criticalDamageSummary).toBeTruthy();
                expect(weapon.secondaryDamageSummary).toBeFalsy();
                expect(weapon.secondaryCriticalDamageSummary).toBeFalsy();
                expect(weapon.threatRangeSummary).toBeTruthy();

                done();
            });
        });
    
        it('BUG - gets double weapon with summaries', done => {
            treasureService.getItem('weapon', 'mundane', 'two-bladed sword').subscribe((item) => {
                expect(item).toBeDefined();
                expect(item).not.toBeNull();
                expect(item.name).toBeTruthy();
                expect(item.itemType).toBe('Weapon');
                expect(item.canBeUsedAsWeaponOrArmor).toBeTrue();

                const weapon = item as Weapon;
                expect(weapon.canBeUsedAsWeaponOrArmor).toBeTruthy();
                expect(weapon.size).toBeTruthy();
                expect(weapon.damageSummary).toBeTruthy();
                expect(weapon.criticalDamageSummary).toBeTruthy();
                expect(weapon.secondaryDamageSummary).toBeTruthy();
                expect(weapon.secondaryCriticalDamageSummary).toBeTruthy();
                expect(weapon.threatRangeSummary).toBeTruthy();

                done();
            });
        });
    
        it('BUG - gets rod', done => {
            treasureService.getItem('rod', 'major', '').subscribe((item) => {
                expect(item).toBeDefined();
                expect(item).not.toBeNull();
                expect(item.name).toBeTruthy();
                expect(item.itemType).toBe('Rod');

                done();
            });
        });
    
        it('BUG - gets rod without weapon properties', done => {
            treasureService.getItem('rod', 'major', 'immovable rod').subscribe((item) => {
                expect(item).toBeDefined();
                expect(item).not.toBeNull();
                expect(item.name).toBeTruthy();
                expect(item.itemType).toBe('Rod');
                expect(item.canBeUsedAsWeaponOrArmor).toBeFalse();

                done();
            });
        });
    
        it('BUG - gets rod with weapon properties', done => {
            treasureService.getItem('rod', 'major', 'rod of alertness').subscribe((item) => {
                expect(item).toBeDefined();
                expect(item).not.toBeNull();
                expect(item.itemType).toBe('Rod');
                expect(item.canBeUsedAsWeaponOrArmor).toBeTrue();

                const weapon = item as Weapon;
                expect(weapon.canBeUsedAsWeaponOrArmor).toBeTruthy();
                expect(weapon.size).toBeTruthy();
                expect(weapon.damageSummary).toBeTruthy();
                expect(weapon.criticalDamageSummary).toBeTruthy();
                expect(weapon.threatRangeSummary).toBeTruthy();

                done();
            });
        });
    
        it('BUG - gets staff', done => {
            treasureService.getItem('staff', 'major', '').subscribe((item) => {
                expect(item).toBeDefined();
                expect(item).not.toBeNull();
                expect(item.name).toBeTruthy();
                expect(item.itemType).toBe('Staff');
                expect(item.canBeUsedAsWeaponOrArmor).toBeFalse();

                done();
            });
        });
    
        it('BUG - gets staff with weapon properties', done => {
            treasureService.getItem('staff', 'major', 'staff of power').subscribe((item) => {
                expect(item).toBeDefined();
                expect(item).not.toBeNull();
                expect(item.itemType).toBe('Staff');
                expect(item.canBeUsedAsWeaponOrArmor).toBeTrue();

                const weapon = item as Weapon;
                expect(weapon.canBeUsedAsWeaponOrArmor).toBeTruthy();
                expect(weapon.size).toBeTruthy();
                expect(weapon.damageSummary).toBeTruthy();
                expect(weapon.criticalDamageSummary).toBeTruthy();
                expect(weapon.threatRangeSummary).toBeTruthy();

                done();
            });
        });
    
        it('validates a valid item', done => {
            treasureService.validateItem('potion', 'medium', '').subscribe((validity) => {
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
            treasureService.validateItem('vehicle', 'minor', '').subscribe((validity) => {
                expect(validity).toBe(false);
                done();
            });
        });
    
        it('validates an invalid item - power', done => {
            treasureService.validateItem('weapon', 'super', '').subscribe((validity) => {
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
            treasureService.validateItem('alchemicalitem', 'minor', '').subscribe((validity) => {
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