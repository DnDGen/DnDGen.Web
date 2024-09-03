import { Pipe, PipeTransform } from '@angular/core';
import { TreasurePipe } from "../../treasure/pipes/treasure.pipe";
import { Character } from '../models/character.model';
import { Leadership } from '../models/leadership.model';
import { Measurement } from '../models/measurement.model';
import { InchesToFeetPipe } from '../../shared/pipes/inchesToFeet.pipe'
import { Skill } from '../models/skill.model';
import { Feat } from '../models/feat.model';
import { FeatCollection } from '../models/featCollection.model';
import { SpellQuantity } from '../models/spellQuantity.model';
import { Spell } from '../models/spell.model';
import { Item } from '../../treasure/models/item.model';
import { Equipment } from '../models/equipment.model';
import { Treasure } from '../../treasure/models/treasure.model';
import { ArmorClass } from '../models/armorClass.model';
import { BaseAttack } from '../models/baseAttack.model';
import { Abilities } from '../models/abilities.model';
import { Armor } from '../../treasure/models/armor.model';
import { Weapon } from '../../treasure/models/weapon.model';
import { SpellGroupService } from '../services/spellGroup.service';
import { ItemPipe } from '../../treasure/pipes/item.pipe';
import { MeasurementPipe } from '../../shared/pipes/measurement.pipe';
import { BonusPipe } from '../../shared/pipes/bonus.pipe';
import { BonusesPipe } from '../../shared/pipes/bonuses.pipe';

@Pipe({ name: 'character' })
export class CharacterPipe implements PipeTransform {
    constructor(
        private itemPipe: ItemPipe,
        private treasurePipe: TreasurePipe,
        private bonusPipe: BonusPipe,
        private bonusesPipe: BonusesPipe,
        private measurementPipe: MeasurementPipe,
        private spellGroupService: SpellGroupService) { }

    transform(value: Character, prefix?: string): string {
        return this.formatCharacter(value, prefix);
    }

