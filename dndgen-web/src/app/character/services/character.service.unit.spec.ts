import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CharacterService } from './character.service'
import { HttpClient, HttpParams } from '@angular/common/http';
import { of } from 'rxjs';
import '@angular/compiler';
import { TestBed } from '@angular/core/testing';
import { CharacterGenViewModel } from '../models/charactergen-view-model.model';
import { Character } from '../models/character.model';
import { TestHelper } from '../../test-helper';

describe('Character Service', () => {
    describe('unit', () => {
        let characterService: CharacterService;
        let httpClientSpy: { get: ReturnType<typeof vi.fn> };
    
        beforeEach(() => {
            httpClientSpy = { get: vi.fn() };
    
            characterService = new CharacterService(httpClientSpy as unknown as HttpClient);
        });

        it('gets the character view model', () => new Promise<void>(resolve => {
            const model = new CharacterGenViewModel(
                ['alignment randomizer 1', 'alignment randomizer 2'],
                ['alignment 1', 'alignment 2'],
                ['class name randomizer 1', 'class name randomizer 2'],
                ['class name 1', 'class name 2'],
                ['level randomizer 1', 'level randomizer 2'],
                ['base race randomizer 1', 'base race randomizer 2'],
                ['base race 1', 'base race 2'],
                ['metarace randomizer 1', 'metarace randomizer 2'],
                ['metarace 1', 'metarace 2'],
                ['abilities randomizer 1', 'abilities randomizer 2'],
            );
            httpClientSpy.get.mockReturnValue(of(model));
    
            characterService.getViewModel().subscribe((viewmodel) => {
                expect(viewmodel).toBe(model);
                expect(httpClientSpy.get).toHaveBeenCalledWith('https://web.dndgen.com/api/v1/character/viewmodel');
                resolve();
            });
        }));
    
        let booleanCombos = [
            {m: true, a: true},
            {m: true, a: false},
            {m: true, a: true},
            {m: true, a: false},
        ];

        booleanCombos.forEach(test => {
            it(`generates character - metarace ${test.m}, abilities ${test.a}`, () => new Promise<void>(resolve => {
                const expected = new Character('my character summary');
                httpClientSpy.get.mockReturnValue(of(expected));
                let params = new HttpParams()
                    .set('alignmentRandomizerType', 'my alignment randomizer')
                    .set('setAlignment', 'my alignment')
                    .set('classNameRandomizerType', 'my class name randomizer')
                    .set('setClassName', 'my class name')
                    .set('levelRandomizerType', 'my level randomizer')
                    .set('setLevel', 9266)
                    .set('baseRaceRandomizerType', 'my base race randomizer')
                    .set('setBaseRace', 'my base race')
                    .set('metaraceRandomizerType', 'my metarace randomizer')
                    .set('forceMetarace', test.m)
                    .set('setMetarace', 'my metarace')
                    .set('abilitiesRandomizerType', 'my abilities randomizer')
                    .set('setStrength', 90210)
                    .set('setConstitution', 42)
                    .set('setDexterity', 600)
                    .set('setIntelligence', 1337)
                    .set('setWisdom', 1336)
                    .set('setCharisma', 96)
                    .set('allowAbilityAdjustments', test.a);
        
                characterService
                    .generate(
                        'my alignment randomizer',
                        'my alignment',
                        'my class name randomizer',
                        'my class name',
                        'my level randomizer',
                        9266,
                        'my base race randomizer',
                        'my base race',
                        'my metarace randomizer',
                        test.m,
                        'my metarace',
                        'my abilities randomizer',
                        90210,
                        42,
                        600,
                        1337,
                        1336,
                        96,
                        test.a)
                    .subscribe((character) => {
                        expect(character).toBe(expected);
                        expect(httpClientSpy.get).toHaveBeenCalledWith('https://character.dndgen.com/api/v1/character/generate', { params: params });
                        resolve();
                    });
            }));
            
            it(`validates a valid character - metarace ${test.m}, abilities ${test.a}`, () => new Promise<void>(resolve => {
                httpClientSpy.get.mockReturnValue(of(true));
                let params = new HttpParams()
                    .set('alignmentRandomizerType', 'my alignment randomizer')
                    .set('setAlignment', 'my alignment')
                    .set('classNameRandomizerType', 'my class name randomizer')
                    .set('setClassName', 'my class name')
                    .set('levelRandomizerType', 'my level randomizer')
                    .set('setLevel', 9266)
                    .set('baseRaceRandomizerType', 'my base race randomizer')
                    .set('setBaseRace', 'my base race')
                    .set('metaraceRandomizerType', 'my metarace randomizer')
                    .set('forceMetarace', test.m)
                    .set('setMetarace', 'my metarace');

                characterService
                    .validate(
                        'my alignment randomizer',
                        'my alignment',
                        'my class name randomizer',
                        'my class name',
                        'my level randomizer',
                        9266,
                        'my base race randomizer',
                        'my base race',
                        'my metarace randomizer',
                        test.m,
                        'my metarace')
                    .subscribe((validity) => {
                        expect(validity).toBe(true);
                        expect(httpClientSpy.get).toHaveBeenCalledWith('https://character.dndgen.com/api/v1/character/validate', { params: params });
                        resolve();
                    });
            }));
        
            it(`validates an invalid character - metarace ${test.m}, abilities ${test.a}`, () => new Promise<void>(resolve => {
                httpClientSpy.get.mockReturnValue(of(false));
                let params = new HttpParams()
                    .set('alignmentRandomizerType', 'my alignment randomizer')
                    .set('setAlignment', 'my alignment')
                    .set('classNameRandomizerType', 'my class name randomizer')
                    .set('setClassName', 'my class name')
                    .set('levelRandomizerType', 'my level randomizer')
                    .set('setLevel', 9266)
                    .set('baseRaceRandomizerType', 'my base race randomizer')
                    .set('setBaseRace', 'my base race')
                    .set('metaraceRandomizerType', 'my metarace randomizer')
                    .set('forceMetarace', test.m)
                    .set('setMetarace', 'my metarace');
        
                characterService
                    .validate(
                        'my alignment randomizer',
                        'my alignment',
                        'my class name randomizer',
                        'my class name',
                        'my level randomizer',
                        9266,
                        'my base race randomizer',
                        'my base race',
                        'my metarace randomizer',
                        test.m,
                        'my metarace')
                    .subscribe((validity) => {
                        expect(validity).toBe(false);
                        expect(httpClientSpy.get).toHaveBeenCalledWith('https://character.dndgen.com/api/v1/character/validate', { params: params });
                        resolve();
                    });
            }));
        });
    });
});