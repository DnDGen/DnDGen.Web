(function () {
    'use strict';

    angular
    .module('app.character')
        .directive('dndgenLeader', leader);

    function leader() {
        return {
            restrict: "E",
            templateUrl: '/templates/character/leader.html',
            scope: {
                character: '=',
                leadership: '=',
                cohort: '=',
                followers: '='
            }
        }
    }
})();