    private formatCharacter(character: Character, prefix?: string): string {
        if (!character)
            return '';

        if (!prefix)
            prefix = '';

        var formattedCharacter = prefix + character.summary + ':\r\n';

        //Combat
        formattedCharacter += prefix + "\t" + "Combat:\r\n";
        formattedCharacter += prefix + "\t\t" + "Adjusted Dexterity Bonus: " + this.bonusPipe.transform(character.combat.adjustedDexterityBonus) + "\r\n";
        formattedCharacter += this.formatArmorClass(character.combat.armorClass, prefix + "\t");
        formattedCharacter += this.formatBaseAttack(character.combat.baseAttack, prefix + "\t");
        formattedCharacter += prefix + "\t\t" + "Hit Points: " + character.combat.hitPoints + "\r\n";
        formattedCharacter += prefix + "\t\t" + "Initiative Bonus: " + this.bonusPipe.transform(character.combat.initiativeBonus) + "\r\n";
        formattedCharacter += prefix + "\t\t" + "Saving Throws:\r\n";

        if (character.combat.savingThrows.hasFortitudeSave)
            formattedCharacter += prefix + "\t\t\t" + "Fortitude: " + this.bonusPipe.transform(character.combat.savingThrows.fortitude) + "\r\n";

        formattedCharacter += prefix + "\t\t\t" + "Reflex: " + this.bonusPipe.transform(character.combat.savingThrows.reflex) + "\r\n";
        formattedCharacter += prefix + "\t\t\t" + "Will: " + this.bonusPipe.transform(character.combat.savingThrows.will) + "\r\n";

        if (character.combat.savingThrows.circumstantialBonus)
            formattedCharacter += prefix + "\t\t\t" + "Circumstantial Bonus\r\n";

        //Challenge Rating
        formattedCharacter += prefix + '\t' + 'Challenge Rating: ' + character.challengeRating + '\r\n';

        //Alignment
        formattedCharacter += prefix + '\t' + 'Alignment: ' + character.alignment.full + '\r\n';

        //Class
        formattedCharacter += prefix + '\t' + character['class'].summary + '\r\n';
        formattedCharacter += this.formatList(character['class'].specialistFields, 'Specialist', prefix + '\t\t');
        formattedCharacter += this.formatList(character['class'].prohibitedFields, 'Prohibited', prefix + '\t\t');

        //Race
        formattedCharacter += prefix + '\t' + character.race.summary + '\r\n';

        if (character.race.metaraceSpecies.length > 0)
            formattedCharacter += prefix + '\t\t' + 'Metarace Species: ' + character.race.metaraceSpecies + '\r\n';

        formattedCharacter += prefix + "\t\t" + "Land Speed: " + this.measurementPipe.transform(character.race.landSpeed) + "\r\n";

        if (character.race.aerialSpeed.value > 0)
            formattedCharacter += prefix + "\t\t" + "Aerial Speed: " + this.measurementPipe.transform(character.race.aerialSpeed) + "\r\n";

        if (character.race.swimSpeed.value > 0)
            formattedCharacter += prefix + "\t\t" + "Swim Speed: " + this.measurementPipe.transform(character.race.swimSpeed) + "\r\n";

        formattedCharacter += prefix + "\t\t" + "Size: " + character.race.size + "\r\n";
        formattedCharacter += prefix + "\t\t" + "Age: " + this.measurementPipe.transform(character.race.age) + "\r\n";
        formattedCharacter += prefix + "\t\t" + "Maximum Age: " + this.measurementPipe.transform(character.race.maximumAge) + "\r\n";
        formattedCharacter += prefix + "\t\t" + "Height: " + this.measurementPipe.transform(character.race.height) + "\r\n";
        formattedCharacter += prefix + "\t\t" + "Weight: " + this.measurementPipe.transform(character.race.weight) + "\r\n";

        if (character.race.hasWings)
            formattedCharacter += prefix + "\t\t" + "Has Wings\r\n";

        //Abilities
        formattedCharacter += this.formatAbilities(character.abilities, prefix + "\t");

        //Languages
        formattedCharacter += this.formatList(character.languages, 'Languages', prefix + "\t");

        //Skills
        formattedCharacter += this.formatSkills(character.skills, prefix + "\t");

        //Feats
        formattedCharacter += this.formatFeats(character.feats, prefix + "\t");

        //Interesting Trait
        if (character.interestingTrait.length > 0)
            formattedCharacter += prefix + "\t" + 'Interesting Trait: ' + character.interestingTrait + '\r\n';
        else
            formattedCharacter += prefix + "\t" + 'Interesting Trait: None\r\n';

        //Magic
        formattedCharacter += this.formatSpellsPerDay(character.magic.spellsPerDay, prefix + "\t");
        formattedCharacter += this.formatSpells(character.magic.knownSpells, 'Known Spells', prefix + "\t");
        formattedCharacter += this.formatSpells(character.magic.preparedSpells, 'Prepared Spells', prefix + "\t");

        if (character.magic.arcaneSpellFailure > 0)
            formattedCharacter += prefix + "\t" + "Arcane Spell Failure: " + character.magic.arcaneSpellFailure + "%\r\n";

        if (character.magic.animal.length > 0)
            formattedCharacter += prefix + "\t" + "Animal: " + character.magic.animal + "\r\n";

        //Equipment
        formattedCharacter += prefix + "\t" + "Equipment:\r\n";
        formattedCharacter += this.formatItem("Primary Hand", character.equipment.primaryHand, prefix + '\t\t');
        formattedCharacter += this.formatOffHandItem(character.equipment, prefix + '\t\t');
        formattedCharacter += this.formatItem("Armor", character.equipment.armor, prefix + '\t\t');
        formattedCharacter += this.formatTreasure(character.equipment.treasure, prefix + '\t\t');

        return formattedCharacter;
    }

