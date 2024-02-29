'use strict'

describe('Character Controller', function () {
    var vm;
    var randomizerServiceMock;
    var characterServiceMock;
    var leadershipServiceMock;
    var q;
    var bootstrapDataMock;
    var scope;
    var sweetAlertServiceMock;
    var compatible;
    var isLeader;
    var followerCount;
    var fileSaverServiceMock;
    var characterFormatterServiceMock;
    var eventServiceMock;

    beforeEach(module('app.character'));

    beforeEach(function () {
        bootstrapDataMock = {
            characterModel: {
                alignmentRandomizerTypes: ["any", "first alignment randomizer type", "second alignment randomizer type", "Set"],
                alignments: ["first alignment", "second alignment"],
                classNameRandomizerTypes: ["any", "first class name randomizer type", "second class name randomizer type", "Set"],
                classNames: ["first class name", "second class name"],
                levelRandomizerTypes: ["any", "first level randomizer type", "second level randomizer type", "Set"],
                baseRaceRandomizerTypes: ["any", "first base race randomizer type", "second base race randomizer type", "Set"],
                baseRaces: ["first base race", "second base race"],
                metaraceRandomizerTypes: ["any", "first metarace randomizer type", "second metarace randomizer type", "Set"],
                metaraces: ["first metarace", "second metarace"],
                abilitiesRandomizerTypes: ["raw", "first abilities randomizer type", "second abilities randomizer type", "Set"]
            }
        };

        randomizerServiceMock = {
            verify: function (clientId, alignmentRandomizerType, setAlignment, classNameRandomizerType, setClassName, levelRandomizerType, setLevel, baseRaceRandomizerType, setBaseRace, metaraceRandomizerType, forceMetarace, setMetarace) {
                return getMockedPromise(setLevel, { compatible: compatible });
            }
        };

        characterServiceMock = {
            generate: function (clientId, alignmentRandomizerType, setAlignment, classNameRandomizerType, setClassName, levelRandomizerType, setLevel, allowLevelAdjustments, baseRaceRandomizerType, setBaseRace, metaraceRandomizerType, forceMetarace, setMetarace, abilitiesRandomizerType, setStrength, setConstitution, setDexterity, setIntelligence, setWisdom, setCharisma, allowAbilitiesAdjustments) {
                if (setClassName === 'wrong')
                    return getMockedPromise(setLevel, { character: null });

                var character = {
                    alignment: { full: setAlignment },
                    class: { name: setClassName, level: setLevel },
                    baseRace: setBaseRace,
                    isLeader: isLeader,
                    abilities: {
                        Charisma: { value: setCharisma, bonus: (setCharisma - 10) / 2 }
                    },
                    magic: { animal: 'animal' }
                };

                return getMockedPromise(setLevel, { character: character });
            }
        };

        leadershipServiceMock = {
            generate: function (clientId, leaderLevel, leaderCharismaBonus, leaderAnimal) {
                var leadership = {
                    score: leaderLevel + leaderCharismaBonus,
                    cohortScore: leaderLevel - 2,
                    followerQuantities: {
                        level1: 10,
                        level2: 8,
                        level3: 6,
                        level4: 5,
                        level5: 3,
                        level6: 2
                    }
                };

                return getMockedPromise(leaderLevel, { leadership: leadership });
            },
            generateCohort: function (clientId, leaderLevel, cohortScore, leaderAlignment, leaderClass) {
                var cohort = {
                    level: cohortScore - 2,
                    name: leaderClass,
                    alignment: leaderAlignment
                };

                return getMockedPromise(cohortScore, { cohort: cohort });
            },
            generateFollower: function (clientId, followerLevel, leaderAlignment, leaderClass) {
                followerCount++;

                var follower = {
                    level: followerLevel,
                    name: leaderClass,
                    alignment: leaderAlignment
                };

                return getMockedPromise(followerLevel, { follower: follower });
            }
        };

        compatible = true;
        isLeader = false;
        followerCount = 0;

        sweetAlertServiceMock = {};
        sweetAlertServiceMock.showError = jasmine.createSpy();

        fileSaverServiceMock = {};
        fileSaverServiceMock.save = jasmine.createSpy();

        characterFormatterServiceMock = {
            formatLeader: function (character, leadership, cohort, followers) {
                var formattedCharacter = character.name + '\n';

                if (leadership)
                    formattedCharacter += leadership.score + '\n'

                if (cohort)
                    formattedCharacter += cohort.name + '\n';

                for (var i = 0; i < followers.length; i++) {
                    formattedCharacter += followers[i].name + '\n';
                }

                return formattedCharacter;
            },
            formatSummary: function (character) {
                if (character.name && character.level)
                    return character.name + ' level ' + character.level + ' file';

                return 'Level ' + character.class.level + ' ' + character.alignment.full  + ' ' + character.baseRace + ' ' + character.class.name;
            }
        };

        var idCount = 1;
        eventServiceMock = {
            getClientId: function () {
                var data = { clientId: 'client id ' + idCount++ };
                return getMockedPromise(0, data);
            }
        };
    });

    function getMockedPromise(level, data) {
        var deferred = q.defer();

        if (level === 666)
            deferred.reject();
        else
            deferred.resolve({ data: data });

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
            sweetAlertService: sweetAlertServiceMock,
            leadershipService: leadershipServiceMock,
            fileSaverService: fileSaverServiceMock,
            characterFormatterService: characterFormatterServiceMock,
            eventService: eventServiceMock
        });
    }));

    it('has the loaded view model', function () {
        expect(vm.characterModel).toBe(bootstrapDataMock.characterModel);
    });

    it('has default selected values', function () {
        expect(vm.alignmentRandomizerType).toBe('any');
        expect(vm.setAlignment).toBe('first alignment');
        expect(vm.classNameRandomizerType).toBe('any');
        expect(vm.setClassName).toBe('first class name');
        expect(vm.levelRandomizerType).toBe('any');
        expect(vm.setLevel).toBe(0);
        expect(vm.allowLevelAdjustments).toBeTruthy();
        expect(vm.baseRaceRandomizerType).toBe('any');
        expect(vm.setBaseRace).toBe('first base race');
        expect(vm.metaraceRandomizerType).toBe('any');
        expect(vm.forceMetarace).toBeFalsy();
        expect(vm.setMetarace).toBe('first metarace');
        expect(vm.abilitiesRandomizerType).toBe('raw');
        expect(vm.setStrength).toBe(0);
        expect(vm.setConstitution).toBe(0);
        expect(vm.setDexterity).toBe(0);
        expect(vm.setIntelligence).toBe(0);
        expect(vm.setWisdom).toBe(0);
        expect(vm.setCharisma).toBe(0);
        expect(vm.allowAbilitiesAdjustments).toBeTruthy();
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

        vm.setAlignment = vm.characterModel.alignments[1];
        vm.setClassName = vm.characterModel.classNames[1];
        vm.setLevel = 9266;
        vm.allowLevelAdjustments = false;
        vm.setBaseRace = vm.characterModel.baseRaces[1];
        vm.forceMetarace = true;
        vm.setMetarace = vm.characterModel.metaraces[1];
        vm.alignmentRandomizerType = vm.characterModel.alignmentRandomizerTypes[1];
        vm.classNameRandomizerType = vm.characterModel.classNameRandomizerTypes[1];
        vm.levelRandomizerType = vm.characterModel.levelRandomizerTypes[1];
        vm.baseRaceRandomizerType = vm.characterModel.baseRaceRandomizerTypes[1];
        vm.metaraceRandomizerType = vm.characterModel.metaraceRandomizerTypes[1];

        compatible = true;
        scope.$digest();

        expect(randomizerServiceMock.verify).toHaveBeenCalledWith('client id 21', 'first alignment randomizer type', 'second alignment', 'first class name randomizer type', 'second class name', 'first level randomizer type', 9266, false, 'first base race randomizer type', 'second base race', 'first metarace randomizer type', true, 'second metarace');
        expect(vm.compatible).toBeTruthy();
    });

    it('verifies randomizers are not compatible', function () {
        scope.$apply();

        spyOn(randomizerServiceMock, 'verify').and.callThrough();

        vm.setAlignment = vm.characterModel.alignments[1];
        vm.setClassName = vm.characterModel.classNames[1];
        vm.setLevel = 9266;
        vm.allowLevelAdjustments = false;
        vm.setBaseRace = vm.characterModel.baseRaces[1];
        vm.forceMetarace = true;
        vm.setMetarace = vm.characterModel.metaraces[1];
        vm.alignmentRandomizerType = vm.characterModel.alignmentRandomizerTypes[1];
        vm.classNameRandomizerType = vm.characterModel.classNameRandomizerTypes[1];
        vm.levelRandomizerType = vm.characterModel.levelRandomizerTypes[1];
        vm.baseRaceRandomizerType = vm.characterModel.baseRaceRandomizerTypes[1];
        vm.metaraceRandomizerType = vm.characterModel.metaraceRandomizerTypes[1];

        compatible = false;
        scope.$digest();

        expect(randomizerServiceMock.verify).toHaveBeenCalledWith('client id 21', 'first alignment randomizer type', 'second alignment', 'first class name randomizer type', 'second class name', 'first level randomizer type', 9266, false, 'first base race randomizer type', 'second base race', 'first metarace randomizer type', true, 'second metarace');
        expect(vm.compatible).toBeFalsy();
    });

    it('verifies randomizers when alignment randomizer changes', function () {
        scope.$apply();

        compatible = false;
        vm.alignmentRandomizerType = vm.characterModel.alignmentRandomizerTypes[1];
        scope.$digest();

        expect(vm.compatible).toBeFalsy();
    });

    it('verifies randomizers when set alignment changes', function () {
        scope.$apply();

        compatible = false;
        vm.setAlignment = vm.characterModel.alignments[1];
        scope.$digest();

        expect(vm.compatible).toBeFalsy();
    });

    it('verifies randomizers when class name randomizer changes', function () {
        scope.$apply();

        compatible = false;
        vm.classNameRandomizerType = vm.characterModel.classNameRandomizerTypes[1];
        scope.$digest();

        expect(vm.compatible).toBeFalsy();
    });

    it('verifies randomizers when set class name changes', function () {
        scope.$apply();

        compatible = false;
        vm.setClassName = vm.characterModel.classNames[1];
        scope.$digest();

        expect(vm.compatible).toBeFalsy();
    });

    it('verifies randomizers when level randomizer changes', function () {
        scope.$apply();

        compatible = false;
        vm.levelRandomizerType = vm.characterModel.levelRandomizerTypes[1];
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

    it('verifies randomizers when allow level adjustments changes', function () {
        scope.$apply();

        compatible = false;
        vm.allowLevelAdjustments = false;
        scope.$digest();

        expect(vm.compatible).toBeFalsy();
    });

    it('verifies randomizers when base race randomizer changes', function () {
        scope.$apply();

        compatible = false;
        vm.baseRaceRandomizerType = vm.characterModel.baseRaceRandomizerTypes[1];
        scope.$digest();

        expect(vm.compatible).toBeFalsy();
    });

    it('verifies randomizers when set base race changes', function () {
        scope.$apply();

        compatible = false;
        vm.setBaseRace = vm.characterModel.baseRaces[1];
        scope.$digest();

        expect(vm.compatible).toBeFalsy();
    });

    it('verifies randomizers when metarace randomizer changes', function () {
        scope.$apply();

        compatible = false;
        vm.metaraceRandomizerType = vm.characterModel.metaraceRandomizerTypes[1];
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
        vm.setMetarace = vm.characterModel.metaraces[1];
        scope.$digest();

        expect(vm.compatible).toBeFalsy();
    });

    it('verifies randomizers when abilities randomizer changes', function () {
        scope.$apply();

        compatible = false;
        vm.abilitiesRandomizerType = vm.characterModel.abilitiesRandomizerTypes[1];
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
        vm.alignmentRandomizerType = vm.characterModel.alignmentRandomizerTypes[1];
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

        vm.setAlignment = vm.characterModel.alignments[1];
        vm.setClassName = vm.characterModel.classNames[1];
        vm.setLevel = 9266;
        vm.allowLevelAdjustments = false;
        vm.setBaseRace = vm.characterModel.baseRaces[1];
        vm.forceMetarace = true;
        vm.setMetarace = vm.characterModel.metaraces[1];
        vm.setStrength = 90210;
        vm.setConstitution = 42;
        vm.setDexterity = 600;
        vm.setIntelligence = 1337;
        vm.setWisdom = 12345;
        vm.setCharisma = 23456;
        vm.allowAbilitiesAdjustments = false;
        vm.alignmentRandomizerType = vm.characterModel.alignmentRandomizerTypes[1];
        vm.classNameRandomizerType = vm.characterModel.classNameRandomizerTypes[1];
        vm.levelRandomizerType = vm.characterModel.levelRandomizerTypes[1];
        vm.baseRaceRandomizerType = vm.characterModel.baseRaceRandomizerTypes[1];
        vm.metaraceRandomizerType = vm.characterModel.metaraceRandomizerTypes[1];
        vm.abilitiesRandomizerType = vm.characterModel.abilitiesRandomizerTypes[1];

        vm.generate();
        scope.$digest();

        expect(characterServiceMock.generate).toHaveBeenCalledWith('client id 21', 'first alignment randomizer type', 'second alignment', 'first class name randomizer type', 'second class name', 'first level randomizer type', 9266, false, 'first base race randomizer type', 'second base race', 'first metarace randomizer type', true, 'second metarace', 'first abilities randomizer type', 90210, 42, 600, 1337, 12345, 23456, false);
        expect(vm.character).not.toBeNull();
        expect(vm.character.alignment.full).toBe('second alignment');
        expect(vm.character.class.name).toBe('second class name');
        expect(vm.character.class.level).toBe(9266);
        expect(vm.character.baseRace).toBe('second base race');
        expect(vm.character.abilities.Charisma.value).toBe(23456);
        expect(vm.character.abilities.Charisma.bonus).toBe(11723);
        expect(vm.character.magic.animal).toBe('animal');
    });

    it('generates a character uniquely', function () {
        scope.$apply();

        spyOn(characterServiceMock, 'generate').and.callThrough();

        vm.setAlignment = vm.characterModel.alignments[1];
        vm.setClassName = vm.characterModel.classNames[1];
        vm.setLevel = 9266;
        vm.allowLevelAdjustments = false;
        vm.setBaseRace = vm.characterModel.baseRaces[1];
        vm.forceMetarace = true;
        vm.setMetarace = vm.characterModel.metaraces[1];
        vm.setStrength = 90210;
        vm.setConstitution = 42;
        vm.setDexterity = 600;
        vm.setIntelligence = 1337;
        vm.setWisdom = 12345;
        vm.setCharisma = 23456;
        vm.allowAbilitiesAdjustments = false;
        vm.alignmentRandomizerType = vm.characterModel.alignmentRandomizerTypes[1];
        vm.classNameRandomizerType = vm.characterModel.classNameRandomizerTypes[1];
        vm.levelRandomizerType = vm.characterModel.levelRandomizerTypes[1];
        vm.baseRaceRandomizerType = vm.characterModel.baseRaceRandomizerTypes[1];
        vm.metaraceRandomizerType = vm.characterModel.metaraceRandomizerTypes[1];
        vm.abilitiesRandomizerType = vm.characterModel.abilitiesRandomizerTypes[1];

        vm.generate();
        scope.$digest();

        expect(characterServiceMock.generate).toHaveBeenCalledWith('client id 21', 'first alignment randomizer type', 'second alignment', 'first class name randomizer type', 'second class name', 'first level randomizer type', 9266, false, 'first base race randomizer type', 'second base race', 'first metarace randomizer type', true, 'second metarace', 'first abilities randomizer type', 90210, 42, 600, 1337, 12345, 23456, false);
        expect(vm.character).not.toBeNull();
        expect(vm.character.alignment.full).toBe('second alignment');
        expect(vm.character.class.name).toBe('second class name');
        expect(vm.character.class.level).toBe(9266);
        expect(vm.character.baseRace).toBe('second base race');
        expect(vm.character.abilities.Charisma.value).toBe(23456);
        expect(vm.character.abilities.Charisma.bonus).toBe(11723);
        expect(vm.character.magic.animal).toBe('animal');

        vm.generate();
        scope.$digest();

        expect(characterServiceMock.generate).toHaveBeenCalledWith('client id 41', 'first alignment randomizer type', 'second alignment', 'first class name randomizer type', 'second class name', 'first level randomizer type', 9266, false, 'first base race randomizer type', 'second base race', 'first metarace randomizer type', true, 'second metarace', 'first abilities randomizer type', 90210, 42, 600, 1337, 12345, 23456, false);
        expect(vm.character).not.toBeNull();
        expect(vm.character.alignment.full).toBe('second alignment');
        expect(vm.character.class.name).toBe('second class name');
        expect(vm.character.class.level).toBe(9266);
        expect(vm.character.baseRace).toBe('second base race');
        expect(vm.character.abilities.Charisma.value).toBe(23456);
        expect(vm.character.abilities.Charisma.bonus).toBe(11723);
        expect(vm.character.magic.animal).toBe('animal');
    });

    it('says it is generating while generating a character', function () {
        scope.$apply();

        vm.setLevel = 9266;
        vm.setCharisma = 90210;

        vm.generate();

        expect(vm.character).toBeNull();
        expect(vm.generating).toBeTruthy();
        expect(vm.generatingMessage).toBe('Generating character...');
    });

    it('says it is done generating when done generating a character', function () {
        scope.$apply();

        vm.setLevel = 9266;
        vm.setCharisma = 90210;

        vm.generate();
        scope.$digest();

        expect(vm.character).not.toBeNull();
        expect(vm.character.alignment.full).toBe('first alignment');
        expect(vm.character.class.name).toBe('first class name');
        expect(vm.character.class.level).toBe(9266);
        expect(vm.character.baseRace).toBe('first base race');
        expect(vm.character.abilities.Charisma.value).toBe(90210);
        expect(vm.character.abilities.Charisma.bonus).toBe(45100);
        expect(vm.character.magic.animal).toBe('animal');
        expect(vm.generating).toBeFalsy();
        expect(vm.generatingMessage).toBe('');
    });

    it('says it is done generating if an error is thrown while generating a character', function () {
        scope.$apply();

        vm.setLevel = 666;

        vm.generate();
        scope.$digest();

        expect(vm.generating).toBeFalsy();
        expect(vm.generatingMessage).toBe('');
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

    it('says randomizers are not compatible if set abilities randomizer and set strength is 0', function () {
        scope.$apply();

        vm.abilitiesRandomizerType = 'Set';
        vm.setStrength = 0;
        vm.setConstitution = 1;
        vm.setDexterity = 1;
        vm.setIntelligence = 1;
        vm.setWisdom = 1;
        vm.setCharisma = 1;
        scope.$digest();

        expect(vm.compatible).toBeFalsy();
    });

    it('says randomizers are not compatible if set abilities randomizer and set constitution is 0', function () {
        scope.$apply();

        vm.abilitiesRandomizerType = 'Set';
        vm.setStrength = 1;
        vm.setConstitution = 0;
        vm.setDexterity = 1;
        vm.setIntelligence = 1;
        vm.setWisdom = 1;
        vm.setCharisma = 1;
        scope.$digest();

        expect(vm.compatible).toBeFalsy();
    });

    it('says randomizers are not compatible if set abilities randomizer and set dexterity is 0', function () {
        scope.$apply();

        vm.abilitiesRandomizerType = 'Set';
        vm.setStrength = 1;
        vm.setConstitution = 1;
        vm.setDexterity = 0;
        vm.setIntelligence = 1;
        vm.setWisdom = 1;
        vm.setCharisma = 1;
        scope.$digest();

        expect(vm.compatible).toBeFalsy();
    });

    it('says randomizers are not compatible if set abilities randomizer and set intelligence is 0', function () {
        scope.$apply();

        vm.abilitiesRandomizerType = 'Set';
        vm.setStrength = 1;
        vm.setConstitution = 1;
        vm.setDexterity = 1;
        vm.setIntelligence = 0;
        vm.setWisdom = 1;
        vm.setCharisma = 1;
        scope.$digest();

        expect(vm.compatible).toBeFalsy();
    });

    it('says randomizers are not compatible if set abilities randomizer and set wisdom is 0', function () {
        scope.$apply();

        vm.abilitiesRandomizerType = 'Set';
        vm.setStrength = 1;
        vm.setConstitution = 1;
        vm.setDexterity = 1;
        vm.setIntelligence = 1;
        vm.setWisdom = 0;
        vm.setCharisma = 1;
        scope.$digest();

        expect(vm.compatible).toBeFalsy();
    });

    it('says randomizers are not compatible if set abilities randomizer and set charisma is 0', function () {
        scope.$apply();

        vm.abilitiesRandomizerType = 'Set';
        vm.setStrength = 1;
        vm.setConstitution = 1;
        vm.setDexterity = 1;
        vm.setIntelligence = 1;
        vm.setWisdom = 1;
        vm.setCharisma = 0;
        scope.$digest();

        expect(vm.compatible).toBeFalsy();
    });

    it('says randomizers are compatible if set abilities randomizer and all abilities are greater than 0', function () {
        scope.$apply();

        vm.abilitiesRandomizerType = 'Set';
        vm.setStrength = 1;
        vm.setConstitution = 1;
        vm.setDexterity = 1;
        vm.setIntelligence = 1;
        vm.setWisdom = 1;
        vm.setCharisma = 1;
        scope.$digest();

        expect(vm.compatible).toBeTruthy();
    });

    it('generates leadership if generated character is a leader', function () {
        scope.$apply();

        isLeader = true;
        vm.setLevel = 9266;
        vm.setCharisma = 90210;

        vm.generate();
        scope.$digest();

        expect(vm.character).not.toBeNull();
        expect(vm.character.alignment.full).toBe('first alignment');
        expect(vm.character.class.name).toBe('first class name');
        expect(vm.character.class.level).toBe(9266);
        expect(vm.character.abilities.Charisma.value).toBe(90210);
        expect(vm.character.abilities.Charisma.bonus).toBe(45100);
        expect(vm.character.baseRace).toBe('first base race');
        expect(vm.character.magic.animal).toBe('animal');
        expect(vm.leadership).not.toBeNull();
        expect(vm.leadership.score).toBe(9266 + 45100);
        expect(vm.leadership.cohortScore).toBe(9264);
        expect(vm.leadership.followerQuantities.level1).toBe(10);
        expect(vm.leadership.followerQuantities.level2).toBe(8);
        expect(vm.leadership.followerQuantities.level3).toBe(6);
        expect(vm.leadership.followerQuantities.level4).toBe(5);
        expect(vm.leadership.followerQuantities.level5).toBe(3);
        expect(vm.leadership.followerQuantities.level6).toBe(2);
        expect(vm.generating).toBeFalsy();
        expect(vm.generatingMessage).toBe('');
    });

    it('says it is done generating when done generating leadership', function () {
        scope.$apply();

        isLeader = true;
        vm.setLevel = 9266;
        vm.setCharisma = 90210;

        vm.generate();
        scope.$digest();

        expect(vm.character).not.toBeNull();
        expect(vm.character.alignment.full).toBe('first alignment');
        expect(vm.character.class.name).toBe('first class name');
        expect(vm.character.class.level).toBe(9266);
        expect(vm.character.abilities.Charisma.value).toBe(90210);
        expect(vm.character.abilities.Charisma.bonus).toBe(45100);
        expect(vm.character.baseRace).toBe('first base race');
        expect(vm.character.magic.animal).toBe('animal');
        expect(vm.leadership).not.toBeNull();
        expect(vm.leadership.score).toBe(9266 + 45100);
        expect(vm.leadership.cohortScore).toBe(9264);
        expect(vm.leadership.followerQuantities.level1).toBe(10);
        expect(vm.leadership.followerQuantities.level2).toBe(8);
        expect(vm.leadership.followerQuantities.level3).toBe(6);
        expect(vm.leadership.followerQuantities.level4).toBe(5);
        expect(vm.leadership.followerQuantities.level5).toBe(3);
        expect(vm.leadership.followerQuantities.level6).toBe(2);
        expect(vm.generating).toBeFalsy();
        expect(vm.generatingMessage).toBe('');
    });

    it('does not generate leadership if generated character is not a leader', function () {
        scope.$apply();

        isLeader = false;
        vm.setLevel = 9266;
        vm.setCharisma = 90210;

        vm.generate();
        scope.$digest();

        expect(vm.character).not.toBeNull();
        expect(vm.character.alignment.full).toBe('first alignment');
        expect(vm.character.class.name).toBe('first class name');
        expect(vm.character.class.level).toBe(9266);
        expect(vm.character.abilities.Charisma.value).toBe(90210);
        expect(vm.character.abilities.Charisma.bonus).toBe(45100);
        expect(vm.character.baseRace).toBe('first base race');
        expect(vm.character.magic.animal).toBe('animal');
        expect(vm.leadership).toBeNull();
        expect(vm.generating).toBeFalsy();
        expect(vm.generatingMessage).toBe('');
    });

    it('generates a cohort if generated character is a leader', function () {
        scope.$apply();

        isLeader = true;
        vm.setLevel = 9266;
        vm.setCharisma = 90210;

        vm.generate();
        scope.$digest();

        expect(vm.character).not.toBeNull();
        expect(vm.character.alignment.full).toBe('first alignment');
        expect(vm.character.class.name).toBe('first class name');
        expect(vm.character.class.level).toBe(9266);
        expect(vm.character.abilities.Charisma.value).toBe(90210);
        expect(vm.character.abilities.Charisma.bonus).toBe(45100);
        expect(vm.character.baseRace).toBe('first base race');
        expect(vm.character.magic.animal).toBe('animal');
        expect(vm.leadership).not.toBeNull();
        expect(vm.leadership.score).toBe(9266 + 45100);
        expect(vm.leadership.cohortScore).toBe(9264);
        expect(vm.leadership.followerQuantities.level1).toBe(10);
        expect(vm.leadership.followerQuantities.level2).toBe(8);
        expect(vm.leadership.followerQuantities.level3).toBe(6);
        expect(vm.leadership.followerQuantities.level4).toBe(5);
        expect(vm.leadership.followerQuantities.level5).toBe(3);
        expect(vm.leadership.followerQuantities.level6).toBe(2);
        expect(vm.cohort).not.toBeNull();
        expect(vm.cohort.level).toBe(9262);
        expect(vm.cohort.name).toBe('first class name');
        expect(vm.cohort.alignment).toBe('first alignment');
        expect(vm.generating).toBeFalsy();
        expect(vm.generatingMessage).toBe('');
    });

    it('says it is done generating when done generating a cohort', function () {
        scope.$apply();

        isLeader = true;
        vm.setLevel = 9266;
        vm.setCharisma = 90210;

        vm.generate();
        scope.$digest();

        expect(vm.character).not.toBeNull();
        expect(vm.character.alignment.full).toBe('first alignment');
        expect(vm.character.class.name).toBe('first class name');
        expect(vm.character.class.level).toBe(9266);
        expect(vm.character.abilities.Charisma.value).toBe(90210);
        expect(vm.character.abilities.Charisma.bonus).toBe(45100);
        expect(vm.character.baseRace).toBe('first base race');
        expect(vm.character.magic.animal).toBe('animal');
        expect(vm.leadership).not.toBeNull();
        expect(vm.leadership.score).toBe(9266 + 45100);
        expect(vm.leadership.cohortScore).toBe(9264);
        expect(vm.leadership.followerQuantities.level1).toBe(10);
        expect(vm.leadership.followerQuantities.level2).toBe(8);
        expect(vm.leadership.followerQuantities.level3).toBe(6);
        expect(vm.leadership.followerQuantities.level4).toBe(5);
        expect(vm.leadership.followerQuantities.level5).toBe(3);
        expect(vm.leadership.followerQuantities.level6).toBe(2);
        expect(vm.cohort).not.toBeNull();
        expect(vm.cohort.level).toBe(9262);
        expect(vm.cohort.name).toBe('first class name');
        expect(vm.cohort.alignment).toBe('first alignment');
        expect(vm.generating).toBeFalsy();
        expect(vm.generatingMessage).toBe('');
    });

    it('does not generate a cohort if generated character is not a leader', function () {
        scope.$apply();

        isLeader = false;
        vm.setLevel = 9266;
        vm.setCharisma = 90210;

        vm.generate();
        scope.$digest();

        expect(vm.character).not.toBeNull();
        expect(vm.character.alignment.full).toBe('first alignment');
        expect(vm.character.class.name).toBe('first class name');
        expect(vm.character.class.level).toBe(9266);
        expect(vm.character.abilities.Charisma.value).toBe(90210);
        expect(vm.character.abilities.Charisma.bonus).toBe(45100);
        expect(vm.character.baseRace).toBe('first base race');
        expect(vm.character.magic.animal).toBe('animal');
        expect(vm.leadership).toBeNull();
        expect(vm.cohort).toBeNull();
        expect(vm.generating).toBeFalsy();
        expect(vm.generatingMessage).toBe('');
    });

    it('generates followers if generated character is a leader', function () {
        scope.$apply();

        isLeader = true;
        vm.setLevel = 9266;
        vm.setCharisma = 90210;

        vm.generate();
        scope.$digest();

        expect(vm.character).not.toBeNull();
        expect(vm.character.alignment.full).toBe('first alignment');
        expect(vm.character.class.name).toBe('first class name');
        expect(vm.character.class.level).toBe(9266);
        expect(vm.character.abilities.Charisma.value).toBe(90210);
        expect(vm.character.abilities.Charisma.bonus).toBe(45100);
        expect(vm.character.baseRace).toBe('first base race');
        expect(vm.character.magic.animal).toBe('animal');
        expect(vm.leadership).not.toBeNull();
        expect(vm.leadership.score).toBe(9266 + 45100);
        expect(vm.leadership.cohortScore).toBe(9264);
        expect(vm.leadership.followerQuantities.level1).toBe(10);
        expect(vm.leadership.followerQuantities.level2).toBe(8);
        expect(vm.leadership.followerQuantities.level3).toBe(6);
        expect(vm.leadership.followerQuantities.level4).toBe(5);
        expect(vm.leadership.followerQuantities.level5).toBe(3);
        expect(vm.leadership.followerQuantities.level6).toBe(2);
        expect(vm.cohort).not.toBeNull();
        expect(vm.cohort.level).toBe(9262);

        expect(vm.followers.length).toBe(34);

        for (var i = 0; i < 10; i++) {
            expect(vm.followers[i].level).toBe(1);
            expect(vm.followers[i].name).toBe('first class name');
            expect(vm.followers[i].alignment).toBe('first alignment');
        }

        for (var j = 10; j < 18; j++) {
            expect(vm.followers[j].level).toBe(2);
            expect(vm.followers[j].name).toBe('first class name');
            expect(vm.followers[j].alignment).toBe('first alignment');
        }

        for (var k = 18; k < 24; k++) {
            expect(vm.followers[k].level).toBe(3);
            expect(vm.followers[k].name).toBe('first class name');
            expect(vm.followers[k].alignment).toBe('first alignment');
        }

        for (var l = 24; l < 29; l++) {
            expect(vm.followers[l].level).toBe(4);
            expect(vm.followers[l].name).toBe('first class name');
            expect(vm.followers[l].alignment).toBe('first alignment');
        }

        for (var m = 29; m < 32; m++) {
            expect(vm.followers[m].level).toBe(5);
            expect(vm.followers[m].name).toBe('first class name');
            expect(vm.followers[m].alignment).toBe('first alignment');
        }

        for (var n = 32; n < 34; n++) {
            expect(vm.followers[n].level).toBe(6);
            expect(vm.followers[n].name).toBe('first class name');
            expect(vm.followers[n].alignment).toBe('first alignment');
        }

        expect(vm.generating).toBeFalsy();
        expect(vm.generatingMessage).toBe('');
    });

    it('says it is done generating when done generating followers', function () {
        scope.$apply();

        isLeader = true;
        vm.setLevel = 9266;
        vm.setCharisma = 90210;

        vm.generate();
        scope.$digest();

        expect(vm.character).not.toBeNull();
        expect(vm.character.alignment.full).toBe('first alignment');
        expect(vm.character.class.name).toBe('first class name');
        expect(vm.character.class.level).toBe(9266);
        expect(vm.character.abilities.Charisma.value).toBe(90210);
        expect(vm.character.abilities.Charisma.bonus).toBe(45100);
        expect(vm.character.baseRace).toBe('first base race');
        expect(vm.character.magic.animal).toBe('animal');
        expect(vm.leadership).not.toBeNull();
        expect(vm.leadership.score).toBe(9266 + 45100);
        expect(vm.leadership.cohortScore).toBe(9264);
        expect(vm.leadership.followerQuantities.level1).toBe(10);
        expect(vm.leadership.followerQuantities.level2).toBe(8);
        expect(vm.leadership.followerQuantities.level3).toBe(6);
        expect(vm.leadership.followerQuantities.level4).toBe(5);
        expect(vm.leadership.followerQuantities.level5).toBe(3);
        expect(vm.leadership.followerQuantities.level6).toBe(2);
        expect(vm.cohort).not.toBeNull();
        expect(vm.cohort.level).toBe(9262);

        expect(vm.followers.length).toBe(34);

        for (var i = 0; i < 10; i++) {
            expect(vm.followers[i].level).toBe(1);
            expect(vm.followers[i].name).toBe('first class name');
            expect(vm.followers[i].alignment).toBe('first alignment');
        }

        for (var j = 10; j < 18; j++) {
            expect(vm.followers[j].level).toBe(2);
            expect(vm.followers[j].name).toBe('first class name');
            expect(vm.followers[j].alignment).toBe('first alignment');
        }

        for (var k = 18; k < 24; k++) {
            expect(vm.followers[k].level).toBe(3);
            expect(vm.followers[k].name).toBe('first class name');
            expect(vm.followers[k].alignment).toBe('first alignment');
        }

        for (var l = 24; l < 29; l++) {
            expect(vm.followers[l].level).toBe(4);
            expect(vm.followers[l].name).toBe('first class name');
            expect(vm.followers[l].alignment).toBe('first alignment');
        }

        for (var m = 29; m < 32; m++) {
            expect(vm.followers[m].level).toBe(5);
            expect(vm.followers[m].name).toBe('first class name');
            expect(vm.followers[m].alignment).toBe('first alignment');
        }

        for (var n = 32; n < 34; n++) {
            expect(vm.followers[n].level).toBe(6);
            expect(vm.followers[n].name).toBe('first class name');
            expect(vm.followers[n].alignment).toBe('first alignment');
        }

        expect(vm.generating).toBeFalsy();
        expect(vm.generatingMessage).toBe('');
    });

    it('does not generate followers if generated character is not a leader', function () {
        scope.$apply();

        isLeader = false;
        vm.setLevel = 9266;
        vm.setCharisma = 90210;

        vm.generate();
        scope.$digest();

        expect(vm.character).not.toBeNull();
        expect(vm.character.alignment.full).toBe('first alignment');
        expect(vm.character.class.name).toBe('first class name');
        expect(vm.character.class.level).toBe(9266);
        expect(vm.character.abilities.Charisma.value).toBe(90210);
        expect(vm.character.abilities.Charisma.bonus).toBe(45100);
        expect(vm.character.baseRace).toBe('first base race');
        expect(vm.character.magic.animal).toBe('animal');
        expect(vm.leadership).toBeNull();
        expect(vm.cohort).toBeNull();
        expect(vm.followers.length).toBe(0);
        expect(vm.generating).toBeFalsy();
        expect(vm.generatingMessage).toBe('');
    });

    it('wipes out previous leadership when generating a new character', function () {
        scope.$apply();

        isLeader = true;
        vm.setLevel = 9266;
        vm.setCharisma = 90210;

        vm.generate();
        scope.$digest();

        vm.generate();

        expect(vm.leadership).toBeNull();
        expect(vm.cohort).toBeNull();
        expect(vm.followers.length).toBe(0);
        expect(vm.generating).toBeTruthy();
        expect(vm.generatingMessage).toBe('Generating character...');
    });

    it('uses no leadership after generating a new character', function () {
        scope.$apply();

        isLeader = true;
        vm.setLevel = 9266;
        vm.setCharisma = 90210;

        vm.generate();
        scope.$digest();

        isLeader = false;
        vm.generate();
        scope.$digest();

        expect(vm.leadership).toBeNull();
        expect(vm.cohort).toBeNull();
        expect(vm.followers.length).toBe(0);
        expect(vm.generating).toBeFalsy();
        expect(vm.generatingMessage).toBe('');
    });

    it('updates the generating message if in the middle of generating followers', function () {
        scope.$digest();

        vm.leadership = {
            followerQuantities: {
                level1: 7,
                level2: 6,
                level3: 5,
                level4: 4,
                level5: 3,
                level6: 2
            }
        };

        vm.followers.push('new follower');
        scope.$digest();

        expect(vm.generatingMessage).toBe('Generating follower 2 of 27...');
    });

    it('says when followers are done generating', function () {
        scope.$digest();

        vm.leadership = {
            followerQuantities: {
                level1: 7,
                level2: 6,
                level3: 5,
                level4: 4,
                level5: 3,
                level6: 2
            }
        };

        vm.followers.push('new follower');
        scope.$digest();

        expect(vm.generatingMessage).toBe('Generating follower 2 of 27...');

        for (var i = 0; i < 26; i++)
            vm.followers.push('new follower ' + i);

        scope.$digest();

        expect(vm.generating).toBeFalsy();
        expect(vm.generatingMessage).toBe('');
    });

    it('does not affect the generating message when followers are emptied', function () {
        scope.$digest();

        vm.leadership = {
            followerQuantities: {
                level1: 7,
                level2: 6,
                level3: 5,
                level4: 4,
                level5: 3,
                level6: 2
            }
        };

        vm.followers.push('new follower');
        scope.$digest();

        vm.generatingMessage = 'generating message';
        vm.generating = true;
        vm.followers = [];
        scope.$digest();

        expect(vm.generating).toBeTruthy();
        expect(vm.generatingMessage).toBe('generating message');
    });

    it('does not say followers are generating when no followers to generate', function () {
        scope.$digest();

        vm.leadership = {
            followerQuantities: {
                level1: 0,
                level2: 0,
                level3: 0,
                level4: 0,
                level5: 0,
                level6: 0
            }
        };

        vm.followers.push('new follower');
        scope.$digest();

        vm.followers = [];
        scope.$digest();

        expect(vm.generating).toBeFalsy();
        expect(vm.generatingMessage).toBe('');
    });

    it('downloads character', function () {
        vm.character = { name: 'Joe Shmoe', summary: 'character summary' };

        vm.download();
        scope.$apply();

        expect(fileSaverServiceMock.save).toHaveBeenCalledWith('Joe Shmoe\n', 'character summary');
    });

    it('downloads character with leadership', function () {
        vm.character = { name: 'Joe Shmoe', summary: 'character summary' };
        vm.leadership = { score: 9266 };
        vm.cohort = { name: 'Cohort' };
        vm.followers = [{ name: 'Thing 1' }, { name: 'Thing 2' }];

        vm.download();
        scope.$apply();

        expect(fileSaverServiceMock.save).toHaveBeenCalledWith('Joe Shmoe\n9266\nCohort\nThing 1\nThing 2\n', 'character summary');
    });
})