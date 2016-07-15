(function () {
    'use strict';

    angular
    .module('app.treasure')
    .directive('dndgenItem', item);

    function item() {
        return {
            restrict: "E",
            templateUrl: 'Templates/Treasure/Item.html',
            scope: {
                item: '='
            }
        }
    }
})();