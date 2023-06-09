(function () {
    'use strict';

    angular
        .module('app.roll')
        .factory('rollService', rollService);

    rollService.$inject = ['promiseService'];

    function rollService(promiseService) {

        return {
            getRoll: getRoll,
            getExpressionRoll: getExpressionRoll,
            validateExpression: validateExpression,
            validateRoll: validateRoll
        };

        function getRoll(quantity, die) {
            var url = "/Roll/Roll";
            var parameters = getParameters(quantity, die);
            return promiseService.getPromise(url, parameters);
        }

        function getParameters(quantity, die) {
            return {
                quantity: quantity,
                die: die
            };
        }

        function getExpressionRoll(expression) {
            var url = '/Roll/RollExpression';
            var parameters = getExpressionParameters(expression);
            return promiseService.getPromise(url, parameters);
        }

        function getExpressionParameters(expression) {
            return {
                expression: expression
            };
        }

        function validateExpression(expression) {
            var url = '/Roll/ValidateExpression';
            var parameters = getExpressionParameters(expression);
            return promiseService.getPromise(url, parameters);
        }

        function validateRoll(quantity, die) {
            var url = '/Roll/Validate';
            var parameters = getParameters(quantity, die);
            return promiseService.getPromise(url, parameters);
        }
    };
})();
