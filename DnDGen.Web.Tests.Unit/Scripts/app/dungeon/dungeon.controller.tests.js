﻿'use strict'

describe('Dungeon Controller', function () {
    var vm;
    var dungeonServiceMock;
    var q;
    var scope;
    var sweetAlertServiceMock;
    var fileSaverServiceMock;
    var dungeonFormatterServiceMock;
    var model;
    var eventServiceMock;
    var encounterServiceMock;

    beforeEach(module('app.dungeon'));

    beforeEach(function () {
        dungeonServiceMock = {
            getDungeonAreasFromHall: function (clientId, dungeonLevel, environment, temperature, timeOfDay, level, filters, allowAquatic, allowUnderground) {
                var body = {
                    areas: [
                        { type: clientId + ' ' + temperature + ' hall room ' + dungeonLevel, contents: 'monster ' + level },
                        { type: clientId + ' ' + temperature + ' hall exit ' + dungeonLevel, contents: 'trap ' + level }
                    ]
                };

                if (dungeonLevel == 666)
                    return getMockedPromise(body, true);

                return getMockedPromise(body);
            },
            getDungeonAreasFromDoor: function (clientId, dungeonLevel, environment, temperature, timeOfDay, level, filters, allowAquatic, allowUnderground) {
                var body = {
                    areas: [
                        { type: clientId + ' ' + temperature + ' door room ' + dungeonLevel, contents: 'monster ' + level },
                        { type: clientId + ' ' + temperature + ' door exit ' + dungeonLevel, contents: 'trap ' + level }
                    ]
                };

                if (dungeonLevel == 666)
                    return getMockedPromise(body, true);

                return getMockedPromise(body);
            }
        };

        model = {
            environments: ["field", "mountain"],
            temperatures: ["cold", "hot"],
            timesOfDay: ["day", "night"],
            creatureTypes: ["undead", "character", "yo mamma"]
        };

        encounterServiceMock = {
            validateFilters: function (clientId, environment, temperature, timeOfDay, level, filters, allowAQuatic, allowUnderground) {
                var data = { "isValid": (filters[0] !== 'undead' && environment !== "invalid" && temperature !== "invalid" && timeOfDay !== "invalid" && level !== 666) };
                return getMockedPromise(data);
            }
        };

        sweetAlertServiceMock = {};
        sweetAlertServiceMock.showError = jasmine.createSpy();

        fileSaverServiceMock = {};
        fileSaverServiceMock.save = jasmine.createSpy();

        dungeonFormatterServiceMock = {
            formatDungeonAreas: function (areas) {
                var output = '';

                for (var i = 0; i < areas.length; i++) {
                    output += 'Area ' + (i + 1) + ':\n';
                    output += '\t' + areas[i].type + '\n';
                    output += '\t' + areas[i].contents + '\n';
                }

                return output;
            }
        };

        var idCount = 1;
        eventServiceMock = {
            getClientId: function () {
                var data = { clientId: 'client id ' + idCount++ };
                return getMockedPromise(data, false);
            }
        };
    });

    function getMockedPromise(body, shouldFail) {
        var deferred = q.defer();

        if (shouldFail)
            deferred.reject();
        else
            deferred.resolve({ data: body });

        return deferred.promise;
    }

    beforeEach(inject(function ($rootScope, $controller, $q) {
        q = $q;
        scope = $rootScope.$new();
        vm = $controller('Dungeon as vm', {
            $scope: scope,
            dungeonService: dungeonServiceMock,
            sweetAlertService: sweetAlertServiceMock,
            fileSaverService: fileSaverServiceMock,
            dungeonFormatterService: dungeonFormatterServiceMock,
            model: model,
            eventService: eventServiceMock,
            encounterService: encounterServiceMock
        });
    }));

    it('has initial values for inputs', function () {
        expect(vm.dungeonLevel).toBe(1);
        expect(vm.level).toBe(1);
        expect(vm.environment).toBe('field');
        expect(vm.temperature).toBe('cold');
        expect(vm.timeOfDay).toBe('day');
        expect(vm.allowAquatic).toBeFalsy();
        expect(vm.allowUnderground).toBeFalsy();
    });

    it('has model', function () {
        expect(vm.model).toBe(model);
    });

    it('has an empty areas for results', function () {
        expect(vm.areas).not.toBeNull();
        expect(vm.areas.length).toBe(0);
    });

    it('is not generating on load', function () {
        expect(vm.generating).toBeFalsy();
    });

    it('is not validating on load', function () {
        expect(vm.validating).toBeFalsy();
    });

    it('generates dungeon areas from hall', function () {
        vm.dungeonLevel = 9266;
        vm.level = 90210;
        vm.temperature = 'temp';

        vm.generateDungeonAreasFromHall();
        scope.$apply();

        expect(vm.areas[0].type).toBe('client id 1 temp hall room 9266');
        expect(vm.areas[0].contents).toBe('monster 90210');
        expect(vm.areas[1].type).toBe('client id 1 temp hall exit 9266');
        expect(vm.areas[1].contents).toBe('trap 90210');
        expect(vm.areas.length).toBe(2);
    });

    it('generates dungeon areas from hall uniquely', function () {
        vm.dungeonLevel = 9266;
        vm.level = 90210;
        vm.temperature = 'temp';

        vm.generateDungeonAreasFromHall();
        scope.$apply();

        expect(vm.areas[0].type).toBe('client id 1 temp hall room 9266');
        expect(vm.areas[0].contents).toBe('monster 90210');
        expect(vm.areas[1].type).toBe('client id 1 temp hall exit 9266');
        expect(vm.areas[1].contents).toBe('trap 90210');
        expect(vm.areas.length).toBe(2);

        vm.generateDungeonAreasFromHall();
        scope.$apply();

        expect(vm.areas[0].type).toBe('client id 9 temp hall room 9266');
        expect(vm.areas[0].contents).toBe('monster 90210');
        expect(vm.areas[1].type).toBe('client id 9 temp hall exit 9266');
        expect(vm.areas[1].contents).toBe('trap 90210');
        expect(vm.areas.length).toBe(2);
    });

    it('says it is generating while fetching dungeon areas from hall', function () {
        vm.dungeonLevel = 9266;
        vm.level = 90210;
        vm.temperature = 'temp';

        vm.generateDungeonAreasFromHall();

        expect(vm.generating).toBeTruthy();
    });

    it('says it is done generating while fetching dungeon areas from hall', function () {
        vm.dungeonLevel = 9266;
        vm.level = 90210;
        vm.temperature = 'temp';

        vm.generateDungeonAreasFromHall();
        scope.$apply();

        expect(vm.generating).toBeFalsy();
    });

    it('says it is done generating if an error is thrown while fetching dungeon areas from hall', function () {
        vm.dungeonLevel = 666;
        vm.level = 90210;
        vm.temperature = 'temp';

        vm.generateDungeonAreasFromHall();
        scope.$apply();

        expect(vm.generating).toBeFalsy();
    });

    it('shows an alert if an error is thrown while fetching dungeon areas from hall', function () {
        vm.dungeonLevel = 666;
        vm.level = 90210;
        vm.temperature = 'temp';

        vm.generateDungeonAreasFromHall();
        scope.$apply();

        expect(sweetAlertServiceMock.showError).toHaveBeenCalled();
    });

    it('clears the areas if an error is thrown while fetching dungeon areas from hall', function () {
        vm.dungeonLevel = 9266;
        vm.level = 90210;
        vm.temperature = 'temp';

        vm.generateDungeonAreasFromHall();
        scope.$apply();

        vm.dungeonLevel = 666;

        vm.generateDungeonAreasFromHall();
        scope.$apply();

        expect(vm.areas.length).toBe(0);
    });

    it('generates dungeon areas from door', function () {
        vm.dungeonLevel = 9266;
        vm.level = 90210;
        vm.temperature = 'temp';

        vm.generateDungeonAreasFromDoor();
        scope.$apply();

        expect(vm.areas[0].type).toBe('client id 1 temp door room 9266');
        expect(vm.areas[0].contents).toBe('monster 90210');
        expect(vm.areas[1].type).toBe('client id 1 temp door exit 9266');
        expect(vm.areas[1].contents).toBe('trap 90210');
        expect(vm.areas.length).toBe(2);
    });

    it('generates dungeon areas from door uniquely', function () {
        vm.dungeonLevel = 9266;
        vm.level = 90210;
        vm.temperature = 'temp';

        vm.generateDungeonAreasFromDoor();
        scope.$apply();

        expect(vm.areas[0].type).toBe('client id 1 temp door room 9266');
        expect(vm.areas[0].contents).toBe('monster 90210');
        expect(vm.areas[1].type).toBe('client id 1 temp door exit 9266');
        expect(vm.areas[1].contents).toBe('trap 90210');
        expect(vm.areas.length).toBe(2);

        vm.generateDungeonAreasFromDoor();
        scope.$apply();

        expect(vm.areas[0].type).toBe('client id 9 temp door room 9266');
        expect(vm.areas[0].contents).toBe('monster 90210');
        expect(vm.areas[1].type).toBe('client id 9 temp door exit 9266');
        expect(vm.areas[1].contents).toBe('trap 90210');
        expect(vm.areas.length).toBe(2);
    });

    it('says it is generating while fetching dungeon areas from door', function () {
        vm.dungeonLevel = 9266;
        vm.level = 90210;
        vm.temperature = 'temp';

        vm.generateDungeonAreasFromDoor();

        expect(vm.generating).toBeTruthy();
    });

    it('says it is done generating while fetching dungeon areas from door', function () {
        vm.dungeonLevel = 9266;
        vm.level = 90210;
        vm.temperature = 'temp';

        vm.generateDungeonAreasFromDoor();
        scope.$apply();

        expect(vm.generating).toBeFalsy();
    });

    it('says it is done generating if an error is thrown while fetching dungeon areas from door', function () {
        vm.dungeonLevel = 666;
        vm.level = 90210;
        vm.temperature = 'temp';

        vm.generateDungeonAreasFromDoor();
        scope.$apply();

        expect(vm.generating).toBeFalsy();
    });

    it('shows an alert if an error is thrown while fetching dungeon areas from door', function () {
        vm.dungeonLevel = 666;
        vm.level = 90210;
        vm.temperature = 'temp';

        vm.generateDungeonAreasFromDoor();
        scope.$apply();

        expect(sweetAlertServiceMock.showError).toHaveBeenCalled();
    });

    it('clears the areas if an error is thrown while fetching dungeon areas from door', function () {
        vm.dungeonLevel = 9266;
        vm.level = 90210;
        vm.temperature = 'temp';

        vm.generateDungeonAreasFromDoor();
        scope.$apply();

        vm.dungeonLevel = 666;

        vm.generateDungeonAreasFromDoor();
        scope.$apply();

        expect(vm.areas.length).toBe(0);
    });

    it('downloads dungeon areas', function () {
        vm.dungeonLevel = 9266;
        vm.level = 90210;
        vm.temperature = 'temp';

        vm.generateDungeonAreasFromHall();
        scope.$apply();

        vm.download();
        scope.$apply();

        var fileName = 'temp Dungeon level 9266, party level 90210 ' + new Date().toString();
        var formattedAreas = 'Area 1:\n'
            + '\tclient id 1 temp hall room 9266\n'
            + '\tmonster 90210\n'
            + 'Area 2:\n'
            + '\tclient id 1 temp hall exit 9266\n'
            + '\ttrap 90210\n';

        expect(fileSaverServiceMock.save).toHaveBeenCalledWith(formattedAreas, fileName);
    });

    it('has creature type filters', function () {
        expect(vm.creatureTypeFilters[0].name).toBe("undead");
        expect(vm.creatureTypeFilters[0].checked).toBe(false);
        expect(vm.creatureTypeFilters[1].name).toBe("character");
        expect(vm.creatureTypeFilters[1].checked).toBe(false);
        expect(vm.creatureTypeFilters[2].name).toBe("yo mamma");
        expect(vm.creatureTypeFilters[2].checked).toBe(false);
    });

    it('uses filters when generating a dungeon areas from hall', function () {
        vm.creatureTypeFilters[1].checked = true;
        vm.creatureTypeFilters[2].checked = true;
        vm.environment = 'mountain';
        vm.level = 90210;
        vm.dungeonLevel = 9266;

        spyOn(dungeonServiceMock, 'getDungeonAreasFromHall').and.callThrough();

        vm.generateDungeonAreasFromHall();
        scope.$apply();

        expect(vm.areas[0].type).toBe('client id 1 cold hall room 9266');
        expect(vm.areas[0].contents).toBe('monster 90210');
        expect(vm.areas[1].type).toBe('client id 1 cold hall exit 9266');
        expect(vm.areas[1].contents).toBe('trap 90210');
        expect(vm.areas.length).toBe(2);

        expect(dungeonServiceMock.getDungeonAreasFromHall).toHaveBeenCalledWith('client id 1',
            9266,
            'mountain',
            'cold',
            'day',
            90210,
            ['character', 'yo mamma'],
            false,
            false);
    });

    it('uses filters when generating a dungeon areas from door', function () {
        vm.creatureTypeFilters[1].checked = true;
        vm.creatureTypeFilters[2].checked = true;
        vm.environment = 'mountain';
        vm.level = 90210;
        vm.dungeonLevel = 9266;

        spyOn(dungeonServiceMock, 'getDungeonAreasFromDoor').and.callThrough();

        vm.generateDungeonAreasFromDoor();
        scope.$apply();

        expect(vm.areas[0].type).toBe('client id 1 cold door room 9266');
        expect(vm.areas[0].contents).toBe('monster 90210');
        expect(vm.areas[1].type).toBe('client id 1 cold door exit 9266');
        expect(vm.areas[1].contents).toBe('trap 90210');
        expect(vm.areas.length).toBe(2);

        expect(dungeonServiceMock.getDungeonAreasFromDoor).toHaveBeenCalledWith('client id 1',
            9266,
            'mountain',
            'cold',
            'day',
            90210,
            ['character', 'yo mamma'],
            false,
            false);
    });

    it('verifies filters are not valid', function () {
        scope.$digest();
        expect(vm.filtersAreValid).toBeTruthy();

        vm.creatureTypeFilters[0].checked = true;
        scope.$digest();

        expect(vm.filtersAreValid).toBeFalsy();
        expect(vm.validating).toBeFalsy();
    });

    it('verifies filters are not valid when environment changes', function () {
        scope.$digest();
        expect(vm.filtersAreValid).toBeTruthy();

        vm.environment = "invalid";
        scope.$digest();

        expect(vm.filtersAreValid).toBeFalsy();
        expect(vm.validating).toBeFalsy();
    });

    it('verifies filters are not valid when temperature changes', function () {
        scope.$digest();
        expect(vm.filtersAreValid).toBeTruthy();

        vm.temperature = "invalid";
        scope.$digest();

        expect(vm.filtersAreValid).toBeFalsy();
        expect(vm.validating).toBeFalsy();
    });

    it('verifies filters are not valid when time of day changes', function () {
        scope.$digest();
        expect(vm.filtersAreValid).toBeTruthy();

        vm.timeOfDay = "invalid";
        scope.$digest();

        expect(vm.filtersAreValid).toBeFalsy();
        expect(vm.validating).toBeFalsy();
    });

    it('verifies filters are not valid when level changes', function () {
        scope.$digest();
        expect(vm.filtersAreValid).toBeTruthy();

        vm.level = 666;
        scope.$digest();

        expect(vm.filtersAreValid).toBeFalsy();
        expect(vm.validating).toBeFalsy();
    });

    it('verifies no filters are valid', function () {
        scope.$digest();
        expect(vm.filtersAreValid).toBeTruthy();

        vm.creatureTypeFilters[0].checked = true;
        scope.$digest();

        expect(vm.filtersAreValid).toBeFalsy();

        vm.creatureTypeFilters[0].checked = false;
        scope.$digest();

        expect(vm.filtersAreValid).toBeTruthy();
        expect(vm.validating).toBeFalsy();
    });

    it('verifies filters are valid', function () {
        scope.$digest();
        expect(vm.filtersAreValid).toBeTruthy();

        vm.creatureTypeFilters[1].checked = true;
        scope.$digest();

        expect(vm.filtersAreValid).toBeTruthy();
        expect(vm.validating).toBeFalsy();
    });
})