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

        function getDungeonAreasFromHall(dungeonLevel, partyLevel) {
            var url = "/Dungeon/GenerateFromHall?dungeonLevel=" + dungeonLevel + "&partyLevel=" + partyLevel;
            return promiseService.getPromise(url);
        }

        function getDungeonAreasFromDoor(dungeonLevel, partyLevel) {
            var url = "/Dungeon/GenerateFromDoor?dungeonLevel=" + dungeonLevel + "&partyLevel=" + partyLevel;
            return promiseService.getPromise(url);
        }
    };
})();
