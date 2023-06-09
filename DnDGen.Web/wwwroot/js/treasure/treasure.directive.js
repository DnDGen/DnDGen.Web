(function () {
    'use strict';

    angular
    .module('app.treasure')
    .directive('dndgenTreasure', treasure);

    function treasure() {
        return {
            restrict: "E",
            templateUrl: 'Templates/Treasure/Treasure.html',
            scope: {
                treasure: '='
            }
        }
    }
})();