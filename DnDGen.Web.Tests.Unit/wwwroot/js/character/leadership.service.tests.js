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
        var promise = leadershipService.generate(9266, 90210, 'animal');

        expect(promise).not.toBeNull();

        var parameters = {
            leaderCharismaBonus: 90210,
            leaderAnimal: 'animal',
        };

        expect(promiseServiceMock.getPromise).toHaveBeenCalledWith('https://character.dndgen.com/api/v1/leadership/level/9266/generate', parameters);
    });

    it('generates cohort', function () {
        var promise = leadershipService.generateCohort(9266, 90210, 'alignment', 'class');
        expect(promise).not.toBeNull();

        var parameters = {
            leaderLevel: 90210,
            leaderAlignment: 'alignment',
            leaderClass: 'class',
        };

        expect(promiseServiceMock.getPromise).toHaveBeenCalledWith('https://character.dndgen.com/api/v1/cohort/score/9266/generate', parameters);
    });

    it('generates follower', function () {
        var promise = leadershipService.generateFollower(9266, 'alignment', 'class');
        expect(promise).not.toBeNull();

        var parameters = {
            leaderAlignment: 'alignment',
            leaderClass: 'class',
        };

        expect(promiseServiceMock.getPromise).toHaveBeenCalledWith('https://character.dndgen.com/api/v1/follower/level/9266/generate', parameters);
    });
});