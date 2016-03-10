(function () {
    'use strict';

    angular
        .module('app.roll')
        .controller('Roll', Roll);

    Roll.$inject = ['$scope', 'rollService', 'sweetAlertService'];

    function Roll($scope, rollService, sweetAlertService) {
        var vm = this;

        vm.standardQuantity = 1;
        vm.customQuantity = 1;
        vm.customDie = 1;
        vm.rolling = false;
        vm.expression = '';
        vm.validating = false;
        vm.expressionIsValid = false;

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
            vm.rolling = true;
            rollService.getRoll(vm.standardQuantity, vm.standardDie.die)
                .then(setRoll, handleError);
        };

        function setRoll(data) {
            vm.roll = data.roll;
            vm.rolling = false;
        }

        function handleError() {
            sweetAlertService.showError();
            vm.roll = 0;
            vm.rolling = false;
            vm.validating = false;
        }

        vm.rollCustom = function () {
            vm.rolling = true;
            rollService.getCustomRoll(vm.customQuantity, vm.customDie)
                .then(setRoll, handleError);
        };

        vm.rollExpression = function () {
            vm.rolling = true;
            rollService.getExpressionRoll(vm.expression)
                .then(setRoll, handleError);
        };

        $scope.$watch('vm.expression', function (newValue, oldValue) {
            vm.validating = true;
            rollService.validateExpressionRoll(vm.expression).then(function (data) {
                vm.expressionIsValid = data.isValid;
                vm.validating = false;
            }, function () {
                handleError();
                vm.expressionIsValid = false;
            });
        });
    };
})();