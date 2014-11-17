describe('Unit: EquipmentController', function () {
    var equipmentController;
    var scope;
    var equipmentServiceMock;
    var q;
    var bootstrapDataMock;

    beforeEach(module('app.equipment'));

    beforeEach(function () {
        bootstrapDataMock = {
            equipmentModel: {
                Mundane: 'Mundane',
                Minor: 'Minor',
                Medium: 'Medium',
                Major: 'Major',
                Treasure: { description: '' }
            }
        };

        equipmentServiceMock = {
            getTreasure: function (level) {
                var treasure = { description: 'treasure' + level };
                return getMockedPromise(treasure);
            },
            getCoin: function (level) {
                var treasure = { description: 'coin' + level };
                return getMockedPromise(treasure);
            },
            getGoods: function (level) {
                var treasure = { description: 'goods' + level };
                return getMockedPromise(treasure);
            },
            getItems: function (level) {
                var treasure = { description: 'items' + level };
                return getMockedPromise(treasure);
            },
            getAlchemicalItem: function () {
                var treasure = { description: 'alchemical item' };
                return getMockedPromise(treasure);
            },
            getArmor: function (power) {
                var treasure = { description: 'armor' + power };
                return getMockedPromise(treasure);
            },
            getPotion: function (power) {
                var treasure = { description: 'potion' + power };
                return getMockedPromise(treasure);
            },
            getRing: function (power) {
                var treasure = { description: 'ring' + power };
                return getMockedPromise(treasure);
            },
            getRod: function (power) {
                var treasure = { description: 'rod' + power };
                return getMockedPromise(treasure);
            },
            getScroll: function (power) {
                var treasure = { description: 'scroll' + power };
                return getMockedPromise(treasure);
            },
            getStaff: function (power) {
                var treasure = { description: 'staff' + power };
                return getMockedPromise(treasure);
            },
            getTool: function () {
                var treasure = { description: 'tool' };
                return getMockedPromise(treasure);
            },
            getWand: function (power) {
                var treasure = { description: 'wand' + power };
                return getMockedPromise(treasure);
            },
            getWeapon: function (power) {
                var treasure = { description: 'weapon' + power };
                return getMockedPromise(treasure);
            },
            getWondrousItem: function (power) {
                var treasure = { description: 'wondrous item' + power };
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

    it('sets the empty treasure at beginning', function () {
        expect(scope.treasure).toBe(bootstrapDataMock.equipmentModel.Treasure);
    });

    it('generates treasure', function () {
        scope.selectedLevels.treasure = 9266;

        scope.generateTreasure();
        scope.$apply();

        expect(scope.treasure.description).toBe('treasure9266');
    });

    it('generates coin', function () {
        scope.selectedLevels.coin = 9266;

        scope.generateCoin();
        scope.$apply();

        expect(scope.treasure.description).toBe('coin9266');
    });

    it('generates goods', function () {
        scope.selectedLevels.goods = 9266;

        scope.generateGoods();
        scope.$apply();

        expect(scope.treasure.description).toBe('goods9266');
    });

    it('generates items', function () {
        scope.selectedLevels.items = 9266;

        scope.generateItems();
        scope.$apply();

        expect(scope.treasure.description).toBe('items9266');
    });

    it('generates alchemical item', function () {
        scope.generateAlchemicalItem();
        scope.$apply();

        expect(scope.treasure.description).toBe('alchemical item');
    });

    it('generates armor', function () {
        scope.selectedPowers.armor = 'power';

        scope.generateArmor();
        scope.$apply();

        expect(scope.treasure.description).toBe('armorpower');
    });

    it('generates potion', function () {
        scope.selectedPowers.potion = 'power';

        scope.generatePotion();
        scope.$apply();

        expect(scope.treasure.description).toBe('potionpower');
    });

    it('generates ring', function () {
        scope.selectedPowers.ring = 'power';

        scope.generateRing();
        scope.$apply();

        expect(scope.treasure.description).toBe('ringpower');
    });

    it('generates rod', function () {
        scope.selectedPowers.rod = 'power';

        scope.generateRod();
        scope.$apply();

        expect(scope.treasure.description).toBe('rodpower');
    });

    it('generates scroll', function () {
        scope.selectedPowers.scroll = 'power';

        scope.generateScroll();
        scope.$apply();

        expect(scope.treasure.description).toBe('scrollpower');
    });

    it('generates staff', function () {
        scope.selectedPowers.staff = 'power';

        scope.generateStaff();
        scope.$apply();

        expect(scope.treasure.description).toBe('staffpower');
    });

    it('generates tool', function () {
        scope.generateTool();
        scope.$apply();

        expect(scope.treasure.description).toBe('tool');
    });

    it('generates wand', function () {
        scope.selectedPowers.wand = 'power';

        scope.generateWand();
        scope.$apply();

        expect(scope.treasure.description).toBe('wandpower');
    });

    it('generates weapon', function () {
        scope.selectedPowers.weapon = 'power';

        scope.generateWeapon();
        scope.$apply();

        expect(scope.treasure.description).toBe('weaponpower');
    });

    it('generates wondrous item', function () {
        scope.selectedPowers.wondrousItem = 'power';

        scope.generateWondrousItem();
        scope.$apply();

        expect(scope.treasure.description).toBe('wondrous itempower');
    });
})