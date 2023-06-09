(function () {
    'use strict';

    angular
    .module('app.dungeon')
    .directive('dndgenDungeonTreasure', dungeonArea);

    function dungeonArea() {
        return {
            restrict: "E",
            templateUrl: 'Templates/Dungeon/DungeonTreasure.html',
            scope: {
                dungeonTreasure: '='
            }
        }
    }
})();