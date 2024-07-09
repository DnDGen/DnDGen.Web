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

            if (encounter.description) {
                formattedEncounter += prefix + encounter.description + '\r\n';
            }

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
            var formattedCreature = '';

            formattedCreature = prefix + formatCreatureName(creature.creature, prefix);

            formattedCreature += prefix + '\t' + 'Challenge Rating: ' + creature.challengeRating + '\r\n';
            formattedCreature += prefix + '\t' + 'Quantity: ' + creature.quantity + '\r\n';

            return formattedCreature;
        }

        function formatCreatureName(creature, prefix) {
            var formattedCreature = creature.name;

            if (creature.description) {
                formattedCreature += ' (' + creature.description + ')';
            }

            formattedCreature += '\r\n';

            if (creature.subCreature) {
                formattedCreature += prefix + '\t' + 'Sub-creature: ' + formatCreatureName(creature.subCreature, prefix + '\t');
            }

            return formattedCreature;
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
