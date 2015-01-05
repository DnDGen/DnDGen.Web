(function () {
    'use strict';

    angular
        .module('app.equipment')
        .controller('Equipment', Equipment);

    Equipment.$inject = ['$scope', 'bootstrapData', 'equipmentService'];

    function Equipment($scope, bootstrapData, equipmentService) {
        var vm = this;
        vm.equipmentModel = bootstrapData.equipmentModel;

        vm.treasureLevel = 1;
        vm.treasureType = vm.equipmentModel.TreasureTypes[0];
        vm.mundaneItemType = vm.equipmentModel.MundaneItemTypes[0];
        vm.poweredItemType = vm.equipmentModel.PoweredItemTypes[0];
        vm.itemPowers = [];
        vm.itemPower = '';
        vm.treasure = null;

        vm.generateTreasure = function () {
            equipmentService.getTreasure(vm.treasureType, vm.treasureLevel).then(setTreasure);
        };

        function setTreasure(data) {
            vm.treasure = data.treasure;
        }

        vm.generateMundaneItem = function () {
            equipmentService.getMundaneItem(vm.mundaneItemType).then(setTreasure);
        };

        vm.generatePoweredItem = function () {
            equipmentService.getPoweredItem(vm.poweredItemType, vm.itemPower).then(setTreasure);
        };

        $scope.$watch('vm.poweredItemType', function (newValue, oldValue) {
            var index = vm.equipmentModel.PoweredItemTypes.indexOf(newValue);
            vm.itemPowers = vm.equipmentModel.ItemPowers[index];
            vm.itemPower = vm.itemPowers[0];
        });
    };
})();