    private formatList(list: string[], title: string, prefix: string): string {
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

    private formatAbilities(abilities: Abilities, prefix: string): string {
        if (!prefix)
        prefix = '';

        var formattedAbilities = prefix + 'Abilities:\r\n';

        formattedAbilities += prefix + "\t" + "Strength: " + abilities.Strength.value + " (" + abilities.Strength.bonus + ")\r\n";

        if (abilities.Constitution)
        formattedAbilities += prefix + "\t" + "Constitution: " + abilities.Constitution.value + " (" + abilities.Constitution.bonus + ")\r\n";

        formattedAbilities += prefix + "\t" + "Dexterity: " + abilities.Dexterity.value + " (" + abilities.Dexterity.bonus + ")\r\n";
        formattedAbilities += prefix + "\t" + "Intelligence: " + abilities.Intelligence.value + " (" + abilities.Intelligence.bonus + ")\r\n";
        formattedAbilities += prefix + "\t" + "Wisdom: " + abilities.Wisdom.value + " (" + abilities.Wisdom.bonus + ")\r\n";
        formattedAbilities += prefix + "\t" + "Charisma: " + abilities.Charisma.value + " (" + abilities.Charisma.bonus + ")\r\n";

        return formattedAbilities;
    }

    private formatSkills(skills: Skill[], prefix: string): string {
        if (!prefix)
            prefix = '';

        var formattedSkills = prefix + 'Skills:\r\n';

        for (var i = 0; i < skills.length; i++) {
            var skill = skills[i];

            formattedSkills += prefix + `\t${skill.displayName}\r\n`;
            formattedSkills += prefix + '\t\t' + `Total Bonus: ${this.bonusPipe.transform(skill.totalBonus, skill.circumstantialBonus)}\r\n`;

            formattedSkills += prefix + '\t\t' + 'Ranks: ' + skill.effectiveRanks + '\r\n';
            formattedSkills += prefix + '\t\t' + 'Ability Bonus: ' + skill.baseAbility.bonus + '\r\n';
            formattedSkills += prefix + '\t\t' + 'Other Bonus: ' + skill.bonus + '\r\n';
            formattedSkills += prefix + '\t\t' + 'Armor Check Penalty: ' + skill.armorCheckPenalty + '\r\n';

            if (skill.classSkill)
                formattedSkills += prefix + '\t\t' + 'Class Skill\r\n';
        }

        return formattedSkills;
    }

    private formatFeats(feats: FeatCollection, prefix: string): string {
        if (!prefix)
            prefix = '';

        var formattedFeats = prefix + 'Feats:\r\n';

        if (feats.racial.length) {
            formattedFeats += prefix + '\t' + 'Racial:\r\n';

            for (var i = 0; i < feats.racial.length; i++) {
                formattedFeats += this.formatFeat(feats.racial[i], prefix + "\t\t");
            }
        }

        if (feats['class'].length) {
            formattedFeats += prefix + '\t' + 'Class:\r\n';

            for (var j = 0; j < feats['class'].length; j++) {
            formattedFeats += this.formatFeat(feats['class'][j], prefix + "\t\t");
            }
        }

        formattedFeats += prefix + '\t' + 'Additional:\r\n';

        for (var k = 0; k < feats.additional.length; k++) {
            formattedFeats += this.formatFeat(feats.additional[k], prefix + "\t\t");
        }

        return formattedFeats;
    }

    private formatFeat(feat: Feat, prefix: string): string {
        var formattedFeat = prefix + feat.name + '\r\n';

        formattedFeat += this.formatList(feat.foci, 'Foci', prefix + '\t');

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

    private formatSpellsPerDay(spellsPerDay: SpellQuantity[], prefix: string): string {
        if (!prefix)
            prefix = '';

        if (spellsPerDay.length === 0)
            return '';

        var formattedSpellsPerDay = prefix + 'Spells Per Day:\r\n';

        for (var i = 0; i < spellsPerDay.length; i++) {
            const groupName = this.spellGroupService.getSpellGroupName(spellsPerDay[i].level, spellsPerDay[i].source);
            formattedSpellsPerDay += prefix + '\t' + groupName + ": " + spellsPerDay[i].quantity;

            if (spellsPerDay[i].hasDomainSpell)
                formattedSpellsPerDay += " + 1";

            formattedSpellsPerDay += "\r\n";
        }

        return formattedSpellsPerDay;
    }

    private formatSpells(spells: Spell[], title: string, prefix: string): string {
        if (!prefix)
            prefix = '';

        if (spells.length === 0)
            return '';

        let formattedSpells = prefix + title + ':\r\n';

        const spellGroups = this.spellGroupService.sortIntoGroups(spells);

        for (var i = 0; i < spellGroups.length; i++) {
            const groupName = spellGroups[i].name;
            formattedSpells += `${prefix}\t${groupName}:\r\n`;

            for (var j = 0; j < spellGroups[i].spells.length; j++) {
                const spellName = spellGroups[i].spells[j].name;
                formattedSpells += `${prefix}\t\t${spellName}\r\n`;
            }
        }

        return formattedSpells;
    }

    private formatItem(title: string, item: Item | Armor | Weapon | null, prefix: string): string {
        if (!prefix)
            prefix = '';

        if (!item)
            return prefix + title + ": None\r\n";

        var formattedItem = prefix + title + ":\r\n";
        formattedItem += this.itemPipe.transform(item, prefix + "\t");

        return formattedItem;
    }

    private formatOffHandItem(equipment: Equipment, prefix: string): string {
        if (!prefix)
            prefix = '';

        if (!equipment.primaryHand)
            return this.formatItem("Off Hand", equipment.offHand, prefix);

        if (equipment.primaryHand.attributes.indexOf('Two-Handed') > -1)
            return prefix + "Off Hand: (Two-Handed)\r\n";

        return this.formatItem("Off Hand", equipment.offHand, prefix);
    }

    private formatTreasure(treasure: Treasure, prefix: string): string {
        if (!prefix)
            prefix = '';

        if (!treasure.isAny)
            return prefix + "Treasure: None\r\n";

        var formattedTreasure = prefix + "Treasure:\r\n";
        formattedTreasure += this.treasurePipe.transform(treasure, prefix + "\t");

        return formattedTreasure;
    }

    private formatArmorClass(armorClass: ArmorClass, prefix: string): string {
        if (!prefix)
            prefix = '';

        var formattedArmorClass = prefix + "\t" + "Armor Class: " + this.bonusPipe.transform(armorClass.full, armorClass.circumstantialBonus, false);
        formattedArmorClass += "\r\n";
        formattedArmorClass += prefix + "\t\t" + "Flat-Footed: " + armorClass.flatFooted + "\r\n";
        formattedArmorClass += prefix + "\t\t" + "Touch: " + armorClass.touch + "\r\n";

        return formattedArmorClass;
    }

    private formatBaseAttack(baseAttack: BaseAttack, prefix: string): string {
        if (!prefix)
            prefix = '';

        var formattedMeleeBonuses = this.bonusesPipe.transform(baseAttack.allMeleeBonuses, baseAttack.circumstantialBonus);
        var formattedRangedBonuses = this.bonusesPipe.transform(baseAttack.allRangedBonuses, baseAttack.circumstantialBonus);
        var formattedBaseAttack = prefix + "\t" + "Base Attack:\r\n";

        formattedBaseAttack += prefix + "\t\t" + "Melee: " + formattedMeleeBonuses;
        formattedBaseAttack += '\r\n';
        formattedBaseAttack += prefix + "\t\t" + "Ranged: " + formattedRangedBonuses;
        formattedBaseAttack += '\r\n';

        return formattedBaseAttack;
    }
}
