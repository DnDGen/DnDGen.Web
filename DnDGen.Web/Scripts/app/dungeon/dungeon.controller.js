(function () {
    'use strict';

    angular
        .module('app.dungeon')
        .controller('Dungeon', Dungeon);

    Dungeon.$inject = ['$scope', 'dungeonService', 'sweetAlertService', 'fileSaverService', 'dungeonFormatterService', 'model', 'eventService', 'encounterService'];

    function Dungeon($scope, dungeonService, sweetAlertService, fileSaverService, dungeonFormatterService, model, eventService, encounterService) {
        var vm = this;
        vm.model = model;

        vm.level = 1;
        vm.environment = vm.model.Environments[0];
        vm.temperature = vm.model.Temperatures[0];
        vm.timeOfDay = vm.model.TimesOfDay[0];
        vm.allowAquatic = false;
        vm.allowUnderground = false;
        vm.validating = false;
        vm.filtersAreValid = true;
        vm.dungeonLevel = 1;
        vm.areas = [];
        vm.generating = false;
        vm.clientId = '';
        vm.creatureTypeFilters = [];

        for (var i = 0; i < vm.model.CreatureTypes.length; i++) {
            vm.creatureTypeFilters.push({
                name: vm.model.CreatureTypes[i],
                checked: false
            });
        }

        vm.generateDungeonAreasFromHall = function () {
            vm.generating = true;
            var checkedFilters = getCheckedFilters();

            eventService.getClientId().then(function (response) {
                vm.clientId = response.data.clientId;

                dungeonService.getDungeonAreasFromHall(vm.clientId, vm.dungeonLevel, vm.environment, vm.temperature, vm.timeOfDay, vm.level, checkedFilters, vm.allowAquatic, vm.allowUnderground)
                    .then(setAreas, handleError);
            });
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

            eventService.getClientId().then(function (response) {
                vm.clientId = response.data.clientId;

                dungeonService.getDungeonAreasFromDoor(vm.clientId, vm.dungeonLevel, vm.environment, vm.temperature, vm.timeOfDay, vm.level, checkedFilters, vm.allowAquatic, vm.allowUnderground)
                    .then(setAreas, handleError);
            });
        };

        function setAreas(response) {
            vm.areas = response.data.areas;
            vm.generating = false;
        }

        function handleError() {
            sweetAlertService.showError();
            vm.generating = false;
            vm.areas = [];
        }

        vm.download = function () {
            var formattedAreas = dungeonFormatterService.formatDungeonAreas(vm.areas);
            var fileName = vm.temperature + ' Dungeon level ' + vm.dungeonLevel + ', party level ' + vm.level + ' ' + new Date().toString();

            fileSaverService.save(formattedAreas, fileName);
        };

        $scope.$watch('vm.creatureTypeFilters', validateFilters, true);

        function validateFilters() {
            vm.validating = true;
            var checkedFilters = getCheckedFilters();

            eventService.getClientId().then(function (response) {
                vm.clientId = response.data.clientId;

                encounterService.validateFilters(vm.clientId, vm.environment, vm.temperature, vm.timeOfDay, vm.level, checkedFilters)
                    .then(function (response) {
                        vm.filtersAreValid = response.data.isValid;
                        vm.validating = false;
                    }, handleError)
                    .then(function () {
                        eventService.clearEvents(vm.clientId);
                    });
            });
        }

        $scope.$watch('vm.environment', validateFilters, true);
        $scope.$watch('vm.temperature', validateFilters, true);
        $scope.$watch('vm.timeOfDay', validateFilters, true);
        $scope.$watch('vm.allowAquatic', validateFilters, true);
        $scope.$watch('vm.allowUnderground', validateFilters, true);

        $scope.$watch('vm.level', validateFilters);
    };
})();