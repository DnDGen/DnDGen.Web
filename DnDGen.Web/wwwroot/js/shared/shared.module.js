(function () {
    'use strict';

    angular
        .module('app.shared', [])
        .config(['$httpProvider', function ($httpProvider) {
            $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
        }]).provider("$exceptionHandler", {
                $get: function (errorLogService) {
                    return (errorLogService);
                }
            }
        ).factory("errorLogService", function( $log ) {
            return( log );

            function log( exception, cause ) {
                $log.error.apply( $log, arguments );
            }
        });
})();