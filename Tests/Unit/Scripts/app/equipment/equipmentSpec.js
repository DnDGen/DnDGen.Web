describe('Unit: EquipmentController', function () {
    var equipmentController;
    var scope;
    var equipmentServiceMock;
    var q;

    beforeEach(module('app.equipment'));

    beforeEach(function () {
        bootstrapDataMock = {
            equipmentModel: {
                Mundane: 'Mundane',
                Minor: 'Minor',
                Medium: 'Medium',
                Major: 'Major',
            }
        };

        equipmentServiceMock = {
            getTreasure: function (quantity) {
                return getMockedPromise(quantity, 2);
            },
            getCoin: function (quantity) {
                return getMockedPromise(quantity, 3);
            },
            getGoods: function (quantity) {
                return getMockedPromise(quantity, 4);
            },
            getItems: function (quantity) {
                return getMockedPromise(quantity, 6);
            },
            getAlchemicalItem: function (quantity) {
                return getMockedPromise(quantity, 8);
            },
            getArmor: function (quantity) {
                return getMockedPromise(quantity, 10);
            },
            getPotion: function (quantity) {
                return getMockedPromise(quantity, 12);
            },
            getRing: function (quantity) {
                return getMockedPromise(quantity, 20);
            },
            getRod: function (quantity) {
                return getMockedPromise(quantity, 100);
            },
            getScroll: function (quantity, die) {
                return getMockedPromise(quantity, die);
            },
            getStaff: function (quantity, die) {
                return getMockedPromise(quantity, die);
            },
            getTool: function (quantity, die) {
                return getMockedPromise(quantity, die);
            },
            getWand: function (quantity, die) {
                return getMockedPromise(quantity, die);
            },
            getWeapon: function (quantity, die) {
                return getMockedPromise(quantity, die);
            },
            getWondrousItem: function (quantity, die) {
                return getMockedPromise(quantity, die);
            },
        };
    });

    function getMockedPromise(quantity, die) {
        var deferred = q.defer();
        deferred.resolve({ "roll": quantity * die });
        return deferred.promise;
    }

    beforeEach(inject(function ($rootScope, $controller, $q) {
        scope = $rootScope.$new();
        q = $q;
        equipmentController = $controller('Equipment', {
            $scope: scope,
            bootstrapData: bootstrapDataMock,
            equipmentService: equipmentServiceMock
        });
    }));

    it('has selected levels of 1 at beginning', function () {
        expect(scope.selectedLevels.treasure).toBe(1);
        expect(scope.selectedLevels.coin).toBe(1);
        expect(scope.selectedLevels.goods).toBe(1);
        expect(scope.selectedLevels.items).toBe(1);
    });
})