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
        var promise = characterService.generate('client',
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
            clientId: 'client',
            AlignmentRandomizerType: 'any alignment',
            ClassNameRandomizerType: 'any class',
            LevelRandomizerType: 'any level',
            BaseRaceRandomizerType: 'any base race',
            MetaraceRandomizerType: 'any metarace',
            AbilitiesRandomizerType: 'raw abilities',
            SetAlignment: 'set alignment',
            SetClassName: 'set class',
            SetLevel: 1,
            AllowLevelAdjustments: false,
            SetBaseRace: 'set base race',
            ForceMetarace: true,
            SetMetarace: 'set metarace',
            SetStrength: 2,
            SetConstitution: 3,
            SetDexterity: 4,
            SetIntelligence: 5,
            SetWisdom: 6,
            SetCharisma: 7,
            AllowAbilityAdjustments: false,
        };

        expect(promiseServiceMock.getPromise).toHaveBeenCalledWith('/Character/Generate', parameters);
    });
});