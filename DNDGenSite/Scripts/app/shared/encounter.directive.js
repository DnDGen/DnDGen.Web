(function () {
    'use strict';

    angular
    .module('app.shared')
    .directive('dndgenEncounter', enounter);

    function enounter() {
        return {
            restrict: "E",
            templateUrl: 'Templates/Encounter.html',
            scope: {
                encounter: '='
            }
        }
    }
})();