(function () {
    'use strict';

    angular
        .module('app.dungeon')
        .factory('dungeonService', dungeonService);

    dungeonService.$inject = ['promiseService'];

    function dungeonService(promiseService) {
        return {
            getDungeonAreasFromHall: getDungeonAreasFromHall,
            getDungeonAreasFromDoor: getDungeonAreasFromDoor
        };

        function getDungeonAreasFromHall(dungeonLevel, partyLevel, temperature) {
            var parameters = getParameters(dungeonLevel, partyLevel, temperature);
            return promiseService.getPromise('/Dungeon/GenerateFromHall', parameters);
        }

        function getParameters(dungeonLevel, partyLevel, temperature) {
            return {
                dungeonLevel: dungeonLevel,
                partyLevel: partyLevel,
                temperature: temperature
            };
        }

        function getDungeonAreasFromDoor(dungeonLevel, partyLevel, temperature) {
            var parameters = getParameters(dungeonLevel, partyLevel, temperature);
            return promiseService.getPromise('/Dungeon/GenerateFromDoor', parameters);
        }
    };
})();
