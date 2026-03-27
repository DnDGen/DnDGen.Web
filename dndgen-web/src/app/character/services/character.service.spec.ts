import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CharacterService } from './character.service'
import { HttpClient, HttpParams } from '@angular/common/http';
import { of } from 'rxjs';
import '@angular/compiler';
import { TestBed } from '@angular/core/testing';
import { CharacterGenViewModel } from '../models/charactergenViewModel.model';
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
    
    describe('integration', () => {
        let characterService: CharacterService;
    
        beforeEach(async () => {
            await TestHelper.configureTestBed();
        
            characterService = TestBed.inject(CharacterService);
        });

        it('gets the character view model', () => new Promise<void>(resolve => {
            characterService.getViewModel().subscribe((viewmodel) => {
                expect(viewmodel).toBeTruthy();
                expect(viewmodel.alignmentRandomizerTypes.length).toBe(12);
                expect(viewmodel.alignments.length).toBe(9);
                expect(viewmodel.classNameRandomizerTypes.length).toBe(9);
                expect(viewmodel.classNames.length).toBe(16);
                expect(viewmodel.levelRandomizerTypes.length).toBe(6);
                expect(viewmodel.baseRaceRandomizerTypes.length).toBe(7);
                expect(viewmodel.baseRaces.length).toBe(71);
                expect(viewmodel.metaraceRandomizerTypes.length).toBe(6);
                expect(viewmodel.metaraces.length).toBe(13);

                //INFO: This allows us to bridge the deployment gap
                // expect(viewmodel.abilitiesRandomizerTypes.length).toEqual(8);
                expect([8, 9]).toContain(viewmodel.abilitiesRandomizerTypes.length);
                resolve();
            });
        }));
    
        it('generates character', () => new Promise<void>(resolve => {
            characterService
                .generate(
                    'Any',
                    '',
                    'Any Player',
                    '',
                    'Any',
                    0,
                    'Any Base',
                    '',
                    'Any Meta',
                    false,
                    '',
                    'Best of four',
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    true)
                .subscribe((character) => {
                    expect(character).toBeTruthy();
                    expect(character.summary).toBeTruthy();
                    resolve();
                });
        }));
    
        it('BUG - generates character with skills', () => new Promise<void>(resolve => {
            characterService
                .generate(
                    'Any',
                    '',
                    'Any Player',
                    '',
                    'Low',
                    0,
                    'Any Base',
                    '',
                    'Any Meta',
                    false,
                    '',
                    'Best of four',
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    true)
                .subscribe((character) => {
                    expect(character).toBeTruthy();
                    expect(character.summary).toBeTruthy();

                    expect(character.skills.length).toBeTruthy();

                    let foundClassSkill = false;

                    for(let i = 0; i < character.skills.length; i++) {
                        expect(character.skills[i].name).toBeTruthy();
                        foundClassSkill ||= character.skills[i].classSkill;
                    }

                    expect(foundClassSkill).toBe(true);
                    resolve();
                });
        }));
    
        it('BUG - generates character with correct known spell sources', () => new Promise<void>(resolve => {
            characterService
                .generate(
                    'Any',
                    '',
                    'set',
                    'cleric',
                    'medium',
                    0,
                    'Any Base',
                    '',
                    'Any Meta',
                    false,
                    '',
                    'heroic',
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    true)
                .subscribe((character) => {
                    expect(character).toBeTruthy();
                    expect(character.summary).toBeTruthy();

                    expect(character.magic.knownSpells.length).toBeTruthy();
                    expect(character.magic.knownSpells[0].name).toBeTruthy();
                    expect(character.magic.knownSpells[0].metamagic.length).toBeFalsy();

                    let keys = Object.keys(character.magic.knownSpells[0].sources);
                    expect(keys.length).toBeTruthy();
                    expect(character.magic.knownSpells[0].sources[keys[0]]).toBeGreaterThanOrEqual(0);
                    resolve();
                });
        }));
    
        it('BUG - generates character with correct prepared spell sources', () => new Promise<void>(resolve => {
            characterService
                .generate(
                    'Any',
                    '',
                    'set',
                    'cleric',
                    'medium',
                    0,
                    'Any Base',
                    '',
                    'Any Meta',
                    false,
                    '',
                    'heroic',
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    true)
                .subscribe((character) => {
                    expect(character).toBeTruthy();
                    expect(character.summary).toBeTruthy();

                    expect(character.magic.preparedSpells.length).toBeTruthy();
                    expect(character.magic.preparedSpells[0].name).toBeTruthy();
                    expect(character.magic.preparedSpells[0].metamagic.length).toBeFalsy();
                    
                    let keys = Object.keys(character.magic.preparedSpells[0].sources);
                    expect(keys.length).toBeTruthy();
                    expect(character.magic.preparedSpells[0].sources[keys[0]]).toBeGreaterThanOrEqual(0);
                    resolve();
                });
        }));
    
        it('BUG - generates character with weapon summaries', () => new Promise<void>(resolve => {
            characterService
                .generate(
                    'Any',
                    '',
                    'Any Player',
                    '',
                    'Any',
                    0,
                    'Any Base',
                    '',
                    'Any Meta',
                    false,
                    '',
                    'Best of four',
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    true)
                .subscribe((character) => {
                    expect(character).toBeTruthy();
                    expect(character.summary).toBeTruthy();
                    expect(character.equipment.primaryHand).toBeTruthy();
                    expect(character.equipment.primaryHand?.damageSummary || character.equipment.primaryHand?.damageDescription).toBeTruthy();
                    resolve();
                });
        }));
    
        it('generates character with set values', () => new Promise<void>(resolve => {
            characterService
                .generate(
                    'Set',
                    'Neutral Good',
                    'Set',
                    'Fighter',
                    'Set',
                    9,
                    'Set',
                    'Half-Orc',
                    'Set',
                    false,
                    'Ghost',
                    'Set',
                    26,
                    6,
                    9,
                    21,
                    4,
                    2,
                    true)
                .subscribe((character) => {
                    expect(character).toBeTruthy();
                    expect(character.summary).toBeTruthy();
                    resolve();
                });
        }));
    
        it('validates a valid character', () => new Promise<void>(resolve => {
            characterService
                .validate(
                    'Set',
                    'Neutral Good',
                    'Set',
                    'Fighter',
                    'Set',
                    9,
                    'Set',
                    'Half-Orc',
                    'Set',
                    false,
                    'Ghost')
                .subscribe((validity) => {
                    expect(validity).toBe(true);
                    resolve();
                });
        }));
    
        it('validates an invalid character - bad alignment randomizer', () => new Promise<void>(resolve => {
            characterService
                .validate(
                    'Invalid',
                    'Neutral Good',
                    'Set',
                    'Fighter',
                    'Set',
                    9,
                    'Set',
                    'Half-Orc',
                    'Set',
                    false,
                    'Ghost')
                .subscribe((validity) => {
                    expect(validity).toBe(false);
                    resolve();
                });
        }));
    
        it('validates an invalid character - bad alignment', () => new Promise<void>(resolve => {
            characterService
                .validate(
                    'Set',
                    'Bad Alignment',
                    'Set',
                    'Fighter',
                    'Set',
                    9,
                    'Set',
                    'Half-Orc',
                    'Set',
                    false,
                    'Ghost')
                .subscribe((validity) => {
                    expect(validity).toBe(false);
                    resolve();
                });
        }));
    
        it('validates an invalid character - bad class name randomizer', () => new Promise<void>(resolve => {
            characterService
                .validate(
                    'Set',
                    'Neutral Good',
                    'Bad',
                    'Fighter',
                    'Set',
                    9,
                    'Set',
                    'Half-Orc',
                    'Set',
                    false,
                    'Ghost')
                .subscribe((validity) => {
                    expect(validity).toBe(false);
                    resolve();
                });
        }));
    
        it('validates an invalid character - bad class name', () => new Promise<void>(resolve => {
            characterService
                .validate(
                    'Set',
                    'Neutral Good',
                    'Set',
                    'Bad Class Name',
                    'Set',
                    9,
                    'Set',
                    'Half-Orc',
                    'Set',
                    false,
                    'Ghost')
                .subscribe((validity) => {
                    expect(validity).toBe(false);
                    resolve();
                });
        }));
    
        it('validates an invalid character - bad level randomizer', () => new Promise<void>(resolve => {
            characterService
                .validate(
                    'Set',
                    'Neutral Good',
                    'Set',
                    'Fighter',
                    'Bad',
                    9,
                    'Set',
                    'Half-Orc',
                    'Set',
                    false,
                    'Ghost')
                .subscribe((validity) => {
                    expect(validity).toBe(false);
                    resolve();
                });
        }));
    
        it('validates an invalid character - bad level', () => new Promise<void>(resolve => {
            characterService
                .validate(
                    'Set',
                    'Neutral Good',
                    'Set',
                    'Fighter',
                    'Set',
                    92,
                    'Set',
                    'Half-Orc',
                    'Set',
                    false,
                    'Ghost')
                .subscribe((validity) => {
                    expect(validity).toBe(false);
                    resolve();
                });
        }));
    
        it('BUG - validates an invalid character - level too high', () => new Promise<void>(resolve => {
            characterService
                .validate(
                    'Any',
                    'Neutral Good',
                    'Any Player',
                    'Fighter',
                    'Set',
                    21,
                    'Any Base',
                    'Half-Orc',
                    'Any Meta',
                    false,
                    'Ghost')
                .subscribe((validity) => {
                    expect(validity).toBe(false);
                    resolve();
                });
        }));
    
        it('BUG - validates an valid character - level at max', () => new Promise<void>(resolve => {
            characterService
                .validate(
                    'Set',
                    'Neutral Good',
                    'Set',
                    'Fighter',
                    'Set',
                    20,
                    'Set',
                    'Half-Orc',
                    'Set',
                    false,
                    'Ghost')
                .subscribe((validity) => {
                    expect(validity).toBe(true);
                    resolve();
                });
        }));
    
        it('BUG - validates an invalid character - Good Lich', () => new Promise<void>(resolve => {
            characterService
                .validate(
                    'Good',
                    'Neutral Good',
                    'Any Player',
                    'Fighter',
                    'Any',
                    1,
                    'Any Base',
                    'Aasimar',
                    'Set',
                    false,
                    'Lich')
                .subscribe((validity) => {
                    expect(validity).toBe(false);
                    resolve();
                });
        }));
    
        it('BUG - validates an valid character - Evil Lich', () => new Promise<void>(resolve => {
            characterService
                .validate(
                    'Evil',
                    'Neutral Good',
                    'Any Player',
                    'Fighter',
                    'Any',
                    1,
                    'Any Base',
                    'Aasimar',
                    'Set',
                    false,
                    'Lich')
                .subscribe((validity) => {
                    expect(validity).toBe(true);
                    resolve();
                });
        }));
    
        it('validates an invalid character - bad base race randomizer', () => new Promise<void>(resolve => {
            characterService
                .validate(
                    'Set',
                    'Neutral Good',
                    'Set',
                    'Fighter',
                    'Set',
                    9,
                    'Bad',
                    'Half-Orc',
                    'Set',
                    false,
                    'Ghost')
                .subscribe((validity) => {
                    expect(validity).toBe(false);
                    resolve();
                });
        }));
    
        it('validates an invalid character - bad base race', () => new Promise<void>(resolve => {
            characterService
                .validate(
                    'Set',
                    'Neutral Good',
                    'Set',
                    'Fighter',
                    'Set',
                    9,
                    'Set',
                    'Bad Race',
                    'Set',
                    false,
                    'Ghost')
                .subscribe((validity) => {
                    expect(validity).toBe(false);
                    resolve();
                });
        }));
    
        it('validates an invalid character - bad metarace randomizer', () => new Promise<void>(resolve => {
            characterService
                .validate(
                    'Set',
                    'Neutral Good',
                    'Set',
                    'Fighter',
                    'Set',
                    9,
                    'Set',
                    'Half-Orc',
                    'Bad',
                    false,
                    'Ghost')
                .subscribe((validity) => {
                    expect(validity).toBe(false);
                    resolve();
                });
        }));
    
        it('validates an invalid character - bad metarace', () => new Promise<void>(resolve => {
            characterService
                .validate(
                    'Set',
                    'Neutral Good',
                    'Set',
                    'Fighter',
                    'Set',
                    9,
                    'Set',
                    'Half-Orc',
                    'Set',
                    false,
                    'Bad Metarace')
                .subscribe((validity) => {
                    expect(validity).toBe(false);
                    resolve();
                });
        }));
    
        it('validates an invalid character - bad combo', () => new Promise<void>(resolve => {
            characterService
                .validate(
                    'Set',
                    'Neutral Good',
                    'Set',
                    'Fighter',
                    'Set',
                    9,
                    'Set',
                    'Half-Orc',
                    'Set',
                    false,
                    'Vampire')
                .subscribe((validity) => {
                    expect(validity).toBe(false);
                    resolve();
                });
        }));
    });
});
