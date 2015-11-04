(function () {
    'use strict';

    angular
    .module('app.shared')
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