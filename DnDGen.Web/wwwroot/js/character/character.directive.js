(function () {
    'use strict';

    angular
    .module('app.character')
    .directive('dndgenCharacter', character);

    function character() {
        return {
            restrict: "E",
            templateUrl: '/templates/character/character.html',
            scope: {
                character: '=',
                leadership: '=',
                cohort: '=',
                followers: '='
            }
        }
    }
})();