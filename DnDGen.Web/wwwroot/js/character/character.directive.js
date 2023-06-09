(function () {
    'use strict';

    angular
    .module('app.character')
    .directive('dndgenCharacter', character);

    function character() {
        return {
            restrict: "E",
            templateUrl: 'Templates/Character/Character.html',
            scope: {
                character: '=',
                leadership: '=',
                cohort: '=',
                followers: '='
            }
        }
    }
})();