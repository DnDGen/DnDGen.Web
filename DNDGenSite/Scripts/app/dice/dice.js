(function () {
    'use strict';

    angular
        .module('app.dice')
        .controller('Dice', Dice);

    Dice.$inject = ['diceService'];

    function Dice(diceService) {
        var vm = this;

        vm.quantities = {
            d2: 1,
            d3: 1,
            d4: 1,
            d6: 1,
            d8: 1,
            d10: 1,
            d12: 1,
            d20: 1,
            percentile: 1,
            custom: 1
        };

        vm.customDie = 1;

        vm.rolls = {
            d2: 0,
            d3: 0,
            d4: 0,
            d6: 0,
            d8: 0,
            d10: 0,
            d12: 0,
            d20: 0,
            percentile: 0,
            custom: 0
        };

        vm.rollD2 = function () {
            diceService.getD2Roll(vm.quantities.d2).then(function (data) {
                vm.rolls.d2 = data.roll;
            });
        };

        vm.rollD3 = function () {
            diceService.getD3Roll(vm.quantities.d3).then(function (data) {
                vm.rolls.d3 = data.roll;
            });
        };

        vm.rollD4 = function () {
            diceService.getD4Roll(vm.quantities.d4).then(function (data) {
                vm.rolls.d4 = data.roll;
            });
        };

        vm.rollD6 = function () {
            diceService.getD6Roll(vm.quantities.d6).then(function (data) {
                vm.rolls.d6 = data.roll;
            });
        };

        vm.rollD8 = function () {
            diceService.getD8Roll(vm.quantities.d8).then(function (data) {
                vm.rolls.d8 = data.roll;
            });
        };

        vm.rollD10 = function () {
            diceService.getD10Roll(vm.quantities.d10).then(function (data) {
                vm.rolls.d10 = data.roll;
            });
        };

        vm.rollD12 = function () {
            diceService.getD12Roll(vm.quantities.d12).then(function (data) {
                vm.rolls.d12 = data.roll;
            });
        };

        vm.rollD20 = function () {
            diceService.getD20Roll(vm.quantities.d20).then(function (data) {
                vm.rolls.d20 = data.roll;
            });
        };

        vm.rollPercentile = function () {
            diceService.getPercentileRoll(vm.quantities.percentile).then(function (data) {
                vm.rolls.percentile = data.roll;
            });
        };

        vm.rollCustom = function () {
            diceService.getCustomRoll(vm.quantities.custom, vm.customDie).then(function (data) {
                vm.rolls.custom = data.roll;
            });
        };
    };
})();