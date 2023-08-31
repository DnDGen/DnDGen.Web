import { Injectable } from '@angular/core';
import { TreasureFormatterService } from "../treasure/treasureFormatter.service";
import { Character } from './character.model';
import { Leadership } from './leadership.model';
import { Measurement } from './measurement.model';
import { InchesToFeetPipe } from '../shared/inchesToFeet.pipe'
import { Skill } from './skill.model';
import { Feat } from './feat.model';
import { FeatCollection } from './featCollection.model';
import { SpellQuantity } from './spellQuantity.model';
import { Spell } from './spell.model';
import { Item } from '../treasure/item.model';
import { Equipment } from './equipment.model';
import { Treasure } from '../treasure/treasure.model';
import { ArmorClass } from './armorClass.model';
import { BaseAttack } from './baseAttack.model';
import { Abilities } from './abilities.model';

@Injectable({
  providedIn: 'root',
})
export class CharacterFormatterService {
  constructor(private treasureFormatterService: TreasureFormatterService, private inchesToFeetPipe: InchesToFeetPipe) { }

  public formatCharacter(character: Character, leadership: Leadership | null, cohort: Character | null, followers: Character[], prefix?: string): string {
    if (!prefix)
      prefix = '';

    var formattedCharacter = this.formatCharacterWithoutLeadership(character, prefix);

    if (leadership) {
      formattedCharacter += '\r\n';
      formattedCharacter += this.formatLeadership(leadership, prefix);
    }

    if (cohort) {
      formattedCharacter += '\r\n';
      formattedCharacter += prefix + 'Cohort:\r\n';
      formattedCharacter += this.formatCharacterWithoutLeadership(cohort, prefix + '\t');
    }

    if (followers && followers.length > 0) {
      formattedCharacter += '\r\n';
      formattedCharacter += prefix + 'Followers:\r\n';

      for (var i = 0; i < followers.length; i++) {
        formattedCharacter += '\r\n';
        formattedCharacter += this.formatCharacterWithoutLeadership(followers[i], prefix + '\t');
      }
    }

    return formattedCharacter;
  }

