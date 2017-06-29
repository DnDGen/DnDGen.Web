'use strict'

describe('Treasure Controller', function () {
    var vm;
    var treasureServiceMock;
    var q;
    var model;
    var scope;
    var sweetAlertServiceMock;
    var fileSaverServiceMock;
    var treasureFormatterServiceMock;
    var eventServiceMock;

    beforeEach(module('app.treasure'));

    beforeEach(function () {
        model = {
            TreasureTypes: ["first treasure", "second treasure"],
            ItemPowers: {
                'first item type': ["1-1", "1-2"],
                'second item type': ["2-1", "2-2"]
            }
        };

        treasureServiceMock = {
            getTreasure: function (clientId, treasureType, level) {
                var treasure = { description: clientId + ' ' + treasureType + ' ' + level };
                var data = { treasure: treasure };
                return getMockedPromise(data);
            },
            getItem: function (clientId, itemType, power) {
                var treasure = { description: clientId + ' ' + power + ' ' + itemType };
                var data = { treasure: treasure };
                return getMockedPromise(data);
            }
        };

        sweetAlertServiceMock = {};
        sweetAlertServiceMock.showError = jasmine.createSpy();

        fileSaverServiceMock = {};
        fileSaverServiceMock.save = jasmine.createSpy();

        treasureFormatterServiceMock = {
            formatTreasure: function (treasure) {
                return treasure.description;
            },
            formatItem: function (item) {
                return item.toString();
            }
        };

        var idCount = 1;
        eventServiceMock = {
            getClientId: function () {
                var data = { clientId: 'client id ' + idCount++ };
                return getMockedPromise(data);
            }
        };
    });

    function getMockedPromise(data) {
        var deferred = q.defer();

        if (data.treasure && data.treasure.description.indexOf('666') > -1)
            deferred.reject();
        else
            deferred.resolve({ data: data });

        return deferred.promise;
    }

    beforeEach(inject(function ($rootScope, $controller, $q) {
        q = $q;
        scope = $rootScope.$new();
        vm = $controller('Treasure as vm', {
            $scope: scope,
            model: model,
            treasureService: treasureServiceMock,
            sweetAlertService: sweetAlertServiceMock,
            fileSaverService: fileSaverServiceMock,
            treasureFormatterService: treasureFormatterServiceMock,
            eventService: eventServiceMock,
        });
    }));

    it('has a model', function () {
        expect(vm.treasureModel).toBe(model);
    });

    it('has initial values for inputs', function () {
        expect(vm.level).toBe(1);
        expect(vm.treasureType).toBe('first treasure');
        expect(vm.itemType).toBe('first item type');
        expect(vm.power).toBe('1-1');
    });

    it('has an empty treasure for results', function () {
        expect(vm.treasure).toBeNull();
    });

    it('is not generating on load', function () {
        expect(vm.generating).toBeFalsy();
    });

    it('generates treasure', function () {
        vm.treasureType = 'Treasure';
        vm.level = 9266;

        vm.generateTreasure();
        scope.$apply();

        expect(vm.treasure.description).toBe('client id 1 Treasure 9266');
    });

    it('generates treasure uniquely', function () {
        vm.treasureType = 'Treasure';
        vm.level = 9266;

        vm.generateTreasure();
        scope.$apply();

        expect(vm.treasure.description).toBe('client id 1 Treasure 9266');

        vm.generateTreasure();
        scope.$apply();

        expect(vm.treasure.description).toBe('client id 2 Treasure 9266');
    });

    it('generates treasure type', function () {
        vm.treasureType = 'treasure type';
        vm.level = 9266;

        vm.generateTreasure();
        scope.$apply();

        expect(vm.treasure.description).toBe('client id 1 treasure type 9266');
    });

    it('generates treasure type uniquely', function () {
        vm.treasureType = 'treasure type';
        vm.level = 9266;

        vm.generateTreasure();
        scope.$apply();

        expect(vm.treasure.description).toBe('client id 1 treasure type 9266');
        vm.generateTreasure();
        scope.$apply();

        expect(vm.treasure.description).toBe('client id 2 treasure type 9266');
    });

    it('generates mundane item', function () {
        vm.power = 'mundane';
        vm.itemType = 'item type';

        vm.generateItem();
        scope.$apply();

        expect(vm.treasure.description).toBe('client id 1 mundane item type');
    });

    it('generates mundane item uniquely', function () {
        vm.power = 'mundane';
        vm.itemType = 'item type';

        vm.generateItem();
        scope.$apply();

        expect(vm.treasure.description).toBe('client id 1 mundane item type');

        vm.generateItem();
        scope.$apply();

        expect(vm.treasure.description).toBe('client id 2 mundane item type');
    });

    it('generates powered item', function () {
        vm.power = 'power';
        vm.itemType = 'item type';

        vm.generateItem();
        scope.$apply();

        expect(vm.treasure.description).toBe('client id 1 power item type');
    });

    it('generates powered item uniquely', function () {
        vm.power = 'power';
        vm.itemType = 'item type';

        vm.generateItem();
        scope.$apply();

        expect(vm.treasure.description).toBe('client id 1 power item type');

        vm.generateItem();
        scope.$apply();

        expect(vm.treasure.description).toBe('client id 2 power item type');
    });

    it('updates the powers when the item type is changed', function () {
        scope.$digest();

        vm.itemType = Object.keys(vm.treasureModel.ItemPowers)[1];
        scope.$digest();

        expect(vm.powers[0]).toBe('2-1');
        expect(vm.powers[1]).toBe('2-2');
        expect(vm.powers.length).toBe(2);
        expect(vm.power).toBe('2-1');
    });

    it('says it is generating while fetching treasure', function () {
        vm.treasureType = 'treasure type';
        vm.level = 9266;

        vm.generateTreasure();

        expect(vm.generating).toBeTruthy();
    });

    it('says it is done generating while fetching treasure', function () {
        vm.treasureType = 'treasure type';
        vm.level = 9266;

        vm.generateTreasure();
        scope.$apply();

        expect(vm.generating).toBeFalsy();
    });

    it('says it is generating while fetching an item', function () {
        vm.itemType = Object.keys(vm.treasureModel.ItemPowers)[1];
        vm.power = 'power';

        vm.generateItem();

        expect(vm.generating).toBeTruthy();
    });

    it('says it is done generating while fetching an item', function () {
        vm.itemType = Object.keys(vm.treasureModel.ItemPowers)[1];
        vm.power = 'power';

        vm.generateItem();
        scope.$apply();

        expect(vm.generating).toBeFalsy();
    });

    it('says it is done generating if an error is thrown while fetching treasure', function () {
        vm.treasureType = 'treasure type';
        vm.level = 666;

        vm.generateTreasure();
        scope.$apply();

        expect(vm.generating).toBeFalsy();
    });

    it('shows an alert if an error is thrown while fetching treasure', function () {
        vm.treasureType = 'treasure type';
        vm.level = 666;

        vm.generateTreasure();
        scope.$apply();

        expect(sweetAlertServiceMock.showError).toHaveBeenCalled();
    });

    it('says it is done generating if an error is thrown while fetching item', function () {
        vm.power = '666';

        vm.generateItem();
        scope.$apply();

        expect(vm.generating).toBeFalsy();
    });

    it('shows an alert if an error is thrown while fetching item', function () {
        vm.power = '666';

        vm.generateItem();
        scope.$apply();

        expect(sweetAlertServiceMock.showError).toHaveBeenCalled();
    });

    it('clears the treasure if an error is thrown while fetching treasure', function () {
        vm.treasureType = 'treasure type';
        vm.level = 9266;

        vm.generateTreasure();
        scope.$apply();

        vm.level = 666;

        vm.generateTreasure();
        scope.$apply();

        expect(vm.treasure).toBeNull();
    });

    it('clears the treasure if an error is thrown while fetching items', function () {
        vm.generateItem();
        scope.$apply();

        vm.power = '666';

        vm.generateItem();
        scope.$apply();

        expect(vm.treasure).toBeNull();
    });

    it('downloads treasure', function () {
        vm.treasure = {
            description: 'Treasure 9266'
        };

        vm.download();
        scope.$apply();

        var fileName = 'Treasure ' + new Date().toString();
        expect(fileSaverServiceMock.save).toHaveBeenCalledWith('Treasure 9266', fileName);
    });
})