import { Injectable } from '@angular/core';
import { Treasure } from '../models/treasure.model';
import { Item } from '../models/item.model';
import { Armor } from '../models/armor.model';
import { Weapon } from '../models/weapon.model';
import { SpecialAbility } from '../models/specialAbility.model';
import { Intelligence } from '../models/intelligence.model';

@Injectable({
  providedIn: 'root',
})
export class TreasureFormatterService {
  constructor() { }

  public formatTreasure(treasure: Treasure, prefix?: string): string {
    if (!prefix)
        prefix = '';

    var formattedTreasure = '';

    if (!treasure.isAny)
        return formattedTreasure;

    if (treasure.coin.quantity > 0)
        formattedTreasure += prefix + this.formatNumber(treasure.coin.quantity) + ' ' + treasure.coin.currency + '\r\n';

    if (treasure.goods.length > 0)
        formattedTreasure += prefix + 'Goods:\r\n';

    for (var i = 0; i < treasure.goods.length; i++) {
      formattedTreasure += prefix + '\t' + treasure.goods[i].description + ' (' + this.formatNumber(treasure.goods[i].valueInGold) + 'gp)\r\n';
    }

    if (treasure.items.length > 0)
        formattedTreasure += prefix + 'Items:\r\n';

    for (var j = 0; j < treasure.items.length; j++) {
        formattedTreasure += this.formatItem(treasure.items[j], prefix + '\t');
    }

    return formattedTreasure;
  }

  private formatNumber(number: number): string {
      return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  public formatItem(item: Item, prefix?: string): string {
      if (!prefix)
          prefix = '';

      var formattedItem = prefix + item.name;

      if (item.quantity > 1)
          formattedItem += ' (x' + item.quantity + ')';

      formattedItem += '\r\n';
      formattedItem += this.formatList(item.contents, 'Contents', prefix + '\t');
      formattedItem += this.formatList(item.traits, 'Traits', prefix + '\t');

      if (item.magic.bonus > 0)
          formattedItem += prefix + '\tBonus: +' + item.magic.bonus + '\r\n';

      formattedItem += this.formatSpecialAbilities(item.magic.specialAbilities, prefix + '\t');

      if (item.attributes.indexOf('Charged') > -1)
          formattedItem += prefix + '\tCharges: ' + item.magic.charges + '\r\n';

      if (item.magic.curse.length > 0)
          formattedItem += prefix + '\tCurse: ' + item.magic.curse + '\r\n';

      formattedItem += this.formatIntelligence(item.magic.intelligence, prefix + '\t');

      if (item instanceof Armor) {
          formattedItem += this.formatArmor(item as Armor, prefix + '\t');
      }
      else if (item instanceof Weapon) {
          formattedItem += this.formatWeapon(item as Weapon, prefix + '\t');
      }

      return formattedItem;
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

  private formatArmor(armor: Armor, prefix: string): string {
      var formattedArmor = prefix + 'Armor:' + '\r\n';

      formattedArmor += prefix + '\t' + 'Size: ' + armor.size + '\r\n';
      formattedArmor += prefix + '\t' + 'Armor Bonus: ' + armor.totalArmorBonus + '\r\n';
      formattedArmor += prefix + '\t' + 'Armor Check Penalty: ' + armor.totalArmorCheckPenalty + '\r\n';

      if (armor.totalMaxDexterityBonus < 100)
          formattedArmor += prefix + '\t' + 'Max Dexterity Bonus: ' + armor.totalMaxDexterityBonus + '\r\n';

      return formattedArmor;
  }

  private formatWeapon(weapon: Weapon, prefix: string): string {
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

  private formatSpecialAbilities(abilities: SpecialAbility[], prefix: string): string {
      if (!abilities.length)
          return '';

      if (!prefix)
          prefix = '';

      var formattedAbilities = prefix + 'Special Abilities:\r\n';

      for (var i = 0; i < abilities.length; i++) {
          formattedAbilities += prefix + '\t' + abilities[i].name + '\r\n';
      }

      return formattedAbilities;
  }

  private formatIntelligence(intelligence: Intelligence, prefix: string): string {
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
      formattedIntelligence += this.formatList(intelligence.communication, 'Communication', prefix + '\t');
      formattedIntelligence += this.formatList(intelligence.languages, 'Languages', prefix + '\t\t');
      formattedIntelligence += prefix + '\tSenses: ' + intelligence.senses + '\r\n';
      formattedIntelligence += this.formatList(intelligence.powers, 'Powers', prefix + '\t');

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
}
