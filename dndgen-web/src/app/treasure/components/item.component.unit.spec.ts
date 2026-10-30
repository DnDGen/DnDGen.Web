import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ItemComponent } from './item.component';
import { Item } from '../models/item.model';
import { Armor } from '../models/armor.model';
import { Weapon } from '../models/weapon.model';
import { SpecialAbility } from '../models/special-ability.model';
import { TestHelper } from '../../test-helper';

describe('Item Component', () => {
  describe('unit', () => {
    let component: ItemComponent;

    beforeEach(() => {
      component = new ItemComponent();
    });
  
    it(`should set the item `, () => {
      let item = new Item('my item', 'MyItemType');
      component.item = item;

      expect(component.item).toBe(item);
    });
  
    it(`should set the armor `, () => {
      let item = new Armor('my armor', 'Armor');
      item.armorBonus = 9266;

      component.item = item;

      expect(component.item).toBe(item);
      expect(component.armor).toBe(item);
      expect(component.armor).toBeInstanceOf(Armor);
      expect(component.armor.armorBonus).toBe(9266);
    });
  
    it(`should set the weapon V1`, () => {
      let item = new Weapon('my weapon', 'Weapon');
      item.damageDescription = 'my damage description';

      component.item = item;

      expect(component.item).toBe(item);
      expect(component.weapon).toBe(item);
      expect(component.weapon).toBeInstanceOf(Weapon);
      expect(component.weapon.damageDescription).toEqual('my damage description');
    });
  
    it(`should set the weapon V2`, () => {
      let item = new Weapon('my weapon', 'Weapon');
      item.damageSummary = 'my damage summary';

      component.item = item;

      expect(component.item).toBe(item);
      expect(component.weapon).toBe(item);
      expect(component.weapon).toBeInstanceOf(Weapon);
      expect(component.weapon.damageSummary).toEqual('my damage summary');
    });
  
    it(`should say is not armor when item`, () => {
      let item = new Item('my item', 'MyItemType');
      component.item = item;

      expect(component.isArmor()).toBe(false);
    });
  
    it(`should say is armor when item is armor`, () => {
      let item = new Item('my item', 'Armor');
      component.item = item;

      expect(component.isArmor()).toBe(true);
    });
  
    it(`should say is not armor when weapon`, () => {
      let item = new Weapon('my item', 'MyItemType');
      component.item = item;

      expect(component.isArmor()).toBe(false);
    });
  
    it(`should say is armor when armor`, () => {
      let item = new Armor('my item', 'MyItemType');
      component.item = item;

      expect(component.isArmor()).toBe(true);
    });
  
    it(`should say is not weapon when item`, () => {
      let item = new Item('my item', 'MyItemType');
      component.item = item;

      expect(component.isWeapon()).toBe(false);
    });
  
    it(`should say is weapon when item is weapon`, () => {
      let item = new Item('my item', 'Weapon');
      component.item = item;

      expect(component.isWeapon()).toBe(true);
    });
  
    it(`should say is weapon when item is rod with weapon properties`, () => {
      let item = new Weapon('my item', 'Rod');
      item.canBeUsedAsWeaponOrArmor = true;
      item.damageSummary = 'my damage summary';

      component.item = item as Item;

      expect(component.isWeapon()).toBe(true);
    });
  
    it(`should say is not weapon when item is rod without weapon properties`, () => {
      let item = new Item('my item', 'Rod');
      item.canBeUsedAsWeaponOrArmor = false;
      component.item = item;

      expect(component.isWeapon()).toBe(false);
    });
  
    it(`should say is weapon when item is staff with weapon properties`, () => {
      let item = new Weapon('my item', 'Staff');
      item.canBeUsedAsWeaponOrArmor = true;
      item.damageSummary = 'my damage summary';

      component.item = item as Item;

      expect(component.isWeapon()).toBe(true);
    });
  
    it(`should say is not weapon when item is staff without weapon properties`, () => {
      let item = new Item('my item', 'Staff');
      item.canBeUsedAsWeaponOrArmor = false;
      component.item = item;

      expect(component.isWeapon()).toBe(false);
    });
  
    it(`should say is not armor when item is rod with weapon properties`, () => {
      let item = new Weapon('my item', 'Rod');
      item.canBeUsedAsWeaponOrArmor = true;
      item.damageSummary = 'my damage summary';

      component.item = item as Item;

      expect(component.isArmor()).toBe(false);
    });
  
    it(`should say is not armor when item is rod without weapon properties`, () => {
      let item = new Item('my item', 'Rod');
      item.canBeUsedAsWeaponOrArmor = false;
      component.item = item;

      expect(component.isArmor()).toBe(false);
    });
  
    it(`should say is not armor when item is staff with weapon properties`, () => {
      let item = new Weapon('my item', 'Staff');
      item.canBeUsedAsWeaponOrArmor = true;
      item.damageSummary = 'my damage summary';

      component.item = item as Item;

      expect(component.isArmor()).toBe(false);
    });
  
    it(`should say is not armor when item is staff without weapon properties`, () => {
      let item = new Item('my item', 'Staff');
      item.canBeUsedAsWeaponOrArmor = false;
      component.item = item;

      expect(component.isArmor()).toBe(false);
    });
  
    it(`should say is not weapon when armor`, () => {
      let item = new Armor('my item', 'MyItemType');
      component.item = item;

      expect(component.isWeapon()).toBe(false);
    });
  
    it(`should say is weapon when weapon`, () => {
      let item = new Weapon('my item', 'MyItemType');
      component.item = item;

      expect(component.isWeapon()).toBe(true);
    });
  
    it(`should say it has no details when no item`, () => {
      expect(component.hasDetails()).toBe(false);
    });
  
    it(`should say it has no details when item is boring`, () => {
      component.item = new Item('my item', 'MyItemType');
      component.item.contents = [];
      component.item.traits = [];
      component.item.magic.bonus = 0;
      component.item.attributes = ['My Attribute', 'My Other Attribute'];
      component.item.magic.specialAbilities = [];
      component.item.magic.curse = '';
      component.item.magic.intelligence.ego = 0;

      expect(component.hasDetails()).toBe(false);
    });
  
    it(`should say it has details when item has contents`, () => {
      component.item = new Item('my item', 'MyItemType');
      component.item.contents = ['my content'];
      component.item.traits = [];
      component.item.magic.bonus = 0;
      component.item.attributes = ['My Attribute', 'My Other Attribute'];
      component.item.magic.specialAbilities = [];
      component.item.magic.curse = '';
      component.item.magic.intelligence.ego = 0;

      expect(component.hasDetails()).toBe(true);
    });
  
    it(`should say it has details when item has traits`, () => {
      component.item = new Item('my item', 'MyItemType');
      component.item.contents = [];
      component.item.traits = ['my trait'];
      component.item.magic.bonus = 0;
      component.item.attributes = ['My Attribute', 'My Other Attribute'];
      component.item.magic.specialAbilities = [];
      component.item.magic.curse = '';
      component.item.magic.intelligence.ego = 0;

      expect(component.hasDetails()).toBe(true);
    });
  
    it(`should say it has details when item has magic bonus`, () => {
      component.item = new Item('my item', 'MyItemType');
      component.item.contents = [];
      component.item.traits = [];
      component.item.magic.bonus = 1;
      component.item.attributes = ['My Attribute', 'My Other Attribute'];
      component.item.magic.specialAbilities = [];
      component.item.magic.curse = '';
      component.item.magic.intelligence.ego = 0;

      expect(component.hasDetails()).toBe(true);
    });
  
    it(`should say it has details when item has negative magic bonus`, () => {
      component.item = new Item('my item', 'MyItemType');
      component.item.contents = [];
      component.item.traits = [];
      component.item.magic.bonus = -1;
      component.item.attributes = ['My Attribute', 'My Other Attribute'];
      component.item.magic.specialAbilities = [];
      component.item.magic.curse = '';
      component.item.magic.intelligence.ego = 0;

      expect(component.hasDetails()).toBe(true);
    });
  
    it(`should say it has details when item has Charged attribute`, () => {
      component.item = new Item('my item', 'MyItemType');
      component.item.contents = [];
      component.item.traits = [];
      component.item.magic.bonus = 0;
      component.item.attributes = ['My Attribute', 'Charged', 'My Other Attribute'];
      component.item.magic.specialAbilities = [];
      component.item.magic.curse = '';
      component.item.magic.intelligence.ego = 0;

      expect(component.hasDetails()).toBe(true);
    });
  
    it(`should say it has details when item has a special ability`, () => {
      component.item = new Item('my item', 'MyItemType');
      component.item.contents = [];
      component.item.traits = [];
      component.item.magic.bonus = 0;
      component.item.attributes = ['My Attribute', 'My Other Attribute'];
      component.item.magic.specialAbilities = [new SpecialAbility('my special ability')];
      component.item.magic.curse = '';
      component.item.magic.intelligence.ego = 0;

      expect(component.hasDetails()).toBe(true);
    });
  
    it(`should say it has details when item has a curse`, () => {
      component.item = new Item('my item', 'MyItemType');
      component.item.contents = [];
      component.item.traits = [];
      component.item.magic.bonus = 0;
      component.item.attributes = ['My Attribute', 'My Other Attribute'];
      component.item.magic.specialAbilities = [];
      component.item.magic.curse = 'my curse';
      component.item.magic.intelligence.ego = 0;

      expect(component.hasDetails()).toBe(true);
    });
  
    it(`should say it has details when item has intelligence`, () => {
      component.item = new Item('my item', 'MyItemType');
      component.item.contents = [];
      component.item.traits = [];
      component.item.magic.bonus = 0;
      component.item.attributes = ['My Attribute', 'My Other Attribute'];
      component.item.magic.specialAbilities = [];
      component.item.magic.curse = '';
      component.item.magic.intelligence.ego = 1;

      expect(component.hasDetails()).toBe(true);
    });
  
    it(`should say it has details when armor is boring`, () => {
      let armor = new Armor('my item', 'MyItemType');
      armor.totalArmorBonus = 9;

      component.item = armor;
      component.item.contents = [];
      component.item.traits = [];
      component.item.magic.bonus = 0;
      component.item.attributes = ['My Attribute', 'My Other Attribute'];
      component.item.magic.specialAbilities = [];
      component.item.magic.curse = '';
      component.item.magic.intelligence.ego = 0;

      expect(component.hasDetails()).toBe(true);
    });
  
    it(`should say it has details when armor has contents`, () => {
      let armor = new Armor('my item', 'MyItemType');
      armor.totalArmorBonus = 9;

      component.item = armor;
      component.item.contents = ['my content'];
      component.item.traits = [];
      component.item.magic.bonus = 0;
      component.item.attributes = ['My Attribute', 'My Other Attribute'];
      component.item.magic.specialAbilities = [];
      component.item.magic.curse = '';
      component.item.magic.intelligence.ego = 0;

      expect(component.hasDetails()).toBe(true);
    });
  
    it(`should say it has details when armor has traits`, () => {
      let armor = new Armor('my item', 'MyItemType');
      armor.totalArmorBonus = 9;

      component.item = armor;
      component.item.contents = [];
      component.item.traits = ['my trait'];
      component.item.magic.bonus = 0;
      component.item.attributes = ['My Attribute', 'My Other Attribute'];
      component.item.magic.specialAbilities = [];
      component.item.magic.curse = '';
      component.item.magic.intelligence.ego = 0;

      expect(component.hasDetails()).toBe(true);
    });
  
    it(`should say it has details when armor has magic bonus`, () => {
      let armor = new Armor('my item', 'MyItemType');
      armor.totalArmorBonus = 9;

      component.item = armor;
      component.item.contents = [];
      component.item.traits = [];
      component.item.magic.bonus = 1;
      component.item.attributes = ['My Attribute', 'My Other Attribute'];
      component.item.magic.specialAbilities = [];
      component.item.magic.curse = '';
      component.item.magic.intelligence.ego = 0;

      expect(component.hasDetails()).toBe(true);
    });
  
    it(`should say it has details when armor has negative magic bonus`, () => {
      let armor = new Armor('my item', 'MyItemType');
      armor.totalArmorBonus = -9;

      component.item = armor;
      component.item.contents = [];
      component.item.traits = [];
      component.item.magic.bonus = -1;
      component.item.attributes = ['My Attribute', 'My Other Attribute'];
      component.item.magic.specialAbilities = [];
      component.item.magic.curse = '';
      component.item.magic.intelligence.ego = 0;

      expect(component.hasDetails()).toBe(true);
    });
  
    it(`should say it has details when armor has Charged attribute`, () => {
      let armor = new Armor('my item', 'MyItemType');
      armor.totalArmorBonus = 9;

      component.item = armor;
      component.item.contents = [];
      component.item.traits = [];
      component.item.magic.bonus = 0;
      component.item.attributes = ['My Attribute', 'Charged', 'My Other Attribute'];
      component.item.magic.specialAbilities = [];
      component.item.magic.curse = '';
      component.item.magic.intelligence.ego = 0;

      expect(component.hasDetails()).toBe(true);
    });
  
    it(`should say it has details when armor has a special ability`, () => {
      let armor = new Armor('my item', 'MyItemType');
      armor.totalArmorBonus = 9;

      component.item = armor;
      component.item.contents = [];
      component.item.traits = [];
      component.item.magic.bonus = 0;
      component.item.attributes = ['My Attribute', 'My Other Attribute'];
      component.item.magic.specialAbilities = [new SpecialAbility('my special ability')];
      component.item.magic.curse = '';
      component.item.magic.intelligence.ego = 0;

      expect(component.hasDetails()).toBe(true);
    });
  
    it(`should say it has details when armor has a curse`, () => {
      let armor = new Armor('my item', 'MyItemType');
      armor.totalArmorBonus = 9;

      component.item = armor;
      component.item.contents = [];
      component.item.traits = [];
      component.item.magic.bonus = 0;
      component.item.attributes = ['My Attribute', 'My Other Attribute'];
      component.item.magic.specialAbilities = [];
      component.item.magic.curse = 'my curse';
      component.item.magic.intelligence.ego = 0;

      expect(component.hasDetails()).toBe(true);
    });
  
    it(`should say it has details when armor has intelligence`, () => {
      let armor = new Armor('my item', 'MyItemType');
      armor.totalArmorBonus = 9;

      component.item = armor;
      component.item.contents = [];
      component.item.traits = [];
      component.item.magic.bonus = 0;
      component.item.attributes = ['My Attribute', 'My Other Attribute'];
      component.item.magic.specialAbilities = [];
      component.item.magic.curse = '';
      component.item.magic.intelligence.ego = 1;

      expect(component.hasDetails()).toBe(true);
    });
  
    it(`should say it has details when armor has armor bonus`, () => {
      let armor = new Armor('my item', 'MyItemType');
      armor.contents = [];
      armor.traits = [];
      armor.magic.bonus = 0;
      armor.attributes = ['My Attribute', 'My Other Attribute'];
      armor.magic.specialAbilities = [];
      armor.magic.curse = '';
      armor.magic.intelligence.ego = 0;
      armor.totalArmorBonus = 1;

      component.item = armor;

      expect(component.hasDetails()).toBe(true);
    });
  
    it(`BUG - should say it has details when armor has cursed armor bonus`, () => {
      let armor = new Armor('my item', 'MyItemType');
      armor.contents = [];
      armor.traits = [];
      armor.magic.bonus = 0;
      armor.attributes = ['My Attribute', 'My Other Attribute'];
      armor.magic.specialAbilities = [];
      armor.magic.curse = '';
      armor.magic.intelligence.ego = 0;
      armor.totalArmorBonus = -1;

      component.item = armor;

      expect(component.hasDetails()).toBe(true);
    });
  
    it(`should say it has details weapon item is boring`, () => {
      let weapon = new Weapon('my item', 'MyItemType');
      weapon.damageSummary = 'my damage summary';

      component.item = weapon;
      component.item.contents = [];
      component.item.traits = [];
      component.item.magic.bonus = 0;
      component.item.attributes = ['My Attribute', 'My Other Attribute'];
      component.item.magic.specialAbilities = [];
      component.item.magic.curse = '';
      component.item.magic.intelligence.ego = 0;

      expect(component.hasDetails()).toBe(true);
    });
  
    it(`should say it has details when weapon has contents`, () => {
      let weapon = new Weapon('my item', 'MyItemType');
      weapon.damageSummary = 'my damage summary';

      component.item = weapon;
      component.item.contents = ['my content'];
      component.item.traits = [];
      component.item.magic.bonus = 0;
      component.item.attributes = ['My Attribute', 'My Other Attribute'];
      component.item.magic.specialAbilities = [];
      component.item.magic.curse = '';
      component.item.magic.intelligence.ego = 0;

      expect(component.hasDetails()).toBe(true);
    });
  
    it(`should say it has details when weapon has traits`, () => {
      let weapon = new Weapon('my item', 'MyItemType');
      weapon.damageSummary = 'my damage summary';

      component.item = weapon;
      component.item.contents = [];
      component.item.traits = ['my trait'];
      component.item.magic.bonus = 0;
      component.item.attributes = ['My Attribute', 'My Other Attribute'];
      component.item.magic.specialAbilities = [];
      component.item.magic.curse = '';
      component.item.magic.intelligence.ego = 0;

      expect(component.hasDetails()).toBe(true);
    });
  
    it(`should say it has details when weapon has magic bonus`, () => {
      let weapon = new Weapon('my item', 'MyItemType');
      weapon.damageSummary = 'my damage summary';

      component.item = weapon;
      component.item.contents = [];
      component.item.traits = [];
      component.item.magic.bonus = 1;
      component.item.attributes = ['My Attribute', 'My Other Attribute'];
      component.item.magic.specialAbilities = [];
      component.item.magic.curse = '';
      component.item.magic.intelligence.ego = 0;

      expect(component.hasDetails()).toBe(true);
    });
  
    it(`should say it has details when weapon has negative magic bonus`, () => {
      let weapon = new Weapon('my item', 'MyItemType');
      weapon.damageSummary = 'my damage summary';

      component.item = weapon;
      component.item.contents = [];
      component.item.traits = [];
      component.item.magic.bonus = -1;
      component.item.attributes = ['My Attribute', 'My Other Attribute'];
      component.item.magic.specialAbilities = [];
      component.item.magic.curse = '';
      component.item.magic.intelligence.ego = 0;

      expect(component.hasDetails()).toBe(true);
    });
  
    it(`should say it has details when weapon has Charged attribute`, () => {
      let weapon = new Weapon('my item', 'MyItemType');
      weapon.damageSummary = 'my damage summary';

      component.item = weapon;
      component.item.contents = [];
      component.item.traits = [];
      component.item.magic.bonus = 0;
      component.item.attributes = ['My Attribute', 'Charged', 'My Other Attribute'];
      component.item.magic.specialAbilities = [];
      component.item.magic.curse = '';
      component.item.magic.intelligence.ego = 0;

      expect(component.hasDetails()).toBe(true);
    });
  
    it(`should say it has details when weapon has a special ability`, () => {
      let weapon = new Weapon('my item', 'MyItemType');
      weapon.damageSummary = 'my damage summary';

      component.item = weapon;
      component.item.contents = [];
      component.item.traits = [];
      component.item.magic.bonus = 0;
      component.item.attributes = ['My Attribute', 'My Other Attribute'];
      component.item.magic.specialAbilities = [new SpecialAbility('my special ability')];
      component.item.magic.curse = '';
      component.item.magic.intelligence.ego = 0;

      expect(component.hasDetails()).toBe(true);
    });
  
    it(`should say it has details when weapon has a curse`, () => {
      let weapon = new Weapon('my item', 'MyItemType');
      weapon.damageSummary = 'my damage summary';

      component.item = weapon;
      component.item.contents = [];
      component.item.traits = [];
      component.item.magic.bonus = 0;
      component.item.attributes = ['My Attribute', 'My Other Attribute'];
      component.item.magic.specialAbilities = [];
      component.item.magic.curse = 'my curse';
      component.item.magic.intelligence.ego = 0;

      expect(component.hasDetails()).toBe(true);
    });
  
    it(`should say it has details when weapon has intelligence`, () => {
      let weapon = new Weapon('my item', 'MyItemType');
      weapon.damageSummary = 'my damage summary';

      component.item = weapon;
      component.item.contents = [];
      component.item.traits = [];
      component.item.magic.bonus = 0;
      component.item.attributes = ['My Attribute', 'My Other Attribute'];
      component.item.magic.specialAbilities = [];
      component.item.magic.curse = '';
      component.item.magic.intelligence.ego = 1;

      expect(component.hasDetails()).toBe(true);
    });
  
    it(`should say it has details when weapon has damage description`, () => {
      let weapon = new Weapon('my item', 'MyItemType');
      weapon.contents = [];
      weapon.traits = [];
      weapon.magic.bonus = 0;
      weapon.attributes = ['My Attribute', 'My Other Attribute'];
      weapon.magic.specialAbilities = [];
      weapon.magic.curse = '';
      weapon.magic.intelligence.ego = 0;
      weapon.damageDescription = 'my damage description';

      component.item = weapon;

      expect(component.hasDetails()).toBe(true);
    });
  
    it(`should say it has details when weapon has damage summary`, () => {
      let weapon = new Weapon('my item', 'MyItemType');
      weapon.contents = [];
      weapon.traits = [];
      weapon.magic.bonus = 0;
      weapon.attributes = ['My Attribute', 'My Other Attribute'];
      weapon.magic.specialAbilities = [];
      weapon.magic.curse = '';
      weapon.magic.intelligence.ego = 0;
      weapon.damageSummary = 'my damage summary';

      component.item = weapon;

      expect(component.hasDetails()).toBe(true);
    });
  });
});