(function () {
    'use strict';

    angular
    .module('app.shared')
    .directive('dndgenItem', item);

    function item() {
        return {
            restrict: "E",
            templateUrl: 'Templates/Item.html',
            scope: {
                item: '='
            }
        }
    }
})();