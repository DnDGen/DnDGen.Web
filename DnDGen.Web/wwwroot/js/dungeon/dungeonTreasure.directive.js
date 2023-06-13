(function () {
    'use strict';

    angular
    .module('app.dungeon')
    .directive('dndgenDungeonTreasure', dungeonArea);

    function dungeonArea() {
        return {
            restrict: "E",
            templateUrl: '/templates/dungeon/dungeonTreasure.html',
            scope: {
                dungeonTreasure: '='
            }
        }
    }
})();