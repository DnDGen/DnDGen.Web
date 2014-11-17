(function () {
    'use strict';

    angular
        .module('app.equipment')
        .controller('Equipment', Equipment);

    Equipment.$inject = ['$scope', 'bootstrapData', 'equipmentService'];

    function Equipment($scope, bootstrapData, equipmentService) {
        $scope.selectedLevels = {
            treasure: 1,
            coin: 1,
            goods: 1,
            items: 1
        };

        $scope.powers = {
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

        $scope.selectedPowers = {
            armor: $scope.powers.armor[0],
            potion: $scope.powers.potion[0],
            ring: $scope.powers.ring[0],
            rod: $scope.powers.rod[0],
            scroll: $scope.powers.scroll[0],
            staff: $scope.powers.staff[0],
            wand: $scope.powers.wand[0],
            weapon: $scope.powers.weapon[0],
            wondrousItem: $scope.powers.wondrousItem[0]
        };

        $scope.treasure = bootstrapData.equipmentModel.Treasure;

        $scope.generateTreasure = function () {
            equipmentService.getTreasure($scope.selectedLevels.treasure).then(function (data) {
                $scope.treasure = data.treasure;
            });
        };

        function setTreasure(data) {
            $scope.treasure = data.treasure;
        }

        $scope.generateCoin = function () {
            equipmentService.getCoin($scope.selectedLevels.coin).then(setTreasure);
        };

        $scope.generateGoods = function () {
            equipmentService.getGoods($scope.selectedLevels.goods).then(setTreasure);
        };

        $scope.generateItems = function () {
            equipmentService.getItems($scope.selectedLevels.items).then(setTreasure);
        };

        $scope.generateAlchemicalItem = function () {
            equipmentService.getAlchemicalItem($scope.selectedLevels.items).then(setTreasure);
        };

        $scope.generateArmor = function () {
            equipmentService.getArmor($scope.selectedPowers.armor).then(setTreasure);
        };

        $scope.generatePotion = function () {
            equipmentService.getPotion($scope.selectedPowers.potion).then(setTreasure);
        };

        $scope.generateRing = function () {
            equipmentService.getRing($scope.selectedPowers.ring).then(setTreasure);
        };

        $scope.generateRod = function () {
            equipmentService.getRod($scope.selectedPowers.rod).then(setTreasure);
        };

        $scope.generateScroll = function () {
            equipmentService.getScroll($scope.selectedPowers.scroll).then(setTreasure);
        };

        $scope.generateStaff = function () {
            equipmentService.getStaff($scope.selectedPowers.staff).then(setTreasure);
        };

        $scope.generateTool = function () {
            equipmentService.getTool().then(setTreasure);
        };

        $scope.generateWand = function () {
            equipmentService.getWand($scope.selectedPowers.wand).then(setTreasure);
        };

        $scope.generateWeapon = function () {
            equipmentService.getWeapon($scope.selectedPowers.weapon).then(setTreasure);
        };

        $scope.generateWondrousItem = function () {
            equipmentService.getWondrousItem($scope.selectedPowers.wondrousItem).then(setTreasure);
        };
    };
})();