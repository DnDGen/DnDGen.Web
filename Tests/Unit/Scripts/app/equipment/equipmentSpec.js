describe('the EquipmentController', function () {
    var vm;
    var equipmentServiceMock;
    var q;
    var bootstrapDataMock;
    var scope;

    beforeEach(module('app.equipment'));

    beforeEach(function () {
        bootstrapDataMock = {
            equipmentModel: {
                TreasureTypes: ["first treasure", "second treasure"],
                MundaneItemTypes: ["first mundane item", "second mundane item"],
                PoweredItemTypes: ["first powered item", "second powered item"],
                ItemPowers: [
                    ["1-1", "1-2"],
                    ["2-1", "2-2"]
                ]
            }
        };

        equipmentServiceMock = {
            getTreasure: function (treasureType, level) {
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
    });

    function getMockedPromise(treasure) {
        var deferred = q.defer();
        deferred.resolve({ "treasure": treasure });
        return deferred.promise;
    }

    beforeEach(inject(function ($rootScope, $controller, $q) {
        q = $q;
        scope = $rootScope.$new();
        vm = $controller('Equipment as vm', {
            $scope: scope,
            bootstrapData: bootstrapDataMock,
            equipmentService: equipmentServiceMock
        });
    }));

    it('has a bootstrapped model', function () {
        expect(vm.equipmentModel).toBe(bootstrapDataMock.equipmentModel);
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

    it('generates treasure', function () {
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
        vm.poweredItemType = vm.equipmentModel.PoweredItemTypes[1];
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

        vm.poweredItemType = vm.equipmentModel.PoweredItemTypes[1];
        scope.$digest();

        expect(vm.itemPowers[0]).toBe('2-1');
        expect(vm.itemPowers[1]).toBe('2-2');
        expect(vm.itemPowers.length).toBe(2);
        expect(vm.itemPower).toBe('2-1');
    });
})