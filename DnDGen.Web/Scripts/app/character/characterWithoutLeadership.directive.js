(function () {
    'use strict';

    angular
    .module('app.character')
    .directive('dndgenCharacterWithoutLeadership', characterWithoutLeadership);

    function characterWithoutLeadership() {
        return {
            restrict: "E",
            templateUrl: 'Templates/CharacterWithoutLeadership.html',
            scope: {
                character: '='
            }
        }
    }
})();