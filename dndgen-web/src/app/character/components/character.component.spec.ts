import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CharacterComponent } from './character.component';
import { AppModule } from '../../app.module';
import { Item } from '../../treasure/models/item.model';
import { Armor } from '../../treasure/models/armor.model';
import { Weapon } from '../../treasure/models/weapon.model';
import { DetailsComponent } from '../../shared/components/details.component';
import { By } from '@angular/platform-browser';
import { Character } from '../models/character.model';
import { Ability } from '../models/ability.model';
import { Skill } from '../models/skill.model';
import { Feat } from '../models/feat.model';
import { Treasure } from '../../treasure/models/treasure.model';
import { Good } from '../../treasure/models/good.model';
import { Measurement } from '../models/measurement.model';
import { BonusPipe } from '../../shared/pipes/bonus.pipe';
import { FeatComponent } from './feat.component';
import { DebugElement } from '@angular/core';
import { SpellQuantity } from '../models/spellQuantity.model';
import { Spell } from '../models/spell.model';
import { SpellGroupService } from '../services/spellGroup.service';
import { SpellGroup } from '../models/spellGroup.model';
import { SpellGroupComponent } from './spellGroup.component';
import { ItemComponent } from '../../treasure/components/item.component';
import { TreasureComponent } from '../../treasure/components/treasure.component';

