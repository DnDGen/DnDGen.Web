import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CharacterComponent } from './character.component';
import { AppModule } from '../app.module';
import { Item } from './models/item.model';
import { Armor } from './models/armor.model';
import { Weapon } from './models/weapon.model';
import { SpecialAbility } from './models/specialAbility.model';
import { DetailsComponent } from '../shared/details.component';
import { By } from '@angular/platform-browser';
import { Character } from './models/character.model';
import { Ability } from './models/ability.model';
import { Skill } from './models/skill.model';
import { Feat } from './models/feat.model';
import { Treasure } from '../treasure/models/treasure.model';
import { Good } from '../treasure/models/good.model';

describe('CharacterComponent', () => {
  describe('unit', () => {
    let component: CharacterComponent;

    beforeEach(() => {
      component = new CharacterComponent();
    });
  
    it(`should set the character `, () => {
      const character = new Character('my character summary');
      component.character = character;

      expect(component.character).toBe(character);
    });
  });

  describe('integration', () => {
    let fixture: ComponentFixture<CharacterComponent>;
  
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [
          AppModule
        ],
        declarations: [CharacterComponent, DetailsComponent]
      }).compileComponents();
  
      fixture = TestBed.createComponent(CharacterComponent);
    });
  
    it('should create the component', () => {
      const component = fixture.componentInstance;
      expect(component).toBeTruthy();
    });

    function createCharacter(): Character {
        var newCharacter = new Character(`my character summary`);
        newCharacter.alignment.full = 'my alignment';
        newCharacter.class.name = 'my class name';
        newCharacter.class.level = 9266;
        newCharacter.class.summary = "my class summary";
        newCharacter.race.baseRace = 'my base race';
        newCharacter.race.landSpeed.value = 90210;
        newCharacter.race.landSpeed.description = 'fast';
        newCharacter.race.landSpeed.unit = 'feet per round';
        newCharacter.race.size = 'size';
        newCharacter.race.age.value = 42;
        newCharacter.race.age.unit = 'Years';
        newCharacter.race.age.description = 'my age description';
        newCharacter.race.maximumAge.value = 600;
        newCharacter.race.maximumAge.unit = 'Years';
        newCharacter.race.maximumAge.description = 'natural causes';
        newCharacter.race.height.value = 1337;
        newCharacter.race.height.unit = 'inches';
        newCharacter.race.height.description = 'tall';
        newCharacter.race.weight.value = 1336;
        newCharacter.race.weight.unit = 'Pounds';
        newCharacter.race.weight.description = 'heavy';
        newCharacter.race.gender = "gender fluid";
        newCharacter.race.summary = 'race summary';
        newCharacter.abilities.Charisma = createAbility("Strength", 96, -7);
        newCharacter.abilities.Constitution = createAbility("Constitution", 83, 8);
        newCharacter.abilities.Dexterity = createAbility("Dexterity", 245, -9);
        newCharacter.abilities.Intelligence = createAbility("Intelligence", 22, 2);
        newCharacter.abilities.Strength = createAbility("Wisdom", 2022, -2);
        newCharacter.abilities.Wisdom = createAbility("Charisma", 7, 0);

        expect(newCharacter.abilities.Charisma).not.toBeNull();
        expect(newCharacter.abilities.Constitution).not.toBeNull();
        expect(newCharacter.abilities.Dexterity).not.toBeNull();
        expect(newCharacter.abilities.Intelligence).not.toBeNull();
        expect(newCharacter.abilities.Strength).not.toBeNull();
        expect(newCharacter.abilities.Wisdom).not.toBeNull();

        newCharacter.languages.push('English ');
        newCharacter.languages.push('German ');
        newCharacter.skills.push(createSkill('skill ' + (1), "", 4, newCharacter.abilities.Constitution, 0, -6, true, false, 135));
        newCharacter.skills.push(createSkill('skill ' + (2), "focus", 1.5, newCharacter.abilities.Dexterity, 3, 0, false, true, 246));
        newCharacter.feats.racial.push(createFeat('racial feat 1'));
        newCharacter.feats.racial.push(createFeat('racial feat 2'));
        newCharacter.feats.class.push(createFeat('class feat 1'));
        newCharacter.feats.class.push(createFeat('class feat 2'));
        newCharacter.feats.additional.push(createFeat('additional feat 1'));
        newCharacter.feats.additional.push(createFeat('additional feat 2'));
        newCharacter.combat.adjustedDexterityBonus = 3;
        newCharacter.combat.armorClass.full = 7;
        newCharacter.combat.armorClass.touch = 34;
        newCharacter.combat.armorClass.flatFooted = 12;

        newCharacter.combat.baseAttack.allMeleeBonuses.length = 0;
        newCharacter.combat.baseAttack.allMeleeBonuses.push(21);
        newCharacter.combat.baseAttack.allMeleeBonuses.push(16);
        newCharacter.combat.baseAttack.allMeleeBonuses.push(11);
        newCharacter.combat.baseAttack.allMeleeBonuses.push(6);
        newCharacter.combat.baseAttack.allMeleeBonuses.push(1);

        newCharacter.combat.baseAttack.allRangedBonuses.length = 0;
        newCharacter.combat.baseAttack.allRangedBonuses.push(22);
        newCharacter.combat.baseAttack.allRangedBonuses.push(17);
        newCharacter.combat.baseAttack.allRangedBonuses.push(12);
        newCharacter.combat.baseAttack.allRangedBonuses.push(7);
        newCharacter.combat.baseAttack.allRangedBonuses.push(2);

        newCharacter.combat.hitPoints = 3456;
        newCharacter.combat.initiativeBonus = 4567;
        newCharacter.combat.savingThrows.fortitude = 56;
        newCharacter.combat.savingThrows.reflex = 78;
        newCharacter.combat.savingThrows.will = 67;
        newCharacter.combat.savingThrows.hasFortitudeSave = true;

        newCharacter.challengeRating = 89;

        return newCharacter;
    }

    function createAbility(name: string, value: number, bonus: number) {
        return new Ability(name, value, bonus);
    }

    function createSkill(name: string, focus: string, effectiveRanks: number, baseAbility: Ability, bonus: number, acPenalty: number, classSkill: boolean, circumstantialBonus: boolean, totalBonus: number): Skill {
        return new Skill(name, baseAbility, focus, bonus, classSkill, acPenalty, circumstantialBonus, 0, false, effectiveRanks, false, 0, false, totalBonus);
    }

    function createFeat(name: string) {
        return new Feat(name);
    }

    function createItem(name: string): Item {
        const item = new Item(name, 'MyItemType');
        item.description = `${name} description`;
        return item;
    }

    function createWeapon(name: string): Weapon {
        const weapon = new Weapon(name, 'Weapon');
        weapon.description = `${name} description`;
        weapon.damageDescription = '9d2 damage';

        return weapon;
    }

    function createArmor(name: string): Armor {
        const armor = new Armor(name, 'Armor');
        armor.description = `${name} description`;
        armor.totalArmorBonus = 92;

        return armor;
    }

    function createTreasure(): Treasure {
        const treasure = new Treasure();
        treasure.isAny = true;
        treasure.coin.currency = 'my currency';
        treasure.coin.quantity = 9;
        treasure.goods = [
            new Good('good 1', 22), new Good('good 2', 2022)
        ];
        treasure.items = [
            new Item('item 1', 'item type 1'), new Item('item 2', 'item type 2'), new Item('item 3', 'item type 3')
        ];

        return treasure;
    }
  
    it(`should render the character summary`, () => {
      const component = fixture.componentInstance;
      component.character = new Character('my character summary');

      fixture.detectChanges();
  
      expectDetails('dndgen-details.character-header', 'my character summary', true);
    });
  
    it(`should render the character hit points`, () => {
      const component = fixture.componentInstance;
      component.character = new Character('my character summary');
      component.character.combat.hitPoints = 9266;

      fixture.detectChanges();
  
      expectDetails('dndgen-details.character-header', 'my character summary', true);
      expectDetails('dndgen-details.character-header li.character-combat > dndgen-details', 'Combat', true);

      const compiled = fixture.nativeElement as HTMLElement;
      const element = compiled.querySelector('li.character-combat li.character-combat-hitpoints');
      expect(element).toBeTruthy();
      expect(element?.textContent).toEqual('Hit Points: 9,266');
    });
  
    it(`should render the character armor class`, () => {
      const component = fixture.componentInstance;
      component.character = new Character('my character summary');
      component.character.combat.armorClass.full = 42;
      component.character.combat.armorClass.flatFooted = 600;
      component.character.combat.armorClass.touch = 96;

      fixture.detectChanges();
  
      expectDetails('dndgen-details.character-header', 'my character summary', true);
      expectDetails('dndgen-details.character-header li.character-combat > dndgen-details', 'Combat', true);

      const compiled = fixture.nativeElement as HTMLElement;
      const element = compiled.querySelector('li.character-combat li.character-combat-ac span');
      expect(element).toBeTruthy();
      expect(element?.textContent).toEqual('Armor Class: 42');
      
      const listItems = compiled.querySelectorAll('li.character-combat li.character-combat-ac li');
      expect(listItems).toBeTruthy();
      expect(listItems?.length).toEqual(2);
      expect(listItems?.item(0).textContent).toEqual('Flat-Footed: 600');
      expect(listItems?.item(1).textContent).toEqual('Touch: 96');
    });
  
    it(`should render the character armor class with circumstantial bonus`, () => {
      const component = fixture.componentInstance;
      component.character = new Character('my character summary');
      component.character.combat.armorClass.full = 42;
      component.character.combat.armorClass.circumstantialBonus = true;
      component.character.combat.armorClass.flatFooted = 600;
      component.character.combat.armorClass.touch = 96;

      fixture.detectChanges();
  
      expectDetails('dndgen-details.character-header', 'my character summary', true);
      expectDetails('dndgen-details.character-header li.character-combat > dndgen-details', 'Combat', true);

      const compiled = fixture.nativeElement as HTMLElement;
      const element = compiled.querySelector('li.character-combat li.character-combat-ac span');
      expect(element).toBeTruthy();
      expect(element?.textContent).toEqual('Armor Class: 42 *');
      
      const listItems = compiled.querySelectorAll('li.character-combat li.character-combat-ac li');
      expect(listItems).toBeTruthy();
      expect(listItems?.length).toEqual(2);
      expect(listItems?.item(0).textContent).toEqual('Flat-Footed: 600');
      expect(listItems?.item(1).textContent).toEqual('Touch: 96');
    });
  
    it(`should render the character base attack`, () => {
      const component = fixture.componentInstance;
      component.character = new Character('my character summary');
      component.character.combat.baseAttack.baseBonus = 9;
      component.character.combat.baseAttack.allMeleeBonuses = [2];
      component.character.combat.baseAttack.allRangedBonuses = [6];

      fixture.detectChanges();
  
      expectDetails('dndgen-details.character-header', 'my character summary', true);
      expectDetails('dndgen-details.character-header li.character-combat > dndgen-details', 'Combat', true);

      const compiled = fixture.nativeElement as HTMLElement;
      const element = compiled.querySelector('li.character-combat li.character-combat-ba span');
      expect(element).toBeTruthy();
      expect(element?.textContent).toEqual('Base Attack: +9');
      
      const listItems = compiled.querySelectorAll('li.character-combat li.character-combat-ba li');
      expect(listItems).toBeTruthy();
      expect(listItems?.length).toEqual(2);
      expect(listItems?.item(0).textContent).toEqual('Melee: +2');
      expect(listItems?.item(1).textContent).toEqual('Ranged: +6');
    });
  
    it(`should render the character base attack - negative`, () => {
      const component = fixture.componentInstance;
      component.character = new Character('my character summary');
      component.character.combat.baseAttack.baseBonus = 9;
      component.character.combat.baseAttack.allMeleeBonuses = [-2];
      component.character.combat.baseAttack.allRangedBonuses = [-6];

      fixture.detectChanges();
  
      expectDetails('dndgen-details.character-header', 'my character summary', true);
      expectDetails('dndgen-details.character-header li.character-combat > dndgen-details', 'Combat', true);

      const compiled = fixture.nativeElement as HTMLElement;
      const element = compiled.querySelector('li.character-combat li.character-combat-ba span');
      expect(element).toBeTruthy();
      expect(element?.textContent).toEqual('Base Attack: +9');
      
      const listItems = compiled.querySelectorAll('li.character-combat li.character-combat-ba li');
      expect(listItems).toBeTruthy();
      expect(listItems?.length).toEqual(2);
      expect(listItems?.item(0).textContent).toEqual('Melee: -2');
      expect(listItems?.item(1).textContent).toEqual('Ranged: -6');
    });
  
    it(`should render the character base attack - multiple attacks`, () => {
      const component = fixture.componentInstance;
      component.character = new Character('my character summary');
      component.character.combat.baseAttack.baseBonus = 9;
      component.character.combat.baseAttack.allMeleeBonuses = [2, 6];
      component.character.combat.baseAttack.allRangedBonuses = [6, 9, 0];

      fixture.detectChanges();
  
      expectDetails('dndgen-details.character-header', 'my character summary', true);
      expectDetails('dndgen-details.character-header li.character-combat > dndgen-details', 'Combat', true);

      const compiled = fixture.nativeElement as HTMLElement;
      const element = compiled.querySelector('li.character-combat li.character-combat-ba span');
      expect(element).toBeTruthy();
      expect(element?.textContent).toEqual('Base Attack: +9');
      
      const listItems = compiled.querySelectorAll('li.character-combat li.character-combat-ba li');
      expect(listItems).toBeTruthy();
      expect(listItems?.length).toEqual(2);
      expect(listItems?.item(0).textContent).toEqual('Melee: +2/+6');
      expect(listItems?.item(1).textContent).toEqual('Ranged: +6/+9/+0');
    });
  
    it(`should render the character base attack - multiple attacks and negative`, () => {
      const component = fixture.componentInstance;
      component.character = new Character('my character summary');
      component.character.combat.baseAttack.baseBonus = 9;
      component.character.combat.baseAttack.allMeleeBonuses = [2, -6];
      component.character.combat.baseAttack.allRangedBonuses = [6, 9, -2];

      fixture.detectChanges();
  
      expectDetails('dndgen-details.character-header', 'my character summary', true);
      expectDetails('dndgen-details.character-header li.character-combat > dndgen-details', 'Combat', true);

      const compiled = fixture.nativeElement as HTMLElement;
      const element = compiled.querySelector('li.character-combat li.character-combat-ba span');
      expect(element).toBeTruthy();
      expect(element?.textContent).toEqual('Base Attack: +9');
      
      const listItems = compiled.querySelectorAll('li.character-combat li.character-combat-ba li');
      expect(listItems).toBeTruthy();
      expect(listItems?.length).toEqual(2);
      expect(listItems?.item(0).textContent).toEqual('Melee: +2/-6');
      expect(listItems?.item(1).textContent).toEqual('Ranged: +6/+9/-2');
    });
  
    it(`should render the character base attack with circumstantial bonus`, () => {
      const component = fixture.componentInstance;
      component.character = new Character('my character summary');
      component.character.combat.baseAttack.baseBonus = 9;
      component.character.combat.baseAttack.circumstantialBonus = true;
      component.character.combat.baseAttack.allMeleeBonuses = [2];
      component.character.combat.baseAttack.allRangedBonuses = [6];

      fixture.detectChanges();
  
      expectDetails('dndgen-details.character-header', 'my character summary', true);
      expectDetails('dndgen-details.character-header li.character-combat > dndgen-details', 'Combat', true);

      const compiled = fixture.nativeElement as HTMLElement;
      const element = compiled.querySelector('li.character-combat li.character-combat-ba span');
      expect(element).toBeTruthy();
      expect(element?.textContent).toEqual('Base Attack: +9');
      
      const listItems = compiled.querySelectorAll('li.character-combat li.character-combat-ba li');
      expect(listItems).toBeTruthy();
      expect(listItems?.length).toEqual(2);
      expect(listItems?.item(0).textContent).toEqual('Melee: +2 *');
      expect(listItems?.item(1).textContent).toEqual('Ranged: +6 *');
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

    function expectDetails(selector: string, heading: string, hasDetails: boolean) {
      const element = fixture.debugElement.query(By.css(selector));
      expect(element).toBeDefined();
      expect(element.componentInstance).toBeDefined();
      expect(element.componentInstance).toBeInstanceOf(DetailsComponent);

      const details = element.componentInstance as DetailsComponent;
      expect(details.heading).toEqual(heading);
      expect(details.hasDetails).toBe(hasDetails);
    }
  
    it(`should render a full character`, () => {
      const component = fixture.componentInstance;
      component.item = getItem();
      component.item.traits = ['my trait', 'my other trait'];

      fixture.detectChanges();
  
      expectDetails('dndgen-details.item-header', 'my item description (x1)', true);
      expectOnlyToShow('li.item-traits');
      expectDetails('li.item-traits > dndgen-details', 'Traits', true);

      const itemTraitsListItems = getAll('li.item-trait', ['li.item-traits', 'dndgen-details', 'ul']);
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
  
      expectDetails('dndgen-details.item-header', 'my item description (x1)', true);
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
  
      expectDetails('dndgen-details.item-header', 'my item description (x1)', true);
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
  
      expectDetails('dndgen-details.item-header', 'my item description (x1)', true);
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
  
      expectDetails('dndgen-details.item-header', 'my item description (x1)', true);
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
  
      expectDetails('dndgen-details.item-header', 'my item description (x1)', true);
      expectOnlyToShow('li.item-magic-special-abilities');
      expectDetails('li.item-magic-special-abilities > dndgen-details', 'Special Abilities', true);

      const listItems = getAll('li.item-magic-special-ability', ['li.item-magic-special-abilities', 'dndgen-details', 'ul']);
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
  
      expectDetails('dndgen-details.item-header', 'my item description (x1)', true);
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
  
      expectDetails('dndgen-details.item-header', 'my item description (x1)', true);
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
  
      expectDetails('dndgen-details.item-header', 'my item description (x1)', true);
      expectOnlyToShow('li.item-magic-curse');

      const compiled = fixture.nativeElement as HTMLElement;
      const curse = compiled.querySelector('li.item-magic-curse');
      expect(curse).toBeDefined();
      expect(curse?.textContent).toEqual('Curse: my curse');
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
  
      expectDetails('dndgen-details.item-header', 'my item description (x1)', true);
      expectOnlyToShow('li.item-magic-intelligence');
      expectDetails('li.item-magic-intelligence > dndgen-details', 'Intelligence', true);

      const listItems = getAll('ul.item-magic-intelligence-details > li', ['li.item-magic-intelligence', 'dndgen-details']);
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
      expectDetails('li.item-magic-intelligence-languages > dndgen-details', 'Languages', false);

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
  
      expectDetails('dndgen-details.item-header', 'my item description (x1)', true);
      expectOnlyToShow('li.item-magic-intelligence');
      expectDetails('li.item-magic-intelligence > dndgen-details', 'Intelligence', true);

      const listItems = getAll('ul.item-magic-intelligence-details > li', ['li.item-magic-intelligence', 'dndgen-details']);
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
      expectDetails('li.item-magic-intelligence-languages > dndgen-details', 'Languages', true);
      
      const languages = getAll('li', ['li.item-magic-intelligence-languages', 'dndgen-details', 'ul']);
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
  
      expectDetails('dndgen-details.item-header', 'my item description (x1)', true);
      expectOnlyToShow('li.item-magic-intelligence');
      expectDetails('li.item-magic-intelligence > dndgen-details', 'Intelligence', true);

      const listItems = getAll('ul.item-magic-intelligence-details > li', ['li.item-magic-intelligence', 'dndgen-details']);
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
      expectDetails('li.item-magic-intelligence-languages > dndgen-details', 'Languages', false);

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
  
      expectDetails('dndgen-details.item-header', 'my item description (x1)', true);
      expectOnlyToShow('li.item-magic-intelligence');
      expectDetails('li.item-magic-intelligence > dndgen-details', 'Intelligence', true);

      const listItems = getAll('ul.item-magic-intelligence-details > li', ['li.item-magic-intelligence', 'dndgen-details']);
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
      expectDetails('li.item-magic-intelligence-languages > dndgen-details', 'Languages', false);

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
  
      expectDetails('dndgen-details.item-header', 'my armor description (x1)', true);
      expectOnlyToShow('li.item-armor');
      expectDetails('li.item-armor > dndgen-details', 'Armor', true);

      const listItems = getAll('ul.item-armor-details > li', ['li.item-armor', 'dndgen-details']);
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
  
      expectDetails('dndgen-details.item-header', 'my armor description (x1)', true);
      expectOnlyToShow('li.item-armor');
      expectDetails('li.item-armor > dndgen-details', 'Armor', true);

      const listItems = getAll('ul.item-armor-details > li', ['li.item-armor', 'dndgen-details']);
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
  
      expectDetails('dndgen-details.item-header', 'my weapon description (x1)', true);
      expectOnlyToShow('li.item-weapon');
      expectDetails('li.item-weapon > dndgen-details', 'Weapon', true);

      const listItems = getAll('ul.item-weapon-details > li', ['li.item-weapon', 'dndgen-details']);
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
  
      expectDetails('dndgen-details.item-header', 'my weapon description (x1)', true);
      expectOnlyToShow('li.item-weapon');
      expectDetails('li.item-weapon > dndgen-details', 'Weapon', true);

      const listItems = getAll('ul.item-weapon-details > li', ['li.item-weapon', 'dndgen-details']);
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
  
      expectDetails('dndgen-details.item-header', 'my weapon description (x1)', true);
      expectOnlyToShow('li.item-weapon');
      expectDetails('li.item-weapon > dndgen-details', 'Weapon', true);

      const listItems = getAll('ul.item-weapon-details > li', ['li.item-weapon', 'dndgen-details']);
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
  
      expectDetails('dndgen-details.item-header', 'my item description (x9266)', true);
      expectHasAttribute('li.item-contents', 'hidden', false);
      expectHasAttribute('li.item-traits', 'hidden', false);
      expectHasAttribute('li.item-magic-bonus', 'hidden', false);
      expectHasAttribute('li.item-magic-special-abilities', 'hidden', false);
      expectHasAttribute('li.item-magic-charges', 'hidden', false);
      expectHasAttribute('li.item-magic-curse', 'hidden', false);
      expectHasAttribute('li.item-magic-intelligence', 'hidden', false);
      expectDetails('li.item-contents > dndgen-details', 'Contents', true);
      expectDetails('li.item-traits > dndgen-details', 'Traits', true);
      expectDetails('li.item-magic-special-abilities > dndgen-details', 'Special Abilities', true);
      expectDetails('li.item-magic-intelligence > dndgen-details', 'Intelligence', true);

      let listItems = getAll('li.item-content', ['li.item-contents', 'dndgen-details', 'ul']);
      expect(listItems).toBeDefined();
      expect(listItems?.length).toBe(2);
      expect(listItems?.item(0).textContent).toEqual('my contents');
      expect(listItems?.item(1).textContent).toEqual('my other contents');

      listItems = getAll('li.item-trait', ['li.item-traits', 'dndgen-details', 'ul']);
      expect(listItems).toBeDefined();
      expect(listItems?.length).toBe(2);
      expect(listItems?.item(0).textContent).toEqual('my trait');
      expect(listItems?.item(1).textContent).toEqual('my other trait');
      
      const compiled = fixture.nativeElement as HTMLElement;
      let element = compiled.querySelector('li.item-magic-bonus');
      expect(element).toBeDefined();
      expect(element?.textContent).toEqual('Bonus: +90210');

      listItems = getAll('li.item-magic-special-ability', ['li.item-magic-special-abilities', 'dndgen-details', 'ul']);
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

      listItems = getAll('ul.item-magic-intelligence-details > li', ['li.item-magic-intelligence', 'dndgen-details']);
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
      expectDetails('li.item-magic-intelligence-languages > dndgen-details', 'Languages', true);
      
      const languages = getAll('li', ['li.item-magic-intelligence-languages', 'dndgen-details', 'ul']);
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
  
      expectDetails('dndgen-details.item-header', 'my armor description (x9266)', true);
      expectHasAttribute('li.item-contents', 'hidden', false);
      expectHasAttribute('li.item-traits', 'hidden', false);
      expectHasAttribute('li.item-magic-bonus', 'hidden', false);
      expectHasAttribute('li.item-magic-special-abilities', 'hidden', false);
      expectHasAttribute('li.item-magic-charges', 'hidden', false);
      expectHasAttribute('li.item-magic-curse', 'hidden', false);
      expectHasAttribute('li.item-magic-intelligence', 'hidden', false);
      expectDetails('li.item-contents > dndgen-details', 'Contents', true);
      expectDetails('li.item-traits > dndgen-details', 'Traits', true);
      expectDetails('li.item-magic-special-abilities > dndgen-details', 'Special Abilities', true);
      expectDetails('li.item-magic-intelligence > dndgen-details', 'Intelligence', true);

      let listItems = getAll('li.item-content', ['li.item-contents', 'dndgen-details', 'ul']);
      expect(listItems).toBeDefined();
      expect(listItems?.length).toBe(2);
      expect(listItems?.item(0).textContent).toEqual('my contents');
      expect(listItems?.item(1).textContent).toEqual('my other contents');

      listItems = getAll('li.item-trait', ['li.item-traits', 'dndgen-details', 'ul']);
      expect(listItems).toBeDefined();
      expect(listItems?.length).toBe(2);
      expect(listItems?.item(0).textContent).toEqual('my trait');
      expect(listItems?.item(1).textContent).toEqual('my other trait');
      
      const compiled = fixture.nativeElement as HTMLElement;
      let element = compiled.querySelector('li.item-magic-bonus');
      expect(element).toBeDefined();
      expect(element?.textContent).toEqual('Bonus: +90210');

      listItems = getAll('li.item-magic-special-ability', ['li.item-magic-special-abilities', 'dndgen-details', 'ul']);
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

      listItems = getAll('ul.item-magic-intelligence-details > li', ['li.item-magic-intelligence', 'dndgen-details']);
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
      expectDetails('li.item-magic-intelligence-languages > dndgen-details', 'Languages', true);
      
      const languages = getAll('li', ['li.item-magic-intelligence-languages', 'dndgen-details', 'ul']);
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
      
      expectDetails('li.item-armor > dndgen-details', 'Armor', true);

      listItems = getAll('ul.item-armor-details > li', ['li.item-armor', 'dndgen-details']);
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
  
      expectDetails('dndgen-details.item-header', 'my weapon description (x9266)', true);
      expectHasAttribute('li.item-contents', 'hidden', false);
      expectHasAttribute('li.item-traits', 'hidden', false);
      expectHasAttribute('li.item-magic-bonus', 'hidden', false);
      expectHasAttribute('li.item-magic-special-abilities', 'hidden', false);
      expectHasAttribute('li.item-magic-charges', 'hidden', false);
      expectHasAttribute('li.item-magic-curse', 'hidden', false);
      expectHasAttribute('li.item-magic-intelligence', 'hidden', false);
      expectDetails('li.item-contents > dndgen-details', 'Contents', true);
      expectDetails('li.item-traits > dndgen-details', 'Traits', true);
      expectDetails('li.item-magic-special-abilities > dndgen-details', 'Special Abilities', true);
      expectDetails('li.item-magic-intelligence > dndgen-details', 'Intelligence', true);

      let listItems = getAll('li.item-content', ['li.item-contents', 'dndgen-details', 'ul']);
      expect(listItems).toBeDefined();
      expect(listItems?.length).toBe(2);
      expect(listItems?.item(0).textContent).toEqual('my contents');
      expect(listItems?.item(1).textContent).toEqual('my other contents');

      listItems = getAll('li.item-trait', ['li.item-traits', 'dndgen-details', 'ul']);
      expect(listItems).toBeDefined();
      expect(listItems?.length).toBe(2);
      expect(listItems?.item(0).textContent).toEqual('my trait');
      expect(listItems?.item(1).textContent).toEqual('my other trait');
      
      const compiled = fixture.nativeElement as HTMLElement;
      let element = compiled.querySelector('li.item-magic-bonus');
      expect(element).toBeDefined();
      expect(element?.textContent).toEqual('Bonus: +90210');

      listItems = getAll('li.item-magic-special-ability', ['li.item-magic-special-abilities', 'dndgen-details', 'ul']);
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

      listItems = getAll('ul.item-magic-intelligence-details > li', ['li.item-magic-intelligence', 'dndgen-details']);
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
      expectDetails('li.item-magic-intelligence-languages > dndgen-details', 'Languages', true);
      
      const languages = getAll('li', ['li.item-magic-intelligence-languages', 'dndgen-details', 'ul']);
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
      
      expectDetails('li.item-weapon > dndgen-details', 'Weapon', true);

      listItems = getAll('ul.item-weapon-details > li', ['li.item-weapon', 'dndgen-details']);
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
