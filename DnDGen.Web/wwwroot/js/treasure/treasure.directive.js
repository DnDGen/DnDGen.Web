(function () {
    'use strict';

    angular
    .module('app.treasure')
    .directive('dndgenTreasure', treasure);

    function treasure() {
        return {
            restrict: "E",
            templateUrl: '/templates/treasure/treasure.html',
            scope: {
                treasure: '='
            }
        }
    }
})();