(function () {
    'use strict';

    angular
        .module('app.encounter')
        .controller('Encounter', Encounter);

    Encounter.$inject = ['$scope', 'model', 'encounterService', 'sweetAlertService', 'fileSaverService', 'encounterFormatterService'];

    function Encounter($scope, model, encounterService, sweetAlertService, fileSaverService, encounterFormatterService) {
        var vm = this;
        vm.encounterModel = model;

        vm.level = 1;
        vm.environment = vm.encounterModel.Environments[0];
        vm.temperature = vm.encounterModel.Temperatures[0];
        vm.timeOfDay = vm.encounterModel.TimesOfDay[0];
        vm.encounter = null;
        vm.generating = false;
        vm.validating = false;
        vm.filtersAreValid = true;

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

            encounterService.getEncounter(vm.environment, vm.temperature, vm.timeOfDay, vm.level, checkedFilters)
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

        function setEncounter(data) {
            vm.encounter = data.encounter;
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

            encounterService.validateFilters(vm.environment, vm.temperature, vm.timeOfDay, vm.level, checkedFilters)
                .then(function (data) {
                    vm.filtersAreValid = data.isValid;
                    vm.validating = false;
                }, handleError);
        }

        $scope.$watch('vm.environment', validateFilters, true);
        $scope.$watch('vm.temperature', validateFilters, true);
        $scope.$watch('vm.timeOfDay', validateFilters, true);

        $scope.$watch('vm.level', validateFilters);
    };
})();