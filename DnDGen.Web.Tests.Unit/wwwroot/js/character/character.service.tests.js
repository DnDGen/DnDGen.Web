'use strict'

describe('Character Service', function () {
    var characterService;
    var promiseServiceMock;

    beforeEach(module('app.character', function($provide) {
        promiseServiceMock = {};
        promiseServiceMock.getPromise = jasmine.createSpy();

        $provide.value('promiseService', promiseServiceMock);
    }));

    beforeEach(inject(function (_characterService_) {
        characterService = _characterService_;
    }));

    it('generates character', function () {
        var promise = characterService.generate(
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
            "set metarace",
            "raw abilities",
            2,
            3,
            4,
            5,
            6,
            7,
            false);

        expect(promise).not.toBeNull();

        var parameters = {
            alignmentRandomizerType: 'any alignment',
            classNameRandomizerType: 'any class',
            levelRandomizerType: 'any level',
            baseRaceRandomizerType: 'any base race',
            metaraceRandomizerType: 'any metarace',
            abilitiesRandomizerType: 'raw abilities',
            setAlignment: 'set alignment',
            setClassName: 'set class',
            setLevel: 1,
            allowLevelAdjustments: false,
            setBaseRace: 'set base race',
            forceMetarace: true,
            setMetarace: 'set metarace',
            setStrength: 2,
            setConstitution: 3,
            setDexterity: 4,
            setIntelligence: 5,
            setWisdom: 6,
            setCharisma: 7,
            allowAbilityAdjustments: false,
        };

        expect(promiseServiceMock.getPromise).toHaveBeenCalledWith('https://character.dndgen.com/api/v1/character/generate', parameters);
    });
});