(function () {
    'use strict';

    angular
    .module('app.shared')
    .directive('dndgenNoDecimals', noDecimals);

    function noDecimals() {
        return {
            restrict: "A",
            require: "ngModel",
            link: checkForDecimals
        }
    }

    function checkForDecimals(scope, element, attr, ctrl) {
        ctrl.$parsers.push(function (value) {
            if (value % 1 !== 0) {
                ctrl.$setValidity("notDecimal", false);
                return undefined;
            }

            ctrl.$setValidity("notDecimal", true);
            return value;
        });
    }
})();