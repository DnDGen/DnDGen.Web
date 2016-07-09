(function () {
    'use strict';

    angular
        .module('app.encounter')
        .controller('Encounter', Encounter);

    Encounter.$inject = ['$scope', 'bootstrapData', 'encounterService', 'sweetAlertService', 'fileSaverService', 'encounterFormatterService'];

    function Encounter($scope, bootstrapData, encounterService, sweetAlertService, fileSaverService, encounterFormatterService) {
        var vm = this;
        vm.encounterModel = bootstrapData;

        vm.level = 1;
        vm.environment = vm.encounterModel.Environments[0];
        vm.encounter = null;
        vm.generating = false;

        vm.generateEncounter = function () {
            vm.generating = true;

            encounterService.getEncounter(vm.environment, vm.level)
                .then(setEncounter, handleError);
        };

        function setEncounter(data) {
            vm.encounter = data.encounter;
            vm.generating = false;
        }

        function handleError() {
            sweetAlertService.showError();
            vm.generating = false;
            vm.encounter = null;
        }

        vm.download = function () {
            var formattedEncounter = encounterFormatterService.formatEncounter(vm.encounter);
            var fileName = vm.environment + ' level ' + vm.level + ' encounter ' + new Date().toString();

            fileSaverService.save(formattedEncounter, fileName);
        };
    };
})();