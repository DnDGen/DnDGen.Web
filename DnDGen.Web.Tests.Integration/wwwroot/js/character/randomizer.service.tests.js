'use strict'

describe('Randomizer Service Integration', function () {
    var randomizerService;

    beforeEach(module('app.character'));

    beforeEach(inject(function (_randomizerService_) {
        randomizerService = _randomizerService_;
    }));

    it('verifies randomizers are compatible', function () {
        var promise = randomizerService.verify(
            "any alignment",
            "set alignment",
            "any class",
            "set class",
            "any level",
            1,
            false,
            "any base race",
            "set base race",
            "any metarace",
            true,
            "set metarace");

        expect(promise).not.toBeNull();

        //TODO: Resolve the promise
        //TOdO: Check the parameters, verify it worked
        expect(true).toBeFalsy();
    });
});