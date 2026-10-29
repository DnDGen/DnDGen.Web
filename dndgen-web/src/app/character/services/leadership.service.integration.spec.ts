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
    describe('integration', () => {
        let leadershipService: LeadershipService;
    
        beforeEach(async () => {
            await TestHelper.configureTestBed();
        
            leadershipService = TestBed.inject(LeadershipService);
        });

        it('generates leadership', () => new Promise<void>(resolve => {
            leadershipService.generate(15, 5, 'Heavy warhorse').subscribe((leadership) => {
                expect(leadership).toBeTruthy();
                expect(leadership.score).toBeCloseTo(20, -1);
                expect(leadership.cohortScore).toBeCloseTo(leadership.score, -1);
                expect(leadership.followerQuantities).toBeTruthy();
                expect(leadership.followerQuantities.level1).toBeGreaterThan(0);
                expect(leadership.followerQuantities.level2).toBeGreaterThanOrEqual(0);
                expect(leadership.followerQuantities.level2).toBeLessThanOrEqual(leadership.followerQuantities.level1);
                expect(leadership.followerQuantities.level3).toBeGreaterThanOrEqual(0);
                expect(leadership.followerQuantities.level3).toBeLessThanOrEqual(leadership.followerQuantities.level2);
                expect(leadership.followerQuantities.level4).toBeGreaterThanOrEqual(0);
                expect(leadership.followerQuantities.level4).toBeLessThanOrEqual(leadership.followerQuantities.level3);
                expect(leadership.followerQuantities.level5).toBeGreaterThanOrEqual(0);
                expect(leadership.followerQuantities.level5).toBeLessThanOrEqual(leadership.followerQuantities.level4);
                expect(leadership.followerQuantities.level6).toBeGreaterThanOrEqual(0);
                expect(leadership.followerQuantities.level6).toBeLessThanOrEqual(leadership.followerQuantities.level5);

                resolve();
            });
        }));

        it('generates leadership without animal', () => new Promise<void>(resolve => {
            leadershipService.generate(15, 5, '').subscribe((leadership) => {
                expect(leadership).toBeTruthy();
                expect(leadership.score).toBeCloseTo(20, -1);
                expect(leadership.cohortScore).toBeCloseTo(leadership.score, -1);
                expect(leadership.followerQuantities).toBeTruthy();
                expect(leadership.followerQuantities.level1).toBeGreaterThan(0);
                expect(leadership.followerQuantities.level2).toBeGreaterThanOrEqual(0);
                expect(leadership.followerQuantities.level2).toBeLessThanOrEqual(leadership.followerQuantities.level1);
                expect(leadership.followerQuantities.level3).toBeGreaterThanOrEqual(0);
                expect(leadership.followerQuantities.level3).toBeLessThanOrEqual(leadership.followerQuantities.level2);
                expect(leadership.followerQuantities.level4).toBeGreaterThanOrEqual(0);
                expect(leadership.followerQuantities.level4).toBeLessThanOrEqual(leadership.followerQuantities.level3);
                expect(leadership.followerQuantities.level5).toBeGreaterThanOrEqual(0);
                expect(leadership.followerQuantities.level5).toBeLessThanOrEqual(leadership.followerQuantities.level4);
                expect(leadership.followerQuantities.level6).toBeGreaterThanOrEqual(0);
                expect(leadership.followerQuantities.level6).toBeLessThanOrEqual(leadership.followerQuantities.level5);

                resolve();
            });
        }));

        it('generates poor leadership', () => new Promise<void>(resolve => {
            leadershipService.generate(6, -5, 'Heavy warhorse').subscribe((leadership) => {
                expect(leadership).toBeTruthy();
                expect(leadership.score).toBeCloseTo(1, -1);
                expect(leadership.cohortScore).toBeCloseTo(leadership.score, -2);
                expect(leadership.followerQuantities).toBeTruthy();
                expect(leadership.followerQuantities.level1).toEqual(0);
                expect(leadership.followerQuantities.level2).toEqual(0);
                expect(leadership.followerQuantities.level3).toEqual(0);
                expect(leadership.followerQuantities.level4).toEqual(0);
                expect(leadership.followerQuantities.level5).toEqual(0);
                expect(leadership.followerQuantities.level6).toEqual(0);

                resolve();
            });
        }));
    
        it('generates cohort', () => new Promise<void>(resolve => {
            leadershipService
                .generateCohort(15, 20, 'Lawful Good', 'Paladin')
                .subscribe((cohort) => {
                    expect(cohort).toBeTruthy();
                    expect(cohort!.summary).toBeTruthy();

                    resolve();
                });
        }));
    
        it('generates no cohort', () => new Promise<void>(resolve => {
            leadershipService
                .generateCohort(6, 1, 'Neutral Good', 'Fighter')
                .subscribe((cohort) => {
                    expect(cohort).toBeNull();

                    resolve();
                });
        }));
    
        const followerLevels = [1,2,3,4,5,6];

        followerLevels.forEach(test => {
            it(`generates follower - level ${test}`, () => new Promise<void>(resolve => {
                leadershipService
                    .generateFollower(test, 'Lawful Good', 'Paladin')
                    .subscribe((follower) => {
                        expect(follower).toBeTruthy();
                        expect(follower.summary).toBeTruthy();
                        expect(follower.class.level).toBe(test);

                        resolve();
                    });
            }));
        });
    });
});