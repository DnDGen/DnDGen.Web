'use strict'

describe('Encounter Controller', function () {
    var vm;
    var encounterServiceMock;
    var q;
    var bootstrapDataMock;
    var scope;
    var sweetAlertServiceMock;
    var fileSaverServiceMock;
    var encounterFormatterServiceMock;

    beforeEach(module('app.encounter'));

    beforeEach(function () {
        bootstrapDataMock = {
            Environments: ["field", "mountain"]
        };

        encounterServiceMock = {
            getEncounter: function (environment, level) {
                var encounter = { creature: "Monster " + level + " in " + environment };
                return getMockedPromise(encounter);
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

    function getMockedPromise(encounter) {
        var deferred = q.defer();

        if (encounter.creature.indexOf('666') > -1)
            deferred.reject();
        else
            deferred.resolve({ "encounter": encounter });

        return deferred.promise;
    }

    beforeEach(inject(function ($rootScope, $controller, $q) {
        q = $q;
        scope = $rootScope.$new();
        vm = $controller('Encounter as vm', {
            $scope: scope,
            bootstrapData: bootstrapDataMock,
            encounterService: encounterServiceMock,
            sweetAlertService: sweetAlertServiceMock,
            fileSaverService: fileSaverServiceMock,
            encounterFormatterService: encounterFormatterServiceMock
        });
    }));

    it('has a bootstrapped model', function () {
        expect(vm.encounterModel).toBe(bootstrapDataMock);
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
})