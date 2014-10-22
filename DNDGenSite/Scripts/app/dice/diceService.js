(function () {
    'use strict';

    angular
        .module('app.dice')
        .factory('diceService', diceService);

    diceService.$inject = ['$http', '$q'];

    function diceService($http, $q) {

        return {
            getUpdatedProcessingButtons: getUpdatedProcessingButtons,
            getFileIconUrl: getFileIconUrl
        };

        function getUpdatedProcessingButtons(documentId) {
            var url = resolveUrl("Navigation/DocumentProcessingButtons?ID=" + documentId);
            var deferred = $q.defer();
            $http.get(url).success(deferred.resolve).error(deferred.reject);

            return deferred.promise;
        };

        function getFileIconUrl(documentId) {
            var url = resolveUrl("FileTransfer/FileTypeIconUrl/" + documentId);
            var deferred = $q.defer();
            $http.get(url).success(deferred.resolve).error(deferred.reject);

            return deferred.promise;
        };
    };
})();
