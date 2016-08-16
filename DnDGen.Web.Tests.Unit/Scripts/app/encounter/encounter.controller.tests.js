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
            Environments: ["field", "mountain"],
            CreatureTypes: ["undead", "character", "yo mamma"]
        };

        encounterServiceMock = {
            getEncounter: function (environment, level, filters) {
                var encounter = { creature: "Monster " + level + " in " + environment };
                var data = { "encounter": encounter };
                var shouldFail = level === 666;
                return getMockedPromise(data, shouldFail);
            },
            validateFilters: function(environment, level, filters) {
                var data = { "isValid": (filters[0] !== 'undead' && environment !== "invalid" && level !== 666) };
                return getMockedPromise(data);
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
            deferred.resolve(data);

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
        expect(vm.level).toBe(1);
        expect(vm.environment).toBe('field');
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
        vm.level = 9266;

        vm.generateEncounter();
        scope.$apply();

        expect(vm.encounter.creature).toBe('Monster 9266 in mountain');
    });

    it('says it is generating while fetching encounter', function () {
        vm.environment = 'mountain';
        vm.level = 9266;

        vm.generateEncounter();

        expect(vm.generating).toBeTruthy();
    });

    it('says it is done generating while fetching encounter', function () {
        vm.environment = 'mountain';
        vm.level = 9266;

        vm.generateEncounter();
        scope.$apply();

        expect(vm.generating).toBeFalsy();
    });

    it('says it is done generating if an error is thrown while fetching encounter', function () {
        vm.environment = 'mountain';
        vm.level = 666;

        vm.generateEncounter();
        scope.$apply();

        expect(vm.generating).toBeFalsy();
    });

    it('shows an alert if an error is thrown while fetching encounter', function () {
        vm.environment = 'mountain';
        vm.level = 666;

        vm.generateEncounter();
        scope.$apply();

        expect(sweetAlertServiceMock.showError).toHaveBeenCalled();
    });

    it('clears the encounter if an error is thrown while fetching encounter', function () {
        vm.environment = 'mountain';
        vm.level = 9266;

        vm.generateEncounter();
        scope.$apply();

        vm.level = 666;

        vm.generateEncounter();
        scope.$apply();

        expect(vm.encounter).toBeNull();
    });

    it('downloads encounter', function () {
        vm.environment = 'field';
        vm.level = 9266;
        vm.encounter = {
            creature: 'Monster 9266 in field'
        };

        vm.download();
        scope.$apply();

        var fileName = 'field level 9266 encounter ' + new Date().toString();
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
        vm.environment = 'mountain';
        vm.level = 9266;

        spyOn(encounterServiceMock, 'getEncounter').and.callThrough();

        vm.generateEncounter();
        scope.$apply();

        expect(vm.encounter.creature).toBe('Monster 9266 in mountain');
        expect(encounterServiceMock.getEncounter).toHaveBeenCalledWith('mountain', 9266, ['character', 'yo mamma']);
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