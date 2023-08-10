(function () {
    'use strict';

    angular
        .module('app.treasure')
        .factory('treasureService', treasureService);

    treasureService.$inject = ['promiseService'];

    function treasureService(promiseService) {
        return {
            getTreasure: getTreasure,
            validateTreasure: validateTreasure,
            getItem: getItem,
            validateItem: validateItem
        };

        function getTreasure(treasureType, level) {
            var url = "https://treasure.dndgen.com/api/v1/" + treasureType + "/level/" + level + "/generate";
            return promiseService.getPromise(url);
        }

        function validateTreasure(treasureType, level) {
            var url = "https://treasure.dndgen.com/api/v1/" + treasureType + "/level/" + level + "/validate";
            return promiseService.getPromise(url);
        }

        function getItem(itemType, power, name) {
            var url = "https://treasure.dndgen.com/api/v1/item/" + itemType + "/power/" + power + "/generate";

            if (!name) {
                return promiseService.getPromise(url);
            }

            var parameters = { name: name };
            return promiseService.getPromise(url, parameters);
        }

        function validateItem(itemType, power, name) {
            var url = "https://treasure.dndgen.com/api/v1/item/" + itemType + "/power/" + power + "/validate";

            if (!name) {
                return promiseService.getPromise(url);
            }

            var parameters = { name: name };
            return promiseService.getPromise(url, parameters);
        }
    };
})();
