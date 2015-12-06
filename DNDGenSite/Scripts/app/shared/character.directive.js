(function () {
    'use strict';

    angular
    .module('app.shared')
    .directive('dndgenCharacter', character);

    function character() {
        return {
            restrict: "E",
            templateUrl: 'Templates/Character.html',
            scope: {
                character: '=',
                leadership: '=',
                cohort: '=',
                followers: '='
            }
        }
    }
})();