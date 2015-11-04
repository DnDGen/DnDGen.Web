(function () {
    'use strict';

    angular
    .module('app.shared')
    .directive('dndgenTreasure', treasure);

    function treasure() {
        return {
            restrict: "E",
            templateUrl: 'Templates/Treasure.html',
            scope: {
                treasure: '='
            }
        }
    }
})();