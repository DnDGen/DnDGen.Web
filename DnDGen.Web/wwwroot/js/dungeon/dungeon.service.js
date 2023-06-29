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

        function getDungeonAreasFromHall(clientId, dungeonLevel, environment, temperature, timeOfDay, level, filters, allowAquatic, allowUnderground) {
            var parameters = getParameters(clientId, dungeonLevel, environment, temperature, timeOfDay, level, filters, allowAquatic, allowUnderground);
            return promiseService.getPromise('/Dungeon/GenerateFromHall', parameters);
        }

        function getParameters(clientId, dungeonLevel, environment, temperature, timeOfDay, level, filters, allowAquatic, allowUnderground) {
            return {
                clientId: clientId,
                dungeonLevel: dungeonLevel,
                environment: environment,
                temperature: temperature,
                timeOfDay: timeOfDay,
                level: level,
                creatureTypeFilters: filters,
                allowAquatic: allowAquatic,
                allowUnderground: allowUnderground,
            };
        }

        function getDungeonAreasFromDoor(clientId, dungeonLevel, environment, temperature, timeOfDay, level, filters, allowAquatic, allowUnderground) {
            var parameters = getParameters(clientId, dungeonLevel, environment, temperature, timeOfDay, level, filters, allowAquatic, allowUnderground);
            return promiseService.getPromise('/Dungeon/GenerateFromDoor', parameters);
        }
    };
})();
