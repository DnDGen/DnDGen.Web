import { EncounterService } from './encounter.service'
import { HttpClient, HttpParams } from '@angular/common/http';
import { of } from 'rxjs';
import '@angular/compiler';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { EncounterGenViewModel } from '../models/encountergenViewModel.model';
import { EncounterDefaults } from '../models/encounterDefaults.model';
import { Encounter } from '../models/encounter.model';
import { TestHelper } from '../../testHelper.spec';

describe('Encounter Service', () => {
    describe('unit', () => {
        let encounterService: EncounterService;
        let httpClientSpy: jasmine.SpyObj<HttpClient>;
    
        beforeEach(() => {
            httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    
            encounterService = new EncounterService(httpClientSpy);
        });

        it('gets the encounter view model', done => {
            const model = new EncounterGenViewModel(
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
    
            encounterService.getViewModel().subscribe((viewmodel) => {
                expect(viewmodel).toBe(model);
                expect(httpClientSpy.get).toHaveBeenCalledWith('https://web.dndgen.com/api/v1/encounter/viewmodel');
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
            it(`generates encounter - aquatic ${test.a}, underground ${test.u}, filters x${test.f.length}`, done => {
                const expected = new Encounter('my encounter description');
                httpClientSpy.get.and.returnValue(of(expected));
                let params = new HttpParams({
                    fromObject: {
                      creatureTypeFilters: test.f,
                      allowAquatic: test.a,
                      allowUnderground: test.u
                    }
                  });
        
                encounterService
                    .generate(
                        'env',
                        'temp',
                        'time',
                        9266,
                        test.f,
                        test.a,
                        test.u)
                    .subscribe((encounter) => {
                        expect(encounter).toBe(expected);
                        expect(httpClientSpy.get).toHaveBeenCalledWith(
                            `https://encounter.dndgen.com/api/v1/encounter/temp/env/time/level/9266/generate`, 
                            { params: params });
                        done();
                    });
            });
            
            it(`validates a valid encounter - aquatic ${test.a}, underground ${test.u}, filters x${test.f.length}`, done => {
                httpClientSpy.get.and.returnValue(of(true));
                let params = new HttpParams({
                    fromObject: {
                      creatureTypeFilters: test.f,
                      allowAquatic: test.a,
                      allowUnderground: test.u
                    }
                  });

                encounterService
                    .validate(
                        'env',
                        'temp',
                        'time',
                        9266,
                        test.f,
                        test.a,
                        test.u)
                    .subscribe((validity) => {
                        expect(validity).toBe(true);
                        expect(httpClientSpy.get).toHaveBeenCalledWith(
                            `https://encounter.dndgen.com/api/v1/encounter/temp/env/time/level/9266/validate`, 
                            { params: params });
                        done();
                    });
            });
        
            it(`validates an invalid encounter - aquatic ${test.a}, underground ${test.u}, filters x${test.f.length}`, done => {
                httpClientSpy.get.and.returnValue(of(false));
                let params = new HttpParams({
                    fromObject: {
                      creatureTypeFilters: test.f,
                      allowAquatic: test.a,
                      allowUnderground: test.u
                    }
                  });
        
                encounterService
                    .validate(
                        'env',
                        'temp',
                        'time',
                        9266,
                        test.f,
                        test.a,
                        test.u)
                    .subscribe((validity) => {
                        expect(validity).toBe(false);
                        expect(httpClientSpy.get).toHaveBeenCalledWith(
                            `https://encounter.dndgen.com/api/v1/encounter/temp/env/time/level/9266/validate`, 
                            { params: params });
                        done();
                    });
            });
        });
    });
    
    describe('integration', () => {
        let encounterService: EncounterService;
    
        beforeEach(async () => {
            await TestHelper.configureTestBed();
        
            encounterService = TestBed.inject(EncounterService);
        });

        it('gets the encounter view model', waitForAsync(() => {
            encounterService.getViewModel().subscribe((viewmodel) => {
                expect(viewmodel).toBeTruthy();
                expect(viewmodel.environments.length).toBe(9);
                expect(viewmodel.temperatures.length).toBe(3);
                expect(viewmodel.timesOfDay.length).toBe(2);
                expect(viewmodel.creatureTypes.length).toBe(15);
                expect(viewmodel.defaults.environment).toBe('Plains');
                expect(viewmodel.defaults.temperature).toBe('Temperate');
                expect(viewmodel.defaults.timeOfDay).toBe('Day');
                expect(viewmodel.defaults.level).toBe(1);
                expect(viewmodel.defaults.allowAquatic).toBeFalse();
                expect(viewmodel.defaults.allowUnderground).toBeFalse();
            });
        }));
    
        it('generates default encounter', waitForAsync(() => {
            encounterService
                .generate(
                    'Plains',
                    'Temperate',
                    'Day',
                    1,
                    [],
                    false,
                    false,
                )
                .subscribe((encounter) => {
                    expect(encounter).toBeTruthy();
                    expect(encounter.description).toBeTruthy();
                });
        }));
    
        it('generates non-default encounter', waitForAsync(() => {
            encounterService
                .generate(
                    'Mountain',
                    'Cold',
                    'Night',
                    9,
                    ['Undead', 'Giant', 'Dragon', 'Humanoid'],
                    true,
                    true)
                .subscribe((encounter) => {
                    expect(encounter).toBeTruthy();
                    expect(encounter.description).toBeTruthy();
                });
        }));
    
        it('validates a valid encounter', done => {
            encounterService
                .validate(
                    'Mountain',
                    'Cold',
                    'Night',
                    9,
                    ['Undead', 'Giant', 'Dragon', 'Humanoid'],
                    true,
                    true)
                .subscribe((validity) => {
                    expect(validity).toBe(true);
                    done();
                });
        });
    
        it('validates an invalid encounter - empty environment', done => {
            encounterService
                .validate(
                    '',
                    'Cold',
                    'Night',
                    9,
                    ['Undead', 'Giant', 'Dragon', 'Humanoid'],
                    true,
                    true)
                .subscribe((validity) => {
                    expect(validity).toBe(false);
                    done();
                });
        });
    
        it('validates an invalid encounter - bad environment', done => {
            encounterService
                .validate(
                    'BadEnvironment',
                    'Cold',
                    'Night',
                    9,
                    ['Undead', 'Giant', 'Dragon', 'Humanoid'],
                    true,
                    true)
                .subscribe((validity) => {
                    expect(validity).toBe(false);
                    done();
                });
        });
    
        it('validates an invalid encounter - empty temperature', done => {
            encounterService
                .validate(
                    'Mountain',
                    '',
                    'Night',
                    9,
                    ['Undead', 'Giant', 'Dragon', 'Humanoid'],
                    true,
                    true)
                .subscribe((validity) => {
                    expect(validity).toBe(false);
                    done();
                });
        });
    
        it('validates an invalid encounter - bad temperature', done => {
            encounterService
                .validate(
                    'Mountain',
                    'BadTemp',
                    'Night',
                    9,
                    ['Undead', 'Giant', 'Dragon', 'Humanoid'],
                    true,
                    true)
                .subscribe((validity) => {
                    expect(validity).toBe(false);
                    done();
                });
        });
    
        it('validates an invalid encounter - empty time of day', done => {
            encounterService
                .validate(
                    'Mountain',
                    'Cold',
                    '',
                    9,
                    ['Undead', 'Giant', 'Dragon', 'Humanoid'],
                    true,
                    true)
                .subscribe((validity) => {
                    expect(validity).toBe(false);
                    done();
                });
        });
    
        it('validates an invalid encounter - bad time of day', done => {
            encounterService
                .validate(
                    'Mountain',
                    'Cold',
                    'BadTime',
                    9,
                    ['Undead', 'Giant', 'Dragon', 'Humanoid'],
                    true,
                    true)
                .subscribe((validity) => {
                    expect(validity).toBe(false);
                    done();
                });
        });
    
        it('validates an invalid encounter - level too low', done => {
            encounterService
                .validate(
                    'Mountain',
                    'Cold',
                    'Night',
                    0,
                    ['Undead', 'Giant', 'Dragon', 'Humanoid'],
                    true,
                    true)
                .subscribe((validity) => {
                    expect(validity).toBe(false);
                    done();
                });
        });
    
        it('validates an invalid encounter - level too high', done => {
            encounterService
                .validate(
                    'Mountain',
                    'Cold',
                    'Night',
                    100,
                    ['Undead', 'Giant', 'Dragon', 'Humanoid'],
                    true,
                    true)
                .subscribe((validity) => {
                    expect(validity).toBe(false);
                    done();
                });
        });
    
        it('validates a valid encounter - empty filter', done => {
            encounterService
                .validate(
                    'Mountain',
                    'Cold',
                    'Night',
                    9,
                    ['Undead', '', 'Dragon', 'Humanoid'],
                    true,
                    true)
                .subscribe((validity) => {
                    expect(validity).toBe(true);
                    done();
                });
        });
    
        it('BUG - validates a valid encounter - oozes', done => {
            encounterService
                .validate(
                    'Plains',
                    'Temperate',
                    'Day',
                    7,
                    ['Ooze'],
                    false,
                    true)
                .subscribe((validity) => {
                    expect(validity).toBe(true);
                    done();
                });
        });
    
        it('validates a valid encounter - bad filter', done => {
            encounterService
                .validate(
                    'Mountain',
                    'Cold',
                    'Night',
                    9,
                    ['Undead', 'Bad Filter', 'Dragon', 'Humanoid'],
                    true,
                    true)
                .subscribe((validity) => {
                    expect(validity).toBe(true);
                    done();
                });
        });
    
        it('validates an invalid encounter - bad combo', done => {
            encounterService
                .validate(
                    'Mountain',
                    'Cold',
                    'Day',
                    9,
                    ['Plant', 'Ooze'],
                    false,
                    false)
                .subscribe((validity) => {
                    expect(validity).toBe(false);
                    done();
                });
        });
    
        it('validates an invalid encounter - bad combo and empty filter', done => {
            encounterService
                .validate(
                    'Mountain',
                    'Cold',
                    'Day',
                    9,
                    ['Plant', '', 'Ooze'],
                    false,
                    false)
                .subscribe((validity) => {
                    expect(validity).toBe(false);
                    done();
                });
        });
    
        it('validates an invalid encounter - bad combo and bad filter', done => {
            encounterService
                .validate(
                    'Mountain',
                    'Cold',
                    'Day',
                    9,
                    ['Plant', 'Bad Filter', 'Ooze'],
                    false,
                    false)
                .subscribe((validity) => {
                    expect(validity).toBe(false);
                    done();
                });
        });
    });
});