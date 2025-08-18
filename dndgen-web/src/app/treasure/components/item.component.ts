import { Input, Component } from '@angular/core';
import { Item } from '../models/item.model';
import { Armor } from '../models/armor.model';
import { Weapon } from '../models/weapon.model';
import { BonusPipe } from '../../shared/pipes/bonus.pipe';
import { DetailsComponent } from '../../shared/components/details.component';

@Component({
    selector: 'dndgen-item',
    templateUrl: './item.component.html',
    standalone: true,
    imports: [DetailsComponent, BonusPipe]
})

export class ItemComponent {
  @Input() item!: Item;

  public get armor() { return this.item as Armor };
  public get weapon() { return this.item as Weapon };
  public get personality() {
    if (!this.item.magic.intelligence) {
      return '';
    }

    if (this.item.magic.intelligence.personality) {
      return this.item.magic.intelligence.personality
    }

    return 'None';
  }

  public isArmor(): boolean {
    return this.item instanceof Armor 
      || this.item.itemType == 'Armor' 
      || (this.item.canBeUsedAsWeaponOrArmor && this.armor.totalArmorBonus != 0);
  }

  public isWeapon(): boolean {
    return this.item instanceof Weapon 
      || this.item.itemType == 'Weapon' 
      || (this.item.canBeUsedAsWeaponOrArmor 
        && ((this.weapon.damageSummary != undefined && this.weapon.damageSummary.length > 0)
          || (this.weapon.damageDescription != undefined && this.weapon.damageDescription.length > 0)));
  }

  public hasDetails(): boolean {
    if (!this.item)
      return false;

    let additionalData = this.item.contents.length > 0
      || this.item.traits.length > 0
      || this.item.magic.bonus != 0
      || this.item.attributes.indexOf('Charged') > -1
      || this.item.magic.specialAbilities.length > 0
      || this.item.magic.curse.length > 0
      || this.item.magic.intelligence.ego > 0;

    additionalData ||= this.isArmor();
    additionalData ||= this.isWeapon();

    return additionalData;
  }
}
