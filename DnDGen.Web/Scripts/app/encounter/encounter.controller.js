(function () {
    'use strict';

    angular
        .module('app.encounter')
        .controller('Encounter', Encounter);

    Encounter.$inject = ['$scope', 'model', 'encounterService', 'sweetAlertService', 'fileSaverService', 'encounterFormatterService', 'eventService'];

    function Encounter($scope, model, encounterService, sweetAlertService, fileSaverService, encounterFormatterService, eventService) {
        var vm = this;
        vm.encounterModel = model;

        vm.level = 1;
        vm.environment = vm.encounterModel.Environments[0];
        vm.temperature = vm.encounterModel.Temperatures[0];
        vm.timeOfDay = vm.encounterModel.TimesOfDay[0];
        vm.allowAquatic = false;
        vm.allowUnderground = false;
        vm.encounter = null;
        vm.generating = false;
        vm.validating = false;
        vm.filtersAreValid = true;
        vm.clientId = '';
        vm.creatureTypeFilters = [];

        for (var i = 0; i < vm.encounterModel.CreatureTypes.length; i++) {
            vm.creatureTypeFilters.push({ 
                name: vm.encounterModel.CreatureTypes[i],
                checked: false
            });
        }

        vm.generateEncounter = function () {
            vm.generating = true;
            var checkedFilters = getCheckedFilters();

            eventService.getClientId().then(function (response) {
                vm.clientId = response.data.clientId;

                encounterService.getEncounter(vm.clientId, vm.environment, vm.temperature, vm.timeOfDay, vm.level, checkedFilters, vm.allowAquatic, vm.allowUnderground)
                    .then(setEncounter, handleError);
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

        function setEncounter(response) {
            vm.encounter = response.data.encounter;
            vm.generating = false;
        }

        function handleError() {
            sweetAlertService.showError();
            vm.generating = false;
            vm.encounter = null;
            vm.validating = false;
        }

        vm.download = function () {
            var formattedEncounter = encounterFormatterService.formatEncounter(vm.encounter);
            var fileName = vm.temperature + ' ' + vm.environment + ' ' + vm.timeOfDay + ' level ' + vm.level + ' encounter ' + new Date().toString();

            fileSaverService.save(formattedEncounter, fileName);
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