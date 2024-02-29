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

            formattedEncounter += prefix + 'Target Encounter Level: ' + encounter.targetEncounterLevel + '\r\n';
            formattedEncounter += prefix + 'Average Encounter Level: ' + encounter.averageEncounterLevel + ' (' + encounter.averageDifficulty + ')' + '\r\n';
            formattedEncounter += prefix + 'Actual Encounter Level: ' + encounter.actualEncounterLevel + ' (' + encounter.actualDifficulty + ')' + '\r\n';
            formattedEncounter += prefix + 'Creatures:' + '\r\n';

            for (var i = 0; i < encounter.creatures.length; i++) {
                formattedEncounter += formatCreature(encounter.creatures[i], prefix + '\t');
            }

            formattedEncounter += formatTreasures(encounter.treasures, prefix);

            if (encounter.characters.length === 0)
                return formattedEncounter;

            formattedEncounter += prefix + 'Characters:\r\n';

            for (var j = 0; j < encounter.characters.length; j++) {
                formattedEncounter += characterFormatterService.formatCharacter(encounter.characters[j], prefix + '\t');
                formattedEncounter += '\r\n';
            }

            return formattedEncounter;
        }

        function formatCreature(creature, prefix) {
            var formattedCreature = prefix + formatCreatureName(creature.type, prefix);

            formattedCreature += prefix + '\t' + 'Challenge Rating: ' + creature.challengeRating + '\r\n';
            formattedCreature += prefix + '\t' + 'Quantity: ' + creature.quantity + '\r\n';

            return formattedCreature;
        }

        function formatCreatureName(creatureType, prefix) {
            var formattedType = creatureType.name;

            if (creatureType.description) {
                formattedType += ' (' + creatureType.description + ')';
            }

            formattedType += '\r\n';

            if (creatureType.subType) {
                formattedType += prefix + '\t' + 'Subtype: ' + formatCreatureName(creatureType.subType, prefix + '\t');
            }

            return formattedType;
        }

        function formatTreasures(treasures, prefix)
        {
            var header = prefix + "Treasure:";
            var formattedTreasure = '';

            for (var i = 0; i < treasures.length; i++) {
                if (treasures[i].isAny)
                    formattedTreasure += treasureFormatterService.formatTreasure(treasures[i], prefix + "\t");
            }

            if (!formattedTreasure.length)
                header += ' None';

            header += '\r\n';

            return header + formattedTreasure;
        }
    };
})();
