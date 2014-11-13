(function () {
    'use strict';

    angular
        .module('app.equipment')
        .controller('Equipment', Dice);

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
            armor: $scope.powerOptions.armor[0],
            potion: $scope.powerOptions.potion[0],
            ring: $scope.powerOptions.ring[0],
            rod: $scope.powerOptions.rod[0],
            scroll: $scope.powerOptions.scroll[0],
            staff: $$scope.powerOptions.staff[0],
            wand: $scope.powerOptions.wand[0],
            weapon: $scope.powerOptions.weapon[0],
            wondrousItem: $scope.powerOptions.wondrousItem[0]
        };

        $scope.generateTreasure = function () {
            equipmentService.getTreasure($scope.levels.treasure).then(function (data) {
                $scope.treasure = data.treasure;
            });
        };
    };
})();