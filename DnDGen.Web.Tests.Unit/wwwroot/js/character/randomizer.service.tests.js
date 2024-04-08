'use strict'

describe('Randomizer Service', function () {
    var randomizerService;
    var promiseServiceMock;

    beforeEach(module('app.character', function($provide) {
        promiseServiceMock = {};
        promiseServiceMock.getPromise = jasmine.createSpy();

        $provide.value('promiseService', promiseServiceMock);
    }));

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

        var parameters = {
            alignmentRandomizerType: 'any alignment',
            classNameRandomizerType: 'any class',
            levelRandomizerType: 'any level',
            baseRaceRandomizerType: 'any base race',
            metaraceRandomizerType: 'any metarace',
            setAlignment: 'set alignment',
            setClassName: 'set class',
            setLevel: 1,
            allowLevelAdjustments: false,
            setBaseRace: 'set base race',
            forceMetarace: true,
            setMetarace: 'set metarace',
        };

        expect(promiseServiceMock.getPromise).toHaveBeenCalledWith('https://character.dndgen.com/api/v1/character/validate', parameters);
    });
});