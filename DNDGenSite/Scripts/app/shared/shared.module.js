(function () {
    'use strict';

    angular
        .module('app.shared', [])
        .config(['$httpProvider', function ($httpProvider) {
            $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
        }]);
})();