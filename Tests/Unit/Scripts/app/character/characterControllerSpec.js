'use strict'

/// <reference path="../../_resources.js" />

describe('Character Controller', function () {
    var vm;
    var randomizerServiceMock;
    var characterServiceMock;
    var q;
    var bootstrapDataMock;
    var scope;
    var sweetAlertServiceMock;
    var compatible;

    beforeEach(module('app.character'));

    beforeEach(function () {
        bootstrapDataMock = {
            characterModel: {
                AlignmentRandomizerTypes: ["any", "first alignment randomizer type", "second alignment randomizer type", "Set"],
                Alignments: ["first alignment", "second alignment"],
                ClassNameRandomizerTypes: ["any", "first class name randomizer type", "second class name randomizer type", "Set"],
                ClassNames: ["first class name", "second class name"],
                LevelRandomizerTypes: ["any", "first level randomizer type", "second level randomizer type", "Set"],
                BaseRaceRandomizerTypes: ["any", "first base race randomizer type", "second base race randomizer type", "Set"],
                BaseRaces: ["first base race", "second base race"],
                MetaraceRandomizerTypes: ["any", "first metarace randomizer type", "second metarace randomizer type", "Set"],
                Metaraces: ["first metarace", "second metarace"],
                StatsRandomizerTypes: ["raw", "first stats randomizer type", "second stats randomizer type", "Set"]
            }
        };

        randomizerServiceMock = {
            verify: function (alignmentRandomizerType, setAlignment, classNameRandomizerType, setClassName, levelRandomizerType, setLevel, baseRaceRandomizerType, setBaseRace, metaraceRandomizerType, forceMetarace, setMetarace) {
                return getMockedPromise(setLevel, { compatible: compatible });
            }
        };

        characterServiceMock = {
            generate: function (alignmentRandomizerType, setAlignment, classNameRandomizerType, setClassName, levelRandomizerType, setLevel, baseRaceRandomizerType, setBaseRace, metaraceRandomizerType, forceMetarace, setMetarace, statsRandomizerType, setStrength, setConstitution, setDexterity, setIntelligence, setWisdom, setCharisma) {
                if (setClassName == 'wrong')
                    return getMockedPromise(setLevel, { character: null });

                var character = {
                    alignment: setAlignment,
                    className: setClassName,
                    baseRace: setBaseRace
                };

                return getMockedPromise(setLevel, { character: character });
            }
        };

        compatible = true;

        sweetAlertServiceMock = {};
        sweetAlertServiceMock.showError = jasmine.createSpy();
    });

    function getMockedPromise(level, successObject) {
        var deferred = q.defer();

        if (level == 666)
            deferred.reject();
        else
            deferred.resolve(successObject);

        return deferred.promise;
    }

    beforeEach(inject(function ($rootScope, $controller, $q) {
        q = $q;
        scope = $rootScope.$new();

        vm = $controller('Character as vm', {
            $scope: scope,
            bootstrapData: bootstrapDataMock,
            randomizerService: randomizerServiceMock,
            characterService: characterServiceMock,
            sweetAlertService: sweetAlertServiceMock
        });
    }));

    it('has bootstrapped model', function () {
        expect(vm.characterModel).toBe(bootstrapDataMock.characterModel);
    });

    it('has default selected values', function () {
        expect(vm.alignmentRandomizerType).toBe('any');
        expect(vm.setAlignment).toBe('first alignment');
        expect(vm.classNameRandomizerType).toBe('any');
        expect(vm.setClassName).toBe('first class name');
        expect(vm.levelRandomizerType).toBe('any');
        expect(vm.setLevel).toBe(0);
        expect(vm.baseRaceRandomizerType).toBe('any');
        expect(vm.setBaseRace).toBe('first base race');
        expect(vm.metaraceRandomizerType).toBe('any');
        expect(vm.forceMetarace).toBeFalsy();
        expect(vm.setMetarace).toBe('first metarace');
        expect(vm.statsRandomizerType).toBe('raw');
        expect(vm.setStrength).toBe(0);
        expect(vm.setConstitution).toBe(0);
        expect(vm.setDexterity).toBe(0);
        expect(vm.setIntelligence).toBe(0);
        expect(vm.setWisdom).toBe(0);
        expect(vm.setCharisma).toBe(0);
        expect(vm.compatible).toBeFalsy();
    });

    it('has an empty character for results', function () {
        expect(vm.character).toBeNull();
    });

    it('is not generating on load', function () {
        expect(vm.generating).toBeFalsy();
    });

    it('is verifying on load', function () {
        expect(vm.verifying).toBeTruthy();
    });

    it('verifies randomizers on load', function () {
        scope.$apply();
        expect(vm.compatible).toBeTruthy();
    });

    it('verifies randomizers are compatible', function () {
        scope.$apply();

        spyOn(randomizerServiceMock, 'verify').and.callThrough();

        vm.setAlignment = vm.characterModel.Alignments[1];
        vm.setClassName = vm.characterModel.ClassNames[1];
        vm.setLevel = 9266;
        vm.setBaseRace = vm.characterModel.BaseRaces[1];
        vm.forceMetarace = true;
        vm.setMetarace = vm.characterModel.Metaraces[1];
        vm.alignmentRandomizerType = vm.characterModel.AlignmentRandomizerTypes[1];
        vm.classNameRandomizerType = vm.characterModel.ClassNameRandomizerTypes[1];
        vm.levelRandomizerType = vm.characterModel.LevelRandomizerTypes[1];
        vm.baseRaceRandomizerType = vm.characterModel.BaseRaceRandomizerTypes[1];
        vm.metaraceRandomizerType = vm.characterModel.MetaraceRandomizerTypes[1];

        compatible = true;
        scope.$digest();

        expect(randomizerServiceMock.verify).toHaveBeenCalledWith('first alignment randomizer type', 'second alignment', 'first class name randomizer type', 'second class name', 'first level randomizer type', 9266, 'first base race randomizer type', 'second base race', 'first metarace randomizer type', true, 'second metarace');
        expect(vm.compatible).toBeTruthy();
    });

    it('verifies randomizers are not compatible', function () {
        scope.$apply();

        spyOn(randomizerServiceMock, 'verify').and.callThrough();

        vm.setAlignment = vm.characterModel.Alignments[1];
        vm.setClassName = vm.characterModel.ClassNames[1];
        vm.setLevel = 9266;
        vm.setBaseRace = vm.characterModel.BaseRaces[1];
        vm.forceMetarace = true;
        vm.setMetarace = vm.characterModel.Metaraces[1];
        vm.alignmentRandomizerType = vm.characterModel.AlignmentRandomizerTypes[1];
        vm.classNameRandomizerType = vm.characterModel.ClassNameRandomizerTypes[1];
        vm.levelRandomizerType = vm.characterModel.LevelRandomizerTypes[1];
        vm.baseRaceRandomizerType = vm.characterModel.BaseRaceRandomizerTypes[1];
        vm.metaraceRandomizerType = vm.characterModel.MetaraceRandomizerTypes[1];

        compatible = false;
        scope.$digest();

        expect(randomizerServiceMock.verify).toHaveBeenCalledWith('first alignment randomizer type', 'second alignment', 'first class name randomizer type', 'second class name', 'first level randomizer type', 9266, 'first base race randomizer type', 'second base race', 'first metarace randomizer type', true, 'second metarace');
        expect(vm.compatible).toBeFalsy();
    });

    it('verifies randomizers when alignment randomizer changes', function () {
        scope.$apply();

        compatible = false;
        vm.alignmentRandomizerType = vm.characterModel.AlignmentRandomizerTypes[1];
        scope.$digest();

        expect(vm.compatible).toBeFalsy();
    });

    it('verifies randomizers when set alignment changes', function () {
        scope.$apply();

        compatible = false;
        vm.setAlignment = vm.characterModel.Alignments[1];
        scope.$digest();

        expect(vm.compatible).toBeFalsy();
    });

    it('verifies randomizers when class name randomizer changes', function () {
        scope.$apply();

        compatible = false;
        vm.classNameRandomizerType = vm.characterModel.ClassNameRandomizerTypes[1];
        scope.$digest();

        expect(vm.compatible).toBeFalsy();
    });

    it('verifies randomizers when set class name changes', function () {
        scope.$apply();

        compatible = false;
        vm.setClassName = vm.characterModel.ClassNames[1];
        scope.$digest();

        expect(vm.compatible).toBeFalsy();
    });

    it('verifies randomizers when level randomizer changes', function () {
        scope.$apply();

        compatible = false;
        vm.levelRandomizerType = vm.characterModel.LevelRandomizerTypes[1];
        scope.$digest();

        expect(vm.compatible).toBeFalsy();
    });

    it('verifies randomizers when set level changes', function () {
        scope.$apply();

        compatible = false;
        vm.setLevel = 9266;
        scope.$digest();

        expect(vm.compatible).toBeFalsy();
    });

    it('verifies randomizers when base race randomizer changes', function () {
        scope.$apply();

        compatible = false;
        vm.baseRaceRandomizerType = vm.characterModel.BaseRaceRandomizerTypes[1];
        scope.$digest();

        expect(vm.compatible).toBeFalsy();
    });

    it('verifies randomizers when set base race changes', function () {
        scope.$apply();

        compatible = false;
        vm.setBaseRace = vm.characterModel.BaseRaces[1];
        scope.$digest();

        expect(vm.compatible).toBeFalsy();
    });

    it('verifies randomizers when metarace randomizer changes', function () {
        scope.$apply();

        compatible = false;
        vm.metaraceRandomizerType = vm.characterModel.MetaraceRandomizerTypes[1];
        scope.$digest();

        expect(vm.compatible).toBeFalsy();
    });

    it('verifies randomizers when force metarace changes', function () {
        scope.$apply();

        compatible = false;
        vm.forceMetarace = true;
        scope.$digest();

        expect(vm.compatible).toBeFalsy();
    });

    it('verifies randomizers when set metarace changes', function () {
        scope.$apply();

        compatible = false;
        vm.setMetarace = vm.characterModel.Metaraces[1];
        scope.$digest();

        expect(vm.compatible).toBeFalsy();
    });

    it('verifies randomizers when stats randomizer changes', function () {
        scope.$apply();

        compatible = false;
        vm.statsRandomizerType = vm.characterModel.StatsRandomizerTypes[1];
        scope.$digest();

        expect(vm.compatible).toBeFalsy();
    });

    it('verifies randomizers when set strength changes', function () {
        scope.$apply();

        compatible = false;
        vm.setStrength = 9266;
        scope.$digest();

        expect(vm.compatible).toBeFalsy();
    });

    it('verifies randomizers when set constitution changes', function () {
        scope.$apply();

        compatible = false;
        vm.setConstitution = 9266;
        scope.$digest();

        expect(vm.compatible).toBeFalsy();
    });

    it('verifies randomizers when set dexterity changes', function () {
        scope.$apply();

        compatible = false;
        vm.setDexterity = 9266;
        scope.$digest();

        expect(vm.compatible).toBeFalsy();
    });

    it('verifies randomizers when set intelligence changes', function () {
        scope.$apply();

        compatible = false;
        vm.setIntelligence = 9266;
        scope.$digest();

        expect(vm.compatible).toBeFalsy();
    });

    it('verifies randomizers when set wisdom changes', function () {
        scope.$apply();

        compatible = false;
        vm.setWisdom = 9266;
        scope.$digest();

        expect(vm.compatible).toBeFalsy();
    });

    it('verifies randomizers when set charisma changes', function () {
        scope.$apply();

        compatible = false;
        vm.setCharisma = 9266;
        scope.$digest();

        expect(vm.compatible).toBeFalsy();
    });

    it('says it is done verifying when verifying randomizers', function () {
        scope.$apply();

        compatible = false;
        vm.alignmentRandomizerType = vm.characterModel.AlignmentRandomizerTypes[1];
        scope.$digest();

        expect(vm.compatible).toBeFalsy();
        expect(vm.verifying).toBeFalsy();
    });

    it('says it is done verifying if an error is thrown while verifying randomizers', function () {
        scope.$apply();

        compatible = true;
        vm.setLevel = 666;
        scope.$digest();

        expect(vm.verifying).toBeFalsy();
    });

    it('shows an alert if an error is thrown while verifying randomizers', function () {
        scope.$apply();

        compatible = true;
        vm.setLevel = 666;
        scope.$digest();

        expect(sweetAlertServiceMock.showError).toHaveBeenCalled();
    });

    it('says randomizers are not compatible if an error is thrown while verifying randomizers', function () {
        scope.$apply();

        compatible = true;
        vm.setLevel = 666;
        scope.$digest();

        expect(vm.compatible).toBeFalsy();
    });

    it('generates a character', function () {
        scope.$apply();

        spyOn(characterServiceMock, 'generate').and.callThrough();

        vm.setAlignment = vm.characterModel.Alignments[1];
        vm.setClassName = vm.characterModel.ClassNames[1];
        vm.setLevel = 9266;
        vm.setBaseRace = vm.characterModel.BaseRaces[1];
        vm.forceMetarace = true;
        vm.setMetarace = vm.characterModel.Metaraces[1];
        vm.setStrength = 90210;
        vm.setConstitution = 42;
        vm.setDexterity = 600;
        vm.setIntelligence = 1337;
        vm.setWisdom = 12345;
        vm.setCharisma = 23456;
        vm.alignmentRandomizerType = vm.characterModel.AlignmentRandomizerTypes[1];
        vm.classNameRandomizerType = vm.characterModel.ClassNameRandomizerTypes[1];
        vm.levelRandomizerType = vm.characterModel.LevelRandomizerTypes[1];
        vm.baseRaceRandomizerType = vm.characterModel.BaseRaceRandomizerTypes[1];
        vm.metaraceRandomizerType = vm.characterModel.MetaraceRandomizerTypes[1];
        vm.statsRandomizerType = vm.characterModel.StatsRandomizerTypes[1];

        vm.generate();
        scope.$digest();

        expect(characterServiceMock.generate).toHaveBeenCalledWith('first alignment randomizer type', 'second alignment', 'first class name randomizer type', 'second class name', 'first level randomizer type', 9266, 'first base race randomizer type', 'second base race', 'first metarace randomizer type', true, 'second metarace', 'first stats randomizer type', 90210, 42, 600, 1337, 12345, 23456);
        expect(vm.character).not.toBeNull();
        expect(vm.character.alignment).toBe('second alignment');
        expect(vm.character.className).toBe('second class name');
        expect(vm.character.baseRace).toBe('second base race');
    });

    it('says it is generating while generating a character', function () {
        scope.$apply();

        vm.generate();

        expect(vm.character).toBeNull();
        expect(vm.generating).toBeTruthy();
    });

    it('says it is done generating when generating a character', function () {
        scope.$apply();

        vm.generate();
        scope.$digest();

        expect(vm.character).not.toBeNull();
        expect(vm.character.alignment).toBe('first alignment');
        expect(vm.character.className).toBe('first class name');
        expect(vm.character.baseRace).toBe('first base race');
        expect(vm.generating).toBeFalsy();
    });

    it('says it is done generating if an error is thrown while generating a character', function () {
        scope.$apply();

        vm.setLevel = 666;

        vm.generate();
        scope.$digest();

        expect(vm.generating).toBeFalsy();
    });

    it('shows an alert if an error is thrown while generating a character', function () {
        scope.$apply();

        vm.setLevel = 666;

        vm.generate();
        scope.$digest();

        expect(sweetAlertServiceMock.showError).toHaveBeenCalled();
    });

    it('clears the character if an error is thrown while generating a character', function () {
        scope.$apply();

        vm.setLevel = 666;

        vm.generate();
        scope.$digest();

        expect(vm.character).toBeNull();
    });

    it('says randomizers are not compatible if set level randomizer and set level is 0', function () {
        scope.$apply();

        vm.levelRandomizerType = 'Set';
        vm.setLevel = 0;
        scope.$digest();

        expect(vm.compatible).toBeFalsy();
    });

    it('says randomizers are compatible if set level randomizer and set level is greater than 0', function () {
        scope.$apply();

        vm.levelRandomizerType = 'Set';
        vm.setLevel = 1;
        scope.$digest();

        expect(vm.compatible).toBeTruthy();
    });

    it('says randomizers are not compatible if set stats randomizer and set strength is 0', function () {
        scope.$apply();

        vm.statsRandomizerType = 'Set';
        vm.setStrength = 0;
        vm.setConstitution = 1;
        vm.setDexterity = 1;
        vm.setIntelligence = 1;
        vm.setWisdom = 1;
        vm.setCharisma = 1;
        scope.$digest();

        expect(vm.compatible).toBeFalsy();
    });

    it('says randomizers are not compatible if set stats randomizer and set constitution is 0', function () {
        scope.$apply();

        vm.statsRandomizerType = 'Set';
        vm.setStrength = 1;
        vm.setConstitution = 0;
        vm.setDexterity = 1;
        vm.setIntelligence = 1;
        vm.setWisdom = 1;
        vm.setCharisma = 1;
        scope.$digest();

        expect(vm.compatible).toBeFalsy();
    });

    it('says randomizers are not compatible if set stats randomizer and set dexterity is 0', function () {
        scope.$apply();

        vm.statsRandomizerType = 'Set';
        vm.setStrength = 1;
        vm.setConstitution = 1;
        vm.setDexterity = 0;
        vm.setIntelligence = 1;
        vm.setWisdom = 1;
        vm.setCharisma = 1;
        scope.$digest();

        expect(vm.compatible).toBeFalsy();
    });

    it('says randomizers are not compatible if set stats randomizer and set intelligence is 0', function () {
        scope.$apply();

        vm.statsRandomizerType = 'Set';
        vm.setStrength = 1;
        vm.setConstitution = 1;
        vm.setDexterity = 1;
        vm.setIntelligence = 0;
        vm.setWisdom = 1;
        vm.setCharisma = 1;
        scope.$digest();

        expect(vm.compatible).toBeFalsy();
    });

    it('says randomizers are not compatible if set stats randomizer and set wisdom is 0', function () {
        scope.$apply();

        vm.statsRandomizerType = 'Set';
        vm.setStrength = 1;
        vm.setConstitution = 1;
        vm.setDexterity = 1;
        vm.setIntelligence = 1;
        vm.setWisdom = 0;
        vm.setCharisma = 1;
        scope.$digest();

        expect(vm.compatible).toBeFalsy();
    });

    it('says randomizers are not compatible if set stats randomizer and set charisma is 0', function () {
        scope.$apply();

        vm.statsRandomizerType = 'Set';
        vm.setStrength = 1;
        vm.setConstitution = 1;
        vm.setDexterity = 1;
        vm.setIntelligence = 1;
        vm.setWisdom = 1;
        vm.setCharisma = 0;
        scope.$digest();

        expect(vm.compatible).toBeFalsy();
    });

    it('says randomizers are compatible if set stats randomizer and all stats are greater than 0', function () {
        scope.$apply();

        vm.statsRandomizerType = 'Set';
        vm.setStrength = 1;
        vm.setConstitution = 1;
        vm.setDexterity = 1;
        vm.setIntelligence = 1;
        vm.setWisdom = 1;
        vm.setCharisma = 1;
        scope.$digest();

        expect(vm.compatible).toBeTruthy();
    });
})