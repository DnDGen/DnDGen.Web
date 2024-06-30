(function () {
    'use strict';

    angular
        .module('app.encounter')
        .controller('Encounter', Encounter);

    Encounter.$inject = ['$scope', 'model', 'encounterService', 'sweetAlertService', 'fileSaverService', 'encounterFormatterService'];

    function Encounter($scope, model, encounterService, sweetAlertService, fileSaverService, encounterFormatterService) {
        var vm = this;
        vm.encounterModel = model;

        vm.level = vm.encounterModel.defaults.level;
        vm.environment = vm.encounterModel.defaults.environment;
        vm.temperature = vm.encounterModel.defaults.temperature;
        vm.timeOfDay = vm.encounterModel.defaults.timeOfDay;
        vm.allowAquatic = false;
        vm.allowUnderground = false;
        vm.encounter = null;
        vm.generating = false;
        vm.validating = false;
        vm.filtersAreValid = true;
        vm.creatureTypeFilters = [];

        for (var i = 0; i < vm.encounterModel.creatureTypes.length; i++) {
            vm.creatureTypeFilters.push({ 
                name: vm.encounterModel.creatureTypes[i],
                checked: false
            });
        }

        vm.generateEncounter = function () {
            vm.generating = true;
            var checkedFilters = getCheckedFilters();

            encounterService.getEncounter(vm.environment, vm.temperature, vm.timeOfDay, vm.level, checkedFilters, vm.allowAquatic, vm.allowUnderground)
                .then(setEncounter, handleError);
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
            vm.encounter = response.data;
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

            //encounterService.validateFilters(vm.environment, vm.temperature, vm.timeOfDay, vm.level, checkedFilters)
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