﻿(function () {
    'use strict';

    angular
    .module('app.shared')
    .directive('dndgenCollapsableList', collapsableList);

    function collapsableList() {
        return {
            restrict: "E",
            templateUrl: '/templates/shared/collapsableList.html',
            scope: {
                heading: '@',
                hasList: '='
            },
            transclude: true,
            link: link
        }

        function link(scope) {
            scope.id = 'list-' + getGuid();
        }

        function getGuid() {
            return (S4() + S4() + "-" + S4() + "-4" + S4().substring(0, 3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
        }

        function S4() {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        }
    }
})();