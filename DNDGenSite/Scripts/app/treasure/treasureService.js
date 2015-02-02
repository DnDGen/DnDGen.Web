(function () {
    'use strict';

    angular
        .module('app.treasure')
        .factory('treasureService', treasureService);

    treasureService.$inject = ['$http', '$q'];

    function treasureService($http, $q) {
        return {
            getTreasure: getTreasure,
            getMundaneItem: getMundaneItem,
            getPoweredItem: getPoweredItem
        };

        function getTreasure(treasureType, level) {
            var url = "Treasures/" + treasureType + "/Generate/" + level;
            return getPromise(url);
        };

        function getMundaneItem(itemType) {
            var url = "Treasures/" + itemType + "/Generate";
            return getPromise(url);
        };

        function getPoweredItem(itemType, power) {
            var url = "Treasures/" + itemType + "/Generate/" + power;
            return getPromise(url);
        };

        function getPromise(url) {
            var deferred = $q.defer();
            $http.get(url).success(deferred.resolve).error(deferred.reject);

            return deferred.promise;
        }
    };
})();
