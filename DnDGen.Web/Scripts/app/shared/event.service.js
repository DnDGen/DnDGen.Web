(function () {
    'use strict';

    angular
        .module('app.shared')
        .factory('eventService', eventService);

    eventService.$inject = ['promiseService'];

    function eventService(promiseService) {
        return {
            getClientId: getClientId,
            getEvents: getEvents,
            clearEvents: clearEvents
        };

        function getClientId() {
            return promiseService.getPromise('/Event/ClientId');
        }

        function getEvents(clientId) {
            var parameters = { clientId: clientId };
            return promiseService.getPromise('/Event/Events', parameters);
        }

        function clearEvents(clientId) {
            var body = { clientId: clientId };
            return promiseService.postPromise('/Event/Clear', body);
        }
    };
})();
