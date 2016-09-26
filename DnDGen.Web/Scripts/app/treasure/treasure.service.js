(function () {
    'use strict';

    angular
        .module('app.treasure')
        .factory('treasureService', treasureService);

    treasureService.$inject = ['promiseService'];

    function treasureService(promiseService) {
        return {
            getTreasure: getTreasure,
            getItem: getItem
        };

        function getTreasure(treasureType, level) {
            var parameters = { treasureType: treasureType, level: level };
            return promiseService.getPromise("/Treasure/Generate", parameters);
        }

        function getItem(itemType, power) {
            var parameters = { itemType: itemType, power: power };
            return promiseService.getPromise("/Treasure/GenerateItem", parameters);
        }
    };
})();
