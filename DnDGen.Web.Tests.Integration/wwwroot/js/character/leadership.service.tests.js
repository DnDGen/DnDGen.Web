'use strict'

describe('Leadership Service Integration', function () {
    var leadershipService;

    beforeEach(module('app.character'));

    beforeEach(inject(function (_leadershipService_) {
        leadershipService = _leadershipService_;
    }));

    it('generates leadership', function () {
        var promise = leadershipService.generate(9266, 90210, 'animal');

        expect(promise).not.toBeNull();

        //TODO: Resolve the promise
        //TOdO: Check the parameters, verify it worked
        expect(true).toBeFalsy();
    });

    it('generates cohort', function () {
        var promise = leadershipService.generateCohort(9266, 90210, 'alignment', 'class');
        expect(promise).not.toBeNull();

        //TODO: Resolve the promise
        //TOdO: Check the parameters, verify it worked
        expect(true).toBeFalsy();
    });

    it('generates follower', function () {
        var promise = leadershipService.generateFollower(9266, 'alignment', 'class');
        expect(promise).not.toBeNull();

        //TODO: Resolve the promise
        //TOdO: Check the parameters, verify it worked
        expect(true).toBeFalsy();
    });
});