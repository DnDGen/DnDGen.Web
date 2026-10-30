import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TreasureService } from './treasure.service'
import { HttpClient, HttpParams } from '@angular/common/http';
import { of } from 'rxjs';
import '@angular/compiler';
import { TestBed } from '@angular/core/testing';
import { TreasureGenViewModel } from '../models/treasuregen-view-model.model';
import { ItemTypeViewModel } from '../models/item-type-view-model.model';
import { Treasure } from '../models/treasure.model';
import { Coin } from '../models/coin.model';
import { Good } from '../models/good.model';
import { Item } from '../models/item.model';
import { Weapon } from '../models/weapon.model';
import { Armor } from '../models/armor.model';
import { Magic } from '../models/magic.model';
import { TestHelper } from '../../test-helper';

describe('Treasure Service', () => {
    describe('unit', () => {
        let treasureService: TreasureService;
        let httpClientSpy: { get: ReturnType<typeof vi.fn> };
    
        beforeEach(() => {
            httpClientSpy = { get: vi.fn() };
    
            treasureService = new TreasureService(httpClientSpy as unknown as HttpClient);
        });

        it('gets the treasure view model', () => new Promise<void>(resolve => {
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
            httpClientSpy.get.mockReturnValue(of(model));
    
            treasureService.getViewModel().subscribe((viewmodel) => {
                expect(viewmodel).toBe(model);
                expect(httpClientSpy.get).toHaveBeenCalledWith('https://web.dndgen.com/api/v1/treasure/viewmodel');
                resolve();
            });
        }));
    
        it('gets treasure', () => new Promise<void>(resolve => {
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
            httpClientSpy.get.mockReturnValue(of(expected));
    
            treasureService.getTreasure('myTreasureType', 90210).subscribe((treasure) => {
                expect(treasure).toBe(expected);
                expect(httpClientSpy.get).toHaveBeenCalledWith('https://treasure.dndgen.com/api/v2/myTreasureType/level/90210/generate');
                resolve();
            });
        }));
    
        it('validates a valid treasure', () => new Promise<void>(resolve => {
            httpClientSpy.get.mockReturnValue(of(true));
    
            treasureService.validateTreasure('myTreasureType', 90210).subscribe((validity) => {
                expect(validity).toBe(true);
                expect(httpClientSpy.get).toHaveBeenCalledWith('https://treasure.dndgen.com/api/v2/myTreasureType/level/90210/validate');
                resolve();
            });
        }));
    
        it('validates an invalid treasure', () => new Promise<void>(resolve => {
            httpClientSpy.get.mockReturnValue(of(false));
    
            treasureService.validateTreasure('myTreasureType', 90210).subscribe((validity) => {
                expect(validity).toBe(false);
                expect(httpClientSpy.get).toHaveBeenCalledWith('https://treasure.dndgen.com/api/v2/myTreasureType/level/90210/validate');
                resolve();
            });
        }));
    
        it('gets an item', () => new Promise<void>(resolve => {
            const expected = new Item('my super item', 'my item type');
            httpClientSpy.get.mockReturnValue(of(expected));
    
            treasureService.getItem("myItemType", "super", '').subscribe((item) => {
                expect(item).toBe(expected);
                expect(httpClientSpy.get).toHaveBeenCalledWith('https://treasure.dndgen.com/api/v2/item/myItemType/power/super/generate');
                resolve();
            });
        }));
    
        it('gets an item with a name', () => new Promise<void>(resolve => {
            const expected = new Item('my super name', 'my item type');
            httpClientSpy.get.mockReturnValue(of(expected));
            let params = new HttpParams().set('name', 'my name');
    
            treasureService.getItem("myItemType", "super", 'my name').subscribe((item) => {
                expect(item).toBe(expected);
                expect(httpClientSpy.get).toHaveBeenCalledWith(
                    'https://treasure.dndgen.com/api/v2/item/myItemType/power/super/generate',
                    { params: params }
                );
                resolve();
            });
        }));
    
        it('BUG - gets armor', () => new Promise<void>(resolve => {
            const expected = new Armor('my super armor', 'armor', 'my armor description', [], [], [], new Magic(), 1, [], false, 'my size', 9266);
            httpClientSpy.get.mockReturnValue(of(expected));
    
            treasureService.getItem("armor", "super", '').subscribe((item) => {
                expect(item).toBe(expected);
                expect(httpClientSpy.get).toHaveBeenCalledWith('https://treasure.dndgen.com/api/v2/item/armor/power/super/generate');
                
                const armor = item as Armor;
                expect(armor.canBeUsedAsWeaponOrArmor).toBe(true);
                expect(armor.size).toEqual('my size');
                expect(armor.totalArmorBonus).toEqual(9266);

                resolve();
            });
        }));
    
        it('BUG - gets weapon', () => new Promise<void>(resolve => {
            const expected = new Weapon('my super weapon', 'weapon', 'my weapon description', [], [], [], new Magic(), 1, [], false, 'my size', '', 'my damage summary');
            httpClientSpy.get.mockReturnValue(of(expected));
    
            treasureService.getItem("weapon", "super", '').subscribe((item) => {
                expect(item).toBe(expected);
                expect(httpClientSpy.get).toHaveBeenCalledWith('https://treasure.dndgen.com/api/v2/item/weapon/power/super/generate');
                
                const weapon = item as Weapon;
                expect(weapon.canBeUsedAsWeaponOrArmor).toBe(true);
                expect(weapon.size).toEqual('my size');
                expect(weapon.damageSummary).toEqual('my damage summary');

                resolve();
            });
        }));
    
        it('validates a valid item', () => new Promise<void>(resolve => {
            httpClientSpy.get.mockReturnValue(of(true));
    
            treasureService.validateItem("myItemType", "super", '').subscribe((validity) => {
                expect(validity).toBe(true);
                expect(httpClientSpy.get).toHaveBeenCalledWith('https://treasure.dndgen.com/api/v2/item/myItemType/power/super/validate');
                resolve();
            });
        }));
    
        it('validates a valid item with name', () => new Promise<void>(resolve => {
            httpClientSpy.get.mockReturnValue(of(true));
            let params = new HttpParams().set('name', 'my name');
    
            treasureService.validateItem("myItemType", "super", 'my name').subscribe((validity) => {
                expect(validity).toBe(true);
                expect(httpClientSpy.get).toHaveBeenCalledWith(
                    'https://treasure.dndgen.com/api/v2/item/myItemType/power/super/validate',
                    { params: params });
                resolve();
            });
        }));
    
        it('validates an invalid item', () => new Promise<void>(resolve => {
            httpClientSpy.get.mockReturnValue(of(false));
    
            treasureService.validateItem("myItemType", "super", '').subscribe((validity) => {
                expect(validity).toBe(false);
                expect(httpClientSpy.get).toHaveBeenCalledWith('https://treasure.dndgen.com/api/v2/item/myItemType/power/super/validate');
                resolve();
            });
        }));
    
        it('validates an invalid item with name', () => new Promise<void>(resolve => {
            httpClientSpy.get.mockReturnValue(of(false));
            let params = new HttpParams().set('name', 'my name');
    
            treasureService.validateItem("myItemType", "super", 'my name').subscribe((validity) => {
                expect(validity).toBe(false);
                expect(httpClientSpy.get).toHaveBeenCalledWith(
                    'https://treasure.dndgen.com/api/v2/item/myItemType/power/super/validate',
                    { params: params });
                resolve();
            });
        }));
    });
});