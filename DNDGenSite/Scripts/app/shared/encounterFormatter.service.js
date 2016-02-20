(function () {
    'use strict';

    angular
        .module('app.shared')
        .factory('encounterFormatterService', encounterFormatterService);

    encounterFormatterService.$inject = ['treasureFormatterService', 'characterFormatterService'];

    function encounterFormatterService(treasureFormatterService, characterFormatterService) {
        return {
            formatEncounter: formatEncounter
        };

        function formatEncounter(encounter) {
            var formattedEncounter = 'Creatures:\n';

            for (var i = 0; i < encounter.Creatures.length; i++) {
                formattedEncounter += '\t' + encounter.Creatures[i].Type;

                if (encounter.Creatures[i].Subtype.length > 0)
                    formattedEncounter += ' (' + encounter.Creatures[i].Subtype + ')';

                formattedEncounter += ' x' + encounter.Creatures[i].Quantity + '\n';
            }

            formattedEncounter += formatTreasure(encounter.Treasure);

            if (encounter.Characters.length == 0)
                return formattedEncounter;

            formattedEncounter += 'Characters:\n';

            for (var i = 0; i < encounter.Characters.length; i++) {
                formattedEncounter += characterFormatterService.formatCharacter(encounter.Characters[i], null, null, null, '\t');
                formattedEncounter += '\n';
            }

            return formattedEncounter;
        }

        function formatTreasure(treasure)
        {
            if (treasure.Coin.Quantity == 0 && treasure.Goods.length == 0 && treasure.Items.length == 0)
                return "Treasure: None\n";

            var formattedTreasure = "Treasure:\n";
            formattedTreasure += treasureFormatterService.formatTreasure(treasure, "\t");

            return formattedTreasure;
        }
    };
})();
