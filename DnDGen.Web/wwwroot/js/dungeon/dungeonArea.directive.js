﻿(function () {
    'use strict';

    angular
    .module('app.dungeon')
    .directive('dndgenDungeonArea', dungeonArea);

    function dungeonArea() {
        return {
            restrict: "E",
            templateUrl: 'Templates/Dungeon/DungeonArea.html',
            scope: {
                area: '='
            }
        }
    }
})();