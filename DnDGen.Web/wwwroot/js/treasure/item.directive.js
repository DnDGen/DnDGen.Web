(function () {
    'use strict';

    angular
    .module('app.treasure')
    .directive('dndgenItem', item);

    function item() {
        return {
            restrict: "E",
            templateUrl: '/templates/treasure/item.html',
            scope: {
                item: '='
            },
            link: link
        }

        function link(scope) {
            scope.hasList = function () {
                if (!scope.item)
                    return false;

                return scope.item.contents.length
                    || scope.item.traits.length
                    || scope.item.magic.bonus
                    || scope.item.attributes.indexOf('Charged') > -1
                    || scope.item.magic.specialAbilities.length
                    || scope.item.magic.curse.length
                    || scope.item.totalArmorBonus
                    || scope.item.damage
                    || (scope.item.damages && scope.item.damages.length)
                    || scope.item.magic.intelligence.ego;
            }
        }
    }
})();