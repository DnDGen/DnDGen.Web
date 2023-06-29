﻿(function () {
    'use strict';

    angular
        .module('app.shared')
        .factory('promiseService', promiseService);

    promiseService.$inject = ['$http', '$q'];

    function promiseService($http, $q) {

        return {
            getPromise: getPromise,
            postPromise: postPromise
        };

        function getPromise(url, parameters) {
            var deferred = $q.defer();

            var config = {
                method: 'GET',
                url: url,
                params: parameters
            };

            $http.get(url, config)
                .then(deferred.resolve, deferred.reject);

            return deferred.promise;
        }

        function postPromise(url, body) {
            var deferred = $q.defer();
            $http.post(url, body)
                .then(deferred.resolve, deferred.reject);

            return deferred.promise;
        }
    };
})();
