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

            var formattedCharacter = prefix + character.Summary + ':\r\n';

            //Challenge Rating
            formattedCharacter += prefix + '\t' + 'Challenge Rating: ' + character.ChallengeRating + '\r\n';

            //Alignment
            formattedCharacter += prefix + '\t' + 'Alignment: ' + character.Alignment.Full + '\r\n';

            //Class
            formattedCharacter += prefix + '\t' + character.Class.Summary + '\r\n';
            formattedCharacter += formatList(character.Class.SpecialistFields, 'Specialist', prefix + '\t\t');
            formattedCharacter += formatList(character.Class.ProhibitedFields, 'Prohibited', prefix + '\t\t');

            //Race
            formattedCharacter += prefix + '\t' + character.Race.Summary + '\r\n';

            if (character.Race.MetaraceSpecies.length > 0)
                formattedCharacter += prefix + '\t\t' + 'Metarace Species: ' + character.Race.MetaraceSpecies + '\r\n';

            formattedCharacter += prefix + "\t\t" + "Land Speed: " + formatMeasurement(character.Race.LandSpeed) + "\r\n";

            if (character.Race.AerialSpeed.Value > 0)
                formattedCharacter += prefix + "\t\t" + "Aerial Speed: " + formatMeasurement(character.Race.AerialSpeed) + "\r\n";

            if (character.Race.SwimSpeed.Value > 0)
                formattedCharacter += prefix + "\t\t" + "Swim Speed: " + formatMeasurement(character.Race.SwimSpeed) + "\r\n";

            formattedCharacter += prefix + "\t\t" + "Size: " + character.Race.Size + "\r\n";
            formattedCharacter += prefix + "\t\t" + "Age: " + formatMeasurement(character.Race.Age) + "\r\n";
            formattedCharacter += prefix + "\t\t" + "Maximum Age: " + formatMeasurement(character.Race.MaximumAge) + "\r\n";
            formattedCharacter += prefix + "\t\t" + "Height: " + inchesToFeetFilter(character.Race.Height.Value);
            
            if (character.Race.Height.Description)
                formattedCharacter += " (" + character.Race.Height.Description + ")";
            
            formattedCharacter += "\r\n";
            formattedCharacter += prefix + "\t\t" + "Weight: " + formatMeasurement(character.Race.Weight) + "\r\n";

            if (character.Race.HasWings)
                formattedCharacter += prefix + "\t\t" + "Has Wings\r\n";

            //Abilities
            formattedCharacter += formatAbilities(character.Abilities, prefix + "\t");

            //Languages
            formattedCharacter += formatList(character.Languages, 'Languages', prefix + "\t");

            //Skills
            formattedCharacter += formatSkills(character.Skills, prefix + "\t");

            //Feats
            formattedCharacter += formatFeats(character.Feats, prefix + "\t");

            //Interesting Trait
            if (character.InterestingTrait.length > 0)
                formattedCharacter += prefix + "\t" + 'Interesting Trait: ' + character.InterestingTrait + '\r\n';
            else
                formattedCharacter += prefix + "\t" + 'Interesting Trait: None\r\n';

            //Magic
            formattedCharacter += formatSpellsPerDay(character.Magic.SpellsPerDay, prefix + "\t");
            formattedCharacter += formatSpells(character.Magic.KnownSpells, 'Known Spells', prefix + "\t");
            formattedCharacter += formatSpells(character.Magic.PreparedSpells, 'Prepared Spells', prefix + "\t");

            if (character.Magic.ArcaneSpellFailure > 0)
                formattedCharacter += prefix + "\t" + "Arcane Spell Failure: " + character.Magic.ArcaneSpellFailure + "%\r\n";

            if (character.Magic.Animal.length > 0)
                formattedCharacter += prefix + "\t" + "Animal: " + character.Magic.Animal + "\r\n";

            //Equipment
            formattedCharacter += prefix + "\t" + "Equipment:\r\n";
            formattedCharacter += formatItem("Primary Hand", character.Equipment.PrimaryHand, prefix + '\t\t');
            formattedCharacter += formatOffHandItem(character.Equipment, prefix + '\t\t');
            formattedCharacter += formatItem("Armor", character.Equipment.Armor, prefix + '\t\t');
            formattedCharacter += formatTreasure(character.Equipment.Treasure, prefix + '\t\t');

            //Combat
            formattedCharacter += prefix + "\t" + "Combat:\r\n";
            formattedCharacter += prefix + "\t\t" + "Adjusted Dexterity Bonus: " + character.Combat.AdjustedDexterityBonus + "\r\n";
            formattedCharacter += formatArmorClass(character.Combat.ArmorClass, prefix + "\t");
            formattedCharacter += formatBaseAttack(character.Combat.BaseAttack, prefix + "\t");
            formattedCharacter += prefix + "\t\t" + "Hit Points: " + character.Combat.HitPoints + "\r\n";
            formattedCharacter += prefix + "\t\t" + "Initiative Bonus: " + character.Combat.InitiativeBonus + "\r\n";
            formattedCharacter += prefix + "\t\t" + "Saving Throws:\r\n";

            if (character.Combat.SavingThrows.HasFortitudeSave)
                formattedCharacter += prefix + "\t\t\t" + "Fortitude: " + character.Combat.SavingThrows.Fortitude + "\r\n";

            formattedCharacter += prefix + "\t\t\t" + "Reflex: " + character.Combat.SavingThrows.Reflex + "\r\n";
            formattedCharacter += prefix + "\t\t\t" + "Will: " + character.Combat.SavingThrows.Will + "\r\n";

            if (character.Combat.SavingThrows.CircumstantialBonus)
                formattedCharacter += prefix + "\t\t\t" + "Circumstantial Bonus\r\n";

            return formattedCharacter;
        }

        function formatMeasurement(measurement) {
            var formattedMeasurement = measurement.Value + " " + measurement.Unit;

            if (measurement.Description)
                formattedMeasurement += " (" + measurement.Description + ")";

            return formattedMeasurement;
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

        function formatAbilities(abilities, prefix)
        {
            if (!prefix)
                prefix = '';

            var formattedAbilities = prefix + 'Abilities:\r\n';
            formattedAbilities += prefix + "\t" + "Strength: " + abilities.Strength.Value + " (" + abilities.Strength.Bonus + ")\r\n";

            if (abilities.Constitution)
                formattedAbilities += prefix + "\t" + "Constitution: " + abilities.Constitution.Value + " (" + abilities.Constitution.Bonus + ")\r\n";

            formattedAbilities += prefix + "\t" + "Dexterity: " + abilities.Dexterity.Value + " (" + abilities.Dexterity.Bonus + ")\r\n";
            formattedAbilities += prefix + "\t" + "Intelligence: " + abilities.Intelligence.Value + " (" + abilities.Intelligence.Bonus + ")\r\n";
            formattedAbilities += prefix + "\t" + "Wisdom: " + abilities.Wisdom.Value + " (" + abilities.Wisdom.Bonus + ")\r\n";
            formattedAbilities += prefix + "\t" + "Charisma: " + abilities.Charisma.Value + " (" + abilities.Charisma.Bonus + ")\r\n";

            return formattedAbilities;
        }

        function formatSkills(skills, prefix) {
            if (!prefix)
                prefix = '';

            var formattedSkills = prefix + 'Skills:\r\n';

            for (var i = 0; i < skills.length; i++) {
                var skill = skills[i];

                formattedSkills += prefix + '\t' + skill.Name;

                if (skill.Focus) {
                    formattedSkills += " (" + skill.Focus + ")";
                }

                formattedSkills += '\r\n';
                formattedSkills += prefix + '\t\t' + 'Total Bonus: ' + skill.TotalBonus;

                if (skill.CircumstantialBonus)
                    formattedSkills += " *";

                formattedSkills += '\r\n';

                formattedSkills += prefix + '\t\t' + 'Ranks: ' + skill.EffectiveRanks + '\r\n';
                formattedSkills += prefix + '\t\t' + 'Ability Bonus: ' + skill.BaseAbility.Bonus + '\r\n';
                formattedSkills += prefix + '\t\t' + 'Other Bonus: ' + skill.Bonus + '\r\n';
                formattedSkills += prefix + '\t\t' + 'Armor Check Penalty: ' + skill.ArmorCheckPenalty + '\r\n';

                if (skill.ClassSkill)
                    formattedSkills += prefix + '\t\t' + 'Class Skill\r\n';
            }

            return formattedSkills;
        }

        function formatFeats(feats, prefix) {
            if (!prefix)
                prefix = '';

            var formattedFeats = prefix + 'Feats:\r\n';

            if (feats.Racial.length) {
                formattedFeats += prefix + '\t' + 'Racial:\r\n';

                for (var i = 0; i < feats.Racial.length; i++) {
                    formattedFeats += formatFeat(feats.Racial[i], prefix + "\t\t");
                }
            }

            if (feats.Class.length) {
                formattedFeats += prefix + '\t' + 'Class:\r\n';

                for (var j = 0; j < feats.Class.length; j++) {
                    formattedFeats += formatFeat(feats.Class[j], prefix + "\t\t");
                }
            }

            formattedFeats += prefix + '\t' + 'Additional:\r\n';

            for (var k = 0; k < feats.Additional.length; k++) {
                formattedFeats += formatFeat(feats.Additional[k], prefix + "\t\t");
            }

            return formattedFeats;
        }

        function formatFeat(feat, prefix) {
            var formattedFeat = prefix + feat.Name + '\r\n';

            formattedFeat += formatList(feat.Foci, 'Foci', prefix + '\t');

            if (feat.Frequency.TimePeriod.length > 0) {
                formattedFeat += prefix + '\t' + 'Frequency: ';

                if (feat.Frequency.Quantity > 0) {
                    formattedFeat += feat.Frequency.Quantity + '/';
                }

                formattedFeat += feat.Frequency.TimePeriod + '\r\n';
            }

            if (feat.Power > 0) {
                formattedFeat += prefix + '\t' + 'Power: ' + feat.Power + '\r\n';
            }

            return formattedFeat;
        }

        function formatSpellsPerDay(spellsPerDay, prefix) {
            if (!prefix)
                prefix = '';

            if (spellsPerDay.length === 0)
                return '';

            var formattedSpellsPerDay = prefix + 'Spells Per Day:\r\n';

            for (var i = 0; i < spellsPerDay.length; i++) {
                formattedSpellsPerDay += prefix + '\t' + 'Level ' + spellsPerDay[i].Level + ": " + spellsPerDay[i].Quantity;

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

            if (!treasure.IsAny)
                return prefix + "Treasure: None\r\n";

            var formattedTreasure = prefix + "Treasure:\r\n";
            formattedTreasure += treasureFormatterService.formatTreasure(treasure, prefix + "\t");

            return formattedTreasure;
        }

        function formatArmorClass(armorClass, prefix)
        {
            if (!prefix)
                prefix = '';

            var formattedArmorClass = prefix + "\t" + "Armor Class: " + armorClass.Full;

            if (armorClass.CircumstantialBonus)
                formattedArmorClass += " *";

            formattedArmorClass += "\r\n";
            formattedArmorClass += prefix + "\t\t" + "Flat-Footed: " + armorClass.FlatFooted + "\r\n";
            formattedArmorClass += prefix + "\t\t" + "Touch: " + armorClass.Touch + "\r\n";

            return formattedArmorClass;
        }

        function formatBaseAttack(baseAttack, prefix)
        {
            if (!prefix)
                prefix = '';

            var formattedMeleeBonuses = formatBaseAttackBonuses(baseAttack.AllMeleeBonuses);
            var formattedRangedBonuses = formatBaseAttackBonuses(baseAttack.AllRangedBonuses);
            var formattedBaseAttack = prefix + "\t" + "Base Attack:\r\n";

            formattedBaseAttack += prefix + "\t\t" + "Melee: " + formattedMeleeBonuses;
            if (baseAttack.CircumstantialBonus)
                formattedBaseAttack += " *";

            formattedBaseAttack += '\r\n';

            formattedBaseAttack += prefix + "\t\t" + "Ranged: " + formattedRangedBonuses;
            if (baseAttack.CircumstantialBonus)
                formattedBaseAttack += " *";

            formattedBaseAttack += '\r\n';

            return formattedBaseAttack;
        }

        function formatBaseAttackBonuses(bonuses) {
            var formattedBonuses = '';

            for (var i = 0; i < bonuses.length; i++) {
                if (bonuses[i] > -1)
                    formattedBonuses += '+';

                formattedBonuses += bonuses[i];

                if (i < bonuses.length - 1)
                    formattedBonuses += '/';
            }

            return formattedBonuses;
        }

        function formatLeadership(leadership, prefix)
        {
            if (!leadership)
                return '';

            if (!prefix)
                prefix = '';

            var formattedLeadership = prefix + "Leadership:\r\n";
            formattedLeadership += prefix + "\t" + "Score: " + leadership.Score + "\r\n";
            formattedLeadership += formatList(leadership.LeadershipModifiers, 'Leadership Modifiers', prefix + "\t");

            return formattedLeadership;
        }
    };
})();
