'use strict'

describe('Leadership Service', function () {
    var leadershipService;
    var promiseServiceMock;
    var urlRegex;

    beforeEach(module('app.character', function($provide) {
        promiseServiceMock = {};
        promiseServiceMock.getPromise = jasmine.createSpy();

        $provide.value('promiseService', promiseServiceMock);
    }));

    beforeEach(inject(function (_leadershipService_) {
        leadershipService = _leadershipService_;
    }));

    beforeEach(function () {
        urlRegex = /^\/Characters\/Leadership\/\w+\?\w+=(\w|%20)+(&\w+=(\w|%20)+)*\r?$/;
    });

    it('generates leadership', function () {
        var promise = leadershipService.generate(9266, 90210, 'animal');
        expect(promise).not.toBeNull();

        var calledUrl = promiseServiceMock.getPromise.calls.mostRecent().args[0];
        expect(calledUrl).toMatch(urlRegex);
        expect(calledUrl).toMatch(/^\/Characters\/Leadership\/Generate\?/);
        expect(calledUrl).toMatch(/leaderLevel=9266/);
        expect(calledUrl).toMatch(/leaderCharismaBonus=90210/);
        expect(calledUrl).toMatch(/leaderAnimal=animal/);
    });

    it('encodes the leadership uri', function () {
        var promise = leadershipService.generate(9266, 90210, 'leader animal');
        expect(promise).not.toBeNull();

        var calledUrl = promiseServiceMock.getPromise.calls.mostRecent().args[0];
        expect(calledUrl).toMatch(urlRegex);
        expect(calledUrl).toMatch(/^\/Characters\/Leadership\/Generate\?/);
        expect(calledUrl).toMatch(/leaderLevel=9266/);
        expect(calledUrl).toMatch(/leaderCharismaBonus=90210/);
        expect(calledUrl).toMatch(/leaderAnimal=leader%20animal/);
    });

    it('generates cohort', function () {
        var promise = leadershipService.generateCohort(9266, 90210, 'alignment', 'class');
        expect(promise).not.toBeNull();

        var calledUrl = promiseServiceMock.getPromise.calls.mostRecent().args[0];
        expect(calledUrl).toMatch(urlRegex);
        expect(calledUrl).toMatch(/^\/Characters\/Leadership\/Cohort\?/);
        expect(calledUrl).toMatch(/leaderLevel=9266/);
        expect(calledUrl).toMatch(/cohortScore=90210/);
        expect(calledUrl).toMatch(/leaderAlignment=alignment/);
        expect(calledUrl).toMatch(/leaderClass=class/)
    });

    it('encodes the cohort uri', function () {
        var promise = leadershipService.generateCohort(9266, 90210, 'leader alignment', 'leader class');
        expect(promise).not.toBeNull();

        var calledUrl = promiseServiceMock.getPromise.calls.mostRecent().args[0];
        expect(calledUrl).toMatch(urlRegex);
        expect(calledUrl).toMatch(/^\/Characters\/Leadership\/Cohort\?/);
        expect(calledUrl).toMatch(/leaderLevel=9266/);
        expect(calledUrl).toMatch(/cohortScore=90210/);
        expect(calledUrl).toMatch(/leaderAlignment=leader%20alignment/);
        expect(calledUrl).toMatch(/leaderClass=leader%20class/)
    });

    it('generates follower', function () {
        var promise = leadershipService.generateFollower(9266, 'alignment', 'class');
        expect(promise).not.toBeNull();

        var calledUrl = promiseServiceMock.getPromise.calls.mostRecent().args[0];
        expect(calledUrl).toMatch(urlRegex);
        expect(calledUrl).toMatch(/^\/Characters\/Leadership\/Follower\?/);
        expect(calledUrl).toMatch(/followerLevel=9266/);
        expect(calledUrl).toMatch(/leaderAlignment=alignment/);
        expect(calledUrl).toMatch(/leaderClass=class/)
    });

    it('encodes the follower uri', function () {
        var promise = leadershipService.generateFollower(9266, 'leader alignment', 'leader class');
        expect(promise).not.toBeNull();

        var calledUrl = promiseServiceMock.getPromise.calls.mostRecent().args[0];
        expect(calledUrl).toMatch(urlRegex);
        expect(calledUrl).toMatch(/^\/Characters\/Leadership\/Follower\?/);
        expect(calledUrl).toMatch(/followerLevel=9266/);
        expect(calledUrl).toMatch(/leaderAlignment=leader%20alignment/);
        expect(calledUrl).toMatch(/leaderClass=leader%20class/)
    });
});