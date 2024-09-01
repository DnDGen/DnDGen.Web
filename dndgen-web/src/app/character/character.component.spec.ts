import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CharacterComponent } from './character.component';
import { AppModule } from '../app.module';
import { Item } from '../treasure/models/item.model';
import { Armor } from '../treasure/models/armor.model';
import { Weapon } from '../treasure/models/weapon.model';
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

    it('should say primary weapon is two-handed', () => {
      const character = new Character('my character summary');
      character.equipment.primaryHand = new Weapon('my weapon', 'Weapon');
      character.equipment.primaryHand.attributes = ['melee', 'Two-Handed'];

      component.character = character;

      expect(component.isTwoHanded()).toBeTrue();
    });

    it('should say primary weapon is not two-handed - one-handed', () => {
      const character = new Character('my character summary');
      character.equipment.primaryHand = new Weapon('my weapon', 'Weapon');
      character.equipment.primaryHand.attributes = ['melee', 'One-Handed'];

      component.character = character;

      expect(component.isTwoHanded()).toBeFalse();
    });

    it('should say primary weapon is not two-handed - no primary weapon', () => {
      const character = new Character('my character summary');
      character.equipment.primaryHand = null;

      component.character = character;

      expect(component.isTwoHanded()).toBeFalse();
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
  
    it(`should render the character base attack with multiple attacks and circumstantial bonus`, () => {
      const component = fixture.componentInstance;
      component.character = new Character('my character summary');
      component.character.combat.baseAttack.baseBonus = 9;
      component.character.combat.baseAttack.circumstantialBonus = true;
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
      expect(listItems?.item(0).textContent).toEqual('Melee: +2/+6 *');
      expect(listItems?.item(1).textContent).toEqual('Ranged: +6/+9/+0 *');
    });
  
    it(`should render the character initiative bonus`, () => {
      const component = fixture.componentInstance;
      component.character = new Character('my character summary');
      component.character.combat.initiativeBonus = 9;

      fixture.detectChanges();
  
      expectDetails('dndgen-details.character-header', 'my character summary', true);
      expectDetails('dndgen-details.character-header li.character-combat > dndgen-details', 'Combat', true);

      const compiled = fixture.nativeElement as HTMLElement;
      const element = compiled.querySelector('li.character-combat li.character-combat-initiative');
      expect(element).toBeTruthy();
      expect(element?.textContent).toEqual('Initiative Bonus: +9');
    });
  
    it(`should render the character initiative bonus - negative`, () => {
      const component = fixture.componentInstance;
      component.character = new Character('my character summary');
      component.character.combat.initiativeBonus = -2;

      fixture.detectChanges();
  
      expectDetails('dndgen-details.character-header', 'my character summary', true);
      expectDetails('dndgen-details.character-header li.character-combat > dndgen-details', 'Combat', true);

      const compiled = fixture.nativeElement as HTMLElement;
      const element = compiled.querySelector('li.character-combat li.character-combat-initiative');
      expect(element).toBeTruthy();
      expect(element?.textContent).toEqual('Initiative Bonus: -2');
    });
  
    it(`should render the character saving throws`, () => {
      const component = fixture.componentInstance;
      component.character = new Character('my character summary');
      component.character.combat.savingThrows.hasFortitudeSave = true;
      component.character.combat.savingThrows.fortitude = 92;
      component.character.combat.savingThrows.reflex = 66;
      component.character.combat.savingThrows.will = 902;

      fixture.detectChanges();
  
      expectDetails('dndgen-details.character-header', 'my character summary', true);
      expectDetails('dndgen-details.character-header li.character-combat > dndgen-details', 'Combat', true);

      const compiled = fixture.nativeElement as HTMLElement;
      const element = compiled.querySelector('li.character-combat li.character-combat-saves span');
      expect(element).toBeTruthy();
      expect(element?.textContent).toEqual('Saving Throws:');
      
      const listItems = compiled.querySelectorAll('li.character-combat li.character-combat-saves li');
      expect(listItems).toBeTruthy();
      expect(listItems?.length).toEqual(4);
      expect(listItems?.item(0).textContent).toEqual('Fortitude: +92');
      expect(listItems?.item(1).textContent).toEqual('Reflex: +66');
      expect(listItems?.item(2).textContent).toEqual('Will: +902');
      expect(listItems?.item(3).textContent).toEqual('Circumstantial Bonus');

      expectHasAttribute('li.character-combat li.character-combat-saves li.character-combat-saves-fort', 'hidden', false);
      expectHasAttribute('li.character-combat li.character-combat-saves li.character-combat-saves-ref', 'hidden', false);
      expectHasAttribute('li.character-combat li.character-combat-saves li.character-combat-saves-will', 'hidden', false);
      expectHasAttribute('li.character-combat li.character-combat-saves li.character-combat-saves-condition', 'hidden', true);
    });
  
    it(`should render the character saving throws - conditional bonus`, () => {
      const component = fixture.componentInstance;
      component.character = new Character('my character summary');
      component.character.combat.savingThrows.hasFortitudeSave = true;
      component.character.combat.savingThrows.fortitude = 92;
      component.character.combat.savingThrows.reflex = 66;
      component.character.combat.savingThrows.will = 902;
      component.character.combat.savingThrows.circumstantialBonus = true;

      fixture.detectChanges();
  
      expectDetails('dndgen-details.character-header', 'my character summary', true);
      expectDetails('dndgen-details.character-header li.character-combat > dndgen-details', 'Combat', true);

      const compiled = fixture.nativeElement as HTMLElement;
      const element = compiled.querySelector('li.character-combat li.character-combat-saves span');
      expect(element).toBeTruthy();
      expect(element?.textContent).toEqual('Saving Throws:');
      
      const listItems = compiled.querySelectorAll('li.character-combat li.character-combat-saves li');
      expect(listItems).toBeTruthy();
      expect(listItems?.length).toEqual(4);
      expect(listItems?.item(0).textContent).toEqual('Fortitude: +92');
      expect(listItems?.item(1).textContent).toEqual('Reflex: +66');
      expect(listItems?.item(2).textContent).toEqual('Will: +902');
      expect(listItems?.item(3).textContent).toEqual('Circumstantial Bonus');

      expectHasAttribute('li.character-combat li.character-combat-saves li.character-combat-saves-fort', 'hidden', false);
      expectHasAttribute('li.character-combat li.character-combat-saves li.character-combat-saves-ref', 'hidden', false);
      expectHasAttribute('li.character-combat li.character-combat-saves li.character-combat-saves-will', 'hidden', false);
      expectHasAttribute('li.character-combat li.character-combat-saves li.character-combat-saves-condition', 'hidden', false);
    });
  
    it(`should render the character saving throws - no fortitude`, () => {
      const component = fixture.componentInstance;
      component.character = new Character('my character summary');
      component.character.combat.savingThrows.hasFortitudeSave = false;
      component.character.combat.savingThrows.fortitude = 0;
      component.character.combat.savingThrows.reflex = 66;
      component.character.combat.savingThrows.will = 902;

      fixture.detectChanges();
  
      expectDetails('dndgen-details.character-header', 'my character summary', true);
      expectDetails('dndgen-details.character-header li.character-combat > dndgen-details', 'Combat', true);

      const compiled = fixture.nativeElement as HTMLElement;
      const element = compiled.querySelector('li.character-combat li.character-combat-saves span');
      expect(element).toBeTruthy();
      expect(element?.textContent).toEqual('Saving Throws:');
      
      const listItems = compiled.querySelectorAll('li.character-combat li.character-combat-saves li');
      expect(listItems).toBeTruthy();
      expect(listItems?.length).toEqual(4);
      expect(listItems?.item(0).textContent).toEqual('Fortitude: +0');
      expect(listItems?.item(1).textContent).toEqual('Reflex: +66');
      expect(listItems?.item(2).textContent).toEqual('Will: +902');
      expect(listItems?.item(3).textContent).toEqual('Circumstantial Bonus');

      expectHasAttribute('li.character-combat li.character-combat-saves li.character-combat-saves-fort', 'hidden', true);
      expectHasAttribute('li.character-combat li.character-combat-saves li.character-combat-saves-ref', 'hidden', false);
      expectHasAttribute('li.character-combat li.character-combat-saves li.character-combat-saves-will', 'hidden', false);
      expectHasAttribute('li.character-combat li.character-combat-saves li.character-combat-saves-condition', 'hidden', true);
    });
  
    it(`should render the character saving throws - no fortitude and conditional bonus`, () => {
      const component = fixture.componentInstance;
      component.character = new Character('my character summary');
      component.character.combat.savingThrows.hasFortitudeSave = false;
      component.character.combat.savingThrows.fortitude = 0;
      component.character.combat.savingThrows.reflex = 66;
      component.character.combat.savingThrows.will = 902;
      component.character.combat.savingThrows.circumstantialBonus = true;

      fixture.detectChanges();
  
      expectDetails('dndgen-details.character-header', 'my character summary', true);
      expectDetails('dndgen-details.character-header li.character-combat > dndgen-details', 'Combat', true);

      const compiled = fixture.nativeElement as HTMLElement;
      const element = compiled.querySelector('li.character-combat li.character-combat-saves span');
      expect(element).toBeTruthy();
      expect(element?.textContent).toEqual('Saving Throws:');
      
      const listItems = compiled.querySelectorAll('li.character-combat li.character-combat-saves li');
      expect(listItems).toBeTruthy();
      expect(listItems?.length).toEqual(4);
      expect(listItems?.item(0).textContent).toEqual('Fortitude: +0');
      expect(listItems?.item(1).textContent).toEqual('Reflex: +66');
      expect(listItems?.item(2).textContent).toEqual('Will: +902');
      expect(listItems?.item(3).textContent).toEqual('Circumstantial Bonus');

      expectHasAttribute('li.character-combat li.character-combat-saves li.character-combat-saves-fort', 'hidden', true);
      expectHasAttribute('li.character-combat li.character-combat-saves li.character-combat-saves-ref', 'hidden', false);
      expectHasAttribute('li.character-combat li.character-combat-saves li.character-combat-saves-will', 'hidden', false);
      expectHasAttribute('li.character-combat li.character-combat-saves li.character-combat-saves-condition', 'hidden', false);
    });
  
    it(`should render the character adjusted dexterity bonus`, () => {
      const component = fixture.componentInstance;
      component.character = new Character('my character summary');
      component.character.combat.adjustedDexterityBonus = 9;

      fixture.detectChanges();
  
      expectDetails('dndgen-details.character-header', 'my character summary', true);
      expectDetails('dndgen-details.character-header li.character-combat > dndgen-details', 'Combat', true);

      const compiled = fixture.nativeElement as HTMLElement;
      const element = compiled.querySelector('li.character-combat li.character-combat-adj-dex');
      expect(element).toBeTruthy();
      expect(element?.textContent).toEqual('Adjusted Dexterity Bonus: +9');
    });
  
    it(`should render the character adjusted dexterity bonus - negative`, () => {
      const component = fixture.componentInstance;
      component.character = new Character('my character summary');
      component.character.combat.adjustedDexterityBonus = -2;

      fixture.detectChanges();
  
      expectDetails('dndgen-details.character-header', 'my character summary', true);
      expectDetails('dndgen-details.character-header li.character-combat > dndgen-details', 'Combat', true);

      const compiled = fixture.nativeElement as HTMLElement;
      const element = compiled.querySelector('li.character-combat li.character-combat-adj-dex');
      expect(element).toBeTruthy();
      expect(element?.textContent).toEqual('Adjusted Dexterity Bonus: -2');
    });
  
    it(`should render the character challenge rating`, () => {
      const component = fixture.componentInstance;
      component.character = new Character('my character summary');
      component.character.challengeRating = 92;

      fixture.detectChanges();
  
      expectDetails('dndgen-details.character-header', 'my character summary', true);

      const compiled = fixture.nativeElement as HTMLElement;
      const element = compiled.querySelector('dndgen-details.character-header li.character-cr');
      expect(element).toBeTruthy();
      expect(element?.textContent).toEqual('Challenge Rating: 92');
    });
  
    it(`should render the character alignment`, () => {
      const component = fixture.componentInstance;
      component.character = new Character('my character summary');
      component.character.alignment.full = 'my full alignment';

      fixture.detectChanges();
  
      expectDetails('dndgen-details.character-header', 'my character summary', true);

      const compiled = fixture.nativeElement as HTMLElement;
      const element = compiled.querySelector('dndgen-details.character-header li.character-alignment');
      expect(element).toBeTruthy();
      expect(element?.textContent).toEqual('Alignment: my full alignment');
    });
  
    it(`should render the character class`, () => {
      const component = fixture.componentInstance;
      component.character = new Character('my character summary');
      component.character.class.summary = 'my class summary';

      fixture.detectChanges();
  
      expectDetails('dndgen-details.character-header', 'my character summary', true);
      expectDetails('dndgen-details.character-header li.character-class > dndgen-details', 'my class summary', false);
    });
  
    it(`should render the character class with specialist fields`, () => {
      const component = fixture.componentInstance;
      component.character = new Character('my character summary');
      component.character.class.summary = 'my class summary';
      component.character.class.specialistFields = ['special field 1', 'special field 2'];

      fixture.detectChanges();
  
      expectDetails('dndgen-details.character-header', 'my character summary', true);
      expectDetails('dndgen-details.character-header li.character-class > dndgen-details', 'my class summary', true);
      expectDetails('li.character-class > dndgen-details li.character-class-specialist > dndgen-details', 'Specialist Fields', true);
      expectDetails('li.character-class > dndgen-details li.character-class-prohibited > dndgen-details', 'Prohibited Fields', false);
      expectHasAttribute('li.character-class-specialist', 'hidden', false);
      expectHasAttribute('li.character-class-prohibited', 'hidden', true);

      const compiled = fixture.nativeElement as HTMLElement;
      const listItems = compiled.querySelectorAll('li.character-class-specialist li');
      expect(listItems).toBeTruthy();
      expect(listItems?.length).toEqual(2);
      expect(listItems?.item(0).textContent).toEqual('special field 1');
      expect(listItems?.item(1).textContent).toEqual('special field 2');
    });
  
    it(`should render the character class with prohibited fields`, () => {
      const component = fixture.componentInstance;
      component.character = new Character('my character summary');
      component.character.class.summary = 'my class summary';
      component.character.class.prohibitedFields = ['forbidden field 1', 'forbidden field 2'];

      fixture.detectChanges();
  
      expectDetails('dndgen-details.character-header', 'my character summary', true);
      expectDetails('dndgen-details.character-header li.character-class > dndgen-details', 'my class summary', true);
      expectDetails('li.character-class > dndgen-details li.character-class-specialist > dndgen-details', 'Specialist Fields', false);
      expectDetails('li.character-class > dndgen-details li.character-class-prohibited > dndgen-details', 'Prohibited Fields', true);
      expectHasAttribute('li.character-class-specialist', 'hidden', true);
      expectHasAttribute('li.character-class-prohibited', 'hidden', false);

      const compiled = fixture.nativeElement as HTMLElement;
      const listItems = compiled.querySelectorAll('li.character-class-prohibited li');
      expect(listItems).toBeTruthy();
      expect(listItems?.length).toEqual(2);
      expect(listItems?.item(0).textContent).toEqual('forbidden field 1');
      expect(listItems?.item(1).textContent).toEqual('forbidden field 2');
    });
  
    it(`should render the character class with specialist and prohibited fields`, () => {
      const component = fixture.componentInstance;
      component.character = new Character('my character summary');
      component.character.class.summary = 'my class summary';
      component.character.class.specialistFields = ['special field 1', 'special field 2'];
      component.character.class.prohibitedFields = ['forbidden field 1', 'forbidden field 2'];

      fixture.detectChanges();
  
      expectDetails('dndgen-details.character-header', 'my character summary', true);
      expectDetails('dndgen-details.character-header li.character-class > dndgen-details', 'my class summary', true);
      expectDetails('li.character-class > dndgen-details li.character-class-specialist > dndgen-details', 'Specialist Fields', true);
      expectDetails('li.character-class > dndgen-details li.character-class-prohibited > dndgen-details', 'Prohibited Fields', true);
      expectHasAttribute('li.character-class-specialist', 'hidden', false);
      expectHasAttribute('li.character-class-prohibited', 'hidden', false);

      const compiled = fixture.nativeElement as HTMLElement;
      let listItems = compiled.querySelectorAll('li.character-class-specialist li');
      expect(listItems).toBeTruthy();
      expect(listItems?.length).toEqual(2);
      expect(listItems?.item(0).textContent).toEqual('special field 1');
      expect(listItems?.item(1).textContent).toEqual('special field 2');

      listItems = compiled.querySelectorAll('li.character-class-prohibited li');
      expect(listItems).toBeTruthy();
      expect(listItems?.length).toEqual(2);
      expect(listItems?.item(0).textContent).toEqual('forbidden field 1');
      expect(listItems?.item(1).textContent).toEqual('forbidden field 2');
    });
  
    it(`should render the character race`, () => {
      const component = fixture.componentInstance;
      component.character = new Character('my character summary');
      component.character.race.summary = 'my race summary';

      fixture.detectChanges();
  
      expectDetails('dndgen-details.character-header', 'my character summary', true);
      expectDetails('dndgen-details.character-header li.character-race > dndgen-details', 'my race summary', true);
    });
  
    it(`should render the character race with metarace species`, () => {
      const component = fixture.componentInstance;
      component.character = new Character('my character summary');
      component.character.race.summary = 'my race summary';
      component.character.race.metaraceSpecies = 'my metarace species';

      fixture.detectChanges();
  
      expectDetails('dndgen-details.character-header', 'my character summary', true);
      expectDetails('dndgen-details.character-header li.character-race > dndgen-details', 'my race summary', true);
      expectHasAttribute('li.character-race-metarace-species', 'hidden', false);
      
      const compiled = fixture.nativeElement as HTMLElement;
      const element = compiled.querySelector('li.character-race li.character-race-metarace-species');
      expect(element).toBeTruthy();
      expect(element?.textContent).toEqual('Metarace Species: my metarace species');
    });
  
    it(`should render the character race without metarace species`, () => {
      const component = fixture.componentInstance;
      component.character = new Character('my character summary');
      component.character.race.summary = 'my race summary';
      component.character.race.metaraceSpecies = '';

      fixture.detectChanges();
  
      expectDetails('dndgen-details.character-header', 'my character summary', true);
      expectDetails('dndgen-details.character-header li.character-race > dndgen-details', 'my race summary', true);
      expectHasAttribute('li.character-race-metarace-species', 'hidden', true);
    });
  
    it(`should render the character race land speed`, () => {
      expect('not yet written').toBe('');
      const component = fixture.componentInstance;
      component.character = new Character('my character summary');
      component.character.race.summary = 'my race summary';
      component.character.race.metaraceSpecies = '';

      fixture.detectChanges();
  
      expectDetails('dndgen-details.character-header', 'my character summary', true);
      expectDetails('dndgen-details.character-header li.character-race > dndgen-details', 'my race summary', true);
      expectHasAttribute('li.character-race-metarace-species', 'hidden', true);
    });

    function expectHasAttribute(selector: string, attribute: string, hasAttribute: boolean) {
      const compiled = fixture.nativeElement as HTMLElement;

      const element = compiled!.querySelector(selector);
      expect(element).toBeTruthy();
      expect(element?.hasAttribute(attribute)).toBe(hasAttribute);
    }

    function expectDetails(selector: string, heading: string, hasDetails: boolean) {
      const element = fixture.debugElement.query(By.css(selector));
      expect(element).toBeTruthy();
      expect(element.componentInstance).toBeTruthy();
      expect(element.componentInstance).toBeInstanceOf(DetailsComponent);

      const details = element.componentInstance as DetailsComponent;
      expect(details.heading).toEqual(heading);
      expect(details.hasDetails).toBe(hasDetails);
    }
  
    it(`should render a full character`, () => {
      const component = fixture.componentInstance;
      component.character = createCharacter();

      fixture.detectChanges();
  
      expect('need to add assertions').toBe('');
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
  
    function getItem(): Item {
      let item = new Item('my item', 'MyItemType');
      item.description = 'my item description';
      item.attributes = ['My Attribute', 'My Other Attribute'];

      return item;
    }
  
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
  });
});
