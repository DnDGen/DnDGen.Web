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
            getRandomItem: getRandomItem,
            validateRandomItem: validateRandomItem,
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

        function getRandomItem(itemType, power) {
            var url = "https://treasure.dndgen.com/api/v1/item/" + itemType + "/power/" + power + "/generate";
            return promiseService.getPromise(url);
        }

        function validateRandomItem(itemType, power) {
            var url = "https://treasure.dndgen.com/api/v1/item/" + itemType + "/power/" + power + "/validate";
            return promiseService.getPromise(url);
        }

        function getItem(itemType, power, name) {
            var url = "https://treasure.dndgen.com/api/v1/item/" + itemType + "/power/" + power + "/generate";
            var parameters = { name: name };
            return promiseService.getPromise(url, parameters);
        }

        function validateItem(itemType, power, name) {
            var url = "https://treasure.dndgen.com/api/v1/item/" + itemType + "/power/" + power + "/validate";
            var parameters = { name: name };
            return promiseService.getPromise(url, parameters);
        }
    };
})();
