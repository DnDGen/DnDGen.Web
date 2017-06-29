'use strict'

describe('Leadership Service', function () {
    var leadershipService;
    var promiseServiceMock;

    beforeEach(module('app.character', function($provide) {
        promiseServiceMock = {};
        promiseServiceMock.getPromise = jasmine.createSpy();

        $provide.value('promiseService', promiseServiceMock);
    }));

    beforeEach(inject(function (_leadershipService_) {
        leadershipService = _leadershipService_;
    }));

    it('generates leadership', function () {
        var promise = leadershipService.generate('client', 9266, 90210, 'animal');

        expect(promise).not.toBeNull();

        var parameters = {
            clientId: 'client',
            leaderLevel: 9266,
            leaderCharismaBonus: 90210,
            leaderAnimal: 'animal',
        };

        expect(promiseServiceMock.getPromise).toHaveBeenCalledWith('/Characters/Leadership/Generate', parameters);
    });

    it('generates cohort', function () {
        var promise = leadershipService.generateCohort('client', 9266, 90210, 'alignment', 'class');
        expect(promise).not.toBeNull();

        var parameters = {
            clientId: 'client',
            leaderLevel: 9266,
            cohortScore: 90210,
            leaderAlignment: 'alignment',
            leaderClass: 'class',
        };

        expect(promiseServiceMock.getPromise).toHaveBeenCalledWith('/Characters/Leadership/Cohort', parameters);
    });

    it('generates follower', function () {
        var promise = leadershipService.generateFollower('client', 9266, 'alignment', 'class');
        expect(promise).not.toBeNull();

        var parameters = {
            clientId: 'client',
            followerLevel: 9266,
            leaderAlignment: 'alignment',
            leaderClass: 'class',
        };

        expect(promiseServiceMock.getPromise).toHaveBeenCalledWith('/Characters/Leadership/Follower', parameters);
    });
});