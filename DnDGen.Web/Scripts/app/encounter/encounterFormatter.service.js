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

            var formattedEncounter = prefix + 'Creatures:\r\n';

            for (var i = 0; i < encounter.Creatures.length; i++) {
                formattedEncounter += prefix + '\t' + encounter.Creatures[i].Type;

                if (encounter.Creatures[i].Subtype.length > 0)
                    formattedEncounter += ' (' + encounter.Creatures[i].Subtype + ')';

                formattedEncounter += ' x' + encounter.Creatures[i].Quantity + '\r\n';
            }

            formattedEncounter += formatTreasure(encounter.Treasure, prefix);

            if (encounter.Characters.length == 0)
                return formattedEncounter;

            formattedEncounter += prefix + 'Characters:\r\n';

            for (var i = 0; i < encounter.Characters.length; i++) {
                formattedEncounter += characterFormatterService.formatCharacter(encounter.Characters[i], null, null, null, prefix + '\t');
                formattedEncounter += '\r\n';
            }

            return formattedEncounter;
        }

        function formatTreasure(treasure, prefix)
        {
            if (treasure.Coin.Quantity == 0 && treasure.Goods.length == 0 && treasure.Items.length == 0)
                return prefix + "Treasure: None\r\n";

            var formattedTreasure = prefix + "Treasure:\r\n";
            formattedTreasure += treasureFormatterService.formatTreasure(treasure, prefix + "\t");

            return formattedTreasure;
        }
    };
})();
