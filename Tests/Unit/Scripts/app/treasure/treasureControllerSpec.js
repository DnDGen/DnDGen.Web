'use strict'

describe('Treasure Controller', function () {
    var vm;
    var treasureServiceMock;
    var q;
    var bootstrapDataMock;
    var scope;
    var sweetAlertServiceMock;

    beforeEach(module('app.treasure'));

    beforeEach(function () {
        bootstrapDataMock = {
            treasureModel: {
                TreasureTypes: ["first treasure", "second treasure"],
                MundaneItemTypes: ["first mundane item", "second mundane item"],
                PoweredItemTypes: ["first powered item", "second powered item"],
                ItemPowers: [
                    ["1-1", "1-2"],
                    ["2-1", "2-2"]
                ]
            }
        };

        treasureServiceMock = {
            getTreasure: function (level) {
                var treasure = { description: "Treasure " + level };
                return getMockedPromise(treasure);
            },
            getTreasureType: function (treasureType, level) {
                var treasure = { description: treasureType + level };
                return getMockedPromise(treasure);
            },
            getMundaneItem: function (itemType) {
                var treasure = { description: itemType };
                return getMockedPromise(treasure);
            },
            getPoweredItem: function (itemType, power) {
                var treasure = { description: itemType + power };
                return getMockedPromise(treasure);
            }
        };

        sweetAlertServiceMock = {};
        sweetAlertServiceMock.showError = jasmine.createSpy();
    });

    function getMockedPromise(treasure) {
        var deferred = q.defer();

        if (treasure.description.indexOf('666') > -1)
            deferred.reject();
        else
            deferred.resolve({ "treasure": treasure });

        return deferred.promise;
    }

    beforeEach(inject(function ($rootScope, $controller, $q) {
        q = $q;
        scope = $rootScope.$new();
        vm = $controller('Treasure as vm', {
            $scope: scope,
            bootstrapData: bootstrapDataMock,
            treasureService: treasureServiceMock,
            sweetAlertService: sweetAlertServiceMock
        });
    }));

    it('has a bootstrapped model', function () {
        expect(vm.treasureModel).toBe(bootstrapDataMock.treasureModel);
    });

    it('has initial values for inputs', function () {
        expect(vm.treasureLevel).toBe(1);
        expect(vm.treasureType).toBe('first treasure');
        expect(vm.mundaneItemType).toBe('first mundane item');
        expect(vm.poweredItemType).toBe('first powered item');
    });

    it('has an empty treasure for results', function () {
        expect(vm.treasure).toBeNull();
    });

    it('is not generating on load', function () {
        expect(vm.generating).toBeFalsy();
    });

    it('generates treasure', function () {
        vm.treasureType = 'Treasure';
        vm.treasureLevel = 9266;

        vm.generateTreasure();
        scope.$apply();

        expect(vm.treasure.description).toBe('Treasure 9266');
    });

    it('generates treasure type', function () {
        vm.treasureType = 'treasure type';
        vm.treasureLevel = 9266;

        vm.generateTreasure();
        scope.$apply();

        expect(vm.treasure.description).toBe('treasure type9266');
    });

    it('generates mundane item', function () {
        vm.mundaneItemType = 'mundane item type';

        vm.generateMundaneItem();
        scope.$apply();

        expect(vm.treasure.description).toBe('mundane item type');
    });

    it('generates powered item', function () {
        vm.poweredItemType = vm.treasureModel.PoweredItemTypes[1];
        vm.itemPower = 'power';

        vm.generatePoweredItem();
        scope.$apply();

        expect(vm.treasure.description).toBe('second powered itempower');
    });

    it('updates the item powers on load', function () {
        scope.$digest();

        expect(vm.itemPowers[0]).toBe('1-1');
        expect(vm.itemPowers[1]).toBe('1-2');
        expect(vm.itemPowers.length).toBe(2);
        expect(vm.itemPower).toBe('1-1');
    });

    it('updates the item powers when the power item type is changed', function () {
        scope.$digest();

        vm.poweredItemType = vm.treasureModel.PoweredItemTypes[1];
        scope.$digest();

        expect(vm.itemPowers[0]).toBe('2-1');
        expect(vm.itemPowers[1]).toBe('2-2');
        expect(vm.itemPowers.length).toBe(2);
        expect(vm.itemPower).toBe('2-1');
    });

    it('says it is generating while fetching treasure', function () {
        vm.treasureType = 'Treasure';
        vm.treasureLevel = 9266;

        vm.generateTreasure();

        expect(vm.generating).toBeTruthy();
    });

    it('says it is done generating while fetching treasure', function () {
        vm.treasureType = 'Treasure';
        vm.treasureLevel = 9266;

        vm.generateTreasure();
        scope.$apply();

        expect(vm.generating).toBeFalsy();
    });

    it('says it is generating while fetching treasure type', function () {
        vm.treasureType = 'treasure type';
        vm.treasureLevel = 9266;

        vm.generateTreasure();

        expect(vm.generating).toBeTruthy();
    });

    it('says it is done generating while fetching treasure type', function () {
        vm.treasureType = 'treasure type';
        vm.treasureLevel = 9266;

        vm.generateTreasure();
        scope.$apply();

        expect(vm.generating).toBeFalsy();
    });

    it('says it is generating while fetching a mundane item', function () {
        vm.mundaneItemType = 'mundane item type';

        vm.generateMundaneItem();

        expect(vm.generating).toBeTruthy();
    });

    it('says it is done generating while fetching a mundane item', function () {
        vm.mundaneItemType = 'mundane item type';

        vm.generateMundaneItem();
        scope.$apply();

        expect(vm.generating).toBeFalsy();
    });

    it('says it is generating while fetching a powered item', function () {
        vm.poweredItemType = vm.treasureModel.PoweredItemTypes[1];
        vm.itemPower = 'power';

        vm.generatePoweredItem();

        expect(vm.generating).toBeTruthy();
    });

    it('says it is done generating while fetching a powered item', function () {
        vm.poweredItemType = vm.treasureModel.PoweredItemTypes[1];
        vm.itemPower = 'power';

        vm.generatePoweredItem();
        scope.$apply();

        expect(vm.generating).toBeFalsy();
    });

    it('says it is done generating if an error is thrown while fetching treasure', function () {
        vm.treasureType = 'treasure type';
        vm.treasureLevel = 666;

        vm.generateTreasure();
        scope.$apply();

        expect(vm.generating).toBeFalsy();
    });

    it('shows an alert if an error is thrown while fetching treasure', function () {
        vm.treasureType = 'treasure type';
        vm.treasureLevel = 666;

        vm.generateTreasure();
        scope.$apply();

        expect(sweetAlertServiceMock.showError).toHaveBeenCalled();
    });

    it('says it is done generating if an error is thrown while fetching mundane item', function () {
        vm.mundaneItemType = '666';

        vm.generateMundaneItem();
        scope.$apply();

        expect(vm.generating).toBeFalsy();
    });

    it('shows an alert if an error is thrown while fetching mundane item', function () {
        vm.mundaneItemType = '666';

        vm.generateMundaneItem();
        scope.$apply();

        expect(sweetAlertServiceMock.showError).toHaveBeenCalled();
    });

    it('says it is done generating if an error is thrown while fetching powered item', function () {
        vm.poweredItemType = vm.treasureModel.PoweredItemTypes[1];
        vm.itemPower = '666';

        vm.generatePoweredItem();
        scope.$apply();

        expect(vm.generating).toBeFalsy();
    });

    it('shows an alert if an error is thrown while fetching powered item', function () {
        vm.poweredItemType = vm.treasureModel.PoweredItemTypes[1];
        vm.itemPower = '666';

        vm.generatePoweredItem();
        scope.$apply();

        expect(sweetAlertServiceMock.showError).toHaveBeenCalled();
    });

    it('clears the treasure if an error is thrown while fetching treasure', function () {
        vm.treasureType = 'treasure type';
        vm.treasureLevel = 9266;

        vm.generateTreasure();
        scope.$apply();

        vm.treasureLevel = 666;

        vm.generateTreasure();
        scope.$apply();

        expect(vm.treasure).toBeNull();
    });

    it('clears the treasure if an error is thrown while fetching mundane items', function () {
        vm.mundaneItemType = 'mundane item type';

        vm.generateMundaneItem();
        scope.$apply();

        vm.mundaneItemType = '666';

        vm.generateMundaneItem();
        scope.$apply();

        expect(vm.treasure).toBeNull();
    });

    it('clears the treasure if an error is thrown while fetching powered items', function () {
        vm.poweredItemType = vm.treasureModel.PoweredItemTypes[1];
        vm.itemPower = 'power';

        vm.generatePoweredItem();
        scope.$apply();

        vm.poweredItemType = vm.treasureModel.PoweredItemTypes[1];
        vm.itemPower = '666';

        vm.generatePoweredItem();
        scope.$apply();

        expect(vm.treasure).toBeNull();
    });
})