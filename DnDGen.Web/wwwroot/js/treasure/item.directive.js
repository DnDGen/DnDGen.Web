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

                return scope.item.Contents.length
                    || scope.item.Traits.length
                    || scope.item.Magic.Bonus
                    || scope.item.Attributes.indexOf('Charged') > -1
                    || scope.item.Magic.SpecialAbilities.length
                    || scope.item.Magic.Curse.length
                    || scope.item.TotalArmorBonus
                    || scope.item.Damage
                    || scope.item.Magic.Intelligence.Ego;
            }
        }
    }
})();