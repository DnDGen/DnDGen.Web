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

            var formattedCharacter = prefix + character.summary + ':\r\n';

            //Challenge Rating
            formattedCharacter += prefix + '\t' + 'Challenge Rating: ' + character.challengeRating + '\r\n';

            //Alignment
            formattedCharacter += prefix + '\t' + 'Alignment: ' + character.alignment.full + '\r\n';

            //Class
            formattedCharacter += prefix + '\t' + character.class.summary + '\r\n';
            formattedCharacter += formatList(character.class.specialistFields, 'Specialist', prefix + '\t\t');
            formattedCharacter += formatList(character.class.prohibitedFields, 'Prohibited', prefix + '\t\t');

            //Race
            formattedCharacter += prefix + '\t' + character.race.summary + '\r\n';

            if (character.race.metaraceSpecies.length > 0)
                formattedCharacter += prefix + '\t\t' + 'Metarace Species: ' + character.race.metaraceSpecies + '\r\n';

            formattedCharacter += prefix + "\t\t" + "Land Speed: " + formatMeasurement(character.race.landSpeed) + "\r\n";

            if (character.race.aerialSpeed.value > 0)
                formattedCharacter += prefix + "\t\t" + "Aerial Speed: " + formatMeasurement(character.race.aerialSpeed) + "\r\n";

            if (character.race.swimSpeed.value > 0)
                formattedCharacter += prefix + "\t\t" + "Swim Speed: " + formatMeasurement(character.race.swimSpeed) + "\r\n";

            formattedCharacter += prefix + "\t\t" + "Size: " + character.race.size + "\r\n";
            formattedCharacter += prefix + "\t\t" + "Age: " + formatMeasurement(character.race.age) + "\r\n";
            formattedCharacter += prefix + "\t\t" + "Maximum Age: " + formatMeasurement(character.race.maximumAge) + "\r\n";
            formattedCharacter += prefix + "\t\t" + "Height: " + inchesToFeetFilter(character.race.height.value);
            
            if (character.race.height.description)
                formattedCharacter += " (" + character.race.height.description + ")";
            
            formattedCharacter += "\r\n";
            formattedCharacter += prefix + "\t\t" + "Weight: " + formatMeasurement(character.race.weight) + "\r\n";

            if (character.race.hasWings)
                formattedCharacter += prefix + "\t\t" + "Has Wings\r\n";

            //Abilities
            formattedCharacter += formatAbilities(character.abilities, prefix + "\t");

            //Languages
            formattedCharacter += formatList(character.languages, 'Languages', prefix + "\t");

            //Skills
            formattedCharacter += formatSkills(character.skills, prefix + "\t");

            //Feats
            formattedCharacter += formatFeats(character.feats, prefix + "\t");

            //Interesting Trait
            if (character.interestingTrait.length > 0)
                formattedCharacter += prefix + "\t" + 'Interesting Trait: ' + character.interestingTrait + '\r\n';
            else
                formattedCharacter += prefix + "\t" + 'Interesting Trait: None\r\n';

            //Magic
            formattedCharacter += formatSpellsPerDay(character.magic.spellsPerDay, prefix + "\t");
            formattedCharacter += formatSpells(character.magic.knownSpells, 'Known Spells', prefix + "\t");
            formattedCharacter += formatSpells(character.magic.preparedSpells, 'Prepared Spells', prefix + "\t");

            if (character.magic.arcaneSpellFailure > 0)
                formattedCharacter += prefix + "\t" + "Arcane Spell Failure: " + character.magic.arcaneSpellFailure + "%\r\n";

            if (character.magic.animal.length > 0)
                formattedCharacter += prefix + "\t" + "Animal: " + character.magic.animal + "\r\n";

            //Equipment
            formattedCharacter += prefix + "\t" + "Equipment:\r\n";
            formattedCharacter += formatItem("Primary Hand", character.equipment.primaryHand, prefix + '\t\t');
            formattedCharacter += formatOffHandItem(character.equipment, prefix + '\t\t');
            formattedCharacter += formatItem("Armor", character.equipment.armor, prefix + '\t\t');
            formattedCharacter += formatTreasure(character.equipment.treasure, prefix + '\t\t');

            //Combat
            formattedCharacter += prefix + "\t" + "Combat:\r\n";
            formattedCharacter += prefix + "\t\t" + "Adjusted Dexterity Bonus: " + character.combat.adjustedDexterityBonus + "\r\n";
            formattedCharacter += formatArmorClass(character.combat.armorClass, prefix + "\t");
            formattedCharacter += formatBaseAttack(character.combat.baseAttack, prefix + "\t");
            formattedCharacter += prefix + "\t\t" + "Hit Points: " + character.combat.hitPoints + "\r\n";
            formattedCharacter += prefix + "\t\t" + "Initiative Bonus: " + character.combat.initiativeBonus + "\r\n";
            formattedCharacter += prefix + "\t\t" + "Saving Throws:\r\n";

            if (character.combat.savingThrows.hasFortitudeSave)
                formattedCharacter += prefix + "\t\t\t" + "Fortitude: " + character.combat.savingThrows.fortitude + "\r\n";

            formattedCharacter += prefix + "\t\t\t" + "Reflex: " + character.combat.savingThrows.reflex + "\r\n";
            formattedCharacter += prefix + "\t\t\t" + "Will: " + character.combat.savingThrows.will + "\r\n";

            if (character.combat.savingThrows.circumstantialBonus)
                formattedCharacter += prefix + "\t\t\t" + "Circumstantial Bonus\r\n";

            return formattedCharacter;
        }

        function formatMeasurement(measurement) {
            var formattedMeasurement = measurement.value + " " + measurement.unit;

            if (measurement.description)
                formattedMeasurement += " (" + measurement.description + ")";

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
            formattedAbilities += prefix + "\t" + "Strength: " + abilities.strength.value + " (" + abilities.strength.bonus + ")\r\n";

            if (abilities.constitution)
                formattedAbilities += prefix + "\t" + "Constitution: " + abilities.constitution.value + " (" + abilities.constitution.bonus + ")\r\n";

            formattedAbilities += prefix + "\t" + "Dexterity: " + abilities.dexterity.value + " (" + abilities.dexterity.bonus + ")\r\n";
            formattedAbilities += prefix + "\t" + "Intelligence: " + abilities.intelligence.value + " (" + abilities.intelligence.bonus + ")\r\n";
            formattedAbilities += prefix + "\t" + "Wisdom: " + abilities.wisdom.value + " (" + abilities.wisdom.bonus + ")\r\n";
            formattedAbilities += prefix + "\t" + "Charisma: " + abilities.charisma.value + " (" + abilities.charisma.bonus + ")\r\n";

            return formattedAbilities;
        }

        function formatSkills(skills, prefix) {
            if (!prefix)
                prefix = '';

            var formattedSkills = prefix + 'Skills:\r\n';

            for (var i = 0; i < skills.length; i++) {
                var skill = skills[i];

                formattedSkills += prefix + '\t' + skill.name;

                if (skill.focus) {
                    formattedSkills += " (" + skill.focus + ")";
                }

                formattedSkills += '\r\n';
                formattedSkills += prefix + '\t\t' + 'Total Bonus: ' + skill.totalBonus;

                if (skill.circumstantialBonus)
                    formattedSkills += " *";

                formattedSkills += '\r\n';

                formattedSkills += prefix + '\t\t' + 'Ranks: ' + skill.effectiveRanks + '\r\n';
                formattedSkills += prefix + '\t\t' + 'Ability Bonus: ' + skill.baseAbility.bonus + '\r\n';
                formattedSkills += prefix + '\t\t' + 'Other Bonus: ' + skill.bonus + '\r\n';
                formattedSkills += prefix + '\t\t' + 'Armor Check Penalty: ' + skill.armorCheckPenalty + '\r\n';

                if (skill.classSkill)
                    formattedSkills += prefix + '\t\t' + 'Class Skill\r\n';
            }

            return formattedSkills;
        }

        function formatFeats(feats, prefix) {
            if (!prefix)
                prefix = '';

            var formattedFeats = prefix + 'Feats:\r\n';

            if (feats.racial.length) {
                formattedFeats += prefix + '\t' + 'Racial:\r\n';

                for (var i = 0; i < feats.racial.length; i++) {
                    formattedFeats += formatFeat(feats.racial[i], prefix + "\t\t");
                }
            }

            if (feats.class.length) {
                formattedFeats += prefix + '\t' + 'Class:\r\n';

                for (var j = 0; j < feats.class.length; j++) {
                    formattedFeats += formatFeat(feats.class[j], prefix + "\t\t");
                }
            }

            formattedFeats += prefix + '\t' + 'Additional:\r\n';

            for (var k = 0; k < feats.additional.length; k++) {
                formattedFeats += formatFeat(feats.additional[k], prefix + "\t\t");
            }

            return formattedFeats;
        }

        function formatFeat(feat, prefix) {
            var formattedFeat = prefix + feat.name + '\r\n';

            formattedFeat += formatList(feat.foci, 'Foci', prefix + '\t');

            if (feat.frequency.timePeriod.length > 0) {
                formattedFeat += prefix + '\t' + 'Frequency: ';

                if (feat.frequency.quantity > 0) {
                    formattedFeat += feat.frequency.quantity + '/';
                }

                formattedFeat += feat.frequency.timePeriod + '\r\n';
            }

            if (feat.power > 0) {
                formattedFeat += prefix + '\t' + 'Power: ' + feat.power + '\r\n';
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
                formattedSpellsPerDay += prefix + '\t' + 'Level ' + spellsPerDay[i].level + ": " + spellsPerDay[i].quantity;

                if (spellsPerDay[i].hasDomainSpell)
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
                formattedSpells += prefix + '\t' + spells[i].name + " (" + spells[i].level + ")\r\n";
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

            if (!equipment.primaryHand)
                return formatItem("Off Hand", equipment.offHand, prefix);

            if (equipment.primaryHand.attributes.indexOf('Two-Handed') > -1)
                return prefix + "Off Hand: (Two-Handed)\r\n";

            return formatItem("Off Hand", equipment.offHand, prefix);
        }

        function formatTreasure(treasure, prefix)
        {
            if (!prefix)
                prefix = '';

            if (!treasure.isAny)
                return prefix + "Treasure: None\r\n";

            var formattedTreasure = prefix + "Treasure:\r\n";
            formattedTreasure += treasureFormatterService.formatTreasure(treasure, prefix + "\t");

            return formattedTreasure;
        }

        function formatArmorClass(armorClass, prefix)
        {
            if (!prefix)
                prefix = '';

            var formattedArmorClass = prefix + "\t" + "Armor Class: " + armorClass.full;

            if (armorClass.circumstantialBonus)
                formattedArmorClass += " *";

            formattedArmorClass += "\r\n";
            formattedArmorClass += prefix + "\t\t" + "Flat-Footed: " + armorClass.flatFooted + "\r\n";
            formattedArmorClass += prefix + "\t\t" + "Touch: " + armorClass.touch + "\r\n";

            return formattedArmorClass;
        }

        function formatBaseAttack(baseAttack, prefix)
        {
            if (!prefix)
                prefix = '';

            var formattedMeleeBonuses = formatBaseAttackBonuses(baseAttack.allMeleeBonuses);
            var formattedRangedBonuses = formatBaseAttackBonuses(baseAttack.allRangedBonuses);
            var formattedBaseAttack = prefix + "\t" + "Base Attack:\r\n";

            formattedBaseAttack += prefix + "\t\t" + "Melee: " + formattedMeleeBonuses;
            if (baseAttack.circumstantialBonus)
                formattedBaseAttack += " *";

            formattedBaseAttack += '\r\n';

            formattedBaseAttack += prefix + "\t\t" + "Ranged: " + formattedRangedBonuses;
            if (baseAttack.circumstantialBonus)
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
            formattedLeadership += prefix + "\t" + "Score: " + leadership.score + "\r\n";
            formattedLeadership += formatList(leadership.leadershipModifiers, 'Leadership Modifiers', prefix + "\t");

            return formattedLeadership;
        }
    };
})();
