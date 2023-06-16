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

            if (!treasure.isAny)
                return formattedTreasure;

            if (treasure.coin.quantity > 0)
                formattedTreasure += prefix + formatNumber(treasure.coin.quantity) + ' ' + treasure.coin.currency + '\r\n';
            
            if (treasure.goods.length > 0)
                formattedTreasure += prefix + 'Goods:\r\n';

            for (var i = 0; i < treasure.goods.length; i++) {
                formattedTreasure += prefix + '\t' + treasure.goods[i].description + ' (' + formatNumber(treasure.goods[i].valueInGold) + 'gp)\r\n';
            }

            if (treasure.items.length > 0)
                formattedTreasure += prefix + 'Items:\r\n';

            for (var j = 0; j < treasure.items.length; j++) {
                formattedTreasure += formatItem(treasure.items[j], prefix + '\t');
            }

            return formattedTreasure;
        }

        function formatNumber(number) {
            return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }

        function formatItem(item, prefix) {
            if (!prefix)
                prefix = '';

            var formattedItem = prefix + item.name;

            if (item.quantity > 1)
                formattedItem += ' (x' + item.quantity + ')';

            formattedItem += '\r\n';
            formattedItem += formatList(item.contents, 'Contents', prefix + '\t');
            formattedItem += formatList(item.traits, 'Traits', prefix + '\t');

            if (item.magic.bonus > 0)
                formattedItem += prefix + '\tBonus: +' + item.magic.bonus + '\r\n';

            formattedItem += formatSpecialAbilities(item.magic.specialAbilities, prefix + '\t');

            if (item.attributes.indexOf('Charged') > -1)
                formattedItem += prefix + '\tCharges: ' + item.magic.charges + '\r\n';

            if (item.magic.curse.length > 0)
                formattedItem += prefix + '\tCurse: ' + item.magic.curse + '\r\n';

            formattedItem += formatIntelligence(item.magic.intelligence, prefix + '\t');

            if (item.totalArmorBonus) {
                formattedItem += formatArmor(item, prefix + '\t');
            }
            else if (item.damage) {
                formattedItem += formatWeapon(item, prefix + '\t');
            }

            return formattedItem;
        }

        function formatArmor(armor, prefix) {
            var formattedArmor = prefix + 'Armor:' + '\r\n';

            formattedArmor += prefix + '\t' + 'Size: ' + armor.size + '\r\n';
            formattedArmor += prefix + '\t' + 'Armor Bonus: ' + armor.totalArmorBonus + '\r\n';
            formattedArmor += prefix + '\t' + 'Armor Check Penalty: ' + armor.totalArmorCheckPenalty + '\r\n';

            if (armor.totalMaxDexterityBonus < 100)
                formattedArmor += prefix + '\t' + 'Max Dexterity Bonus: ' + armor.totalMaxDexterityBonus + '\r\n';

            return formattedArmor;
        }

        function formatWeapon(weapon, prefix) {
            var formattedWeapon = prefix + 'Weapon:' + '\r\n';

            formattedWeapon += prefix + '\t' + 'Size: ' + weapon.size + '\r\n';
            formattedWeapon += prefix + '\t' + 'Combat Types: ' + weapon.combatTypes.join(", ") + '\r\n';
            formattedWeapon += prefix + '\t' + 'Damage: ' + weapon.damage + '\r\n';
            formattedWeapon += prefix + '\t' + 'Damage Type: ' + weapon.damageType + '\r\n';
            formattedWeapon += prefix + '\t' + 'Threat Range: ' + weapon.threatRange + '\r\n';
            formattedWeapon += prefix + '\t' + 'Critical Multiplier: ' + weapon.criticalMultiplier + '\r\n';

            if (weapon.ammunition) {
                formattedWeapon += prefix + '\t' + 'Ammunition Used: ' + weapon.ammunition + '\r\n';
            }

            return formattedWeapon;
        }

        function formatList(list, title, prefix) {
            if (!list.length)
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
            if (!abilities.length)
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
            if (!intelligence.ego)
                return '';

            if (!prefix)
                prefix = '';

            var formattedIntelligence = prefix + 'Intelligent:\r\n';
            formattedIntelligence += prefix + '\tEgo: ' + intelligence.ego + '\r\n';
            formattedIntelligence += prefix + '\tIntelligence: ' + intelligence.intelligenceStat + '\r\n';
            formattedIntelligence += prefix + '\tWisdom: ' + intelligence.wisdomStat + '\r\n';
            formattedIntelligence += prefix + '\tCharisma: ' + intelligence.charismaStat + '\r\n';
            formattedIntelligence += prefix + '\tAlignment: ' + intelligence.alignment + '\r\n';
            formattedIntelligence += formatList(intelligence.communication, 'Communication', prefix + '\t');
            formattedIntelligence += formatList(intelligence.languages, 'Languages', prefix + '\t\t');
            formattedIntelligence += prefix + '\tSenses: ' + intelligence.senses + '\r\n';
            formattedIntelligence += formatList(intelligence.powers, 'Powers', prefix + '\t');

            if (intelligence.specialPurpose.length > 0) {
                formattedIntelligence += prefix + '\tSpecial Purpose: ' + intelligence.specialPurpose + '\r\n';
                formattedIntelligence += prefix + '\tDedicated Power: ' + intelligence.dedicatedPower + '\r\n';
            }

            if (intelligence.personality.length > -0)
                formattedIntelligence += prefix + '\tPersonality: ' + intelligence.personality + '\r\n';
            else
                formattedIntelligence += prefix + '\tPersonality: None\r\n';

            return formattedIntelligence;
        }
    };
})();
