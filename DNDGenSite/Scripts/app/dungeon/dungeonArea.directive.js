(function () {
    'use strict';

    angular
    .module('app.dungeon')
    .directive('dndgenDungeonArea', dungeonArea);

    function dungeonArea() {
        return {
            restrict: "E",
            templateUrl: 'Templates/DungeonArea.html',
            scope: {
                area: '='
            }
        }
    }
})();