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
        q = $q;
        scope = $rootScope.$new();
        vm = $controller('Equipment as vm', {
            $scope: scope,
            bootstrapData: bootstrapDataMock,
            equipmentService: equipmentServiceMock
        });
    }));

    it('has selected levels of 1 at beginning', function () {
        expect(vm.selectedLevels.treasure).toBe(1);
        expect(vm.selectedLevels.coin).toBe(1);
        expect(vm.selectedLevels.goods).toBe(1);
        expect(vm.selectedLevels.items).toBe(1);
    });

    it('lets armor be any power', function () {
        expect(vm.powers.armor[0]).toBe(bootstrapDataMock.equipmentModel.Mundane);
        expect(vm.powers.armor[1]).toBe(bootstrapDataMock.equipmentModel.Minor);
        expect(vm.powers.armor[2]).toBe(bootstrapDataMock.equipmentModel.Medium);
        expect(vm.powers.armor[3]).toBe(bootstrapDataMock.equipmentModel.Major);
        expect(vm.powers.armor.length).toBe(4);
    });

    it('lets potions be anything but mundane', function () {
        expect(vm.powers.potion[0]).toBe(bootstrapDataMock.equipmentModel.Minor);
        expect(vm.powers.potion[1]).toBe(bootstrapDataMock.equipmentModel.Medium);
        expect(vm.powers.potion[2]).toBe(bootstrapDataMock.equipmentModel.Major);
        expect(vm.powers.potion.length).toBe(3);
    });

    it('lets rings be anything but mundane', function () {
        expect(vm.powers.ring[0]).toBe(bootstrapDataMock.equipmentModel.Minor);
        expect(vm.powers.ring[1]).toBe(bootstrapDataMock.equipmentModel.Medium);
        expect(vm.powers.ring[2]).toBe(bootstrapDataMock.equipmentModel.Major);
        expect(vm.powers.ring.length).toBe(3);
    });

    it('lets rods be medium or major', function () {
        expect(vm.powers.rod[0]).toBe(bootstrapDataMock.equipmentModel.Medium);
        expect(vm.powers.rod[1]).toBe(bootstrapDataMock.equipmentModel.Major);
        expect(vm.powers.rod.length).toBe(2);
    });

    it('lets scrolls be anything but mundane', function () {
        expect(vm.powers.scroll[0]).toBe(bootstrapDataMock.equipmentModel.Minor);
        expect(vm.powers.scroll[1]).toBe(bootstrapDataMock.equipmentModel.Medium);
        expect(vm.powers.scroll[2]).toBe(bootstrapDataMock.equipmentModel.Major);
        expect(vm.powers.scroll.length).toBe(3);
    });

    it('lets staves be medium or major', function () {
        expect(vm.powers.staff[0]).toBe(bootstrapDataMock.equipmentModel.Medium);
        expect(vm.powers.staff[1]).toBe(bootstrapDataMock.equipmentModel.Major);
        expect(vm.powers.staff.length).toBe(2);
    });

    it('lets wands be anything but mundane', function () {
        expect(vm.powers.wand[0]).toBe(bootstrapDataMock.equipmentModel.Minor);
        expect(vm.powers.wand[1]).toBe(bootstrapDataMock.equipmentModel.Medium);
        expect(vm.powers.wand[2]).toBe(bootstrapDataMock.equipmentModel.Major);
        expect(vm.powers.wand.length).toBe(3);
    });

    it('lets weapons be any power', function () {
        expect(vm.powers.weapon[0]).toBe(bootstrapDataMock.equipmentModel.Mundane);
        expect(vm.powers.weapon[1]).toBe(bootstrapDataMock.equipmentModel.Minor);
        expect(vm.powers.weapon[2]).toBe(bootstrapDataMock.equipmentModel.Medium);
        expect(vm.powers.weapon[3]).toBe(bootstrapDataMock.equipmentModel.Major);
        expect(vm.powers.weapon.length).toBe(4);
    });

    it('lets wondrous items be anything but mundane', function () {
        expect(vm.powers.wondrousItem[0]).toBe(bootstrapDataMock.equipmentModel.Minor);
        expect(vm.powers.wondrousItem[1]).toBe(bootstrapDataMock.equipmentModel.Medium);
        expect(vm.powers.wondrousItem[2]).toBe(bootstrapDataMock.equipmentModel.Major);
        expect(vm.powers.wondrousItem.length).toBe(3);
    });

    it('has first selected powers at beginning', function () {
        expect(vm.selectedPowers.armor).toBe(vm.powers.armor[0]);
        expect(vm.selectedPowers.potion).toBe(vm.powers.potion[0]);
        expect(vm.selectedPowers.ring).toBe(vm.powers.ring[0]);
        expect(vm.selectedPowers.rod).toBe(vm.powers.rod[0]);
        expect(vm.selectedPowers.scroll).toBe(vm.powers.scroll[0]);
        expect(vm.selectedPowers.staff).toBe(vm.powers.staff[0]);
        expect(vm.selectedPowers.wand).toBe(vm.powers.wand[0]);
        expect(vm.selectedPowers.weapon).toBe(vm.powers.weapon[0]);
        expect(vm.selectedPowers.wondrousItem).toBe(vm.powers.wondrousItem[0]);
    });

    it('sets the empty treasure at beginning', function () {
        expect(vm.treasure).toBe(bootstrapDataMock.equipmentModel.Treasure);
    });

    it('generates treasure', function () {
        vm.selectedLevels.treasure = 9266;

        vm.generateTreasure();
        scope.$apply();

        expect(vm.treasure.description).toBe('treasure9266');
    });

    it('generates coin', function () {
        vm.selectedLevels.coin = 9266;

        vm.generateCoin();
        scope.$apply();

        expect(vm.treasure.description).toBe('coin9266');
    });

    it('generates goods', function () {
        vm.selectedLevels.goods = 9266;

        vm.generateGoods();
        scope.$apply();

        expect(vm.treasure.description).toBe('goods9266');
    });

    it('generates items', function () {
        vm.selectedLevels.items = 9266;

        vm.generateItems();
        scope.$apply();

        expect(vm.treasure.description).toBe('items9266');
    });

    it('generates alchemical item', function () {
        vm.generateAlchemicalItem();
        scope.$apply();

        expect(vm.treasure.description).toBe('alchemical item');
    });

    it('generates armor', function () {
        vm.selectedPowers.armor = 'power';

        vm.generateArmor();
        scope.$apply();

        expect(vm.treasure.description).toBe('armorpower');
    });

    it('generates potion', function () {
        vm.selectedPowers.potion = 'power';

        vm.generatePotion();
        scope.$apply();

        expect(vm.treasure.description).toBe('potionpower');
    });

    it('generates ring', function () {
        vm.selectedPowers.ring = 'power';

        vm.generateRing();
        scope.$apply();

        expect(vm.treasure.description).toBe('ringpower');
    });

    it('generates rod', function () {
        vm.selectedPowers.rod = 'power';

        vm.generateRod();
        scope.$apply();

        expect(vm.treasure.description).toBe('rodpower');
    });

    it('generates scroll', function () {
        vm.selectedPowers.scroll = 'power';

        vm.generateScroll();
        scope.$apply();

        expect(vm.treasure.description).toBe('scrollpower');
    });

    it('generates staff', function () {
        vm.selectedPowers.staff = 'power';

        vm.generateStaff();
        scope.$apply();

        expect(vm.treasure.description).toBe('staffpower');
    });

    it('generates tool', function () {
        vm.generateTool();
        scope.$apply();

        expect(vm.treasure.description).toBe('tool');
    });

    it('generates wand', function () {
        vm.selectedPowers.wand = 'power';

        vm.generateWand();
        scope.$apply();

        expect(vm.treasure.description).toBe('wandpower');
    });

    it('generates weapon', function () {
        vm.selectedPowers.weapon = 'power';

        vm.generateWeapon();
        scope.$apply();

        expect(vm.treasure.description).toBe('weaponpower');
    });

    it('generates wondrous item', function () {
        vm.selectedPowers.wondrousItem = 'power';

        vm.generateWondrousItem();
        scope.$apply();

        expect(vm.treasure.description).toBe('wondrous itempower');
    });
})