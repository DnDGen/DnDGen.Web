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
            },
            link: link
        }

        function link(scope) {
            scope.hasList = function () {
                if (!scope.item)
                    return false;

                return scope.item.Contents.length > 0
                    || scope.item.Traits.length > 0
                    || scope.item.Magic.Bonus > 0
                    || scope.item.Attributes.indexOf('Charged') > -1
                    || scope.item.Magic.SpecialAbilities.length > 0
                    || scope.item.Magic.Curse.length > 0
                    || scope.item.Magic.Intelligence.Ego > 0;
            }
        }
    }
})();