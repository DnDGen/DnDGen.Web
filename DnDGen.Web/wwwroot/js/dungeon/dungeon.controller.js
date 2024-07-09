(function () {
    'use strict';

    angular
        .module('app.dungeon')
        .controller('Dungeon', Dungeon);

    Dungeon.$inject = ['$scope', 'dungeonService', 'sweetAlertService', 'fileSaverService', 'dungeonFormatterService', 'model', 'encounterService'];

    function Dungeon($scope, dungeonService, sweetAlertService, fileSaverService, dungeonFormatterService, model, encounterService) {
        var vm = this;
        vm.model = model;

        vm.level = 1;
        vm.environment = vm.model.environments[0];
        vm.temperature = vm.model.temperatures[0];
        vm.timeOfDay = vm.model.timesOfDay[0];
        vm.allowAquatic = false;
        vm.allowUnderground = false;
        vm.validating = false;
        vm.filtersAreValid = true;
        vm.dungeonLevel = 1;
        vm.areas = [];
        vm.generating = false;
        vm.creatureTypeFilters = [];

        for (var i = 0; i < vm.model.creatureTypes.length; i++) {
            vm.creatureTypeFilters.push({
                name: vm.model.creatureTypes[i],
                checked: false
            });
        }

        vm.generateDungeonAreasFromHall = function () {
            vm.generating = true;
            var checkedFilters = getCheckedFilters();

            dungeonService.getDungeonAreasFromHall(vm.dungeonLevel, vm.environment, vm.temperature, vm.timeOfDay, vm.level, checkedFilters, vm.allowAquatic, vm.allowUnderground)
                .then(setAreas, handleError);
        };

        function getCheckedFilters() {
            var checkedFilters = [];

            for (var i = 0; i < vm.creatureTypeFilters.length; i++) {
                if (vm.creatureTypeFilters[i].checked) {
                    checkedFilters.push(vm.creatureTypeFilters[i].name);
                }
            }

            return checkedFilters;
        }

        vm.generateDungeonAreasFromDoor = function () {
            vm.generating = true;
            var checkedFilters = getCheckedFilters();

            dungeonService.getDungeonAreasFromDoor(vm.dungeonLevel, vm.environment, vm.temperature, vm.timeOfDay, vm.level, checkedFilters, vm.allowAquatic, vm.allowUnderground)
                .then(setAreas, handleError);
        };

        function setAreas(response) {
            vm.areas = response.data;
            vm.generating = false;
        }

        function handleError() {
            sweetAlertService.showError();
            vm.generating = false;
            vm.areas = [];
        }

        vm.download = function () {
            var formattedAreas = dungeonFormatterService.formatDungeonAreas(vm.areas);
            var fileName = 'Dungeon level ' + vm.dungeonLevel + ', party level ' + vm.level + ' ' + new Date().toString();

            fileSaverService.save(formattedAreas, fileName);
        };

        $scope.$watch('vm.creatureTypeFilters', validateFilters, true);

        function validateFilters() {
            vm.validating = true;
            var checkedFilters = getCheckedFilters();

            encounterService.validateFilters(vm.environment, vm.temperature, vm.timeOfDay, vm.level, checkedFilters, vm.allowAquatic, vm.allowUnderground)
                .then(function (response) {
                    vm.filtersAreValid = response.data;
                    vm.validating = false;
                }, handleError);
        }

        $scope.$watch('vm.environment', validateFilters, true);
        $scope.$watch('vm.temperature', validateFilters, true);
        $scope.$watch('vm.timeOfDay', validateFilters, true);
        $scope.$watch('vm.allowAquatic', validateFilters, true);
        $scope.$watch('vm.allowUnderground', validateFilters, true);

        $scope.$watch('vm.level', validateFilters);
    };
})();