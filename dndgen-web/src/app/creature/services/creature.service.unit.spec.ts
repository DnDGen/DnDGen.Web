import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CreatureService } from './creature.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { of } from 'rxjs';
import '@angular/compiler';
import { CreatureGenViewModel } from '../models/creaturegen-view-model.model';
import { Creature } from '../models/creature.model';

describe('Creature Service', () => {
    describe('unit', () => {
        let creatureService: CreatureService;
        let httpClientSpy: { get: ReturnType<typeof vi.fn> };

        beforeEach(() => {
            httpClientSpy = { get: vi.fn() };

            creatureService = new CreatureService(httpClientSpy as unknown as HttpClient);
        });

        function templateParams(templates: string[]): HttpParams {
            let params = new HttpParams();
            templates.forEach(template => params = params.append('templates', template));
            return params;
        }

        const templateCases = [
            { name: 'no templates', templates: [] },
            { name: '1 template', templates: ['my template'] },
            { name: '2 templates', templates: ['my template', 'my other template'] },
            { name: '2 templates in the other order', templates: ['my other template', 'my template'] },
            { name: '3 templates', templates: ['my template', 'my other template', 'my third template'] },
            { name: 'a repeated template', templates: ['my template', 'my template'] },
        ];

        it('gets the creature view model', () => new Promise<void>(resolve => {
            const model = new CreatureGenViewModel(
                ['creature 1', 'creature 2'],
                ['template 1', 'template 2'],
                ['alignment 1', 'alignment 2'],
                ['creature type 1', 'creature type 2'],
                ['challenge rating 1', 'challenge rating 2'],
            );
            httpClientSpy.get.mockReturnValue(of(model));

            creatureService.getViewModel().subscribe((viewmodel) => {
                expect(viewmodel).toBe(model);
                expect(httpClientSpy.get).toHaveBeenCalledWith('https://web.dndgen.com/api/v1/creature/viewmodel');
                resolve();
            });
        }));

        templateCases.forEach(test => {
            it(`validates a valid creature - ${test.name}`, () => new Promise<void>(resolve => {
                httpClientSpy.get.mockReturnValue(of(true));

                creatureService.validateCreature('my creature', test.templates).subscribe((validity) => {
                    expect(validity).toBe(true);
                    expect(httpClientSpy.get).toHaveBeenCalledWith(
                        'https://creature.dndgen.com/api/v1/creature/my%20creature/validate',
                        { params: templateParams(test.templates) });
                    resolve();
                });
            }));

            it(`validates an invalid creature - ${test.name}`, () => new Promise<void>(resolve => {
                httpClientSpy.get.mockReturnValue(of(false));

                creatureService.validateCreature('my creature', test.templates).subscribe((validity) => {
                    expect(validity).toBe(false);
                    expect(httpClientSpy.get).toHaveBeenCalledWith(
                        'https://creature.dndgen.com/api/v1/creature/my%20creature/validate',
                        { params: templateParams(test.templates) });
                    resolve();
                });
            }));

            it(`generates a creature - ${test.name}`, () => new Promise<void>(resolve => {
                const expected = new Creature('my creature summary');
                httpClientSpy.get.mockReturnValue(of(expected));

                creatureService.generateCreature('my creature', test.templates).subscribe((creature) => {
                    expect(creature).toBe(expected);
                    expect(httpClientSpy.get).toHaveBeenCalledWith(
                        'https://creature.dndgen.com/api/v1/creature/my%20creature/generate',
                        { params: templateParams(test.templates) });
                    resolve();
                });
            }));

            it(`validates a valid random creature - ${test.name}`, () => new Promise<void>(resolve => {
                httpClientSpy.get.mockReturnValue(of(true));

                creatureService.validateRandom(test.templates, '', '', '').subscribe((validity) => {
                    expect(validity).toBe(true);
                    expect(httpClientSpy.get).toHaveBeenCalledWith(
                        'https://creature.dndgen.com/api/v1/creature/validate',
                        { params: templateParams(test.templates) });
                    resolve();
                });
            }));

            it(`generates a random creature - ${test.name}`, () => new Promise<void>(resolve => {
                const expected = new Creature('my creature summary');
                httpClientSpy.get.mockReturnValue(of(expected));

                creatureService.generateRandom(test.templates, '', '', '').subscribe((creature) => {
                    expect(creature).toBe(expected);
                    expect(httpClientSpy.get).toHaveBeenCalledWith(
                        'https://creature.dndgen.com/api/v1/creature/generate',
                        { params: templateParams(test.templates) });
                    resolve();
                });
            }));
        });

        const creatureNames = [
            { name: 'Human', encoded: 'Human' },
            { name: 'Hill Giant', encoded: 'Hill%20Giant' },
            { name: 'Lycanthrope, Dire Wolf (Dire Werewolf, Natural)', encoded: 'Lycanthrope%2C%20Dire%20Wolf%20(Dire%20Werewolf%2C%20Natural)' },
            { name: 'Yuan-ti Halfblood (Snake Head, Snake Tail instead of Human Legs)', encoded: 'Yuan-ti%20Halfblood%20(Snake%20Head%2C%20Snake%20Tail%20instead%20of%20Human%20Legs)' },
        ];

        creatureNames.forEach(test => {
            it(`validates the creature named ${test.name}`, () => new Promise<void>(resolve => {
                httpClientSpy.get.mockReturnValue(of(true));

                creatureService.validateCreature(test.name, []).subscribe((validity) => {
                    expect(validity).toBe(true);
                    expect(httpClientSpy.get).toHaveBeenCalledWith(
                        `https://creature.dndgen.com/api/v1/creature/${test.encoded}/validate`,
                        { params: new HttpParams() });
                    resolve();
                });
            }));

            it(`generates the creature named ${test.name}`, () => new Promise<void>(resolve => {
                const expected = new Creature('my creature summary');
                httpClientSpy.get.mockReturnValue(of(expected));

                creatureService.generateCreature(test.name, []).subscribe((creature) => {
                    expect(creature).toBe(expected);
                    expect(httpClientSpy.get).toHaveBeenCalledWith(
                        `https://creature.dndgen.com/api/v1/creature/${test.encoded}/generate`,
                        { params: new HttpParams() });
                    resolve();
                });
            }));
        });

        const filterCases = [
            { name: 'no filters', cr: '', alignment: '', type: '', params: new HttpParams() },
            { name: 'challenge rating', cr: 'my cr', alignment: '', type: '', params: new HttpParams().set('cr', 'my cr') },
            { name: 'alignment', cr: '', alignment: 'my alignment', type: '', params: new HttpParams().set('alignment', 'my alignment') },
            { name: 'creature type', cr: '', alignment: '', type: 'my type', params: new HttpParams().set('type', 'my type') },
            {
                name: 'all filters',
                cr: 'my cr',
                alignment: 'my alignment',
                type: 'my type',
                params: new HttpParams().set('cr', 'my cr').set('alignment', 'my alignment').set('type', 'my type')
            },
            {
                name: 'all filters and templates',
                cr: 'my cr',
                alignment: 'my alignment',
                type: 'my type',
                templates: ['my template', 'my other template'],
                params: templateParams(['my template', 'my other template']).set('cr', 'my cr').set('alignment', 'my alignment').set('type', 'my type')
            },
        ];

        filterCases.forEach(test => {
            it(`validates a valid random creature - ${test.name}`, () => new Promise<void>(resolve => {
                httpClientSpy.get.mockReturnValue(of(true));

                creatureService.validateRandom(test.templates ?? [], test.cr, test.alignment, test.type).subscribe((validity) => {
                    expect(validity).toBe(true);
                    expect(httpClientSpy.get).toHaveBeenCalledWith('https://creature.dndgen.com/api/v1/creature/validate', { params: test.params });
                    resolve();
                });
            }));

            it(`validates an invalid random creature - ${test.name}`, () => new Promise<void>(resolve => {
                httpClientSpy.get.mockReturnValue(of(false));

                creatureService.validateRandom(test.templates ?? [], test.cr, test.alignment, test.type).subscribe((validity) => {
                    expect(validity).toBe(false);
                    expect(httpClientSpy.get).toHaveBeenCalledWith('https://creature.dndgen.com/api/v1/creature/validate', { params: test.params });
                    resolve();
                });
            }));

            it(`generates a random creature - ${test.name}`, () => new Promise<void>(resolve => {
                const expected = new Creature('my creature summary');
                httpClientSpy.get.mockReturnValue(of(expected));

                creatureService.generateRandom(test.templates ?? [], test.cr, test.alignment, test.type).subscribe((creature) => {
                    expect(creature).toBe(expected);
                    expect(httpClientSpy.get).toHaveBeenCalledWith('https://creature.dndgen.com/api/v1/creature/generate', { params: test.params });
                    resolve();
                });
            }));
        });
    });
});
