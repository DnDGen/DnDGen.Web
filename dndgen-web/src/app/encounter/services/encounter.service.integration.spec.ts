import { describe, it, expect, beforeEach, vi } from 'vitest';
import { EncounterService } from './encounter.service'
import { HttpClient, HttpParams } from '@angular/common/http';
import { of } from 'rxjs';
import '@angular/compiler';
import { TestBed } from '@angular/core/testing';
import { EncounterGenViewModel } from '../models/encountergen-view-model.model';
import { EncounterDefaults } from '../models/encounter-defaults.model';
import { Encounter } from '../models/encounter.model';
import { TestHelper } from '../../test-helper';

describe('Encounter Service', () => {
    describe('integration', () => {
        let encounterService: EncounterService;
    
        beforeEach(async () => {
            await TestHelper.configureTestBed();
        
            encounterService = TestBed.inject(EncounterService);
        });

        it('gets the encounter view model', () => new Promise<void>(resolve => {
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
                expect(viewmodel.defaults.allowAquatic).toBe(false);
                expect(viewmodel.defaults.allowUnderground).toBe(false);
                resolve();
            });
        }));
    
        it('generates default encounter', () => new Promise<void>(resolve => {
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
                    resolve();
                });
        }));
    
        it('generates non-default encounter', () => new Promise<void>(resolve => {
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
                    resolve();
                });
        }));
    
        it('validates a valid encounter', () => new Promise<void>(resolve => {
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
                    resolve();
                });
        }));
    
        it('validates an invalid encounter - empty environment', () => new Promise<void>(resolve => {
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
                    resolve();
                });
        }));
    
        it('validates an invalid encounter - bad environment', () => new Promise<void>(resolve => {
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
                    resolve();
                });
        }));
    
        it('validates an invalid encounter - empty temperature', () => new Promise<void>(resolve => {
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
                    resolve();
                });
        }));
    
        it('validates an invalid encounter - bad temperature', () => new Promise<void>(resolve => {
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
                    resolve();
                });
        }));
    
        it('validates an invalid encounter - empty time of day', () => new Promise<void>(resolve => {
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
                    resolve();
                });
        }));
    
        it('validates an invalid encounter - bad time of day', () => new Promise<void>(resolve => {
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
                    resolve();
                });
        }));
    
        it('validates an invalid encounter - level too low', () => new Promise<void>(resolve => {
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
                    resolve();
                });
        }));
    
        it('validates an invalid encounter - level too high', () => new Promise<void>(resolve => {
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
                    resolve();
                });
        }));
    
        it('validates a valid encounter - empty filter', () => new Promise<void>(resolve => {
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
                    resolve();
                });
        }));
    
        it('BUG - validates a valid encounter - oozes', () => new Promise<void>(resolve => {
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
                    resolve();
                });
        }));
    
        it('validates a valid encounter - bad filter', () => new Promise<void>(resolve => {
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
                    resolve();
                });
        }));
    
        it('validates an invalid encounter - bad combo', () => new Promise<void>(resolve => {
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
                    resolve();
                });
        }));
    
        it('validates an invalid encounter - bad combo and empty filter', () => new Promise<void>(resolve => {
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
                    resolve();
                });
        }));
    
        it('validates an invalid encounter - bad combo and bad filter', () => new Promise<void>(resolve => {
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
                    resolve();
                });
        }));
    });
});