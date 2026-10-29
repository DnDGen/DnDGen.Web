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
    describe('unit', () => {
        let encounterService: EncounterService;
        let httpClientSpy: { get: ReturnType<typeof vi.fn> };
    
        beforeEach(() => {
            httpClientSpy = { get: vi.fn() };
    
            encounterService = new EncounterService(httpClientSpy as unknown as HttpClient);
        });

        it('gets the encounter view model', () => new Promise<void>(resolve => {
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
            httpClientSpy.get.mockReturnValue(of(model));
    
            encounterService.getViewModel().subscribe((viewmodel) => {
                expect(viewmodel).toBe(model);
                expect(httpClientSpy.get).toHaveBeenCalledWith('https://web.dndgen.com/api/v1/encounter/viewmodel');
                resolve();
            });
        }));
    
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
            it(`generates encounter - aquatic ${test.a}, underground ${test.u}, filters x${test.f.length}`, () => new Promise<void>(resolve => {
                const expected = new Encounter('my encounter description');
                httpClientSpy.get.mockReturnValue(of(expected));
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
                        resolve();
                    });
            }));
            
            it(`validates a valid encounter - aquatic ${test.a}, underground ${test.u}, filters x${test.f.length}`, () => new Promise<void>(resolve => {
                httpClientSpy.get.mockReturnValue(of(true));
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
                        resolve();
                    });
            }));
        
            it(`validates an invalid encounter - aquatic ${test.a}, underground ${test.u}, filters x${test.f.length}`, () => new Promise<void>(resolve => {
                httpClientSpy.get.mockReturnValue(of(false));
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
                        resolve();
                    });
            }));
        });
    });
});