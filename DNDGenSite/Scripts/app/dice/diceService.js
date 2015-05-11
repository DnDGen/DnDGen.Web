(function () {
    'use strict';

    angular
        .module('app.dice')
        .factory('diceService', diceService);

    diceService.$inject = ['promiseService'];

    function diceService(promiseService) {

        return {
            getRoll: getRoll,
            getCustomRoll: getCustomRoll
        };

        function getRoll(quantity, die)
        {
            var url = "Dice/" + die + "/" + quantity;
            return promiseService.getPromise(url);
        }

        function getCustomRoll(quantity, die) {
            var url = "Dice/Custom/" + quantity + "/" + die;
            return promiseService.getPromise(url);
        }
    };
})();
