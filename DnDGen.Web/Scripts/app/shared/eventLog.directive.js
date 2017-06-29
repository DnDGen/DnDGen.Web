(function () {
    'use strict';

    angular
    .module('app.shared')
    .directive('dndgenEventLog', ['eventService', eventLog]);

    function eventLog(eventService) {
        return {
            restrict: "E",
            templateUrl: 'Templates/Shared/EventLog.html',
            scope: {
                clientId: '=',
                isLogging: '='
            },
            link: link,
        };

        function link (scope) {
            var timer = '';
            var pollInterval = 1000;
            var queueSize = 10;

            scope.events = [];

            scope.$watch(function () { return scope.isLogging; }, function (newValue, oldValue) {
                if (!scope.clientId)
                    return;

                if (newValue) {
                    start();
                } else {
                    stop();
                }
            }, true);

            function start() {
                scope.events = [];
                timer = window.setInterval(getEvents, pollInterval);
            }

            function getEvents() {
                eventService.getEvents(scope.clientId).then(function (response) {
                    response.data.events.forEach(function (genEvent) {
                        genEvent.When = parseDate(genEvent.When);
                    });

                    var newestEvents = response.data.events.reverse();

                    for (var i = 0; i < queueSize && i < newestEvents.length; i++) {
                        scope.events.splice(i, 0, newestEvents[i]);

                        while (scope.events.length > queueSize)
                            scope.events.pop();
                    }
                });
            }

            function parseDate(jsonDate) {
                var m = jsonDate.match(/\/Date\(([0-9]*)\)\//);
                if (m)
                    return new Date(parseInt(m[1]));

                return null;
            }

            function stop() {
                window.clearInterval(timer);
                eventService.clearEvents(scope.clientId);
            }
        }
    }
})();