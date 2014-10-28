(function () {
    'use strict';

    angular
        .module('app.dice')
        .controller('Dice', Dice);

    Dice.$inject = ['$scope', 'diceService'];

    function Dice($scope, diceService) {
        $scope.quantities = {
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

        $scope.customDie = 1;

        $scope.rolls = {
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

        $scope.rollD2 = function () {
            diceService.getD2Roll($scope.quantities.d2).then(function (data) {
                $scope.rolls.d2 = data.roll;
            });
        };

        $scope.rollD3 = function () {
            diceService.getD3Roll($scope.quantities.d3).then(function (data) {
                $scope.rolls.d3 = data.roll;
            });
        };

        $scope.rollD4 = function () {
            diceService.getD4Roll($scope.quantities.d4).then(function (data) {
                $scope.rolls.d4 = data.roll;
            });
        };

        $scope.rollD6 = function () {
            diceService.getD6Roll($scope.quantities.d6).then(function (data) {
                $scope.rolls.d6 = data.roll;
            });
        };

        $scope.rollD8 = function () {
            diceService.getD8Roll($scope.quantities.d8).then(function (data) {
                $scope.rolls.d8 = data.roll;
            });
        };

        $scope.rollD10 = function () {
            diceService.getD10Roll($scope.quantities.d10).then(function (data) {
                $scope.rolls.d10 = data.roll;
            });
        };

        $scope.rollD12 = function () {
            diceService.getD12Roll($scope.quantities.d12).then(function (data) {
                $scope.rolls.d12 = data.roll;
            });
        };

        $scope.rollD20 = function () {
            diceService.getD20Roll($scope.quantities.d20).then(function (data) {
                $scope.rolls.d20 = data.roll;
            });
        };

        $scope.rollPercentile = function () {
            diceService.getPercentileRoll($scope.quantities.percentile).then(function (data) {
                $scope.rolls.percentile = data.roll;
            });
        };

        $scope.rollCustom = function () {
            diceService.getCustomRoll($scope.quantities.custom, $scope.customDie).then(function (data) {
                $scope.rolls.custom = data.roll;
            });
        };
    };
})();