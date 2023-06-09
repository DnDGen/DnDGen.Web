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

        function getTreasure(clientId, treasureType, level) {
            var parameters = { clientId: clientId, treasureType: treasureType, level: level };
            return promiseService.getPromise("/Treasure/Generate", parameters);
        }

        function getItem(clientId, itemType, power) {
            var parameters = { clientId: clientId, itemType: itemType, power: power };
            return promiseService.getPromise("/Treasure/GenerateItem", parameters);
        }
    };
})();
