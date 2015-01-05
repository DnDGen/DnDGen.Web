(function () {
    'use strict';

    angular
        .module('app.equipment')
        .factory('equipmentService', equipmentService);

    equipmentService.$inject = ['$http', '$q'];

    function equipmentService($http, $q) {
        return {
            getTreasure: getTreasure,
            getMundaneItem: getMundaneItem,
            getPoweredItem: getPoweredItem
        };

        function getTreasure(treasureType, level) {
            var url = "Equipment/" + treasureType + "/Generate/" + level;
            return getPromise(url);
        };

        function getMundaneItem(itemType) {
            var url = "Equipment/" + itemType + "/Generate";
            return getPromise(url);
        };

        function getPoweredItem(itemType, power) {
            var url = "Equipment/" + itemType + "/Generate/" + power;
            return getPromise(url);
        };

        function getPromise(url) {
            var deferred = $q.defer();
            $http.get(url).success(deferred.resolve).error(deferred.reject);

            return deferred.promise;
        }
    };
})();
