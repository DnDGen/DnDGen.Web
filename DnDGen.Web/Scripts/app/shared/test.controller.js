(function () {
    'use strict';

    angular
        .module('app.shared')
        .controller('Test', Test);

    Test.$inject = ['$scope', 'promiseService'];

    function Test($scope, promiseService) {
        var vm = this;
        vm.output = '';
        var id = '';
        var timer = '';

        vm.start = function () {
            promiseService.getPromise('ClientId').then(function (data) {
                id = data.id;
                vm.output += "ID is " + id;

                promiseService.getPromise('Start', { id: id }).then(function (data) {
                    vm.output += "\nResult: " + data.result;
                    vm.stop();
                });
            });

            timer = window.setInterval(getEvents, 1000);
        };

        function getEvents() {
            promiseService.getPromise('Events', { id: id }).then(function (data) {
                data.events.forEach(function (genEvent) {
                    vm.output += "\n[" + parseDate(genEvent.When) + "] " + genEvent.Source + ": " + genEvent.Message;
                });
            });
        }

        function parseDate(jsonDate) {
            var m = jsonDate.match(/\/Date\(([0-9]*)\)\//);
            if (m)
                return new Date(parseInt(m[1]));

            return null;
        }

        vm.stop = function () {
            window.clearInterval(timer);
        };

        vm.clear = function () {
            vm.output = '';
        };
    };
})();