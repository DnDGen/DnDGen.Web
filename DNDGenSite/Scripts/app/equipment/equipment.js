(function () {
    'use strict';

    angular
        .module('app.equipment')
        .controller('Equipment', Dice);

    Equipment.$inject = ['$scope', 'equipmentService'];

    function Equipment($scope, equipmentService) {
        $scope.levels = {
            treasure: 1,
            coin: 1,
            goods: 1,
            items: 1
        };

        $scope.powers = {
            armor: 'Mundane',
            potion: 'Minor',
            ring: 'Minor',
            rod: 'Medium',
            scroll: 'Minor',
            staff: 'Medium',
            wand: 'Minor',
            weapon: 'Mundane',
            wondrousItem: 'Minor'
        };

        $scope.

        $scope.generateTreasure = function () {
            equipmentService.getTreasure($scope.levels.treasure).then(function (data) {
                $scope.treasure = data.treasure;
            });
        };
    };
})();