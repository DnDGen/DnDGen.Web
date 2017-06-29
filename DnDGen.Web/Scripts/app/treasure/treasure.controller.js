(function () {
    'use strict';

    angular
        .module('app.treasure')
        .controller('Treasure', Treasure);

    Treasure.$inject = ['$scope', 'model', 'treasureService', 'sweetAlertService', 'fileSaverService', 'treasureFormatterService', 'eventService'];

    function Treasure($scope, model, treasureService, sweetAlertService, fileSaverService, treasureFormatterService, eventService) {
        var vm = this;
        vm.treasureModel = model;

        vm.level = 1;
        vm.treasureType = vm.treasureModel.TreasureTypes[0];
        vm.treasure = null;
        vm.generating = false;
        vm.itemTypes = Object.keys(vm.treasureModel.ItemPowers);
        vm.itemType = vm.itemTypes[0];
        vm.powers = vm.treasureModel.ItemPowers[vm.itemType];
        vm.power = vm.powers[0];
        vm.clientId = '';

        vm.generateTreasure = function () {
            vm.generating = true;

            eventService.getClientId().then(function (response) {
                vm.clientId = response.data.clientId;

                treasureService.getTreasure(vm.clientId, vm.treasureType, vm.level)
                    .then(setTreasure, handleError);
            }, handleError);
        };

        function setTreasure(response) {
            vm.treasure = response.data.treasure;
            vm.generating = false;
        }

        function handleError() {
            sweetAlertService.showError();
            vm.generating = false;
            vm.treasure = null;
        }

        vm.generateItem = function () {
            vm.generating = true;

            eventService.getClientId().then(function (response) {
                vm.clientId = response.data.clientId;

                treasureService.getItem(vm.clientId, vm.itemType, vm.power)
                    .then(setTreasure, handleError);
            }, handleError);
        };

        $scope.$watch('vm.itemType', function (newValue, oldValue) {
            vm.powers = vm.treasureModel.ItemPowers[vm.itemType];
            vm.power = vm.powers[0];
        });

        vm.download = function () {
            var formattedTreasure = treasureFormatterService.formatTreasure(vm.treasure);
            var fileName = 'Treasure ' + new Date().toString();

            fileSaverService.save(formattedTreasure, fileName);
        };
    };
})();