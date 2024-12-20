import { LeadershipService } from './leadership.service'
import { HttpClient, HttpParams } from '@angular/common/http';
import { of } from 'rxjs';
import '@angular/compiler';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { Character } from '../models/character.model';
import { Leadership } from '../models/leadership.model';
import { FollowerQuantities } from '../models/followerQuantities.model';
import { TestHelper } from '../../testHelper.spec';

describe('Leadership Service', () => {
    describe('unit', () => {
        let leadershipService: LeadershipService;
        let httpClientSpy: jasmine.SpyObj<HttpClient>;
    
        beforeEach(() => {
            httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    
            leadershipService = new LeadershipService(httpClientSpy);
        });

        it('generates leadership', done => {
            const expected = new Leadership(
                42, 
                ['super awesome', 'a little lazy'],
                600,
                new FollowerQuantities(1337, 1336, 96, 783, 8245, 9));
            httpClientSpy.get.and.returnValue(of(expected));
            const params = new HttpParams()
                .set('leaderCharismaBonus', 90210)
                .set('leaderAnimal', 'leader animal');
    
            leadershipService.generate(9266, 90210, 'leader animal').subscribe((leadership) => {
                expect(leadership).toBe(expected);
                expect(httpClientSpy.get).toHaveBeenCalledWith(
                    'https://character.dndgen.com/api/v1/leadership/level/9266/generate',
                    { params: params });
                done();
            });
        });

        it('generates leadership without animal', done => {
            const expected = new Leadership(
                42, 
                ['super awesome', 'a little lazy'],
                600,
                new FollowerQuantities(1337, 1336, 96, 783, 8245, 9));
            httpClientSpy.get.and.returnValue(of(expected));
            const params = new HttpParams()
                .set('leaderCharismaBonus', 90210)
                .set('leaderAnimal', '');
    
            leadershipService.generate(9266, 90210, '').subscribe((leadership) => {
                expect(leadership).toBe(expected);
                expect(httpClientSpy.get).toHaveBeenCalledWith(
                    'https://character.dndgen.com/api/v1/leadership/level/9266/generate',
                    { params: params });
                done();
            });
        });

        it('generates cohort', done => {
            const expected = new Character('my cohort summary');
            httpClientSpy.get.and.returnValue(of(expected));
            const params = new HttpParams()
                .set('leaderLevel', 9266)
                .set('leaderAlignment', 'leader alignment')
                .set('leaderClassName', 'leader class');
    
            leadershipService.generateCohort(9266, 90210, 'leader alignment', 'leader class').subscribe((cohort) => {
                expect(cohort).toBe(expected);
                expect(httpClientSpy.get).toHaveBeenCalledWith(
                    'https://character.dndgen.com/api/v1/cohort/score/90210/generate',
                    { params: params });
                done();
            });
        });

        it('generates no cohort', done => {
            httpClientSpy.get.and.returnValue(of(''));
            const params = new HttpParams()
                .set('leaderLevel', 9266)
                .set('leaderAlignment', 'leader alignment')
                .set('leaderClassName', 'leader class');
    
            leadershipService.generateCohort(9266, 90210, 'leader alignment', 'leader class').subscribe((cohort) => {
                expect(cohort).toBeFalsy();
                expect(httpClientSpy.get).toHaveBeenCalledWith(
                    'https://character.dndgen.com/api/v1/cohort/score/90210/generate',
                    { params: params });
                done();
            });
        });

        it('generates follower', done => {
            const expected = new Character('my follower summary');
            httpClientSpy.get.and.returnValue(of(expected));
            const params = new HttpParams()
                .set('leaderAlignment', 'leader alignment')
                .set('leaderClassName', 'leader class');
    
            leadershipService.generateFollower(9266, 'leader alignment', 'leader class').subscribe((follower) => {
                expect(follower).toBe(expected);
                expect(httpClientSpy.get).toHaveBeenCalledWith(
                    'https://character.dndgen.com/api/v1/follower/level/9266/generate',
                    { params: params });
                done();
            });
        });
    });
    
    describe('integration', () => {
        let leadershipService: LeadershipService;
    
        beforeEach(async () => {
            await TestHelper.configureTestBed();
        
            leadershipService = TestBed.inject(LeadershipService);
        });

        it('generates leadership', waitForAsync(() => {
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
            });
        }));

        it('generates leadership without animal', waitForAsync(() => {
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
            });
        }));

        it('generates poor leadership', waitForAsync(() => {
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
            });
        }));
    
        it('generates cohort', waitForAsync(() => {
            leadershipService
                .generateCohort(15, 20, 'Lawful Good', 'Paladin')
                .subscribe((cohort) => {
                    expect(cohort).toBeTruthy();
                    expect(cohort!.summary).toBeTruthy();
                });
        }));
    
        it('generates no cohort', waitForAsync(() => {
            leadershipService
                .generateCohort(6, 1, 'Neutral Good', 'Fighter')
                .subscribe((cohort) => {
                    expect(cohort).toBeNull();
                });
        }));
    
        const followerLevels = [1,2,3,4,5,6];

        followerLevels.forEach(test => {
            it(`generates follower - level ${test}`, waitForAsync(() => {
                leadershipService
                    .generateFollower(test, 'Lawful Good', 'Paladin')
                    .subscribe((follower) => {
                        expect(follower).toBeTruthy();
                        expect(follower.summary).toBeTruthy();
                        expect(follower.class.level).toBe(test);
                    });
            }));
        });
    });
});