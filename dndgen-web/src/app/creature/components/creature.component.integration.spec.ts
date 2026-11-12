import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { CreatureComponent } from './creature.component';
import { TestHelper } from '../../test-helper';
import { CreatureTestHelper } from '../creature.test-helper';
import { Creature } from '../models/creature.model';
import { AttackComponent } from './attack.component';
import { FeatComponent } from '../../character/components/feat.component';
import { SpellGroupComponent } from '../../character/components/spell-group.component';
import { ItemComponent } from '../../treasure/components/item.component';
import { Attack } from '../models/attack.model';
import { Feat } from '../../character/models/feat.model';
import { SpellGroup } from '../../character/models/spell-group.model';
import { Spell } from '../../character/models/spell.model';
import { Item } from '../../treasure/models/item.model';
import { CreatureMagic } from '../models/creature-magic.model';
import { Demographics } from '../models/demographics.model';
import { CreatureMeasurement } from '../models/creature-measurement.model';
import { Bonus } from '../models/bonus.model';

describe('Creature Component', () => {
  describe('integration', () => {
    let fixture: ComponentFixture<CreatureComponent>;
    let helper: TestHelper<CreatureComponent>;
    let creature: Creature;

    beforeEach(async () => {
      await TestHelper.configureTestBed([CreatureComponent]);

      fixture = TestBed.createComponent(CreatureComponent);
      helper = new TestHelper(fixture);

      creature = CreatureTestHelper.createFullCreature();
      fixture.componentInstance.creature = creature;
    });

    function expectRows(classes: string[]) {
      const rows = fixture.nativeElement.querySelectorAll('dndgen-details.creature-header > div.details-section > ul > li');
      expect(Array.from(rows).map(row => (row as HTMLElement).className)).toEqual(classes);
    }

    function expectAttacks(selector: string, attacks: Attack[], full: boolean) {
      const elements = fixture.debugElement.queryAll(By.css(`${selector} dndgen-attack`));
      expect(elements.length).toEqual(attacks.length);

      for (let i = 0; i < elements.length; i++) {
        expect(elements[i].componentInstance).toBeInstanceOf(AttackComponent);

        const attackComponent = elements[i].componentInstance as AttackComponent;
        expect(attackComponent.attack).toBe(attacks[i]);
        expect(attackComponent.full).toBe(full);
      }
    }

    function expectFeats(selector: string, feats: Feat[]) {
      const elements = fixture.debugElement.queryAll(By.css(`${selector} dndgen-feat`));
      expect(elements.length).toEqual(feats.length);

      for (let i = 0; i < elements.length; i++) {
        expect(elements[i].componentInstance).toBeInstanceOf(FeatComponent);
        expect((elements[i].componentInstance as FeatComponent).feat).toBe(feats[i]);
      }
    }

    function expectSpellGroups(selector: string, groups: SpellGroup[]) {
      const elements = fixture.debugElement.queryAll(By.css(`${selector} dndgen-spell-group`));
      expect(elements.length).toEqual(groups.length);

      for (let i = 0; i < elements.length; i++) {
        expect(elements[i].componentInstance).toBeInstanceOf(SpellGroupComponent);

        const spellGroupComponent = elements[i].componentInstance as SpellGroupComponent;
        expect(spellGroupComponent.group.name).toEqual(groups[i].name);
        expect(spellGroupComponent.group.spells).toEqual(groups[i].spells);
      }
    }

    function expectItems(selector: string, items: Item[]) {
      const elements = fixture.debugElement.queryAll(By.css(`${selector} dndgen-item`));
      expect(elements.length).toEqual(items.length);

      for (let i = 0; i < elements.length; i++) {
        expect(elements[i].componentInstance).toBeInstanceOf(ItemComponent);
        expect((elements[i].componentInstance as ItemComponent).item).toBe(items[i]);
      }
    }

    function expectInsideAttack(selector: string, attackName: string) {
      const element = fixture.debugElement.query(By.css(selector));
      expect(element).toBeTruthy();

      let parent: DebugElement | null = element.parent;
      while (parent && !(parent.componentInstance instanceof AttackComponent))
        parent = parent.parent;

      expect(parent).toBeTruthy();
      expect((parent!.componentInstance as AttackComponent).attack.name).toEqual(attackName);
    }

    function attackDetails(index: number): string[] {
      const attacks = fixture.nativeElement.querySelectorAll('li.creature-special-attacks dndgen-attack');
      const lines = attacks.item(index).querySelectorAll('dndgen-details.attack-heading > div.details-section > ul > li');

      return Array.from(lines).map(line => (line as HTMLElement).textContent!);
    }

    describe('a full creature', () => {
      beforeEach(async () => {
        await helper.waitForChangeDetection();
      });

      it('should render the summary as the heading', () => {
        helper.expectDetails('dndgen-details.creature-header', 'Ghost Hill Giant', true);
      });

      it('should render the stat block in order, then demographics, languages, and equipment', () => {
        expectRows([
          'creature-size-type',
          'creature-hit-dice',
          'creature-initiative',
          'creature-speed',
          'creature-armor-class',
          'creature-base-attack-grapple',
          'creature-attack',
          'creature-full-attack',
          'creature-space-reach',
          'creature-special-attacks',
          'creature-special-qualities',
          'creature-saves',
          'creature-abilities',
          'creature-skills',
          'creature-feats',
          'creature-challenge-rating',
          'creature-alignment',
          'creature-level-adjustment',
          'creature-demographics',
          'creature-languages',
          'creature-equipment',
        ]);
      });

      it('should render the size and type', () => {
        helper.expectTextContent('li.creature-size-type', 'Size/Type: Large Undead (Incorporeal, Augmented)');
      });

      it('should render the hit dice with the rolled hit points, and conditional bonuses as details', () => {
        helper.expectDetails('li.creature-hit-dice > dndgen-details', 'Hit Dice: 12d12 (102 hp)', true);
        helper.expectTextContents('li.creature-hit-dice li', ['+2 when raging']);
      });

      it('should render the initiative', () => {
        helper.expectTextContent('li.creature-initiative', 'Initiative: -1');
      });

      it('should render the speeds', () => {
        helper.expectTextContent('li.creature-speed', 'Speed: 40 ft. (8 squares), fly 30 ft. (Perfect Maneuverability)');
      });

      it('should render the armor class, with touch, flat-footed, and conditional bonuses as details', () => {
        helper.expectDetails('li.creature-armor-class > dndgen-details', 'Armor Class: 20 * (-1 size, -1 Dex, +3 armor, +9 natural, +1 deflection)', true);
        helper.expectTextContents('li.creature-armor-class li', [
          'Touch: 8',
          'Flat-Footed: 21',
          '+2 against evil',
        ]);
      });

      it('should render the base attack and grapple', () => {
        helper.expectTextContent('li.creature-base-attack-grapple', 'Base Attack/Grapple: +9/+20');
      });

      it('should render each attack option once', () => {
        helper.expectDetails('li.creature-attack > dndgen-details', 'Attack (3)', true);
        expectAttacks('li.creature-attack', [creature.attacks[0], creature.attacks[1], creature.attacks[3]], false);
      });

      it('should render each full attack option, with its attacks', () => {
        helper.expectDetails('li.creature-full-attack > dndgen-details', 'Full Attack (2)', true);
        helper.expectMultipleDetails('li.creature-full-attack-option > dndgen-details', [
          { heading: 'Greatclub +16/+11 melee (2d8+10 Bludgeoning) and 2 Club +11 melee (1d6+3 Bludgeoning)', hasDetails: true },
          { heading: 'Rock +8 ranged (2d6+7 Bludgeoning)', hasDetails: true },
        ]);
        expectAttacks('li.creature-full-attack-option:nth-child(1)', creature.fullMeleeAttack, true);
        expectAttacks('li.creature-full-attack-option:nth-child(2)', creature.fullRangedAttack, true);
      });

      it('should render the space and reach', () => {
        helper.expectTextContent('li.creature-space-reach', 'Space/Reach: 10 ft./10 ft.');
      });

      it('should render the special attacks', () => {
        helper.expectDetails('li.creature-special-attacks > dndgen-details', 'Special Attacks (3)', true);
        expectAttacks('li.creature-special-attacks', creature.specialAttacks, false);
      });

      it('should render the magic once, under the Spells special attack', () => {
        expect(attackDetails(0)).toEqual(['Type: supernatural ability', 'Frequency: 1/Round (6 seconds)']);
        expect(attackDetails(1)).toEqual(['Type: supernatural ability', 'Frequency: 1/Round (6 seconds)', 'Save: Will DC 17 (Charisma)']);
        helper.expectCount('li.creature-magic-caster', 1);
        expectInsideAttack('li.creature-magic-caster', 'Spells');
        helper.expectTextContent('li.creature-magic-caster', 'Caster: Sorcerer');
        helper.expectTextContent('li.creature-magic-caster-level', 'Caster Level: 3');
        helper.expectTextContent('li.creature-magic-domains', 'Domains: Air, Good');
        helper.expectTextContent('li.creature-magic-failure', 'Arcane Spell Failure: 15%');
      });

      it('should render the spells per day, including bonus spells', () => {
        expectInsideAttack('li.creature-magic-spells-per-day', 'Spells');
        helper.expectDetails('li.creature-magic-spells-per-day > dndgen-details', 'Spells Per Day', true);
        helper.expectTextContents('li.creature-magic-spells-per-day li', ['Sorcerer Level 0: 6', 'Sorcerer Level 1: 6 + 1']);
      });

      it('should render the known spells, grouped by source and level', () => {
        expectInsideAttack('li.creature-magic-spells-known', 'Spells');
        helper.expectDetails('li.creature-magic-spells-known > dndgen-details', 'Known Spells', true);
        expectSpellGroups('li.creature-magic-spells-known', [
          new SpellGroup('Sorcerer Level 0', [new Spell({ Sorcerer: 0 }, 'Light')]),
          new SpellGroup('Sorcerer Level 1', [new Spell({ Sorcerer: 1 }, 'Magic Missile')]),
        ]);
      });

      it('should render the prepared spells, grouped by source and level', () => {
        expectInsideAttack('li.creature-magic-spells-prepared', 'Spells');
        helper.expectDetails('li.creature-magic-spells-prepared > dndgen-details', 'Prepared Spells', true);
        expectSpellGroups('li.creature-magic-spells-prepared', [
          new SpellGroup('Sorcerer Level 1', [new Spell({ Sorcerer: 1 }, 'Shield')]),
        ]);
      });

      it('should render the special qualities', () => {
        helper.expectDetails('li.creature-special-qualities > dndgen-details', 'Special Qualities (2)', true);
        expectFeats('li.creature-special-qualities', creature.specialQualities);
      });

      it('should render the saves, with a missing save as — and conditional bonuses as details', () => {
        helper.expectDetails('li.creature-saves > dndgen-details', 'Saves: Fort —, Ref +3, Will +4 *', true);
        helper.expectTextContents('li.creature-saves li', ['Will: +4 against fear']);
      });

      it('should render the abilities, with a missing score as —', () => {
        helper.expectTextContent('li.creature-abilities', 'Abilities: Str 25, Dex 8, Con —, Int 6, Wis 10, Cha 13');
      });

      it('should render the skills sorted by name, with their conditional totals', () => {
        helper.expectDetails('li.creature-skills > dndgen-details', 'Skills (3)', true);
        helper.expectTextContents('li.creature-skills li.creature-skill', [
          'Climb +9 (+11 with rope)',
          'Knowledge (Religion) -2',
          'Spot +6',
        ]);
      });

      it('should render the feats', () => {
        helper.expectDetails('li.creature-feats > dndgen-details', 'Feats (2)', true);
        expectFeats('li.creature-feats', creature.feats);
      });

      it('should render the challenge rating', () => {
        helper.expectTextContent('li.creature-challenge-rating', 'Challenge Rating: 9');
      });

      it('should render the alignment', () => {
        helper.expectTextContent('li.creature-alignment', 'Alignment: Chaotic Evil');
      });

      it('should render the level adjustment', () => {
        helper.expectTextContent('li.creature-level-adjustment', 'Level Adjustment: +9');
      });

      it('should render the languages', () => {
        helper.expectDetails('li.creature-languages > dndgen-details', 'Languages (2)', true);
        helper.expectTextContents('li.creature-languages li', ['Giant', 'Common']);
      });

      it('should render the equipment', () => {
        helper.expectDetails('li.creature-equipment > dndgen-details', 'Equipment', true);
        helper.expectDetails('li.creature-equipment-weapons > dndgen-details', 'Weapons (2)', true);
        expectItems('li.creature-equipment-weapons', creature.equipment.weapons);
        helper.expectDetails('li.creature-equipment-armor > dndgen-details', 'Armor', true);
        helper.expectItem('li.creature-equipment-armor dndgen-item', creature.equipment.armor!);
        helper.expectDetails('li.creature-equipment-shield > dndgen-details', 'Shield', true);
        helper.expectItem('li.creature-equipment-shield dndgen-item', creature.equipment.shield!);
        helper.expectDetails('li.creature-equipment-items > dndgen-details', 'Items (2)', true);
        expectItems('li.creature-equipment-items', creature.equipment.items);
      });
    });

    describe('a full creature with one thing changed', () => {
      it('should render no level adjustment as —', async () => {
        creature.levelAdjustment = null;
        await helper.waitForChangeDetection();

        helper.expectTextContent('li.creature-level-adjustment', 'Level Adjustment: —');
      });

      it('should render no grapple as —', async () => {
        creature.grappleBonus = null;
        await helper.waitForChangeDetection();

        helper.expectTextContent('li.creature-base-attack-grapple', 'Base Attack/Grapple: +9/—');
      });

      it('should render the hit dice without conditional bonuses', async () => {
        creature.hitPoints.conditionalBonuses = [new Bonus(1)];
        await helper.waitForChangeDetection();

        helper.expectDetails('li.creature-hit-dice > dndgen-details', 'Hit Dice: 12d12 (102 hp)', false);
        helper.expectTextContents('li.creature-hit-dice li', []);
      });

      it('should render many conditional hit point bonuses', async () => {
        creature.hitPoints.conditionalBonuses = [new Bonus(2, 'when raging', true), new Bonus(1), new Bonus(3, 'at night', true)];
        await helper.waitForChangeDetection();

        helper.expectDetails('li.creature-hit-dice > dndgen-details', 'Hit Dice: 12d12 (102 hp)', true);
        helper.expectTextContents('li.creature-hit-dice li', ['+2 when raging', '+3 at night']);
      });

      it('should render the touch and flat-footed armor class without conditional bonuses', async () => {
        creature.armorClass.bonuses = [new Bonus(9)];
        await helper.waitForChangeDetection();

        helper.expectTextContents('li.creature-armor-class li', ['Touch: 8', 'Flat-Footed: 21']);
      });

      it('should render no attack options', async () => {
        creature.attacks = creature.specialAttacks;
        await helper.waitForChangeDetection();

        helper.expectDetails('li.creature-attack > dndgen-details', 'Attack (0)', false);
        expectAttacks('li.creature-attack', [], false);
      });

      it('should render 1 attack option', async () => {
        creature.attacks = [creature.attacks[0], ...creature.specialAttacks];
        await helper.waitForChangeDetection();

        helper.expectDetails('li.creature-attack > dndgen-details', 'Attack (1)', true);
        expectAttacks('li.creature-attack', [creature.attacks[0]], false);
      });

      it('should render no full attack options', async () => {
        creature.fullMeleeAttack = [];
        creature.fullRangedAttack = [];
        await helper.waitForChangeDetection();

        helper.expectDetails('li.creature-full-attack > dndgen-details', 'Full Attack (0)', false);
        expectAttacks('li.creature-full-attack', [], true);
      });

      it('should render only the full melee attack option', async () => {
        creature.fullRangedAttack = [];
        await helper.waitForChangeDetection();

        helper.expectDetails('li.creature-full-attack > dndgen-details', 'Full Attack (1)', true);
        helper.expectMultipleDetails('li.creature-full-attack-option > dndgen-details', [
          { heading: 'Greatclub +16/+11 melee (2d8+10 Bludgeoning) and 2 Club +11 melee (1d6+3 Bludgeoning)', hasDetails: true },
        ]);
        expectAttacks('li.creature-full-attack-option', creature.fullMeleeAttack, true);
      });

      it('should render only the full ranged attack option', async () => {
        creature.fullMeleeAttack = [];
        await helper.waitForChangeDetection();

        helper.expectDetails('li.creature-full-attack > dndgen-details', 'Full Attack (1)', true);
        helper.expectMultipleDetails('li.creature-full-attack-option > dndgen-details', [
          { heading: 'Rock +8 ranged (2d6+7 Bludgeoning)', hasDetails: true },
        ]);
        expectAttacks('li.creature-full-attack-option', creature.fullRangedAttack, true);
      });

      it('should render no special attacks', async () => {
        creature.specialAttacks = [];
        await helper.waitForChangeDetection();

        helper.expectDetails('li.creature-special-attacks > dndgen-details', 'Special Attacks (0)', false);
        expectAttacks('li.creature-special-attacks', [], false);
      });

      it('should render 1 special attack', async () => {
        creature.specialAttacks = [creature.specialAttacks[0]];
        await helper.waitForChangeDetection();

        helper.expectDetails('li.creature-special-attacks > dndgen-details', 'Special Attacks (1)', true);
        expectAttacks('li.creature-special-attacks', creature.specialAttacks, false);
      });

      it('should render a caster with no domains, spell failure, or spells', async () => {
        creature.magic = new CreatureMagic('Sorcerer', 7);
        await helper.waitForChangeDetection();

        expect(attackDetails(2)).toEqual([
          'Type: spell-like ability',
          'Frequency: 1/Round (6 seconds)',
          'Caster: Sorcerer',
          'Caster Level: 7',
        ]);
      });

      it('should render no magic without a Spells special attack', async () => {
        creature.specialAttacks = creature.specialAttacks.filter(attack => attack.name != 'Spells');
        await helper.waitForChangeDetection();

        helper.expectCount('li.creature-magic-caster', 0);
        helper.expectCount('li.creature-magic-caster-level', 0);
      });

      it('should render no special qualities', async () => {
        creature.specialQualities = [];
        await helper.waitForChangeDetection();

        helper.expectDetails('li.creature-special-qualities > dndgen-details', 'Special Qualities (0)', false);
        expectFeats('li.creature-special-qualities', []);
      });

      it('should render the saves without conditional bonuses', async () => {
        creature.saves['Will'].bonuses = [];
        await helper.waitForChangeDetection();

        helper.expectDetails('li.creature-saves > dndgen-details', 'Saves: Fort —, Ref +3, Will +4 *', false);
        helper.expectTextContents('li.creature-saves li', []);
      });

      it('should render the conditional bonuses of many saves, in save order', async () => {
        creature.saves['Reflex'].bonuses = [new Bonus(2, 'against traps', true)];
        await helper.waitForChangeDetection();

        helper.expectTextContents('li.creature-saves li', ['Reflex: +2 against traps', 'Will: +4 against fear']);
      });

      it('should render no skills', async () => {
        creature.skills = [];
        await helper.waitForChangeDetection();

        helper.expectDetails('li.creature-skills > dndgen-details', 'Skills (0)', false);
        helper.expectTextContents('li.creature-skills li.creature-skill', []);
      });

      it('should render 1 skill', async () => {
        creature.skills = [creature.skills[0]];
        await helper.waitForChangeDetection();

        helper.expectDetails('li.creature-skills > dndgen-details', 'Skills (1)', true);
        helper.expectTextContents('li.creature-skills li.creature-skill', ['Spot +6']);
      });

      it('should render no feats', async () => {
        creature.feats = [];
        await helper.waitForChangeDetection();

        helper.expectDetails('li.creature-feats > dndgen-details', 'Feats (0)', false);
        expectFeats('li.creature-feats', []);
      });

      describe('demographics', () => {
        const genders = ['Male', 'Female', 'Agender'];

        genders.forEach(gender => {
          it(`should render the gender - ${gender}`, async () => {
            creature.demographics.gender = gender;
            await helper.waitForChangeDetection();

            helper.expectTextContent('li.creature-demographics-gender', `Gender: ${gender}`);
          });
        });

        const ages = [
          { name: 'an age', age: new CreatureMeasurement(45, 'years', 'Adulthood'), expected: 'Age: 45 years (Adulthood)' },
          { name: 'a low age', age: new CreatureMeasurement(0.333, 'years', 'Middle Age'), expected: 'Age: less than 1 years (Middle Age)' },
          { name: 'a fractional age', age: new CreatureMeasurement(298.167, 'years', 'Old'), expected: 'Age: 298 years (Old)' },
          { name: 'an age in the thousands', age: new CreatureMeasurement(1337, 'years', 'Venerable'), expected: 'Age: 1,337 years (Venerable)' },
          { name: 'no age as its description', age: new CreatureMeasurement(0, 'years', 'Ageless'), expected: 'Age: Ageless' },
        ];

        ages.forEach(test => {
          it(`should render ${test.name}`, async () => {
            creature.demographics.age = test.age;
            await helper.waitForChangeDetection();

            helper.expectTextContent('li.creature-demographics-age', test.expected);
          });
        });

        const maximumAges = [
          {
            name: 'a maximum age',
            age: new CreatureMeasurement(45, 'years', 'Adulthood'),
            maximumAge: new CreatureMeasurement(400, 'years', 'Will die of natural causes'),
            expected: 'Maximum Age: 400 years (Will die of natural causes)',
          },
          {
            name: 'a maximum age in the thousands',
            age: new CreatureMeasurement(45, 'years', 'Adulthood'),
            maximumAge: new CreatureMeasurement(1800, 'years', 'Will die of natural causes'),
            expected: 'Maximum Age: 1,800 years (Will die of natural causes)',
          },
          {
            name: 'a maximum age equal to the age',
            age: new CreatureMeasurement(86, 'years', 'Venerable'),
            maximumAge: new CreatureMeasurement(86, 'years', 'Will die of natural causes'),
            expected: 'Maximum Age: 86 years (Will die of natural causes)',
          },
          {
            name: 'a maximum age of -1 as its description',
            age: new CreatureMeasurement(2150.5, 'years', 'Undead'),
            maximumAge: new CreatureMeasurement(-1, 'years', 'Undead'),
            expected: 'Maximum Age: Undead',
          },
          {
            name: 'a maximum age rounded down from the age as its description',
            age: new CreatureMeasurement(3014.833, 'years', 'Undead'),
            maximumAge: new CreatureMeasurement(3014, 'years', 'Undead'),
            expected: 'Maximum Age: Undead',
          },
          {
            name: 'an immortal maximum age as its description',
            age: new CreatureMeasurement(490.583, 'years', 'Adulthood'),
            maximumAge: new CreatureMeasurement(490, 'years', 'Immortal'),
            expected: 'Maximum Age: Immortal',
          },
        ];

        maximumAges.forEach(test => {
          it(`should render ${test.name}`, async () => {
            creature.demographics.age = test.age;
            creature.demographics.maximumAge = test.maximumAge;
            await helper.waitForChangeDetection();

            helper.expectTextContent('li.creature-demographics-maximum-age', test.expected);
          });
        });

        const lengths = [
          { label: 'Height', property: 'height', selector: 'li.creature-demographics-height' },
          { label: 'Length', property: 'length', selector: 'li.creature-demographics-length' },
          { label: 'Wingspan', property: 'wingspan', selector: 'li.creature-demographics-wingspan' },
        ] as const;

        lengths.forEach(line => {
          const values = [
            { name: 'feet and inches', inches: 126, expected: `${line.label}: 10' 6" (Average)` },
            { name: 'whole feet', inches: 72, expected: `${line.label}: 6' (Average)` },
            { name: 'only inches', inches: 8, expected: `${line.label}: 8" (Average)` },
            { name: 'thousands of feet', inches: 12000, expected: `${line.label}: 1,000' (Average)` },
          ];

          values.forEach(test => {
            it(`should render the ${line.property} in ${test.name}`, async () => {
              creature.demographics[line.property] = new CreatureMeasurement(test.inches, 'inches', 'Average');
              await helper.waitForChangeDetection();

              helper.expectTextContent(line.selector, test.expected);
            });
          });

          it(`should show the ${line.property} descriptor`, async () => {
            creature.demographics[line.property] = new CreatureMeasurement(123, 'inches', 'Kinda noticeable');
            await helper.waitForChangeDetection();

            helper.expectTextContent(line.selector, `${line.label}: 10' 3" (Kinda noticeable)`);
          });

          it(`should hide no ${line.property}`, async () => {
            creature.demographics[line.property] = new CreatureMeasurement(0, 'inches', 'Average');
            await helper.waitForChangeDetection();

            helper.expectExists(line.selector, false);
          });
        });

        const weights = [
          { name: 'a weight', weight: new CreatureMeasurement(240, 'pounds', 'Light'), expected: 'Weight: 240 pounds (Light)' },
          { name: 'a fractional weight', weight: new CreatureMeasurement(0.5, 'pounds', 'Very Light'), expected: 'Weight: 0.5 pounds (Very Light)' },
          { name: 'a weight in the thousands', weight: new CreatureMeasurement(1100, 'pounds', 'Average'), expected: 'Weight: 1,100 pounds (Average)' },
          { name: 'a weight in the hundreds of thousands', weight: new CreatureMeasurement(253000, 'pounds', 'Heavy'), expected: 'Weight: 253,000 pounds (Heavy)' },
          { name: 'a weight in the millions', weight: new CreatureMeasurement(20000000, 'pounds', 'Very Heavy'), expected: 'Weight: 20,000,000 pounds (Very Heavy)' },
        ];

        weights.forEach(test => {
          it(`should render ${test.name}`, async () => {
            creature.demographics.weight = test.weight;
            await helper.waitForChangeDetection();

            helper.expectTextContent('li.creature-demographics-weight', test.expected);
          });
        });

        it('should hide no weight', async () => {
          creature.demographics.weight = new CreatureMeasurement(0, 'pounds', 'Average');
          await helper.waitForChangeDetection();

          helper.expectExists('li.creature-demographics-weight', false);
        });

        const descriptions = [
          { label: 'Skin', property: 'skin', selector: 'li.creature-demographics-skin', value: 'Deep ruddy-brown skin' },
          { label: 'Hair', property: 'hair', selector: 'li.creature-demographics-hair', value: 'Black hair' },
          { label: 'Eyes', property: 'eyes', selector: 'li.creature-demographics-eyes', value: 'Red eyes' },
          { label: 'Other', property: 'other', selector: 'li.creature-demographics-other', value: 'Translucent' },
        ] as const;

        descriptions.forEach(line => {
          it(`should render the ${line.property}`, async () => {
            creature.demographics[line.property] = line.value;
            await helper.waitForChangeDetection();

            helper.expectTextContent(line.selector, `${line.label}: ${line.value}`);
          });

          it(`should hide no ${line.property}`, async () => {
            creature.demographics[line.property] = '';
            await helper.waitForChangeDetection();

            helper.expectExists(line.selector, false);
          });
        });

        it('should render every demographic, in order', async () => {
          creature.demographics = new Demographics(
            'Female',
            new CreatureMeasurement(45, 'years', 'Adulthood'),
            new CreatureMeasurement(400, 'years', 'Will die of natural causes'),
            new CreatureMeasurement(126, 'inches', 'Average'),
            new CreatureMeasurement(30, 'inches', 'Average'),
            new CreatureMeasurement(1100, 'pounds', 'Heavy'),
            new CreatureMeasurement(120, 'inches', 'Average'),
            'Deep ruddy-brown skin',
            'Black hair',
            'Red eyes',
            'Translucent',
          );
          await helper.waitForChangeDetection();

          helper.expectTextContents('li.creature-demographics li', [
            'Gender: Female',
            'Age: 45 years (Adulthood)',
            'Maximum Age: 400 years (Will die of natural causes)',
            'Height: 10\' 6" (Average)',
            'Length: 2\' 6" (Average)',
            'Weight: 1,100 pounds (Heavy)',
            'Wingspan: 10\' (Average)',
            'Skin: Deep ruddy-brown skin',
            'Hair: Black hair',
            'Eyes: Red eyes',
            'Other: Translucent',
          ]);
        });

        it('should render only the gender, age, and maximum age when there are no other demographics', async () => {
          creature.demographics = new Demographics('Agender', new CreatureMeasurement(0, 'years', 'Ageless'), new CreatureMeasurement(0, 'years', 'Immortal'));
          await helper.waitForChangeDetection();

          helper.expectTextContents('li.creature-demographics li', [
            'Gender: Agender',
            'Age: Ageless',
            'Maximum Age: Immortal',
          ]);
        });
      });

      it('should render no languages', async () => {
        creature.languages = [];
        await helper.waitForChangeDetection();

        helper.expectDetails('li.creature-languages > dndgen-details', 'Languages (0)', false);
        helper.expectTextContents('li.creature-languages li', []);
      });

      it('should render 1 language', async () => {
        creature.languages = ['Common'];
        await helper.waitForChangeDetection();

        helper.expectDetails('li.creature-languages > dndgen-details', 'Languages (1)', true);
        helper.expectTextContents('li.creature-languages li', ['Common']);
      });

      it('should render no equipment', async () => {
        creature.equipment.weapons = [];
        creature.equipment.armor = null;
        creature.equipment.shield = null;
        creature.equipment.items = [];
        await helper.waitForChangeDetection();

        helper.expectDetails('li.creature-equipment-weapons > dndgen-details', 'Weapons (0)', false);
        helper.expectDetails('li.creature-equipment-armor > dndgen-details', 'Armor: None', false);
        helper.expectDetails('li.creature-equipment-shield > dndgen-details', 'Shield: None', false);
        helper.expectDetails('li.creature-equipment-items > dndgen-details', 'Items (0)', false);
        expectItems('li.creature-equipment', []);
      });

      it('should render 1 weapon and 1 item', async () => {
        creature.equipment.weapons = [creature.equipment.weapons[0]];
        creature.equipment.items = [creature.equipment.items[0]];
        await helper.waitForChangeDetection();

        helper.expectDetails('li.creature-equipment-weapons > dndgen-details', 'Weapons (1)', true);
        expectItems('li.creature-equipment-weapons', creature.equipment.weapons);
        helper.expectDetails('li.creature-equipment-items > dndgen-details', 'Items (1)', true);
        expectItems('li.creature-equipment-items', creature.equipment.items);
      });
    });
  });
});
