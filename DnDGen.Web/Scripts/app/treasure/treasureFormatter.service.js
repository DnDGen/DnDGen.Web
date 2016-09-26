(function () {
    'use strict';

    angular
        .module('app.treasure')
        .factory('treasureFormatterService', treasureFormatterService);

    function treasureFormatterService() {
        return {
            formatTreasure: formatTreasure,
            formatItem: formatItem
        };

        function formatTreasure(treasure, prefix) {
            if (!prefix)
                prefix = '';

            var formattedTreasure = '';

            if (treasure.IsAny == false)
                return formattedTreasure;

            if (treasure.Coin.Quantity > 0)
                formattedTreasure += prefix + formatNumber(treasure.Coin.Quantity) + ' ' + treasure.Coin.Currency + '\r\n';
            
            if (treasure.Goods.length > 0)
                formattedTreasure += prefix + 'Goods:\r\n';

            for (var i = 0; i < treasure.Goods.length; i++) {
                formattedTreasure += prefix + '\t' + treasure.Goods[i].Description + ' (' + formatNumber(treasure.Goods[i].ValueInGold) + 'gp)\r\n';
            }

            if (treasure.Items.length > 0)
                formattedTreasure += prefix + 'Items:\r\n';

            for (var i = 0; i < treasure.Items.length; i++) {
                formattedTreasure += formatItem(treasure.Items[i], prefix + '\t');
            }

            return formattedTreasure;
        }

        function formatNumber(number) {
            return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }

        function formatItem(item, prefix) {
            if (!prefix)
                prefix = '';

            var formattedItem = prefix + item.Name;

            if (item.Quantity > 1)
                formattedItem += ' (x' + item.Quantity + ')';

            formattedItem += '\r\n';
            formattedItem += formatList(item.Contents, 'Contents', prefix + '\t');
            formattedItem += formatList(item.Traits, 'Traits', prefix + '\t');

            if (item.Magic.Bonus > 0)
                formattedItem += prefix + '\tBonus: +' + item.Magic.Bonus + '\r\n';

            formattedItem += formatSpecialAbilities(item.Magic.SpecialAbilities, prefix + '\t');

            if (item.Attributes.indexOf('Charged') > -1)
                formattedItem += prefix + '\tCharges: ' + item.Magic.Charges + '\r\n';

            if (item.Magic.Curse.length > 0)
                formattedItem += prefix + '\tCurse: ' + item.Magic.Curse + '\r\n';

            formattedItem += formatIntelligence(item.Magic.Intelligence, prefix + '\t');

            return formattedItem;
        }

        function formatList(list, title, prefix) {
            if (list.length == 0)
                return '';

            if (!prefix)
                prefix = '';

            var formattedList = prefix + title + ':\r\n';

            for (var i = 0; i < list.length; i++) {
                formattedList += prefix + '\t' + list[i] + '\r\n';
            }

            return formattedList;
        }

        function formatSpecialAbilities(abilities, prefix) {
            if (abilities.length == 0)
                return '';

            if (!prefix)
                prefix = '';

            var formattedAbilities = prefix + 'Special Abilities:\r\n';

            for (var i = 0; i < abilities.length; i++) {
                formattedAbilities += prefix + '\t' + abilities[i].Name + '\r\n';
            }

            return formattedAbilities;
        }

        function formatIntelligence(intelligence, prefix) {
            if (intelligence.Ego == 0)
                return '';

            if (!prefix)
                prefix = '';

            var formattedIntelligence = prefix + 'Intelligent:\r\n';
            formattedIntelligence += prefix + '\tEgo: ' + intelligence.Ego + '\r\n';
            formattedIntelligence += prefix + '\tIntelligence: ' + intelligence.IntelligenceStat + '\r\n';
            formattedIntelligence += prefix + '\tWisdom: ' + intelligence.WisdomStat + '\r\n';
            formattedIntelligence += prefix + '\tCharisma: ' + intelligence.CharismaStat + '\r\n';
            formattedIntelligence += prefix + '\tAlignment: ' + intelligence.Alignment + '\r\n';
            formattedIntelligence += formatList(intelligence.Communication, 'Communication', prefix + '\t');
            formattedIntelligence += formatList(intelligence.Languages, 'Languages', prefix + '\t\t');
            formattedIntelligence += prefix + '\tSenses: ' + intelligence.Senses + '\r\n';
            formattedIntelligence += formatList(intelligence.Powers, 'Powers', prefix + '\t');

            if (intelligence.SpecialPurpose.length > 0) {
                formattedIntelligence += prefix + '\tSpecial Purpose: ' + intelligence.SpecialPurpose + '\r\n';
                formattedIntelligence += prefix + '\tDedicated Power: ' + intelligence.DedicatedPower + '\r\n';
            }

            if (intelligence.Personality.length > -0)
                formattedIntelligence += prefix + '\tPersonality: ' + intelligence.Personality + '\r\n';
            else
                formattedIntelligence += prefix + '\tPersonality: None\r\n';

            return formattedIntelligence;
        }
    };
})();
