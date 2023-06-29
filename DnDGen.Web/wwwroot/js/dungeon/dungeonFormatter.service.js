(function () {
    'use strict';

    angular
        .module('app.dungeon')
        .factory('dungeonFormatterService', dungeonFormatterService);

    dungeonFormatterService.$inject = ['treasureFormatterService', 'encounterFormatterService'];

    function dungeonFormatterService(treasureFormatterService, encounterFormatterService) {
        return {
            formatDungeonAreas: formatDungeonAreas
        };

        function formatDungeonAreas(areas) {
            var formattedAreas = '';

            for (var i = 0; i < areas.length; i++) {
                formattedAreas += formatArea(areas[i]);
            }

            return formattedAreas;
        }

        function formatArea(area) {
            var formattedArea = area.type;

            if (area.descriptions.length > 0 || area.length > 0 || area.contents.isEmpty === false) {
                formattedArea += ':';
            }

            formattedArea += '\r\n';

            if (area.descriptions.length > 0) {
                formattedArea += '\tDescriptions:\r\n';

                for (var i = 0; i < area.descriptions.length; i++) {
                    formattedArea += '\t\t' + area.descriptions[i] + '\r\n';
                }
            }

            if (area.length > 0) {
                if (area.width === 0) {
                    formattedArea += '\tDimensions: continues ' + area.length + '\'\r\n';
                }
                else if (area.width === 1) {
                    formattedArea += '\tDimensions: about ' + area.length + ' square feet\r\n';
                }
                else if (area.width > 1) {
                    formattedArea += '\tDimensions: ' + area.length + '\' x ' + area.width + '\'\r\n';
                }
            }

            if (area.contents.isEmpty === false) {
                formattedArea += formatContents(area.contents);
            }

            return formattedArea;
        }

        function formatContents(contents) {
            var formattedContents = '\tContents:\r\n';

            for (var i = 0; i < contents.miscellaneous.length; i++) {
                formattedContents += '\t\t' + contents.miscellaneous[i] + '\r\n';
            }

            if (contents.traps.length > 0) {
                formattedContents += '\t\tTraps:\r\n';

                for (var i = 0; i < contents.traps.length; i++) {
                    formattedContents += '\t\t\t' + contents.traps[i].name + ':\r\n';
                    formattedContents += formatList(contents.traps[i].descriptions, '\t\t\t\t');
                    formattedContents += '\t\t\t\tChallenge Rating: ' + contents.traps[i].challengeRating + '\r\n';
                    formattedContents += '\t\t\t\tSearch DC: ' + contents.traps[i].searchDC + '\r\n';
                    formattedContents += '\t\t\t\tDisable Device DC: ' + contents.traps[i].disableDeviceDC + '\r\n';
                }
            }

            if (contents.encounters.length > 0) {
                formattedContents += '\t\tEncounters:\r\n';

                for (var i = 0; i < contents.encounters.length; i++) {
                    formattedContents += '\t\t\tEncounter ' + (i + 1) + ':\r\n';
                    formattedContents += encounterFormatterService.formatEncounter(contents.encounters[i], '\t\t\t\t');
                }
            }

            if (contents.treasures.length > 0) {
                formattedContents += '\t\tTreasures:\r\n';

                for (var i = 0; i < contents.treasures.length; i++) {
                    formattedContents += formatDungeonTreasure(contents.treasures[i], 'Treasure ' + (i + 1));
                }
            }

            if (contents.pool) {
                formattedContents += '\t\tPool';

                if (contents.pool.encounter || contents.pool.treasure || contents.pool.magicPower.length > 0)
                    formattedContents += ':';

                formattedContents += '\r\n';

                if (contents.pool.encounter) {
                    formattedContents += '\t\t\tEncounter:\r\n';
                    formattedContents += encounterFormatterService.formatEncounter(contents.pool.encounter, '\t\t\t\t');
                }

                if (contents.pool.treasure) {
                    formattedContents += formatDungeonTreasure(contents.pool.treasure, 'Treasure');
                }

                if (contents.pool.magicPower.length > 0) {
                    formattedContents += '\t\t\tMagic Power: ' + contents.pool.magicPower + '\r\n';
                }
            }

            return formattedContents;
        }

        function formatList(list, prefix) {
            if (!prefix)
                prefix = '';

            var formattedList = '';

            for (var i = 0; i < list.length; i++) {
                formattedList += prefix + list[i] + '\r\n';
            }

            return formattedList;
        }

        function formatDungeonTreasure(dungeonTreasure, title) {
            var formattedDungeonTreasure = '\t\t\t' + title + ':';

            if (dungeonTreasure.treasure.isAny === false)
                formattedDungeonTreasure += ' None';

            formattedDungeonTreasure += '\r\n';

            if (dungeonTreasure.container.length > 0)
                formattedDungeonTreasure += '\t\t\t\tContainer: ' + dungeonTreasure.container + '\r\n';

            if (dungeonTreasure.concealment.length > 0)
                formattedDungeonTreasure += '\t\t\t\tConcealment: ' + dungeonTreasure.concealment + '\r\n';

            if (dungeonTreasure.treasure.isAny)
                formattedDungeonTreasure += treasureFormatterService.formatTreasure(dungeonTreasure.treasure, '\t\t\t\t');

            return formattedDungeonTreasure;
        }
    };
})();