describe('CharacterComponent', () => {
  describe('unit', () => {
    let component: CharacterComponent;
    let spellGroupServiceSpy: jasmine.SpyObj<SpellGroupService>;

    beforeEach(() => {
      spellGroupServiceSpy = jasmine.createSpyObj('SpellGroupService', ['sortIntoGroups']);
      component = new CharacterComponent(spellGroupServiceSpy);
      
      spellGroupServiceSpy.sortIntoGroups.and.callFake((spells) => {
        if (!spells || spells.length == 0)
            return [];

        if (spells.length == 1) {
            return [
                new SpellGroup('first spell group', spells),
            ];
        }

        return [
            new SpellGroup('first spell group', spells.slice(0, 1)),
            new SpellGroup('other spell group', spells.slice(1)),
        ];
    });
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

    it('should sort spells into groups', () => {
      let spells = [
        new Spell('my source', 9, 'my spell'),
        new Spell('my other source', 2, 'my other spell'),
        new Spell('my other source', 3, 'another spell'),
      ];

      let groups = component.getSpellGroups(spells);
      expect(groups).toBeTruthy();
      expect(groups.length).toBe(2);
      expect(groups[0]).toBeTruthy();
      expect(groups[0].name).toEqual('first spell group');
      expect(groups[0].spells).toEqual([spells[0]]);
      expect(groups[1]).toBeTruthy();
      expect(groups[1].name).toEqual('other spell group');
      expect(groups[1].spells).toEqual([spells[1], spells[2]]);
    });

    it('should sort skills by display names', () => {
      const character = new Character('my character summary');
      character.skills = [
        new Skill('skill ee', 'focus 1', 1, false, 2, new Ability('ability 1', 37, 38), 3, 4),
        new Skill('skill CCC', '', 5, true, 6, new Ability('ability 2', 39, 40), 7, 8),
        new Skill('skill ff', 'focus 2', 9, false, 10, new Ability('ability 3', 41, 42), 11, 12),
        new Skill('skill dd', '', 13, true, 14, new Ability('ability 4', 43, 44), 15, 16),
        new Skill('skill aaa', '', 17, false, 18, new Ability('ability 5', 45, 46), 19, 20),
        new Skill('skill ee', 'focus 3', 21, true, 22, new Ability('ability 6', 47, 48), 23, 24),
        new Skill('skill ff', 'focus 4', 25, false, 26, new Ability('ability 1', 37, 38), 27, 28),
        new Skill('skill BBB', '', 29, true, 30, new Ability('ability 2', 39, 40), 31, 32),
        new Skill('skill ddd', '', 33, false, 34, new Ability('ability 3', 41, 42), 35, 36),
      ];

      const expectedSkills = [
        new Skill('skill aaa', '', 17, false, 18, new Ability('ability 5', 45, 46), 19, 20),
        new Skill('skill BBB', '', 29, true, 30, new Ability('ability 2', 39, 40), 31, 32),
        new Skill('skill CCC', '', 5, true, 6, new Ability('ability 2', 39, 40), 7, 8),
        new Skill('skill dd', '', 13, true, 14, new Ability('ability 4', 43, 44), 15, 16),
        new Skill('skill ddd', '', 33, false, 34, new Ability('ability 3', 41, 42), 35, 36),
        new Skill('skill ee', 'focus 1', 1, false, 2, new Ability('ability 1', 37, 38), 3, 4),
        new Skill('skill ee', 'focus 3', 21, true, 22, new Ability('ability 6', 47, 48), 23, 24),
        new Skill('skill ff', 'focus 2', 9, false, 10, new Ability('ability 3', 41, 42), 11, 12),
        new Skill('skill ff', 'focus 4', 25, false, 26, new Ability('ability 1', 37, 38), 27, 28),
      ];

      component.character = character;

      expect(component.sortedSkills).toBeTruthy();
      expect(component.sortedSkills.length).toBe(expectedSkills.length);

      for(var i = 0; i < expectedSkills.length; i++) {
        expect(component.sortedSkills[i]).toEqual(expectedSkills[i]);
      }
    });

    it('should return off-hand heading', () => {
      const character = new Character('my character summary');
      character.equipment.offHand = new Item('my item', 'my item type');

      component.character = character;

      expect(component.offHandHeading).toEqual('Off Hand');
    });

    it('should return off-hand heading - two-handed', () => {
      const character = new Character('my character summary');
      character.equipment.primaryHand = new Weapon('my weapon', 'Weapon');
      character.equipment.primaryHand.attributes.push('Two-Handed');

      character.equipment.offHand = character.equipment.primaryHand;

      component.character = character;

      expect(component.offHandHeading).toEqual('Off Hand: (Two-Handed)');
    });

    it('should return off-hand heading - none', () => {
      const character = new Character('my character summary');
      character.equipment.offHand = null;

      component.character = character;

      expect(component.offHandHeading).toEqual('Off Hand: None');
    });

    it('should return off-hand details', () => {
      const character = new Character('my character summary');
      character.equipment.offHand = new Item('my item', 'my item type');

      component.character = character;

      expect(component.offHandDetails).toBeTrue();
    });

    it('should return off-hand details - two-handed', () => {
      const character = new Character('my character summary');
      character.equipment.primaryHand = new Weapon('my weapon', 'Weapon');
      character.equipment.primaryHand.attributes.push('Two-Handed');

      character.equipment.offHand = character.equipment.primaryHand;

      component.character = character;

      expect(component.offHandDetails).toBeFalse();
    });

    it('should return off-hand details - none', () => {
      const character = new Character('my character summary');
      character.equipment.offHand = null;

      component.character = character;

      expect(component.offHandDetails).toBeFalse();
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

        newCharacter.languages.push('English');
        newCharacter.languages.push('German');

        newCharacter.skills.push(createSkill('skill 1', "", 4, newCharacter.abilities.Constitution, 0, -6, true, false, 135));
        newCharacter.skills.push(createSkill('skill 2', "focus", 1.5, newCharacter.abilities.Dexterity, 3, 0, false, true, 246));

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
        newCharacter.combat.baseAttack.baseBonus = 2202;
        newCharacter.combat.baseAttack.allMeleeBonuses = [21, 16, 11, 6, 1];
        newCharacter.combat.baseAttack.allRangedBonuses = [22, 17, 12, 7, 2];
        newCharacter.combat.hitPoints = 3456;
        newCharacter.combat.initiativeBonus = 4567;
        newCharacter.combat.savingThrows.fortitude = 56;
        newCharacter.combat.savingThrows.reflex = 78;
        newCharacter.combat.savingThrows.will = 67;
        newCharacter.combat.savingThrows.hasFortitudeSave = true;

        newCharacter.challengeRating = 89;
        newCharacter.interestingTrait = 'my interesting trait';

        newCharacter.magic.spellsPerDay = [
          new SpellQuantity('source 1', 0, 5),
          new SpellQuantity('source 1', 1, 4, true),
          new SpellQuantity('source 2', 1, 3, true),
          new SpellQuantity('source 2', 2, 2, false),
        ];
        newCharacter.magic.knownSpells = [
          new Spell('source 1', 0, 'spell 1.0.1'),
          new Spell('source 1', 0, 'spell 1.0.2'),
          new Spell('source 1', 1, 'spell 1.1.1'),
          new Spell('source 1', 1, 'spell 1.1.2'),
          new Spell('source 2', 1, 'spell 2.1.1'),
          new Spell('source 2', 1, 'spell 2.1.2'),
          new Spell('source 2', 2, 'spell 2.2.1'),
          new Spell('source 2', 2, 'spell 2.2.2'),
        ];
        newCharacter.magic.preparedSpells = [
          new Spell('source 1', 0, 'spell 1.0.1'),
          new Spell('source 1', 0, 'spell 1.0.2'),
          new Spell('source 1', 1, 'spell 1.1.1'),
          new Spell('source 1', 1, 'spell 1.1.2'),
          new Spell('source 1', 1, 'spell 1.1.2'),
          new Spell('source 2', 1, 'spell 2.1.1'),
          new Spell('source 2', 1, 'spell 2.1.1'),
          new Spell('source 2', 1, 'spell 2.1.2'),
          new Spell('source 2', 2, 'spell 2.2.1'),
          new Spell('source 2', 2, 'spell 2.2.2'),
        ];
        newCharacter.magic.arcaneSpellFailure = 36;
        newCharacter.magic.animal = 'American shorthair cat';

        newCharacter.equipment.primaryHand = createWeapon('my weapon');
        newCharacter.equipment.offHand = createArmor('my shield');

        return newCharacter;
    }

    function createAbility(name: string, value: number, bonus: number) {
        return new Ability(name, value, bonus);
    }

    function createSkill(name: string, focus: string, effectiveRanks: number, baseAbility: Ability, bonus: number, acPenalty: number, classSkill: boolean, circumstantialBonus: boolean, totalBonus: number): Skill {
        return new Skill(name, focus, totalBonus, circumstantialBonus, effectiveRanks, baseAbility, bonus, acPenalty, classSkill);
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

      expectElement('li.character-combat li.character-combat-hitpoints', 'Hit Points: 9,266');
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

      expectElement('li.character-combat li.character-combat-ac span', 'Armor Class: 42');
      expectListItems('li.character-combat li.character-combat-ac li', ['Flat-Footed: 600', 'Touch: 96']);
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

      expectElement('li.character-combat li.character-combat-ac span', 'Armor Class: 42 *');
      expectListItems('li.character-combat li.character-combat-ac li', ['Flat-Footed: 600', 'Touch: 96']);
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

      expectElement('li.character-combat li.character-combat-ba span', 'Base Attack: +9');
      expectListItems('li.character-combat li.character-combat-ba li', ['Melee: +2', 'Ranged: +6']);
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

      expectElement('li.character-combat li.character-combat-ba span', 'Base Attack: +9');
      expectListItems('li.character-combat li.character-combat-ba li', ['Melee: -2', 'Ranged: -6']);
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

      expectElement('li.character-combat li.character-combat-ba span', 'Base Attack: +9');
      expectListItems('li.character-combat li.character-combat-ba li', ['Melee: +2/+6', 'Ranged: +6/+9/+0']);
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

      expectElement('li.character-combat li.character-combat-ba span', 'Base Attack: +9');
      expectListItems('li.character-combat li.character-combat-ba li', ['Melee: +2/-6', 'Ranged: +6/+9/-2']);
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

      expectElement('li.character-combat li.character-combat-ba span', 'Base Attack: +9');
      expectListItems('li.character-combat li.character-combat-ba li', ['Melee: +2 *', 'Ranged: +6 *']);
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

      expectElement('li.character-combat li.character-combat-ba span', 'Base Attack: +9');
      expectListItems('li.character-combat li.character-combat-ba li', ['Melee: +2/+6 *', 'Ranged: +6/+9/+0 *']);
    });
  
    it(`should render the character initiative bonus`, () => {
      const component = fixture.componentInstance;
      component.character = new Character('my character summary');
      component.character.combat.initiativeBonus = 9;

      fixture.detectChanges();
  
      expectDetails('dndgen-details.character-header', 'my character summary', true);
      expectDetails('dndgen-details.character-header li.character-combat > dndgen-details', 'Combat', true);
      expectElement('li.character-combat li.character-combat-initiative', 'Initiative Bonus: +9');
    });
  
    it(`should render the character initiative bonus - negative`, () => {
      const component = fixture.componentInstance;
      component.character = new Character('my character summary');
      component.character.combat.initiativeBonus = -2;

      fixture.detectChanges();
  
      expectDetails('dndgen-details.character-header', 'my character summary', true);
      expectDetails('dndgen-details.character-header li.character-combat > dndgen-details', 'Combat', true);
      expectElement('li.character-combat li.character-combat-initiative', 'Initiative Bonus: -2');
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

      expectElement('li.character-combat li.character-combat-saves span', 'Saving Throws:');
      expectListItems('li.character-combat li.character-combat-saves li', ['Fortitude: +92', 'Reflex: +66', 'Will: +902', 'Circumstantial Bonus']);
      
      expectHasAttribute('li.character-combat li.character-combat-saves li.character-combat-saves-fort', 'hidden', false);
      expectHasAttribute('li.character-combat li.character-combat-saves li.character-combat-saves-ref', 'hidden', false);
      expectHasAttribute('li.character-combat li.character-combat-saves li.character-combat-saves-will', 'hidden', false);
      expectHasAttribute('li.character-combat li.character-combat-saves li.character-combat-saves-condition', 'hidden', true);
    });
  
    it(`should render the character saving throws - negative`, () => {
      const component = fixture.componentInstance;
      component.character = new Character('my character summary');
      component.character.combat.savingThrows.hasFortitudeSave = true;
      component.character.combat.savingThrows.fortitude = -92;
      component.character.combat.savingThrows.reflex = -66;
      component.character.combat.savingThrows.will = -902;

      fixture.detectChanges();
  
      expectDetails('dndgen-details.character-header', 'my character summary', true);
      expectDetails('dndgen-details.character-header li.character-combat > dndgen-details', 'Combat', true);

      expectElement('li.character-combat li.character-combat-saves span', 'Saving Throws:');
      expectListItems('li.character-combat li.character-combat-saves li', ['Fortitude: -92', 'Reflex: -66', 'Will: -902', 'Circumstantial Bonus']);

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

      expectElement('li.character-combat li.character-combat-saves span', 'Saving Throws:');
      expectListItems('li.character-combat li.character-combat-saves li', ['Fortitude: +92', 'Reflex: +66', 'Will: +902', 'Circumstantial Bonus']);

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

      expectElement('li.character-combat li.character-combat-saves span', 'Saving Throws:');
      expectListItems('li.character-combat li.character-combat-saves li', ['Fortitude: +0', 'Reflex: +66', 'Will: +902', 'Circumstantial Bonus']);

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

      expectElement('li.character-combat li.character-combat-saves span', 'Saving Throws:');
      expectListItems('li.character-combat li.character-combat-saves li', ['Fortitude: +0', 'Reflex: +66', 'Will: +902', 'Circumstantial Bonus']);

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

      expectElement('li.character-combat li.character-combat-adj-dex', 'Adjusted Dexterity Bonus: +9');
    });
  
    it(`should render the character adjusted dexterity bonus - negative`, () => {
      const component = fixture.componentInstance;
      component.character = new Character('my character summary');
      component.character.combat.adjustedDexterityBonus = -2;

      fixture.detectChanges();
  
      expectDetails('dndgen-details.character-header', 'my character summary', true);
      expectDetails('dndgen-details.character-header li.character-combat > dndgen-details', 'Combat', true);

      expectElement('li.character-combat li.character-combat-adj-dex', 'Adjusted Dexterity Bonus: -2');
    });
  
    it(`should render the character challenge rating`, () => {
      const component = fixture.componentInstance;
      component.character = new Character('my character summary');
      component.character.challengeRating = 92;

      fixture.detectChanges();
  
      expectDetails('dndgen-details.character-header', 'my character summary', true);
      expectElement('dndgen-details.character-header li.character-cr', 'Challenge Rating: 92');
    });
  
    it(`should render the character alignment`, () => {
      const component = fixture.componentInstance;
      component.character = new Character('my character summary');
      component.character.alignment.full = 'my full alignment';

      fixture.detectChanges();
  
      expectDetails('dndgen-details.character-header', 'my character summary', true);
      expectElement('dndgen-details.character-header li.character-alignment', 'Alignment: my full alignment');
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
      expectListItems('li.character-class-specialist li', ['special field 1', 'special field 2']);
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
      expectListItems('li.character-class-prohibited li', ['forbidden field 1', 'forbidden field 2']);
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
      expectListItems('li.character-class-specialist li', ['special field 1', 'special field 2']);
      expectListItems('li.character-class-prohibited li', ['forbidden field 1', 'forbidden field 2']);
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
      expectElement('li.character-race li.character-race-metarace-species', 'Metarace Species: my metarace species');
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
      const component = fixture.componentInstance;
      component.character = new Character('my character summary');
      component.character.race.summary = 'my race summary';
      component.character.race.landSpeed = new Measurement(9266, 'm/s');

      fixture.detectChanges();
  
      expectDetails('dndgen-details.character-header', 'my character summary', true);
      expectDetails('dndgen-details.character-header li.character-race > dndgen-details', 'my race summary', true);
      expectHasAttribute('li.character-race-speed-land', 'hidden', false);
      expectElement('li.character-race li.character-race-speed-land', 'Land Speed: 9,266 m/s');
    });
  
    it(`should render the character race with wings`, () => {
      const component = fixture.componentInstance;
      component.character = new Character('my character summary');
      component.character.race.summary = 'my race summary';
      component.character.race.hasWings = true;

      fixture.detectChanges();
  
      expectDetails('dndgen-details.character-header', 'my character summary', true);
      expectDetails('dndgen-details.character-header li.character-race > dndgen-details', 'my race summary', true);
      expectHasAttribute('li.character-race-wings', 'hidden', false);
      expectElement('li.character-race li.character-race-wings', 'Has Wings');
    });
  
    it(`should render the character race without wings`, () => {
      const component = fixture.componentInstance;
      component.character = new Character('my character summary');
      component.character.race.summary = 'my race summary';
      component.character.race.hasWings = false;

      fixture.detectChanges();
  
      expectDetails('dndgen-details.character-header', 'my character summary', true);
      expectDetails('dndgen-details.character-header li.character-race > dndgen-details', 'my race summary', true);
      expectHasAttribute('li.character-race-wings', 'hidden', true);
    });
  
    it(`should render the character race with aerial speed`, () => {
      const component = fixture.componentInstance;
      component.character = new Character('my character summary');
      component.character.race.summary = 'my race summary';
      component.character.race.aerialSpeed = new Measurement(9266, 'm/s', 'graceful');

      fixture.detectChanges();
  
      expectDetails('dndgen-details.character-header', 'my character summary', true);
      expectDetails('dndgen-details.character-header li.character-race > dndgen-details', 'my race summary', true);
      expectHasAttribute('li.character-race-speed-air', 'hidden', false);
      expectElement('li.character-race li.character-race-speed-air', 'Aerial Speed: 9,266 m/s (graceful)');
    });
  
    it(`should render the character race without aerial speed`, () => {
      const component = fixture.componentInstance;
      component.character = new Character('my character summary');
      component.character.race.summary = 'my race summary';
      component.character.race.aerialSpeed = new Measurement(0, 'm/s');

      fixture.detectChanges();
  
      expectDetails('dndgen-details.character-header', 'my character summary', true);
      expectDetails('dndgen-details.character-header li.character-race > dndgen-details', 'my race summary', true);
      expectHasAttribute('li.character-race-speed-air', 'hidden', true);
    });
  
    it(`should render the character race with swim speed`, () => {
      const component = fixture.componentInstance;
      component.character = new Character('my character summary');
      component.character.race.summary = 'my race summary';
      component.character.race.swimSpeed = new Measurement(9266, 'm/s');

      fixture.detectChanges();
  
      expectDetails('dndgen-details.character-header', 'my character summary', true);
      expectDetails('dndgen-details.character-header li.character-race > dndgen-details', 'my race summary', true);
      expectHasAttribute('li.character-race-speed-swim', 'hidden', false);
      expectElement('li.character-race li.character-race-speed-swim', 'Swim Speed: 9,266 m/s');
    });
  
    it(`should render the character race without swim speed`, () => {
      const component = fixture.componentInstance;
      component.character = new Character('my character summary');
      component.character.race.summary = 'my race summary';
      component.character.race.swimSpeed = new Measurement(0, 'm/s');

      fixture.detectChanges();
  
      expectDetails('dndgen-details.character-header', 'my character summary', true);
      expectDetails('dndgen-details.character-header li.character-race > dndgen-details', 'my race summary', true);
      expectHasAttribute('li.character-race-speed-swim', 'hidden', true);
    });
  
    it(`should render the character race size`, () => {
      const component = fixture.componentInstance;
      component.character = new Character('my character summary');
      component.character.race.summary = 'my race summary';
      component.character.race.size = 'my size';

      fixture.detectChanges();
  
      expectDetails('dndgen-details.character-header', 'my character summary', true);
      expectDetails('dndgen-details.character-header li.character-race > dndgen-details', 'my race summary', true);
      expectHasAttribute('li.character-race-size', 'hidden', false);
      expectElement('li.character-race li.character-race-size', 'Size: my size');
    });
  
    it(`should render the character race age`, () => {
      const component = fixture.componentInstance;
      component.character = new Character('my character summary');
      component.character.race.summary = 'my race summary';
      component.character.race.age = new Measurement(9266, 'years', 'decrepit');

      fixture.detectChanges();
  
      expectDetails('dndgen-details.character-header', 'my character summary', true);
      expectDetails('dndgen-details.character-header li.character-race > dndgen-details', 'my race summary', true);
      expectHasAttribute('li.character-race-age', 'hidden', false);
      expectElement('li.character-race li.character-race-age', 'Age: 9,266 years (decrepit)');
    });
  
    it(`should render the character race max age`, () => {
      const component = fixture.componentInstance;
      component.character = new Character('my character summary');
      component.character.race.summary = 'my race summary';
      component.character.race.maximumAge = new Measurement(9266, 'years', 'will die of natural causes');

      fixture.detectChanges();
  
      expectDetails('dndgen-details.character-header', 'my character summary', true);
      expectDetails('dndgen-details.character-header li.character-race > dndgen-details', 'my race summary', true);
      expectHasAttribute('li.character-race-age-max', 'hidden', false);
      expectElement('li.character-race li.character-race-age-max', 'Maximum Age: 9,266 years (will die of natural causes)');
    });
  
    it(`should render the character race max age - immortal`, () => {
      const component = fixture.componentInstance;
      component.character = new Character('my character summary');
      component.character.race.summary = 'my race summary';
      component.character.race.maximumAge = new Measurement(0, 'years', 'Will not die of old age');

      fixture.detectChanges();
  
      expectDetails('dndgen-details.character-header', 'my character summary', true);
      expectDetails('dndgen-details.character-header li.character-race > dndgen-details', 'my race summary', true);
      expectHasAttribute('li.character-race-age-max', 'hidden', false);
      expectElement('li.character-race li.character-race-age-max', 'Maximum Age: Will not die of old age');
    });
  
    it(`should render the character race height`, () => {
      const component = fixture.componentInstance;
      component.character = new Character('my character summary');
      component.character.race.summary = 'my race summary';
      component.character.race.height = new Measurement(9266, 'inches', 'lanky');

      fixture.detectChanges();
  
      expectDetails('dndgen-details.character-header', 'my character summary', true);
      expectDetails('dndgen-details.character-header li.character-race > dndgen-details', 'my race summary', true);
      expectHasAttribute('li.character-race-height', 'hidden', false);
      expectElement('li.character-race li.character-race-height', 'Height: 772\' 2" (lanky)');
    });
  
    it(`should render the character race weight`, () => {
      const component = fixture.componentInstance;
      component.character = new Character('my character summary');
      component.character.race.summary = 'my race summary';
      component.character.race.weight = new Measurement(9266, 'kgs', 'like a linebacker');

      fixture.detectChanges();
  
      expectDetails('dndgen-details.character-header', 'my character summary', true);
      expectDetails('dndgen-details.character-header li.character-race > dndgen-details', 'my race summary', true);
      expectHasAttribute('li.character-race-weight', 'hidden', false);
      expectElement('li.character-race li.character-race-weight', 'Weight: 9,266 kgs (like a linebacker)');
    });
  
    it(`should render the character abilities`, () => {
      const component = fixture.componentInstance;
      component.character = new Character('my character summary');
      component.character.abilities.Strength = new Ability('Strength', 92, 66);
      component.character.abilities.Constitution = new Ability('Constitution', 902, -10);
      component.character.abilities.Dexterity = new Ability('Dexterity', 42, 600);
      component.character.abilities.Intelligence = new Ability('Intelligence', 13, -37);
      component.character.abilities.Wisdom = new Ability('Wisdom', 13, 36);
      component.character.abilities.Charisma = new Ability('Charisma', 96, 783);

      fixture.detectChanges();
  
      expectDetails('dndgen-details.character-header', 'my character summary', true);
      expectDetails('dndgen-details.character-header li.character-abilities > dndgen-details', 'Abilities', true);
      
      expectListItems('li.character-abilities dndgen-details li', [
        'Strength: 92 (+66)',
        'Constitution: 902 (-10)',
        'Dexterity: 42 (+600)',
        'Intelligence: 13 (-37)',
        'Wisdom: 13 (+36)',
        'Charisma: 96 (+783)',
      ]);
    });
  
    it(`should render the character abilities - without constitution`, () => {
      const component = fixture.componentInstance;
      component.character = new Character('my character summary');
      component.character.abilities.Strength = new Ability('Strength', 92, 66);
      component.character.abilities.Constitution = null;
      component.character.abilities.Dexterity = new Ability('Dexterity', 42, 600);
      component.character.abilities.Intelligence = new Ability('Intelligence', 13, -37);
      component.character.abilities.Wisdom = new Ability('Wisdom', 13, 36);
      component.character.abilities.Charisma = new Ability('Charisma', 96, 783);

      fixture.detectChanges();
  
      expectDetails('dndgen-details.character-header', 'my character summary', true);
      expectDetails('dndgen-details.character-header li.character-abilities > dndgen-details', 'Abilities', true);
      
      expectListItems('li.character-abilities dndgen-details li', [
        'Strength: 92 (+66)',
        'Dexterity: 42 (+600)',
        'Intelligence: 13 (-37)',
        'Wisdom: 13 (+36)',
        'Charisma: 96 (+783)',
      ]);
    });
  
    it(`should render the character languages`, () => {
      const component = fixture.componentInstance;
      component.character = new Character('my character summary');
      component.character.languages = ['English', 'German'];

      fixture.detectChanges();
  
      expectDetails('dndgen-details.character-header', 'my character summary', true);
      expectDetails('dndgen-details.character-header li.character-languages > dndgen-details', 'Languages', true);
      expectListItems('li.character-languages dndgen-details li', ['English', 'German']);
    });
  
    it(`should render the character skill`, () => {
      const component = fixture.componentInstance;
      component.character = new Character('my character summary');
      component.character.skills = [
        new Skill('my skill', '', 90, false, 2.1, new Ability('ability 1', 92, 66), 42, -6),
      ];

      fixture.detectChanges();
  
      expectDetails('dndgen-details.character-header', 'my character summary', true);
      expectDetails('dndgen-details.character-header li.character-skills > dndgen-details', 'Skills', true);
      expectTable('li.character-skills dndgen-details table', component.character.skills);
    });
  
    it(`should render the character skill with negative bonus`, () => {
      const component = fixture.componentInstance;
      component.character = new Character('my character summary');
      component.character.skills = [
        new Skill('my skill', '', -90, false, 2.1, new Ability('ability 1', 92, 66), 42, -6),
      ];

      fixture.detectChanges();
  
      expectDetails('dndgen-details.character-header', 'my character summary', true);
      expectDetails('dndgen-details.character-header li.character-skills > dndgen-details', 'Skills', true);
      expectTable('li.character-skills dndgen-details table', component.character.skills);
    });
  
    it(`should render the character skill with focus`, () => {
      const component = fixture.componentInstance;
      component.character = new Character('my character summary');
      component.character.skills = [
        new Skill('my skill', 'my focus', 90, false, 2.1, new Ability('ability 1', 92, 66), 42, -6),
      ];

      fixture.detectChanges();
  
      expectDetails('dndgen-details.character-header', 'my character summary', true);
      expectDetails('dndgen-details.character-header li.character-skills > dndgen-details', 'Skills', true);
      expectTable('li.character-skills dndgen-details table', component.character.skills);
    });
  
    it(`should render the character skill with conditional bonus`, () => {
      const component = fixture.componentInstance;
      component.character = new Character('my character summary');
      component.character.skills = [
        new Skill('my skill', '', 90, true, 2.1, new Ability('ability 1', 92, 66), 42, -6),
      ];

      fixture.detectChanges();
  
      expectDetails('dndgen-details.character-header', 'my character summary', true);
      expectDetails('dndgen-details.character-header li.character-skills > dndgen-details', 'Skills', true);
      expectTable('li.character-skills dndgen-details table', component.character.skills);
    });
  
    it(`should render the character skill as class skill`, () => {
      const component = fixture.componentInstance;
      component.character = new Character('my character summary');
      component.character.skills = [
        new Skill('my skill', '', 90, false, 2.1, new Ability('ability 1', 92, 66), 42, -6, true),
      ];

      fixture.detectChanges();
  
      expectDetails('dndgen-details.character-header', 'my character summary', true);
      expectDetails('dndgen-details.character-header li.character-skills > dndgen-details', 'Skills', true);
      expectTable('li.character-skills dndgen-details table', component.character.skills);
    });
  
    it(`should render the character skills`, () => {
      const component = fixture.componentInstance;
      component.character = new Character('my character summary');
      component.character.skills = [
        new Skill('skill 1', '', 90, false, 2.1, new Ability('ability 1', 92, 66), 42, -6),
        new Skill('skill 2', '', 13, false, 3.7, new Ability('ability 2', 13, 36), 96, -7, true),
        new Skill('skill 3', '', 83, true, 8.2, new Ability('ability 3', 4, -5), 9, 0),
        new Skill('skill 4', '', 22, true, 2, new Ability('ability 4', 2, -2), 7, -12, true),
        new Skill('skill 5', 'focus 1', 34, false, 2.3, new Ability('ability 5', 45, 34), 56, 0),
        new Skill('skill 5', 'focus 2', 456, false, 7, new Ability('ability 5', 45, 34), 78, 0, true),
        new Skill('skill 6', 'focus 3', 678, true, 9, new Ability('ability 6', 5, -6), 789, 0),
        new Skill('skill 6', 'focus 4', 0, true, 8.9, new Ability('ability 6', 5, -6), 91, -2, true),
        new Skill('skill 7', '', -3, false, 4, new Ability('ability 1', 92, 66), 567, -8),
      ];

      fixture.detectChanges();
  
      expectDetails('dndgen-details.character-header', 'my character summary', true);
      expectDetails('dndgen-details.character-header li.character-skills > dndgen-details', 'Skills', true);
      expectTable('li.character-skills dndgen-details table', component.character.skills);
    });
  
    it(`should render the character skills - sorted`, () => {
      const component = fixture.componentInstance;
      component.character = new Character('my character summary');
      component.character.skills = [
        new Skill('skill 5', 'focus 1', 34, false, 2.3, new Ability('ability 5', 45, 34), 56, 0),
        new Skill('skill 1', '', 90, false, 2.1, new Ability('ability 1', 92, 66), 42, -6),
        new Skill('skill 3', '', 83, true, 8.2, new Ability('ability 3', 4, -5), 9, 0),
        new Skill('skill 2', '', 13, false, 3.7, new Ability('ability 2', 13, 36), 96, -7, true),
        new Skill('skill 5', 'focus 2', 456, false, 7, new Ability('ability 5', 45, 34), 78, 0, true),
        new Skill('skill 6', 'focus 3', 678, true, 9, new Ability('ability 6', 5, -6), 789, 0),
        new Skill('skill 7', '', -3, false, 4, new Ability('ability 1', 92, 66), 567, -8),
        new Skill('skill 6', 'focus 4', 0, true, 8.9, new Ability('ability 6', 5, -6), 91, -2, true),
        new Skill('skill 4', '', 22, true, 2, new Ability('ability 4', 2, -2), 7, -12, true),
      ];

      const expectedSkills = [
        new Skill('skill 1', '', 90, false, 2.1, new Ability('ability 1', 92, 66), 42, -6),
        new Skill('skill 2', '', 13, false, 3.7, new Ability('ability 2', 13, 36), 96, -7, true),
        new Skill('skill 3', '', 83, true, 8.2, new Ability('ability 3', 4, -5), 9, 0),
        new Skill('skill 4', '', 22, true, 2, new Ability('ability 4', 2, -2), 7, -12, true),
        new Skill('skill 5', 'focus 1', 34, false, 2.3, new Ability('ability 5', 45, 34), 56, 0),
        new Skill('skill 5', 'focus 2', 456, false, 7, new Ability('ability 5', 45, 34), 78, 0, true),
        new Skill('skill 6', 'focus 3', 678, true, 9, new Ability('ability 6', 5, -6), 789, 0),
        new Skill('skill 6', 'focus 4', 0, true, 8.9, new Ability('ability 6', 5, -6), 91, -2, true),
        new Skill('skill 7', '', -3, false, 4, new Ability('ability 1', 92, 66), 567, -8),
      ];

      fixture.detectChanges();
  
      expectDetails('dndgen-details.character-header', 'my character summary', true);
      expectDetails('dndgen-details.character-header li.character-skills > dndgen-details', 'Skills', true);
      expectTable('li.character-skills dndgen-details table', expectedSkills);
    });
  
    it(`should render the character feats - no feats`, () => {
      const component = fixture.componentInstance;
      component.character = new Character('my character summary');

      fixture.detectChanges();
  
      expectDetails('dndgen-details.character-header', 'my character summary', true);
      expectDetails('dndgen-details.character-header li.character-feats > dndgen-details', 'Feats', true);
      expectHasAttribute('li.character-feats dndgen-details li.character-feats-racial', 'hidden', true);
      expectHasAttribute('li.character-feats dndgen-details li.character-feats-class', 'hidden', true);
      expectHasAttribute('li.character-feats dndgen-details li.character-feats-additional', 'hidden', true);
    });
  
    it(`should render the character feats - racial feats`, () => {
      const component = fixture.componentInstance;
      component.character = new Character('my character summary');
      component.character.feats.racial = [
        new Feat('racial feat 1'),
        new Feat('racial feat 2'),
      ];

      fixture.detectChanges();
  
      expectDetails('dndgen-details.character-header', 'my character summary', true);
      expectDetails('dndgen-details.character-header li.character-feats > dndgen-details', 'Feats', true);
      expectHasAttribute('li.character-feats dndgen-details li.character-feats-racial', 'hidden', false);
      expectHasAttribute('li.character-feats dndgen-details li.character-feats-class', 'hidden', true);
      expectHasAttribute('li.character-feats dndgen-details li.character-feats-additional', 'hidden', true);

      expectDetails('li.character-feats li.character-feats-racial > dndgen-details', 'Racial', true);
      expectFeats('li.character-feats-racial li.character-feat-racial > dndgen-feat', component.character.feats.racial);
    });
  
    it(`should render the character feats - class feats`, () => {
      const component = fixture.componentInstance;
      component.character = new Character('my character summary');
      component.character.feats.class = [
        new Feat('class feat 1'),
        new Feat('class feat 2'),
      ];

      fixture.detectChanges();
  
      expectDetails('dndgen-details.character-header', 'my character summary', true);
      expectDetails('dndgen-details.character-header li.character-feats > dndgen-details', 'Feats', true);
      expectHasAttribute('li.character-feats dndgen-details li.character-feats-racial', 'hidden', true);
      expectHasAttribute('li.character-feats dndgen-details li.character-feats-class', 'hidden', false);
      expectHasAttribute('li.character-feats dndgen-details li.character-feats-additional', 'hidden', true);

      expectDetails('li.character-feats li.character-feats-class > dndgen-details', 'Class', true);
      expectFeats('li.character-feats-class li.character-feat-class > dndgen-feat', component.character.feats.class);
    });
  
    it(`should render the character feats - additional feats`, () => {
      const component = fixture.componentInstance;
      component.character = new Character('my character summary');
      component.character.feats.additional = [
        new Feat('additional feat 1'),
        new Feat('additional feat 2'),
      ];

      fixture.detectChanges();
  
      expectDetails('dndgen-details.character-header', 'my character summary', true);
      expectDetails('dndgen-details.character-header li.character-feats > dndgen-details', 'Feats', true);
      expectHasAttribute('li.character-feats dndgen-details li.character-feats-racial', 'hidden', true);
      expectHasAttribute('li.character-feats dndgen-details li.character-feats-class', 'hidden', true);
      expectHasAttribute('li.character-feats dndgen-details li.character-feats-additional', 'hidden', false);

      expectDetails('li.character-feats li.character-feats-additional > dndgen-details', 'Additional', true);
      expectFeats('li.character-feats-additional li.character-feat-additional > dndgen-feat', component.character.feats.additional);
    });
  
    it(`should render the character feats - all feats`, () => {
      const component = fixture.componentInstance;
      component.character = new Character('my character summary');
      component.character.feats.racial = [
        new Feat('racial feat 1'),
        new Feat('racial feat 2'),
      ];
      component.character.feats.class = [
        new Feat('class feat 1'),
        new Feat('class feat 2'),
      ];
      component.character.feats.additional = [
        new Feat('additional feat 1'),
        new Feat('additional feat 2'),
      ];

      fixture.detectChanges();
  
      expectDetails('dndgen-details.character-header', 'my character summary', true);
      expectDetails('dndgen-details.character-header li.character-feats > dndgen-details', 'Feats', true);
      expectHasAttribute('li.character-feats dndgen-details li.character-feats-racial', 'hidden', false);
      expectHasAttribute('li.character-feats dndgen-details li.character-feats-class', 'hidden', false);
      expectHasAttribute('li.character-feats dndgen-details li.character-feats-additional', 'hidden', false);

      expectDetails('li.character-feats li.character-feats-racial > dndgen-details', 'Racial', true);
      expectFeats('li.character-feats-racial > dndgen-details li.character-feat-racial > dndgen-feat', component.character.feats.racial);
      expectDetails('li.character-feats li.character-feats-class > dndgen-details', 'Class', true);
      expectFeats('li.character-feats-class > dndgen-details li.character-feat-class > dndgen-feat', component.character.feats.class);
      expectDetails('li.character-feats li.character-feats-additional > dndgen-details', 'Additional', true);
      expectFeats('li.character-feats-additional > dndgen-details li.character-feat-additional > dndgen-feat', component.character.feats.additional);
    });
  
    it(`should render the character interesting trait`, () => {
      const component = fixture.componentInstance;
      component.character = new Character('my character summary');
      component.character.interestingTrait = 'the most interesting character in the world';

      fixture.detectChanges();
  
      expectDetails('dndgen-details.character-header', 'my character summary', true);
      expectElement('dndgen-details.character-header li.character-trait', 'Interesting Trait: the most interesting character in the world');
    });
  
    it(`should render the character interesting trait - none`, () => {
      const component = fixture.componentInstance;
      component.character = new Character('my character summary');
      component.character.interestingTrait = '';

      fixture.detectChanges();
  
      expectDetails('dndgen-details.character-header', 'my character summary', true);
      expectElement('dndgen-details.character-header li.character-trait', 'Interesting Trait: None');
    });
  
    it(`should render the character spells per day`, () => {
      const component = fixture.componentInstance;
      component.character = new Character('my character summary');
      component.character.magic.spellsPerDay = [
        new SpellQuantity('source 1', 9, 2),
        new SpellQuantity('source 2', 6, 1, true),
      ];

      fixture.detectChanges();
  
      expectDetails('dndgen-details.character-header', 'my character summary', true);
      expectHasAttribute('dndgen-details.character-header li.character-spells-per-day', 'hidden', false);
      expectDetails('li.character-spells-per-day > dndgen-details', 'Spells Per Day', true);
      expectListItems('li.character-spells-per-day dndgen-details li', ['source 1 Level 9: 2', 'source 2 Level 6: 1 + 1']);
    });
  
    it(`should render the character spells per day - none`, () => {
      const component = fixture.componentInstance;
      component.character = new Character('my character summary');
      component.character.magic.spellsPerDay = [];

      fixture.detectChanges();
  
      expectDetails('dndgen-details.character-header', 'my character summary', true);
      expectHasAttribute('dndgen-details.character-header li.character-spells-per-day', 'hidden', true);
      expectDetails('li.character-spells-per-day > dndgen-details', 'Spells Per Day', false);
    });
  
    it(`BUG - should render the character spells known - one`, () => {
      const component = fixture.componentInstance;
      component.character = new Character('my character summary');
      component.character.magic.knownSpells = [
        new Spell('my source', 9, 'spell 1'),
        new Spell('my source', 9, 'spell 2'),
      ];

      fixture.detectChanges();
  
      expectDetails('dndgen-details.character-header', 'my character summary', true);
      expectHasAttribute('dndgen-details.character-header li.character-spells-known', 'hidden', false);
      expectDetails('li.character-spells-known > dndgen-details', 'Known Spells', true);
      expectSpellGroups('li.character-spells-known dndgen-details li > dndgen-spell-group', [
        new SpellGroup('my source Level 9', [
          component.character.magic.knownSpells[0],
          component.character.magic.knownSpells[1],
        ])
      ]);
    });
  
    it(`should render the character spells known`, () => {
      const component = fixture.componentInstance;
      component.character = new Character('my character summary');
      component.character.magic.knownSpells = [
        new Spell('my source', 9, 'spell 1'),
        new Spell('my source', 9, 'spell 2'),
        new Spell('my source', 2, 'spell 3'),
        new Spell('my source', 2, 'spell 4'),
      ];

      fixture.detectChanges();
  
      expectDetails('dndgen-details.character-header', 'my character summary', true);
      expectHasAttribute('dndgen-details.character-header li.character-spells-known', 'hidden', false);
      expectDetails('li.character-spells-known > dndgen-details', 'Known Spells', true);
      expectSpellGroups('li.character-spells-known dndgen-details li > dndgen-spell-group', [
        new SpellGroup('my source Level 2', [
          component.character.magic.knownSpells[2],
          component.character.magic.knownSpells[3],
        ]),
        new SpellGroup('my source Level 9', [
          component.character.magic.knownSpells[0],
          component.character.magic.knownSpells[1],
        ]),
      ]);
    });
  
    it(`should render the character spells known - none`, () => {
      const component = fixture.componentInstance;
      component.character = new Character('my character summary');
      component.character.magic.knownSpells = [];

      fixture.detectChanges();
  
      expectDetails('dndgen-details.character-header', 'my character summary', true);
      expectHasAttribute('dndgen-details.character-header li.character-spells-known', 'hidden', true);
      expectDetails('li.character-spells-known > dndgen-details', 'Known Spells', false);
    });
  
    it(`BUG - should render the character spells prepared - one`, () => {
      const component = fixture.componentInstance;
      component.character = new Character('my character summary');
      component.character.magic.preparedSpells = [
        new Spell('my source', 9, 'spell 1'),
        new Spell('my source', 9, 'spell 2'),
        new Spell('my source', 9, 'spell 2'),
      ];

      fixture.detectChanges();
  
      expectDetails('dndgen-details.character-header', 'my character summary', true);
      expectHasAttribute('dndgen-details.character-header li.character-spells-prepared', 'hidden', false);
      expectDetails('li.character-spells-prepared > dndgen-details', 'Prepared Spells', true);
      expectSpellGroups('li.character-spells-prepared dndgen-details li > dndgen-spell-group', [
        new SpellGroup('my source Level 9', [
          component.character.magic.preparedSpells[0],
          component.character.magic.preparedSpells[1],
          component.character.magic.preparedSpells[2],
        ])
      ]);
    });
  
    it(`should render the character spells prepared`, () => {
      const component = fixture.componentInstance;
      component.character = new Character('my character summary');
      component.character.magic.preparedSpells = [
        new Spell('my source', 9, 'spell 1'),
        new Spell('my source', 9, 'spell 2'),
        new Spell('my source', 9, 'spell 2'),
        new Spell('my source', 2, 'spell 3'),
        new Spell('my source', 2, 'spell 3'),
        new Spell('my source', 2, 'spell 4'),
      ];

      fixture.detectChanges();
  
      expectDetails('dndgen-details.character-header', 'my character summary', true);
      expectHasAttribute('dndgen-details.character-header li.character-spells-prepared', 'hidden', false);
      expectDetails('li.character-spells-prepared > dndgen-details', 'Prepared Spells', true);
      expectSpellGroups('li.character-spells-prepared dndgen-details li > dndgen-spell-group', [
        new SpellGroup('my source Level 2', [
          component.character.magic.preparedSpells[3],
          component.character.magic.preparedSpells[4],
          component.character.magic.preparedSpells[5],
        ]),
        new SpellGroup('my source Level 9', [
          component.character.magic.preparedSpells[0],
          component.character.magic.preparedSpells[1],
          component.character.magic.preparedSpells[2],
        ]),
      ]);
    });
  
    it(`should render the character spells prepared - none`, () => {
      const component = fixture.componentInstance;
      component.character = new Character('my character summary');
      component.character.magic.preparedSpells = [];

      fixture.detectChanges();
  
      expectDetails('dndgen-details.character-header', 'my character summary', true);
      expectHasAttribute('dndgen-details.character-header li.character-spells-prepared', 'hidden', true);
      expectDetails('li.character-spells-prepared > dndgen-details', 'Prepared Spells', false);
    });
  
    it(`should render the character spell failure`, () => {
      const component = fixture.componentInstance;
      component.character = new Character('my character summary');
      component.character.magic.arcaneSpellFailure = 92;

      fixture.detectChanges();
  
      expectDetails('dndgen-details.character-header', 'my character summary', true);
      expectHasAttribute('dndgen-details.character-header li.character-spells-failure', 'hidden', false);
      expectElement('dndgen-details.character-header li.character-spells-failure', 'Arcane Spell Failure: 92%');
    });
  
    it(`should render the character spell failure - none`, () => {
      const component = fixture.componentInstance;
      component.character = new Character('my character summary');
      component.character.magic.arcaneSpellFailure = 0;

      fixture.detectChanges();
  
      expectDetails('dndgen-details.character-header', 'my character summary', true);
      expectHasAttribute('dndgen-details.character-header li.character-spells-failure', 'hidden', true);
    });
  
    it(`should render the character animal`, () => {
      const component = fixture.componentInstance;
      component.character = new Character('my character summary');
      component.character.magic.animal = 'Bernese mountain dog';

      fixture.detectChanges();
  
      expectDetails('dndgen-details.character-header', 'my character summary', true);
      expectHasAttribute('dndgen-details.character-header li.character-animal', 'hidden', false);
      expectElement('dndgen-details.character-header li.character-animal', 'Animal: Bernese mountain dog');
    });
  
    it(`should render the character animal - none`, () => {
      const component = fixture.componentInstance;
      component.character = new Character('my character summary');
      component.character.magic.animal = '';

      fixture.detectChanges();
  
      expectDetails('dndgen-details.character-header', 'my character summary', true);
      expectHasAttribute('dndgen-details.character-header li.character-animal', 'hidden', true);
    });
  
    it(`should render the character primary weapon`, () => {
      const component = fixture.componentInstance;
      component.character = new Character('my character summary');

      const weapon = createWeapon('my primary weapon');
      component.character.equipment.primaryHand = weapon;

      fixture.detectChanges();
  
      expectDetails('dndgen-details.character-header', 'my character summary', true);
      expectDetails('dndgen-details.character-header li.character-equipment > dndgen-details', 'Equipment', true);
      expectDetails('li.character-equipment li.character-equipment-primary-hand > dndgen-details', 'Primary Hand', true);
      expectItem('li.character-equipment-primary-hand dndgen-details dndgen-item', weapon);
    });
  
    it(`should render the character primary weapon - none`, () => {
      const component = fixture.componentInstance;
      component.character = new Character('my character summary');
      component.character.equipment.primaryHand = null;

      fixture.detectChanges();
  
      expectDetails('dndgen-details.character-header', 'my character summary', true);
      expectDetails('dndgen-details.character-header li.character-equipment > dndgen-details', 'Equipment', true);
      expectDetails('li.character-equipment li.character-equipment-primary-hand > dndgen-details', 'Primary Hand: None', false);
    });
  
    it(`should render the character off-hand weapon`, () => {
      const component = fixture.componentInstance;
      component.character = new Character('my character summary');

      const weapon = createWeapon('my off-hand weapon');
      component.character.equipment.offHand = weapon;

      fixture.detectChanges();
  
      expectDetails('dndgen-details.character-header', 'my character summary', true);
      expectDetails('dndgen-details.character-header li.character-equipment > dndgen-details', 'Equipment', true);
      expectHasAttribute('li.character-equipment li.character-equipment-off-hand > dndgen-details', 'hidden', false);
      expectDetails('li.character-equipment li.character-equipment-off-hand > dndgen-details', 'Off Hand', true);
      expectItem('li.character-equipment-off-hand dndgen-details dndgen-item', weapon);
    });
  
    it(`should render the character off-hand shield`, () => {
      const component = fixture.componentInstance;
      component.character = new Character('my character summary');

      const shield = createArmor('my shield');
      component.character.equipment.offHand = shield;

      fixture.detectChanges();
  
      expectDetails('dndgen-details.character-header', 'my character summary', true);
      expectDetails('dndgen-details.character-header li.character-equipment > dndgen-details', 'Equipment', true);
      expectHasAttribute('li.character-equipment li.character-equipment-off-hand > dndgen-details', 'hidden', false);
      expectDetails('li.character-equipment li.character-equipment-off-hand > dndgen-details', 'Off Hand', true);
      expectItem('li.character-equipment-off-hand dndgen-details dndgen-item', shield);
    });
  
    it(`should render the character off-hand item - two-handed primary`, () => {
      const component = fixture.componentInstance;
      component.character = new Character('my character summary');

      const weapon = createWeapon('my primary weapon');
      weapon.attributes.push('Two-Handed');
      component.character.equipment.primaryHand = weapon;
      component.character.equipment.offHand = component.character.equipment.primaryHand;

      fixture.detectChanges();
  
      expectDetails('dndgen-details.character-header', 'my character summary', true);
      expectDetails('dndgen-details.character-header li.character-equipment > dndgen-details', 'Equipment', true);
      expectHasAttribute('li.character-equipment li.character-equipment-off-hand > dndgen-details', 'hidden', true);
      expectDetails('li.character-equipment li.character-equipment-off-hand > dndgen-details', 'Off Hand: (Two-Handed)', false);
    });
  
    it(`should render the character off-hand item - none`, () => {
      const component = fixture.componentInstance;
      component.character = new Character('my character summary');
      component.character.equipment.primaryHand = null;

      fixture.detectChanges();
  
      expectDetails('dndgen-details.character-header', 'my character summary', true);
      expectDetails('dndgen-details.character-header li.character-equipment > dndgen-details', 'Equipment', true);
      expectHasAttribute('li.character-equipment li.character-equipment-off-hand > dndgen-details', 'hidden', true);
      expectDetails('li.character-equipment li.character-equipment-off-hand > dndgen-details', 'Off Hand: None', false);
    });
  
    it(`should render the character armor`, () => {
      const component = fixture.componentInstance;
      component.character = new Character('my character summary');

      const armor = createArmor('my armor');
      component.character.equipment.armor = armor;

      fixture.detectChanges();
  
      expectDetails('dndgen-details.character-header', 'my character summary', true);
      expectDetails('dndgen-details.character-header li.character-equipment > dndgen-details', 'Equipment', true);
      expectDetails('li.character-equipment li.character-equipment-armor > dndgen-details', 'Armor', true);
      expectItem('li.character-equipment-armor dndgen-details dndgen-item', armor);
    });
  
    it(`should render the character armor - none`, () => {
      const component = fixture.componentInstance;
      component.character = new Character('my character summary');
      component.character.equipment.armor = null;

      fixture.detectChanges();
  
      expectDetails('dndgen-details.character-header', 'my character summary', true);
      expectDetails('dndgen-details.character-header li.character-equipment > dndgen-details', 'Equipment', true);
      expectDetails('li.character-equipment li.character-equipment-armor > dndgen-details', 'Armor: None', false);
    });
  
    it(`should render the character treasure`, () => {
      const component = fixture.componentInstance;
      component.character = new Character('my character summary');

      const treasure = createTreasure();
      component.character.equipment.treasure = treasure;

      fixture.detectChanges();
  
      expectDetails('dndgen-details.character-header', 'my character summary', true);
      expectDetails('dndgen-details.character-header li.character-equipment > dndgen-details', 'Equipment', true);
      expectDetails('li.character-equipment li.character-equipment-treasure > dndgen-details', 'Treasure', true);
      expectTreasure('li.character-equipment-treasure dndgen-details dndgen-item', treasure);
    });
  
    it(`should render the character treasure - none`, () => {
      const component = fixture.componentInstance;
      component.character = new Character('my character summary');
      
      const treasure = createTreasure();
      treasure.isAny = false;
      component.character.equipment.treasure = treasure;

      fixture.detectChanges();
  
      expectDetails('dndgen-details.character-header', 'my character summary', true);
      expectDetails('dndgen-details.character-header li.character-equipment > dndgen-details', 'Equipment', true);
      expectDetails('li.character-equipment li.character-equipment-treasure > dndgen-details', 'Treasure: None', false);
    });

    it('needs more tests', () => {
      expect('finish tests for HTML').toBe('');
    });

    function expectTable(selector: string, skills: Skill[]) {
      const compiled = fixture.nativeElement as HTMLElement;
      const table = compiled.querySelector(selector);
      expect(table).toBeTruthy();
      expect(table?.getAttribute('class')).toEqual('table table-striped');

      const classIndex = 0;
      const nameIndex = 1;
      const totalIndex = 2;
      const ranksIndex = 3;
      const abilityIndex = 4;
      const otherIndex = 5;
      const acIndex = 6;

      const columnHeaders = compiled.querySelectorAll(`${selector} th`);
      expect(columnHeaders).toBeTruthy();
      expect(columnHeaders?.length).toEqual(7);
      expect(columnHeaders?.item(classIndex).textContent).toEqual('Class Skill');
      expect(columnHeaders?.item(classIndex).getAttribute('scope')).toEqual('col');
      expect(columnHeaders?.item(nameIndex).textContent).toEqual('Skill');
      expect(columnHeaders?.item(nameIndex).getAttribute('scope')).toEqual('col');
      expect(columnHeaders?.item(totalIndex).textContent).toEqual('Total Bonus');
      expect(columnHeaders?.item(totalIndex).getAttribute('scope')).toEqual('col');
      expect(columnHeaders?.item(ranksIndex).textContent).toEqual('Ranks');
      expect(columnHeaders?.item(ranksIndex).getAttribute('scope')).toEqual('col');
      expect(columnHeaders?.item(abilityIndex).textContent).toEqual('Ability Bonus');
      expect(columnHeaders?.item(abilityIndex).getAttribute('scope')).toEqual('col');
      expect(columnHeaders?.item(otherIndex).textContent).toEqual('Other Bonus');
      expect(columnHeaders?.item(otherIndex).getAttribute('scope')).toEqual('col');
      expect(columnHeaders?.item(acIndex).textContent).toEqual('Armor Check Penalty');
      expect(columnHeaders?.item(acIndex).getAttribute('scope')).toEqual('col');

      const rows = compiled.querySelectorAll(`${selector} tr`);
      expect(rows).toBeTruthy();
      expect(rows?.length).toEqual(skills.length);

      const bonusPipe = new BonusPipe();

      for(var i = 0; i < rows.length; i++) {
        let row = rows.item(i);

        const values = row.querySelectorAll('td');
        expect(values).toBeTruthy();
        expect(values?.length).toEqual(7);

        const classIcon = values?.item(classIndex).querySelector('i');
        expect(classIcon).toBeTruthy();
        expect(classIcon?.hasAttribute('hidden')).toEqual(!skills[i].classSkill);
        expect(classIcon?.getAttribute('class')).toEqual('bi bi-check-lg');

        expect(values?.item(nameIndex).textContent).toEqual(skills[i].displayName);

        let total = bonusPipe.transform(skills[i].totalBonus, skills[i].circumstantialBonus);
        expect(values?.item(totalIndex).textContent).toEqual(total);
        expect(values?.item(totalIndex).getAttribute('style')).toEqual('font-weight: bold;');

        expect(values?.item(ranksIndex).textContent).toEqual(`${skills[i].effectiveRanks}`);
        expect(values?.item(abilityIndex).textContent).toEqual(`${skills[i].baseAbility.bonus}`);
        expect(values?.item(otherIndex).textContent).toEqual(`${skills[i].bonus}`);
        expect(values?.item(acIndex).textContent).toEqual(`${skills[i].armorCheckPenalty}`);
      }
    }

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

    function expectFeats(selector: string, feats: Feat[]) {
      const listItems = fixture.debugElement.queryAll(By.css(selector));
      expect(listItems).toBeTruthy();
      expect(listItems?.length).toEqual(feats.length);

      for(var i = 0; i < listItems.length; i++) {
        expectFeat(listItems?.at(i)!, feats[i]);
      }
    }

    function expectFeat(element: DebugElement, feat: Feat) {
      expect(element).toBeTruthy();
      expect(element.componentInstance).toBeTruthy();
      expect(element.componentInstance).toBeInstanceOf(FeatComponent);

      const featComponent = element.componentInstance as FeatComponent;
      expect(featComponent.feat).toBe(feat);
    }

    function expectSpellGroups(selector: string, groups: SpellGroup[]) {
      const listItems = fixture.debugElement.queryAll(By.css(selector));
      expect(listItems).toBeTruthy();
      expect(listItems?.length).toEqual(groups.length);

      for(var i = 0; i < listItems.length; i++) {
        expectSpellGroup(listItems?.at(i)!, groups[i]);
      }
    }

    function expectSpellGroup(element: DebugElement, group: SpellGroup) {
      expect(element).toBeTruthy();
      expect(element.componentInstance).toBeTruthy();
      expect(element.componentInstance).toBeInstanceOf(SpellGroupComponent);

      const spellGroupComponent = element.componentInstance as SpellGroupComponent;
      expect(spellGroupComponent.group.name).toEqual(group.name);
      expect(spellGroupComponent.group.spells).toEqual(group.spells);
    }

    function expectElement(selector: string, text: string) {
      const compiled = fixture.nativeElement as HTMLElement;
      const element = compiled.querySelector(selector);
      expect(element).toBeTruthy();
      expect(element?.textContent).toEqual(text);
    }

    function expectListItems(selector: string, text: string[]) {
      const compiled = fixture.nativeElement as HTMLElement;
      const listItems = compiled.querySelectorAll(selector);
      expect(listItems).toBeTruthy();
      expect(listItems?.length).toEqual(text.length);

      for(var i = 0; i < listItems.length; i++) {
        expect(listItems?.item(i).textContent).toEqual(text[i]);
      }
    }

    function expectItem(selector: string, item: Item | Armor | Weapon) {
      const element = fixture.debugElement.query(By.css(selector));
      expect(element).toBeTruthy();
      expect(element.componentInstance).toBeTruthy();
      expect(element.componentInstance).toBeInstanceOf(ItemComponent);

      const featComponent = element.componentInstance as ItemComponent;
      expect(featComponent.item).toBe(item);
    }

    function expectTreasure(selector: string, treasure: Treasure) {
      const element = fixture.debugElement.query(By.css(selector));
      expect(element).toBeTruthy();
      expect(element.componentInstance).toBeTruthy();
      expect(element.componentInstance).toBeInstanceOf(TreasureComponent);

      const featComponent = element.componentInstance as TreasureComponent;
      expect(featComponent.treasure).toBe(treasure);
    }
  
    it(`should render a full character`, () => {
      const component = fixture.componentInstance;
      component.character = createCharacter();

      fixture.detectChanges();
  
      expectDetails('dndgen-details.character-header', 'my character summary', true);
      expectDetails('dndgen-details.character-header li.character-combat > dndgen-details', 'Combat', true);

      expectElement('li.character-combat li.character-combat-hitpoints', 'Hit Points: 3,456');
      expectElement('li.character-combat li.character-combat-ac span', 'Armor Class: 7');
      expectListItems('li.character-combat li.character-combat-ac li', ['Flat-Footed: 12', 'Touch: 34']);
      expectElement('li.character-combat li.character-combat-ba span', 'Base Attack: +2202');
      expectListItems('li.character-combat li.character-combat-ba li', ['Melee: +21/+16/+11/+6/+1', 'Ranged: +22/+17/+12/+7/+2']);
      expectElement('li.character-combat li.character-combat-initiative', 'Initiative Bonus: +4567');
      expectElement('li.character-combat li.character-combat-saves span', 'Saving Throws:');
      expectListItems('li.character-combat li.character-combat-saves li', ['Fortitude: +56', 'Reflex: +78', 'Will: +67', 'Circumstantial Bonus']);

      expectHasAttribute('li.character-combat li.character-combat-saves li.character-combat-saves-fort', 'hidden', false);
      expectHasAttribute('li.character-combat li.character-combat-saves li.character-combat-saves-ref', 'hidden', false);
      expectHasAttribute('li.character-combat li.character-combat-saves li.character-combat-saves-will', 'hidden', false);
      expectHasAttribute('li.character-combat li.character-combat-saves li.character-combat-saves-condition', 'hidden', true);
      
      expectElement('li.character-combat li.character-combat-adj-dex', 'Adjusted Dexterity Bonus: +3');
      expectElement('dndgen-details.character-header li.character-cr', 'Challenge Rating: 89');
      expectElement('dndgen-details.character-header li.character-alignment', 'Alignment: my alignment');
      expectDetails('dndgen-details.character-header li.character-class > dndgen-details', 'my class summary', false);
      expectDetails('dndgen-details.character-header li.character-race > dndgen-details', 'race summary', true);
      expectHasAttribute('li.character-race-speed-land', 'hidden', false);
      
      expectElement('li.character-race li.character-race-speed-land', 'Land Speed: 90,210 feet per round (fast)');
      expectElement('li.character-race li.character-race-size', 'Size: size');
      expectElement('li.character-race li.character-race-age', 'Age: 42 Years (my age description)');
      expectElement('li.character-race li.character-race-age-max', 'Maximum Age: 600 Years (natural causes)');
      expectElement('li.character-race li.character-race-height', 'Height: 111\' 5" (tall)');
      expectElement('li.character-race li.character-race-weight', 'Weight: 1,336 Pounds (heavy)');

      expectDetails('dndgen-details.character-header li.character-abilities > dndgen-details', 'Abilities', true);
      
      expectListItems('li.character-abilities dndgen-details li', [
        'Strength: 2022 (-2)',
        'Constitution: 83 (+8)',
        'Dexterity: 245 (-9)',
        'Intelligence: 22 (+2)',
        'Wisdom: 7 (+0)',
        'Charisma: 96 (-7)',
      ]);
      
      expectDetails('dndgen-details.character-header li.character-languages > dndgen-details', 'Languages', true);
      expectListItems('li.character-languages dndgen-details li', ['English', 'German']);
      
      expectDetails('dndgen-details.character-header li.character-skills > dndgen-details', 'Skills', true);
      expectTable('li.character-skills dndgen-details table', component.character.skills);
      
      expectDetails('dndgen-details.character-header li.character-feats > dndgen-details', 'Feats', true);
      expectHasAttribute('li.character-feats dndgen-details li.character-feats-racial', 'hidden', false);
      expectHasAttribute('li.character-feats dndgen-details li.character-feats-class', 'hidden', false);
      expectHasAttribute('li.character-feats dndgen-details li.character-feats-additional', 'hidden', false);

      expectDetails('li.character-feats li.character-feats-racial > dndgen-details', 'Racial', true);
      expectFeats('li.character-feats-racial > dndgen-details li.character-feat-racial > dndgen-feat', component.character.feats.racial);
      expectDetails('li.character-feats li.character-feats-class > dndgen-details', 'Class', true);
      expectFeats('li.character-feats-class > dndgen-details li.character-feat-class > dndgen-feat', component.character.feats.class);
      expectDetails('li.character-feats li.character-feats-additional > dndgen-details', 'Additional', true);
      expectFeats('li.character-feats-additional > dndgen-details li.character-feat-additional > dndgen-feat', component.character.feats.additional);
      
      expectElement('dndgen-details.character-header li.character-trait', 'Interesting Trait: my interesting trait');
      
      expectHasAttribute('dndgen-details.character-header li.character-spells-per-day', 'hidden', false);
      expectDetails('li.character-spells-per-day > dndgen-details', 'Spells Per Day', true);
      expectListItems('li.character-spells-per-day dndgen-details li', [
        'source 1 Level 0: 5', 
        'source 1 Level 1: 4 + 1',
        'source 2 Level 1: 3 + 1',
        'source 2 Level 2: 2',
      ]);
      
      expectHasAttribute('dndgen-details.character-header li.character-spells-known', 'hidden', false);
      expectDetails('li.character-spells-known > dndgen-details', 'Known Spells', true);
      expectSpellGroups('li.character-spells-known dndgen-details li > dndgen-spell-group', [
        new SpellGroup('source 1 Level 0', [
          component.character.magic.knownSpells[0],
          component.character.magic.knownSpells[1],
        ]),
        new SpellGroup('source 1 Level 1', [
          component.character.magic.knownSpells[2],
          component.character.magic.knownSpells[3],
        ]),
        new SpellGroup('source 2 Level 1', [
          component.character.magic.knownSpells[4],
          component.character.magic.knownSpells[5],
        ]),
        new SpellGroup('source 2 Level 2', [
          component.character.magic.knownSpells[6],
          component.character.magic.knownSpells[7],
        ])
      ]);
      
      expectHasAttribute('dndgen-details.character-header li.character-spells-prepared', 'hidden', false);
      expectDetails('li.character-spells-prepared > dndgen-details', 'Prepared Spells', true);
      expectSpellGroups('li.character-spells-prepared dndgen-details li > dndgen-spell-group', [
        new SpellGroup('source 1 Level 0', [
          component.character.magic.preparedSpells[0],
          component.character.magic.preparedSpells[1],
        ]),
        new SpellGroup('source 1 Level 1', [
          component.character.magic.preparedSpells[2],
          component.character.magic.preparedSpells[3],
          component.character.magic.preparedSpells[4],
        ]),
        new SpellGroup('source 2 Level 1', [
          component.character.magic.preparedSpells[5],
          component.character.magic.preparedSpells[6],
          component.character.magic.preparedSpells[7],
        ]),
        new SpellGroup('source 2 Level 2', [
          component.character.magic.preparedSpells[8],
          component.character.magic.preparedSpells[9],
        ])
      ]);
      
      expectHasAttribute('dndgen-details.character-header li.character-spells-failure', 'hidden', false);
      expectElement('dndgen-details.character-header li.character-spells-failure', 'Arcane Spell Failure: 36%');
      
      expectHasAttribute('dndgen-details.character-header li.character-animal', 'hidden', false);
      expectElement('dndgen-details.character-header li.character-animal', 'Animal: American shorthair cat');
      
      expectDetails('dndgen-details.character-header li.character-equipment > dndgen-details', 'Equipment', true);
      expectDetails('li.character-equipment li.character-equipment-primary-hand > dndgen-details', 'Primary Hand', true);
      expectItem('li.character-equipment-primary-hand dndgen-details dndgen-item', component.character.equipment.primaryHand!);
      
      expectHasAttribute('li.character-equipment li.character-equipment-off-hand > dndgen-details', 'hidden', false);
      expectDetails('li.character-equipment li.character-equipment-off-hand > dndgen-details', 'Off Hand', true);
      expectItem('li.character-equipment-off-hand dndgen-details dndgen-item', component.character.equipment.offHand!);
    });
  });
});
