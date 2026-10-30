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
    describe('integration', () => {
        let treasureService: TreasureService;
    
        beforeEach(async () => {
            await TestHelper.configureTestBed();
        
            treasureService = TestBed.inject(TreasureService);
        });

        it('gets the treasure view model', () => new Promise<void>(resolve => {
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

                resolve();
            });
        }));
    
        it('gets treasure', () => new Promise<void>(resolve => {
            treasureService.getTreasure('treasure', 21).subscribe((treasure) => {
                expect(treasure).toBeTruthy();
                expect(treasure.isAny).toBe(true);
                expect(treasure.items.length).toBeGreaterThanOrEqual(1);
                resolve();
            });
        }));
    
        it('validates a valid treasure', () => new Promise<void>(resolve => {
            treasureService.validateTreasure('coin', 9).subscribe((validity) => {
                expect(validity).toBe(true);
                resolve();
            });
        }));
    
        it('validates an invalid treasure - treasure type', () => new Promise<void>(resolve => {
            treasureService.validateTreasure('stuff', 2).subscribe((validity) => {
                expect(validity).toBe(false);
                resolve();
            });
        }));
    
        it('validates an invalid treasure - level', () => new Promise<void>(resolve => {
            treasureService.validateTreasure('treasure', 0).subscribe((validity) => {
                expect(validity).toBe(false);
                resolve();
            });
        }));
    
        it('gets an item', () => new Promise<void>(resolve => {
            treasureService.getItem('ring', 'minor', '').subscribe((item) => {
                expect(item).toBeTruthy();
                expect(item.name).toBeTruthy();
                expect(item.canBeUsedAsWeaponOrArmor).toBe(false);

                resolve();
            });
        }));
    
        it('gets an item with name', () => new Promise<void>(resolve => {
            treasureService.getItem('wondrousitem', 'medium', 'bracers of armor').subscribe((item) => {
                expect(item).toBeTruthy();
                expect(item.name).toEqual('Bracers of Armor');
                expect(item.canBeUsedAsWeaponOrArmor).toBe(false);
                
                resolve();
            });
        }));
    
        it('BUG - gets an item summary', () => new Promise<void>(resolve => {
            treasureService.getItem('wand', 'major', '').subscribe((item) => {
                expect(item).toBeTruthy();
                expect(item.summary).toBeTruthy();
                expect(item.canBeUsedAsWeaponOrArmor).toBe(false);
                
                resolve();
            });
        }));
    
        it('BUG - gets armor', () => new Promise<void>(resolve => {
            treasureService.getItem('armor', 'major', '').subscribe((item) => {
                expect(item).toBeDefined();
                expect(item).not.toBeNull();
                expect(item.name).toBeTruthy();
                expect(item.itemType).toBe('Armor');
                expect(item.canBeUsedAsWeaponOrArmor).toBe(true);

                const armor = item as Armor;
                expect(armor.size).toBeTruthy();
                //Can't assert positive, because some cursed armors will be negative
                expect(armor.totalArmorBonus).not.toBe(0);

                resolve();
            });
        }));
    
        it('BUG - gets weapon', () => new Promise<void>(resolve => {
            treasureService.getItem('weapon', 'mundane', '').subscribe((item) => {
                expect(item).toBeDefined();
                expect(item).not.toBeNull();
                expect(item.name).toBeTruthy();
                expect(item.itemType).toBe('Weapon');
                expect(item.canBeUsedAsWeaponOrArmor).toBe(true);

                const weapon = item as Weapon;
                expect(weapon.canBeUsedAsWeaponOrArmor).toBe(true);
                expect(weapon.size).toBeTruthy();
                expect(weapon.damageSummary).toBeTruthy();
                expect(weapon.criticalDamageSummary).toBeTruthy();
                expect(weapon.threatRangeSummary).toBeTruthy();

                resolve();
            });
        }));
    
        it('BUG - gets weapon with summaries', () => new Promise<void>(resolve => {
            treasureService.getItem('weapon', 'mundane', 'longsword').subscribe((item) => {
                expect(item).toBeDefined();
                expect(item).not.toBeNull();
                expect(item.name).toBeTruthy();
                expect(item.itemType).toBe('Weapon');
                expect(item.canBeUsedAsWeaponOrArmor).toBe(true);

                const weapon = item as Weapon;
                expect(weapon.canBeUsedAsWeaponOrArmor).toBe(true);
                expect(weapon.size).toBeTruthy();
                expect(weapon.damageSummary).toBeTruthy();
                expect(weapon.criticalDamageSummary).toBeTruthy();
                expect(weapon.secondaryDamageSummary).toBeFalsy();
                expect(weapon.secondaryCriticalDamageSummary).toBeFalsy();
                expect(weapon.threatRangeSummary).toBeTruthy();

                resolve();
            });
        }));
    
        it('BUG - gets double weapon with summaries', () => new Promise<void>(resolve => {
            treasureService.getItem('weapon', 'mundane', 'two-bladed sword').subscribe((item) => {
                expect(item).toBeDefined();
                expect(item).not.toBeNull();
                expect(item.name).toBeTruthy();
                expect(item.itemType).toBe('Weapon');
                expect(item.canBeUsedAsWeaponOrArmor).toBe(true);

                const weapon = item as Weapon;
                expect(weapon.canBeUsedAsWeaponOrArmor).toBe(true);
                expect(weapon.size).toBeTruthy();
                expect(weapon.damageSummary).toBeTruthy();
                expect(weapon.criticalDamageSummary).toBeTruthy();
                expect(weapon.secondaryDamageSummary).toBeTruthy();
                expect(weapon.secondaryCriticalDamageSummary).toBeTruthy();
                expect(weapon.threatRangeSummary).toBeTruthy();

                resolve();
            });
        }));
    
        it('BUG - gets rod', () => new Promise<void>(resolve => {
            treasureService.getItem('rod', 'major', '').subscribe((item) => {
                expect(item).toBeDefined();
                expect(item).not.toBeNull();
                expect(item.name).toBeTruthy();
                expect(item.itemType).toBe('Rod');

                resolve();
            });
        }));
    
        it('BUG - gets rod without weapon properties', () => new Promise<void>(resolve => {
            treasureService.getItem('rod', 'major', 'immovable rod').subscribe((item) => {
                expect(item).toBeDefined();
                expect(item).not.toBeNull();
                expect(item.name).toBeTruthy();
                expect(item.itemType).toBe('Rod');
                expect(item.canBeUsedAsWeaponOrArmor).toBe(false);

                resolve();
            });
        }));
    
        it('BUG - gets rod with weapon properties', () => new Promise<void>(resolve => {
            treasureService.getItem('rod', 'major', 'rod of alertness').subscribe((item) => {
                expect(item).toBeDefined();
                expect(item).not.toBeNull();
                expect(item.itemType).toBe('Rod');
                expect(item.canBeUsedAsWeaponOrArmor).toBe(true);

                const weapon = item as Weapon;
                expect(weapon.canBeUsedAsWeaponOrArmor).toBe(true);
                expect(weapon.size).toBeTruthy();
                expect(weapon.damageSummary).toBeTruthy();
                expect(weapon.criticalDamageSummary).toBeTruthy();
                expect(weapon.threatRangeSummary).toBeTruthy();

                resolve();
            });
        }));
    
        it('BUG - gets staff without weapon properties', () => new Promise<void>(resolve => {
            treasureService.getItem('staff', 'major', 'staff of defense').subscribe((item) => {
                expect(item).toBeDefined();
                expect(item).not.toBeNull();
                expect(item.name).toBeTruthy();
                expect(item.itemType).toBe('Staff');
                expect(item.canBeUsedAsWeaponOrArmor).toBe(false);

                resolve();
            });
        }));

        it('BUG - gets staff with weapon properties', () => new Promise<void>(resolve => {
            treasureService.getItem('staff', 'major', 'staff of power').subscribe((item) => {
                expect(item).toBeDefined();
                expect(item).not.toBeNull();
                expect(item.itemType).toBe('Staff');
                expect(item.canBeUsedAsWeaponOrArmor).toBe(true);

                const weapon = item as Weapon;
                expect(weapon.canBeUsedAsWeaponOrArmor).toBe(true);
                expect(weapon.size).toBeTruthy();
                expect(weapon.damageSummary).toBeTruthy();
                expect(weapon.criticalDamageSummary).toBeTruthy();
                expect(weapon.threatRangeSummary).toBeTruthy();

                resolve();
            });
        }));
    
        it('validates a valid item', () => new Promise<void>(resolve => {
            treasureService.validateItem('potion', 'medium', '').subscribe((validity) => {
                expect(validity).toBe(true);
                resolve();
            });
        }));
    
        it('validates a valid item with name', () => new Promise<void>(resolve => {
            treasureService.validateItem('tool', 'mundane', 'spyglass').subscribe((validity) => {
                expect(validity).toBe(true);
                resolve();
            });
        }));
    
        it('validates an invalid item - item type', () => new Promise<void>(resolve => {
            treasureService.validateItem('vehicle', 'minor', '').subscribe((validity) => {
                expect(validity).toBe(false);
                resolve();
            });
        }));
    
        it('validates an invalid item - power', () => new Promise<void>(resolve => {
            treasureService.validateItem('weapon', 'super', '').subscribe((validity) => {
                expect(validity).toBe(false);
                resolve();
            });
        }));
    
        it('validates an invalid item - name', () => new Promise<void>(resolve => {
            treasureService.validateItem('tool', 'mundane', 'hammer').subscribe((validity) => {
                expect(validity).toBe(false);
                resolve();
            });
        }));
    
        it('validates an invalid item - bad combo', () => new Promise<void>(resolve => {
            treasureService.validateItem('alchemicalitem', 'minor', '').subscribe((validity) => {
                expect(validity).toBe(false);
                resolve();
            });
        }));
    
        it('validates an invalid item - bad name combo', () => new Promise<void>(resolve => {
            treasureService.validateItem('alchemicalitem', 'mundane', 'longsword').subscribe((validity) => {
                expect(validity).toBe(false);
                resolve();
            });
        }));
    });
});