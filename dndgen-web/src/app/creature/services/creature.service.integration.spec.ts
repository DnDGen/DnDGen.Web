import { describe, it, expect, beforeEach } from 'vitest';
import { CreatureService } from './creature.service';
import '@angular/compiler';
import { TestBed } from '@angular/core/testing';
import { TestHelper } from '../../test-helper';

describe('Creature Service', () => {
    describe('integration', () => {
        let creatureService: CreatureService;

        beforeEach(async () => {
            await TestHelper.configureTestBed();

            creatureService = TestBed.inject(CreatureService);
        });

        it('gets the creature view model', () => new Promise<void>(resolve => {
            creatureService.getViewModel().subscribe((viewmodel) => {
                expect(viewmodel).toBeTruthy();
                expect(viewmodel.creatures.length).toBe(659);
                expect(viewmodel.creatures).toContain('Human');
                expect(viewmodel.creatures).toContain('Hill Giant');
                expect(viewmodel.templates.length).toBe(44);
                expect(viewmodel.templates).toContain('None');
                expect(viewmodel.templates).toContain('Ghost');
                expect(viewmodel.alignments).toEqual([
                    'Lawful Good', 'Neutral Good', 'Chaotic Good',
                    'Lawful Neutral', 'True Neutral', 'Chaotic Neutral',
                    'Lawful Evil', 'Neutral Evil', 'Chaotic Evil',
                ]);
                expect(viewmodel.creatureTypes.length).toBe(42);
                expect(viewmodel.creatureTypes).toContain('Aberration');
                expect(viewmodel.challengeRatings.length).toBe(34);
                expect(viewmodel.challengeRatings.slice(0, 9)).toEqual(['0', '1/10', '1/8', '1/6', '1/4', '1/3', '1/2', '1', '2']);
                resolve();
            });
        }));

        const creatureValidations = [
            { creature: 'Human', templates: [], valid: true },
            { creature: 'Human', templates: ['Ghost'], valid: true },
            { creature: 'Human', templates: ['Ghost', 'Lich'], valid: false },
            { creature: 'Human', templates: ['None'], valid: true },
            { creature: 'Human', templates: ['None', 'None'], valid: true },
            { creature: 'Human', templates: ['None', 'Ghost'], valid: true },
            { creature: 'Human', templates: ['Ghost', 'Ghost'], valid: false },
            { creature: 'Yuan-ti Halfblood (Snake Head, Snake Tail instead of Human Legs)', templates: [], valid: true },
        ];

        creatureValidations.forEach(test => {
            it(`validates ${test.creature} with templates [${test.templates}] as ${test.valid}`, () => new Promise<void>(resolve => {
                creatureService.validateCreature(test.creature, test.templates).subscribe((validity) => {
                    expect(validity).toBe(test.valid);
                    resolve();
                });
            }));
        });

        it('generates a Human with no templates', () => new Promise<void>(resolve => {
            creatureService.generateCreature('Human', []).subscribe((creature) => {
                expect(creature.name).toBe('Human');
                expect(creature.templates).toEqual([]);
                resolve();
            });
        }));

        it('generates a Ghost Human', () => new Promise<void>(resolve => {
            creatureService.generateCreature('Human', ['Ghost']).subscribe((creature) => {
                expect(creature.name).toBe('Human');
                expect(creature.templates).toEqual(['Ghost']);
                expect(creature.summary).toBe('Ghost Human');
                resolve();
            });
        }));

        const randomValidations = [
            { name: 'no filters', templates: [], cr: '', alignment: '', type: '', valid: true },
            { name: 'None template', templates: ['None'], cr: '', alignment: '', type: '', valid: true },
            { name: 'None, None templates', templates: ['None', 'None'], cr: '', alignment: '', type: '', valid: true },
            { name: 'Ghost, Ghost templates', templates: ['Ghost', 'Ghost'], cr: '', alignment: '', type: '', valid: false },
            { name: 'CR 5', templates: [], cr: '5', alignment: '', type: '', valid: true },
            { name: 'Neutral Evil', templates: [], cr: '', alignment: 'Neutral Evil', type: '', valid: true },
            { name: 'Aberration', templates: [], cr: '', alignment: '', type: 'Aberration', valid: true },
            { name: 'CR 5, Neutral Evil, Aberration', templates: [], cr: '5', alignment: 'Neutral Evil', type: 'Aberration', valid: true },
            { name: 'CR 5, Neutral Evil, Aberration, None template', templates: ['None'], cr: '5', alignment: 'Neutral Evil', type: 'Aberration', valid: true },
            { name: 'Fiendish Creature, Neutral Good', templates: ['Fiendish Creature'], cr: '', alignment: 'Neutral Good', type: '', valid: false },
        ];

        randomValidations.forEach(test => {
            it(`validates a random creature with ${test.name} as ${test.valid}`, () => new Promise<void>(resolve => {
                creatureService.validateRandom(test.templates, test.cr, test.alignment, test.type).subscribe((validity) => {
                    expect(validity).toBe(test.valid);
                    resolve();
                });
            }));
        });

        it('generates a random creature with no filters', () => new Promise<void>(resolve => {
            creatureService.generateRandom([], '', '', '').subscribe((creature) => {
                expect(creature.name).toBeTruthy();
                expect(creature.summary).toBeTruthy();
                resolve();
            });
        }));

        it('generates a random CR 5, Neutral Evil Aberration, with any templates', () => new Promise<void>(resolve => {
            creatureService.generateRandom([], '5', 'Neutral Evil', 'Aberration').subscribe((creature) => {
                expect(creature.challengeRating).toBe('5');
                expect(creature.alignment.full).toBe('Neutral Evil');
                expect(creature.type.allTypes).toContain('Aberration');
                resolve();
            });
        }));

        it('generates a random CR 5, Neutral Evil Aberration, with no template', () => new Promise<void>(resolve => {
            creatureService.generateRandom(['None'], '5', 'Neutral Evil', 'Aberration').subscribe((creature) => {
                expect(creature.challengeRating).toBe('5');
                expect(creature.alignment.full).toBe('Neutral Evil');
                expect(creature.type.allTypes).toContain('Aberration');
                expect(creature.templates).toEqual([]);
                resolve();
            });
        }));

        it('generates a random creature with the Ghost template', () => new Promise<void>(resolve => {
            creatureService.generateRandom(['Ghost'], '', '', '').subscribe((creature) => {
                expect(creature.templates).toEqual(['Ghost']);
                resolve();
            });
        }));
    });
});
