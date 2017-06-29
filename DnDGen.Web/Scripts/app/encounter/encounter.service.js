(function () {
    'use strict';

    angular
        .module('app.encounter')
        .factory('encounterService', encounterService);

    encounterService.$inject = ['promiseService'];

    function encounterService(promiseService) {
        return {
            getEncounter: getEncounter,
            validateFilters: validateFilters
        };

        function getEncounter(clientId, environment, temperature, timeOfDay, level, filters, allowAquatic, allowUnderground) {
            var parameters = getParameters(clientId, environment, temperature, timeOfDay, level, filters, allowAquatic, allowUnderground);
            return promiseService.getPromise('/Encounter/Generate', parameters);
        }

        function getParameters(clientId, environment, temperature, timeOfDay, level, filters, allowAquatic, allowUnderground) {
            return {
                clientId: clientId,
                environment: environment,
                temperature: temperature,
                timeOfDay: timeOfDay,
                level: level,
                creatureTypeFilters: filters,
                allowAquatic: allowAquatic,
                allowUnderground: allowUnderground,
            };
        }

        function validateFilters(clientId, environment, temperature, timeOfDay, level, filters, allowAquatic, allowUnderground) {
            var parameters = getParameters(clientId, environment, temperature, timeOfDay, level, filters, allowAquatic, allowUnderground);
            return promiseService.getPromise('/Encounter/Validate', parameters);
        }
    };
})();
