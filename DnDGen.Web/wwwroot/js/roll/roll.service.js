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
            var url = "https://roll.dndgen.com/api/v2/" + quantity + "/d/" + die + "/roll";
            return promiseService.getPromise(url);
        }

        function validateRoll(quantity, die) {
            var url = "https://roll.dndgen.com/api/v2/" + quantity + "/d/" + die + "/validate";
            return promiseService.getPromise(url);
        }

        function getExpressionRoll(expression) {
            var url = 'https://roll.dndgen.com/api/v2/expression/roll';
            var parameters = getExpressionParameters(expression);
            return promiseService.getPromise(url, parameters);
        }

        function getExpressionParameters(expression) {
            return {
                expression: expression
            };
        }

        function validateExpression(expression) {
            var url = 'https://roll.dndgen.com/api/v2/expression/validate';
            var parameters = getExpressionParameters(expression);
            return promiseService.getPromise(url, parameters);
        }
    };
})();
