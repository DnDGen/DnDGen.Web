import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { ItemComponent } from './item.component';
import { AppModule } from '../app.module';
import { Observable } from 'rxjs';
import { Item } from './models/item.model';
import { Armor } from './models/armor.model';
import { Weapon } from './models/weapon.model';
import { SpecialAbility } from './models/specialAbility.model';
import { Magic } from './models/magic.model';
import { CollapsibleListComponent } from '../shared/collapsibleList.component';
import { By } from '@angular/platform-browser';

describe('ItemComponent', () => {
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
  
    it(`should set the weapon `, () => {
      let item = new Weapon('my weapon', 'Weapon');
      item.damageDescription = 'my damage description';

      component.item = item;

      expect(component.item).toBe(item);
      expect(component.weapon).toBe(item);
      expect(component.weapon).toBeInstanceOf(Weapon);
      expect(component.weapon.damageDescription).toEqual('my damage description');
    });
  
    it(`should say is not armor when item`, () => {
      let item = new Item('my item', 'MyItemType');
      component.item = item;

      expect(component.isArmor()).toBeFalse();
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
  
    it(`should say it has no list when no item`, () => {
      expect(component.hasList()).toBeFalse();
    });
  
    it(`should say it has no list when item is boring`, () => {
      component.item = new Item('my item', 'MyItemType');
      component.item.contents = [];
      component.item.traits = [];
      component.item.magic.bonus = 0;
      component.item.attributes = ['My Attribute', 'My Other Attribute'];
      component.item.magic.specialAbilities = [];
      component.item.magic.curse = '';
      component.item.magic.intelligence.ego = 0;

      expect(component.hasList()).toBeFalse();
    });
  
    it(`should say it has list when item has contents`, () => {
      component.item = new Item('my item', 'MyItemType');
      component.item.contents = ['my content'];
      component.item.traits = [];
      component.item.magic.bonus = 0;
      component.item.attributes = ['My Attribute', 'My Other Attribute'];
      component.item.magic.specialAbilities = [];
      component.item.magic.curse = '';
      component.item.magic.intelligence.ego = 0;

      expect(component.hasList()).toBeTrue();
    });
  
    it(`should say it has list when item has traits`, () => {
      component.item = new Item('my item', 'MyItemType');
      component.item.contents = [];
      component.item.traits = ['my trait'];
      component.item.magic.bonus = 0;
      component.item.attributes = ['My Attribute', 'My Other Attribute'];
      component.item.magic.specialAbilities = [];
      component.item.magic.curse = '';
      component.item.magic.intelligence.ego = 0;

      expect(component.hasList()).toBeTrue();
    });
  
    it(`should say it has list when item has magic bonus`, () => {
      component.item = new Item('my item', 'MyItemType');
      component.item.contents = [];
      component.item.traits = [];
      component.item.magic.bonus = 1;
      component.item.attributes = ['My Attribute', 'My Other Attribute'];
      component.item.magic.specialAbilities = [];
      component.item.magic.curse = '';
      component.item.magic.intelligence.ego = 0;

      expect(component.hasList()).toBeTrue();
    });
  
    it(`should say it has list when item has negative magic bonus`, () => {
      component.item = new Item('my item', 'MyItemType');
      component.item.contents = [];
      component.item.traits = [];
      component.item.magic.bonus = -1;
      component.item.attributes = ['My Attribute', 'My Other Attribute'];
      component.item.magic.specialAbilities = [];
      component.item.magic.curse = '';
      component.item.magic.intelligence.ego = 0;

      expect(component.hasList()).toBeTrue();
    });
  
    it(`should say it has list when item has Charged attribute`, () => {
      component.item = new Item('my item', 'MyItemType');
      component.item.contents = [];
      component.item.traits = [];
      component.item.magic.bonus = 0;
      component.item.attributes = ['My Attribute', 'Charged', 'My Other Attribute'];
      component.item.magic.specialAbilities = [];
      component.item.magic.curse = '';
      component.item.magic.intelligence.ego = 0;

      expect(component.hasList()).toBeTrue();
    });
  
    it(`should say it has list when item has a special ability`, () => {
      component.item = new Item('my item', 'MyItemType');
      component.item.contents = [];
      component.item.traits = [];
      component.item.magic.bonus = 0;
      component.item.attributes = ['My Attribute', 'My Other Attribute'];
      component.item.magic.specialAbilities = [new SpecialAbility('my special ability')];
      component.item.magic.curse = '';
      component.item.magic.intelligence.ego = 0;

      expect(component.hasList()).toBeTrue();
    });
  
    it(`should say it has list when item has a curse`, () => {
      component.item = new Item('my item', 'MyItemType');
      component.item.contents = [];
      component.item.traits = [];
      component.item.magic.bonus = 0;
      component.item.attributes = ['My Attribute', 'My Other Attribute'];
      component.item.magic.specialAbilities = [];
      component.item.magic.curse = 'my curse';
      component.item.magic.intelligence.ego = 0;

      expect(component.hasList()).toBeTrue();
    });
  
    it(`should say it has list when item has intelligence`, () => {
      component.item = new Item('my item', 'MyItemType');
      component.item.contents = [];
      component.item.traits = [];
      component.item.magic.bonus = 0;
      component.item.attributes = ['My Attribute', 'My Other Attribute'];
      component.item.magic.specialAbilities = [];
      component.item.magic.curse = '';
      component.item.magic.intelligence.ego = 1;

      expect(component.hasList()).toBeTrue();
    });
  
    it(`should say it has no list when armor is boring`, () => {
      component.item = new Armor('my item', 'MyItemType');
      component.item.contents = [];
      component.item.traits = [];
      component.item.magic.bonus = 0;
      component.item.attributes = ['My Attribute', 'My Other Attribute'];
      component.item.magic.specialAbilities = [];
      component.item.magic.curse = '';
      component.item.magic.intelligence.ego = 0;

      expect(component.hasList()).toBeFalse();
    });
  
    it(`should say it has list when armor has contents`, () => {
      component.item = new Armor('my item', 'MyItemType');
      component.item.contents = ['my content'];
      component.item.traits = [];
      component.item.magic.bonus = 0;
      component.item.attributes = ['My Attribute', 'My Other Attribute'];
      component.item.magic.specialAbilities = [];
      component.item.magic.curse = '';
      component.item.magic.intelligence.ego = 0;

      expect(component.hasList()).toBeTrue();
    });
  
    it(`should say it has list when armor has traits`, () => {
      component.item = new Armor('my item', 'MyItemType');
      component.item.contents = [];
      component.item.traits = ['my trait'];
      component.item.magic.bonus = 0;
      component.item.attributes = ['My Attribute', 'My Other Attribute'];
      component.item.magic.specialAbilities = [];
      component.item.magic.curse = '';
      component.item.magic.intelligence.ego = 0;

      expect(component.hasList()).toBeTrue();
    });
  
    it(`should say it has list when armor has magic bonus`, () => {
      component.item = new Armor('my item', 'MyItemType');
      component.item.contents = [];
      component.item.traits = [];
      component.item.magic.bonus = 1;
      component.item.attributes = ['My Attribute', 'My Other Attribute'];
      component.item.magic.specialAbilities = [];
      component.item.magic.curse = '';
      component.item.magic.intelligence.ego = 0;

      expect(component.hasList()).toBeTrue();
    });
  
    it(`should say it has list when armor has negative magic bonus`, () => {
      component.item = new Armor('my item', 'MyItemType');
      component.item.contents = [];
      component.item.traits = [];
      component.item.magic.bonus = -1;
      component.item.attributes = ['My Attribute', 'My Other Attribute'];
      component.item.magic.specialAbilities = [];
      component.item.magic.curse = '';
      component.item.magic.intelligence.ego = 0;

      expect(component.hasList()).toBeTrue();
    });
  
    it(`should say it has list when armor has Charged attribute`, () => {
      component.item = new Armor('my item', 'MyItemType');
      component.item.contents = [];
      component.item.traits = [];
      component.item.magic.bonus = 0;
      component.item.attributes = ['My Attribute', 'Charged', 'My Other Attribute'];
      component.item.magic.specialAbilities = [];
      component.item.magic.curse = '';
      component.item.magic.intelligence.ego = 0;

      expect(component.hasList()).toBeTrue();
    });
  
    it(`should say it has list when armor has a special ability`, () => {
      component.item = new Armor('my item', 'MyItemType');
      component.item.contents = [];
      component.item.traits = [];
      component.item.magic.bonus = 0;
      component.item.attributes = ['My Attribute', 'My Other Attribute'];
      component.item.magic.specialAbilities = [new SpecialAbility('my special ability')];
      component.item.magic.curse = '';
      component.item.magic.intelligence.ego = 0;

      expect(component.hasList()).toBeTrue();
    });
  
    it(`should say it has list when armor has a curse`, () => {
      component.item = new Armor('my item', 'MyItemType');
      component.item.contents = [];
      component.item.traits = [];
      component.item.magic.bonus = 0;
      component.item.attributes = ['My Attribute', 'My Other Attribute'];
      component.item.magic.specialAbilities = [];
      component.item.magic.curse = 'my curse';
      component.item.magic.intelligence.ego = 0;

      expect(component.hasList()).toBeTrue();
    });
  
    it(`should say it has list when armor has intelligence`, () => {
      component.item = new Armor('my item', 'MyItemType');
      component.item.contents = [];
      component.item.traits = [];
      component.item.magic.bonus = 0;
      component.item.attributes = ['My Attribute', 'My Other Attribute'];
      component.item.magic.specialAbilities = [];
      component.item.magic.curse = '';
      component.item.magic.intelligence.ego = 1;

      expect(component.hasList()).toBeTrue();
    });
  
    it(`should say it has list when armor has armor bonus`, () => {
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

      expect(component.hasList()).toBeTrue();
    });
  
    it(`BUG - should say it has list when armor has cursed armor bonus`, () => {
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

      expect(component.hasList()).toBeTrue();
    });
  
    it(`should say it has no list weapon item is boring`, () => {
      component.item = new Weapon('my item', 'MyItemType');
      component.item.contents = [];
      component.item.traits = [];
      component.item.magic.bonus = 0;
      component.item.attributes = ['My Attribute', 'My Other Attribute'];
      component.item.magic.specialAbilities = [];
      component.item.magic.curse = '';
      component.item.magic.intelligence.ego = 0;

      expect(component.hasList()).toBeFalse();
    });
  
    it(`should say it has list when weapon has contents`, () => {
      component.item = new Weapon('my item', 'MyItemType');
      component.item.contents = ['my content'];
      component.item.traits = [];
      component.item.magic.bonus = 0;
      component.item.attributes = ['My Attribute', 'My Other Attribute'];
      component.item.magic.specialAbilities = [];
      component.item.magic.curse = '';
      component.item.magic.intelligence.ego = 0;

      expect(component.hasList()).toBeTrue();
    });
  
    it(`should say it has list when weapon has traits`, () => {
      component.item = new Weapon('my item', 'MyItemType');
      component.item.contents = [];
      component.item.traits = ['my trait'];
      component.item.magic.bonus = 0;
      component.item.attributes = ['My Attribute', 'My Other Attribute'];
      component.item.magic.specialAbilities = [];
      component.item.magic.curse = '';
      component.item.magic.intelligence.ego = 0;

      expect(component.hasList()).toBeTrue();
    });
  
    it(`should say it has list when weapon has magic bonus`, () => {
      component.item = new Weapon('my item', 'MyItemType');
      component.item.contents = [];
      component.item.traits = [];
      component.item.magic.bonus = 1;
      component.item.attributes = ['My Attribute', 'My Other Attribute'];
      component.item.magic.specialAbilities = [];
      component.item.magic.curse = '';
      component.item.magic.intelligence.ego = 0;

      expect(component.hasList()).toBeTrue();
    });
  
    it(`should say it has list when weapon has negative magic bonus`, () => {
      component.item = new Weapon('my item', 'MyItemType');
      component.item.contents = [];
      component.item.traits = [];
      component.item.magic.bonus = -1;
      component.item.attributes = ['My Attribute', 'My Other Attribute'];
      component.item.magic.specialAbilities = [];
      component.item.magic.curse = '';
      component.item.magic.intelligence.ego = 0;

      expect(component.hasList()).toBeTrue();
    });
  
    it(`should say it has list when weapon has Charged attribute`, () => {
      component.item = new Weapon('my item', 'MyItemType');
      component.item.contents = [];
      component.item.traits = [];
      component.item.magic.bonus = 0;
      component.item.attributes = ['My Attribute', 'Charged', 'My Other Attribute'];
      component.item.magic.specialAbilities = [];
      component.item.magic.curse = '';
      component.item.magic.intelligence.ego = 0;

      expect(component.hasList()).toBeTrue();
    });
  
    it(`should say it has list when weapon has a special ability`, () => {
      component.item = new Weapon('my item', 'MyItemType');
      component.item.contents = [];
      component.item.traits = [];
      component.item.magic.bonus = 0;
      component.item.attributes = ['My Attribute', 'My Other Attribute'];
      component.item.magic.specialAbilities = [new SpecialAbility('my special ability')];
      component.item.magic.curse = '';
      component.item.magic.intelligence.ego = 0;

      expect(component.hasList()).toBeTrue();
    });
  
    it(`should say it has list when weapon has a curse`, () => {
      component.item = new Weapon('my item', 'MyItemType');
      component.item.contents = [];
      component.item.traits = [];
      component.item.magic.bonus = 0;
      component.item.attributes = ['My Attribute', 'My Other Attribute'];
      component.item.magic.specialAbilities = [];
      component.item.magic.curse = 'my curse';
      component.item.magic.intelligence.ego = 0;

      expect(component.hasList()).toBeTrue();
    });
  
    it(`should say it has list when weapon has intelligence`, () => {
      component.item = new Weapon('my item', 'MyItemType');
      component.item.contents = [];
      component.item.traits = [];
      component.item.magic.bonus = 0;
      component.item.attributes = ['My Attribute', 'My Other Attribute'];
      component.item.magic.specialAbilities = [];
      component.item.magic.curse = '';
      component.item.magic.intelligence.ego = 1;

      expect(component.hasList()).toBeTrue();
    });
  
    it(`should say it has list when weapon has damage description`, () => {
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

      expect(component.hasList()).toBeTrue();
    });
  });

  describe('integration', () => {
    let fixture: ComponentFixture<ItemComponent>;
  
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [
          AppModule
        ],
        declarations: [ItemComponent, CollapsibleListComponent]
      }).compileComponents();
  
      fixture = TestBed.createComponent(ItemComponent);
    });
  
    it('should create the component', () => {
      const component = fixture.componentInstance;
      expect(component).toBeTruthy();
    });
  
    it(`should render a boring item`, () => {
      const component = fixture.componentInstance;
      component.item = getItem();

      fixture.detectChanges();
  
      expectCollapsibleList('dndgen-collapsible-list.item-header', 'my item (x1)', false);
    });
  
    it(`should render a boring item with quantity of 2`, () => {
      const component = fixture.componentInstance;
      component.item = getItem();
      component.item.quantity = 2;

      fixture.detectChanges();
  
      expectCollapsibleList('dndgen-collapsible-list.item-header', 'my item (x2)', false);
    });
  
    it(`should render an item with contents`, () => {
      const component = fixture.componentInstance;
      component.item = getItem();
      component.item.contents = ['my contents', 'my other contents'];

      fixture.detectChanges();
  
      expectCollapsibleList('dndgen-collapsible-list.item-header', 'my item (x1)', true);
      expectOnlyToShow('li.item-contents');
      expectCollapsibleList('li.item-contents > dndgen-collapsible-list', 'Contents', true);

      const itemContentsListItems = getAll('li.item-content', ['li.item-contents', 'dndgen-collapsible-list', 'ul']);
      expect(itemContentsListItems).toBeDefined();
      expect(itemContentsListItems?.length).toBe(2);
      expect(itemContentsListItems?.item(0).textContent).toEqual('my contents');
      expect(itemContentsListItems?.item(1).textContent).toEqual('my other contents');
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
        let show = (selectors[i] != selector);
        expectHasAttribute(selectors[i], 'hidden', show);
      }
      
      const compiled = fixture.nativeElement as HTMLElement;

      let armor = compiled!.querySelector('li.item-armor');
      expect(armor).toBeNull();

      let weapon = compiled!.querySelector('li.item-weapon');
      expect(weapon).toBeNull();
    }

    function expectHasAttribute(selector: string, attribute: string, hasAttribute: boolean) {
      const compiled = fixture.nativeElement as HTMLElement;

      const element = compiled!.querySelector(selector);
      expect(element).toBeDefined();
      expect(element?.hasAttribute(attribute)).toBe(hasAttribute);
    }

    function expectCollapsibleList(selector: string, heading: string, hasList: boolean) {
      const element = fixture.debugElement.query(By.css(selector));
      expect(element).toBeDefined();
      expect(element.componentInstance).toBeDefined();
      expect(element.componentInstance).toBeInstanceOf(CollapsibleListComponent);

      const list = element.componentInstance as CollapsibleListComponent;
      expect(list.heading).toEqual(heading);
      expect(list.hasList).toBe(hasList);
    }
  
    it(`should render an item with traits`, () => {
      const component = fixture.componentInstance;
      component.item = getItem();
      component.item.traits = ['my trait', 'my other trait'];

      fixture.detectChanges();
  
      expectCollapsibleList('dndgen-collapsible-list.item-header', 'my item (x1)', true);
      expectOnlyToShow('li.item-traits');
      expectCollapsibleList('li.item-traits > dndgen-collapsible-list', 'Traits', true);

      const itemTraitsListItems = getAll('li.item-trait', ['li.item-traits', 'dndgen-collapsible-list', 'ul']);
      expect(itemTraitsListItems).toBeDefined();
      expect(itemTraitsListItems?.length).toBe(2);
      expect(itemTraitsListItems?.item(0).textContent).toEqual('my trait');
      expect(itemTraitsListItems?.item(1).textContent).toEqual('my other trait');
    });

    function getAll(selector: string, within: string[]): NodeListOf<Element> {
      const compiled = fixture.nativeElement as HTMLElement;

      let parent = compiled;
      for(var i = 0; i < within.length; i++) {
        parent = parent.querySelector(within[i]) as HTMLElement;
      }

      const elements = parent.querySelectorAll(selector);
      return elements;
    }
  
    it(`should render an item with magic bonus of 1`, () => {
      const component = fixture.componentInstance;
      component.item = getItem();
      component.item.magic.bonus = 1;

      fixture.detectChanges();
  
      expectCollapsibleList('dndgen-collapsible-list.item-header', 'my item (x1)', true);
      expectOnlyToShow('li.item-magic-bonus');

      const compiled = fixture.nativeElement as HTMLElement;
      const magicBonus = compiled.querySelector('li.item-magic-bonus');
      expect(magicBonus).toBeDefined();
      expect(magicBonus?.textContent).toEqual('Bonus: +1');
    });
  
    it(`should render an item with magic bonus of 2`, () => {
      const component = fixture.componentInstance;
      component.item = getItem();
      component.item.magic.bonus = 2;

      fixture.detectChanges();
  
      expectCollapsibleList('dndgen-collapsible-list.item-header', 'my item (x1)', true);
      expectOnlyToShow('li.item-magic-bonus');

      const compiled = fixture.nativeElement as HTMLElement;
      const magicBonus = compiled.querySelector('li.item-magic-bonus');
      expect(magicBonus).toBeDefined();
      expect(magicBonus?.textContent).toEqual('Bonus: +2');
    });
  
    it(`should render an item with magic bonus of -1`, () => {
      const component = fixture.componentInstance;
      component.item = getItem();
      component.item.magic.bonus = -1;

      fixture.detectChanges();
  
      expectCollapsibleList('dndgen-collapsible-list.item-header', 'my item (x1)', true);
      expectOnlyToShow('li.item-magic-bonus');

      const compiled = fixture.nativeElement as HTMLElement;
      const magicBonus = compiled.querySelector('li.item-magic-bonus');
      expect(magicBonus).toBeDefined();
      expect(magicBonus?.textContent).toEqual('Bonus: -1');
    });
  
    it(`should render an item with magic bonus of -2`, () => {
      const component = fixture.componentInstance;
      component.item = getItem();
      component.item.magic.bonus = -2;

      fixture.detectChanges();
  
      expectCollapsibleList('dndgen-collapsible-list.item-header', 'my item (x1)', true);
      expectOnlyToShow('li.item-magic-bonus');

      const compiled = fixture.nativeElement as HTMLElement;
      const magicBonus = compiled.querySelector('li.item-magic-bonus');
      expect(magicBonus).toBeDefined();
      expect(magicBonus?.textContent).toEqual('Bonus: -2');
    });
  
    it(`should render an item with special abilities`, () => {
      const component = fixture.componentInstance;
      component.item = new Item('my item', 'MyItemType');
      component.item.attributes = ['My Attribute', 'My Other Attribute'];
      component.item.magic.specialAbilities = [
        new SpecialAbility('my special ability'),
        new SpecialAbility('my other special ability'),
      ];

      fixture.detectChanges();
  
      expectCollapsibleList('dndgen-collapsible-list.item-header', 'my item (x1)', true);
      expectOnlyToShow('li.item-magic-special-abilities');
      expectCollapsibleList('li.item-magic-special-abilities > dndgen-collapsible-list', 'Special Abilities', true);

      const itemTraitsListItems = getAll('li.item-magic-special-ability', ['li.item-magic-special-abilities', 'dndgen-collapsible-list', 'ul']);
      expect(itemTraitsListItems).toBeDefined();
      expect(itemTraitsListItems?.length).toBe(2);
      expect(itemTraitsListItems?.item(0).textContent).toEqual('my special ability');
      expect(itemTraitsListItems?.item(1).textContent).toEqual('my other special ability');
    });
  
    it(`should render an item with magic charges`, () => {
      const component = fixture.componentInstance;
      component.item = getItem();
      component.item.attributes = ['My Attribute', 'Charged', 'My Other Attribute'];
      component.item.magic.charges = 9266;

      fixture.detectChanges();
  
      expectCollapsibleList('dndgen-collapsible-list.item-header', 'my item (x1)', true);
      expectOnlyToShow('li.item-magic-charges');

      const compiled = fixture.nativeElement as HTMLElement;
      const magicCharges = compiled.querySelector('li.item-magic-charges');
      expect(magicCharges).toBeDefined();
      expect(magicCharges?.textContent).toEqual('Charges: 9266');
    });
  
    it(`should render an item with magic charges, but uncharged`, () => {
      const component = fixture.componentInstance;
      component.item = getItem();
      component.item.attributes = ['My Attribute', 'Charged', 'My Other Attribute'];
      component.item.magic.charges = 0;

      fixture.detectChanges();
  
      expectCollapsibleList('dndgen-collapsible-list.item-header', 'my item (x1)', true);
      expectOnlyToShow('li.item-magic-charges');

      const compiled = fixture.nativeElement as HTMLElement;
      const magicCharges = compiled.querySelector('li.item-magic-charges');
      expect(magicCharges).toBeDefined();
      expect(magicCharges?.textContent).toEqual('Charges: 0');
    });
  
    it(`should render an item with magic curse`, () => {
      const component = fixture.componentInstance;
      component.item = getItem();
      component.item.magic.curse = 'my curse';

      fixture.detectChanges();
  
      expectCollapsibleList('dndgen-collapsible-list.item-header', 'my item (x1)', true);
      expectOnlyToShow('li.item-magic-curse');

      const compiled = fixture.nativeElement as HTMLElement;
      const curse = compiled.querySelector('li.item-magic-curse');
      expect(curse).toBeDefined();
      expect(curse?.textContent).toEqual('Curse: my curse');
    });

    function getItem(): Item {
      let item = new Item('my item', 'MyItemType');
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
  
      expectCollapsibleList('dndgen-collapsible-list.item-header', 'my item (x1)', true);
      expectOnlyToShow('li.item-magic-intelligence');
      expectCollapsibleList('li.item-magic-intelligence > dndgen-collapsible-list', 'Intelligence', true);

      const listItems = getAll('ul.item-magic-intelligence-details > li', ['li.item-magic-intelligence', 'dndgen-collapsible-list']);
      expect(listItems).toBeDefined();
      expect(listItems?.length).toBe(11);
      expect(listItems?.item(0).textContent).toEqual('Ego: 9266');
      expect(listItems?.item(1).textContent).toEqual('Intelligence: 90210');
      expect(listItems?.item(2).textContent).toEqual('Wisdom: 42');
      expect(listItems?.item(3).textContent).toEqual('Charisma: 600');
      expect(listItems?.item(4).textContent).toEqual('Alignment: intelligence alignment');

      const communication = listItems?.item(5) as HTMLElement;
      expect(communication.getAttribute('class')).toEqual('item-magic-intelligence-communication');

      let span = communication.querySelector('span');
      expect(span).toBeDefined();
      expect(span?.textContent).toEqual('Communication:');

      const communicationListItems = getAll('li', ['li.item-magic-intelligence-communication', 'ul']);
      expect(communicationListItems).toBeDefined();
      expect(communicationListItems?.length).toBe(3);
      expect(communicationListItems?.item(0).textContent).toEqual('interpretive dance');
      expect(communicationListItems?.item(1).textContent).toEqual('miming');
      expect(communicationListItems?.item(2).getAttribute('class')).toEqual('item-magic-intelligence-languages');

      expectHasAttribute('li.item-magic-intelligence-languages', 'hidden', true);
      expectCollapsibleList('li.item-magic-intelligence-languages > dndgen-collapsible-list', 'Languages', false);

      expect(listItems?.item(6).textContent).toEqual('Senses: spidey-sense');

      const powers = listItems?.item(7) as HTMLElement;
      expect(powers.getAttribute('class')).toEqual('item-magic-intelligence-powers');

      span = powers.querySelector('span');
      expect(span).toBeDefined();
      expect(span?.textContent).toEqual('Powers:');

      const powersListItems = getAll('li', ['li.item-magic-intelligence-powers', 'ul']);
      expect(powersListItems).toBeDefined();
      expect(powersListItems?.length).toBe(2);
      expect(powersListItems?.item(0).textContent).toEqual('flight');
      expect(powersListItems?.item(1).textContent).toEqual('super strength');

      expect(listItems?.item(8).getAttribute('class')).toEqual('item-magic-intelligence-special-purpose');
      expectHasAttribute('li.item-magic-intelligence-special-purpose', 'hidden', true);

      expect(listItems?.item(9).getAttribute('class')).toEqual('item-magic-intelligence-dedicated-power');
      expectHasAttribute('li.item-magic-intelligence-dedicated-power', 'hidden', true);

      expect(listItems?.item(10).textContent).toEqual('Personality: gregarious');
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
  
      expectCollapsibleList('dndgen-collapsible-list.item-header', 'my item (x1)', true);
      expectOnlyToShow('li.item-magic-intelligence');
      expectCollapsibleList('li.item-magic-intelligence > dndgen-collapsible-list', 'Intelligence', true);

      const listItems = getAll('ul.item-magic-intelligence-details > li', ['li.item-magic-intelligence', 'dndgen-collapsible-list']);
      expect(listItems).toBeDefined();
      expect(listItems?.length).toBe(11);
      expect(listItems?.item(0).textContent).toEqual('Ego: 9266');
      expect(listItems?.item(1).textContent).toEqual('Intelligence: 90210');
      expect(listItems?.item(2).textContent).toEqual('Wisdom: 42');
      expect(listItems?.item(3).textContent).toEqual('Charisma: 600');
      expect(listItems?.item(4).textContent).toEqual('Alignment: intelligence alignment');

      const communication = listItems?.item(5) as HTMLElement;
      expect(communication.getAttribute('class')).toEqual('item-magic-intelligence-communication');

      let span = communication.querySelector('span');
      expect(span).toBeDefined();
      expect(span?.textContent).toEqual('Communication:');

      const communicationListItems = getAll('ul.item-magic-intelligence-communication-details > li', ['li.item-magic-intelligence-communication']);
      expect(communicationListItems).toBeDefined();
      expect(communicationListItems?.length).toBe(3);
      expect(communicationListItems?.item(0).textContent).toEqual('interpretive dance');
      expect(communicationListItems?.item(1).textContent).toEqual('miming');
      expect(communicationListItems?.item(2).getAttribute('class')).toEqual('item-magic-intelligence-languages');

      expectHasAttribute('li.item-magic-intelligence-languages', 'hidden', false);
      expectCollapsibleList('li.item-magic-intelligence-languages > dndgen-collapsible-list', 'Languages', true);
      
      const languages = getAll('li', ['li.item-magic-intelligence-languages', 'dndgen-collapsible-list', 'ul']);
      expect(languages).toBeDefined();
      expect(languages?.length).toBe(2);
      expect(languages?.item(0).textContent).toEqual('English');
      expect(languages?.item(1).textContent).toEqual('German');
      
      expect(listItems?.item(6).textContent).toEqual('Senses: spidey-sense');

      const powers = listItems?.item(7) as HTMLElement;
      expect(powers.getAttribute('class')).toEqual('item-magic-intelligence-powers');

      span = powers.querySelector('span');
      expect(span).toBeDefined();
      expect(span?.textContent).toEqual('Powers:');

      const powersListItems = getAll('li', ['li.item-magic-intelligence-powers', 'ul']);
      expect(powersListItems).toBeDefined();
      expect(powersListItems?.length).toBe(2);
      expect(powersListItems?.item(0).textContent).toEqual('flight');
      expect(powersListItems?.item(1).textContent).toEqual('super strength');

      expect(listItems?.item(8).getAttribute('class')).toEqual('item-magic-intelligence-special-purpose');
      expectHasAttribute('li.item-magic-intelligence-special-purpose', 'hidden', true);

      expect(listItems?.item(9).getAttribute('class')).toEqual('item-magic-intelligence-dedicated-power');
      expectHasAttribute('li.item-magic-intelligence-dedicated-power', 'hidden', true);

      expect(listItems?.item(10).textContent).toEqual('Personality: gregarious');
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
  
      expectCollapsibleList('dndgen-collapsible-list.item-header', 'my item (x1)', true);
      expectOnlyToShow('li.item-magic-intelligence');
      expectCollapsibleList('li.item-magic-intelligence > dndgen-collapsible-list', 'Intelligence', true);

      const listItems = getAll('ul.item-magic-intelligence-details > li', ['li.item-magic-intelligence', 'dndgen-collapsible-list']);
      expect(listItems).toBeDefined();
      expect(listItems?.length).toBe(11);
      expect(listItems?.item(0).textContent).toEqual('Ego: 9266');
      expect(listItems?.item(1).textContent).toEqual('Intelligence: 90210');
      expect(listItems?.item(2).textContent).toEqual('Wisdom: 42');
      expect(listItems?.item(3).textContent).toEqual('Charisma: 600');
      expect(listItems?.item(4).textContent).toEqual('Alignment: intelligence alignment');

      const communication = listItems?.item(5) as HTMLElement;
      expect(communication.getAttribute('class')).toEqual('item-magic-intelligence-communication');

      let span = communication.querySelector('span');
      expect(span).toBeDefined();
      expect(span?.textContent).toEqual('Communication:');

      const communicationListItems = getAll('li', ['li.item-magic-intelligence-communication', 'ul']);
      expect(communicationListItems).toBeDefined();
      expect(communicationListItems?.length).toBe(3);
      expect(communicationListItems?.item(0).textContent).toEqual('interpretive dance');
      expect(communicationListItems?.item(1).textContent).toEqual('miming');
      expect(communicationListItems?.item(2).getAttribute('class')).toEqual('item-magic-intelligence-languages');

      expectHasAttribute('li.item-magic-intelligence-languages', 'hidden', true);
      expectCollapsibleList('li.item-magic-intelligence-languages > dndgen-collapsible-list', 'Languages', false);

      expect(listItems?.item(6).textContent).toEqual('Senses: spidey-sense');

      const powers = listItems?.item(7) as HTMLElement;
      expect(powers.getAttribute('class')).toEqual('item-magic-intelligence-powers');

      span = powers.querySelector('span');
      expect(span).toBeDefined();
      expect(span?.textContent).toEqual('Powers:');

      const powersListItems = getAll('li', ['li.item-magic-intelligence-powers', 'ul']);
      expect(powersListItems).toBeDefined();
      expect(powersListItems?.length).toBe(2);
      expect(powersListItems?.item(0).textContent).toEqual('flight');
      expect(powersListItems?.item(1).textContent).toEqual('super strength');

      expect(listItems?.item(8).getAttribute('class')).toEqual('item-magic-intelligence-special-purpose');
      expectHasAttribute('li.item-magic-intelligence-special-purpose', 'hidden', false);

      const compiled = fixture.nativeElement as HTMLElement;
      span = compiled.querySelector('li.item-magic-intelligence-special-purpose > span');
      expect(span).toBeDefined();
      expect(span?.textContent).toEqual('Special Purpose: to fight crime');

      expect(listItems?.item(9).getAttribute('class')).toEqual('item-magic-intelligence-dedicated-power');
      expectHasAttribute('li.item-magic-intelligence-dedicated-power', 'hidden', false);

      span = compiled.querySelector('li.item-magic-intelligence-dedicated-power > span');
      expect(span).toBeDefined();
      expect(span?.textContent).toEqual('Dedicated Power: get really, really mad');

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
  
      expectCollapsibleList('dndgen-collapsible-list.item-header', 'my item (x1)', true);
      expectOnlyToShow('li.item-magic-intelligence');
      expectCollapsibleList('li.item-magic-intelligence > dndgen-collapsible-list', 'Intelligence', true);

      const listItems = getAll('ul.item-magic-intelligence-details > li', ['li.item-magic-intelligence', 'dndgen-collapsible-list']);
      expect(listItems).toBeDefined();
      expect(listItems?.length).toBe(11);
      expect(listItems?.item(0).textContent).toEqual('Ego: 9266');
      expect(listItems?.item(1).textContent).toEqual('Intelligence: 90210');
      expect(listItems?.item(2).textContent).toEqual('Wisdom: 42');
      expect(listItems?.item(3).textContent).toEqual('Charisma: 600');
      expect(listItems?.item(4).textContent).toEqual('Alignment: intelligence alignment');

      const communication = listItems?.item(5) as HTMLElement;
      expect(communication.getAttribute('class')).toEqual('item-magic-intelligence-communication');

      let span = communication.querySelector('span');
      expect(span).toBeDefined();
      expect(span?.textContent).toEqual('Communication:');

      const communicationListItems = getAll('li', ['li.item-magic-intelligence-communication', 'ul']);
      expect(communicationListItems).toBeDefined();
      expect(communicationListItems?.length).toBe(3);
      expect(communicationListItems?.item(0).textContent).toEqual('interpretive dance');
      expect(communicationListItems?.item(1).textContent).toEqual('miming');
      expect(communicationListItems?.item(2).getAttribute('class')).toEqual('item-magic-intelligence-languages');

      expectHasAttribute('li.item-magic-intelligence-languages', 'hidden', true);
      expectCollapsibleList('li.item-magic-intelligence-languages > dndgen-collapsible-list', 'Languages', false);

      expect(listItems?.item(6).textContent).toEqual('Senses: spidey-sense');

      const powers = listItems?.item(7) as HTMLElement;
      expect(powers.getAttribute('class')).toEqual('item-magic-intelligence-powers');

      span = powers.querySelector('span');
      expect(span).toBeDefined();
      expect(span?.textContent).toEqual('Powers:');

      const powersListItems = getAll('li', ['li.item-magic-intelligence-powers', 'ul']);
      expect(powersListItems).toBeDefined();
      expect(powersListItems?.length).toBe(2);
      expect(powersListItems?.item(0).textContent).toEqual('flight');
      expect(powersListItems?.item(1).textContent).toEqual('super strength');

      expect(listItems?.item(8).getAttribute('class')).toEqual('item-magic-intelligence-special-purpose');
      expectHasAttribute('li.item-magic-intelligence-special-purpose', 'hidden', true);

      expect(listItems?.item(9).getAttribute('class')).toEqual('item-magic-intelligence-dedicated-power');
      expectHasAttribute('li.item-magic-intelligence-dedicated-power', 'hidden', true);

      expect(listItems?.item(10).textContent).toEqual('Personality: None');
    });
  
    it(`should render armor`, () => {
      const component = fixture.componentInstance;
      expect('not yet written').toBe('');

      component.item = getItem();
      component.item.magic.bonus = 2;

      fixture.detectChanges();
  
      expectCollapsibleList('dndgen-collapsible-list.item-header', 'my item (x1)', true);
      expectOnlyToShow('li.item-armor');

      const compiled = fixture.nativeElement as HTMLElement;
      const magicBonus = compiled.querySelector('li.item-magic-bonus');
      expect(magicBonus).toBeDefined();
      expect(magicBonus?.textContent).toEqual('Bonus: +2');
    });
  
    it(`should render armor without max dexterity bonus`, () => {
      const component = fixture.componentInstance;
      expect('not yet written').toBe('');

      component.item = getItem();
      component.item.magic.bonus = 2;

      fixture.detectChanges();
  
      expectCollapsibleList('dndgen-collapsible-list.item-header', 'my item (x1)', true);
      expectOnlyToShow('li.item-armor');

      const compiled = fixture.nativeElement as HTMLElement;
      const magicBonus = compiled.querySelector('li.item-magic-bonus');
      expect(magicBonus).toBeDefined();
      expect(magicBonus?.textContent).toEqual('Bonus: +2');
    });
  
    it(`should render weapon`, () => {
      const component = fixture.componentInstance;
      expect('not yet written').toBe('');

      component.item = getItem();
      component.item.magic.bonus = 2;

      fixture.detectChanges();
  
      expectCollapsibleList('dndgen-collapsible-list.item-header', 'my item (x1)', true);
      expectOnlyToShow('li.item-weapon');

      const compiled = fixture.nativeElement as HTMLElement;
      const magicBonus = compiled.querySelector('li.item-magic-bonus');
      expect(magicBonus).toBeDefined();
      expect(magicBonus?.textContent).toEqual('Bonus: +2');
    });
  
    it(`should render double weapon`, () => {
      const component = fixture.componentInstance;
      expect('not yet written').toBe('');

      component.item = getItem();
      component.item.magic.bonus = 2;

      fixture.detectChanges();
  
      expectCollapsibleList('dndgen-collapsible-list.item-header', 'my item (x1)', true);
      expectOnlyToShow('li.item-weapon');

      const compiled = fixture.nativeElement as HTMLElement;
      const magicBonus = compiled.querySelector('li.item-magic-bonus');
      expect(magicBonus).toBeDefined();
      expect(magicBonus?.textContent).toEqual('Bonus: +2');
    });
  
    it(`should render weapon requiring ammunition`, () => {
      const component = fixture.componentInstance;
      expect('not yet written').toBe('');

      component.item = getItem();
      component.item.magic.bonus = 2;

      fixture.detectChanges();
  
      expectCollapsibleList('dndgen-collapsible-list.item-header', 'my item (x1)', true);
      expectOnlyToShow('li.item-weapon');

      const compiled = fixture.nativeElement as HTMLElement;
      const magicBonus = compiled.querySelector('li.item-magic-bonus');
      expect(magicBonus).toBeDefined();
      expect(magicBonus?.textContent).toEqual('Bonus: +2');
    });
  });
});
