(function () {
    'use strict';

    angular
        .module('app.treasure')
        .controller('Treasure', Treasure);

    Treasure.$inject = ['$scope', 'model', 'treasureService', 'sweetAlertService', 'fileSaverService', 'treasureFormatterService'];

    function Treasure($scope, model, treasureService, sweetAlertService, fileSaverService, treasureFormatterService) {
        var vm = this;
        vm.treasureModel = model;

        vm.level = 1;
        vm.treasureType = vm.treasureModel.treasureTypes[0];
        vm.treasure = null;
        vm.item = null;
        vm.generating = false;
        vm.validating = false;
        vm.itemType = vm.treasureModel.itemTypeViewModels[0];
        vm.power = vm.treasureModel.powers[0];
        vm.itemName = null;
        vm.validTreasure = false;
        vm.validItem = false;

        vm.generateTreasure = function () {
            vm.generating = true;

            treasureService.getTreasure(vm.treasureType, vm.level)
                .then(setTreasure, handleError);
        };

        function setTreasure(response) {
            vm.treasure = response.data;
            vm.generating = false;

            vm.item = null;
        }

        function handleError() {
            sweetAlertService.showError();
            vm.generating = false;
            vm.validating = false;
            vm.treasure = null;
            vm.item = null;
        }

        vm.generateItem = function () {
            vm.generating = true;

            treasureService.getItem(vm.itemType.itemType, vm.power, vm.itemName)
                .then(setItem, handleError);
        };

        function setItem(response) {
            vm.item = response.data;
            vm.generating = false;

            vm.treasure = null;
        }

        function validateTreasure() {
            vm.validating = true;

            treasureService.validateTreasure(vm.treasureType, vm.level)
                .then(setTreasureValidity, handleError);
        }

        function setTreasureValidity(response) {
            vm.validTreasure = response.data;
            vm.validating = false;
        }

        function validateItem() {
            vm.validating = true;

            treasureService.validateItem(vm.itemType.itemType, vm.power, vm.itemName)
                .then(setItemValidity, handleError);
        }

        function setItemValidity(response) {
            vm.validItem = response.data;
            vm.validating = false;
        }

        $scope.$watch('vm.treasureType', validateTreasure, true);
        $scope.$watch('vm.level', validateTreasure, true);

        //HACK: Keeping this code around in case we need to update the list of item names this way
        //$scope.$watch('vm.itemType', function (newValue, oldValue) {
        //    vm.powers = vm.treasureModel.itemPowers[vm.itemType];
        //    vm.power = vm.powers[0];
        //});

        $scope.$watch('vm.itemType', validateItem, true);
        $scope.$watch('vm.power', validateItem, true);
        $scope.$watch('vm.itemName', validateItem, true);

        vm.downloadTreasure = function () {
            var formattedTreasure = treasureFormatterService.formatTreasure(vm.treasure);
            var fileName = 'Treasure ' + new Date().toString();

            fileSaverService.save(formattedTreasure, fileName);
        };

        vm.downloadItem = function () {
            var formattedItem = treasureFormatterService.formatItem(vm.item);
            var fileName = 'Item (' + vm.item.name + ') ' + new Date().toString();

            fileSaverService.save(formattedItem, fileName);
        };
    };
})();