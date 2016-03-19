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
            var formattedArea = area.Type;

            if (area.Descriptions.length > 0 || area.Length > 0 || area.Contents.IsEmpty == false) {
                formattedArea += ':';
            }

            formattedArea += '\n';

            if (area.Descriptions.length > 0) {
                formattedArea += '\tDescriptions:\n';

                for (var i = 0; i < area.Descriptions.length; i++) {
                    formattedArea += '\t\t' + area.Descriptions[i] + '\n';
                }
            }

            if (area.Length > 0) {
                if (area.Width == 0) {
                    formattedArea += '\tDimensions: continues ' + area.Length + '\'\n';
                }
                else if (area.Width == 1) {
                    formattedArea += '\tDimensions: about ' + area.Length + ' square feet\n';
                }
                else if (area.Width > 1) {
                    formattedArea += '\tDimensions: ' + area.Length + '\' x ' + area.Width + '\'\n';
                }
            }

            if (area.Contents.IsEmpty == false) {
                formattedArea += formatContents(area.Contents);
            }

            return formattedArea;
        }

        function formatContents(contents) {
            var formattedContents = '\tContents:\n';

            for (var i = 0; i < contents.Miscellaneous.length; i++) {
                formattedContents += '\t\t' + contents.Miscellaneous[i] + '\n';
            }

            if (contents.Traps.length > 0) {
                formattedContents += '\t\tTraps:\n';

                for (var i = 0; i < contents.Traps.length; i++) {
                    formattedContents += '\t\t\t' + contents.Traps[i].Description + ':\n';
                    formattedContents += '\t\t\t\tChallenge Rating: ' + contents.Traps[i].ChallengeRating + '\n';
                    formattedContents += '\t\t\t\tSearch DC: ' + contents.Traps[i].SearchDC + '\n';
                    formattedContents += '\t\t\t\tDisable Device DC: ' + contents.Traps[i].DisableDeviceDC + '\n';
                }
            }

            if (contents.Encounters.length > 0) {
                formattedContents += '\t\tEncounters:\n';

                for (var i = 0; i < contents.Encounters.length; i++) {
                    formattedContents += '\t\t\tEncounter ' + (i + 1) + ':\n';
                    formattedContents += encounterFormatterService.formatEncounter(contents.Encounters[i], '\t\t\t\t');
                }
            }

            if (contents.Treasures.length > 0) {
                formattedContents += '\t\tTreasures:\n';

                for (var i = 0; i < contents.Treasures.length; i++) {
                    formattedContents += formatDungeonTreasure(contents.Treasures[i], 'Treasure ' + (i + 1));
                }
            }

            if (contents.Pool) {
                formattedContents += '\t\tPool';

                if (contents.Pool.Encounter || contents.Pool.Treasure || contents.Pool.MagicPower.length > 0)
                    formattedContents += ':';

                formattedContents += '\n';

                if (contents.Pool.Encounter) {
                    formattedContents += '\t\t\tEncounter:\n';
                    formattedContents += encounterFormatterService.formatEncounter(contents.Pool.Encounter, '\t\t\t\t');
                }

                if (contents.Pool.Treasure) {
                    formattedContents += formatDungeonTreasure(contents.Pool.Treasure, 'Treasure');
                }

                if (contents.Pool.MagicPower.length > 0) {
                    formattedContents += '\t\t\tMagic Power: ' + contents.Pool.MagicPower + '\n';
                }
            }

            return formattedContents;
        }

        function formatDungeonTreasure(dungeonTreasure, title) {
            var formattedDungeonTreasure = '\t\t\t' + title + ':';

            if (treasureIsEmpty(dungeonTreasure.Treasure))
                formattedDungeonTreasure += ' None';

            formattedDungeonTreasure += '\n';

            if (dungeonTreasure.Container.length > 0)
                formattedDungeonTreasure += '\t\t\t\tContainer: ' + dungeonTreasure.Container + '\n';

            if (dungeonTreasure.Concealment.length > 0)
                formattedDungeonTreasure += '\t\t\t\tConcealment: ' + dungeonTreasure.Concealment + '\n';

            if (treasureIsEmpty(dungeonTreasure.Treasure) == false)
                formattedDungeonTreasure += treasureFormatterService.formatTreasure(dungeonTreasure.Treasure, '\t\t\t\t');

            return formattedDungeonTreasure;
        }

        function treasureIsEmpty(treasure) {
            return treasure.Coin.Quantity == 0 && treasure.Goods.length == 0 && treasure.Items.length == 0;
        }
    };
})();
