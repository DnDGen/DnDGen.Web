(function () {
    'use strict';

    angular
        .module('app.treasure')
        .controller('Treasure', Treasure);

    Treasure.$inject = ['$scope', 'bootstrapData', 'treasureService', 'sweetAlertService'];

    function Treasure($scope, bootstrapData, treasureService, sweetAlertService) {
        var vm = this;
        vm.treasureModel = bootstrapData.treasureModel;

        vm.treasureLevel = 1;
        vm.treasureType = vm.treasureModel.TreasureTypes[0];
        vm.mundaneItemType = vm.treasureModel.MundaneItemTypes[0];
        vm.poweredItemType = vm.treasureModel.PoweredItemTypes[0];
        vm.itemPowers = [];
        vm.itemPower = '';
        vm.treasure = null;
        vm.generating = false;

        vm.generateTreasure = function () {
            vm.generating = true;

            if (vm.treasureType == 'Treasure')
                treasureService.getTreasure(vm.treasureLevel)
                    .then(setTreasure, handleError);
            else
                treasureService.getTreasureType(vm.treasureType, vm.treasureLevel)
                    .then(setTreasure, handleError);
        };

        function setTreasure(data) {
            vm.treasure = data.treasure;
            vm.generating = false;
        }

        function handleError() {
            sweetAlertService.showError();
            vm.generating = false;
            vm.treasure = null;
        }

        vm.generateMundaneItem = function () {
            vm.generating = true;
            treasureService.getMundaneItem(vm.mundaneItemType)
                .then(setTreasure, handleError);
        };

        vm.generatePoweredItem = function () {
            vm.generating = true;
            treasureService.getPoweredItem(vm.poweredItemType, vm.itemPower)
                .then(setTreasure, handleError);
        };

        $scope.$watch('vm.poweredItemType', function (newValue, oldValue) {
            var index = vm.treasureModel.PoweredItemTypes.indexOf(newValue);
            vm.itemPowers = vm.treasureModel.ItemPowers[index];
            vm.itemPower = vm.itemPowers[0];
        });
    };
})();