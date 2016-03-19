(function () {
    'use strict';

    angular
        .module('app.dungeon')
        .controller('Dungeon', Dungeon);

    Dungeon.$inject = ['$scope', 'dungeonService', 'sweetAlertService', 'fileSaverService', 'dungeonFormatterService'];

    function Dungeon($scope, dungeonService, sweetAlertService, fileSaverService, dungeonFormatterService) {
        var vm = this;

        vm.dungeonLevel = 1;
        vm.partyLevel = 1;
        vm.areas = [];
        vm.generating = false;

        vm.generateDungeonAreasFromHall = function () {
            vm.generating = true;

            dungeonService.getDungeonAreasFromHall(vm.dungeonLevel, vm.partyLevel)
                .then(setAreas, handleError);
        };

        vm.generateDungeonAreasFromDoor = function () {
            vm.generating = true;

            dungeonService.getDungeonAreasFromDoor(vm.dungeonLevel, vm.partyLevel)
                .then(setAreas, handleError);
        };

        function setAreas(data) {
            vm.areas = data.areas;
            vm.generating = false;
        }

        function handleError() {
            sweetAlertService.showError();
            vm.generating = false;
            vm.areas = [];
        }

        vm.download = function () {
            var formattedAreas = dungeonFormatterService.formatDungeonAreas(vm.areas);
            var fileName = 'Dungeon level ' + vm.dungeonLevel + ', party level ' + vm.partyLevel + ' ' + new Date().toString();

            fileSaverService.save(formattedAreas, fileName);
        };
    };
})();