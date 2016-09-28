(function () {
    'use strict';

    angular
        .module('app.character')
        .factory('characterFormatterService', characterFormatterService);

    characterFormatterService.$inject = ['treasureFormatterService', 'inchesToFeetFilter'];

    function characterFormatterService(treasureFormatterService, inchesToFeetFilter) {
        return {
            formatCharacter: formatCharacter
        };

        function formatCharacter(character, leadership, cohort, followers, prefix) {
            if (!prefix)
                prefix = '';

            var formattedCharacter = formatCharacterWithoutLeadership(character, prefix);

            if (leadership) {
                formattedCharacter += '\r\n';
                formattedCharacter += formatLeadership(leadership, prefix);
            }

            if (cohort) {
                formattedCharacter += '\r\n';
                formattedCharacter += prefix + 'Cohort:\r\n';
                formattedCharacter += formatCharacterWithoutLeadership(cohort, prefix + '\t');
            }

            if (followers && followers.length > 0) {
                formattedCharacter += '\r\n';
                formattedCharacter += prefix + 'Followers:\r\n';

                for (var i = 0; i < followers.length; i++) {
                    formattedCharacter += '\r\n';
                    formattedCharacter += formatCharacterWithoutLeadership(followers[i], prefix + '\t');
                }
            }

            return formattedCharacter;
        }

        function formatCharacterWithoutLeadership(character, prefix) {
            if (!character)
                return '';

            if (!prefix)
                prefix = '';

            var formattedCharacter = prefix + 'Alignment: ' + character.Alignment.Full + '\r\n';
            formattedCharacter += prefix + 'Level ' + character.Class.Level + ' ' + character.Class.Name + '\r\n';
            formattedCharacter += formatList(character.Class.SpecialistFields, 'Specialist', prefix + '\t');
            formattedCharacter += formatList(character.Class.ProhibitedFields, 'Prohibited', prefix + '\t');
            formattedCharacter += prefix;

            if (character.Race.Metarace.length > 0)
                formattedCharacter += character.Race.Metarace + ' ';

            formattedCharacter += character.Race.BaseRace + "\r\n";

            formattedCharacter += prefix + "\t" + character.Race.Gender + "\r\n";

            if (character.Race.MetaraceSpecies.length > 0)
                formattedCharacter += prefix + '\tMetarace Species: ' + character.Race.MetaraceSpecies + '\r\n';

            formattedCharacter += prefix + "\tLand Speed: " + character.Race.LandSpeed + "\r\n";
            formattedCharacter += prefix + "\tSize: " + character.Race.Size + "\r\n";
            formattedCharacter += prefix + "\tAge: " + character.Race.Age.Years + " (" + character.Race.Age.Stage + ")\r\n";
            formattedCharacter += prefix + "\tHeight: " + inchesToFeetFilter(character.Race.HeightInInches) + "\r\n";
            formattedCharacter += prefix + "\tWeight: " + character.Race.WeightInPounds + " lbs.\r\n";

            if (character.Race.HasWings)
                formattedCharacter += prefix + "\tHas Wings\r\n";

            if (character.Race.AerialSpeed > 0)
                formattedCharacter += prefix + "\tAerial Speed: " + character.Race.AerialSpeed + "\r\n";

            formattedCharacter += formatStats(character.Ability.Stats, prefix);
            formattedCharacter += formatList(character.Ability.Languages, 'Languages', prefix);
            formattedCharacter += formatSkills(character.Ability.Skills, prefix);
            formattedCharacter += formatFeats(character.Ability.Feats, prefix);

            if (character.InterestingTrait.length > 0)
                formattedCharacter += prefix + 'Interesting Trait: ' + character.InterestingTrait + '\r\n';
            else
                formattedCharacter += prefix + 'Interesting Trait: None\r\n';

            formattedCharacter += formatSpellsPerDay(character.Magic.SpellsPerDay, prefix);
            formattedCharacter += formatSpells(character.Magic.KnownSpells, 'Known Spells', prefix);
            formattedCharacter += formatSpells(character.Magic.PreparedSpells, 'Prepared Spells', prefix);

            if (character.Magic.ArcaneSpellFailure > 0)
                formattedCharacter += prefix + "Arcane Spell Failure: " + character.Magic.ArcaneSpellFailure + "%\r\n";

            if (character.Magic.Animal.length > 0)
                formattedCharacter += prefix + "Animal: " + character.Magic.Animal + "\r\n";

            formattedCharacter += prefix + "Equipment:\r\n";
            formattedCharacter += formatItem("Primary Hand", character.Equipment.PrimaryHand, prefix + '\t');
            formattedCharacter += formatOffHandItem(character.Equipment, prefix + '\t');
            formattedCharacter += formatItem("Armor", character.Equipment.Armor, prefix + '\t');
            formattedCharacter += formatTreasure(character.Equipment.Treasure, prefix + '\t');

            formattedCharacter += prefix + "Combat:\r\n";
            formattedCharacter += prefix + "\tAdjusted Dexterity Bonus: " + character.Combat.AdjustedDexterityBonus + "\r\n";
            formattedCharacter += formatArmorClass(character.Combat.ArmorClass, prefix);
            formattedCharacter += formatBaseAttack(character.Combat.BaseAttack, prefix);
            formattedCharacter += prefix + "\tHit Points: " + character.Combat.HitPoints + "\r\n";
            formattedCharacter += prefix + "\tInitiative Bonus: " + character.Combat.InitiativeBonus + "\r\n";
            formattedCharacter += prefix + "\tSaving Throws:\r\n";
            formattedCharacter += prefix + "\t\tFortitude: " + character.Combat.SavingThrows.Fortitude + "\r\n";
            formattedCharacter += prefix + "\t\tReflex: " + character.Combat.SavingThrows.Reflex + "\r\n";
            formattedCharacter += prefix + "\t\tWill: " + character.Combat.SavingThrows.Will + "\r\n";

            if (character.Combat.SavingThrows.CircumstantialBonus)
                formattedCharacter += prefix + "\t\tCircumstantial Bonus\r\n";

            return formattedCharacter;
        }

        function formatList(list, title, prefix) {
            if (list.length === 0)
                return '';

            if (!prefix)
                prefix = '';

            var formattedList = prefix + title + ':\r\n';
            
            for (var i = 0; i < list.length; i++) {
                formattedList += prefix + '\t' + list[i] + '\r\n';
            }

            return formattedList;
        }

        function formatStats(stats, prefix)
        {
            if (!prefix)
                prefix = '';

            var formattedStats = prefix + 'Stats:\r\n';
            formattedStats += prefix + "\tStrength: " + stats.Strength.Value + " (" + stats.Strength.Bonus + ")\r\n";
            formattedStats += prefix + "\tConstitution: " + stats.Constitution.Value + " (" + stats.Constitution.Bonus + ")\r\n";
            formattedStats += prefix + "\tDexterity: " + stats.Dexterity.Value + " (" + stats.Dexterity.Bonus + ")\r\n";
            formattedStats += prefix + "\tIntelligence: " + stats.Intelligence.Value + " (" + stats.Intelligence.Bonus + ")\r\n";
            formattedStats += prefix + "\tWisdom: " + stats.Wisdom.Value + " (" + stats.Wisdom.Bonus + ")\r\n";
            formattedStats += prefix + "\tCharisma: " + stats.Charisma.Value + " (" + stats.Charisma.Bonus + ")\r\n";

            return formattedStats;
        }

        function formatSkills(skills, prefix) {
            if (!prefix)
                prefix = '';

            var formattedSkills = prefix + 'Skills:\r\n';

            for (var skill in skills) {
                if (skills.hasOwnProperty(skill)) {
                    formattedSkills += prefix + '\t' + skill + '\r\n';
                    formattedSkills += prefix + '\t\tRanks: ' + skills[skill].EffectiveRanks + '\r\n';
                    formattedSkills += prefix + '\t\tStat Bonus: ' + skills[skill].BaseStat.Bonus + '\r\n';
                    formattedSkills += prefix + '\t\tOther Bonus: ' + skills[skill].Bonus + '\r\n';
                    formattedSkills += prefix + '\t\tArmor Check Penalty: ' + skills[skill].ArmorCheckPenalty + '\r\n';

                    if (skills[skill].ClassSkill)
                        formattedSkills += prefix + '\t\tClass Skill\r\n';

                    if (skills[skill].CircumstantialBonus)
                        formattedSkills += prefix + '\t\tCircumstantial Bonus\r\n';
                }
            }

            return formattedSkills;
        }

        function formatFeats(feats, prefix) {
            if (!prefix)
                prefix = '';

            var formattedFeats = prefix + 'Feats:\r\n';

            for (var i = 0; i < feats.length; i++) {
                var feat = feats[i];

                formattedFeats += prefix + '\t' + feat.Name + '\r\n';
                formattedFeats += formatList(feat.Foci, 'Foci', prefix + '\t\t');

                if (feat.Frequency.TimePeriod.length > 0) {
                    formattedFeats += prefix + '\t\tFrequency: ';

                    if (feat.Frequency.Quantity > 0) {
                        formattedFeats += feat.Frequency.Quantity + '/';
                    }

                    formattedFeats += feat.Frequency.TimePeriod + '\r\n';
                }

                if (feat.Power > 0) {
                    formattedFeats += prefix + '\t\tPower: ' + feat.Power + '\r\n';
                }
            }

            return formattedFeats;
        }

        function formatSpellsPerDay(spellsPerDay, prefix) {
            if (!prefix)
                prefix = '';

            if (spellsPerDay.length === 0)
                return '';

            var formattedSpellsPerDay = prefix + 'Spells Per Day:\r\n';

            for (var i = 0; i < spellsPerDay.length; i++) {
                formattedSpellsPerDay += prefix + "\tLevel " + spellsPerDay[i].Level + ": " + spellsPerDay[i].Quantity;

                if (spellsPerDay[i].HasDomainSpell)
                    formattedSpellsPerDay += " + 1";

                formattedSpellsPerDay += "\r\n";
            }

            return formattedSpellsPerDay;
        }

        function formatSpells(spells, title, prefix) {
            if (!prefix)
                prefix = '';

            if (spells.length === 0)
                return '';

            var formattedSpells = prefix + title + ':\r\n';

            for (var i = 0; i < spells.length; i++) {
                formattedSpells += prefix + '\t' + spells[i].Name + " (" + spells[i].Level + ")\r\n";
            }

            return formattedSpells;
        }

        function formatItem(title, item, prefix)
        {
            if (!prefix)
                prefix = '';

            if (!item)
                return prefix + title + ": None\r\n";

            var formattedItem = prefix + title + ":\r\n";
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
                return prefix + "Off Hand: (Two-Handed)\r\n";

            return formatItem("Off Hand", equipment.OffHand, prefix);
        }

        function formatTreasure(treasure, prefix)
        {
            if (!prefix)
                prefix = '';

            if (treasure.IsAny == false)
                return prefix + "Treasure: None\r\n";

            var formattedTreasure = prefix + "Treasure:\r\n";
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

            formattedArmorClass += "\r\n";
            formattedArmorClass += prefix + "\t\tFlat-Footed: " + armorClass.FlatFooted + "\r\n";
            formattedArmorClass += prefix + "\t\tTouch: " + armorClass.Touch + "\r\n";

            return formattedArmorClass;
        }

        function formatBaseAttack(baseAttack, prefix)
        {
            if (!prefix)
                prefix = '';

            var formattedMeleeBonuses = baseAttack.AllMeleeBonuses.join("/+");
            var formattedRangedBonuses = baseAttack.AllRangedBonuses.join("/+");
            var formattedBaseAttack = prefix + "\tBase Attack:\r\n";

            formattedBaseAttack += prefix + "\t\tMelee: +" + formattedMeleeBonuses;
            if (baseAttack.CircumstantialBonus)
                formattedBaseAttack += " *";

            formattedBaseAttack += '\r\n';

            formattedBaseAttack += prefix + "\t\tRanged: +" + formattedRangedBonuses;
            if (baseAttack.CircumstantialBonus)
                formattedBaseAttack += " *";

            formattedBaseAttack += '\r\n';

            return formattedBaseAttack;
        }

        function formatLeadership(leadership, prefix)
        {
            if (!leadership)
                return '';

            if (!prefix)
                prefix = '';

            var formattedLeadership = prefix + "Leadership:\r\n";
            formattedLeadership += prefix + "\tScore: " + leadership.Score + "\r\n";
            formattedLeadership += formatList(leadership.LeadershipModifiers, 'Leadership Modifiers', prefix + "\t");

            return formattedLeadership;
        }
    };
})();
