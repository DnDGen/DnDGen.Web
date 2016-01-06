﻿(function () {
    'use strict';

    angular
        .module('app.shared')
        .factory('characterFormatterService', characterFormatterService);

    characterFormatterService.$inject = ['treasureFormatterService'];

    function characterFormatterService(treasureFormatterService) {
        return {
            formatCharacter: formatCharacter,
            formatSummary: formatSummary
        };

        function formatCharacter(character, leadership, cohort, followers) {
            var formattedCharacter = formatCharacterWithoutLeadership(character);

            if (leadership)
                formattedCharacter += '\n' + formatLeadership(leadership);

            if (cohort)
                formattedCharacter += '\nCohort:\n' + formatCharacterWithoutLeadership(cohort, '\t');

            if (followers.length > 0)
                formattedCharacter += '\nFollowers:\n';

            for (var i = 0; i < followers.length; i++) {
                formattedCharacter += '\n' + formatCharacterWithoutLeadership(followers[i], '\t');
            }

            return formattedCharacter;
        }

        function formatCharacterWithoutLeadership(character, prefix) {
            if (!character)
                return '';

            if (!prefix)
                prefix = '';

            var formattedCharacter = prefix + 'Alignment: ' + character.Alignment.Full + '\n';
            formattedCharacter += prefix + 'Level ' + character.Class.Level + ' ' + character.Class.ClassName + '\n';
            formattedCharacter += formatList(character.Class.SpecialistFields, 'Specialist', prefix + '\t');
            formattedCharacter += formatList(character.Class.ProhibitedFields, 'Prohibited', prefix + '\t');
            formattedCharacter += prefix;

            if (character.Race.Metarace.length > 0)
                formattedCharacter += character.Race.Metarace + ' ';

            formattedCharacter += character.Race.BaseRace + "\n";

            var gender = character.Race.Male ? "Male" : "Female";
            formattedCharacter += prefix + "\t" + gender + "\n";

            if (character.Race.MetaraceSpecies.length > 0)
                formattedCharacter += prefix + '\tMetarace Species: ' + character.Race.MetaraceSpecies + '\n';

            formattedCharacter += prefix + "\tLand Speed: " + character.Race.LandSpeed + "\n";
            formattedCharacter += prefix + "\tSize: " + character.Race.Size + "\n";

            if (character.Race.HasWings)
                formattedCharacter += prefix + "\tHas Wings\n";

            if (character.Race.AerialSpeed > 0)
                formattedCharacter += prefix + "\tAerial Speed: " + character.Race.AerialSpeed + "\n";

            formattedCharacter += formatStats(character.Ability.Stats, prefix);
            formattedCharacter += formatList(character.Ability.Languages, 'Languages', prefix);
            formattedCharacter += formatSkills(character.Ability.Skills, prefix);
            formattedCharacter += formatFeats(character.Ability.Feats, prefix);

            if (character.InterestingTrait.length > 0)
                formattedCharacter += prefix + 'Interesting Trait: ' + character.InterestingTrait + '\n';
            else
                formattedCharacter += prefix + 'Interesting Trait: None\n';

            if (character.Magic.Animal.length > 0)
                formattedCharacter += prefix + "Animal: " + character.Magic.Animal + "\n";

            if (character.Magic.ArcaneSpellFailure > 0)
                formattedCharacter += prefix + "Arcane Spell Failure: " + character.Magic.ArcaneSpellFailure + "%\n";

            formattedCharacter += formatSpellsPerDay(character.Magic.SpellsPerDay, prefix);

            formattedCharacter += prefix + "Equipment:\n";
            formattedCharacter += formatItem("Primary Hand", character.Equipment.PrimaryHand, prefix + '\t');
            formattedCharacter += formatOffHandItem(character.Equipment, prefix + '\t');
            formattedCharacter += formatItem("Armor", character.Equipment.Armor, prefix + '\t');
            formattedCharacter += formatTreasure(character.Equipment.Treasure, prefix + '\t');

            formattedCharacter += prefix + "Combat:\n";
            formattedCharacter += prefix + "\tAdjusted Dexterity Bonus: " + character.Combat.AdjustedDexterityBonus + "\n";
            formattedCharacter += formatArmorClass(character.Combat.ArmorClass, prefix);
            formattedCharacter += formatBaseAttack(character.Combat.BaseAttack, prefix);
            formattedCharacter += prefix + "\tHit Points: " + character.Combat.HitPoints + "\n";
            formattedCharacter += prefix + "\tInitiative Bonus: " + character.Combat.InitiativeBonus + "\n";
            formattedCharacter += prefix + "\tSaving Throws:\n";
            formattedCharacter += prefix + "\t\tFortitude: " + character.Combat.SavingThrows.Fortitude + "\n";
            formattedCharacter += prefix + "\t\tReflex: " + character.Combat.SavingThrows.Reflex + "\n";
            formattedCharacter += prefix + "\t\tWill: " + character.Combat.SavingThrows.Will + "\n";

            if (character.Combat.SavingThrows.CircumstantialBonus)
                formattedCharacter += "\t\tCircumstantial Bonus\n";

            return formattedCharacter;
        }

        function formatList(list, title, prefix) {
            if (list.length == 0)
                return '';

            if (!prefix)
                prefix = '';

            var formattedList = prefix + title + ':\n';
            
            for (var i = 0; i < list.length; i++) {
                formattedList += prefix + '\t' + list[i] + '\n';
            }

            return formattedList;
        }

        function formatStats(stats, prefix)
        {
            if (!prefix)
                prefix = '';

            var formattedStats = prefix + 'Stats:\n';
            formattedStats += prefix + "\tStrength: " + stats.Strength.Value + " (" + stats.Strength.Bonus + ")\n";
            formattedStats += prefix + "\tConstitution: " + stats.Constitution.Value + " (" + stats.Constitution.Bonus + ")\n";
            formattedStats += prefix + "\tDexterity: " + stats.Dexterity.Value + " (" + stats.Dexterity.Bonus + ")\n";
            formattedStats += prefix + "\tIntelligence: " + stats.Intelligence.Value + " (" + stats.Intelligence.Bonus + ")\n";
            formattedStats += prefix + "\tWisdom: " + stats.Wisdom.Value + " (" + stats.Wisdom.Bonus + ")\n";
            formattedStats += prefix + "\tCharisma: " + stats.Charisma.Value + " (" + stats.Charisma.Bonus + ")\n";

            return formattedStats;
        }

        function formatSkills(skills, prefix) {
            if (!prefix)
                prefix = '';

            var formattedSkills = prefix + 'Skills:\n';

            for (var skill in skills) {
                if (skills.hasOwnProperty(skill)) {
                    formattedSkills += prefix + '\t' + skill + '\n';
                    formattedSkills += prefix + '\t\tRanks: ' + skills[skill].EffectiveRanks + '\n';
                    formattedSkills += prefix + '\t\tStat Bonus: ' + skills[skill].BaseStat.Bonus + '\n';
                    formattedSkills += prefix + '\t\tOther Bonus: ' + skills[skill].Bonus + '\n';
                    formattedSkills += prefix + '\t\tArmor Check Penalty: ' + skills[skill].ArmorCheckPenalty + '\n';

                    if (skills[skill].ClassSkill)
                        formattedSkills += prefix + '\t\tClass Skill\n';

                    if (skills[skill].CircumstantialBonus)
                        formattedSkills += prefix + '\t\tCircumstantial Bonus\n';
                }
            }

            return formattedSkills;
        }

        function formatFeats(feats, prefix) {
            if (!prefix)
                prefix = '';

            var formattedFeats = prefix + 'Feats:\n';

            for (var i = 0; i < feats.length; i++) {
                var feat = feats[i];

                formattedFeats += prefix + '\t' + feat.Name + '\n';
                formattedFeats += formatList(feat.Foci, 'Foci', prefix + '\t\t');

                if (feat.Frequency.TimePeriod.length > 0) {
                    formattedFeats += prefix + '\t\tFrequency: ';

                    if (feat.Frequency.Quantity > 0) {
                        formattedFeats += feat.Frequency.Quantity + '/';
                    }

                    formattedFeats += feat.Frequency.TimePeriod + '\n';
                }

                if (feat.Strength > 0) {
                    formattedFeats += prefix + '\t\tPower: ' + feat.Strength + '\n';
                }
            }

            return formattedFeats;
        }

        function formatSpellsPerDay(spellsPerDay, prefix) {
            if (!prefix)
                prefix = '';

            if (spellsPerDay.length == 0)
                return '';

            var formattedSpellsPerDay = prefix + 'Spells Per Day:\n';

            for (var i = 0; i < spellsPerDay.length; i++) {
                formattedSpellsPerDay += prefix + "\tLevel " + spellsPerDay[i].Level + ": " + spellsPerDay[i].Quantity;

                if (spellsPerDay[i].HasDomainSpell)
                    formattedSpellsPerDay += " + 1";

                formattedSpellsPerDay += "\n";
            }

            return formattedSpellsPerDay;
        }

        function formatItem(title, item, prefix)
        {
            if (!prefix)
                prefix = '';

            if (!item)
                return prefix + title + ": None\n";

            var formattedItem = prefix + title + ":\n";
            formattedItem += treasureFormatterService.formatItem(item, prefix + "\t");

            return formattedItem;
        }

        function formatOffHandItem(equipment, prefix)
        {
            if (!prefix)
                prefix = '';

            if (!equipment.PrimaryHand)
                return formatItem("Off Hand", equipment.OffHand, prefix);

            if (equipment.PrimaryHand.Attributes.indexOf('Two-Handed') > -1)
                return prefix + "Off Hand: (Two-Handed)\n";

            return formatItem("Off Hand", equipment.OffHand, prefix);
        }

        function formatTreasure(treasure, prefix)
        {
            if (!prefix)
                prefix = '';

            if (treasure.Coin.Quantity == 0 && treasure.Goods.length == 0 && treasure.Items.length == 0)
                return prefix + "Treasure: None\n";

            var formattedTreasure = prefix + "Treasure:\n";
            formattedTreasure += treasureFormatterService.formatTreasure(treasure, prefix + "\t");

            return formattedTreasure;
        }

        function formatArmorClass(armorClass, prefix)
        {
            if (!prefix)
                prefix = '';

            var formattedArmorClass = prefix + "\tArmor Class: " + armorClass.Full;

            if (armorClass.CircumstantialBonus)
                formattedArmorClass += " *";

            formattedArmorClass += "\n";
            formattedArmorClass += prefix + "\t\tFlat-Footed: " + armorClass.FlatFooted + "\n";
            formattedArmorClass += prefix + "\t\tTouch: " + armorClass.Touch + "\n";

            return formattedArmorClass;
        }

        function formatBaseAttack(baseAttack, prefix)
        {
            if (!prefix)
                prefix = '';

            var formattedBonuses = baseAttack.AllBonuses.join("/+");
            var formattedBaseAttack = prefix + "\tBase Attack: +" + formattedBonuses;

            if (baseAttack.CircumstantialBonus)
                formattedBaseAttack += " *";

            return formattedBaseAttack + "\n";
        }

        function formatLeadership(leadership)
        {
            if (!leadership)
                return '';

            var formattedLeadership = "Leadership:\n";
            formattedLeadership += "\tScore: " + leadership.Score + "\n";
            formattedLeadership += formatList(leadership.LeadershipModifiers, 'Leadership Modifiers', "\t");

            return formattedLeadership;
        }

        function formatSummary(character) {
            var summary = character.Alignment.Full + " Level " + character.Class.Level + " ";

            if (character.Race.Metarace.length > 0)
                summary += character.Race.Metarace + " ";

            summary += character.Race.BaseRace + " " + character.Class.ClassName;

            return summary;
        }
    };
})();