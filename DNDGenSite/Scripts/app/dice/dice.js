(function () {
    'use strict';

    angular
        .module('app.dice')
        .controller('Dice', Dice);

    Dice.$inject = ['diceService'];

    function Dice(diceService) {
        var vm = this;

        vm.standardQuantity = 1;
        vm.customQuantity = 1;
        vm.customDie = 1;

        vm.roll = 0;

        vm.standardDice = [
            { name: '2', die: "d2" },
            { name: '3', die: "d3" },
            { name: '4', die: "d4" },
            { name: '6', die: "d6" },
            { name: '8', die: "d8" },
            { name: '10', die: "d10" },
            { name: '12', die: "d12" },
            { name: '20', die: "d20" },
            { name: 'Percentile', die: "d100" }
        ];

        vm.standardDie = vm.standardDice[7];

        vm.rollStandard = function () {
            diceService.getRoll(vm.standardQuantity, vm.standardDie.die)
                .then(function (data) {
                    vm.roll = data.roll;
                });
        };

        vm.rollCustom = function () {
            diceService.getCustomRoll(vm.customQuantity, vm.customDie)
                .then(function (data) {
                    vm.roll = data.roll;
                });
        };
    };
})();