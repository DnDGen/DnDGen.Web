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

            var formattedEncounter = prefix + 'Creatures:\n';

            for (var i = 0; i < encounter.Creatures.length; i++) {
                formattedEncounter += prefix + '\t' + encounter.Creatures[i].Type;

                if (encounter.Creatures[i].Subtype.length > 0)
                    formattedEncounter += ' (' + encounter.Creatures[i].Subtype + ')';

                formattedEncounter += ' x' + encounter.Creatures[i].Quantity + '\n';
            }

            formattedEncounter += formatTreasure(encounter.Treasure, prefix);

            if (encounter.Characters.length == 0)
                return formattedEncounter;

            formattedEncounter += prefix + 'Characters:\n';

            for (var i = 0; i < encounter.Characters.length; i++) {
                formattedEncounter += characterFormatterService.formatCharacter(encounter.Characters[i], null, null, null, prefix + '\t');
                formattedEncounter += '\n';
            }

            return formattedEncounter;
        }

        function formatTreasure(treasure, prefix)
        {
            if (treasure.Coin.Quantity == 0 && treasure.Goods.length == 0 && treasure.Items.length == 0)
                return prefix + "Treasure: None\n";

            var formattedTreasure = prefix + "Treasure:\n";
            formattedTreasure += treasureFormatterService.formatTreasure(treasure, prefix + "\t");

            return formattedTreasure;
        }
    };
})();
