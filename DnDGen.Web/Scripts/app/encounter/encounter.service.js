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

        function getEncounter(environment, level, filters) {
            var parameters = getParameters(environment, level, filters);
            return promiseService.getPromise('/Encounter/Generate', parameters);
        }

        function getParameters(environment, level, filters) {
            return {
                environment: environment,
                level: level,
                'filters': filters
            };
        }

        function validateFilters(environment, level, filters) {
            var parameters = getParameters(environment, level, filters);
            return promiseService.getPromise('/Encounter/Validate', parameters);
        }
    };
})();
