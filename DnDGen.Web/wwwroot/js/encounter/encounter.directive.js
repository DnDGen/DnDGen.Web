(function () {
    'use strict';

    angular
    .module('app.encounter')
    .directive('dndgenEncounter', enounter);

    function enounter() {
        return {
            restrict: "E",
            templateUrl: '/templates/encounter/encounter.html',
            scope: {
                encounter: '='
            }
        }
    }
})();