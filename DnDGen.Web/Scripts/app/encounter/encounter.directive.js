(function () {
    'use strict';

    angular
    .module('app.encounter')
    .directive('dndgenEncounter', enounter);

    function enounter() {
        return {
            restrict: "E",
            templateUrl: 'Templates/Encounter/Encounter.html',
            scope: {
                encounter: '='
            }
        }
    }
})();