import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreatureComponent } from './creature.component';
import { TestHelper } from '../../test-helper';
import { CreatureTestHelper } from '../creature.test-helper';
import { Creature } from '../models/creature.model';
import { By } from '@angular/platform-browser';
import { AttackComponent } from './attack.component';
import { FeatComponent } from '../../character/components/feat.component';
import { SpellGroupComponent } from '../../character/components/spell-group.component';
import { CreatureService } from '../services/creature.service';
import { firstValueFrom } from 'rxjs';
import { Attack } from '../models/attack.model';
import { Feat } from '../../character/models/feat.model';
import { SpellGroup } from '../../character/models/spell-group.model';
import { Spell } from '../../character/models/spell.model';
import { ItemComponent } from '../../treasure/components/item.component';
import { Item } from '../../treasure/models/item.model';
import { CreatureMagic } from '../models/creature-magic.model';
import { CreatureEquipment } from '../models/creature-equipment.model';

describe('Creature Component', () => {
  describe('integration', () => {
    let fixture: ComponentFixture<CreatureComponent>;
    let helper: TestHelper<CreatureComponent>;

    beforeEach(async () => {
      await TestHelper.configureTestBed([CreatureComponent]);

      fixture = TestBed.createComponent(CreatureComponent);
      helper = new TestHelper(fixture);

      fixture.componentRef.setInput('creature', CreatureTestHelper.createMinimalCreature());
    });

    async function render(creature: Creature) {
      fixture.componentRef.setInput('creature', creature);
      await helper.waitForChangeDetection();
    }

    function texts(selector: string): string[] {
      const elements = fixture.nativeElement.querySelectorAll(selector);
      return Array.from(elements).map(e => (e as HTMLElement).textContent!.trim());
    }

    function attacks(selector: string): Attack[] {
      return fixture.debugElement.queryAll(By.css(`${selector} dndgen-attack`))
        .map(e => (e.componentInstance as AttackComponent).attack);
    }

    function feats(selector: string): Feat[] {
      return fixture.debugElement.queryAll(By.css(`${selector} dndgen-feat`))
        .map(e => (e.componentInstance as FeatComponent).feat);
    }

    function items(selector: string): Item[] {
      return fixture.debugElement.queryAll(By.css(`${selector} dndgen-item`))
        .map(e => (e.componentInstance as ItemComponent).item);
    }

    function spellGroups(selector: string): SpellGroup[] {
      return fixture.debugElement.queryAll(By.css(`${selector} dndgen-spell-group`))
        .map(e => (e.componentInstance as SpellGroupComponent).group);
    }

    function headingOf(selector: string): string {
      return texts(`${selector} > dndgen-details .details-header, ${selector} > dndgen-details .no-details-header`)[0];
    }

    function bonus(value: number): string {
      return value >= 0 ? `+${value}` : `${value}`;
    }

    describe('a full creature', () => {
      let creature: Creature;

      beforeEach(async () => {
        creature = CreatureTestHelper.createFullCreature();
        await render(creature);
      });

      it('shows the summary as the heading', () => {
        helper.expectDetails('dndgen-details.creature-header', 'Ghost Hill Giant', true);
      });

      it('shows the size', () => {
        helper.expectTextContent('li.creature-size', 'Size: Large');
      });

      it('shows the type and subtypes', () => {
        helper.expectTextContent('li.creature-type', 'Type: Undead (Incorporeal, Augmented)');
      });

      it('shows the challenge rating', () => {
        helper.expectTextContent('li.creature-cr', 'Challenge Rating: 9');
      });

      it('shows the alignment', () => {
        helper.expectTextContent('li.creature-alignment', 'Alignment: Chaotic Evil');
      });

      it('shows the level adjustment', () => {
        helper.expectTextContent('li.creature-level-adjustment', 'Level Adjustment: +9');
      });

      it('shows the templates in order', () => {
        helper.expectTextContent('li.creature-templates', 'Templates: Ghost, None');
      });

      it('shows the hit points, with conditional bonuses', () => {
        expect(headingOf('li.creature-hit-points')).toEqual('Hit Points: 102');
        expect(texts('li.creature-hit-points li')).toEqual(['Hit Dice: 12d12', '+2 when raging']);
      });

      it('shows the armor class, with conditional bonuses', () => {
        expect(texts('li.creature-combat-ac > span')).toEqual(['Armor Class: 20 *']);
        expect(texts('li.creature-combat-ac li')).toEqual(['Flat-Footed: 21', 'Touch: 8', '+2 against evil']);
      });

      it('shows the initiative bonus', () => {
        helper.expectTextContent('li.creature-combat-initiative', 'Initiative Bonus: -1');
      });

      it('shows the base attack bonus', () => {
        helper.expectTextContent('li.creature-combat-ba', 'Base Attack: +9');
      });

      it('shows the grapple bonus', () => {
        helper.expectTextContent('li.creature-combat-grapple', 'Grapple: +20');
      });

      it('shows the space and reach', () => {
        helper.expectTextContent('li.creature-combat-space', 'Space: 10 feet');
        helper.expectTextContent('li.creature-combat-reach', 'Reach: 10 feet');
      });

      it('shows the speeds', () => {
        expect(texts('li.creature-combat-speeds li')).toEqual([
          'Land: 40 feet per round (Base)',
          'Fly: 30 feet per round (Perfect Maneuverability)',
        ]);
      });

      it('shows the saving throws, with no save as — and conditional bonuses', () => {
        expect(texts('li.creature-combat-saves li')).toEqual(['Fortitude: —', 'Reflex: +3', 'Will: +4 *', '+4 against fear']);
      });

      it('shows the standard attacks', () => {
        expect(headingOf('li.creature-attacks-standard')).toEqual('Attacks');
        expect(attacks('li.creature-attacks-standard')).toEqual([creature.attacks[0]]);
      });

      it('shows the full melee attack', () => {
        expect(headingOf('li.creature-attacks-full-melee')).toEqual('Full Melee Attack');
        expect(attacks('li.creature-attacks-full-melee')).toEqual(creature.fullMeleeAttack);
      });

      it('shows the full ranged attack', () => {
        expect(headingOf('li.creature-attacks-full-ranged')).toEqual('Full Ranged Attack');
        expect(attacks('li.creature-attacks-full-ranged')).toEqual(creature.fullRangedAttack);
      });

      it('shows the special attacks', () => {
        expect(headingOf('li.creature-attacks-special')).toEqual('Special Attacks');
        expect(attacks('li.creature-attacks-special')).toEqual(creature.specialAttacks);
      });

      it('shows the abilities in rules order, with no score as —', () => {
        expect(texts('li.creature-abilities li')).toEqual([
          'Strength: 25 (+7)',
          'Constitution: —',
          'Dexterity: 8 (-1)',
          'Intelligence: 6 (-2)',
          'Wisdom: 10 (+0)',
          'Charisma: 13 (+1)',
        ]);
      });

      it('shows the skills sorted by name', () => {
        expect(headingOf('li.creature-skills')).toEqual('Skills');

        const rows = Array.from(fixture.nativeElement.querySelectorAll('li.creature-skills tbody tr')) as HTMLElement[];
        const cells = rows.map(row => Array.from(row.querySelectorAll('td')).map(td => td.textContent!.trim()));

        expect(cells).toEqual([
          ['', 'Climb', '+9 *', '2', '7', '-3'],
          ['', 'Knowledge (Religion)', '-2', '0', '-2', '0'],
          ['', 'Spot', '+6', '3', '0', '0'],
        ]);

        const classSkillIcons = rows.map(row => row.querySelector('td i.bi-check-lg') != null);
        expect(classSkillIcons).toEqual([true, false, true]);
      });

      it('shows the feats', () => {
        expect(headingOf('li.creature-feats')).toEqual('Feats');
        expect(feats('li.creature-feats')).toEqual(creature.feats);
      });

      it('shows the special qualities', () => {
        expect(headingOf('li.creature-special-qualities')).toEqual('Special Qualities');
        expect(feats('li.creature-special-qualities')).toEqual(creature.specialQualities);
      });

      it('shows the languages', () => {
        expect(headingOf('li.creature-languages')).toEqual('Languages');
        expect(texts('li.creature-languages li')).toEqual(['Giant', 'Common']);
      });

      it('shows the caster', () => {
        expect(headingOf('li.creature-magic')).toEqual('Magic');
        helper.expectTextContent('li.creature-magic-caster', 'Caster: Sorcerer');
        helper.expectTextContent('li.creature-magic-caster-level', 'Caster Level: 3');
      });

      it('shows the domains', () => {
        helper.expectTextContent('li.creature-magic-domains', 'Domains: Air, Good');
      });

      it('shows the arcane spell failure', () => {
        helper.expectTextContent('li.creature-magic-failure', 'Arcane Spell Failure: 15%');
      });

      it('shows the spells per day', () => {
        expect(texts('li.creature-magic-spells-per-day li')).toEqual(['Sorcerer Level 0: 6', 'Sorcerer Level 1: 6 + 1']);
      });

      it('shows the known spells, grouped by source and level', () => {
        expect(spellGroups('li.creature-magic-spells-known')).toEqual([
          new SpellGroup('Sorcerer Level 0', [new Spell({ Sorcerer: 0 }, 'Light')]),
          new SpellGroup('Sorcerer Level 1', [new Spell({ Sorcerer: 1 }, 'Magic Missile')]),
        ]);
      });

      it('shows the prepared spells, grouped by source and level', () => {
        expect(spellGroups('li.creature-magic-spells-prepared')).toEqual([
          new SpellGroup('Sorcerer Level 1', [new Spell({ Sorcerer: 1 }, 'Shield')]),
        ]);
      });

      it('shows the weapons', () => {
        expect(headingOf('li.creature-equipment-weapons')).toEqual('Weapons');
        expect(items('li.creature-equipment-weapons')).toEqual(creature.equipment.weapons);
      });

      it('shows the armor', () => {
        expect(headingOf('li.creature-equipment-armor')).toEqual('Armor');
        expect(items('li.creature-equipment-armor')).toEqual([creature.equipment.armor]);
      });

      it('shows the shield', () => {
        expect(headingOf('li.creature-equipment-shield')).toEqual('Shield');
        expect(items('li.creature-equipment-shield')).toEqual([creature.equipment.shield]);
      });

      it('shows the items', () => {
        expect(headingOf('li.creature-equipment-items')).toEqual('Items');
        expect(items('li.creature-equipment-items')).toEqual(creature.equipment.items);
      });

      it('shows the demographics that have values', () => {
        expect(texts('li.creature-demographics li')).toEqual([
          'Gender: Male',
          'Age: 45 years (Adulthood)',
          'Maximum Age: Immortal',
          'Height: 10\' 6" (Average)',
          'Weight: 1,100 pounds (Heavy)',
          'Skin: Deep ruddy-brown skin',
          'Hair: Black hair',
          'Other: Translucent',
        ]);
      });
    });

    describe('a full creature with one section empty', () => {
      let creature: Creature;

      beforeEach(() => {
        creature = CreatureTestHelper.createFullCreature();
      });

      it('shows no level adjustment as —', async () => {
        creature.levelAdjustment = undefined;
        await render(creature);

        helper.expectTextContent('li.creature-level-adjustment', 'Level Adjustment: —');
      });

      it('shows no templates as None', async () => {
        creature.templates = [];
        await render(creature);

        helper.expectTextContent('li.creature-templates', 'Templates: None');
      });

      it('shows no conditional hit points', async () => {
        creature.hitPoints.conditionalBonuses = [];
        await render(creature);

        expect(texts('li.creature-hit-points li')).toEqual(['Hit Dice: 12d12']);
      });

      it('shows no conditional armor class', async () => {
        creature.armorClass.isConditional = false;
        creature.armorClass.bonuses = [];
        await render(creature);

        expect(texts('li.creature-combat-ac > span')).toEqual(['Armor Class: 20']);
        expect(texts('li.creature-combat-ac li')).toEqual(['Flat-Footed: 21', 'Touch: 8']);
      });

      it('shows no grapple as —', async () => {
        creature.grappleBonus = null;
        await render(creature);

        helper.expectTextContent('li.creature-combat-grapple', 'Grapple: —');
      });

      it('shows no standard attacks as None', async () => {
        creature.attacks = [creature.specialAttacks[0]];
        await render(creature);

        expect(headingOf('li.creature-attacks-standard')).toEqual('Attacks: None');
        expect(attacks('li.creature-attacks-standard')).toEqual([]);
      });

      it('shows no full melee attack as None', async () => {
        creature.fullMeleeAttack = [];
        await render(creature);

        expect(headingOf('li.creature-attacks-full-melee')).toEqual('Full Melee Attack: None');
        expect(attacks('li.creature-attacks-full-melee')).toEqual([]);
      });

      it('shows no full ranged attack as None', async () => {
        creature.fullRangedAttack = [];
        await render(creature);

        expect(headingOf('li.creature-attacks-full-ranged')).toEqual('Full Ranged Attack: None');
        expect(attacks('li.creature-attacks-full-ranged')).toEqual([]);
      });

      it('shows no special attacks as None', async () => {
        creature.specialAttacks = [];
        await render(creature);

        expect(headingOf('li.creature-attacks-special')).toEqual('Special Attacks: None');
        expect(attacks('li.creature-attacks-special')).toEqual([]);
      });

      it('shows no skills as None', async () => {
        creature.skills = [];
        await render(creature);

        expect(headingOf('li.creature-skills')).toEqual('Skills: None');
        helper.expectExists('li.creature-skills tbody tr', false);
      });

      it('shows no feats as None', async () => {
        creature.feats = [];
        await render(creature);

        expect(headingOf('li.creature-feats')).toEqual('Feats: None');
        expect(feats('li.creature-feats')).toEqual([]);
      });

      it('shows no special qualities as None', async () => {
        creature.specialQualities = [];
        await render(creature);

        expect(headingOf('li.creature-special-qualities')).toEqual('Special Qualities: None');
        expect(feats('li.creature-special-qualities')).toEqual([]);
      });

      it('shows no languages as None', async () => {
        creature.languages = [];
        await render(creature);

        expect(headingOf('li.creature-languages')).toEqual('Languages: None');
        expect(texts('li.creature-languages li')).toEqual([]);
      });

      it('shows no magic as None', async () => {
        creature.magic = new CreatureMagic();
        await render(creature);

        expect(headingOf('li.creature-magic')).toEqual('Magic: None');
      });

      it('shows a caster with no domains, spell failure, or spells', async () => {
        creature.magic = new CreatureMagic('Sorcerer', 3);
        await render(creature);

        expect(texts('li.creature-magic li')).toEqual(['Caster: Sorcerer', 'Caster Level: 3']);
      });

      it('shows no weapons as None', async () => {
        creature.equipment.weapons = [];
        await render(creature);

        expect(headingOf('li.creature-equipment-weapons')).toEqual('Weapons: None');
        expect(items('li.creature-equipment-weapons')).toEqual([]);
      });

      it('shows no armor as None', async () => {
        creature.equipment.armor = null;
        await render(creature);

        expect(headingOf('li.creature-equipment-armor')).toEqual('Armor: None');
        expect(items('li.creature-equipment-armor')).toEqual([]);
      });

      it('shows no shield as None', async () => {
        creature.equipment.shield = null;
        await render(creature);

        expect(headingOf('li.creature-equipment-shield')).toEqual('Shield: None');
        expect(items('li.creature-equipment-shield')).toEqual([]);
      });

      it('shows no items as None', async () => {
        creature.equipment.items = [];
        await render(creature);

        expect(headingOf('li.creature-equipment-items')).toEqual('Items: None');
        expect(items('li.creature-equipment-items')).toEqual([]);
      });

      it('shows no equipment as None', async () => {
        creature.equipment = new CreatureEquipment();
        await render(creature);

        expect([
          headingOf('li.creature-equipment-weapons'),
          headingOf('li.creature-equipment-armor'),
          headingOf('li.creature-equipment-shield'),
          headingOf('li.creature-equipment-items'),
        ]).toEqual(['Weapons: None', 'Armor: None', 'Shield: None', 'Items: None']);
        expect(items('li.creature-equipment')).toEqual([]);
      });

      it('shows only the demographics that have values', async () => {
        await render(CreatureTestHelper.createMinimalCreature());

        expect(texts('li.creature-demographics li')).toEqual([
          'Gender: Agender',
          'Age: Ageless',
          'Maximum Age: Immortal',
        ]);
      });
    });

    describe('generated creatures', () => {
      const generatedCreatures = [
        { name: 'Human', templates: [], expectedTemplates: 'None' },
        { name: 'Human', templates: ['Ghost'], expectedTemplates: 'Ghost' },
        { name: 'Couatl', templates: [], expectedTemplates: 'None' },
        { name: 'Hill Giant', templates: [], expectedTemplates: 'None' },
        { name: 'Red Dragon, Adult', templates: ['Half-Fiend'], expectedTemplates: 'Half-Fiend' },
        { name: 'Shrieker', templates: [], expectedTemplates: 'None' },
      ];

      generatedCreatures.forEach(test => {
        it(`shows a generated ${[...test.templates, test.name].join(' ')}`, async () => {
          const creature = await firstValueFrom(TestBed.inject(CreatureService).generateCreature(test.name, test.templates));

          await render(creature);

          helper.expectDetails('dndgen-details.creature-header', creature.summary, true);
          helper.expectTextContent('li.creature-cr', `Challenge Rating: ${creature.challengeRating}`);
          helper.expectTextContent('li.creature-templates', `Templates: ${test.expectedTemplates}`);
          expect(texts('li.creature-abilities li')).toEqual(['Strength', 'Constitution', 'Dexterity', 'Intelligence', 'Wisdom', 'Charisma']
            .map(name => creature.abilities[name])
            .map(ability => ability.hasScore ? `${ability.name}: ${ability.fullScore} (${bonus(ability.modifier)})` : `${ability.name}: —`));
          expect(texts('li.creature-combat-saves li:not(.creature-combat-saves-conditional)')).toEqual(['Fortitude', 'Reflex', 'Will']
            .map(name => creature.saves[name].hasSave ? `${name}: ${bonus(creature.saves[name].totalBonus)}${creature.saves[name].isConditional ? ' *' : ''}` : `${name}: —`));
          expect(attacks('li.creature-attacks-full-melee')).toEqual(creature.fullMeleeAttack);
          expect(attacks('li.creature-attacks-full-ranged')).toEqual(creature.fullRangedAttack);
          expect(attacks('li.creature-attacks-special')).toEqual(creature.specialAttacks);
          expect(feats('li.creature-feats')).toEqual(creature.feats);
          expect(feats('li.creature-special-qualities')).toEqual(creature.specialQualities);
        });
      });

      it('shows a generated Shrieker with no Strength, Dexterity, Intelligence, or Reflex save', async () => {
        const creature = await firstValueFrom(TestBed.inject(CreatureService).generateCreature('Shrieker', []));

        await render(creature);

        const abilities = texts('li.creature-abilities li');
        expect([abilities[0], abilities[2], abilities[3]]).toEqual(['Strength: —', 'Dexterity: —', 'Intelligence: —']);
        expect(texts('li.creature-combat-saves li')[1]).toEqual('Reflex: —');
      });

      it('shows a generated Ghost Human with no Constitution or Fortitude save', async () => {
        const creature = await firstValueFrom(TestBed.inject(CreatureService).generateCreature('Human', ['Ghost']));

        await render(creature);

        expect(texts('li.creature-abilities li')[1]).toEqual('Constitution: —');
        expect(texts('li.creature-combat-saves li')[0]).toEqual('Fortitude: —');
      });

      it('shows a generated creature with no level adjustment as —', async () => {
        const creature = await firstValueFrom(TestBed.inject(CreatureService).generateCreature('Bat', []));
        expect('levelAdjustment' in creature).toBe(false);

        await render(creature);

        helper.expectTextContent('li.creature-level-adjustment', 'Level Adjustment: —');
      });

      it('shows a generated Couatl with magic', async () => {
        const creature = await firstValueFrom(TestBed.inject(CreatureService).generateCreature('Couatl', []));

        await render(creature);

        expect(headingOf('li.creature-magic')).toEqual('Magic');
        helper.expectTextContent('li.creature-magic-caster', `Caster: ${creature.magic.caster}`);
        helper.expectTextContent('li.creature-magic-caster-level', `Caster Level: ${creature.magic.casterLevel}`);
        expect(texts('li.creature-magic-spells-per-day li')).toEqual(creature.magic.spellsPerDay
          .map(q => `${q.source} Level ${q.level}: ${q.quantity + q.bonusSpells}${q.hasDomainSpell ? ' + 1' : ''}`));
        expect(spellGroups('li.creature-magic-spells-known').flatMap(g => g.spells.map(s => s.name)).sort())
          .toEqual(creature.magic.knownSpells.map(s => s.name).sort());
      });

      it('shows a generated Hill Giant with its equipment', async () => {
        const creature = await firstValueFrom(TestBed.inject(CreatureService).generateCreature('Hill Giant', []));
        expect(creature.equipment.weapons.length).toBeGreaterThan(0);

        await render(creature);

        expect(items('li.creature-equipment-weapons')).toEqual(creature.equipment.weapons);
        expect(items('li.creature-equipment-armor')).toEqual(creature.equipment.armor ? [creature.equipment.armor] : []);
        expect(items('li.creature-equipment-shield')).toEqual(creature.equipment.shield ? [creature.equipment.shield] : []);
        expect(items('li.creature-equipment-items')).toEqual(creature.equipment.items);
      });
    });
  });
});
