(function () {
    'use strict';

    angular
        .module('app.encounter')
        .factory('encounterFormatterService', encounterFormatterService);

    encounterFormatterService.$inject = ['treasureFormatterService', 'characterFormatterService'];

    function encounterFormatterService(treasureFormatterService, characterFormatterService) {
        return {
            formatEncounter: formatEncounter
        };

        function formatEncounter(encounter, prefix) {
            if (!prefix)
                prefix = '';

            var formattedEncounter = '';

            formattedEncounter += prefix + 'Average Encounter Level: ' + encounter.AverageEncounterLevel + ' (' + encounter.AverageDifficulty + ')\r\n';
            formattedEncounter += prefix + 'Actual Encounter Level: ' + encounter.ActualEncounterLevel + ' (' + encounter.ActualDifficulty + ')\r\n';
            formattedEncounter += prefix + 'Creatures:\r\n';

            for (var i = 0; i < encounter.Creatures.length; i++) {
                formattedEncounter += prefix + '\t' + encounter.Creatures[i].Name;

                if (encounter.Creatures[i].Description.length > 0)
                    formattedEncounter += ' (' + encounter.Creatures[i].Description + ')';

                formattedEncounter += ' (CR ' + encounter.Creatures[i].ChallengeRating + ')';
                formattedEncounter += ' x' + encounter.Creatures[i].Quantity + '\r\n';
            }

            formattedEncounter += formatTreasures(encounter.Treasures, prefix);

            if (encounter.Characters.length === 0)
                return formattedEncounter;

            formattedEncounter += prefix + 'Characters:\r\n';

            for (var i = 0; i < encounter.Characters.length; i++) {
                formattedEncounter += characterFormatterService.formatCharacter(encounter.Characters[i], null, null, null, prefix + '\t');
                formattedEncounter += '\r\n';
            }

            return formattedEncounter;
        }

        function formatTreasures(treasures, prefix)
        {
            var header = prefix + "Treasure:";
            var formattedTreasure = '';

            for (var i = 0; i < treasures.length; i++) {
                if (treasures[i].IsAny)
                    formattedTreasure += treasureFormatterService.formatTreasure(treasures[i], prefix + "\t");
            }

            if (formattedTreasure.length == 0)
                header += ' None\r\n';
            else
                header += '\r\n';

            return header + formattedTreasure;
        }
    };
})();
