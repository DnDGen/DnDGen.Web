import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ItemComponent } from './item.component';
import { Item } from '../models/item.model';
import { Armor } from '../models/armor.model';
import { Weapon } from '../models/weapon.model';
import { SpecialAbility } from '../models/specialAbility.model';
import { TestHelper } from '../../testHelper.spec';

fdescribe('Item Component', () => {
  fdescribe('unit', () => {
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

      expect(component.isArmor()).toBeFalse();
    });
  
    it(`should say is armor when item is armor`, () => {
      let item = new Item('my item', 'Armor');
      component.item = item;

      expect(component.isArmor()).toBeTrue();
    });
  
    it(`should say is not armor when weapon`, () => {
      let item = new Weapon('my item', 'MyItemType');
      component.item = item;

      expect(component.isArmor()).toBeFalse();
    });
  
    it(`should say is armor when armor`, () => {
      let item = new Armor('my item', 'MyItemType');
      component.item = item;

      expect(component.isArmor()).toBeTrue();
    });
  
    it(`should say is not weapon when item`, () => {
      let item = new Item('my item', 'MyItemType');
      component.item = item;

      expect(component.isWeapon()).toBeFalse();
    });
  
    it(`should say is weapon when item is weapon`, () => {
      let item = new Item('my item', 'Weapon');
      component.item = item;

      expect(component.isWeapon()).toBeTrue();
    });
  
    it(`should say is weapon when item is rod with weapon properties`, () => {
      let item = new Weapon('my item', 'Rod');
      item.canBeUsedAsWeaponOrArmor = true;
      item.damageSummary = 'my damage summary';

      component.item = item as Item;

      expect(component.isWeapon()).toBeTrue();
    });
  
    it(`should say is not weapon when item is rod without weapon properties`, () => {
      let item = new Item('my item', 'Rod');
      item.canBeUsedAsWeaponOrArmor = false;
      component.item = item;

      expect(component.isWeapon()).toBeFalse();
    });
  
    it(`should say is weapon when item is staff with weapon properties`, () => {
      let item = new Weapon('my item', 'Staff');
      item.canBeUsedAsWeaponOrArmor = true;
      item.damageSummary = 'my damage summary';

      component.item = item as Item;

      expect(component.isWeapon()).toBeTrue();
    });
  
    it(`should say is not weapon when item is staff without weapon properties`, () => {
      let item = new Item('my item', 'Staff');
      item.canBeUsedAsWeaponOrArmor = false;
      component.item = item;

      expect(component.isWeapon()).toBeFalse();
    });
  
    it(`should say is not armor when item is rod with weapon properties`, () => {
      let item = new Weapon('my item', 'Rod');
      item.canBeUsedAsWeaponOrArmor = true;
      item.damageSummary = 'my damage summary';

      component.item = item as Item;

      expect(component.isArmor()).toBeFalse();
    });
  
    it(`should say is not armor when item is rod without weapon properties`, () => {
      let item = new Item('my item', 'Rod');
      item.canBeUsedAsWeaponOrArmor = false;
      component.item = item;

      expect(component.isArmor()).toBeFalse();
    });
  
    it(`should say is not armor when item is staff with weapon properties`, () => {
      let item = new Weapon('my item', 'Staff');
      item.canBeUsedAsWeaponOrArmor = true;
      item.damageSummary = 'my damage summary';

      component.item = item as Item;

      expect(component.isArmor()).toBeFalse();
    });
  
    it(`should say is not armor when item is staff without weapon properties`, () => {
      let item = new Item('my item', 'Staff');
      item.canBeUsedAsWeaponOrArmor = false;
      component.item = item;

      expect(component.isArmor()).toBeFalse();
    });
  
    it(`should say is not weapon when armor`, () => {
      let item = new Armor('my item', 'MyItemType');
      component.item = item;

      expect(component.isWeapon()).toBeFalse();
    });
  
    it(`should say is weapon when weapon`, () => {
      let item = new Weapon('my item', 'MyItemType');
      component.item = item;

      expect(component.isWeapon()).toBeTrue();
    });
  
    it(`should say it has no details when no item`, () => {
      expect(component.hasDetails()).toBeFalse();
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

      expect(component.hasDetails()).toBeFalse();
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

      expect(component.hasDetails()).toBeTrue();
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

      expect(component.hasDetails()).toBeTrue();
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

      expect(component.hasDetails()).toBeTrue();
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

      expect(component.hasDetails()).toBeTrue();
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

      expect(component.hasDetails()).toBeTrue();
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

      expect(component.hasDetails()).toBeTrue();
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

      expect(component.hasDetails()).toBeTrue();
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

      expect(component.hasDetails()).toBeTrue();
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

      expect(component.hasDetails()).toBeTrue();
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

      expect(component.hasDetails()).toBeTrue();
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

      expect(component.hasDetails()).toBeTrue();
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

      expect(component.hasDetails()).toBeTrue();
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

      expect(component.hasDetails()).toBeTrue();
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

      expect(component.hasDetails()).toBeTrue();
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

      expect(component.hasDetails()).toBeTrue();
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

      expect(component.hasDetails()).toBeTrue();
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

      expect(component.hasDetails()).toBeTrue();
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

      expect(component.hasDetails()).toBeTrue();
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

      expect(component.hasDetails()).toBeTrue();
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

      expect(component.hasDetails()).toBeFalse();
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

      expect(component.hasDetails()).toBeTrue();
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

      expect(component.hasDetails()).toBeTrue();
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

      expect(component.hasDetails()).toBeTrue();
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

      expect(component.hasDetails()).toBeTrue();
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

      expect(component.hasDetails()).toBeTrue();
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

      expect(component.hasDetails()).toBeTrue();
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

      expect(component.hasDetails()).toBeTrue();
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

      expect(component.hasDetails()).toBeTrue();
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

      expect(component.hasDetails()).toBeTrue();
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

      expect(component.hasDetails()).toBeTrue();
    });
  });

  describe('integration', () => {
    let fixture: ComponentFixture<ItemComponent>;
    let helper: TestHelper<ItemComponent>;
  
    beforeEach(async () => {
      await TestHelper.configureTestBed([ItemComponent]);
  
      fixture = TestBed.createComponent(ItemComponent);
      helper = new TestHelper(fixture);
    });
  
    it('should create the component', () => {
      const component = fixture.componentInstance;
      expect(component).toBeTruthy();
    });
  
    it(`should render a boring item`, () => {
      const component = fixture.componentInstance;
      component.item = getItem();

      fixture.detectChanges();
  
      helper.expectDetails('dndgen-details.item-header', 'my item summary (x1)', false);
    });
  
    it(`should render a boring item with quantity of 2`, () => {
      const component = fixture.componentInstance;
      component.item = getItem();
      component.item.quantity = 2;

      fixture.detectChanges();
  
      helper.expectDetails('dndgen-details.item-header', 'my item summary (x2)', false);
    });
  
    it(`should render an item with contents`, () => {
      const component = fixture.componentInstance;
      component.item = getItem();
      component.item.contents = ['my contents', 'my other contents'];

      fixture.detectChanges();
  
      helper.expectDetails('dndgen-details.item-header', 'my item summary (x1)', true);
      expectOnlyToShow('li.item-contents');
      helper.expectDetails('li.item-contents > dndgen-details', 'Contents', true);
      helper.expectElements('li.item-contents > dndgen-details li.item-content', ['my contents', 'my other contents']);
    });

    function expectOnlyToShow(selector: string) {
      let selectors = [
        'li.item-contents',
        'li.item-traits',
        'li.item-magic-bonus',
        'li.item-magic-special-abilities',
        'li.item-magic-charges',
        'li.item-magic-curse',
        'li.item-magic-intelligence',
      ];

      for(var i = 0; i < selectors.length; i++) {
        let exist = (selectors[i] == selector);
        helper.expectExists(selectors[i], exist);
      }
      
      helper.expectExists('li.item-armor', selector == 'li.item-armor');
      helper.expectExists('li.item-weapon', selector == 'li.item-weapon');
    }
  
    it(`should render an item with traits`, () => {
      const component = fixture.componentInstance;
      component.item = getItem();
      component.item.traits = ['my trait', 'my other trait'];

      fixture.detectChanges();
  
      helper.expectDetails('dndgen-details.item-header', 'my item summary (x1)', true);
      expectOnlyToShow('li.item-traits');
      helper.expectDetails('li.item-traits > dndgen-details', 'Traits', true);
      helper.expectElements('li.item-traits > dndgen-details li.item-trait', ['my trait', 'my other trait']);
    });
  
    it(`should render an item with magic bonus of 1`, () => {
      const component = fixture.componentInstance;
      component.item = getItem();
      component.item.magic.bonus = 1;

      fixture.detectChanges();
  
      helper.expectDetails('dndgen-details.item-header', 'my item summary (x1)', true);
      expectOnlyToShow('li.item-magic-bonus');
      helper.expectElement('li.item-magic-bonus', 'Bonus: +1');
    });
  
    it(`should render an item with magic bonus of 2`, () => {
      const component = fixture.componentInstance;
      component.item = getItem();
      component.item.magic.bonus = 2;

      fixture.detectChanges();
  
      helper.expectDetails('dndgen-details.item-header', 'my item summary (x1)', true);
      expectOnlyToShow('li.item-magic-bonus');
      helper.expectElement('li.item-magic-bonus', 'Bonus: +2');
    });
  
    it(`should render an item with magic bonus of -1`, () => {
      const component = fixture.componentInstance;
      component.item = getItem();
      component.item.magic.bonus = -1;

      fixture.detectChanges();
  
      helper.expectDetails('dndgen-details.item-header', 'my item summary (x1)', true);
      expectOnlyToShow('li.item-magic-bonus');
      helper.expectElement('li.item-magic-bonus', 'Bonus: -1');
    });
  
    it(`should render an item with magic bonus of -2`, () => {
      const component = fixture.componentInstance;
      component.item = getItem();
      component.item.magic.bonus = -2;

      fixture.detectChanges();
  
      helper.expectDetails('dndgen-details.item-header', 'my item summary (x1)', true);
      expectOnlyToShow('li.item-magic-bonus');
      helper.expectElement('li.item-magic-bonus', 'Bonus: -2');
    });
  
    it(`should render an item with special abilities`, () => {
      const component = fixture.componentInstance;
      component.item = getItem();
      component.item.magic.specialAbilities = [
        new SpecialAbility('my special ability'),
        new SpecialAbility('my other special ability'),
      ];

      fixture.detectChanges();
  
      helper.expectDetails('dndgen-details.item-header', 'my item summary (x1)', true);
      expectOnlyToShow('li.item-magic-special-abilities');
      helper.expectDetails('li.item-magic-special-abilities > dndgen-details', 'Special Abilities', true);
      helper.expectElements('li.item-magic-special-abilities > dndgen-details li.item-magic-special-ability', ['my special ability', 'my other special ability']);
    });
  
    it(`should render an item with magic charges`, () => {
      const component = fixture.componentInstance;
      component.item = getItem();
      component.item.attributes = ['My Attribute', 'Charged', 'My Other Attribute'];
      component.item.magic.charges = 9266;

      fixture.detectChanges();
  
      helper.expectDetails('dndgen-details.item-header', 'my item summary (x1)', true);
      expectOnlyToShow('li.item-magic-charges');
      helper.expectElement('li.item-magic-charges', 'Charges: 9266');
    });
  
    it(`should render an item with magic charges, but uncharged`, () => {
      const component = fixture.componentInstance;
      component.item = getItem();
      component.item.attributes = ['My Attribute', 'Charged', 'My Other Attribute'];
      component.item.magic.charges = 0;

      fixture.detectChanges();
  
      helper.expectDetails('dndgen-details.item-header', 'my item summary (x1)', true);
      expectOnlyToShow('li.item-magic-charges');
      helper.expectElement('li.item-magic-charges', 'Charges: 0');
    });
  
    it(`should render an item with magic curse`, () => {
      const component = fixture.componentInstance;
      component.item = getItem();
      component.item.magic.curse = 'my curse';

      fixture.detectChanges();
  
      helper.expectDetails('dndgen-details.item-header', 'my item summary (x1)', true);
      expectOnlyToShow('li.item-magic-curse');
      helper.expectElement('li.item-magic-curse', 'Curse: my curse');
    });

    function getItem(): Item {
      let item = new Item('my item', 'MyItemType');
      item.summary = 'my item summary';
      item.attributes = ['My Attribute', 'My Other Attribute'];

      return item;
    }
  
    it(`should render an item with magic intelligence`, () => {
      const component = fixture.componentInstance;
      component.item = getItem();
      component.item.magic.intelligence.ego = 9266;
      component.item.magic.intelligence.intelligenceStat = 90210;
      component.item.magic.intelligence.wisdomStat = 42;
      component.item.magic.intelligence.charismaStat = 600;
      component.item.magic.intelligence.alignment = 'intelligence alignment';
      component.item.magic.intelligence.communication = ['interpretive dance', 'miming'];
      component.item.magic.intelligence.senses = 'spidey-sense';
      component.item.magic.intelligence.powers = ['flight', 'super strength'];
      component.item.magic.intelligence.personality = 'gregarious';

      fixture.detectChanges();
  
      helper.expectDetails('dndgen-details.item-header', 'my item summary (x1)', true);
      expectOnlyToShow('li.item-magic-intelligence');
      helper.expectDetails('li.item-magic-intelligence > dndgen-details', 'Intelligence', true);

      const compiled = fixture.nativeElement as HTMLElement;
      const listItems = compiled.querySelectorAll('li.item-magic-intelligence > dndgen-details ul.item-magic-intelligence-details > li');
      expect(listItems).toBeTruthy();
      expect(listItems?.length).toBe(9);
      expect(listItems?.item(0).textContent).toEqual('Ego: 9266');
      expect(listItems?.item(1).textContent).toEqual('Intelligence: 90210');
      expect(listItems?.item(2).textContent).toEqual('Wisdom: 42');
      expect(listItems?.item(3).textContent).toEqual('Charisma: 600');
      expect(listItems?.item(4).textContent).toEqual('Alignment: intelligence alignment');

      const communication = listItems?.item(5) as HTMLElement;
      expect(communication.getAttribute('class')).toEqual('item-magic-intelligence-communication');

      helper.expectElement('.item-magic-intelligence-communication span', 'Communication:');

      const communicationListItems = compiled.querySelectorAll('li.item-magic-intelligence-communication li');
      expect(communicationListItems).toBeTruthy();
      expect(communicationListItems?.length).toBe(2);
      expect(communicationListItems?.item(0).textContent).toEqual('interpretive dance');
      expect(communicationListItems?.item(1).textContent).toEqual('miming');
      helper.expectExists('li.item-magic-intelligence-languages', false);

      expect(listItems?.item(6).textContent).toEqual('Senses: spidey-sense');

      const powers = listItems?.item(7) as HTMLElement;
      expect(powers.getAttribute('class')).toEqual('item-magic-intelligence-powers');

      helper.expectElement('li.item-magic-intelligence-powers span', 'Powers:');
      helper.expectElements('li.item-magic-intelligence-powers li', ['flight', 'super strength']);

      helper.expectExists('li.item-magic-intelligence-special-purpose', false);
      helper.expectExists('li.item-magic-intelligence-dedicated-power', false);

      expect(listItems?.item(8).textContent).toEqual('Personality: gregarious');
    });
  
    it(`should render an item with magic intelligence with languages`, () => {
      const component = fixture.componentInstance;
      component.item = getItem();
      component.item.magic.intelligence.ego = 9266;
      component.item.magic.intelligence.intelligenceStat = 90210;
      component.item.magic.intelligence.wisdomStat = 42;
      component.item.magic.intelligence.charismaStat = 600;
      component.item.magic.intelligence.alignment = 'intelligence alignment';
      component.item.magic.intelligence.communication = ['interpretive dance', 'miming'];
      component.item.magic.intelligence.languages = ['English', 'German'];
      component.item.magic.intelligence.senses = 'spidey-sense';
      component.item.magic.intelligence.powers = ['flight', 'super strength'];
      component.item.magic.intelligence.personality = 'gregarious';

      fixture.detectChanges();
  
      helper.expectDetails('dndgen-details.item-header', 'my item summary (x1)', true);
      expectOnlyToShow('li.item-magic-intelligence');
      helper.expectDetails('li.item-magic-intelligence > dndgen-details', 'Intelligence', true);

      const compiled = fixture.nativeElement as HTMLElement;
      const listItems = compiled.querySelectorAll('li.item-magic-intelligence > dndgen-details ul.item-magic-intelligence-details > li');
      expect(listItems).toBeTruthy();
      expect(listItems?.length).toBe(9);
      expect(listItems?.item(0).textContent).toEqual('Ego: 9266');
      expect(listItems?.item(1).textContent).toEqual('Intelligence: 90210');
      expect(listItems?.item(2).textContent).toEqual('Wisdom: 42');
      expect(listItems?.item(3).textContent).toEqual('Charisma: 600');
      expect(listItems?.item(4).textContent).toEqual('Alignment: intelligence alignment');

      const communication = listItems?.item(5) as HTMLElement;
      expect(communication.getAttribute('class')).toEqual('item-magic-intelligence-communication');

      helper.expectElement('.item-magic-intelligence-communication span', 'Communication:');

      const communicationListItems = compiled.querySelectorAll('li.item-magic-intelligence-communication > ul > li');
      expect(communicationListItems).toBeTruthy();
      expect(communicationListItems?.length).toBe(3);
      expect(communicationListItems?.item(0).textContent).toEqual('interpretive dance');
      expect(communicationListItems?.item(1).textContent).toEqual('miming');
      expect(communicationListItems?.item(2).getAttribute('class')).toEqual('item-magic-intelligence-languages');

      helper.expectExists('li.item-magic-intelligence-languages', true);
      helper.expectDetails('li.item-magic-intelligence-languages > dndgen-details', 'Languages', true);
      helper.expectElements('li.item-magic-intelligence-languages > dndgen-details li', ['English', 'German']);
      
      expect(listItems?.item(6).textContent).toEqual('Senses: spidey-sense');

      const powers = listItems?.item(7) as HTMLElement;
      expect(powers.getAttribute('class')).toEqual('item-magic-intelligence-powers');

      helper.expectElement('.item-magic-intelligence-powers span', 'Powers:');
      helper.expectElements('li.item-magic-intelligence-powers li', ['flight', 'super strength']);

      helper.expectExists('li.item-magic-intelligence-special-purpose', false);
      helper.expectExists('li.item-magic-intelligence-dedicated-power', false);

      expect(listItems?.item(8).textContent).toEqual('Personality: gregarious');
    });
  
    it(`should render an item with magic intelligence with special purpose`, () => {
      const component = fixture.componentInstance;
      component.item = getItem();
      component.item.magic.intelligence.ego = 9266;
      component.item.magic.intelligence.intelligenceStat = 90210;
      component.item.magic.intelligence.wisdomStat = 42;
      component.item.magic.intelligence.charismaStat = 600;
      component.item.magic.intelligence.alignment = 'intelligence alignment';
      component.item.magic.intelligence.communication = ['interpretive dance', 'miming'];
      component.item.magic.intelligence.senses = 'spidey-sense';
      component.item.magic.intelligence.powers = ['flight', 'super strength'];
      component.item.magic.intelligence.specialPurpose = 'to fight crime';
      component.item.magic.intelligence.dedicatedPower = 'get really, really mad';
      component.item.magic.intelligence.personality = 'gregarious';

      fixture.detectChanges();
  
      helper.expectDetails('dndgen-details.item-header', 'my item summary (x1)', true);
      expectOnlyToShow('li.item-magic-intelligence');
      helper.expectDetails('li.item-magic-intelligence > dndgen-details', 'Intelligence', true);

      const compiled = fixture.nativeElement as HTMLElement;
      const listItems = compiled.querySelectorAll('li.item-magic-intelligence > dndgen-details ul.item-magic-intelligence-details > li');
      expect(listItems).toBeTruthy();
      expect(listItems?.length).toBe(11);
      expect(listItems?.item(0).textContent).toEqual('Ego: 9266');
      expect(listItems?.item(1).textContent).toEqual('Intelligence: 90210');
      expect(listItems?.item(2).textContent).toEqual('Wisdom: 42');
      expect(listItems?.item(3).textContent).toEqual('Charisma: 600');
      expect(listItems?.item(4).textContent).toEqual('Alignment: intelligence alignment');

      const communication = listItems?.item(5) as HTMLElement;
      expect(communication.getAttribute('class')).toEqual('item-magic-intelligence-communication');

      helper.expectElement('.item-magic-intelligence-communication span', 'Communication:');

      const communicationListItems = compiled.querySelectorAll('li.item-magic-intelligence-communication li');
      expect(communicationListItems).toBeTruthy();
      expect(communicationListItems?.length).toBe(2);
      expect(communicationListItems?.item(0).textContent).toEqual('interpretive dance');
      expect(communicationListItems?.item(1).textContent).toEqual('miming');

      helper.expectExists('li.item-magic-intelligence-languages', false);

      expect(listItems?.item(6).textContent).toEqual('Senses: spidey-sense');

      const powers = listItems?.item(7) as HTMLElement;
      expect(powers.getAttribute('class')).toEqual('item-magic-intelligence-powers');

      helper.expectElement('.item-magic-intelligence-powers span', 'Powers:');
      helper.expectElements('li.item-magic-intelligence-powers li', ['flight', 'super strength']);

      expect(listItems?.item(8).getAttribute('class')).toEqual('item-magic-intelligence-special-purpose');
      helper.expectExists('li.item-magic-intelligence-special-purpose', true);
      helper.expectElement('li.item-magic-intelligence-special-purpose', 'Special Purpose: to fight crime');

      expect(listItems?.item(9).getAttribute('class')).toEqual('item-magic-intelligence-dedicated-power');
      helper.expectExists('li.item-magic-intelligence-dedicated-power', true);
      helper.expectElement('li.item-magic-intelligence-dedicated-power', 'Dedicated Power: get really, really mad');

      expect(listItems?.item(10).textContent).toEqual('Personality: gregarious');
    });
  
    it(`should render an item with magic intelligence with no personality`, () => {
      const component = fixture.componentInstance;
      component.item = getItem();
      component.item.magic.intelligence.ego = 9266;
      component.item.magic.intelligence.intelligenceStat = 90210;
      component.item.magic.intelligence.wisdomStat = 42;
      component.item.magic.intelligence.charismaStat = 600;
      component.item.magic.intelligence.alignment = 'intelligence alignment';
      component.item.magic.intelligence.communication = ['interpretive dance', 'miming'];
      component.item.magic.intelligence.senses = 'spidey-sense';
      component.item.magic.intelligence.powers = ['flight', 'super strength'];
      component.item.magic.intelligence.personality = '';

      fixture.detectChanges();
  
      helper.expectDetails('dndgen-details.item-header', 'my item summary (x1)', true);
      expectOnlyToShow('li.item-magic-intelligence');
      helper.expectDetails('li.item-magic-intelligence > dndgen-details', 'Intelligence', true);

      const compiled = fixture.nativeElement as HTMLElement;
      const listItems = compiled.querySelectorAll('li.item-magic-intelligence > dndgen-details ul.item-magic-intelligence-details > li');
      expect(listItems).toBeTruthy();
      expect(listItems?.length).toBe(9);
      expect(listItems?.item(0).textContent).toEqual('Ego: 9266');
      expect(listItems?.item(1).textContent).toEqual('Intelligence: 90210');
      expect(listItems?.item(2).textContent).toEqual('Wisdom: 42');
      expect(listItems?.item(3).textContent).toEqual('Charisma: 600');
      expect(listItems?.item(4).textContent).toEqual('Alignment: intelligence alignment');

      const communication = listItems?.item(5) as HTMLElement;
      expect(communication.getAttribute('class')).toEqual('item-magic-intelligence-communication');

      helper.expectElement('.item-magic-intelligence-communication span', 'Communication:');

      const communicationListItems = compiled.querySelectorAll('li.item-magic-intelligence-communication li');
      expect(communicationListItems).toBeTruthy();
      expect(communicationListItems?.length).toBe(2);
      expect(communicationListItems?.item(0).textContent).toEqual('interpretive dance');
      expect(communicationListItems?.item(1).textContent).toEqual('miming');

      helper.expectExists('li.item-magic-intelligence-languages', false);

      expect(listItems?.item(6).textContent).toEqual('Senses: spidey-sense');

      const powers = listItems?.item(7) as HTMLElement;
      expect(powers.getAttribute('class')).toEqual('item-magic-intelligence-powers');

      helper.expectElement('.item-magic-intelligence-powers span', 'Powers:');
      helper.expectElements('li.item-magic-intelligence-powers li', ['flight', 'super strength']);

      helper.expectExists('li.item-magic-intelligence-special-purpose', false);
      helper.expectExists('li.item-magic-intelligence-dedicated-power', false);

      expect(listItems?.item(8).textContent).toEqual('Personality: None');
    });
  
    it(`should render armor`, () => {
      const component = fixture.componentInstance;
      component.item = getArmor();

      fixture.detectChanges();
  
      helper.expectDetails('dndgen-details.item-header', 'my armor summary (x1)', true);
      expectOnlyToShow('li.item-armor');
      helper.expectDetails('li.item-armor > dndgen-details', 'Armor', true);

      const compiled = fixture.nativeElement as HTMLElement;
      const listItems = compiled.querySelectorAll('li.item-armor > dndgen-details ul.item-armor-details > li');
      expect(listItems).toBeTruthy();
      expect(listItems?.length).toEqual(4);
      expect(listItems?.item(0).textContent).toEqual('Size: my size');
      expect(listItems?.item(1).textContent).toEqual('Armor Bonus: 1337');
      expect(listItems?.item(2).textContent).toEqual('Armor Check Penalty: -1336');
      expect(listItems?.item(3).textContent).toEqual('Max Dexterity Bonus: 96');
      expect(listItems?.item(3).getAttribute('class')).toEqual('item-armor-max-dex');
      helper.expectExists('li.item-armor-max-dex', true);
    });

    function getArmor(): Armor {
      let armor = new Armor('my armor', 'Armor');
      armor.summary = 'my armor summary';
      armor.attributes = ['My Attribute', 'My Other Attribute'];
      armor.size = 'my size';
      armor.totalArmorBonus = 1337;
      armor.totalArmorCheckPenalty = -1336;
      armor.totalMaxDexterityBonus = 96;

      return armor;
    }
  
    it(`should render armor without max dexterity bonus`, () => {
      const armor = getArmor();
      armor.totalMaxDexterityBonus = 100;

      const component = fixture.componentInstance;
      component.item = armor;

      fixture.detectChanges();
  
      helper.expectDetails('dndgen-details.item-header', 'my armor summary (x1)', true);
      expectOnlyToShow('li.item-armor');
      helper.expectDetails('li.item-armor > dndgen-details', 'Armor', true);

      const compiled = fixture.nativeElement as HTMLElement;
      const listItems = compiled.querySelectorAll('li.item-armor > dndgen-details ul.item-armor-details > li');
      expect(listItems).toBeTruthy();
      expect(listItems?.length).toEqual(3);
      expect(listItems?.item(0).textContent).toEqual('Size: my size');
      expect(listItems?.item(1).textContent).toEqual('Armor Bonus: 1337');
      expect(listItems?.item(2).textContent).toEqual('Armor Check Penalty: -1336');
      helper.expectExists('li.item-armor-max-dex', false);
    });
  
    it(`should render weapon v1`, () => {
      const component = fixture.componentInstance;
      component.item = getWeapon();

      fixture.detectChanges();
  
      helper.expectDetails('dndgen-details.item-header', 'my weapon summary (x1)', true);
      expectOnlyToShow('li.item-weapon');
      helper.expectDetails('li.item-weapon > dndgen-details', 'Weapon', true);

      const compiled = fixture.nativeElement as HTMLElement;
      const listItems = compiled.querySelectorAll('li.item-weapon > dndgen-details ul.item-weapon-details > li');
      expect(listItems).toBeTruthy();
      expect(listItems?.length).toEqual(5);
      expect(listItems?.item(0).textContent).toEqual('Size: my size');
      expect(listItems?.item(1).textContent).toEqual('Combat Types: stabbing, tickling');
      expect(listItems?.item(2).textContent).toEqual('Damage: my damage description');
      helper.expectExists('li.item-weapon-2nd-damage', false);
      expect(listItems?.item(3).textContent).toEqual('Threat Range: my threat range');
      expect(listItems?.item(4).textContent).toEqual('Critical Damage: my critical damage description');
      helper.expectExists('li.item-weapon-2nd-crit', false);
      helper.expectExists('li.item-weapon-ammo', false);
    });
  
    it(`should render weapon v2`, () => {
      const weapon = getWeapon();
      weapon.damageDescription = '';
      weapon.damageSummary = 'my damage summary';
      weapon.threatRangeDescription = '';
      weapon.threatRangeSummary = 'my threat range summary';
      weapon.criticalDamageDescription = '';
      weapon.criticalDamageSummary = 'my critical damage summary';

      const component = fixture.componentInstance;
      component.item = weapon;

      fixture.detectChanges();
  
      helper.expectDetails('dndgen-details.item-header', 'my weapon summary (x1)', true);
      expectOnlyToShow('li.item-weapon');
      helper.expectDetails('li.item-weapon > dndgen-details', 'Weapon', true);

      const compiled = fixture.nativeElement as HTMLElement;
      const listItems = compiled.querySelectorAll('li.item-weapon > dndgen-details ul.item-weapon-details > li');
      expect(listItems).toBeTruthy();
      expect(listItems?.length).toEqual(5);
      expect(listItems?.item(0).textContent).toEqual('Size: my size');
      expect(listItems?.item(1).textContent).toEqual('Combat Types: stabbing, tickling');
      expect(listItems?.item(2).textContent).toEqual('Damage: my damage summary');
      helper.expectExists('li.item-weapon-2nd-damage', false);
      expect(listItems?.item(3).textContent).toEqual('Threat Range: my threat range summary');
      expect(listItems?.item(4).textContent).toEqual('Critical Damage: my critical damage summary');
      helper.expectExists('li.item-weapon-2nd-crit', false);
      helper.expectExists('li.item-weapon-ammo', false);
    });

    function getWeapon(): Weapon {
      let weapon = new Weapon('my weapon', 'Weapon');
      weapon.canBeUsedAsWeaponOrArmor = true;
      weapon.summary = 'my weapon summary';
      weapon.attributes = ['My Attribute', 'My Other Attribute'];
      weapon.size = 'my size';
      weapon.combatTypes = ['stabbing', 'tickling'];
      weapon.damageDescription = 'my damage description';
      weapon.threatRangeDescription = 'my threat range';
      weapon.criticalDamageDescription = 'my critical damage description';

      return weapon;
    }
  
    it(`should render double weapon v1`, () => {
      const weapon = getWeapon();
      weapon.isDoubleWeapon = true;
      weapon.secondaryDamageDescription = 'my secondary damage description';
      weapon.secondaryCriticalDamageDescription = 'my secondary critical damage description';

      const component = fixture.componentInstance;
      component.item = weapon;

      fixture.detectChanges();
  
      helper.expectDetails('dndgen-details.item-header', 'my weapon summary (x1)', true);
      expectOnlyToShow('li.item-weapon');
      helper.expectDetails('li.item-weapon > dndgen-details', 'Weapon', true);

      const compiled = fixture.nativeElement as HTMLElement;
      const listItems = compiled.querySelectorAll('li.item-weapon > dndgen-details ul.item-weapon-details > li');
      expect(listItems).toBeTruthy();
      expect(listItems?.length).toEqual(7);
      expect(listItems?.item(0).textContent).toEqual('Size: my size');
      expect(listItems?.item(1).textContent).toEqual('Combat Types: stabbing, tickling');
      expect(listItems?.item(2).textContent).toEqual('Damage: my damage description');
      expect(listItems?.item(3).textContent).toEqual('Secondary Damage: my secondary damage description');
      expect(listItems?.item(4).textContent).toEqual('Threat Range: my threat range');
      expect(listItems?.item(5).textContent).toEqual('Critical Damage: my critical damage description');
      expect(listItems?.item(6).textContent).toEqual('Secondary Critical Damage: my secondary critical damage description');
      helper.expectExists('li.item-weapon-ammo', false);
    });
  
    it(`should render double weapon v2`, () => {
      const weapon = getWeapon();
      weapon.damageDescription = '';
      weapon.damageSummary = 'my damage summary';
      weapon.threatRangeDescription = '';
      weapon.threatRangeSummary = 'my threat range summary';
      weapon.criticalDamageDescription = '';
      weapon.criticalDamageSummary = 'my critical damage summary';
      weapon.isDoubleWeapon = true;
      weapon.secondaryDamageDescription = '';
      weapon.secondaryDamageSummary = 'my secondary damage summary';
      weapon.secondaryCriticalDamageDescription = '';
      weapon.secondaryCriticalDamageSummary = 'my secondary critical damage summary';

      const component = fixture.componentInstance;
      component.item = weapon;

      fixture.detectChanges();
  
      helper.expectDetails('dndgen-details.item-header', 'my weapon summary (x1)', true);
      expectOnlyToShow('li.item-weapon');
      helper.expectDetails('li.item-weapon > dndgen-details', 'Weapon', true);

      const compiled = fixture.nativeElement as HTMLElement;
      const listItems = compiled.querySelectorAll('li.item-weapon > dndgen-details ul.item-weapon-details > li');
      expect(listItems).toBeTruthy();
      expect(listItems?.length).toEqual(7);
      expect(listItems?.item(0).textContent).toEqual('Size: my size');
      expect(listItems?.item(1).textContent).toEqual('Combat Types: stabbing, tickling');
      expect(listItems?.item(2).textContent).toEqual('Damage: my damage summary');
      expect(listItems?.item(3).textContent).toEqual('Secondary Damage: my secondary damage summary');
      expect(listItems?.item(4).textContent).toEqual('Threat Range: my threat range summary');
      expect(listItems?.item(5).textContent).toEqual('Critical Damage: my critical damage summary');
      expect(listItems?.item(6).textContent).toEqual('Secondary Critical Damage: my secondary critical damage summary');
      helper.expectExists('li.item-weapon-ammo', false);
    });
  
    it(`should render weapon requiring ammunition`, () => {
      const weapon = getWeapon();
      weapon.ammunition = 'my ammo';

      const component = fixture.componentInstance;
      component.item = weapon;

      fixture.detectChanges();
  
      helper.expectDetails('dndgen-details.item-header', 'my weapon summary (x1)', true);
      expectOnlyToShow('li.item-weapon');
      helper.expectDetails('li.item-weapon > dndgen-details', 'Weapon', true);

      const compiled = fixture.nativeElement as HTMLElement;
      const listItems = compiled.querySelectorAll('li.item-weapon > dndgen-details ul.item-weapon-details > li');
      expect(listItems).toBeTruthy();
      expect(listItems?.length).toEqual(6);
      expect(listItems?.item(0).textContent).toEqual('Size: my size');
      expect(listItems?.item(1).textContent).toEqual('Combat Types: stabbing, tickling');
      expect(listItems?.item(2).textContent).toEqual('Damage: my damage description');
      helper.expectExists('li.item-weapon-2nd-damage', false);
      expect(listItems?.item(3).textContent).toEqual('Threat Range: my threat range');
      expect(listItems?.item(4).textContent).toEqual('Critical Damage: my critical damage description');
      helper.expectExists('li.item-weapon-2nd-crit', false);
      expect(listItems?.item(5).textContent).toEqual('Ammunition Used: my ammo');
    });
  
    it(`should render an item with everything`, () => {
      const component = fixture.componentInstance;
      component.item = getItem();
      component.item.quantity = 9266;
      component.item.contents = ['my contents', 'my other contents'];
      component.item.traits = ['my trait', 'my other trait'];
      component.item.magic.bonus = 90210;
      component.item.magic.specialAbilities = [
        new SpecialAbility('my special ability'),
        new SpecialAbility('my other special ability'),
      ];
      component.item.attributes = ['My Attribute', 'Charged', 'My Other Attribute'];
      component.item.magic.charges = 42;
      component.item.magic.curse = 'my curse';
      component.item.magic.intelligence.ego = 600;
      component.item.magic.intelligence.intelligenceStat = 1337;
      component.item.magic.intelligence.wisdomStat = 1336;
      component.item.magic.intelligence.charismaStat = 96;
      component.item.magic.intelligence.alignment = 'intelligence alignment';
      component.item.magic.intelligence.communication = ['interpretive dance', 'miming'];
      component.item.magic.intelligence.languages = ['English', 'German'];
      component.item.magic.intelligence.senses = 'spidey-sense';
      component.item.magic.intelligence.powers = ['flight', 'super strength'];
      component.item.magic.intelligence.specialPurpose = 'to fight crime';
      component.item.magic.intelligence.dedicatedPower = 'get really, really mad';
      component.item.magic.intelligence.personality = 'gregarious';

      fixture.detectChanges();
  
      helper.expectDetails('dndgen-details.item-header', 'my item summary (x9266)', true);
      helper.expectExists('li.item-contents', true);
      helper.expectExists('li.item-traits', true);
      helper.expectExists('li.item-magic-bonus', true);
      helper.expectExists('li.item-magic-special-abilities', true);
      helper.expectExists('li.item-magic-charges', true);
      helper.expectExists('li.item-magic-curse', true);
      helper.expectExists('li.item-magic-intelligence', true);
      helper.expectDetails('li.item-contents > dndgen-details', 'Contents', true);
      helper.expectDetails('li.item-traits > dndgen-details', 'Traits', true);
      helper.expectDetails('li.item-magic-special-abilities > dndgen-details', 'Special Abilities', true);
      helper.expectDetails('li.item-magic-intelligence > dndgen-details', 'Intelligence', true);
      helper.expectElements('li.item-contents > dndgen-details li.item-content', ['my contents', 'my other contents']);
      helper.expectElements('li.item-traits > dndgen-details li.item-trait', ['my trait', 'my other trait']);
      helper.expectElement('li.item-magic-bonus', 'Bonus: +90210');
      helper.expectElements('li.item-magic-special-abilities > dndgen-details li.item-magic-special-ability', ['my special ability', 'my other special ability']);
      helper.expectElement('li.item-magic-charges', 'Charges: 42');
      helper.expectElement('li.item-magic-curse', 'Curse: my curse');

      const compiled = fixture.nativeElement as HTMLElement;
      let listItems = compiled.querySelectorAll('li.item-magic-intelligence > dndgen-details ul.item-magic-intelligence-details > li');
      expect(listItems).toBeTruthy();
      expect(listItems?.length).toBe(11);
      expect(listItems?.item(0).textContent).toEqual('Ego: 600');
      expect(listItems?.item(1).textContent).toEqual('Intelligence: 1337');
      expect(listItems?.item(2).textContent).toEqual('Wisdom: 1336');
      expect(listItems?.item(3).textContent).toEqual('Charisma: 96');
      expect(listItems?.item(4).textContent).toEqual('Alignment: intelligence alignment');

      const communication = listItems?.item(5) as HTMLElement;
      expect(communication.getAttribute('class')).toEqual('item-magic-intelligence-communication');

      helper.expectElement('li.item-magic-intelligence-communication span', 'Communication:');

      const communicationListItems = compiled.querySelectorAll('li.item-magic-intelligence-communication ul.item-magic-intelligence-communication-details > li');
      expect(communicationListItems).toBeTruthy();
      expect(communicationListItems?.length).toBe(3);
      expect(communicationListItems?.item(0).textContent).toEqual('interpretive dance');
      expect(communicationListItems?.item(1).textContent).toEqual('miming');
      expect(communicationListItems?.item(2).getAttribute('class')).toEqual('item-magic-intelligence-languages');

      helper.expectExists('li.item-magic-intelligence-languages', true);
      helper.expectDetails('li.item-magic-intelligence-languages > dndgen-details', 'Languages', true);
      helper.expectElements('li.item-magic-intelligence-languages > dndgen-details li', ['English', 'German']);

      expect(listItems?.item(6).textContent).toEqual('Senses: spidey-sense');

      const powers = listItems?.item(7) as HTMLElement;
      expect(powers.getAttribute('class')).toEqual('item-magic-intelligence-powers');

      helper.expectElement('li.item-magic-intelligence-powers span', 'Powers:');
      helper.expectElements('li.item-magic-intelligence-powers li', ['flight', 'super strength']);

      expect(listItems?.item(8).getAttribute('class')).toEqual('item-magic-intelligence-special-purpose');
      helper.expectExists('li.item-magic-intelligence-special-purpose', true);
      helper.expectElement('li.item-magic-intelligence-special-purpose', 'Special Purpose: to fight crime');

      expect(listItems?.item(9).getAttribute('class')).toEqual('item-magic-intelligence-dedicated-power');
      helper.expectExists('li.item-magic-intelligence-dedicated-power', true);
      helper.expectElement('li.item-magic-intelligence-dedicated-power', 'Dedicated Power: get really, really mad');

      expect(listItems?.item(10).textContent).toEqual('Personality: gregarious');
      helper.expectExists('li.item-armor', false);
      helper.expectExists('li.item-weapon', false);
    });
  
    it(`should render armor with everything`, () => {
      const armor = getArmor();
      armor.quantity = 9266;
      armor.contents = ['my contents', 'my other contents'];
      armor.traits = ['my trait', 'my other trait'];
      armor.magic.bonus = 90210;
      armor.magic.specialAbilities = [
        new SpecialAbility('my special ability'),
        new SpecialAbility('my other special ability'),
      ];
      armor.attributes = ['My Attribute', 'Charged', 'My Other Attribute'];
      armor.magic.charges = 42;
      armor.magic.curse = 'my curse';
      armor.magic.intelligence.ego = 600;
      armor.magic.intelligence.intelligenceStat = 1337;
      armor.magic.intelligence.wisdomStat = 1336;
      armor.magic.intelligence.charismaStat = 96;
      armor.magic.intelligence.alignment = 'intelligence alignment';
      armor.magic.intelligence.communication = ['interpretive dance', 'miming'];
      armor.magic.intelligence.languages = ['English', 'German'];
      armor.magic.intelligence.senses = 'spidey-sense';
      armor.magic.intelligence.powers = ['flight', 'super strength'];
      armor.magic.intelligence.specialPurpose = 'to fight crime';
      armor.magic.intelligence.dedicatedPower = 'get really, really mad';
      armor.magic.intelligence.personality = 'gregarious';
      armor.totalArmorBonus = 783;
      armor.totalArmorCheckPenalty = -8245;
      armor.totalMaxDexterityBonus = 9;

      const component = fixture.componentInstance;
      component.item = armor;

      fixture.detectChanges();
  
      helper.expectDetails('dndgen-details.item-header', 'my armor summary (x9266)', true);
      helper.expectExists('li.item-contents', true);
      helper.expectExists('li.item-traits', true);
      helper.expectExists('li.item-magic-bonus', true);
      helper.expectExists('li.item-magic-special-abilities', true);
      helper.expectExists('li.item-magic-charges', true);
      helper.expectExists('li.item-magic-curse', true);
      helper.expectExists('li.item-magic-intelligence', true);
      helper.expectDetails('li.item-contents > dndgen-details', 'Contents', true);
      helper.expectDetails('li.item-traits > dndgen-details', 'Traits', true);
      helper.expectDetails('li.item-magic-special-abilities > dndgen-details', 'Special Abilities', true);
      helper.expectDetails('li.item-magic-intelligence > dndgen-details', 'Intelligence', true);
      helper.expectElements('li.item-contents > dndgen-details li.item-content', ['my contents', 'my other contents']);
      helper.expectElements('li.item-traits > dndgen-details li.item-trait', ['my trait', 'my other trait']);
      helper.expectElement('li.item-magic-bonus', 'Bonus: +90210');
      helper.expectElements('li.item-magic-special-abilities > dndgen-details li.item-magic-special-ability', ['my special ability', 'my other special ability']);
      helper.expectElement('li.item-magic-charges', 'Charges: 42');
      helper.expectElement('li.item-magic-curse', 'Curse: my curse');

      const compiled = fixture.nativeElement as HTMLElement;
      let listItems = compiled.querySelectorAll('li.item-magic-intelligence > dndgen-details ul.item-magic-intelligence-details > li');
      expect(listItems).toBeTruthy();
      expect(listItems?.length).toBe(11);
      expect(listItems?.item(0).textContent).toEqual('Ego: 600');
      expect(listItems?.item(1).textContent).toEqual('Intelligence: 1337');
      expect(listItems?.item(2).textContent).toEqual('Wisdom: 1336');
      expect(listItems?.item(3).textContent).toEqual('Charisma: 96');
      expect(listItems?.item(4).textContent).toEqual('Alignment: intelligence alignment');

      const communication = listItems?.item(5) as HTMLElement;
      expect(communication.getAttribute('class')).toEqual('item-magic-intelligence-communication');

      helper.expectElement('li.item-magic-intelligence-communication span', 'Communication:');

      const communicationListItems = compiled.querySelectorAll('li.item-magic-intelligence-communication ul.item-magic-intelligence-communication-details > li');
      expect(communicationListItems).toBeTruthy();
      expect(communicationListItems?.length).toBe(3);
      expect(communicationListItems?.item(0).textContent).toEqual('interpretive dance');
      expect(communicationListItems?.item(1).textContent).toEqual('miming');
      expect(communicationListItems?.item(2).getAttribute('class')).toEqual('item-magic-intelligence-languages');

      helper.expectExists('li.item-magic-intelligence-languages', true);
      helper.expectDetails('li.item-magic-intelligence-languages > dndgen-details', 'Languages', true);
      helper.expectElements('li.item-magic-intelligence-languages > dndgen-details li', ['English', 'German']);

      expect(listItems?.item(6).textContent).toEqual('Senses: spidey-sense');

      const powers = listItems?.item(7) as HTMLElement;
      expect(powers.getAttribute('class')).toEqual('item-magic-intelligence-powers');

      helper.expectElement('li.item-magic-intelligence-powers span', 'Powers:');
      helper.expectElements('li.item-magic-intelligence-powers li', ['flight', 'super strength']);

      expect(listItems?.item(8).getAttribute('class')).toEqual('item-magic-intelligence-special-purpose');
      helper.expectExists('li.item-magic-intelligence-special-purpose', true);
      helper.expectElement('li.item-magic-intelligence-special-purpose', 'Special Purpose: to fight crime');

      expect(listItems?.item(9).getAttribute('class')).toEqual('item-magic-intelligence-dedicated-power');
      helper.expectExists('li.item-magic-intelligence-dedicated-power', true);
      helper.expectElement('li.item-magic-intelligence-dedicated-power', 'Dedicated Power: get really, really mad');

      expect(listItems?.item(10).textContent).toEqual('Personality: gregarious');
      
      let armorElement = compiled!.querySelector('li.item-armor');
      expect(armorElement).not.toBeNull();
      expect(armorElement).toBeTruthy();
      helper.expectExists('li.item-armor', true);
      
      helper.expectDetails('li.item-armor > dndgen-details', 'Armor', true);

      listItems = compiled.querySelectorAll('li.item-armor > dndgen-details ul.item-armor-details > li');
      expect(listItems).toBeTruthy();
      expect(listItems?.length).toEqual(4);
      expect(listItems?.item(0).textContent).toEqual('Size: my size');
      expect(listItems?.item(1).textContent).toEqual('Armor Bonus: 783');
      expect(listItems?.item(2).textContent).toEqual('Armor Check Penalty: -8245');
      expect(listItems?.item(3).textContent).toEqual('Max Dexterity Bonus: 9');
      expect(listItems?.item(3).getAttribute('class')).toEqual('item-armor-max-dex');
      helper.expectExists('li.item-armor-max-dex', true);

      helper.expectExists('li.item-weapon', false);
    });
  
    it(`should render weapon with everything`, () => {
      const weapon = getWeapon();
      weapon.quantity = 9266;
      weapon.contents = ['my contents', 'my other contents'];
      weapon.traits = ['my trait', 'my other trait'];
      weapon.magic.bonus = 90210;
      weapon.magic.specialAbilities = [
        new SpecialAbility('my special ability'),
        new SpecialAbility('my other special ability'),
      ];
      weapon.attributes = ['My Attribute', 'Charged', 'My Other Attribute'];
      weapon.magic.charges = 42;
      weapon.magic.curse = 'my curse';
      weapon.magic.intelligence.ego = 600;
      weapon.magic.intelligence.intelligenceStat = 1337;
      weapon.magic.intelligence.wisdomStat = 1336;
      weapon.magic.intelligence.charismaStat = 96;
      weapon.magic.intelligence.alignment = 'intelligence alignment';
      weapon.magic.intelligence.communication = ['interpretive dance', 'miming'];
      weapon.magic.intelligence.languages = ['English', 'German'];
      weapon.magic.intelligence.senses = 'spidey-sense';
      weapon.magic.intelligence.powers = ['flight', 'super strength'];
      weapon.magic.intelligence.specialPurpose = 'to fight crime';
      weapon.magic.intelligence.dedicatedPower = 'get really, really mad';
      weapon.magic.intelligence.personality = 'gregarious';
      weapon.isDoubleWeapon = true;
      weapon.secondaryDamageDescription = 'my secondary damage description';
      weapon.secondaryCriticalDamageDescription = 'my secondary critical damage description';
      weapon.ammunition = 'my ammunition';

      const component = fixture.componentInstance;
      component.item = weapon;

      fixture.detectChanges();
  
      helper.expectDetails('dndgen-details.item-header', 'my weapon summary (x9266)', true);
      helper.expectExists('li.item-contents', true);
      helper.expectExists('li.item-traits', true);
      helper.expectExists('li.item-magic-bonus', true);
      helper.expectExists('li.item-magic-special-abilities', true);
      helper.expectExists('li.item-magic-charges', true);
      helper.expectExists('li.item-magic-curse', true);
      helper.expectExists('li.item-magic-intelligence', true);
      helper.expectDetails('li.item-contents > dndgen-details', 'Contents', true);
      helper.expectDetails('li.item-traits > dndgen-details', 'Traits', true);
      helper.expectDetails('li.item-magic-special-abilities > dndgen-details', 'Special Abilities', true);
      helper.expectDetails('li.item-magic-intelligence > dndgen-details', 'Intelligence', true);
      helper.expectElements('li.item-contents > dndgen-details li.item-content', ['my contents', 'my other contents']);
      helper.expectElements('li.item-traits > dndgen-details li.item-trait', ['my trait', 'my other trait']);
      helper.expectElement('li.item-magic-bonus', 'Bonus: +90210');
      helper.expectElements('li.item-magic-special-abilities > dndgen-details li.item-magic-special-ability', ['my special ability', 'my other special ability']);
      helper.expectElement('li.item-magic-charges', 'Charges: 42');
      helper.expectElement('li.item-magic-curse', 'Curse: my curse');

      const compiled = fixture.nativeElement as HTMLElement;
      let listItems = compiled.querySelectorAll('li.item-magic-intelligence > dndgen-details ul.item-magic-intelligence-details > li');
      expect(listItems).toBeTruthy();
      expect(listItems?.length).toBe(11);
      expect(listItems?.item(0).textContent).toEqual('Ego: 600');
      expect(listItems?.item(1).textContent).toEqual('Intelligence: 1337');
      expect(listItems?.item(2).textContent).toEqual('Wisdom: 1336');
      expect(listItems?.item(3).textContent).toEqual('Charisma: 96');
      expect(listItems?.item(4).textContent).toEqual('Alignment: intelligence alignment');

      const communication = listItems?.item(5) as HTMLElement;
      expect(communication.getAttribute('class')).toEqual('item-magic-intelligence-communication');

      helper.expectElement('li.item-magic-intelligence-communication span', 'Communication:');

      const communicationListItems = compiled.querySelectorAll('li.item-magic-intelligence-communication ul.item-magic-intelligence-communication-details > li');
      expect(communicationListItems).toBeTruthy();
      expect(communicationListItems?.length).toBe(3);
      expect(communicationListItems?.item(0).textContent).toEqual('interpretive dance');
      expect(communicationListItems?.item(1).textContent).toEqual('miming');
      expect(communicationListItems?.item(2).getAttribute('class')).toEqual('item-magic-intelligence-languages');

      helper.expectExists('li.item-magic-intelligence-languages', true);
      helper.expectDetails('li.item-magic-intelligence-languages > dndgen-details', 'Languages', true);
      helper.expectElements('li.item-magic-intelligence-languages > dndgen-details li', ['English', 'German']);

      expect(listItems?.item(6).textContent).toEqual('Senses: spidey-sense');

      const powers = listItems?.item(7) as HTMLElement;
      expect(powers.getAttribute('class')).toEqual('item-magic-intelligence-powers');

      helper.expectElement('li.item-magic-intelligence-powers span', 'Powers:');
      helper.expectElements('li.item-magic-intelligence-powers li', ['flight', 'super strength']);

      expect(listItems?.item(8).getAttribute('class')).toEqual('item-magic-intelligence-special-purpose');
      helper.expectExists('li.item-magic-intelligence-special-purpose', true);
      helper.expectElement('li.item-magic-intelligence-special-purpose', 'Special Purpose: to fight crime');

      expect(listItems?.item(9).getAttribute('class')).toEqual('item-magic-intelligence-dedicated-power');
      helper.expectExists('li.item-magic-intelligence-dedicated-power', true);
      helper.expectElement('li.item-magic-intelligence-dedicated-power', 'Dedicated Power: get really, really mad');

      expect(listItems?.item(10).textContent).toEqual('Personality: gregarious');

      helper.expectExists('li.item-armor', false);
      
      helper.expectExists('li.item-weapon', true);
      
      helper.expectDetails('li.item-weapon > dndgen-details', 'Weapon', true);

      listItems = compiled.querySelectorAll('li.item-weapon > dndgen-details ul.item-weapon-details > li');
      expect(listItems).toBeTruthy();
      expect(listItems?.length).toEqual(8);
      expect(listItems?.item(0).textContent).toEqual('Size: my size');
      expect(listItems?.item(1).textContent).toEqual('Combat Types: stabbing, tickling');
      expect(listItems?.item(2).textContent).toEqual('Damage: my damage description');
      expect(listItems?.item(3).getAttribute('class')).toEqual('item-weapon-2nd-damage');
      helper.expectExists('li.item-weapon-2nd-damage', true);
      expect(listItems?.item(3).textContent).toEqual('Secondary Damage: my secondary damage description');
      expect(listItems?.item(4).textContent).toEqual('Threat Range: my threat range');
      expect(listItems?.item(5).textContent).toEqual('Critical Damage: my critical damage description');
      expect(listItems?.item(6).getAttribute('class')).toEqual('item-weapon-2nd-crit');
      helper.expectExists('li.item-weapon-2nd-crit', true);
      expect(listItems?.item(6).textContent).toEqual('Secondary Critical Damage: my secondary critical damage description');
      expect(listItems?.item(7).getAttribute('class')).toEqual('item-weapon-ammo');
      helper.expectExists('li.item-weapon-ammo', true);
      expect(listItems?.item(7).textContent).toEqual('Ammunition Used: my ammunition');
    });
  });
});
