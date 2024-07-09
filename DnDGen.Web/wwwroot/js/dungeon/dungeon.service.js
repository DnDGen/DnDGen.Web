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

        function getDungeonAreasFromHall(dungeonLevel, environment, temperature, timeOfDay, level, filters, allowAquatic, allowUnderground) {
            var url = "https://dungeon.dndgen.com/api/v1/dungeon/level/" + dungeonLevel + "/hall/" + temperature + "/" + environment + "/" + timeOfDay + "/level/" + level + "/generate";

            var parameters = getParameters(filters, allowAquatic, allowUnderground);
            return promiseService.getPromise(url, parameters);
        }

        function getParameters(filters, allowAquatic, allowUnderground) {
            return {
                creatureTypeFilters: filters,
                allowAquatic: allowAquatic,
                allowUnderground: allowUnderground,
            };
        }

        function getDungeonAreasFromDoor(dungeonLevel, environment, temperature, timeOfDay, level, filters, allowAquatic, allowUnderground) {
            var url = "https://dungeon.dndgen.com/api/v1/dungeon/level/" + dungeonLevel + "/door/" + temperature + "/" + environment + "/" + timeOfDay + "/level/" + level + "/generate";

            var parameters = getParameters(filters, allowAquatic, allowUnderground);
            return promiseService.getPromise(url, parameters);
        }
    };
})();
