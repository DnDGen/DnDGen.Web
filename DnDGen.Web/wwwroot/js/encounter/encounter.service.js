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

        function getEncounter(environment, temperature, timeOfDay, level, filters, allowAquatic, allowUnderground) {
            var url = "https://encounter.dndgen.com/api/v1/encounter/" + temperature + "/" + environment + "/" + timeOfDay + "/level/" + level + "/generate";

            var parameters = getParameters(filters, allowAquatic, allowUnderground);
            return promiseService.getPromise(url, parameters);
        }

        function getParameters(filters, allowAquatic, allowUnderground) {
            return {
                creatureTypeFilters: filters,
                allowAquatic: allowAquatic,
                allowUnderground: allowUnderground,
            };
        }

        function validateFilters(environment, temperature, timeOfDay, level, filters, allowAquatic, allowUnderground) {
            var url = "https://encounter.dndgen.com/api/v1/encounter/" + temperature + "/" + environment + "/" + timeOfDay + "/level/" + level + "/validate";

            var parameters = getParameters(filters, allowAquatic, allowUnderground);
            return promiseService.getPromise(url, parameters);
        }
    };
})();
