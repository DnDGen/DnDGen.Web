import { Input, Component } from '@angular/core';
import { Item } from './models/item.model';
import { Armor } from './models/armor.model';
import { Weapon } from './models/weapon.model';

@Component({
  selector: 'dndgen-item',
  templateUrl: './item.component.html'
})

export class ItemComponent {
  @Input() item!: Item;

  public get armor() { return this.item as Armor };
  public get weapon() { return this.item as Weapon };

  public isArmor(): boolean {
    return this.item instanceof Armor;
  }

  public isWeapon(): boolean {
    return this.item instanceof Weapon;
  }

  public hasList(): boolean {
    if (!this.item)
      return false;

    let additionalData = this.item.contents.length > 0
      || this.item.traits.length > 0
      || this.item.magic.bonus != 0
      || this.item.attributes.indexOf('Charged') > -1
      || this.item.magic.specialAbilities.length > 0
      || this.item.magic.curse.length > 0
      || this.item.magic.intelligence.ego > 0;

    additionalData ||= this.isArmor() && this.armor.totalArmorBonus != 0;
    additionalData ||= this.isWeapon() && this.weapon.damageDescription.length > 0;

    return additionalData;
  }
}
