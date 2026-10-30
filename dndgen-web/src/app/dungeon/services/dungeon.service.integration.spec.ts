import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DungeonService } from './dungeon.service'
import { HttpClient, HttpParams } from '@angular/common/http';
import { of } from 'rxjs';
import '@angular/compiler';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { DungeonGenViewModel } from '../models/dungeongen-view-model.model';
import { TestHelper } from '../../test-helper';
import { Area } from '../models/area.model';
import { EncounterDefaults } from '../../encounter/models/encounter-defaults.model';

describe('Dungeon Service', () => {
    describe('integration', () => {
        let dungeonService: DungeonService;
    
        beforeEach(async () => {
            await TestHelper.configureTestBed();
        
            dungeonService = TestBed.inject(DungeonService);
        });

        it('gets the dungeon view model', () => new Promise<void>(resolve => {
            dungeonService.getViewModel().subscribe((viewmodel) => {
                expect(viewmodel).toBeTruthy();
                expect(viewmodel.environments.length).toBe(9);
                expect(viewmodel.temperatures.length).toBe(3);
                expect(viewmodel.timesOfDay.length).toBe(2);
                expect(viewmodel.creatureTypes.length).toBe(15);
                expect(viewmodel.defaults.environment).toBe('Underground');
                expect(viewmodel.defaults.temperature).toBe('Temperate');
                expect(viewmodel.defaults.timeOfDay).toBe('Day');
                expect(viewmodel.defaults.level).toBe(1);
                expect(viewmodel.defaults.allowAquatic).toBe(false);
                expect(viewmodel.defaults.allowUnderground).toBe(true);
                resolve();
            });
        }));
    
        it('generates default areas from door', () => new Promise<void>(resolve => {
            dungeonService
                .generateAreasFromDoor(
                    1,
                    'Underground',
                    'Temperate',
                    'Day',
                    1,
                    [],
                    false,
                    true,
                )
                .subscribe((areas) => {
                    expect(areas.length).toBeTruthy();

                    for(let i = 0; i < areas.length; i++) {
                        expect(areas[i].type).toBeTruthy();
                    }
                    resolve();
                });
        }));
    
        it('generates non-default dungeon areas from door', () => new Promise<void>(resolve => {
            dungeonService
                .generateAreasFromDoor(
                    2,
                    'Plains',
                    'Cold',
                    'Night',
                    3,
                    ['Humanoid', 'Abomination', 'Undead'],
                    true,
                    false,
                )
                .subscribe((areas) => {
                    expect(areas.length).toBeTruthy();

                    for(let i = 0; i < areas.length; i++) {
                        expect(areas[i].type).toBeTruthy();
                    }
                    resolve();
                });
        }));
    
        it('generates default areas from hall', () => new Promise<void>(resolve => {
            dungeonService
                .generateAreasFromHall(
                    1,
                    'Underground',
                    'Temperate',
                    'Day',
                    1,
                    [],
                    false,
                    true,
                )
                .subscribe((areas) => {
                    expect(areas.length).toBeTruthy();

                    for(let i = 0; i < areas.length; i++) {
                        expect(areas[i].type).toBeTruthy();
                    }
                    resolve();
                });
        }));
    
        it('generates non-default areas from hall', () => new Promise<void>(resolve => {
            dungeonService
                .generateAreasFromHall(
                    2,
                    'Plains',
                    'Cold',
                    'Night',
                    3,
                    ['Humanoid', 'Abomination', 'Undead'],
                    true,
                    false,
                )
                .subscribe((areas) => {
                    expect(areas.length).toBeTruthy();

                    for(let i = 0; i < areas.length; i++) {
                        expect(areas[i].type).toBeTruthy();
                    }
                    resolve();
                });
        }));
        
        TestHelper.runFlakyTest(() => {
            it('BUG - returns data for generated traps', () => new Promise<void>(resolve => {
                dungeonService
                    .generateAreasFromDoor(
                        2,
                        'Plains',
                        'Cold',
                        'Night',
                        3,
                        ['Humanoid', 'Abomination', 'Undead'],
                        true,
                        false,
                    )
                    .subscribe((areas) => {
                        expect(areas.length).toBeTruthy();
    
                        for(let i = 0; i < areas.length; i++) {
                            expect(areas[i].type).toBeTruthy();

                            if (areas[i].contents.isEmpty) {
                                continue;
                            }

                            if (areas[i].contents.traps.length == 0) {
                                continue;
                            }

                            for(let j = 0; j < areas[i].contents.traps.length; j++) {
                                const trap = areas[i].contents.traps[j];
                                expect(trap.descriptions.length).toBeTruthy();
                                expect(trap.challengeRating).toBeTruthy();
                                expect(trap.searchDC).toBeTruthy();
                                expect(trap.disableDeviceDC).toBeTruthy();
                            }
                        }
                        resolve();
                    });
            }));
        }, 100);
    });
});