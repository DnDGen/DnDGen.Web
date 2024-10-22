import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ItemComponent } from './item.component';
import { AppModule } from '../../app.module';
import { Item } from '../models/item.model';
import { Armor } from '../models/armor.model';
import { Weapon } from '../models/weapon.model';
import { SpecialAbility } from '../models/specialAbility.model';
import { DetailsComponent } from '../../shared/components/details.component';
import { TestHelper } from '../../testHelper.spec';

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
  
    it(`should say it has no details when armor is boring`, () => {
      component.item = new Armor('my item', 'MyItemType');
      component.item.contents = [];
      component.item.traits = [];
      component.item.magic.bonus = 0;
      component.item.attributes = ['My Attribute', 'My Other Attribute'];
      component.item.magic.specialAbilities = [];
      component.item.magic.curse = '';
      component.item.magic.intelligence.ego = 0;

      expect(component.hasDetails()).toBeFalse();
    });
  
    it(`should say it has details when armor has contents`, () => {
      component.item = new Armor('my item', 'MyItemType');
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
      component.item = new Armor('my item', 'MyItemType');
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
      component.item = new Armor('my item', 'MyItemType');
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
      component.item = new Armor('my item', 'MyItemType');
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
      component.item = new Armor('my item', 'MyItemType');
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
      component.item = new Armor('my item', 'MyItemType');
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
      component.item = new Armor('my item', 'MyItemType');
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
      component.item = new Armor('my item', 'MyItemType');
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
  
    it(`should say it has no details weapon item is boring`, () => {
      component.item = new Weapon('my item', 'MyItemType');
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
      component.item = new Weapon('my item', 'MyItemType');
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
      component.item = new Weapon('my item', 'MyItemType');
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
      component.item = new Weapon('my item', 'MyItemType');
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
      component.item = new Weapon('my item', 'MyItemType');
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
      component.item = new Weapon('my item', 'MyItemType');
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
      component.item = new Weapon('my item', 'MyItemType');
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
      component.item = new Weapon('my item', 'MyItemType');
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
      component.item = new Weapon('my item', 'MyItemType');
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
  });

  describe('integration', () => {
    let fixture: ComponentFixture<ItemComponent>;
    let helper: TestHelper<ItemComponent>;
  
    beforeEach(async () => {
      await TestBed.configureTestingModule({
    imports: [
        AppModule,
        ItemComponent, DetailsComponent
    ]
}).compileComponents();
  
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
  
      helper.expectDetails('dndgen-details.item-header', 'my item description (x1)', false);
    });
  
    it(`should render a boring item with quantity of 2`, () => {
      const component = fixture.componentInstance;
      component.item = getItem();
      component.item.quantity = 2;

      fixture.detectChanges();
  
      helper.expectDetails('dndgen-details.item-header', 'my item description (x2)', false);
    });
  
    it(`should render an item with contents`, () => {
      const component = fixture.componentInstance;
      component.item = getItem();
      component.item.contents = ['my contents', 'my other contents'];

      fixture.detectChanges();
  
      helper.expectDetails('dndgen-details.item-header', 'my item description (x1)', true);
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
        let show = (selectors[i] != selector);
        helper.expectHasAttribute(selectors[i], 'hidden', show);
      }
      
      helper.expectExists('li.item-armor', selector == 'li.item-armor');
      helper.expectExists('li.item-weapon', selector == 'li.item-weapon');
    }
  
    it(`should render an item with traits`, () => {
      const component = fixture.componentInstance;
      component.item = getItem();
      component.item.traits = ['my trait', 'my other trait'];

      fixture.detectChanges();
  
      helper.expectDetails('dndgen-details.item-header', 'my item description (x1)', true);
      expectOnlyToShow('li.item-traits');
      helper.expectDetails('li.item-traits > dndgen-details', 'Traits', true);
      helper.expectElements('li.item-traits > dndgen-details li.item-trait', ['my trait', 'my other trait']);
    });
  
    it(`should render an item with magic bonus of 1`, () => {
      const component = fixture.componentInstance;
      component.item = getItem();
      component.item.magic.bonus = 1;

      fixture.detectChanges();
  
      helper.expectDetails('dndgen-details.item-header', 'my item description (x1)', true);
      expectOnlyToShow('li.item-magic-bonus');
      helper.expectElement('li.item-magic-bonus', 'Bonus: +1');
    });
  
    it(`should render an item with magic bonus of 2`, () => {
      const component = fixture.componentInstance;
      component.item = getItem();
      component.item.magic.bonus = 2;

      fixture.detectChanges();
  
      helper.expectDetails('dndgen-details.item-header', 'my item description (x1)', true);
      expectOnlyToShow('li.item-magic-bonus');
      helper.expectElement('li.item-magic-bonus', 'Bonus: +2');
    });
  
    it(`should render an item with magic bonus of -1`, () => {
      const component = fixture.componentInstance;
      component.item = getItem();
      component.item.magic.bonus = -1;

      fixture.detectChanges();
  
      helper.expectDetails('dndgen-details.item-header', 'my item description (x1)', true);
      expectOnlyToShow('li.item-magic-bonus');
      helper.expectElement('li.item-magic-bonus', 'Bonus: -1');
    });
  
    it(`should render an item with magic bonus of -2`, () => {
      const component = fixture.componentInstance;
      component.item = getItem();
      component.item.magic.bonus = -2;

      fixture.detectChanges();
  
      helper.expectDetails('dndgen-details.item-header', 'my item description (x1)', true);
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
  
      helper.expectDetails('dndgen-details.item-header', 'my item description (x1)', true);
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
  
      helper.expectDetails('dndgen-details.item-header', 'my item description (x1)', true);
      expectOnlyToShow('li.item-magic-charges');
      helper.expectElement('li.item-magic-charges', 'Charges: 9266');
    });
  
    it(`should render an item with magic charges, but uncharged`, () => {
      const component = fixture.componentInstance;
      component.item = getItem();
      component.item.attributes = ['My Attribute', 'Charged', 'My Other Attribute'];
      component.item.magic.charges = 0;

      fixture.detectChanges();
  
      helper.expectDetails('dndgen-details.item-header', 'my item description (x1)', true);
      expectOnlyToShow('li.item-magic-charges');
      helper.expectElement('li.item-magic-charges', 'Charges: 0');
    });
  
    it(`should render an item with magic curse`, () => {
      const component = fixture.componentInstance;
      component.item = getItem();
      component.item.magic.curse = 'my curse';

      fixture.detectChanges();
  
      helper.expectDetails('dndgen-details.item-header', 'my item description (x1)', true);
      expectOnlyToShow('li.item-magic-curse');
      helper.expectElement('li.item-magic-curse', 'Curse: my curse');
    });

    function getItem(): Item {
      let item = new Item('my item', 'MyItemType');
      item.description = 'my item description';
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
  
      helper.expectDetails('dndgen-details.item-header', 'my item description (x1)', true);
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
      expect(communicationListItems?.length).toBe(3);
      expect(communicationListItems?.item(0).textContent).toEqual('interpretive dance');
      expect(communicationListItems?.item(1).textContent).toEqual('miming');
      expect(communicationListItems?.item(2).getAttribute('class')).toEqual('item-magic-intelligence-languages');

      helper.expectHasAttribute('li.item-magic-intelligence-languages', 'hidden', true);
      helper.expectDetails('li.item-magic-intelligence-languages > dndgen-details', 'Languages', false);

      expect(listItems?.item(6).textContent).toEqual('Senses: spidey-sense');

      const powers = listItems?.item(7) as HTMLElement;
      expect(powers.getAttribute('class')).toEqual('item-magic-intelligence-powers');

      helper.expectElement('li.item-magic-intelligence-powers span', 'Powers:');
      helper.expectElements('li.item-magic-intelligence-powers li', ['flight', 'super strength']);

      expect(listItems?.item(8).getAttribute('class')).toEqual('item-magic-intelligence-special-purpose');
      helper.expectHasAttribute('li.item-magic-intelligence-special-purpose', 'hidden', true);

      expect(listItems?.item(9).getAttribute('class')).toEqual('item-magic-intelligence-dedicated-power');
      helper.expectHasAttribute('li.item-magic-intelligence-dedicated-power', 'hidden', true);

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
  
      helper.expectDetails('dndgen-details.item-header', 'my item description (x1)', true);
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

      const communicationListItems = compiled.querySelectorAll('li.item-magic-intelligence-communication > ul > li');
      expect(communicationListItems).toBeTruthy();
      expect(communicationListItems?.length).toBe(3);
      expect(communicationListItems?.item(0).textContent).toEqual('interpretive dance');
      expect(communicationListItems?.item(1).textContent).toEqual('miming');
      expect(communicationListItems?.item(2).getAttribute('class')).toEqual('item-magic-intelligence-languages');

      helper.expectHasAttribute('li.item-magic-intelligence-languages', 'hidden', false);
      helper.expectDetails('li.item-magic-intelligence-languages > dndgen-details', 'Languages', true);
      helper.expectElements('li.item-magic-intelligence-languages > dndgen-details li', ['English', 'German']);
      
      expect(listItems?.item(6).textContent).toEqual('Senses: spidey-sense');

      const powers = listItems?.item(7) as HTMLElement;
      expect(powers.getAttribute('class')).toEqual('item-magic-intelligence-powers');

      helper.expectElement('.item-magic-intelligence-powers span', 'Powers:');
      helper.expectElements('li.item-magic-intelligence-powers li', ['flight', 'super strength']);

      expect(listItems?.item(8).getAttribute('class')).toEqual('item-magic-intelligence-special-purpose');
      helper.expectHasAttribute('li.item-magic-intelligence-special-purpose', 'hidden', true);

      expect(listItems?.item(9).getAttribute('class')).toEqual('item-magic-intelligence-dedicated-power');
      helper.expectHasAttribute('li.item-magic-intelligence-dedicated-power', 'hidden', true);

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
  
      helper.expectDetails('dndgen-details.item-header', 'my item description (x1)', true);
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
      expect(communicationListItems?.length).toBe(3);
      expect(communicationListItems?.item(0).textContent).toEqual('interpretive dance');
      expect(communicationListItems?.item(1).textContent).toEqual('miming');
      expect(communicationListItems?.item(2).getAttribute('class')).toEqual('item-magic-intelligence-languages');

      helper.expectHasAttribute('li.item-magic-intelligence-languages', 'hidden', true);
      helper.expectDetails('li.item-magic-intelligence-languages > dndgen-details', 'Languages', false);

      expect(listItems?.item(6).textContent).toEqual('Senses: spidey-sense');

      const powers = listItems?.item(7) as HTMLElement;
      expect(powers.getAttribute('class')).toEqual('item-magic-intelligence-powers');

      helper.expectElement('.item-magic-intelligence-powers span', 'Powers:');
      helper.expectElements('li.item-magic-intelligence-powers li', ['flight', 'super strength']);

      expect(listItems?.item(8).getAttribute('class')).toEqual('item-magic-intelligence-special-purpose');
      helper.expectHasAttribute('li.item-magic-intelligence-special-purpose', 'hidden', false);
      helper.expectElement('li.item-magic-intelligence-special-purpose span', 'Special Purpose: to fight crime');

      expect(listItems?.item(9).getAttribute('class')).toEqual('item-magic-intelligence-dedicated-power');
      helper.expectHasAttribute('li.item-magic-intelligence-dedicated-power', 'hidden', false);
      helper.expectElement('li.item-magic-intelligence-dedicated-power span', 'Dedicated Power: get really, really mad');

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
  
      helper.expectDetails('dndgen-details.item-header', 'my item description (x1)', true);
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
      expect(communicationListItems?.length).toBe(3);
      expect(communicationListItems?.item(0).textContent).toEqual('interpretive dance');
      expect(communicationListItems?.item(1).textContent).toEqual('miming');
      expect(communicationListItems?.item(2).getAttribute('class')).toEqual('item-magic-intelligence-languages');

      helper.expectHasAttribute('li.item-magic-intelligence-languages', 'hidden', true);
      helper.expectDetails('li.item-magic-intelligence-languages > dndgen-details', 'Languages', false);

      expect(listItems?.item(6).textContent).toEqual('Senses: spidey-sense');

      const powers = listItems?.item(7) as HTMLElement;
      expect(powers.getAttribute('class')).toEqual('item-magic-intelligence-powers');

      helper.expectElement('.item-magic-intelligence-powers span', 'Powers:');
      helper.expectElements('li.item-magic-intelligence-powers li', ['flight', 'super strength']);

      expect(listItems?.item(8).getAttribute('class')).toEqual('item-magic-intelligence-special-purpose');
      helper.expectHasAttribute('li.item-magic-intelligence-special-purpose', 'hidden', true);

      expect(listItems?.item(9).getAttribute('class')).toEqual('item-magic-intelligence-dedicated-power');
      helper.expectHasAttribute('li.item-magic-intelligence-dedicated-power', 'hidden', true);

      expect(listItems?.item(10).textContent).toEqual('Personality: None');
    });
  
    it(`should render armor`, () => {
      const component = fixture.componentInstance;
      component.item = getArmor();

      fixture.detectChanges();
  
      helper.expectDetails('dndgen-details.item-header', 'my armor description (x1)', true);
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
      helper.expectHasAttribute('li.item-armor-max-dex', 'hidden', false);
    });

    function getArmor(): Armor {
      let armor = new Armor('my armor', 'Armor');
      armor.description = 'my armor description';
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
  
      helper.expectDetails('dndgen-details.item-header', 'my armor description (x1)', true);
      expectOnlyToShow('li.item-armor');
      helper.expectDetails('li.item-armor > dndgen-details', 'Armor', true);

      const compiled = fixture.nativeElement as HTMLElement;
      const listItems = compiled.querySelectorAll('li.item-armor > dndgen-details ul.item-armor-details > li');
      expect(listItems).toBeTruthy();
      expect(listItems?.length).toEqual(4);
      expect(listItems?.item(0).textContent).toEqual('Size: my size');
      expect(listItems?.item(1).textContent).toEqual('Armor Bonus: 1337');
      expect(listItems?.item(2).textContent).toEqual('Armor Check Penalty: -1336');
      expect(listItems?.item(3).getAttribute('class')).toEqual('item-armor-max-dex');
      helper.expectHasAttribute('li.item-armor-max-dex', 'hidden', true);
    });
  
    it(`should render weapon`, () => {
      const component = fixture.componentInstance;
      component.item = getWeapon();

      fixture.detectChanges();
  
      helper.expectDetails('dndgen-details.item-header', 'my weapon description (x1)', true);
      expectOnlyToShow('li.item-weapon');
      helper.expectDetails('li.item-weapon > dndgen-details', 'Weapon', true);

      const compiled = fixture.nativeElement as HTMLElement;
      const listItems = compiled.querySelectorAll('li.item-weapon > dndgen-details ul.item-weapon-details > li');
      expect(listItems).toBeTruthy();
      expect(listItems?.length).toEqual(8);
      expect(listItems?.item(0).textContent).toEqual('Size: my size');
      expect(listItems?.item(1).textContent).toEqual('Combat Types: stabbing, tickling');
      expect(listItems?.item(2).textContent).toEqual('Damage: my damage description');
      expect(listItems?.item(3).getAttribute('class')).toEqual('item-weapon-2nd-damage');
      helper.expectHasAttribute('li.item-weapon-2nd-damage', 'hidden', true);
      expect(listItems?.item(4).textContent).toEqual('Threat Range: my threat range');
      expect(listItems?.item(5).textContent).toEqual('Critical Damage: my critical damage description');
      expect(listItems?.item(6).getAttribute('class')).toEqual('item-weapon-2nd-crit');
      helper.expectHasAttribute('li.item-weapon-2nd-crit', 'hidden', true);
      expect(listItems?.item(7).getAttribute('class')).toEqual('item-weapon-ammo');
      helper.expectHasAttribute('li.item-weapon-ammo', 'hidden', true);
    });

    function getWeapon(): Weapon {
      let weapon = new Weapon('my weapon', 'Weapon');
      weapon.description = 'my weapon description';
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
  
      helper.expectDetails('dndgen-details.item-header', 'my weapon description (x1)', true);
      expectOnlyToShow('li.item-weapon');
      helper.expectDetails('li.item-weapon > dndgen-details', 'Weapon', true);

      const compiled = fixture.nativeElement as HTMLElement;
      const listItems = compiled.querySelectorAll('li.item-weapon > dndgen-details ul.item-weapon-details > li');
      expect(listItems).toBeTruthy();
      expect(listItems?.length).toEqual(8);
      expect(listItems?.item(0).textContent).toEqual('Size: my size');
      expect(listItems?.item(1).textContent).toEqual('Combat Types: stabbing, tickling');
      expect(listItems?.item(2).textContent).toEqual('Damage: my damage description');
      expect(listItems?.item(3).getAttribute('class')).toEqual('item-weapon-2nd-damage');
      helper.expectHasAttribute('li.item-weapon-2nd-damage', 'hidden', false);
      expect(listItems?.item(3).textContent).toEqual('Secondary Damage: my secondary damage description');
      expect(listItems?.item(4).textContent).toEqual('Threat Range: my threat range');
      expect(listItems?.item(5).textContent).toEqual('Critical Damage: my critical damage description');
      expect(listItems?.item(6).getAttribute('class')).toEqual('item-weapon-2nd-crit');
      helper.expectHasAttribute('li.item-weapon-2nd-crit', 'hidden', false);
      expect(listItems?.item(6).textContent).toEqual('Secondary Critical Damage: my secondary critical damage description');
      expect(listItems?.item(7).getAttribute('class')).toEqual('item-weapon-ammo');
      helper.expectHasAttribute('li.item-weapon-ammo', 'hidden', true);
    });
  
    it(`should render weapon requiring ammunition`, () => {
      const weapon = getWeapon();
      weapon.ammunition = 'my ammo';

      const component = fixture.componentInstance;
      component.item = weapon;

      fixture.detectChanges();
  
      helper.expectDetails('dndgen-details.item-header', 'my weapon description (x1)', true);
      expectOnlyToShow('li.item-weapon');
      helper.expectDetails('li.item-weapon > dndgen-details', 'Weapon', true);

      const compiled = fixture.nativeElement as HTMLElement;
      const listItems = compiled.querySelectorAll('li.item-weapon > dndgen-details ul.item-weapon-details > li');
      expect(listItems).toBeTruthy();
      expect(listItems?.length).toEqual(8);
      expect(listItems?.item(0).textContent).toEqual('Size: my size');
      expect(listItems?.item(1).textContent).toEqual('Combat Types: stabbing, tickling');
      expect(listItems?.item(2).textContent).toEqual('Damage: my damage description');
      expect(listItems?.item(3).getAttribute('class')).toEqual('item-weapon-2nd-damage');
      helper.expectHasAttribute('li.item-weapon-2nd-damage', 'hidden', true);
      expect(listItems?.item(4).textContent).toEqual('Threat Range: my threat range');
      expect(listItems?.item(5).textContent).toEqual('Critical Damage: my critical damage description');
      expect(listItems?.item(6).getAttribute('class')).toEqual('item-weapon-2nd-crit');
      helper.expectHasAttribute('li.item-weapon-2nd-crit', 'hidden', true);
      expect(listItems?.item(7).getAttribute('class')).toEqual('item-weapon-ammo');
      helper.expectHasAttribute('li.item-weapon-ammo', 'hidden', false);
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
  
      helper.expectDetails('dndgen-details.item-header', 'my item description (x9266)', true);
      helper.expectHasAttribute('li.item-contents', 'hidden', false);
      helper.expectHasAttribute('li.item-traits', 'hidden', false);
      helper.expectHasAttribute('li.item-magic-bonus', 'hidden', false);
      helper.expectHasAttribute('li.item-magic-special-abilities', 'hidden', false);
      helper.expectHasAttribute('li.item-magic-charges', 'hidden', false);
      helper.expectHasAttribute('li.item-magic-curse', 'hidden', false);
      helper.expectHasAttribute('li.item-magic-intelligence', 'hidden', false);
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

      helper.expectHasAttribute('li.item-magic-intelligence-languages', 'hidden', false);
      helper.expectDetails('li.item-magic-intelligence-languages > dndgen-details', 'Languages', true);
      helper.expectElements('li.item-magic-intelligence-languages > dndgen-details li', ['English', 'German']);

      expect(listItems?.item(6).textContent).toEqual('Senses: spidey-sense');

      const powers = listItems?.item(7) as HTMLElement;
      expect(powers.getAttribute('class')).toEqual('item-magic-intelligence-powers');

      helper.expectElement('li.item-magic-intelligence-powers span', 'Powers:');
      helper.expectElements('li.item-magic-intelligence-powers li', ['flight', 'super strength']);

      expect(listItems?.item(8).getAttribute('class')).toEqual('item-magic-intelligence-special-purpose');
      helper.expectHasAttribute('li.item-magic-intelligence-special-purpose', 'hidden', false);
      helper.expectElement('li.item-magic-intelligence-special-purpose', 'Special Purpose: to fight crime');

      expect(listItems?.item(9).getAttribute('class')).toEqual('item-magic-intelligence-dedicated-power');
      helper.expectHasAttribute('li.item-magic-intelligence-dedicated-power', 'hidden', false);
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
  
      helper.expectDetails('dndgen-details.item-header', 'my armor description (x9266)', true);
      helper.expectHasAttribute('li.item-contents', 'hidden', false);
      helper.expectHasAttribute('li.item-traits', 'hidden', false);
      helper.expectHasAttribute('li.item-magic-bonus', 'hidden', false);
      helper.expectHasAttribute('li.item-magic-special-abilities', 'hidden', false);
      helper.expectHasAttribute('li.item-magic-charges', 'hidden', false);
      helper.expectHasAttribute('li.item-magic-curse', 'hidden', false);
      helper.expectHasAttribute('li.item-magic-intelligence', 'hidden', false);
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

      helper.expectHasAttribute('li.item-magic-intelligence-languages', 'hidden', false);
      helper.expectDetails('li.item-magic-intelligence-languages > dndgen-details', 'Languages', true);
      helper.expectElements('li.item-magic-intelligence-languages > dndgen-details li', ['English', 'German']);

      expect(listItems?.item(6).textContent).toEqual('Senses: spidey-sense');

      const powers = listItems?.item(7) as HTMLElement;
      expect(powers.getAttribute('class')).toEqual('item-magic-intelligence-powers');

      helper.expectElement('li.item-magic-intelligence-powers span', 'Powers:');
      helper.expectElements('li.item-magic-intelligence-powers li', ['flight', 'super strength']);

      expect(listItems?.item(8).getAttribute('class')).toEqual('item-magic-intelligence-special-purpose');
      helper.expectHasAttribute('li.item-magic-intelligence-special-purpose', 'hidden', false);
      helper.expectElement('li.item-magic-intelligence-special-purpose', 'Special Purpose: to fight crime');

      expect(listItems?.item(9).getAttribute('class')).toEqual('item-magic-intelligence-dedicated-power');
      helper.expectHasAttribute('li.item-magic-intelligence-dedicated-power', 'hidden', false);
      helper.expectElement('li.item-magic-intelligence-dedicated-power', 'Dedicated Power: get really, really mad');

      expect(listItems?.item(10).textContent).toEqual('Personality: gregarious');
      
      let armorElement = compiled!.querySelector('li.item-armor');
      expect(armorElement).not.toBeNull();
      expect(armorElement).toBeTruthy();
      helper.expectHasAttribute('li.item-armor', 'hidden', false);
      
      helper.expectDetails('li.item-armor > dndgen-details', 'Armor', true);

      listItems = compiled.querySelectorAll('li.item-armor > dndgen-details ul.item-armor-details > li');
      expect(listItems).toBeTruthy();
      expect(listItems?.length).toEqual(4);
      expect(listItems?.item(0).textContent).toEqual('Size: my size');
      expect(listItems?.item(1).textContent).toEqual('Armor Bonus: 783');
      expect(listItems?.item(2).textContent).toEqual('Armor Check Penalty: -8245');
      expect(listItems?.item(3).textContent).toEqual('Max Dexterity Bonus: 9');
      expect(listItems?.item(3).getAttribute('class')).toEqual('item-armor-max-dex');
      helper.expectHasAttribute('li.item-armor-max-dex', 'hidden', false);

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
  
      helper.expectDetails('dndgen-details.item-header', 'my weapon description (x9266)', true);
      helper.expectHasAttribute('li.item-contents', 'hidden', false);
      helper.expectHasAttribute('li.item-traits', 'hidden', false);
      helper.expectHasAttribute('li.item-magic-bonus', 'hidden', false);
      helper.expectHasAttribute('li.item-magic-special-abilities', 'hidden', false);
      helper.expectHasAttribute('li.item-magic-charges', 'hidden', false);
      helper.expectHasAttribute('li.item-magic-curse', 'hidden', false);
      helper.expectHasAttribute('li.item-magic-intelligence', 'hidden', false);
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

      helper.expectHasAttribute('li.item-magic-intelligence-languages', 'hidden', false);
      helper.expectDetails('li.item-magic-intelligence-languages > dndgen-details', 'Languages', true);
      helper.expectElements('li.item-magic-intelligence-languages > dndgen-details li', ['English', 'German']);

      expect(listItems?.item(6).textContent).toEqual('Senses: spidey-sense');

      const powers = listItems?.item(7) as HTMLElement;
      expect(powers.getAttribute('class')).toEqual('item-magic-intelligence-powers');

      helper.expectElement('li.item-magic-intelligence-powers span', 'Powers:');
      helper.expectElements('li.item-magic-intelligence-powers li', ['flight', 'super strength']);

      expect(listItems?.item(8).getAttribute('class')).toEqual('item-magic-intelligence-special-purpose');
      helper.expectHasAttribute('li.item-magic-intelligence-special-purpose', 'hidden', false);
      helper.expectElement('li.item-magic-intelligence-special-purpose', 'Special Purpose: to fight crime');

      expect(listItems?.item(9).getAttribute('class')).toEqual('item-magic-intelligence-dedicated-power');
      helper.expectHasAttribute('li.item-magic-intelligence-dedicated-power', 'hidden', false);
      helper.expectElement('li.item-magic-intelligence-dedicated-power', 'Dedicated Power: get really, really mad');

      expect(listItems?.item(10).textContent).toEqual('Personality: gregarious');

      helper.expectExists('li.item-armor', false);
      
      helper.expectExists('li.item-weapon', true);
      helper.expectHasAttribute('li.item-weapon', 'hidden', false);
      
      helper.expectDetails('li.item-weapon > dndgen-details', 'Weapon', true);

      listItems = compiled.querySelectorAll('li.item-weapon > dndgen-details ul.item-weapon-details > li');
      expect(listItems).toBeTruthy();
      expect(listItems?.length).toEqual(8);
      expect(listItems?.item(0).textContent).toEqual('Size: my size');
      expect(listItems?.item(1).textContent).toEqual('Combat Types: stabbing, tickling');
      expect(listItems?.item(2).textContent).toEqual('Damage: my damage description');
      expect(listItems?.item(3).getAttribute('class')).toEqual('item-weapon-2nd-damage');
      helper.expectHasAttribute('li.item-weapon-2nd-damage', 'hidden', false);
      expect(listItems?.item(3).textContent).toEqual('Secondary Damage: my secondary damage description');
      expect(listItems?.item(4).textContent).toEqual('Threat Range: my threat range');
      expect(listItems?.item(5).textContent).toEqual('Critical Damage: my critical damage description');
      expect(listItems?.item(6).getAttribute('class')).toEqual('item-weapon-2nd-crit');
      helper.expectHasAttribute('li.item-weapon-2nd-crit', 'hidden', false);
      expect(listItems?.item(6).textContent).toEqual('Secondary Critical Damage: my secondary critical damage description');
      expect(listItems?.item(7).getAttribute('class')).toEqual('item-weapon-ammo');
      helper.expectHasAttribute('li.item-weapon-ammo', 'hidden', false);
      expect(listItems?.item(7).textContent).toEqual('Ammunition Used: my ammunition');
    });
  });
});
