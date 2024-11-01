import { DungeonService } from './dungeon.service'
import { HttpClient, HttpParams } from '@angular/common/http';
import { of } from 'rxjs';
import '@angular/compiler';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { DungeonGenViewModel } from '../models/dungeongenViewModel.model';
import { TestHelper } from '../../testHelper.spec';
import { Area } from '../models/area.model';
import { EncounterDefaults } from '../../encounter/models/encounterDefaults.model';

describe('Dungeon Service', () => {
    describe('unit', () => {
        let dungeonService: DungeonService;
        let httpClientSpy: jasmine.SpyObj<HttpClient>;
    
        beforeEach(() => {
            httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    
            dungeonService = new DungeonService(httpClientSpy);
        });

        it('gets the dungeon view model', done => {
            const model = new DungeonGenViewModel(
                ['environment 1', 'default environment', 'environment 2'],
                ['default temp', 'temp 1', 'temp 2'],
                ['time of day 1', 'time of day 2', 'default time of day'],
                ['creature type 1', 'creature type 2'],
                new EncounterDefaults(
                    'default environment',
                    'default temp',
                    'default time of day',
                    9266
                ),
            );
            httpClientSpy.get.and.returnValue(of(model));
    
            dungeonService.getViewModel().subscribe((viewmodel) => {
                expect(viewmodel).toBe(model);
                expect(httpClientSpy.get).toHaveBeenCalledWith('https://web.dndgen.com/api/v1/dungeon/viewmodel');
                done();
            });
        });
    
        let parameters = [
            { f: [], a: true, u: true},
            { f: [], a: true, u: false},
            { f: [], a: false, u: true},
            { f: [], a: false, u: false},
            { f: ['my filter'], a: true, u: true},
            { f: ['my filter'], a: true, u: false},
            { f: ['my filter'], a: false, u: true},
            { f: ['my filter'], a: false, u: false},
            { f: ['my filter', 'my other filter'], a: true, u: true},
            { f: ['my filter', 'my other filter'], a: true, u: false},
            { f: ['my filter', 'my other filter'], a: false, u: true},
            { f: ['my filter', 'my other filter'], a: false, u: false},
        ];

        parameters.forEach(test => {
            it(`generates 1 area from door - aquatic ${test.a}, underground ${test.u}, filters x${test.f.length}`, done => {
                const expected = [
                    new Area('my area'),
                ];
                httpClientSpy.get.and.returnValue(of(expected));
                let params = new HttpParams({
                    fromObject: {
                      creatureTypeFilters: test.f,
                      allowAquatic: test.a,
                      allowUnderground: test.u
                    }
                  });
        
                dungeonService
                    .generateAreasFromDoor(
                        90210,
                        'env',
                        'temp',
                        'time',
                        9266,
                        test.f,
                        test.a,
                        test.u)
                    .subscribe((areas) => {
                        expect(areas).toBe(expected);
                        expect(httpClientSpy.get).toHaveBeenCalledWith(
                            `https://dungeon.dndgen.com/api/v1/dungeon/level/90210/door/temp/env/time/level/9266/generate`, 
                            { params: params });
                        done();
                    });
            });

            it(`generates 2 areas from door - aquatic ${test.a}, underground ${test.u}, filters x${test.f.length}`, done => {
                const expected = [
                    new Area('my area'),
                    new Area('my other area'),
                ];
                httpClientSpy.get.and.returnValue(of(expected));
                let params = new HttpParams({
                    fromObject: {
                      creatureTypeFilters: test.f,
                      allowAquatic: test.a,
                      allowUnderground: test.u
                    }
                  });
        
                dungeonService
                    .generateAreasFromDoor(
                        90210,
                        'env',
                        'temp',
                        'time',
                        9266,
                        test.f,
                        test.a,
                        test.u)
                    .subscribe((areas) => {
                        expect(areas).toBe(expected);
                        expect(httpClientSpy.get).toHaveBeenCalledWith(
                            `https://dungeon.dndgen.com/api/v1/dungeon/level/90210/door/temp/env/time/level/9266/generate`, 
                            { params: params });
                        done();
                    });
            });
            
            it(`generates 1 area from hall - aquatic ${test.a}, underground ${test.u}, filters x${test.f.length}`, done => {
                const expected = [
                    new Area('my area'),
                ];
                httpClientSpy.get.and.returnValue(of(expected));
                let params = new HttpParams({
                    fromObject: {
                      creatureTypeFilters: test.f,
                      allowAquatic: test.a,
                      allowUnderground: test.u
                    }
                  });
        
                dungeonService
                    .generateAreasFromHall(
                        90210,
                        'env',
                        'temp',
                        'time',
                        9266,
                        test.f,
                        test.a,
                        test.u)
                    .subscribe((areas) => {
                        expect(areas).toBe(expected);
                        expect(httpClientSpy.get).toHaveBeenCalledWith(
                            `https://dungeon.dndgen.com/api/v1/dungeon/level/90210/hall/temp/env/time/level/9266/generate`, 
                            { params: params });
                        done();
                    });
            });

            it(`generates 2 areas from hall - aquatic ${test.a}, underground ${test.u}, filters x${test.f.length}`, done => {
                const expected = [
                    new Area('my area'),
                    new Area('my other area'),
                ];
                httpClientSpy.get.and.returnValue(of(expected));
                let params = new HttpParams({
                    fromObject: {
                      creatureTypeFilters: test.f,
                      allowAquatic: test.a,
                      allowUnderground: test.u
                    }
                  });
        
                dungeonService
                    .generateAreasFromHall(
                        90210,
                        'env',
                        'temp',
                        'time',
                        9266,
                        test.f,
                        test.a,
                        test.u)
                    .subscribe((areas) => {
                        expect(areas).toBe(expected);
                        expect(httpClientSpy.get).toHaveBeenCalledWith(
                            `https://dungeon.dndgen.com/api/v1/dungeon/level/90210/hall/temp/env/time/level/9266/generate`, 
                            { params: params });
                        done();
                    });
            });
        });
    });
    
    describe('integration', () => {
        let dungeonService: DungeonService;
    
        beforeEach(async () => {
            await TestHelper.configureTestBed();
        
            dungeonService = TestBed.inject(DungeonService);
        });

        it('gets the dungeon view model', waitForAsync(() => {
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
                expect(viewmodel.defaults.allowAquatic).toBeFalse();
                expect(viewmodel.defaults.allowUnderground).toBeTrue();
            });
        }));
    
        it('generates default areas from door', waitForAsync(() => {
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
                });
        }));
    
        it('generates non-default dungeon areas from door', waitForAsync(() => {
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
                });
        }));
    
        it('generates default areas from hall', waitForAsync(() => {
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
                });
        }));
    
        it('generates non-default areas from hall', waitForAsync(() => {
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
                });
        }));
    });
});