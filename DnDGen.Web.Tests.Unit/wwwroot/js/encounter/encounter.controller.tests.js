'use strict'

describe('Encounter Controller', function () {
    var vm;
    var encounterServiceMock;
    var q;
    var model;
    var scope;
    var sweetAlertServiceMock;
    var fileSaverServiceMock;
    var encounterFormatterServiceMock;

    beforeEach(module('app.encounter'));

    beforeEach(function () {
        model = {
            environments: ["field", "mountain", "swamp"],
            temperatures: ["cold", "hot", "tropical"],
            timesOfDay: ["day", "night", "twilight"],
            creatureTypes: ["undead", "character", "yo mamma"],
            defaults: {
                environment: "mountain",
                level: 90210,
                temperature: "hot",
                timeOfDay: "night"
            }
        };

        var counter = 0;
        encounterServiceMock = {
            getEncounter: function (environment, temperature, timeOfDay, level, filters, allowAquatic, allowUnderground) {
                var encounter = {
                    creature: "Monster " + (level + counter) + " in " + temperature + ' ' + environment + ' ' + timeOfDay,
                    aquatic: allowAquatic,
                    underground: allowUnderground
                };
                var shouldFail = level === 666;
                counter++;
                return getMockedPromise(encounter, shouldFail);
            },
            validateFilters: function (environment, temperature, timeOfDay, level, filters, allowAQuatic, allowUnderground) {
                var valid = (filters[0] !== 'undead' && environment !== "invalid" && temperature !== "invalid" && timeOfDay !== "invalid" && level !== 666);
                return getMockedPromise(valid);
            }
        };

        sweetAlertServiceMock = {};
        sweetAlertServiceMock.showError = jasmine.createSpy();

        fileSaverServiceMock = {};
        fileSaverServiceMock.save = jasmine.createSpy();

        encounterFormatterServiceMock = {
            formatEncounter: function (encounter) {
                return encounter.creature + " formatted";
            }
        };
    });

    function getMockedPromise(data, shouldFail) {
        var deferred = q.defer();

        if (shouldFail)
            deferred.reject();
        else
            deferred.resolve({ data: data });

        return deferred.promise;
    }

    beforeEach(inject(function ($rootScope, $controller, $q) {
        q = $q;
        scope = $rootScope.$new();
        vm = $controller('Encounter as vm', {
            $scope: scope,
            model: model,
            encounterService: encounterServiceMock,
            sweetAlertService: sweetAlertServiceMock,
            fileSaverService: fileSaverServiceMock,
            encounterFormatterService: encounterFormatterServiceMock
        });
    }));

    it('has a model', function () {
        expect(vm.encounterModel).toBe(model);
    });

    it('has initial values for inputs', function () {
        expect(vm.level).toBe(90210);
        expect(vm.environment).toBe('mountain');
        expect(vm.temperature).toBe('hot');
        expect(vm.timeOfDay).toBe('night');
        expect(vm.allowAquatic).toBeFalsy();
        expect(vm.allowUnderground).toBeFalsy();
    });

    it('has an empty encounter for results', function () {
        expect(vm.encounter).toBeNull();
    });

    it('is not generating on load', function () {
        expect(vm.generating).toBeFalsy();
    });

    it('is not validating on load', function () {
        expect(vm.validating).toBeFalsy();
    });

    it('generates encounter', function () {
        vm.environment = 'mountain';
        vm.temperature = "temp";
        vm.timeOfDay = 'twilight';
        vm.level = 9266;

        vm.generateEncounter();
        scope.$apply();

        expect(vm.encounter.creature).toBe('Monster 9266 in temp mountain twilight');
        expect(vm.encounter.aquatic).toBeFalsy();
        expect(vm.encounter.undeground).toBeFalsy();
    });

    it('generates aquatic encounter', function () {
        vm.environment = 'mountain';
        vm.temperature = "temp";
        vm.timeOfDay = 'twilight';
        vm.level = 9266;
        vm.allowAquatic = true;

        vm.generateEncounter();
        scope.$apply();

        expect(vm.encounter.creature).toBe('Monster 9266 in temp mountain twilight');
        expect(vm.encounter.aquatic).toBeTruthy();
        expect(vm.encounter.undeground).toBeFalsy();
    });

    it('generates underground encounter', function () {
        vm.environment = 'mountain';
        vm.temperature = "temp";
        vm.timeOfDay = 'twilight';
        vm.level = 9266;
        vm.allowUnderground = true;

        vm.generateEncounter();
        scope.$apply();

        expect(vm.encounter.creature).toBe('Monster 9266 in temp mountain twilight');
        expect(vm.encounter.aquatic).toBeFalsy();
        expect(vm.encounter.underground).toBeTruthy();
    });

    it('generates encounter uniquely', function () {
        vm.environment = 'mountain';
        vm.temperature = "temp";
        vm.timeOfDay = 'twilight';
        vm.level = 9266;

        vm.generateEncounter();
        scope.$apply();

        expect(vm.encounter.creature).toBe('Monster 9266 in temp mountain twilight');

        vm.generateEncounter();
        scope.$apply();

        expect(vm.encounter.creature).toBe('Monster 9267 in temp mountain twilight');
    });

    it('says it is generating while fetching encounter', function () {
        vm.environment = 'mountain';
        vm.temperature = "temp";
        vm.timeOfDay = 'twilight';
        vm.level = 9266;

        vm.generateEncounter();

        expect(vm.generating).toBeTruthy();
    });

    it('says it is done generating while fetching encounter', function () {
        vm.environment = 'mountain';
        vm.temperature = "temp";
        vm.timeOfDay = 'twilight';
        vm.level = 9266;

        vm.generateEncounter();
        scope.$apply();

        expect(vm.generating).toBeFalsy();
    });

    it('says it is done generating if an error is thrown while fetching encounter', function () {
        vm.environment = 'mountain';
        vm.temperature = "temp";
        vm.timeOfDay = 'twilight';
        vm.level = 666;

        vm.generateEncounter();
        scope.$apply();

        expect(vm.generating).toBeFalsy();
    });

    it('shows an alert if an error is thrown while fetching encounter', function () {
        vm.environment = 'mountain';
        vm.temperature = "temp";
        vm.timeOfDay = 'twilight';
        vm.level = 666;

        vm.generateEncounter();
        scope.$apply();

        expect(sweetAlertServiceMock.showError).toHaveBeenCalled();
    });

    it('clears the encounter if an error is thrown while fetching encounter', function () {
        vm.environment = 'mountain';
        vm.temperature = "temp";
        vm.timeOfDay = 'twilight';
        vm.level = 9266;

        vm.generateEncounter();
        scope.$apply();

        vm.level = 666;

        vm.generateEncounter();
        scope.$apply();

        expect(vm.encounter).toBeNull();
    });

    it('downloads encounter', function () {
        vm.environment = 'mountain';
        vm.temperature = "temp";
        vm.timeOfDay = 'twilight';
        vm.level = 9266;

        vm.encounter = {
            creature: 'Monster 9266 in field'
        };

        vm.download();
        scope.$apply();

        var fileName = 'temp mountain twilight level 9266 encounter ' + new Date().toString();
        expect(fileSaverServiceMock.save).toHaveBeenCalledWith('Monster 9266 in field formatted', fileName);
    });

    it('has creature type filters', function () {
        expect(vm.creatureTypeFilters[0].name).toBe("undead");
        expect(vm.creatureTypeFilters[0].checked).toBe(false);
        expect(vm.creatureTypeFilters[1].name).toBe("character");
        expect(vm.creatureTypeFilters[1].checked).toBe(false);
        expect(vm.creatureTypeFilters[2].name).toBe("yo mamma");
        expect(vm.creatureTypeFilters[2].checked).toBe(false);
    });

    it('uses filters when generating an encounter', function () {
        vm.creatureTypeFilters[1].checked = true;
        vm.creatureTypeFilters[2].checked = true;
        vm.environment = 'swamp';
        vm.level = 9266;

        spyOn(encounterServiceMock, 'getEncounter').and.callThrough();

        vm.generateEncounter();
        scope.$apply();

        expect(vm.encounter.creature).toBe('Monster 9266 in hot swamp night');
        expect(encounterServiceMock.getEncounter).toHaveBeenCalledWith(
            'swamp',
            'hot',
            'night',
            9266,
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