(function () {
    'use strict';

    angular
        .module('app.dice')
        .factory('diceService', diceService);

    diceService.$inject = ['$http', '$q'];

    function diceService($http, $q) {

        return {
            getRoll: getRoll,
            getCustomRoll: getCustomRoll
        };

        function getRoll(quantity, die)
        {
            var url = "Dice/" + die + "/" + quantity;
            return getPromise(url);
        }

        function getCustomRoll(quantity, die) {
            var url = "Dice/Custom/" + quantity + "/" + die;
            return getPromise(url);
        }

        function getPromise(url) {
            var deferred = $q.defer();
            $http.get(url).success(deferred.resolve).error(deferred.reject);

            return deferred.promise;
        }
    };
})();
