(function () {
    'use strict';

    angular
        .module('app.roll')
        .factory('rollService', rollService);

    rollService.$inject = ['promiseService'];

    function rollService(promiseService) {

        return {
            getRoll: getRoll,
            getCustomRoll: getCustomRoll,
            getExpressionRoll: getExpressionRoll
        };

        function getRoll(quantity, die)
        {
            var url = "/Roll/" + die + "/" + quantity;
            return promiseService.getPromise(url);
        }

        function getCustomRoll(quantity, die) {
            var url = "/Roll/Custom/" + quantity + "/" + die;
            return promiseService.getPromise(url);
        }

        function getExpressionRoll(expression) {
            var url = '/Roll/Expression?expression=' + encodeURIComponent(expression);
            return promiseService.getPromise(url);
        }
    };
})();
