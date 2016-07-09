(function () {
    'use strict';

    angular
        .module('app.encounter')
        .factory('encounterService', encounterService);

    encounterService.$inject = ['promiseService'];

    function encounterService(promiseService) {
        return {
            getEncounter: getEncounter
        };

        function getEncounter(environment, level) {
            var url = "/Encounter/Generate?environment=" + encodeURI(environment);
            url += "&level=" + level;

            return promiseService.getPromise(url);
        }
    };
})();
