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

            formattedEncounter += prefix + 'Target Encounter Level: ' + encounter.TargetEncounterLevel + '\r\n';
            formattedEncounter += prefix + 'Average Encounter Level: ' + encounter.AverageEncounterLevel + ' (' + encounter.AverageDifficulty + ')' + '\r\n';
            formattedEncounter += prefix + 'Actual Encounter Level: ' + encounter.ActualEncounterLevel + ' (' + encounter.ActualDifficulty + ')' + '\r\n';
            formattedEncounter += prefix + 'Creatures:' + '\r\n';

            for (var i = 0; i < encounter.Creatures.length; i++) {
                formattedEncounter += formatCreature(encounter.Creatures[i], prefix + '\t');
            }

            formattedEncounter += formatTreasures(encounter.Treasures, prefix);

            if (encounter.Characters.length === 0)
                return formattedEncounter;

            formattedEncounter += prefix + 'Characters:\r\n';

            for (var j = 0; j < encounter.Characters.length; j++) {
                formattedEncounter += characterFormatterService.formatCharacter(encounter.Characters[j], null, null, null, prefix + '\t');
                formattedEncounter += '\r\n';
            }

            return formattedEncounter;
        }

        function formatCreature(creature, prefix) {
            var formattedCreature = prefix + formatCreatureName(creature.Type, prefix);

            formattedCreature += prefix + '\t' + 'Challenge Rating: ' + creature.ChallengeRating + '\r\n';
            formattedCreature += prefix + '\t' + 'Quantity: ' + creature.Quantity + '\r\n';

            return formattedCreature;
        }

        function formatCreatureName(creatureType, prefix) {
            var formattedType = creatureType.Name;

            if (creatureType.Description) {
                formattedType += ' (' + creatureType.Description + ')';
            }

            formattedType += '\r\n';

            if (creatureType.SubType) {
                formattedType += prefix + '\t' + 'Subtype: ' + formatCreatureName(creatureType.SubType, prefix + '\t');
            }

            return formattedType;
        }

        function formatTreasures(treasures, prefix)
        {
            var header = prefix + "Treasure:";
            var formattedTreasure = '';

            for (var i = 0; i < treasures.length; i++) {
                if (treasures[i].IsAny)
                    formattedTreasure += treasureFormatterService.formatTreasure(treasures[i], prefix + "\t");
            }

            if (!formattedTreasure.length)
                header += ' None';

            header += '\r\n';

            return header + formattedTreasure;
        }
    };
})();
