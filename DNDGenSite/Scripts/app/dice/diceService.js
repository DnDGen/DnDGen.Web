(function () {
    'use strict';

    angular
        .module('app.dice')
        .factory('diceService', diceService);

    diceService.$inject = ['$http', '$q'];

    function diceService($http, $q) {

        return {
            getD2Roll: getD2Roll,
            getD3Roll: getD3Roll,
            getD4Roll: getD4Roll,
            getD6Roll: getD6Roll,
            getD8Roll: getD8Roll,
            getD10Roll: getD10Roll,
            getD12Roll: getD12Roll,
            getD20Roll: getD20Roll,
            getPercentileRoll: getPercentileRoll,
            getCustomRoll: getCustomRoll
        };

        function getD2Roll(quantity) {
            var url = "Dice/D2/" + quantity;
            return getPromise(url);
        };

        function getD3Roll(quantity) {
            var url = "Dice/D3/" + quantity;
            return getPromise(url);
        };

        function getD4Roll(quantity) {
            var url = "Dice/D4/" + quantity;
            return getPromise(url);
        };

        function getD6Roll(quantity) {
            var url = "Dice/D6/" + quantity;
            return getPromise(url);
        };

        function getD8Roll(quantity) {
            var url = "Dice/D8/" + quantity;
            return getPromise(url);
        };

        function getD10Roll(quantity) {
            var url = "Dice/D10/" + quantity;
            return getPromise(url);
        };

        function getD12Roll(quantity) {
            var url = "Dice/D12/" + quantity;
            return getPromise(url);
        };

        function getD20Roll(quantity) {
            var url = "Dice/D20/" + quantity;
            return getPromise(url);
        };

        function getPercentileRoll(quantity) {
            var url = "Dice/Percentile/" + quantity;
            return getPromise(url);
        };

        function getCustomRoll(quantity, die) {
            var url = "Dice/Custom/" + quantity + "/" + die;
            return getPromise(url);
        };

        function getPromise(url) {
            var deferred = $q.defer();
            $http.get(url).success(deferred.resolve).error(deferred.reject);

            return deferred.promise;
        }
    };
})();
