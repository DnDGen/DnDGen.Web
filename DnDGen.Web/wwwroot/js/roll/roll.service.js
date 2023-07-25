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
            var url = "https://roll.dndgen.com/api/v1/roll";
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
            var url = 'https://roll.dndgen.com/api/v1/expression/roll';
            var parameters = getExpressionParameters(expression);
            return promiseService.getPromise(url, parameters);
        }

        function getExpressionParameters(expression) {
            return {
                expression: expression
            };
        }

        function validateExpression(expression) {
            var url = 'https://roll.dndgen.com/api/v1/expression/validate';
            var parameters = getExpressionParameters(expression);
            return promiseService.getPromise(url, parameters);
        }

        function validateRoll(quantity, die) {
            var url = 'https://roll.dndgen.com/api/v1/roll/validate';
            var parameters = getParameters(quantity, die);
            return promiseService.getPromise(url, parameters);
        }
    };
})();
