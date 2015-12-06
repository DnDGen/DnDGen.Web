(function () {
    'use strict';

    angular
        .module('app.treasure')
        .factory('treasureService', treasureService);

    treasureService.$inject = ['promiseService'];

    function treasureService(promiseService) {
        return {
            getTreasure: getTreasure,
            getTreasureType: getTreasureType,
            getMundaneItem: getMundaneItem,
            getPoweredItem: getPoweredItem
        };

        function getTreasure(level) {
            var url = "/Treasure/Generate/" + level;
            return promiseService.getPromise(url);
        };

        function getTreasureType(treasureType, level) {
            var url = "/Treasures/" + treasureType + "/Generate/" + level;
            return promiseService.getPromise(url);
        };

        function getMundaneItem(itemType) {
            var url = "/Treasures/" + itemType + "/Generate";
            return promiseService.getPromise(url);
        };

        function getPoweredItem(itemType, power) {
            var url = "/Treasures/" + itemType + "/Generate/" + power;
            return promiseService.getPromise(url);
        };
    };
})();
