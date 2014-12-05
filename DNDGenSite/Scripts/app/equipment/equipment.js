(function () {
    'use strict';

    angular
        .module('app.equipment')
        .controller('Equipment', Equipment);

    Equipment.$inject = ['bootstrapData', 'equipmentService'];

    function Equipment(bootstrapData, equipmentService) {
        var vm = this;

        vm.selectedLevels = {
            treasure: 1,
            coin: 1,
            goods: 1,
            items: 1
        };

        vm.powers = {
            armor: [bootstrapData.equipmentModel.Mundane, bootstrapData.equipmentModel.Minor, bootstrapData.equipmentModel.Medium, bootstrapData.equipmentModel.Major],
            potion: [bootstrapData.equipmentModel.Minor, bootstrapData.equipmentModel.Medium, bootstrapData.equipmentModel.Major],
            ring: [bootstrapData.equipmentModel.Minor, bootstrapData.equipmentModel.Medium, bootstrapData.equipmentModel.Major],
            rod: [bootstrapData.equipmentModel.Medium, bootstrapData.equipmentModel.Major],
            scroll: [bootstrapData.equipmentModel.Minor, bootstrapData.equipmentModel.Medium, bootstrapData.equipmentModel.Major],
            staff: [bootstrapData.equipmentModel.Medium, bootstrapData.equipmentModel.Major],
            wand: [bootstrapData.equipmentModel.Minor, bootstrapData.equipmentModel.Medium, bootstrapData.equipmentModel.Major],
            weapon: [bootstrapData.equipmentModel.Mundane, bootstrapData.equipmentModel.Minor, bootstrapData.equipmentModel.Medium, bootstrapData.equipmentModel.Major],
            wondrousItem: [bootstrapData.equipmentModel.Minor, bootstrapData.equipmentModel.Medium, bootstrapData.equipmentModel.Major]
        };

        vm.selectedPowers = {
            armor: vm.powers.armor[0],
            potion: vm.powers.potion[0],
            ring: vm.powers.ring[0],
            rod: vm.powers.rod[0],
            scroll: vm.powers.scroll[0],
            staff: vm.powers.staff[0],
            wand: vm.powers.wand[0],
            weapon: vm.powers.weapon[0],
            wondrousItem: vm.powers.wondrousItem[0]
        };

        vm.treasure = bootstrapData.equipmentModel.Treasure;

        vm.generateTreasure = function () {
            equipmentService.getTreasure(vm.selectedLevels.treasure).then(setTreasure);
        };

        function setTreasure(data) {
            vm.treasure = data.treasure;
        }

        vm.generateCoin = function () {
            equipmentService.getCoin(vm.selectedLevels.coin).then(setTreasure);
        };

        vm.generateGoods = function () {
            equipmentService.getGoods(vm.selectedLevels.goods).then(setTreasure);
        };

        vm.generateItems = function () {
            equipmentService.getItems(vm.selectedLevels.items).then(setTreasure);
        };

        vm.generateAlchemicalItem = function () {
            equipmentService.getAlchemicalItem().then(setTreasure);
        };

        vm.generateArmor = function () {
            equipmentService.getArmor(vm.selectedPowers.armor).then(setTreasure);
        };

        vm.generatePotion = function () {
            equipmentService.getPotion(vm.selectedPowers.potion).then(setTreasure);
        };

        vm.generateRing = function () {
            equipmentService.getRing(vm.selectedPowers.ring).then(setTreasure);
        };

        vm.generateRod = function () {
            equipmentService.getRod(vm.selectedPowers.rod).then(setTreasure);
        };

        vm.generateScroll = function () {
            equipmentService.getScroll(vm.selectedPowers.scroll).then(setTreasure);
        };

        vm.generateStaff = function () {
            equipmentService.getStaff(vm.selectedPowers.staff).then(setTreasure);
        };

        vm.generateTool = function () {
            equipmentService.getTool().then(setTreasure);
        };

        vm.generateWand = function () {
            equipmentService.getWand(vm.selectedPowers.wand).then(setTreasure);
        };

        vm.generateWeapon = function () {
            equipmentService.getWeapon(vm.selectedPowers.weapon).then(setTreasure);
        };

        vm.generateWondrousItem = function () {
            equipmentService.getWondrousItem(vm.selectedPowers.wondrousItem).then(setTreasure);
        };
    };
})();