  private formatCharacterWithoutLeadership(character: Character, prefix: string): string {
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
      formattedCharacter += prefix + '\t' + character.Class.summary + '\r\n';
    formattedCharacter += this.formatList(character.Class.specialistFields, 'Specialist', prefix + '\t\t');
    formattedCharacter += this.formatList(character.Class.prohibitedFields, 'Prohibited', prefix + '\t\t');

      //Race
      formattedCharacter += prefix + '\t' + character.race.summary + '\r\n';

      if (character.race.metaraceSpecies.length > 0)
          formattedCharacter += prefix + '\t\t' + 'Metarace Species: ' + character.race.metaraceSpecies + '\r\n';

      formattedCharacter += prefix + "\t\t" + "Land Speed: " + this.formatMeasurement(character.race.landSpeed) + "\r\n";

      if (character.race.aerialSpeed.value > 0)
        formattedCharacter += prefix + "\t\t" + "Aerial Speed: " + this.formatMeasurement(character.race.aerialSpeed) + "\r\n";

      if (character.race.swimSpeed.value > 0)
        formattedCharacter += prefix + "\t\t" + "Swim Speed: " + this.formatMeasurement(character.race.swimSpeed) + "\r\n";

      formattedCharacter += prefix + "\t\t" + "Size: " + character.race.size + "\r\n";
    formattedCharacter += prefix + "\t\t" + "Age: " + this.formatMeasurement(character.race.age) + "\r\n";
    formattedCharacter += prefix + "\t\t" + "Maximum Age: " + this.formatMeasurement(character.race.maximumAge) + "\r\n";
    formattedCharacter += prefix + "\t\t" + "Height: " + this.inchesToFeetPipe.transform(character.race.height.value);

      if (character.race.height.description)
          formattedCharacter += " (" + character.race.height.description + ")";

      formattedCharacter += "\r\n";
    formattedCharacter += prefix + "\t\t" + "Weight: " + this.formatMeasurement(character.race.weight) + "\r\n";

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

      //Combat
      formattedCharacter += prefix + "\t" + "Combat:\r\n";
      formattedCharacter += prefix + "\t\t" + "Adjusted Dexterity Bonus: " + character.combat.adjustedDexterityBonus + "\r\n";
    formattedCharacter += this.formatArmorClass(character.combat.armorClass, prefix + "\t");
    formattedCharacter += this.formatBaseAttack(character.combat.baseAttack, prefix + "\t");
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

  private formatMeasurement(measurement: Measurement): string {
      var formattedMeasurement = measurement.value + " " + measurement.unit;

      if (measurement.description)
          formattedMeasurement += " (" + measurement.description + ")";

      return formattedMeasurement;
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

    formattedAbilities += prefix + "\t" + "Strength: " + abilities.strength.value + " (" + abilities.strength.bonus + ")\r\n";

    if (abilities.constitution)
      formattedAbilities += prefix + "\t" + "Constitution: " + abilities.constitution.value + " (" + abilities.constitution.bonus + ")\r\n";

    formattedAbilities += prefix + "\t" + "Dexterity: " + abilities.dexterity.value + " (" + abilities.dexterity.bonus + ")\r\n";
    formattedAbilities += prefix + "\t" + "Intelligence: " + abilities.intelligence.value + " (" + abilities.intelligence.bonus + ")\r\n";
    formattedAbilities += prefix + "\t" + "Wisdom: " + abilities.wisdom.value + " (" + abilities.wisdom.bonus + ")\r\n";
    formattedAbilities += prefix + "\t" + "Charisma: " + abilities.charisma.value + " (" + abilities.charisma.bonus + ")\r\n";

    return formattedAbilities;
  }

  private formatSkills(skills: Skill[], prefix: string): string {
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

      if (feats.Class.length) {
          formattedFeats += prefix + '\t' + 'Class:\r\n';

        for (var j = 0; j < feats.Class.length; j++) {
          formattedFeats += this.formatFeat(feats.Class[j], prefix + "\t\t");
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
          formattedSpellsPerDay += prefix + '\t' + 'Level ' + spellsPerDay[i].level + ": " + spellsPerDay[i].quantity;

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

      var formattedSpells = prefix + title + ':\r\n';

      for (var i = 0; i < spells.length; i++) {
          formattedSpells += prefix + '\t' + spells[i].name + " (" + spells[i].level + ")\r\n";
      }

      return formattedSpells;
  }

  private formatItem(title: string, item: Item, prefix: string): string {
      if (!prefix)
          prefix = '';

      if (!item)
          return prefix + title + ": None\r\n";

      var formattedItem = prefix + title + ":\r\n";
      formattedItem += this.treasureFormatterService.formatItem(item, prefix + "\t");

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
      formattedTreasure += this.treasureFormatterService.formatTreasure(treasure, prefix + "\t");

      return formattedTreasure;
  }

  private formatArmorClass(armorClass: ArmorClass, prefix: string): string {
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

  private formatBaseAttack(baseAttack: BaseAttack, prefix: string): string {
      if (!prefix)
          prefix = '';

      var formattedMeleeBonuses = this.formatBaseAttackBonuses(baseAttack.allMeleeBonuses);
      var formattedRangedBonuses = this.formatBaseAttackBonuses(baseAttack.allRangedBonuses);
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

  private formatBaseAttackBonuses(bonuses: number[]): string {
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

  private formatLeadership(leadership: Leadership, prefix: string): string {
      if (!leadership)
          return '';

      if (!prefix)
          prefix = '';

      var formattedLeadership = prefix + "Leadership:\r\n";
      formattedLeadership += prefix + "\t" + "Score: " + leadership.score + "\r\n";
      formattedLeadership += this.formatList(leadership.leadershipModifiers, 'Leadership Modifiers', prefix + "\t");

      return formattedLeadership;
  }
}
