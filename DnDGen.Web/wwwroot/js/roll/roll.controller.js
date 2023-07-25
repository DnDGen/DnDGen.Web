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
        vm.expression = '3d6+2';
        vm.validating = false;
        vm.rollIsValid = false;

        vm.roll = 0;

        vm.standardDice = [
            { name: '2', die: 2 },
            { name: '3', die: 3 },
            { name: '4', die: 4 },
            { name: '6', die: 6 },
            { name: '8', die: 8 },
            { name: '10', die: 10 },
            { name: '12', die: 12 },
            { name: '20', die: 20 },
            { name: 'Percentile', die: 100 }
        ];

        vm.standardDie = vm.standardDice[7];

        vm.rollStandard = function () {
            vm.rolling = true;
            rollService.getRoll(vm.standardQuantity, vm.standardDie.die)
                .then(setRoll, handleError);
        };

        function setRoll(response) {
            vm.roll = response.data;
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
            rollService.getRoll(vm.customQuantity, vm.customDie)
                .then(setRoll, handleError);
        };

        vm.rollExpression = function () {
            vm.rolling = true;
            rollService.getExpressionRoll(vm.expression)
                .then(setRoll, handleError);
        };

        $scope.$watch('vm.expression', function (newValue, oldValue) {
            vm.validating = true;

            if (!vm.expression || vm.expression === '') {
                vm.rollIsValid = false;
                vm.validating = false;
            }
            else {
                rollService.validateExpression(vm.expression).then(function (response) {
                    vm.rollIsValid = response.data;
                    vm.validating = false;
                }, function () {
                    handleError();
                    vm.rollIsValid = false;
                });
            }
        });

        $scope.$watch('vm.standardQuantity', function (newValue, oldValue) {
            validateRoll(vm.standardQuantity, vm.standardDie.die);
        });

        $scope.$watch('vm.standardDie', function (newValue, oldValue) {
            validateRoll(vm.standardQuantity, vm.standardDie.die);
        }, true);

        $scope.$watch('vm.customQuantity', function (newValue, oldValue) {
            validateRoll(vm.customQuantity, vm.customDie);
        });

        $scope.$watch('vm.customDie', function (newValue, oldValue) {
            validateRoll(vm.customQuantity, vm.customDie);
        });

        function validateRoll(quantity, die) {
            vm.validating = true;

            if (!quantity || !die || quantity === '' || die === '') {
                vm.rollIsValid = false;
                vm.validating = false;
            }
            else {
                rollService.validateRoll(quantity, die).then(function (response) {
                    vm.rollIsValid = response.data;
                    vm.validating = false;
                }, function () {
                    handleError();
                    vm.rollIsValid = false;
                });
            }
        }
    };
})();