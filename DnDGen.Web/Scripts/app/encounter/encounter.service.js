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

        function getEncounter(environment, temperature, timeOfDay, level, filters) {
            var parameters = getParameters(environment, temperature, timeOfDay, level, filters);
            return promiseService.getPromise('/Encounter/Generate', parameters);
        }

        function getParameters(environment, temperature, timeOfDay, level, filters) {
            return {
                environment: environment,
                temperature: temperature,
                timeOfDay: timeOfDay,
                level: level,
                'filters': filters
            };
        }

        function validateFilters(environment, temperature, timeOfDay, level, filters) {
            var parameters = getParameters(environment, temperature, timeOfDay, level, filters);
            return promiseService.getPromise('/Encounter/Validate', parameters);
        }
    };
})();
