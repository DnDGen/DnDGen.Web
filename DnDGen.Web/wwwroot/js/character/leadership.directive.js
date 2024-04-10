(function () {
    'use strict';

    angular
    .module('app.character')
    .directive('dndgenLeadership', leadership);

    function leadership() {
        return {
            restrict: "E",
            templateUrl: '/templates/character/leadership.html',
            scope: {
                leadership: '=',
                cohort: '=',
                followers: '='
            }
        }
    }
})();