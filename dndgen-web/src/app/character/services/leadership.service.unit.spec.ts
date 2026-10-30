import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LeadershipService } from './leadership.service'
import { HttpClient, HttpParams } from '@angular/common/http';
import { of } from 'rxjs';
import '@angular/compiler';
import { TestBed } from '@angular/core/testing';
import { Character } from '../models/character.model';
import { Leadership } from '../models/leadership.model';
import { FollowerQuantities } from '../models/follower-quantities.model';
import { TestHelper } from '../../test-helper';

describe('Leadership Service', () => {
    describe('unit', () => {
        let leadershipService: LeadershipService;
        let httpClientSpy: { get: ReturnType<typeof vi.fn> };
    
        beforeEach(() => {
            httpClientSpy = { get: vi.fn() };
    
            leadershipService = new LeadershipService(httpClientSpy as unknown as HttpClient);
        });

        it('generates leadership', () => new Promise<void>(resolve => {
            const expected = new Leadership(
                42, 
                ['super awesome', 'a little lazy'],
                600,
                new FollowerQuantities(1337, 1336, 96, 783, 8245, 9));
            httpClientSpy.get.mockReturnValue(of(expected));
            const params = new HttpParams()
                .set('leaderCharismaBonus', 90210)
                .set('leaderAnimal', 'leader animal');
    
            leadershipService.generate(9266, 90210, 'leader animal').subscribe((leadership) => {
                expect(leadership).toBe(expected);
                expect(httpClientSpy.get).toHaveBeenCalledWith(
                    'https://character.dndgen.com/api/v1/leadership/level/9266/generate',
                    { params: params });
                resolve();
            });
        }));

        it('generates leadership without animal', () => new Promise<void>(resolve => {
            const expected = new Leadership(
                42, 
                ['super awesome', 'a little lazy'],
                600,
                new FollowerQuantities(1337, 1336, 96, 783, 8245, 9));
            httpClientSpy.get.mockReturnValue(of(expected));
            const params = new HttpParams()
                .set('leaderCharismaBonus', 90210)
                .set('leaderAnimal', '');
    
            leadershipService.generate(9266, 90210, '').subscribe((leadership) => {
                expect(leadership).toBe(expected);
                expect(httpClientSpy.get).toHaveBeenCalledWith(
                    'https://character.dndgen.com/api/v1/leadership/level/9266/generate',
                    { params: params });
                resolve();
            });
        }));

        it('generates cohort', () => new Promise<void>(resolve => {
            const expected = new Character('my cohort summary');
            httpClientSpy.get.mockReturnValue(of(expected));
            const params = new HttpParams()
                .set('leaderLevel', 9266)
                .set('leaderAlignment', 'leader alignment')
                .set('leaderClassName', 'leader class');
    
            leadershipService.generateCohort(9266, 90210, 'leader alignment', 'leader class').subscribe((cohort) => {
                expect(cohort).toBe(expected);
                expect(httpClientSpy.get).toHaveBeenCalledWith(
                    'https://character.dndgen.com/api/v1/cohort/score/90210/generate',
                    { params: params });
                resolve();
            });
        }));

        it('generates no cohort', () => new Promise<void>(resolve => {
            httpClientSpy.get.mockReturnValue(of(''));
            const params = new HttpParams()
                .set('leaderLevel', 9266)
                .set('leaderAlignment', 'leader alignment')
                .set('leaderClassName', 'leader class');
    
            leadershipService.generateCohort(9266, 90210, 'leader alignment', 'leader class').subscribe((cohort) => {
                expect(cohort).toBeFalsy();
                expect(httpClientSpy.get).toHaveBeenCalledWith(
                    'https://character.dndgen.com/api/v1/cohort/score/90210/generate',
                    { params: params });
                resolve();
            });
        }));

        it('generates follower', () => new Promise<void>(resolve => {
            const expected = new Character('my follower summary');
            httpClientSpy.get.mockReturnValue(of(expected));
            const params = new HttpParams()
                .set('leaderAlignment', 'leader alignment')
                .set('leaderClassName', 'leader class');
    
            leadershipService.generateFollower(9266, 'leader alignment', 'leader class').subscribe((follower) => {
                expect(follower).toBe(expected);
                expect(httpClientSpy.get).toHaveBeenCalledWith(
                    'https://character.dndgen.com/api/v1/follower/level/9266/generate',
                    { params: params });
                resolve();
            });
        }));
    });
});