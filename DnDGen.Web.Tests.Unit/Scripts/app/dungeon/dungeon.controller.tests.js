'use strict'

describe('Dungeon Controller', function () {
    var vm;
    var dungeonServiceMock;
    var q;
    var scope;
    var sweetAlertServiceMock;
    var fileSaverServiceMock;
    var dungeonFormatterServiceMock;
    var model;

    beforeEach(module('app.dungeon'));

    beforeEach(function () {
        dungeonServiceMock = {
            getDungeonAreasFromHall: function (dungeonLevel, partyLevel, temperature) {
                var body = {
                    areas: [
                        { type: temperature + ' hall room ' + dungeonLevel, contents: 'monster ' + partyLevel },
                        { type: temperature + ' hall exit ' + dungeonLevel, contents: 'trap '  + partyLevel}
                    ]
                };

                if (dungeonLevel == 666)
                    return getMockedPromise(body, true);

                return getMockedPromise(body);
            },
            getDungeonAreasFromDoor: function (dungeonLevel, partyLevel, temperature) {
                var body = {
                    areas: [
                        { type: temperature + ' door room ' + dungeonLevel, contents: 'monster ' + partyLevel },
                        { type: temperature + ' door exit ' + dungeonLevel, contents: 'trap '  + partyLevel}
                    ]
                };

                if (dungeonLevel == 666)
                    return getMockedPromise(body, true);

                return getMockedPromise(body);
            }
        };

        model = {
            Temperatures: ['cold', 'hot']
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
    });

    function getMockedPromise(body, shouldFail) {
        var deferred = q.defer();

        if (shouldFail)
            deferred.reject();
        else
            deferred.resolve(body);

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
            model: model
        });
    }));

    it('has initial values for inputs', function () {
        expect(vm.dungeonLevel).toBe(1);
        expect(vm.partyLevel).toBe(1);
        expect(vm.temperature).toBe('cold');
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

    it('generates dungeon areas from hall', function () {
        vm.dungeonLevel = 9266;
        vm.partyLevel = 90210;
        vm.temperature = 'temp';

        vm.generateDungeonAreasFromHall();
        scope.$apply();

        expect(vm.areas[0].type).toBe('temp hall room 9266');
        expect(vm.areas[0].contents).toBe('monster 90210');
        expect(vm.areas[1].type).toBe('temp hall exit 9266');
        expect(vm.areas[1].contents).toBe('trap 90210');
        expect(vm.areas.length).toBe(2);
    });

    it('says it is generating while fetching dungeon areas from hall', function () {
        vm.dungeonLevel = 9266;
        vm.partyLevel = 90210;
        vm.temperature = 'temp';

        vm.generateDungeonAreasFromHall();

        expect(vm.generating).toBeTruthy();
    });

    it('says it is done generating while fetching dungeon areas from hall', function () {
        vm.dungeonLevel = 9266;
        vm.partyLevel = 90210;
        vm.temperature = 'temp';

        vm.generateDungeonAreasFromHall();
        scope.$apply();

        expect(vm.generating).toBeFalsy();
    });

    it('says it is done generating if an error is thrown while fetching dungeon areas from hall', function () {
        vm.dungeonLevel = 666;
        vm.partyLevel = 90210;
        vm.temperature = 'temp';

        vm.generateDungeonAreasFromHall();
        scope.$apply();

        expect(vm.generating).toBeFalsy();
    });

    it('shows an alert if an error is thrown while fetching dungeon areas from hall', function () {
        vm.dungeonLevel = 666;
        vm.partyLevel = 90210;
        vm.temperature = 'temp';

        vm.generateDungeonAreasFromHall();
        scope.$apply();

        expect(sweetAlertServiceMock.showError).toHaveBeenCalled();
    });

    it('clears the areas if an error is thrown while fetching dungeon areas from hall', function () {
        vm.dungeonLevel = 9266;
        vm.partyLevel = 90210;
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
        vm.partyLevel = 90210;
        vm.temperature = 'temp';

        vm.generateDungeonAreasFromDoor();
        scope.$apply();

        expect(vm.areas[0].type).toBe('temp door room 9266');
        expect(vm.areas[0].contents).toBe('monster 90210');
        expect(vm.areas[1].type).toBe('temp door exit 9266');
        expect(vm.areas[1].contents).toBe('trap 90210');
        expect(vm.areas.length).toBe(2);
    });

    it('says it is generating while fetching dungeon areas from door', function () {
        vm.dungeonLevel = 9266;
        vm.partyLevel = 90210;
        vm.temperature = 'temp';

        vm.generateDungeonAreasFromDoor();

        expect(vm.generating).toBeTruthy();
    });

    it('says it is done generating while fetching dungeon areas from door', function () {
        vm.dungeonLevel = 9266;
        vm.partyLevel = 90210;
        vm.temperature = 'temp';

        vm.generateDungeonAreasFromDoor();
        scope.$apply();

        expect(vm.generating).toBeFalsy();
    });

    it('says it is done generating if an error is thrown while fetching dungeon areas from door', function () {
        vm.dungeonLevel = 666;
        vm.partyLevel = 90210;
        vm.temperature = 'temp';

        vm.generateDungeonAreasFromDoor();
        scope.$apply();

        expect(vm.generating).toBeFalsy();
    });

    it('shows an alert if an error is thrown while fetching dungeon areas from door', function () {
        vm.dungeonLevel = 666;
        vm.partyLevel = 90210;
        vm.temperature = 'temp';

        vm.generateDungeonAreasFromDoor();
        scope.$apply();

        expect(sweetAlertServiceMock.showError).toHaveBeenCalled();
    });

    it('clears the areas if an error is thrown while fetching dungeon areas from door', function () {
        vm.dungeonLevel = 9266;
        vm.partyLevel = 90210;
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
        vm.partyLevel = 90210;
        vm.temperature = 'temp';

        vm.generateDungeonAreasFromHall();
        scope.$apply();

        vm.download();
        scope.$apply();

        var fileName = 'temp Dungeon level 9266, party level 90210 ' + new Date().toString();
        var formattedAreas = 'Area 1:\n'
            + '\ttemp hall room 9266\n'
            + '\tmonster 90210\n'
            + 'Area 2:\n'
            + '\ttemp hall exit 9266\n'
            + '\ttrap 90210\n';

        expect(fileSaverServiceMock.save).toHaveBeenCalledWith(formattedAreas, fileName);
    });
})