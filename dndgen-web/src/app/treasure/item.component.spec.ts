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
      if (selector == 'li.item-armor') {
        expect(armor).not.toBeNull();
        expect(armor).toBeDefined();
        expectHasAttribute('li.item-armor', 'hidden', false);
      }
      else {
        expect(armor).toBeNull();
      }

      let weapon = compiled!.querySelector('li.item-weapon');
      if (selector == 'li.item-weapon') {
        expect(weapon).not.toBeNull();
        expect(weapon).toBeDefined();
        expectHasAttribute('li.item-weapon', 'hidden', false);
      }
      else {
        expect(weapon).toBeNull();
      }
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
      component.item = getItem();
      component.item.magic.specialAbilities = [
        new SpecialAbility('my special ability'),
        new SpecialAbility('my other special ability'),
      ];

      fixture.detectChanges();
  
      expectCollapsibleList('dndgen-collapsible-list.item-header', 'my item (x1)', true);
      expectOnlyToShow('li.item-magic-special-abilities');
      expectCollapsibleList('li.item-magic-special-abilities > dndgen-collapsible-list', 'Special Abilities', true);

      const listItems = getAll('li.item-magic-special-ability', ['li.item-magic-special-abilities', 'dndgen-collapsible-list', 'ul']);
      expect(listItems).toBeDefined();
      expect(listItems?.length).toBe(2);
      expect(listItems?.item(0).textContent).toEqual('my special ability');
      expect(listItems?.item(1).textContent).toEqual('my other special ability');
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
      component.item = getArmor();

      fixture.detectChanges();
  
      expectCollapsibleList('dndgen-collapsible-list.item-header', 'my item (x1)', true);
      expectOnlyToShow('li.item-armor');
      expectCollapsibleList('li.item-armor > dndgen-collapsible-list', 'Armor', true);

      const listItems = getAll('ul.item-armor-details > li', ['li.item-armor', 'dndgen-collapsible-list']);
      expect(listItems).toBeDefined();
      expect(listItems?.length).toEqual(4);
      expect(listItems?.item(0).textContent).toEqual('Size: my size');
      expect(listItems?.item(1).textContent).toEqual('Armor Bonus: 1337');
      expect(listItems?.item(2).textContent).toEqual('Armor Check Penalty: -1336');
      expect(listItems?.item(3).textContent).toEqual('Max Dexterity Bonus: 96');
      expect(listItems?.item(3).getAttribute('class')).toEqual('item-armor-max-dex');
      expectHasAttribute('li.item-armor-max-dex', 'hidden', false);
    });

    function getArmor(): Armor {
      let armor = new Armor('my item', 'MyItemType');
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
  
      expectCollapsibleList('dndgen-collapsible-list.item-header', 'my item (x1)', true);
      expectOnlyToShow('li.item-armor');
      expectCollapsibleList('li.item-armor > dndgen-collapsible-list', 'Armor', true);

      const listItems = getAll('ul.item-armor-details > li', ['li.item-armor', 'dndgen-collapsible-list']);
      expect(listItems).toBeDefined();
      expect(listItems?.length).toEqual(4);
      expect(listItems?.item(0).textContent).toEqual('Size: my size');
      expect(listItems?.item(1).textContent).toEqual('Armor Bonus: 1337');
      expect(listItems?.item(2).textContent).toEqual('Armor Check Penalty: -1336');
      expect(listItems?.item(3).getAttribute('class')).toEqual('item-armor-max-dex');
      expectHasAttribute('li.item-armor-max-dex', 'hidden', true);
    });
  
    it(`should render weapon`, () => {
      const component = fixture.componentInstance;
      component.item = getWeapon();

      fixture.detectChanges();
  
      expectCollapsibleList('dndgen-collapsible-list.item-header', 'my item (x1)', true);
      expectOnlyToShow('li.item-weapon');
      expectCollapsibleList('li.item-weapon > dndgen-collapsible-list', 'Weapon', true);

      const listItems = getAll('ul.item-weapon-details > li', ['li.item-weapon', 'dndgen-collapsible-list']);
      expect(listItems).toBeDefined();
      expect(listItems?.length).toEqual(8);
      expect(listItems?.item(0).textContent).toEqual('Size: my size');
      expect(listItems?.item(1).textContent).toEqual('Combat Types: stabbing, tickling');
      expect(listItems?.item(2).textContent).toEqual('Damage: my damage description');
      expect(listItems?.item(3).getAttribute('class')).toEqual('item-weapon-2nd-damage');
      expectHasAttribute('li.item-weapon-2nd-damage', 'hidden', true);
      expect(listItems?.item(4).textContent).toEqual('Threat Range: my threat range');
      expect(listItems?.item(5).textContent).toEqual('Critical Damage: my critical damage description');
      expect(listItems?.item(6).getAttribute('class')).toEqual('item-weapon-2nd-crit');
      expectHasAttribute('li.item-weapon-2nd-crit', 'hidden', true);
      expect(listItems?.item(7).getAttribute('class')).toEqual('item-weapon-ammo');
      expectHasAttribute('li.item-weapon-ammo', 'hidden', true);
    });

    function getWeapon(): Weapon {
      let weapon = new Weapon('my item', 'MyItemType');
      weapon.attributes = ['My Attribute', 'My Other Attribute'];
      weapon.size = 'my size';
      weapon.combatTypes = ['stabbing', 'tickling'];
      weapon.damageDescription = 'my damage description';
      weapon.threatRangeDescription = 'my threat range';
      weapon.criticalDamageDescription = 'my critical damage description';

      return weapon;
    }
  
    it(`should render double weapon`, () => {
      const weapon = getWeapon();
      weapon.isDoubleWeapon = true;
      weapon.secondaryDamageDescription = 'my secondary damage description';
      weapon.secondaryCriticalDamageDescription = 'my secondary critical damage description';

      const component = fixture.componentInstance;
      component.item = weapon;

      fixture.detectChanges();
  
      expectCollapsibleList('dndgen-collapsible-list.item-header', 'my item (x1)', true);
      expectOnlyToShow('li.item-weapon');
      expectCollapsibleList('li.item-weapon > dndgen-collapsible-list', 'Weapon', true);

      const listItems = getAll('ul.item-weapon-details > li', ['li.item-weapon', 'dndgen-collapsible-list']);
      expect(listItems).toBeDefined();
      expect(listItems?.length).toEqual(8);
      expect(listItems?.item(0).textContent).toEqual('Size: my size');
      expect(listItems?.item(1).textContent).toEqual('Combat Types: stabbing, tickling');
      expect(listItems?.item(2).textContent).toEqual('Damage: my damage description');
      expect(listItems?.item(3).getAttribute('class')).toEqual('item-weapon-2nd-damage');
      expectHasAttribute('li.item-weapon-2nd-damage', 'hidden', false);
      expect(listItems?.item(3).textContent).toEqual('Secondary Damage: my secondary damage description');
      expect(listItems?.item(4).textContent).toEqual('Threat Range: my threat range');
      expect(listItems?.item(5).textContent).toEqual('Critical Damage: my critical damage description');
      expect(listItems?.item(6).getAttribute('class')).toEqual('item-weapon-2nd-crit');
      expectHasAttribute('li.item-weapon-2nd-crit', 'hidden', false);
      expect(listItems?.item(6).textContent).toEqual('Secondary Critical Damage: my secondary critical damage description');
      expect(listItems?.item(7).getAttribute('class')).toEqual('item-weapon-ammo');
      expectHasAttribute('li.item-weapon-ammo', 'hidden', true);
    });
  
    it(`should render weapon requiring ammunition`, () => {
      const weapon = getWeapon();
      weapon.ammunition = 'my ammo';

      const component = fixture.componentInstance;
      component.item = weapon;

      fixture.detectChanges();
  
      expectCollapsibleList('dndgen-collapsible-list.item-header', 'my item (x1)', true);
      expectOnlyToShow('li.item-weapon');
      expectCollapsibleList('li.item-weapon > dndgen-collapsible-list', 'Weapon', true);

      const listItems = getAll('ul.item-weapon-details > li', ['li.item-weapon', 'dndgen-collapsible-list']);
      expect(listItems).toBeDefined();
      expect(listItems?.length).toEqual(8);
      expect(listItems?.item(0).textContent).toEqual('Size: my size');
      expect(listItems?.item(1).textContent).toEqual('Combat Types: stabbing, tickling');
      expect(listItems?.item(2).textContent).toEqual('Damage: my damage description');
      expect(listItems?.item(3).getAttribute('class')).toEqual('item-weapon-2nd-damage');
      expectHasAttribute('li.item-weapon-2nd-damage', 'hidden', true);
      expect(listItems?.item(4).textContent).toEqual('Threat Range: my threat range');
      expect(listItems?.item(5).textContent).toEqual('Critical Damage: my critical damage description');
      expect(listItems?.item(6).getAttribute('class')).toEqual('item-weapon-2nd-crit');
      expectHasAttribute('li.item-weapon-2nd-crit', 'hidden', true);
      expect(listItems?.item(7).getAttribute('class')).toEqual('item-weapon-ammo');
      expectHasAttribute('li.item-weapon-ammo', 'hidden', false);
      expect(listItems?.item(7).textContent).toEqual('Ammunition Used: my ammo');
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
  
      expectCollapsibleList('dndgen-collapsible-list.item-header', 'my item (x9266)', true);
      expectHasAttribute('li.item-contents', 'hidden', false);
      expectHasAttribute('li.item-traits', 'hidden', false);
      expectHasAttribute('li.item-magic-bonus', 'hidden', false);
      expectHasAttribute('li.item-magic-special-abilities', 'hidden', false);
      expectHasAttribute('li.item-magic-charges', 'hidden', false);
      expectHasAttribute('li.item-magic-curse', 'hidden', false);
      expectHasAttribute('li.item-magic-intelligence', 'hidden', false);
      expectCollapsibleList('li.item-contents > dndgen-collapsible-list', 'Contents', true);
      expectCollapsibleList('li.item-traits > dndgen-collapsible-list', 'Traits', true);
      expectCollapsibleList('li.item-magic-special-abilities > dndgen-collapsible-list', 'Special Abilities', true);
      expectCollapsibleList('li.item-magic-intelligence > dndgen-collapsible-list', 'Intelligence', true);

      let listItems = getAll('li.item-content', ['li.item-contents', 'dndgen-collapsible-list', 'ul']);
      expect(listItems).toBeDefined();
      expect(listItems?.length).toBe(2);
      expect(listItems?.item(0).textContent).toEqual('my contents');
      expect(listItems?.item(1).textContent).toEqual('my other contents');

      listItems = getAll('li.item-trait', ['li.item-traits', 'dndgen-collapsible-list', 'ul']);
      expect(listItems).toBeDefined();
      expect(listItems?.length).toBe(2);
      expect(listItems?.item(0).textContent).toEqual('my trait');
      expect(listItems?.item(1).textContent).toEqual('my other trait');
      
      const compiled = fixture.nativeElement as HTMLElement;
      let element = compiled.querySelector('li.item-magic-bonus');
      expect(element).toBeDefined();
      expect(element?.textContent).toEqual('Bonus: +90210');

      listItems = getAll('li.item-magic-special-ability', ['li.item-magic-special-abilities', 'dndgen-collapsible-list', 'ul']);
      expect(listItems).toBeDefined();
      expect(listItems?.length).toBe(2);
      expect(listItems?.item(0).textContent).toEqual('my special ability');
      expect(listItems?.item(1).textContent).toEqual('my other special ability');
      
      element = compiled.querySelector('li.item-magic-charges');
      expect(element).toBeDefined();
      expect(element?.textContent).toEqual('Charges: 42');

      element = compiled.querySelector('li.item-magic-curse');
      expect(element).toBeDefined();
      expect(element?.textContent).toEqual('Curse: my curse');

      listItems = getAll('ul.item-magic-intelligence-details > li', ['li.item-magic-intelligence', 'dndgen-collapsible-list']);
      expect(listItems).toBeDefined();
      expect(listItems?.length).toBe(11);
      expect(listItems?.item(0).textContent).toEqual('Ego: 600');
      expect(listItems?.item(1).textContent).toEqual('Intelligence: 1337');
      expect(listItems?.item(2).textContent).toEqual('Wisdom: 1336');
      expect(listItems?.item(3).textContent).toEqual('Charisma: 96');
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
      expectHasAttribute('li.item-magic-intelligence-special-purpose', 'hidden', false);

      span = compiled.querySelector('li.item-magic-intelligence-special-purpose > span');
      expect(span).toBeDefined();
      expect(span?.textContent).toEqual('Special Purpose: to fight crime');

      expect(listItems?.item(9).getAttribute('class')).toEqual('item-magic-intelligence-dedicated-power');
      expectHasAttribute('li.item-magic-intelligence-dedicated-power', 'hidden', false);

      span = compiled.querySelector('li.item-magic-intelligence-dedicated-power > span');
      expect(span).toBeDefined();
      expect(span?.textContent).toEqual('Dedicated Power: get really, really mad');

      expect(listItems?.item(10).textContent).toEqual('Personality: gregarious');
      
      let armorElement = compiled!.querySelector('li.item-armor');
      expect(armorElement).toBeNull();

      let weaponElement = compiled!.querySelector('li.item-weapon');
      expect(weaponElement).toBeNull();
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
  
      expectCollapsibleList('dndgen-collapsible-list.item-header', 'my item (x9266)', true);
      expectHasAttribute('li.item-contents', 'hidden', false);
      expectHasAttribute('li.item-traits', 'hidden', false);
      expectHasAttribute('li.item-magic-bonus', 'hidden', false);
      expectHasAttribute('li.item-magic-special-abilities', 'hidden', false);
      expectHasAttribute('li.item-magic-charges', 'hidden', false);
      expectHasAttribute('li.item-magic-curse', 'hidden', false);
      expectHasAttribute('li.item-magic-intelligence', 'hidden', false);
      expectCollapsibleList('li.item-contents > dndgen-collapsible-list', 'Contents', true);
      expectCollapsibleList('li.item-traits > dndgen-collapsible-list', 'Traits', true);
      expectCollapsibleList('li.item-magic-special-abilities > dndgen-collapsible-list', 'Special Abilities', true);
      expectCollapsibleList('li.item-magic-intelligence > dndgen-collapsible-list', 'Intelligence', true);

      let listItems = getAll('li.item-content', ['li.item-contents', 'dndgen-collapsible-list', 'ul']);
      expect(listItems).toBeDefined();
      expect(listItems?.length).toBe(2);
      expect(listItems?.item(0).textContent).toEqual('my contents');
      expect(listItems?.item(1).textContent).toEqual('my other contents');

      listItems = getAll('li.item-trait', ['li.item-traits', 'dndgen-collapsible-list', 'ul']);
      expect(listItems).toBeDefined();
      expect(listItems?.length).toBe(2);
      expect(listItems?.item(0).textContent).toEqual('my trait');
      expect(listItems?.item(1).textContent).toEqual('my other trait');
      
      const compiled = fixture.nativeElement as HTMLElement;
      let element = compiled.querySelector('li.item-magic-bonus');
      expect(element).toBeDefined();
      expect(element?.textContent).toEqual('Bonus: +90210');

      listItems = getAll('li.item-magic-special-ability', ['li.item-magic-special-abilities', 'dndgen-collapsible-list', 'ul']);
      expect(listItems).toBeDefined();
      expect(listItems?.length).toBe(2);
      expect(listItems?.item(0).textContent).toEqual('my special ability');
      expect(listItems?.item(1).textContent).toEqual('my other special ability');
      
      element = compiled.querySelector('li.item-magic-charges');
      expect(element).toBeDefined();
      expect(element?.textContent).toEqual('Charges: 42');

      element = compiled.querySelector('li.item-magic-curse');
      expect(element).toBeDefined();
      expect(element?.textContent).toEqual('Curse: my curse');

      listItems = getAll('ul.item-magic-intelligence-details > li', ['li.item-magic-intelligence', 'dndgen-collapsible-list']);
      expect(listItems).toBeDefined();
      expect(listItems?.length).toBe(11);
      expect(listItems?.item(0).textContent).toEqual('Ego: 600');
      expect(listItems?.item(1).textContent).toEqual('Intelligence: 1337');
      expect(listItems?.item(2).textContent).toEqual('Wisdom: 1336');
      expect(listItems?.item(3).textContent).toEqual('Charisma: 96');
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
      expectHasAttribute('li.item-magic-intelligence-special-purpose', 'hidden', false);

      span = compiled.querySelector('li.item-magic-intelligence-special-purpose > span');
      expect(span).toBeDefined();
      expect(span?.textContent).toEqual('Special Purpose: to fight crime');

      expect(listItems?.item(9).getAttribute('class')).toEqual('item-magic-intelligence-dedicated-power');
      expectHasAttribute('li.item-magic-intelligence-dedicated-power', 'hidden', false);

      span = compiled.querySelector('li.item-magic-intelligence-dedicated-power > span');
      expect(span).toBeDefined();
      expect(span?.textContent).toEqual('Dedicated Power: get really, really mad');

      expect(listItems?.item(10).textContent).toEqual('Personality: gregarious');
      
      let armorElement = compiled!.querySelector('li.item-armor');
      expect(armorElement).not.toBeNull();
      expect(armorElement).toBeDefined();
      expectHasAttribute('li.item-armor', 'hidden', false);
      
      expectCollapsibleList('li.item-armor > dndgen-collapsible-list', 'Armor', true);

      listItems = getAll('ul.item-armor-details > li', ['li.item-armor', 'dndgen-collapsible-list']);
      expect(listItems).toBeDefined();
      expect(listItems?.length).toEqual(4);
      expect(listItems?.item(0).textContent).toEqual('Size: my size');
      expect(listItems?.item(1).textContent).toEqual('Armor Bonus: 783');
      expect(listItems?.item(2).textContent).toEqual('Armor Check Penalty: -8245');
      expect(listItems?.item(3).textContent).toEqual('Max Dexterity Bonus: 9');
      expect(listItems?.item(3).getAttribute('class')).toEqual('item-armor-max-dex');
      expectHasAttribute('li.item-armor-max-dex', 'hidden', false);
      
      let weaponElement = compiled!.querySelector('li.item-weapon');
      expect(weaponElement).toBeNull();
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
  
      expectCollapsibleList('dndgen-collapsible-list.item-header', 'my item (x9266)', true);
      expectHasAttribute('li.item-contents', 'hidden', false);
      expectHasAttribute('li.item-traits', 'hidden', false);
      expectHasAttribute('li.item-magic-bonus', 'hidden', false);
      expectHasAttribute('li.item-magic-special-abilities', 'hidden', false);
      expectHasAttribute('li.item-magic-charges', 'hidden', false);
      expectHasAttribute('li.item-magic-curse', 'hidden', false);
      expectHasAttribute('li.item-magic-intelligence', 'hidden', false);
      expectCollapsibleList('li.item-contents > dndgen-collapsible-list', 'Contents', true);
      expectCollapsibleList('li.item-traits > dndgen-collapsible-list', 'Traits', true);
      expectCollapsibleList('li.item-magic-special-abilities > dndgen-collapsible-list', 'Special Abilities', true);
      expectCollapsibleList('li.item-magic-intelligence > dndgen-collapsible-list', 'Intelligence', true);

      let listItems = getAll('li.item-content', ['li.item-contents', 'dndgen-collapsible-list', 'ul']);
      expect(listItems).toBeDefined();
      expect(listItems?.length).toBe(2);
      expect(listItems?.item(0).textContent).toEqual('my contents');
      expect(listItems?.item(1).textContent).toEqual('my other contents');

      listItems = getAll('li.item-trait', ['li.item-traits', 'dndgen-collapsible-list', 'ul']);
      expect(listItems).toBeDefined();
      expect(listItems?.length).toBe(2);
      expect(listItems?.item(0).textContent).toEqual('my trait');
      expect(listItems?.item(1).textContent).toEqual('my other trait');
      
      const compiled = fixture.nativeElement as HTMLElement;
      let element = compiled.querySelector('li.item-magic-bonus');
      expect(element).toBeDefined();
      expect(element?.textContent).toEqual('Bonus: +90210');

      listItems = getAll('li.item-magic-special-ability', ['li.item-magic-special-abilities', 'dndgen-collapsible-list', 'ul']);
      expect(listItems).toBeDefined();
      expect(listItems?.length).toBe(2);
      expect(listItems?.item(0).textContent).toEqual('my special ability');
      expect(listItems?.item(1).textContent).toEqual('my other special ability');
      
      element = compiled.querySelector('li.item-magic-charges');
      expect(element).toBeDefined();
      expect(element?.textContent).toEqual('Charges: 42');

      element = compiled.querySelector('li.item-magic-curse');
      expect(element).toBeDefined();
      expect(element?.textContent).toEqual('Curse: my curse');

      listItems = getAll('ul.item-magic-intelligence-details > li', ['li.item-magic-intelligence', 'dndgen-collapsible-list']);
      expect(listItems).toBeDefined();
      expect(listItems?.length).toBe(11);
      expect(listItems?.item(0).textContent).toEqual('Ego: 600');
      expect(listItems?.item(1).textContent).toEqual('Intelligence: 1337');
      expect(listItems?.item(2).textContent).toEqual('Wisdom: 1336');
      expect(listItems?.item(3).textContent).toEqual('Charisma: 96');
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
      expectHasAttribute('li.item-magic-intelligence-special-purpose', 'hidden', false);

      span = compiled.querySelector('li.item-magic-intelligence-special-purpose > span');
      expect(span).toBeDefined();
      expect(span?.textContent).toEqual('Special Purpose: to fight crime');

      expect(listItems?.item(9).getAttribute('class')).toEqual('item-magic-intelligence-dedicated-power');
      expectHasAttribute('li.item-magic-intelligence-dedicated-power', 'hidden', false);

      span = compiled.querySelector('li.item-magic-intelligence-dedicated-power > span');
      expect(span).toBeDefined();
      expect(span?.textContent).toEqual('Dedicated Power: get really, really mad');

      expect(listItems?.item(10).textContent).toEqual('Personality: gregarious');
      
      let armorElement = compiled!.querySelector('li.item-armor');
      expect(armorElement).toBeNull();
      
      let weaponElement = compiled!.querySelector('li.item-weapon');
      expect(weaponElement).not.toBeNull();
      expect(weaponElement).toBeDefined();
      expectHasAttribute('li.item-weapon', 'hidden', false);
      
      expectCollapsibleList('li.item-weapon > dndgen-collapsible-list', 'Weapon', true);

      listItems = getAll('ul.item-weapon-details > li', ['li.item-weapon', 'dndgen-collapsible-list']);
      expect(listItems).toBeDefined();
      expect(listItems?.length).toEqual(8);
      expect(listItems?.item(0).textContent).toEqual('Size: my size');
      expect(listItems?.item(1).textContent).toEqual('Combat Types: stabbing, tickling');
      expect(listItems?.item(2).textContent).toEqual('Damage: my damage description');
      expect(listItems?.item(3).getAttribute('class')).toEqual('item-weapon-2nd-damage');
      expectHasAttribute('li.item-weapon-2nd-damage', 'hidden', false);
      expect(listItems?.item(3).textContent).toEqual('Secondary Damage: my secondary damage description');
      expect(listItems?.item(4).textContent).toEqual('Threat Range: my threat range');
      expect(listItems?.item(5).textContent).toEqual('Critical Damage: my critical damage description');
      expect(listItems?.item(6).getAttribute('class')).toEqual('item-weapon-2nd-crit');
      expectHasAttribute('li.item-weapon-2nd-crit', 'hidden', false);
      expect(listItems?.item(6).textContent).toEqual('Secondary Critical Damage: my secondary critical damage description');
      expect(listItems?.item(7).getAttribute('class')).toEqual('item-weapon-ammo');
      expectHasAttribute('li.item-weapon-ammo', 'hidden', false);
      expect(listItems?.item(7).textContent).toEqual('Ammunition Used: my ammunition');
    });
  });
});
