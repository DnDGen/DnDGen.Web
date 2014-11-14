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
                var treasure = { description: 'treasure' };
                return getMockedPromise(treasure);
            },
            getCoin: function (quantity) {
                var treasure = { description: 'coin' };
                return getMockedPromise(treasure);
            },
            getGoods: function (quantity) {
                var treasure = { description: 'goods' };
                return getMockedPromise(treasure);
            },
            getItems: function (quantity) {
                var treasure = { description: 'items' };
                return getMockedPromise(treasure);
            },
            getAlchemicalItem: function (quantity) {
                var treasure = { description: 'alchemical items' };
                return getMockedPromise(treasure);
            },
            getArmor: function (quantity) {
                var treasure = { description: 'armor' };
                return getMockedPromise(treasure);
            },
            getPotion: function (quantity) {
                var treasure = { description: 'potion' };
                return getMockedPromise(treasure);
            },
            getRing: function (quantity) {
                var treasure = { description: 'ring' };
                return getMockedPromise(treasure);
            },
            getRod: function (quantity) {
                var treasure = { description: 'rod' };
                return getMockedPromise(treasure);
            },
            getScroll: function (quantity, die) {
                var treasure = { description: 'scroll' };
                return getMockedPromise(treasure);
            },
            getStaff: function (quantity, die) {
                var treasure = { description: 'staff' };
                return getMockedPromise(treasure);
            },
            getTool: function (quantity, die) {
                var treasure = { description: 'tool' };
                return getMockedPromise(treasure);
            },
            getWand: function (quantity, die) {
                var treasure = { description: 'wand' };
                return getMockedPromise(treasure);
            },
            getWeapon: function (quantity, die) {
                var treasure = { description: 'weapon' };
                return getMockedPromise(treasure);
            },
            getWondrousItem: function (quantity, die) {
                var treasure = { description: 'wondrous item' };
                return getMockedPromise(treasure);
            },
        };
    });

    function getMockedPromise(treasure) {
        var deferred = q.defer();
        deferred.resolve({ "treasure": treasure });
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

    it('lets armor be any power', function () {
        expect(scope.powers.armor[0]).toBe(bootstrapDataMock.equipmentModel.Mundane);
        expect(scope.powers.armor[1]).toBe(bootstrapDataMock.equipmentModel.Minor);
        expect(scope.powers.armor[2]).toBe(bootstrapDataMock.equipmentModel.Medium);
        expect(scope.powers.armor[3]).toBe(bootstrapDataMock.equipmentModel.Major);
        expect(scope.powers.armor.length).toBe(4);
    });

    it('lets potions be anything but mundane', function () {
        expect(scope.powers.potion[0]).toBe(bootstrapDataMock.equipmentModel.Minor);
        expect(scope.powers.potion[1]).toBe(bootstrapDataMock.equipmentModel.Medium);
        expect(scope.powers.potion[2]).toBe(bootstrapDataMock.equipmentModel.Major);
        expect(scope.powers.potion.length).toBe(3);
    });

    it('lets rings be anything but mundane', function () {
        expect(scope.powers.ring[0]).toBe(bootstrapDataMock.equipmentModel.Minor);
        expect(scope.powers.ring[1]).toBe(bootstrapDataMock.equipmentModel.Medium);
        expect(scope.powers.ring[2]).toBe(bootstrapDataMock.equipmentModel.Major);
        expect(scope.powers.ring.length).toBe(3);
    });

    it('lets rods be medium or major', function () {
        expect(scope.powers.rod[0]).toBe(bootstrapDataMock.equipmentModel.Medium);
        expect(scope.powers.rod[1]).toBe(bootstrapDataMock.equipmentModel.Major);
        expect(scope.powers.rod.length).toBe(2);
    });

    it('lets scrolls be anything but mundane', function () {
        expect(scope.powers.scroll[0]).toBe(bootstrapDataMock.equipmentModel.Minor);
        expect(scope.powers.scroll[1]).toBe(bootstrapDataMock.equipmentModel.Medium);
        expect(scope.powers.scroll[2]).toBe(bootstrapDataMock.equipmentModel.Major);
        expect(scope.powers.scroll.length).toBe(3);
    });

    it('lets staves be medium or major', function () {
        expect(scope.powers.staff[0]).toBe(bootstrapDataMock.equipmentModel.Medium);
        expect(scope.powers.staff[1]).toBe(bootstrapDataMock.equipmentModel.Major);
        expect(scope.powers.staff.length).toBe(2);
    });

    it('lets wands be anything but mundane', function () {
        expect(scope.powers.wand[0]).toBe(bootstrapDataMock.equipmentModel.Minor);
        expect(scope.powers.wand[1]).toBe(bootstrapDataMock.equipmentModel.Medium);
        expect(scope.powers.wand[2]).toBe(bootstrapDataMock.equipmentModel.Major);
        expect(scope.powers.wand.length).toBe(3);
    });

    it('lets weapons be any power', function () {
        expect(scope.powers.weapon[0]).toBe(bootstrapDataMock.equipmentModel.Mundane);
        expect(scope.powers.weapon[1]).toBe(bootstrapDataMock.equipmentModel.Minor);
        expect(scope.powers.weapon[2]).toBe(bootstrapDataMock.equipmentModel.Medium);
        expect(scope.powers.weapon[3]).toBe(bootstrapDataMock.equipmentModel.Major);
        expect(scope.powers.weapon.length).toBe(4);
    });

    it('lets wondrous items be anything but mundane', function () {
        expect(scope.powers.wondrousItem[0]).toBe(bootstrapDataMock.equipmentModel.Minor);
        expect(scope.powers.wondrousItem[1]).toBe(bootstrapDataMock.equipmentModel.Medium);
        expect(scope.powers.wondrousItem[2]).toBe(bootstrapDataMock.equipmentModel.Major);
        expect(scope.powers.wondrousItem.length).toBe(3);
    });

    it('has first selected powers at beginning', function () {
        expect(scope.selectedPowers.armor).toBe(scope.powers.armor[0]);
        expect(scope.selectedPowers.potion).toBe(scope.powers.potion[0]);
        expect(scope.selectedPowers.ring).toBe(scope.powers.ring[0]);
        expect(scope.selectedPowers.rod).toBe(scope.powers.rod[0]);
        expect(scope.selectedPowers.scroll).toBe(scope.powers.scroll[0]);
        expect(scope.selectedPowers.staff).toBe(scope.powers.staff[0]);
        expect(scope.selectedPowers.wand).toBe(scope.powers.wand[0]);
        expect(scope.selectedPowers.weapon).toBe(scope.powers.weapon[0]);
        expect(scope.selectedPowers.wondrousItem).toBe(scope.powers.wondrousItem[0]);
    });
})